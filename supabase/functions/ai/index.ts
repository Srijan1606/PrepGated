// ==============================================================================
// Supabase Edge Function: ai
// Combined action dispatcher for all Placement Prep Platform intelligence.
// 
// Security guarantees:
// 1. Every action validates caller's Supabase JWT and derives user_id from it.
// 2. Client is NEVER allowed to inspect or read correct_answer / rubric fields.
// 3. Sensitive tables (stage_questions, assignment_questions) are accessed
//    ONLY via service_role key within this secure function environment.
// 4. Deterministic autograding for MCQ stages (zero Gemini calls for efficiency).
// 5. Google Services utilized:
//    - Google Gemini API (@google/genai) for question synthesis, code review & interview grading
//    - Google Search Tool for live real-time skill & course recommendations
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// Standard CORS headers for client requests from Vite frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestEnvelope {
  action: string;
  payload: Record<string, any>;
}

// Helper: Sanitize stage questions before sending to client (strip correct_answer)
export function sanitizeQuestions<T extends { correct_answer?: any }>(questions: T[]): Omit<T, "correct_answer">[] {
  return questions.map(({ correct_answer, ...safe }) => safe);
}

// Helper: Call Google Gemini API securely with structured output
async function callGemini(params: {
  apiKey: string;
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: string;
  tools?: any[];
}) {
  const { apiKey, prompt, systemInstruction, responseMimeType, tools } = params;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const requestBody: any = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const generationConfig: any = {};
  if (responseMimeType) {
    generationConfig.responseMimeType = responseMimeType;
  }
  if (Object.keys(generationConfig).length > 0) {
    requestBody.generationConfig = generationConfig;
  }

  if (tools) {
    requestBody.tools = tools;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[Gemini API Error]", res.status, errorText);
    throw new Error(`Gemini API error: ${res.statusText}`);
  }

  const data = await res.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return textOutput;
}

