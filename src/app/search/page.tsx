'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Layers,
  GraduationCap,
  FileText,
  BookOpen,
  Database,
  Wrench,
  Library,
  Sparkles,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  Globe2
} from 'lucide-react';
import { getStoredResources } from '@/lib/storage';
import { SUBJECT_TAXONOMY, ACCESS_TYPE_LABELS } from '@/lib/data/seedData';
import { Resource, ResourceType, AccessType } from '@/types';
import ResourceCard from '@/components/ResourceCard';
import CitationModal from '@/components/CitationModal';
import { searchOpenAlex } from '@/lib/api/openAlex';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [selectedAccess, setSelectedAccess] = useState<string>('All Access Types');
  const [indiaOnly, setIndiaOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'title' | 'verified' | 'year'>('relevance');

  // Live external API integration state
  const [enableOpenAlexLive, setEnableOpenAlexLive] = useState<boolean>(false);
  const [isSearchingApi, setIsSearchingApi] = useState<boolean>(false);
  const [apiResults, setApiResults] = useState<Resource[]>([]);

  // Base resources
  const [baseResources, setBaseResources] = useState<Resource[]>([]);
  const [activeCiteResource, setActiveCiteResource] = useState<Resource | null>(null);

  useEffect(() => {
    setBaseResources(getStoredResources());
  }, []);

  // Update query/type if URL params change
  useEffect(() => {
    if (searchParams.get('q')) setQuery(searchParams.get('q') || '');
    if (searchParams.get('type')) setSelectedType(searchParams.get('type') || 'all');
  }, [searchParams]);

  // Live OpenAlex search when toggled
  useEffect(() => {
    let isCancelled = false;
    async function fetchExternal() {
      if (!enableOpenAlexLive || !query.trim() || query.length < 3) {
        setApiResults([]);
        return;
      }
      setIsSearchingApi(true);
      try {
        const results = await searchOpenAlex(query, 12);
        if (!isCancelled) {
          setApiResults(results);
        }
      } catch (err) {
        console.error('API Search Error', err);
      } finally {
        if (!isCancelled) setIsSearchingApi(false);
      }
    }

    const timer = setTimeout(() => {
      fetchExternal();
    }, 400);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [enableOpenAlexLive, query]);

  // Combined and filtered results
  const filteredResults = useMemo(() => {
    // Combine base with API results if enabled
    const all = enableOpenAlexLive ? [...baseResources, ...apiResults] : baseResources;

    return all.filter((item) => {
      // Keyword match
      if (query.trim()) {
        const q = query.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inProvider = item.provider.toLowerCase().includes(q);
        const inTags = item.tags.some(t => t.toLowerCase().includes(q));
        const inAuthors = (item.authors || []).some(a => a.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inProvider && !inTags && !inAuthors) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== 'all' && item.resourceType !== selectedType) {
        return false;
      }

      // Subject filter
      if (selectedSubject !== 'All Subjects' && item.subject !== selectedSubject) {
        return false;
      }

      // Access filter
      if (selectedAccess !== 'All Access Types' && item.accessType !== selectedAccess) {
        return false;
      }

      // India focus filter
      if (indiaOnly && !item.indiaFocus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'verified') {
        return (b.lastVerifiedAt || '').localeCompare(a.lastVerifiedAt || '');
      }
      if (sortBy === 'year') {
        return (b.publicationYear || 0) - (a.publicationYear || 0);
      }
      // Relevance (featured items first, then view count)
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.metrics?.views || 0) - (a.metrics?.views || 0);
    });
  }, [baseResources, apiResults, enableOpenAlexLive, query, selectedType, selectedSubject, selectedAccess, indiaOnly, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setSelectedType('all');
    setSelectedSubject('All Subjects');
    setSelectedAccess('All Access Types');
    setIndiaOnly(false);
    setSortBy('relevance');
    setEnableOpenAlexLive(false);
    setApiResults([]);
  };

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedType !== 'all') count++;
    if (selectedSubject !== 'All Subjects') count++;
    if (selectedAccess !== 'All Access Types') count++;
    if (indiaOnly) count++;
    if (sortBy !== 'relevance') count++;
    return count;
  }, [selectedType, selectedSubject, selectedAccess, indiaOnly, sortBy]);

  const quickTypePills = [
    { id: 'all', label: 'All' },
    { id: 'course', label: 'Courses' },
    { id: 'paper', label: 'Papers' },
    { id: 'book', label: 'Books' },
    { id: 'thesis', label: 'Theses' },
    { id: 'dataset', label: 'Datasets' },
    { id: 'tool', label: 'Tools' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Citation Modal */}
      <CitationModal
        resource={activeCiteResource}
        isOpen={Boolean(activeCiteResource)}
        onClose={() => setActiveCiteResource(null)}
      />

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Global Academic Discovery
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Unified search indexing free courses, research papers, open textbooks, theses, and tools.
              </p>
            </div>

            {/* Quick Live OpenAlex API Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-3 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold text-blue-900 block leading-tight">Live OpenAlex Academic API</span>
                  <span className="text-[11px] text-blue-700 hidden sm:block">Search 250M+ global open-access works in real time</span>
                  <span className="text-[10px] text-blue-700 sm:hidden">250M+ open global records</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEnableOpenAlexLive(!enableOpenAlexLive)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden min-h-[20px] ${
                  enableOpenAlexLive ? 'bg-blue-600' : 'bg-slate-300'
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

          {/* Unified Search Input */}
          <div className="mt-5 sm:mt-6">
            <div className="relative flex items-center bg-white rounded-xl shadow-xs border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-1">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keywords, subject, author, DOI, or repository (e.g. 'NPTEL Python', 'Transformer')..."
                className="w-full py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg mr-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Mobile Swipeable Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar py-1 px-0.5">
            {quickTypePills.map((pill) => {
              const isSelected = selectedType === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setSelectedType(pill.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
            <button
              onClick={() => setIndiaOnly(!indiaOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors flex items-center gap-1 ${
                indiaOnly
                  ? 'bg-orange-600 text-white font-semibold'
                  : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              <span>🇮🇳 India Focus</span>
              {indiaOnly && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Sidebar Filters & Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Mobile Filter & Results Bar */}
        <div className="lg:hidden flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs mb-5">
          <div className="text-xs font-semibold text-slate-700">
            <span className="text-blue-600 font-bold">{filteredResults.length}</span> results
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold shadow-2xs active:bg-blue-100"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters & Sort</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                  Search Filters
                </span>
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Reset All
                </button>
              </div>

              {/* Resource Type */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Resource Type</label>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'All Resources' },
                    { id: 'course', label: 'Courses (SWAYAM/NPTEL/OCW)' },
                    { id: 'paper', label: 'Research Papers' },
                    { id: 'book', label: 'Books & Textbooks' },
                    { id: 'thesis', label: 'Theses (Shodhganga/OATD)' },
                    { id: 'dataset', label: 'Open Datasets' },
                    { id: 'tool', label: 'Research Tools' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedType === t.id
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{t.label}</span>
                      {selectedType === t.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Taxonomy */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Subject / Field</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-blue-500"
                >
                  {SUBJECT_TAXONOMY.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Access Classification */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Access Type</label>
                <select
                  value={selectedAccess}
                  onChange={(e) => setSelectedAccess(e.target.value)}
                  className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-blue-500"
                >
                  {ACCESS_TYPE_LABELS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Indian Repositories Toggle */}
              <div className="pt-3 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-slate-800">
                    🇮🇳 Indian Repositories Only
                  </span>
                  <input
                    type="checkbox"
                    checked={indiaOnly}
                    onChange={(e) => setIndiaOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  Filters to SWAYAM, NPTEL, Shodhganga, data.gov.in, and Indian Science journals.
                </p>
              </div>

              {/* Sort By */}
              <div className="pt-3 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-700 block mb-2">Sort Results</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-blue-500"
                >
                  <option value="relevance">Relevance & Featured First</option>
                  <option value="verified">Recently Verified</option>
                  <option value="year">Publication Year (Newest)</option>
                  <option value="title">Title (Alphabetical A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Results Column */}
          <div className="lg:col-span-3 space-y-4">
            {/* Desktop results count & status bar */}
            <div className="hidden lg:flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-700">
                Showing <span className="text-blue-600 font-bold">{filteredResults.length}</span> verified resources
                {query && <span> for &ldquo;{query}&rdquo;</span>}
                {enableOpenAlexLive && (
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px]">
                    <Globe2 className="w-3 h-3" /> Live OpenAlex Enabled
                  </span>
                )}
              </div>

              {isSearchingApi && (
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching live academic records...</span>
                </div>
              )}
            </div>

            {/* Mobile Loading status indicator */}
            {isSearchingApi && (
              <div className="lg:hidden flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-xs text-blue-700 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>Fetching live records from OpenAlex...</span>
              </div>
            )}

            {/* Results Grid */}
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {filteredResults.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onOpenCiteModal={(r) => setActiveCiteResource(r)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No resources matched your criteria</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your search terms, removing subject filters, or activating the <strong>Live OpenAlex Academic API</strong> toggle above to query over 250M+ open global records in real time.
                </p>
                <div className="pt-2">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-t-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Filters & Sorting</h3>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Form Body */}
            <div className="p-5 space-y-5 overflow-y-auto pb-safe">
              {/* Resource Type */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Resource Type</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'course', label: 'Courses' },
                    { id: 'paper', label: 'Papers' },
                    { id: 'book', label: 'Books' },
                    { id: 'thesis', label: 'Theses' },
                    { id: 'dataset', label: 'Datasets' },
                    { id: 'tool', label: 'Tools' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors flex items-center justify-between ${
                        selectedType === t.id
                          ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-300'
                          : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span>{t.label}</span>
                      {selectedType === t.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Taxonomy */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Subject / Field</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800"
                >
                  {SUBJECT_TAXONOMY.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Access Classification */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Access Type</label>
                <select
                  value={selectedAccess}
                  onChange={(e) => setSelectedAccess(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800"
                >
                  {ACCESS_TYPE_LABELS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Sort Order</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-800"
                >
                  <option value="relevance">Relevance & Featured First</option>
                  <option value="verified">Recently Verified</option>
                  <option value="year">Publication Year (Newest)</option>
                  <option value="title">Title (Alphabetical A-Z)</option>
                </select>
              </div>

              {/* Indian Repositories Toggle */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-xs font-semibold text-slate-800">
                    🇮🇳 Indian Repositories Only
                  </span>
                  <input
                    type="checkbox"
                    checked={indiaOnly}
                    onChange={(e) => setIndiaOnly(e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 border-slate-300"
                  />
                </label>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs text-center"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs text-center shadow-xs"
              >
                Show {filteredResults.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading academic discovery index...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

