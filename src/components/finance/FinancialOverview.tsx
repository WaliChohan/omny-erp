'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Building,
  Smartphone,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  Repeat,
  Users,
  Shield,
  Layers,
} from 'lucide-react';
import { FINANCIAL_WALLET } from '@/data/financialData';

// ─── Metric Slot Types ────────────────────────────────────────────────────────

interface MetricSlot {
  id: string;
  label: string;
  value: string;
  subLabel: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  accentColor: string;        // Tailwind border/glow color token
  bgGradient: string;         // Tailwind bg gradient classes
  iconBg: string;             // Tailwind icon wrapper bg
}

// ─── 8 Financial Metric Slots ─────────────────────────────────────────────────

const METRIC_SLOTS: MetricSlot[] = [
  {
    id: 'revenue',
    label: "Company's Revenue",
    value: '$120,873',
    subLabel: 'Total earned this fiscal year',
    change: '+17% vs last month',
    isPositive: true,
    icon: DollarSign,
    accentColor: 'border-[#2dd4bf]',
    bgGradient: 'from-[#2dd4bf]/15 via-[#0f766e]/5 to-[#121915]',
    iconBg: 'bg-[#2dd4bf]/20 text-[#2dd4bf]',
  },
  {
    id: 'equity',
    label: 'Company Equity',
    value: '$162,250',
    subLabel: 'Shareholders equity — retained + capital',
    change: '+8% vs last quarter',
    isPositive: true,
    icon: Shield,
    accentColor: 'border-[#818cf8]',
    bgGradient: 'from-[#6366f1]/15 via-[#4f46e5]/5 to-[#121915]',
    iconBg: 'bg-[#6366f1]/20 text-[#818cf8]',
  },
  {
    id: 'receivables',
    label: 'Company Receivables',
    value: '$62,850',
    subLabel: 'Outstanding invoices due from clients',
    change: '-4% vs last month',
    isPositive: false,
    icon: TrendingUp,
    accentColor: 'border-[#34d399]',
    bgGradient: 'from-[#10b981]/15 via-[#059669]/5 to-[#121915]',
    iconBg: 'bg-[#10b981]/20 text-[#34d399]',
  },
  {
    id: 'expenditures',
    label: 'Company Expenditures',
    value: '$42,040',
    subLabel: 'Total operating costs this period',
    change: '+3% vs last month',
    isPositive: false,
    icon: TrendingDown,
    accentColor: 'border-[#f87171]',
    bgGradient: 'from-[#ef4444]/15 via-[#dc2626]/5 to-[#121915]',
    iconBg: 'bg-[#ef4444]/20 text-[#f87171]',
  },
  {
    id: 'mrr',
    label: 'Monthly Recurring Revenue',
    value: '$10,073',
    subLabel: 'Predictable subscription income / mo',
    change: '+12% vs last month',
    isPositive: true,
    icon: Repeat,
    accentColor: 'border-[#a78bfa]',
    bgGradient: 'from-[#8b5cf6]/15 via-[#7c3aed]/5 to-[#121915]',
    iconBg: 'bg-[#8b5cf6]/20 text-[#a78bfa]',
  },
  {
    id: 'yrr',
    label: 'Yearly Recurring Revenue',
    value: '$120,873',
    subLabel: 'Annualised subscription baseline (ARR)',
    change: '+17% vs last year',
    isPositive: true,
    icon: BarChart2,
    accentColor: 'border-[#fbbf24]',
    bgGradient: 'from-[#f59e0b]/15 via-[#d97706]/5 to-[#121915]',
    iconBg: 'bg-[#f59e0b]/20 text-[#fbbf24]',
  },
  {
    id: 'cac',
    label: 'Customer Acquisition Cost',
    value: '$284',
    subLabel: 'Average spend to acquire one customer',
    change: '-6% vs last quarter',
    isPositive: true,
    icon: Users,
    accentColor: 'border-[#38bdf8]',
    bgGradient: 'from-[#0ea5e9]/15 via-[#0284c7]/5 to-[#121915]',
    iconBg: 'bg-[#0ea5e9]/20 text-[#38bdf8]',
  },
  {
    id: 'moat',
    label: 'Company Moat',
    value: '74 / 100',
    subLabel: 'Competitive defensibility index score',
    change: '+2pts vs last assessment',
    isPositive: true,
    icon: Layers,
    accentColor: 'border-[#fb923c]',
    bgGradient: 'from-[#f97316]/15 via-[#ea580c]/5 to-[#121915]',
    iconBg: 'bg-[#f97316]/20 text-[#fb923c]',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface FinancialOverviewProps {
  onOpenNewVoucher: () => void;
  onNavigateToCOA: () => void;
}

export default function FinancialOverview({
  onOpenNewVoucher,
  onNavigateToCOA,
}: FinancialOverviewProps) {
  const [activeRange, setActiveRange] = useState<'Weekly' | 'Monthly'>('Weekly');

  // Carousel state — two visible slots at a time
  const SLOTS_PER_PAGE = 2;
  const totalPages = Math.ceil(METRIC_SLOTS.length / SLOTS_PER_PAGE);
  const [carouselPage, setCarouselPage] = useState(0);

  const visibleSlots = METRIC_SLOTS.slice(
    carouselPage * SLOTS_PER_PAGE,
    carouselPage * SLOTS_PER_PAGE + SLOTS_PER_PAGE,
  );

  const prevPage = () => setCarouselPage((p) => (p - 1 + totalPages) % totalPages);
  const nextPage = () => setCarouselPage((p) => (p + 1) % totalPages);

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Hello, John!</h2>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            All information about your bank accounts, vouchers, and ledgers in the sections below
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToCOA}
            className="px-3.5 py-2 rounded-lg bg-[#141d18] border border-[#223328] hover:border-[#2dd4bf] text-xs font-semibold text-[#2dd4bf] transition-colors flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5" />
            <span>4-Level Chart of Accounts</span>
          </button>
          <button
            onClick={onOpenNewVoucher}
            className="px-4 py-2 rounded-lg bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-bold transition-all shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Voucher</span>
          </button>
        </div>
      </div>

      {/* ── Row 1: Metric Carousel / Slot System ──────────────────────────── */}
      <div className="relative">
        {/* Carousel track */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300">
          {visibleSlots.map((slot) => {
            const Icon = slot.icon;
            return (
              <div
                key={slot.id}
                className={`bg-gradient-to-br ${slot.bgGradient} border-2 ${slot.accentColor} rounded-2xl p-6 flex flex-col justify-between shadow-xl min-h-[180px] transition-all duration-300`}
              >
                {/* Top: label + icon */}
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-[#9ca3af] tracking-wide">
                    {slot.label}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${slot.iconBg}`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>

                {/* Middle: value */}
                <div className="mt-3">
                  <h3 className="text-3xl font-black text-white tracking-tight leading-none">
                    {slot.value}
                  </h3>
                  <p className="text-[11px] text-[#6b7280] mt-1">{slot.subLabel}</p>
                </div>

                {/* Bottom: change badge */}
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      slot.isPositive
                        ? 'bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/25'
                        : 'bg-[#ef4444]/15 text-[#f87171] border border-[#ef4444]/25'
                    }`}
                  >
                    {slot.isPositive ? (
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                    )}
                    {slot.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-between mt-4">
          {/* Pagination dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselPage(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === carouselPage
                    ? 'w-6 h-2 bg-[#2dd4bf]'
                    : 'w-2 h-2 bg-[#2a3c30] hover:bg-[#2dd4bf]/50'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              aria-label="Previous metrics"
              className="w-8 h-8 rounded-lg bg-[#141d18] border border-[#1e2d24] hover:border-[#2dd4bf] hover:text-[#2dd4bf] text-[#9ca3af] flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-[#6b7280] select-none">
              {carouselPage + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              aria-label="Next metrics"
              className="w-8 h-8 rounded-lg bg-[#141d18] border border-[#1e2d24] hover:border-[#2dd4bf] hover:text-[#2dd4bf] text-[#9ca3af] flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Transactions (Left) + Statistics (Right) — no Quick Transfer ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">

        {/* Transactions List */}
        <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-3 tracking-tight">Transactions</h3>
          <div className="space-y-3">
            {FINANCIAL_WALLET.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#18231d] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1a241f] border border-[#24362b] flex items-center justify-center text-[#2dd4bf]">
                    {tx.icon === 'home' ? (
                      <Building className="w-4 h-4" />
                    ) : (
                      <Smartphone className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{tx.title}</p>
                    <p className="text-[11px] text-[#6b7280]">{tx.time}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#ef4444] font-mono">
                  {tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Card with Bar Chart + Income/Expenses */}
        <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Statistics</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-white tracking-tight">
                  ${FINANCIAL_WALLET.netWeeklyStat.toFixed(2)}
                </span>
                <span className="text-xs text-[#2dd4bf] font-medium ml-1">Net Flow</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#16201b] border border-[#223328] p-0.5 rounded-lg flex text-xs">
                <button
                  onClick={() => setActiveRange('Weekly')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    activeRange === 'Weekly' ? 'bg-[#2dd4bf] text-[#052e24] font-bold' : 'text-[#9ca3af]'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setActiveRange('Monthly')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    activeRange === 'Monthly' ? 'bg-[#2dd4bf] text-[#052e24] font-bold' : 'text-[#9ca3af]'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="py-4">
            <div className="flex items-end justify-between gap-3 h-36 px-2">
              {FINANCIAL_WALLET.weeklyBarStats.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div
                    className="w-full rounded-md transition-all duration-300 group-hover:brightness-125"
                    style={{
                      height: `${item.height}%`,
                      backgroundColor: item.active ? '#1e293b' : '#818cf8',
                    }}
                  />
                  <span className="text-[11px] font-semibold text-[#6b7280] group-hover:text-white">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Income & Expenses Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1b2620]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#16201b] border border-[#223328]">
              <div className="w-8 h-8 rounded-lg bg-[#00e676]/20 text-[#00e676] flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider">Income</span>
                <p className="text-sm font-black text-white">
                  ${FINANCIAL_WALLET.incomeMonth.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#16201b] border border-[#223328]">
              <div className="w-8 h-8 rounded-lg bg-[#ef4444]/20 text-[#ef4444] flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider">Expenses</span>
                <p className="text-sm font-black text-white">
                  ${FINANCIAL_WALLET.expenseMonth.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
