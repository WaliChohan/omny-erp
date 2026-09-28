'use client';

import React from 'react';

interface LetterheadHeaderProps {
  documentTag?: string;
  subTagline?: string;
}

export default function LetterheadHeader({
  documentTag = 'OFFICIAL DOCUMENT',
  subTagline = 'Helping businesses adapt AI for growth',
}: LetterheadHeaderProps) {
  return (
    <header className="relative w-full bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#480CA8] text-white px-8 py-5 flex items-center justify-between overflow-hidden shadow-md select-none print:shadow-none">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      {/* Left Branding Box */}
      <div className="relative z-10 flex items-center gap-4">
        {/* OmnySync 3D Orbital Ring SVG Logo */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-12 h-12 drop-shadow-[0_0_8px_rgba(72,12,168,0.8)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Orbital Ellipse */}
            <ellipse
              cx="50"
              cy="50"
              rx="42"
              ry="16"
              transform="rotate(-25 50 50)"
              stroke="url(#ringGrad1)"
              strokeWidth="4"
            />
            {/* Inner Counter Orbital Ellipse */}
            <ellipse
              cx="50"
              cy="50"
              rx="42"
              ry="16"
              transform="rotate(65 50 50)"
              stroke="url(#ringGrad2)"
              strokeWidth="3"
            />
            {/* Center Core Sphere */}
            <circle cx="50" cy="50" r="10" fill="url(#coreGrad)" />
            {/* Glowing Accent Sparks */}
            <circle cx="20" cy="35" r="3" fill="#00E676" className="animate-pulse" />
            <circle cx="80" cy="65" r="3" fill="#38BDF8" className="animate-pulse" />

            <defs>
              <linearGradient id="ringGrad1" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#480CA8" />
                <stop offset="100%" stopColor="#00E676" />
              </linearGradient>
              <linearGradient id="ringGrad2" x1="100" y1="0" x2="0" y2="100">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#480CA8" />
              </linearGradient>
              <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0B132B" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-wider text-white">OMNY</span>
            <span className="text-xl font-black tracking-wider text-[#38BDF8]">SYNC</span>
          </div>
          <p className="text-[11px] font-medium text-[#E2E8F0] tracking-wide opacity-90">
            {subTagline}
          </p>
        </div>
      </div>

      {/* Right Document Tag */}
      <div className="relative z-10 text-right">
        <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1">
          <span className="text-xs font-bold tracking-widest text-[#38BDF8] uppercase">
            {documentTag}
          </span>
        </div>
      </div>
    </header>
  );
}
