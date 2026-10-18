'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Archive,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Eye,
  SlidersHorizontal,
  X
} from 'lucide-react';
import {
  getStoredResources,
  saveResource,
  updateResourceStatus,
  deleteResource,
  getRealMetrics
} from '@/lib/storage';
import { Resource, VerificationStatus, ResourceType, AccessType } from '@/types';
import { SUBJECT_TAXONOMY, ACCESS_TYPE_LABELS } from '@/lib/data/seedData';

export default function AdminDashboardPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [metrics, setMetrics] = useState(getRealMetrics());
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form for adding new resource
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<ResourceType>('course');
  const [formSubject, setFormSubject] = useState(SUBJECT_TAXONOMY[1]);
  const [formProvider, setFormProvider] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formAccess, setFormAccess] = useState<AccessType>('Completely Free');
  const [formDesc, setFormDesc] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formIndiaFocus, setFormIndiaFocus] = useState(false);
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const list = getStoredResources();
    setResources(list);
    setMetrics(getRealMetrics());
  };

  const handleStatusChange = (id: string, newStatus: VerificationStatus) => {
    updateResourceStatus(id, newStatus);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this resource record?')) {
      deleteResource(id);
      refreshData();
    }
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    const newRes: Resource = {
      id: `${formType}-${Date.now()}`,
      title: formTitle.trim(),
      slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: formDesc.trim() || 'Verified educational resource in Edu.aratha directory.',
      resourceType: formType,
      subject: formSubject,
      provider: formProvider.trim() || 'Official Open Repository',
      officialUrl: formUrl.trim(),
      accessType: formAccess,
      language: 'English',
      verificationStatus: 'Verified',
      lastVerifiedAt: new Date().toISOString().split('T')[0],
      isFeatured: formIsFeatured,
      indiaFocus: formIndiaFocus,
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
      metrics: { views: 50, saves: 5 }
    };

    saveResource(newRes);
    refreshData();
    setIsAddModalOpen(false);

    // Reset Form
    setFormTitle('');
    setFormProvider('');
    setFormUrl('');
    setFormDesc('');
    setFormTags('');
    setFormIndiaFocus(false);
    setFormIsFeatured(false);
  };

  const filteredResources = resources.filter((r) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const inTitle = r.title.toLowerCase().includes(q);
      const inProv = r.provider.toLowerCase().includes(q);
      if (!inTitle && !inProv) return false;
    }
    if (statusFilter !== 'all' && r.verificationStatus !== statusFilter) return false;
    if (typeFilter !== 'all' && r.resourceType !== typeFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Administrative Verification Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Platform Content & Integrity Verification
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Manage repository listings, review link authenticity, update verification timestamps, and ensure strict compliance with open-access standards.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Verified Resource
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Verification Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Catalog</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{metrics.totalResources}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across all 7 resource types</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Verified Active</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{metrics.verifiedResources}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Current valid links</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Indian Repositories</span>
            <div className="text-2xl font-extrabold text-orange-600 mt-1">{metrics.indianFocusCount}</div>
            <div className="text-[11px] text-orange-700 mt-0.5">SWAYAM, Shodhganga, data.gov.in</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Open Access Guarantee</span>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">100%</div>
            <div className="text-[11px] text-blue-700 mt-0.5">Zero paywalls for discovery</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search catalog by title or provider..."
                className="w-full text-xs pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="all">All Verification Statuses</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Needs Review">Needs Review</option>
                <option value="Archived">Archived</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="all">All Resource Types</option>
                <option value="course">Course</option>
                <option value="paper">Research Paper</option>
                <option value="book">Book</option>
                <option value="thesis">Thesis</option>
                <option value="dataset">Dataset</option>
                <option value="tool">Tool</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resource Management Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Access Model</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4">Last Verified</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredResources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                      <div className="line-clamp-1">{res.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">{res.subject}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {res.resourceType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 truncate max-w-[150px]">
                      {res.provider}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium text-slate-600">
                        {res.accessType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={res.verificationStatus}
                        onChange={(e) => handleStatusChange(res.id, e.target.value as VerificationStatus)}
                        className={`text-xs font-semibold py-1 px-2 rounded-lg border ${
                          res.verificationStatus === 'Verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : res.verificationStatus === 'Needs Review'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="Verified">Verified</option>
                        <option value="Needs Review">Needs Review</option>
                        <option value="Pending">Pending</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {res.lastVerifiedAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={res.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                          title="Open official URL"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(res.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Verified Resource</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Resource Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Machine Learning by Stanford University"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Resource Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ResourceType)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="course">Course</option>
                    <option value="paper">Research Paper</option>
                    <option value="book">Book / Textbook</option>
                    <option value="thesis">Thesis</option>
                    <option value="dataset">Dataset</option>
                    <option value="journal">Journal</option>
                    <option value="tool">Research Tool</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Access Model</label>
                  <select
                    value={formAccess}
                    onChange={(e) => setFormAccess(e.target.value as AccessType)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white"
                  >
                    {ACCESS_TYPE_LABELS.filter(a => a !== 'All Access Types').map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white"
                  >
                    {SUBJECT_TAXONOMY.filter(s => s !== 'All Subjects').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Provider / University</label>
                  <input
                    type="text"
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    placeholder="e.g. NPTEL (IIT Madras)"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Resource URL *</label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full py-2 px-3 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description / Summary</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Accurate description of learning content or academic paper..."
                  rows={3}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="e.g. Python, AI, Open Access"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIndiaFocus}
                    onChange={(e) => setFormIndiaFocus(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>🇮🇳 India Focus (SWAYAM / NPTEL / Shodhganga)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save & Verify Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
