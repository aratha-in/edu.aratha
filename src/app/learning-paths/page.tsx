'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, CheckCircle2, Clock, ArrowRight, BookOpen, Layers, Award } from 'lucide-react';
import { SEED_LEARNING_PATHS } from '@/lib/data/seedData';
import { getLearningProgress } from '@/lib/storage';

export default function LearningPathsPage() {
  const [progress, setProgress] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setProgress(getLearningProgress());
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            Curated Free Roadmaps
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Curated Learning Paths
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Sequenced learning roadmaps combining open courses from SWAYAM/NPTEL and MIT, open textbooks from OpenStax, and authentic datasets. Track your progress with zero subscription fees.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SEED_LEARNING_PATHS.map((path) => {
            const completedItems = progress[path.id] || [];
            const percent = Math.round((completedItems.length / path.items.length) * 100);

            return (
              <div
                key={path.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between p-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {path.level}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      ~{path.estimatedHours} Hours
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    <Link href={`/learning-paths/${path.id}`} className="hover:text-emerald-700 transition-colors">
                      {path.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {path.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1.5">
                      <span>My Progress</span>
                      <span className="text-emerald-700">{percent}% ({completedItems.length}/{path.items.length})</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Outcomes:</span>
                    {path.outcomes.slice(0, 3).map((out, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{out}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{path.items.length} Sequenced Modules</span>
                  <Link
                    href={`/learning-paths/${path.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
