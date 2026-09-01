import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';
import { SectorType, StudentSkill, RealWorldProject, StudentProject } from '../types/index.js';
import { SkillBadge } from '../components/SkillBadge.js';
import {
  User,
  Mail,
  Briefcase,
  Building,
  GraduationCap,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  FolderGit2,
  Check,
  Sparkles,
  Rocket,
} from 'lucide-react';

interface ProfilePageProps {
  onNavigateTab: (tab: string) => void;
  onBack?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigateTab, onBack }) => {
  const { user, profile, skillMatch, refreshProfile } = useAuth();

  const [name, setName] = useState<string>(user?.name || '');
  const [sector, setSector] = useState<SectorType>(profile?.sector || 'IT & Software');
  const [desiredRole, setDesiredRole] = useState<string>(profile?.desiredRole || 'AI/ML Engineer');
  const [company, setCompany] = useState<string>(profile?.company || '');
  const [educationLevel, setEducationLevel] = useState<string>(
    profile?.educationLevel || 'B.Tech in Computer Science & Engineering'
  );
  const [bio, setBio] = useState<string>(
    profile?.bio || 'Aspiring AI engineer passionate about building intelligent full-stack systems and solving real-world challenges.'
  );

  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>([]);
  const [projects, setProjects] = useState<(RealWorldProject & { studentProject?: StudentProject })[]>([]);
  const [sectors, setSectors] = useState<SectorType[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) setName(user.name);
    if (profile) {
      setSector(profile.sector);
      setDesiredRole(profile.desiredRole);
      setCompany(profile.company || '');
      setEducationLevel(profile.educationLevel || 'B.Tech in Computer Science');
      setBio(profile.bio || '');
    }
  }, [user, profile]);

  const loadData = async () => {
    try {
      const [sectorsData, profileData, projectsData] = await Promise.all([
        api.getSectors(),
        api.getStudentProfile(),
        api.getProjects(profile?.sector, profile?.desiredRole),
      ]);
      setSectors(sectorsData.sectors);
      if (profileData.skills) {
        setStudentSkills(profileData.skills);
      }
      setProjects(projectsData.projects);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile?.sector, profile?.desiredRole]);

  const handleToggleResume = async (projectId: string, currentStatus?: boolean) => {
    try {
      await api.toggleProjectResume(projectId, !currentStatus);
      await loadData();
    } catch (err) {
      console.error('Failed to toggle project resume status:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await api.updateStudentProfile({
        sector,
        desiredRole,
        company: company.trim() || undefined,
        educationLevel,
        bio,
      });
      await refreshProfile();
      setSuccessMsg('Profile updated and saved to database successfully!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const completedProjects = projects.filter((p) => p.studentProject?.status === 'completed');
  const inProgressProjects = projects.filter((p) => p.studentProject?.status === 'in_progress');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {user?.name || 'Student Profile'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    Student
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user?.email}</span>
                  <span className="text-slate-300">•</span>
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target: {profile?.desiredRole || 'Career Pathway'}</span>
                </p>
              </div>
            </div>

            {skillMatch && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:text-right">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Target Readiness
                </div>
                <div className="text-2xl font-black text-blue-600 mt-0.5">
                  {skillMatch.matchPercentage}% Match
                </div>
                <div className="text-[11px] text-slate-500">
                  {skillMatch.matchedSkills.length} of {skillMatch.totalRequired} skills verified
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success / Error alerts */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-200" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              General & Career Information
            </h2>
            <span className="text-xs text-slate-400">All fields persisted to database</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="input-profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="input-profile-email"
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
              <select
                id="select-profile-sector"
                value={sector}
                onChange={(e) => setSector(e.target.value as SectorType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Desired Target Role</label>
              <input
                id="input-profile-role"
                type="text"
                value={desiredRole}
                onChange={(e) => setDesiredRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Company (Optional)</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="input-profile-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google Cloud, Tata Consultancy Services"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Education Level / Degree</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="input-profile-education"
                  type="text"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  placeholder="e.g. B.Tech in Computer Science & Engineering"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 text-xs">
              Candidate Bio & Career Objective
            </label>
            <textarea
              id="input-profile-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your career goals, technical strengths, and aspirations..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Stored securely in the platform database</span>
            </div>

            <button
              id="btn-save-profile"
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>

        {/* My Real-World Projects & Portfolio Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-purple-600" />
                My Real-World Projects & Resume Highlights
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hands-on role capstones completed after resolving skill gaps. Manage which projects are highlighted on your job application resume.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('training')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition flex items-center gap-1.5 self-start cursor-pointer border border-purple-200"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Explore Projects</span>
            </button>
          </div>

          {completedProjects.length === 0 && inProgressProjects.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No Capstone Projects Completed Yet</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                Finish all recommended skill-gap courses for <strong>{desiredRole}</strong> in <strong>{sector}</strong> to unlock and complete verified real-world projects.
              </p>
              <button
                onClick={() => onNavigateTab('training')}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer"
              >
                Go to Skill Gap Training
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {completedProjects.map((project) => {
                const isOnResume = project.studentProject?.addedToResume;
                return (
                  <div
                    key={project.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-purple-200"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                          {project.sector} • {project.role}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Completed Capstone
                        </span>
                        {isOnResume && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Included on Resume
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-slate-900">{project.title}</h3>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{project.description}</p>

                      {project.studentProject?.notes && (
                        <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-200">
                          <strong>Portfolio Note:</strong> {project.studentProject.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.skills.map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-700 font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleToggleResume(project.id, isOnResume)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          isOnResume
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{isOnResume ? '✓ On Resume' : '+ Add to Resume'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {inProgressProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-xl border border-dashed border-amber-200 bg-amber-50/30 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        In Progress
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{project.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500">{project.description}</p>
                  </div>

                  <button
                    onClick={() => onNavigateTab('training')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition cursor-pointer shrink-0"
                  >
                    Resume Work
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verified Skills & Competencies Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                Verified Student Skills & Badges
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Technical competencies validated through coursework, tests, and self-declaration.
              </p>
            </div>
            <button
              id="btn-manage-skills-link"
              type="button"
              onClick={() => onNavigateTab('skills')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5 self-start cursor-pointer"
            >
              <span>Manage Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {studentSkills.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Award className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No skills added yet</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                Add your technical and domain skills to evaluate your eligibility for target career roles.
              </p>
              <button
                onClick={() => onNavigateTab('skills')}
                className="mt-3 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
              >
                Add My Skills
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {studentSkills.map((sk) => (
                  <SkillBadge
                    key={sk.id}
                    name={sk.skillName}
                    status={sk.status === 'acquired' ? 'matched' : 'gap'}
                    size="md"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  Total Acquired Skills: <strong className="text-slate-800">{studentSkills.length}</strong>
                </span>
                <button
                  onClick={() => onNavigateTab('analyzer')}
                  className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Run Gap Analysis against {profile?.desiredRole || 'Target Role'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
