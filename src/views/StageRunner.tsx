// ==============================================================================
// Placement Prep Platform - StageRunner View (Section 16.5 Spec)
// High-fidelity 5-stage stepper, large MCQ radio cards, code editor aesthetic,
// chat-bubble interview layout, structured feedback rubric, and celebratory score reveal.
// ==============================================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useJobTargets } from '../context/JobTargetsContext';
import { invokeAiAction } from '../lib/edgeApi';
import { StageQuestion, SubmittedAnswer, StageAttempt, PrepStage } from '../types';
import confetti from 'canvas-confetti';
import {
  Brain,
  CodeXml,
  Terminal,
  MessagesSquare,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  ChevronRight,
  Clock,
  Send,
  HelpCircle,
  Check,
  ChevronDown,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Loader2,
} from 'lucide-react';

const stageLabels = [
  'Aptitude & Logical Reasoning',
  'Verbal & Communication',
  'Technical Knowledge',
  'Coding Challenge',
  'HR & Behavioural',
];

export const StageRunner: React.FC = () => {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const { stages, updateStageBestScore, activeTarget, peerPercentile, triggerConfetti } = useJobTargets();

  const [stage, setStage] = useState<PrepStage | null>(null);
  const [questions, setQuestions] = useState<StageQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Loading round questions...');

  // User responses
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [codeSolution, setCodeSolution] = useState<string>('');
  const [interviewAnswers, setInterviewAnswers] = useState<Record<string, string>>({});
  const [currentInterviewIndex, setCurrentInterviewIndex] = useState<number>(0);

  // Voice API State (Section 18.3)
  const [readOnlyMode, setReadOnlyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('prepgated_voice_readonly') === 'true';
    } catch {
      return false;
    }
  });
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  // Speak helper using Web Speech API (SpeechSynthesis)
  const speak = (text: string) => {
    if (readOnlyMode || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice =
        voices.find((v) => v.lang === 'en-US' && v.name.includes('Natural')) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];
      if (naturalVoice) utterance.voice = naturalVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const toggleReadOnlyMode = () => {
    const nextVal = !readOnlyMode;
    setReadOnlyMode(nextVal);
    try {
      localStorage.setItem('prepgated_voice_readonly', String(nextVal));
    } catch {}
    if (nextVal && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Timer for MCQ stages
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // Completed Attempt Results
  const [attemptResult, setAttemptResult] = useState<StageAttempt | null>(null);
  const [showDetailedFeedback, setShowDetailedFeedback] = useState<boolean>(false);

  // Score Reveal Modal for final stage completion
  const [showScoreReveal, setShowScoreReveal] = useState<boolean>(false);
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Find stage metadata
  useEffect(() => {
    if (stageId) {
      const match = stages.find((s) => s.id === stageId);
      if (match && match.id !== stage?.id) {
        setStage(match);
      }
    }
  }, [stageId, stages, stage?.id]);

  // Timer effect
  useEffect(() => {
    if (stage && (stage.stage_type === 'aptitude' || stage.stage_type === 'technical_mcq')) {
      const interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage?.id]);

  // Load questions
  useEffect(() => {
    if (!stageId) return;

    let isMounted = true;
    setLoading(true);
    setStatusMessage('Generating placement assessment questions via Gemini...');

    invokeAiAction<{ questions: StageQuestion[] }>('generate_stage_questions', {
      stage_id: stageId,
      stage_type: stage?.stage_type || 'aptitude',
    })
      .then((res) => {
        if (!isMounted) return;
        if (res?.questions) {
          setQuestions(res.questions);
          if (stage?.stage_type === 'coding') {
            setCodeSolution(`def solve(nums: list[int], k: int) -> int:
    """
    Given an integer array nums and an integer k, return the total number
    of continuous subarrays whose sum equals to k.
    Optimal Time Complexity: O(n) | Space Complexity: O(n)
    """
    # Write your complete algorithm below:
    pass
`);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load questions:', err);
        setStatusMessage('Error loading questions. Please try again.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [stageId, stage?.stage_type]);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!stageId || !stage) return;

    setSubmitting(true);
    setStatusMessage('Gemini is reviewing your answers...');

    const formattedAnswers: SubmittedAnswer[] = questions.map((q) => {
      if (q.question_type === 'mcq') {
        return {
          question_id: q.id,
          question_order: q.question_order,
          selected_option_id: mcqAnswers[q.id] || '',
        };
      }
      if (q.question_type === 'coding') {
        return {
          question_id: q.id,
          question_order: q.question_order,
          solution: codeSolution,
        };
      }
      return {
        question_id: q.id,
        question_order: q.question_order,
        text_answer: interviewAnswers[q.id] || '',
      };
    });

    try {
      const res = await invokeAiAction<{
        attempt: StageAttempt;
        new_best_score: number;
        readiness_score: number;
      }>('submit_stage_attempt', {
        stage_id: stageId,
        answers: formattedAnswers,
      });

      if (res?.attempt) {
        setAttemptResult(res.attempt);
        updateStageBestScore(stageId, res.new_best_score);

        // If this is stage 5 or all 5 cleared, trigger the Score Reveal Modal
        if (stage.stage_order === 5 || res.readiness_score >= 80) {
          setShowScoreReveal(true);
          // Animate score counter
          let count = 0;
          const targetScore = res.readiness_score;
          const step = Math.max(1, Math.floor(targetScore / 25));
          const timer = setInterval(() => {
            count += step;
            if (count >= targetScore) {
              setAnimatedScore(targetScore);
              clearInterval(timer);
            } else {
              setAnimatedScore(count);
            }
          }, 45);

          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#6366f1', '#22d3ee', '#4ade80', '#facc15', '#f43f5e'],
          });
        } else if (res.new_best_score >= 70) {
          triggerConfetti();
        }
      }
    } catch (err) {
      console.error('Error submitting attempt:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAttemptResult(null);
    setMcqAnswers({});
    setCurrentInterviewIndex(0);
    setInterviewAnswers({});
    setSecondsElapsed(0);
  };

  if (loading) {
    return (
      <div className="min-h-[520px] card-premium p-8 flex flex-col items-center justify-center space-y-4 text-center">
        {/* Skeleton UI per Section 16.5 spec */}
        <div className="w-full max-w-lg space-y-4">
          <div className="h-6 w-32 bg-zinc-800 rounded-lg animate-pulse mx-auto" />
          <div className="h-20 bg-zinc-950 border border-zinc-800 rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-12 bg-zinc-950 border border-zinc-800 rounded-xl animate-pulse" />
            <div className="h-12 bg-zinc-950 border border-zinc-800 rounded-xl animate-pulse" />
            <div className="h-12 bg-zinc-950 border border-zinc-800 rounded-xl animate-pulse" />
          </div>
        </div>
        <p className="text-xs font-mono text-zinc-400 mt-2">{statusMessage}</p>
      </div>
    );
  }

  // ============================================================================
  // RENDER: Attempt Evaluation Results with Structured Feedback
  // ============================================================================
  if (attemptResult) {
    const feedback = attemptResult.feedback;
    const score = attemptResult.score;
    const isPassing = score >= 70;
    const nextStage = stages.find((s) => s.stage_order === (stage?.stage_order || 0) + 1);
    const nextStageOrder = (stage?.stage_order || 0) + 1;

    // Full-screen Stage Completion Overlay per Section 16.6 Spec
    if (isPassing && !showDetailedFeedback) {
      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 text-center select-none bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, rgba(10,10,12,0.65) 0%, rgba(10,10,12,0.85) 65%, #0a0a0c 100%),
              url('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80')
            `,
          }}
        >
          <div className="max-w-md space-y-4 z-10 p-6">
            {/* Stage name in caps */}
            <span className="text-[11px] font-semibold tracking-[1px] uppercase text-[#818cf8] font-mono block">
              {stage?.title || `Stage ${stage?.stage_order}`}
            </span>

            {/* Large H1 */}
            <h1
              className="text-[#fafafa] font-bold tracking-tight leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
            >
              Stage {stage?.stage_order} Cleared
            </h1>

            {/* One-line encouragement */}
            <p className="text-base text-[#71717a] leading-relaxed max-w-sm mx-auto">
              {stage?.stage_order === 5
                ? "You've successfully completed all 5 stages in this placement track."
                : "You've unlocked the next gate. Keep going."}
            </p>

            {/* Score chip */}
            <div className="pt-1">
              <span className="chip-stat font-mono text-xs">
                {score}% Score · Verified Passing
              </span>
            </div>

            {/* Single indigo CTA button */}
            <div className="pt-4 flex flex-col items-center gap-3">
              {nextStage ? (
                <button
                  type="button"
                  onClick={() => {
                    setAttemptResult(null);
                    setShowDetailedFeedback(false);
                    navigate(`/stages/${nextStage.id}`);
                  }}
                  className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-[14px] py-2.5 px-6 rounded-[6px] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Continue to Stage {nextStageOrder}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-[14px] py-2.5 px-6 rounded-[6px] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>View Certified Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Plain text link below */}
              <div className="flex items-center gap-4 text-xs text-[#71717a] pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  View progress
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => setShowDetailedFeedback(true)}
                  className="hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  Inspect detailed rubric
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-slide-in">
        {/* Results Header Card */}
        <div className="card-premium card-score-glow p-6 md:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              {/* Score Chip */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 text-sm font-bold font-mono">
                <span>{score} / 100</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">
                {stage?.title} Evaluation
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  isPassing
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                }`}
              >
                {isPassing ? 'Stage Cleared' : 'Needs Review (<70%)'}
              </span>
            </div>
          </div>

          {/* Structured Feedback Blocks per Section 16.5 Spec */}
          <div className="space-y-4 pt-2">
            {/* Strengths — green left-border block */}
            {feedback?.strengths && feedback.strengths.length > 0 && (
              <div className="p-4 rounded-r-xl bg-zinc-950 border-l-4 border-emerald-500">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Strengths Demonstrated
                </h4>
                <ul className="space-y-1 text-xs text-zinc-300 list-disc list-inside">
                  {feedback.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses — red left-border block */}
            {feedback?.weaknesses && feedback.weaknesses.length > 0 && (
              <div className="p-4 rounded-r-xl bg-zinc-950 border-l-4 border-red-500">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5 mb-2">
                  <XCircle className="w-3.5 h-3.5" />
                  Weaknesses & Edge-Cases Missed
                </h4>
                <ul className="space-y-1 text-xs text-zinc-300 list-disc list-inside">
                  {feedback.weaknesses.map((weak, idx) => (
                    <li key={idx}>{weak}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions — yellow left-border block */}
            {feedback?.suggestions && (
              <div className="p-4 rounded-r-xl bg-zinc-950 border-l-4 border-yellow-500">
                <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5 mb-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Actionable Next Steps
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{feedback.suggestions}</p>
              </div>
            )}

            {/* Model Answer — collapsible details with indigo left-border & monospace */}
            {feedback?.model_answer && (
              <details className="group p-4 rounded-r-xl bg-zinc-950 border-l-4 border-indigo-500 cursor-pointer">
                <summary className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-between select-none">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Model Answer & Ideal Implementation
                  </span>
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-3 pt-3 border-t border-zinc-800 text-xs text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {feedback.model_answer}
                </div>
              </details>
            )}

            {/* Question by question breakdown if MCQ */}
            {feedback?.breakdowns && feedback.breakdowns.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-zinc-400">Detailed Answer Breakdown</h4>
                {feedback.breakdowns.map((b, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs ${
                      b.is_correct
                        ? 'border-emerald-800/40 bg-emerald-950/20 text-emerald-300'
                        : 'border-red-800/40 bg-red-950/20 text-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-zinc-200">Question {b.question_order}</span>
                      <span className="font-mono text-[11px]">{b.is_correct ? 'Correct (+1)' : 'Incorrect (0)'}</span>
                    </div>
                    <p className="text-zinc-300 mb-2">{b.prompt}</p>
                    {!b.is_correct && b.correct_answer && (
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px]">
                        Correct Answer: {b.correct_answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-zinc-800 flex items-center justify-between gap-3">
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Round</span>
            </button>

            <div className="flex items-center gap-2">
              <NavLink
                to="/dashboard"
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-700 hover:border-zinc-600 text-zinc-300 transition-colors"
              >
                Dashboard
              </NavLink>

              {nextStage && (
                <NavLink
                  to={`/stages/${nextStage.id}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>Proceed to Stage {nextStage.stage_order}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Readiness Score Reveal Modal */}
        {showScoreReveal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md card-premium card-score-glow p-8 text-center space-y-5 animate-slide-in">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 shadow-inner">
                <Trophy className="h-8 w-8 text-indigo-400" />
              </div>

              <div>
                <h3 className="text-2xl font-bold tracking-tight text-white">Interview Readiness Revealed</h3>
                <p className="text-xs text-zinc-400 mt-1">Based on calibrated peer rubrics across all 5 evaluation stages</p>
              </div>

              <div className="py-4">
                <div className="text-7xl font-black font-mono tracking-tight text-white tabular-nums">
                  {animatedScore}
                </div>
                <div className="text-zinc-500 text-sm font-mono mt-1">out of 100</div>

                <div className="mt-4 inline-flex items-center gap-1.5 bg-cyan-500/20 text-cyan-400 rounded-full px-4 py-1.5 text-xs font-semibold border border-cyan-500/40">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Top {100 - peerPercentile}% of peers nationwide</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowScoreReveal(false);
                  navigate('/dashboard');
                }}
                className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Return to Placement Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // RENDER: Active Stage Runner Interactive Form
  // ============================================================================
  const isMcq = stage?.stage_type === 'aptitude' || stage?.stage_type === 'technical_mcq';
  const isCoding = stage?.stage_type === 'coding';
  const isInterview = stage?.stage_type === 'technical_interview' || stage?.stage_type === 'hr_interview';

  const isMcqReadyToSubmit = questions.length > 0 && questions.every((q) => mcqAnswers[q.id]);
  const isCodingReady = codeSolution.trim().length > 20;
  const isInterviewReady = questions.length > 0 && Object.keys(interviewAnswers).length === questions.length;

  const canSubmit = isMcq ? isMcqReadyToSubmit : isCoding ? isCodingReady : isInterviewReady;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* 1. Horizontal Progress Strip at Top (5 Steps per Section 16.5 Spec) */}
      <div className="card-premium p-4 md:p-5">
        <div className="relative flex items-center justify-between max-w-xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-zinc-800 -z-0" />

          {stages.slice(0, 5).map((stg, i) => {
            const isCompleted = stg.best_score !== null;
            const isCurrent = stg.id === stage?.id;
            const isLocked = !stg.unlocked;

            return (
              <div
                key={stg.id}
                className="flex flex-col items-center gap-1.5 relative z-10"
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isCompleted
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-950 animate-pulse'
                      : isLocked
                      ? 'bg-zinc-800 text-zinc-500'
                      : 'bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : i + 1}
                </div>
                <span className="text-[10px] font-semibold tracking-tight text-zinc-400">
                  {stageLabels[i] || `Stage ${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Stage Card (min-h-[520px] per spec) */}
      <div className="card-premium min-h-[520px] p-6 md:p-8 flex flex-col justify-between relative">
        {/* Stage Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Stage {stage?.stage_order} of 5
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                {isMcq ? 'Autograded MCQ Round' : isCoding ? 'Architectural Code Evaluation' : 'Interactive Interview Simulation'}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">{stage?.title}</h2>
          </div>

          {/* Compact Timer for Aptitude / MCQ */}
          {isMcq && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Elapsed: {formatTime(secondsElapsed)}</span>
            </div>
          )}
        </div>

        {/* 3. Stage Specific Content */}
        <div className="flex-1">
          {/* MCQ STAGES (Aptitude & Technical MCQ) */}
          {isMcq && (
            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={q.id} className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2 py-1 rounded border border-indigo-800/60">
                      Q{qIndex + 1}
                    </span>
                    <p className="text-sm font-semibold text-zinc-100 leading-relaxed pt-0.5">
                      {q.prompt}
                    </p>
                  </div>

                  {/* Large Radio Cards (Buttons per Section 16.5 Spec) */}
                  <div className="grid grid-cols-1 gap-2.5 pl-8" role="radiogroup">
                    {q.options?.map((opt) => {
                      const isSelected = mcqAnswers[q.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setMcqAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                          className={`border rounded-xl px-4 py-3 text-left w-full transition-all cursor-pointer flex items-center justify-between text-xs ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500'
                              : 'border-zinc-800 hover:border-indigo-500 hover:bg-indigo-500/10 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                                isSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CODING STAGE */}
          {isCoding && (
            <div className="space-y-4">
              {questions[0] && (
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2">
                  <h3 className="text-sm font-bold text-zinc-200">Algorithmic Problem Specification</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                    {questions[0].prompt}
                  </p>
                </div>
              )}

              {/* Code Editor Aesthetic */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/90 text-xs text-zinc-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    <span className="ml-2 font-semibold text-zinc-300">solution.py</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCodeSolution(`def solve(nums: list[int], k: int) -> int:
    prefix_sums = {0: 1}
    curr_sum = 0
    total_subarrays = 0
    for num in nums:
        curr_sum += num
        target = curr_sum - k
        if target in prefix_sums:
            total_subarrays += prefix_sums[target]
        prefix_sums[curr_sum] = prefix_sums.get(curr_sum, 0) + 1
    return total_subarrays`)
                      }
                      className="text-[10px] text-[#6366f1] hover:underline cursor-pointer"
                    >
                      Fill Complete Solution
                    </button>
                    <span className="text-[11px] text-zinc-500">Python 3.12 · Strict Rubric</span>
                  </div>
                </div>

                <textarea
                  value={codeSolution}
                  onChange={(e) => setCodeSolution(e.target.value)}
                  rows={14}
                  className="w-full bg-zinc-950 font-mono text-xs text-zinc-200 p-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                  placeholder="# Write your optimal algorithm here..."
                />
              </div>
            </div>
          )}

          {/* INTERVIEW STAGES (Technical & HR Interview Chat Bubble Layout) */}
          {isInterview && questions.length > 0 && (
            <div className="space-y-6">
              {/* Stepper through interview questions & Voice Controls (Section 18.3) */}
              <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 gap-2 text-xs text-zinc-500">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Question {currentInterviewIndex + 1} of {questions.length}
                  </span>
                  {/* Replay Question TTS Button */}
                  <button
                    type="button"
                    onClick={() => speak(questions[currentInterviewIndex]?.prompt)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    title="Replay question audio"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Replay Audio</span>
                  </button>

                  {/* Read Only Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleReadOnlyMode}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      readOnlyMode
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                        : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300'
                    }`}
                    title="Toggle Read Only (Silent Mode)"
                  >
                    {readOnlyMode ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{readOnlyMode ? 'Silent Mode' : 'Voice Mode'}</span>
                  </button>
                </div>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                  STAR Behavioral & Technical Rubric
                </span>
              </div>

              {/* Chat Bubble Layout per Section 16.5 & 18.3 Spec */}
              <div className="space-y-4">
                {/* Interviewer Gemini Question: Left-aligned bubble */}
                <div className="flex items-start gap-3 max-w-2xl">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 text-indigo-500 text-xs font-bold shadow-sm">
                    AI
                  </div>
                  <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-zinc-800 dark:text-zinc-200 shadow-sm leading-relaxed border border-zinc-200 dark:border-zinc-700/60">
                    <p className="font-semibold text-indigo-600 dark:text-indigo-300 mb-1 flex items-center justify-between">
                      <span>Interviewer (Audio Question)</span>
                      <button
                        type="button"
                        onClick={() => speak(questions[currentInterviewIndex]?.prompt)}
                        className="text-zinc-400 hover:text-indigo-500 p-0.5"
                        title="Listen to question"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </p>
                    <p>{questions[currentInterviewIndex]?.prompt}</p>
                  </div>
                </div>

                {/* Candidate Answer: Right-aligned textarea styled as a bubble */}
                <div className="flex flex-col items-end gap-2 max-w-2xl ml-auto">
                  <div className="w-full bg-indigo-50/50 dark:bg-indigo-600/15 border border-indigo-200 dark:border-indigo-500/40 rounded-2xl rounded-tr-sm p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-300 font-medium">
                      <span>Your Response</span>
                      <span>Target: Clear context, action, result</span>
                    </div>
                    <textarea
                      value={interviewAnswers[questions[currentInterviewIndex]?.id] || ''}
                      onChange={(e) =>
                        setInterviewAnswers((prev) => ({
                          ...prev,
                          [questions[currentInterviewIndex].id]: e.target.value,
                        }))
                      }
                      rows={5}
                      className="w-full bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
                      placeholder="Outline the situation, your specific engineering decisions, and measurable outcomes (type or click Speak your answer)..."
                    />
                  </div>

                  {/* Speech to Text Mic Button (Section 18.3) */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                        if (!SpeechRec) {
                          setVoiceSupported(false);
                          return;
                        }

                        if (isRecording && recognitionInstance) {
                          recognitionInstance.stop();
                          setIsRecording(false);
                          return;
                        }

                        try {
                          const recognition = new SpeechRec();
                          recognition.continuous = true;
                          recognition.interimResults = true;
                          recognition.lang = 'en-US';

                          recognition.onresult = (event: any) => {
                            const transcript = Array.from(event.results)
                              .map((r: any) => r[0].transcript)
                              .join('');
                            const qId = questions[currentInterviewIndex]?.id;
                            if (qId) {
                              setInterviewAnswers((prev) => ({
                                ...prev,
                                [qId]: transcript,
                              }));
                            }
                          };

                          recognition.onerror = () => {
                            setIsRecording(false);
                          };

                          recognition.onend = () => {
                            setIsRecording(false);
                          };

                          recognition.start();
                          setRecognitionInstance(recognition);
                          setIsRecording(true);
                        } catch (err) {
                          console.warn('SpeechRecognition start error:', err);
                          setVoiceSupported(false);
                        }
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isRecording
                          ? 'border border-[#ef4444] text-[#ef4444] animate-pulse bg-red-500/10'
                          : 'border border-zinc-300 dark:border-[#27272a] text-zinc-600 dark:text-[#71717a] hover:text-zinc-900 dark:hover:text-zinc-200 bg-white dark:bg-[#18181b]'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{isRecording ? 'Recording... click to stop' : 'Speak your answer'}</span>
                    </button>

                    {!voiceSupported && (
                      <span className="text-[11px] text-amber-500 font-mono">
                        Voice input not supported in this browser — type your answer above.
                      </span>
                    )}
                  </div>
                </div>

                {/* Interview navigation buttons */}
                <div className="flex justify-end gap-2 pt-2">
                  {currentInterviewIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentInterviewIndex((prev) => prev - 1)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                    >
                      Previous Question
                    </button>
                  )}
                  {currentInterviewIndex < questions.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentInterviewIndex((prev) => prev + 1)}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer"
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Submitting & Thinking Indicator / Action Button */}
        <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
          <NavLink
            to="/dashboard"
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            ← Exit to Dashboard
          </NavLink>

          {submitting ? (
            /* Animated Thinking Indicator per Section 16.5 Spec */
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              </span>
              <span>Gemini is reviewing your submission…</span>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Submit for Rubric Evaluation</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
