import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open Theses & Dissertations | Shodhganga INFLIBNET & OATD',
  description:
    'Search over 500,000+ Indian university doctoral theses from INFLIBNET Shodhganga and millions of global electronic theses and dissertations from OATD.',
  keywords: [
    'Shodhganga INFLIBNET theses',
    'Indian PhD theses search',
    'open access dissertations',
    'OATD electronic theses',
    'doctoral research repository India',
  ],
  alternates: {
    canonical: '/theses',
  },
  openGraph: {
    title: 'Open Theses & Dissertations | Edu.aratha',
    description: 'Explore verified doctoral theses and master’s dissertations from India and worldwide.',
    url: '/theses',
  },
};

export default function ThesesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
