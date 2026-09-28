'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface FolderCardProps {
  children: React.ReactNode;
  onOpenDetail?: () => void;
  avatar?: React.ReactNode;
  actionTooltip?: string;
  className?: string;
  badge?: React.ReactNode;
  themeColor?: 'neon' | 'green' | 'teal' | 'purple' | 'orange' | 'blue' | 'gray';
  fillColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  minHeight?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  customButton?: React.ReactNode;
  hideTopAvatarArea?: boolean;
}

export default function FolderCard({
  children,
  onOpenDetail,
  avatar,
  actionTooltip = 'Open details',
  className = '',
  badge,
  themeColor = 'green',
  fillColor = '#121815',
  borderColor = '#1e2922',
  hoverBorderColor,
  minHeight = 'min-h-[220px]',
  buttonSize = 'md',
  customButton,
  hideTopAvatarArea = false,
}: FolderCardProps) {
  // Theme color maps for hover accents
  const themeStrokeMap: Record<string, string> = {
    neon: 'group-hover:stroke-[#b8ff00]',
    green: 'group-hover:stroke-[#00e676]',
    teal: 'group-hover:stroke-[#2dd4bf]',
    purple: 'group-hover:stroke-[#a855f7]',
    orange: 'group-hover:stroke-[#f97316]',
    blue: 'group-hover:stroke-[#38bdf8]',
    gray: 'group-hover:stroke-[#4b5563]',
  };

  const themeBtnHoverMap: Record<string, string> = {
    neon: 'group-hover:border-[#b8ff00] group-hover:text-[#b8ff00] hover:bg-[#b8ff00]/10',
    green: 'group-hover:border-[#00e676] group-hover:text-[#00e676] hover:bg-[#00e676]/10',
    teal: 'group-hover:border-[#2dd4bf] group-hover:text-[#2dd4bf] hover:bg-[#2dd4bf]/10',
    purple: 'group-hover:border-[#a855f7] group-hover:text-[#a855f7] hover:bg-[#a855f7]/10',
    orange: 'group-hover:border-[#f97316] group-hover:text-[#f97316] hover:bg-[#f97316]/10',
    blue: 'group-hover:border-[#38bdf8] group-hover:text-[#38bdf8] hover:bg-[#38bdf8]/10',
    gray: 'group-hover:border-[#9ca3af] group-hover:text-white hover:bg-white/5',
  };

  const btnSizeClasses = {
    sm: 'w-8 h-8 top-1.5 right-1.5',
    md: 'w-10 h-10 top-2 right-2',
    lg: 'w-12 h-12 top-2 right-2.5',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5 stroke-[2.5]',
    md: 'w-4 h-4 stroke-[2.5]',
    lg: 'w-5 h-5 stroke-[2.5]',
  };

  return (
    <div
      onClick={() => onOpenDetail?.()}
      className={`relative group w-full select-none ${onOpenDetail ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* ── Background SVG Folder Silhouette with Crisp Continuous Border ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xl"
        viewBox="0 0 280 240"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 28 0
             L 132 0
             C 160 0, 176 66, 204 66
             L 252 66
             A 28 28 0 0 1 280 94
             L 280 212
             A 28 28 0 0 1 252 240
             L 28 240
             A 28 28 0 0 1 0 212
             L 0 28
             A 28 28 0 0 1 28 0
             Z"
          fill={fillColor}
          stroke={borderColor}
          className={`${hoverBorderColor || themeStrokeMap[themeColor] || 'group-hover:stroke-[#00e676]'} transition-colors duration-200`}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* ── Top Floating Circle with Arrow (Opens Detailed View) ── */}
      <div className={`absolute z-20 ${btnSizeClasses[buttonSize]}`}>
        {customButton ? (
          customButton
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail?.();
            }}
            title={actionTooltip}
            className={`w-full h-full rounded-full bg-[#151f19] border border-[#233327] ${
              themeBtnHoverMap[themeColor] || 'group-hover:border-[#00e676] group-hover:text-[#00e676]'
            } text-[#9ca3af] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer`}
          >
            <ArrowUpRight className={iconSizes[buttonSize]} />
          </button>
        )}
      </div>

      {/* ── Card Content Layout ── */}
      <div className={`relative z-10 p-5 pt-4 flex flex-col justify-between ${minHeight}`}>
        {/* Top Tab Area: Avatar & Badge */}
        {!hideTopAvatarArea && (
          <div className="flex items-start justify-between min-h-[46px]">
            <div className="shrink-0">{avatar}</div>
            {badge && <div className="mr-12">{badge}</div>}
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 flex flex-col justify-between">{children}</div>
      </div>
    </div>
  );
}
