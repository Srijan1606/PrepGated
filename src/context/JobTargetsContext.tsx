// ==============================================================================
// PrepGated - Job Targets & Progression Context
// Stores target jobs, multi-role preference tracking, 5-stage pipelines, and trophies.
// ==============================================================================

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { supabase, isRealSupabaseConfigured, SEED_JOB_TRACKS } from '../lib/supabase';
import { invokeAiAction } from '../lib/edgeApi';
import { calculateAchievements } from '../lib/achievements';
import { JobTarget, PrepStage, TopicProgress, CurriculumTopic, JobTrack, AchievementBadge } from '../types';
import confetti from 'canvas-confetti';

interface JobTargetsContextType {
  targets: JobTarget[];
  activeTarget: JobTarget | null;
  stages: PrepStage[];
  tracks: JobTrack[];
  topicProgress: TopicProgress[];
  curriculumTopics: CurriculumTopic[];
  loading: boolean;
  peerPercentile: number;
  // Multi-role selection support
  preferredTrackIds: string[];
  selectedTracks: JobTrack[];
  togglePreferredRole: (trackId: string) => Promise<void>;
  setPreferredRoles: (trackIds: string[]) => Promise<void>;
  addPreferredRoles: (trackIds: string[]) => Promise<void>;
  removePreferredRole: (trackId: string) => Promise<void>;
  // Adaptive Learning & Notifications (Section 18.2)
  notifications: Array<{ id: string; type: string; title: string; body: string; read: boolean; created_at: string; link?: string }>;
  markNotificationRead: (id: string) => void;
  learningQueue: Array<{ id: string; topic_id: string; topic_name: string; priority_score: number; reason: string; due_date: string }>;
  logWeakSignal: (topicId: string, topicName: string, subTopic: string, suggestedResource: { label: string; url: string }) => void;
  // Existing methods
  achievements: {
    badges: AchievementBadge[];
    totalUnlocked: number;
    totalBadges: number;
    overallProgressPercent: number;
    nextUpcomingBadge: AchievementBadge | null;
  };
  setActiveTargetId: (id: string) => void;
  createTarget: (trackId: string, company?: string) => Promise<JobTarget>;
  reloadTargetData: () => Promise<void>;
  updateStageBestScore: (stageId: string, score: number) => void;
  markTopicPracticed: (topicId: string, status?: 'completed' | 'in_progress' | 'needs_review', score?: number) => void;
  triggerConfetti: () => void;
}

const JobTargetsContext = createContext<JobTargetsContextType | undefined>(undefined);

const PREF_ROLES_KEY = 'prepgated_preferred_roles';

