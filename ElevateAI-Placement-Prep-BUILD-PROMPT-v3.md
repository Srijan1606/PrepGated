# MASTER BUILD PROMPT — Placement Prep Platform (from scratch)

Paste everything below into Antigravity as one instruction. This is a greenfield build.

**Working directory**: `/home/frostbite/Desktop/Notes/Hackathons/Promptwars CIT /Edtech`
Initialize the project in this folder (it may currently be empty or contain a bare clone — check its current contents first, and scaffold cleanly inside it rather than creating a new folder elsewhere).

---

## 0. OPERATING NOTES FOR ANTIGRAVITY

- Build everything in the working directory above, from scratch. There is no prior codebase to preserve or migrate — every file you create is new.
- You are autonomous for this build. Every decision that would normally need a clarifying question has already been made below. Do not pause to ask; make the call using this document and move on.
- After each phase in Section 12, run the type-checker, the build, and the test suite yourself. If something breaks, debug it and fix it before moving to the next phase — don't hand back a broken intermediate state.
- Treat this as an automated-grading submission (see Section 1). Only your final commit is scored. Keep the repo in a working, deployable state after every phase, not just at the very end.
- If you hit a genuine external blocker (a missing API key, a Supabase project not yet created), stop and surface exactly that one blocker — don't guess at credentials or invent placeholder secrets that silently fail later.

---

## 1. YOUR ROLE

You are a senior full-stack engineer building a production-quality MVP from scratch under a hard deadline (submission by 5:00 PM IST today). You will be graded by an **automated code-assessment tool** on: code quality, security, efficiency, testing, accessibility, problem-statement alignment, and Google-services usage.

---

## 2. THE PROBLEM YOU ARE SOLVING

Students preparing for campus placements struggle with four things: **what to prepare**, **how to prepare**, **where they stand**, and **what to improve**. Generic "AI career chatbot" features don't answer these convincingly. A real placement process is a *sequence of gated rounds* — that structure is what the product should mirror, because it's the thing students actually recognize and the thing that makes "where do I stand" a concrete, stage-by-stage answer instead of a vague score.

### 2.1 Problem → Solution Map (paste this into `README.md` verbatim, under a "Problem & Approach" heading)

| # | Problem | Why existing tools fail at it | What this product does |
|---|---|---|---|
| 1 | **Directionless prep** ("what to prepare") | Students prep generically (e.g. grinding DSA for a Data Analyst role) because there's no role-specific map of what's tested | Prep is organized around a **Job Track** (SDE, Frontend, Data Analyst, ML, DevOps, QA, etc.); Gemini generates questions from that track's specific core topics, not a generic bucket |
| 2 | **Unstructured practice** ("how to prepare") | Students drill whichever round feels safe (usually aptitude) and avoid harder rounds indefinitely | Prep is a **5-stage gated pipeline** (Aptitude → Technical MCQ → Coding → Technical Interview → HR) mirroring a real hiring process — "how to prepare" becomes "do the next stage" |
| 3 | **No accurate self-assessment** ("where they stand") | Students over/underestimate readiness with no objective number or peer comparison | A **Readiness Score** per job track (weighted average across the 5 gated stages) plus a **peer percentile** computed via a secure aggregate function, never exposing other students' raw data |
| 4 | **Vague, un-actionable feedback** ("what to improve") | Mock-interview tools say "good job" or give a bare score with no reasoning | Every stage returns strengths/weaknesses/suggestions/model-answer; the Technical Interview stage's follow-up questions are chosen based on what the student got wrong earlier, so feedback compounds instead of resetting each round |
| 5 | **Motivation decay** over a multi-month prep cycle | No visible progress, so students fall off after the first week | The 5-stage stepper is itself a progress visualization; streaks/unlock states make partial progress visible |
| 6 | **Communication under-practiced** | HR/behavioral rounds treated as an afterthought vs. technical prep | HR/Behavioral is a first-class gated stage with the same rigor and feedback structure as the technical rounds, not a footnote |
| 7 | **One-size-fits-all resources** | Generic roadmaps ignore that two students on the same role have different gaps | Weaknesses surfaced by autograded stages directly drive what's asked next — personalization from evidence (test performance), not a form filled out once |

