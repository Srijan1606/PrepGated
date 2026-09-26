// ==============================================================================
// Placement Prep Platform - Edge Function Bridge & Client Invocation
// Follows the exact contract: supabase.functions.invoke('ai', { body: { action, payload } })
// Includes fallback emulation during development preview before Deno function deployment.
// ==============================================================================

import { supabase, isRealSupabaseConfigured, SEED_JOB_TRACKS } from './supabase';
import { gradeMCQ, sanitizeQuestions } from './grading';
import { StageQuestion, PrepStage, JobTarget } from '../types';

export async function invokeAiAction<T = any>(action: string, payload: Record<string, any>): Promise<T> {
  // If calling question generation or stage grading, query our Gemini API server first
  if (action === 'generate_stage_questions') {
    try {
      const res = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: payload.role_title || 'Software Engineer',
          stageType: payload.stage_type || 'aptitude',
          stageOrder: payload.stage_order || 1,
          topics: payload.topics || [],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          const formatted = data.questions.map((q: any, idx: number) => ({
            id: q.id || `gq-${idx}`,
            stage_id: payload.stage_id,
            question_order: idx + 1,
            question_type: q.question_type || (payload.stage_type === 'coding' ? 'code' : 'mcq'),
            prompt: q.prompt,
            options: q.options || undefined,
            correct_answer: q.correct_answer,
            created_at: new Date().toISOString(),
          }));
          previewStore.questionsByStage.set(payload.stage_id, formatted);
          return { questions: sanitizeQuestions(formatted) } as unknown as T;
        }
      }
    } catch (err) {
      console.warn('[Gemini generation endpoint warning]', err);
    }
  }

  // If real Supabase is configured, invoke the Edge Function
  if (isRealSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('ai', {
        body: { action, payload },
      });
      if (error) {
        console.warn(`[Edge Function ${action} warning]`, error);
      } else if (data) {
        return data as T;
      }
    } catch (err) {
      console.warn(`[Edge Function invocation error on ${action}]`, err);
    }
  }

  // Resilient preview fallback handling for development testing in AI Studio
  return handlePreviewAction<T>(action, payload);
}

// In-memory / browser-resilient store for preview
const previewStore = {
  questionsByStage: new Map<string, Array<StageQuestion & { correct_answer: string }>>(),
  attemptsByStage: new Map<string, any[]>(),
  studyProgressByTopic: new Map<string, any>(),
};

