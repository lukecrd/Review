import React from 'react';
import { Star, Sliders, MessageSquare, Clock, User, AlignLeft, Globe, Layers, Sparkles, Compass, Check, Target, Package } from 'lucide-react';
import { ReviewOptions, ReviewTone, ReviewLength, TasteSkillPreset, ReviewFocusAspect } from '../types';

interface ReviewCustomizerProps {
  options: ReviewOptions;
  onChangeOptions: (newOptions: ReviewOptions) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const TASTE_PRESETS: Array<{
  id: TasteSkillPreset;
  title: string;
  subtitle: string;
  tag: string;
}> = [
  {
    id: 'editorial',
    title: 'Editorial Sincero',
    subtitle: 'Prosa elegante, riflessioni ponderate e cadenza naturale da rivista specializzata.',
    tag: 'Consigliato',
  },
  {
    id: 'tactile',
    title: 'Minimalista & Tattile',
    subtitle: 'Focus su materiali, sensazioni fisiche al tatto, ergonomia e impatto visivo quotidiano.',
    tag: 'Design First',
  },
  {
    id: 'direct',
    title: 'Test sul Campo',
    subtitle: 'Pragmatico, incentrato su resa effettiva, autonomia e convenienza reale.',
    tag: 'Senza Filtri',
  },
  {
    id: 'storytelling',
    title: 'Diario d\'Uso Reale',
    subtitle: 'Narrazione in prima persona, aneddoti spontanei di routine ed empatia umana.',
    tag: 'Narrativo',
  },
];

const FOCUS_ASPECTS: Array<{
  id: ReviewFocusAspect;
  label: string;
  desc: string;
}> = [
  { id: 'bilanciato', label: '🌟 Bilanciato Completo', desc: 'Analisi equilibrata di prestazioni, materiali e vita di tutti i giorni' },
  { id: 'prestazioni', label: '⚡ Resa & Prova Pratica', desc: 'Focus su reattività, velocità, precisione ed efficacia operativa' },
  { id: 'ergonomia', label: '🎒 Materiali, Tatto & Ingombro', desc: 'Focus su materiali, finiture, rumorosità e spazio occupato' },
  { id: 'durata_manutenzione', label: '⏳ Manutenzione & Longevità', desc: 'Focus su pulizia, cicli di manutenzione e tenuta nel tempo' },
];

const TONES: Array<{
  id: ReviewTone;
  label: string;
  icon: string;
  desc: string;
}> = [
  { id: 'equilibrato', label: 'Equilibrato & Onesto', icon: '⚖️', desc: 'Bilanciato, credibile, esalta i pregi e sfiora piccoli limiti.' },
  { id: 'diretto', label: 'Diretto sul Prodotto', icon: '🎯', desc: 'Meno personale, orientato alle caratteristiche, resa e funzionalità.' },
  { id: 'entusiasta', label: 'Entusiasta & Soddisfatto', icon: '🔥', desc: 'Caloroso, molto felice dell’acquisto, energia positiva.' },
  { id: 'informale', label: 'Chiacchierata tra Amici', icon: '☕', desc: 'Colloquiale, rilassato, come un consiglio sincero al bar.' },
  { id: 'critico', label: 'Critico ma Costruttivo', icon: '🧐', desc: 'Esigente, analizza i dettagli pratici con occhio severo.' },
  { id: 'esperto', label: 'Esperto Appassionato', icon: '💻', desc: 'Vocabolario preciso ma accessibile, attento alle specifiche.' },
  { id: 'pratico', label: 'Minimalista & Pratico', icon: '🎒', desc: 'Diretto al sodo, orientato alla vita di tutti i giorni.' },
];

const USAGE_PERIODS = [
  'Prima impressione (3 giorni)',
  '1 settimana di test',
  '1 mese di utilizzo quotidiano',
  '3 mesi di prova continua',
  'Oltre 6 mesi d\'usura reale',
  'Un anno intero d\'uso',
];

const PERSPECTIVES = [
  'Utente quotidiano casalingo',
  'Diretto al prodotto (Meno personale / Oggettivo)',
  'Professionista in movimento / Lavoro',
  'Genitore pratico indaffarato',
  'Regalo gradito da parenti/partner',
  'Acquirente attento al budget',
  'Appassionato ed esigente del settore',
];

const LANGUAGES = [
  { code: 'Italiano', name: 'Italiano 🇮🇹' },
  { code: 'English', name: 'English 🇬🇧' },
  { code: 'Español', name: 'Español 🇪🇸' },
  { code: 'Français', name: 'Français 🇫🇷' },
  { code: 'Deutsch', name: 'Deutsch 🇩🇪' },
];

export const ReviewCustomizer: React.FC<ReviewCustomizerProps> = ({
  options,
  onChangeOptions,
  onGenerate,
  isLoading,
  disabled,
}) => {
  const currentTastePreset = options.tastePreset || 'editorial';
  const currentFocus = options.focusAspect || 'bilanciato';
  const featuresCount = (options.scrapedProduct?.keyFeatures?.length || 0) + (options.productFeatures?.length || 0);

  const handleRatingChange = (newRating: number) => {
    onChangeOptions({ ...options, rating: newRating });
  };

  const handleTastePresetChange = (preset: TasteSkillPreset) => {
    onChangeOptions({ ...options, tastePreset: preset });
  };

  const handleFocusChange = (focus: ReviewFocusAspect) => {
    onChangeOptions({ ...options, focusAspect: focus });
  };

  return (
    <section className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-widest">
            Fase 2
          </span>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            Personalizza Angolazione & Direttive Taste-Skill
          </h2>
        </div>
      </div>

      {/* Product Active Anchor Banner */}
      {options.productName && (
        <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span className="text-stone-700">
              Recensione ancorata a: <strong className="text-indigo-950 font-bold">{options.productName}</strong>
            </span>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-100 self-start sm:self-auto whitespace-nowrap">
            {featuresCount > 0 ? `${featuresCount} dettagli tecnici inclusi` : 'Analisi prodotto mirata'}
          </span>
        </div>
      )}

      {/* Focus Aspect Selector */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
          <Target className="w-3.5 h-3.5 text-indigo-600" />
          <span>Focus Principale della Narrazione:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {FOCUS_ASPECTS.map((f) => {
            const isSelected = currentFocus === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFocusChange(f.id)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 border-stone-900 text-white shadow-2xs'
                    : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="text-xs font-bold mb-0.5">
                  {f.label}
                </div>
                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  {f.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Taste-Skill Preset Grid (Editorial, Tactile, Direct, Storytelling) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Preset di Stile Taste-Skill:</span>
          </label>
          <span className="text-[11px] font-semibold text-stone-500">
            Prosa calibrata anti-slop
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TASTE_PRESETS.map((preset) => {
            const isSelected = currentTastePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleTastePresetChange(preset.id)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                    : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-stone-100/80 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {preset.title}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${
                    isSelected ? 'bg-indigo-500 text-white' : 'bg-stone-200/80 text-stone-600'
                  }`}>
                    {preset.tag}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  {preset.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Controls (Rating & Usage context) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-stone-100">

        {/* Rating Stars */}
        <div className="bg-stone-50/80 p-4.5 rounded-2xl border border-stone-200/80 space-y-2">
          <label className="text-xs font-bold text-stone-800 block flex items-center space-x-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Valutazione Complessiva ({options.rating} / 5 Stelle)</span>
          </label>
          
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`p-2 rounded-xl transition-all transform hover:scale-105 cursor-pointer ${
                  star <= options.rating
                    ? 'text-amber-500 bg-amber-50 border border-amber-200 shadow-2xs'
                    : 'text-stone-300 bg-white border border-stone-200'
                }`}
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= options.rating ? 'fill-amber-500' : ''
                  }`}
                />
              </button>
            ))}
          </div>

          <p className="text-[11px] text-stone-500 font-medium pt-0.5">
            {options.rating === 5 && '🌟 Esperienza eccellente con minimi dettagli di contesto.'}
            {options.rating === 4 && '👍 Ottima impressione generale con spunti di riflessione.'}
            {options.rating === 3 && '⚖️ Prodotto sufficiente, luci ed ombre equilibrate.'}
            {options.rating <= 2 && '⚠️ Esperienza con aspetti critici da evidenziare.'}
          </p>
        </div>

        {/* Usage Duration & Perspective */}
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Esperienza e Durata d'Uso:</span>
            </label>
            <select
              value={options.usageDuration}
              onChange={(e) =>
                onChangeOptions({ ...options, usageDuration: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {USAGE_PERIODS.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1.5 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Prospettiva dell'Autore:</span>
            </label>
            <select
              value={options.perspective}
              onChange={(e) =>
                onChangeOptions({ ...options, perspective: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {PERSPECTIVES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Tone Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
          <span>Tono di Voce Narrativo:</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {TONES.map((t) => {
            const isSelected = options.tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onChangeOptions({ ...options, tone: t.id })}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/90 border-indigo-200 text-indigo-950 font-medium shadow-2xs ring-1 ring-indigo-500/30'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-xs text-stone-900">
                  <span>{t.icon}</span>
                  <span className="whitespace-nowrap">{t.label}</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {t.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Length, Language, Variants with single line buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        
        {/* Length */}
        <div>
          <label className="text-xs font-bold text-stone-800 block mb-1.5 flex items-center space-x-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-indigo-600" />
            <span>Lunghezza:</span>
          </label>
          <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            {(['breve', 'media', 'lunga'] as ReviewLength[]).map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => onChangeOptions({ ...options, length: len })}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer whitespace-nowrap ${
                  options.length === len
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {len === 'breve' ? 'Breve' : len === 'media' ? 'Media' : 'Lunga'}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="text-xs font-bold text-stone-800 block mb-1.5 flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Lingua:</span>
          </label>
          <select
            value={options.language}
            onChange={(e) =>
              onChangeOptions({ ...options, language: e.target.value })
            }
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Variants Count */}
        <div>
          <label className="text-xs font-bold text-stone-800 block mb-1.5 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Varianti & Diversità:</span>
          </label>
          <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChangeOptions({ ...options, variantsCount: num })}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  options.variantsCount === num
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {num} {num === 1 ? 'Opzione' : 'Diverse'}
              </button>
            ))}
          </div>
          {options.variantsCount > 1 && (
            <p className="text-[10px] text-indigo-600 mt-1 font-medium">
              ✨ Ciascuna variante adotterà un'angolazione, incipit e lessico autonomi.
            </p>
          )}
        </div>

      </div>

      {/* Optional Custom Anecdotes */}
      <div>
        <label className="text-xs font-bold text-stone-800 block mb-1.5">
          Dettagli o aneddoti personali da includere (Opzionale):
        </label>
        <input
          type="text"
          value={options.customNotes || ''}
          onChange={(e) =>
            onChangeOptions({ ...options, customNotes: e.target.value })
          }
          placeholder="es. Usato per colazione in famiglia, oppure confrontato con modello precedente..."
          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* Taste-Skill Anti-Slop Protocol Guarantee Banner */}
      <div className="p-4 bg-stone-100/70 border border-stone-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-800">
        <div className="flex items-start space-x-2.5">
          <div className="p-1.5 rounded-xl bg-stone-900 text-white flex-shrink-0 mt-0.5">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <strong className="text-stone-900 font-bold">Standard Taste-Skill & Radicamento Prodotto:</strong>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                Attivo
              </span>
            </div>
            <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">
              Eliminazione di formule generiche ("ero titubante", "fa il suo dovere"), analisi dettagliata dei componenti reali e varianti a struttura asimmetrica.
            </p>
          </div>
        </div>
      </div>

      {/* Generate Action Button with 2:1 ratio */}
      <button
        onClick={onGenerate}
        disabled={disabled || isLoading}
        className="w-full py-3.5 px-7 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base rounded-2xl shadow-xs transition-all transform active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <Sparkles className="w-4.5 h-4.5 text-white" />
        <span className="whitespace-nowrap">
          {isLoading
            ? 'Generazione Recensioni Specifiche in corso...'
            : options.variantsCount > 1 
              ? `Genera ${options.variantsCount} Varianti Dedicate al Prodotto`
              : 'Genera Recensione Radicata nel Prodotto'}
        </span>
      </button>
    </section>
  );
};
