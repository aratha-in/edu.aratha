import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Open Textbooks & Books | OpenStax, DOAB, LibreTexts',
  description:
    'Access thousands of free peer-reviewed college and university textbooks from OpenStax, Directory of Open Access Books (DOAB), and the Open Textbook Library across STEM, Humanities, and Social Sciences.',
  keywords: [
    'free open textbooks',
    'OpenStax free books',
    'DOAB open access books',
    'free college textbooks pdf',
    'peer reviewed textbooks online',
  ],
  alternates: {
    canonical: '/books',
  },
  openGraph: {
    title: 'Free Open Textbooks & Books | Edu.aratha',
    description: 'Peer-reviewed, openly licensed college textbooks for higher education.',
    url: '/books',
  },
};

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
