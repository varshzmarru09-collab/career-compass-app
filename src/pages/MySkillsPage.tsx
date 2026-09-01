import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';
import { Skill, SkillMatchResult } from '../types/index.js';
import { SkillBadge } from '../components/SkillBadge.js';
import { ProgressBar } from '../components/ProgressBar.js';
import {
  Target,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  RefreshCw,
} from 'lucide-react';

interface MySkillsPageProps {
  onNavigateTab: (tab: string) => void;
  onBack?: () => void;
}

export const MySkillsPage: React.FC<MySkillsPageProps> = ({ onNavigateTab, onBack }) => {
  const { user, profile, skillMatch, refreshProfile } = useAuth();

  const [studentSkills, setStudentSkills] = useState<string[]>([]);
  const [allAvailableSkills, setAllAvailableSkills] = useState<Skill[]>([]);
  const [customInput, setCustomInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [skillsData, studentSkillsData] = await Promise.all([
        api.getSkills(profile?.sector, profile?.desiredRole),
        api.getStudentSkills(),
      ]);
      setAllAvailableSkills(skillsData.skills);
      setStudentSkills(studentSkillsData.skills.map((s) => s.skillName));
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile?.sector, profile?.desiredRole]);

  const handleToggleSkill = async (skillName: string) => {
    let updated: string[];
    if (studentSkills.includes(skillName)) {
      updated = studentSkills.filter((s) => s !== skillName);
    } else {
      updated = [...studentSkills, skillName];
    }
    setStudentSkills(updated);
    await saveUpdatedSkills(updated);
  };

  const handleAddCustomSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!studentSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...studentSkills, trimmed];
      setStudentSkills(updated);
      setCustomInput('');
      await saveUpdatedSkills(updated);
    }
  };

  const saveUpdatedSkills = async (skillsToSave: string[]) => {
    setIsSaving(true);
    try {
      await api.setStudentSkills(skillsToSave);
      await refreshProfile();
      setSuccessMessage('Skills updated and match recalculated!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to save skills:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter out skills the student has already added to their portfolio
  const unaddedSkills = allAvailableSkills.filter(
    (sk) => !studentSkills.some((s) => s.toLowerCase() === sk.name.toLowerCase())
  );

  const filteredCatalogSkills = unaddedSkills.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchPercentage = skillMatch?.matchPercentage || 0;
  const isEligible = skillMatch?.isEligible || false;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>Competency & Portfolio Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Skills Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Maintain your verified competencies against{' '}
              <strong className="text-slate-800">{profile?.desiredRole || 'your chosen career goal'}</strong>.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('analyzer')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Open Skill Analyzer</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{successMessage}</span>
            </div>
            <span>Match: {matchPercentage}%</span>
          </div>
        )}

        {/* Target Benchmark & Progress Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Benchmark Role
              </span>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {profile?.desiredRole}
                <span className="text-xs font-normal text-slate-500">
                  ({profile?.sector})
                </span>
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                isEligible
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {isEligible ? '100% Eligible for Jobs' : `${skillMatch?.missingSkills.length || 0} Skills Needed`}
            </span>
          </div>

          <ProgressBar
            percentage={matchPercentage}
            label="Required Core Competencies Satisfied"
            colorVariant={isEligible ? 'emerald' : 'blue'}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">
                Matched Role Skills ({skillMatch?.matchedSkills.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1">
                {skillMatch?.matchedSkills.map((s) => (
                  <SkillBadge key={s} name={s} type="matched" size="sm" />
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block mb-1">
                Missing Required Skills ({skillMatch?.missingSkills.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1">
                {skillMatch?.missingSkills.map((s) => (
                  <SkillBadge key={s} name={s} type="missing" size="sm" />
                ))}
                {(!skillMatch || skillMatch.missingSkills.length === 0) && (
                  <span className="text-emerald-700 italic">None! All requirements satisfied.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Active Skills with Removable Badges */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">
              My Active Skills ({studentSkills.length})
            </h3>
            <span className="text-xs text-slate-400">Click ‘×’ on any skill badge to remove</span>
          </div>

          {studentSkills.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-slate-300 text-slate-400 text-center text-xs">
              You haven't added any skills to your profile yet. Select from the bank below.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
              {studentSkills.map((sk) => (
                <SkillBadge
                  key={sk}
                  name={sk}
                  type="removable"
                  size="md"
                  onRemove={() => handleToggleSkill(sk)}
                />
              ))}
            </div>
          )}

          {/* Add Custom Skill Form */}
          <form onSubmit={handleAddCustomSkill} className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <label className="block text-xs font-semibold text-blue-900 mb-1">
              Add Custom Skill to Your Portfolio
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. Next.js, TensorFlow, PySpark, Figma"
                className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </form>

          {/* Suggested Skill Catalog Bank */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Recommended Skills for {profile?.desiredRole || profile?.sector || 'Your Career'}
                </span>
                <span className="text-xs text-slate-500">
                  Sector-aligned competencies from {profile?.sector || 'Industry'} benchmarks. Click any skill to add.
                </span>
              </div>
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter skills..."
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            {filteredCatalogSkills.length === 0 ? (
              <div className="p-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 text-slate-500 text-center text-xs">
                {searchQuery ? (
                  <span>No skills found matching "{searchQuery}". You can add it as a custom skill above!</span>
                ) : (
                  <span>All recommended skills for {profile?.desiredRole || 'your target role'} are already in your portfolio! You can add custom skills above.</span>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                {filteredCatalogSkills.map((sk) => (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => handleToggleSkill(sk.name)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border flex items-center gap-1.5 bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50/50"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                    <span>{sk.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