function handlePreviewAction<T>(action: string, payload: any): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        switch (action) {
          case 'create_job_target': {
            const track = SEED_JOB_TRACKS.find((t) => t.id === payload.job_track_id) || SEED_JOB_TRACKS[0];
            const targetId = `target-${Date.now()}`;
            const target: JobTarget = {
              id: targetId,
              user_id: 'preview-user-id',
              job_track_id: track.id,
              company: payload.company || 'Top Tech Target',
              readiness_score: 0,
              created_at: new Date().toISOString(),
              job_track: track,
            };

            const stages: PrepStage[] = [
              { id: `stage-${targetId}-1`, job_target_id: targetId, stage_order: 1, stage_type: 'aptitude', title: 'Aptitude & Logical Reasoning', unlocked: true, best_score: null, created_at: new Date().toISOString() },
              { id: `stage-${targetId}-2`, job_target_id: targetId, stage_order: 2, stage_type: 'technical_mcq', title: 'Core Technical Competency', unlocked: false, best_score: null, created_at: new Date().toISOString() },
              { id: `stage-${targetId}-3`, job_target_id: targetId, stage_order: 3, stage_type: 'coding', title: 'Applied Problem & Code Architecture', unlocked: false, best_score: null, created_at: new Date().toISOString() },
              { id: `stage-${targetId}-4`, job_target_id: targetId, stage_order: 4, stage_type: 'technical_interview', title: 'Technical Architecture & Deep Dive', unlocked: false, best_score: null, created_at: new Date().toISOString() },
              { id: `stage-${targetId}-5`, job_target_id: targetId, stage_order: 5, stage_type: 'hr_interview', title: 'HR, Leadership & Behavioral Round', unlocked: false, best_score: null, created_at: new Date().toISOString() },
            ];

            resolve({ target, stages } as unknown as T);
            return;
          }

          case 'generate_stage_questions': {
            const stageId = payload.stage_id;
            let existing = previewStore.questionsByStage.get(stageId);
            if (!existing) {
              const questions = generateMockStageQuestions(stageId, payload.stage_type || 'aptitude');
              previewStore.questionsByStage.set(stageId, questions);
              existing = questions;
            }
            resolve({ questions: sanitizeQuestions(existing) } as unknown as T);
            return;
          }

          case 'submit_stage_attempt': {
            const { stage_id, answers } = payload;
            let stored = previewStore.questionsByStage.get(stage_id) || [];
            if (stored.length === 0) {
              stored = generateMockStageQuestions(stage_id, 'aptitude');
              previewStore.questionsByStage.set(stage_id, stored);
            }

            let score = 80;
            let feedbackPayload: any = {};

            if (stored[0]?.question_type === 'mcq') {
              const result = gradeMCQ(
                stored.map((q) => ({ id: q.id, correct_answer: q.correct_answer, question_order: q.question_order })),
                answers
              );
              score = result.score;
              feedbackPayload = {
                score_percentage: score,
                correct_count: result.correctCount,
                total_questions: result.totalQuestions,
                breakdowns: result.breakdowns,
                strengths: score >= 70 ? ['Strong analytical deduction', 'High accuracy on problem setup'] : ['Attempted under timed pressure'],
                weaknesses: score < 70 ? ['Incomplete or incorrect reasoning on core concepts', 'Review formulas and edge conditions'] : ['Minor optimization opportunities'],
                suggestions: score >= 70 ? 'Proceed with confidence to next technical round.' : 'Accuracy below 70%. Review wrong answers before proceeding.',
              };
            } else if (stored[0]?.question_type === 'coding') {
              // Strict Code Evaluation
              const codeSubmission = (answers[0]?.solution || '').trim();
              const lines = codeSubmission.split('\n').filter((l: string) => l.trim().length > 0 && !l.trim().startsWith('#'));
              const hasLoop = codeSubmission.includes('for ') || codeSubmission.includes('while ');
              const hasCondition = codeSubmission.includes('if ');
              const hasReturn = codeSubmission.includes('return ') && !codeSubmission.includes('return None') && !codeSubmission.includes('return 0');
              const hasDataStructure = codeSubmission.includes('{') || codeSubmission.includes('[') || codeSubmission.includes('dict') || codeSubmission.includes('set');
              const isOnlyStub = codeSubmission.length < 80 || codeSubmission.includes('pass\n') || lines.length <= 4;

              if (isOnlyStub || !hasReturn || !hasLoop) {
                // Incomplete or half answer: strictly fail
                score = Math.min(42, Math.max(15, Math.round(codeSubmission.length / 5)));
                feedbackPayload = {
                  score_percentage: score,
                  strengths: lines.length > 1 ? ['Function header declared'] : ['Attempt registered'],
                  weaknesses: [
                    'Incomplete Solution: Typing half an answer or function stub does not earn a passing grade.',
                    'Missing complete algorithmic execution loop and state tracking.',
                    'No verified return statement computing the exact required result.',
                    'Fails on basic boundary and edge-case test suites (empty input, negative values).'
                  ],
                  suggestions: 'Write out the full algorithm: initialize storage structures, iterate through all elements, compute target criteria, and return the verified result.',
                  model_answer: 'def solve(nums: list[int], k: int) -> int:\n    prefix_sums = {0: 1}\n    curr_sum = 0\n    total_subarrays = 0\n    for num in nums:\n        curr_sum += num\n        if (curr_sum - k) in prefix_sums:\n            total_subarrays += prefix_sums[curr_sum - k]\n        prefix_sums[curr_sum] = prefix_sums.get(curr_sum, 0) + 1\n    return total_subarrays',
                };
              } else if (!hasCondition || !hasDataStructure) {
                // Partial implementation without optimal data structure
                score = 62;
                feedbackPayload = {
                  score_percentage: 62,
                  strengths: ['Loop structure implemented', 'Basic return statement present'],
                  weaknesses: [
                    'Suboptimal Time Complexity: Solution does not leverage hash-map lookup (O(N) vs O(N^2)).',
                    'Missing boundary checks for empty or edge inputs.'
                  ],
                  suggestions: 'Upgrade data structure from nested iteration to hash-map lookup to meet latency requirements.',
                  model_answer: 'def solve(nums: list[int], k: int) -> int:\n    prefix_sums = {0: 1}\n    curr_sum = 0\n    total = 0\n    for num in nums:\n        curr_sum += num\n        if curr_sum - k in prefix_sums:\n            total += prefix_sums[curr_sum - k]\n        prefix_sums[curr_sum] = prefix_sums.get(curr_sum, 0) + 1\n    return total',
                };
              } else {
                // Full, robust solution
                score = 88;
                feedbackPayload = {
                  score_percentage: 88,
                  strengths: [
                    'Optimal O(N) time and O(N) auxiliary space complexity',
                    'Accurate state maintenance with prefix frequency tracking',
                    'Correctly handles negative integers and zero sum targets'
                  ],
                  weaknesses: ['Could document memory bounds for extremely large input streams (streaming / generator)'],
                  suggestions: 'Clean, production-grade code. Be prepared to explain concurrency safety if multiple threads submit chunks.',
                  model_answer: 'def solve(nums: list[int], k: int) -> int:\n    prefix_sums = {0: 1}\n    curr_sum = 0\n    total_subarrays = 0\n    for num in nums:\n        curr_sum += num\n        target = curr_sum - k\n        if target in prefix_sums:\n            total_subarrays += prefix_sums[target]\n        prefix_sums[curr_sum] = prefix_sums.get(curr_sum, 0) + 1\n    return total_subarrays',
                };
              }
            } else {
              // Written / Interview Evaluation
              const totalWords = answers.reduce((acc: number, a: any) => {
                const words = (a.text_answer || '').trim().split(/\s+/).filter(Boolean).length;
                return acc + words;
              }, 0);

              if (totalWords < 25) {
                // Very brief or incomplete answer
                score = 35;
                feedbackPayload = {
                  score_percentage: 35,
                  strengths: ['Basic keyword mentioned'],
                  weaknesses: [
                    'Incomplete Response: Answering with just a few words or half an explanation is insufficient for placement rounds.',
                    'Lacks Situation, Task, Action, and quantifiable Result (STAR framework).',
                    'No architectural trade-offs or technical decisions defended.'
                  ],
                  suggestions: 'Provide a structured answer with concrete architecture decisions, metrics, and trade-offs.',
                  model_answer: 'Structure response clearly: 1. Core architecture overview. 2. Operational trade-offs (latency vs consistency). 3. Failure recovery and telemetry.',
                };
              } else if (totalWords < 60) {
                score = 64;
                feedbackPayload = {
                  score_percentage: 64,
                  strengths: ['Identified main concept', 'Reasonable direction'],
                  weaknesses: [
                    'Partially developed answer: Needs more technical depth on edge failures and metrics.',
                    'Could elaborate on concurrency bottlenecks.'
                  ],
                  suggestions: 'Expand on quantifiable outcomes (e.g. p99 latency reduction, error budgets).',
                  model_answer: 'Include specific details on database isolation levels, caching strategies, and distributed logging.',
                };
              } else {
                score = 86;
                feedbackPayload = {
                  score_percentage: 86,
                  strengths: [
                    'Structured technical reasoning with clear context',
                    'Demonstrates practical understanding of trade-offs',
                    'Addresses resilience and observability'
                  ],
                  weaknesses: ['Could mention canary deployments or rollback strategies'],
                  suggestions: 'Excellent clarity. Continue maintaining this crisp, structured communication in final HR and system design rounds.',
                  model_answer: 'Ideal response clearly articulates the system constraints, evaluates two candidate approaches, justifies the selected design with benchmarks, and outlines recovery protocols.',
                };
              }
            }

            const attempt = {
              id: `attempt-${Date.now()}`,
              user_id: 'preview-user-id',
              stage_id,
              answers,
              score,
              max_score: 100,
              feedback: feedbackPayload,
              created_at: new Date().toISOString(),
            };

            resolve({
              attempt,
              new_best_score: score,
              readiness_score: score,
            } as unknown as T);
            return;
          }

          case 'chat_with_mentor': {
            const replies = [
              'Focus on explaining your thought process out loud before writing any code. Placement interviewers value communication structure as much as syntax!',
              'For technical MCQs, eliminate obviously wrong options first. Most tricky questions hinge on boundary conditions (0, negative numbers, overflow).',
              'In the HR round, anchor your responses in the STAR framework: Situation, Task, Action, and quantifiable Result.',
            ];
            const reply = replies[Math.floor(Math.random() * replies.length)];
            resolve({ reply } as unknown as T);
            return;
          }

          case 'tailor_resume': {
            resolve({
              tailored_content: `### Targeted Resume Tailoring Analysis\n\n**Keyword Alignment:**\n- Added High-Yield Keywords: Distributed Caching, Latency Optimization, Microservices, CI/CD, Containerization.\n\n**Optimized Bullet Points:**\n- Designed and deployed an asynchronous task ingestion pipeline using Redis & Node.js, reducing 95th-percentile response latency from 450ms to 110ms across 50,000+ daily requests.\n- Refactored monolith services into decoupled microservices, achieving 99.9% uptime and zero-downtime rolling updates.\n- Implemented automated end-to-end integration test suites boosting code coverage from 62% to 89%.\n\n**Strategic Advice for Interviews:**\n- Be prepared to draw the high-level architecture diagram for the distributed cache on a whiteboard.\n- Quantify trade-offs when asked why you chose Redis over in-memory hash maps.`,
            } as unknown as T);
            return;
          }

          case 'get_skill_recommendations': {
            resolve({
              strategicIdeas: [
                'Deep dive into Concurrency & Thread Synchronization primitives',
                'Practice Cache Invalidation & Eventual Consistency patterns',
                'Master SQL Indexing & Query Execution Plans (EXPLAIN ANALYZE)',
              ],
              courses: [
                { title: 'System Design Interview Fundamentals', provider: 'Google Cloud Skills & MIT OCW', description: 'Comprehensive walkthrough of horizontal scaling, load balancers, and distributed storage.' },
                { title: 'High-Performance PostgreSQL & Indexing', provider: 'PostgreSQL Tutorial & freeCodeCamp', description: 'B-tree vs GIN indexes, transaction isolation levels, and vacuuming.' },
                { title: 'Clean Architecture in Modern TypeScript', provider: 'Coursera / Open Source', description: 'Hexagonal architecture, dependency injection, and test-driven design.' },
              ],
            } as unknown as T);
            return;
          }

          case 'generate_curriculum': {
            const track = SEED_JOB_TRACKS.find((t) => t.id === payload.job_track_id) || SEED_JOB_TRACKS[0];
            const topics = [
              { id: `top-${track.id}-1`, job_track_id: track.id, topic_order: 1, title: `${track.core_topics[0]} Basics`, description: `Fundamental concepts and foundational problem solving in ${track.core_topics[0]}.`, difficulty: 'Beginner' },
              { id: `top-${track.id}-2`, job_track_id: track.id, topic_order: 2, title: `Intermediate ${track.core_topics[1]}`, description: `Common design patterns, edge cases, and performance tradeoffs.`, difficulty: 'Intermediate' },
              { id: `top-${track.id}-3`, job_track_id: track.id, topic_order: 3, title: `Applied ${track.core_topics[2]}`, description: `Practical production architecture and real-world system implementations.`, difficulty: 'Intermediate' },
              { id: `top-${track.id}-4`, job_track_id: track.id, topic_order: 4, title: `Advanced ${track.core_topics[3] || 'Optimization'}`, description: `High-scale concurrency, asynchronous state, and resiliency strategies.`, difficulty: 'Advanced' },
              { id: `top-${track.id}-5`, job_track_id: track.id, topic_order: 5, title: `Architectural Deep Dive: ${track.core_topics[4] || 'System Design'}`, description: `End-to-end design, trade-off matrices, and interview-ready defense.`, difficulty: 'Advanced' },
            ];
            resolve({ topics } as unknown as T);
            return;
          }

          case 'get_practice_examples': {
            resolve({
              examples: [
                {
                  title: 'Optimizing In-Memory Query Lookup with Hash Mapping',
                  problem: 'Given a continuous stream of user transaction IDs, design an efficient mechanism to detect duplicate IDs within a rolling 60-second window while minimizing memory consumption.',
                  solution_steps: [
                    'Step 1: Analyze constraints. A full persistent database query for every incoming packet introduces unacceptable I/O latency.',
                    'Step 2: Propose an in-memory sliding window using a combination of a Doubly Linked List and an Eviction Hash Map (or Redis Sorted Set with timestamps as scores).',
                    'Step 3: As records arrive, prune items older than (now - 60s) in O(log N) time, check existence in O(1), and insert with current timestamp.',
                  ],
                  takeaway: 'In placement interviews, always calculate the memory overhead for the worst-case throughput (e.g. 10k requests/sec * 60s * 32 bytes/UUID = ~19.2 MB RAM).',
                },
                {
                  title: 'Handling Race Conditions in Concurrent Balance Deductions',
                  problem: 'Two simultaneous checkout processes attempt to deduct from an account with $100 balance. How do you prevent double spending in a distributed relational database?',
                  solution_steps: [
                    'Step 1: Identify that standard read-then-write without isolation causes the classical Lost Update anomaly.',
                    'Step 2: Apply pessimistic locking with `SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;` within an ACID transaction.',
                    'Step 3: Alternatively, implement optimistic locking via a `version` column: `UPDATE accounts SET balance = balance - 100, version = version + 1 WHERE id = 1 AND version = :current_version;`.',
                  ],
                  takeaway: 'Mention both pessimistic and optimistic locking and explain that optimistic is superior under low contention, while pessimistic prevents high retry storms under high contention.',
                },
              ],
            } as unknown as T);
            return;
          }

          case 'recommend_next_topic': {
            resolve({
              recommended_topic: {
                id: 'top-recommended-1',
                title: 'Data Structures & Algorithms Basics',
                description: 'Core arrays, hash tables, and two-pointer traversal patterns tested in round 1 screening.',
                difficulty: 'Beginner',
                topic_order: 1,
              },
              reason: 'Recommended starting foundation to build algorithmic speed before tackling system design.',
            } as unknown as T);
            return;
          }

          case 'generate_assignment': {
            const assignmentId = `assign-${Date.now()}`;
            const questions = [
              {
                id: `aq-1`,
                assignment_id: assignmentId,
                question_order: 1,
                topic: 'Data Structures',
                prompt: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black)?',
                options: [
                  { id: 'A', text: 'O(log N)' },
                  { id: 'B', text: 'O(N)' },
                  { id: 'C', text: 'O(1)' },
                  { id: 'D', text: 'O(N log N)' },
                ],
              },
              {
                id: `aq-2`,
                assignment_id: assignmentId,
                question_order: 2,
                topic: 'System Architecture',
                prompt: 'Which HTTP status code is most appropriate when a requested resource exists but the authenticated client has insufficient permission to access it?',
                options: [
                  { id: 'A', text: '401 Unauthorized' },
                  { id: 'B', text: '403 Forbidden' },
                  { id: 'C', text: '404 Not Found' },
                  { id: 'D', text: '405 Method Not Allowed' },
                ],
              },
              {
                id: `aq-3`,
                assignment_id: assignmentId,
                question_order: 3,
                topic: 'Databases',
                prompt: 'In relational database indexing, what structural advantage does a B+ Tree offer over a traditional B Tree?',
                options: [
                  { id: 'A', text: 'All data records/pointers are stored exclusively in leaf nodes, enabling efficient range scans' },
                  { id: 'B', text: 'It uses O(1) hash lookups instead of branching' },
                  { id: 'C', text: 'It requires zero disk writes during node rebalancing' },
                  { id: 'D', text: 'It does not require sorted keys' },
                ],
              },
            ];

            resolve({
              assignment: {
                id: assignmentId,
                user_id: 'preview-user-id',
                job_track_id: payload.job_target_id || 'track-sde-1',
                target_topics: ['Data Structures', 'System Architecture', 'Databases'],
                status: 'pending',
                created_at: new Date().toISOString(),
              },
              questions,
            } as unknown as T);
            return;
          }

          case 'submit_assignment': {
            resolve({
              score: 100,
              accuracy_summary: {
                'Data Structures': { total: 1, correct: 1 },
                'System Architecture': { total: 1, correct: 1 },
                'Databases': { total: 1, correct: 1 },
              },
            } as unknown as T);
            return;
          }

          default:
            resolve({ message: `Action ${action} handled successfully` } as unknown as T);
        }
      } catch (e) {
        reject(e);
      }
    }, 250);
  });
}

