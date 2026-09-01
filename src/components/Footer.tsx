import React from 'react';
import { Compass, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-base tracking-tight">Career Compass</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A comprehensive student employment and skilling platform connecting learners, academic credentials, and industry hiring standards through transparent skill-gap analysis and verifiable roadmaps.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full-Stack Prototype | Modular architecture for Student, Trainer & Government modules</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Student Journey
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>1. Career Goal Definition</li>
              <li>2. Algorithmic Skill Analysis</li>
              <li>3. Targeted Course Training</li>
              <li>4. Job Eligibility & Matching</li>
              <li>5. Application Status Tracking</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Supported Sectors
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>IT & Software • Manufacturing</li>
              <li>Healthcare • Banking & Finance</li>
              <li>Logistics • Construction</li>
              <li>Retail • Tourism • Agriculture</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Career Compass. Built for Student Career & Employment Readiness.</p>
          <div className="flex items-center gap-1">
            <span>Designed with precision & craftsmanship</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
