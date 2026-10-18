'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Plus,
  Trash2,
  Edit3,
  FileText,
  HelpCircle,
  StickyNote,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Quote,
  X
} from 'lucide-react';
import {
  getResearchProjects,
  saveResearchProject,
  deleteResearchProject,
  getStoredResources
} from '@/lib/storage';
import { ResearchProject, ProjectNote, Resource } from '@/types';
import CitationModal from '@/components/CitationModal';
import { generateCitation } from '@/lib/citationGenerator';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [activeProject, setActiveProject] = useState<ResearchProject | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [activeCite, setActiveCite] = useState<Resource | null>(null);

  // New Project Form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionsList, setNewQuestionsList] = useState<string[]>([]);
  const [newTags, setNewTags] = useState('');

  // Note form for active project
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    const list = getResearchProjects();
    setProjects(list);
    if (list.length > 0) setActiveProject(list[0]);
    setResources(getStoredResources());
  }, []);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const proj: ResearchProject = {
      id: `proj-${Date.now()}`,
      userId: 'usr-demo-01',
      title: newTitle.trim(),
      description: newDesc.trim(),
      topic: newTopic.trim(),
      researchQuestions: newQuestionsList,
      savedResourceIds: [],
      notes: [],
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'In Progress',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    saveResearchProject(proj);
    const updated = getResearchProjects();
    setProjects(updated);
    setActiveProject(proj);
    setIsCreatingModal(false);

    // Reset
    setNewTitle('');
    setNewDesc('');
    setNewTopic('');
    setNewQuestionsList([]);
    setNewTags('');
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setNewQuestionsList([...newQuestionsList, newQuestion.trim()]);
    setNewQuestion('');
  };

  const handleAddNoteToActive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !noteTitle.trim()) return;

    const note: ProjectNote = {
      id: `note-${Date.now()}`,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updated = {
      ...activeProject,
      notes: [note, ...activeProject.notes]
    };

    saveResearchProject(updated);
    setActiveProject(updated);
    setProjects(getResearchProjects());
    setNoteTitle('');
    setNoteContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      notes: activeProject.notes.filter(n => n.id !== noteId)
    };
    saveResearchProject(updated);
    setActiveProject(updated);
    setProjects(getResearchProjects());
  };

  const handleDeleteProject = (projId: string) => {
    deleteResearchProject(projId);
    const remaining = getResearchProjects();
    setProjects(remaining);
    setActiveProject(remaining.length > 0 ? remaining[0] : null);
  };

  // Export Bibliography of Active Project
  const handleExportProjectBibliography = () => {
    if (!activeProject) return;
    const projectPapers = resources.filter(r => activeProject.savedResourceIds.includes(r.id));
    if (projectPapers.length === 0) {
      alert('No papers saved to this project yet.');
      return;
    }

    const bibtexEntries = projectPapers.map(p => {
      const cite = generateCitation({
        style: 'apa',
        itemType: 'journal',
        title: p.title,
        authors: p.authors || [p.provider],
        year: p.publicationYear ? String(p.publicationYear) : '',
        sourceTitle: p.journalOrRepository || p.provider,
        doi: p.doi,
        url: p.officialUrl
      });
      return cite.bibtex;
    }).join('\n\n');

    const blob = new Blob([bibtexEntries], { type: 'application/x-bibtex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_references.bib`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const projectSavedResources = activeProject
    ? resources.filter(r => activeProject.savedResourceIds.includes(r.id))
    : [];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      <CitationModal
        resource={activeCite}
        isOpen={Boolean(activeCite)}
        onClose={() => setActiveCite(null)}
      />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
              <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
              Integrated Research Workspace
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Research Projects & Private Notes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Organize literature reviews, doctoral theses, research questions, and structured bibliographies in private, isolated workspaces.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            New Research Project
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Projects List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Projects ({projects.length})
            </h2>

            <div className="space-y-2">
              {projects.map((proj) => {
                const isSelected = activeProject?.id === proj.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => setActiveProject(proj)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {proj.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {proj.savedResourceIds.length} Papers
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{proj.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{proj.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Project Details & Notes (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {activeProject ? (
              <>
                {/* Project Overview Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {activeProject.topic || 'General Research'}
                        </span>
                        <span className="text-xs text-slate-400">• Updated {activeProject.updatedAt}</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mt-1">{activeProject.title}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportProjectBibliography}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                        title="Download BibTeX for this project"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        Export BibTeX
                      </button>
                      <button
                        onClick={() => handleDeleteProject(activeProject.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeProject.description}
                  </p>

                  {/* Research Questions */}
                  {activeProject.researchQuestions && activeProject.researchQuestions.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        <span>Core Research Questions</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {activeProject.researchQuestions.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-bold text-blue-600">{idx + 1}.</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {activeProject.tags && (
                    <div className="flex flex-wrap gap-1.5">
                      {activeProject.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Saved Papers in this Project */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      Saved Papers & Literature ({projectSavedResources.length})
                    </h3>
                    <Link
                      href="/research"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      + Find More Papers
                    </Link>
                  </div>

                  {projectSavedResources.length > 0 ? (
                    <div className="space-y-2.5">
                      {projectSavedResources.map((paper) => (
                        <div
                          key={paper.id}
                          className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between gap-3 bg-slate-50/40 text-xs"
                        >
                          <div>
                            <h4 className="font-bold text-slate-900 line-clamp-1">{paper.title}</h4>
                            <div className="text-slate-500 text-[11px] mt-0.5">
                              {paper.provider} {paper.doi && `• DOI: ${paper.doi}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setActiveCite(paper)}
                              className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:text-blue-600 font-semibold"
                            >
                              Cite
                            </button>
                            <a
                              href={paper.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-slate-400 hover:text-slate-700"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                      No papers assigned to this project yet. Visit the <Link href="/research" className="text-blue-600 underline">Research Papers</Link> directory to assign articles here.
                    </div>
                  )}
                </div>

                {/* Project Private Notes */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <StickyNote className="w-4 h-4 text-amber-600" />
                      Private Project Notes ({activeProject.notes.length})
                    </h3>
                  </div>

                  {/* Add note form */}
                  <form onSubmit={handleAddNoteToActive} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Note Title (e.g., 'Methodology hypothesis', 'Questions for supervisor')..."
                      className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Write your research notes, findings, or critique..."
                      rows={3}
                      className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                    <button
                      type="submit"
                      disabled={!noteTitle.trim()}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold"
                    >
                      Save Note
                    </button>
                  </form>

                  {/* Existing Notes */}
                  {activeProject.notes.length > 0 ? (
                    <div className="space-y-3">
                      {activeProject.notes.map((note) => (
                        <div key={note.id} className="p-4 rounded-xl border border-slate-200 bg-amber-50/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900">{note.title}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span>{note.createdAt}</span>
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="text-slate-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4">
                      No private notes yet for this project.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No project selected</h3>
                <p className="text-xs text-slate-500">Create a new research project to begin organizing papers and notes.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Research Project</h3>
              <button onClick={() => setIsCreatingModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Machine Learning in Indian Agriculture"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Research Field / Topic</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Agritech & Deep Learning"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Objective of this study or literature survey..."
                  rows={3}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Research Questions</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter a research question..."
                    className="flex-1 py-1.5 px-3 rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold"
                  >
                    Add
                  </button>
                </div>
                {newQuestionsList.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {newQuestionsList.map((q, idx) => (
                      <li key={idx} className="text-slate-600 bg-slate-50 p-1.5 rounded flex justify-between">
                        <span>{idx + 1}. {q}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. AI, Crop Yield, Remote Sensing"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
