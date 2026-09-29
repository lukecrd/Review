/**
 * Local, deterministic fallback for /api/generate-review.
 *
 * If the Gemini API is unavailable, slow, or times out, the app still produces
 * a usable draft instead of only showing an error.
 *
 * Rule: the fallback NEVER states an experience the user did not provide.
 * - Without personal material (free notes or guided answers) it writes a neutral,
 *   third-person description based on the product page only.
 * - With personal material it reuses the user's own words, without adding
 *   duration of use, purchase, testing or feelings of its own.
 */

export interface ReviewFallbackParams {
  productName: string;
  productDescription?: string;
  productCategory?: string;
  rating: number;
  tone: string;
  perspective: string;
  usageDuration: string;
  tastePreset?: string;
  customNotes?: string;
  experience?: Record<string, string>;
  variantsCount: number;
  length?: 'breve' | 'media' | 'lunga';
}

export interface ReviewFallbackResult {
  title: string;
  body: string;
  authenticityScore: number;
  perceivedHighlights: string[];
}

const RATING_PHRASE: Record<number, string> = {
  5: 'un giudizio molto positivo',
  4: 'un giudizio positivo, con qualche riserva',
  3: 'un giudizio intermedio',
  2: 'un giudizio piuttosto negativo',
  1: 'un giudizio negativo',
};

// Ordine di presentazione delle risposte guidate (stesse chiavi usate dal server).
const EXPERIENCE_ORDER = ['purpose', 'decisive', 'comparison', 'annoyance', 'wouldChange'];

function truncateFact(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  const cut = clean.slice(0, maxLen);
  // Preferisce chiudere all'ultima frase completa, se ce n'è una ragionevolmente lunga.
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (lastStop > maxLen * 0.4) return cut.slice(0, lastStop + 1).trim();
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim()}...`;
}

function asSentence(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t) return '';
  const capitalized = t.charAt(0).toUpperCase() + t.slice(1);
  return /[.!?…]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}

export function generateLocalReviews(params: ReviewFallbackParams): ReviewFallbackResult[] {
  const {
    productName,
    productDescription,
    rating,
    customNotes,
    experience,
    variantsCount,
    length = 'media',
  } = params;

  const safeRating = Math.min(5, Math.max(1, Math.round(rating) || 3));
  const count = Math.min(3, Math.max(1, variantsCount || 1));
  const name = productName || 'questo prodotto';

  // La lunghezza cresce solo includendo più testo di ciò che è stato realmente fornito.
  const descLimit = length === 'breve' ? 320 : length === 'lunga' ? 1400 : 700;
  const notesLimit = length === 'breve' ? 500 : length === 'lunga' ? 3000 : 1200;

  const description = productDescription?.trim()
    ? truncateFact(productDescription, descLimit)
    : '';
  const notes = customNotes?.trim() ? truncateFact(customNotes, notesLimit) : '';
  const answers = EXPERIENCE_ORDER
    .map((k) => experience?.[k]?.trim())
    .filter((v): v is string => !!v)
    .map(asSentence);

  const hasPersonalMaterial = !!notes || answers.length > 0;
  const ratingLine = `Valutazione: ${safeRating} su 5, ${RATING_PHRASE[safeRating]}.`;

  const results: ReviewFallbackResult[] = [];

  for (let i = 0; i < count; i++) {
    const paragraphs: string[] = [];

    const personalParagraphs: string[] = [];
    if (answers.length > 0) personalParagraphs.push(answers.join(' '));
    if (notes) personalParagraphs.push(notes);

    if (hasPersonalMaterial) {
      // Le varianti cambiano l'ordine di presentazione, non i contenuti.
      const descBlock = description ? [description] : [];
      if (i % 2 === 0) {
        paragraphs.push(...personalParagraphs, ...descBlock);
      } else {
        paragraphs.push(...descBlock, ...personalParagraphs);
      }
    } else if (description) {
      paragraphs.push(description);
    } else {
      paragraphs.push(
        `[DATO MANCANTE] Per ${name} non ci sono informazioni sufficienti: aggiungi note o risposte guidate per ottenere una bozza utile.`
      );
    }

    if (hasPersonalMaterial || description) paragraphs.push(ratingLine);

    const body = paragraphs.filter(Boolean).join('\n\n');
    const words = body.split(/\s+/).filter(Boolean).length;

    results.push({
      title: `${name}: bozza di recensione`,
      body,
      authenticityScore: 88,
      perceivedHighlights: [
        'Bozza generata dal motore locale istantaneo',
        hasPersonalMaterial ? 'Basata sui tuoi testi e sulla scheda prodotto' : 'Basata solo sulla scheda prodotto',
        `${words} parole`,
      ],
    });
  }

  return results;
}
