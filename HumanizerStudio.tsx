import React, { useState, useMemo, useRef } from 'react';
import { 
  Zap, ArrowRight, ShieldCheck, Check, Copy, Download, Volume2, 
  VolumeX, RefreshCw, AlertCircle, FileText, Sparkles, UserCheck, 
  HelpCircle, ChevronDown, ChevronUp, SlidersHorizontal, Award
} from 'lucide-react';
import { 
  HumanizerVoice, 
  HumanizeResponse, 
  HumanizerAuditResult 
} from '../types';
import { 
  auditTextWithBladerProtocol, 
  HUMANIZER_SECTIONS 
} from '../lib/humanizerEngine';

interface HumanizerStudioProps {
  onOpenGuide: () => void;
  initialText?: string;
  onSendToReviewGenerator?: (text: string) => void;
}

const PRESET_EXAMPLES = [
  {
    label: 'Recensione AI con Elenchi e Cliché',
    text: `Nel mondo frenetico di oggi, trovare un gadget affidabile è una vera sfida. Quando si tratta di cuffie wireless, le SoundPro 500 sono un autentico game-changer. Non è solo un paio di auricolari, è una vera esperienza sonora.\n\nEcco le caratteristiche principali:\n- **Autonomia Eccezionale**: Fino a 30 ore di riproduzione continua.\n- **Design Ergonomico**: Veloce, leggero e versatile per qualsiasi orecchio.\n- **Cancellazione del Rumore**: Senza soluzione di continuità e allo stato dell'arte.\n\nGli esperti concordano che questo dispositivo parli a una verità più profonda sull'innovazione. In conclusione, tirando le somme, si tratta di un prodotto rivoluzionario che non deluderà le vostre aspettative. Cosa ne pensi? Faccelo sapere nei commenti!`,
  },
  {
    label: 'Bozza con Staging e Throat-Clearing',
    text: `In un'epoca in cui la tecnologia corre veloce, vale la pena notare che la produttività personale è diventata cruciale. Siamo onesti: organizzare la propria scrivania fa la differenza tra il successo e il disastro.\n\nInoltre, questo organizer da tavolo offre prestazioni incredibili. Si può notare che la scocca è robusta, elegante e compatta — un vero must-have per chiunque lavori da remoto. Peraltro, studi dimostrano ampiamente che l'ordine mentale riflette lo spazio circostante.\n\nIn definitiva, un acquisto che ridefinisce gli standard dell'arredo per ufficio.`,
  },
  {
    label: 'Testo Spontaneo Umano (Baseline)',
    text: `Ho comprato questa lampada da scrivania tre mesi fa perché la vecchia lampada alogena scaldava troppo. Ha una base pesante che non dondola quando urto il tavolo e il braccio si piega esattamente all'angolazione desiderata senza perdere la posizione dopo mezz'ora. La temperatura colore neutra non mi stanca gli occhi durante le sessioni serali. L'unico difetto è il tasto a sfioramento che ogni tanto non prende al primo colpo se ho le dita un po' fredde, ma per trenta euro la ricomprerei subito.`,
  },
];

