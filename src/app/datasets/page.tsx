'use client';

import React, { useState, useEffect } from 'react';
import { Database, Search, Download, ExternalLink, ShieldCheck, Globe2 } from 'lucide-react';
import { getStoredResources } from '@/lib/storage';
import { Resource } from '@/types';
import ResourceCard from '@/components/ResourceCard';
import CitationModal from '@/components/CitationModal';

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Resource[]>([]);
  const [query, setQuery] = useState('');
  const [activeCite, setActiveCite] = useState<Resource | null>(null);

  useEffect(() => {
    const all = getStoredResources();
    setDatasets(all.filter(r => r.resourceType === 'dataset'));
  }, []);

  const filtered = datasets.filter(d => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.provider.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <CitationModal resource={activeCite} isOpen={Boolean(activeCite)} onClose={() => setActiveCite(null)} />

      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            Open Academic & Public Datasets
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Open Datasets for Empirical Research
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Directory of legitimate open-access datasets from Data.gov.in (Open Government Data Platform India), World Bank Open Data, Zenodo, and Mendeley Data. Clean, openly licenced tabular and geospatial files.
          </p>
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
              placeholder="Search datasets by theme, format, geographic scope (e.g., 'Census', 'Agriculture', 'World Bank')..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(dataItem => (
            <ResourceCard key={dataItem.id} resource={dataItem} onOpenCiteModal={(r) => setActiveCite(r)} />
          ))}
        </div>
      </div>
    </div>
  );
}
