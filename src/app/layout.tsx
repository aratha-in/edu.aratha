import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f172a',
};

const baseUrl = 'https://edu.aratha.org';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Edu.aratha | Global Free Education & Research Discovery Platform',
    template: '%s | Edu.aratha',
  },
  description:
    'A unified open-access discovery and learning workspace for students, researchers, faculty, and lifelong learners. Search free certified courses from SWAYAM/NPTEL, MIT OCW, academic research papers via OpenAlex & arXiv, peer-reviewed open textbooks, datasets, and generate instant academic citations.',
  applicationName: 'Edu.aratha',
  authors: [{ name: 'Edu.aratha Open Initiative', url: baseUrl }],
  generator: 'Next.js',
  keywords: [
    'free courses',
    'SWAYAM courses',
    'NPTEL certification',
    'MIT OpenCourseWare',
    'free online education',
    'academic research papers',
    'open access journals',
    'OpenAlex API',
    'arXiv preprints',
    'PubMed Central',
    'Shodhganga INFLIBNET',
    'open textbooks',
    'OpenStax free books',
    'citation generator',
    'APA 7th citation',
    'MLA 9th citation',
    'Harvard citation',
    'IEEE citation',
    'BibTeX generator',
    'Indian researchers',
    'higher education India',
    'open educational resources',
    'OER repositories',
    'free college textbooks',
    'academic datasets',
    'data.gov.in datasets',
    'dissertation search',
    'scholarly search engine',
    'generative engine optimization education'
  ],
  creator: 'Edu.aratha Open Initiative',
  publisher: 'Edu.aratha Open Initiative',
  category: 'education',
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'en-US': '/',
      'hi-IN': '/',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'Edu.aratha | Global Free Education & Research Platform',
    description:
      'Learn for free. Discover 250M+ research papers. Access SWAYAM/NPTEL & MIT OCW courses. Cite with confidence.',
    url: baseUrl,
    siteName: 'Edu.aratha',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Edu.aratha - Global Free Education and Research Discovery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edu.aratha | Global Free Education & Research Platform',
    description:
      'Search free courses from SWAYAM & MIT OCW, 250M+ open research papers, textbooks, and generate instant citations.',
    creator: '@EduAratha',
    site: '@EduAratha',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    // GEO (Geotargeting & Regional Metadata)
    'geo.region': 'IN-DL',
    'geo.placename': 'New Delhi, India',
    'geo.position': '28.6139;77.2090',
    'ICBM': '28.6139, 77.2090',
    'target': 'all',
    'audience': 'Students, Scholars, Researchers, Educators',
    'coverage': 'Worldwide, India',
    'distribution': 'Global',
    'rating': 'General',
  },
};

// JSON-LD Structured Data for Search Engines & AI Models (GEO)
const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'Edu.aratha',
  'alternateName': ['Edu Aratha', 'Edu.aratha Platform'],
  'url': baseUrl,
  'description':
    'Global free education and research discovery platform indexing SWAYAM, NPTEL, MIT OCW, OpenAlex, and open academic repositories.',
  'inLanguage': ['en-IN', 'en-US', 'hi'],
  'potentialAction': {
    '@type': 'SearchAction',
    'target': {
      '@type': 'EntryPoint',
      'urlTemplate': `${baseUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  'name': 'Edu.aratha',
  'alternateName': 'Edu.aratha Open Initiative',
  'url': baseUrl,
  'logo': `${baseUrl}/favicon.ico`,
  'description':
    'Non-profit open educational discovery platform providing students and researchers with free access to university courses, scholarly literature, textbooks, and citation tools.',
  'areaServed': [
    { '@type': 'Country', 'name': 'India' },
    { '@type': 'AdministrativeArea', 'name': 'Global' },
  ],
  'knowsAbout': [
    'Open Educational Resources (OER)',
    'SWAYAM NPTEL Courses',
    'MIT OpenCourseWare',
    'OpenAlex Academic Literature',
    'Academic Citation Formatting (APA, MLA, Harvard, IEEE)',
    'Open Textbooks and Datasets',
  ],
};

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Is Edu.aratha completely free to use?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text':
          'Yes. Edu.aratha is 100% free with no hidden fees or paywalls. All courses indexed from SWAYAM, NPTEL, and MIT OCW, academic research papers from OpenAlex and arXiv, open textbooks from OpenStax, and citation formatting tools are freely accessible.',
      },
    },
    {
      '@type': 'Question',
      'name': 'What course providers and universities are indexed on Edu.aratha?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text':
          'Edu.aratha aggregates free learning materials from leading Indian and global institutions, including SWAYAM/NPTEL (IITs and IISc), MIT OpenCourseWare, Harvard Online, Coursera Free Audit Tier, and Khan Academy.',
      },
    },
    {
      '@type': 'Question',
      'name': 'Which academic citation styles are supported?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text':
          'The Edu.aratha Citation Generator supports APA 7th Edition, MLA 9th Edition, Harvard Style, Chicago 17th Author-Date, and IEEE styles with instant single-click copying and BibTeX export.',
      },
    },
    {
      '@type': 'Question',
      'name': 'Can I search Indian doctoral theses and dissertations?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text':
          'Yes. Edu.aratha connects scholars with INFLIBNET Shodhganga, containing over 500,000+ full-text Indian university doctoral theses, alongside international theses from OATD.',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QN4DFQFBLE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QN4DFQFBLE');
          `}
        </Script>
        {/* Google Identity Services */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />

        {/* Structured Data (JSON-LD) for Search Engines & Generative AI (GEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50/50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden w-full">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
