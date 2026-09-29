import React from 'react';
import { Palette, Sparkles, SlidersHorizontal } from 'lucide-react';
import { TASTE_THEMES, TasteThemeId, TasteThemeConfig } from '../lib/tasteThemes';

interface TasteSkillBarProps {
  currentThemeId: TasteThemeId;
  onSelectTheme: (id: TasteThemeId) => void;
  onOpenDetails: () => void;
  activeTheme: TasteThemeConfig;
}

export const TasteSkillBar: React.FC<TasteSkillBarProps> = ({
  currentThemeId,
  onSelectTheme,
  onOpenDetails,
  activeTheme,
}) => {
  return (
    <div className={`p-4 ${activeTheme.classes.cardRadius} border ${activeTheme.classes.cardBg} ${activeTheme.classes.cardBorder} ${activeTheme.classes.cardShadow} transition-all space-y-3`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2.5">
          <div className={`p-1.5 ${activeTheme.classes.innerRadius} ${activeTheme.classes.badgeAccent} flex items-center justify-center`}>
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-bold ${activeTheme.classes.textPrimary}`}>
                Grafica Attiva: <strong>{activeTheme.name}</strong>
              </span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-extrabold uppercase ${activeTheme.classes.badgeAccent}`}>
                Taste-Skill
              </span>
            </div>
            <p className={`text-[11px] ${activeTheme.classes.textSecondary} hidden sm:block`}>
              {activeTheme.tagline} • {activeTheme.archetype}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenDetails}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${activeTheme.classes.secondaryBtn} transition-all cursor-pointer self-start sm:self-auto`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Esplora Tutti i Temi</span>
        </button>
      </div>

      {/* 5 Archetype Quick Switch Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {Object.values(TASTE_THEMES).map((theme) => {
          const isSelected = theme.id === currentThemeId;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `${activeTheme.classes.activeTab} ring-2 ring-black/10 dark:ring-white/20`
                  : `${activeTheme.classes.badgeNeutral} hover:scale-[1.01]`
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-bold truncate">
                  {theme.name.split(' ')[0]}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20 flex-shrink-0"
                  style={{ backgroundColor: theme.palettePreview.accent }}
                />
              </div>
              <span className={`text-[10px] truncate ${isSelected ? 'opacity-90' : 'opacity-70'}`}>
                {theme.tagline.split('&')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
