// ==============================================================================
// Placement Prep Platform - Trophy Unlock Modal
// Section 16.6 Spec:
// - No photo.
// - Dark modal: background #111113, border 1px solid #27272a, border-radius 12px, max-width 400px.
// - Top: "NEW BADGE" label in indigo caps.
// - Center: large SVG badge mark — a simple circle outline (stroke: #6366f1, stroke-width: 1.5px, r: 48)
//   with the trophy/medal Lucide icon centered inside at 32px, color: #818cf8.
// - Badge name as H2, one-line description.
// - Two buttons side by side: "View all badges" (outline) and "Continue" (indigo filled).
// ==============================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Award } from 'lucide-react';
import { AchievementBadge } from '../types';

interface TrophyUnlockModalProps {
  badge: AchievementBadge | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TrophyUnlockModal: React.FC<TrophyUnlockModalProps> = ({
  badge,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !badge) return null;

  const handleViewAllBadges = () => {
    onClose();
    navigate('/achievements');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-title"
    >
      <div className="w-full max-w-[400px] bg-[#111113] border border-[#27272a] rounded-[12px] p-8 text-center space-y-5 select-none animate-slide-in">
        {/* Top: "NEW BADGE" in indigo caps */}
        <span className="text-[11px] font-semibold tracking-[1.5px] uppercase text-[#818cf8] font-mono block">
          New badge
        </span>

        {/* Center: Large SVG badge mark — simple circle outline (r: 48, stroke: #6366f1) with trophy icon inside */}
        <div className="flex items-center justify-center py-2">
          <div className="relative w-[116px] h-[116px] flex items-center justify-center">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 116 116"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer circle outline: r=48 */}
              <circle
                cx="58"
                cy="58"
                r="48"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity="0.4"
              />
              <circle
                cx="58"
                cy="58"
                r="44"
                stroke="#6366f1"
                strokeWidth="1.5"
              />
            </svg>
            <div className="relative z-10 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-[#818cf8]" />
            </div>
          </div>
        </div>

        {/* Badge Name as H2 and one-line description */}
        <div className="space-y-1">
          <h2
            id="badge-title"
            className="text-xl font-bold tracking-tight text-[#fafafa]"
          >
            {badge.title}
          </h2>
          <p className="text-xs text-[#71717a] leading-relaxed max-w-[280px] mx-auto">
            {badge.description}
          </p>
        </div>

        {/* Two buttons side by side */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleViewAllBadges}
            className="w-full py-2.5 px-3 rounded-[6px] text-xs font-semibold text-zinc-300 border border-[#27272a] hover:bg-[#18181b] hover:text-white transition-colors cursor-pointer"
          >
            View all badges
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-3 rounded-[6px] text-xs font-semibold text-white bg-[#6366f1] hover:bg-[#4f46e5] transition-colors cursor-pointer shadow-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