Every feature in this build ties back to one of the four verbs in the problem statement — **what** (job-track topics), **how** (staged pipeline), **where** (readiness score + percentile), **improve** (rubric feedback + adaptive follow-ups). Keep this table close to hand for the judging demo; the goal is that no feature in the product is unexplainable in terms of it.

---

## 3. CORE PRODUCT MODEL — PLACEMENT TRACKS

A student picks one or more **Job Targets** (a tech job track, optionally a specific company), and each Job Target gets a **5-stage prep pipeline**, generated by Gemini and autograded stage-by-stage.

### Job Track catalog (seed data — various tech jobs, not just "SDE")
Seed `job_tracks` with at least:
- SDE / Backend Engineer
- Frontend Engineer
- Full-Stack Developer
- Data Analyst
- Data Scientist / ML Engineer
- DevOps / Cloud Engineer
- QA / SDET
- Product / Business Analyst

Each has a `core_topics` array Gemini uses to generate relevant questions (e.g. Data Analyst → SQL, statistics, Excel/BI tools, case-study reasoning — not DSA-heavy like SDE).

### The 5 stages (per Job Target)
1. **Aptitude & Reasoning** — MCQ (quant, logical reasoning, verbal). **Autograded deterministically** (server compares to stored answer key — no AI call needed to grade, which is fast and cheap).
2. **Core Technical MCQ** — MCQ on the job track's `core_topics`. **Autograded deterministically**, same mechanism as Stage 1.
3. **Coding / Applied Problem** — one or two short applied problems (code or structured written solution, not a full sandboxed judge — see note below). **AI-graded against a rubric** (Gemini compares the submission to a model solution and scores structure/correctness/efficiency reasoning).
4. **Technical Interview** — a short conversational round. Gemini asks 3–4 follow-up questions, **weighted toward the topics the student got wrong in Stages 1–3** (this is the "what to improve" loop closing on itself). Evaluated STAR/technical-accuracy style.
5. **HR / Behavioral Interview** — conversational round on communication, motivation, culture fit. Evaluated on clarity, structure, and specificity of examples.

