export type TasteThemeId = 'editorial' | 'swiss' | 'tactile' | 'obsidian' | 'monochrome';

export interface TasteThemeConfig {
  id: TasteThemeId;
  name: string;
  tagline: string;
  description: string;
  archetype: string;
  isDark: boolean;
  palettePreview: {
    bg: string;
    card: string;
    accent: string;
    text: string;
    border: string;
  };
  typography: {
    display: string;
    body: string;
    serif: string;
    ratio: string;
  };
  classes: {
    appBg: string;
    headerBg: string;
    headerBorder: string;
    cardBg: string;
    cardBorder: string;
    cardShadow: string;
    cardRadius: string;
    innerRadius: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    primaryBtn: string;
    secondaryBtn: string;
    badgeAccent: string;
    badgeNeutral: string;
    inputBg: string;
    inputBorder: string;
    inputText: string;
    paperBg: string;
    paperBorder: string;
    paperText: string;
    paperFont: string;
    highlightPill: string;
    activeTab: string;
    inactiveTab: string;
    divider: string;
  };
  tasteSkillPrinciples: string[];
}

export const TASTE_THEMES: Record<TasteThemeId, TasteThemeConfig> = {
  editorial: {
    id: 'editorial',
    name: 'Editorial Paper & Serif',
    tagline: "L'Artigiano delle Parole",
    description: "Ispirato all'editoria cartacea d'autore e ai saggi letterari. Carta calda, serif raffinato e accenti terracotta.",
    archetype: 'Editorial & Bookish Craft',
    isDark: false,
    palettePreview: {
      bg: '#FAF7F2',
      card: '#FFFFFF',
      accent: '#9C4121',
      text: '#1F1A16',
      border: '#EDE6DD',
    },
    typography: {
      display: "'Newsreader', 'Lora', serif",
      body: "'Plus Jakarta Sans', sans-serif",
      serif: "'Newsreader', 'Lora', serif",
      ratio: 'Major Third (1.25x)',
    },
    classes: {
      appBg: 'bg-[#FAF7F2] text-[#1F1A16]',
      headerBg: 'bg-[#FAF7F2]/90 backdrop-blur-md',
      headerBorder: 'border-[#EDE6DD]',
      cardBg: 'bg-white',
      cardBorder: 'border-[#EDE6DD]',
      cardShadow: 'shadow-[0_2px_12px_-4px_rgba(31,26,22,0.06)]',
      cardRadius: 'rounded-2xl',
      innerRadius: 'rounded-xl',
      textPrimary: 'text-[#1F1A16]',
      textSecondary: 'text-[#6B6056]',
      textMuted: 'text-[#9C9388]',
      primaryBtn: 'bg-[#9C4121] hover:bg-[#833519] text-white shadow-xs',
      secondaryBtn: 'bg-[#F4EFEA] hover:bg-[#EDE5DC] text-[#1F1A16] border border-[#EDE6DD]',
      badgeAccent: 'bg-[#FBF2ED] text-[#9C4121] border border-[#F3DFD5]',
      badgeNeutral: 'bg-[#F4EFEA] text-[#6B6056] border border-[#EDE6DD]',
      inputBg: 'bg-[#FBF9F6]',
      inputBorder: 'border-[#E6DDD2] focus:border-[#9C4121] focus:ring-[#9C4121]/15',
      inputText: 'text-[#1F1A16] placeholder-[#9C9388]',
      paperBg: 'bg-[#FFFDFB]',
      paperBorder: 'border-[#EDE6DD]',
      paperText: 'text-[#2C241D]',
      paperFont: 'font-serif',
      highlightPill: 'bg-[#F4EFEA] text-[#6B6056] border border-[#EDE6DD]',
      activeTab: 'bg-[#9C4121] text-white shadow-xs',
      inactiveTab: 'text-[#6B6056] hover:text-[#1F1A16]',
      divider: 'border-[#EDE6DD]',
    },
    tasteSkillPrinciples: [
      'Palette calda su carta naturale (#FAF7F2) con <3% saturazione',
      'Tipografia Newsreader/Lora con ritmo editoriale e tracking bilanciato',
      'Accento Terracotta (#9C4121) rigorosamente localizzato',
      'Formula raggi concentrici: Container r=16px, elementi interni r=12px',
    ],
  },

  swiss: {
    id: 'swiss',
    name: 'Swiss High-Density',
    tagline: 'Chiarezza Rigorosa & Modernismo',
    description: 'Precisione razionalista, griglie geometriche rigorose e contrasto cromatico ad alta leggibilità in stile modernista.',
    archetype: 'International Typographic / Precision',
    isDark: false,
    palettePreview: {
      bg: '#F8FAFC',
      card: '#FFFFFF',
      accent: '#2563EB',
      text: '#0F172A',
      border: '#E2E8F0',
    },
    typography: {
      display: "'Space Grotesk', -apple-system, sans-serif",
      body: "'Plus Jakarta Sans', sans-serif",
      serif: "'Lora', serif",
      ratio: 'Major Second (1.125x) - Alta densità',
    },
    classes: {
      appBg: 'bg-[#F8FAFC] text-[#0F172A]',
      headerBg: 'bg-white/95 backdrop-blur-md',
      headerBorder: 'border-[#E2E8F0]',
      cardBg: 'bg-white',
      cardBorder: 'border-[#E2E8F0]',
      cardShadow: 'shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]',
      cardRadius: 'rounded-xl',
      innerRadius: 'rounded-lg',
      textPrimary: 'text-[#0F172A]',
      textSecondary: 'text-[#475569]',
      textMuted: 'text-[#94A3B8]',
      primaryBtn: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs',
      secondaryBtn: 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#CBD5E1]',
      badgeAccent: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
      badgeNeutral: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
      inputBg: 'bg-[#F8FAFC]',
      inputBorder: 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/15',
      inputText: 'text-[#0F172A] placeholder-[#94A3B8]',
      paperBg: 'bg-white',
      paperBorder: 'border-[#E2E8F0]',
      paperText: 'text-[#1E293B]',
      paperFont: 'font-serif',
      highlightPill: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
      activeTab: 'bg-[#2563EB] text-white shadow-xs',
      inactiveTab: 'text-[#475569] hover:text-[#0F172A]',
      divider: 'border-[#E2E8F0]',
    },
    tasteSkillPrinciples: [
      'Griglia razionale ad alta densità informativa con divisori netti a 1px',
      'Font Space Grotesk + Plus Jakarta Sans con tracking compatto',
      'Blu Cobalto svizzero (#2563EB) per CTA e stati attivi',
      'Nessun gradiente o decorazione superflua: forma segue la funzione',
    ],
  },

  tactile: {
    id: 'tactile',
    name: 'Soft Tactile Studio',
    tagline: 'Morbido, Organico & Naturale',
    description: 'Materialità rilassante in tonalità pietra levigata e salvia nordico, con bordi ergonomici ampi e generoso respiro visivo.',
    archetype: 'Tactile Warm Material',
    isDark: false,
    palettePreview: {
      bg: '#F4F3EE',
      card: '#FFFFFF',
      accent: '#2F614C',
      text: '#282622',
      border: '#E6E4DC',
    },
    typography: {
      display: "'Outfit', 'Plus Jakarta Sans', sans-serif",
      body: "'Plus Jakarta Sans', sans-serif",
      serif: "'Newsreader', serif",
      ratio: 'Major Third (1.25x)',
    },
    classes: {
      appBg: 'bg-[#F4F3EE] text-[#282622]',
      headerBg: 'bg-[#F4F3EE]/95 backdrop-blur-md',
      headerBorder: 'border-[#E6E4DC]',
      cardBg: 'bg-white',
      cardBorder: 'border-[#E6E4DC]',
      cardShadow: 'shadow-[0_4px_20px_-4px_rgba(40,38,34,0.05)]',
      cardRadius: 'rounded-3xl',
      innerRadius: 'rounded-2xl',
      textPrimary: 'text-[#282622]',
      textSecondary: 'text-[#6E6A62]',
      textMuted: 'text-[#9C978D]',
      primaryBtn: 'bg-[#2F614C] hover:bg-[#244C3B] text-white shadow-xs',
      secondaryBtn: 'bg-[#ECEAE2] hover:bg-[#E2DFD4] text-[#282622] border border-[#DBD8CD]',
      badgeAccent: 'bg-[#EBF3EF] text-[#2F614C] border border-[#CFE2D8]',
      badgeNeutral: 'bg-[#ECEAE2] text-[#6E6A62] border border-[#E6E4DC]',
      inputBg: 'bg-[#FAF9F6]',
      inputBorder: 'border-[#DBD8CD] focus:border-[#2F614C] focus:ring-[#2F614C]/15',
      inputText: 'text-[#282622] placeholder-[#9C978D]',
      paperBg: 'bg-[#FCFBF8]',
      paperBorder: 'border-[#E6E4DC]',
      paperText: 'text-[#2C2924]',
      paperFont: 'font-serif',
      highlightPill: 'bg-[#ECEAE2] text-[#6E6A62] border border-[#E6E4DC]',
      activeTab: 'bg-[#2F614C] text-white shadow-xs',
      inactiveTab: 'text-[#6E6A62] hover:text-[#282622]',
      divider: 'border-[#E6E4DC]',
    },
    tasteSkillPrinciples: [
      'Tonalità pietra levigata e argilla naturale con contrasto rilassante',
      'Verde Salvia Nordico (#2F614C) organico per focus e azioni primarie',
      'Raggi morbidi ed ergonomici (24px esterni / 16px interni)',
      'Pulsanti tattili con padding proporzionale 2:1 per un tocco morbido',
    ],
  },

  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Luxury Dark',
    tagline: 'Nero Ossidiana & Titanio',
    description: 'Modalità notturna di lusso: base ossidiana blu-ardesia senza neri puri, bordi in titanio e contrasto riposante per gli occhi.',
    archetype: 'Subdued Premium Dark Mode',
    isDark: true,
    palettePreview: {
      bg: '#0B0F17',
      card: '#131B2A',
      accent: '#38BDF8',
      text: '#F1F5F9',
      border: '#212E45',
    },
    typography: {
      display: "'Space Grotesk', sans-serif",
      body: "'Plus Jakarta Sans', sans-serif",
      serif: "'Newsreader', serif",
      ratio: 'High Contrast (1.333x)',
    },
    classes: {
      appBg: 'bg-[#0B0F17] text-[#F1F5F9]',
      headerBg: 'bg-[#0B0F17]/95 backdrop-blur-md',
      headerBorder: 'border-[#1E293B]',
      cardBg: 'bg-[#121A29]',
      cardBorder: 'border-[#212E45]',
      cardShadow: 'shadow-[0_8px_30px_rgb(0,0,0,0.4)]',
      cardRadius: 'rounded-2xl',
      innerRadius: 'rounded-xl',
      textPrimary: 'text-[#F1F5F9]',
      textSecondary: 'text-[#94A3B8]',
      textMuted: 'text-[#64748B]',
      primaryBtn: 'bg-[#38BDF8] hover:bg-[#0284C7] text-[#0B0F17] font-bold shadow-xs',
      secondaryBtn: 'bg-[#1E293B] hover:bg-[#334155] text-[#F1F5F9] border border-[#334155]',
      badgeAccent: 'bg-[#0C2B45] text-[#38BDF8] border border-[#164E7A]',
      badgeNeutral: 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]',
      inputBg: 'bg-[#0F1624]',
      inputBorder: 'border-[#26354F] focus:border-[#38BDF8] focus:ring-[#38BDF8]/20',
      inputText: 'text-[#F1F5F9] placeholder-[#64748B]',
      paperBg: 'bg-[#162032]',
      paperBorder: 'border-[#26354F]',
      paperText: 'text-[#E2E8F0]',
      paperFont: 'font-serif',
      highlightPill: 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]',
      activeTab: 'bg-[#38BDF8] text-[#0B0F17] font-bold shadow-xs',
      inactiveTab: 'text-[#94A3B8] hover:text-[#F1F5F9]',
      divider: 'border-[#1E293B]',
    },
    tasteSkillPrinciples: [
      'Nessun nero puro #000000 né bagliori neon: base ossidiana blu-ardesia #0B0F17',
      'Luminosità Z-axis stratificata (bg #0B0F17 -> card #121A29 -> paper #162032)',
      'Bordi filiformi a 1px con evidenziazione metallica in titanio',
      'Pieno rispetto del contrasto WCAG AA per la lettura notturna',
    ],
  },

  monochrome: {
    id: 'monochrome',
    name: 'Nordic Monochrome',
    tagline: 'Puro Contrasto & Tipografia',
    description: 'Essenzialismo scandinavo in bianco e nero minerale, dove la gerarchia visiva è scolpita unicamente da ritmo e pesi dei font.',
    archetype: 'Editorial Black & White',
    isDark: false,
    palettePreview: {
      bg: '#F5F5F3',
      card: '#FFFFFF',
      accent: '#141413',
      text: '#141413',
      border: '#DCDCDA',
    },
    typography: {
      display: "'Space Grotesk', sans-serif",
      body: "'Plus Jakarta Sans', sans-serif",
      serif: "'Lora', serif",
      ratio: 'High Contrast (1.333x)',
    },
    classes: {
      appBg: 'bg-[#F5F5F3] text-[#141413]',
      headerBg: 'bg-[#F5F5F3]/95 backdrop-blur-md',
      headerBorder: 'border-[#DCDCDA]',
      cardBg: 'bg-white',
      cardBorder: 'border-[#DCDCDA]',
      cardShadow: 'shadow-[0_2px_8px_-2px_rgba(20,20,19,0.06)]',
      cardRadius: 'rounded-xl',
      innerRadius: 'rounded-lg',
      textPrimary: 'text-[#141413]',
      textSecondary: 'text-[#5E5E5A]',
      textMuted: 'text-[#8E8E8A]',
      primaryBtn: 'bg-[#141413] hover:bg-[#2A2A28] text-white shadow-xs',
      secondaryBtn: 'bg-[#EAEAE7] hover:bg-[#DFDFDC] text-[#141413] border border-[#DCDCDA]',
      badgeAccent: 'bg-[#141413] text-white border border-[#141413]',
      badgeNeutral: 'bg-[#EAEAE7] text-[#5E5E5A] border border-[#DCDCDA]',
      inputBg: 'bg-[#FAF9F7]',
      inputBorder: 'border-[#DCDCDA] focus:border-[#141413] focus:ring-[#141413]/10',
      inputText: 'text-[#141413] placeholder-[#8E8E8A]',
      paperBg: 'bg-white',
      paperBorder: 'border-[#DCDCDA]',
      paperText: 'text-[#1C1C1B]',
      paperFont: 'font-serif',
      highlightPill: 'bg-[#EAEAE7] text-[#5E5E5A] border border-[#DCDCDA]',
      activeTab: 'bg-[#141413] text-white shadow-xs',
      inactiveTab: 'text-[#5E5E5A] hover:text-[#141413]',
      divider: 'border-[#DCDCDA]',
    },
    tasteSkillPrinciples: [
      'Assenza di colori saturi: gerarchia espressa unicamente tramite peso dei font e contrasto',
      'Neutri nordici con sottotono minerale caldo (#F5F5F3 / #141413)',
      'Bordi puliti e proporzioni optical perfette',
      'Spaziature ritmiche e ampi margini negativi di respiro',
    ],
  },
};
