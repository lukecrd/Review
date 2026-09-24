import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { UrlInputSection } from './components/UrlInputSection';
import { ReviewCustomizer } from './components/ReviewCustomizer';
import { ReviewDisplay } from './components/ReviewDisplay';
import { HumanizerStudio } from './components/HumanizerStudio';
import { HistoryModal } from './components/HistoryModal';
import { GuideModal } from './components/GuideModal';
import { TasteSkillModal } from './components/TasteSkillModal';
import { HumanizerGuideModal } from './components/HumanizerGuideModal';
import { ScrapedProduct, ReviewOptions, GeneratedReview } from './types';
import { Sparkles, ShieldCheck, Compass, Zap } from 'lucide-react';

const STORAGE_KEY = 'recensio_ai_saved_reviews_v1';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'reviews' | 'humanizer'>('reviews');
  const [scrapedProduct, setScrapedProduct] = useState<ScrapedProduct | null>(null);
  
  const [reviewOptions, setReviewOptions] = useState<ReviewOptions>({
    productUrl: '',
    scrapedProduct: null,
    productName: '',
    productCategory: 'Generale',
    rating: 5,
    tone: 'equilibrato',
    tastePreset: 'editorial',
    perspective: 'Utente quotidiano casalingo',
    usageDuration: '1 mese di utilizzo quotidiano',
    length: 'media',
    language: 'Italiano',
    customNotes: '',
    variantsCount: 1,
  });

  const [generatedReviews, setGeneratedReviews] = useState<GeneratedReview[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [savedReviews, setSavedReviews] = useState<GeneratedReview[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isTasteSkillOpen, setIsTasteSkillOpen] = useState(false);
  const [isHumanizerGuideOpen, setIsHumanizerGuideOpen] = useState(false);
  const [humanizerSeedText, setHumanizerSeedText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load saved reviews from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedReviews(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Impossibile caricare la cronologia da localStorage:', err);
    }
  }, []);

  // Sync saved reviews to localStorage
  const updateSavedReviews = (newList: GeneratedReview[]) => {
    setSavedReviews(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {
      console.warn('Impossibile salvare la cronologia in localStorage:', err);
    }
  };

  const handleProductScraped = (product: ScrapedProduct) => {
    setScrapedProduct(product);
    setReviewOptions((prev) => ({
      ...prev,
      productUrl: product.url,
      scrapedProduct: product,
      productName: product.title,
      productCategory: product.categoryGuess || 'Generale',
    }));
    setErrorMessage(null);
  };

  const generateAbortControllerRef = useRef<AbortController | null>(null);

  const handleCancelGeneration = () => {
    if (generateAbortControllerRef.current) {
      generateAbortControllerRef.current.abort();
      generateAbortControllerRef.current = null;
    }
    setIsGenerating(false);
    setIsRefining(false);
    setErrorMessage('Elaborazione interrotta su richiesta.');
  };

  const handleGenerateReviews = async () => {
    if (!scrapedProduct && !reviewOptions.productName) {
      setErrorMessage('Inserisci prima un link di prodotto o seleziona uno degli esempi.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    if (generateAbortControllerRef.current) {
      generateAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    generateAbortControllerRef.current = controller;
    // Server-side retry tries up to 4 models at ~7.5s each (worst case ~30s),
    // so the client timeout must stay comfortably above that.
    const timeoutId = setTimeout(() => controller.abort(), 34000);

    try {
      const response = await fetch('/api/generate-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          ...reviewOptions,
          productName: reviewOptions.productName || scrapedProduct?.title,
          productUrl: reviewOptions.productUrl || scrapedProduct?.url,
          scrapedProduct,
        }),
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Errore durante la generazione della recensione.');
      }

      setGeneratedReviews(data.reviews || []);

      // Scroll smoothly to output
      setTimeout(() => {
        const outputEl = document.getElementById('review-output-anchor');
        if (outputEl) {
          outputEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setErrorMessage('Tempo di elaborazione scaduto o richiesta annullata. Riprova: subentrerà la generazione istantanea.');
      } else {
        console.error(err);
        setErrorMessage(err.message || 'Impossibile completare la generazione.');
      }
    } finally {
      clearTimeout(timeoutId);
      generateAbortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  const handleRefineReview = async (originalReviewId: string, instruction: string) => {
    const target = generatedReviews.find((r) => r.id === originalReviewId);
    if (!target) return;

    setIsRefining(true);
    const controller = new AbortController();
    // Same rationale as handleGenerateReviews: stay above the server's
    // worst-case sequential model retry time (~30s).
    const timeoutId = setTimeout(() => controller.abort(), 34000);

    try {
      const response = await fetch('/api/refine-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          originalReview: target.body,
          instruction,
          tone: reviewOptions.tone,
        }),
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Impossibile perfezionare il testo.');
      }

      const updatedReview: GeneratedReview = {
        ...target,
        title: data.review.title || target.title,
        body: data.review.body,
        wordCount: data.review.wordCount,
        readingTimeMinutes: data.review.readingTimeMinutes,
        authenticityScore: data.review.authenticityScore || 98,
      };

      setGeneratedReviews((prev) =>
        prev.map((r) => (r.id === originalReviewId ? updatedReview : r))
      );
    } catch (err: any) {
      console.error(err);
      alert(err.name === 'AbortError' ? 'Tempo di attesa scaduto durante la modifica.' : (err.message || 'Errore durante la modifica della recensione.'));
    } finally {
      clearTimeout(timeoutId);
      setIsRefining(false);
    }
  };

  const handleSaveToHistory = (review: GeneratedReview) => {
    // Avoid duplicates
    if (savedReviews.some((r) => r.id === review.id)) return;
    updateSavedReviews([review, ...savedReviews]);
  };

  const handleDeleteFromHistory = (id: string) => {
    updateSavedReviews(savedReviews.filter((r) => r.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm('Sei sicuro di voler cancellare tutta la cronologia?')) {
      updateSavedReviews([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Header with Taste-Skill & Blader Integration */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenTasteSkill={() => setIsTasteSkillOpen(true)}
        onOpenHumanizerGuide={() => setIsHumanizerGuideOpen(true)}
        currentMode={currentMode}
        onChangeMode={setCurrentMode}
        savedCount={savedReviews.length}
      />

      {/* Mode-Specific Hero Header */}
      {currentMode === 'reviews' ? (
        <div className="relative overflow-hidden bg-white py-10 sm:py-14 border-b border-stone-200/90">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span className="whitespace-nowrap">Prosa Naturale Senza Elenchi • Taste-Skill™ Certified</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Recensioni di Prodotti <span className="text-indigo-600">Autentiche e Narrative</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
              Incolla il link di qualsiasi prodotto. Genera narrazioni d'uso quotidiano scritte in prosa fluida e convincente, <strong>completamente prive di elenchi puntati robotici</strong>.
            </p>
          </div>
        </div>
      ) : null}

      {/* Main Container with Taste-Skill Spacing */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">

        {currentMode === 'humanizer' ? (
          <HumanizerStudio
            onOpenGuide={() => setIsHumanizerGuideOpen(true)}
            initialText={humanizerSeedText}
            onSendToReviewGenerator={(humanizedText) => {
              setReviewOptions((prev) => ({
                ...prev,
                customNotes: humanizedText,
              }));
              setCurrentMode('reviews');
            }}
          />
        ) : (
          <>
            {/* Global Error Alert */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center space-x-2.5">
                  <span className="p-1 rounded-lg bg-rose-100 text-rose-600 font-bold text-xs">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handleGenerateReviews}
                    disabled={isGenerating}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs disabled:opacity-50 whitespace-nowrap"
                  >
                    Riprova
                  </button>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-xs text-rose-600 hover:text-rose-900 font-semibold px-2 py-1 cursor-pointer whitespace-nowrap"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: URL Input Section */}
            <UrlInputSection
              onProductScraped={handleProductScraped}
              isLoading={isGenerating}
              currentProduct={scrapedProduct}
            />

            {/* Step 2: Customizer Controls */}
            <ReviewCustomizer
              options={reviewOptions}
              onChangeOptions={setReviewOptions}
              onGenerate={handleGenerateReviews}
              onCancel={handleCancelGeneration}
              isLoading={isGenerating}
              disabled={!scrapedProduct && !reviewOptions.productName}
            />

            {/* Anchor for Smooth Scroll */}
            <div id="review-output-anchor" />

            {/* Step 3: Output Display */}
            {generatedReviews.length > 0 && (
              <ReviewDisplay
                reviews={generatedReviews}
                onSaveToHistory={handleSaveToHistory}
                onRefineReview={handleRefineReview}
                isRefining={isRefining}
              />
            )}
          </>
        )}

      </main>

      {/* Footer with Taste-Skill Aesthetic */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-8 text-center text-xs text-stone-500">
        <div className="max-w-3xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center space-x-2 text-stone-700 font-medium">
            <span>Recensio AI</span>
            <span>•</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Garanzia 100% Prosa Naturale & Blader Humanizer Protocol</span>
          </div>
          <p>© {new Date().getFullYear()} - Conforme a Taste-Skill & blader/humanizer Anti-Slop Writing Framework.</p>
        </div>
      </footer>

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedReviews={savedReviews}
        onDeleteReview={handleDeleteFromHistory}
        onClearAll={handleClearHistory}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <TasteSkillModal
        isOpen={isTasteSkillOpen}
        onClose={() => setIsTasteSkillOpen(false)}
      />

      <HumanizerGuideModal
        isOpen={isHumanizerGuideOpen}
        onClose={() => setIsHumanizerGuideOpen(false)}
      />

    </div>
  );
}
