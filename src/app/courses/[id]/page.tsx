'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  ArrowLeft,
  Bookmark,
  Share2,
  Quote,
  ShieldCheck,
  Check
} from 'lucide-react';
import { getResourceById, isResourceBookmarked, toggleUserBookmark, updateBookmarkStatus, getUserBookmarks } from '@/lib/storage';
import { Resource, ReadingStatus } from '@/types';
import CitationModal from '@/components/CitationModal';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [course, setCourse] = useState<Resource | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ReadingStatus>('To Read');
  const [citeModalOpen, setCiteModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getResourceById(id);
      if (found) {
        setCourse(found);
        setBookmarked(isResourceBookmarked(found.id));
        const bookmarks = getUserBookmarks();
        const existing = bookmarks.find(b => b.resourceId === found.id);
        if (existing) setCurrentStatus(existing.status);
      }
    }
  }, [id]);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md">
          <h2 className="text-lg font-bold text-slate-800">Course Not Found</h2>
          <p className="text-xs text-slate-500">The requested educational course could not be located in the directory.</p>
          <Link
            href="/courses"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            Back to Course Directory
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleSave = () => {
    const isSaved = toggleUserBookmark(course.id, currentStatus);
    setBookmarked(isSaved);
  };

  const handleStatusChange = (status: ReadingStatus) => {
    setCurrentStatus(status);
    if (!bookmarked) {
      toggleUserBookmark(course.id, status);
      setBookmarked(true);
    } else {
      updateBookmarkStatus(course.id, status);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      <CitationModal
        resource={course}
        isOpen={citeModalOpen}
        onClose={() => setCiteModalOpen(false)}
      />

      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Courses Directory
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCiteModalOpen(true)}
              className="min-h-[36px] inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white shadow-2xs"
            >
              <Quote className="w-3.5 h-3.5" />
              Cite Course
            </button>
            <button
              onClick={handleShare}
              className="min-h-[36px] inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white shadow-2xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      {/* Course Header Banner */}
      <div className="bg-white border-b border-slate-200 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {course.subject}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {course.accessType}
            </span>
            {course.indiaFocus && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200">
                🇮🇳 SWAYAM / NPTEL (India)
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {course.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">{course.provider}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {course.duration || 'Self-paced'}
            </span>
            <span>•</span>
            <span>Level: <strong>{course.difficulty}</strong></span>
            <span>•</span>
            <span>Language: <strong>{course.language}</strong></span>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={course.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all text-center"
            >
              <span>Enrol / Access on Official Portal</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>

            <button
              onClick={handleToggleSave}
              className={`w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${
                bookmarked
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 shrink-0 ${bookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
              {bookmarked ? 'Saved to Workspace' : 'Save Course'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <h2 className="text-base font-bold text-slate-900">Course Overview</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Skills covered */}
            {course.skillsCovered && course.skillsCovered.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                <h2 className="text-base font-bold text-slate-900">Key Skills & Competencies Covered</h2>
                <div className="flex flex-wrap gap-2">
                  {course.skillsCovered.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certificate policy */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">Certificate & Examination Information</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {course.certificatePrice || 'Free learning access is guaranteed. Official proctored certificates or university academic credits are optional and administered directly by the provider platform.'}
              </p>
            </div>
          </div>

          {/* Right Sidebar: Progress Tracker & Metadata */}
          <div className="space-y-6">
            {/* Personal Learning Status Tracker */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Personal Learning Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Set your study status to organize this course in your personal dashboard.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {(['To Read', 'Reading', 'Reviewed', 'Completed'] as ReadingStatus[]).map((status) => {
                  const isSelected = currentStatus === status && bookmarked;
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {status === 'Reading' ? 'In Progress' : status === 'To Read' ? 'Planned' : status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Provider & Verification Meta */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                Verification Metadata
              </h3>
              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Official Provider:</span>
                  <span className="font-semibold text-slate-800 text-right">{course.provider}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Verification Status:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Last Verified Date:</span>
                  <span className="font-semibold text-slate-800">{course.lastVerifiedAt}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Licence / Terms:</span>
                  <span className="font-medium text-slate-700 text-right">{course.licence || 'Open Courseware'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
