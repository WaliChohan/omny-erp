'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ChannelShare } from '@/data/dashboardData';

interface SalesByChannelProps {
  channels: ChannelShare[];
}

export default function SalesByChannel({ channels }: SalesByChannelProps) {
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
    <div className="bg-[#121815] border border-[#1b2620] rounded-xl p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white tracking-tight">Sales by Channel</h2>
        <button
          onClick={() => setPeriod(period === 'This Month' ? 'This Quarter' : 'This Month')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16201b] border border-[#223328] text-xs text-[#9ca3af] hover:text-white transition-colors"
        >
          <span>{period}</span>
          <ChevronDown className="w-3 h-3 text-[#6b7280]" />
        </button>
      </div>

      {/* Donut Chart & Legend */}
      <div className="flex items-center justify-between gap-4 py-2">
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
            <span className="text-xs font-bold text-white tracking-tight">
              {hoveredIdx !== null ? channels[hoveredIdx].revenue : '$48,230'}
            </span>
            <span className="text-[9px] text-[#6b7280] uppercase tracking-wider font-medium">
              {hoveredIdx !== null ? channels[hoveredIdx].name : 'Total Sales'}
            </span>
          </div>
        </div>

        {/* Legend / Metrics List */}
        <div className="flex-1 space-y-2 min-w-0">
          {channels.map((ch, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={ch.name}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between text-xs cursor-pointer py-0.5 px-1.5 rounded transition-all ${
                  isHovered ? 'bg-[#18231d]' : ''
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: ch.color }}
                  ></span>
                  <span className={`truncate text-xs ${isHovered ? 'text-white font-medium' : 'text-[#9ca3af]'}`}>
                    {ch.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-right">
                  <span className="text-[#6b7280] text-[11px]">{ch.percent}%</span>
                  <span className="font-semibold text-white text-xs">{ch.revenue}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
