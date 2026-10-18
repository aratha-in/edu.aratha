import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      <div className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            Privacy & Academic Data Ownership
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Effective Date: October 2026 • Edu.aratha Platform</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8 text-xs text-slate-700 leading-relaxed">
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">1. Our Fundamental Commitment to Privacy</h2>
          <p>
            Edu.aratha is built with a privacy-first ethos. We do not monetize personal learner data, sell reading logs to advertisers, or track you across the internet. Public educational discovery remains free without requiring surveillance advertising.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">2. Research Notes and Private Workspaces</h2>
          <p>
            All research notes, hypothesis formulations, literature review folders, and reading list statuses created within your workspace remain strictly private to your account. We never expose student research questions to other users, search crawlers, or third parties.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">3. Data Portability and GDPR Compliance</h2>
          <p>
            You maintain 100% ownership of your scholarly data. At any time via your Personal Dashboard, you can export all bookmarks, research project bibliographies, and notes as a standardized JSON or BibTeX file with a single click.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">4. Third-Party Academic APIs</h2>
          <p>
            When searching external repositories via OpenAlex or Crossref, query strings are sent directly to official public academic index endpoints to retrieve citations. No identifiable user profile tokens or personal credentials are transmitted.
          </p>
        </section>
      </div>
    </div>
  );
}
