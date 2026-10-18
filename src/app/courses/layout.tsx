import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Courses & Certifications | SWAYAM, NPTEL, MIT OCW',
  description:
    'Discover thousands of free online university courses with optional certification from SWAYAM, NPTEL (IITs & IISc), MIT OpenCourseWare, Harvard Online, and edX.',
  keywords: [
    'free online courses',
    'SWAYAM courses',
    'NPTEL IIT courses',
    'MIT OCW free lectures',
    'free computer science courses',
    'online college courses with certificate',
  ],
  alternates: {
    canonical: '/courses',
  },
  openGraph: {
    title: 'Free Online Courses & Certifications | Edu.aratha',
    description: 'Explore verified free university courses from SWAYAM, NPTEL, MIT OCW, and Harvard.',
    url: '/courses',
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
