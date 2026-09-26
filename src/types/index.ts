// ==============================================================================
// Placement Prep Platform - Comprehensive TypeScript Type Definitions
// ==============================================================================

export type StageType = 'aptitude' | 'technical_mcq' | 'coding' | 'technical_interview' | 'hr_interview';

export type QuestionType = 'mcq' | 'coding' | 'open_ended';

export type ApplicationStatus = 'Applying' | 'Interviewing' | 'Offer' | 'Rejected';

export type TopicStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_review';

export type UserRole = 'candidate' | 'employer';

export interface UserProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  degree: string | null;
  location: string | null;
  resume_snapshot: string | null;
  benchmark_opt_in: boolean;
  streak_count: number;
  last_active_date: string | null;
  user_role?: UserRole;
  created_at: string;
  updated_at: string;
}

// ------------------------------------------------------------------------------
// Employer Portal & Dual Mode Types (Section 18.1 & 18.4)
// ------------------------------------------------------------------------------
export interface EmployerJobRole {
  id: string;
  employer_id: string;
  company_name: string;
  job_title: string;
  track_id: string;
  track_name: string;
  required_stages: number[];
  min_readiness_score: number;
  salary_range: string;
  location: string;
  created_at: string;
  applicants_count: number;
}

export interface CandidateReadinessProfile {
  id: string;
  candidate_ref: string; // Anonymous ID e.g. "Candidate #4812"
  track_id: string;
  track_name: string;
  overall_score: number;
  percentile: number;
  stages_cleared: number;
  per_stage_breakdown: Record<string, number>;
  completion_date: string;
  profile_unlocked: boolean;
  role_fit_score: number; // Computed fit score against role (Section 18.4)
  candidate_name?: string; // Revealed only if profile_unlocked is true
  candidate_email?: string; // Revealed only if profile_unlocked is true
}

// ------------------------------------------------------------------------------
// Skill Map, Tier & Level Testing Types (Section 19.3 & 19.4)
// ------------------------------------------------------------------------------
export type SkillTier = 'Foundation' | 'Core' | 'Advanced';
export type SkillTestLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface SkillNode {
  id: string;
  track_id: string;
  skill_name: string;
  tier: SkillTier;
  resource_url: string;
  resource_label: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'needs_review';
  level_achieved: SkillTestLevel | null;
  order: number;
}

export interface WeakSignal {
  id: string;
  user_id: string;
  skill_node_id: string;
  skill_name: string;
  sub_topic: string;
  question_id: string;
  suggested_resource: { label: string; url: string };
  detected_at: string;
}

export interface LearningQueueItem {
  id: string;
  user_id: string;
  topic_id: string;
  topic_name: string;
  priority_score: number; // 1.0 (failed stage), 0.7 (weak assignment), 0.5 (spaced repetition), 0.4 (unseen)
  reason: 'weak_stage' | 'weak_assignment' | 'scheduled_review' | 'new_topic';
  due_date: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: 'streak_reminder' | 'topic_due' | 'stage_unlocked' | 'employer_view' | 'score_milestone';
  title: string;
  body: string;
  read: boolean;
  link?: string;
  created_at: string;
}

export interface JobTrack {
  id: string;
  name: string;
  description: string;
  core_topics: string[];
  category?: 'standard' | 'booming';
  salary_range?: string;
  demand_trend?: 'Rising' | 'Stable';
  estimated_time?: string;
}

export interface JobTarget {
  id: string;
  user_id: string;
  job_track_id: string;
  company: string | null;
  readiness_score: number;
  created_at: string;
  job_track?: JobTrack;
}

export interface PrepStage {
  id: string;
  job_target_id: string;
  stage_order: number;
  stage_type: StageType;
  title: string;
  unlocked: boolean;
  best_score: number | null;
  created_at: string;
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface StageQuestion {
  id: string;
  stage_id: string;
  question_order: number;
  question_type: QuestionType;
  prompt: string;
  options: MCQOption[] | null;
  // NOTE: correct_answer is stripped before reaching client in production
  correct_answer?: string;
}

export interface SubmittedAnswer {
  question_id: string;
  question_order: number;
  selected_option_id?: string;
  solution?: string;
  text_answer?: string;
}

export interface StageAttempt {
  id: string;
  user_id: string;
  stage_id: string;
  answers: SubmittedAnswer[];
  score: number;
  max_score: number;
  feedback: {
    score_percentage?: number;
    correct_count?: number;
    total_questions?: number;
    breakdowns?: Array<{
      question_order: number;
      prompt: string;
      submitted: string;
      correct_answer?: string;
      is_correct: boolean;
    }>;
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string;
    model_answer?: string | null;
  } | null;
  created_at: string;
}

export interface ApplicationRecord {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  feedback: string | null;
  applied_date: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'model';
  content: string;
  created_at: string;
}

export interface CurriculumTopic {
  id: string;
  job_track_id: string;
  topic_order: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface TopicProgress {
  id: string;
  user_id: string;
  topic_id: string;
  status: TopicStatus;
  mastery_score: number;
  last_practiced_at: string | null;
  curriculum_topics?: CurriculumTopic;
}

export interface Assignment {
  id: string;
  user_id: string;
  job_track_id: string;
  target_topics: string[];
  status: 'pending' | 'completed';
  score: number | null;
  feedback: Record<string, any> | null;
  created_at: string;
}

export interface AssignmentQuestion {
  id: string;
  assignment_id: string;
  question_order: number;
  topic: string;
  prompt: string;
  options: MCQOption[] | null;
  correct_answer?: string;
}

// Trophy & Achievement Badge Interfaces
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'legendary';

export interface AchievementBadge {
  id: string;
  title: string;
  category: 'stage' | 'skill' | 'streak' | 'readiness';
  description: string;
  tier: BadgeTier;
  icon: string;
  requiredCount: number;
  currentCount: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  remainingDescription: string;
  progressPercent: number;
}
