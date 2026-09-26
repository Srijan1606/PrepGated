// ==============================================================================
// Placement Prep Platform - Motivation & Achievement Engine
// Computes real-time trophies, badges, remaining milestones, and live progress bars.
// ==============================================================================

import { AchievementBadge, PrepStage, TopicProgress, JobTarget, UserProfile } from '../types';

export function calculateAchievements(params: {
  stages: PrepStage[];
  topicProgress: TopicProgress[];
  target: JobTarget | null;
  profile: UserProfile | null;
}): {
  badges: AchievementBadge[];
  totalUnlocked: number;
  totalBadges: number;
  overallProgressPercent: number;
  nextUpcomingBadge: AchievementBadge | null;
} {
  const { stages = [], topicProgress = [], target, profile } = params;

  // Analysis of stages completed (any stage with a best_score recorded)
  const completedStagesCount = stages.filter((s) => s.best_score !== null && s.best_score !== undefined && s.best_score > 0).length;
  const aptitudeStage = stages.find((s) => s.stage_type === 'aptitude');
  const techMcqStage = stages.find((s) => s.stage_type === 'technical_mcq');
  const codingStage = stages.find((s) => s.stage_type === 'coding');
  const techInterviewStage = stages.find((s) => s.stage_type === 'technical_interview');
  const hrInterviewStage = stages.find((s) => s.stage_type === 'hr_interview');

  // Completed curriculum topics
  const completedTopicsCount = topicProgress.filter((t) => t.status === 'completed' || t.mastery_score >= 70).length;
  const totalTopicsTracked = topicProgress.length || 6;

  const readinessScore = target?.readiness_score || 0;
  const streakCount = profile?.streak_count || 1;

  const badgesList: AchievementBadge[] = [
    // 1. Aptitude Round
    {
      id: 'aptitude_ace',
      title: 'Aptitude Ace',
      category: 'stage',
      description: 'Conquer the initial screening round with quantitative and logical precision.',
      tier: 'bronze',
      icon: 'brain',
      requiredCount: 1,
      currentCount: (aptitudeStage?.best_score ?? 0) > 0 ? 1 : 0,
      isUnlocked: (aptitudeStage?.best_score ?? 0) > 0,
      remainingDescription: (aptitudeStage?.best_score ?? 0) > 0 ? 'Completed!' : 'Complete Stage 1: Aptitude MCQ to unlock',
      progressPercent: (aptitudeStage?.best_score ?? 0) > 0 ? 100 : 0,
    },
    // 2. Technical MCQ
    {
      id: 'tech_specialist',
      title: 'Core Tech Specialist',
      category: 'stage',
      description: 'Demonstrate deep conceptual mastery across your role-specific tech topics.',
      tier: 'bronze',
      icon: 'code-xml',
      requiredCount: 1,
      currentCount: (techMcqStage?.best_score ?? 0) > 0 ? 1 : 0,
      isUnlocked: (techMcqStage?.best_score ?? 0) > 0,
      remainingDescription: (techMcqStage?.best_score ?? 0) > 0 ? 'Completed!' : 'Complete Stage 2: Core Technical MCQ to unlock',
      progressPercent: (techMcqStage?.best_score ?? 0) > 0 ? 100 : 0,
    },
    // 3. Coding Problem
    {
      id: 'algorithm_master',
      title: 'Algorithm & Code Architect',
      category: 'stage',
      description: 'Submit an applied technical solution meeting clean architectural standards.',
      tier: 'silver',
      icon: 'terminal',
      requiredCount: 1,
      currentCount: (codingStage?.best_score ?? 0) > 0 ? 1 : 0,
      isUnlocked: (codingStage?.best_score ?? 0) > 0,
      remainingDescription: (codingStage?.best_score ?? 0) > 0 ? 'Completed!' : 'Complete Stage 3: Applied Coding to unlock',
      progressPercent: (codingStage?.best_score ?? 0) > 0 ? 100 : 0,
    },
    // 4. Tech Interview
    {
      id: 'interview_prodigy',
      title: 'Architecture Interview Prodigy',
      category: 'stage',
      description: 'Successfully navigate system design and adaptive deep-dive questions.',
      tier: 'gold',
      icon: 'sparkles',
      requiredCount: 1,
      currentCount: (techInterviewStage?.best_score ?? 0) > 0 ? 1 : 0,
      isUnlocked: (techInterviewStage?.best_score ?? 0) > 0,
      remainingDescription: (techInterviewStage?.best_score ?? 0) > 0 ? 'Completed!' : 'Complete Stage 4: Technical Interview to unlock',
      progressPercent: (techInterviewStage?.best_score ?? 0) > 0 ? 100 : 0,
    },
    // 5. HR Interview
    {
      id: 'executive_presence',
      title: 'Behavioral & Leadership Star',
      category: 'stage',
      description: 'Articulate impactful STAR-structured responses in the culture & HR round.',
      tier: 'gold',
      icon: 'award',
      requiredCount: 1,
      currentCount: (hrInterviewStage?.best_score ?? 0) > 0 ? 1 : 0,
      isUnlocked: (hrInterviewStage?.best_score ?? 0) > 0,
      remainingDescription: (hrInterviewStage?.best_score ?? 0) > 0 ? 'Completed!' : 'Complete Stage 5: HR / Behavioral Interview to unlock',
      progressPercent: (hrInterviewStage?.best_score ?? 0) > 0 ? 100 : 0,
    },
    // 6. Skill: First Concept Conquered
    {
      id: 'first_skill',
      title: 'First Skill Mastered',
      category: 'skill',
      description: 'Complete practice and demonstrate >=70% mastery in your first curriculum topic.',
      tier: 'bronze',
      icon: 'check-circle-2',
      requiredCount: 1,
      currentCount: Math.min(1, completedTopicsCount),
      isUnlocked: completedTopicsCount >= 1,
      remainingDescription: completedTopicsCount >= 1 ? 'Completed!' : 'Master 1 curriculum study topic to unlock',
      progressPercent: completedTopicsCount >= 1 ? 100 : 0,
    },
    // 7. Skill: Triad Specialist (3 skills)
    {
      id: 'skill_triad',
      title: 'Skill Foundation Triad',
      category: 'skill',
      description: 'Master 3 distinct study topics on your career roadmap.',
      tier: 'silver',
      icon: 'layers',
      requiredCount: 3,
      currentCount: Math.min(3, completedTopicsCount),
      isUnlocked: completedTopicsCount >= 3,
      remainingDescription: completedTopicsCount >= 3 ? 'Completed!' : `${Math.max(0, 3 - completedTopicsCount)} more study topic${3 - completedTopicsCount === 1 ? '' : 's'} remaining`,
      progressPercent: Math.min(100, Math.round((completedTopicsCount / 3) * 100)),
    },
    // 8. Skill: Full Domain Grandmaster (All topics)
    {
      id: 'domain_grandmaster',
      title: 'Domain Grandmaster Trophy',
      category: 'skill',
      description: 'Master all recommended curriculum topics for this job track.',
      tier: 'diamond',
      icon: 'trophy',
      requiredCount: totalTopicsTracked,
      currentCount: completedTopicsCount,
      isUnlocked: completedTopicsCount >= totalTopicsTracked && totalTopicsTracked > 0,
      remainingDescription: completedTopicsCount >= totalTopicsTracked
        ? 'Completed!'
        : `${Math.max(0, totalTopicsTracked - completedTopicsCount)} more topic${totalTopicsTracked - completedTopicsCount === 1 ? '' : 's'} remaining to claim trophy`,
      progressPercent: totalTopicsTracked > 0 ? Math.min(100, Math.round((completedTopicsCount / totalTopicsTracked) * 100)) : 0,
    },
    // 9. Readiness Silver (>= 60)
    {
      id: 'readiness_silver',
      title: 'Competitive Benchmark (60+ Readiness)',
      category: 'readiness',
      description: 'Reach an aggregate role readiness score of 60% or higher.',
      tier: 'silver',
      icon: 'gauge',
      requiredCount: 60,
      currentCount: Math.min(60, readinessScore),
      isUnlocked: readinessScore >= 60,
      remainingDescription: readinessScore >= 60 ? 'Completed!' : `${Math.max(0, 60 - readinessScore)}% more readiness score needed`,
      progressPercent: Math.min(100, Math.round((readinessScore / 60) * 100)),
    },
    // 10. Readiness Gold Trophy (>= 85)
    {
      id: 'readiness_gold',
      title: 'Offer-Ready Gold Trophy (85+ Readiness)',
      category: 'readiness',
      description: 'Attain top-tier candidate readiness across all assessment dimensions.',
      tier: 'legendary',
      icon: 'crown',
      requiredCount: 85,
      currentCount: Math.min(85, readinessScore),
      isUnlocked: readinessScore >= 85,
      remainingDescription: readinessScore >= 85 ? 'Completed!' : `${Math.max(0, 85 - readinessScore)}% more readiness needed for Gold Trophy`,
      progressPercent: Math.min(100, Math.round((readinessScore / 85) * 100)),
    },
    // 11. 5-Stage Gated Sweep
    {
      id: 'five_stage_sweep',
      title: 'Grand Slam Placement Sweep',
      category: 'stage',
      description: 'Attempt and complete all 5 gated interview rounds.',
      tier: 'diamond',
      icon: 'shield-check',
      requiredCount: 5,
      currentCount: completedStagesCount,
      isUnlocked: completedStagesCount >= 5,
      remainingDescription: completedStagesCount >= 5 ? 'All 5 rounds completed!' : `${Math.max(0, 5 - completedStagesCount)} more stage${5 - completedStagesCount === 1 ? '' : 's'} remaining`,
      progressPercent: Math.min(100, Math.round((completedStagesCount / 5) * 100)),
    },
    // 12. Streak Champion
    {
      id: 'discipline_streak',
      title: 'Consistent Hustle Badge',
      category: 'streak',
      description: 'Maintain continuous daily placement practice momentum.',
      tier: 'silver',
      icon: 'flame',
      requiredCount: 3,
      currentCount: Math.min(3, streakCount),
      isUnlocked: streakCount >= 3,
      remainingDescription: streakCount >= 3 ? 'Active 3+ day streak!' : `${Math.max(0, 3 - streakCount)} more consecutive active day${3 - streakCount === 1 ? '' : 's'} remaining`,
      progressPercent: Math.min(100, Math.round((streakCount / 3) * 100)),
    },
  ];

  const totalUnlocked = badgesList.filter((b) => b.isUnlocked).length;
  const totalBadges = badgesList.length;
  const overallProgressPercent = Math.round((totalUnlocked / totalBadges) * 100);

  // Find the closest upcoming badge that is not yet unlocked
  const nextUpcomingBadge = badgesList.find((b) => !b.isUnlocked) || null;

  return {
    badges: badgesList,
    totalUnlocked,
    totalBadges,
    overallProgressPercent,
    nextUpcomingBadge,
  };
}
