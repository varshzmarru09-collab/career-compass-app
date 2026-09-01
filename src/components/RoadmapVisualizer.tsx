import React from 'react';
import {
  Target,
  SearchCode,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Award,
  Briefcase,
  Send,
  Users,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { StudentProfile, SkillMatchResult, Application } from '../types/index.js';

interface RoadmapVisualizerProps {
  profile: StudentProfile | null;
  skillMatch: SkillMatchResult | null;
  completedCoursesCount: number;
  applications: Application[];
  onNavigateTab: (tab: string) => void;
}

export const RoadmapVisualizer: React.FC<RoadmapVisualizerProps> = ({
  profile,
  skillMatch,
  completedCoursesCount,
  applications,
  onNavigateTab,
}) => {
  const isGoalSet = !!profile?.desiredRole;
  const hasSkillAnalysis = !!skillMatch;
  const hasSkillGaps = skillMatch ? skillMatch.missingSkills.length > 0 : true;
  const isTrainingActive = completedCoursesCount > 0 || (skillMatch && skillMatch.matchedCount > 0);
  const isSkillsCompleted = skillMatch ? skillMatch.isEligible || skillMatch.matchPercentage === 100 : false;
  const isJobEligible = isSkillsCompleted;
  const hasApplied = applications.length > 0;
  const hasInterview = applications.some((a) => ['Interview', 'Selected', 'Hired'].includes(a.status));
  const isHired = applications.some((a) => a.status === 'Hired');

  // Stages definition
  const stages = [
    {
      id: 'goal',
      number: 1,
      title: 'Career Goal',
      description: profile ? `${profile.desiredRole} (${profile.sector})` : 'Define sector and target role',
      status: isGoalSet ? 'completed' : 'current',
      icon: Target,
      tab: 'profile',
      action: 'Edit Goal',
    },
    {
      id: 'analysis',
      number: 2,
      title: 'Skill Analysis',
      description: skillMatch ? `${skillMatch.studentSkills.length} skills analyzed against role` : 'Analyze baseline skill set',
      status: hasSkillAnalysis ? 'completed' : isGoalSet ? 'current' : 'upcoming',
      icon: SearchCode,
      tab: 'analyzer',
      action: 'View Analysis',
    },
    {
      id: 'gap',
      number: 3,
      title: 'Skill Gap',
      description: skillMatch
        ? skillMatch.missingSkills.length > 0
          ? `${skillMatch.missingSkills.length} missing skills identified`
          : 'Zero skill gaps found!'
        : 'Identify missing requirements',
      status: hasSkillAnalysis
        ? hasSkillGaps
          ? 'current'
          : 'completed'
        : 'upcoming',
      icon: AlertTriangle,
      tab: 'skills',
      action: 'Review Gaps',
    },
    {
      id: 'training',
      number: 4,
      title: 'Training / Courses',
      description: `${completedCoursesCount} module(s) completed via portal`,
      status: isSkillsCompleted
        ? 'completed'
        : isTrainingActive
        ? 'current'
        : 'upcoming',
      icon: BookOpen,
      tab: 'training',
      action: 'Start Courses',
    },
    {
      id: 'completion',
      number: 5,
      title: 'Skill Completion',
      description: isSkillsCompleted ? '100% requirements satisfied' : `${skillMatch?.matchPercentage || 0}% match achieved`,
      status: isSkillsCompleted ? 'completed' : hasSkillAnalysis ? 'current' : 'upcoming',
      icon: CheckCircle2,
      tab: 'skills',
      action: 'Verify Skills',
    },
    {
      id: 'eligibility',
      number: 6,
      title: 'Job Eligibility',
      description: isJobEligible ? 'Verified Eligible for industry hiring' : 'Requires prerequisite skills',
      status: isJobEligible ? 'completed' : 'upcoming',
      icon: Award,
      tab: 'jobs',
      action: 'Check Status',
    },
    {
      id: 'matching_jobs',
      number: 7,
      title: 'Matching Jobs',
      description: 'Filtered openings for your profile & skills',
      status: hasApplied ? 'completed' : isJobEligible ? 'current' : 'upcoming',
      icon: Briefcase,
      tab: 'jobs',
      action: 'Browse Jobs',
    },
    {
      id: 'application',
      number: 8,
      title: 'Application',
      description: hasApplied ? `${applications.length} application(s) submitted` : 'Submit simulated application',
      status: hasApplied ? 'completed' : isJobEligible ? 'current' : 'upcoming',
      icon: Send,
      tab: 'applications',
      action: 'View Applications',
    },
    {
      id: 'interview',
      number: 9,
      title: 'Interview',
      description: hasInterview ? 'Interview round scheduled / in progress' : 'Awaiting recruiter screening',
      status: isHired ? 'completed' : hasInterview ? 'current' : 'upcoming',
      icon: Users,
      tab: 'applications',
      action: 'Track Interview',
    },
    {
      id: 'hired',
      number: 10,
      title: 'Hired',
      description: isHired ? 'Employment Secured! Offer Accepted.' : 'Final candidate selection',
      status: isHired ? 'completed' : 'upcoming',
      icon: Trophy,
      tab: 'applications',
      action: 'View Offer',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Personalized Career Progression Roadmap
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Dynamic end-to-end milestone tracking from initial skills to certified employment.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span> Active / In-Progress
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Upcoming
          </span>
        </div>
      </div>

      {/* Horizontal / Grid Stepper for Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';

          return (
            <div
              key={stage.id}
              onClick={() => onNavigateTab(stage.tab)}
              className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isCompleted
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/70'
                  : isCurrent
                  ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {stage.number}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg ${
                      isCompleted
                        ? 'text-emerald-700 bg-emerald-100'
                        : isCurrent
                        ? 'text-blue-700 bg-blue-100'
                        : 'text-slate-500 bg-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition">
                  {stage.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {stage.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span
                  className={`font-semibold ${
                    isCompleted
                      ? 'text-emerald-700'
                      : isCurrent
                      ? 'text-blue-700'
                      : 'text-slate-500'
                  }`}
                >
                  {isCompleted ? 'Completed' : isCurrent ? 'Active Now' : 'Pending'}
                </span>
                <span className="text-blue-600 font-medium group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                  {stage.action}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
