import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';
import { RoadmapVisualizer } from '../components/RoadmapVisualizer.js';
import { Application, SkillMatchResult } from '../types/index.js';
import {
  Compass,
  TrendingUp,
  Target,
  BookOpen,
  Award,
  Briefcase,
  Send,
  Trophy,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface RoadmapPageProps {
  onNavigateTab: (tab: string) => void;
  onBack?: () => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onNavigateTab, onBack }) => {
  const { user, profile, skillMatch } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [completedCoursesCount, setCompletedCoursesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRoadmapData = async () => {
      setIsLoading(true);
      try {
        const [appData, courseData] = await Promise.all([
          api.getApplications(),
          api.getCourses(),
        ]);
        setApplications(appData.applications);
        setCompletedCoursesCount(
          courseData.courses.filter((c) => c.status === 'Completed').length
        );
      } catch (err) {
        console.error('Failed to load roadmap data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRoadmapData();
  }, []);

  const isEligible = skillMatch?.isEligible || (skillMatch?.matchPercentage === 100);
  const hasHired = applications.some((a) => a.status === 'Hired');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Career Trajectory Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Personalized Career Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Follow your verified milestones from goal setting to job eligibility, interview rounds, and final hiring.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('analyzer')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Skill Analyzer
            </button>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Matching Jobs</span>
            </button>
          </div>
        </div>

        {/* Big Roadmap Visualizer Component */}
        <RoadmapVisualizer
          profile={profile}
          skillMatch={skillMatch}
          completedCoursesCount={completedCoursesCount}
          applications={applications}
          onNavigateTab={onNavigateTab}
        />

        {/* Detailed Stage Deep Dives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 1: Preparation & Skill Acquisition */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <Target className="w-4 h-4" /> Phase 1: Skill Development
            </div>
            <h3 className="font-bold text-slate-900 text-base">Goal & Competency Building</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target role: <strong className="text-slate-900">{profile?.desiredRole || 'Unset'}</strong> in {profile?.sector || 'IT'}.
              {skillMatch && skillMatch.missingSkills.length > 0 ? (
                <> You currently need <strong>{skillMatch.missingSkills.length}</strong> additional skills to attain full hiring eligibility.</>
              ) : (
                <> All prerequisite skills have been successfully verified!</>
              )}
            </p>
            <button
              onClick={() => onNavigateTab('skills')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer pt-2"
            >
              Manage My Skills <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Phase 2: Verified Eligibility & Sourcing */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4" /> Phase 2: Job Readiness
            </div>
            <h3 className="font-bold text-slate-900 text-base">Verified Matching Jobs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isEligible ? (
                <span className="text-emerald-700 font-medium">
                  ✓ Verified 100% match. You are officially qualified to apply for top openings in your sector.
                </span>
              ) : (
                <span className="text-amber-700 font-medium">
                  In progress ({skillMatch?.matchPercentage || 0}% match). Complete recommended courses to unlock full eligibility.
                </span>
              )}
            </p>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer pt-2"
            >
              Explore Job Openings <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Phase 3: Application & Recruitment */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
              <Trophy className="w-4 h-4" /> Phase 3: Hiring Pipeline
            </div>
            <h3 className="font-bold text-slate-900 text-base">Tracking & Offer Acceptance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {hasHired ? (
                <strong className="text-purple-700">🎉 Offer secured! You have completed the hiring journey.</strong>
              ) : applications.length > 0 ? (
                <>You have {applications.length} active application(s) in review and interview stages.</>
              ) : (
                <>Submit your simulated applications once ready to track your recruiter stages.</>
              )}
            </p>
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer pt-2"
            >
              View Application Tracker <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
