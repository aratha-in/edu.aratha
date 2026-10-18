import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      <div className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Terms of Use & Attribution Standards
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Use</h1>
          <p className="text-xs text-slate-500">Effective Date: October 2026 • Edu.aratha Platform</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8 text-xs text-slate-700 leading-relaxed">
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">1. Indexing & Hyperlinking Principle</h2>
          <p>
            Edu.aratha acts solely as a discovery catalog and academic search engine. We index and link directly to legitimate third-party educational providers (such as SWAYAM, NPTEL, MIT OCW, OpenStax, and Shodhganga). We do not host or pirate copyrighted video files, copyrighted textbook PDFs, or non-open academic materials.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">2. Academic Integrity and Citation Responsibility</h2>
          <p>
            While our Citation Generator uses standard algorithmic templates for APA 7, MLA 9, Harvard, Chicago, IEEE, and Vancouver, authors and research scholars are individually responsible for verifying all citation formats against their university dissertation handbook or publisher guidelines before publication.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">3. Non-Commercial Core Mission</h2>
          <p>
            The core discovery database of educational courses and open research papers is guaranteed to remain free for learners worldwide. Optional future workspace features will never gate access to public third-party learning materials.
          </p>
        </section>
      </div>
    </div>
  );
}
