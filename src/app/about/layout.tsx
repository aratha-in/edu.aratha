import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Edu.aratha | Democratizing Global & Indian Higher Education',
  description:
    'Learn about the mission, data sources, governance, and open access principles behind the Edu.aratha initiative.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Edu.aratha | Free Higher Education & Research Initiative',
    description: 'Empowering students and researchers worldwide with zero-cost educational discovery.',
    url: '/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
