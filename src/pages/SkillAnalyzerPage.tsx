import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';
import { Role, Course, CourseStatus, SkillMatchResult } from '../types/index.js';
import { SkillBadge } from '../components/SkillBadge.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { CourseModal } from '../components/CourseModal.js';
import {
  Compass,
  Target,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Building,
  GraduationCap,
  PlayCircle,
  Award,
} from 'lucide-react';

interface SkillAnalyzerPageProps {
  onNavigateTab: (tab: string) => void;
  onBack?: () => void;
}

export const SkillAnalyzerPage: React.FC<SkillAnalyzerPageProps> = ({ onNavigateTab, onBack }) => {
  const { user, profile, refreshProfile } = useAuth();

  const [roleDetails, setRoleDetails] = useState<Role | undefined>(undefined);
  const [analysis, setAnalysis] = useState<SkillMatchResult | null>(null);
  const [courses, setCourses] = useState<(Course & { status: CourseStatus; progress: number; isMissingForUser: boolean })[]>([]);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<(Course & { status: CourseStatus; progress: number }) | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionInProgress, setIsActionInProgress] = useState<boolean>(false);

  const fetchAnalysisData = async () => {
    setIsLoading(true);
    try {
      const [analyzerData, coursesData] = await Promise.all([
        api.getSkillAnalysis(),
        api.getCourses(),
      ]);
      setRoleDetails(analyzerData.role);
      setAnalysis(analyzerData.analysis);
      setCourses(coursesData.courses);
    } catch (err) {
      console.error('Failed to load skill analysis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const handleStartCourse = async (courseId: string) => {
    setIsActionInProgress(true);
    try {
      await api.startCourse(courseId);
      await fetchAnalysisData();
      await refreshProfile();
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleCompleteCourse = async (courseId: string) => {
    setIsActionInProgress(true);
    try {
      await api.completeCourse(courseId);
      await fetchAnalysisData();
      await refreshProfile();
      // Update selected course modal if open
      const updatedCourses = await api.getCourses();
      const updated = updatedCourses.courses.find((c) => c.id === courseId);
      if (updated) {
        setSelectedCourseForModal(updated);
      }
    } finally {
      setIsActionInProgress(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Computing Algorithmic Skill Match...</p>
        </div>
      </div>
    );
  }

  const matchPercentage = analysis ? analysis.matchPercentage : 0;
  const isEligible = analysis ? analysis.isEligible : false;
  const missingSkills = analysis ? analysis.missingSkills : [];
  const matchedSkills = analysis ? analysis.matchedSkills : [];
  const requiredSkills = analysis ? analysis.requiredSkills : [];
  const studentSkills = analysis ? analysis.studentSkills : [];

  // Filter recommended courses specifically for missing skills only (do not recommend for satisfied skills)
  const recommendedCourses = courses.filter((c) =>
    missingSkills.some(
      (ms) =>
        ms.toLowerCase() === c.skillName.toLowerCase() ||
        (c.skillsCovered && c.skillsCovered.some((sc) => sc.toLowerCase() === ms.toLowerCase()))
    )
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Breadcrumb & Controls */}
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
                <span>Algorithmic Skill Matching Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Skill Analyzer & Competency Gap
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('career-setup')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Change Goal / Skills
            </button>
            <button
              onClick={() => onNavigateTab('roadmap')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>View Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Selected Target Benchmark Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Target className="w-4 h-4 text-blue-600" />
              Target Benchmark Profile
            </div>

            <div>
              <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                {profile?.desiredRole || 'Target Role'}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                  {profile?.sector || 'IT & Software'}
                </span>
              </div>
              {profile?.company && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  Target Company: <span className="font-semibold text-slate-800">{profile.company}</span>
                </div>
              )}
            </div>

            {roleDetails && (
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                {roleDetails.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500">
              <span>Avg Industry Compensation: <strong className="text-slate-800">{roleDetails?.averageSalary || 'Standard'}</strong></span>
              <span>•</span>
              <span>Hiring Demand: <strong className="text-emerald-700">{roleDetails?.demandLevel || 'High'}</strong></span>
            </div>
          </div>

          {/* Match Metric Gauge (Right) */}
          <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* SVG Ring Gauge */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-slate-200 stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={`${
                    isEligible ? 'text-emerald-500' : matchPercentage >= 50 ? 'text-blue-600' : 'text-amber-500'
                  } stroke-current transition-all duration-1000 ease-out`}
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - matchPercentage / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 font-mono">{matchPercentage}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Match</span>
              </div>
            </div>

            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  isEligible
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {isEligible ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Eligible for Jobs
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Skill Gap: {missingSkills.length} Required
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Status Alert Banner */}
        {isEligible ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">You are eligible for matching jobs!</h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  You possess 100% of the core competencies required for <strong>{profile?.desiredRole}</strong>. You can now apply directly to open listings.
                </p>
              </div>
            </div>
            <button
              id="btn-analyzer-view-matching-jobs"
              onClick={() => onNavigateTab('jobs')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Matching Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  You have some skills to develop before applying for this role.
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Complete the recommended modular training courses below to satisfy the missing requirements ({missingSkills.join(', ')}).
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('training')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Training Catalog</span>
            </button>
          </div>
        )}

        {/* Skill Comparison Breakdown (Matched vs Missing vs Existing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matched Required Skills */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Matched Skills ({matchedSkills.length}/{requiredSkills.length})
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Satisfied
              </span>
            </div>

            {matchedSkills.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No required skills matched yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((s) => (
                  <SkillBadge key={s} name={s} type="matched" size="md" />
                ))}
              </div>
            )}

            <div className="pt-2">
              <ProgressBar
                percentage={matchPercentage}
                label="Required Skills Met"
                colorVariant="emerald"
              />
            </div>
          </div>

          {/* Missing Required Skills */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Missing Required Skills ({missingSkills.length})
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Training Needed
              </span>
            </div>

            {missingSkills.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                All required competencies satisfied! No gaps detected.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((s) => (
                  <SkillBadge key={s} name={s} type="missing" size="md" />
                ))}
              </div>
            )}

            <p className="text-[11px] text-slate-500 pt-1">
              Required for role: <span className="font-semibold text-slate-700">{requiredSkills.join(', ')}</span>
            </p>
          </div>
        </div>

        {/* Section 7: Conditional Course Recommendations or No Skill Gaps Screen */}
        {missingSkills.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Recommended Courses to Bridge Your Gaps ({recommendedCourses.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete these verified modules to directly satisfy your missing skills ({missingSkills.join(', ')}).
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('training')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                Browse All Courses <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {recommendedCourses.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                No specific short courses found for {missingSkills.join(', ')}. Browse the training catalog for related modules.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedCourses.map((course) => {
                  const isCompleted = course.status === 'Completed';
                  const isInProgress = course.status === 'In Progress';

                  return (
                    <div
                      key={course.id}
                      className={`p-5 rounded-xl border flex flex-col justify-between transition ${
                        isCompleted
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : isInProgress
                          ? 'bg-blue-50/40 border-blue-300'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            {course.difficulty}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isInProgress
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {course.status}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 leading-tight line-clamp-2">
                          {course.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>

                        <div className="pt-1">
                          <SkillBadge name={course.skillName} type={isCompleted ? 'matched' : 'missing'} size="sm" />
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                          <span>{course.duration}</span>
                          <span>★ {course.rating}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedCourseForModal(course)}
                          className="text-xs font-semibold text-slate-700 hover:text-blue-600 underline cursor-pointer"
                        >
                          View Syllabus
                        </button>

                        {isCompleted ? (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Done
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCompleteCourse(course.id)}
                            disabled={isActionInProgress}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Complete & Verify
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-emerald-950 flex items-center gap-2">
                  <span>🎉 No Skill Gaps Detected</span>
                </h2>
                <p className="text-xs sm:text-sm text-emerald-800">
                  You already meet all required skills for your selected job role.
                </p>
              </div>
              <button
                id="btn-analyzer-explore-matching-jobs"
                onClick={() => onNavigateTab('jobs')}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Explore Matching Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourseForModal && (
        <CourseModal
          course={selectedCourseForModal}
          onClose={() => setSelectedCourseForModal(null)}
          onStartCourse={handleStartCourse}
          onCompleteCourse={handleCompleteCourse}
        />
      )}
    </div>
  );
};
