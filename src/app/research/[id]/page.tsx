'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  ExternalLink,
  CheckCircle2,
  Quote,
  Share2,
  Bookmark,
  ArrowLeft,
  Download,
  AlertCircle,
  Copy,
  Check,
  FolderGit2
} from 'lucide-react';
import { getResourceById, isResourceBookmarked, toggleUserBookmark, getResearchProjects, saveResearchProject } from '@/lib/storage';
import { Resource, CitationStyle, CitationInput, ReadingStatus } from '@/types';
import { generateCitation } from '@/lib/citationGenerator';

export default function ResearchPaperDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [paper, setPaper] = useState<Resource | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeStyle, setActiveStyle] = useState<CitationStyle>('apa');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [projectAddedMsg, setProjectAddedMsg] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getResourceById(id);
      if (found) {
        setPaper(found);
        setBookmarked(isResourceBookmarked(found.id));
      }
      setProjects(getResearchProjects());
    }
  }, [id]);

  if (!paper) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md">
          <h2 className="text-lg font-bold text-slate-800">Publication Not Found</h2>
          <p className="text-xs text-slate-500">The requested academic publication could not be located.</p>
          <Link
            href="/research"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold"
          >
            Back to Research Directory
          </Link>
        </div>
      </div>
    );
  }

  const citationInput: CitationInput = {
    style: activeStyle,
    itemType: 'journal',
    title: paper.title,
    authors: paper.authors || [paper.provider],
    year: paper.publicationYear ? String(paper.publicationYear) : '',
    sourceTitle: paper.journalOrRepository || paper.provider,
    doi: paper.doi,
    url: paper.officialUrl
  };

  const citation = generateCitation(citationInput);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleAddToProject = () => {
    if (!selectedProject) return;
    const project = projects.find(p => p.id === selectedProject);
    if (project) {
      if (!project.savedResourceIds.includes(paper.id)) {
        project.savedResourceIds.push(paper.id);
        saveResearchProject(project);
      }
      setProjectAddedMsg(true);
      setTimeout(() => setProjectAddedMsg(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Research Directory
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const now = toggleUserBookmark(paper.id);
                setBookmarked(now);
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                bookmarked
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-purple-700 text-purple-700' : ''}`} />
              {bookmarked ? 'Saved to Reading List' : 'Save to Reading List'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              {paper.publicationType || 'Journal Article'}
            </span>
            {paper.openAccessStatus && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {paper.openAccessStatus}
              </span>
            )}
            {paper.isPeerReviewed ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-blue-600" /> Peer-Reviewed
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Preprint / Working Paper
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {paper.title}
          </h1>

          {/* Authors */}
          {paper.authors && (
            <div className="text-sm text-slate-700 font-medium">
              By <span className="text-slate-900 font-semibold">{paper.authors.join(', ')}</span>
            </div>
          )}

          {/* Source meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{paper.journalOrRepository || paper.provider}</span>
            {paper.publicationYear && (
              <>
                <span>•</span>
                <span>Published {paper.publicationYear}</span>
              </>
            )}
            {paper.doi && (
              <>
                <span>•</span>
                <span className="font-mono text-purple-700">DOI: {paper.doi}</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {paper.pdfUrl ? (
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-md shadow-purple-500/20 transition-all"
              >
                <span>Read Open Access PDF</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <a
                href={paper.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-md shadow-purple-500/20 transition-all"
              >
                <span>Access on Official Repository</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Body & Citation Panel */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Abstract and content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Abstract</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {paper.abstract || paper.description}
              </p>
            </div>

            {/* Embedded Citation Generator Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">Copy Citation</h3>
                </div>
                {/* Style selector */}
                <div className="flex items-center gap-1">
                  {(['apa', 'mla', 'harvard', 'ieee', 'chicago'] as CitationStyle[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => setActiveStyle(st)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold uppercase transition-colors ${
                        activeStyle === st
                          ? 'bg-purple-100 text-purple-800'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono select-all">
                {citation.reference}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">In-text: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{citation.inText}</code></span>
                <button
                  onClick={() => handleCopy(citation.reference, 'inline')}
                  className="inline-flex items-center gap-1 font-semibold text-purple-700 hover:text-purple-900"
                >
                  {copiedType === 'inline' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'inline' ? 'Copied Citation' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Research Project Assignment & Metadata */}
          <div className="space-y-6">
            {/* Add to Research Project */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Assign to Research Project
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Organize this paper into your active thesis or literature review project.
              </p>

              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800"
              >
                <option value="">Select Research Project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>

              <button
                onClick={handleAddToProject}
                disabled={!selectedProject}
                className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
              >
                Add Paper to Project
              </button>

              {projectAddedMsg && (
                <div className="text-xs text-emerald-700 font-semibold text-center">
                  ✓ Paper added to research workspace!
                </div>
              )}
            </div>

            {/* Official Source & DOI */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                Repository Metadata
              </h3>
              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Provider:</span>
                  <span className="font-semibold text-slate-800 text-right">{paper.provider}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Verification:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Link
                  </span>
                </div>
                {paper.doi && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">DOI:</span>
                    <a
                      href={`https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-purple-700 hover:underline truncate max-w-[160px]"
                    >
                      {paper.doi}
                    </a>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Licence:</span>
                  <span className="font-medium text-slate-700 text-right">{paper.licence || 'Open Access'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
