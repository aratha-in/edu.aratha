import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open Access Academic Journals | DOAJ & Indian Academy of Sciences',
  description:
    'Discover verified peer-reviewed open access scholarly journals indexed from the Directory of Open Access Journals (DOAJ) and premier Indian academic scientific academies.',
  keywords: [
    'DOAJ open access journals',
    'peer reviewed journals free',
    'Indian academy of sciences journals',
    'scholarly open access publishing',
  ],
  alternates: {
    canonical: '/journals',
  },
  openGraph: {
    title: 'Open Access Academic Journals | Edu.aratha',
    description: 'Verified peer-reviewed open access journals across all disciplines.',
    url: '/journals',
  },
};

export default function JournalsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
