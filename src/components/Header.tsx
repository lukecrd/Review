import React from 'react';
import { Sparkles, History, BookOpen, ShieldCheck, Compass, Zap, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onOpenTasteSkill: () => void;
  onOpenHumanizerGuide: () => void;
  currentMode: 'reviews' | 'humanizer';
  onChangeMode: (mode: 'reviews' | 'humanizer') => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenGuide,
  onOpenTasteSkill,
  onOpenHumanizerGuide,
  currentMode,
  onChangeMode,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 text-stone-800 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xs text-white font-bold transition-transform hover:scale-105">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-stone-900">
                Recensio<span className="text-indigo-600">.AI</span>
              </span>
              <button
                type="button"
                onClick={onOpenTasteSkill}
                className="hidden xl:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
                title="Visualizza le regole Taste-Skill attive"
              >
                <Compass className="w-3 h-3 text-indigo-600" />
                <span>Taste-Skill</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-500 hidden md:block">
              Recensioni Narrative & Blader Humanizer Studio
            </p>
          </div>
        </div>

        {/* Center Mode Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-2xl border border-stone-200 shadow-2xs">
          <button
            type="button"
            onClick={() => onChangeMode('reviews')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              currentMode === 'reviews'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generatore Recensioni</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeMode('humanizer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              currentMode === 'humanizer'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${currentMode === 'humanizer' ? 'text-amber-400' : 'text-indigo-600'}`} />
            <span>Blader Humanizer</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500 text-white font-black">
              25 Tells
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <button
            onClick={onOpenHumanizerGuide}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all border border-indigo-200 cursor-pointer whitespace-nowrap"
            title="Guida al protocollo Blader Humanizer"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>25 Tells</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-all border border-stone-200 cursor-pointer whitespace-nowrap"
            title="Guida allo stile naturale"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Guida Stile</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-all cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <History className="w-3.5 h-3.5 text-stone-200" />
            <span>Salvati</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-indigo-500 text-white font-bold text-[10px] rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};


