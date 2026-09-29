import React from 'react';
import { X, Sparkles, Layout, Type, Palette, Compass, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface TasteSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TasteSkillModal: React.FC<TasteSkillModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAFAF9] border border-stone-200 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-stone-200/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg text-stone-900">
                  Taste-Skill Design System
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                  Attivo
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Linee guida estetiche anti-slop basate su <a href="https://www.tasteskill.dev" target="_blank" rel="noreferrer" className="text-indigo-600 underline hover:text-indigo-800">tasteskill.dev</a>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 leading-relaxed">
          
          {/* Core Philosophy Banner */}
          <div className="p-4.5 bg-white border border-stone-200 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center space-x-2 font-bold text-stone-900">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Filosofia Taste-Skill: Intenzionalità vs "AI Slop"</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              I modelli AI generano per impostazione predefinita interfacce generiche con gradienti viola/blu, schede a 3 colonne monotone e testi pieni di cliché. Taste-Skill impone regole matematiche e visive rigorose per garantire design editoriali, tattili e autentici.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Pillar 1 */}
            <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-1.5 shadow-xs">
              <div className="flex items-center space-x-2 font-bold text-stone-900">
                <Type className="w-4 h-4 text-indigo-600" />
                <span>1. Tipografia Intenzionale</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Accoppiamento di carattere Display + Serif editoriale (Plus Jakarta Sans + Lora). Step scale $\ge 1.25$ e larghezza di riga controllata (65–75 caratteri) per massima leggibilità.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-1.5 shadow-xs">
              <div className="flex items-center space-x-2 font-bold text-stone-900">
                <Palette className="w-4 h-4 text-indigo-600" />
                <span>2. Neutri Sofisticati</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Nessun nero o bianco puro (0% sat). Palette tinteggiate su toni caldi (Stone/Slate &lt;5% sat) e contrasto conforme WCAG AA con accento primario misurato.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-1.5 shadow-xs">
              <div className="flex items-center space-x-2 font-bold text-stone-900">
                <Layout className="w-4 h-4 text-indigo-600" />
                <span>3. Geometria Concentrica</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Formula <em>Inner Radius = Outer Radius - Padding</em>. Proporzioni pulsanti 2:1 (padding orizzontale esattamente il doppio del verticale).
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-1.5 shadow-xs">
              <div className="flex items-center space-x-2 font-bold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>4. Anti-Slop Writing</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Testo in prosa narrativa continua senza punti elenchi, con aneddoti d'uso reale e senza formule artificiali ("game-changer", "non solo X ma Y").
              </p>
            </div>

          </div>

          {/* Applied Rules Checklist */}
          <div className="p-4.5 bg-stone-100/80 border border-stone-200 rounded-2xl space-y-2.5">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              Regole Applicate in Questa Applicazione:
            </h4>
            <div className="space-y-1.5 text-[11px] text-stone-700">
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Nessun gradiente viola/blu o card nidificate (struttura appiattita con divisori sottili).</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Etichette e chip a riga singola (zero a capo su bottoni o badge).</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Padding contenitore $\ge$ gap interno tra gli elementi figli.</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Micro-interazioni con curve di attenuazione fluide (cubic-bezier) su hover e click.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-stone-200/90 flex items-center justify-between text-xs">
          <a
            href="https://www.tasteskill.dev"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
          >
            <span>Visita tasteskill.dev</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Chiudi
          </button>
        </div>

      </div>
    </div>
  );
};
