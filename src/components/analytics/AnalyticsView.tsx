'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Download,
  Filter,
  ArrowUp,
  MoreHorizontal
} from 'lucide-react';
import {
  MONTHLY_PROFIT_DATA,
  PROFIT_MARGIN_POINTS,
  STAFF_PERFORMANCE_POINTS
} from '@/data/analyticsData';

interface AnalyticsViewProps {
  onOpenAskAI: () => void;
}

export default function AnalyticsView({ onOpenAskAI }: AnalyticsViewProps) {
  const [activeMonthIdx, setActiveMonthIdx] = useState<number | null>(5); // default Jun (index 5)
  const [timeframe, setTimeframe] = useState('Monthly');

  // Profit Margins SVG line & area path
  const pmWidth = 260;
  const pmHeight = 85;
  const pmPoints = PROFIT_MARGIN_POINTS.map((pt, i) => ({
    x: (i / (PROFIT_MARGIN_POINTS.length - 1)) * pmWidth,
    y: pmHeight - (pt.val / 100) * (pmHeight - 15) - 5,
    ...pt,
  }));

  const pmLinePath = pmPoints.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const pmAreaPath = `${pmLinePath} L ${pmWidth} ${pmHeight} L 0 ${pmHeight} Z`;

  // Staff Performance SVG path
  const spWidth = 260;
  const spHeight = 85;
  const spPoints = STAFF_PERFORMANCE_POINTS.map((pt, i) => ({
    x: (i / (STAFF_PERFORMANCE_POINTS.length - 1)) * spWidth,
    y: spHeight - (pt.val / 100) * (spHeight - 15) - 5,
    ...pt,
  }));

  const spLinePath = spPoints.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  // Semi-circle CSAT gauge parameters
  const gaugeRadius = 85;
  const gaugeCircumference = Math.PI * gaugeRadius;
  const csatPercent = 0.82; // 4.7 out of 5 is ~94%, with multi-color stroke

  return (
    <div className="space-y-6">
      {/* Header bar matching Screenshot 4 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-white tracking-tight">Agency Analytics</h1>
          <button
            onClick={onOpenAskAI}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e2538] hover:bg-[#27324d] border border-[#3b4b73] text-xs font-semibold text-[#a5b4fc] transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
            <span>Ask AI</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setTimeframe(timeframe === 'Monthly' ? 'Quarterly' : 'Monthly')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141e18] border border-[#1e2e24] text-xs font-medium text-[#9ca3af] hover:text-white transition-colors"
          >
            <span>{timeframe}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => alert('Exporting complete Analytics Report...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141e18] border border-[#1e2e24] text-xs font-medium text-[#9ca3af] hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141e18] border border-[#2dd4bf]/40 text-xs font-bold text-[#2dd4bf] hover:bg-[#2dd4bf]/10 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Row 1: Revenue, Profit Margins, Staff Performances (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Revenue */}
        <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#2dd4bf]/5 pointer-events-none"></div>
          <div>
            <span className="text-xs font-semibold text-[#9ca3af] block">Revenue</span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-3">
              $120,873
            </h2>
          </div>

          <div className="pt-6">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#132a21] border border-[#1e4635] text-xs font-semibold text-[#2dd4bf]">
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+17% Than last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Profit Margins (Amber Area Chart) */}
        <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#9ca3af] block">Profit Margins</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white tracking-tight">$8,132</span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#fbbf24]">
                  <ArrowUp className="w-3 h-3" />
                  <span>12%</span>
                </span>
                <span className="text-[11px] text-[#6b7280]">vs last years</span>
              </div>
            </div>
          </div>

          {/* SVG Amber Line & Area Chart */}
          <div className="pt-3">
            <svg viewBox={`0 0 ${pmWidth} ${pmHeight}`} className="w-full h-20 overflow-visible">
              <defs>
                <linearGradient id="amberAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={pmAreaPath} fill="url(#amberAreaGrad)" />
              <path d={pmLinePath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            {/* Months Axis */}
            <div className="flex justify-between items-center text-[10px] text-[#6b7280] pt-2">
              {PROFIT_MARGIN_POINTS.map((p) => (
                <span
                  key={p.month}
                  className={`px-1.5 py-0.5 rounded ${
                    p.active ? 'bg-[#2dd4bf] text-[#052e24] font-bold' : ''
                  }`}
                >
                  {p.month}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Staff Performances (Purple Spline Curve) */}
        <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#9ca3af] block">Staff Performances</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white tracking-tight">97 / 100</span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#a855f7]">
                <ArrowUp className="w-3 h-3" />
                <span>12%</span>
              </span>
              <span className="text-[11px] text-[#6b7280]">vs last years</span>
            </div>
          </div>

          {/* SVG Purple Spline Curve */}
          <div className="pt-3">
            <svg viewBox={`0 0 ${spWidth} ${spHeight}`} className="w-full h-20 overflow-visible">
              <path d={spLinePath} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
              {/* Highlight active node on 100 */}
              <circle cx={spPoints[3].x} cy={spPoints[3].y} r="4.5" fill="#121915" stroke="#a855f7" strokeWidth="2.5" />
              <line
                x1={spPoints[3].x}
                y1={spPoints[3].y}
                x2={spPoints[3].x}
                y2={spHeight}
                stroke="#a855f7"
                strokeDasharray="2 2"
                strokeWidth="1.5"
              />
            </svg>

            {/* Score Axis */}
            <div className="flex justify-between items-center text-[10px] text-[#6b7280] pt-2">
              {STAFF_PERFORMANCE_POINTS.map((p) => (
                <span
                  key={p.score}
                  className={`px-1.5 py-0.5 rounded ${
                    p.active ? 'bg-[#a855f7] text-white font-bold' : ''
                  }`}
                >
                  {p.score}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Customer Satisfaction Gauge (Left) & Monthly Profit Multi-Bar Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Customer Satisfaction Semi-Circular Speedo Gauge */}
        <div className="lg:col-span-4 bg-[#121915] border border-[#1b2620] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Customer Satisfaction</h3>
              <p className="text-[11px] text-[#6b7280]">Top Positive Feedback</p>
            </div>
            <button className="text-[#6b7280] hover:text-white">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Semi-circular gauge */}
          <div className="py-4 flex flex-col items-center justify-center">
            <div className="relative w-48 h-28 flex items-center justify-center">
              <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
                {/* Background track arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#1c2822"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Cyan Arc portion */}
                <path
                  d="M 20 100 A 80 80 0 0 1 140 35"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Purple Arc portion */}
                <path
                  d="M 140 35 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Readout */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white tracking-tight">250</span>
                <span className="text-[10px] text-[#9ca3af]">Responses this month</span>
                <div className="flex items-center gap-3 text-[10px] mt-1 font-semibold">
                  <span className="flex items-center gap-1 text-[#2dd4bf]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></span>
                    High
                  </span>
                  <span className="flex items-center gap-1 text-[#a855f7]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></span>
                    Low
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CSAT pill */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162720] border border-[#214334] text-xs font-bold text-[#2dd4bf]">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>+12% Customer Satisfaction (CSAT): 4.7/5</span>
            </div>
            <p className="text-[11px] text-[#6b7280] mt-1.5">
              Exceptional support and quick responses
            </p>
          </div>
        </div>

        {/* Right: Monthly Profit Bar Chart with Tooltip */}
        <div className="lg:col-span-8 bg-[#121915] border border-[#1b2620] rounded-2xl p-6 flex flex-col justify-between">
          {/* Header controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-bold text-white tracking-tight">Monthly Profit</h3>
            <div className="flex items-center gap-2 text-xs">
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#16201b] border border-[#223328] text-[#9ca3af] hover:text-white">
                <span>Customer Satisfaction</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#16201b] border border-[#223328] text-[#9ca3af] hover:text-white">
                <span>Summary</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#132c24] border border-[#1f4c3c] text-[#2dd4bf] font-bold">
                <span>Yearly</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Bar Chart with Tooltip */}
          <div className="relative pt-6 pb-2">
            {/* Tooltip on June */}
            {activeMonthIdx !== null && (
              <div
                className="absolute z-20 pointer-events-none bg-[#16201b] border border-[#2dd4bf]/40 px-3 py-1.5 rounded-xl shadow-2xl text-xs"
                style={{
                  left: `${(activeMonthIdx / (MONTHLY_PROFIT_DATA.length - 1)) * 82 + 5}%`,
                  top: '0px',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></span>
                  <span className="text-[#9ca3af] text-[10px]">Profit</span>
                </div>
                <div className="font-mono font-black text-white text-sm">
                  {MONTHLY_PROFIT_DATA[activeMonthIdx].displayValue}
                </div>
              </div>
            )}

            {/* Y-axis grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-[#2dd4bf]/30"></div>
              <div className="border-b border-[#2dd4bf]/30"></div>
              <div className="border-b border-[#2dd4bf]/30"></div>
              <div className="border-b border-[#2dd4bf]/30"></div>
            </div>

            {/* Bars container */}
            <div className="flex items-end justify-between gap-2.5 h-44 px-2 relative z-10">
              {MONTHLY_PROFIT_DATA.map((item, idx) => {
                const heightPercent = (item.profit / 100000) * 100;
                const isHovered = activeMonthIdx === idx;
                return (
                  <div
                    key={item.month}
                    onMouseEnter={() => setActiveMonthIdx(idx)}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div
                      className={`w-full rounded-md transition-all duration-200 ${
                        isHovered
                          ? 'bg-[#2dd4bf] shadow-lg shadow-[#2dd4bf]/30 brightness-110'
                          : 'bg-[#20bfa9]/80 group-hover:bg-[#2dd4bf]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <span
                      className={`text-[11px] font-semibold transition-colors ${
                        isHovered ? 'text-[#2dd4bf] font-bold' : 'text-[#6b7280]'
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
