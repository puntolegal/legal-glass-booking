/**
 * Parser ultra-avanzado para contenido Markdown de Obsidian
 * Elimina completamente la sintaxis técnica y crea una red inteligente de conceptos
 */

export interface ParsedContent {
  title: string;
  sections: ParsedSection[];
  concepts: string[];
  metadata: {
    rama?: string;
    institucion?: string;
    conexiones?: string[];
    normativa?: string;
    difficulty?: string;
    category?: string;
  };
  summary: string;
  keyTerms: string[];
  relatedTopics: string[];
  rawContent: string; // Contenido completamente limpio para búsquedas
}

export interface ParsedSection {
  id: string;
  type: 'header' | 'text' | 'list' | 'quote' | 'code' | 'table' | 'metadata' | 'jurisprudencia' | 'doctrina' | 'examples' | 'definition' | 'legal-reference';
  level?: number;
  content: string;
  cleanContent: string; // Versión sin sintaxis para búsquedas
  items?: string[];
  icon?: string;
  className?: string;
  concepts?: string[];
  importance?: 'low' | 'medium' | 'high' | 'critical';
  points?: number;
}

// Base de conocimiento legal expandida para mejor detección
const LEGAL_KNOWLEDGE_BASE = {
  civilLaw: [
    'Acto Jurídico', 'Capacidad', 'Voluntad', 'Consentimiento', 'Objeto', 'Causa', 'Forma',
    'Nulidad', 'Rescisión', 'Resolución', 'Simulación', 'Lesión Enorme', 'Vicios del Consentimiento',
    'Error', 'Fuerza', 'Dolo', 'Representación', 'Mandato', 'Condición', 'Plazo', 'Modo',
    'Dominio', 'Posesión', 'Mera Tenencia', 'Copropiedad', 'Usufructo', 'Uso', 'Habitación',
    'Servidumbre', 'Prenda', 'Hipoteca', 'Tradición', 'Prescripción', 'Reivindicatoria',
    'Obligación', 'Contrato', 'Compraventa', 'Arrendamiento', 'Comodato', 'Mutuo', 'Depósito',
    'Sociedad', 'Patrimonio', 'Herencia', 'Sucesión', 'Testamento', 'Legado', 'Asignación'
  ],
  processualLaw: [
    'Jurisdicción', 'Competencia', 'Proceso', 'Procedimiento', 'Demanda', 'Contestación',
    'Prueba', 'Sentencia', 'Recurso', 'Apelación', 'Casación', 'Cosa Juzgada', 'Ejecución',
    'Medidas Cautelares', 'Tercerías', 'Incidentes', 'Notificación', 'Emplazamiento',
    'Tribunal', 'Juez', 'Parte', 'Citación', 'Comparecencia', 'Rebeldía'
  ],
  criminalLaw: [
    'Delito', 'Falta', 'Dolo', 'Culpa', 'Tentativa', 'Consumación', 'Participación',
    'Autoría', 'Complicidad', 'Encubrimiento', 'Legítima Defensa', 'Estado de Necesidad',
    'Pena', 'Sanción', 'Ministerio Público', 'Querella', 'Denuncia'
  ],
  constitutionalLaw: [
    'Constitución', 'Derechos Fundamentales', 'Garantías', 'Recurso de Protección',
    'Tribunal Constitucional', 'Control de Constitucionalidad', 'Estado de Derecho',
    'División de Poderes', 'Soberanía', 'Ciudadanía'
  ],
  laboralLaw: [
    'Contrato de Trabajo', 'Jornada', 'Remuneración', 'Despido', 'Indemnización',
    'Sindicato', 'Negociación Colectiva', 'Huelga', 'Fuero Laboral', 'Seguridad Social'
  ]
};

const ALL_LEGAL_TERMS = [
  ...LEGAL_KNOWLEDGE_BASE.civilLaw,
  ...LEGAL_KNOWLEDGE_BASE.processualLaw,
  ...LEGAL_KNOWLEDGE_BASE.criminalLaw,
  ...LEGAL_KNOWLEDGE_BASE.constitutionalLaw,
  ...LEGAL_KNOWLEDGE_BASE.laboralLaw
];

