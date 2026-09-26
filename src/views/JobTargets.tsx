// ==============================================================================
// PrepGated - Job Targets & Pipelines View
// Multi-role selection, active target role management, and 5-stage pipeline cards.
// Full Light Mode & Dark Mode support.
// ==============================================================================

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useJobTargets } from '../context/JobTargetsContext';
import {
  ArrowRight,
  BookOpen,
  Building2,
  X,
  Plus,
  Check,
  CheckCircle2,
  Layers,
  Sparkles,
  Trash2,
  TrendingUp,
} from 'lucide-react';

interface TrackDemandConfig {
  track_id: string;
  name: string;
  demand_level: 'high' | 'growing' | 'stable' | 'low';
  demand_score: number;
  trending: boolean;
}

const STATIC_TRACK_DEMANDS: TrackDemandConfig[] = [
  { track_id: 'track-ai-6', name: 'ML/Data Scientist', demand_level: 'high', demand_score: 82, trending: true },
  { track_id: 'track-agent-10', name: 'Agentic AI Engineer', demand_level: 'high', demand_score: 88, trending: true },
  { track_id: 'track-sde-1', name: 'SDE / Backend', demand_level: 'high', demand_score: 79, trending: false },
  { track_id: 'track-devops-7', name: 'Cloud Engineer', demand_level: 'growing', demand_score: 61, trending: true },
  { track_id: 'track-fs-3', name: 'Full Stack Developer', demand_level: 'growing', demand_score: 65, trending: false },
  { track_id: 'track-da-4', name: 'Data Analyst', demand_level: 'growing', demand_score: 58, trending: false },
  { track_id: 'track-fe-2', name: 'Frontend Developer', demand_level: 'stable', demand_score: 50, trending: false },
  { track_id: 'track-cyber-8', name: 'Security & DevOps', demand_level: 'stable', demand_score: 48, trending: false },
];

const levelWeight: Record<'high' | 'growing' | 'stable' | 'low', number> = {
  high: 3,
  growing: 2,
  stable: 1,
  low: 0,
};

const SORTED_TRACK_DEMANDS = [...STATIC_TRACK_DEMANDS].sort((a, b) => {
  if (levelWeight[b.demand_level] !== levelWeight[a.demand_level]) {
    return levelWeight[b.demand_level] - levelWeight[a.demand_level];
  }
  return b.demand_score - a.demand_score;
});