export const JobTargetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [tracks, setTracks] = useState<JobTrack[]>(SEED_JOB_TRACKS);
  const [targets, setTargets] = useState<JobTarget[]>([]);
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
  const [stages, setStages] = useState<PrepStage[]>([]);
  const [curriculumTopics, setCurriculumTopics] = useState<CurriculumTopic[]>([]);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [peerPercentile, setPeerPercentile] = useState<number>(78);
  const [loading, setLoading] = useState(true);

  // Notifications (Section 18.2)
  const [notifications, setNotifications] = useState<Array<{ id: string; type: string; title: string; body: string; read: boolean; created_at: string; link?: string }>>([
    {
      id: 'notif-1',
      type: 'streak_reminder',
      title: 'Active Daily Streak!',
      body: 'You have a 1-day practice streak active. Practice today to maintain momentum.',
      read: false,
      link: '/dashboard',
      created_at: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      type: 'stage_unlocked',
      title: 'New Stage Ready',
      body: 'Stage 1 Aptitude & Logical Reasoning is unlocked and ready for evaluation.',
      read: false,
      link: '/dashboard',
      created_at: new Date().toISOString(),
    },
  ]);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Adaptive Learning Queue (Section 18.2 & 19.8)
  const [learningQueue, setLearningQueue] = useState<Array<{ id: string; topic_id: string; topic_name: string; priority_score: number; reason: string; due_date: string }>>([
    { id: 'lq-1', topic_id: 'top-1', topic_name: 'Python Data Structures', priority_score: 1.0, reason: 'weak_stage', due_date: 'Today' },
    { id: 'lq-2', topic_id: 'top-2', topic_name: 'SQL JOIN Types', priority_score: 0.7, reason: 'weak_assignment', due_date: 'Tomorrow' },
    { id: 'lq-3', topic_id: 'top-3', topic_name: 'Central Limit Theorem', priority_score: 0.5, reason: 'scheduled_review', due_date: 'In 2 days' },
  ]);

  const logWeakSignal = (topicId: string, topicName: string, subTopic: string, suggestedResource: { label: string; url: string }) => {
    // Bump to top of learning queue
    setLearningQueue((prev) => [
      {
        id: `lq-${Date.now()}`,
        topic_id: topicId,
        topic_name: `${topicName} (${subTopic})`,
        priority_score: 1.0,
        reason: 'weak_stage',
        due_date: 'Today (Priority)',
      },
      ...prev.filter((i) => i.topic_id !== topicId),
    ]);

    // Push notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'topic_due',
        title: `Weak area detected: ${subTopic}`,
        body: `You struggled with ${subTopic}. Review it before your next attempt.`,
        read: false,
        link: '/targets/study-path',
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Multi-role track IDs
  const [preferredTrackIds, setPreferredTrackIdsState] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(PREF_ROLES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed parsing preferred roles from localStorage', e);
    }
    // Default initial multiple roles
    return [SEED_JOB_TRACKS[0].id, SEED_JOB_TRACKS[1].id];
  });

  const savePreferredTrackIds = (ids: string[]) => {
    setPreferredTrackIdsState(ids);
    try {
      localStorage.setItem(PREF_ROLES_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn('Failed saving preferred roles', e);
    }
  };

  const selectedTracks = useMemo(() => {
    return tracks.filter((t) => preferredTrackIds.includes(t.id));
  }, [tracks, preferredTrackIds]);

  const activeTarget = useMemo(() => {
    return targets.find((t) => t.id === activeTargetId) || targets[0] || null;
  }, [targets, activeTargetId]);

  // Real-time achievements and progress calculation
  const achievements = useMemo(() => {
    return calculateAchievements({
      stages,
      topicProgress,
      target: activeTarget,
      profile,
    });
  }, [stages, topicProgress, activeTarget, profile]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'],
      });
    } catch {
      // Safe fallback
    }
  };

  // Check for newly unlocked badges to celebrate
  const [prevUnlockedCount, setPrevUnlockedCount] = useState<number>(0);
  useEffect(() => {
    if (prevUnlockedCount > 0 && achievements.totalUnlocked > prevUnlockedCount) {
      triggerConfetti();
    }
    setPrevUnlockedCount(achievements.totalUnlocked);
  }, [achievements.totalUnlocked]);

  // Load initial catalog tracks
  useEffect(() => {
    const loadTracks = async () => {
      if (isRealSupabaseConfigured) {
        const { data } = await supabase.from('job_tracks').select('*');
        if (data && data.length > 0) {
          setTracks(data);
          return;
        }
      }
      setTracks(SEED_JOB_TRACKS);
    };
    loadTracks();
  }, []);

  // Helper to generate default target with stages
  const buildInitialTargetForTrack = (track: JobTrack, readiness = 60): { target: JobTarget; stages: PrepStage[] } => {
    const targetId = `target-${track.id}`;
    const target: JobTarget = {
      id: targetId,
      user_id: user?.id || 'preview-user-id',
      job_track_id: track.id,
      company: 'Tier-1 Tech Placement',
      readiness_score: readiness,
      created_at: new Date().toISOString(),
      job_track: track,
    };

    const stgs: PrepStage[] = [
      { id: `stg-${track.id}-1`, job_target_id: targetId, stage_order: 1, stage_type: 'aptitude', title: 'Aptitude & Logical Reasoning', unlocked: true, best_score: readiness > 65 ? 85 : 75, created_at: new Date().toISOString() },
      { id: `stg-${track.id}-2`, job_target_id: targetId, stage_order: 2, stage_type: 'technical_mcq', title: 'Verbal & Communication', unlocked: true, best_score: readiness > 65 ? 80 : 70, created_at: new Date().toISOString() },
      { id: `stg-${track.id}-3`, job_target_id: targetId, stage_order: 3, stage_type: 'technical_mcq', title: 'Technical Knowledge', unlocked: true, best_score: readiness > 75 ? 78 : null, created_at: new Date().toISOString() },
      { id: `stg-${track.id}-4`, job_target_id: targetId, stage_order: 4, stage_type: 'coding', title: 'Coding Challenge', unlocked: readiness > 65, best_score: null, created_at: new Date().toISOString() },
      { id: `stg-${track.id}-5`, job_target_id: targetId, stage_order: 5, stage_type: 'hr_interview', title: 'HR & Behavioural', unlocked: false, best_score: null, created_at: new Date().toISOString() },
    ];

    return { target, stages: stgs };
  };

  // Load targets for the current user
  const loadTargets = async () => {
    setLoading(true);
    try {
      if (isRealSupabaseConfigured && user) {
        const { data: targetsData, error } = await supabase
          .from('job_targets')
          .select('*, job_tracks(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && targetsData && targetsData.length > 0) {
          const formatted: JobTarget[] = targetsData.map((td: any) => ({
            ...td,
            job_track: td.job_tracks,
          }));
          setTargets(formatted);
          if (!activeTargetId) {
            setActiveTargetId(formatted[0].id);
          }
          // Sync preferred track IDs
          const trackIdsFromTargets = Array.from(new Set(formatted.map(t => t.job_track_id)));
          if (trackIdsFromTargets.length > 0) {
            savePreferredTrackIds(trackIdsFromTargets);
          }
          setLoading(false);
          return;
        }
      }

      // Populate targets for all preferred tracks
      const initialTargets: JobTarget[] = [];
      const allStages: PrepStage[] = [];

      preferredTrackIds.forEach((trackId, idx) => {
        const track = tracks.find((t) => t.id === trackId) || SEED_JOB_TRACKS[0];
        const readiness = idx === 0 ? 68 : idx === 1 ? 58 : 50;
        const { target, stages: tStages } = buildInitialTargetForTrack(track, readiness);
        initialTargets.push(target);
        if (idx === 0) {
          allStages.push(...tStages);
        }
      });

      if (initialTargets.length === 0 && SEED_JOB_TRACKS.length > 0) {
        const { target, stages: tStages } = buildInitialTargetForTrack(SEED_JOB_TRACKS[0], 65);
        initialTargets.push(target);
        allStages.push(...tStages);
      }

      setTargets(initialTargets);
      setActiveTargetId(initialTargets[0]?.id || null);
      setStages(allStages);
    } catch (err) {
      console.error('[JobTargets] Error loading targets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load stages and curriculum for the active target
  const loadTargetDetails = async (target: JobTarget) => {
    try {
      if (isRealSupabaseConfigured) {
        const { data: stData } = await supabase
          .from('prep_stages')
          .select('*')
          .eq('job_target_id', target.id)
          .order('stage_order', { ascending: true });

        if (stData && stData.length > 0) {
          setStages(stData);
        }

        const { data: currData } = await supabase
          .from('curriculum_topics')
          .select('*')
          .eq('job_track_id', target.job_track_id)
          .order('topic_order', { ascending: true });

        if (currData && currData.length > 0) {
          setCurriculumTopics(currData);
        }

        if (user) {
          const { data: progData } = await supabase
            .from('topic_progress')
            .select('*, curriculum_topics(*)')
            .eq('user_id', user.id);

          if (progData) {
            setTopicProgress(progData);
          }
        }

        const { data: pct } = await supabase.rpc('get_track_percentile', {
          p_job_track_id: target.job_track_id,
          p_score: target.readiness_score || 0,
        });
        if (pct !== null && pct !== undefined) {
          setPeerPercentile(Number(pct));
        }
      } else {
        // Fallback preview stages if not loaded
        const track = target.job_track || tracks.find((t) => t.id === target.job_track_id) || SEED_JOB_TRACKS[0];
        const { stages: builtStages } = buildInitialTargetForTrack(track, target.readiness_score || 60);
        setStages(builtStages);

        const currResp = await invokeAiAction<{ topics: CurriculumTopic[] }>('generate_curriculum', {
          job_track_id: target.job_track_id,
        });
        if (currResp?.topics) {
          setCurriculumTopics(currResp.topics);
          const previewProgress: TopicProgress[] = currResp.topics.map((t, idx) => ({
            id: `tp-${t.id}`,
            user_id: 'preview-user-id',
            topic_id: t.id,
            status: idx === 0 ? 'completed' : idx === 1 ? 'in_progress' : idx === 2 ? 'needs_review' : 'not_started',
            mastery_score: idx === 0 ? 85 : idx === 1 ? 55 : idx === 2 ? 40 : 0,
            last_practiced_at: idx < 2 ? new Date().toISOString() : null,
            curriculum_topics: t,
          }));
          setTopicProgress(previewProgress);
        }
      }
    } catch (err) {
      console.warn('[JobTargets] Detail load error:', err);
    }
  };

  useEffect(() => {
    loadTargets();
  }, [user?.id]);

  useEffect(() => {
    if (activeTarget) {
      loadTargetDetails(activeTarget);
    }
  }, [activeTarget?.id]);

  const createTarget = async (trackId: string, company?: string): Promise<JobTarget> => {
    const res = await invokeAiAction<{ target: JobTarget; stages: PrepStage[] }>('create_job_target', {
      job_track_id: trackId,
      company: company || 'Tier-1 Tech Candidate',
    });

    if (res && res.target) {
      const trackObj = tracks.find((t) => t.id === trackId);
      const newTarget: JobTarget = {
        ...res.target,
        job_track: trackObj,
      };

      setTargets((prev) => [newTarget, ...prev.filter((t) => t.id !== newTarget.id)]);
      setActiveTargetId(newTarget.id);
      if (res.stages) {
        setStages(res.stages);
      }

      // Add to preferred roles if not already present
      if (!preferredTrackIds.includes(trackId)) {
        savePreferredTrackIds([...preferredTrackIds, trackId]);
      }

      return newTarget;
    }

    // Fallback client creation
    const track = tracks.find((t) => t.id === trackId) || SEED_JOB_TRACKS[0];
    const { target: fallbackTarget, stages: fallbackStages } = buildInitialTargetForTrack(track, 50);
    fallbackTarget.company = company || 'Target Tech Company';
    
    setTargets((prev) => [fallbackTarget, ...prev.filter((t) => t.id !== fallbackTarget.id)]);
    setActiveTargetId(fallbackTarget.id);
    setStages(fallbackStages);
    
    if (!preferredTrackIds.includes(trackId)) {
      savePreferredTrackIds([...preferredTrackIds, trackId]);
    }
    return fallbackTarget;
  };

  // Toggle preferred role (add or remove)
  const togglePreferredRole = async (trackId: string) => {
    if (preferredTrackIds.includes(trackId)) {
      if (preferredTrackIds.length <= 1) {
        // Keep at least one role
        return;
      }
      await removePreferredRole(trackId);
    } else {
      await addPreferredRoles([trackId]);
    }
  };

  // Add multiple preferred roles at once
  const addPreferredRoles = async (trackIds: string[]) => {
    const newIds = Array.from(new Set([...preferredTrackIds, ...trackIds]));
    savePreferredTrackIds(newIds);

    // Create targets for any new tracks that don't have a target yet
    for (const tid of trackIds) {
      const existing = targets.find((t) => t.job_track_id === tid);
      if (!existing) {
        const track = tracks.find((t) => t.id === tid);
        if (track) {
          const { target } = buildInitialTargetForTrack(track, 55);
          setTargets((prev) => [...prev, target]);
        }
      }
    }
  };

  // Set exact list of preferred roles (multi-select replacement)
  const setPreferredRoles = async (trackIds: string[]) => {
    if (trackIds.length === 0) return;
    savePreferredTrackIds(trackIds);

    // Filter or create targets
    const updatedTargets = [...targets];
    for (const tid of trackIds) {
      if (!updatedTargets.some((t) => t.job_track_id === tid)) {
        const track = tracks.find((t) => t.id === tid);
        if (track) {
          const { target } = buildInitialTargetForTrack(track, 55);
          updatedTargets.push(target);
        }
      }
    }
    setTargets(updatedTargets);

    // If activeTarget is no longer in preferred list, point to first selected
    if (activeTarget && !trackIds.includes(activeTarget.job_track_id)) {
      const firstTarget = updatedTargets.find((t) => trackIds.includes(t.job_track_id));
      if (firstTarget) {
        setActiveTargetId(firstTarget.id);
      }
    }
  };

  // Remove single preferred role
  const removePreferredRole = async (trackId: string) => {
    const updatedIds = preferredTrackIds.filter((id) => id !== trackId);
    if (updatedIds.length === 0) return; // Prevent 0 roles
    savePreferredTrackIds(updatedIds);

    const remainingTargets = targets.filter((t) => t.job_track_id !== trackId);
    setTargets(remainingTargets);

    if (activeTarget?.job_track_id === trackId && remainingTargets.length > 0) {
      setActiveTargetId(remainingTargets[0].id);
    }
  };

  const reloadTargetData = async () => {
    await loadTargets();
    if (activeTarget) {
      await loadTargetDetails(activeTarget);
    }
  };

  const updateStageBestScore = (stageId: string, score: number) => {
    setStages((prev) =>
      prev.map((s) => {
        if (s.id === stageId) {
          return {
            ...s,
            best_score: Math.max(score, s.best_score || 0),
          };
        }
        return s;
      })
    );
  };

  const markTopicPracticed = (
    topicId: string,
    status: 'completed' | 'in_progress' | 'needs_review' = 'completed',
    score: number = 85
  ) => {
    setTopicProgress((prev) => {
      const exists = prev.find((p) => p.topic_id === topicId);
      if (exists) {
        return prev.map((p) =>
          p.topic_id === topicId
            ? {
                ...p,
                status,
                mastery_score: Math.max(score, p.mastery_score),
                last_practiced_at: new Date().toISOString(),
              }
            : p
        );
      }
      return [
        ...prev,
        {
          id: `tp-new-${Date.now()}`,
          user_id: user?.id || 'preview-user-id',
          topic_id: topicId,
          status,
          mastery_score: score,
          last_practiced_at: new Date().toISOString(),
        },
      ];
    });
  };

  return (
    <JobTargetsContext.Provider
      value={{
        targets,
        activeTarget,
        stages,
        tracks,
        topicProgress,
        curriculumTopics,
        loading,
        peerPercentile,
        preferredTrackIds,
        selectedTracks,
        togglePreferredRole,
        setPreferredRoles,
        addPreferredRoles,
        removePreferredRole,
        notifications,
        markNotificationRead,
        learningQueue,
        logWeakSignal,
        achievements,
        setActiveTargetId,
        createTarget,
        reloadTargetData,
        updateStageBestScore,
        markTopicPracticed,
        triggerConfetti,
      }}
    >
      {children}
    </JobTargetsContext.Provider>
  );
};

export const useJobTargets = () => {
  const ctx = useContext(JobTargetsContext);
  if (!ctx) throw new Error('useJobTargets must be used within JobTargetsProvider');
  return ctx;
};
