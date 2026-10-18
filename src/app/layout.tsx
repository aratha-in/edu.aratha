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

export const metadata: Metadata = {
  title: 'Edu.aratha | Global Free Education & Research Discovery Platform',
  description: 'A unified discovery and learning workspace for students, researchers, faculty, and lifelong learners. Search free courses from SWAYAM/NPTEL, MIT OCW, academic research papers, open textbooks, datasets, and generate instant citations.',
  keywords: [
    'free courses',
    'SWAYAM',
    'NPTEL',
    'research papers',
    'open access',
    'Shodhganga',
    'OpenAlex',
    'open textbooks',
    'citation generator',
    'APA citation',
    'MLA citation',
    'Indian researchers',
    'academic discovery'
  ],
  authors: [{ name: 'Edu.aratha Open Initiative' }],
  openGraph: {
    title: 'Edu.aratha | Global Free Education & Research Platform',
    description: 'Learn for free. Discover research. Cite with confidence. Grow your knowledge.',
    type: 'website',
    locale: 'en_IN',
  }
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
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50/50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden w-full">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
