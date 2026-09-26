// ==============================================================================
// PrepGated - Sidebar Navigation Component
// 220px wide, Workspace and Tools navigation, PrepGated brand,
// user profile row at bottom with Theme toggle and sign-out.
// ==============================================================================

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobTargets } from '../context/JobTargetsContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  TrendingUp,
  GraduationCap,
  Trophy,
  FileText,
  Briefcase,
  MessageSquareCode,
  LogOut,
  Layers,
  ShieldAlert,
  Compass,
  Sun,
  Moon,
  Building2,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { achievements, targets } = useJobTargets();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const workspaceLinks = [
    { id: 'onboarding', to: '/onboarding', label: 'Track Segregation', icon: Sparkles, badge: 'Flow' },
    { id: 'dashboard', to: '/dashboard', label: 'Candidate Pipeline', icon: LayoutDashboard },
    { id: 'employer', to: '/employer', label: 'Employer Portal', icon: Building2, badge: 'Zero-Resume' },
    { id: 'market', to: '/market', label: 'In-Demand Jobs', icon: TrendingUp },
    { id: 'targets', to: '/targets', label: 'Job Tracks & Roles', icon: Compass, badge: `${targets.length} Active` },
    { id: 'learning-path', to: '/learning-path', label: 'Adaptive Learning Path', icon: GraduationCap },
    {
      id: 'achievements',
      to: '/achievements',
      label: 'Trophies & Badges',
      icon: Trophy,
      badge: `${achievements.totalUnlocked}/${achievements.totalBadges}`,
    },
  ];

  const toolsLinks = [
    { id: 'resume', to: '/resume', label: 'Resume & ATS Optimizer', icon: FileText },
    { id: 'mock-interview', to: '/mock-interview', label: 'Job Mock Interview', icon: MessageSquareCode },
    { id: 'job-recommendations', to: '/job-recommendations', label: 'Job Recommendations', icon: Briefcase },
    { id: 'tests', to: '/tests', label: 'Extra Hard Tests', icon: ShieldAlert },
  ];

  // Derive initials for avatar
  const initials = (profile?.name || user?.email || 'Candidate')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Desktop Fixed Sidebar: 220px wide */}
      <aside
        className="hidden md:flex fixed top-0 bottom-0 left-0 z-40 w-[220px] bg-white/85 dark:bg-[#0c0e17]/85 backdrop-blur-xl border-r border-zinc-200/80 dark:border-white/10 flex-col justify-between py-4 select-none transition-colors"
        aria-label="Sidebar Navigation"
      >
        <div className="flex flex-col gap-5 px-3">
          {/* Brand Header */}
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2.5 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 hover:opacity-90 transition-opacity"
          >
            {/* Double slanted slash logo */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-6 rounded-full bg-[#4f46e5] transform -skew-x-[24deg]" />
              <span className="w-1.5 h-6 rounded-full bg-[#818cf8] transform -skew-x-[24deg]" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white font-display block leading-none">
                PrepGated
              </span>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                Placement Intelligence
              </span>
            </div>
          </NavLink>

          {/* Nav Section: Workspace */}
          <div className="space-y-1">
            <span className="px-2.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
              Workspace
            </span>
            <nav className="flex flex-col gap-0.5 pt-1">
              {workspaceLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.id}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-white dark:bg-[#18181b] text-zinc-900 dark:text-white border-l-2 border-[#4f46e5] font-semibold shadow-xs pl-2'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-[#18181b]/50'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                      <span className="truncate">{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-[#18181b] text-zinc-700 dark:text-zinc-400 border border-zinc-300 dark:border-[#1c1c1f]">
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Nav Section: Tools */}
          <div className="space-y-1">
            <span className="px-2.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
              Career Tools
            </span>
            <nav className="flex flex-col gap-0.5 pt-1">
              {toolsLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.id}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-white dark:bg-[#18181b] text-zinc-900 dark:text-white border-l-2 border-[#4f46e5] font-semibold shadow-xs pl-2'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-[#18181b]/50'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                    <span className="truncate">{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile Row at Bottom */}
        <div className="px-3 pt-3 border-t border-zinc-200 dark:border-[#1c1c1f] space-y-2">
          {/* Quick theme switch button in sidebar */}
          <div className="flex items-center justify-between px-2 py-1 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-mono text-[11px]">Theme</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-200/60 dark:bg-[#18181b] border border-zinc-300 dark:border-[#27272a] text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer text-[11px] font-mono"
            >
              {isDark ? (
                <>
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-indigo-600" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#1c1c1f]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-[#4f46e5] flex items-center justify-center text-xs font-bold text-white shrink-0 font-mono">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                  {profile?.name || user?.email?.split('@')[0] || 'Candidate'}
                </p>
                <p className="text-[10px] text-zinc-500 font-mono truncate">
                  {user?.email || 'Logged In'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-[#27272a] transition-colors cursor-pointer shrink-0"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
