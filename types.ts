export interface ScrapedProduct {
  url: string;
  domain: string;
  title: string;
  brand?: string;
  description?: string;
  image?: string;
  price?: string;
  siteName?: string;
  categoryGuess?: string;
  rawTextSnippet?: string;
  keyFeatures?: string[];
  practicalQuirks?: string[];
}

export type ReviewTone = 
  | 'entusiasta'
  | 'equilibrato'
  | 'critico'
  | 'informale'
  | 'esperto'
  | 'pratico'
  | 'diretto';

export type TasteSkillPreset = 
  | 'editorial' 
  | 'tactile' 
  | 'direct' 
  | 'storytelling';

export type ReviewLength = 'breve' | 'media' | 'lunga';

export type ReviewFocusAspect = 
  | 'bilanciato'
  | 'prestazioni'
  | 'ergonomia'
  | 'durata_manutenzione'
  | 'valore';

export interface ReviewOptions {
  productUrl: string;
  scrapedProduct?: ScrapedProduct | null;
  productName: string;
  productCategory: string;
  productFeatures?: string[];
  productQuirks?: string[];
  focusAspect?: ReviewFocusAspect;
  rating: number; // 1 to 5
  tone: ReviewTone;
  tastePreset?: TasteSkillPreset;
  perspective: string; // e.g., 'Utente quotidiano', 'Genitore', 'Professionista'
  usageDuration: string; // e.g., '1 mese', '3 mesi'
  length: ReviewLength;
  language: string; // e.g., 'Italiano'
  customNotes?: string;
  variantsCount: number; // 1, 2, or 3
  noAiSlopStrict?: boolean;
}

export interface SlopPatternMatch {
  patternName: string;
  category: string;
  detectedText?: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SlopAuditResult {
  score: number; // 0-100 (100 = 100% slop free)
  isSlopFree: boolean;
  detectedPatterns: SlopPatternMatch[];
  summary: string;
}

export interface GeneratedReview {
  id: string;
  title: string;
  body: string;
  variantAngle?: string;
  wordCount: number;
  readingTimeMinutes: number;
  authenticityScore: number;
  slopAudit?: SlopAuditResult;
  perceivedHighlights: string[];
  discussedFeatures?: string[];
  createdAt: string;
  rating: number;
  tone: ReviewTone;
  productName: string;
  productUrl?: string;
  productImage?: string;
  isFallback?: boolean;
}

export interface RefineRequest {
  originalReview: string;
  instruction: string;
  tone?: ReviewTone;
}