export const JobTargets: React.FC = () => {
  const {
    targets,
    activeTarget,
    tracks,
    preferredTrackIds,
    selectedTracks,
    setActiveTargetId,
    createTarget,
    setPreferredRoles,
    removePreferredRole,
    stages = [],
  } = useJobTargets();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrackIdsForBatch, setSelectedTrackIdsForBatch] = useState<string[]>(preferredTrackIds);
  const [targetCompany, setTargetCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenMultiRoleModal = () => {
    setSelectedTrackIdsForBatch(preferredTrackIds);
    setIsModalOpen(true);
  };

  const handleToggleTrack = (trackId: string) => {
    if (selectedTrackIdsForBatch.includes(trackId)) {
      if (selectedTrackIdsForBatch.length <= 1) return;
      setSelectedTrackIdsForBatch((prev) => prev.filter((id) => id !== trackId));
    } else {
      setSelectedTrackIdsForBatch((prev) => [...prev, trackId]);
    }
  };

  const handleSaveBatchRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await setPreferredRoles(selectedTrackIdsForBatch);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to update preferable roles:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-[#27272a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[1px] uppercase text-zinc-500 font-mono">
              Career Trajectories
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-[#4f46e5] dark:text-[#a5b4fc] font-mono">
              {targets.length} Preferable Roles Active
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-[#fafafa] mt-0.5">
            Preferable Target Roles & Placement Pipelines
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage multiple active target tracks simultaneously. Switch active pipeline anytime.
          </p>
        </div>

        <button
          onClick={handleOpenMultiRoleModal}
          className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold text-[13px] py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add / Select Multiple Roles</span>
        </button>
      </div>

      {/* SECTION 19.2 — Job Demand Status Display */}
      <div className="card-premium p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>Live Job Market Demand Status</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              8 Verified Tracks
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            Ranked by hiring velocity & active placement quotas
          </span>
        </div>

        {/* Horizontal responsive demand bar grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SORTED_TRACK_DEMANDS.map((item) => {
            const isHigh = item.demand_level === 'high';
            const isGrowing = item.demand_level === 'growing';

            const badgeBg = isHigh
              ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/60'
              : isGrowing
              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60'
              : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700';

            const dotColor = isHigh ? 'bg-red-500' : isGrowing ? 'bg-amber-400' : 'bg-zinc-400';
            const barFillColor = isHigh ? 'bg-red-500' : isGrowing ? 'bg-amber-400' : 'bg-indigo-500';

            return (
              <div
                key={item.track_id}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50 flex flex-col justify-between gap-2 text-xs"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeBg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    {isHigh ? 'High demand' : isGrowing ? 'Growing' : 'Stable'}
                  </span>
                  {item.trending && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800/50">
                      Trending
                    </span>
                  )}
                </div>

                <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {item.name}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Index</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.demand_score}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barFillColor} transition-all duration-500`}
                      style={{ width: `${item.demand_score}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {targets.map((target) => {
          const isActive = activeTarget?.id === target.id;
          const track = target.job_track || tracks.find((t) => t.id === target.job_track_id);

          return (
            <div
              key={target.id}
              className={`prepgated-card rounded-xl p-5 flex flex-col justify-between transition-all shadow-xs ${
                isActive
                  ? 'border-[#4f46e5] ring-1 ring-[#4f46e5]/40 shadow-md'
                  : 'hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider block">
                        {track?.category === 'booming' ? 'High Growth Role' : 'Core Tech Role'}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-[#4f46e5] dark:text-[#a5b4fc] font-bold">
                          PRIMARY TRACK
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-bold text-zinc-900 dark:text-[#fafafa]">
                      {track?.name || 'Software Engineering'}
                    </h2>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{target.company || 'Campus Placement / Tier-1 Tech'}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="chip-stat">
                      {target.readiness_score || 0}% Score
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="my-3">
                  <div className="h-[3px] w-full bg-zinc-100 dark:bg-[#27272a] rounded-[2px] overflow-hidden">
                    <div
                      className="h-full bg-[#4f46e5] rounded-[2px]"
                      style={{ width: `${Math.max(4, target.readiness_score || 0)}%` }}
                    />
                  </div>
                </div>

                {/* Core topics */}
                {track?.core_topics && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {track.core_topics.slice(0, 4).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[11px] text-zinc-600 dark:text-[#a1a1aa] font-mono bg-zinc-100 dark:bg-[#111113] border border-zinc-200 dark:border-[#27272a] px-2 py-0.5 rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* 5-Stage Gated Pipeline Stepper Preview */}
                <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-[#27272a]">
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mb-2 flex items-center justify-between">
                    <span>5-Stage Placement Pipeline</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {stages.filter((s) => s.unlocked).length}/5 Stages Unlocked
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 text-center">
                    {stages.map((stg) => (
                      <div
                        key={stg.id}
                        className={`p-1.5 rounded-lg border text-[11px] font-mono transition-all ${
                          stg.unlocked
                            ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-400 opacity-60'
                        }`}
                      >
                        <span className="block truncate">{stg.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-[#27272a] flex items-center justify-between">
                <div>
                  {isActive ? (
                    <span className="text-xs text-[#4f46e5] dark:text-[#818cf8] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active in Dashboard</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveTargetId(target.id)}
                      className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer font-medium"
                    >
                      Set as Primary Track
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {targets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePreferredRole(target.job_track_id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Remove from preferable roles"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <NavLink
                    to={`/targets/${target.id}/study-path`}
                    className="text-xs text-zinc-700 dark:text-[#71717a] hover:text-zinc-900 dark:hover:text-white inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] transition-colors"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Study Path</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setActiveTargetId(target.id)}
                    className="text-xs text-white bg-[#4f46e5] hover:bg-[#4338ca] inline-flex items-center gap-1 px-3 py-1 rounded-md font-semibold transition-colors shadow-xs"
                  >
                    <span>Pipeline</span>
                    <ArrowRight className="w-3 h-3" />
                  </NavLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          MULTI-ROLE SELECTION MODAL
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl prepgated-card rounded-2xl p-6 space-y-5 shadow-2xl text-left max-h-[90vh] flex flex-col backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#27272a] pb-3 shrink-0">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>Select Preferable Roles at Once</span>
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-[#4f46e5] dark:text-[#a5b4fc] font-mono">
                    {selectedTrackIdsForBatch.length} Selected
                  </span>
                </h3>
                <p className="text-xs text-zinc-500">
                  Pick all roles you want to prepare for. Pipelines and study roadmaps will be created for each.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-[#27272a] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center justify-between gap-2 shrink-0">
              <span className="text-xs text-zinc-500 font-mono">
                Click cards to toggle selection:
              </span>
              <button
                type="button"
                onClick={() => setSelectedTrackIdsForBatch(tracks.map((t) => t.id))}
                className="text-xs text-[#4f46e5] dark:text-[#818cf8] hover:underline font-semibold"
              >
                Select All ({tracks.length})
              </button>
            </div>

            {/* Role List (Scrollable) */}
            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {tracks.map((track) => {
                const isChecked = selectedTrackIdsForBatch.includes(track.id);

                return (
                  <div
                    key={track.id}
                    onClick={() => handleToggleTrack(track.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'border-[#4f46e5] bg-indigo-50/60 dark:bg-[#1e1b4b]/50 text-zinc-900 dark:text-white shadow-xs'
                        : 'border-zinc-200 dark:border-[#27272a] bg-zinc-50 dark:bg-[#111113] hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? 'bg-[#4f46e5] text-white'
                            : 'border border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                            {track.name}
                          </h4>
                          {track.category === 'booming' && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-semibold">
                              High Demand
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                          {track.description}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 mt-1">
                          <span>{track.salary_range}</span>
                          <span>·</span>
                          <span>{track.estimated_time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-zinc-200 dark:border-[#27272a] flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-zinc-500 font-mono">
                {selectedTrackIdsForBatch.length} role(s) selected
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBatchRoles}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Confirm Preferable Roles'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
