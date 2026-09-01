import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';
import { Application, ApplicationStatus } from '../types/index.js';
import {
  Send,
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  AlertCircle,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicationsPageProps {
  onNavigateTab: (tab: string) => void;
  onBack?: () => void;
}

const ALL_STAGES: ApplicationStatus[] = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Selected',
  'Hired',
];

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ onNavigateTab, onBack }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await api.getApplications();
      setApplications(data.applications);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    try {
      await api.updateApplicationStatus(applicationId, newStatus);
      if (newStatus === 'Hired') {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
      await loadApplications();
      await refreshProfile();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAdvanceNextStage = async (app: Application) => {
    const currentIndex = ALL_STAGES.indexOf(app.status);
    if (currentIndex < ALL_STAGES.length - 1) {
      const nextStatus = ALL_STAGES[currentIndex + 1];
      await handleUpdateStatus(app.id, nextStatus);
    }
  };

  const hiredApps = applications.filter((a) => a.status === 'Hired');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
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
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
                <Send className="w-3.5 h-3.5" />
                <span>Full Recruitment Lifecycle Tracking</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Application Tracking & Hiring Status
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Track your recruiter milestones from initial submission to technical interviews and formal job offers.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('jobs')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Apply to More Jobs</span>
          </button>
        </div>

        {/* Big Hired Celebration Banner if any application is Hired */}
        {hiredApps.length > 0 && (
          <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-3 animate-in fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Milestone Achieved: Final Job Offer Received!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              🎉 Congratulations, {user?.name}! You Got The Job!
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
              You have successfully traversed the entire student career roadmap from initial skill gap analysis and modular course completion to being officially <strong>Hired</strong> at{' '}
              <strong className="text-white underline">{hiredApps[0].company}</strong> as a{' '}
              <strong className="text-white">{hiredApps[0].jobTitle}</strong>.
            </p>
          </div>
        )}

        {/* Applications List */}
        {isLoading ? (
          <div className="text-center py-16 text-slate-500 text-xs">Loading application tracking...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <Send className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No active job applications yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Once you identify matching jobs and submit your candidate profile, your real-time recruiter stage tracker will appear here.
            </p>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition cursor-pointer"
            >
              Browse Open Jobs & Apply
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const currentStageIndex = ALL_STAGES.indexOf(app.status);
              const isHired = app.status === 'Hired';

              return (
                <div
                  key={app.id}
                  id={`application-card-${app.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6"
                >
                  {/* Top Bar: Job details and status pill */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{app.jobTitle}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isHired
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : app.status === 'Interview'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {app.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {app.location}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          Applied on: {new Date(app.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Status updater and stage transition */}
                    <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500">Stage:</span>
                      <select
                        value={app.status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          handleUpdateStatus(app.id, e.target.value as ApplicationStatus)
                        }
                        className="text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-1"
                      >
                        {ALL_STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>

                      {currentStageIndex < ALL_STAGES.length - 1 && (
                        <button
                          onClick={() => handleAdvanceNextStage(app)}
                          disabled={isUpdating}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer"
                          title="Advance to next recruiter stage"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 6-Stage Visual Stepper */}
                  <div className="py-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                      Application Progress (Stage {currentStageIndex + 1} of 6)
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {ALL_STAGES.map((stageName, idx) => {
                        const isCompleted = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        const isUpcoming = idx > currentStageIndex;

                        return (
                          <div
                            key={stageName}
                            className={`p-3 rounded-xl border text-center transition flex flex-col justify-between ${
                              isCurrent
                                ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20'
                                : isCompleted
                                ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-1">
                              {isCompleted ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                                  ✓
                                </div>
                              ) : isCurrent ? (
                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                                  {idx + 1}
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-semibold">
                                  {idx + 1}
                                </div>
                              )}
                            </div>
                            <span
                              className={`text-xs font-bold leading-tight ${
                                isCurrent
                                  ? 'text-blue-900'
                                  : isCompleted
                                  ? 'text-emerald-900'
                                  : 'text-slate-500'
                              }`}
                            >
                              {stageName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stage Timeline Log / Notes */}
                  {app.timeline && app.timeline.length > 0 && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Recruiter Activity Timeline:
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        {app.timeline.map((entry, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">
                              {new Date(entry.date).toLocaleDateString()}
                            </span>
                            <span className="font-semibold text-slate-800">{entry.status}:</span>
                            <span className="text-slate-600">{entry.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
