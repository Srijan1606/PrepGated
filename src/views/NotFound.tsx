// ==============================================================================
// Placement Prep Platform - 404 Not Found Page
// Section 16.6 Visual Style Override:
// Full-viewport.
// Background: brutalist architecture photo with heavy dark gradient.
// Large 404 in font-size: 96px, font-weight: 800, color: #fafafa, opacity: 0.9.
// Below: "This route doesn't exist." in H2, one-line descriptor.
// Two buttons: "Go to Dashboard" (indigo) and "Browse Tracks" (outline).
// No illustration, no cartoon character.
// ==============================================================================

import React from 'react';
import { NavLink } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 text-center select-none bg-cover bg-center relative"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(10,10,12,0.65) 0%, rgba(10,10,12,0.92) 65%, #0f0f11 100%),
          url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')
        `,
      }}
    >
      <div className="max-w-md space-y-4 z-10 p-6">
        {/* Large 404 */}
        <div
          className="text-[#fafafa] font-extrabold tracking-tighter leading-none select-none"
          style={{ fontSize: '96px', fontWeight: 800, opacity: 0.9 }}
        >
          404
        </div>

        {/* H2 Title & Descriptor */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-[#fafafa]">
            This route doesn't exist.
          </h2>
          <p className="text-sm text-[#71717a] leading-relaxed">
            Looks like this path wasn't part of the roadmap.
          </p>
        </div>

        {/* Two buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <NavLink
            to="/dashboard"
            className="w-full sm:w-auto bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-[14px] py-2.5 px-5 rounded-[6px] transition-colors shadow-sm inline-flex items-center justify-center"
          >
            Go to Dashboard
          </NavLink>
          <NavLink
            to="/targets"
            className="w-full sm:w-auto border border-[#27272a] bg-[#18181b] hover:bg-[#202024] text-zinc-300 hover:text-white font-semibold text-[14px] py-2.5 px-5 rounded-[6px] transition-colors inline-flex items-center justify-center"
          >
            Browse Tracks
          </NavLink>
        </div>
      </div>
    </div>
  );
};
