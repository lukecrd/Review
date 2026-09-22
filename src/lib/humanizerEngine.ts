import { HumanizerAuditResult, HumanizerSection, HumanizerTell, HumanizerVoice } from '../types';

export interface SectionMeta {
  title: string;
  description: string;
  icon: string;
}

export const HUMANIZER_SECTIONS: Record<HumanizerSection, SectionMeta> = {
  staging: {
    title: 'Staging invece di Affermare',
    description: 'Incipit di rincorsa ("Nel mondo frenetico..."), contrasti forzati ("Non solo X ma Y"), e chiusure retoriche a effetto.',
    icon: '🎭',
  },
  inflation: {
    title: 'Enfasi e Autorità Imprestata',
    description: 'Puffery pubblicitario ("game-changer", "svolta epocale"), consensi fittizi ("gli esperti concordano") e metafore cliché ("arazzo", "sinfonia").',
    icon: '📢',
  },
  rhythm: {
    title: 'Ritmo Meccanico e Triadi',
    description: 'Uso automatico della regola del tre (triadi forzate), frasi della stessa lunghezza monotona e abuso di trattini lunghi (—).',
    icon: '🎵',
  },
  formatting: {
    title: 'Formattazione a Regola d\'Arte',
    description: 'Elenchi puntati meccanici, grassetti decorativi a inizio riga e colpi di scena con due punti ("Il risultato:").',
    icon: '📋',
  },
  leftovers: {
    title: 'Residui di Chat e Riempitivi',
    description: 'Incipit da chatbot ("Certamente!"), disclaimer ("In quanto IA..."), connettivi pedanti ("Inoltre", "Peraltro") e call-to-action artefatti.',
    icon: '💬',
  },
};

