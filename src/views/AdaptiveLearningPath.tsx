// ==============================================================================
// PrepGated - Adaptive Learning Path & Skill Mastery View
// 1. Demand Status of Jobs (High-Demand role metrics, hiring velocity, salary range)
// 2. Key Skills Required for the Job (Python, SQL, DBMS, Data, etc.) with references
// 3. Official Study Materials with direct clickable links (Python.org, Postgres, MDN, etc.)
// 4. Levelled Subject Tests (Beginner, Intermediate, Advanced, Expert) with 5 to 10 non-repeating questions
// 5. Targeted Mistake Diagnosis: Tells students exactly where they went wrong + official docs link to fix gaps
// 6. Retest with fresh, different questions
// 7. Badge of Honour upon level completion + automatic skill progression meter
// 8. One-click transition to Resume Builder once skills are completed
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IN_DEMAND_JOBS_2026, getJobById, InDemandJob } from '../data/marketJobs2026';
import { getStudyMaterialsForTopic, OfficialStudyMaterial } from '../data/officialStudyMaterials';
import { getAdaptiveQuestionsForTopic, AdaptiveLevelQuestion } from '../data/levelQuestions';
import { useJobTargets } from '../context/JobTargetsContext';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Flame,
  ChevronRight,
  BookOpen,
  Sparkles,
  X,
  Target,
  FileText,
  RotateCcw,
  Check,
  TrendingUp,
  Cpu,
  Layers,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdaptiveLearningPath: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topicProgress, markTopicPracticed } = useJobTargets();
  const { isDark } = useTheme();

  const passedJobId = location.state?.jobId;
  const passedJobTitle = location.state?.jobTitle;

  // 1. Active In-Demand Job
  const [selectedJobId, setSelectedJobId] = useState<string>(
    passedJobId ||
      (passedJobTitle
        ? IN_DEMAND_JOBS_2026.find((j) => j.title.toLowerCase().includes(passedJobTitle.toLowerCase()))?.id ||
          IN_DEMAND_JOBS_2026[0].id
        : IN_DEMAND_JOBS_2026[0].id)
  );

  const activeJob: InDemandJob = getJobById(selectedJobId) || IN_DEMAND_JOBS_2026[0];

  // 2. Active Curriculum Topic & Level
  const [selectedTopicId, setSelectedTopicId] = useState<string>(activeJob.curriculumTopics[0]?.id || 'ai-t1');
  const [selectedLevel, setSelectedLevel] = useState<number>(1); // 1: Beginner, 2: Intermediate, 3: Advanced, 4: Expert
  const [questionCountPref, setQuestionCountPref] = useState<number>(5); // 5 or 10 questions

  // Whenever the active job changes, pick the first topic
  useEffect(() => {
    if (activeJob.curriculumTopics.length > 0) {
      setSelectedTopicId(activeJob.curriculumTopics[0].id);
    }
  }, [selectedJobId]);

  const selectedTopic =
    activeJob.curriculumTopics.find((t) => t.id === selectedTopicId) || activeJob.curriculumTopics[0];

  // Study materials associated with selected topic
  const officialMaterials: OfficialStudyMaterial[] = getStudyMaterialsForTopic(
    `${selectedTopic.title} ${activeJob.title} ${activeJob.keySkills.join(' ')}`
  );

  // 3. Test Session State
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [currentTestQuestions, setCurrentTestQuestions] = useState<AdaptiveLevelQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // questionId -> 'A' | 'B' | 'C' | 'D'
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [scorePercentage, setScorePercentage] = useState<number>(0);

  // History of answered question IDs to avoid repeats on retest
  const [seenQuestionIds, setSeenQuestionIds] = useState<string[]>([]);

  // Badges Earned State
  const [earnedBadges, setEarnedBadges] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('prepgated_earned_badges');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);
  const [activeBadgePayload, setActiveBadgePayload] = useState<{ title: string; levelName: string; score: number } | null>(null);

  // Start / Retest function with fresh non-repeating questions
  const startSubjectTest = (level: number = selectedLevel, count: number = questionCountPref) => {
    const questions = getAdaptiveQuestionsForTopic(selectedTopic.title, level, count, seenQuestionIds);
    setCurrentTestQuestions(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTestSubmitted(false);
    setIsTestActive(true);

    // Track seen questions
    setSeenQuestionIds((prev) => [...prev, ...questions.map((q) => q.id)]);
  };

  const handleSelectOption = (optionId: string) => {
    if (testSubmitted) return;
    const currentQ = currentTestQuestions[currentQuestionIndex];
    if (!currentQ) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    currentTestQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / currentTestQuestions.length) * 100);
    setScorePercentage(calculatedScore);
    setTestSubmitted(true);

    // Update topic progress in context
    markTopicPracticed(selectedTopic.id, calculatedScore >= 70 ? 'completed' : 'in_progress', calculatedScore);

    // Check Badge eligibility (Passed with >= 70%)
    const levelNames = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const currentLvlName = levelNames[selectedLevel - 1] || 'Beginner';
    const badgeKey = `${selectedTopic.id}-${selectedLevel}`;

    if (calculatedScore >= 70) {
      const newEarned = { ...earnedBadges, [badgeKey]: true };
      setEarnedBadges(newEarned);
      try {
        localStorage.setItem('prepgated_earned_badges', JSON.stringify(newEarned));
      } catch {}

      setActiveBadgePayload({
        title: `${selectedTopic.title} ${currentLvlName} Specialist`,
        levelName: currentLvlName,
        score: calculatedScore,
      });
      setShowBadgeModal(true);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    }
  };

  // Find mistakes in current test
  const mistakeItems = currentTestQuestions.filter((q) => testSubmitted && userAnswers[q.id] !== q.correct);

  // Calculate overall skills completion percentage for the current job
  const completedTopicsCount = activeJob.curriculumTopics.filter((t) => {
    const prog = topicProgress.find((p) => p.topic_id === t.id);
    return (prog?.mastery_score || 0) >= 70;
  }).length;
  const overallSkillCompletion = Math.round((completedTopicsCount / activeJob.curriculumTopics.length) * 100);

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* ===================================================================
          1. JOB DEMAND STATUS & TRACK SWITCHER BANNER
          =================================================================== */}
      <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-[#4f46e5] dark:text-indigo-400 font-mono border border-indigo-200 dark:border-indigo-900/60">
                Live Job Demand Status: {activeJob.demandLevel}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono border border-emerald-200 dark:border-emerald-900/60">
                {activeJob.projectedGrowth}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                Comp: {activeJob.salaryRange}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
              {activeJob.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {activeJob.summary}
            </p>
          </div>

          {/* Quick Track Switcher Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <label htmlFor="track-select" className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                Switch Target Job Track
              </label>
              <select
                id="track-select"
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setIsTestActive(false);
                }}
                className="text-xs font-semibold bg-zinc-50 dark:bg-[#181a24] text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 pr-8 outline-none cursor-pointer focus:border-[#4f46e5] transition-colors"
              >
                {IN_DEMAND_JOBS_2026.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.projectedGrowth.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Key Skills Reference Strip */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400">
              Key Skills Required:
            </span>
            {activeJob.keySkills.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60"
              >
                {sk}
              </span>
            ))}
          </div>

          {/* Overall Skills Completion */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">Job Skill Mastery</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white tabular-nums">
                {completedTopicsCount} of {activeJob.curriculumTopics.length} Skills ({overallSkillCompletion}%)
              </span>
            </div>
            <div className="w-16 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${overallSkillCompletion}%` }}
              />
            </div>
            {overallSkillCompletion >= 75 && (
              <button
                type="button"
                onClick={() => navigate('/resume', { state: { targetJob: activeJob.title } })}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                title="Build your tailored resume now"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Build Resume</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================
          2. MAIN STUDY & TESTING WORKSPACE (TWO-COLUMN ARCHITECTURE)
          =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN: CURRICULUM TOPICS & LEVEL SELECTOR */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400">
              Required Job Topics ({activeJob.curriculumTopics.length})
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">Select to study</span>
          </div>

          <div className="space-y-2.5">
            {activeJob.curriculumTopics.map((topic, idx) => {
              const isSelected = selectedTopicId === topic.id;
              const prog = topicProgress.find((p) => p.topic_id === topic.id);
              const score = prog?.mastery_score || 0;
              const isMastered = score >= 70;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setIsTestActive(false);
                    setTestSubmitted(false);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#4f46e5] bg-white dark:bg-[#11131a] shadow-md ring-2 ring-[#4f46e5]/30'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11131a] hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                        Topic {idx + 1} · {topic.level}
                      </span>
                      {isMastered ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mastered</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-400 tabular-nums">
                          {score}% Score
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-display">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 leading-snug">
                      {topic.summary}
                    </p>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span>Est: {topic.estimatedHours} hrs</span>
                    <span>{topic.practiceCount} test questions</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Level Switcher Segmented Control */}
          <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2">
            <span className="text-[11px] font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400 block">
              Assessment Difficulty Level
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { lvl: 1, name: 'Beginner' },
                { lvl: 2, name: 'Intermediate' },
                { lvl: 3, name: 'Advanced' },
                { lvl: 4, name: 'Expert' },
              ].map((item) => (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => {
                    setSelectedLevel(item.lvl);
                    if (isTestActive) {
                      startSubjectTest(item.lvl);
                    }
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                    selectedLevel === item.lvl
                      ? 'bg-[#4f46e5] text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STUDY MATERIALS & TEST RUNNER */}
        <div className="lg:col-span-2 space-y-6">
          {/* =================================================================
              VIEW A: TOPIC OVERVIEW & OFFICIAL STUDY MATERIAL LINKS
              ================================================================= */}
          {!isTestActive && (
            <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-indigo-50 dark:bg-indigo-950/80 text-[#4f46e5] dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
                      {selectedTopic.level} Level
                    </span>
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{selectedTopic.estimatedHours} Hours Curriculum</span>
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
                    {selectedTopic.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                    {selectedTopic.summary}
                  </p>
                </div>

                {/* Attend Test CTA */}
                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                    <span>Questions:</span>
                    <button
                      type="button"
                      onClick={() => setQuestionCountPref(5)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        questionCountPref === 5 ? 'bg-[#4f46e5] text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'
                      }`}
                    >
                      5 Qs
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuestionCountPref(10)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        questionCountPref === 10 ? 'bg-[#4f46e5] text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'
                      }`}
                    >
                      10 Qs
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => startSubjectTest(selectedLevel, questionCountPref)}
                    className="px-5 py-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-indigo-500/20 cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Attend Subject Test</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* What to Study Section */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400 block">
                  What To Study for this Subject
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedTopic.keyLearningObjectives.map((obj, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 flex items-start gap-2.5 text-xs text-zinc-800 dark:text-zinc-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#4f46e5] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Study Materials Links */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400 block">
                    Official Study Materials (Tap Link to Read & Prepare)
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">External Official Documentation</span>
                </div>

                <div className="space-y-3">
                  {officialMaterials.map((mat) => (
                    <a
                      key={mat.id}
                      href={mat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-[#4f46e5] dark:hover:border-[#6366f1] bg-white dark:bg-[#181a24] transition-all flex items-start justify-between gap-4 block cursor-pointer hover:shadow-md"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-[#4f46e5] transition-colors font-display">
                            {mat.title}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {mat.authorityBadge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
                          {mat.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono pt-1">
                          <span>Source: {mat.officialSource}</span>
                          <span>·</span>
                          <span>{mat.estimatedReadTime}</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] shrink-0 group-hover:scale-110 transition-transform">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Workflow callout */}
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Recommended Study Workflow
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px] mt-0.5">
                    1. Tap the links above to read the official material → 2. Come back and attend the test → 3. Fix your mistakes and earn your Badge of Honour!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startSubjectTest(selectedLevel, questionCountPref)}
                  className="px-4 py-2 rounded-lg bg-[#4f46e5] text-white font-semibold text-xs whitespace-nowrap cursor-pointer hover:bg-[#4338ca] shrink-0"
                >
                  Start Test Now
                </button>
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW B: ACTIVE TEST RUNNER WITH QUESTIONS
              ================================================================= */}
          {isTestActive && (
            <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
              {/* Test Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#4f46e5]">
                      Question {currentQuestionIndex + 1} of {currentTestQuestions.length}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">· Level: {currentTestQuestions[0]?.levelName}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 font-display">
                    {selectedTopic.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTestActive(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Exit Test
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-1.5">
                {currentTestQuestions.map((q, idx) => {
                  const isAnswered = Boolean(userAnswers[q.id]);
                  const isCurrent = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        isCurrent
                          ? 'bg-[#4f46e5]'
                          : isAnswered
                          ? 'bg-indigo-300 dark:bg-indigo-900'
                          : 'bg-zinc-200 dark:bg-zinc-800'
                      }`}
                      title={`Jump to Question ${idx + 1}`}
                    />
                  );
                })}
              </div>

              {/* Question Card */}
              {currentTestQuestions[currentQuestionIndex] && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-semibold text-indigo-600 dark:text-indigo-400">
                      {currentTestQuestions[currentQuestionIndex].typeLabel}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-relaxed">
                      {currentTestQuestions[currentQuestionIndex].prompt}
                    </h2>
                  </div>

                  {/* Code Snippet (if any) */}
                  {currentTestQuestions[currentQuestionIndex].codeSnippet && (
                    <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs leading-relaxed">
                      <pre>
                        <code>{currentTestQuestions[currentQuestionIndex].codeSnippet?.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-2.5 pt-2">
                    {currentTestQuestions[currentQuestionIndex].options.map((opt) => {
                      const isSelected = userAnswers[currentTestQuestions[currentQuestionIndex].id] === opt.id;
                      const isCorrect = opt.id === currentTestQuestions[currentQuestionIndex].correct;

                      let btnStyle = 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#181a24] text-zinc-800 dark:text-zinc-200 hover:border-zinc-300';
                      if (isSelected) {
                        btnStyle = 'border-[#4f46e5] bg-indigo-50/80 dark:bg-indigo-950/40 text-[#4f46e5] dark:text-indigo-300 shadow-xs';
                      }

                      if (testSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(opt.id)}
                          className={`w-full p-4 rounded-xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                              {opt.id}
                            </span>
                            <span className="text-xs sm:text-sm font-medium leading-snug">{opt.text}</span>
                          </div>

                          <div className="shrink-0 mt-0.5">
                            {testSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                            {testSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation (if submitted) */}
                  {testSubmitted && (
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 space-y-2 mt-4 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">Explanation & Official Reference:</span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {currentTestQuestions[currentQuestionIndex].explanation}
                      </p>
                      {currentTestQuestions[currentQuestionIndex].mistakeDiagnostic && (
                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                          {currentTestQuestions[currentQuestionIndex].mistakeDiagnostic}
                        </div>
                      )}
                      {currentTestQuestions[currentQuestionIndex].officialDocLink && (
                        <a
                          href={currentTestQuestions[currentQuestionIndex].officialDocLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#4f46e5] font-semibold hover:underline pt-1"
                        >
                          <span>Review: {currentTestQuestions[currentQuestionIndex].officialDocLink.title}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Navigation & Submit Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {currentQuestionIndex < currentTestQuestions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                          className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <span>Next</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : !testSubmitted ? (
                        <button
                          type="button"
                          onClick={handleSubmitTest}
                          className="px-6 py-2.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                        >
                          <span>Submit & Score Test</span>
                          <Check className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}

              {/* ===============================================================
                  3. TEST SUBMISSION SCORE & MISTAKE DIAGNOSIS BREAKDOWN
                  =============================================================== */}
              {testSubmitted && (
                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-6 animate-fade-in">
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-zinc-900 dark:text-white tabular-nums font-mono">
                          {scorePercentage}%
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase font-mono ${
                          scorePercentage >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {scorePercentage >= 70 ? 'Passed & Level Milestone Cleared' : 'Needs Review'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                        {scorePercentage >= 70
                          ? 'Congratulations! You have demonstrated strong competency. Your badge has been unlocked below.'
                          : 'Review where you went wrong below, tap the official study links to fix your gaps, then retest with fresh questions.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startSubjectTest(selectedLevel, questionCountPref)}
                        className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retest with Different Questions</span>
                      </button>
                    </div>
                  </div>

                  {/* Detailed Mistake Breakdown */}
                  {mistakeItems.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-mono">
                          Mistake Diagnosis: Exactly Where You Went Wrong ({mistakeItems.length})
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {mistakeItems.map((mQ, idx) => (
                          <div
                            key={mQ.id}
                            className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="font-bold text-rose-700 dark:text-rose-300">
                                Gap {idx + 1}: {mQ.typeLabel}
                              </span>
                              <span className="text-zinc-500">
                                Your Answer: <strong className="text-rose-600">{userAnswers[mQ.id] || 'None'}</strong> | Correct: <strong className="text-emerald-600">{mQ.correct}</strong>
                              </span>
                            </div>

                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {mQ.prompt}
                            </p>

                            <p className="text-zinc-700 dark:text-zinc-300">
                              {mQ.explanation}
                            </p>

                            <div className="p-2.5 rounded-lg bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300">
                              <strong>Fixing this gap:</strong> {mQ.mistakeDiagnostic}
                            </div>

                            {mQ.officialDocLink && (
                              <div className="pt-1">
                                <a
                                  href={mQ.officialDocLink.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs text-[#4f46e5] font-semibold hover:underline"
                                >
                                  <span>Study Official Docs: {mQ.officialDocLink.title}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================
          4. BADGE OF HONOUR UNLOCK MODAL
          =================================================================== */}
      {showBadgeModal && activeBadgePayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 sm:p-9 max-w-md w-full text-center shadow-2xl space-y-6 relative animate-scale-up">
            <button
              type="button"
              onClick={() => setShowBadgeModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-500 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center mx-auto shadow-lg">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Level Certified Milestone Cleared!
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
                {activeBadgePayload.title}
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                You passed with a score of <strong>{activeBadgePayload.score}%</strong>. Your skill progress for {activeJob.title} has updated automatically.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#181a24] border border-zinc-200 dark:border-zinc-800 text-left text-xs space-y-1">
              <div className="flex items-center justify-between text-zinc-500">
                <span>Verified Subject:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedTopic.title}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-500">
                <span>Certified Level:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{activeBadgePayload.levelName}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowBadgeModal(false);
                  setIsTestActive(false);
                }}
                className="w-full py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs cursor-pointer hover:bg-zinc-200"
              >
                Continue Learning
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBadgeModal(false);
                  navigate('/resume', { state: { targetJob: activeJob.title } });
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#4f46e5] text-white font-bold text-xs cursor-pointer hover:bg-[#4338ca] shadow-md inline-flex items-center justify-center gap-1.5"
              >
                <span>Build Tailored Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
