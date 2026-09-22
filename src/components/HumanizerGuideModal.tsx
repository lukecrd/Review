import React from 'react';
import { X, Sparkles, ShieldCheck, Check, AlertCircle, Compass, Zap, BookOpen } from 'lucide-react';
import { HUMANIZER_SECTIONS, BLADER_25_TELLS } from '../lib/humanizerEngine';

interface HumanizerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HumanizerGuideModal: React.FC<HumanizerGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAFAF9] border border-stone-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-stone-200/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg text-stone-900">
                  Blader Humanizer Protocol
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold uppercase tracking-wider">
                  25 Tells • 5 Sezioni
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Basato sulla specifica open-source di <a href="https://github.com/blader/humanizer" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold">blader/humanizer</a>
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

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 leading-relaxed">
          
          {/* Mission Banner */}
          <div className="p-4.5 bg-white border border-stone-200 rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center space-x-2 font-bold text-stone-900 text-sm">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>La Missione di Blader Humanizer</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Il protocollo <strong>blader/humanizer</strong> mappa e sradica i 25 "tell" (indizi rivelatori) che rendono un testo immediatamente riconoscibile come generato da un modello linguistico. Riscrive il contenuto affinché suoni come scritto da una persona in carne ed ossa, <strong>preservando rigorosamente ogni fatto, numero e nome proprio</strong>.
            </p>
          </div>

          {/* 5 Sections Overview Cards */}
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              Le 5 Categorie Fondamentali di Tell AI
            </h4>

            {Object.entries(HUMANIZER_SECTIONS).map(([secKey, meta]) => {
              const rules = BLADER_25_TELLS.filter((r) => r.section === secKey);

              return (
                <div key={secKey} className="p-4 bg-white border border-stone-200 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{meta.icon}</span>
                      <div>
                        <h5 className="font-bold text-sm text-stone-900">
                          {meta.title}
                        </h5>
                        <p className="text-[11px] text-stone-500">
                          {meta.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 whitespace-nowrap">
                      {rules.length} Pattern
                    </span>
                  </div>

                  {/* List of rules in this category */}
                  <div className="space-y-2 pt-1">
                    {rules.map((rule) => (
                      <div key={rule.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-800">
                            {rule.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            rule.severity === 'high'
                              ? 'bg-rose-100 text-rose-700'
                              : rule.severity === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-stone-200 text-stone-600'
                          }`}>
                            {rule.severity}
                          </span>
                        </div>
                        <p className="text-stone-500 text-[10px]">
                          <strong>Perché è un tell:</strong> {rule.reason}
                        </p>
                        <p className="text-indigo-700 text-[10px]">
                          <strong>Soluzione Humanizer:</strong> {rule.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fact Preservation Rule */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5 text-emerald-900 text-xs shadow-xs">
            <div className="flex items-center space-x-2 font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Regola di Conservazione dei Fatti (Zero Allucinazioni)</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Il motore Humanizer non inventa mai specifiche tecniche, percentuali, date o caratteristiche inesistenti. Se il testo originale menziona un'autonomia di 10 ore o un peso di 180 grammi, questi dati vengono custoditi alla lettera.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            Ho capito, chiudi
          </button>
        </div>

      </div>
    </div>
  );
};
