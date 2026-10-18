'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  FolderGit2,
  Download,
  GraduationCap,
  FileText,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  User,
  Quote
} from 'lucide-react';
import {
  getCurrentUser,
  getUserBookmarks,
  getResearchProjects,
  getStoredResources,
  updateBookmarkStatus,
  toggleUserBookmark,
  exportAllUserData
} from '@/lib/storage';
import { UserProfile, UserBookmark, Resource, ResearchProject, ReadingStatus } from '@/types';
import CitationModal from '@/components/CitationModal';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | ReadingStatus>('all');
  const [activeCite, setActiveCite] = useState<Resource | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    setBookmarks(getUserBookmarks());
    setProjects(getResearchProjects());
    setResources(getStoredResources());
  }, []);

  const handleStatusChange = (resourceId: string, newStatus: ReadingStatus) => {
    updateBookmarkStatus(resourceId, newStatus);
    setBookmarks(getUserBookmarks());
  };

  const handleRemoveBookmark = (resourceId: string) => {
    toggleUserBookmark(resourceId);
    setBookmarks(getUserBookmarks());
  };

  const handleExportData = () => {
    const dataStr = exportAllUserData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edu_aratha_workspace_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Match bookmarks with actual resources
  const bookmarkedItems = bookmarks
    .map(b => {
      const res = resources.find(r => r.id === b.resourceId);
      return res ? { ...b, resource: res } : null;
    })
    .filter(Boolean) as Array<UserBookmark & { resource: Resource }>;

  const filteredItems = activeTab === 'all'
    ? bookmarkedItems
    : bookmarkedItems.filter(item => item.status === activeTab);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      <CitationModal
        resource={activeCite}
        isOpen={Boolean(activeCite)}
        onClose={() => setActiveCite(null)}
      />

      {/* User Banner */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'Academic Scholar'}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {user?.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {user?.institution} • {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
            >
              <FolderGit2 className="w-4 h-4" />
              Manage Research Projects ({projects.length})
            </Link>
            <button
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export My References (JSON)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Workspace Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Saved Resources</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">{bookmarks.length}</div>
            <p className="text-xs text-slate-500 mt-1">Courses, papers, and open books in your lists.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Research Projects</span>
            <div className="text-3xl font-extrabold text-blue-600 mt-2">{projects.length}</div>
            <p className="text-xs text-slate-500 mt-1">Literature reviews & dissertation workspaces.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Privacy & Ownership</span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2">100%</div>
            <p className="text-xs text-slate-500 mt-1">Your notes and citations remain strictly private.</p>
          </div>
        </div>

        {/* Reading List Tabs & Items */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Personal Reading Lists</h2>
              <p className="text-xs text-slate-500 mt-0.5">Organize resources into To Read, Reading, Reviewed, or Completed.</p>
            </div>

            {/* Status tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100/80 p-1 rounded-xl">
              {(['all', 'To Read', 'Reading', 'Reviewed', 'Completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'all' ? 'All Items' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* List items */}
          {filteredItems.length > 0 ? (
            <div className="space-y-3">
              {filteredItems.map(({ resource, status, savedAt, notes }) => (
                <div
                  key={resource.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {resource.resourceType.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">{resource.provider}</span>
                      <span className="text-xs text-slate-400">• Saved {savedAt}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      <a href={resource.officialUrl} target="_blank" rel="noopener noreferrer">
                        {resource.title}
                      </a>
                    </h3>

                    {notes && (
                      <p className="text-xs text-slate-500 italic">
                        Note: &ldquo;{notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(resource.id, e.target.value as ReadingStatus)}
                      className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium"
                    >
                      <option value="To Read">To Read</option>
                      <option value="Reading">Reading</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      onClick={() => setActiveCite(resource)}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600"
                      title="Generate Citation"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={resource.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600"
                      title="Open Official Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleRemoveBookmark(resource.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No resources found in this list</h3>
              <p className="text-xs text-slate-400">Bookmark courses or papers while searching to keep track of them here.</p>
              <Link
                href="/search"
                className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Discover Resources
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
