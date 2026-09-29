import React from 'react';
import { X, BookOpen, ShieldCheck, Heart, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Guida allo Stile di Recensione Naturale
              </h3>
              <p className="text-xs text-slate-500">
                Perché la prosa continua supera gli elenchi puntati
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
          
          <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-2xl space-y-2 text-indigo-950">
            <div className="flex items-center space-x-2 font-bold text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>La nostra filosofia: Autenticità al 100%</span>
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              Quando le persone leggono le recensioni di un prodotto prima di acquistare, cercano una sensazione di fiducia reciproca. Vogliono capire come si comporta l'oggetto nella vita di tutti i giorni, non leggere una scheda tecnica riassunta in elenchi.
            </p>
          </div>

          <div className="p-4.5 bg-gradient-to-br from-indigo-50 via-emerald-50/60 to-indigo-50 border border-indigo-200 rounded-2xl space-y-3 text-indigo-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-indigo-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Framework Integrato: Peter Yang No-AI-Slop</span>
              </div>
              <a
                href="https://github.com/petergyang/no-ai-slop"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
              >
                GitHub Repo ↗
              </a>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Abbiamo incorporato tutte le regole e i filtri anti-slop del celebre progetto open-source di Peter Yang, che identifica e rimuove oltre 20 tic stilistici tipici dei testi generati da AI.
            </p>

            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Esempi Prima vs Dopo:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950">
                  <span className="font-bold text-rose-700 block mb-1 text-[11px]">❌ AI Slop Tradizionale:</span>
                  <p className="text-[11px] italic">"Non è solo una borraccia, è un compagno fidato che eleva la tua idratazione. In conclusione, un game-changer assoluto!"</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                  <span className="font-bold text-emerald-700 block mb-1 text-[11px]">✓ No-AI-Slop Naturale:</span>
                  <p className="text-[11px] italic">"Tiene l'acqua fresca per tutto il pomeriggio in ufficio. La chiusura è solida, anche se con le mani bagnate il tappo fa un filo di resistenza."</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>I 20+ Pattern AI Banditi dal Nostro Motore</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-rose-700 block text-[11px]">1. Contrasti Binari</strong>
                <span className="text-[11px] text-slate-600">Vietato "Non solo X, ma Y" o "Non si tratta di..., bensì di...".</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-rose-700 block text-[11px]">2. Throat-Clearing Openers</strong>
                <span className="text-[11px] text-slate-600">Vietato "Ecco il punto:", "Siamo onesti:", "Nel mondo odierno...".</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-rose-700 block text-[11px]">3. Finali Fintamente Profondi</strong>
                <span className="text-[11px] text-slate-600">Vietato "Il futuro è qui", "E questo cambia tutto".</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-rose-700 block text-[11px]">4. Colon Reveals & Rivelazioni</strong>
                <span className="text-[11px] text-slate-600">Vietato "La parte migliore: funziona", "Il risultato? Sorprendente".</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-rose-700 block text-[11px]">5. Importance Puffery & Buzzwords</strong>
                <span className="text-[11px] text-slate-600">Niente "game-changer", "must-have", "svolta epocale".</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-rose-700 block text-[11px]">6. Conclusioni da Schema</strong>
                <span className="text-[11px] text-slate-600">Niente "In conclusione", "Tirando le somme", "In sintesi".</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>I Pilastri di una Recensione Naturale Umana</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-indigo-700 block mb-1">1. Dettagli Tattili e Sensoriali</strong>
                <p className="text-slate-600">Sensazione del materiale, peso, rumore del tasto o facilità di pulizia al primo lavaggio.</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-indigo-700 block mb-1">2. Piccole Imperfezioni Reali</strong>
                <p className="text-slate-600">Anche i prodotti a 5 stelle hanno piccole particolarità che solo chi lo usa nota davvero.</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-indigo-700 block mb-1">3. Aneddoti di Routine</strong>
                <p className="text-slate-600">"L'ho portato nello zaino per tutta la settimana", "Sul piano cucina fa un'ottima figura".</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-indigo-700 block mb-1">4. Cadenza e Varietà delle Frasi</strong>
                <p className="text-slate-600">Alternanza di periodi brevi e incisivi con riflessioni discorsive, zero cliché da bot o formule promozionali finte.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-amber-950">
            <h5 className="font-bold text-xs text-amber-900 flex items-center space-x-1.5">
              <span>🚫 Espressioni AI bandite dal motore:</span>
            </h5>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Il generatore esclude categoricamente formule artificiali come <em>"game-changer"</em>, <em>"compagno fidato"</em>, <em>"eleva l'esperienza"</em>, <em>"non posso che consigliarlo vivamente"</em> o <em>"in conclusione..."</em>, garantendo uno stile autentico, fresco e credibile.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
