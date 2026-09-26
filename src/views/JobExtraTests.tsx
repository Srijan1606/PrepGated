// ==============================================================================
// PrepGated - Job-Specific Extra Hard Tests View
// - High-difficulty challenges tailored specifically to the target job
// - Deep architectural edge cases, concurrency spikes, and partition healing
// - Performance evaluation with conclusion summary + percentile ranking
// - Seamless Dark & Light Mode theme integration
// ==============================================================================

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IN_DEMAND_JOBS_2026 } from '../data/marketJobs2026';
import {
  requestExtraHardTests,
  requestExtraHardEvaluation,
  ExtraHardChallenge,
  ExtraHardTestEvaluation,
  MOTIVATION_CLOSING_PHRASE,
} from '../lib/geminiClient';
import {
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trophy,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JobExtraTests: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialRole = location.state?.jobTitle || IN_DEMAND_JOBS_2026[0].title;
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>(initialRole);

  const [isLoading, setIsLoading] = useState(false);
  const [challenges, setChallenges] = useState<ExtraHardChallenge[]>([]);
  const [isTestActive, setIsTestActive] = useState(false);
  const [candidateAnswers, setCandidateAnswers] = useState<Record<string, string>>({});

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<ExtraHardTestEvaluation | null>(null);

  const handleStartHardTest = async () => {
    setIsLoading(true);
    setEvaluation(null);
    setCandidateAnswers({});

    try {
      const data = await requestExtraHardTests(selectedJobTitle);
      setChallenges(data);
      setIsTestActive(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateHardTest = async () => {
    setIsEvaluating(true);
    try {
      const result = await requestExtraHardEvaluation(selectedJobTitle, challenges, candidateAnswers);
      setEvaluation(result);
      setIsTestActive(false);

      if (result.score >= 75) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-600 dark:text-rose-400 font-mono block">
          Elite Verification Benchmark
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-display mt-0.5">
          Job-Specific Extra Hard Tests & Edge Diagnostic
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Rigorous scenario challenges designed specifically for elite candidates applying to {selectedJobTitle}.
        </p>
      </div>

      {/* Role Selection & Start Screen */}
      {!isTestActive && !evaluation && (
        <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 font-mono block">
              Target Role Specification
            </label>
            <select
              value={selectedJobTitle}
              onChange={(e) => setSelectedJobTitle(e.target.value)}
              className="bg-zinc-50 dark:bg-[#181a24] border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-xs font-semibold px-3.5 py-2.5 outline-none focus:border-[#4f46e5] min-w-[320px] cursor-pointer"
            >
              {IN_DEMAND_JOBS_2026.map((job) => (
                <option key={job.id} value={job.title}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-semibold font-mono">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Rigorous Bar-Raiser Calibration</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              These hard tests assess production failure mode containment, extreme throughput resilience, zero data loss guarantees, and deep architectural trade-offs.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleStartHardTest}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <span>{isLoading ? 'Generating Hard Challenges...' : 'Initialize Extra Hard Test'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE TEST CHALLENGES */}
      {isTestActive && challenges.length > 0 && (
        <div className="space-y-6 animate-slide-in">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 text-xs">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
              Elite Assessment · 2 Hard Challenges
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Suggested: 45 Minutes</span>
            </span>
          </div>

          <div className="space-y-6">
            {challenges.map((c, idx) => (
              <div key={c.id} className="p-6 rounded-2xl bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-rose-600 dark:text-rose-400 font-bold">
                    Challenge {idx + 1}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    Time Limit: {c.time_limit_minutes}m
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-snug">{c.title}</h3>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {c.description}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 font-semibold block">
                    Core Technical & Grading Criteria:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.grading_criteria.map((con: string, cIdx: number) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono"
                      >
                        {con}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 font-semibold block">
                    Your Proposed Solution & Architecture Trade-offs:
                  </label>
                  <textarea
                    rows={6}
                    value={candidateAnswers[c.id] || ''}
                    onChange={(e) =>
                      setCandidateAnswers({ ...candidateAnswers, [c.id]: e.target.value })
                    }
                    placeholder="Describe step-by-step mitigation, data structure selection, replication topologies, and failure-containment boundaries..."
                    className="w-full bg-zinc-50 dark:bg-[#181a24] border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-[#4f46e5] font-mono leading-relaxed"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={isEvaluating}
                onClick={handleEvaluateHardTest}
                className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>{isEvaluating ? 'Evaluating Deep Architectural Answers...' : 'Submit Extra Hard Solutions'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVALUATION RESULTS */}
      {evaluation && (
        <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 animate-slide-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 font-mono block">
                Official Benchmark Verification
              </span>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">
                Extra Hard Diagnostic Results · {selectedJobTitle}
              </h2>
            </div>

            <div className="text-right flex items-center gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Percentile Rank</span>
                <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  {evaluation.percentile_rank}
                </span>
              </div>
              <span className="px-3 py-1 rounded-md text-xs font-bold font-mono bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
                {evaluation.score}% Score
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 space-y-1 text-xs">
            <span className="font-mono text-zinc-500 dark:text-zinc-400 uppercase font-semibold block">Conclusion Summary</span>
            <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed">{evaluation.conclusion_summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Strengths</span>
              </span>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
                {evaluation.strengths.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-4 h-4" />
                <span>Advanced Tuning Opportunities</span>
              </span>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
                {evaluation.improvements.map((imp, idx) => (
                  <li key={idx}>• {imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Motivational Closing System */}
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-center space-y-1">
            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 font-mono leading-relaxed">
              {evaluation.motivational_message || MOTIVATION_CLOSING_PHRASE}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleStartHardTest}
              className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#181a24] hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
            >
              Re-attempt Challenges
            </button>
            <button
              type="button"
              onClick={() => navigate('/market')}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold py-2 px-5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Explore More Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
