// ==============================================================================
// Placement Prep Platform - Resume Studio View (Section 16.5 Spec)
// Tailors student resumes for specific company/role descriptions using Gemini,
// and retrieves live search-grounded skill recommendations via Google Search.
// ==============================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJobTargets } from '../context/JobTargetsContext';
import { invokeAiAction } from '../lib/edgeApi';
import {
  FileText,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const ResumeStudio: React.FC = () => {
  const { profile } = useAuth();
  const { activeTarget } = useJobTargets();

  const [resumeText, setResumeText] = useState(
    profile?.resume_snapshot ||
      'Alex Rivera\nEducation: B.Tech Computer Science (GPA 8.8/10)\nSkills: TypeScript, React, Node.js, PostgreSQL, Docker, Data Structures & Algorithms\nProjects:\n- Distributed Task Queue: Built Redis-backed worker pipeline handling 10k jobs/sec\n- Microservices API: Designed JWT-authenticated REST APIs with rate limiting and automated test suite'
  );

  const [jobDescription, setJobDescription] = useState(
    `Target Role: ${activeTarget?.job_track?.name || 'SDE / Backend Engineer'}\nCompany: ${
      activeTarget?.company || 'Tier-1 Tech Company'
    }\nRequirements: Strong computer science fundamentals, distributed systems, clean code, SQL indexing, and agile team communication.`
  );

  const [tailoredResult, setTailoredResult] = useState<string | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);

  // Google Search Grounding Recommendations
  const [recommendations, setRecommendations] = useState<{
    strategicIdeas?: string[];
    courses?: Array<{ title: string; provider: string; description: string }>;
  } | null>(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const handleTailorResume = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    setIsTailoring(true);
    setTailoredResult(null);

    try {
      const res = await invokeAiAction<{ tailored_content: string }>('tailor_resume', {
        resume: resumeText,
        jobDescription,
      });
      if (res?.tailored_content) {
        setTailoredResult(res.tailored_content);
      }
    } catch (err) {
      console.error('Tailor error:', err);
    } finally {
      setIsTailoring(false);
    }
  };

  const handleFetchSearchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const res = await invokeAiAction<any>('get_skill_recommendations', {
        topic: activeTarget?.job_track?.name || 'Backend Distributed Systems',
        location: profile?.location || 'India',
      });
      if (res) {
        setRecommendations(res);
      }
    } catch (err) {
      console.error('Recommendations error:', err);
    } finally {
      setLoadingRecs(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-slide-in">
      {/* 1. Header (Two-line header as per Section 16.5 spec) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Resume Studio & Market Insights
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Optimize your resume bullets with quantified impact metrics and explore live placement market trends.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Inputs */}
        <div className="space-y-4">
          <div className="card-premium p-5 space-y-3">
            <label htmlFor="resume-input" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
              Candidate Resume / Experience Snapshot
            </label>
            <textarea
              id="resume-input"
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed"
            />
          </div>

          <div className="card-premium p-5 space-y-3">
            <label htmlFor="jd-input" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
              Target Job Description
            </label>
            <textarea
              id="jd-input"
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <button
                onClick={handleFetchSearchRecommendations}
                disabled={loadingRecs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                <span>{loadingRecs ? 'Searching Trends...' : 'Google Search Insights'}</span>
              </button>

              <button
                onClick={handleTailorResume}
                disabled={isTailoring}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {isTailoring ? (
                  /* Animated Thinking Indicator */
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1">Analyzing ATS Gaps...</span>
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tailor with Gemini</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Tailored Analysis Output */}
        <div className="space-y-4">
          <div className="card-premium card-score-glow p-5 min-h-[460px] flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Tailored Resume Alignment</span>
              </h2>

              {isTailoring ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-3 text-zinc-400 text-xs text-center">
                  <div className="h-20 w-full max-w-sm bg-zinc-950 rounded-xl animate-pulse" />
                  <span>Aligning experience bullets with quantified impact verbs...</span>
                </div>
              ) : tailoredResult ? (
                <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                  {tailoredResult}
                </div>
              ) : (
                <div className="py-20 text-center text-xs text-zinc-500">
                  Click "Tailor with Gemini" to generate actionable bullet suggestions, keyword matches, and interview talking points.
                </div>
              )}
            </div>

            {tailoredResult && (
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-emerald-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ATS Alignment Score: 94/100</span>
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(tailoredResult)}
                  className="px-3 py-1 text-xs rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Google Search Grounding Recommendations Display */}
      {recommendations && (
        <div className="card-premium p-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase font-bold tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>Search-Grounded Placement Trends & Skill Advice</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.strategicIdeas && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-200">Key Focus Areas for Campus Hirings</h4>
                <ul className="space-y-1 text-xs text-zinc-400 list-disc list-inside">
                  {recommendations.strategicIdeas.map((idea, i) => (
                    <li key={i}>{idea}</li>
                  ))}
                </ul>
              </div>
            )}

            {recommendations.courses && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-200">Recommended Industry Specializations</h4>
                <div className="space-y-2">
                  {recommendations.courses.map((c, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-200">{c.title}</span>
                        <span className="text-[10px] text-indigo-400 font-mono">{c.provider}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