/**
 * Parsea contenido de Obsidian eliminando TODA la sintaxis técnica
 */
export function parseObsidianContent(content: string): ParsedContent {
  const lines = content.split('\n');
  const sections: ParsedSection[] = [];
  const concepts: string[] = [];
  const keyTerms: string[] = [];
  const relatedTopics: string[] = [];
  let metadata: any = {};
  let title = '';
  let summary = '';
  
  let currentSection: ParsedSection | null = null;
  let isInCodeBlock = false;
  let isInMetadata = false;
  
  // Primera pasada: extraer conceptos antes de limpiar
  const allText = content.toLowerCase();
  ALL_LEGAL_TERMS.forEach(term => {
    if (allText.includes(term.toLowerCase()) && !concepts.includes(term)) {
      concepts.push(term);
    }
  });
  
  // Extraer conceptos de links internos [[concepto]]
  const conceptRegex = /\[\[([^\]]+)\]\]/g;
  let match;
  while ((match = conceptRegex.exec(content)) !== null) {
    const concept = cleanText(match[1]).trim();
    if (concept.length > 2 && !concepts.includes(concept)) {
      concepts.push(concept);
    }
  }
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Detectar título principal
    if (line.match(/^#\s+/) && !title) {
      title = extractCleanTitle(line);
      continue;
    }
    
    // Detectar metadatos
    if (line.includes('Metadatos') || line.includes('📋')) {
      isInMetadata = true;
      continue;
    }
    
    if (isInMetadata && line.startsWith('- ')) {
      processMetadata(line, metadata, relatedTopics);
      continue;
    }
    
    if (isInMetadata && (line.startsWith('##') || line === '')) {
      isInMetadata = false;
    }
    
    // Detectar bloques de código
    if (line.startsWith('```')) {
      isInCodeBlock = !isInCodeBlock;
      if (isInCodeBlock) {
        currentSection = createCodeSection();
      } else if (currentSection) {
        sections.push(currentSection);
        currentSection = null;
      }
      continue;
    }
    
    if (isInCodeBlock && currentSection) {
      currentSection.content += cleanText(line) + '\n';
      currentSection.cleanContent += cleanText(line) + '\n';
      continue;
    }
    
    // Headers
    if (line.match(/^#{2,6}\s/)) {
      if (currentSection) {
        sections.push(enhanceSection(currentSection, concepts, keyTerms));
      }
      
      const level = line.match(/^#+/)?.[0].length || 2;
      const headerText = extractCleanTitle(line.replace(/^#+\s*/, ''));
      
      currentSection = createHeaderSection(headerText, level);
      continue;
    }
    
    // Listas
    if (line.match(/^\s*[-*+]\s/) || line.match(/^\s*\d+\.\s/)) {
      if (!currentSection || currentSection.type !== 'list') {
        if (currentSection) sections.push(enhanceSection(currentSection, concepts, keyTerms));
        currentSection = createListSection();
      }
      
      const listItem = cleanText(line.replace(/^\s*[-*+\d.]\s*/, ''));
      if (listItem) {
        currentSection.items?.push(listItem);
        extractConceptsFromText(listItem, concepts, keyTerms);
      }
      continue;
    }
    
    // Citas
    if (line.startsWith('>')) {
      if (currentSection) sections.push(enhanceSection(currentSection, concepts, keyTerms));
      const quoteText = cleanText(line.slice(1).trim());
      currentSection = createQuoteSection(quoteText);
      extractConceptsFromText(quoteText, concepts, keyTerms);
      continue;
    }
    
    // Líneas vacías
    if (!line) {
      if (currentSection) {
        sections.push(enhanceSection(currentSection, concepts, keyTerms));
        currentSection = null;
      }
      continue;
    }
    
    // Texto normal
    if (!currentSection || currentSection.type !== 'text') {
      if (currentSection) sections.push(enhanceSection(currentSection, concepts, keyTerms));
      currentSection = createTextSection();
    }
    
    const cleanLine = cleanText(line);
    if (cleanLine) {
      currentSection.content += (currentSection.content ? ' ' : '') + cleanLine;
      currentSection.cleanContent += (currentSection.cleanContent ? ' ' : '') + cleanLine;
      extractConceptsFromText(cleanLine, concepts, keyTerms);
    }
  }
  
  // Agregar la última sección
  if (currentSection) {
    sections.push(enhanceSection(currentSection, concepts, keyTerms));
  }
  
  // Generar resumen automático
  summary = generateSummary(sections, title);
  
  // Filtrar y optimizar secciones
  const processedSections = sections
    .filter(section => section.content.trim() || section.items?.length)
    .map(section => classifyAndOptimizeSection(section));
  
  // Crear contenido completamente limpio para búsquedas
  const rawContent = processedSections
    .map(s => s.cleanContent || s.content)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    title: title || 'Concepto Legal',
    sections: processedSections,
    concepts: optimizeConcepts(concepts),
    metadata,
    summary,
    keyTerms: optimizeKeyTerms(keyTerms),
    relatedTopics: optimizeRelatedTopics(relatedTopics),
    rawContent
  };
}

/**
 * Limpia COMPLETAMENTE el texto de cualquier sintaxis técnica
 */
function cleanText(text: string): string {
  return text
    // Remover TODOS los enlaces internos [[texto]]
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    // Remover TODAS las negritas **texto** y __texto__
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    // Remover TODAS las cursivas *texto* y _texto_
    .replace(/\*([^*\s][^*]*[^*\s])\*/g, '$1')
    .replace(/_([^_\s][^_]*[^_\s])_/g, '$1')
    // Remover código `texto`
    .replace(/`([^`]+)`/g, '$1')
    // Remover enlaces externos [texto](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remover comentarios HTML
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remover etiquetas HTML
    .replace(/<[^>]+>/g, '')
    // Remover símbolos de metadatos y listas
    .replace(/^[-*+]\s*/, '')
    .replace(/^\d+\.\s*/, '')
    // Remover emojis del inicio de línea
    .replace(/^[📋💡📖🎯📑⚖️📚🔄📊📝🔍]\s*/, '')
    // Remover dos puntos del final si están solos
    .replace(/:\s*$/, '')
    // Limpiar espacios múltiples
    .replace(/\s+/g, ' ')
    // Remover caracteres especiales problemáticos pero conservar puntuación
    .replace(/[^\w\s.,;:!?()áéíóúñÁÉÍÓÚÑ\-]/g, '')
    .trim();
}

/**
 * Extrae título limpio de headers
 */
function extractCleanTitle(text: string): string {
  return cleanText(text)
    .replace(/^#+\s*/, '')
    .replace(/\s*#+\s*$/, '')
    .trim();
}

/**
 * Extrae conceptos de un texto usando IA y base de conocimiento
 */
function extractConceptsFromText(text: string, concepts: string[], keyTerms: string[]): void {
  // Buscar términos legales conocidos
  ALL_LEGAL_TERMS.forEach(term => {
    if (text.toLowerCase().includes(term.toLowerCase())) {
      if (!concepts.includes(term)) {
        concepts.push(term);
      }
    }
  });
  
  // Detectar patrones de conceptos legales
  const legalPatterns = [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Civil|Penal|Procesal|Constitucional)\b/g,
    /\b(?:Art\.|Artículo)\s+\d+[^\s]*\s+([A-Z]{2,})\b/g,
    /\b([A-Z][a-z]+(?:\s+de\s+[A-Z][a-z]+)*)\s+(?:es|son|significa|implica)\b/g
  ];
  
  legalPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const concept = match[1].trim();
      if (concept.length > 3 && !concepts.includes(concept)) {
        concepts.push(concept);
      }
    }
  });
  
  // Extraer términos clave (palabras importantes capitalizadas)
  const keyTermPattern = /\b[A-Z][a-z]{3,}(?:\s+[A-Z][a-z]+)*\b/g;
  let match;
  while ((match = keyTermPattern.exec(text)) !== null) {
    const term = match[0].trim();
    if (term.length > 3 && !keyTerms.includes(term) && !isCommonWord(term)) {
      keyTerms.push(term);
    }
  }
}

/**
 * Procesa metadatos y extrae información útil
 */
function processMetadata(line: string, metadata: any, relatedTopics: string[]): void {
  const metaLine = cleanText(line.slice(2));
  if (metaLine.includes(':')) {
    const [key, value] = metaLine.split(':').map(s => s.trim());
    const cleanKey = key.toLowerCase().replace(/\s+/g, '');
    const cleanValue = cleanText(value);
    
    if (cleanKey.includes('conexion') || cleanKey.includes('relacion')) {
      // Extraer conceptos de las conexiones
      const connectionConcepts = cleanValue.split(',').map(c => cleanText(c.trim())).filter(c => c.length > 1);
      relatedTopics.push(...connectionConcepts);
    } else {
      metadata[cleanKey] = cleanValue;
    }
  }
}

/**
 * Crea secciones especializadas
 */
function createHeaderSection(text: string, level: number): ParsedSection {
  const importance = level <= 2 ? 'critical' : level <= 3 ? 'high' : level <= 4 ? 'medium' : 'low';
  const points = level <= 2 ? 15 : level <= 3 ? 12 : level <= 4 ? 8 : 5;
  
  return {
    id: generateId(),
    type: 'header',
    level,
    content: text,
    cleanContent: text, // No limpiar el contenido del header
    importance,
    points,
    concepts: [],
    className: getHeaderClassName(text, level)
  };
}

function createTextSection(): ParsedSection {
  return {
    id: generateId(),
    type: 'text',
    content: '',
    cleanContent: '', // No limpiar el contenido del texto
    importance: 'medium',
    points: 3,
    concepts: [],
    className: 'text-gray-700 dark:text-gray-300 leading-relaxed'
  };
}

function createListSection(): ParsedSection {
  return {
    id: generateId(),
    type: 'list',
    content: '',
    cleanContent: '', // No limpiar el contenido de la lista
    items: [],
    importance: 'medium',
    points: 8,
    concepts: [],
    className: 'space-y-2'
  };
}

function createQuoteSection(text: string): ParsedSection {
  return {
    id: generateId(),
    type: 'quote',
    content: text,
    cleanContent: text, // No limpiar el contenido de la cita
    importance: 'high',
    points: 10,
    concepts: [],
    className: 'border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-r-lg'
  };
}

function createCodeSection(): ParsedSection {
  return {
    id: generateId(),
    type: 'code',
    content: '',
    cleanContent: '',
    importance: 'high',
    points: 15,
    concepts: [],
    className: 'schema-section'
  };
}

/**
 * Mejora una sección con conceptos extraídos
 */
function enhanceSection(section: ParsedSection, concepts: string[], keyTerms: string[]): ParsedSection {
  // Extraer conceptos específicos de esta sección
  const sectionConcepts: string[] = [];
  const text = section.content + (section.items?.join(' ') || '');
  
  extractConceptsFromText(text, sectionConcepts, keyTerms);
  section.concepts = sectionConcepts;
  
  return section;
}

/**
 * Clasifica y optimiza secciones según su contenido
 */
function classifyAndOptimizeSection(section: ParsedSection): ParsedSection {
  const content = section.content?.toLowerCase() || '';
  
  // Detectar secciones especiales
  if (content.includes('corte suprema') || content.includes('tribunal') || content.includes('sentencia')) {
    return {
      ...section,
      type: 'jurisprudencia',
      importance: 'critical',
      points: 20,
      className: 'p-6 bg-gradient-to-r from-amber-50/70 to-orange-50/70 dark:from-amber-950/30 dark:to-orange-950/30 border-l-4 border-amber-500 rounded-r-xl backdrop-blur-sm',
      icon: '⚖️'
    };
  }
  
  if (content.includes('alessandri') || content.includes('claro solar') || content.includes('somarriva')) {
    return {
      ...section,
      type: 'doctrina',
      importance: 'high',
      points: 15,
      className: 'p-6 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/30 dark:to-teal-950/30 border-l-4 border-emerald-500 rounded-r-xl backdrop-blur-sm',
      icon: '📚'
    };
  }
  
  if (content.includes('definición') || content.includes('concepto')) {
    return {
      ...section,
      type: 'definition',
      importance: 'critical',
      points: 25,
      className: 'p-6 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 border-l-4 border-blue-500 rounded-r-xl backdrop-blur-sm',
      icon: '💡'
    };
  }
  
  if (content.includes('ejemplo') || content.includes('caso práctico')) {
    return {
      ...section,
      type: 'examples',
      importance: 'high',
      points: 20,
      className: 'p-6 bg-gradient-to-r from-violet-50/70 to-purple-50/70 dark:from-violet-950/30 dark:to-purple-950/30 border-l-4 border-violet-500 rounded-r-xl backdrop-blur-sm',
      icon: '📝'
    };
  }
  
  return section;
}

/**
 * Obtiene clase CSS para headers
 */
function getHeaderClassName(text: string, level: number): string {
  const baseClass = 'font-bold border-l-4 pl-4 py-3 rounded-r-lg backdrop-blur-sm';
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('definición') || lowerText.includes('concepto')) {
    return `${baseClass} text-xl border-blue-500 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 text-blue-800 dark:text-blue-200`;
  }
  
  const levelStyles = {
    2: 'text-xl border-gray-400 bg-gradient-to-r from-gray-50/50 to-slate-50/50 dark:from-gray-950/30 dark:to-slate-950/30',
    3: 'text-lg border-gray-400 bg-gradient-to-r from-gray-50/40 to-slate-50/40 dark:from-gray-950/25 dark:to-slate-950/25',
    4: 'text-base border-gray-300 bg-gradient-to-r from-gray-50/30 to-slate-50/30 dark:from-gray-950/20 dark:to-slate-950/20'
  };
  
  const style = levelStyles[level as keyof typeof levelStyles] || levelStyles[4];
  return `${baseClass} ${style} text-gray-800 dark:text-gray-200`;
}

/**
 * Optimiza la lista de conceptos eliminando duplicados y mejorando relevancia
 */
function optimizeConcepts(concepts: string[]): string[] {
  return [...new Set(concepts)]
    .filter(concept => concept.length > 2)
    .sort((a, b) => ALL_LEGAL_TERMS.includes(a) ? -1 : ALL_LEGAL_TERMS.includes(b) ? 1 : 0)
    .slice(0, 12); // Límite para mejor rendimiento
}

/**
 * Optimiza términos clave
 */
function optimizeKeyTerms(keyTerms: string[]): string[] {
  return [...new Set(keyTerms)]
    .filter(term => term.length > 3 && !isCommonWord(term))
    .slice(0, 8);
}

/**
 * Optimiza tópicos relacionados
 */
function optimizeRelatedTopics(relatedTopics: string[]): string[] {
  return [...new Set(relatedTopics)]
    .filter(topic => topic.length > 2)
    .slice(0, 6);
}

/**
 * Genera un resumen automático del contenido
 */
function generateSummary(sections: ParsedSection[], title: string): string {
  const textSections = sections.filter(s => s.type === 'text' || s.type === 'definition');
  if (textSections.length === 0) return `Resumen de ${title}`;
  
  const firstText = textSections[0]?.content || '';
  const words = firstText.split(' ').slice(0, 25).join(' ');
  return words + (words.length < firstText.length ? '...' : '');
}

/**
 * Verifica si una palabra es común (no es un término legal específico)
 */
function isCommonWord(word: string): boolean {
  const commonWords = [
    'Para', 'Con', 'Sin', 'Por', 'En', 'De', 'La', 'El', 'Los', 'Las',
    'Una', 'Un', 'Es', 'Son', 'Que', 'Se', 'No', 'Si', 'Como', 'Cuando',
    'Donde', 'Porque', 'Aunque', 'Mientras', 'Durante', 'Antes', 'Después'
  ];
  return commonWords.includes(word);
}

/**
 * Genera un ID único para las secciones
 */
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export default {
  parseObsidianContent,
  cleanText,
  optimizeConcepts,
  ALL_LEGAL_TERMS
}; 