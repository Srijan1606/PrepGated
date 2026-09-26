// ==============================================================================
// PrepGated - Achievements & Trophies View
// - Displays all unlockable trophies, stage gates, and skill milestones
// - Full Light & Dark mode support
// ==============================================================================

import React, { useState } from 'react';
import { useJobTargets } from '../context/JobTargetsContext';
import { AchievementBadge } from '../types';
import { TrophyUnlockModal } from '../components/TrophyUnlockModal';
import {
  Trophy,
  CheckCircle2,
  Lock,
  Flame,
  Award,
  Zap,
  Target,
  Code2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const badgeIcons: Record<string, React.FC<{ className?: string }>> = {
  trophy: Trophy,
  flame: Flame,
  award: Award,
  zap: Zap,
  target: Target,
  code: Code2,
  sparkles: Sparkles,
  book: BookOpen,
};

export const AchievementsView: React.FC = () => {
  const { achievements } = useJobTargets();
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'stage' | 'skill' | 'readiness'>('all');

  const totalBadges = achievements.totalBadges;
  const totalUnlocked = achievements.totalUnlocked;
  const overallProgressPercent = achievements.overallProgressPercent;
  const nextUpcomingBadge = achievements.nextUpcomingBadge;

  const filteredBadges = achievements.badges.filter((badge: AchievementBadge) => {
    if (activeFilter === 'all') return true;
    return badge.category === activeFilter;
  });

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 font-mono block">
          Achievements & Badges
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-display mt-0.5">
          Placement Readiness Trophy Cabinet
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Unlock badges as you complete stages, master core topics, and maintain your practice streaks.
        </p>
      </div>

      {/* Progress Overview Card */}
      <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                  {totalUnlocked} of {totalBadges} Badges Claimed
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
                  {overallProgressPercent}% Complete
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {nextUpcomingBadge
                  ? `Next Target: ${nextUpcomingBadge.title} (${nextUpcomingBadge.progressPercent}% progress)`
                  : 'All current placement badges successfully achieved!'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-xs">
        {(
          [
            { id: 'all', label: 'All Trophies' },
            { id: 'stage', label: 'Stage Gates' },
            { id: 'skill', label: 'Technical Mastery' },
            { id: 'readiness', label: 'Milestones & Streaks' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.isUnlocked;
          const IconComponent = badgeIcons[badge.icon] || Trophy;

          return (
            <button
              key={badge.id}
              type="button"
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer shadow-sm ${
                isUnlocked
                  ? 'bg-white dark:bg-[#11131a] border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/60'
                  : 'bg-zinc-50/60 dark:bg-[#11131a]/60 border-zinc-200 dark:border-zinc-800/80 opacity-75 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isUnlocked
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400'
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {isUnlocked ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>{badge.progressPercent}%</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                  {badge.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mb-1">
                  <span>Requirement</span>
                  <span>{badge.progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${badge.progressPercent}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Trophy Unlock Modal */}
      <TrophyUnlockModal
        badge={selectedBadge}
        isOpen={Boolean(selectedBadge)}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
};
