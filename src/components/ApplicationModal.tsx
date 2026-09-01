import React, { useState, useEffect } from 'react';
import { Job, User, StudentProfile, RealWorldProject, StudentProject } from '../types/index.js';
import { api } from '../api/client.js';
import {
  X,
  Briefcase,
  Building,
  MapPin,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  FolderGit2,
  Check,
} from 'lucide-react';

interface ApplicationModalProps {
  job: Job | null;
  user: User | null;
  profile: StudentProfile | null;
  onClose: () => void;
  onSubmit: (data: { jobId: string; resumeFileName?: string; coverNote?: string }) => Promise<void>;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  job,
  user,
  profile,
  onClose,
  onSubmit,
}) => {
  const [resumeName, setResumeName] = useState<string>(
    user ? `${user.name.replace(/\s+/g, '_')}_Resume_2026.pdf` : 'Student_Resume.pdf'
  );
  const [coverNote, setCoverNote] = useState<string>(
    `I am excited to submit my application for the ${job?.title || 'open role'} position at ${
      job?.company || 'your company'
    }. My academic and practical background in ${
      profile?.sector || 'relevant technologies'
    } aligns with your team's goals.`
  );
  const [resumeProjects, setResumeProjects] = useState<RealWorldProject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResumeProjects = async () => {
      try {
        const data = await api.getProjects(profile?.sector, profile?.desiredRole);
        const attached = data.projects.filter((p) => p.studentProject?.addedToResume);
        setResumeProjects(attached);
      } catch (e) {
        // Safe fallback
      }
    };
    loadResumeProjects();
  }, [profile?.sector, profile?.desiredRole]);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        jobId: job.id,
        resumeFileName: resumeName,
        coverNote,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="job-application-modal"
        className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            id="btn-close-app-modal"
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Prototype Job Application
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">{job.title}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              {job.jobType}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Info (Prefilled) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
              <input
                type="text"
                readOnly
                value={user?.name || 'Student Candidate'}
                className="w-full px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                readOnly
                value={user?.email || 'student@example.edu'}
                className="w-full px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          {/* Resume Upload Area */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Candidate Resume & Verified Project Portfolio
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center">
                <FileText className="w-8 h-8 text-blue-600 mb-1" />
                <span className="font-semibold text-slate-800 text-xs">{resumeName}</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Click to choose new file or drag & drop (PDF, DOCX up to 10MB)
                </span>
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-semibold">
                  Auto-Generated from Portal Profile
                </span>
              </div>
            </div>

            {/* Attached Portfolio Projects */}
            {resumeProjects.length > 0 && (
              <div className="mt-2.5 p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-900">
                  <FolderGit2 className="w-3.5 h-3.5 text-purple-700" />
                  <span>{resumeProjects.length} Verified Real-World Capstone Project(s) Attached:</span>
                </div>
                <div className="space-y-1">
                  {resumeProjects.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-[11px] text-purple-800 font-medium bg-white/70 px-2 py-1 rounded border border-purple-100">
                      <span>• {p.title}</span>
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Statement / Cover Note */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Candidate Statement / Cover Note
            </label>
            <textarea
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-xs"
              placeholder="Highlight relevant projects and why you're interested in this role..."
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600">
            <strong>Prototype Notice:</strong> This is a simulated application submission. No real external data is transmitted. Upon submission, an application entry is saved to the database and tracked on your Application Tracking dashboard.
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-job-application"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                'Submitting Application...'
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