A stage unlocks only once the previous stage is attempted (score ≥ 0, i.e. completed — don't gate on passing, just on attempting, so nobody gets stuck). Store `best_score` per stage. A Job Target's overall **Readiness Score** = weighted average across its 5 stages (weight coding/interview stages slightly higher than MCQ stages, since they're harder to game).

**Note on the coding stage**: do not attempt to build a sandboxed code execution/judge system — that's a multi-day project on its own and out of scope for today. Grade it the same way a human TA would grade a written solution: Gemini reads the submitted code/pseudocode against a model answer and rubric (correctness of approach, edge cases considered, complexity), and returns a score + feedback. Be explicit in the UI that this is an AI code-review grade, not a compiler-verified pass/fail — that's an honest framing, not a limitation to hide.

---

## 4. TECH STACK

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS, React Router.
- **Backend**: Supabase — Postgres, Supabase Auth, one combined Edge Function (Deno/TypeScript) for all Gemini calls.
- **AI**: Google Gemini API, called only from the Edge Function, key stored as a Supabase secret, never shipped to the browser.
- **Deployment**: Frontend → Vercel. Backend → Supabase.

### Design system to build (original, not derived from anything)
Dark-mode-first UI with a light-mode toggle, slate/blue color palette, glassmorphic cards (subtle border + soft shadow + slight background blur on elevated panels), Inter typeface (via Google Fonts), Font Awesome icons, a persistent left sidebar for navigation on desktop collapsing to a bottom bar or drawer on mobile. Keep spacing and type scale consistent across every view — define these as Tailwind theme extensions once, not per-component magic numbers.

---

## 5. DATABASE SCHEMA

Migration `supabase/migrations/0001_init.sql`. RLS enabled on every table.

```sql
-- Profiles
create table public.profiles (
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

-- Catalog of tech job tracks (seed data, read-only to clients)
create table public.job_tracks (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  core_topics text[]
);
alter table public.job_tracks enable row level security;
create policy "job tracks public read" on public.job_tracks for select using (true);
-- seed: insert the 8 tracks from Section 3 here.

-- A student's chosen target jobs
create table public.job_targets (
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

-- Stage instances per job target
create table public.prep_stages (
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

-- Generated question sets per stage. NOT directly readable by clients (see note below).
create table public.stage_questions (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid references public.prep_stages(id) on delete cascade not null,
  question_order int not null,
  question_type text check (question_type in ('mcq','coding','open_ended')) not null,
  prompt text not null,
  options jsonb,        -- MCQ options: [{id, text}]
  correct_answer text,  -- MCQ correct option id, or a grading rubric for coding/open_ended — SENSITIVE
  created_at timestamptz default now()
);
alter table public.stage_questions enable row level security;
-- Deliberately NO select/insert/update policy for the authenticated role.
-- This table is only ever touched by the Edge Function using the service_role
-- key, which bypasses RLS. The client never queries this table directly —
-- it only ever receives a sanitized (no correct_answer) version over the
-- Edge Function's HTTP response. This is what keeps answer keys uncheatable.

-- Submitted attempts
create table public.stage_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  stage_id uuid references public.prep_stages(id) on delete cascade not null,
  answers jsonb not null,   -- [{question_id, answer_text}]
  score numeric not null,
  max_score numeric not null,
  feedback jsonb,           -- {summary, per_question[], strengths[], weaknesses[], suggestions[]}
  created_at timestamptz default now()
);
alter table public.stage_attempts enable row level security;
create policy "own attempts all" on public.stage_attempts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Applications tracker
create table public.applications (
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

-- Chat history
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('user','model')) not null,
  content text not null,
  created_at timestamptz default now()
);
alter table public.chat_messages enable row level security;
create policy "own chat all" on public.chat_messages for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Peer benchmark by job track, via SECURITY DEFINER function (no raw cross-user reads)
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
```

---

## 6. AUTH

Use `@supabase/supabase-js`. Implement:
- Sign up / sign in with email + password.
- "Continue with Google" via `supabase.auth.signInWithOAuth({ provider: 'google' })`.
- A `useAuth()` hook wrapping `supabase.auth.getSession()` + `onAuthStateChange`.
- On first login, if no row exists in `profiles` for `auth.uid()`, route to Onboarding; otherwise route to Dashboard.

Do not persist any user or profile data in `localStorage` — Postgres via Supabase is the single source of truth, with the session token as the only thing the browser holds onto.

---

## 7. EDGE FUNCTION — ACTIONS

`supabase/functions/ai/index.ts`, one function, `{ action, payload }` dispatch. **Every action must verify the caller's Supabase JWT and derive `user_id` from it — never trust a `user_id` in the request body.** This function must use the Supabase **service_role** key internally (kept as a separate secret from the anon key) specifically so it can read/write `stage_questions` (which has no RLS policy for regular users) while still authenticating the caller manually via their JWT before doing anything.

| action | input | what it does |
|---|---|---|
| `create_job_target` | job_track_id, company? | inserts `job_targets` row, generates 5 `prep_stages` rows (titles from a template, e.g. "SDE Aptitude Round"), unlocks stage 1 |
| `generate_stage_questions` | stage_id | Gemini generates 5–8 questions matching `stage_type` (MCQ schema for aptitude/technical_mcq, 1–2 open problems for coding, 3–4 prompts for interview stages) using `responseSchema`-constrained JSON; **stores full record (with `correct_answer`) in `stage_questions` via service_role**; returns a **sanitized copy with `correct_answer` stripped** to the client |
| `submit_stage_attempt` | stage_id, answers[] | for `aptitude`/`technical_mcq`: **deterministic server-side grading** — fetch stored questions + correct answers via service_role, compare, compute score, no Gemini call needed; for `coding`/`technical_interview`/`hr_interview`: fetch the rubric/model-answer questions, call Gemini once with all Q&A pairs to grade holistically (score + feedback + strengths + weaknesses + suggestions); either way, insert into `stage_attempts`, update `prep_stages.best_score`, unlock the next stage, recompute `job_targets.readiness_score` |
| `chat_with_mentor` | history, message | text reply, stored in `chat_messages` |
| `tailor_resume` | resume, jobDescription | tailored text |
| `get_skill_recommendations` | topic, location | JSON: strategicIdeas, courses[] (Google Search grounding tool) |

Keep `find_opportunities` / `generate_company_prep` as stretch goals only if core stages are fully working and tested first.

Use JSON-schema-constrained generation for every structured action (`responseMimeType: "application/json"`, `responseSchema` with `Type.OBJECT`/`Type.ARRAY`) so you never depend on regex JSON extraction as your primary mechanism — write a small fallback parser as a safety net only.

**Security requirements (graded):**
- Reject unauthenticated requests outright.
- Validate `stage_id` belongs to a `job_target` owned by the caller before touching `stage_questions` or `stage_attempts` for it.
- Size-limit all free-text inputs before sending to Gemini.
- Never return `correct_answer` / rubric fields to the client in `generate_stage_questions` — write a small serialization helper that strips it, and unit-test that helper (see Section 10).
- Generic error responses to the client; detailed errors logged server-side only.

---

## 8. FRONTEND — STAGE RUNNER

Build one `StageRunner.tsx` component that renders differently based on `stage_type`:
- `aptitude` / `technical_mcq` → MCQ grid, submit button disabled until all answered.
- `coding` → a textarea (monospace font) for a written/code solution, one problem at a time.
- `technical_interview` / `hr_interview` → a chat-like Q&A flow: show one Gemini-generated question, take a free-text answer, move to the next.

On submit, call `submit_stage_attempt`, then show a results panel: score, feedback summary, strengths/weaknesses/suggestions (and model answer for coding/interview stages).

Build a `JobTargets.tsx` view: list of the student's Job Targets as cards, each showing a 5-stage progress tracker (like a horizontal stepper: Aptitude ✓ → Technical MCQ ✓ → Coding ○ → Tech Interview 🔒 → HR 🔒) and the current Readiness Score with the Peer Benchmark percentile next to it. An "Add Job Target" flow lets a student pick a track (+ optional company) from the seeded catalog, which calls `create_job_target`.

Other views to build: `Onboarding.tsx` (basic profile capture: degree, location, resume text — feeds `profiles`), `Dashboard.tsx` (overall readiness across all Job Targets, application tracker summary), `ResumeStudio.tsx` (resume-to-JD tailoring), `Chatbot.tsx` (persistent mentor chat), `Applications.tsx` (CRUD tracker), `Sidebar.tsx` / `UserMenu.tsx` for navigation and account controls.

Add React Router with routes: `/`, `/login`, `/onboarding`, `/dashboard`, `/targets`, `/targets/:id/stage/:stageId`, `/studio`, `/applications`. Guard authenticated routes with a wrapper that redirects to `/login` if no session.

---

## 9. ACCESSIBILITY REQUIREMENTS (graded)

- Visible focus rings on every interactive element; don't strip default outlines without replacing them.
- Icon-only buttons need `aria-label`.
- Every form input has an associated `<label>` (use `sr-only` if it shouldn't be visible, never omit it).
- MCQ options must be actual `<fieldset>`/`<legend>`/radio inputs (or `role="radiogroup"` with proper `aria-checked` if custom-styled), not divs with click handlers only — this is the single most important accessibility item since the whole product now hinges on MCQ interaction.
- `aria-live="polite"` region for async "Generating your interview question..." / "Grading..." states.
- Verify WCAG AA color contrast, especially light-mode secondary text and the stage-locked/unlocked stepper states.

---

## 10. TESTING REQUIREMENTS (graded)

Vitest + React Testing Library. Minimum:
- Unit test for the deterministic MCQ grading function (given questions + answer key + submitted answers, returns the right score) — this is pure, cheap to test, and directly protects the "autograded" claim.
- Unit test for the `correct_answer`-stripping serializer used in `generate_stage_questions`, asserting the sanitized payload never contains the field.
- Test that an Edge Function action rejects a request with no/invalid JWT.
- Component test for `StageRunner` in MCQ mode: renders questions, disables submit until all answered, calls the submit handler with the right shape.
- Component test for `JobTargets`: renders a stage stepper reflecting locked/unlocked state correctly.
`npm test` must pass before the build is considered done.

---

## 11. ENVIRONMENT VARIABLES

Frontend `.env` (safe to expose):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
Supabase secrets (backend only):
```
GEMINI_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
`.env.example` with empty values, `.env` gitignored. A committed key is an automatic security-score failure — check before your final commit.

---

## 12. BUILD ORDER

1. Scaffold the project in the working directory (Vite + React + TS + Tailwind), initialize Supabase (`supabase init`), write and apply the migration from Section 5, seed `job_tracks`.
2. Auth end-to-end — signup, login, Google OAuth, session-gated routing. Verify by logging in and landing on an empty dashboard.
3. `create_job_target` + `JobTargets.tsx` — verify a student can add a track and see 5 locked/unlocked stage placeholders.
4. `generate_stage_questions` + `submit_stage_attempt` for `aptitude`/`technical_mcq` (deterministic grading path) + `StageRunner.tsx` MCQ mode. Verify: generate → answer → autograded score → next stage unlocks.
5. Extend `submit_stage_attempt` for `coding`/`technical_interview`/`hr_interview` (Gemini grading path) + `StageRunner.tsx` other modes.
6. Peer benchmark (`get_track_percentile`) wired into `JobTargets.tsx`.
7. Application Tracker CRUD, Chatbot, Resume Studio.
8. Accessibility pass (Section 9) across all views.
9. Tests (Section 10).
10. Only if time remains: stretch features (live job search grounding, TTS, streak/XP gamification).
11. Final pass: remove any dead/unused code and console logs of sensitive data, confirm no secrets are committed, `npm run build` clean, `npm test` green.

---

## 13. DEPLOYMENT

1. `supabase secrets set GEMINI_API_KEY=... SUPABASE_SERVICE_ROLE_KEY=...`
2. `supabase db push`
3. `supabase functions deploy ai`
4. Deploy frontend to Vercel with `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` set.
5. Manually walk the full flow on the live URL: sign up → add a Job Target → complete all 5 stages → see readiness score + peer percentile update.

---

## 14. GOOGLE SERVICES USAGE — MAKE IT EXPLICIT

"Google services usage" is one of the seven graded axes, so don't let it be an incidental side-effect of using Gemini — call it out deliberately, both in code comments and in the README. This build genuinely uses:

1. **Gemini API** (`@google/genai`) — the core reasoning engine: question generation per job track, coding/interview grading, chat mentor, resume tailoring. This is the load-bearing Google service, not decoration.
2. **Google Search grounding tool** (`tools: [{ googleSearch: {} }]`) — used in `get_skill_recommendations` (and `find_opportunities` if you build the stretch job-search feature) so course/job suggestions are grounded in live search results rather than the model's static training data.
3. **Sign in with Google** — via `supabase.auth.signInWithOAuth({ provider: 'google' })`, so Google OAuth is a real auth path, not just email/password with a Google logo bolted on.
4. **Google Fonts (Inter)** — loaded via the standard Google Fonts link rather than a bundled/self-hosted copy, so it counts honestly.

Do not artificially bolt on unrelated Google products (Firebase, Analytics, Maps) just to pad this list — an assessor can tell the difference between genuine usage and checkbox-stuffing, and it would also blow your time budget. These four are sufficient and each is functionally necessary to a real feature.

---

## 15. EVALUATION CRITERIA SELF-AUDIT

Before your final commit, walk this table criterion-by-criterion. It cross-references what's already specified elsewhere in this document — use it as a submission gate, not just a checklist.

| Criterion | Where it's satisfied in this spec | Verify by |
|---|---|---|
| **Code quality** | Single combined Edge Function instead of scattered ad-hoc functions (Sec 7); dead code removed each phase (Sec 12); TypeScript throughout with shared types for stage/question/attempt shapes | `npm run build` has zero TS errors; no unused imports or leftover scaffolding files |
| **Security** | RLS on every table (Sec 5); `stage_questions` has *no* client-facing policy at all, answer keys never leave the server (Sec 5, 7); JWT verified server-side, never trusting client-supplied `user_id` (Sec 7); Gemini key + service_role key only in Supabase secrets (Sec 11) | Try reading `stage_questions` with the anon key directly — must return nothing; grep the repo for the literal API key string — must find nothing |
| **Efficiency** | MCQ/aptitude stages graded deterministically server-side with zero Gemini calls (Sec 7); one Edge Function instead of many (deploy + cold-start efficiency); question sets generated once per stage and reused across grading rather than regenerated per attempt | Check Edge Function logs during an MCQ submission — confirm no outbound Gemini call happens for those two stage types |
| **Testing** | Vitest suite covering the deterministic grading function, the answer-key-stripping serializer, JWT-rejection, and two component tests (Sec 10) | `npm test` passes with all five listed tests present, not just scaffolded |
| **Accessibility** | Real `<fieldset>`/radio semantics for MCQs (not clickable divs), `aria-label` on icon buttons, `aria-live` for async states, keyboard-operable stage runner, WCAG AA contrast check (Sec 9) | Tab through the entire MCQ → submit → feedback flow using only the keyboard; run an automated contrast checker (e.g. axe or Lighthouse) against the dashboard and stage runner |
| **Problem-statement alignment** | The Sec 2.1 problem→solution table maps every feature to "what/how/where/improve"; the 5-stage pipeline structurally mirrors a real placement process rather than being a generic AI-tools grab-bag | Read the README's "Problem & Approach" section cold — every feature listed there should trace to a table row, and every table row should have a corresponding shipped feature |
| **Google services usage** | Four genuine, functionally load-bearing uses of Google services, itemized in Sec 14 | README explicitly lists all four with one line each on *why* they're used, not just *that* they're used |

If any row fails, fix that row before touching anything else — a submission that's strong on six axes and silent on the seventh (most commonly testing or accessibility, since they're the easiest to skip under time pressure) will cost more than polishing an already-strong feature further.

---

## 16. DEFINITION OF DONE

- [ ] No API keys anywhere in frontend code or committed files.
- [ ] `stage_questions` has no client-facing RLS policy — confirmed by trying to read it with the anon key and getting nothing back.
- [ ] All 5 stage types work end-to-end on the deployed URL.
- [ ] MCQ stages are graded without any Gemini call (verify via Edge Function logs during grading).
- [ ] `npm test` passes.
- [ ] MCQ stage is fully keyboard/screen-reader operable.
- [ ] No dead/unused code, no stray console logs of sensitive data.
- [ ] README updated with the staged-pipeline explanation, tech stack, setup, live link, the Sec 2.1 problem→solution table, and the Sec 14 Google-services list.
- [ ] GitHub repo public, deployment live.
- [ ] Every row of the Section 15 evaluation-criteria self-audit has been checked, not assumed.
r