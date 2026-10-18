'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { getStoredResources } from '@/lib/storage';
import { Resource } from '@/types';
import ResourceCard from '@/components/ResourceCard';
import CitationModal from '@/components/CitationModal';

export default function BooksPage() {
  const [books, setBooks] = useState<Resource[]>([]);
  const [query, setQuery] = useState('');
  const [activeCite, setActiveCite] = useState<Resource | null>(null);

  useEffect(() => {
    const all = getStoredResources();
    setBooks(all.filter(r => r.resourceType === 'book'));
  }, []);

  const filtered = books.filter(b => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || (b.authors || []).some(a => a.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <CitationModal resource={activeCite} isOpen={Boolean(activeCite)} onClose={() => setActiveCite(null)} />

      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            Open Educational Resources (OER)
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Peer-Reviewed Open Textbooks & Books
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Free, openly licensed digital textbooks from OpenStax (Rice University), the Open Textbook Library, and Directory of Open Access Books. 100% free for students and university professors to read, download, or adopt.
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
              placeholder="Search textbooks by subject, author, title (e.g. 'Physics', 'Economics', 'Statistics')..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-amber-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(book => (
            <ResourceCard key={book.id} resource={book} onOpenCiteModal={(r) => setActiveCite(r)} />
          ))}
        </div>
      </div>
    </div>
  );
}
