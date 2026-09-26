-- ==============================================================================
-- Placement Prep Platform - Initial Database Migration
-- Includes RLS on every table, service-role only tables for answer keys,
-- seed data for 9 core tech job tracks, curriculum tables, and peer benchmark function.
-- ==============================================================================

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  degree text,
  location text,
  resume_snapshot text,
  benchmark_opt_in boolean default true,
  streak_count int default 0,
  last_active_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);

-- 2. Job Tracks Catalog
create table if not exists public.job_tracks (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  core_topics text[]
);

alter table public.job_tracks enable row level security;
create policy "job tracks public read" on public.job_tracks for select using (true);

-- Seed data for all 9 tech job tracks with domain-specific core topics
insert into public.job_tracks (name, description, core_topics) values
  ('SDE / Backend Engineer', 'Specializes in distributed systems, API architecture, data structures, algorithms, and concurrency.', ARRAY['Data Structures & Algorithms', 'System Design & Scalability', 'Databases & Indexing', 'Concurrency & Multithreading', 'REST & gRPC APIs']),
  ('Frontend Engineer', 'Master of browser rendering, modern JavaScript/TypeScript, reactive UI architectures, CSS layout engines, and web performance.', ARRAY['DOM & Browser Internals', 'React Architecture & State', 'CSS Grid & Responsive Systems', 'Web Performance & Core Web Vitals', 'Accessibility (a11y) & WCAG']),
  ('Full-Stack Developer', 'Bridges client and server, crafting end-to-end applications from database models to responsive web experiences.', ARRAY['Full-Stack System Architecture', 'API Design & Integration', 'State Management & Async Flows', 'Authentication & Web Security', 'Relational & NoSQL Databases']),
  ('Data Analyst', 'Extracts strategic insights from raw data using SQL, statistical modeling, analytical dashboards, and business acumen.', ARRAY['Advanced SQL & Aggregations', 'Descriptive & Inferential Statistics', 'Business Intelligence & Dashboards', 'Data Wrangling & Cleaning', 'A/B Testing & Metric Design']),
  ('Data Scientist / ML Engineer', 'Designs predictive models, statistical frameworks, training pipelines, and production inference systems.', ARRAY['Supervised & Unsupervised Learning', 'Feature Engineering & Cross-Validation', 'Deep Learning Architectures', 'Model Evaluation & Loss Metrics', 'MLOps & Pipeline Deployment']),
  ('AI Engineer', 'Integrates large language models, agent workflows, vector embeddings, retrieval-augmented generation (RAG), and generative APIs.', ARRAY['LLM Architectures & Transformers', 'Prompt Engineering & Structured Outputs', 'Vector Embeddings & RAG Systems', 'Agentic Workflows & Tool Calling', 'Evaluation & Guardrails']),
  ('DevOps / Cloud Engineer', 'Architects reliable cloud infrastructure, CI/CD pipelines, container orchestration, monitoring, and infrastructure-as-code.', ARRAY['Docker & Containerization', 'Kubernetes Orchestration', 'CI/CD Pipeline Automation', 'Cloud Networking & VPCs', 'Observability, Logging & SRE']),
  ('QA / SDET', 'Ensures software resilience through automated end-to-end testing, performance profiling, test harnesses, and quality metrics.', ARRAY['Test Automation Frameworks', 'Integration & API Testing', 'Performance & Load Testing', 'Edge-Case Synthesis', 'Continuous Testing in CI/CD']),
  ('Product / Business Analyst', 'Translates business strategy into technical product specifications, user journeys, KPI trees, and feature roadmaps.', ARRAY['Requirements Synthesis & User Stories', 'KPI Hierarchy & North Star Metrics', 'Product Discovery & Prioritization', 'Stakeholder & Communication Strategy', 'Data-Driven Decision Making'])
on conflict (name) do update set
  description = excluded.description,
  core_topics = excluded.core_topics;

-- 3. Job Targets
create table if not exists public.job_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_track_id uuid references public.job_tracks(id) not null,
  company text,
  readiness_score numeric default 0,
  created_at timestamptz default now()
);

alter table public.job_targets enable row level security;
create policy "own job targets all" on public.job_targets for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. Prep Stages (5 gated stages per target)
create table if not exists public.prep_stages (
  id uuid primary key default gen_random_uuid(),
  job_target_id uuid references public.job_targets(id) on delete cascade not null,
  stage_order int not null check (stage_order between 1 and 5),
  stage_type text check (stage_type in ('aptitude','technical_mcq','coding','technical_interview','hr_interview')) not null,
  title text not null,
  unlocked boolean default false,
  best_score numeric,
  created_at timestamptz default now(),
  unique (job_target_id, stage_order)
);

