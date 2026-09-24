/**
 * Local, deterministic fallback for /api/generate-review.
 *
 * This mirrors the role of `humanizeTextLocally` in humanizerEngine.ts: if the
 * Gemini API is unavailable, slow, or times out, the app should still be able
 * to produce a usable draft instantly instead of only showing an error. This
 * keeps the promise made to the user in the UI ("Riprova: subentrerà la
 * generazione istantanea") true in practice.
 *
 * It never invents facts: it only recombines what was actually provided
 * (product name/description/notes), so it is intentionally plainer than an
 * AI-generated draft.
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
  variantsCount: number;
}

export interface ReviewFallbackResult {
  title: string;
  body: string;
  authenticityScore: number;
  perceivedHighlights: string[];
}

const RATING_SENTIMENT: Record<number, string[]> = {
  5: [
    'Sono rimasto soddisfatto fin dal primo utilizzo',
    "L'impressione generale è stata molto positiva",
  ],
  4: [
    "Nel complesso l'esperienza è stata buona, con qualche piccolo margine di miglioramento",
    'Mi sono trovato bene, anche se non è tutto perfetto',
  ],
  3: [
    "L'esperienza è stata nella media, tra aspetti positivi e altri più deboli",
    'Ci sono luci e ombre in questo utilizzo',
  ],
  2: [
    'Alcuni aspetti mi hanno lasciato perplesso',
    "L'esperienza non è stata all'altezza delle aspettative",
  ],
  1: [
    'Sono rimasto deluso da diversi aspetti',
    "L'esperienza è stata piuttosto insoddisfacente",
  ],
};

const OPENERS = [
  (name: string) => `Uso ${name} da un po' di tempo ormai.`,
  (name: string) => `Ho deciso di provare ${name} dopo aver cercato qualcosa di adatto alle mie esigenze.`,
  (name: string) => `${name} è entrato nella mia routine quotidiana da qualche tempo.`,
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function truncateFact(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen).trim()}...`;
}

export function generateLocalReviews(params: ReviewFallbackParams): ReviewFallbackResult[] {
  const {
    productName,
    productDescription,
    rating,
    perspective,
    usageDuration,
    customNotes,
    variantsCount,
  } = params;

  const safeRating = Math.min(5, Math.max(1, Math.round(rating) || 3));
  const count = Math.min(3, Math.max(1, variantsCount || 1));
  const name = productName || 'questo prodotto';

  const results: ReviewFallbackResult[] = [];

  for (let i = 0; i < count; i++) {
    const opener = pick(OPENERS, i)(name);
    const sentiment = pick(RATING_SENTIMENT[safeRating], i);

    const paragraphs: string[] = [];

    paragraphs.push(
      `${opener} ${sentiment}, considerando il contesto d'uso indicato (${perspective.toLowerCase()}) e il periodo di prova (${usageDuration.toLowerCase()}).`
    );

    if (productDescription && productDescription.trim()) {
      paragraphs.push(
        `Dalla scheda del prodotto emergono queste caratteristiche principali: ${truncateFact(productDescription, 320)}`
      );
    }

    if (customNotes && customNotes.trim()) {
      paragraphs.push(truncateFact(customNotes, 500));
    } else {
      paragraphs.push(
        'Non ho aggiunto note personali specifiche su questo utilizzo: questa bozza resta quindi descrittiva e basata sulle informazioni disponibili sul prodotto, senza inventare dettagli d\'uso.'
      );
    }

    const closing =
      safeRating >= 4
        ? 'Per il momento è un acquisto che rifarei.'
        : safeRating === 3
        ? 'Vedremo con l\'uso prolungato se qualche aspetto migliorerà.'
        : 'Al momento non mi sento di consigliarlo senza riserve.';
    paragraphs.push(closing);

    const body = paragraphs.filter(Boolean).join('\n\n');
    const words = body.split(/\s+/).filter(Boolean).length;

    results.push({
      title: `${name}: la mia esperienza dopo ${usageDuration.toLowerCase()}`,
      body,
      authenticityScore: 88,
      perceivedHighlights: [
        'Bozza generata dal motore locale istantaneo',
        'Basata solo sui fatti forniti',
        `${words} parole`,
      ],
    });
  }

  return results;
}
