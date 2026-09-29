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
  brand: string;
  description: string;
  image: string;
  price: string;
  keyFeatures: string[];
  practicalQuirks: string[];
}> = [
  {
    name: 'Macchina Caffè De\'Longhi',
    url: 'https://www.amazon.it/DeLonghi-Magnifica-S-Macchina-Caffe/dp/B00400OMU0',
    category: 'Macchine Caffè Espresso',
    domain: 'amazon.it',
    title: "De'Longhi Magnifica S ECAM22.110.B Macchina da Caffè Automatica per Espresso e Cappuccino",
    brand: "De'Longhi",
    description: "Macchina automatica con macina chicchi conico integrato a 13 selezioni, manopola aroma, pannarello vapore latte e serbatoio estraibile da 1.8L.",
    image: 'https://images.unsplash.com/photo-1517668808822-9ed02810a300?w=600&auto=format&fit=crop&q=80',
    price: '€ 299,00',
    keyFeatures: [
      'Macinacaffè conico in acciaio regolabile su 13 livelli di macinatura',
      'Manopola centrale per calibrare l\'intensità dell\'aroma (da leggero a extra forte)',
      'Pannarello manuale in acciaio inox per montare latte o erogare acqua bollente',
      'Gruppo infusore compatto completamente estraibile e lavabile sotto il rubinetto',
      'Serbatoio d\'acqua frontale da 1,8 litri con erogatore caffè regolabile in altezza',
    ],
    practicalQuirks: [],
  },
  {
    name: 'Cuffie Bose QuietComfort',
    url: 'https://www.bose.it/it_it/products/headphones/over_ear_headphones/quietcomfort-headphones.html',
    category: 'Cuffie Wireless & Audio',
    domain: 'bose.it',
    title: 'Bose QuietComfort Wireless Noise Cancelling Headphones',
    brand: 'Bose',
    description: 'Cuffie over-ear con cancellazione attiva del rumore proprietaria (Quiet e Aware), autonomia 24 ore e cuscinetti in morbida pelle sintetica.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    price: '€ 349,95',
    keyFeatures: [
      'Cancellazione attiva del rumore (ANC) con modalità Quiet e Aware per suoni ambientali',
      'Cuscinetti morbidi a memoria di forma in pelle sintetica adatti a sessioni prolungate',
      'Autonomia fino a 24 ore con ricarica rapida via USB-C (15 min per 2.5 ore)',
      'Connessione multipoint Bluetooth per passare all\'istante tra laptop e smartphone',
      'Equalizzatore a tre bande regolabile con precisione dall\'app Bose',
    ],
    practicalQuirks: [],
  },
  {
    name: 'Nike Pegasus 40 Corsa',
    url: 'https://www.nike.com/it/t/scarpa-da-corsa-pegasus-40-02c3Z1',
    category: 'Scarpe da Corsa su Strada',
    domain: 'nike.com',
    title: 'Nike Air Zoom Pegasus 40 - Scarpa da Corsa su Strada',
    brand: 'Nike',
    description: 'Ammortizzazione reattiva con doppia unità Zoom Air e intersuola in schiuma Nike React, tomaia in engineered mesh traspirante.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    price: '€ 129,99',
    keyFeatures: [
      'Doppia unità Zoom Air (avampiede e tallone) combinata con schiuma Nike React su tutta la pianta',
      'Tomaia a rete traspirante engineered mesh a strato singolo per comfort termico',
      'Fascia mediale ridisegnata per bloccare l\'arco plantare senza comprimere',
      'Battistrada in gomma anti-abrasione con motivo waffle per trazione su asfalto umido',
      'Differenziale tacco-punta (drop) di 10 mm bilanciato per corse medie e lunghe',
    ],
    practicalQuirks: [],
  },
  {
    name: 'Friggitrice ad Aria Cosori 5.5L',
    url: 'https://www.cosori.it/products/cosori-friggitrice-ad-aria-5-5l',
    category: 'Piccoli Elettrodomestici Cucina',
    domain: 'cosori.it',
    title: 'Cosori Friggitrice ad Aria Senza Olio 5,5L 1700W con 11 Programmi',
    brand: 'Cosori',
    description: 'Cestello quadrato da 5.5L antiaderente estraibile, potenza 1700W con circolazione d\'aria 360°, display touch con promemoria Shake.',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80',
    price: '€ 119,99',
    keyFeatures: [
      'Cestello estraibile quadrato antiaderente da 5,5 litri (spazio per pollo intero o 4 porzioni)',
      'Potenza di riscaldamento 1700W con tecnologia Air Crisp a convezione rapida a 360°',
      'Pannello touch intuitivo con 11 programmi preimpostati e controllo manuale 75-205°C',
      'Funzione automatica di preriscaldamento (Preheat) e promemoria sonoro "Shake"',
      'Cestello e contro-cestello lavabili in lavastoviglie privi di BPA e PFOA',
    ],
    practicalQuirks: [],
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

  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newQuirkInput, setNewQuirkInput] = useState('');
  const [isEnriching, setIsEnriching] = useState(false);
  const [manualText, setManualText] = useState('');

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
      brand: sample.brand,
      description: sample.description,
      image: sample.image,
      price: sample.price,
      siteName: sample.domain,
      categoryGuess: sample.category,
      keyFeatures: [...sample.keyFeatures],
      practicalQuirks: [...sample.practicalQuirks],
    };
    onProductScraped(scraped);
    setEditedTitle(sample.title);
    setEditedCategory(sample.category);
  };

  const handleUseManualData = () => {
    if (!currentProduct || !manualText.trim()) return;
    onProductScraped({
      ...currentProduct,
      description: manualText.trim().slice(0, 6000),
      rawTextSnippet: '',
      needsManualInput: false,
      manualReason: undefined,
    });
    setManualText('');
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

  const handleReEnrichWithAi = async () => {
    if (!currentProduct) return;
    setIsEnriching(true);
    try {
      const response = await fetch('/api/enrich-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editedTitle || currentProduct.title,
          category: editedCategory || currentProduct.categoryGuess,
          description: currentProduct.description,
          url: currentProduct.url,
        }),
      });
      const data = await response.json();
      if (data.success && data.enrichment) {
        const enriched = data.enrichment;
        const updated: ScrapedProduct = {
          ...currentProduct,
          title: enriched.title || currentProduct.title,
          brand: enriched.brand || currentProduct.brand,
          categoryGuess: enriched.categoryGuess || currentProduct.categoryGuess,
          keyFeatures: enriched.keyFeatures?.length ? enriched.keyFeatures : currentProduct.keyFeatures,
          practicalQuirks: enriched.practicalQuirks?.length ? enriched.practicalQuirks : currentProduct.practicalQuirks,
        };
        onProductScraped(updated);
        setEditedTitle(updated.title);
        setEditedCategory(updated.categoryGuess || 'Generale');
      }
    } catch (e) {
      console.warn('Re-enrich failed', e);
    } finally {
      setIsEnriching(false);
    }
  };

  const handleAddFeature = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentProduct || !newFeatureInput.trim()) return;
    const existing = currentProduct.keyFeatures || [];
    if (!existing.includes(newFeatureInput.trim())) {
      onProductScraped({
        ...currentProduct,
        keyFeatures: [...existing, newFeatureInput.trim()],
      });
    }
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    if (!currentProduct) return;
    onProductScraped({
      ...currentProduct,
      keyFeatures: (currentProduct.keyFeatures || []).filter((f) => f !== featureToRemove),
    });
  };

  const handleAddQuirk = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentProduct || !newQuirkInput.trim()) return;
    const existing = currentProduct.practicalQuirks || [];
    if (!existing.includes(newQuirkInput.trim())) {
      onProductScraped({
        ...currentProduct,
        practicalQuirks: [...existing, newQuirkInput.trim()],
      });
    }
    setNewQuirkInput('');
  };

  const handleRemoveQuirk = (quirkToRemove: string) => {
    if (!currentProduct) return;
    onProductScraped({
      ...currentProduct,
      practicalQuirks: (currentProduct.practicalQuirks || []).filter((q) => q !== quirkToRemove),
    });
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
            Inserisci il Prodotto da Recensire
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
              placeholder="Incolla l'URL del prodotto, ad esempio https://www.negozio.it/prodotto"
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
                <span>Analisi & Specifiche...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Analizza Prodotto</span>
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
          Oppure prova con un prodotto di esempio (dati dimostrativi, non verificati):
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
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/90 relative overflow-hidden transition-all space-y-4">
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
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold uppercase tracking-wider">
                  {currentProduct.domain}
                </span>
                {currentProduct.brand && (
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold uppercase tracking-wider">
                    {currentProduct.brand}
                  </span>
                )}
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
                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
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

                    <button
                      type="button"
                      onClick={handleReEnrichWithAi}
                      disabled={isEnriching}
                      className="inline-flex items-center space-x-1 text-xs text-stone-600 hover:text-stone-900 font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{isEnriching ? 'Analisi AI in corso...' : 'Rileva specifiche con AI'}</span>
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
                  <div>
                    <label className="text-[11px] text-stone-500 font-semibold block mb-1">
                      Categoria Prodotto:
                    </label>
                    <input
                      type="text"
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value)}
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

          {/* Dati da incollare: la scheda non è stata scaricata (Amazon) o non conteneva dati */}
          {currentProduct.needsManualInput && (
            <div className="pt-3 border-t border-stone-200/80 space-y-2">
              <p className="text-xs text-stone-700 leading-relaxed">
                {currentProduct.manualReason === 'amazon'
                  ? "Per i link Amazon l'app non scarica la pagina. Copia dalla scheda prodotto il nome, la descrizione e le caratteristiche, poi incollali qui sotto. Il nome si corregge con «Modifica nome o categoria»."
                  : 'Non è stato possibile leggere i dati della pagina. Incolla qui sotto descrizione e caratteristiche prese dalla scheda del prodotto.'}
              </p>
              <textarea
                rows={5}
                maxLength={6000}
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Incolla qui la descrizione e le caratteristiche del prodotto"
                className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-500">{manualText.length} / 6000 caratteri</span>
                <button
                  type="button"
                  onClick={handleUseManualData}
                  disabled={!manualText.trim()}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Usa questi dati</span>
                </button>
              </div>
            </div>
          )}

          {/* Real Technical Features Section */}
          <div className="pt-3 border-t border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>Specifiche & Componenti da citare nella recensione:</span>
              </span>
              <span className="text-[11px] text-stone-500">
                {(currentProduct.keyFeatures || []).length} dettagli rilevati
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(currentProduct.keyFeatures || []).map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-medium shadow-2xs"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feat)}
                    className="text-stone-400 hover:text-rose-600 font-bold text-xs ml-1 cursor-pointer"
                    title="Rimuovi specifica"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Inline add feature form */}
            <form onSubmit={handleAddFeature} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                placeholder="+ Aggiungi una parte, specifica o funzione (es. 'Cavo da 2 metri', 'Display touch')..."
                className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!newFeatureInput.trim()}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40"
              >
                Aggiungi
              </button>
            </form>
          </div>

          {/* Practical Quirks Section */}
          {((currentProduct.practicalQuirks && currentProduct.practicalQuirks.length > 0) || true) && (
            <div className="pt-2 border-t border-stone-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Limiti o difetti che hai riscontrato tu (solo se reali):</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(currentProduct.practicalQuirks || []).map((quirk, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs font-medium"
                  >
                    <span>{quirk}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuirk(quirk)}
                      className="text-amber-700 hover:text-rose-600 font-bold text-xs ml-1 cursor-pointer"
                      title="Rimuovi sfumatura"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddQuirk} className="flex gap-2 pt-0.5">
                <input
                  type="text"
                  value={newQuirkInput}
                  onChange={(e) => setNewQuirkInput(e.target.value)}
                  placeholder="+ Aggiungi un limite riscontrato di persona (es. 'Cavo troppo corto')..."
                  className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newQuirkInput.trim()}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40"
                >
                  Aggiungi
                </button>
              </form>
            </div>
          )}

        </div>
      )}
    </section>
  );
};
