'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, AlertCircle, Quote } from 'lucide-react';
import { Resource, CitationStyle, CitationInput } from '@/types';
import { generateCitation } from '@/lib/citationGenerator';

interface CitationModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CitationModal({ resource, isOpen, onClose }: CitationModalProps) {
  const [style, setStyle] = useState<CitationStyle>('apa');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen || !resource) return null;

  const citationInput: CitationInput = {
    style,
    itemType: resource.resourceType === 'paper' ? 'journal' : resource.resourceType === 'book' ? 'book' : 'website',
    title: resource.title,
    authors: resource.authors || [resource.provider || 'Edu.aratha Directory'],
    year: resource.publicationYear ? String(resource.publicationYear) : '',
    sourceTitle: resource.journalOrRepository || resource.provider,
    doi: resource.doi,
    url: resource.officialUrl
  };

  const citation = generateCitation(citationInput);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
              <Quote className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">Academic Citation Generator</h2>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">Instant bibliographic formatting & export</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close citation modal"
            className="w-10 h-10 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto overscroll-contain">
          {/* Target Title */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Referenced Resource</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 mt-0.5">{resource.title}</p>
            <div className="text-[11px] sm:text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>{resource.provider}</span>
              {resource.doi && <span>• DOI: {resource.doi}</span>}
            </div>
          </div>

          {/* Style Selector Tabs */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">Select Citation Format</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {stylesList.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`min-h-[40px] py-2 px-2 rounded-lg text-xs font-semibold transition-all text-center flex items-center justify-center ${
                    style === s.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:bg-slate-300'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Formatted Reference Entry */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Full Bibliography Reference</span>
              <button
                onClick={() => handleCopy(citation.reference, 'ref')}
                className="inline-flex items-center gap-1.5 py-1 px-2 rounded text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
              >
                {copiedType === 'ref' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Reference</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-slate-900 text-slate-100 text-[11px] sm:text-xs font-mono leading-relaxed select-all overflow-x-auto border border-slate-800 break-words">
              {citation.reference}
            </div>
          </div>

          {/* In-text Citation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">In-Text Citation</span>
              <button
                onClick={() => handleCopy(citation.inText, 'intext')}
                className="inline-flex items-center gap-1.5 py-1 px-2 rounded text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
              >
                {copiedType === 'intext' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy In-Text</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 rounded-lg bg-slate-100 text-slate-800 text-[11px] sm:text-xs font-mono select-all border border-slate-200 break-words">
              {citation.inText}
            </div>
          </div>

          {/* Academic Exports */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-2">Export Reference Formats</span>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                onClick={() => handleDownloadFile(citation.bibtex, `${resource.id}.bib`, 'application/x-bibtex')}
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                Download BibTeX (.bib)
              </button>
              <button
                onClick={() => handleDownloadFile(citation.ris, `${resource.id}.ris`, 'application/x-research-info-systems')}
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                Download RIS (.ris)
              </button>
              <button
                onClick={() => handleCopy(citation.bibtex, 'bibtex')}
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {copiedType === 'bibtex' ? <span className="text-emerald-600 font-semibold">BibTeX Copied</span> : <span>Copy BibTeX Code</span>}
              </button>
            </div>
          </div>

          {/* Disclaimer / Warning */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Academic Integrity Notice:</strong> Automatically generated citations must be reviewed for style guide nuances, volume/issue notations, and university submission standards before final thesis or paper publication.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-h-[40px] px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors flex items-center justify-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
