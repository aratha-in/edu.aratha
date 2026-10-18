'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  FileText,
  BookOpen,
  Database,
  Wrench,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Quote,
  Share2
} from 'lucide-react';
import { Resource } from '@/types';
import { isResourceBookmarked, toggleUserBookmark } from '@/lib/storage';

interface ResourceCardProps {
  resource: Resource;
  onOpenCiteModal?: (resource: Resource) => void;
  showSaveButton?: boolean;
}

export default function ResourceCard({
  resource,
  onOpenCiteModal,
  showSaveButton = true
}: ResourceCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setBookmarked(isResourceBookmarked(resource.id));
  }, [resource.id]);

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowBookmarked = toggleUserBookmark(resource.id);
    setBookmarked(isNowBookmarked);
    setToastMessage(isNowBookmarked ? 'Saved to Reading List' : 'Removed from Reading List');
    setTimeout(() => setToastMessage(null), 2200);
  };

  const getResourceTypeBadge = (type: Resource['resourceType']) => {
    switch (type) {
      case 'course':
        return { label: 'Course', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: GraduationCap };
      case 'paper':
        return { label: 'Research Paper', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: FileText };
      case 'book':
        return { label: 'Open Book', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: BookOpen };
      case 'journal':
        return { label: 'Journal', bg: 'bg-teal-50 text-teal-700 border-teal-200', icon: BookOpen };
      case 'thesis':
        return { label: 'Thesis / Dissertation', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: FileText };
      case 'dataset':
        return { label: 'Open Dataset', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Database };
      case 'tool':
        return { label: 'Research Tool', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: Wrench };
      default:
        return { label: 'Resource', bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: Layers };
    }
  };

  const getAccessBadgeClass = (access: Resource['accessType']) => {
    switch (access) {
      case 'Completely Free':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Open Access':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Free to Audit':
        return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'Free Learning Materials':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Paid Certificate':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Freemium':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const badgeInfo = getResourceTypeBadge(resource.resourceType);
  const TypeIcon = badgeInfo.icon;

  // Detail link logic
  const getDetailUrl = () => {
    if (resource.resourceType === 'course') return `/courses/${resource.id}`;
    if (resource.resourceType === 'paper') return `/research/${resource.id}`;
    return resource.officialUrl;
  };

  const detailUrl = getDetailUrl();
  const isInternalDetail = detailUrl.startsWith('/');

  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-white border border-slate-200 hover:border-blue-400 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200">
      {/* Toast popup */}
      {toastMessage && (
        <div className="absolute top-2 right-2 z-20 px-3 py-1 rounded bg-slate-900 text-white text-xs font-medium shadow-lg animate-in fade-in slide-in-from-top-1">
          {toastMessage}
        </div>
      )}

      <div>
        {/* Top Badges row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border ${badgeInfo.bg}`}>
              <TypeIcon className="w-3 h-3" />
              {badgeInfo.label}
            </span>

            <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium border ${getAccessBadgeClass(resource.accessType)}`}>
              {resource.accessType}
            </span>

            {resource.indiaFocus && (
              <span className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-orange-50 text-orange-800 border border-orange-200">
                🇮🇳 India Focus
              </span>
            )}
          </div>

          {/* Bookmark Action */}
          {showSaveButton && (
            <button
              onClick={handleToggleBookmark}
              title={bookmarked ? 'Remove from saved reading list' : 'Save to reading list'}
              aria-label={bookmarked ? 'Remove from saved' : 'Save to reading list'}
              className={`p-2 rounded-lg border transition-all shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center ${
                bookmarked
                  ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                  : 'text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-blue-600' : ''}`} />
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug mb-2">
          {isInternalDetail ? (
            <Link href={detailUrl}>{resource.title}</Link>
          ) : (
            <a href={resource.officialUrl} target="_blank" rel="noopener noreferrer">
              {resource.title}
            </a>
          )}
        </h3>

        {/* Authors or Provider */}
        <div className="text-xs font-medium text-slate-500 mb-2.5 flex items-center gap-x-2 gap-y-1 flex-wrap">
          <span className="text-slate-700 font-semibold">{resource.provider}</span>
          {resource.publicationYear && (
            <>
              <span className="text-slate-300">•</span>
              <span>{resource.publicationYear}</span>
            </>
          )}
          {resource.authors && resource.authors.length > 0 && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 italic truncate max-w-[200px] sm:max-w-xs">
                {resource.authors.join(', ')}
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3.5">
          {resource.description}
        </p>

        {/* Course or Paper specific highlights */}
        {resource.difficulty && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-500 mb-3 bg-slate-50/80 p-2 rounded-lg border border-slate-100">
            <span><strong>Level:</strong> {resource.difficulty}</span>
            {resource.duration && <span>• <strong>Duration:</strong> {resource.duration}</span>}
            {resource.certificateAvailable && (
              <span className="text-emerald-700 font-medium">• Certificate option</span>
            )}
          </div>
        )}

        {resource.doi && (
          <div className="text-[11px] text-slate-500 mb-3 font-mono truncate">
            DOI: {resource.doi}
          </div>
        )}
      </div>

      {/* Footer Area: Tags & Actions */}
      <div className="pt-3 border-t border-slate-100 mt-2">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-colors"
            >
              #{tag}
            </span>
          ))}
          {resource.subject && (
            <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded truncate max-w-[150px]">
              {resource.subject}
            </span>
          )}
        </div>

        {/* Card Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            {onOpenCiteModal && (
              <button
                onClick={() => onOpenCiteModal(resource)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-700 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors min-h-[36px]"
                title="Generate Citation"
              >
                <Quote className="w-3.5 h-3.5 text-slate-500" />
                <span>Cite</span>
              </button>
            )}

            {isInternalDetail && (
              <Link
                href={detailUrl}
                className="text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors px-1 py-1"
              >
                Details
              </Link>
            )}
          </div>

          {/* Official Provider Link */}
          <a
            href={resource.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors shrink-0 min-h-[36px]"
          >
            <span>Access Official</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Verification Status timestamp */}
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 gap-2">
          <span className="flex items-center gap-1 truncate">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">Verified ({resource.lastVerifiedAt})</span>
          </span>
          {resource.licence && (
            <span className="truncate max-w-[120px] sm:max-w-[140px] text-slate-400 text-right" title={resource.licence}>
              {resource.licence}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