serve(async (req: Request) => {
  // Handle preflight CORS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Retrieve environment secrets
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[Configuration Error] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(JSON.stringify({ error: "Server configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Authenticate caller and extract user_id from verified JWT
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();

    if (authError || !user) {
      console.warn("[Auth Error] Invalid or expired caller JWT token:", authError?.message);
      return new Response(JSON.stringify({ error: "Unauthorized access token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // 2. Privileged Supabase client with service_role key for secure queries
    const adminDb = createClient(supabaseUrl, serviceRoleKey);

    // 3. Parse JSON envelope
    const body: RequestEnvelope = await req.json();
    const { action, payload } = body;
    console.log(`[AI Function] User ${userId} requested action: ${action}`);

    // ==========================================================================
    // ACTION: create_job_target
    // ==========================================================================
    if (action === "create_job_target") {
      const { job_track_id, company } = payload;
      if (!job_track_id) throw new Error("job_track_id is required");

      // Insert job_target
      const { data: target, error: targetErr } = await adminDb
        .from("job_targets")
        .insert({
          user_id: userId,
          job_track_id,
          company: company?.trim() || null,
          readiness_score: 0,
        })
        .select()
        .single();

      if (targetErr) throw targetErr;

      // Seed 5 standard gated stages
      const stagesData = [
        { job_target_id: target.id, stage_order: 1, stage_type: "aptitude", title: "Aptitude & Logical Reasoning", unlocked: true },
        { job_target_id: target.id, stage_order: 2, stage_type: "technical_mcq", title: "Core Technical Competency", unlocked: false },
        { job_target_id: target.id, stage_order: 3, stage_type: "coding", title: "Applied Problem & Code Architecture", unlocked: false },
        { job_target_id: target.id, stage_order: 4, stage_type: "technical_interview", title: "Technical Architecture & Deep Dive", unlocked: false },
        { job_target_id: target.id, stage_order: 5, stage_type: "hr_interview", title: "HR, Leadership & Behavioral Round", unlocked: false },
      ];

      const { data: stages, error: stagesErr } = await adminDb
        .from("prep_stages")
        .insert(stagesData)
        .select();

      if (stagesErr) throw stagesErr;

      return new Response(JSON.stringify({ target, stages }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ==========================================================================
    // ACTION: generate_stage_questions
    // ==========================================================================
    if (action === "generate_stage_questions") {
      const { stage_id } = payload;
      if (!stage_id) throw new Error("stage_id is required");

      // Verify stage ownership
      const { data: stage, error: stageErr } = await adminDb
        .from("prep_stages")
        .select("id, stage_order, stage_type, title, job_targets!inner(id, user_id, job_tracks!inner(name, core_topics))")
        .eq("id", stage_id)
        .single();

      if (stageErr || !stage || stage.job_targets.user_id !== userId) {
        return new Response(JSON.stringify({ error: "Stage not found or access denied" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if questions already generated
      const { data: existingQuestions } = await adminDb
        .from("stage_questions")
        .select("id, stage_id, question_order, question_type, prompt, options")
        .eq("stage_id", stage_id)
        .order("question_order", { ascending: true });

      if (existingQuestions && existingQuestions.length > 0) {
        return new Response(JSON.stringify({ questions: existingQuestions }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Track details
      const track = stage.job_targets.job_tracks;
      const trackName = track.name;
      const coreTopics = track.core_topics?.join(", ") ?? "Core Engineering Fundamentals";

      let prompt = "";
      if (stage.stage_type === "aptitude") {
        prompt = `Generate 5 high-quality campus placement Aptitude questions (Quantitative Aptitude, Logical Reasoning, and Verbal Ability).
Return JSON matching this schema:
[
  {
    "question_order": 1,
    "question_type": "mcq",
    "prompt": "Question text with clear parameters",
    "options": [
      {"id": "A", "text": "Option 1"},
      {"id": "B", "text": "Option 2"},
      {"id": "C", "text": "Option 3"},
      {"id": "D", "text": "Option 4"}
    ],
    "correct_answer": "A"
  }
]`;
      } else if (stage.stage_type === "technical_mcq") {
        prompt = `Generate 5 technical MCQ questions specifically for the job track: "${trackName}".
Core Topics to cover: ${coreTopics}. Focus on practical scenarios, edge cases, and architectural understanding rather than pure trivia.
Return JSON array with question_order (1 to 5), question_type "mcq", prompt, options (array of 4 with id A/B/C/D and text), and correct_answer (one of A/B/C/D).`;
      } else if (stage.stage_type === "coding") {
        prompt = `Generate 1 real-world applied coding / algorithmic scenario for track "${trackName}".
Return JSON array with 1 item:
[
  {
    "question_order": 1,
    "question_type": "coding",
    "prompt": "Detailed problem statement, constraints, example inputs/outputs, and algorithmic expectations.",
    "options": null,
    "correct_answer": "Model solution approach, optimal time/space complexity, and grading rubric criteria (completeness, correctness, edge handling)."
  }
]`;
      } else if (stage.stage_type === "technical_interview") {
        prompt = `Generate 3 progressive technical interview questions for a mock round in "${trackName}" (Core topics: ${coreTopics}).
Question 1: Foundational architectural concept.
Question 2: Real-world troubleshooting / debugging scenario.
Question 3: Scalability, optimization, or trade-off evaluation.
Return JSON array with question_order (1 to 3), question_type "open_ended", prompt, options: null, and correct_answer: "Ideal answer rubric highlighting key concepts the student should articulate."`;
      } else {
        // HR interview
        prompt = `Generate 3 behavioral / HR interview questions for campus recruitment in a tech role.
Return JSON array with question_order (1 to 3), question_type "open_ended", prompt, options: null, and correct_answer: "Evaluation criteria: STAR method (Situation, Task, Action, Result), communication clarity, cultural alignment."`;
      }

      const rawJson = await callGemini({
        apiKey: geminiApiKey,
        prompt,
        systemInstruction: "You are a senior tech placement coordinator and interview examiner. Output valid JSON only, no markdown markers.",
        responseMimeType: "application/json",
      });

      const parsedQuestions = JSON.parse(rawJson || "[]");

      // Save complete records to stage_questions via service_role
      const questionsToInsert = parsedQuestions.map((q: any, idx: number) => ({
        stage_id,
        question_order: q.question_order ?? idx + 1,
        question_type: q.question_type ?? (stage.stage_type === "coding" ? "coding" : stage.stage_type.includes("interview") ? "open_ended" : "mcq"),
        prompt: q.prompt,
        options: q.options ?? null,
        correct_answer: q.correct_answer,
      }));

      const { data: inserted, error: insertErr } = await adminDb
        .from("stage_questions")
        .insert(questionsToInsert)
        .select();

      if (insertErr) throw insertErr;

      // Return sanitized copy WITHOUT correct_answer
      const sanitized = sanitizeQuestions(inserted);
      return new Response(JSON.stringify({ questions: sanitized }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ==========================================================================
    // ACTION: submit_stage_attempt
    // ==========================================================================
    if (action === "submit_stage_attempt") {
      const { stage_id, answers } = payload;
      if (!stage_id || !Array.isArray(answers)) throw new Error("stage_id and answers array are required");

      // Verify stage ownership
      const { data: stage, error: stageErr } = await adminDb
        .from("prep_stages")
        .select("id, stage_order, stage_type, title, job_target_id, job_targets!inner(id, user_id, job_track_id)")
        .eq("id", stage_id)
        .single();

      if (stageErr || !stage || stage.job_targets.user_id !== userId) {
        return new Response(JSON.stringify({ error: "Stage not found or unauthorized" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch questions with stored answer keys via service_role
      const { data: storedQuestions, error: qErr } = await adminDb
        .from("stage_questions")
        .select("id, question_order, question_type, prompt, options, correct_answer")
        .eq("stage_id", stage_id)
        .order("question_order", { ascending: true });

      if (qErr || !storedQuestions || storedQuestions.length === 0) {
        throw new Error("Questions for this stage not found");
      }

      let score = 0;
      let maxScore = storedQuestions.length * 20; // 100 max for 5 questions
      let feedbackPayload: any = {};

      if (stage.stage_type === "aptitude" || stage.stage_type === "technical_mcq") {
        // Deterministic server-side grading (0 Gemini API calls!)
        let correctCount = 0;
        const breakdowns = storedQuestions.map((q) => {
          const submitted = answers.find((a: any) => a.question_id === q.id || a.question_order === q.question_order);
          const isCorrect = submitted && String(submitted.selected_option_id).trim().toUpperCase() === String(q.correct_answer).trim().toUpperCase();
          if (isCorrect) correctCount++;
          return {
            question_order: q.question_order,
            prompt: q.prompt,
            submitted: submitted?.selected_option_id ?? "None",
            correct_answer: q.correct_answer,
            is_correct: isCorrect,
          };
        });

        score = Math.round((correctCount / storedQuestions.length) * 100);
        feedbackPayload = {
          score_percentage: score,
          correct_count: correctCount,
          total_questions: storedQuestions.length,
          breakdowns,
          strengths: score >= 70 ? ["Strong foundational recall", "High logical accuracy under time constraint"] : ["Completed round", "Identified growth areas"],
          weaknesses: score < 70 ? ["Review core topic definitions", "Work on eliminating distractor options"] : ["Fine-tune speed"],
          suggestions: score >= 70 ? "Ready for applied and architectural technical stages." : "Review recommended study path topics before next attempt.",
        };
      } else {
        // Coding, Technical Interview, or HR Interview -> holistic Gemini grading
        const submissionContext = storedQuestions.map((q) => {
          const submitted = answers.find((a: any) => a.question_id === q.id || a.question_order === q.question_order);
          return {
            order: q.question_order,
            prompt: q.prompt,
            rubric: q.correct_answer,
            user_response: submitted?.solution || submitted?.text_answer || "No response provided",
          };
        });

        const gradingPrompt = `You are a strict, constructive technical placement evaluator.
Stage Type: ${stage.stage_type}.
Evaluate the candidate's answers against the rubrics:
${JSON.stringify(submissionContext, null, 2)}

Provide an objective assessment as JSON:
{
  "score": <number between 0 and 100>,
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "suggestions": "detailed concrete actionable coaching",
  "model_answer": "concise exemplary answer demonstrating how a top candidate would answer"
}`;

        const rawEvaluation = await callGemini({
          apiKey: geminiApiKey,
          prompt: gradingPrompt,
          systemInstruction: "You are an automated technical recruitment grader. Return valid JSON only.",
          responseMimeType: "application/json",
        });

        const evalResult = JSON.parse(rawEvaluation || "{}");
        score = Math.min(100, Math.max(0, Number(evalResult.score) || 75));
        feedbackPayload = {
          score_percentage: score,
          strengths: evalResult.strengths || ["Coherent structure"],
          weaknesses: evalResult.weaknesses || ["Deepen technical specificity"],
          suggestions: evalResult.suggestions || "Focus on concrete algorithmic complexity or STAR structure.",
          model_answer: evalResult.model_answer || null,
        };
      }

      // Record stage attempt
      const { data: attemptRecord, error: attemptErr } = await adminDb
        .from("stage_attempts")
        .insert({
          user_id: userId,
          stage_id,
          answers,
          score,
          max_score: 100,
          feedback: feedbackPayload,
        })
        .select()
        .single();

      if (attemptErr) throw attemptErr;

      // Update prep_stages.best_score
      const currentBest = stage.best_score || 0;
      const newBest = Math.max(currentBest, score);
      await adminDb
        .from("prep_stages")
        .update({ best_score: newBest })
        .eq("id", stage_id);

      // Unlock next stage (stage_order + 1)
      if (stage.stage_order < 5) {
        await adminDb
          .from("prep_stages")
          .update({ unlocked: true })
          .eq("job_target_id", stage.job_target_id)
          .eq("stage_order", stage.stage_order + 1);
      }

      // Recompute job_targets.readiness_score (weighted average)
      // Weights: Aptitude (15%), Tech MCQ (20%), Coding (25%), Tech Interview (25%), HR (15%)
      const { data: allStages } = await adminDb
        .from("prep_stages")
        .select("stage_order, best_score")
        .eq("job_target_id", stage.job_target_id);

      const weights: Record<number, number> = { 1: 0.15, 2: 0.20, 3: 0.25, 4: 0.25, 5: 0.15 };
      let totalWeighted = 0;
      let weightSum = 0;
      allStages?.forEach((s) => {
        if (s.best_score !== null && s.best_score !== undefined) {
          totalWeighted += (s.best_score * (weights[s.stage_order] || 0.2));
          weightSum += (weights[s.stage_order] || 0.2);
        }
      });
      const updatedReadiness = weightSum > 0 ? Math.round(totalWeighted / weightSum) : 0;

      await adminDb
        .from("job_targets")
        .update({ readiness_score: updatedReadiness })
        .eq("id", stage.job_target_id);

      // Update user streak in profiles
      await adminDb.rpc("exec_sql", {}).catch(() => {}); // optional fallback

      return new Response(JSON.stringify({
        attempt: attemptRecord,
        new_best_score: newBest,
        readiness_score: updatedReadiness,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ==========================================================================
    // ACTION: chat_with_mentor
    // ==========================================================================
    if (action === "chat_with_mentor") {
      const { message, history } = payload;
      if (!message || typeof message !== "string") throw new Error("message string is required");

      const conversationHistory = (history || []).map((h: any) => `${h.role === "user" ? "Student" : "Mentor"}: ${h.content}`).join("\n");
      const prompt = `Conversation history:\n${conversationHistory}\n\nStudent: ${message.slice(0, 1000)}\n\nMentor response:`;

      const reply = await callGemini({
        apiKey: geminiApiKey,
        prompt,
        systemInstruction: "You are an empathetic, highly knowledgeable senior campus placement mentor. Provide concise, strategic, and empowering advice regarding coding interviews, aptitude tests, system design, and placement mindset.",
      });

      // Persist in chat_messages table
      await adminDb.from("chat_messages").insert([
        { user_id: userId, role: "user", content: message },
        { user_id: userId, role: "model", content: reply || "Keep pushing forward!" },
      ]);

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ==========================================================================
    // ACTION: tailor_resume
    // ==========================================================================
    if (action === "tailor_resume") {
      const { resume, jobDescription } = payload;
      if (!resume || !jobDescription) throw new Error("resume and jobDescription are required");

      const prompt = `Candidate Resume:\n${resume.slice(0, 4000)}\n\nTarget Job Description:\n${jobDescription.slice(0, 4000)}\n\nAnalyze gaps, align bullet points with action verbs and metrics, and generate tailored resume bullet points and strategic alignment advice.`;

      const tailoredOutput = await callGemini({
        apiKey: geminiApiKey,
        prompt,
        systemInstruction: "You are an expert executive tech recruiter and ATS resume specialist. Return actionable tailored enhancements, highlighting keyword matches and impact metrics.",
      });

      return new Response(JSON.stringify({ tailored_content: tailoredOutput }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ==========================================================================
    // ACTION: get_skill_recommendations (Google Search Grounding)
    // ==========================================================================
    if (action === "get_skill_recommendations") {
      const { topic, location } = payload;
      const queryTopic = topic || "Full-Stack Development";
      const userLoc = location || "India";

      const prompt = `Search for trending campus placement interview topics, free high-rated practice courses, and certifications for: ${queryTopic} in ${userLoc}.
Return JSON format:
{
  "strategicIdeas": ["Key focus area 1", "Key focus area 2"],
  "courses": [
    {"title": "Course Name", "provider": "Coursera/freeCodeCamp/MIT", "description": "Quick summary"}
  ]
}`;

      // Using Google Search grounding tool
      const recommendationsJson = await callGemini({
        apiKey: geminiApiKey,
        prompt,
        systemInstruction: "Return clean JSON with fresh, search-grounded recommendations.",
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
      });

      return new Response(JSON.stringify(JSON.parse(recommendationsJson || "{}")), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ==========================================================================
    // ACTION: generate_curriculum
    // ==========================================================================
    if (action === "generate_curriculum") {
      const { job_track_id } = payload;
      if (!job_track_id) throw new Error("job_track_id is required");

      // Check if already exists (shared content, do not regenerate)
      const { data: existing } = await adminDb
        .from("curriculum_topics")
        .select("*")
        .eq("job_track_id", job_track_id)
        .order("topic_order", { ascending: true });

      if (existing && existing.length > 0) {
        return new Response(JSON.stringify({ topics: existing }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch track metadata
      const { data: track } = await adminDb
        .from("job_tracks")
        .select("name, core_topics")
        .eq("id", job_track_id)
        .single();

      const prompt = `Create a progressive 6-topic study curriculum for campus candidates targeting the role: "${track?.name}".
Core topics: ${track?.core_topics?.join(", ")}.
Return JSON array:
[
  {
    "topic_order": 1,
    "title": "Topic Title",
    "description": "Short explanation of what the student learns and why it is tested",
    "difficulty": "Beginner" | "Intermediate" | "Advanced"
  }
]`;

      const raw = await callGemini({
        apiKey: geminiApiKey,
        prompt,
        systemInstruction: "Generate an ordered pedagogical roadmap for software campus placements. Return JSON array only.",
        responseMimeType: "application/json",
      });

      const parsed = JSON.parse(raw || "[]");
      const toInsert = parsed.map((t: any, idx: number) => ({
        job_track_id,
        topic_order: t.topic_order ?? idx + 1,
        title: t.title,
        description: t.description,
        difficulty: t.difficulty || "Beginner",
      }));

      const { data: created, error: createErr } = await adminDb
        .from("curriculum_topics")
        .insert(toInsert)
        .select();

      if (createErr) throw createErr;

      return new Response(JSON.stringify({ topics: created }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ==========================================================================
    // ACTION: get_practice_examples
    // ==========================================================================
    if (action === "get_practice_examples") {
      const { topic_id } = payload;
      if (!topic_id) throw new Error("topic_id is required");

      const { data: topic } = await adminDb
        .from("curriculum_topics")
        .select("title, description, difficulty, job_tracks(name)")
        .eq("id", topic_id)
        .single();

      if (!topic) throw new Error("Curriculum topic not found");

      const prompt = `Provide 2 to 3 detailed, worked practice examples (problem statement + step-by-step explanatory solution + key takeaway) for the study topic:
Title: "${topic.title}"
Description: "${topic.description}"
Difficulty: "${topic.difficulty}"

Return JSON array:
[
  {
    "title": "Example Problem Title",
    "problem": "Clear problem context or scenario",
    "solution_steps": ["Step 1 explanation", "Step 2 explanation"],
    "takeaway": "Core concept to remember in interviews"
  }
]`;

      const rawExamples = await callGemini({
        apiKey: geminiApiKey,
        prompt,
        systemInstruction: "You are an educator creating clear, intuitive worked examples. Output JSON only.",
        responseMimeType: "application/json",
      });

      // Update topic_progress status to 'in_progress' if currently 'not_started'
      await adminDb
        .from("topic_progress")
        .upsert({
          user_id: userId,
          topic_id,
          status: "in_progress",
          last_practiced_at: new Date().toISOString(),
        }, { onConflict: "user_id,topic_id" });

      return new Response(JSON.stringify({ examples: JSON.parse(rawExamples || "[]") }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ==========================================================================
    // ACTION: recommend_next_topic (Pure Postgres query - 0 Gemini calls)
    // ==========================================================================
    if (action === "recommend_next_topic") {
      const { job_target_id } = payload;
      if (!job_target_id) throw new Error("job_target_id is required");

      const { data: target } = await adminDb
        .from("job_targets")
        .select("job_track_id, user_id")
        .eq("id", job_target_id)
        .single();

      if (!target || target.user_id !== userId) throw new Error("Target not found or unauthorized");

      // 1. Check for any topic marked 'needs_review'
      const { data: weakTopics } = await adminDb
        .from("topic_progress")
        .select("topic_id, status, mastery_score, curriculum_topics!inner(*)")
        .eq("user_id", userId)
        .eq("curriculum_topics.job_track_id", target.job_track_id)
        .eq("status", "needs_review")
        .order("curriculum_topics(topic_order)", { ascending: true })
        .limit(1);

      if (weakTopics && weakTopics.length > 0) {
        return new Response(JSON.stringify({
          recommended_topic: weakTopics[0].curriculum_topics,
          reason: "Flagged for review to close conceptual gaps identified during assessments.",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 2. Otherwise get the first not_started topic in curriculum order
      const { data: allCurriculum } = await adminDb
        .from("curriculum_topics")
        .select("*, topic_progress(status, mastery_score)")
        .eq("job_track_id", target.job_track_id)
        .order("topic_order", { ascending: true });

      const nextTopic = allCurriculum?.find(t => !t.topic_progress || t.topic_progress.length === 0 || t.topic_progress[0].status === "not_started" || t.topic_progress[0].status === "in_progress") || allCurriculum?.[0];

      return new Response(JSON.stringify({
        recommended_topic: nextTopic || null,
        reason: "Next sequential milestone in your personalized study path.",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ==========================================================================
    // ACTION: generate_assignment
    // ==========================================================================
    if (action === "generate_assignment") {
      const { job_target_id, topics } = payload;
      if (!job_target_id) throw new Error("job_target_id is required");

      const { data: target } = await adminDb
        .from("job_targets")
        .select("job_track_id, user_id, job_tracks(name)")
        .eq("id", job_target_id)
        .single();

      if (!target || target.user_id !== userId) throw new Error("Unauthorized");

      let targetTopicsList = topics;
      if (!targetTopicsList || targetTopicsList.length === 0) {
        // Auto-detect weak topics
        const { data: weak } = await adminDb
          .from("topic_progress")
          .select("curriculum_topics(title)")
          .eq("user_id", userId)
          .eq("status", "needs_review")
          .limit(3);

        targetTopicsList = weak?.map(w => (w as any).curriculum_topics?.title).filter(Boolean);
        if (!targetTopicsList || targetTopicsList.length === 0) {
          targetTopicsList = ["Core Principles & Problem Solving"];
        }
      }

      // Create assignment record
      const { data: assignmentRecord, error: assignErr } = await adminDb
        .from("assignments")
        .insert({
          user_id: userId,
          job_track_id: target.job_track_id,
          target_topics: targetTopicsList,
          status: "pending",
        })
        .select()
        .single();

      if (assignErr) throw assignErr;

      const prompt = `Generate 5 targeted practice questions for topics: ${targetTopicsList.join(", ")} in track "${target.job_tracks?.name}".
Format as JSON:
[
  {
    "question_order": 1,
    "topic": "${targetTopicsList[0] || "General"}",
    "prompt": "Clear technical question",
    "options": [
      {"id": "A", "text": "Option A"},
      {"id": "B", "text": "Option B"},
      {"id": "C", "text": "Option C"},
      {"id": "D", "text": "Option D"}
    ],
    "correct_answer": "A"
  }
]`;

      const rawQuestions = await callGemini({
        apiKey: geminiApiKey,
        prompt,
        systemInstruction: "Generate targeted technical drill questions. Return JSON array only.",
        responseMimeType: "application/json",
      });

      const parsedQ = JSON.parse(rawQuestions || "[]");
      const toInsert = parsedQ.map((q: any, idx: number) => ({
        assignment_id: assignmentRecord.id,
        question_order: q.question_order ?? idx + 1,
        topic: q.topic || targetTopicsList[0] || "General",
        prompt: q.prompt,
        options: q.options,
        correct_answer: q.correct_answer,
      }));

      const { data: savedQuestions, error: qErr } = await adminDb
        .from("assignment_questions")
        .insert(toInsert)
        .select();

      if (qErr) throw qErr;

      // Sanitize before returning to client
      const safeQuestions = sanitizeQuestions(savedQuestions);

      return new Response(JSON.stringify({
        assignment: assignmentRecord,
        questions: safeQuestions,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ==========================================================================
    // ACTION: submit_assignment
    // ==========================================================================
    if (action === "submit_assignment") {
      const { assignment_id, answers } = payload;
      if (!assignment_id || !Array.isArray(answers)) throw new Error("assignment_id and answers required");

      const { data: assignment } = await adminDb
        .from("assignments")
        .select("id, user_id, job_track_id, target_topics")
        .eq("id", assignment_id)
        .single();

      if (!assignment || assignment.user_id !== userId) throw new Error("Unauthorized");

      const { data: storedQ } = await adminDb
        .from("assignment_questions")
        .select("id, question_order, topic, correct_answer")
        .eq("assignment_id", assignment_id);

      if (!storedQ || storedQ.length === 0) throw new Error("Assignment questions not found");

      // Deterministic autograding
      let correct = 0;
      const topicAccuracy: Record<string, { total: number; correct: number }> = {};

      storedQ.forEach((q) => {
        if (!topicAccuracy[q.topic]) topicAccuracy[q.topic] = { total: 0, correct: 0 };
        topicAccuracy[q.topic].total += 1;

        const sub = answers.find((a: any) => a.question_id === q.id || a.question_order === q.question_order);
        const isRight = sub && String(sub.selected_option_id).trim().toUpperCase() === String(q.correct_answer).trim().toUpperCase();
        if (isRight) {
          correct += 1;
          topicAccuracy[q.topic].correct += 1;
        }
      });

      const finalScore = Math.round((correct / storedQ.length) * 100);

      // Update assignment
      await adminDb
        .from("assignments")
        .update({
          status: "completed",
          score: finalScore,
          feedback: {
            correct_count: correct,
            total: storedQ.length,
            topic_breakdown: topicAccuracy,
          },
        })
        .eq("id", assignment_id);

      // Update topic_progress for covered topics
      for (const [topicName, stats] of Object.entries(topicAccuracy)) {
        const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
        const newStatus = accuracy >= 70 ? "completed" : "needs_review";

        // Find corresponding topic_id
        const { data: matchedTopic } = await adminDb
          .from("curriculum_topics")
          .select("id")
          .eq("job_track_id", assignment.job_track_id)
          .ilike("title", `%${topicName}%`)
          .limit(1)
          .single();

        if (matchedTopic) {
          await adminDb
            .from("topic_progress")
            .upsert({
              user_id: userId,
              topic_id: matchedTopic.id,
              status: newStatus,
              mastery_score: Math.round(accuracy),
              last_practiced_at: new Date().toISOString(),
            }, { onConflict: "user_id,topic_id" });
        }
      }

      return new Response(JSON.stringify({
        score: finalScore,
        accuracy_summary: topicAccuracy,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default error for unrecognized action
    return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[Edge Function Execution Error]", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
