import React from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
} from 'lucide-react';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  const journeySteps = [
    { number: '01', title: 'Career Goal', desc: 'Select target sector, desired role & dream company' },
    { number: '02', title: 'Skill Analysis', desc: 'Evaluate existing competencies against industry job benchmarks' },
    { number: '03', title: 'Skill Gap & Training', desc: 'Enroll in verified short-duration modular courses to bridge deficits' },
    { number: '04', title: 'Job Eligibility', desc: 'Attain 100% prerequisite match and unlock verified hiring status' },
    { number: '05', title: 'Apply & Track to Hire', desc: 'Submit simulated applications and track progress to final offer' },
  ];

  const sectors = [
    'IT & Software',
    'Manufacturing',
    'Healthcare',
    'Banking & Finance',
    'Agriculture',
    'Construction',
    'Logistics',
    'Retail',
    'Tourism & Hospitality',
    'Public Services',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold shadow-2xs">
              <span>National Student Career & Employment Readiness Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Career Compass
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mt-2">
                "From Skills to Careers"
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Career Compass empowers students to bridge the gap between their current academic competencies and real-world employment. Identify your skill gaps, take tailored modular training, unlock verified job eligibility, and track your path to getting hired.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                id="btn-welcome-get-started"
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition shadow-2xs cursor-pointer"
              >
                Student Sign In
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-200/80 text-left">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-2xl font-black text-slate-900">10+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Core Industry Sectors</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-2xl font-black text-blue-600">Dynamic</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Skill Gap Engine</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-2xl font-black text-emerald-600">30+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Curated Fast-Track Courses</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-2xl font-black text-purple-600">6-Stage</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Application Tracker to Hire</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5-Step Student Journey */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Clear Path to Employment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              The Complete Student Journey
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Career Compass guides you step-by-step from your current abilities to a signed job offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {journeySteps.map((step, idx) => (
              <div
                key={step.number}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-blue-600 mb-2">{step.number}</div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
                {idx < journeySteps.length - 1 && (
                  <div className="hidden md:block mt-4 text-slate-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Sectors Grid */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Industry Scope
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Explore Roles Across 10 Key Sectors
              </h2>
            </div>
            <button
              onClick={onGetStarted}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Configure Your Career Goal <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {sectors.map((sec) => (
              <div
                key={sec}
                onClick={onGetStarted}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition cursor-pointer text-center group"
              >
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
                  {sec}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Active Roles & Hiring</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Discover Your Career Match?
          </h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto">
            Create your profile, analyze your competencies against real job benchmarks, and unlock curated training today.
          </p>
          <div className="pt-2">
            <button
              id="btn-welcome-footer-cta"
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-blue-800 hover:bg-blue-50 shadow-lg transition cursor-pointer"
            >
              Get Started with Career Compass
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
