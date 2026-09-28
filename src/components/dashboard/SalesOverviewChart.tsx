'use client';

import React, { useState } from 'react';
import { ChevronDown, BarChart2 } from 'lucide-react';
import FolderCard from '@/components/common/FolderCard';

interface SalesOverviewProps {
  timeframe?: string;
  onViewAnalytics?: () => void;
}

const DATA_POINTS = [
  { day: '22 Mar', revenueVal: 38, orderVal: 28, revenueAmount: '$5,240', ordersCount: 18 },
  { day: '23 Mar', revenueVal: 48, orderVal: 36, revenueAmount: '$6,480', ordersCount: 22 },
  { day: '24 Mar', revenueVal: 42, orderVal: 30, revenueAmount: '$5,820', ordersCount: 19 },
  { day: '25 Mar', revenueVal: 58, orderVal: 45, revenueAmount: '$7,350', ordersCount: 24 },
  { day: '26 Mar', revenueVal: 65, orderVal: 48, revenueAmount: '$8,120', ordersCount: 26 },
  { day: '27 Mar', revenueVal: 72, orderVal: 42, revenueAmount: '$8,940', ordersCount: 21 },
  { day: '28 Mar', revenueVal: 88, orderVal: 52, revenueAmount: '$10,280', ordersCount: 28 },
];

export default function SalesOverviewChart({ onViewAnalytics }: SalesOverviewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 Days');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG dimensions
  const svgWidth = 520;
  const svgHeight = 170;
  const bottomPadding = 25;
  const chartHeight = svgHeight - bottomPadding;

  const barWidth = 14;
  const slotWidth = svgWidth / DATA_POINTS.length;

  // Calculate coordinates for line curve and bars
  const points = DATA_POINTS.map((d, i) => {
    const x = i * slotWidth + slotWidth / 2;
    const y = chartHeight - (d.revenueVal / 100) * (chartHeight - 20) - 10;
    return { x, y, ...d };
  });

  // Smooth cubic bezier spline
  const linePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  return (
    <FolderCard
      onOpenDetail={onViewAnalytics}
      themeColor="green"
      buttonSize="md"
      minHeight="min-h-[300px]"
      actionTooltip="Open Complete Analytics Hub"
      avatar={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#18261e] border border-[#23382c] flex items-center justify-center text-[#00e676] shadow-sm">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Revenue Overview</h2>
            <p className="text-[11px] text-[#9ca3af]">Billings & pipeline activity</p>
          </div>
        </div>
      }
      badge={
        <div
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPeriod(selectedPeriod === 'Last 7 Days' ? 'Last 30 Days' : 'Last 7 Days');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#15241b] border border-[#203627] text-xs font-semibold text-[#9ca3af] hover:text-white cursor-pointer transition-colors"
        >
          <span>{selectedPeriod}</span>
          <ChevronDown className="w-3 h-3 text-[#6b7280]" />
        </div>
      }
    >
      <div className="pt-2">
        {/* Metric preview */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-black text-white tracking-tight">
            {hoveredIdx !== null ? points[hoveredIdx].revenueAmount : 'PKR 2.1M'}
          </span>
          <span className="text-xs font-bold text-[#00e676]">
            {hoveredIdx !== null ? `${points[hoveredIdx].ordersCount} deals` : '+14.8% vs last week'}
          </span>
        </div>

        {/* Chart SVG */}
        <div className="w-full relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-44 overflow-visible"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              <linearGradient id="barGradSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0f766e" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="lineGradSales" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00e676" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                y1={chartHeight * ratio}
                x2={svgWidth}
                y2={chartHeight * ratio}
                stroke="#1c2b22"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}

            {/* Bars */}
            {points.map((pt, i) => {
              const bHeight = (pt.orderVal / 100) * (chartHeight - 30);
              const bY = chartHeight - bHeight;
              const isHovered = hoveredIdx === i;

              return (
                <g
                  key={pt.day}
                  onMouseEnter={() => setHoveredIdx(i)}
                  className="cursor-pointer"
                >
                  <rect
                    x={pt.x - barWidth / 2}
                    y={bY}
                    width={barWidth}
                    height={bHeight}
                    rx="4"
                    fill="url(#barGradSales)"
                    opacity={isHovered ? 1 : 0.6}
                    className="transition-opacity duration-150"
                  />
                  <text
                    x={pt.x}
                    y={svgHeight - 6}
                    textAnchor="middle"
                    fill={isHovered ? '#ffffff' : '#6b7280'}
                    fontSize="10"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                  >
                    {pt.day}
                  </text>
                </g>
              );
            })}

            {/* Continuous Line */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGradSales)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Point circles */}
            {points.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 5 : 3.5}
                fill="#0b0f0d"
                stroke="#00e676"
                strokeWidth="2"
                className="transition-all duration-150"
              />
            ))}
          </svg>
        </div>
      </div>
    </FolderCard>
  );
}
