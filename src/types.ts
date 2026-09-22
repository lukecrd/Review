export interface ScrapedProduct {
  url: string;
  domain: string;
  title: string;
  description?: string;
  image?: string;
  price?: string;
  siteName?: string;
  categoryGuess?: string;
  rawTextSnippet?: string;
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

export interface ReviewOptions {
  productUrl: string;
  scrapedProduct?: ScrapedProduct | null;
  productName: string;
  productCategory: string;
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
  wordCount: number;
  readingTimeMinutes: number;
  authenticityScore: number;
  slopAudit?: SlopAuditResult;
  humanizerAudit?: HumanizerAuditResult;
  perceivedHighlights: string[];
  createdAt: string;
  rating: number;
  tone: ReviewTone;
  productName: string;
  productUrl?: string;
  productImage?: string;
}

export interface RefineRequest {
  originalReview: string;
  instruction: string;
  tone?: ReviewTone;
}

// ==========================================
// Blader Humanizer Protocol (blader/humanizer)
// ==========================================

export type HumanizerSection =
  | 'staging'     // Staging instead of stating
  | 'inflation'   // Inflation and borrowed authority
  | 'rhythm'      // Rhythm by rule
  | 'formatting'  // Formatting by rule
  | 'leftovers';  // Leftovers from the chat and the draft

export type HumanizerVoice =
  | 'personal'        // First-person, opinions, specific quirks, lived experiences
  | 'editorial'       // Measured, intellectual, crisp essay cadence
  | 'technical'       // Direct, neutral, plain, precise, zero fluff
  | 'conversational'  // Warm, colloquial, everyday phrasing
  | 'sample';         // Match provided user sample writing style

export interface HumanizerTell {
  id: string;
  section: HumanizerSection;
  sectionTitle: string;
  patternName: string;
  detectedText?: string;
  reason: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export interface HumanizerAuditResult {
  score: number; // 0-100 authenticity score (100 = completely human-sounding)
  isHumanLike: boolean;
  tellsCount: number;
  tells: HumanizerTell[];
  sectionBreakdown: Record<HumanizerSection, number>;
  summary: string;
}

export interface HumanizeRequest {
  text: string;
  voice: HumanizerVoice;
  customSample?: string; // Optional writing sample to match voice
  preserveFactsStrict?: boolean;
  intensity?: 'standard' | 'radical';
}

export interface HumanizeResponse {
  success: boolean;
  originalText: string;
  humanizedText: string;
  auditBefore: HumanizerAuditResult;
  auditAfter: HumanizerAuditResult;
  tellsRemovedCount: number;
  removedTellsSummary: string[];
  voiceUsed: HumanizerVoice;
  wordCountBefore: number;
  wordCountAfter: number;
  factsPreservedConfirmation: boolean;
  isFallback?: boolean;
}

