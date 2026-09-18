'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SalesOverviewProps {
  timeframe?: string;
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

export default function SalesOverviewChart({}: SalesOverviewProps) {
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
    <div className="bg-[#121815] border border-[#1b2620] rounded-xl p-5 flex flex-col justify-between">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-white tracking-tight">Sales Overview</h2>
          <div className="relative">
            <button
              onClick={() => setSelectedPeriod(selectedPeriod === 'Last 7 Days' ? 'Last 30 Days' : 'Last 7 Days')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16201b] border border-[#223328] text-xs text-[#9ca3af] hover:text-white transition-colors"
            >
              <span>{selectedPeriod}</span>
              <ChevronDown className="w-3 h-3 text-[#6b7280]" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e676] shadow-sm shadow-[#00e676]/50"></span>
            <span className="text-[#9ca3af]">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#27352d]"></span>
            <span className="text-[#9ca3af]">Orders</span>
          </div>
        </div>
      </div>

      {/* Main Chart + Stats summary split */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Chart area */}
        <div className="flex-1 w-full relative min-h-[170px]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-44 overflow-visible"
          >
            <defs>
              <linearGradient id="revenueBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e676" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00b34d" stopOpacity="0.75" />
              </linearGradient>
              <filter id="glowLine" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Subtle horizontal grid lines */}
            <line x1="0" y1={chartHeight * 0.25} x2={svgWidth} y2={chartHeight * 0.25} stroke="#17221c" strokeDasharray="3 3" />
            <line x1="0" y1={chartHeight * 0.5} x2={svgWidth} y2={chartHeight * 0.5} stroke="#17221c" strokeDasharray="3 3" />
            <line x1="0" y1={chartHeight * 0.75} x2={svgWidth} y2={chartHeight * 0.75} stroke="#17221c" strokeDasharray="3 3" />

            {/* Bars */}
            {points.map((pt, i) => {
              const orderH = (pt.orderVal / 100) * (chartHeight - 20);
              const revH = (pt.revenueVal / 100) * (chartHeight - 20);
              const orderY = chartHeight - orderH;
              const revY = chartHeight - revH;
              const isHovered = hoveredIdx === i;

              return (
                <g
                  key={pt.day}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="cursor-pointer transition-opacity"
                >
                  {/* Order bar (Dark gray/charcoal) */}
                  <rect
                    x={pt.x - barWidth - 2}
                    y={orderY}
                    width={barWidth}
                    height={orderH}
                    rx="3"
                    fill={isHovered ? '#37493f' : '#212d26'}
                    className="transition-colors duration-150"
                  />

                  {/* Revenue bar (Bright emerald green) */}
                  <rect
                    x={pt.x + 2}
                    y={revY}
                    width={barWidth}
                    height={revH}
                    rx="3"
                    fill="url(#revenueBarGrad)"
                    className={`transition-all duration-150 ${isHovered ? 'brightness-110' : ''}`}
                  />

                  {/* Day label */}
                  <text
                    x={pt.x}
                    y={svgHeight - 4}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="11"
                    fontFamily="inherit"
                  >
                    {pt.day}
                  </text>
                </g>
              );
            })}

            {/* Overlaid Spline Curve (Revenue Trend Line) */}
            <path
              d={linePath}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glowLine)"
            />

            {/* Overlaid Data Nodes on the Line */}
            {points.map((pt, i) => (
              <g key={`node-${i}`}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#00e676"
                  strokeWidth="2"
                  className="transition-transform hover:scale-125"
                />
              </g>
            ))}
          </svg>

          {/* Hover Tooltip */}
          {hoveredIdx !== null && (
            <div
              className="absolute pointer-events-none bg-[#18241d] border border-[#274032] rounded-lg p-2 text-xs shadow-xl z-20"
              style={{
                left: `${(hoveredIdx / (DATA_POINTS.length - 1)) * 80}%`,
                top: '10px',
              }}
            >
              <div className="font-semibold text-white">{DATA_POINTS[hoveredIdx].day}</div>
              <div className="text-[#00e676]">Revenue: {DATA_POINTS[hoveredIdx].revenueAmount}</div>
              <div className="text-[#9ca3af]">Orders: {DATA_POINTS[hoveredIdx].ordersCount}</div>
            </div>
          )}
        </div>

        {/* Right side stat metrics inside card */}
        <div className="flex lg:flex-col justify-between w-full lg:w-40 border-t lg:border-t-0 lg:border-l border-[#1a2620] pt-4 lg:pt-0 lg:pl-6 gap-3 shrink-0">
          <div>
            <span className="text-xs text-[#9ca3af] block">Total Revenue</span>
            <span className="text-xl font-bold text-white tracking-tight">$ 48,230</span>
          </div>
          <div>
            <span className="text-xs text-[#9ca3af] block">Total Orders</span>
            <span className="text-xl font-bold text-white tracking-tight">142</span>
          </div>
          <div>
            <span className="text-xs text-[#9ca3af] block">Avg. Order Value</span>
            <span className="text-xl font-bold text-white tracking-tight">$ 342</span>
          </div>
        </div>
      </div>
    </div>
  );
}
