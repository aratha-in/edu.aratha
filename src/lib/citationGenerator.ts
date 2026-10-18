import { CitationInput, CitationStyle } from '@/types';

// Helper to format authors list
function formatAuthors(authors: string[], style: CitationStyle): string {
  if (!authors || authors.length === 0) return 'Anonymous';
  const clean = authors.filter(Boolean);
  if (clean.length === 0) return 'Anonymous';

  if (style === 'apa') {
    if (clean.length === 1) return clean[0];
    if (clean.length === 2) return `${clean[0]} & ${clean[1]}`;
    if (clean.length <= 20) {
      return `${clean.slice(0, -1).join(', ')}, & ${clean[clean.length - 1]}`;
    }
    return `${clean.slice(0, 19).join(', ')}... ${clean[clean.length - 1]}`;
  }

  if (style === 'mla') {
    if (clean.length === 1) return clean[0];
    if (clean.length === 2) return `${clean[0]}, and ${clean[1]}`;
    return `${clean[0]}, et al.`;
  }

  if (style === 'harvard') {
    if (clean.length === 1) return clean[0];
    if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
    return `${clean[0]} et al.`;
  }

  if (style === 'chicago') {
    if (clean.length === 1) return clean[0];
    if (clean.length === 2) return `${clean[0]}, and ${clean[1]}`;
    if (clean.length === 3) return `${clean[0]}, ${clean[1]}, and ${clean[2]}`;
    return `${clean[0]} et al.`;
  }

  if (style === 'ieee') {
    return clean.join(', ');
  }

  if (style === 'vancouver') {
    return clean.slice(0, 6).join(', ') + (clean.length > 6 ? ', et al.' : '');
  }

  return clean.join(', ');
}

