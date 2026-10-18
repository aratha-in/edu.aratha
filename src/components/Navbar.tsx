'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Database,
  Wrench,
  Compass,
  Quote,
  Search,
  User,
  ShieldCheck,
  FolderGit2,
  Bookmark,
  Menu,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { getCurrentUser, logoutUser } from '@/lib/storage';
import { UserProfile } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);

  useEffect(() => {
    const updateUser = () => setUser(getCurrentUser());
    updateUser();
    window.addEventListener('edu_aratha_auth_change', updateUser);
    window.addEventListener('storage', updateUser);
    return () => {
      window.removeEventListener('edu_aratha_auth_change', updateUser);
      window.removeEventListener('storage', updateUser);
    };
  }, []);

  const navLinks = [
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Free Courses', href: '/courses', icon: GraduationCap },
    { label: 'Research Papers', href: '/research', icon: FileText },
    { label: 'Citation Generator', href: '/citation-generator', icon: Quote },
    { label: 'Learning Paths', href: '/learning-paths', icon: Compass },
    { label: 'Tools', href: '/tools', icon: Wrench },
  ];

  const resourceDropdownItems = [
    { label: 'Open Textbooks & Books', href: '/books', desc: 'OpenStax, DOAB, OTL' },
    { label: 'Theses & Dissertations', href: '/theses', desc: 'Shodhganga INFLIBNET, OATD' },
    { label: 'Open Datasets', href: '/datasets', desc: 'Data.gov.in, World Bank, Zenodo' },
    { label: 'Academic Journals', href: '/journals', desc: 'DOAJ, Current Science, Open Access' },
  ];

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setResourcesMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      {/* Top Banner - India Academic Repositories & Free Mission */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-xs text-white py-1.5 px-3 sm:px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center justify-center bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold shrink-0">
              🇮🇳 India & Global
            </span>
            <span className="hidden md:inline text-slate-200 truncate">
              Indexing SWAYAM, NPTEL, Shodhganga, DOAJ, OpenAlex & OpenStax with zero paywalls.
            </span>
            <span className="md:hidden text-[11px] text-slate-200 truncate">
              SWAYAM, NPTEL & OpenAlex
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-slate-300 text-[11px] shrink-0">
            <Link href="/about" className="hover:text-white transition-colors">Why Free?</Link>
            {user?.role === 'admin' && (
              <>
                <span>•</span>
                <Link href="/admin" className="hover:text-amber-300 text-amber-200 flex items-center gap-1 transition-colors">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  Edu<span className="text-blue-600">.aratha</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 sm:py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  FREE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Open Education & Research Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}

            {/* More Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setResourcesMenuOpen(!resourcesMenuOpen)}
                onBlur={() => setTimeout(() => setResourcesMenuOpen(false), 200)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  resourcesMenuOpen || ['/books', '/theses', '/datasets', '/journals'].includes(pathname)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span>Repositories</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {resourcesMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {resourceDropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                      onClick={() => setResourcesMenuOpen(false)}
                    >
                      <div className="text-sm font-semibold text-slate-800">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Action Area: Auth / Workspace */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-blue-600 font-medium leading-tight">
                      Workspace Active
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                      <p className="text-xs font-semibold text-slate-800 truncate">{user.email}</p>
                      {user.institution && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.institution}</p>
                      )}
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                      Reading Lists & Bookmarks
                    </Link>
                    <Link
                      href="/projects"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                      Research Projects
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-50"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        Admin Verification
                      </Link>
                    )}
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        logoutUser();
                        setUser(null);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs shadow-blue-500/20 transition-all hover:shadow"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: User avatar (if logged in) + Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center font-bold text-xs"
                title="Go to Dashboard"
              >
                {user.name.charAt(0)}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 top-[105px] bg-slate-900/40 backdrop-blur-xs z-40 animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[105px] bottom-0 z-50 bg-white border-t border-slate-200 overflow-y-auto px-4 pt-3 pb-safe space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          {/* User Status Bar inside Mobile Drawer */}
          {user ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[180px]">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  logoutUser();
                  setUser(null);
                }}
                className="text-xs font-semibold text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1 pb-1">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-3 rounded-xl border border-slate-300 text-slate-800 font-semibold text-xs bg-white hover:bg-slate-50 shadow-2xs"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-3 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-xs hover:bg-blue-700"
              >
                Start Learning Free
              </Link>
            </div>
          )}

          {/* Core Navigation Items */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Core Directory</p>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Repositories Section */}
          <div className="pt-2 pb-1 border-t border-slate-100 space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Repositories</p>
            {resourceDropdownItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <span className="font-medium text-slate-800">{item.label}</span>
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">{item.desc}</span>
              </Link>
            ))}
          </div>

          {/* Workspace Quick Links */}
          <div className="pt-2 pb-6 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-xs hover:bg-blue-700"
            >
              <Bookmark className="w-4 h-4" />
              <span>Personal Reading Lists & Workspace</span>
            </Link>
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 bg-white font-medium text-xs hover:bg-slate-50"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Research Projects</span>
            </Link>
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-xl border border-amber-300 text-amber-800 bg-amber-50 font-medium text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Verification Portal</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
