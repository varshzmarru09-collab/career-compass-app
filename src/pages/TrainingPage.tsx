import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';
import { Course, CourseStatus, RealWorldProject, StudentProject } from '../types/index.js';
import { SkillBadge } from '../components/SkillBadge.js';
import { CourseModal } from '../components/CourseModal.js';
import { ProjectModal } from '../components/ProjectModal.js';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  Award,
  PlayCircle,
  Filter,
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Lock,
  Unlock,
  Sparkles,
  Layers,
  FileCheck,
  Rocket,
} from 'lucide-react';

interface TrainingPageProps {
  onNavigateTab: (tab: string) => void;
  onBack?: () => void;
}

export const TrainingPage: React.FC<TrainingPageProps> = ({ onNavigateTab, onBack }) => {
  const { user, profile, skillMatch, refreshProfile } = useAuth();

  const [courses, setCourses] = useState<(Course & { status: CourseStatus; progress: number; isMissingForUser: boolean })[]>([]);
  const [projects, setProjects] = useState<(RealWorldProject & { studentProject?: StudentProject })[]>([]);
  const [isProjectsUnlocked, setIsProjectsUnlocked] = useState<boolean>(false);
  const [projectMetadata, setProjectMetadata] = useState<{
    totalMissingCourses: number;
    completedMissingCourses: number;
    allSkillCoursesCompleted: boolean;
    selectedSector: string;
    selectedRole: string;
  }>({
    totalMissingCourses: 0,
    completedMissingCourses: 0,
    allSkillCoursesCompleted: false,
    selectedSector: profile?.sector || 'IT & Software',
    selectedRole: profile?.desiredRole || 'AI/ML Engineer',
  });

  const [activeTab, setActiveTab] = useState<'recommended' | 'in_progress' | 'completed' | 'all' | 'projects'>('recommended');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCourseModal, setSelectedCourseModal] = useState<(Course & { status: CourseStatus; progress: number }) | null>(null);
  const [selectedProjectModal, setSelectedProjectModal] = useState<(RealWorldProject & { studentProject?: StudentProject }) | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [coursesData, projectsData] = await Promise.all([
        api.getCourses(),
        api.getProjects(profile?.sector, profile?.desiredRole),
      ]);
      setCourses(coursesData.courses);
      setProjects(projectsData.projects);
      setIsProjectsUnlocked(projectsData.isUnlocked);
      setProjectMetadata({
        totalMissingCourses: projectsData.totalMissingCourses,
        completedMissingCourses: projectsData.completedMissingCourses,
        allSkillCoursesCompleted: projectsData.allSkillCoursesCompleted,
        selectedSector: projectsData.selectedSector,
        selectedRole: projectsData.selectedRole,
      });
    } catch (err) {
      console.error('Failed to load training data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile?.sector, profile?.desiredRole]);

  const handleStartCourse = async (courseId: string) => {
    setIsProcessing(true);
    try {
      await api.startCourse(courseId);
      await loadData();
      await refreshProfile();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteCourse = async (courseId: string) => {
    setIsProcessing(true);
    try {
      await api.completeCourse(courseId);
      await loadData();
      await refreshProfile();
      // Update open modal state
      const updated = await api.getCourses();
      const match = updated.courses.find((c) => c.id === courseId);
      if (match) {
        setSelectedCourseModal(match);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartProject = async (projectId: string) => {
    setIsProcessing(true);
    try {
      await api.startProject(projectId);
      await loadData();
      const updated = await api.getProjects(profile?.sector, profile?.desiredRole);
      const match = updated.projects.find((p) => p.id === projectId);
      if (match) setSelectedProjectModal(match);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteProject = async (projectId: string, notes?: string, addToResume?: boolean) => {
    setIsProcessing(true);
    try {
      await api.completeProject(projectId, notes, addToResume);
      await loadData();
      await refreshProfile();
      const updated = await api.getProjects(profile?.sector, profile?.desiredRole);
      const match = updated.projects.find((p) => p.id === projectId);
      if (match) setSelectedProjectModal(match);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleProjectResume = async (projectId: string, addedToResume: boolean) => {
    setIsProcessing(true);
    try {
      await api.toggleProjectResume(projectId, addedToResume);
      await loadData();
      const updated = await api.getProjects(profile?.sector, profile?.desiredRole);
      const match = updated.projects.find((p) => p.id === projectId);
      if (match) setSelectedProjectModal(match);
    } finally {
      setIsProcessing(false);
    }
  };

  const missingSkills = skillMatch?.missingSkills || [];

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    // Tab filtering
    if (activeTab === 'recommended') {
      const isMissing = missingSkills.some(
        (ms) =>
          ms.toLowerCase() === course.skillName.toLowerCase() ||
          (course.skillsCovered &&
            course.skillsCovered.some((sc) => sc.toLowerCase() === ms.toLowerCase()))
      );
      if (!isMissing) return false;
    } else if (activeTab === 'in_progress') {
      if (course.status !== 'In Progress') return false;
    } else if (activeTab === 'completed') {
      if (course.status !== 'Completed') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesText =
        course.name.toLowerCase().includes(q) ||
        course.skillName.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.provider.toLowerCase().includes(q);
      if (!matchesText) return false;
    }

    // Difficulty
    if (selectedDifficulty !== 'all' && course.difficulty !== selectedDifficulty) {
      return false;
    }

    return true;
  });

  const recommendedCount = courses.filter((c) =>
    missingSkills.some(
      (ms) =>
        ms.toLowerCase() === c.skillName.toLowerCase() ||
        (c.skillsCovered && c.skillsCovered.some((sc) => sc.toLowerCase() === ms.toLowerCase()))
    )
  ).length;
  const inProgressCount = courses.filter((c) => c.status === 'In Progress').length;
  const completedCount = courses.filter((c) => c.status === 'Completed').length;
  const completedProjectsCount = projects.filter((p) => p.studentProject?.status === 'completed').length;

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
                <BookOpen className="w-3.5 h-3.5" />
                <span>Skill Gap Training & Projects</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Modular Courses & Capstone Projects
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Complete short-track courses to satisfy missing prerequisites and unlock role-based real-world capstone projects for{' '}
                <strong className="text-slate-800">{profile?.desiredRole || 'your target role'}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
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
              <Briefcase className="w-3.5 h-3.5" />
              <span>Explore Matching Jobs</span>
            </button>
          </div>
        </div>

        {/* Missing Skills Banner Reminder */}
        {missingSkills.length > 0 ? (
          <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                Target Missing Competencies for {profile?.desiredRole} ({profile?.sector}):
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {missingSkills.map((sk) => (
                  <SkillBadge key={sk} name={sk} type="missing" size="sm" />
                ))}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('recommended')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition shrink-0 cursor-pointer"
            >
              Filter Recommended ({missingSkills.length})
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  All Required Prerequisites Satisfied!
                </h4>
                <p className="text-[11px] text-emerald-800">
                  You possess all required skills for {profile?.desiredRole}. Real-world projects are unlocked to build your resume portfolio!
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer"
            >
              Browse Jobs
            </button>
          </div>
        )}

        {/* Tab Switcher & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            <button
              id="tab-training-recommended"
              onClick={() => setActiveTab('recommended')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'recommended'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Recommended ({recommendedCount})
            </button>
            <button
              id="tab-training-inprogress"
              onClick={() => setActiveTab('in_progress')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'in_progress'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              id="tab-training-completed"
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              id="tab-training-all"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Courses ({courses.length})
            </button>
            <button
              id="tab-training-projects"
              onClick={() => setActiveTab('projects')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'projects'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : isProjectsUnlocked
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isProjectsUnlocked ? <Rocket className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>Real-World Projects ({projects.length})</span>
            </button>
          </div>

          {/* Search & Difficulty Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses or skills..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-700"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Courses Grid (when tab is not projects) */}
        {activeTab !== 'projects' && (
          <div>
            {isLoading ? (
              <div className="text-center py-16 text-slate-500 text-xs">Loading course catalog...</div>
            ) : filteredCourses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No courses match the current filter</h3>
                <p className="text-xs text-slate-500">
                  Try switching tabs to "All Courses" or clearing your search keywords.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setSearchQuery('');
                    setSelectedDifficulty('all');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCourses.map((course) => {
                  const isCompleted = course.status === 'Completed';
                  const isInProgress = course.status === 'In Progress';

                  return (
                    <div
                      key={course.id}
                      className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-xs transition hover:shadow-md ${
                        isCompleted
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : isInProgress
                          ? 'border-blue-300 bg-blue-50/20'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {course.difficulty}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
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

                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {course.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {course.description}
                        </p>

                        <div className="pt-1 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] text-slate-400">Teaches:</span>
                          <SkillBadge
                            name={course.skillName}
                            type={isCompleted ? 'matched' : 'missing'}
                            size="sm"
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            {course.rating} ★
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedCourseModal(course)}
                          className="text-xs font-semibold text-slate-700 hover:text-blue-600 underline cursor-pointer"
                        >
                          View Syllabus
                        </button>

                        <div className="flex items-center gap-1.5">
                          {!isCompleted && !isInProgress && (
                            <button
                              onClick={() => handleStartCourse(course.id)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition cursor-pointer"
                            >
                              Start
                            </button>
                          )}

                          {!isCompleted ? (
                            <button
                              onClick={() => handleCompleteCourse(course.id)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Complete & Verify
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                              <Check className="w-3.5 h-3.5" /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* ROLE-BASED REAL-WORLD PROJECTS SECTION */}
        {/* ==================================================== */}
        <div id="real-world-projects-section" className="space-y-6 pt-4 border-t border-slate-200">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                {isProjectsUnlocked ? (
                  <Rocket className="w-4 h-4 text-purple-600" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
                <span>Role-Based Real-World Capstone Projects</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Industry Projects for {profile?.desiredRole || 'Target Role'}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {profile?.sector || 'IT & Software'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Hands-on portfolio projects that integrate multiple skills acquired across your recommended courses.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isProjectsUnlocked ? (
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-200">
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Projects Unlocked</span>
                </div>
              ) : (
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Locked: Complete Recommended Courses</span>
                </div>
              )}
            </div>
          </div>

          {/* Locked State Alert Banner */}
          {!isProjectsUnlocked ? (
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-purple-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    🔒 Real-World Projects are Locked
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Complete all recommended skill-gap courses for your target role (
                    <strong className="text-purple-300">{profile?.desiredRole}</strong> in{' '}
                    <strong className="text-purple-300">{profile?.sector}</strong>) to unlock role-based projects.
                  </p>
                </div>
              </div>

              {/* Course Completion Progress Towards Unlocking Projects */}
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Skill-Gap Courses Completion Progress:</span>
                  <span className="text-purple-300 font-bold">
                    {projectMetadata.completedMissingCourses} / {projectMetadata.totalMissingCourses || missingSkills.length} Completed
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        projectMetadata.totalMissingCourses > 0
                          ? Math.round((projectMetadata.completedMissingCourses / projectMetadata.totalMissingCourses) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Projects synthesize multiple skills and unlock only after all prerequisite courses for {profile?.desiredRole} are finished.
                </p>
              </div>

              {/* Preview Cards of Locked Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">
                        {proj.difficulty}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" /> Locked
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1">{proj.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{proj.description}</p>

                    <div className="pt-2 border-t border-slate-700/50">
                      <div className="text-[10px] text-slate-400 mb-1 font-semibold">Integrates Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {proj.skills.slice(0, 4).map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-700 text-slate-300"
                          >
                            {sk}
                          </span>
                        ))}
                        {proj.skills.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-700 text-slate-400">
                            +{proj.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Unlocked Projects Grid */
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-purple-950">
                      All Prerequisites Completed — Role Capstones Unlocked!
                    </h3>
                    <p className="text-[11px] text-purple-800">
                      Select a real-world project to build portfolio artifacts and add verified practical experience to your resume.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-bold text-purple-900 bg-white px-3 py-1.5 rounded-lg border border-purple-200 shadow-2xs">
                  {completedProjectsCount} of {projects.length} Completed
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project) => {
                  const isCompleted = project.studentProject?.status === 'completed';
                  const isInProgress = project.studentProject?.status === 'in_progress';
                  const isOnResume = project.studentProject?.addedToResume;

                  return (
                    <div
                      key={project.id}
                      className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-xs transition hover:shadow-md ${
                        isCompleted
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : isInProgress
                          ? 'border-purple-300 bg-purple-50/20'
                          : 'border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            {project.difficulty}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isInProgress
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Available'}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {project.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Industry relevance */}
                        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-[11px] text-slate-600">
                          <strong className="text-slate-800">Target Role Impact:</strong> {project.whyRelevant}
                        </div>

                        {/* Multi-skill synthesis */}
                        <div className="space-y-1 pt-1">
                          <div className="text-[11px] font-semibold text-slate-400">Synthesizes Skills:</div>
                          <div className="flex flex-wrap gap-1">
                            {project.skills.map((sk) => (
                              <span
                                key={sk}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {project.estimatedHours || '25-35 hours'}
                          </span>
                          {isOnResume && (
                            <span className="text-blue-600 font-bold flex items-center gap-1">
                              <FileCheck className="w-3.5 h-3.5" /> On Resume
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedProjectModal(project)}
                          className="text-xs font-semibold text-slate-700 hover:text-purple-600 underline cursor-pointer"
                        >
                          View Brief & Steps
                        </button>

                        <div className="flex items-center gap-1.5">
                          {!isCompleted && !isInProgress && (
                            <button
                              onClick={() => handleStartProject(project.id)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition cursor-pointer"
                            >
                              Start
                            </button>
                          )}

                          {!isCompleted ? (
                            <button
                              onClick={() => setSelectedProjectModal(project)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-2xs transition flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Submit Project
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleProjectResume(project.id, !isOnResume)}
                                disabled={isProcessing}
                                className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer transition ${
                                  isOnResume
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {isOnResume ? '✓ On Resume' : '+ Resume'}
                              </button>
                              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                                <Check className="w-3.5 h-3.5" /> Done
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Course Syllabus / Learning Modal */}
      {selectedCourseModal && (
        <CourseModal
          course={selectedCourseModal}
          onClose={() => setSelectedCourseModal(null)}
          onStartCourse={handleStartCourse}
          onCompleteCourse={handleCompleteCourse}
        />
      )}

      {/* Interactive Real-World Project Brief & Deliverables Modal */}
      {selectedProjectModal && (
        <ProjectModal
          project={selectedProjectModal}
          onClose={() => setSelectedProjectModal(null)}
          onStartProject={handleStartProject}
          onCompleteProject={handleCompleteProject}
          onToggleResume={handleToggleProjectResume}
        />
      )}
    </div>
  );
};

