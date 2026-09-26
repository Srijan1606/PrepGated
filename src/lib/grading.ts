// ==============================================================================
// Placement Prep Platform - Pure Autograding & Sanitization Logic
// Evaluated deterministically for MCQ rounds with ZERO outbound Gemini calls.
// ==============================================================================

export interface GradingQuestion {
  id: string;
  correct_answer: string;
  question_order?: number;
  prompt?: string;
}

export interface UserSubmittedAnswer {
  question_id: string;
  selected_option_id?: string;
  question_order?: number;
}

export interface MCQGradingResult {
  score: number; // 0 - 100 percentage
  correctCount: number;
  totalQuestions: number;
  breakdowns: Array<{
    question_id: string;
    question_order?: number;
    submitted: string;
    correct_answer: string;
    is_correct: boolean;
  }>;
}

/**
 * Deterministic MCQ grading engine.
 * Compares user submitted options to secure answer keys without calling LLMs.
 */
export function gradeMCQ(
  questions: GradingQuestion[],
  submittedAnswers: UserSubmittedAnswer[]
): MCQGradingResult {
  if (!questions || questions.length === 0) {
    return { score: 0, correctCount: 0, totalQuestions: 0, breakdowns: [] };
  }

  let correctCount = 0;
  const breakdowns = questions.map((q) => {
    const submission = submittedAnswers.find(
      (a) => a.question_id === q.id || (q.question_order !== undefined && a.question_order === q.question_order)
    );
    const submittedOption = submission?.selected_option_id?.trim().toUpperCase() ?? '';
    const correctOption = q.correct_answer?.trim().toUpperCase() ?? '';
    const isCorrect = submittedOption !== '' && submittedOption === correctOption;

    if (isCorrect) {
      correctCount += 1;
    }

    return {
      question_id: q.id,
      question_order: q.question_order,
      submitted: submittedOption || 'UNANSWERED',
      correct_answer: correctOption,
      is_correct: isCorrect,
    };
  });

  const score = Math.round((correctCount / questions.length) * 100);

  return {
    score,
    correctCount,
    totalQuestions: questions.length,
    breakdowns,
  };
}

/**
 * Sanitizes questions before sending them to the client browser.
 * Strips the 'correct_answer' attribute so answer keys cannot be inspected.
 */
export function sanitizeQuestions<T extends Record<string, any>>(
  questions: T[]
): Omit<T, 'correct_answer'>[] {
  if (!Array.isArray(questions)) return [];

  return questions.map((item) => {
    const copy = { ...item };
    delete copy.correct_answer;
    return copy;
  });
}
