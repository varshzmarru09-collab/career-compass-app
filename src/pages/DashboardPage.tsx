import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';
import { Application, Course, Job, SkillMatchResult } from '../types/index.js';
import { SkillBadge } from '../components/SkillBadge.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { RoadmapVisualizer } from '../components/RoadmapVisualizer.js';
import {
  Compass,
  Target,
  BookOpen,
  Briefcase,
  Send,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Layers,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab }) => {
  const { user, profile, skillMatch, refreshProfile } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [matchingJobs, setMatchingJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [appData, courseData, jobData] = await Promise.all([
        api.getApplications(),
        api.getCourses(),
        api.getJobs(),
      ]);
      setApplications(appData.applications);
      setCourses(courseData.courses);
      setJobs(jobData.jobs);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setJobs = (j: Job[]) => {
    setMatchingJobs(j);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const completedCourses = courses.filter((c) => (c as any).status === 'Completed');
  const inProgressCourses = courses.filter((c) => (c as any).status === 'In Progress');
  const hiredApplications = applications.filter((a) => a.status === 'Hired');
  const interviewApplications = applications.filter((a) => a.status === 'Interview');

  const matchPercentage = skillMatch?.matchPercentage || 0;
  const isEligible = skillMatch?.isEligible || false;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
                <span>Student Career Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Student Candidate'}!
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
                {profile?.desiredRole ? (
                  <>
                    Targeting <strong className="text-white underline">{profile.desiredRole}</strong>
                    {profile?.company && <> at <span className="text-white font-semibold">{profile.company}</span></>}
                    {profile?.sector && <> ({profile.sector})</>}.
                  </>
                ) : (
                  <span>
                    No career goal selected yet. Click below to select your sector and role to begin your skill-gap analysis.
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                id="btn-dash-run-analyzer"
                onClick={() => onNavigateTab(profile?.desiredRole ? 'analyzer' : 'career-setup')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-blue-900 hover:bg-blue-50 shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>{profile?.desiredRole ? 'Run Skill Analyzer' : 'Set Up Career Goal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {profile?.desiredRole && (
                <button
                  onClick={() => onNavigateTab('career-setup')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
                >
                  Change Career Goal
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4 Core Summary Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Widget 1: My Skills */}
          <div
            id="widget-my-skills"
            onClick={() => onNavigateTab('skills')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Skill Match
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">{matchPercentage}%</div>
              <p className="text-xs text-slate-500 mt-1">
                {skillMatch?.matchedSkills.length || 0} of {skillMatch?.requiredSkills.length || 0} core skills verified
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
              <span>Manage Skills</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Widget 2: Training */}
          <div
            id="widget-training"
            onClick={() => onNavigateTab('training')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Training & Courses
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {completedCourses.length}
                <span className="text-sm font-normal text-slate-500 ml-1">completed</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {inProgressCourses.length > 0
                  ? `${inProgressCourses.length} in progress`
                  : `${skillMatch?.missingSkills.length || 0} courses recommended`}
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold">
              <span>View Courses</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Widget 3: Jobs */}
          <div
            id="widget-jobs"
            onClick={() => onNavigateTab('jobs')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Matching Jobs
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {matchingJobs.length}
                <span className="text-sm font-normal text-slate-500 ml-1">openings</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isEligible ? (
                  <span className="text-emerald-700 font-semibold">✓ 100% Eligible to apply</span>
                ) : (
                  <span className="text-amber-700 font-semibold">Skill gap in progress</span>
                )}
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-700 font-semibold">
              <span>Browse Openings</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Widget 4: Applications */}
          <div
            id="widget-applications"
            onClick={() => onNavigateTab('applications')}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Applications & Status
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {applications.length}
                <span className="text-sm font-normal text-slate-500 ml-1">submitted</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {hiredApplications.length > 0 ? (
                  <strong className="text-purple-700">🎉 Hired ({hiredApplications.length})</strong>
                ) : interviewApplications.length > 0 ? (
                  <span className="text-blue-700 font-semibold">Interview Scheduled</span>
                ) : (
                  'Tracking in progress'
                )}
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-purple-600 font-semibold">
              <span>Track Stages</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Visual Roadmap Section */}
        <RoadmapVisualizer
          profile={profile}
          skillMatch={skillMatch}
          completedCoursesCount={completedCourses.length}
          applications={applications}
          onNavigateTab={onNavigateTab}
        />

        {/* Two Columns: Actionable Skills & Recommended Next Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Skill Competency Breakdown */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Active Skill Competencies</h3>
              </div>
              <button
                onClick={() => onNavigateTab('skills')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                Manage <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Verified Matched Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skillMatch?.matchedSkills.map((s) => (
                    <SkillBadge key={s} name={s} type="matched" size="sm" />
                  ))}
                  {(!skillMatch || skillMatch.matchedSkills.length === 0) && (
                    <span className="text-xs text-slate-400 italic">No skills matched yet.</span>
                  )}
                </div>
              </div>

              {skillMatch && skillMatch.missingSkills.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1.5">
                    Skills Requiring Development:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skillMatch.missingSkills.map((s) => (
                      <SkillBadge key={s} name={s} type="missing" size="sm" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <ProgressBar
                percentage={matchPercentage}
                label="Role Prerequisite Match"
                colorVariant={isEligible ? 'emerald' : 'blue'}
              />
            </div>
          </div>

          {/* Right: Quick Action Next Steps */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Recommended Next Actions</h3>
              </div>
            </div>

            <div className="space-y-3">
              {!isEligible ? (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-amber-950">Bridge Missing Competencies</h4>
                    <p className="text-xs text-amber-800">
                      Enroll in short-track modules to satisfy {skillMatch?.missingSkills.length} missing skill(s).
                    </p>
                    <button
                      onClick={() => onNavigateTab('training')}
                      className="text-xs font-bold text-amber-900 hover:text-amber-950 underline mt-1 block cursor-pointer"
                    >
                      Start Recommended Courses →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-emerald-950">Ready for Job Applications!</h4>
                    <p className="text-xs text-emerald-800">
                      You meet 100% of the prerequisites for {profile?.desiredRole}. Apply to active openings now.
                    </p>
                    <button
                      onClick={() => onNavigateTab('jobs')}
                      className="text-xs font-bold text-emerald-900 hover:text-emerald-950 underline mt-1 block cursor-pointer"
                    >
                      Browse Open Jobs →
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Send className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Application Pipeline</h4>
                  <p className="text-xs text-slate-600">
                    {applications.length} submitted application(s) actively tracked across interview and hiring stages.
                  </p>
                  <button
                    onClick={() => onNavigateTab('applications')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 underline mt-1 block cursor-pointer"
                  >
                    Open Application Tracker →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
