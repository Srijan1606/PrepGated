// ==============================================================================
// PrepGated - Sick Cybernetic Portal Dashboard Background
// Layered architectural depth with:
// - Monumental top portal horizon beam & glowing plasma aurora
// - High-precision cybernetic coordinate grid with crosshairs and depth perspective
// - Subtle floating star-matrix nodes with ambient luminescence
// - Fully reactive to Light Mode (crisp celestial blueprint) & Dark Mode (deep obsidian portal)
// ==============================================================================

import React, { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

export const DashboardBackground: React.FC = () => {
  const { isDark } = useTheme();

  // Generate deterministic floating coordinate points for cybernetic depth
  const cyberNodes = useMemo(() => [
    { x: '12%', y: '18%', label: 'NODE-01 // LAT-42.8', delay: '0s' },
    { x: '88%', y: '24%', label: 'GATE-NORTH // 0x4F', delay: '1.2s' },
    { x: '24%', y: '72%', label: 'VECTOR-SYS // READY', delay: '2.4s' },
    { x: '78%', y: '82%', label: 'CORE // SYNCED', delay: '1.8s' },
    { x: '50%', y: '45%', label: 'CENTRAL HUB', delay: '0.6s' },
  ], []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-colors duration-500"
    >
      {/* 1. Base Gradient Atmosphere */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark
            ? 'opacity-100 bg-[#07080c]'
            : 'opacity-100 bg-[#f8fafc]'
        }`}
      />

      {/* 2. Ambient Plasma Aurora Bloom (Top Horizon) */}
      <div
        className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] rounded-full blur-[120px] transition-all duration-700 ${
          isDark
            ? 'bg-gradient-to-b from-[#6366f1]/30 via-[#7c3aed]/20 to-transparent opacity-90'
            : 'bg-gradient-to-b from-indigo-200/50 via-purple-100/40 to-transparent opacity-80'
        }`}
      />

      {/* 3. Secondary Cyan Cyber Flare (Bottom Right Horizon) */}
      <div
        className={`absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[140px] transition-all duration-700 ${
          isDark
            ? 'bg-gradient-to-tl from-[#06b6d4]/15 via-[#3b82f6]/10 to-transparent opacity-70'
            : 'bg-gradient-to-tl from-cyan-100/50 via-indigo-50/40 to-transparent opacity-60'
        }`}
      />

      {/* 4. Tertiary Violet Accent Flare (Top Left) */}
      <div
        className={`absolute top-20 -left-32 w-[500px] h-[500px] rounded-full blur-[130px] transition-all duration-700 ${
          isDark
            ? 'bg-[#4338ca]/20 opacity-60'
            : 'bg-indigo-100/60 opacity-60'
        }`}
      />

      {/* 5. Sick Cybernetic Grid Overlay with Perspective Horizon */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.35] transition-opacity duration-500"
        style={{
          backgroundImage: isDark
            ? `
              linear-gradient(to right, rgba(99, 102, 241, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.12) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)
            `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 85%)',
        }}
      />

      {/* 6. Dot Matrix Overlay for Tactical Depth */}
      <div
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.2] transition-opacity duration-500"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(rgba(129, 140, 248, 0.4) 1px, transparent 1px)'
            : 'radial-gradient(rgba(79, 70, 229, 0.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 90%)',
        }}
      />

      {/* 7. Top Portal Horizon Laser Line with Soft Halo */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#818cf8] to-transparent dark:via-[#6366f1] opacity-75" />
        <div className="w-full h-[6px] -mt-[3px] bg-gradient-to-r from-transparent via-[#a5b4fc]/50 to-transparent blur-[3px]" />
      </div>
    </div>
  );
};
