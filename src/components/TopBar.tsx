// ==============================================================================
// PrepGated - Top Bar Component
// Horizontal strip with page title, multi-role track switcher, streak, percentile,
// theme switcher (Light / Dark mode), and action buttons.
// ==============================================================================

import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobTargets } from '../context/JobTargetsContext';
import { useTheme } from '../context/ThemeContext';
import {
  Flame,
  Target,
  ArrowRight,
  LogOut,
  TrendingUp,
  Sun,
  Moon,
  ChevronDown,
  Layers,
  Bell,
  Check,
  Building2,
  User,
  Compass,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user, profile, signOut, setUserRole } = useAuth();
  const { activeTarget, targets, setActiveTargetId, peerPercentile, notifications, markNotificationRead } = useJobTargets();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const currentRole = profile?.user_role || 'candidate';

  const handleToggleRole = async () => {
    const nextRole = currentRole === 'candidate' ? 'employer' : 'candidate';
    await setUserRole(nextRole);
    if (nextRole === 'employer') {
      navigate('/employer');
    } else {
      navigate('/dashboard');
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/employer')) return 'Employer Portal';
    if (path.startsWith('/market')) return 'In-Demand Jobs';
    if (path.startsWith('/learning-path')) return 'Adaptive Learning Path';
    if (path.startsWith('/resume')) return 'Resume & ATS Optimizer';
    if (path.startsWith('/mock-interview')) return 'Job Mock Interview';
    if (path.startsWith('/job-recommendations')) return 'Job Recommendations';
    if (path.startsWith('/tests')) return 'Extra Hard Tests';
    if (path.startsWith('/targets') && path.includes('study-path')) return 'Learning Path';
    if (path.startsWith('/targets')) return 'Job Tracks';
    if (path.startsWith('/stages')) return 'Assessment Stage';
    if (path.startsWith('/achievements')) return 'Trophies & Badges';
    return 'Candidate Dashboard';
  };

  const pageTitle = getPageTitle();
  const trackName = activeTarget?.job_track?.name || 'In-Demand Role Track';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0e17] px-5 md:px-8 py-3 transition-colors select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Page Title + Track Selector */}
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white font-display whitespace-nowrap">
            {pageTitle}
          </h1>
          <span className="text-zinc-400 select-none">·</span>

          {/* Role selector dropdown if multiple roles are selected */}
          {targets.length > 1 ? (
            <div className="relative group">
              <select
                value={activeTarget?.id || ''}
                onChange={(e) => setActiveTargetId(e.target.value)}
                className="text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-[#18181b] border border-zinc-300 dark:border-zinc-800 rounded-md px-2.5 py-1 pr-6 outline-none cursor-pointer focus:border-[#4f46e5] transition-colors truncate max-w-[180px] sm:max-w-[260px]"
                title="Switch active role track"
              >
                {targets.map((tgt) => (
                  <option key={tgt.id} value={tgt.id}>
                    {tgt.job_track?.name || 'Role Track'} ({tgt.readiness_score || 0}%)
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium truncate max-w-[180px] sm:max-w-[300px]">
              {trackName}
            </span>
          )}
        </div>

        {/* Right Section: Role Mode Switcher, Notifications, Theme Toggle, Actions */}
        <div className="flex items-center gap-2">
          {/* Career Track Segregation Onboarding Access */}
          <button
            type="button"
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#18181b] hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer shadow-xs"
            title="Retake Track Segregation Questions"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden md:inline">Track Segregation</span>
          </button>

          {/* Dual Mode Switcher (Candidate vs Employer) */}
          <button
            type="button"
            onClick={handleToggleRole}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-[#18181b] hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
            title={`Switch to ${currentRole === 'candidate' ? 'Employer Portal' : 'Candidate Mode'}`}
          >
            {currentRole === 'candidate' ? (
              <>
                <Building2 className="w-3.5 h-3.5 text-purple-500" />
                <span className="hidden sm:inline">Employer View</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Candidate View</span>
              </>
            )}
          </button>

          {/* Notification Bell with Dropdown (Section 18.2) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0c0e17]" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#11131a] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 z-50 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white font-display">
                    Notifications {unreadCount > 0 && `(${unreadCount} new)`}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Real-time alerts</span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markNotificationRead(item.id);
                        if (item.link) navigate(item.link);
                        setShowNotifications(false);
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        item.read
                          ? 'border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-[#18181b]/40 text-zinc-500'
                          : 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold truncate">{item.title}</span>
                        {!item.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 hover:border-[#4f46e5] shadow-xs transition-all cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono text-[11px] font-semibold text-zinc-300">Dark</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="font-mono text-[11px] font-semibold text-zinc-700">Light</span>
              </>
            )}
          </button>

          {/* Streak Pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
            title={`${profile?.streak_count || 1} day active streak`}
          >
            <Flame className="w-3.5 h-3.5 text-[#4f46e5]" />
            <span className="tabular-nums font-semibold">{profile?.streak_count || 1}d</span>
          </div>

          {/* User Sign Out */}
          <button
            type="button"
            onClick={handleSignOut}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-[#18181b] border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