function generateMockStageQuestions(stageId: string, stageType: string): Array<StageQuestion & { correct_answer: string }> {
  if (stageType === 'aptitude') {
    return [
      {
        id: `q-${stageId}-1`,
        stage_id: stageId,
        question_order: 1,
        question_type: 'mcq',
        prompt: 'A train 240 m in length crosses a telegraph post in 16 seconds. What is the speed of the train in km/hr?',
        options: [
          { id: 'A', text: '45 km/hr' },
          { id: 'B', text: '54 km/hr' },
          { id: 'C', text: '60 km/hr' },
          { id: 'D', text: '72 km/hr' },
        ],
        correct_answer: 'B',
      },
      {
        id: `q-${stageId}-2`,
        stage_id: stageId,
        question_order: 2,
        question_type: 'mcq',
        prompt: 'If in a certain code language, "CAMPUS" is written as "EDORWU", how will "OFFER" be written in that code?',
        options: [
          { id: 'A', text: 'QHHGT' },
          { id: 'B', text: 'QIHGT' },
          { id: 'C', text: 'PHHGT' },
          { id: 'D', text: 'QHHTG' },
        ],
        correct_answer: 'A',
      },
      {
        id: `q-${stageId}-3`,
        stage_id: stageId,
        question_order: 3,
        question_type: 'mcq',
        prompt: 'Pipe A can fill a tank in 4 hours, and Pipe B can empty it in 6 hours. If both pipes are opened simultaneously, in how many hours will the tank be full?',
        options: [
          { id: 'A', text: '8 hours' },
          { id: 'B', text: '10 hours' },
          { id: 'C', text: '12 hours' },
          { id: 'D', text: '14 hours' },
        ],
        correct_answer: 'C',
      },
      {
        id: `q-${stageId}-4`,
        stage_id: stageId,
        question_order: 4,
        question_type: 'mcq',
        prompt: 'Select the word that is most nearly opposite in meaning (Antonym) to "STRINGENT":',
        options: [
          { id: 'A', text: 'Rigorous' },
          { id: 'B', text: 'Lenient' },
          { id: 'C', text: 'Austere' },
          { id: 'D', text: 'Dogmatic' },
        ],
        correct_answer: 'B',
      },
      {
        id: `q-${stageId}-5`,
        stage_id: stageId,
        question_order: 5,
        question_type: 'mcq',
        prompt: 'Two dice are tossed once. What is the probability of getting a total sum greater than 9?',
        options: [
          { id: 'A', text: '1/6' },
          { id: 'B', text: '5/36' },
          { id: 'C', text: '1/4' },
          { id: 'D', text: '7/36' },
        ],
        correct_answer: 'A',
      },
    ];
  }

  if (stageType === 'technical_mcq') {
    return [
      {
        id: `q-${stageId}-1`,
        stage_id: stageId,
        question_order: 1,
        question_type: 'mcq',
        prompt: 'Which data structure is optimal for implementing an LRU (Least Recently Used) cache with O(1) get and put operations?',
        options: [
          { id: 'A', text: 'Single Linked List with Binary Search' },
          { id: 'B', text: 'Doubly Linked List combined with a Hash Map' },
          { id: 'C', text: 'Binary Min-Heap' },
          { id: 'D', text: 'Array backed by a Stack' },
        ],
        correct_answer: 'B',
      },
      {
        id: `q-${stageId}-2`,
        stage_id: stageId,
        question_order: 2,
        question_type: 'mcq',
        prompt: 'In SQL, which clause is executed AFTER GROUP BY but BEFORE SELECT in standard query processing order?',
        options: [
          { id: 'A', text: 'WHERE' },
          { id: 'B', text: 'HAVING' },
          { id: 'C', text: 'ORDER BY' },
          { id: 'D', text: 'LIMIT' },
        ],
        correct_answer: 'B',
      },
      {
        id: `q-${stageId}-3`,
        stage_id: stageId,
        question_order: 3,
        question_type: 'mcq',
        prompt: 'Under what condition does a Deadlock occur in a multi-threaded concurrent application?',
        options: [
          { id: 'A', text: 'Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait' },
          { id: 'B', text: 'Only when CPU core utilization exceeds 95%' },
          { id: 'C', text: 'When threads share read-only memory locations without mutexes' },
          { id: 'D', text: 'Whenever asynchronous promises fail to reject errors' },
        ],
        correct_answer: 'A',
      },
      {
        id: `q-${stageId}-4`,
        stage_id: stageId,
        question_order: 4,
        question_type: 'mcq',
        prompt: 'What is the primary architectural purpose of a Reverse Proxy (e.g., NGINX / Cloudflare)?',
        options: [
          { id: 'A', text: 'Intercepting outbound client requests to enforce corporate firewalls' },
          { id: 'B', text: 'Terminating SSL, load balancing traffic, and caching responses in front of backend servers' },
          { id: 'C', text: 'Replacing database query indexes with RAM tables' },
          { id: 'D', text: 'Compiling JavaScript bundle chunks at runtime' },
        ],
        correct_answer: 'B',
      },
      {
        id: `q-${stageId}-5`,
        stage_id: stageId,
        question_order: 5,
        question_type: 'mcq',
        prompt: 'Which REST API HTTP method is strictly required by the HTTP specification to be idempotent?',
        options: [
          { id: 'A', text: 'POST' },
          { id: 'B', text: 'PUT' },
          { id: 'C', text: 'PATCH (by default)' },
          { id: 'D', text: 'CONNECT' },
        ],
        correct_answer: 'B',
      },
    ];
  }

  if (stageType === 'coding') {
    return [
      {
        id: `q-${stageId}-1`,
        stage_id: stageId,
        question_order: 1,
        question_type: 'coding',
        prompt: `### Applied Coding Challenge: Subarray Sum Equals Target K\n\nGiven an array of integers \`nums\` and an integer \`k\`, return the total number of continuous subarrays whose sum equals to \`k\`.\n\n**Constraints:**\n- \`1 <= nums.length <= 2 * 10^4\`\n- \`-1000 <= nums[i] <= 1000\`\n- \`-10^7 <= k <= 10^7\`\n\n**Task:** Write an optimal clean solution in TypeScript/Python/Java. Clearly state your time and space complexity, and detail how prefix sums with a hash map avoids the naive O(N^2) brute-force.`,
        options: null,
        correct_answer: 'Prefix sum hash map approach: O(N) time and O(N) space. Handles negative numbers seamlessly by storing cumulative frequency of prefix sums.',
      },
    ];
  }

  if (stageType === 'technical_interview') {
    return [
      {
        id: `q-${stageId}-1`,
        stage_id: stageId,
        question_order: 1,
        question_type: 'open_ended',
        prompt: 'Explain the difference between Optimistic Concurrency Control and Pessimistic Locking. Under what operational conditions would you choose one over the other in a payment wallet system?',
        options: null,
        correct_answer: 'Rubric: Explains lock acquisition vs version number checks, throughput implications, deadlocks, and trade-offs under high vs low contention.',
      },
      {
        id: `q-${stageId}-2`,
        stage_id: stageId,
        question_order: 2,
        question_type: 'open_ended',
        prompt: 'Imagine an API endpoint is intermittently timing out during peak morning campus registration traffic. Walk me through your step-by-step diagnostic and remediation process.',
        options: null,
        correct_answer: 'Rubric: Checks load balancer logs, database connection pool exhaustion, slow queries via EXPLAIN, cache hit ratios, and horizontal autoscaling thresholds.',
      },
      {
        id: `q-${stageId}-3`,
        stage_id: stageId,
        question_order: 3,
        question_type: 'open_ended',
        prompt: 'How would you architect a real-time notification service delivering placement interview alerts to 10,000 students simultaneously without dropping messages?',
        options: null,
        correct_answer: 'Rubric: Message broker (Kafka/RabbitMQ/Redis PubSub), WebSocket connection gateway, worker queues, idempotency keys, and retry dead-letter queues.',
      },
    ];
  }

  // hr_interview
  return [
    {
      id: `q-${stageId}-1`,
      stage_id: stageId,
      question_order: 1,
      question_type: 'open_ended',
      prompt: 'Tell me about a time you faced a critical roadblock during a technical team project with a tight deadline. How did you handle the situation, and what was the outcome?',
      options: null,
      correct_answer: 'STAR evaluation: Clear situation, task owned, constructive proactive action (communication/triage), and measurable positive resolution.',
    },
    {
      id: `q-${stageId}-2`,
      stage_id: stageId,
      question_order: 2,
      question_type: 'open_ended',
      prompt: 'Why do you want to pursue this specific technical role at our organization, and how does it fit into your long-term engineering career trajectory?',
      options: null,
      correct_answer: 'Specific motivation, genuine interest in technology problems, continuous learning mindset, and self-awareness.',
    },
    {
      id: `q-${stageId}-3`,
      stage_id: stageId,
      question_order: 3,
      question_type: 'open_ended',
      prompt: 'Describe a situation where you received tough or critical feedback on your code or project presentation. How did you react, and what changes did you implement?',
      options: null,
      correct_answer: 'Humility, feedback receptivity, non-defensive attitude, growth mindset, and concrete corrective adjustments made.',
    },
  ];
}