alter table public.prep_stages enable row level security;
create policy "own stages via job_target" on public.prep_stages for all
  using (exists (select 1 from public.job_targets jt where jt.id = job_target_id and jt.user_id = auth.uid()))
  with check (exists (select 1 from public.job_targets jt where jt.id = job_target_id and jt.user_id = auth.uid()));

-- 5. Stage Questions (SENSITIVE - NO client policy for authenticated users)
-- Only accessed via Edge Function with service_role key to prevent client-side answer key inspection
create table if not exists public.stage_questions (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid references public.prep_stages(id) on delete cascade not null,
  question_order int not null,
  question_type text check (question_type in ('mcq','coding','open_ended')) not null,
  prompt text not null,
  options jsonb,        -- MCQ options: [{id, text}]
  correct_answer text,  -- MCQ correct option id, or grading rubric for coding/open_ended - SENSITIVE
  created_at timestamptz default now()
);

alter table public.stage_questions enable row level security;
-- DELIBERATELY NO select/insert/update/delete policy for authenticated role!

-- 6. Stage Attempts
create table if not exists public.stage_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  stage_id uuid references public.prep_stages(id) on delete cascade not null,
  answers jsonb not null,
  score numeric not null,
  max_score numeric not null,
  feedback jsonb,
  created_at timestamptz default now()
);

alter table public.stage_attempts enable row level security;
create policy "own attempts all" on public.stage_attempts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 7. Applications Tracker
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  company text not null,
  role text not null,
  status text check (status in ('Applying','Interviewing','Offer','Rejected')) default 'Applying',
  feedback text,
  applied_date date default current_date,
  created_at timestamptz default now()
);

alter table public.applications enable row level security;
create policy "own applications all" on public.applications for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 8. Chat Messages (Mentor history)
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('user','model')) not null,
  content text not null,
  created_at timestamptz default now()
);

alter table public.chat_messages enable row level security;
create policy "own chat all" on public.chat_messages for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 9. Curriculum Topics per Job Track (Shared Reference Content)
create table if not exists public.curriculum_topics (
  id uuid primary key default gen_random_uuid(),
  job_track_id uuid references public.job_tracks(id) not null,
  topic_order int not null,
  title text not null,
  description text,
  difficulty text check (difficulty in ('Beginner','Intermediate','Advanced')) default 'Beginner',
  created_at timestamptz default now(),
  unique (job_track_id, topic_order)
);

alter table public.curriculum_topics enable row level security;
create policy "curriculum public read" on public.curriculum_topics for select using (true);

-- 10. Topic Progress per Student
create table if not exists public.topic_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  topic_id uuid references public.curriculum_topics(id) on delete cascade not null,
  status text check (status in ('not_started','in_progress','completed','needs_review')) default 'not_started',
  mastery_score numeric default 0,
  last_practiced_at timestamptz,
  unique (user_id, topic_id)
);

alter table public.topic_progress enable row level security;
create policy "own topic progress all" on public.topic_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 11. Assignments generated for weak topics
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_track_id uuid references public.job_tracks(id) not null,
  target_topics text[] not null,
  status text check (status in ('pending','completed')) default 'pending',
  score numeric,
  feedback jsonb,
  created_at timestamptz default now()
);

alter table public.assignments enable row level security;
create policy "own assignments all" on public.assignments for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 12. Assignment Questions (SENSITIVE - NO client policy)
create table if not exists public.assignment_questions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid references public.assignments(id) on delete cascade not null,
  question_order int not null,
  topic text not null,
  prompt text not null,
  options jsonb,
  correct_answer text, -- SENSITIVE: read only by Edge Function service_role
  created_at timestamptz default now()
);

alter table public.assignment_questions enable row level security;
-- DELIBERATELY NO policy for authenticated role

-- 13. User Badges & Achievements Table (Motivation Addon)
create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  badge_id text not null,
  badge_title text not null,
  badge_category text not null, -- 'skill', 'stage', 'streak', 'milestone'
  description text not null,
  icon_name text not null,
  unlocked_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb,
  unique (user_id, badge_id)
);

alter table public.user_achievements enable row level security;
create policy "own achievements all" on public.user_achievements for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 14. Peer Benchmark by Job Track via SECURITY DEFINER function
create or replace function public.get_track_percentile(p_job_track_id uuid, p_score numeric)
returns int
language sql
security definer
set search_path = public
as $$
  select coalesce(
    round(
      100.0 * count(*) filter (where jt.readiness_score <= p_score)
      / nullif(count(*), 0)
    )::int,
    50
  )
  from public.job_targets jt
  join public.profiles p on p.id = jt.user_id
  where jt.job_track_id = p_job_track_id
    and p.benchmark_opt_in = true;
$$;
