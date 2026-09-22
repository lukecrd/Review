import React, { useState } from 'react';
import { Link2, Search, Loader2, ShoppingBag, Edit3, Check, Sparkles, AlertCircle } from 'lucide-react';
import { ScrapedProduct } from '../types';

interface UrlInputSectionProps {
  onProductScraped: (product: ScrapedProduct) => void;
  isLoading: boolean;
  currentProduct: ScrapedProduct | null;
}

const SAMPLE_PRODUCTS: Array<{
  name: string;
  url: string;
  category: string;
  domain: string;
  title: string;
  description: string;
  image: string;
  price: string;
}> = [
  {
    name: 'Macchina Caffè De\'Longhi',
    url: 'https://www.amazon.it/DeLonghi-Magnifica-S-Macchina-Caffe/dp/B00400OMU0',
    category: 'Elettrodomestici',
    domain: 'amazon.it',
    title: "De'Longhi Magnifica S ECAM22.110.B Macchina da Caffè Automatica per Espresso e Cappuccino",
    description: "Macchina automatica da caffè con macina grani integrato, pannarello per schiuma di latte cremosa e controllo temperatura.",
    image: 'https://images.unsplash.com/photo-1517668808822-9ed02810a300?w=600&auto=format&fit=crop&q=80',
    price: '€ 299,00',
  },
  {
    name: 'Cuffie Bose QuietComfort',
    url: 'https://www.bose.it/it_it/products/headphones/over_ear_headphones/quietcomfort-headphones.html',
    category: 'Audio & Tech',
    domain: 'bose.it',
    title: 'Bose QuietComfort Wireless Noise Cancelling Headphones',
    description: 'Cuffie wireless over-ear con cancellazione del rumore leggendaria, autonomia fino a 24 ore e modalità Aware.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    price: '€ 349,95',
  },
  {
    name: 'Nike Pegasus 40 Corsa',
    url: 'https://www.nike.com/it/t/scarpa-da-corsa-pegasus-40-02c3Z1',
    category: 'Sport & Moda',
    domain: 'nike.com',
    title: 'Nike Air Zoom Pegasus 40 - Scarpa da Corsa su Strada',
    description: 'Ammortizzazione reattiva Zoom Air e calzata avvolgente per le tue corse quotidiane o maratone.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    price: '€ 129,99',
  },
  {
    name: 'Friggitrice ad Aria Cosori 5.5L',
    url: 'https://www.cosori.it/products/cosori-friggitrice-ad-aria-5-5l',
    category: 'Cucina',
    domain: 'cosori.it',
    title: 'Cosori Friggitrice ad Aria Senza Olio 5,5L 1700W con 11 Programmi',
    description: 'Cottura sana e croccante con l\'85% di grassi in meno, cestello antiaderente lavabile in lavastoviglie.',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80',
    price: '€ 119,99',
  },
];

export const UrlInputSection: React.FC<UrlInputSectionProps> = ({
  onProductScraped,
  isLoading,
  currentProduct,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedCategory, setEditedCategory] = useState('');

  const handleFetchUrl = async (urlToFetch?: string) => {
    const targetUrl = (urlToFetch || inputUrl).trim();
    if (!targetUrl) {
      setErrorMsg('Inserisci o incolla un link di prodotto valido.');
      return;
    }

    setErrorMsg(null);
    setIsFetching(true);

    try {
      const response = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Impossibile estrarre i dati da questo link.');
      }

      onProductScraped(data.product);
      setEditedTitle(data.product.title);
      setEditedCategory(data.product.categoryGuess || 'Generale');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Errore durante l\'analisi dell\'URL. Prova con uno dei prodotti di esempio.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_PRODUCTS[0]) => {
    setInputUrl(sample.url);
    setErrorMsg(null);
    const scraped: ScrapedProduct = {
      url: sample.url,
      domain: sample.domain,
      title: sample.title,
      description: sample.description,
      image: sample.image,
      price: sample.price,
      siteName: sample.domain,
      categoryGuess: sample.category,
    };
    onProductScraped(scraped);
    setEditedTitle(sample.title);
    setEditedCategory(sample.category);
  };

  const handleSaveEdits = () => {
    if (!currentProduct) return;
    onProductScraped({
      ...currentProduct,
      title: editedTitle || currentProduct.title,
      categoryGuess: editedCategory || currentProduct.categoryGuess,
    });
    setIsEditing(false);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text);
        handleFetchUrl(text);
      }
    } catch {
      // Ignore if clipboard permission denied
    }
  };

  return (
    <section className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
      
      {/* Step Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
          <Link2 className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-widest">
            Fase 1
          </span>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            Inserisci il Link del Prodotto
          </h2>
        </div>
      </div>

      {/* Main Search/URL Input Bar */}
      <div className="relative">
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchUrl()}
              placeholder="Incolla l'URL del prodotto... es. https://amazon.it/dp/B00400OMU0"
              className="w-full pl-10 pr-24 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
            />
            <Link2 className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="absolute right-2 top-2 px-3 py-1 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-700 rounded-lg transition-colors border border-stone-200 shadow-2xs cursor-pointer whitespace-nowrap"
            >
              Incolla
            </button>
          </div>

          <button
            onClick={() => handleFetchUrl()}
            disabled={isFetching || isLoading}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shadow-xs"
          >
            {isFetching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analisi in corso...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Estrai Dati</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Quick Sample Presets */}
      <div className="pt-3 border-t border-stone-100">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block mb-2">
          Oppure seleziona un prodotto test pronto:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRODUCTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className="px-3 py-1.5 rounded-full bg-stone-50 hover:bg-indigo-50 text-stone-700 hover:text-indigo-900 border border-stone-200 hover:border-indigo-200 text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
              <span>{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scraped Product Card Preview with Concentric Corner Math */}
      {currentProduct && (
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/90 relative overflow-hidden transition-all">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {currentProduct.image ? (
              <img
                src={currentProduct.image}
                alt={currentProduct.title}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-stone-200 bg-white shadow-2xs flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-2xs">
                <ShoppingBag className="w-7 h-7 text-indigo-500" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 text-xs font-semibold mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold uppercase tracking-wider">
                  {currentProduct.domain}
                </span>
                {currentProduct.price && (
                  <span className="text-stone-900 font-bold">
                    {currentProduct.price}
                  </span>
                )}
              </div>

              {!isEditing ? (
                <>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 line-clamp-2">
                    {currentProduct.title}
                  </h3>
                  {currentProduct.description && (
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                      {currentProduct.description}
                    </p>
                  )}
                  <div className="mt-2.5 flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditedTitle(currentProduct.title);
                        setEditedCategory(currentProduct.categoryGuess || 'Generale');
                        setIsEditing(true);
                      }}
                      className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modifica nome o categoria</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 mt-1">
                  <div>
                    <label className="text-[11px] text-stone-500 font-semibold block mb-1">
                      Nome Prodotto:
                    </label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleSaveEdits}
                      className="px-3 py-1.5 bg-stone-900 text-white font-semibold text-xs rounded-lg flex items-center space-x-1 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Salva</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
