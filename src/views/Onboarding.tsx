// ==============================================================================
// PrepGated - Entry Segregation & Candidate Onboarding Flow
// 1. Entrance Segregation: Candidate / Job Seeker vs Employer
// 2. Candidate Question Flow: Target domain, company preference (Top MNC vs specialized), skills, level
// 3. User Decision Point: Candidate explicitly decides between Top MNC vs Domain tracks
// 4. Routes directly into the Segregated Adaptive Learning Path with live job demand status
// ==============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobTargets } from '../context/JobTargetsContext';
import { useTheme } from '../context/ThemeContext';
import { IN_DEMAND_JOBS_2026 } from '../data/marketJobs2026';
import {
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Sun,
  Moon,
  Compass,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  TrendingUp,
  Brain,
  Cloud,
  Code2,
} from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { profile, updateProfile, setUserRole } = useAuth();
  const { tracks, createTarget } = useJobTargets();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  // Mode Step:
  // -1: Initial Segregation (Candidate vs Employer)
  // 0..3: Candidate Questionnaire
  // 4: Candidate Choice & Segregation Decision (Top MNC vs Specific Domain)
  const [currentStep, setCurrentStep] = useState<number>(-1);

  // Questionnaire Answers
  const [targetDomain, setTargetDomain] = useState('Software Engineering');
  const [companyPref, setCompanyPref] = useState('Top Tier-1 MNC (Google, Microsoft, Amazon, Meta)');
  const [foundationSkill, setFoundationSkill] = useState('Python');
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [timeline, setTimeline] = useState('Within 3 months');

  // Selected Final Track
  const [selectedTrackChoice, setSelectedTrackChoice] = useState<string>('ai-ml-engineer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectRole = async (role: 'candidate' | 'employer') => {
    await setUserRole(role);
    if (role === 'employer') {
      navigate('/employer');
    } else {
      setCurrentStep(0);
    }
  };

  const domainOptions = [
    { label: 'Software Engineering (Full-stack / Backend / APIs)', icon: Code2, trackId: 'software-engineer' },
    { label: 'AI & Machine Learning / LLMs / Data Science', icon: Brain, trackId: 'ai-ml-engineer' },
    { label: 'Cloud Engineering & DevOps / Platform', icon: Cloud, trackId: 'cloud-engineer' },
    { label: 'Hardware & Embedded Systems / RTOS', icon: Cpu, trackId: 'hardware-embedded-engineer' },
    { label: 'Data Science & Big Data Lakehouses', icon: Database, trackId: 'data-scientist-engineer' },
    { label: 'Cybersecurity & Zero-Trust Infrastructure', icon: ShieldCheck, trackId: 'cybersecurity-analyst' },
  ];

  const companyOptions = [
    'Top Tier-1 MNC (Google, Microsoft, Amazon, Meta, Apple)',
    'High-Growth Tech Startup (Scale-ups, VC-backed)',
    'Domain Product Company (Specialized Automotive, Hardware, AI)',
    'Global IT & Consulting MNC (TCS, Infosys, Wipro, Accenture)',
    'Open to Any High-Impact Opportunity',
  ];

  const skillOptions = [
    'Python & PyTorch',
    'SQL, DBMS & Relational Queries',
    'Data Structures & Algorithms (C++ / Java / Python)',
    'TypeScript, React & Node.js',
    'C / C++ & Embedded Systems',
    'Cloud Architecture & Docker / Kubernetes',
  ];

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const chosenJob = IN_DEMAND_JOBS_2026.find((j) => j.id === selectedTrackChoice) || IN_DEMAND_JOBS_2026[0];

      // Match corresponding platform track
      const matchingTrack = tracks.find((t) => t.id.includes(chosenJob.id.split('-')[0])) || tracks[0];

      await createTarget(matchingTrack.id, companyPref.split('(')[0].trim());

      await updateProfile({
        degree: `Track: ${chosenJob.title}`,
        location: 'Global Placement Pool',
        user_role: 'candidate',
        resume_snapshot: `Target: ${chosenJob.title} at ${companyPref}. Foundation: ${foundationSkill}. Current Level: ${currentLevel}.`,
      });

      // Route immediately into the Segregated Learning Path
      navigate('/learning-path', {
        state: {
          jobId: chosenJob.id,
          jobTitle: chosenJob.title,
          preferredCompany: companyPref,
          initialLevel: currentLevel,
        },
      });
    } catch (err) {
      console.error('Onboarding routing error:', err);
      navigate('/learning-path');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-zinc-50 dark:bg-[#07080c] text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-[#4f46e5] selection:text-white">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-6 rounded-full bg-[#4f46e5] transform -skew-x-[24deg]" />
            <span className="w-1.5 h-6 rounded-full bg-[#818cf8] transform -skew-x-[24deg]" />
          </div>
          <span className="font-bold text-lg tracking-tight font-display text-zinc-900 dark:text-white">
            PrepGated
          </span>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">· Placement Readiness</span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white shadow-xs transition-colors cursor-pointer"
          title="Toggle light/dark theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-8 flex flex-col justify-center">
        {/* ===================================================================
            STEP -1: ENTRANCE SEGREGATION (Candidate vs Employer)
            =================================================================== */}
        {currentStep === -1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WELCOME TO PREPGATED</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-zinc-900 dark:text-white">
                Choose Your Portal
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                Are you looking to prepare for high-demand placements, or are you an employer seeking verified talent?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Option 1: Candidate / Job Seeker */}
              <button
                type="button"
                onClick={() => handleSelectRole('candidate')}
                className="group p-6 rounded-2xl bg-white dark:bg-[#11131a] border-2 border-zinc-200 dark:border-zinc-800 hover:border-[#4f46e5] dark:hover:border-[#6366f1] text-left transition-all hover:shadow-xl cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-[#4f46e5] mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-display">
                    Candidate / Job Seeker
                  </h3>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#4f46e5] transition-colors" />
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Tailor your study preferences, access official documentation links, take levelled subject tests, and build an ATS-tailored resume.
                </p>
              </button>

              {/* Option 2: Employer */}
              <button
                type="button"
                onClick={() => handleSelectRole('employer')}
                className="group p-6 rounded-2xl bg-white dark:bg-[#11131a] border-2 border-zinc-200 dark:border-zinc-800 hover:border-purple-600 dark:hover:border-purple-500 text-left transition-all hover:shadow-xl cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/80 flex items-center justify-center text-[#7c3aed] mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-display">
                    Employer / Recruiter
                  </h3>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Post requirements, browse verified candidate percentiles, and match candidates by demonstrated skill benchmarks without resume spam.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 0: QUESTION 1 - JOB INTEREST
            =================================================================== */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-[#4f46e5] font-semibold">Step 1 of 4 · Preference Segregation</span>
              <span>1 / 4</span>
            </div>

            <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
                  What kind of job are you interested in?
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  We customize your key skills, study material links, and diagnostic tests accordingly.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {domainOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = targetDomain === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        setTargetDomain(opt.label);
                        setSelectedTrackChoice(opt.trackId);
                      }}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#4f46e5] bg-indigo-50/70 dark:bg-indigo-950/40 text-[#4f46e5] dark:text-indigo-300 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-[#181a24] text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#4f46e5] text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">{opt.label}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#4f46e5] bg-[#4f46e5]' : 'border-zinc-400 dark:border-zinc-600'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(-1)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 1: QUESTION 2 - COMPANY PREFERENCE (Top MNC vs Specialized)
            =================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-[#4f46e5] font-semibold">Step 2 of 4 · Company Preference</span>
              <span>2 / 4</span>
            </div>

            <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
                  What kind of company do you prefer?
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Big MNC hiring bars emphasize algorithms and system design; product and startups prioritize practical delivery.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {companyOptions.map((opt) => {
                  const isSelected = companyPref === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCompanyPref(opt)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#4f46e5] bg-indigo-50/70 dark:bg-indigo-950/40 text-[#4f46e5] dark:text-indigo-300 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-[#181a24] text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-semibold">{opt}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${isSelected ? 'border-[#4f46e5] bg-[#4f46e5]' : 'border-zinc-400 dark:border-zinc-600'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 2: QUESTION 3 - FOUNDATION SKILL & TIMELINE
            =================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-[#4f46e5] font-semibold">Step 3 of 4 · Skill & Knowledge Level</span>
              <span>3 / 4</span>
            </div>

            <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
                  What is your primary technical strength & experience level?
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  We will benchmark your diagnostic tests starting at your declared level.
                </p>
              </div>

              {/* Primary Skill Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-mono uppercase">
                  Primary Foundation Skill
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {skillOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFoundationSkill(s)}
                      className={`p-3 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                        foundationSkill === s
                          ? 'border-[#4f46e5] bg-indigo-50/70 dark:bg-indigo-950/40 text-[#4f46e5] dark:text-indigo-300 font-semibold'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#181a24] text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Segmented Selector */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-mono uppercase">
                  Current Readiness Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCurrentLevel(lvl)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        currentLevel === lvl
                          ? 'border-[#4f46e5] bg-[#4f46e5] text-white font-bold shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#181a24] text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                      }`}
                    >
                      <span className="text-xs font-bold block">{lvl}</span>
                      <span className="text-[10px] opacity-80 block mt-0.5">
                        {lvl === 'Beginner' ? 'Core Concepts' : lvl === 'Intermediate' ? 'Problem Solving' : 'High Scale'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Review Track Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            STEP 3: CANDIDATE CHOICE & CONFIRMATION ("You make that choice yourself")
            =================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#4f46e5]">
                Confirmation & Track Segregation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
                You Decide Your Placement Focus
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
                Based on your answers, pick the track you want to study. We'll take you straight into the segregated learning path with live job demand metrics.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {IN_DEMAND_JOBS_2026.slice(0, 5).map((job) => {
                const isSelected = selectedTrackChoice === job.id;
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => setSelectedTrackChoice(job.id)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#4f46e5] bg-indigo-50/80 dark:bg-indigo-950/40 shadow-md ring-2 ring-[#4f46e5]/30'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-1.5 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white font-display">
                          {job.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono">
                          {job.projectedGrowth.split(' ')[0]} Growth
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-1 leading-snug">
                        {job.summary}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-zinc-400 font-mono">Key skills:</span>
                        {job.keySkills.slice(0, 4).map((sk) => (
                          <span
                            key={sk}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${isSelected ? 'border-[#4f46e5] bg-[#4f46e5]' : 'border-zinc-400 dark:border-zinc-600'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinishOnboarding}
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-sm transition-all shadow-lg hover:shadow-indigo-500/25 cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Configuring Your Learning Path...' : 'Enter Segregated Learning Path'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-4 text-center text-xs text-zinc-400 font-mono border-t border-zinc-200/80 dark:border-zinc-800/80">
        <span>PrepGated Adaptive Placement Platform · Verified Talent Intelligence</span>
      </footer>
    </div>
  );
};
