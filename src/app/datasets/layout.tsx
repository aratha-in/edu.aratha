import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open Research & Public Datasets | Data.gov.in, Zenodo, World Bank',
  description:
    'Find and download open scientific datasets from Data.gov.in, World Bank Open Data, CERN Zenodo, and academic data repositories for machine learning, economic modeling, and scientific research.',
  keywords: [
    'open access datasets',
    'Data.gov.in datasets free',
    'Zenodo research data',
    'machine learning open datasets',
    'public government data India',
  ],
  alternates: {
    canonical: '/datasets',
  },
  openGraph: {
    title: 'Open Research & Public Datasets | Edu.aratha',
    description: 'Freely accessible research data for scholars, scientists, and students.',
    url: '/datasets',
  },
};

export default function DatasetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
