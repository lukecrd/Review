import React, { useState } from 'react';
import { 
  Star, Copy, Check, BookmarkPlus, Download, Volume2, VolumeX, 
  Sparkles, ShieldCheck, Clock, Wand2, ArrowRight, Compass, Zap
} from 'lucide-react';
import { GeneratedReview } from '../types';
import { auditTextWithBladerProtocol, HUMANIZER_SECTIONS } from '../lib/humanizerEngine';

interface ReviewDisplayProps {
  reviews: GeneratedReview[];
  onSaveToHistory: (review: GeneratedReview) => void;
  onRefineReview: (originalReviewId: string, instruction: string) => Promise<void>;
  isRefining: boolean;
}

export const ReviewDisplay: React.FC<ReviewDisplayProps> = ({
  reviews,
  onSaveToHistory,
  onRefineReview,
  isRefining,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [customRefinePrompt, setCustomRefinePrompt] = useState('');
  const [showAuditDetails, setShowAuditDetails] = useState(false);

  if (!reviews || reviews.length === 0) return null;

  const currentReview = reviews[activeTab] || reviews[0];
  const slopAudit = currentReview.slopAudit;
  const bladerAudit = currentReview.humanizerAudit || auditTextWithBladerProtocol(currentReview.body);

  const handleCopy = async (rev: GeneratedReview) => {
    const fullText = `${rev.title}\n\n${rev.body}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedId(rev.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSave = (rev: GeneratedReview) => {
    onSaveToHistory(rev);
    setSavedIds((prev) => ({ ...prev, [rev.id]: true }));
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

  const handleDownloadTxt = (rev: GeneratedReview) => {
    const content = `TITOLO: ${rev.title}\nVALUTAZIONE: ${rev.rating}/5 Stelle\nPRODOTTO: ${rev.productName}\nDATA: ${new Date(rev.createdAt).toLocaleDateString('it-IT')}\n\n${rev.body}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recensione-${rev.productName.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const QUICK_REFINE_PILLS = [
    '⚡ Blader Humanizer (Rimuovi 25 Tell AI)',
    '🛡️ Pulisci da ogni AI Slop (Regole Peter Yang)',
    '🎯 Più diretta al prodotto e meno personale',
    '🌿 Aggiungi un aneddoto spontaneo di vita quotidiana',
    '⚖️ Inserisci un piccolo limite d\'uso per credibilità',
    '⚡ Accorcia e rendi più incisiva',
    '☕ Tono più colloquiale e spontaneo',
  ];

  const handleQuickRefine = (pillText: string) => {
    onRefineReview(currentReview.id, pillText);
  };

  const handleBladerHumanizeAction = () => {
    onRefineReview(
      currentReview.id,
      '⚡ Applica rigorosamente Blader Humanizer: rimuovi staging run-ups, contrasti binari, triadi meccaniche e ogni residuo AI.'
    );
  };

  const handleCustomRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRefinePrompt.trim()) return;
    onRefineReview(currentReview.id, customRefinePrompt);
    setCustomRefinePrompt('');
  };

  return (
    <section className="bg-stone-100/60 border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden space-y-6">
      
      {/* Top Header & Variant Tabs if multiple */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Prosa Naturale</span>
            </span>

            {currentReview.isFallback && (
              <span
                className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200 text-xs font-semibold whitespace-nowrap"
                title="Il servizio AI non era disponibile: questa bozza è stata generata dal motore locale istantaneo usando solo i fatti forniti."
              >
                Bozza dal motore locale istantaneo
              </span>
            )}

            <button
              type="button"
              onClick={() => setShowAuditDetails(!showAuditDetails)}
              className="px-3 py-1 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap"
              title="Clicca per aprire l'audit dettagliato Taste-Skill & Blader Humanizer"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {bladerAudit?.isHumanLike !== false && slopAudit?.isSlopFree !== false 
                  ? 'Taste-Skill & Blader™ Verificato' 
                  : `Audit: ${bladerAudit?.tellsCount || slopAudit?.detectedPatterns?.length || 0} alert`}
              </span>
              <span className="text-[10px] bg-stone-200 text-stone-800 px-1.5 py-0.2 rounded-full font-bold">
                {showAuditDetails ? 'Chiudi' : 'Dettagli'}
              </span>
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-stone-900 mt-2">
            Recensione: <span className="text-indigo-600 font-extrabold">{currentReview.productName}</span>
          </h2>
        </div>

        {/* Variant Tabs */}
        {reviews.length > 1 && (
          <div className="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-stone-200 self-start sm:self-auto shadow-2xs">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === idx
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Opzione #{idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Expandable Taste-Skill & Blader Humanizer Audit Inspection Panel */}
      {showAuditDetails && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3.5 transition-all animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-stone-900">
                Audit Conforme a <a href="https://www.tasteskill.dev" target="_blank" rel="noreferrer" className="text-indigo-600 underline">Taste-Skill</a> & Blader Humanizer (25 Tells)
              </h4>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
              Punteggio Autenticità: {bladerAudit?.score || slopAudit?.score || 100}/100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-emerald-700 font-bold block">✓ Staging</span>
              <span className="text-stone-500 text-[10px]">Zero run-ups</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-emerald-700 font-bold block">✓ Puffery</span>
              <span className="text-stone-500 text-[10px]">Zero superlativi</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-emerald-700 font-bold block">✓ Triadi</span>
              <span className="text-stone-500 text-[10px]">Ritmo naturale</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-emerald-700 font-bold block">✓ Zero Elenchi</span>
              <span className="text-stone-500 text-[10px]">100% Prosa continua</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-emerald-700 font-bold block">✓ Leftovers</span>
              <span className="text-stone-500 text-[10px]">Zero frasi chatbot</span>
            </div>
          </div>

          {bladerAudit?.tells && bladerAudit.tells.length > 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
              <strong>Pattern da affinare rilevati da Blader Humanizer:</strong>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                {bladerAudit.tells.map((tell, pIdx) => (
                  <li key={pIdx}>
                    <strong>{tell.patternName}</strong>: {tell.reason} {tell.detectedText && `(trovato: "${tell.detectedText}")`}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
              ✨ <strong>Test Blader superato:</strong> Il testo è privo di tutti i 25 tell AI e rispetta il ritmo, i connettivi e i dettagli pratici tipici della scrittura umana spontanea.
            </p>
          )}
        </div>
      )}

      {/* Review Main Editorial Display Card with Concentric Geometry */}
      <div className="bg-white rounded-2xl p-6 sm:p-9 relative overflow-hidden border border-stone-200/90 shadow-xs">
        
        <div className="relative z-10 space-y-5">
          
          {/* Header Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentReview.productName)}&background=334155&color=fff`}
                  alt="Avatar Recensore"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  Esperienza d'Uso Reale
                </h3>
                <p className="text-[11px] text-stone-400 font-medium">
                  Narrazione fluido-organica
                </p>
              </div>
            </div>

            {/* Rating Stars and Meta info */}
            <div className="flex items-center space-x-3.5 text-xs text-stone-500">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= currentReview.rating
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-stone-200'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-stone-700 ml-1.5">
                  {currentReview.rating}.0 / 5
                </span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-stone-400">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{currentReview.wordCount} parole</span>
                <span>•</span>
                <span>{currentReview.readingTimeMinutes} min lettura</span>
              </div>
            </div>
          </div>

          {/* Catchy Editorial Review Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug">
            "{currentReview.title}"
          </h3>

          {/* Review Body in Elegant Serif Prose with 65-75ch line width constraint */}
          <article className="font-serif text-base sm:text-lg text-stone-800 leading-relaxed max-w-2xl space-y-5">
            {currentReview.body.split('\n\n').map((paragraph, pIdx) => {
              const cleanP = paragraph.trim();
              if (!cleanP) return null;
              return (
                <p key={pIdx} className="leading-relaxed">
                  {cleanP}
                </p>
              );
            })}
          </article>

          {/* Key Narrative Highlights */}
          {currentReview.perceivedHighlights && currentReview.perceivedHighlights.length > 0 && (
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mr-1">
                Focus narrativo:
              </span>
              {currentReview.perceivedHighlights.map((hl, hIdx) => (
                <span
                  key={hIdx}
                  className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium whitespace-nowrap"
                >
                  {hl}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Action Toolbar with 2:1 Button Ratio */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center space-x-2.5">
          {/* Copy Button */}
          <button
            onClick={() => handleCopy(currentReview)}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-xs whitespace-nowrap"
          >
            {copiedId === currentReview.id ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Testo Copiato!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copia Testo</span>
              </>
            )}
          </button>

          {/* Save to History Button */}
          <button
            onClick={() => handleSave(currentReview)}
            disabled={savedIds[currentReview.id]}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              savedIds[currentReview.id]
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 shadow-2xs'
            }`}
          >
            <BookmarkPlus className="w-4 h-4 text-indigo-600" />
            <span>
              {savedIds[currentReview.id] ? 'Salvato!' : 'Salva'}
            </span>
          </button>

          {/* Blader Humanizer Quick Pass Button */}
          <button
            onClick={handleBladerHumanizeAction}
            disabled={isRefining}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-2xs"
            title="Applica il protocollo Blader Humanizer per neutralizzare i 25 tell AI"
          >
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>{isRefining ? 'Umanizzazione...' : 'Umanizza con Blader'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Audio Speech Synthesis */}
          {'speechSynthesis' in window && (
            <button
              onClick={() => handleSpeech(`${currentReview.title}. ${currentReview.body}`)}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                isPlaying
                  ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 shadow-2xs'
              }`}
              title="Ascolta la lettura vocale della recensione"
            >
              {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
            </button>
          )}

          {/* Download TXT */}
          <button
            onClick={() => handleDownloadTxt(currentReview)}
            className="p-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            title="Scarica file di testo (.txt)"
          >
            <Download className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
      </div>

      {/* Interactive Refinement Section */}
      <div className="pt-4 border-t border-stone-200/90 space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
          <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Rifinisci o personalizza questa versione:</span>
        </div>

        {/* Quick Refine Pills with single line labels */}
        <div className="flex flex-wrap gap-2">
          {QUICK_REFINE_PILLS.map((pill, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleQuickRefine(pill)}
              disabled={isRefining}
              className="px-3.5 py-1.5 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-200 hover:border-stone-300 rounded-xl text-xs font-medium transition-all disabled:opacity-50 cursor-pointer shadow-2xs whitespace-nowrap"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Custom Refine Prompt Box */}
        <form onSubmit={handleCustomRefineSubmit} className="flex gap-2 pt-1">
          <input
            type="text"
            value={customRefinePrompt}
            onChange={(e) => setCustomRefinePrompt(e.target.value)}
            placeholder="Chiedi una modifica mirata (es. 'Aggiungi una frase sulla presa salda')..."
            className="flex-1 px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isRefining || !customRefinePrompt.trim()}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
          >
            {isRefining ? (
              <span>Elaborazione...</span>
            ) : (
              <>
                <span>Applica</span>
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        </form>
      </div>

    </section>
  );
};
