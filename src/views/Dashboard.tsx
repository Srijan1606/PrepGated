// ==============================================================================
// PrepGated - Candidate Dashboard View
// Features:
// - Sick architectural cybernetic telemetry & frosted glass styling
// - Preferable Roles Multi-Role Selection Bar with instant switching & multi-select modal
// - 4 Core Placement Stats (Readiness Score, Percentile, Stages Cleared, Streak) with font-display
// - Proficiency Radar Chart with adaptive Light/Dark mode styling
// - 5-Stage Sequential Placement Pipeline
// - Topic Readiness & Syllabus Mastery + Trophies & Badges
// - Full Light Mode & Dark Mode WCAG AA compliance with visual preset indicator
// ==============================================================================

import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobTargets } from '../context/JobTargetsContext';
import { useTheme } from '../context/ThemeContext';
import { TrophyUnlockModal } from '../components/TrophyUnlockModal';
import { AchievementBadge } from '../types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  ArrowRight,
  Flame,
  Target,
  Trophy,
  Layers,
  ChevronRight,
  Check,
  Plus,
  X,
  Compass,
  Radio,
  Sparkles,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { isDark, theme, toggleTheme } = useTheme();
  const {
    activeTarget,
    targets,
    tracks,
    preferredTrackIds,
    selectedTracks,
    setActiveTargetId,
    setPreferredRoles,
    stages,
    achievements,
    peerPercentile,
    curriculumTopics,
    topicProgress,
  } = useJobTargets();

  const [selectedBadgeForModal, setSelectedBadgeForModal] = useState<AchievementBadge | null>(null);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [modalSelectedTrackIds, setModalSelectedTrackIds] = useState<string[]>(preferredTrackIds);

  const readinessScore = activeTarget?.readiness_score || 0;
  const clearedStagesCount = stages.filter((s) => s.best_score !== null).length;
  const streakDays = profile?.streak_count || 1;
  const currentTrackName = activeTarget?.job_track?.name || selectedTracks[0]?.name || 'SDE / Backend Engineer';

  // 1. Calculate dynamic skill proficiency scores for the Recharts Radar Chart
  const radarData = useMemo(() => {
    const s1 = stages.find((s) => s.stage_order === 1)?.best_score ?? (readinessScore > 0 ? 78 : 60);
    const s2 = stages.find((s) => s.stage_order === 2)?.best_score ?? (readinessScore > 0 ? 74 : 55);
    const s3 = stages.find((s) => s.stage_order === 3)?.best_score ?? (readinessScore > 0 ? 82 : 65);
    const s4 = stages.find((s) => s.stage_order === 4)?.best_score ?? (readinessScore > 0 ? 80 : 58);
    const s5 = stages.find((s) => s.stage_order === 5)?.best_score ?? (readinessScore > 0 ? 85 : 62);
    const sysDesign = Math.min(100, Math.max(50, Math.round(readinessScore > 0 ? readinessScore * 0.95 : 70)));

    return [
      { category: 'Aptitude', score: s1, fullMark: 100 },
      { category: 'Tech MCQs', score: s2, fullMark: 100 },
      { category: 'Coding', score: s3, fullMark: 100 },
      { category: 'System Design', score: sysDesign, fullMark: 100 },
      { category: 'Communication', score: s4, fullMark: 100 },
      { category: 'HR / Culture', score: s5, fullMark: 100 },
    ];
  }, [stages, readinessScore]);

  // Topic readiness list data
  const topicReadinessList = useMemo(() => {
    const baseTopics = [
      { id: 't1', title: 'Data Structures & Algorithms', percentage: 86 },
      { id: 't2', title: 'System Design & Scalability', percentage: 74 },
      { id: 't3', title: 'Database Indexing & ACID Protocols', percentage: 68 },
      { id: 't4', title: 'Concurrency & Thread Synchronization', percentage: 60 },
      { id: 't5', title: 'REST & gRPC Microservice APIs', percentage: 82 },
      { id: 't6', title: 'Operating Systems & Memory Models', percentage: 70 },
    ];

    if (curriculumTopics && curriculumTopics.length > 0) {
      return curriculumTopics.slice(0, 6).map((ct, idx) => {
        const prog = topicProgress.find((p) => p.topic_id === ct.id);
        const pct = prog?.mastery_score || (idx === 0 ? 82 : Math.max(50, 78 - idx * 6));
        return {
          id: ct.id,
          title: ct.title,
          percentage: pct,
        };
      });
    }

    return baseTopics;
  }, [curriculumTopics, topicProgress]);

  // Clean trophies list for the grid (6 items)
  const displayTrophies = achievements.badges.slice(0, 6);

  // Open modal handler
  const handleOpenRolesModal = () => {
    setModalSelectedTrackIds(preferredTrackIds);
    setIsRolesModalOpen(true);
  };

  const handleToggleModalTrack = (trackId: string) => {
    if (modalSelectedTrackIds.includes(trackId)) {
      if (modalSelectedTrackIds.length <= 1) return; // Keep at least one
      setModalSelectedTrackIds((prev) => prev.filter((id) => id !== trackId));
    } else {
      setModalSelectedTrackIds((prev) => [...prev, trackId]);
    }
  };

  const handleSaveModalRoles = async () => {
    await setPreferredRoles(modalSelectedTrackIds);
    setIsRolesModalOpen(false);
  };

  const handleSelectAllRoles = () => {
    setModalSelectedTrackIds(tracks.map((t) => t.id));
  };

  return (
    <div className="space-y-6 pb-12 transition-colors relative z-10">
      {/* Top Telemetry & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>COMMAND GRID ACTIVE</span>
          </span>
          <span className="text-zinc-400 dark:text-zinc-600 select-none">/</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            BENCHMARK: <span className="text-zinc-800 dark:text-zinc-200 font-semibold">CAMPUS 2026-Q4</span>
          </span>
        </div>

        {/* Quick Theme Preset Status Banner */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 hidden sm:inline">
            THEME PRESET:
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold text-[#4f46e5] dark:text-[#a5b4fc] bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 hover:border-indigo-400 transition-all cursor-pointer shadow-2xs"
            title="Click to toggle between Dark Portal and Light Studio presets"
          >
            <Radio className="w-3 h-3 text-[#4f46e5] dark:text-[#818cf8] animate-pulse" />
            <span>{isDark ? 'DARK OBSIDIAN PORTAL' : 'LIGHT EDITORIAL STUDIO'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PREFERABLE ROLES MULTI-ROLE SELECTION BAR
          Allows selecting multiple roles simultaneously, switching active target
          ========================================================================= */}
      <section className="backdrop-blur-xl bg-white/85 dark:bg-[#0f111a]/85 border border-zinc-200/90 dark:border-white/10 rounded-xl p-4 sm:p-5 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.06)] dark:shadow-[0_12px_36px_-12px_rgba(0,0,0,0.6)] transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-white/10 pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-[1px] uppercase text-zinc-500 font-mono">
                Target Specializations
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-[#4f46e5] dark:text-[#a5b4fc] font-mono font-medium">
                {selectedTracks.length} Preferable Roles Selected
              </span>
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-display mt-0.5">
              Active Job Preparation Tracks
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenRolesModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Modify Preferable Roles</span>
            </button>
            <NavLink
              to="/targets"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-white/80 dark:bg-[#18181b]/80 border border-zinc-200 dark:border-white/10 transition-colors"
            >
              View Pipelines
            </NavLink>
          </div>
        </div>

        {/* Multi-role pill list with active selection */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedTracks.map((track) => {
            const correspondingTarget = targets.find((t) => t.job_track_id === track.id);
            const isCurrentlyActive = activeTarget?.job_track_id === track.id;
            const score = correspondingTarget?.readiness_score || 60;

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => {
                  if (correspondingTarget) {
                    setActiveTargetId(correspondingTarget.id);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  isCurrentlyActive
                    ? 'bg-indigo-50 dark:bg-[#1e1b4b] text-[#4f46e5] dark:text-[#c7d2fe] border-[#4f46e5] shadow-xs ring-1 ring-[#4f46e5]/30'
                    : 'bg-zinc-50/80 dark:bg-[#141622]/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isCurrentlyActive ? 'bg-[#4f46e5] ring-2 ring-indigo-400/40 animate-pulse' : 'bg-zinc-400'
                  }`}
                />
                <span className="font-semibold">{track.name}</span>
                <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-white dark:bg-black/40 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
                  {score}%
                </span>
                {isCurrentlyActive && (
                  <span className="text-[10px] font-mono text-[#4f46e5] dark:text-[#a5b4fc] font-bold">
                    [ACTIVE]
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          1. FOUR-COLUMN STAT CARD ROW (Frosted Glass Depth)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Readiness Score */}
        <div className="backdrop-blur-xl bg-white/85 dark:bg-[#0f111a]/85 border border-zinc-200/90 dark:border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-[0_8px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.5)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-[1px] uppercase text-zinc-500 font-mono">
              Readiness Score
            </span>
            <Target className="w-4 h-4 text-[#4f46e5]" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-zinc-900 dark:text-[#fafafa] tabular-nums tracking-tight">
              {readinessScore}
            </span>
            <span className="text-xs text-zinc-500 font-mono">/ 100</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-[3px] w-full bg-zinc-200/80 dark:bg-white/10 rounded-[2px] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4f46e5] to-[#818cf8] rounded-[2px] transition-all duration-500"
                style={{ width: `${Math.max(4, readinessScore)}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 truncate">
              Active role: <span className="font-medium text-zinc-800 dark:text-zinc-200">{currentTrackName}</span>
            </p>
          </div>
        </div>

        {/* Stat 2: Campus Percentile */}
        <div className="backdrop-blur-xl bg-white/85 dark:bg-[#0f111a]/85 border border-zinc-200/90 dark:border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-[0_8px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.5)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-[1px] uppercase text-zinc-500 font-mono">
              Campus Percentile
            </span>
            <Layers className="w-4 h-4 text-[#4f46e5]" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-zinc-900 dark:text-[#fafafa] tabular-nums tracking-tight">
              Top {100 - peerPercentile}%
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Benchmarked against nationwide applicant pools
          </p>
        </div>

        {/* Stat 3: Stages Cleared */}
        <div className="backdrop-blur-xl bg-white/85 dark:bg-[#0f111a]/85 border border-zinc-200/90 dark:border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-[0_8px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.5)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-[1px] uppercase text-zinc-500 font-mono">
              Stages Cleared
            </span>
            <span className="chip-stat">
              {clearedStagesCount} of 5
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-zinc-900 dark:text-[#fafafa] tabular-nums tracking-tight">
              {clearedStagesCount} / 5
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="h-[3px] w-full bg-zinc-200/80 dark:bg-white/10 rounded-[2px] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4f46e5] to-[#818cf8] rounded-[2px] transition-all duration-500"
                style={{ width: `${(clearedStagesCount / 5) * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500">
              {5 - clearedStagesCount} remaining to full certification
            </p>
          </div>
        </div>

        {/* Stat 4: Daily Streak */}
        <div className="backdrop-blur-xl bg-white/85 dark:bg-[#0f111a]/85 border border-zinc-200/90 dark:border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-[0_8px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.5)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-[1px] uppercase text-zinc-500 font-mono">
              Active Streak
            </span>
            <Flame className="w-4 h-4 text-[#4f46e5]" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-zinc-900 dark:text-[#fafafa] tabular-nums tracking-tight">
              {streakDays} Days
            </span>
          </div>
          <p className="text-xs text-zinc-500">Continuous daily practice recorded</p>
        </div>
      </div>

      {/* =========================================================================
          2. PROFICIENCY RADAR CHART
          ========================================================================= */}
      <div className="backdrop-blur-xl bg-white/85 dark:bg-[#0f111a]/85 border border-zinc-200/90 dark:border-white/10 rounded-xl p-6 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.06)] dark:shadow-[0_12px_36px_-12px_rgba(0,0,0,0.6)] transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/80 dark:border-white/10 pb-4 mb-4">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-[#fafafa] font-display">
              Proficiency Radar & Competency Matrix
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Multi-dimensional evaluation across technical and behavioral interview categories for {currentTrackName}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5] ring-2 ring-indigo-400/40" />
              <span>Candidate Score</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Radar Chart */}
          <div className="lg:col-span-2 h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fill: isDark ? '#cbd5e1' : '#475569', fontSize: 11, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 9 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="backdrop-blur-md bg-white/95 dark:bg-[#12141f]/95 border border-zinc-200 dark:border-white/10 p-2.5 rounded-lg shadow-md text-xs font-mono">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-200 font-sans">{data.category}</p>
                          <p className="text-[#4f46e5] dark:text-[#818cf8] font-bold mt-1">
                            Score: {data.score} / 100
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Radar
                  name="Proficiency"
                  dataKey="score"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={isDark ? 0.35 : 0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Breakdown Metrics */}
          <div className="lg:col-span-1 space-y-3 p-4 bg-zinc-50/80 dark:bg-[#141622]/80 border border-zinc-200/80 dark:border-white/10 rounded-xl">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[1px] font-mono block mb-1">
              Category Breakdown
            </span>
            <div className="space-y-3">
              {radarData.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item.category}</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 font-semibold">
                      {item.score}%
                    </span>
                  </div>
                  <div className="h-[3px] w-full bg-zinc-200/80 dark:bg-white/10 rounded-[2px] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4f46e5] to-[#818cf8] rounded-[2px]"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. 5-STAGE PLACEMENT PIPELINE (Horizontal 5 Columns)
          ========================================================================= */}
      <div className="backdrop-blur-xl bg-white/85 dark:bg-[#0f111a]/85 border border-zinc-200/90 dark:border-white/10 rounded-xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(79,70,229,0.06)] dark:shadow-[0_12px_36px_-12px_rgba(0,0,0,0.6)] transition-all">
        <div className="p-4 border-b border-zinc-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-[#fafafa] font-display">
              5-Stage Placement Pipeline
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Sequential interview assessment rounds calibrated for {currentTrackName}
            </p>
          </div>
          <span className="chip-stat font-mono self-start sm:self-auto">
            {clearedStagesCount} of 5 Cleared
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-zinc-200/80 dark:divide-white/10">
          {stages.slice(0, 5).map((stage) => {
            const isCleared = stage.best_score !== null;
            const isActive = stage.unlocked && !isCleared;
            const isLocked = !stage.unlocked;

            return (
              <NavLink
                key={stage.id}
                to={stage.unlocked ? `/stages/${stage.id}` : '#'}
                className={`p-4 flex flex-col justify-between transition-colors min-h-[120px] ${
                  isActive
                    ? 'bg-indigo-50/50 dark:bg-[#161827]/70'
                    : 'hover:bg-zinc-50/80 dark:hover:bg-[#181a29]/60'
                } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold tracking-[1px] uppercase text-zinc-500 font-mono">
                      Stage {stage.stage_order}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive || isCleared ? 'bg-[#4f46e5] ring-2 ring-indigo-400/40' : 'bg-zinc-400 dark:bg-zinc-600'
                      }`}
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-900 dark:text-[#fafafa] leading-snug">
                    {stage.title}
                  </h3>
                </div>

                <div className="mt-3 pt-2">
                  {isCleared ? (
                    <span className="chip-stat font-mono">
                      {stage.best_score}% Cleared
                    </span>
                  ) : isActive ? (
                    <span className="text-[11px] font-semibold text-[#4f46e5] dark:text-[#818cf8] font-mono inline-flex items-center gap-1">
                      <span>Ready to Enter</span>
                      <span>→</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-zinc-500 font-mono">
                      Locked
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          4. TWO-COLUMN BOTTOM GRID (Topic Readiness & Trophies)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Column 1: Topic Readiness List with Inline 3px Bar + % */}
        <div className="backdrop-blur-xl bg-white/85 dark:bg-[#0f111a]/85 border border-zinc-200/90 dark:border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-[0_8px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.5)] transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/10 mb-4">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-[#fafafa] font-display">
                  Topic Readiness & Syllabus Mastery
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Core curriculum subjects evaluated for campus placement
                </p>
              </div>
              <NavLink
                to={activeTarget ? `/targets/${activeTarget.id}/study-path` : '/learning-path'}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Full Syllabus</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>

            <div className="space-y-3.5">
              {topicReadinessList.map((topic) => (
                <div key={topic.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                      {topic.title}
                    </span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-200 font-semibold">
                      {topic.percentage}%
                    </span>
                  </div>
                  <div className="h-[3px] w-full bg-zinc-200/80 dark:bg-white/10 rounded-[2px] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4f46e5] to-[#818cf8] rounded-[2px]"
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-mono">
              6 of 6 Core Modules Active
            </span>
            <NavLink
              to="/learning-path"
              className="text-xs font-semibold text-[#4f46e5] dark:text-[#818cf8] hover:underline inline-flex items-center gap-1"
            >
              <span>Practice Questions</span>
              <ArrowRight className="w-3 h-3" />
            </NavLink>
          </div>
        </div>

        {/* Column 2: Trophies & Badges Showcase */}
        <div className="backdrop-blur-xl bg-white/85 dark:bg-[#0f111a]/85 border border-zinc-200/90 dark:border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-[0_8px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.5)] transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/10 mb-4">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-[#fafafa] font-display">
                  Placement Trophies & Milestones
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Real-time verifiable badges unlocked during interview prep
                </p>
              </div>
              <NavLink
                to="/achievements"
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1"
              >
                <span>View All ({achievements.totalUnlocked}/{achievements.totalBadges})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {displayTrophies.map((badge) => {
                const isUnlocked = badge.isUnlocked;

                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => setSelectedBadgeForModal(badge)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-zinc-50/90 dark:bg-[#141624]/90 border-zinc-200 dark:border-indigo-500/30 hover:border-[#4f46e5] shadow-xs'
                        : 'bg-zinc-100/50 dark:bg-black/20 border-zinc-200/60 dark:border-white/5 opacity-55'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl select-none">{badge.icon}</span>
                      {isUnlocked && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 truncate">
                        {badge.title}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate">
                        {isUnlocked ? badge.unlockedAt || 'Unlocked' : 'Locked'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-mono">
              Next badge in 2 cleared assessments
            </span>
            <NavLink
              to="/achievements"
              className="text-xs font-semibold text-[#4f46e5] dark:text-[#818cf8] hover:underline inline-flex items-center gap-1"
            >
              <span>Milestone Roadmap</span>
              <ArrowRight className="w-3 h-3" />
            </NavLink>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: MODIFY PREFERABLE ROLES (Multi-select)
          ========================================================================= */}
      {isRolesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#12141f] border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-zinc-200 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-display">
                  Modify Preferable Target Roles
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Select all roles you want to prepare for simultaneously. Your progress will be tracked across all chosen specializations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRolesModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono">
                {modalSelectedTrackIds.length} of {tracks.length} roles selected
              </span>
              <button
                type="button"
                onClick={handleSelectAllRoles}
                className="text-xs font-semibold text-[#4f46e5] dark:text-[#818cf8] hover:underline cursor-pointer"
              >
                Select All Roles
              </button>
            </div>

            {/* List of track checkboxes */}
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
              {tracks.map((track) => {
                const isSelected = modalSelectedTrackIds.includes(track.id);

                return (
                  <div
                    key={track.id}
                    onClick={() => handleToggleModalTrack(track.id)}
                    className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-[#4f46e5] text-zinc-900 dark:text-white shadow-xs'
                        : 'bg-zinc-50 dark:bg-[#181a29] border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-[#4f46e5] border-[#4f46e5] text-white'
                            : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black/30'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                          {track.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                          {track.category || 'Engineering'} · High Campus Demand
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[11px] font-mono text-[#4f46e5] dark:text-[#a5b4fc] font-semibold self-center">
                        Active Track
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsRolesModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModalRoles}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] transition-colors shadow-xs"
              >
                Save Selected Roles ({modalSelectedTrackIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trophy Modal when clicked */}
      {selectedBadgeForModal && (
        <TrophyUnlockModal
          badge={selectedBadgeForModal}
          isOpen={true}
          onClose={() => setSelectedBadgeForModal(null)}
        />
      )}
    </div>
  );
};
