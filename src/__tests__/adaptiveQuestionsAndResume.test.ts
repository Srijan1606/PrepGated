import { describe, it, expect } from 'vitest';
import { getAdaptiveQuestionsForTopic, COMPREHENSIVE_LEVEL_QUESTIONS } from '../data/levelQuestions';
import { requestResumeEvaluation, requestResumeOptimization } from '../lib/geminiClient';

describe('Adaptive Learning Question Bank & 5-Question Test Column', () => {
  it('returns strictly 5 questions by default for Beginner Python', () => {
    const questions = getAdaptiveQuestionsForTopic('Python & PyTorch', 1, 5, []);
    expect(questions).toHaveLength(5);
    questions.forEach((q) => {
      expect(q.level).toBe(1);
      expect(q.options.length).toBeGreaterThanOrEqual(4);
      expect(['A', 'B', 'C', 'D']).toContain(q.correct);
      expect(q.explanation).toBeTruthy();
      expect(q.mistakeDiagnostic).toBeTruthy();
      expect(q.officialDocLink).toBeDefined();
      expect(q.officialDocLink.url).toMatch(/^https?:\/\//);
    });
  });

  it('guarantees non-repeating fresh questions on retest when excludeIds are passed', () => {
    const attempt1 = getAdaptiveQuestionsForTopic('Python Fundamentals', 1, 5, []);
    expect(attempt1).toHaveLength(5);
    const attempt1Ids = attempt1.map((q) => q.id);

    // Retest passes seen question IDs
    const attempt2 = getAdaptiveQuestionsForTopic('Python Fundamentals', 1, 5, attempt1Ids);
    expect(attempt2).toHaveLength(5);

    // Verify fresh questions are distinct from attempt 1
    const overlap = attempt2.filter((q) => attempt1Ids.includes(q.id));
    // Overlap should be 0 because we have enough distinct questions
    expect(overlap.length).toBe(0);
  });

  it('returns strictly 5 questions for Intermediate SQL & DBMS with diagnostics and study links', () => {
    const questions = getAdaptiveQuestionsForTopic('SQL & Relational Databases', 2, 5, []);
    expect(questions).toHaveLength(5);
    questions.forEach((q) => {
      expect(q.level).toBe(2);
      expect(q.mistakeDiagnostic).toContain('Mistake:');
      expect(q.officialDocLink.title).toBeTruthy();
    });
  });

  it('contains comprehensive question quantity across all domains', () => {
    expect(COMPREHENSIVE_LEVEL_QUESTIONS.length).toBeGreaterThanOrEqual(35);
    const beginnerCount = COMPREHENSIVE_LEVEL_QUESTIONS.filter((q) => q.level === 1).length;
    const intermediateCount = COMPREHENSIVE_LEVEL_QUESTIONS.filter((q) => q.level === 2).length;
    expect(beginnerCount).toBeGreaterThanOrEqual(18);
    expect(intermediateCount).toBeGreaterThanOrEqual(14);
  });
});

describe('Resume ATS Match Scoring & Job Tailoring', () => {
  it('evaluates tailored resume score strictly above 96% (not stuck at 79% or 92%)', async () => {
    const tailoredResume = {
      fullName: 'Dev Lead',
      summary: 'Senior AI Engineer with PyTorch, transformers, RAG, and CUDA experience.',
      skills: ['Python', 'PyTorch', 'Transformers', 'RAG', 'CUDA', 'FastAPI', 'Docker', 'Vector DBs'],
      experiences: [
        {
          role: 'AI / Machine Learning Engineer',
          company: 'Tech Corp',
          period: '2023 - Present',
          bullets: ['Architected RAG retrieval with PyTorch, reducing latency to <150ms.'],
        },
      ],
      projects: [],
      education: 'B.Tech CS',
    };

    const evalResult = await requestResumeEvaluation(
      tailoredResume,
      'AI / Machine Learning Engineer',
      'Python, PyTorch, Transformers, RAG, CUDA, Vector DBs'
    );

    // Score must be strictly > 96
    expect(evalResult.match_score).toBeGreaterThan(96);
    expect(evalResult.match_score).toBeLessThanOrEqual(100);
    expect(evalResult.strengths.length).toBeGreaterThan(0);
  });

  it('evaluates untailored resume honestly with lower score and lists missing keywords', async () => {
    const genericResume = {
      fullName: 'Junior Student',
      summary: 'Basic student interested in web dev.',
      skills: ['HTML', 'CSS', 'JavaScript'],
      experiences: [],
      projects: [],
      education: 'College',
    };

    const evalResult = await requestResumeEvaluation(
      genericResume,
      'Hardware & Embedded Systems Engineer',
      'Embedded C, FreeRTOS, ARM Cortex-M, SPI, I2C, UART, PCB Design'
    );

    expect(evalResult.match_score).toBeLessThan(75);
    expect(evalResult.missing_keywords.length).toBeGreaterThan(0);
  });

  it('generates role-tailored wording in resume optimization fallback', async () => {
    const baseResume = {
      fullName: 'Candidate',
      experiences: [{ company: 'Apex', role: 'Engineer', period: '2022', bullets: ['Worked on code'] }],
    };

    const optResult = await requestResumeOptimization(
      baseResume,
      'Hardware & Embedded Systems Engineer',
      'Embedded C, FreeRTOS, ARM Cortex, I2C, SPI, UART'
    );

    expect(optResult.summary).toContain('Hardware & Embedded');
    expect(optResult.skills.some((s) => s.toLowerCase().includes('c') || s.toLowerCase().includes('freertos'))).toBe(true);
    expect(optResult.experience[0].bullets[0]).toContain('ARM Cortex');
  });
});
