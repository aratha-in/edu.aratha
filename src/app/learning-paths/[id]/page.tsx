'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  Circle,
  ExternalLink,
  Clock,
  Layers,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { SEED_LEARNING_PATHS } from '@/lib/data/seedData';
import { getLearningProgress, togglePathItemCompletion } from '@/lib/storage';

export default function LearningPathDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [path, setPath] = useState(SEED_LEARNING_PATHS.find(p => p.id === id || p.slug === id));
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  useEffect(() => {
    if (path) {
      const allProgress = getLearningProgress();
      setCompletedItems(allProgress[path.id] || []);
    }
  }, [path]);

  if (!path) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md">
          <h2 className="text-lg font-bold text-slate-800">Learning Path Not Found</h2>
          <p className="text-xs text-slate-500">The requested learning curriculum could not be found.</p>
          <Link
            href="/learning-paths"
            className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
          >
            Back to Learning Paths
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleItem = (itemId: string) => {
    togglePathItemCompletion(path.id, itemId);
    const updated = getLearningProgress();
    setCompletedItems(updated[path.id] || []);
  };

  const percent = Math.round((completedItems.length / path.items.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/learning-paths"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Learning Paths
          </Link>
          <div className="text-xs font-semibold text-slate-500">
            Progress: <span className="text-emerald-700 font-bold">{percent}%</span> ({completedItems.length} of {path.items.length} completed)
          </div>
        </div>
      </div>

      {/* Path Banner */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {path.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {path.level} Level
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 flex items-center gap-1">
              <Clock className="w-3 h-3" /> ~{path.estimatedHours} Total Study Hours
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {path.title}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            {path.description}
          </p>

          {/* Progress Visual Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Overall Roadmap Completion</span>
              <span className="text-emerald-700">{percent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Outline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Outcomes Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <h2 className="text-base font-bold text-slate-900">What You Will Master</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {path.outcomes.map((out, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{out}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Curated Learning Steps</h2>

          <div className="space-y-3">
            {path.items.map((item, index) => {
              const isDone = completedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDone
                      ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => handleToggleItem(item.id)}
                      className="mt-0.5 shrink-0 text-emerald-600 hover:scale-110 transition-transform"
                      title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                          Step {item.order}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-800">
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-700">
                          {item.provider}
                        </span>
                      </div>

                      <h3 className={`text-sm font-bold ${isDone ? 'text-slate-600 line-through' : 'text-slate-900'}`}>
                        {item.title}
                      </h3>

                      {item.notes && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3 sm:self-center pl-8 sm:pl-0">
                    {item.estimatedMinutes && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        ~{Math.round(item.estimatedMinutes / 60)} hrs
                      </span>
                    )}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                    >
                      <span>Study Module</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
