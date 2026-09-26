// ==============================================================================
// PrepGated - Employer Portal & Candidate Talent Pool (Section 18.1 & 18.4)
// - Post a role (job title, track, required stages, minimum readiness score cutoff)
// - Browse anonymized candidate pool (readiness score, percentile, per-stage breakdown)
// - Role-Fit Match Score calculation (Section 18.4)
// - Candidate identity is anonymous until unlocked
// ==============================================================================

import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJobTargets } from '../context/JobTargetsContext';
import { EmployerJobRole, CandidateReadinessProfile } from '../types';
import {
  Building2,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

const SEED_EMPLOYER_ROLES: EmployerJobRole[] = [
  {
    id: 'emp-role-1',
    employer_id: 'emp-org-1',
    company_name: 'Veritas Cloud Systems',
    job_title: 'Junior Machine Learning Engineer',
    track_id: 'ml-data-scientist',
    track_name: 'ML / Data Scientist',
    required_stages: [1, 2, 3, 4],
    min_readiness_score: 75,
    salary_range: '$110,000 - $140,000',
    location: 'Remote / North America',
    created_at: '2026-09-18',
    applicants_count: 14,
  },
  {
    id: 'emp-role-2',
    employer_id: 'emp-org-1',
    company_name: 'Veritas Cloud Systems',
    job_title: 'Full Stack Platform Engineer',
    track_id: 'full-stack-dev',
    track_name: 'Full Stack Developer',
    required_stages: [1, 2, 3, 4, 5],
    min_readiness_score: 80,
    salary_range: '$120,000 - $155,000',
    location: 'San Francisco, CA / Hybrid',
    created_at: '2026-09-22',
    applicants_count: 22,
  },
];

const SEED_CANDIDATE_POOL: CandidateReadinessProfile[] = [
  {
    id: 'cand-1',
    candidate_ref: 'Candidate #7421',
    track_id: 'ml-data-scientist',
    track_name: 'ML / Data Scientist',
    overall_score: 88,
    percentile: 94,
    stages_cleared: 5,
    per_stage_breakdown: {
      'Aptitude & Logical Reasoning': 92,
      'Verbal & Communication': 85,
      'Technical Knowledge': 90,
      'Coding Challenge': 84,
      'HR & Behavioural': 89,
    },
    completion_date: '2026-09-24',
    profile_unlocked: false,
    role_fit_score: 93,
    candidate_name: 'Rohan Sharma',
    candidate_email: 'rohan.sharma.eng@gmail.com',
  },
  {
    id: 'cand-2',
    candidate_ref: 'Candidate #3890',
    track_id: 'ml-data-scientist',
    track_name: 'ML / Data Scientist',
    overall_score: 82,
    percentile: 87,
    stages_cleared: 4,
    per_stage_breakdown: {
      'Aptitude & Logical Reasoning': 86,
      'Verbal & Communication': 80,
      'Technical Knowledge': 85,
      'Coding Challenge': 78,
      'HR & Behavioural': 0,
    },
    completion_date: '2026-09-21',
    profile_unlocked: false,
    role_fit_score: 86,
    candidate_name: 'Priya Patel',
    candidate_email: 'priya.patel.ai@outlook.com',
  },
  {
    id: 'cand-3',
    candidate_ref: 'Candidate #5104',
    track_id: 'full-stack-dev',
    track_name: 'Full Stack Developer',
    overall_score: 91,
    percentile: 96,
    stages_cleared: 5,
    per_stage_breakdown: {
      'Aptitude & Logical Reasoning': 95,
      'Verbal & Communication': 88,
      'Technical Knowledge': 92,
      'Coding Challenge': 90,
      'HR & Behavioural': 90,
    },
    completion_date: '2026-09-25',
    profile_unlocked: true,
    role_fit_score: 95,
    candidate_name: 'David Kim',
    candidate_email: 'david.kim.dev@gmail.com',
  },
  {
    id: 'cand-4',
    candidate_ref: 'Candidate #9213',
    track_id: 'full-stack-dev',
    track_name: 'Full Stack Developer',
    overall_score: 79,
    percentile: 82,
    stages_cleared: 4,
    per_stage_breakdown: {
      'Aptitude & Logical Reasoning': 82,
      'Verbal & Communication': 76,
      'Technical Knowledge': 81,
      'Coding Challenge': 77,
      'HR & Behavioural': 0,
    },
    completion_date: '2026-09-19',
    profile_unlocked: false,
    role_fit_score: 81,
    candidate_name: 'Elena Rostova',
    candidate_email: 'elena.rostova@techmail.org',
  },
  {
    id: 'cand-5',
    candidate_ref: 'Candidate #6642',
    track_id: 'cloud-devops',
    track_name: 'Cloud / DevOps Engineer',
    overall_score: 85,
    percentile: 91,
    stages_cleared: 4,
    per_stage_breakdown: {
      'Aptitude & Logical Reasoning': 88,
      'Verbal & Communication': 82,
      'Technical Knowledge': 89,
      'Coding Challenge': 81,
      'HR & Behavioural': 0,
    },
    completion_date: '2026-09-23',
    profile_unlocked: false,
    role_fit_score: 89,
    candidate_name: 'Marcus Vance',
    candidate_email: 'marcus.vance.cloud@proton.me',
  },
];

export const EmployerPortal: React.FC = () => {
  const { user, profile } = useAuth();
  const { tracks } = useJobTargets();

  const [roles, setRoles] = useState<EmployerJobRole[]>(SEED_EMPLOYER_ROLES);
  const [candidates, setCandidates] = useState<CandidateReadinessProfile[]>(SEED_CANDIDATE_POOL);

  // Filters
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('all');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(70);
  const [activeTab, setActiveTab] = useState<'candidates' | 'post_role'>('candidates');

  // Post Role Form state
  const [newTitle, setNewTitle] = useState('');
  const [newTrackId, setNewTrackId] = useState(tracks[0]?.id || 'ml-data-scientist');
  const [newMinScore, setNewMinScore] = useState(75);
  const [newSalary, setNewSalary] = useState('$115,000 - $145,000');
  const [newLocation, setNewLocation] = useState('Remote / US');
  const [roleCreatedSuccess, setRoleCreatedSuccess] = useState(false);

  // Filtered candidate pool
  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        if (selectedTrackFilter !== 'all' && c.track_id !== selectedTrackFilter) return false;
        if (c.overall_score < minScoreFilter) return false;
        return true;
      })
      .sort((a, b) => b.role_fit_score - a.role_fit_score);
  }, [candidates, selectedTrackFilter, minScoreFilter]);

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const matchedTrack = tracks.find((t) => t.id === newTrackId) || tracks[0];
    const newRole: EmployerJobRole = {
      id: `emp-role-${Date.now()}`,
      employer_id: user?.id || 'emp-current',
      company_name: profile?.name || 'Partner Tech Enterprise',
      job_title: newTitle.trim(),
      track_id: matchedTrack.id,
      track_name: matchedTrack.name,
      required_stages: [1, 2, 3, 4],
      min_readiness_score: newMinScore,
      salary_range: newSalary,
      location: newLocation,
      created_at: new Date().toISOString().split('T')[0],
      applicants_count: 0,
    };

    setRoles([newRole, ...roles]);
    setRoleCreatedSuccess(true);
    setNewTitle('');
    setTimeout(() => {
      setRoleCreatedSuccess(false);
      setActiveTab('candidates');
    }, 1500);
  };

  const handleToggleUnlock = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, profile_unlocked: !c.profile_unlocked } : c))
    );
  };

  return (
    <div className="space-y-7 pb-16 animate-fade-in">
      {/* Top Banner: Dual Mode Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-[10px] font-mono font-bold uppercase text-purple-700 dark:text-purple-300">
              Employer Portal
            </span>
            <span className="text-xs text-zinc-400 font-mono">Zero-Resume Talent Discovery</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight font-display text-zinc-900 dark:text-white">
            Verified Candidate Readiness Pool
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Filter pre-assessed candidates by verified 5-stage readiness scores, campus percentiles, and role-fit scores. Candidate identities remain anonymous until unlocked.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'candidates'
                ? 'bg-[#4f46e5] text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-[#18181b] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            Browse Candidates ({filteredCandidates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('post_role')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'post_role'
                ? 'bg-[#4f46e5] text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-[#18181b] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post a Role</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: BROWSE CANDIDATE POOL */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-zinc-500 font-mono flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                Track:
              </span>
              <select
                value={selectedTrackFilter}
                onChange={(e) => setSelectedTrackFilter(e.target.value)}
                className="text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              >
                <option value="all">All Career Tracks</option>
                <option value="ml-data-scientist">ML / Data Scientist</option>
                <option value="full-stack-dev">Full Stack Developer</option>
                <option value="cloud-devops">Cloud / DevOps Engineer</option>
              </select>

              <span className="text-xs font-semibold text-zinc-500 font-mono ml-2">
                Min Readiness:
              </span>
              <select
                value={minScoreFilter}
                onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                className="text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              >
                <option value={60}>60%+ Readiness</option>
                <option value={75}>75%+ (Tier-1 Qualified)</option>
                <option value={85}>85%+ (Elite Bar-Raiser)</option>
              </select>
            </div>

            <div className="text-xs text-zinc-400 font-mono">
              Ranking Signal: <span className="font-bold text-[#4f46e5]">Role-Fit Score & Percentile</span>
            </div>
          </div>

          {/* Candidate Pool List */}
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-900/60 transition-all shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-[#4f46e5] font-bold font-mono text-sm">
                      {candidate.overall_score}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white font-display">
                          {candidate.profile_unlocked
                            ? candidate.candidate_name
                            : candidate.candidate_ref}
                        </h3>
                        {candidate.profile_unlocked && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 font-mono">
                        {candidate.track_name} · Cleared {candidate.stages_cleared}/5 Stages
                      </p>
                    </div>
                  </div>

                  {/* Role Fit Score & Unlock Action */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-mono text-zinc-400">Role-Fit Score</div>
                      <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                        {candidate.role_fit_score}% Match
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleUnlock(candidate.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                        candidate.profile_unlocked
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                          : 'bg-[#4f46e5] text-white hover:bg-[#4338ca] shadow-xs'
                      }`}
                    >
                      {candidate.profile_unlocked ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>View Contact</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlock Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Per-Stage Readiness Breakdown Grid */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider">
                    Verified Stage Score Breakdown:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {Object.entries(candidate.per_stage_breakdown).map(([stageName, score]) => (
                      <div
                        key={stageName}
                        className="p-2.5 rounded-lg bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800"
                      >
                        <span className="text-[10px] text-zinc-500 block truncate">{stageName}</span>
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                          {score > 0 ? `${score}%` : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revealed details if unlocked */}
                {candidate.profile_unlocked && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-emerald-800 dark:text-emerald-300 font-mono">
                      Candidate Email: <strong>{candidate.candidate_email}</strong>
                    </span>
                    <span className="text-zinc-500 font-mono">
                      Completed: {candidate.completion_date} · Top {100 - candidate.percentile}% Campus Percentile
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: POST A ROLE (Section 18.1) */}
      {activeTab === 'post_role' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 sm:p-9 shadow-xl space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
              Post a Role to Candidate Talent Pool
            </h2>
            <p className="text-xs text-zinc-500">
              Specify your target track and minimum readiness threshold. The ranking engine matches candidates automatically.
            </p>
          </div>

          {roleCreatedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Role posted successfully! Candidates will be evaluated against this threshold.</span>
            </div>
          )}

          <form onSubmit={handleCreateRole} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 font-mono block">
                Job Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Associate AI / Data Engineer"
                className="w-full bg-zinc-50 dark:bg-[#181a24] border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-[#4f46e5]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 font-mono block">
                  Career Track
                </label>
                <select
                  value={newTrackId}
                  onChange={(e) => setNewTrackId(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#181a24] border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none cursor-pointer"
                >
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 font-mono block">
                  Min Readiness Cutoff (%)
                </label>
                <input
                  type="number"
                  min={50}
                  max={95}
                  value={newMinScore}
                  onChange={(e) => setNewMinScore(Number(e.target.value))}
                  className="w-full bg-zinc-50 dark:bg-[#181a24] border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-[#4f46e5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 font-mono block">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#181a24] border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-[#4f46e5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 font-mono block">
                  Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#181a24] border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-[#4f46e5]"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
              >
                Publish Role to Candidate Pool
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
