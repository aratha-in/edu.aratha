'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
const NextLink = Link;
import { useRouter } from 'next/navigation';
import {
  Search,
  GraduationCap,
  FileText,
  BookOpen,
  Database,
  Wrench,
  Compass,
  Quote,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Globe2,
  Library,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { getStoredResources, getRealMetrics } from '@/lib/storage';
import { SEED_LEARNING_PATHS } from '@/lib/data/seedData';
import { Resource, ResourceType } from '@/types';
import ResourceCard from '@/components/ResourceCard';
import CitationModal from '@/components/CitationModal';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [resources, setResources] = useState<Resource[]>([]);
  const [metrics, setMetrics] = useState({
    totalResources: 0,
    verifiedResources: 0,
    coursesCount: 0,
    papersCount: 0,
    booksCount: 0,
    thesesCount: 0,
    datasetsCount: 0,
    toolsCount: 0,
    indianFocusCount: 0,
    userProjectsCount: 0,
    bookmarksCount: 0
  });
  const [activeCiteResource, setActiveCiteResource] = useState<Resource | null>(null);

  useEffect(() => {
    const list = getStoredResources();
    setResources(list);
    setMetrics(getRealMetrics());
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedType !== 'all') params.set('type', selectedType);
    router.push(`/search?${params.toString()}`);
  };

  const filterChips: Array<{ id: string; label: string; icon: React.ElementType }> = [
    { id: 'all', label: 'All Resources', icon: Layers },
    { id: 'course', label: 'Courses', icon: GraduationCap },
    { id: 'paper', label: 'Research Papers', icon: FileText },
    { id: 'book', label: 'Books & Textbooks', icon: BookOpen },
    { id: 'thesis', label: 'Theses', icon: Library },
    { id: 'dataset', label: 'Datasets', icon: Database },
    { id: 'tool', label: 'Research Tools', icon: Wrench },
  ];

  const featuredCourses = resources.filter(r => r.resourceType === 'course').slice(0, 3);
  const featuredResearch = resources.filter(r => r.resourceType === 'paper' || r.resourceType === 'thesis').slice(0, 3);
  const featuredDatasetsAndTools = resources.filter(r => r.resourceType === 'dataset' || r.resourceType === 'tool').slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Citation Modal */}
      <CitationModal
        resource={activeCiteResource}
        isOpen={Boolean(activeCiteResource)}
        onClose={() => setActiveCiteResource(null)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/80 to-blue-50/30 border-b border-slate-200/80 pt-10 pb-14 sm:pt-20 sm:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/40 via-indigo-50/30 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-[11px] sm:text-xs font-semibold mb-5 sm:mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Open Education & Academic Discovery</span>
            <span className="w-1 h-1 rounded-full bg-blue-400 hidden sm:inline" />
            <span className="text-blue-900 font-bold">100% Free Core Discovery</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.2] sm:leading-[1.15] mb-4 sm:mb-5">
            All Your Learning and Research <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 bg-clip-text text-transparent">
              Resources in One Place.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto mb-7 sm:mb-10 leading-relaxed font-normal px-2">
            Discover free courses, academic papers, open textbooks, datasets, and research tools to learn more and research smarter. Serving students, PhD scholars, and educators across India and worldwide.
          </p>

          {/* Unified Search Box */}
          <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-blue-900/5 border-2 border-slate-200/90 focus-within:border-blue-600 transition-all p-1 sm:p-1.5"
            >
              <div className="pl-3 sm:pl-4 text-slate-400">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, papers, books, datasets..."
                className="w-full py-2.5 sm:py-3.5 px-2.5 sm:px-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all shrink-0 flex items-center gap-1.5 min-h-[40px]"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </button>
            </form>

            {/* Category Filter Chips - Swipeable on mobile */}
            <div className="flex items-center sm:justify-center gap-1.5 sm:gap-2 mt-4 overflow-x-auto no-scrollbar py-1 px-1 -mx-2 sm:mx-0 sm:flex-wrap">
              {filterChips.map((chip) => {
                const Icon = chip.icon;
                const isSelected = selectedType === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setSelectedType(chip.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 min-h-[36px] ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 max-w-md sm:max-w-none mx-auto">
            <NextLink
              href="/search"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Explore Free Resources</span>
            </NextLink>
            <NextLink
              href="/tools"
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-2xs min-h-[44px]"
            >
              <Wrench className="w-4 h-4 text-slate-500" />
              <span>Explore Research Tools</span>
            </NextLink>
            <NextLink
              href="/citation-generator"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-2xs min-h-[44px]"
            >
              <Quote className="w-4 h-4 text-slate-400" />
              <span>Cite with APA/MLA</span>
            </NextLink>
          </div>
        </div>
      </section>

      {/* Real Verified Metrics Bar (Never Fabricated) */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 text-center">
            <div className="p-3 sm:p-2 rounded-xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-0">
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{metrics.totalResources}</div>
              <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">Curated Resources</div>
            </div>
            <div className="p-3 sm:p-2 rounded-xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-0">
              <div className="text-xl sm:text-2xl font-extrabold text-blue-600">{metrics.coursesCount}</div>
              <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">Free Courses Indexed</div>
            </div>
            <div className="p-3 sm:p-2 rounded-xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-0">
              <div className="text-xl sm:text-2xl font-extrabold text-purple-600">{metrics.papersCount}+</div>
              <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">Papers & Theses</div>
            </div>
            <div className="p-3 sm:p-2 rounded-xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-0">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">{metrics.indianFocusCount}</div>
              <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">Indian Repository Records</div>
            </div>
            <div className="p-3 sm:p-2 rounded-xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-0">
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-600">6</div>
              <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">Citation Formats</div>
            </div>
            <div className="p-3 sm:p-2 rounded-xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-0">
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600">100%</div>
              <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">Free Core Discovery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Academic Repositories Indexed */}
      <section className="py-10 sm:py-12 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Open Access Networks</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Connecting India and Global Scholarship</h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              We directly index and verify URLs to official public academic bodies, ensuring zero copyright violations, original provider credit, and authentic knowledge access.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {[
              { name: 'SWAYAM & NPTEL', desc: 'IITs, IIMs & MHRD India', tag: '🇮🇳 India' },
              { name: 'Shodhganga', desc: 'INFLIBNET Doctoral Theses', tag: '🇮🇳 India' },
              { name: 'OpenAlex', desc: '250M+ Academic Works', tag: 'Global' },
              { name: 'MIT OCW', desc: 'OpenCourseWare Syllabi', tag: 'Global' },
              { name: 'Data.gov.in', desc: 'Open Government Data India', tag: '🇮🇳 India' },
              { name: 'OpenStax', desc: 'Peer-Reviewed Open Textbooks', tag: 'Global' },
            ].map((repo, idx) => (
              <div key={idx} className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 mb-1.5 sm:mb-2 inline-block">
                  {repo.tag}
                </span>
                <h4 className="text-xs font-bold text-slate-800 leading-snug">{repo.name}</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">{repo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Popular Free Courses */}
      <section className="py-10 sm:py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Free Course Directory</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Legitimate Free Learning Opportunities</h2>
              <p className="text-xs text-slate-500 mt-1">Verified audit, open courseware, and government portals with transparent certificate disclosures.</p>
            </div>
            <NextLink
              href="/courses"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors shrink-0"
            >
              <span>View all courses</span>
              <ChevronRight className="w-4 h-4" />
            </NextLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featuredCourses.map((c) => (
              <ResourceCard
                key={c.id}
                resource={c}
                onOpenCiteModal={(r) => setActiveCiteResource(r)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section: Academic Research & Theses */}
      <section className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <FileText className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Research & Open Access</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Papers, Theses & Peer-Reviewed Literature</h2>
              <p className="text-xs text-slate-500 mt-1">Gold & Green Open Access papers, Shodhganga doctoral dissertations, and live OpenAlex connectivity.</p>
            </div>
            <NextLink
              href="/research"
              className="inline-flex items-center gap-1 text-sm font-semibold text-purple-700 hover:text-purple-900 transition-colors shrink-0"
            >
              <span>Explore Research Papers</span>
              <ChevronRight className="w-4 h-4" />
            </NextLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featuredResearch.map((p) => (
              <ResourceCard
                key={p.id}
                resource={p}
                onOpenCiteModal={(r) => setActiveCiteResource(r)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section: Curated Learning Paths */}
      <section className="py-10 sm:py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <Compass className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Structured Roadmaps</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Curated Free Learning Paths</h2>
              <p className="text-xs text-slate-500 mt-1">Sequenced collections combining open courses, textbooks, and datasets for focused skill building.</p>
            </div>
            <NextLink
              href="/learning-paths"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-900 shrink-0"
            >
              <span>All Paths</span>
              <ChevronRight className="w-4 h-4" />
            </NextLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {SEED_LEARNING_PATHS.map((path) => (
              <div
                key={path.id}
                className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-5 sm:p-6 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {path.level}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ~{path.estimatedHours} Hours
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    <NextLink href={`/learning-paths/${path.id}`} className="hover:text-emerald-700 transition-colors">
                      {path.title}
                    </NextLink>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {path.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-semibold text-slate-700">Core Outcomes:</div>
                    {path.outcomes.slice(0, 2).map((o, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{o}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{path.items.length} Curated Modules</span>
                  <NextLink
                    href={`/learning-paths/${path.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 p-1"
                  >
                    <span>Start Path</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </NextLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Research Tools & Datasets Directory Preview */}
      <section className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-100 text-cyan-700">
                  <Wrench className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Essential Tooling</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Free & Open Research Software</h2>
              <p className="text-xs text-slate-500 mt-1">Verified reference managers, citation graph visualizers, LaTeX editors, and open datasets.</p>
            </div>
            <NextLink
              href="/tools"
              className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:text-cyan-900 shrink-0"
            >
              <span>All Tools</span>
              <ChevronRight className="w-4 h-4" />
            </NextLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featuredDatasetsAndTools.map((t) => (
              <ResourceCard
                key={t.id}
                resource={t}
                onOpenCiteModal={(r) => setActiveCiteResource(r)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Core Promise Callout */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <span>The Edu.aratha Core Principle</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
            &ldquo;Learn for free. Discover research. Cite with confidence. Grow your knowledge.&rdquo;
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            By indexing legitimate public repositories instead of duplicating or paywalling them, Edu.aratha removes financial friction for millions of learners, students, and research scholars.
          </p>
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <NextLink
              href="/search"
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm shadow-md transition-colors text-center min-h-[44px] flex items-center justify-center"
            >
              Start Searching Now
            </NextLink>
            <NextLink
              href="/citation-generator"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors text-center min-h-[44px] flex items-center justify-center"
            >
              Use Citation Generator
            </NextLink>
          </div>
        </div>
      </section>
    </div>
  );
}
