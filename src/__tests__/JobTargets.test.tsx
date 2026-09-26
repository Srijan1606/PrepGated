import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { JobTargets } from '../views/JobTargets';

// Mock JobTargetsContext with locked & unlocked stages
vi.mock('../context/JobTargetsContext', () => ({
  useJobTargets: () => ({
    targets: [
      {
        id: 'target-sde',
        job_track_id: 'track-1',
        company: 'Google',
        readiness_score: 55,
        created_at: new Date().toISOString(),
        job_track: {
          id: 'track-1',
          name: 'SDE / Backend Engineer',
          core_topics: ['Data Structures', 'System Design'],
        },
      },
    ],
    activeTarget: { id: 'target-sde' },
    tracks: [{ id: 'track-1', name: 'SDE / Backend Engineer', core_topics: ['Data Structures'] }],
    stages: [
      { id: 'stg-1', stage_order: 1, stage_type: 'aptitude', title: 'Aptitude', unlocked: true, best_score: 85 },
      { id: 'stg-2', stage_order: 2, stage_type: 'technical_mcq', title: 'Core Tech', unlocked: true, best_score: null },
      { id: 'stg-3', stage_order: 3, stage_type: 'coding', title: 'Coding', unlocked: false, best_score: null },
      { id: 'stg-4', stage_order: 4, stage_type: 'technical_interview', title: 'Interview', unlocked: false, best_score: null },
      { id: 'stg-5', stage_order: 5, stage_type: 'hr_interview', title: 'HR', unlocked: false, best_score: null },
    ],
    setActiveTargetId: vi.fn(),
    createTarget: vi.fn(),
  }),
}));

describe('JobTargets Component', () => {
  it('renders target card and 5-stage stepper reflecting locked/unlocked states correctly', () => {
    render(
      <MemoryRouter>
        <JobTargets />
      </MemoryRouter>
    );

    // Verify track title and company
    expect(screen.getByText('SDE / Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText(/55%/)).toBeInTheDocument();

    // Verify 5 stages in the stepper
    expect(screen.getByText('Aptitude')).toBeInTheDocument();
    expect(screen.getByText('Core Tech')).toBeInTheDocument();
    expect(screen.getByText('Coding')).toBeInTheDocument();
    expect(screen.getByText('Interview')).toBeInTheDocument();
    expect(screen.getByText('HR')).toBeInTheDocument();
  });
});
