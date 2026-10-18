import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  BookOpen,
  FileText,
  Database,
  Quote,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Our Vision & Academic Philosophy
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Democratizing Global Education & Academic Research
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Edu.aratha connects learners, PhD scholars, and educators to the world&apos;s legitimate free learning and research repositories in one unified workspace.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12 text-sm text-slate-700 leading-relaxed">
        {/* The Core Principle */}
        <section className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">The Launch Principle: Indexing Over Duplication</h2>
          </div>
          <p>
            Rather than building an unwieldy course-hosting platform or duplicating existing repositories, Edu.aratha operates as a high-precision, curated discovery engine. We connect students and researchers directly to official, verified sources—including <strong>SWAYAM, NPTEL, Shodhganga, OpenStax, DOAJ, and OpenAlex</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Zero Paywalls</span>
              We only index legitimate public learning courses, open textbooks, and open-access papers.
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Authentic Attribution</span>
              All original publishers, institutions, and professors retain 100% credit, copyright, and direct traffic.
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Verified Integrity</span>
              Links and access models (Audit vs Full Free) are verified so learners face zero misleading surprises.
            </div>
          </div>
        </section>

        {/* Special India Academic Focus */}
        <section className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇮🇳</span>
            <h2 className="text-xl font-bold text-slate-900">Special Focus on Indian Academia & Research Scholars</h2>
          </div>
          <p>
            India possesses some of the world&apos;s most sophisticated government and institutional open knowledge initiatives, yet they often exist in fragmented silos. Edu.aratha unites these initiatives into a seamless search and research workspace:
          </p>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>SWAYAM & NPTEL:</strong> Over 1,500+ university-level engineering, science, humanities, and management courses taught by IIT and IIM faculty.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Shodhganga (INFLIBNET Centre, UGC India):</strong> Over 450,000+ electronic doctoral dissertations from 500+ Indian universities, opening up Indian scientific and socio-economic research.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Open Government Data (Data.gov.in):</strong> High-value national datasets on agriculture, renewable energy, census benchmarks, and economic indicators.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Indian Academy of Sciences:</strong> Peer-reviewed publications including Current Science, Pramana, and Sadhana.</span>
            </li>
          </ul>
        </section>

        {/* The Research Workspace */}
        <section className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900">An Integrated Research & Learning Workspace</h2>
          </div>
          <p>
            Discovery is only the first step. Edu.aratha provides students and researchers with a dedicated personal workspace:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div className="p-3.5 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900 block mb-0.5">Reading Lists & Status Tracking</span>
              Organize resources into To Read, Reading, Reviewed, and Completed lists.
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900 block mb-0.5">Research Projects & Private Notes</span>
              Frame thesis research questions and store private annotations that are never sold or shared.
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900 block mb-0.5">Automated Citation Engine</span>
              Instant APA 7, MLA 9, Harvard, Chicago, IEEE, and Vancouver citations, with BibTeX & RIS exports.
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900 block mb-0.5">Curated Learning Paths</span>
              Step-by-step tracks to learn Data Analytics, Research Methodology, and AI for free.
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white text-center space-y-4">
          <h3 className="text-xl font-bold">Start Exploring Verified Knowledge Today</h3>
          <p className="text-xs text-blue-200 max-w-md mx-auto">
            100% free core discovery. No credit card required.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/search"
              className="px-6 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs shadow-md"
            >
              Search Resources
            </Link>
            <Link
              href="/citation-generator"
              className="px-6 py-2.5 rounded-xl bg-blue-800 text-white font-bold text-xs border border-blue-700"
            >
              Generate Citations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
