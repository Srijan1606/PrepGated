import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StageRunner } from '../views/StageRunner';
import * as edgeApi from '../lib/edgeApi';

// Mock edgeApi calls
vi.mock('../lib/edgeApi', () => ({
  invokeAiAction: vi.fn(),
}));

const mockStages = [
  {
    id: 'stage-apt-1',
    stage_order: 1,
    stage_type: 'aptitude' as const,
    title: 'Aptitude & Logical Reasoning',
    unlocked: true,
    best_score: null,
  },
];

const mockContextValue = {
  stages: mockStages,
  updateStageBestScore: vi.fn(),
  activeTarget: { id: 'target-1' },
  triggerConfetti: vi.fn(),
};

// Mock JobTargetsContext
vi.mock('../context/JobTargetsContext', () => ({
  useJobTargets: () => mockContextValue,
}));


describe('StageRunner Component in MCQ Mode', () => {
  const mockQuestions = [
    {
      id: 'q-1',
      question_order: 1,
      question_type: 'mcq',
      prompt: 'What is 15% of 200?',
      options: [
        { id: 'A', text: '20' },
        { id: 'B', text: '30' },
        { id: 'C', text: '40' },
      ],
    },
    {
      id: 'q-2',
      question_order: 2,
      question_type: 'mcq',
      prompt: 'Find the next number in sequence: 2, 4, 8, 16, ?',
      options: [
        { id: 'A', text: '24' },
        { id: 'B', text: '32' },
        { id: 'C', text: '64' },
      ],
    },
  ];

  it('renders MCQ questions, disables submit until all answered, then enables submit', async () => {
    (edgeApi.invokeAiAction as any).mockImplementation((action: string) => {
      if (action === 'generate_stage_questions') {
        return Promise.resolve({ questions: mockQuestions });
      }
      return Promise.resolve({});
    });

    render(
      <MemoryRouter initialEntries={['/targets/target-1/stage/stage-apt-1']}>
        <Routes>
          <Route path="/targets/:id/stage/:stageId" element={<StageRunner />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for questions to appear
    await waitFor(() => {
      expect(screen.getByText(/What is 15% of 200\?/i)).toBeInTheDocument();
      expect(screen.getByText(/Find the next number in sequence/i)).toBeInTheDocument();
    });

    // The submit button must initially be disabled
    const submitBtn = screen.getByRole('button', { name: /Submit/i });
    expect(submitBtn).toBeDisabled();

    // Answer question 1
    const option1B = screen.getByText('30');
    fireEvent.click(option1B);

    // Still disabled because Q2 is unanswered
    expect(submitBtn).toBeDisabled();

    // Answer question 2
    const option2B = screen.getByText('32');
    fireEvent.click(option2B);

    // Now submit button must be enabled!
    expect(submitBtn).not.toBeDisabled();
  });
});
