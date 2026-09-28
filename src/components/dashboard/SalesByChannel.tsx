'use client';

import React, { useState } from 'react';
import { ChevronDown, PieChart } from 'lucide-react';
import { ChannelShare } from '@/data/dashboardData';
import FolderCard from '@/components/common/FolderCard';

interface SalesByChannelProps {
  channels: ChannelShare[];
  onViewChannelBreakdown?: () => void;
}

export default function SalesByChannel({ channels, onViewChannelBreakdown }: SalesByChannelProps) {
  const [period, setPeriod] = useState('This Month');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Donut chart math
  const size = 130;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute offsets for each channel segment
  let accumulatedPercent = 0;
  const segments = channels.map((channel, i) => {
    const strokeDasharray = `${(channel.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += channel.percent;

    return {
      ...channel,
      strokeDasharray,
      strokeDashoffset,
      index: i,
    };
  });

  return (
    <FolderCard
      onOpenDetail={onViewChannelBreakdown}
      themeColor="green"
      buttonSize="md"
      minHeight="min-h-[300px]"
      actionTooltip="View service mix"
      avatar={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#18261e] border border-[#23382c] flex items-center justify-center text-[#00e676] shadow-sm">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Revenue by Service</h2>
            <p className="text-[11px] text-[#9ca3af]">Agency service mix</p>
          </div>
        </div>
      }
      badge={
        <div
          onClick={(e) => {
            e.stopPropagation();
            setPeriod(period === 'This Month' ? 'This Quarter' : 'This Month');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#15241b] border border-[#203627] text-xs font-semibold text-[#9ca3af] hover:text-white cursor-pointer transition-colors"
        >
          <span>{period}</span>
          <ChevronDown className="w-3 h-3 text-[#6b7280]" />
        </div>
      }
    >
      {/* Donut Chart & Legend */}
      <div className="flex items-center justify-between gap-4 py-2 flex-1">
        {/* SVG Donut Chart */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#19231d"
              strokeWidth={strokeWidth}
            />
            {/* Colored Segments */}
            {segments.map((seg) => {
              const isHovered = hoveredIdx === seg.index;
              return (
                <circle
                  key={seg.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredIdx(seg.index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 6px ${seg.color})` : 'none',
                  }}
                />
              );
            })}
          </svg>

          {/* Central Metric */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xs font-black text-white tracking-tight">
              {hoveredIdx !== null ? channels[hoveredIdx].revenue : 'PKR 14.8M'}
            </span>
            <span className="text-[9px] text-[#6b7280] uppercase tracking-wider font-semibold">
              {hoveredIdx !== null ? channels[hoveredIdx].name : 'Total Revenue'}
            </span>
          </div>
        </div>

        {/* Legend / Metrics List */}
        <div className="flex-1 space-y-1.5 min-w-0">
          {channels.map((ch, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={ch.name}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between text-xs cursor-pointer py-1 px-1.5 rounded-lg transition-all ${
                  isHovered ? 'bg-[#18261e]' : ''
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: ch.color }}
                  ></span>
                  <span className={`truncate text-xs ${isHovered ? 'text-white font-semibold' : 'text-[#9ca3af]'}`}>
                    {ch.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-right">
                  <span className="text-[#6b7280] text-[11px]">{ch.percent}%</span>
                  <span className="font-bold text-white text-xs">{ch.revenue}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FolderCard>
  );
}
