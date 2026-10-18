import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  FileText,
  Database,
  Quote,
  Compass,
  Heart
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm mt-auto">
      {/* Verification & Trust Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              All indexed courses, papers, and textbooks retain original publisher copyright, author attribution, and open licences.
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Open Links
            </span>
            <span>Zero Paywalls for Core Discovery</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Edu<span className="text-blue-400">.aratha</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A unified discovery and learning workspace for students, researchers, faculty, and lifelong learners worldwide with special attention to Indian academia.
            </p>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <p className="font-semibold text-slate-200 mb-1">Our Core Commitment:</p>
              <p className="text-[11px] text-slate-400">
                &ldquo;Learn for free. Discover research. Cite with confidence. Grow your knowledge.&rdquo;
              </p>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider mb-3">Discovery</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">Free Courses Directory</Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-white transition-colors">Academic Research Papers</Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-white transition-colors">Open Textbooks & Books</Link>
              </li>
              <li>
                <Link href="/theses" className="hover:text-white transition-colors">Theses & Dissertations</Link>
              </li>
              <li>
                <Link href="/datasets" className="hover:text-white transition-colors">Open Datasets</Link>
              </li>
              <li>
                <Link href="/journals" className="hover:text-white transition-colors">Open Access Journals</Link>
              </li>
            </ul>
          </div>

          {/* Research & Learning Tools */}
          <div>
            <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider mb-3">Tools & Workspace</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/citation-generator" className="hover:text-white transition-colors">Citation Generator (APA/MLA/IEEE)</Link>
              </li>
              <li>
                <Link href="/learning-paths" className="hover:text-white transition-colors">Curated Learning Paths</Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-white transition-colors">Research Software & Tools</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">Personal Reading Lists</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">Research Projects</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">Resource Verification</Link>
              </li>
            </ul>
          </div>

          {/* Indexed Repositories & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider mb-3">Indexed Repositories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                <span>SWAYAM & NPTEL (IITs/IIMs)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                <span>Shodhganga (INFLIBNET)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                <span>OpenAlex & Crossref</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                <span>OpenStax (Rice University)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                <span>Data.gov.in (OGD India)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                <span>DOAJ Directory of OA Journals</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-1 text-xs">
              <Link href="/about" className="block text-slate-400 hover:text-white">About the Initiative</Link>
              <Link href="/privacy" className="block text-slate-400 hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="block text-slate-400 hover:text-white">Terms of Use & Attribution</Link>
            </div>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Edu.aratha. All original repository content remains under respective institutional licences.</p>
          <div className="flex items-center gap-3">
            <span>Built for open education equity</span>
            <span>•</span>
            <span className="text-slate-400">v1.0 MVP Launch</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
