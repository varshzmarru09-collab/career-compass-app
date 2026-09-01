import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';
import { SectorType, Role, Skill } from '../types/index.js';
import { SkillBadge } from '../components/SkillBadge.js';
import {
  Compass,
  Target,
  Briefcase,
  Building,
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  ChevronRight,
} from 'lucide-react';

interface CareerSetupPageProps {
  onContinue: () => void;
  onBack?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const CareerSetupPage: React.FC<CareerSetupPageProps> = ({ onContinue, onBack, onNavigateTab }) => {
  const { user, profile, refreshProfile } = useAuth();

  const userDraftKey = `cc_draft_setup_${user?.id || 'guest'}`;

  // Recover draft for this specific user session if present
  const getInitialDraft = () => {
    try {
      const stored = sessionStorage.getItem(userDraftKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  };
  const draft = getInitialDraft();

  const [sectors, setSectors] = useState<SectorType[]>([]);
  const [sampleCompanies, setSampleCompanies] = useState<string[]>([]);
  
  // New students start with NO pre-selected sector, role, company, or skills
  const [selectedSector, setSelectedSector] = useState<SectorType | ''>(
    draft?.sector || profile?.sector || ''
  );

  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(
    draft?.desiredRole || profile?.desiredRole || ''
  );
  const [company, setCompany] = useState<string>(
    draft?.company !== undefined ? draft.company : profile?.company || ''
  );

  const [allAvailableSkills, setAllAvailableSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    draft?.skills !== undefined ? draft.skills : (profile?.skills || [])
  );
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [skillSearch, setSkillSearch] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sectorSavedNotice, setSectorSavedNotice] = useState<boolean>(false);

  // Sync draft to sessionStorage for this user
  useEffect(() => {
    try {
      if (user?.id) {
        sessionStorage.setItem(
          userDraftKey,
          JSON.stringify({
            sector: selectedSector,
            desiredRole: selectedRole,
            company,
            skills: selectedSkills,
          })
        );
      }
    } catch (e) {}
  }, [selectedSector, selectedRole, company, selectedSkills, user?.id, userDraftKey]);

  // Load initial sectors, roles, skills
  useEffect(() => {
    const loadInitialMeta = async () => {
      setIsLoading(true);
      try {
        const [sectorData, skillData] = await Promise.all([
          api.getSectors(),
          api.getSkills(),
        ]);
        setSectors(sectorData.sectors);
        setSampleCompanies(sectorData.companies);
        setAllAvailableSkills(skillData.skills);

        // Pre-fill only if existing profile data is available and no user-specific draft
        if (profile && !draft) {
          if (profile.sector) setSelectedSector(profile.sector);
          if (profile.desiredRole) setSelectedRole(profile.desiredRole);
          if (profile.company) setCompany(profile.company);
        }

        // Load existing student skills if no draft exists
        if (!draft && user) {
          const studentSkillsData = await api.getStudentSkills();
          if (studentSkillsData.skills && studentSkillsData.skills.length > 0) {
            setSelectedSkills(studentSkillsData.skills.map((s) => s.skillName));
          } else if (!profile?.skills || profile.skills.length === 0) {
            setSelectedSkills([]);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load setup metadata');
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialMeta();
  }, [profile, user]);

  // When selectedSector changes, load corresponding roles and persist sector to profile
  useEffect(() => {
    if (!selectedSector) {
      setAvailableRoles([]);
      return;
    }

    const fetchRolesForSector = async () => {
      try {
        const data = await api.getRoles(selectedSector as SectorType);
        setAvailableRoles(data.roles);
        
        // If current role does not belong to newly selected sector, clear it
        if (selectedRole) {
          const exists = data.roles.some((r) => r.name === selectedRole);
          if (!exists) {
            setSelectedRole('');
          }
        }

        // Fetch skills for this sector
        const skillsData = await api.getRecommendedSkills(selectedSector as SectorType, selectedRole || undefined);
        if (skillsData.skills && skillsData.skills.length > 0) {
          setAllAvailableSkills(skillsData.skills);
        }
      } catch (err) {
        console.error('Failed to fetch roles for sector', err);
      }
    };
    fetchRolesForSector();
  }, [selectedSector]);

  // When selectedRole changes, fetch recommended skills for that role
  useEffect(() => {
    if (selectedSector && selectedRole) {
      api.getRecommendedSkills(selectedSector as SectorType, selectedRole)
        .then((data) => {
          if (data.skills && data.skills.length > 0) {
            setAllAvailableSkills(data.skills);
          }
        })
        .catch(console.error);
    }
  }, [selectedSector, selectedRole]);

  const handleSelectSector = async (sec: SectorType) => {
    setSelectedSector(sec);
    setError(null);
    setSectorSavedNotice(true);
    setTimeout(() => setSectorSavedNotice(false), 2500);

    // Save selected sector to the student's profile immediately so it is persisted to Firestore
    try {
      await api.updateStudentProfile({
        sector: sec,
        desiredRole: selectedRole || undefined,
        company: company.trim() || undefined,
      });
      await refreshProfile();
    } catch (err) {
      console.warn('Auto-saving sector to profile:', err);
    }
  };

  const handleToggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!selectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedSkills([...selectedSkills, trimmed]);
    }
    setCustomSkillInput('');
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSector) {
      setError('Please select an industry sector to proceed.');
      return;
    }
    if (!selectedRole) {
      setError('Please select your desired career role to proceed.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      // 1. Save Profile (Sector, Desired Role, Target Company)
      await api.updateStudentProfile({
        sector: selectedSector,
        desiredRole: selectedRole,
        company: company.trim() || undefined,
        skills: selectedSkills,
      });

      // 2. Save Skills
      await api.setStudentSkills(selectedSkills);

      // Refresh auth context state from database
      await refreshProfile();

      // Clear draft once successfully saved
      try {
        sessionStorage.removeItem(userDraftKey);
      } catch (e) {}

      // Navigate to next step: Skill Analyzer
      onContinue();
    } catch (err: any) {
      setError(err.message || 'Failed to save career setup. Please retry.');
      setIsSaving(false);
    }
  };

  const filteredSkills = allAvailableSkills.filter((s) =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const isNewStudent = !profile?.sector && !profile?.desiredRole;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation / Back Action */}
        <div className="flex items-center justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              Dashboard
            </button>
          )}
        </div>

        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {!selectedSector
                ? 'Onboarding Step 1 of 3: Select Interested Sector'
                : !selectedRole
                ? 'Onboarding Step 2 of 3: Select Desired Career Role'
                : 'Onboarding Step 3 of 3: Current Skills & Gap Analysis'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isNewStudent ? 'Start Your Career Journey' : 'Configure Your Career Goal'}
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            {!selectedSector
              ? 'Welcome to Career Compass! Select your interested industry sector below to explore tailored career pathways and analyze your competency gaps.'
              : 'Tell Career Compass your target industry, desired role, and current skills. We will dynamically compute your skill gaps and unlock customized employment roadmaps.'}
          </p>
        </div>

        {sectorSavedNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Sector <strong>{selectedSector}</strong> saved to your student profile!</span>
            </div>
            <span className="text-[11px] text-emerald-700">Persisted to Firestore</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-6">
          {/* Card 1: Sector Selection (Step 1) */}
          <div className={`bg-white p-6 sm:p-8 rounded-2xl border shadow-xs space-y-6 transition ${!selectedSector ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${selectedSector ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-600 text-white'}`}>
                  {selectedSector ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    1. Select Your Interested Industry Sector <span className="text-rose-500">*</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Choose the domain you want to pursue. Career roles and competencies will align with this sector.
                  </p>
                </div>
              </div>
              {selectedSector && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedSector}
                </span>
              )}
            </div>

            {/* Sector Selector Grid */}
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {sectors.map((sec) => {
                  const isSelected = selectedSector === sec;
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleSelectSector(sec)}
                      className={`p-3 rounded-xl text-left border text-xs font-semibold transition cursor-pointer flex flex-col justify-between min-h-[72px] ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <span className="line-clamp-2 leading-snug">{sec}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 self-end mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desired Role Selector (Step 2) */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      2. Desired Career Role {selectedSector ? `in ${selectedSector}` : ''} <span className="text-rose-500">*</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedSector
                      ? 'Select your target job title. Roles are verified with national competency frameworks.'
                      : 'Please select an industry sector above to unlock available career roles.'}
                  </p>
                </div>
                {selectedRole && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Selected: {selectedRole}
                  </span>
                )}
              </div>

              {!selectedSector ? (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center text-xs text-slate-400">
                  Select an industry sector above to view available career roles.
                </div>
              ) : availableRoles.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                  Loading roles for {selectedSector}...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableRoles.map((role) => {
                    const isSelected = selectedRole === role.name;
                    return (
                      <div
                        key={role.id}
                        onClick={() => {
                          setSelectedRole(role.name);
                          setError(null);
                        }}
                        className={`p-4 rounded-xl border text-xs cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">{role.name}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{role.description}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Avg: {role.averageSalary}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            {role.demandLevel} Demand
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Company (Optional) */}
              {selectedSector && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Company (Optional)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Select your preferred employer or leave blank for broad industry matching.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id="input-setup-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Google Cloud India, ABC Technologies, Apollo Hospitals"
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                      onChange={(e) => {
                        if (e.target.value) setCompany(e.target.value);
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-700"
                      value=""
                    >
                      <option value="" disabled>
                        Pick Sample Company...
                      </option>
                      {sampleCompanies.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Current Skills Selection (Step 3) */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Your Current Skills</h2>
                  <p className="text-xs text-slate-500">
                    Select competencies you currently possess, or add custom skills to run skill-gap analysis.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                {selectedSkills.length} Selected
              </span>
            </div>

            {/* Currently Selected Badges */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Active Selected Skills:
              </div>
              {selectedSkills.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-300 text-slate-400 text-center text-xs">
                  No skills selected yet. Click from the suggestions below or add custom skills.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {selectedSkills.map((skillName) => (
                    <SkillBadge
                      key={skillName}
                      name={skillName}
                      type="removable"
                      onRemove={() => handleToggleSkill(skillName)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Custom Skill Input */}
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <label className="block text-xs font-semibold text-blue-900 mb-1">
                Add Custom Skill
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="e.g. Docker, Rust, PyTorch, Kubernetes, Financial Modeling"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSkill(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {/* Suggested Skill Bank with Quick Search */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Suggested Skill Bank {selectedSector ? `(${selectedSector})` : ''}
                </label>
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder="Search skills..."
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                {filteredSkills.map((sk) => {
                  const isSelected = selectedSkills.includes(sk.name);
                  return (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => handleToggleSkill(sk.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{sk.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-600">
              {!selectedSector ? (
                <span className="text-amber-700 font-medium">Please select an industry sector above to begin.</span>
              ) : !selectedRole ? (
                <span>
                  Selected Sector: <strong className="text-slate-900">{selectedSector}</strong> &bull;{' '}
                  <span className="text-amber-700 font-medium">Please select a desired career role.</span>
                </span>
              ) : (
                <span>
                  Target Goal: <strong className="text-slate-900">{selectedRole}</strong> ({selectedSector}) &bull;{' '}
                  <strong className="text-blue-700">{selectedSkills.length} skills</strong> ready for analyzer
                </span>
              )}
            </div>

            <button
              id="btn-continue-career-setup"
              type="submit"
              disabled={isSaving || !selectedSector || !selectedRole}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 ${
                !selectedSector || !selectedRole
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {isSaving ? (
                <span>Saving Setup & Analyzing...</span>
              ) : !selectedSector ? (
                <span>Select Sector to Proceed</span>
              ) : !selectedRole ? (
                <span>Select Desired Role to Proceed</span>
              ) : (
                <>
                  <span>Continue to Skill Analyzer</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
