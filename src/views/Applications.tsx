// ==============================================================================
// Placement Prep Platform - Applications Pipeline View (Section 16.5 Spec)
// Tracks campus placement drives across Applying, Interviewing, Offer, and Rejected stages.
// ==============================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApplicationRecord, ApplicationStatus } from '../types';
import {
  Briefcase,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  Calendar,
  Trash2,
  X,
} from 'lucide-react';

const statusBadges: Record<ApplicationStatus, { text: string; bg: string; border: string }> = {
  Applying: { text: 'text-indigo-400', bg: 'bg-indigo-950/40', border: 'border-indigo-800/50' },
  Interviewing: { text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-800/50' },
  Offer: { text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-800/50' },
  Rejected: { text: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-800/50' },
};

export const Applications: React.FC = () => {
  const { user } = useAuth();

  const [applications, setApplications] = useState<ApplicationRecord[]>([
    {
      id: 'app-1',
      user_id: user?.id || 'preview-user-id',
      company: 'Google',
      role: 'Software Engineer (Campus 2026)',
      status: 'Interviewing',
      feedback: 'Cleared online assessment round; scheduling technical video interview.',
      applied_date: '2026-09-15',
      created_at: new Date().toISOString(),
    },
    {
      id: 'app-2',
      user_id: user?.id || 'preview-user-id',
      company: 'Microsoft',
      role: 'Full-Stack Developer',
      status: 'Applying',
      feedback: 'Resume submitted via campus portal.',
      applied_date: '2026-09-20',
      created_at: new Date().toISOString(),
    },
    {
      id: 'app-3',
      user_id: user?.id || 'preview-user-id',
      company: 'Stripe',
      role: 'Backend Systems Engineer',
      status: 'Offer',
      feedback: 'Final round cleared! Received written campus placement offer letter.',
      applied_date: '2026-09-02',
      created_at: new Date().toISOString(),
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Applying');
  const [feedback, setFeedback] = useState('');

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      user_id: user?.id || 'preview-user-id',
      company: company.trim(),
      role: role.trim(),
      status,
      feedback: feedback.trim() || null,
      applied_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);
    setIsModalOpen(false);
    setCompany('');
    setRole('');
    setFeedback('');
    setStatus('Applying');
  };

  const handleDelete = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const offersCount = applications.filter((a) => a.status === 'Offer').length;
  const interviewingCount = applications.filter((a) => a.status === 'Interviewing').length;

  return (
    <div className="space-y-6 pb-12 animate-slide-in">
      {/* 1. Header (Two-line header as per Section 16.5 spec) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Application Pipeline & Tracker
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Log and manage campus recruitment drives, interview dates, and offer statuses.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider font-mono">Total Applied</span>
          <div className="text-2xl font-bold font-mono text-zinc-100 mt-1 tabular-nums">
            {applications.length}
          </div>
        </div>
        <div className="card-premium p-4">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider font-mono">Interviewing</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {interviewingCount}
          </div>
        </div>
        <div className="card-premium p-4">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider font-mono">Offers Received</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {offersCount}
          </div>
        </div>
        <div className="card-premium p-4">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider font-mono">Offer Conversion</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            {applications.length > 0 ? Math.round((offersCount / applications.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="card-premium overflow-hidden">
        <div className="divide-y divide-zinc-800">
          {applications.map((app) => {
            const badge = statusBadges[app.status];
            return (
              <div
                key={app.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-850 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-zinc-400" />
                    <span className="font-bold text-sm text-zinc-100">{app.company}</span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.border} ${badge.text}`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-medium">{app.role}</p>

                  {app.feedback && (
                    <p className="text-xs text-zinc-400 italic mt-1 font-sans">{app.feedback}</p>
                  )}

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Applied: {app.applied_date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Applying">Applying</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add Application */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md card-premium card-score-glow p-6 space-y-4 animate-slide-in">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-100">Log Campus Application</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Amazon, Atlassian"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. SDE I (Backend)"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Applying">Applying</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Notes / Feedback</label>
                <textarea
                  rows={2}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Any interview date or recruiter notes..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md cursor-pointer"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
