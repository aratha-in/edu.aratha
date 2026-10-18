'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Globe2,
  RefreshCw,
  Quote,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { getStoredResources } from '@/lib/storage';
import { searchOpenAlex } from '@/lib/api/openAlex';
import { Resource } from '@/types';
import ResourceCard from '@/components/ResourceCard';
import CitationModal from '@/components/CitationModal';

export default function ResearchPage() {
  const [query, setQuery] = useState('');
  const [selectedOa, setSelectedOa] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [peerReviewedOnly, setPeerReviewedOnly] = useState(false);
  const [enableOpenAlexLive, setEnableOpenAlexLive] = useState(true);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [apiPapers, setApiPapers] = useState<Resource[]>([]);
  const [basePapers, setBasePapers] = useState<Resource[]>([]);
  const [activeCiteResource, setActiveCiteResource] = useState<Resource | null>(null);

  useEffect(() => {
    const all = getStoredResources();
    setBasePapers(all.filter(r => r.resourceType === 'paper' || r.resourceType === 'thesis'));
  }, []);

  // Fetch live OpenAlex papers when query is entered
  useEffect(() => {
    let isCancelled = false;
    async function fetchExternal() {
      if (!enableOpenAlexLive || !query.trim() || query.length < 3) {
        setApiPapers([]);
        return;
      }
      setIsSearchingApi(true);
      try {
        const results = await searchOpenAlex(query, 14);
        if (!isCancelled) {
          setApiPapers(results);
        }
      } catch (err) {
        console.error('OpenAlex error', err);
      } finally {
        if (!isCancelled) setIsSearchingApi(false);
      }
    }

    const timer = setTimeout(fetchExternal, 400);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [enableOpenAlexLive, query]);

  const allPapers = useMemo(() => {
    const combined = enableOpenAlexLive ? [...basePapers, ...apiPapers] : basePapers;
    return combined.filter((p) => {
      if (query.trim() && !enableOpenAlexLive) {
        const q = query.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inDoi = (p.doi || '').toLowerCase().includes(q);
        const inAuthors = (p.authors || []).some(a => a.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inDoi && !inAuthors) return false;
      }
      if (selectedOa !== 'all' && p.openAccessStatus !== selectedOa) return false;
      if (peerReviewedOnly && !p.isPeerReviewed) return false;
      return true;
    });
  }, [basePapers, apiPapers, enableOpenAlexLive, query, selectedOa, peerReviewedOnly]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <CitationModal
        resource={activeCiteResource}
        isOpen={Boolean(activeCiteResource)}
        onClose={() => setActiveCiteResource(null)}
      />

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold mb-2">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>Academic Research & Open Access Discovery</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Academic Research Papers & Preprints
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
                Discover peer-reviewed journal articles, preprints, conference proceedings, and doctoral theses with clear open-access classification.
              </p>
            </div>

            {/* Live OpenAlex Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-3 p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="font-bold text-purple-900 block leading-tight">Live OpenAlex Integration</span>
                  <span className="text-[11px] text-purple-700 hidden sm:block">Real-time search across global academic repositories</span>
                  <span className="text-[10px] text-purple-700 sm:hidden">250M+ global works in real time</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEnableOpenAlexLive(!enableOpenAlexLive)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden min-h-[20px] ${
                  enableOpenAlexLive ? 'bg-purple-600' : 'bg-slate-300'
                }`}
                aria-label="Toggle Live OpenAlex search"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    enableOpenAlexLive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search papers by keyword, topic, author, or DOI (e.g. 'Transformer', 'Solar energy')..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-purple-600"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <select
                value={selectedOa}
                onChange={(e) => setSelectedOa(e.target.value)}
                className="w-full sm:w-auto text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
              >
                <option value="all">All Open Access Statuses</option>
                <option value="Gold OA">Gold OA (Fully Open Journal)</option>
                <option value="Green OA">Green OA (Repository Self-Archived)</option>
                <option value="Bronze OA">Bronze OA (Free on Publisher Site)</option>
                <option value="Hybrid">Hybrid OA</option>
              </select>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 py-1">
                <input
                  type="checkbox"
                  checked={peerReviewedOnly}
                  onChange={(e) => setPeerReviewedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 border-slate-300"
                />
                <span>Peer-Reviewed Only</span>
              </label>
            </div>

            {isSearchingApi && (
              <div className="flex items-center gap-1.5 text-xs text-purple-700 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>Searching live OpenAlex works...</span>
              </div>
            )}
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {allPapers.map((paper) => (
            <ResourceCard
              key={paper.id}
              resource={paper}
              onOpenCiteModal={(r) => setActiveCiteResource(r)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
