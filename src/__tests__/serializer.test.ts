import { describe, it, expect } from 'vitest';
import { sanitizeQuestions } from '../lib/grading';

describe('Question Sanitizer Security Serializer', () => {
  it('strips correct_answer attribute completely from question objects', () => {
    const rawQuestions = [
      {
        id: 'q-sec-1',
        prompt: 'What is the worst-case complexity of quicksort?',
        options: [
          { id: 'A', text: 'O(N)' },
          { id: 'B', text: 'O(N log N)' },
          { id: 'C', text: 'O(N^2)' },
        ],
        correct_answer: 'C',
        stage_id: 'stage-1',
      },
      {
        id: 'q-sec-2',
        prompt: 'Which protocol operates on Transport Layer?',
        options: [
          { id: 'A', text: 'TCP' },
          { id: 'B', text: 'IP' },
        ],
        correct_answer: 'A',
        stage_id: 'stage-1',
      },
    ];

    const sanitized = sanitizeQuestions(rawQuestions);

    expect(sanitized).toHaveLength(2);

    sanitized.forEach((item: any) => {
      // Must NOT contain correct_answer
      expect(item).not.toHaveProperty('correct_answer');
      expect(item.correct_answer).toBeUndefined();

      // Must preserve client-facing properties
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('prompt');
      expect(item).toHaveProperty('options');
    });

    // Verify raw questions were not destructively mutated
    expect(rawQuestions[0].correct_answer).toBe('C');
  });

  it('handles empty input gracefully', () => {
    expect(sanitizeQuestions([])).toEqual([]);
    expect(sanitizeQuestions(null as any)).toEqual([]);
  });
});
