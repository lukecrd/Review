import React from 'react';
import { X, Palette, Check, Sparkles, Sliders, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { TASTE_THEMES, TasteThemeId, TasteThemeConfig } from '../lib/tasteThemes';

interface TasteThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: TasteThemeId;
  onSelectTheme: (themeId: TasteThemeId) => void;
}

export const TasteThemeModal: React.FC<TasteThemeModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const activeTheme = TASTE_THEMES[currentThemeId] || TASTE_THEMES.editorial;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Selettore Grafica & Stile Taste-Skill
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  tasteskill.dev
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Scegli l'archetipo visivo e la direzione di design per la tua applicazione
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Info Banner on Taste-Skill Standards */}
          <div className="p-4 bg-gradient-to-r from-indigo-50/90 via-slate-50 to-emerald-50/60 dark:from-slate-800 dark:via-slate-850 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  Tutti i temi applicano rigorosamente le regole <strong>Taste-Skill</strong>: contrasti WCAG AA verificati, palette neutrali tinteggiate (<span className="text-indigo-600 font-semibold">&lt;5% sat</span>), tipografia non generica e raggi proporzionali.
                </p>
              </div>
            </div>
            <a
              href="https://www.tasteskill.dev/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0"
            >
              <span>Vedi Specifiche</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(TASTE_THEMES).map((theme) => {
              const isSelected = theme.id === currentThemeId;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onSelectTheme(theme.id)}
                  className={`text-left p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'ring-2 ring-indigo-600 dark:ring-indigo-400 border-indigo-600 dark:border-indigo-400 shadow-md bg-white dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs bg-slate-50/50 dark:bg-slate-850/60'
                  }`}
                >
                  {/* Top row: Name, Badge, Check */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-base text-slate-900 dark:text-white">
                            {theme.name}
                          </h4>
                          {theme.isDark && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-900 text-slate-200 border border-slate-700">
                              Dark
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-serif italic text-indigo-600 dark:text-indigo-400 font-medium">
                          {theme.tagline}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Palette Swatches */}
                    <div className="flex items-center space-x-2 my-3 p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Palette:</span>
                      <div className="flex items-center space-x-1.5">
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: theme.palettePreview.bg }}
                          title={`Canvas: ${theme.palettePreview.bg}`}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: theme.palettePreview.card }}
                          title={`Card: ${theme.palettePreview.card}`}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: theme.palettePreview.accent }}
                          title={`Accent: ${theme.palettePreview.accent}`}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: theme.palettePreview.text }}
                          title={`Text: ${theme.palettePreview.text}`}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono ml-auto">
                        {theme.palettePreview.accent}
                      </span>
                    </div>

                    {/* Typography info */}
                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Display Font:</span>
                        <span className="font-semibold font-mono text-slate-700 dark:text-slate-200">
                          {theme.typography.display.split(',')[0].replace(/'/g, '')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Scale Ratio:</span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                          {theme.typography.ratio}
                        </span>
                      </div>
                    </div>

                    {/* Key Principles Checklist */}
                    <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {theme.tasteSkillPrinciples.slice(0, 2).map((principle, pIdx) => (
                        <div key={pIdx} className="flex items-start space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span className="line-clamp-1">{principle}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Pill */}
                  <div className="mt-4 pt-3 flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}>
                      {isSelected ? 'Grafica Attiva' : 'Clicca per Applicare'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Theme Detailed Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Specifiche Taste-Skill per "{activeTheme.name}":
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              {activeTheme.tasteSkillPrinciples.map((rule, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start space-x-2">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            La scelta viene salvata e applicata automaticamente a ogni sessione.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Fatto
          </button>
        </div>

      </div>
    </div>
  );
};