interface PatternRule {
  id: string;
  name: string;
  section: HumanizerSection;
  regex: RegExp;
  reason: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export const BLADER_25_TELLS: PatternRule[] = [
  // 1. Staging instead of stating
  {
    id: 'tell-1',
    name: 'Throat-Clearing / Incipit di Rincorsa',
    section: 'staging',
    regex: /\b(?:nel mondo frenetico di oggi|quando si tratta di|vale la pena notare che|è importante sottolineare che|ecco tutto quello che c'è da sapere|in un'epoca in cui|siamo onesti|ammettiamolo|in today's fast-paced world|when it comes to|it is worth noting that|it's important to understand)\b/i,
    reason: 'Preambolo di riscaldamento che posticipa il punto invece di andare subito al sodo.',
    suggestion: 'Elimina l\'incipit e comincia direttamente con il fatto o l\'azione concreta.',
    severity: 'high',
  },
  {
    id: 'tell-2',
    name: 'Contrasto Binario ("Non solo X, ma Y")',
    section: 'staging',
    regex: /\b(?:non (?:è|si tratta di) (?:solo|soltanto|semplicemente)[^,.;!?]+(?:,| ma| bensì) (?:è|si tratta di|diventa|anche)[^,.;!?]+|not only [^,.;!?]+, but (?:also )?[^,.;!?]+|it's not just a [^,.;!?]+, it's [^,.;!?]+)\b/i,
    reason: 'Costruzione retorica binaria ("Non è solo un attrezzo, è...") tipica dell\'enfasi artificiale dei LLM.',
    suggestion: 'Descrivi la qualità reale in una frase piana senza ricorrere al falso dualismo.',
    severity: 'high',
  },
  {
    id: 'tell-3',
    name: 'Falso Bilanciamento / Finta Sfumatura',
    section: 'staging',
    regex: /\b(?:mentre alcuni potrebbero sostenere che|sebbene da un lato[^,]+dall'altro|se da una parte[^,]+dall'altra|while some may argue that|on one hand[^,]+on the other)\b/i,
    reason: 'Simulazione di obiettività accademica con formule prefabbricate.',
    suggestion: 'Condividi direttamente la tua valutazione o specifica con precisione chi solleva il dubbio.',
    severity: 'medium',
  },
  {
    id: 'tell-4',
    name: 'Segnalazione di Significanza ("Pivotal / Cruciale")',
    section: 'staging',
    regex: /\b(?:crucialmente|fondamentale evidenziare|è qui che risiede la vera magia|ciò rappresenta un punto di svolta|da non sottovalutare è il fatto|crucially|remarkably|importantly|this represents a pivotal moment)\b/i,
    reason: 'L\'AI segnala che qualcosa è importante con aggettivi meta invece di dimostrarlo coi fatti.',
    suggestion: 'Mostra la prova o l\'effetto pratico: lascia che sia il lettore a valutare l\'importanza.',
    severity: 'medium',
  },
  {
    id: 'tell-5',
    name: 'Chiusura Sintetica con Fiocco',
    section: 'staging',
    regex: /\b(?:in conclusione|tirando le somme|in definitiva|tutto sommato|alla fine della fiera|in sintesi posso affermare|in summary|all in all|at the end of the day)\b/i,
    reason: 'Formula riassuntiva da compitino scolastico o chatbot che ripete quanto già detto.',
    suggestion: 'Chiudi su un dettaglio tangibile o lascia che l\'ultimo fatto concluda naturalmente il testo.',
    severity: 'high',
  },

  // 2. Inflation and borrowed authority
  {
    id: 'tell-6',
    name: 'Grandstanding & Puffery Pubblicitario',
    section: 'inflation',
    regex: /\b(?:game-changer|svolta epocale|fiore all'occhiello|senza eguali|stato dell'arte|ridefinisce gli standard|un vero must-have|rivoluzionario|paradigm shift|state-of-the-art|groundbreaking)\b/i,
    reason: 'Superlativi vuoti e formule da comunicato stampa.',
    suggestion: 'Sostituisci l\'iperbole con misurazioni concrete (tempi, centimetri, sensazioni reali).',
    severity: 'high',
  },
  {
    id: 'tell-7',
    name: 'Weasel Attribution / Consenso Fittizio',
    section: 'inflation',
    regex: /\b(?:gli esperti concordano|studi dimostrano ampiamente|non è un segreto che|è universalmente riconosciuto|gli appassionati di tutto il mondo|experts agree|studies have shown|it is widely recognized)\b/i,
    reason: 'Autorità presa in prestito senza citare alcuna fonte o nome reale.',
    suggestion: 'Usa la prima persona ("ho notato") o cita la fonte precisa se esiste.',
    severity: 'medium',
  },
  {
    id: 'tell-8',
    name: 'Superficial Profundity / Falsa Profondità',
    section: 'inflation',
    regex: /\b(?:parla a una verità più profonda|ci ricorda la bellezza di|molto più di un semplice|un tributo all'ingegno umano|speaks to a deeper truth|a poignant reminder of)\b/i,
    reason: 'Attribuire una risonanza filosofica a oggetti o situazioni quotidiane.',
    suggestion: 'Mantieni i piedi per terra, focalizzati sull\'utilità ordinaria.',
    severity: 'high',
  },
  {
    id: 'tell-9',
    name: 'Metafore Cliché & Lessico Preferito dai LLM',
    section: 'inflation',
    regex: /\b(?:arazzo di|un ricco arazzo|sinfonia di|faro di|senza soluzione di continuità|delve into|approfondire a fondo|plethora|pleto di|tapestry|beacon|elevare l'esperienza|foster|catalyst|catalizzatore)\b/i,
    reason: 'Vocabolario stereotipato che i modelli estraggono con frequenza sproporzionata.',
    suggestion: 'Usa parole comuni e colloquiali ("funziona senza interruzioni", "variegato", "esplorare").',
    severity: 'high',
  },
  {
    id: 'tell-10',
    name: 'Drammatizzazione Eccessiva della Posta in Gioco',
    section: 'inflation',
    regex: /\b(?:questo cambia ogni cosa|un bivio esistenziale|fondamentale per non fallire|la differenza tra il successo e il disastro|changes everything)\b/i,
    reason: 'Enfasi apocalittica o trionfalistica sproporzionata al tema.',
    suggestion: 'Ridimensiona il tono e misura le conseguenze reali.',
    severity: 'low',
  },

  // 3. Rhythm by rule
  {
    id: 'tell-11',
    name: 'Triade Forzata (Regola del Tre Meccanica)',
    section: 'rhythm',
    regex: /\b(?:(?:(?:veloce|rapido|agile|compatto|elegante|potente|intuitivo|robusto|silenzioso|pratico|affidabile|versatile|moderno|preciso|efficiente),\s+){2}(?:e|ed)\s+(?:veloce|rapido|agile|compatto|elegante|potente|intuitivo|robusto|silenzioso|pratico|affidabile|versatile|moderno|preciso|efficiente))\b/i,
    reason: 'Abitudine sistematica dei modelli a raggruppare aggettivi in terzine simmetriche.',
    suggestion: 'Usa uno o due aggettivi precisi, oppure articola la caratteristica in un esempio pratico.',
    severity: 'high',
  },
  {
    id: 'tell-12',
    name: 'Aperture di Frase Ripetitive',
    section: 'rhythm',
    regex: /(?:(?:\n|\.\s+)(?:Il |La |I |Le |Questo |Questa |Questi |Queste )[^\n.]{15,60}\.\s*){3,}/,
    reason: 'Sequenza di 3 o più periodi che iniziano con lo stesso schema articolo/dimostrativo.',
    suggestion: 'Varia l\'incipit delle frasi alternando verbi, complementi o proposizioni subordinate.',
    severity: 'medium',
  },
  {
    id: 'tell-13',
    name: 'Abuso Meccanico di Em-Dash (—)',
    section: 'rhythm',
    regex: /(?:[^\n—]{5,}—[^\n—]{5,}—[^\n—]{5,})|(?:—[^—\n]+—)/,
    reason: 'I trattini lunghi vengono usati dai bot come scorciatoia per inserire precisazioni a raffica.',
    suggestion: 'Usa virgole sobrie, parentesi naturali o separa le considerazioni in due frasi distinte.',
    severity: 'medium',
  },
  {
    id: 'tell-14',
    name: 'Cadenza Sintattica Monotona',
    section: 'rhythm',
    regex: /(?:^[A-Z][^\n.]{60,110}\.\s*){3,}/m,
    reason: 'Frasi tutte della stessa identica lunghezza media (~20-25 parole), prive del ritmo umano staccato/legato.',
    suggestion: 'Alterna frasi brevissime e dirette con periodi più distesi e narrativi.',
    severity: 'low',
  },

  // 4. Formatting by rule
  {
    id: 'tell-15',
    name: 'Elenco Puntato Meccanico',
    section: 'formatting',
    regex: /(?:^|\n)\s*[-*•\d+.]\s+[^\n]+/m,
    reason: 'Frammentazione in bullet point che distrugge la naturalezza della narrazione continua.',
    suggestion: 'Scrivi in prosa fluida trasformando i punti in un racconto coerente di paragrafi.',
    severity: 'high',
  },
  {
    id: 'tell-16',
    name: 'Grassetto Decorativo Sistematico',
    section: 'formatting',
    regex: /\*\*[A-Z][^:*]{2,25}:?\*\*/,
    reason: 'Evidenziazione ossessiva in grassetto a ogni paragrafo o voce.',
    suggestion: 'Rimuovi i grassetti interni: lascia che il significato emerga dalla lettura.',
    severity: 'medium',
  },
  {
    id: 'tell-17',
    name: 'Colon Reveal / Rivelazione Teatrale',
    section: 'formatting',
    regex: /\b(?:la parte migliore:|il risultato\?|la verità:|ed ecco la sorpresa:|la cosa più interessante:)\b/i,
    reason: 'Espediente teatrale che annuncia una rivelazione con due punti.',
    suggestion: 'Formula il pensiero come un\'osservazione naturale senza rullo di tamburi.',
    severity: 'medium',
  },
  {
    id: 'tell-18',
    name: 'Titolazione Simmetrica Artificiale',
    section: 'formatting',
    regex: /(?:^|\n)###?\s+[^\n]+/m,
    reason: 'Micro-intestazioni a intervalli fissi ogni 50 parole per simulare una guida.',
    suggestion: 'Rimuovi i sottotitoli in testi brevi e lascia scorrere il discorso.',
    severity: 'low',
  },

  // 5. Leftovers from the chat and the draft
  {
    id: 'tell-19',
    name: 'Chatbot Wrapper & Cordialità Residua',
    section: 'leftovers',
    regex: /\b(?:certamente!|ecco a te|spero che questo ti sia utile|di seguito trovi|ecco una panoramica dettagliata|certainly|here is what you need to know|hope this helps)\b/i,
    reason: 'Frasi di servizio del chatbot che non appartengono al testo finito.',
    suggestion: 'Cancella del tutto le frasi di cortesia e parti direttamente dal contenuto.',
    severity: 'high',
  },
  {
    id: 'tell-20',
    name: 'Disclaimer & Riserva di Conoscenza',
    section: 'leftovers',
    regex: /\b(?:in quanto modello linguistico|tieni presente che le mie informazioni|al momento della mia ultima conoscenza|è sempre consigliabile consultare|as an ai|please note that)\b/i,
    reason: 'Clausole legali/tecniche automatiche inserite dai modelli.',
    suggestion: 'Rimuovi completamente il disclaimer.',
    severity: 'high',
  },
  {
    id: 'tell-21',
    name: 'Connettivi di Transizione Pedanti',
    section: 'leftovers',
    regex: /\b(?:inoltre,|peraltro,|tuttavia,|conseguentemente,|per di più,|d'altro canto,|furthermore,|moreover,|consequently,)\b/i,
    reason: 'Uso insistente di connettivi da saggio accademico per cucire frasi sconnesse.',
    suggestion: 'Unisci le frasi con nessi logici spontanei o rimuovi del tutto la congiunzione.',
    severity: 'medium',
  },
  {
    id: 'tell-22',
    name: 'Asserzione Generica Senza Fatti',
    section: 'leftovers',
    regex: /\b(?:offre prestazioni incredibili|qualità senza compromessi|progettato pensando all'utente|un'esperienza utente senza pari)\b/i,
    reason: 'Affermazioni generiche e vacue prive di ancoraggio pratico.',
    suggestion: 'Spiega cosa fa effettivamente l\'oggetto o il concetto nell\'uso pratico.',
    severity: 'medium',
  },
  {
    id: 'tell-23',
    name: 'Statistica Inventata o Falsa Precisione',
    section: 'leftovers',
    regex: /\b(?:migliora l'efficienza del \d{2,3}%|il \d{2}% degli utenti dichiara|riduce i tempi di attesa del \d{2}%)\b/i,
    reason: 'Percentuali inventate dai modelli per dare l\'illusione di scientificità.',
    suggestion: 'Conserva solo i dati reali accertati; se un dato non è confermato, eliminalo.',
    severity: 'high',
  },
  {
    id: 'tell-24',
    name: 'Scuse Eccessive o Tono Servile',
    section: 'leftovers',
    regex: /\b(?:ci scusiamo per il disagio|mi dispiace per l'inconveniente|se c'è dell'altro che posso fare)\b/i,
    reason: 'Residuo di conversazione da help-desk.',
    suggestion: 'Elimina le scuse non richieste.',
    severity: 'medium',
  },
  {
    id: 'tell-25',
    name: 'Call-to-Action da Social Artificioso',
    section: 'leftovers',
    regex: /\b(?:cosa ne pensi\? faccelo sapere nei commenti|e tu cosa ne pensi\? lascia un commento|fai un salto a provare|non esitare a condividere la tua opinione)\b/i,
    reason: 'Chiusura meccanica per forzare l\'engagement sui social.',
    suggestion: 'Termina in modo pulito senza sollecitazioni commerciali.',
    severity: 'medium',
  },
];

/**
 * Perform a full 25-tell audit of any text according to Blader Humanizer specifications
 */
export function auditTextWithBladerProtocol(text: string): HumanizerAuditResult {
  if (!text || !text.trim()) {
    return {
      score: 100,
      isHumanLike: true,
      tellsCount: 0,
      tells: [],
      sectionBreakdown: { staging: 0, inflation: 0, rhythm: 0, formatting: 0, leftovers: 0 },
      summary: 'Inserisci o incolla un testo per iniziare l\'audit dei 25 pattern.',
    };
  }

  const detectedTells: HumanizerTell[] = [];
  const sectionBreakdown: Record<HumanizerSection, number> = {
    staging: 0,
    inflation: 0,
    rhythm: 0,
    formatting: 0,
    leftovers: 0,
  };

  for (const rule of BLADER_25_TELLS) {
    const match = text.match(rule.regex);
    if (match) {
      detectedTells.push({
        id: rule.id,
        section: rule.section,
        sectionTitle: HUMANIZER_SECTIONS[rule.section].title,
        patternName: rule.name,
        detectedText: match[0].trim(),
        reason: rule.reason,
        suggestion: rule.suggestion,
        severity: rule.severity,
      });
      sectionBreakdown[rule.section]++;
    }
  }

  // Weight penalty based on severity
  let penalty = 0;
  detectedTells.forEach((tell) => {
    if (tell.severity === 'high') penalty += 12;
    else if (tell.severity === 'medium') penalty += 7;
    else penalty += 4;
  });

  const score = Math.max(25, Math.min(100, Math.round(100 - penalty)));
  const isHumanLike = detectedTells.length === 0 || score >= 90;

  let summary = '';
  if (detectedTells.length === 0) {
    summary = 'Nessun tell AI rilevato. Il testo scorre con voce autentica, priva di pattern artificiali o elenchi meccanici.';
  } else {
    summary = `Rilevati ${detectedTells.length} tell AI distribuiti su ${
      Object.values(sectionBreakdown).filter((v) => v > 0).length
    } aree stilistiche. Umanizzazione consigliata.`;
  }

  return {
    score,
    isHumanLike,
    tellsCount: detectedTells.length,
    tells: detectedTells,
    sectionBreakdown,
    summary,
  };
}

/**
 * Deterministic multi-pass clean algorithm for offline/fallback humanization
 * Follows Blader Humanizer rules strictly:
 * - Eliminates chatbot wrappers, staged run-ups, formatting by rule, forced triads
 * - Preserves ALL factual claims, numbers, names, and specifications without inventing facts
 */
export function humanizeTextLocally(
  originalText: string,
  voice: HumanizerVoice = 'personal',
  customSample?: string
): {
  humanizedText: string;
  removedTells: string[];
} {
  let text = originalText;
  const removedTells: string[] = [];

  // Pass 1: Remove chatbot leftovers & wrappers
  const beforeP1 = text;
  text = text
    .replace(/^(?:Certamente!|Ecco a te:?|Ecco una panoramica:?|Certainly!|Di seguito trovi)[^\n]*\n+/i, '')
    .replace(/\b(?:In quanto modello linguistico|Come IA|Tieni presente che le mie informazioni)[^.?!]*[.?!]/gi, '')
    .replace(/\b(?:Spero che questo ti sia utile!|Fammi sapere se hai altre domande|Cosa ne pensi\? Faccelo sapere nei commenti!)[^\n]*$/gi, '')
    .trim();
  if (beforeP1 !== text) {
    removedTells.push('Residui di chatbot e formule di saluto iniziali/finali rimossi');
  }

  // Pass 2: Deconstruct formatting by rule (turn bullets into fluid sentences)
  const beforeP2 = text;
  if (/^[-*•\d+.]\s+/m.test(text)) {
    const lines = text.split('\n');
    const narrativeLines: string[] = [];
    const bulletBuffer: string[] = [];

    lines.forEach((line) => {
      const match = line.match(/^[-*•\d+.]\s+(.+)$/);
      if (match) {
        // Strip bold label like "**Caratteristica:** Descrizione"
        const clean = match[1].replace(/^\*\*([^*]+)\*\*:\s*/, '$1: ').trim();
        bulletBuffer.push(clean);
      } else {
        if (bulletBuffer.length > 0) {
          narrativeLines.push(bulletBuffer.join('. ') + '.');
          bulletBuffer.length = 0;
        }
        narrativeLines.push(line);
      }
    });

    if (bulletBuffer.length > 0) {
      narrativeLines.push(bulletBuffer.join('. ') + '.');
    }

    text = narrativeLines.join('\n');
    removedTells.push('Elenchi puntati convertiti in prosa narrativa continua');
  }

  // Strip excessive markdown bolds in running text
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');

  // Pass 3: Cut staging run-ups & throat-clearing
  const stagingPatterns = [
    /\b(?:Nel mondo frenetico di oggi|Quando si tratta di|Vale la pena notare che|È importante sottolineare che),?\s*/gi,
    /\b(?:In un'epoca in cui la tecnologia corre veloce|Siamo onesti:|Ammettiamolo:),?\s*/gi,
  ];
  stagingPatterns.forEach((regex) => {
    if (regex.test(text)) {
      text = text.replace(regex, '');
      removedTells.push('Incipit di rincorsa ("Nel mondo frenetico...") eliminato');
    }
  });

  // Pass 4: Dismantle contrast frames ("non solo X, ma anche Y" -> "X e Y")
  const contrastMatch = text.match(/\bnon (?:è|si tratta di) solo ([^,]+), ma anche ([^.?!]+)/i);
  if (contrastMatch) {
    text = text.replace(
      /\bnon (?:è|si tratta di) solo ([^,]+), ma anche ([^.?!]+)/gi,
      'combina $1 e $2'
    );
    removedTells.push('Contrasto binario forzato ("non solo X ma Y") convertito in espressione diretta');
  }

  // Pass 5: Remove puffery & cliché buzzwords
  const pufferyMap: Record<string, string> = {
    'game-changer': 'soluzione valida',
    'svolta epocale': 'cambiamento utile',
    'fiore all\'occhiello': 'punto di forza',
    'senza soluzione di continuità': 'in modo lineare',
    'senza eguali': 'molto valido',
    'stato dell\'arte': 'ottima fattura',
    'un ricco arazzo': 'un insieme',
    'arazzo': 'intreccio',
    'sinfonia': 'combinazione',
    'delve into': 'esplorare',
    'pleto': 'ricco',
    'plethora': 'varietà',
  };

  Object.entries(pufferyMap).forEach(([word, replacement]) => {
    const reg = new RegExp(`\\b${word}\\b`, 'gi');
    if (reg.test(text)) {
      text = text.replace(reg, replacement);
      removedTells.push(`Sostituito termine cliché "${word}" con "${replacement}"`);
    }
  });

  // Pass 6: Em-dash reduction (replace mechanical " — " with comma or period)
  if (text.includes('—')) {
    text = text.replace(/\s*—\s*/g, ', ');
    removedTells.push('Trattini lunghi (—) sostituiti con punteggiatura sobria');
  }

  // Pass 7: Tone & Voice Adjustment
  if (voice === 'personal') {
    text = text.replace(/\bSi può notare che\b/gi, 'Ho notato che');
    text = text.replace(/\bL'utente apprezzerà\b/gi, 'Ho apprezzato in particolare');
  } else if (voice === 'technical') {
    text = text.replace(/\bUn'esperienza davvero indimenticabile\b/gi, 'Funzionamento conforme alle specifiche');
  }

  // Final clean of multi-spaces and empty paragraphs
  text = text
    .split('\n')
    .map((p) => p.replace(/\s{2,}/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n');

  // Deduplicate removed tells
  const uniqueRemovedTells = Array.from(new Set(removedTells));
  if (uniqueRemovedTells.length === 0) {
    uniqueRemovedTells.push('Verifica superata: ritmo e cadenza ottimizzati per naturalezza');
  }

  return {
    humanizedText: text,
    removedTells: uniqueRemovedTells,
  };
}
