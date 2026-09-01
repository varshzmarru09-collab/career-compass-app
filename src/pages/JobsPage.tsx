import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../api/client.js';
import { Job, SectorType, JobType, ApplicationStatus } from '../types/index.js';
import { SkillBadge } from '../components/SkillBadge.js';
import { ApplicationModal } from '../components/ApplicationModal.js';
import {
  Briefcase,
  Search,
  Building,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Filter,
  DollarSign,
  Users,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Send,
} from 'lucide-react';

interface JobsPageProps {
  onNavigateTab: (tab: string, params?: Record<string, any>) => void;
  onBack?: () => void;
  initialApplyJobId?: string;
}

type EnrichedJob = Job & {
  matchedSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
  isEligible: boolean;
  hasApplied: boolean;
  applicationId?: string;
  applicationStatus?: ApplicationStatus;
};

export const JobsPage: React.FC<JobsPageProps> = ({ onNavigateTab, onBack, initialApplyJobId }) => {
  const { user, profile, refreshProfile } = useAuth();

  const [jobs, setJobs] = useState<EnrichedJob[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedJobType, setSelectedJobType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);

  const [selectedJobForApplication, setSelectedJobForApplication] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getJobs();
      setJobs(data.jobs);

      // Check if initialApplyJobId was passed
      if (initialApplyJobId) {
        const found = data.jobs.find((j: any) => j.id === initialApplyJobId);
        if (found) {
          setSelectedJobForApplication(found);
        }
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [initialApplyJobId]);

  const handleApplyClick = (job: Job) => {
    setSelectedJobForApplication(job);
  };

  const handleApplicationSubmit = async (data: {
    jobId: string;
    resumeFileName?: string;
    coverNote?: string;
  }) => {
    await api.submitApplication(data);
    setSelectedJobForApplication(null);
    await loadJobs();
    await refreshProfile();
    // Navigate directly to Application Tracking as per requirement 10
    onNavigateTab('applications');
  };

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    if (selectedSector !== 'all' && job.sector !== selectedSector) return false;
    if (selectedJobType !== 'all' && job.jobType !== selectedJobType) return false;
    if (selectedLocation !== 'all' && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    if (onlyEligible && !job.isEligible) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(q));
      if (!matches) return false;
    }

    return true;
  });

  const uniqueLocations = Array.from(new Set(jobs.map((j) => j.location.split('/')[0].trim())));

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
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Direct Skill-to-Job Matching Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Verified Industry Opportunities
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Matching your verified profile for{' '}
                <strong className="text-slate-800">{profile?.desiredRole || 'All Roles'}</strong>.
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
              onClick={() => onNavigateTab('applications')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Track Applications</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                id="input-jobs-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, company, skills..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sector */}
            <div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-700"
              >
                <option value="all">All Sectors</option>
                <option value="IT & Software">IT & Software</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Banking & Finance">Banking & Finance</option>
                <option value="Construction">Construction</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>

            {/* Job Type */}
            <div>
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-700"
              >
                <option value="all">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-700"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Toggle: Only Eligible */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="font-semibold text-slate-700">
                Show Only Fully Eligible Opportunities (100% Match)
              </span>
            </label>

            <span className="text-slate-500">
              Showing <strong className="text-slate-900">{filteredJobs.length}</strong> openings
            </span>
          </div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="text-center py-16 text-slate-500 text-xs">Loading matching jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No matching jobs found</h3>
            <p className="text-xs text-slate-500">
              Try relaxing your filters or check the Skill Analyzer to bridge required competencies.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSector('all');
                setSelectedJobType('all');
                setSelectedLocation('all');
                setOnlyEligible(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const isEligible = job.isEligible;
              const hasApplied = job.hasApplied;

              return (
                <div
                  key={job.id}
                  id={`job-card-${job.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left Column: Job Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {job.sector}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800">
                        {job.jobType}
                      </span>
                      {hasApplied && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Applied ({job.applicationStatus || 'In Review'})
                        </span>
                      )}
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900 leading-tight">{job.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          {job.salary}
                        </span>
                        <span className="text-slate-400">Exp: {job.experienceRequired}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {job.description}
                    </p>

                    {/* Required Skills with matched status */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Required Skills:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills.map((sk) => {
                          const isMatched = job.matchedSkills.some(
                            (ms) => ms.toLowerCase() === sk.toLowerCase()
                          );
                          return (
                            <SkillBadge
                              key={sk}
                              name={sk}
                              type={isMatched ? 'matched' : 'missing'}
                              size="sm"
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Match Percentage & Apply CTA */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="flex items-center md:justify-end gap-1.5">
                        <span
                          className={`text-2xl font-black font-mono ${
                            job.matchPercentage === 100
                              ? 'text-emerald-600'
                              : job.matchPercentage >= 50
                              ? 'text-blue-600'
                              : 'text-amber-500'
                          }`}
                        >
                          {job.matchPercentage}%
                        </span>
                        <span className="text-xs font-bold text-slate-500 uppercase">Match</span>
                      </div>

                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                            isEligible
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {isEligible ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Eligible
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              Skill Gap ({job.missingSkills.length})
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasApplied ? (
                        <button
                          onClick={() => onNavigateTab('applications')}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          View Tracking
                        </button>
                      ) : (
                        <button
                          id={`btn-apply-job-${job.id}`}
                          onClick={() => handleApplyClick(job)}
                          className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer ${
                            isEligible
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simulated Application Modal */}
      {selectedJobForApplication && (
        <ApplicationModal
          job={selectedJobForApplication}
          user={user}
          profile={profile}
          onClose={() => setSelectedJobForApplication(null)}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
};
