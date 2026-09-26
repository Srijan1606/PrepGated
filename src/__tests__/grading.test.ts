import { describe, it, expect } from 'vitest';
import { gradeMCQ } from '../lib/grading';

describe('Deterministic MCQ Grading Engine', () => {
  const sampleQuestions = [
    { id: 'q1', correct_answer: 'B', question_order: 1 },
    { id: 'q2', correct_answer: 'A', question_order: 2 },
    { id: 'q3', correct_answer: 'C', question_order: 3 },
    { id: 'q4', correct_answer: 'D', question_order: 4 },
    { id: 'q5', correct_answer: 'B', question_order: 5 },
  ];

  it('calculates 100% when all answers match correct key', () => {
    const userAnswers = [
      { question_id: 'q1', selected_option_id: 'B' },
      { question_id: 'q2', selected_option_id: 'A' },
      { question_id: 'q3', selected_option_id: 'C' },
      { question_id: 'q4', selected_option_id: 'D' },
      { question_id: 'q5', selected_option_id: 'B' },
    ];

    const result = gradeMCQ(sampleQuestions, userAnswers);

    expect(result.score).toBe(100);
    expect(result.correctCount).toBe(5);
    expect(result.totalQuestions).toBe(5);
    expect(result.breakdowns.every((b) => b.is_correct)).toBe(true);
  });

  it('calculates 60% when 3 out of 5 answers match', () => {
    const userAnswers = [
      { question_id: 'q1', selected_option_id: 'B' }, // Correct
      { question_id: 'q2', selected_option_id: 'C' }, // Wrong (key is A)
      { question_id: 'q3', selected_option_id: 'C' }, // Correct
      { question_id: 'q4', selected_option_id: 'A' }, // Wrong (key is D)
      { question_id: 'q5', selected_option_id: 'B' }, // Correct
    ];

    const result = gradeMCQ(sampleQuestions, userAnswers);

    expect(result.score).toBe(60);
    expect(result.correctCount).toBe(3);
    expect(result.totalQuestions).toBe(5);
  });

  it('handles case-insensitivity and whitespace in selected options', () => {
    const userAnswers = [
      { question_id: 'q1', selected_option_id: ' b ' },
      { question_id: 'q2', selected_option_id: 'a' },
      { question_id: 'q3', selected_option_id: 'c ' },
      { question_id: 'q4', selected_option_id: ' D' },
      { question_id: 'q5', selected_option_id: 'B' },
    ];

    const result = gradeMCQ(sampleQuestions, userAnswers);
    expect(result.score).toBe(100);
    expect(result.correctCount).toBe(5);
  });

  it('handles unanswered/missing submissions gracefully', () => {
    const userAnswers = [
      { question_id: 'q1', selected_option_id: 'B' },
    ];

    const result = gradeMCQ(sampleQuestions, userAnswers);
    expect(result.score).toBe(20);
    expect(result.correctCount).toBe(1);
    expect(result.breakdowns[1].is_correct).toBe(false);
  });
});
