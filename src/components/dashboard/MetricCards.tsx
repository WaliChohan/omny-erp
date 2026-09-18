'use client';

import React from 'react';
import {
  Coins,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { MetricCardData } from '@/data/dashboardData';

interface MetricCardsProps {
  metrics: MetricCardData[];
}

function MiniSparkline({
  data,
  strokeColor = '#00e676',
}: {
  data: number[];
  strokeColor?: string;
}) {
  const width = 120;
  const height = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return { x, y };
  });

  // Create smooth SVG path
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + point.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="w-full pt-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-8 overflow-visible"
      >
        <defs>
          <linearGradient id={`spark-${strokeColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
          <filter id={`glow-${strokeColor}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#glow-${strokeColor})`}
        />
      </svg>
    </div>
  );
}

export default function MetricCards({ metrics }: MetricCardsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'coins':
        return <Coins className="w-4 h-4 text-[#00e676]" />;
      case 'cart':
        return <ShoppingCart className="w-4 h-4 text-[#38bdf8]" />;
      case 'users':
        return <Users className="w-4 h-4 text-[#c084fc]" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-[#fbbf24]" />;
      default:
        return <TrendingUp className="w-4 h-4 text-[#00e676]" />;
    }
  };

  const getSparklineColor = (iconName: string) => {
    switch (iconName) {
      case 'coins':
        return '#00e676';
      case 'cart':
        return '#00e676';
      case 'users':
        return '#00e676';
      case 'trending':
        return '#00e676';
      default:
        return '#00e676';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((item) => (
        <div
          key={item.id}
          className="bg-[#121815] border border-[#1b2620] hover:border-[#26382e] rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-black/40 flex flex-col justify-between"
        >
          {/* Top row: Icon badge & Percentage pill */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#18231d] border border-[#223328] flex items-center justify-center">
              {getIcon(item.icon)}
            </div>
            <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#132d20] border border-[#1e4832] text-[11px] font-semibold text-[#00e676]">
              <ArrowUpRight className="w-3 h-3" />
              <span>{item.change.replace('+', '').trim()}</span>
            </div>
          </div>

          {/* Metric label & main value */}
          <div>
            <p className="text-xs text-[#9ca3af] font-medium">{item.title}</p>
            <h3 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {item.value}
            </h3>
            <p className="text-[11px] text-[#6b7280] mt-0.5">{item.period}</p>
          </div>

          {/* Mini sparkline chart matching screenshot */}
          <MiniSparkline
            data={item.sparkline}
            strokeColor={getSparklineColor(item.icon)}
          />
        </div>
      ))}
    </div>
  );
}
