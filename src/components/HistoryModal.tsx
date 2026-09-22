import React, { useState } from 'react';
import { X, Trash2, Copy, Check, Star, Search, Calendar, ShoppingBag, ExternalLink } from 'lucide-react';
import { GeneratedReview } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedReviews: GeneratedReview[];
  onDeleteReview: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedReviews,
  onDeleteReview,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = savedReviews.filter((r) =>
    r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = async (rev: GeneratedReview) => {
    try {
      await navigator.clipboard.writeText(`${rev.title}\n\n${rev.body}`);
      setCopiedId(rev.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Cronologia Recensioni Salvate</h3>
              <p className="text-xs text-slate-500">
                {savedReviews.length} recensioni in memoria locale
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

        {/* Search & Actions */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca tra le recensioni salvate..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>

          {savedReviews.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Svuota tutta la cronologia</span>
            </button>
          )}
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              {savedReviews.length === 0
                ? 'Nessuna recensione salvata al momento. Generane una e premi "Salva in Cronologia"!'
                : 'Nessun risultato corrispondente alla ricerca.'}
            </div>
          ) : (
            filtered.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 space-y-3 relative hover:border-indigo-200 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 block uppercase tracking-wider">
                      {rev.productName}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                      "{rev.title}"
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleCopy(rev)}
                      className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-indigo-600 border border-slate-200 transition-colors cursor-pointer shadow-xs"
                      title="Copia"
                    >
                      {copiedId === rev.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteReview(rev.id)}
                      className="p-1.5 rounded-lg bg-white text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer shadow-xs"
                      title="Elimina"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-serif italic">
                  {rev.body}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/80">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{new Date(rev.createdAt).toLocaleDateString('it-IT')}</span>
                  </span>

                  {rev.productUrl && (
                    <a
                      href={rev.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 font-semibold"
                    >
                      <span>Vedi Prodotto</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
