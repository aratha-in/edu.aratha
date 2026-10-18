import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Academic Citation Generator | APA 7th, MLA 9th, Harvard, IEEE',
  description:
    'Generate instant, error-free academic citations for research papers, books, websites, and journal articles in APA 7th, MLA 9th, Harvard, Chicago 17th, and IEEE formats with BibTeX export.',
  keywords: [
    'citation generator free',
    'APA 7th citation maker',
    'MLA 9th citation generator',
    'Harvard referencing tool',
    'IEEE citation generator',
    'BibTeX citation export',
    'academic bibliography creator',
  ],
  alternates: {
    canonical: '/citation-generator',
  },
  openGraph: {
    title: 'Free Academic Citation Generator | APA, MLA, Harvard, IEEE | Edu.aratha',
    description: 'Format accurate citations in seconds with one-click copying and BibTeX export for researchers and students.',
    url: '/citation-generator',
  },
};

export default function CitationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