export const HumanizerStudio: React.FC<HumanizerStudioProps> = ({
  onOpenGuide,
  initialText = '',
  onSendToReviewGenerator,
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [voice, setVoice] = useState<HumanizerVoice>('personal');
  const [customSample, setCustomSample] = useState('');
  const [intensity, setIntensity] = useState<'standard' | 'radical'>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [humanizeResult, setHumanizeResult] = useState<HumanizeResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSampleInput, setShowSampleInput] = useState(false);
  const [activeView, setActiveView] = useState<'side-by-side' | 'humanized'>('side-by-side');
  const [showTellsBreakdown, setShowTellsBreakdown] = useState(false);

  // Live real-time audit of whatever is in the input box
  const liveAudit: HumanizerAuditResult = useMemo(() => {
    return auditTextWithBladerProtocol(inputText);
  }, [inputText]);

  const humanizeAbortControllerRef = useRef<AbortController | null>(null);

  const handleCancelHumanize = () => {
    if (humanizeAbortControllerRef.current) {
      humanizeAbortControllerRef.current.abort();
      humanizeAbortControllerRef.current = null;
    }
    setIsLoading(false);
    setErrorMessage('Umanizzazione interrotta su richiesta.');
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Inserisci o incolla del testo prima di avviare l\'umanizzazione.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    if (humanizeAbortControllerRef.current) {
      humanizeAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    humanizeAbortControllerRef.current = controller;
    // Server-side retry tries up to 4 models at ~7.5s each (worst case ~30s),
    // so the client timeout must stay comfortably above that.
    const timeoutId = setTimeout(() => controller.abort(), 34000);

    try {
      const res = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          text: inputText,
          voice,
          customSample: voice === 'sample' ? customSample : undefined,
          intensity,
          preserveFactsStrict: true,
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Errore HTTP ${res.status}`);
      }

      const data: HumanizeResponse = await res.json();
      setHumanizeResult(data);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setErrorMessage('Tempo di elaborazione scaduto o interrotto. Riprova: il motore locale istantaneo completerà l\'operazione senza attese.');
      } else {
        console.error('Humanize error:', err);
        setErrorMessage(err.message || 'Si è verificato un errore durante l\'umanizzazione. Riprova tra poco.');
      }
    } finally {
      clearTimeout(timeoutId);
      humanizeAbortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Testo-Umanizzato-Blader-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectPreset = (presetText: string) => {
    setInputText(presetText);
    setHumanizeResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Banner with Taste-Skill Typography */}
      <section className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-9 shadow-xs space-y-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Blader Humanizer Protocol • 25 Tells • 5 Sezioni</span>
          </div>

          <button
            onClick={onOpenGuide}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Guida ai 25 Tells</span>
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
          Studio di <span className="text-indigo-600">Umanizzazione del Testo</span>
        </h2>

        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          Incolla qualsiasi testo, bozza generata da LLM, articolo o recensione. Il protocollo rimuove i 25 schemi stilistici artificiali (staging, puffery, triadi meccaniche, elenchi forzati, residui di chat) riscrivendo il contenuto con autentica voce umana, senza alterare i fatti né inventare dati.
        </p>

        {/* Preset Pills */}
        <div className="pt-2 space-y-2">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Carica un esempio di prova:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_EXAMPLES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset.text)}
                className="px-3.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-medium transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Input & Configuration Section */}
      <section className="bg-stone-100/60 border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-900 font-bold ml-3 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Text Input Area with Live Tell Badge */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Testo da Umanizzare</span>
            </label>

            {/* Live Tells Indicator */}
            <div className="flex items-center space-x-2">
              <span className={`text-[11px] px-3 py-1 rounded-full font-bold border transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                liveAudit.isHumanLike
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {liveAudit.isHumanLike ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Autenticità Live: {liveAudit.score}% (Umano)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Rilevati {liveAudit.tellsCount} Tell AI ({liveAudit.score}%)</span>
                  </>
                )}
              </span>

              {liveAudit.tellsCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowTellsBreakdown(!showTellsBreakdown)}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-white cursor-pointer"
                >
                  {showTellsBreakdown ? 'Nascondi Tells' : 'Vedi Tells'}
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Incolla qui il testo generato dall'AI o da perfezionare (recensione, articolo, email, descrizione)..."
            className="w-full p-4 bg-white border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans leading-relaxed"
          />

          <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
            <span>{inputText.length} caratteri • {inputText.split(/\s+/).filter(Boolean).length} parole</span>
            <span>Zero elenchi puntati • Fatti e numeri preservati alla lettera</span>
          </div>

          {/* Expandable Live Tells Breakdown */}
          {showTellsBreakdown && liveAudit.tells.length > 0 && (
            <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-2.5 shadow-2xs animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-xs font-bold text-stone-900">
                  Pattern AI rilevati in tempo reale ({liveAudit.tells.length}):
                </span>
                <span className="text-[10px] text-stone-500">
                  Saranno tutti neutralizzati dall'algoritmo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {liveAudit.tells.map((tell, tIdx) => (
                  <div key={tIdx} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800">
                        {tell.patternName}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                        {tell.section}
                      </span>
                    </div>
                    {tell.detectedText && (
                      <p className="text-stone-600 font-mono text-[10px] bg-white p-1 rounded border border-stone-200/80">
                        "{tell.detectedText}"
                      </p>
                    )}
                    <p className="text-stone-500 text-[10px]">
                      {tell.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Humanizer Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200/80">
          
          {/* Voice Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Timbro Vocale Umano</span>
            </label>

            <select
              value={voice}
              onChange={(e) => {
                const val = e.target.value as HumanizerVoice;
                setVoice(val);
                setShowSampleInput(val === 'sample');
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="personal">👤 Voce Personale (1a persona, aneddoti, reazioni vive)</option>
              <option value="editorial">📰 Editoriale / Saggio (Cadenza colta, misurata, penetrante)</option>
              <option value="technical">⚙️ Tecnico / Diretto (Neutro, asciutto, zero fronzoli)</option>
              <option value="conversational">☕ Conversazionale (Colloquiale, caldo, rilassato)</option>
              <option value="sample">✍️ Campione di Scrittura ("Match My Sample")</option>
            </select>
          </div>

          {/* Intensity Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              <span>Intensità Ristrutturazione</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIntensity('standard')}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                  intensity === 'standard'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                Standard (Conserva struttura)
              </button>

              <button
                type="button"
                onClick={() => setIntensity('radical')}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                  intensity === 'radical'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                Radicale (Nuovo ritmo)
              </button>
            </div>
          </div>

        </div>

        {/* Optional Custom Sample Input for "Match My Sample" */}
        {showSampleInput && (
          <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-2 shadow-2xs animate-fade-in">
            <label className="text-xs font-bold text-stone-900 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Campione del Tuo Stile di Scrittura (2-4 frasi):</span>
            </label>
            <textarea
              rows={3}
              value={customSample}
              onChange={(e) => setCustomSample(e.target.value)}
              placeholder="Incolla un breve estratto scritto realmente da te: l'algoritmo analizzerà la lunghezza media delle frasi, il registro lessicale e la punteggiatura per replicarli fedelmente..."
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        )}

        {/* Submit Action Button with 2:1 Proportion */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Garanzia: Zero elenchi puntati • Fatti, numeri e date custoditi al 100%</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {isLoading && (
              <button
                type="button"
                onClick={handleCancelHumanize}
                className="px-4 py-3.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                Annulla
              </button>
            )}

            <button
              type="button"
              onClick={handleHumanize}
              disabled={isLoading || !inputText.trim()}
              className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Umanizzazione rapida in corso...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Umanizza Testo con Blader Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </section>

      {/* Output Results Section */}
      {humanizeResult && (
        <section className="bg-stone-100/60 border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
          
          {/* Results Header with Score Delta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Testo Umanizzato con Successo</span>
                </span>

                {humanizeResult.isFallback && (
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200 text-[10px] font-bold">
                    Algoritmo Locale Autonomo
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-2">
                Risultato del Protocollo Blader Humanizer
              </h3>
            </div>

            {/* View switcher */}
            <div className="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-stone-200 self-start sm:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveView('side-by-side')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeView === 'side-by-side'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Confronto Affiancato
              </button>
              <button
                type="button"
                onClick={() => setActiveView('humanized')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeView === 'humanized'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Solo Umanizzato
              </button>
            </div>
          </div>

          {/* Score & Tell Reduction Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Punteggio Autenticità
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl sm:text-2xl font-black text-stone-900">
                  {humanizeResult.auditAfter.score}%
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  (+{Math.max(0, humanizeResult.auditAfter.score - humanizeResult.auditBefore.score)}%)
                </span>
              </div>
              <span className="text-[10px] text-stone-500 block">
                Prima: {humanizeResult.auditBefore.score}%
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Tell AI Neutralizzati
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl sm:text-2xl font-black text-emerald-600">
                  {humanizeResult.tellsRemovedCount}
                </span>
                <span className="text-xs font-medium text-stone-400">su 25</span>
              </div>
              <span className="text-[10px] text-stone-500 block">
                Tutti i pattern risolti
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Conteggio Parole
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl sm:text-2xl font-black text-stone-900">
                  {humanizeResult.wordCountAfter}
                </span>
                <span className="text-xs text-stone-500">parole</span>
              </div>
              <span className="text-[10px] text-stone-500 block">
                Originale: {humanizeResult.wordCountBefore}
              </span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Integrità dei Fatti
              </span>
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-sm sm:text-base pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Preservati</span>
              </div>
              <span className="text-[10px] text-stone-500 block">
                Nessun dato inventato
              </span>
            </div>

          </div>

          {/* List of Neutralized Tells Pills */}
          {humanizeResult.removedTellsSummary && humanizeResult.removedTellsSummary.length > 0 && (
            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Interventi del Protocollo applicati con successo:
              </span>
              <div className="flex flex-wrap gap-2">
                {humanizeResult.removedTellsSummary.map((item, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center space-x-1.5 whitespace-nowrap"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Body or Single View */}
          {activeView === 'side-by-side' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Original Box */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-600">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Testo Originale (con Tell AI)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                    Autenticità: {humanizeResult.auditBefore.score}%
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-2">
                  {humanizeResult.originalText}
                </div>
              </div>

              {/* Humanized Box */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-200/90 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-900">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Testo Umanizzato (Blader Engine)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    Autenticità: {humanizeResult.auditAfter.score}%
                  </span>
                </div>

                <article className="font-serif text-sm sm:text-base text-stone-900 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-2">
                  {humanizeResult.humanizedText}
                </article>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                    Testo Finale Umanizzato
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  Punteggio: {humanizeResult.auditAfter.score}/100
                </span>
              </div>

              <article className="font-serif text-base sm:text-lg text-stone-900 leading-relaxed max-w-2xl whitespace-pre-wrap">
                {humanizeResult.humanizedText}
              </article>
            </div>
          )}

          {/* Action Toolbar for the Humanized Output */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2.5">
              
              {/* Copy Button */}
              <button
                type="button"
                onClick={() => handleCopy(humanizeResult.humanizedText)}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-xs whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copiato negli appunti!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copia Testo Umanizzato</span>
                  </>
                )}
              </button>

              {/* Download .txt */}
              <button
                type="button"
                onClick={() => handleDownload(humanizeResult.humanizedText)}
                className="p-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                title="Scarica file di testo (.txt)"
              >
                <Download className="w-4 h-4 text-indigo-600" />
              </button>

              {/* Speech synthesis */}
              {'speechSynthesis' in window && (
                <button
                  type="button"
                  onClick={() => handleSpeech(humanizeResult.humanizedText)}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 shadow-2xs'
                  }`}
                  title="Ascolta la lettura vocale del testo umanizzato"
                >
                  {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
                </button>
              )}

            </div>

            {/* Optional Transfer to Review Customizer if it is a review */}
            {onSendToReviewGenerator && (
              <button
                type="button"
                onClick={() => onSendToReviewGenerator(humanizeResult.humanizedText)}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 whitespace-nowrap"
              >
                <span>Usa come Recensione nel Generatore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

          </div>

        </section>
      )}

    </div>
  );
};
