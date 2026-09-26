// ==============================================================================
// PrepGated - Main App Layout Component
// Clean responsive layout with sidebar, topbar, sick dashboard background, and theme support.
// ==============================================================================

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { DashboardBackground } from './DashboardBackground';

export const Layout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-[#0F0F11] p-6 relative">
        <DashboardBackground />
        <div className="w-full max-w-md space-y-4 relative z-10">
          <div className="h-8 w-48 bg-zinc-200/80 dark:bg-[#18181b]/80 rounded-xl animate-pulse" />
          <div className="h-44 bg-zinc-200/80 dark:bg-[#18181b]/80 border border-zinc-300 dark:border-[#1c1c1f] rounded-xl animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-28 bg-zinc-200/80 dark:bg-[#18181b]/80 border border-zinc-300 dark:border-[#1c1c1f] rounded-xl animate-pulse" />
            <div className="h-28 bg-zinc-200/80 dark:bg-[#18181b]/80 border border-zinc-300 dark:border-[#1c1c1f] rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-[#f8fafc] dark:bg-[#07080c] text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-[#4f46e5] selection:text-white transition-colors duration-200">
      {/* Sophisticated Architectural Background with Recessed Planes, Subtle Perspective & Soft Directional Lighting */}
      <DashboardBackground />

      {/* Navigation & Content Area */}
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-[220px] min-w-0 transition-all duration-200 relative z-10">
        <TopBar />
        <main className="flex-1 w-full max-w-[1240px] mx-auto px-5 md:px-8 py-7 min-w-0 pb-24 md:pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