export function generateCitation(input: CitationInput): {
  reference: string;
  inText: string;
  bibtex: string;
  ris: string;
} {
  const {
    style,
    title,
    authors,
    year,
    sourceTitle,
    volume,
    issue,
    pages,
    publisher,
    doi,
    url
  } = input;

  const authorFormatted = formatAuthors(authors, style);
  const cleanTitle = title.trim();
  const cleanYear = year ? year.trim() : 'n.d.';
  const doiUrl = doi ? (doi.startsWith('http') ? doi : `https://doi.org/${doi}`) : '';
  const effectiveUrl = doiUrl || url || '';

  let reference = '';
  let inText = '';

  // 1. APA 7th Edition
  if (style === 'apa') {
    let containerPart = sourceTitle ? `*${sourceTitle}*` : '';
    if (volume) containerPart += `, *${volume}*`;
    if (issue) containerPart += `(${issue})`;
    if (pages) containerPart += `, ${pages}`;

    reference = `${authorFormatted} (${cleanYear}). ${cleanTitle}.${containerPart ? ` ${containerPart}.` : ''}${effectiveUrl ? ` ${effectiveUrl}` : ''}`;
    
    // In-text APA
    const firstAuthor = authors[0]?.split(',')[0] || 'Unknown';
    if (authors.length === 1) {
      inText = `(${firstAuthor}, ${cleanYear})`;
    } else if (authors.length === 2) {
      const secondAuthor = authors[1]?.split(',')[0] || 'Author';
      inText = `(${firstAuthor} & ${secondAuthor}, ${cleanYear})`;
    } else {
      inText = `(${firstAuthor} et al., ${cleanYear})`;
    }
  }

  // 2. MLA 9th Edition
  else if (style === 'mla') {
    let details = '';
    if (sourceTitle) details += `*${sourceTitle}*`;
    if (volume) details += `, vol. ${volume}`;
    if (issue) details += `, no. ${issue}`;
    if (cleanYear !== 'n.d.') details += `, ${cleanYear}`;
    if (pages) details += `, pp. ${pages}`;

    reference = `${authorFormatted}. "${cleanTitle}." ${details}.${effectiveUrl ? ` ${effectiveUrl}.` : ''}`;

    const firstAuthor = authors[0]?.split(',')[0] || 'Unknown';
    inText = `(${firstAuthor}${pages ? ` ${pages.split('-')[0]}` : ''})`;
  }

  // 3. Harvard
  else if (style === 'harvard') {
    let details = '';
    if (sourceTitle) details += `*${sourceTitle}*`;
    if (volume) details += `, ${volume}`;
    if (issue) details += `(${issue})`;
    if (pages) details += `, pp. ${pages}`;

    reference = `${authorFormatted} (${cleanYear}) '${cleanTitle}', ${details}.${effectiveUrl ? ` Available at: ${effectiveUrl}` : ''}`;

    const firstAuthor = authors[0]?.split(',')[0] || 'Unknown';
    if (authors.length <= 2) {
      inText = `(${authorFormatted}, ${cleanYear})`;
    } else {
      inText = `(${firstAuthor} et al., ${cleanYear})`;
    }
  }

  // 4. Chicago (Author-Date)
  else if (style === 'chicago') {
    let details = '';
    if (sourceTitle) details += `*${sourceTitle}*`;
    if (volume) details += ` ${volume}`;
    if (issue) details += `, no. ${issue}`;
    if (pages) details += `: ${pages}`;

    reference = `${authorFormatted}. ${cleanYear}. "${cleanTitle}." ${details}.${effectiveUrl ? ` ${effectiveUrl}.` : ''}`;

    const firstAuthor = authors[0]?.split(',')[0] || 'Unknown';
    inText = `(${firstAuthor} ${cleanYear})`;
  }

  // 5. IEEE
  else if (style === 'ieee') {
    let details = '';
    if (sourceTitle) details += `*${sourceTitle}*`;
    if (volume) details += `, vol. ${volume}`;
    if (issue) details += `, no. ${issue}`;
    if (pages) details += `, pp. ${pages}`;
    if (cleanYear !== 'n.d.') details += `, ${cleanYear}`;

    reference = `[1] ${authorFormatted}, "${cleanTitle}," ${details}.${effectiveUrl ? ` doi: ${doi || effectiveUrl}.` : ''}`;
    inText = `[1]`;
  }

  // 6. Vancouver
  else if (style === 'vancouver') {
    let details = '';
    if (sourceTitle) details += `${sourceTitle}.`;
    if (cleanYear !== 'n.d.') details += ` ${cleanYear};`;
    if (volume) details += `${volume}`;
    if (issue) details += `(${issue})`;
    if (pages) details += `:${pages}`;

    reference = `1. ${authorFormatted}. ${cleanTitle}. ${details}.${effectiveUrl ? ` Available from: ${effectiveUrl}` : ''}`;
    inText = `(1)`;
  }

  // Generate BibTeX
  const citeKey = `${(authors[0]?.split(',')[0] || 'author').toLowerCase().replace(/[^a-z0-9]/g, '')}${cleanYear !== 'n.d.' ? cleanYear : '2026'}`;
  const bibtex = `@article{${citeKey},
  author    = {${authors.join(' and ')}},
  title     = {${cleanTitle}},
  journal   = {${sourceTitle || publisher || 'Unknown'}},
  year      = {${cleanYear}},
  ${volume ? `volume    = {${volume}},` : ''}
  ${issue ? `number    = {${issue}},` : ''}
  ${pages ? `pages     = {${pages}},` : ''}
  ${doi ? `doi       = {${doi}},` : ''}
  ${url ? `url       = {${url}},` : ''}
}`;

  // Generate RIS
  const risLines = [
    'TY  - JOUR',
    ...authors.map(a => `AU  - ${a}`),
    `TI  - ${cleanTitle}`,
    sourceTitle ? `JO  - ${sourceTitle}` : '',
    publisher ? `PB  - ${publisher}` : '',
    cleanYear !== 'n.d.' ? `PY  - ${cleanYear}` : '',
    volume ? `VL  - ${volume}` : '',
    issue ? `IS  - ${issue}` : '',
    pages ? `SP  - ${pages.split('-')[0]}` : '',
    pages && pages.includes('-') ? `EP  - ${pages.split('-')[1]}` : '',
    doi ? `DO  - ${doi}` : '',
    url ? `UR  - ${url}` : '',
    'ER  - '
  ].filter(Boolean);

  const ris = risLines.join('\n');

  return {
    reference,
    inText,
    bibtex,
    ris
  };
}
