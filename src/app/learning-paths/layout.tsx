import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curated Academic Learning Paths | Computer Science, AI, Economics',
  description:
    'Structured academic roadmaps and syllabi combining free courses, open textbooks, and research papers from Beginner to Advanced levels in Computer Science, Data Science, AI, and Economics.',
  keywords: [
    'academic learning paths',
    'computer science curriculum free',
    'data science learning roadmap',
    'artificial intelligence syllabus',
    'self taught academic roadmaps',
  ],
  alternates: {
    canonical: '/learning-paths',
  },
  openGraph: {
    title: 'Curated Academic Learning Paths | Edu.aratha',
    description: 'Structured university-level syllabi using free courses, open textbooks, and research papers.',
    url: '/learning-paths',
  },
};

export default function LearningPathsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
