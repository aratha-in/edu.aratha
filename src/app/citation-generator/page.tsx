'use client';

import React, { useState } from 'react';
import {
  Quote,
  Search,
  Copy,
  Check,
  Download,
  AlertCircle,
  RefreshCw,
  Sparkles,
  BookOpen,
  FileText,
  Globe2
} from 'lucide-react';
import { CitationInput, CitationStyle } from '@/types';
import { generateCitation } from '@/lib/citationGenerator';
import { fetchCrossrefMetadata } from '@/lib/api/crossref';

export default function CitationGeneratorPage() {
  const [doiQuery, setDoiQuery] = useState('');
  const [isFetchingDoi, setIsFetchingDoi] = useState(false);
  const [doiFetchError, setDoiFetchError] = useState<string | null>(null);

  // Citation Form Data
  const [style, setStyle] = useState<CitationStyle>('apa');
  const [itemType, setItemType] = useState<CitationInput['itemType']>('journal');
  const [title, setTitle] = useState('Attention Is All You Need');
  const [authorsString, setAuthorsString] = useState('Vaswani, Ashish; Shazeer, Noam; Parmar, Niki; Uszkoreit, Jakob; Jones, Llion');
  const [year, setYear] = useState('2017');
  const [sourceTitle, setSourceTitle] = useState('Advances in Neural Information Processing Systems (NeurIPS)');
  const [volume, setVolume] = useState('30');
  const [issue, setIssue] = useState('');
  const [pages, setPages] = useState('5998-6008');
  const [publisher, setPublisher] = useState('Curran Associates, Inc.');
  const [doi, setDoi] = useState('10.48550/arXiv.1706.03762');
  const [url, setUrl] = useState('https://arxiv.org/abs/1706.03762');

  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeMobileView, setActiveMobileView] = useState<'form' | 'output'>('form');

  const parsedAuthors = authorsString
    .split(';')
    .map(a => a.trim())
    .filter(Boolean);

  const citationInput: CitationInput = {
    style,
    itemType,
    title,
    authors: parsedAuthors.length > 0 ? parsedAuthors : ['Unknown Author'],
    year,
    sourceTitle,
    volume,
    issue,
    pages,
    publisher,
    doi,
    url
  };

  const citation = generateCitation(citationInput);

  // Quick DOI Fetch via Crossref
  const handleFetchDoi = async (targetDoi?: string) => {
    const toSearch = targetDoi || doiQuery;
    if (!toSearch.trim()) return;

    setIsFetchingDoi(true);
    setDoiFetchError(null);

    try {
      const meta = await fetchCrossrefMetadata(toSearch);
      if (meta) {
        if (meta.title) setTitle(meta.title);
        if (meta.authors) setAuthorsString(meta.authors.join('; '));
        if (meta.year) setYear(meta.year);
        if (meta.sourceTitle) setSourceTitle(meta.sourceTitle);
        if (meta.volume) setVolume(meta.volume);
        if (meta.issue) setIssue(meta.issue);
        if (meta.pages) setPages(meta.pages);
        if (meta.publisher) setPublisher(meta.publisher);
        if (meta.doi) setDoi(meta.doi);
        if (meta.url) setUrl(meta.url);
      } else {
        setDoiFetchError('Could not find metadata for this DOI on Crossref. Please verify or input manually below.');
      }
    } catch (e) {
      setDoiFetchError('Network error while querying Crossref API. Please enter details manually.');
    } finally {
      setIsFetchingDoi(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const stylesList: Array<{ id: CitationStyle; name: string }> = [
    { id: 'apa', name: 'APA 7th' },
    { id: 'mla', name: 'MLA 9th' },
    { id: 'harvard', name: 'Harvard' },
    { id: 'chicago', name: 'Chicago' },
    { id: 'ieee', name: 'IEEE' },
    { id: 'vancouver', name: 'Vancouver' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <Quote className="w-3.5 h-3.5 text-blue-600" />
            <span>Live Academic Reference Generator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Citation & Bibliography Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Format academic citations according to APA 7, MLA 9, Harvard, Chicago, IEEE, and Vancouver standards. Auto-retrieve metadata from Crossref by DOI, or manually fine-tune your bibliographic entry.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Mobile View Switcher (Tabs) */}
        <div className="lg:hidden flex rounded-xl bg-slate-200/80 p-1 mb-5">
          <button
            type="button"
            onClick={() => setActiveMobileView('form')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all text-center ${
              activeMobileView === 'form'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✏️ Citation Details
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileView('output')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              activeMobileView === 'output'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Generated Output</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & DOI Fetcher (7 cols) */}
          <div className={`lg:col-span-7 space-y-6 ${activeMobileView === 'form' ? 'block' : 'hidden lg:block'}`}>
            {/* Quick DOI Lookup Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Auto-Fill via Crossref DOI Lookup</h2>
              </div>
              <p className="text-xs text-slate-500">
                Enter any valid DOI (e.g., 10.1038/nature14539) to fetch authoritative title, authors, journal, volume, and publication year directly from Crossref.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFetchDoi();
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <input
                  type="text"
                  value={doiQuery}
                  onChange={(e) => setDoiQuery(e.target.value)}
                  placeholder="e.g. 10.1038/nature14539 or https://doi.org/..."
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-blue-600"
                />
                <button
                  type="submit"
                  disabled={isFetchingDoi || !doiQuery.trim()}
                  className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 min-h-[38px]"
                >
                  {isFetchingDoi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Lookup DOI</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sample DOIs quick buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                <span>Try sample:</span>
                <button
                  type="button"
                  onClick={() => {
                    setDoiQuery('10.1038/nature14539');
                    handleFetchDoi('10.1038/nature14539');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-blue-700 font-mono text-left truncate max-w-full"
                >
                  Nature Deep Learning (10.1038/nature14539)
                </button>
              </div>

              {doiFetchError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                  {doiFetchError}
                </div>
              )}
            </div>

            {/* Bibliographic Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Bibliographic Details (Editable)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-xs">
                {/* Source Type */}
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Source Type</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-800"
                  >
                    <option value="journal">Journal Article</option>
                    <option value="book">Book or Open Textbook</option>
                    <option value="thesis">Thesis / Dissertation</option>
                    <option value="conference">Conference Proceeding</option>
                    <option value="dataset">Dataset / Repository</option>
                    <option value="website">Academic Website</option>
                  </select>
                </div>

                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Article or Book Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-800 focus:outline-blue-600"
                  />
                </div>

                {/* Authors */}
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Authors (Separate multiple authors with semicolons &apos;;&apos;) *
                  </label>
                  <input
                    type="text"
                    value={authorsString}
                    onChange={(e) => setAuthorsString(e.target.value)}
                    placeholder="e.g. Vaswani, Ashish; Shazeer, Noam"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-800 focus:outline-blue-600"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Publication Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2023"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-800"
                  />
                </div>

                {/* Journal / Container */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Journal, Publisher, or Repository</label>
                  <input
                    type="text"
                    value={sourceTitle}
                    onChange={(e) => setSourceTitle(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-800"
                  />
                </div>

                {/* Volume & Issue */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Volume</label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="e.g. 12"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Issue / Number</label>
                  <input
                    type="text"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-800"
                  />
                </div>

                {/* Pages */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pages</label>
                  <input
                    type="text"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="e.g. 101-115"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-800"
                  />
                </div>

                {/* DOI */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">DOI (Digital Object Identifier)</label>
                  <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    placeholder="10.xxxx/..."
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Mobile button to switch to output */}
              <div className="pt-2 lg:hidden">
                <button
                  type="button"
                  onClick={() => setActiveMobileView('output')}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>View Formatted Citation</span>
                  <Quote className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Output & Formatted Citations (5 cols) */}
          <div className={`lg:col-span-5 space-y-6 ${activeMobileView === 'output' ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-5 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Generated Citation Output</h2>
                <button
                  type="button"
                  onClick={() => setActiveMobileView('form')}
                  className="text-xs font-semibold text-blue-600 hover:underline lg:hidden"
                >
                  ← Edit Fields
                </button>
              </div>

              {/* Format selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Style Format</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {stylesList.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all text-center min-h-[38px] ${
                        style === s.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Reference Entry</span>
                  <button
                    onClick={() => handleCopy(citation.reference, 'ref')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 p-1"
                  >
                    {copiedType === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'ref' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono leading-relaxed select-all border border-slate-800 break-words overflow-x-auto">
                  {citation.reference}
                </div>
              </div>

              {/* In-text */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">In-Text Citation</span>
                  <button
                    onClick={() => handleCopy(citation.inText, 'intext')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 p-1"
                  >
                    {copiedType === 'intext' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'intext' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-slate-100 text-slate-800 text-xs font-mono select-all border border-slate-200 break-words">
                  {citation.inText}
                </div>
              </div>

              {/* Export Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Export Reference Code</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadFile(citation.bibtex, 'citation.bib', 'application/x-bibtex')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 min-h-[38px]"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>BibTeX (.bib)</span>
                  </button>
                  <button
                    onClick={() => handleDownloadFile(citation.ris, 'citation.ris', 'application/x-research-info-systems')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 min-h-[38px]"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>RIS (.ris)</span>
                  </button>
                </div>
              </div>

              {/* Warning Alert */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <p>
                  <strong>Verification Warning:</strong> Always review automatically generated citations against institutional and journal guidelines before final dissertation or journal submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
