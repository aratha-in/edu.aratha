import { CitationInput } from '@/types';

export function normalizeDoi(raw: string): string {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
  cleaned = cleaned.replace(/^doi:\s*/i, '');
  return cleaned;
}

export async function fetchCrossrefMetadata(rawDoi: string): Promise<Partial<CitationInput> | null> {
  const doi = normalizeDoi(rawDoi);
  if (!doi || !doi.includes('/')) return null;

  try {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: {
        'User-Agent': 'EduArathaAcademicCitation/1.0 (mailto:research@edu.aratha.org)'
      }
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const item = data.message;
    if (!item) return null;

    // Authors
    const authors: string[] = (item.author || []).map((a: { given?: string; family?: string; name?: string }) => {
      if (a.family && a.given) {
        return `${a.family}, ${a.given}`;
      }
      return a.family || a.name || 'Unknown Author';
    });

    // Year
    let year = '';
    if (item.published?.['date-parts']?.[0]?.[0]) {
      year = String(item.published['date-parts'][0][0]);
    } else if (item['published-print']?.['date-parts']?.[0]?.[0]) {
      year = String(item['published-print']['date-parts'][0][0]);
    } else if (item['published-online']?.['date-parts']?.[0]?.[0]) {
      year = String(item['published-online']['date-parts'][0][0]);
    }

    // Title
    const title = Array.isArray(item.title) ? item.title[0] : item.title || '';

    // Container / Journal
    const sourceTitle = Array.isArray(item['container-title'])
      ? item['container-title'][0]
      : item['container-title'] || item.publisher || '';

    return {
      title,
      authors: authors.length > 0 ? authors : ['Unknown Author'],
      year,
      sourceTitle,
      volume: item.volume || '',
      issue: item.issue || '',
      pages: item.page || '',
      publisher: item.publisher || '',
      doi: item.DOI || doi,
      url: item.URL || `https://doi.org/${doi}`
    };
  } catch (err) {
    console.error('Crossref metadata fetch error:', err);
    return null;
  }
}
