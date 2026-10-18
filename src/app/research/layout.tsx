import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open Access Research Papers & Preprints | OpenAlex, arXiv, PubMed',
  description:
    'Search and read over 250M+ open-access academic research papers, preprints, peer-reviewed journal articles, and conference proceedings indexed from OpenAlex, arXiv, PubMed Central, and DOAJ.',
  keywords: [
    'open access research papers',
    'free scholarly articles',
    'OpenAlex search engine',
    'arXiv preprints free',
    'peer reviewed research papers',
    'academic literature search',
  ],
  alternates: {
    canonical: '/research',
  },
  openGraph: {
    title: 'Open Access Research Papers & Preprints | Edu.aratha',
    description: 'Search 250M+ open scholarly papers with DOI lookup, instant citations, and full-text PDF links.',
    url: '/research',
  },
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
