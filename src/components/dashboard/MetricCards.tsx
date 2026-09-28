'use client';

import React from 'react';
import {
  Coins,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  Repeat,
  Briefcase,
  Shield,
  DollarSign
} from 'lucide-react';
import { MetricCardData } from '@/data/dashboardData';
import FolderCard from '@/components/common/FolderCard';

interface MetricCardsProps {
  metrics: MetricCardData[];
  onSelectMetric?: (metricId: string) => void;
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
    <div className="w-full pt-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-7 overflow-visible"
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

export default function MetricCards({ metrics, onSelectMetric }: MetricCardsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'coins':
      case 'dollar':
        return <Coins className="w-4 h-4 text-[#00e676]" />;
      case 'repeat':
        return <Repeat className="w-4 h-4 text-[#38bdf8]" />;
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-[#38bdf8]" />;
      case 'users':
        return <Users className="w-4 h-4 text-[#c084fc]" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-[#fbbf24]" />;
      default:
        return <TrendingUp className="w-4 h-4 text-[#00e676]" />;
    }
  };

  const getThemeColor = (iconName: string): 'green' | 'blue' | 'purple' | 'orange' => {
    switch (iconName) {
      case 'coins':
      case 'dollar':
        return 'green';
      case 'repeat':
      case 'briefcase':
        return 'blue';
      case 'users':
        return 'purple';
      case 'trending':
        return 'orange';
      default:
        return 'green';
    }
  };

  const getSparklineColor = (iconName: string) => {
    switch (iconName) {
      case 'coins':
      case 'dollar':
        return '#00e676';
      case 'repeat':
      case 'briefcase':
        return '#38bdf8';
      case 'users':
        return '#c084fc';
      case 'trending':
        return '#fbbf24';
      default:
        return '#00e676';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((item) => {
        const theme = getThemeColor(item.icon);
        const sparkColor = getSparklineColor(item.icon);

        return (
          <FolderCard
            key={item.id}
            onOpenDetail={() => onSelectMetric?.(item.id)}
            themeColor={theme}
            buttonSize="md"
            minHeight="min-h-[200px]"
            actionTooltip={`Open ${item.title} Workspace`}
            avatar={
              <div className="w-10 h-10 rounded-full bg-[#18231d] border border-[#233829] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                {getIcon(item.icon)}
              </div>
            }
            badge={
              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#132d20] border border-[#1e4832] text-[11px] font-bold text-[#00e676] shadow-sm">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                <span>{item.change.replace('+', '').trim()}</span>
              </div>
            }
          >
            <div className="pt-2 flex flex-col justify-between flex-1">
              <div>
                <p className="text-xs text-[#9ca3af] font-medium tracking-wide">{item.title}</p>
                <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">
                  {item.value}
                </h3>
                <p className="text-[11px] text-[#6b7280] font-medium mt-0.5">{item.period}</p>
              </div>

              {/* Sparkline chart */}
              <MiniSparkline
                data={item.sparkline}
                strokeColor={sparkColor}
              />
            </div>
          </FolderCard>
        );
      })}
    </div>
  );
}
