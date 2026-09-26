# Placement Prep Platform (PrepGated)

> Production-grade, adaptive 5-stage placement preparation platform with role-specific study paths, real-time achievement tracking, peer benchmarking, and AI mock interviews.

---

## 1. Problem & Approach

| # | Problem | Why existing tools fail at it | What this product does |
|---|---------|-------------------------------|------------------------|
| 1 | **Directionless prep ("what to prepare")** | Students prep generically (e.g. grinding DSA for a Data Analyst role) because there's no role-specific map of what's tested | Prep is organized around a Job Track (SDE, Frontend, Data Analyst, ML, DevOps, QA, etc.); Gemini generates questions from that track's specific core topics, not a generic bucket |
| 2 | **Unstructured practice ("how to prepare")** | Students drill whichever round feels safe (usually aptitude) and avoid harder rounds indefinitely | Prep is a 5-stage gated pipeline (Aptitude → Technical MCQ → Coding → Technical Interview → HR) mirroring a real hiring process — "how to prepare" becomes "do the next stage" |
| 3 | **No accurate self-assessment ("where they stand")** | Students over/underestimate readiness with no objective number or peer comparison | A Readiness Score per job track (weighted average across the 5 gated stages) plus a peer percentile computed via a secure aggregate function, never exposing other students' raw data |
| 4 | **Vague, un-actionable feedback ("what to improve")** | Mock-interview tools say "good job" or give a bare score with no reasoning | Every stage returns strengths/weaknesses/suggestions/model-answer; the Technical Interview stage's follow-up questions are chosen based on what the student got wrong earlier, so feedback compounds instead of resetting each round |
| 5 | **Motivation decay over a multi-month prep cycle** | No visible progress, so students fall off after the first week | The 5-stage stepper is itself a progress visualization; streaks/unlock states make partial progress visible. **Add-on:** Real-time achievement trophies and badges for each skill completed with remaining requirements and live progress bars! |
| 6 | **Communication under-practiced** | HR/behavioral rounds treated as an afterthought vs. technical prep | HR/Behavioral is a first-class gated stage with the same rigor and feedback structure as the technical rounds, not a footnote |
| 7 | **One-size-fits-all resources** | Generic roadmaps ignore that two students on the same role have different gaps | Weaknesses surfaced by autograded stages directly drive what's asked next — personalization from evidence (test performance), not a form filled out once |

---

## 2. Key Features

- **9 Core Tech Job Tracks**: SDE / Backend, Frontend Engineer, Full-Stack Developer, Data Analyst, Data Scientist / ML, AI Engineer, DevOps / Cloud, QA / SDET, Product / Business Analyst.
- **5-Stage Gated Pipeline**:
  1. *Aptitude & Logical Reasoning* (Deterministic Autograding, 0 AI calls)
  2. *Core Technical MCQ* (Deterministic Autograding, 0 AI calls)
  3. *Applied Problem & Coding* (AI code review against rubric)
  4. *Technical Architecture Deep Dive* (Adaptive multi-question interview)
  5. *HR & Leadership Round* (STAR evaluation)
- **Study Path (Teach Before You Test)**:
  - Structured curriculum topics per track.
  - Worked practice examples (problem + step-by-step explanatory solution + key takeaway) generated on demand.
  - Targeted assignments focused on weak topics with instant deterministic grading.
- **Real-Time Motivation & Achievement Engine (Add-on)**:
  - 12 unlockable trophies & skill badges across Bronze, Silver, Gold, Diamond, and Legendary tiers.
  - Displays in real-time exactly **how much is remaining** to unlock each trophy.
  - Live animated milestone progress bar updating as stages and skills are mastered.
  - Confetti celebration bursts upon unlocking milestones.
- **ATS Resume Studio & Google Search Grounding**:
  - Live market-grounded interview trends and free course recommendations powered by Google Search tool.
  - Resume tailoring with impact metrics and keyword alignment.
- **Privacy-Preserving Peer Benchmarking**:
  - `get_track_percentile` computes percentile rank via `SECURITY DEFINER` function without leaking cross-user records.
- **Zero-Cheating Security Architecture**:
  - `stage_questions` and `assignment_questions` have **deliberately no client RLS policy**.
  - All answer keys (`correct_answer`) are only read and evaluated server-side in the Supabase Edge Function using `service_role`.

---

## 3. Google Services Usage

| Service | Why it is used in this build |
|---------|------------------------------|
| **Google Gemini API (@google/genai)** | Generates role-specific question sets, grades written code against rubrics, powers interactive interview simulations, and tailors resumes. Called exclusively from the Supabase Edge Function so the API key never touches the browser. |
| **Google Search Grounding Tool (`googleSearch`)** | Grounds skill recommendations and trending course suggestions in live web results rather than static training data. |
| **Sign in with Google (OAuth)** | One-click candidate authentication via `supabase.auth.signInWithOAuth({ provider: 'google' })`. |
| **Google Fonts (Inter & JetBrains Mono)** | Domain typography loaded via Google Fonts CDN for crisp legibility and accessible tabular figures. |

---

## 4. Manual Backend Setup & Deployment Steps

Follow these steps outside AI Studio to connect your Supabase backend and deploy to production:

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project.
2. **Apply Database Migration**:
   - Open **SQL Editor** in your Supabase dashboard.
   - Copy the entire contents of `supabase/migrations/0001_init.sql` and run it.
3. **Configure Frontend Environment**:
   - In Supabase Project Settings → **API**, copy your `Project URL` and `anon key`.
   - Create `.env` in the project root:
     ```env
     VITE_SUPABASE_URL="https://your-project.supabase.co"
     VITE_SUPABASE_ANON_KEY="your-anon-key"
     ```
4. **Link Supabase CLI & Set Secrets**:
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref <your-project-ref>

   # Set backend secrets (service role key is in Supabase API settings):
   supabase secrets set GEMINI_API_KEY="your-gemini-api-key" SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```
5. **Deploy the Edge Function**:
   ```bash
   supabase functions deploy ai
   ```
6. **Run Tests Locally**:
   ```bash
   npm install
   npm test
   ```
7. **Deploy to Vercel**:
   - Push repository to GitHub.
   - Import into Vercel and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as production environment variables.
   - Walk the full flow: Sign up → Add Job Target → Complete all 5 stages → Check real-time trophy progress!

---

## 5. Security Audit Checklist

- [x] Zero API keys in frontend code or client bundles.
- [x] `stage_questions` has NO client-facing RLS policy (accessible only by Edge Function via `service_role`).
- [x] Deterministic MCQ grading performed with zero external AI calls.
- [x] JWT token verified on every Edge Function action.
- [x] Input lengths sanitized before sending to LLM.
- [x] WCAG AA compliant contrast and fully keyboard/screen-reader accessible form controls.
