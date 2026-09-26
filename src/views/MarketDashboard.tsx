// ==============================================================================
// PrepGated - In-Demand Jobs & Skill Market Intelligence
// Section 1: In-Demand Jobs Explorer
// Section 2: Skill Recommendation Engine
// Full Light Mode & Dark Mode support.
// ==============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IN_DEMAND_JOBS_2026, InDemandJob } from '../data/marketJobs2026';
import { useJobTargets } from '../context/JobTargetsContext';
import {
  TrendingUp,
  ArrowRight,
  Sparkles,
  DollarSign,
  Briefcase,
  CheckCircle2,
  FileText,
  MessageSquareCode,
  Shield,
  Layers,
  ChevronRight,
  Plus,
  Check,
} from 'lucide-react';

export const MarketDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { createTarget, setActiveTargetId, tracks, togglePreferredRole, preferredTrackIds } = useJobTargets();

  const [selectedJob, setSelectedJob] = useState<InDemandJob>(IN_DEMAND_JOBS_2026[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isStarting, setIsStarting] = useState(false);
  const [addedSkills, setAddedSkills] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Tech & AI', 'Cloud & Security', 'Healthcare', 'Leadership', 'Skilled Trades'];

  const filteredJobs = IN_DEMAND_JOBS_2026.filter((job) => {
    if (activeCategory === 'All') return true;
    return job.category === activeCategory;
  });

  const handleStartLearningPath = async (job: InDemandJob) => {
    setIsStarting(true);
    try {
      const matchedTrack =
        tracks.find((t) => t.name.toLowerCase().includes(job.title.toLowerCase().split(' ')[0])) ||
        tracks[0];

      if (matchedTrack) {
        const newTarget = await createTarget(matchedTrack.id, `${job.title} Track`);
        setActiveTargetId(newTarget.id);
      }
      navigate('/learning-path', { state: { jobTitle: job.title, jobId: job.id } });
    } catch (err) {
      console.error(err);
      navigate('/learning-path', { state: { jobTitle: job.title, jobId: job.id } });
    } finally {
      setIsStarting(false);
    }
  };

  const handleToggleRolePreference = async (job: InDemandJob, e: React.MouseEvent) => {
    e.stopPropagation();
    const matchedTrack =
      tracks.find((t) => t.name.toLowerCase().includes(job.title.toLowerCase().split(' ')[0])) ||
      tracks[0];
    if (matchedTrack) {
      await togglePreferredRole(matchedTrack.id);
    }
  };

  const toggleSkillInPlan = (skillName: string) => {
    setAddedSkills((prev) => ({
      ...prev,
      [skillName]: !prev[skillName],
    }));
  };

  return (
    <div className="space-y-10 pb-16 transition-colors">
      {/* Hero Strip with Translucent Architectural Portal */}
      <div className="prepgated-card rounded-2xl p-8 sm:p-10 select-none relative overflow-hidden transition-all border border-indigo-500/20 dark:border-indigo-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl space-y-3 z-10 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/40 text-[#4f46e5] dark:text-indigo-300 text-[11px] font-mono font-semibold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-[#4f46e5] dark:text-indigo-400" />
            <span>Labor Market Intelligence</span>
          </div>

          <h1
            className="text-zinc-900 dark:text-white font-extrabold tracking-tight leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
          >
            Discover the Highest In-Demand Jobs
          </h1>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
            Real-time industry data aggregated across tech, AI, cloud, and engineering sectors. Learn the exact market skills, optimize your ATS resume, and take job-tailored mock interviews.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-600 dark:text-zinc-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4f46e5]" />
              <span>High-Growth Specializations</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Multi-Role Progression Tracking</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Adaptive Skill Drills</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1A: Currently Most In-Demand Jobs */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-[#27272a] pb-3">
          <div>
            <span className="text-[11px] font-semibold tracking-[1px] uppercase text-zinc-500 font-mono block">
              Market Analysis
            </span>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-[#fafafa]">
              Currently Most In-Demand Jobs
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Roles Grid (10 Roles) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const isSelected = selectedJob.id === job.id;
            const matchedTrack = tracks.find((t) =>
              t.name.toLowerCase().includes(job.title.toLowerCase().split(' ')[0])
            );
            const isPreferred = matchedTrack ? preferredTrackIds.includes(matchedTrack.id) : false;

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`prepgated-card rounded-xl p-5 flex flex-col justify-between transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-[#4f46e5] ring-1 ring-[#4f46e5]/40 shadow-md'
                    : 'hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <div>
                  {/* Top Row: Category + Demand Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono uppercase font-semibold text-zinc-500">
                      {job.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isPreferred && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-[#4f46e5] dark:text-[#a5b4fc] border border-indigo-200 dark:border-indigo-800">
                          PREFERABLE ROLE
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          job.demandLevel === 'Very High'
                            ? 'bg-amber-50 dark:bg-[#1e1b4b] text-amber-700 dark:text-[#818cf8] border border-amber-200 dark:border-[#6366f1]/30'
                            : 'bg-zinc-100 dark:bg-[#27272a] text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {job.demandLevel} Demand
                      </span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="text-base font-bold text-zinc-900 dark:text-[#fafafa] tracking-tight">
                    {job.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-[#71717a] mt-1.5 line-clamp-2 leading-relaxed">
                    {job.summary}
                  </p>

                  {/* Growth & Salary Stats */}
                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-lg bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-[#27272a] text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                        Projected Growth
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[11px] flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-3 h-3" />
                        <span>{job.projectedGrowth}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                        Avg Salary Range
                      </span>
                      <span className="text-zinc-800 dark:text-zinc-200 font-semibold font-mono text-[11px] flex items-center gap-1 mt-0.5">
                        <DollarSign className="w-3 h-3 text-[#4f46e5]" />
                        <span>{job.salaryRange}</span>
                      </span>
                    </div>
                  </div>

                  {/* Key Skills Tags */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-zinc-500">
                      Key Skills Required:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.keySkills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono text-zinc-700 dark:text-[#a1a1aa] bg-zinc-100 dark:bg-[#111113] border border-zinc-200 dark:border-[#27272a] px-2 py-0.5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.keySkills.length > 4 && (
                        <span className="text-[11px] font-mono text-zinc-500 px-1 py-0.5">
                          +{job.keySkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-[#27272a] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleToggleRolePreference(job, e)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors inline-flex items-center gap-1 cursor-pointer ${
                        isPreferred
                          ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 text-[#4f46e5] dark:text-[#a5b4fc]'
                          : 'border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                      title={isPreferred ? 'Remove from preferable roles' : 'Add to preferable roles'}
                    >
                      {isPreferred ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{isPreferred ? 'Tracked' : 'Add to Roles'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/resume', { state: { targetJob: job.title } });
                      }}
                      className="text-xs text-zinc-600 dark:text-[#71717a] hover:text-zinc-900 dark:hover:text-white px-2 py-1 rounded-md border border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Resume</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartLearningPath(job);
                    }}
                    className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Start Path</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1B: Skill Recommendation Engine */}
      {/* ========================================================================= */}
      <div className="prepgated-card rounded-xl p-6 space-y-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-[1px] uppercase text-[#4f46e5] dark:text-[#818cf8] font-mono block">
                Recommendation Engine
              </span>
            </div>
            <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-[#fafafa] mt-0.5">
              Exact Skills Recommended for "{selectedJob.title}"
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Prioritized by hiring manager frequency, ATS keyword weighting, and labor projections.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStartLearningPath(selectedJob)}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Enroll in {selectedJob.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Prioritized Skill Recommendations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {selectedJob.recommendedSkills.map((skill, index) => {
            const isAdded = addedSkills[skill.name];

            return (
              <div
                key={index}
                className="p-4 rounded-xl border border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded ${
                        skill.priority === 'Critical'
                          ? 'bg-red-50 dark:bg-red-950/70 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60'
                          : skill.priority === 'High'
                          ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60'
                          : 'bg-indigo-50 dark:bg-indigo-950/70 text-[#4f46e5] dark:text-[#818cf8] border border-indigo-200 dark:border-indigo-900/60'
                      }`}
                    >
                      {skill.priority} Priority
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                      {skill.marketDemandScore}% Demand
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 dark:text-[#fafafa]">
                    {skill.name}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-[#71717a] mt-1 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-[#27272a] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">
                    {skill.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSkillInPlan(skill.name)}
                    className={`text-xs px-2.5 py-1 rounded font-medium transition-colors inline-flex items-center gap-1 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-zinc-200 dark:bg-[#18181b] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Included in Plan</span>
                      </>
                    ) : (
                      <span>+ Add to Study Plan</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
