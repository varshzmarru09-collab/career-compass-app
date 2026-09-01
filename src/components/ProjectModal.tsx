import React, { useState } from 'react';
import { RealWorldProject, StudentProject } from '../types/index.js';
import {
  X,
  Briefcase,
  Clock,
  Award,
  CheckCircle2,
  Check,
  FileText,
  Sparkles,
  Layers,
  FileCode,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProjectModalProps {
  project: (RealWorldProject & { studentProject?: StudentProject }) | null;
  onClose: () => void;
  onStartProject: (projectId: string) => Promise<void>;
  onCompleteProject: (projectId: string, notes?: string, addToResume?: boolean) => Promise<void>;
  onToggleResume: (projectId: string, addedToResume: boolean) => Promise<void>;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onStartProject,
  onCompleteProject,
  onToggleResume,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>(project?.studentProject?.notes || '');
  const [addToResume, setAddToResume] = useState<boolean>(
    project?.studentProject?.addedToResume !== undefined ? project.studentProject.addedToResume : true
  );
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!project) return null;

  const isCompleted = project.studentProject?.status === 'completed';
  const isInProgress = project.studentProject?.status === 'in_progress';

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleStart = async () => {
    setIsProcessing(true);
    try {
      await onStartProject(project.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      await onCompleteProject(project.id, notes, addToResume);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
      setSuccessMessage(`Project "${project.title}" completed successfully and added to your portfolio!`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleResume = async () => {
    setIsProcessing(true);
    try {
      const nextStatus = !project.studentProject?.addedToResume;
      await onToggleResume(project.id, nextStatus);
      setAddToResume(nextStatus);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="project-detail-modal"
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            id="btn-close-project-modal"
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {project.sector} • {project.role}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30">
              {project.difficulty}
            </span>
            {isCompleted ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white flex items-center gap-1">
                <Check className="w-3 h-3" /> Completed Capstone
              </span>
            ) : isInProgress ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                In Progress
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-200">
                Ready to Start
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{project.title}</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2">{project.description}</p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Success Message Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Industry Relevance Card */}
          <div className="bg-blue-50/70 rounded-xl border border-blue-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Why This Project Matters for {project.role}:</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">{project.whyRelevant}</p>
          </div>

          {/* Applied Integrated Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Applied Multi-Skill Stack</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              This capstone synthesizes all prerequisite skills acquired during your recommended training modules.
            </p>
          </div>

          {/* Project Milestones / Implementation Steps */}
          {project.steps && project.steps.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>Execution Milestones & Requirements</span>
              </h3>
              <div className="space-y-2">
                {project.steps.map((step, idx) => {
                  const stepDone = isCompleted || completedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => !isCompleted && toggleStep(idx)}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition cursor-pointer ${
                        stepDone
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                          stepDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-600'
                        }`}
                      >
                        {stepDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className="flex-1 text-xs">
                        <span className={stepDone ? 'text-slate-900 font-semibold line-through opacity-80' : 'text-slate-800 font-medium'}>
                          {step}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Deliverables */}
          {project.deliverables && project.deliverables.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Expected Portfolio Deliverables</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {project.deliverables.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Project Notes & Resume Inclusion */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Project Notes / GitHub Repository / Portfolio Summary
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. GitHub link, architecture decisions, key metrics achieved..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={addToResume}
                onChange={(e) => setAddToResume(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Include this real-world capstone project in my Profile & Job Application Resumes</span>
            </label>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Estimated Duration: {project.estimatedHours || '20-30 hours'}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition cursor-pointer"
            >
              Close
            </button>

            {!isCompleted && !isInProgress && (
              <button
                onClick={handleStart}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 transition cursor-pointer disabled:opacity-50"
              >
                Start Project
              </button>
            )}

            {!isCompleted ? (
              <button
                onClick={handleComplete}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & Complete Project</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleResume}
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    project.studentProject?.addedToResume
                      ? 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>
                    {project.studentProject?.addedToResume
                      ? '✓ Listed on Resume'
                      : '+ Add to Resume'}
                  </span>
                </button>

                <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                  <Check className="w-3.5 h-3.5" /> Completed
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
