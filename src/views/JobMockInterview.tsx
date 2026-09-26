// ==============================================================================
// PrepGated - Job-Specific Mock Interview Simulation
// - Generates realistic 4-question mock interviews tailored to the target job
// - Grades technical depth, STAR behavioral structure, trade-offs, and communication fluency
// - Full Light & Dark mode support
// - Motivational closing system: "All the best for your work! You’ve got this — go crush it!"
// ==============================================================================

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IN_DEMAND_JOBS_2026, getJobById } from '../data/marketJobs2026';
import {
  requestMockInterviewQuestions,
  requestMockInterviewEvaluation,
  MockInterviewQuestion,
  MockInterviewEvaluation,
  MOTIVATION_CLOSING_PHRASE,
} from '../lib/geminiClient';
import {
  Mic,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Video,
  ExternalLink,
  BookOpen,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JobMockInterview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialRole = location.state?.jobTitle || IN_DEMAND_JOBS_2026[0].title;
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>(initialRole);

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<MockInterviewEvaluation | null>(null);

  const selectedJobObj =
    IN_DEMAND_JOBS_2026.find((j) => j.title.toLowerCase() === selectedJobTitle.toLowerCase()) ||
    IN_DEMAND_JOBS_2026[0];

  const handleStartInterview = async () => {
    setIsLoadingQuestions(true);
    setEvaluation(null);
    setUserAnswers({});
    setCurrentAnswer('');
    setCurrentIndex(0);

    try {
      const data = await requestMockInterviewQuestions(selectedJobTitle);
      setQuestions(data);
      setIsSessionActive(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleSaveAndNext = async () => {
    const activeQ = questions[currentIndex];
    const updatedAnswers = { ...userAnswers, [activeQ.id]: currentAnswer };
    setUserAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer(userAnswers[questions[currentIndex + 1]?.id] || '');
      setShowHint(false);
    } else {
      // Evaluate completed interview
      setIsSessionActive(false);
      setIsEvaluating(true);

      const transcriptArray = questions.map((q) => ({
        question: q.question,
        answer: updatedAnswers[q.id] || '(No response provided)',
      }));

      try {
        const evalResult = await requestMockInterviewEvaluation(selectedJobTitle, questions, updatedAnswers);
        setEvaluation(evalResult);

        if (evalResult.overall_readiness_score >= 70) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Top Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 font-mono block">
          Role-Grounded Simulation
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-display mt-0.5">
          Job-Specific Technical & Behavioral Mock Interview
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Tailored to industry executive hiring bars. Practice live architecture scenarios, STAR behavioral frameworks, and production troubleshooting.
        </p>
      </div>

      {/* Role Configurator & Starter */}
      {!isSessionActive && !evaluation && !isEvaluating && (
        <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 font-mono block">
              Select Target Role for Interview Calibration
            </label>
            <select
              value={selectedJobTitle}
              onChange={(e) => setSelectedJobTitle(e.target.value)}
              className="bg-zinc-50 dark:bg-[#181a24] border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 text-xs font-semibold px-3.5 py-2.5 outline-none focus:border-[#4f46e5] w-full sm:w-auto min-w-[320px] cursor-pointer"
            >
              {IN_DEMAND_JOBS_2026.map((job) => (
                <option key={job.id} value={job.title}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Interview Format Calibration</span>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li>• Technical Domain: {selectedJobObj.mockInterviewFocus.technicalDomain}</li>
              <li>• Scenario Type: {selectedJobObj.mockInterviewFocus.scenarioType}</li>
              <li>• Behavioral Focus: {selectedJobObj.mockInterviewFocus.behavioralAspects.join(' · ')}</li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={isLoadingQuestions}
              onClick={handleStartInterview}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <span>{isLoadingQuestions ? 'Generating Interview Session...' : 'Start Job-Specific Mock Interview'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE INTERVIEW SESSION */}
      {isSessionActive && questions.length > 0 && (
        <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 animate-slide-in">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
                {questions[currentIndex].type}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400 font-mono">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer font-mono"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Hint' : 'View Interview Hint'}</span>
            </button>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-relaxed">
              {questions[currentIndex].question}
            </h3>

            {showHint && (
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase text-indigo-600 dark:text-indigo-400 font-bold">Interviewer Tip:</span>
                <p className="text-zinc-700 dark:text-zinc-300">{questions[currentIndex].hint}</p>
                <div className="pt-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 block">Expected Dimensions:</span>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                    {questions[currentIndex].key_points_expected.join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Candidate Response Area */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 font-mono block">
              Your Verbal / Written Response
            </label>
            <textarea
              rows={8}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Structure your answer clearly. For architecture: state assumptions, data flow, failure modes. For behavioral: describe Situation, Task, Action, and Quantified Result (STAR)..."
              className="w-full bg-zinc-50 dark:bg-[#181a24] border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 p-4 text-xs outline-none focus:border-[#4f46e5] leading-relaxed resize-none font-mono"
            />
          </div>

          {/* Navigation Controls */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsSessionActive(false)}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              Cancel Interview
            </button>

            <button
              type="button"
              onClick={handleSaveAndNext}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold py-2 px-5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>{currentIndex < questions.length - 1 ? 'Save & Next Question' : 'Complete & Evaluate'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* EVALUATION PROGRESS STATE */}
      {isEvaluating && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Analyzing Your Mock Interview Transcript</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
            Grading technical depth, STAR behavioral structure, trade-offs, and communication fluency.
          </p>
        </div>
      )}

      {/* POST-INTERVIEW COMPREHENSIVE PERFORMANCE BREAKDOWN */}
      {evaluation && (
        <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 animate-slide-in">
          {/* Header Score Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 font-mono block">
                Interview Performance Summary
              </span>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5">
                Evaluation for "{selectedJobTitle}"
              </h2>
            </div>

            <div className="text-right flex items-center gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 block">Readiness Score</span>
                <span className="text-2xl font-extrabold font-mono text-zinc-900 dark:text-white tabular-nums">
                  {evaluation.overall_readiness_score}%
                </span>
              </div>
              <span className="px-3 py-1 rounded-md text-xs font-bold font-mono bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
                {evaluation.overall_readiness_score >= 70 ? 'Interview Ready' : 'Further Prep Needed'}
              </span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
            <span className="font-mono text-zinc-500 dark:text-zinc-400 uppercase font-semibold block">Executive Hiring Assessment</span>
            <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed">{evaluation.summary}</p>
          </div>

          {/* Strengths & Weaknesses 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demonstrated Strengths</span>
              </span>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
                {evaluation.strengths.map((s, idx) => (
                  <li key={idx} className="leading-relaxed">
                    • {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
              <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-4 h-4" />
                <span>Identified Weaknesses & Growth Areas</span>
              </span>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
                {evaluation.weaknesses.map((w, idx) => (
                  <li key={idx} className="leading-relaxed">
                    • {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggested Preparation Topics & Interview Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 font-mono">
                <BookOpen className="w-4 h-4" />
                <span>Suggested Preparation Topics & Notes</span>
              </span>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-300">
                {evaluation.suggested_preparation_topics.map((t, idx) => (
                  <li key={idx}>• {t}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-4 h-4" />
                <span>Interview Shortcuts & High-Impact Tips</span>
              </span>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-300">
                {evaluation.shortcuts_and_tips.map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Curated Video Resources */}
          {evaluation.video_resources && evaluation.video_resources.length > 0 && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 font-mono">
                <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Recommended Video & Masterclass Resources</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {evaluation.video_resources.map((v, idx) => (
                  <a
                    key={idx}
                    href={v.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#11131a] hover:border-indigo-400 transition-colors flex items-center justify-between text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{v.title}</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">{v.channel}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Motivational Closing System */}
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-center space-y-1">
            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 font-mono leading-relaxed">
              {evaluation.closing_message || MOTIVATION_CLOSING_PHRASE}
            </p>
          </div>

          {/* Bottom Action Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleStartInterview}
              className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#181a24] hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
            >
              Retake Mock Interview
            </button>
            <button
              type="button"
              onClick={() => navigate('/tests', { state: { jobTitle: selectedJobTitle } })}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold py-2 px-5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Proceed to Extra Hard Tests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
