'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  ArrowRight,
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
  X,
  Database,
  LogOut,
  Sparkles
} from 'lucide-react';
import {
  getStoredResources,
  saveResource,
  updateResourceStatus,
  deleteResource,
  getRealMetrics,
  getCurrentUser,
  isAdminUser,
  elevateToAdmin,
  revokeAdmin,
  syncResourcesWithNeon,
  ADMIN_PASSCODE
} from '@/lib/storage';
import { Resource, VerificationStatus, ResourceType, AccessType, UserProfile } from '@/types';
import { SUBJECT_TAXONOMY, ACCESS_TYPE_LABELS } from '@/lib/data/seedData';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [adminPasskey, setAdminPasskey] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Dashboard Data
  const [resources, setResources] = useState<Resource[]>([]);
  const [metrics, setMetrics] = useState(getRealMetrics());
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Neon DB Connection State
  const [neonStatus, setNeonStatus] = useState<{
    connected: boolean;
    configured: boolean;
    message?: string;
    resourceCount?: number;
    pgVersion?: string;
  } | null>(null);
  const [isSyncingNeon, setIsSyncingNeon] = useState(false);

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
    checkAdminAuth();

    const handleAuthChange = () => {
      checkAdminAuth();
    };

    window.addEventListener('edu_aratha_auth_change', handleAuthChange);
    return () => {
      window.removeEventListener('edu_aratha_auth_change', handleAuthChange);
    };
  }, []);

  const checkAdminAuth = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    const hasAdminRole = Boolean(user && user.role === 'admin');
    setIsAuthorized(hasAdminRole);

    if (hasAdminRole) {
      refreshData();
      checkNeonHealth();
    }
  };

  const refreshData = async () => {
    const list = getStoredResources();
    setResources(list);
    setMetrics(getRealMetrics());
  };

  const checkNeonHealth = async () => {
    try {
      const res = await fetch('/api/neon/status');
      const data = await res.json();
      setNeonStatus(data);
    } catch {
      setNeonStatus({ connected: false, configured: false, message: 'Could not contact Neon API endpoint.' });
    }
  };

  const handleSyncWithNeon = async () => {
    setIsSyncingNeon(true);
    try {
      // First try to initialize schema in case it's a new db
      await fetch('/api/neon/init', { method: 'POST' }).catch(() => {});
      const synced = await syncResourcesWithNeon();
      setResources(synced);
      setMetrics(getRealMetrics());
      await checkNeonHealth();
    } finally {
      setIsSyncingNeon(false);
    }
  };

  const handleElevateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const ok = elevateToAdmin(adminPasskey);
      if (ok) {
        setAdminPasskey('');
        checkAdminAuth();
      } else {
        setAuthError('Access Denied: Invalid administrator security key or email credentials.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLockAdmin = () => {
    revokeAdmin();
    setIsAuthorized(false);
    router.push('/');
  };

  const handleStatusChange = (id: string, newStatus: VerificationStatus) => {
    updateResourceStatus(id, newStatus);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this resource record from the catalog and database?')) {
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

  // Filtered resources list
  const filtered = resources.filter(r => {
    const matchesQuery =
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.provider.toLowerCase().includes(query.toLowerCase()) ||
      r.subject.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.verificationStatus === statusFilter;
    const matchesType = typeFilter === 'all' || r.resourceType === typeFilter;
    return matchesQuery && matchesStatus && matchesType;
  });

  // 1. Loading check state
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Verifying Administrator Clearance...</p>
        </div>
      </div>
    );
  }

  // 2. UNAUTHORIZED: High-Security Access Gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 shadow-2xl text-slate-100 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Restricted Platform Area</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Administrator Clearance Only
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              This dashboard is strictly reserved for verified Edu.aratha platform administrators and repository curators. Public access is disabled.
            </p>
          </div>

          <form onSubmit={handleElevateAdmin} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Admin Security Passcode or Authorized Key
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={adminPasskey}
                  onChange={(e) => setAdminPasskey(e.target.value)}
                  placeholder="Enter administrator security passkey..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating || !adminPasskey.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Authorize Administrator Access</span>
                </>
              )}
            </button>
          </form>

          <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between text-xs text-slate-400">
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              ← Return to Public Discovery
            </Link>
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Sign In with Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. AUTHORIZED: Full Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Admin Security Banner */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-200">Admin Clearance Active:</span>
            <span className="text-emerald-400 font-mono font-medium">{currentUser?.email || 'admin@edu.aratha.org'}</span>
            <span className="hidden md:inline px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 text-[10px] font-bold">
              ROLE: ADMINISTRATOR
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Neon Connection Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px]">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Neon DB:</span>
              {neonStatus?.connected ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  ● Connected ({neonStatus.resourceCount ?? 'Live'})
                </span>
              ) : (
                <span className="text-amber-400 font-semibold">
                  Offline Fallback
                </span>
              )}
            </div>

            <button
              onClick={handleSyncWithNeon}
              disabled={isSyncingNeon}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-semibold transition-colors"
              title="Sync local catalog with Neon Postgres"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingNeon ? 'animate-spin' : ''}`} />
              <span>{isSyncingNeon ? 'Syncing...' : 'Sync Neon'}</span>
            </button>

            <button
              onClick={handleLockAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-[11px] font-bold transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Lock & Exit Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Administrative Verification Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Content & Integrity Verification
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
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
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800">
              Repository Index Records ({filtered.length})
            </h3>
            <span className="text-xs text-slate-500">Live persistence active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Repository</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Verified</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-slate-900 line-clamp-1">{res.title}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{res.subject}</span>
                        {res.indiaFocus && (
                          <span className="text-orange-600 font-bold">🇮🇳 India Focus</span>
                        )}
                        {res.isFeatured && (
                          <span className="text-blue-600 font-bold">★ Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap capitalize text-slate-600 font-medium">
                      {res.resourceType}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {res.provider}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={res.verificationStatus}
                        onChange={(e) => handleStatusChange(res.id, e.target.value as VerificationStatus)}
                        className={`text-[11px] font-semibold py-1 px-2.5 rounded-full border ${
                          res.verificationStatus === 'Verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : res.verificationStatus === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : res.verificationStatus === 'Needs Review'
                            ? 'bg-red-50 text-red-800 border-red-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="Verified">Verified</option>
                        <option value="Pending">Pending</option>
                        <option value="Needs Review">Needs Review</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {res.lastVerifiedAt}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                      <a
                        href={res.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Open External URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Verified Resource</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., SWAYAM Machine Learning (IIT Madras)"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Type *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ResourceType)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-900"
                  >
                    <option value="course">Course</option>
                    <option value="paper">Research Paper</option>
                    <option value="book">Open Textbook</option>
                    <option value="thesis">Thesis</option>
                    <option value="dataset">Dataset</option>
                    <option value="tool">Tool</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject Area *</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-900"
                  >
                    {SUBJECT_TAXONOMY.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Provider / University *</label>
                  <input
                    type="text"
                    required
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    placeholder="e.g., NPTEL / IIT Bombay"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Access Model *</label>
                  <select
                    value={formAccess}
                    onChange={(e) => setFormAccess(e.target.value as AccessType)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-900"
                  >
                    {ACCESS_TYPE_LABELS.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Canonical URL *</label>
                <input
                  type="url"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Comprehensive description of the syllabus, topics, and authors..."
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="AI, Python, Open Source, IIT"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 text-slate-900"
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
                  <span className="font-medium text-slate-700">🇮🇳 Indian National Repository</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="font-medium text-slate-700">Featured Resource</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Add & Verify Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
