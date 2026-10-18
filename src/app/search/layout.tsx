import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unified Academic Search | Courses, Research Papers & Open Textbooks',
  description:
    'Search across all verified open-access repositories simultaneously: SWAYAM/NPTEL, MIT OCW, OpenAlex 250M+ papers, Shodhganga Indian theses, OpenStax textbooks, and public datasets.',
  keywords: [
    'academic search engine',
    'free educational search',
    'search SWAYAM courses',
    'search research papers free',
    'unified scholarly discovery',
  ],
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    title: 'Unified Academic Search | Edu.aratha',
    description: 'Instant discovery across courses, research papers, textbooks, and datasets.',
    url: '/search',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
