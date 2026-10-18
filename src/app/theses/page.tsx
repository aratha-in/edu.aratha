'use client';

import React, { useState, useEffect } from 'react';
import { Library, Search, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getStoredResources } from '@/lib/storage';
import { Resource } from '@/types';
import ResourceCard from '@/components/ResourceCard';
import CitationModal from '@/components/CitationModal';

export default function ThesesPage() {
  const [theses, setTheses] = useState<Resource[]>([]);
  const [query, setQuery] = useState('');
  const [activeCite, setActiveCite] = useState<Resource | null>(null);

  useEffect(() => {
    const all = getStoredResources();
    setTheses(all.filter(r => r.resourceType === 'thesis'));
  }, []);

  const filtered = theses.filter(t => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.provider.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <CitationModal resource={activeCite} isOpen={Boolean(activeCite)} onClose={() => setActiveCite(null)} />

      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
            <Library className="w-3.5 h-3.5 text-indigo-600" />
            Doctoral Dissertations & Theses
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Indian & Global Theses Directory
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Explore verified doctoral research from Shodhganga (INFLIBNET Centre, UGC India) and Open Access Theses & Dissertations (OATD). Directly access full-text PDF chapters from leading Indian universities and IITs.
          </p>

          <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 flex items-center gap-3 text-xs text-orange-950 max-w-3xl">
            <span className="font-bold">🇮🇳 Shodhganga Focus:</span>
            <span>Over 450,000+ Indian doctoral theses deposited by Indian universities under UGC mandatory guidelines are indexed for transparent academic research.</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs mb-8">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search theses by university, researcher, subject (e.g., 'Solar photovoltaic', 'Delhi University', 'INFLIBNET')..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-indigo-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(thesis => (
            <ResourceCard key={thesis.id} resource={thesis} onOpenCiteModal={(r) => setActiveCite(r)} />
          ))}
        </div>
      </div>
    </div>
  );
}
