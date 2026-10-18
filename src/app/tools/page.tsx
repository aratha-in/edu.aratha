'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Search, ExternalLink, ShieldCheck, CheckCircle2, Layers, Monitor, Laptop } from 'lucide-react';
import { getStoredResources } from '@/lib/storage';
import { Resource } from '@/types';
import ResourceCard from '@/components/ResourceCard';
import CitationModal from '@/components/CitationModal';

export default function ToolsPage() {
  const [tools, setTools] = useState<Resource[]>([]);
  const [query, setQuery] = useState('');
  const [activeCite, setActiveCite] = useState<Resource | null>(null);

  useEffect(() => {
    const all = getStoredResources();
    setTools(all.filter(r => r.resourceType === 'tool'));
  }, []);

  const filtered = tools.filter(t => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.toolCategory || '').toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <CitationModal resource={activeCite} isOpen={Boolean(activeCite)} onClose={() => setActiveCite(null)} />

      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold">
            <Wrench className="w-3.5 h-3.5 text-cyan-600" />
            Research Software & Tooling
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Free & Open-Source Research Tools
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Curated directory of genuine open-source and freemium tools for citation management, literature graph visualization, statistical analysis, and collaborative academic writing. We never mislabel proprietary software as open-source.
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
              placeholder="Search tools by category (e.g. 'Citation Management', 'Statistical Analysis', 'Zotero', 'LaTeX')..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-cyan-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(tool => (
            <ResourceCard key={tool.id} resource={tool} onOpenCiteModal={(r) => setActiveCite(r)} />
          ))}
        </div>
      </div>
    </div>
  );
}
