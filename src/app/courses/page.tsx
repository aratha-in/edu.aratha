'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  Award,
  Clock,
  Layers,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { getStoredResources } from '@/lib/storage';
import { Resource } from '@/types';
import ResourceCard from '@/components/ResourceCard';
import CitationModal from '@/components/CitationModal';

export default function CoursesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [query, setQuery] = useState('');
  const [selectedAccess, setSelectedAccess] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [indiaOnly, setIndiaOnly] = useState<boolean>(false);
  const [activeCiteResource, setActiveCiteResource] = useState<Resource | null>(null);

  useEffect(() => {
    const all = getStoredResources();
    setResources(all.filter(r => r.resourceType === 'course'));
  }, []);

  const providers = useMemo(() => {
    const list = Array.from(new Set(resources.map(r => r.provider)));
    return ['all', ...list];
  }, [resources]);

  const filteredCourses = useMemo(() => {
    return resources.filter((c) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        const inTitle = c.title.toLowerCase().includes(q);
        const inDesc = c.description.toLowerCase().includes(q);
        const inSkills = (c.skillsCovered || []).some(s => s.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inSkills) return false;
      }
      if (selectedAccess !== 'all' && c.accessType !== selectedAccess) return false;
      if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) return false;
      if (selectedProvider !== 'all' && c.provider !== selectedProvider) return false;
      if (indiaOnly && !c.indiaFocus) return false;
      return true;
    });
  }, [resources, query, selectedAccess, selectedDifficulty, selectedProvider, indiaOnly]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <CitationModal
        resource={activeCiteResource}
        isOpen={Boolean(activeCiteResource)}
        onClose={() => setActiveCiteResource(null)}
      />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Curated Free Course Directory</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Legitimate Free Online Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Index of university-level online courses from SWAYAM, NPTEL (IITs & IIMs), MIT OpenCourseWare, Harvard, and Stanford. We clearly disclose whether auditing is free, and where proctored certificates involve fees.
          </p>

          {/* Access Model Disclaimer Callout */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900 max-w-3xl">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Transparency Guarantee:</strong> We never claim a course is 100% free if only the video lectures can be audited. Each card explicitly specifies whether graded assignments or certificates require optional fees.
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses by topic, skills (e.g., 'Python', 'Algorithms')..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-blue-600"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
              {/* Access Classification */}
              <select
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value)}
                className="w-full sm:w-auto text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
              >
                <option value="all">All Access Types</option>
                <option value="Completely Free">Completely Free</option>
                <option value="Free to Audit">Free to Audit</option>
                <option value="Free Learning Materials">Free Learning Materials</option>
              </select>

              {/* Difficulty */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full sm:w-auto text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
              >
                <option value="all">All Difficulty Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Providers */}
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full sm:w-auto text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium sm:max-w-[200px] truncate"
              >
                <option value="all">All Providers</option>
                {providers.filter(p => p !== 'all').map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* India Only Toggle */}
            <label className="flex items-center justify-between sm:justify-start gap-2 cursor-pointer text-xs font-semibold text-slate-700 py-1">
              <span>🇮🇳 SWAYAM / NPTEL Only</span>
              <input
                type="checkbox"
                checked={indiaOnly}
                onChange={(e) => setIndiaOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
            </label>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCourses.map((course) => (
              <ResourceCard
                key={course.id}
                resource={course}
                onOpenCiteModal={(r) => setActiveCiteResource(r)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <h3 className="text-base font-bold text-slate-800">No courses match your filter criteria</h3>
            <p className="text-xs text-slate-500">Try broadening your search keywords or resetting the provider filters.</p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedAccess('all');
                setSelectedDifficulty('all');
                setSelectedProvider('all');
                setIndiaOnly(false);
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
