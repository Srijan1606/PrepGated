// ==============================================================================
// CareerPath AI - Main App Router
// ==============================================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobTargetsProvider } from './context/JobTargetsContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';

import { MarketDashboard } from './views/MarketDashboard';
import { AdaptiveLearningPath } from './views/AdaptiveLearningPath';
import { ResumeBuilderOptimizer } from './views/ResumeBuilderOptimizer';
import { JobMockInterview } from './views/JobMockInterview';
import { JobRecommendations } from './views/JobRecommendations';
import { JobExtraTests } from './views/JobExtraTests';

import { Dashboard } from './views/Dashboard';
import { EmployerPortal } from './views/EmployerPortal';
import { JobTargets } from './views/JobTargets';
import { StageRunner } from './views/StageRunner';
import { StudyPath } from './views/StudyPath';
import { AchievementsView } from './views/AchievementsView';
import { Login } from './views/Login';
import { Onboarding } from './views/Onboarding';
import { NotFound } from './views/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JobTargetsProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* Authenticated Layout Routes */}
              <Route element={<Layout />}>
                {/* 1. Job Market Dashboard (Home) */}
                <Route path="/" element={<Navigate to="/market" replace />} />
                <Route path="/market" element={<MarketDashboard />} />

                {/* 2. Adaptive Learning Path */}
                <Route path="/learning-path" element={<AdaptiveLearningPath />} />

                {/* 3. Resume Builder & Optimizer */}
                <Route path="/resume" element={<ResumeBuilderOptimizer />} />

                {/* 4. Job Recommendation Engine */}
                <Route path="/job-recommendations" element={<JobRecommendations />} />

                {/* 5. Job-Specific Mock Interview */}
                <Route path="/mock-interview" element={<JobMockInterview />} />

                {/* 6. Job-Specific Extra Hard Tests */}
                <Route path="/tests" element={<JobExtraTests />} />

                {/* Candidate Dashboard & Placement Pipeline */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employer" element={<EmployerPortal />} />
                <Route path="/targets" element={<JobTargets />} />
                <Route path="/tracks" element={<JobTargets />} />
                <Route path="/stages/:stageId" element={<StageRunner />} />
                <Route path="/targets/:id/stage/:stageId" element={<StageRunner />} />
                <Route path="/targets/:id/study-path" element={<StudyPath />} />
                <Route path="/achievements" element={<AchievementsView />} />
              </Route>

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </JobTargetsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
