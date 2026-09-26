// ==============================================================================
// Placement Prep Platform - Real-time Achievements & Trophy Progress Banner (Section 16.5)
// Linear/Raycast dark theme: Zinc-900 surface, Indigo-500 brand, real-time progress bar.
// ==============================================================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useJobTargets } from '../context/JobTargetsContext';
import { Trophy, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import { BadgeTier } from '../types';

const tierColors: Record<BadgeTier, { bg: string; border: string; text: string }> = {
  bronze: { bg: 'bg-amber-950/30', border: 'border-amber-700/50', text: 'text-amber-300' },
  silver: { bg: 'bg-zinc-800/60', border: 'border-zinc-600/50', text: 'text-zinc-200' },
  gold: { bg: 'bg-yellow-950/40', border: 'border-yellow-600/50', text: 'text-yellow-300' },
  diamond: { bg: 'bg-cyan-950/40', border: 'border-cyan-500/50', text: 'text-cyan-300' },
  legendary: { bg: 'bg-purple-950/40', border: 'border-purple-600/50', text: 'text-purple-300' },
};

export const AchievementsBanner: React.FC = () => {
  const { achievements } = useJobTargets();
  const { badges, totalUnlocked, totalBadges, overallProgressPercent, nextUpcomingBadge } = achievements;

  const highlightBadges = badges.slice(0, 4);

  return (
    <div className="card-premium card-score-glow p-5 space-y-4">
      {/* Header with Live Status & Next Milestone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-zinc-100">
                Placement Trophies & Badges of Honour
              </h2>
              <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60 tabular-nums">
                {totalUnlocked}/{totalBadges} Unlocked
              </span>
            </div>
            {nextUpcomingBadge ? (
              <p className="text-xs text-zinc-400 mt-0.5">
                <span className="text-amber-400 font-semibold">Next Milestone:</span>{' '}
                {nextUpcomingBadge.title} · <span className="text-indigo-300 font-medium">{nextUpcomingBadge.remainingDescription}</span>
              </p>
            ) : (
              <p className="text-xs text-emerald-400 mt-0.5 font-medium">
                ★ All placement milestones unlocked! Ready for Tier-1 placements.
              </p>
            )}
          </div>
        </div>

        <NavLink
          to="/achievements"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors py-1 px-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>Trophy Showcase</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* Global Real-time Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-zinc-400">Total Placement Journey Mastery</span>
          <span className="font-bold text-indigo-400 tabular-nums">{overallProgressPercent}% Complete</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-950 border border-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${overallProgressPercent}%` }}
          />
        </div>
      </div>

      {/* 4 Representative Badge Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {highlightBadges.map((badge) => {
          const tColor = tierColors[badge.tier];
          return (
            <div
              key={badge.id}
              className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs transition-all ${
                badge.isUnlocked
                  ? `${tColor.bg} ${tColor.border} text-zinc-200`
                  : 'border-zinc-800 bg-zinc-950/70 text-zinc-500'
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-sm">
                {badge.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate font-semibold tracking-tight text-zinc-200">{badge.title}</p>
                  {badge.isUnlocked ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="h-3 w-3 text-zinc-600 shrink-0" />
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>{badge.isUnlocked ? 'Unlocked' : `${badge.currentCount}/${badge.requiredCount}`}</span>
                  <span>{badge.progressPercent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
