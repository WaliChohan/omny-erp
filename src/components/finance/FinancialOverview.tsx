'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
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
  Wallet,
  FileText,
  CreditCard,
  Sparkles,
  BookOpen,
  Receipt,
  CheckCircle2,
  Clock,
  ExternalLink,
  Crown,
  Server,
} from 'lucide-react';
import { FINANCIAL_WALLET, COMMERCIAL_DOCUMENTS, formatPKR } from '@/data/financialData';
import { useFinanceStore } from '@/context/FinanceContext';

interface FinancialOverviewProps {
  onOpenNewVoucher: () => void;
  onNavigateToCOA: () => void;
  onNavigateToSimpleAccounting?: () => void;
  onNavigateToDocs?: () => void;
}

export default function FinancialOverview({
  onOpenNewVoucher,
  onNavigateToCOA,
  onNavigateToSimpleAccounting,
  onNavigateToDocs,
}: FinancialOverviewProps) {
  const { metrics, entries, documents } = useFinanceStore();
  const [metricFilter, setMetricFilter] = useState<'all' | 'recurring' | 'capital'>('all');
  const [activeRange, setActiveRange] = useState<'Weekly' | 'Monthly'>('Weekly');

  // Dynamic 8 Executive Performance Slots (calculated from live FinanceContext in PKR)
  const metricSlots = useMemo(() => [
    {
      id: 'revenue',
      label: "Company's Total Revenue",
      value: formatPKR(metrics.totalRevenue),
      subLabel: `Project: ${formatPKR(metrics.projectRevenue, true)} | Retainers: ${formatPKR(metrics.recurringRevenue, true)}`,
      change: '+18% vs last month',
      isPositive: true,
      category: 'capital' as const,
      icon: DollarSign,
      accentColor: 'border-[#2dd4bf]',
      iconBg: 'bg-[#2dd4bf]/15 text-[#2dd4bf]',
    },
    {
      id: 'equity',
      label: 'Company Equity & Capital',
      value: formatPKR(metrics.companyEquity),
      subLabel: 'Paid-up capital (Rs. 10M) + Retained profits',
      change: '+14% vs last quarter',
      isPositive: true,
      category: 'capital' as const,
      icon: Shield,
      accentColor: 'border-[#818cf8]',
      iconBg: 'bg-[#818cf8]/15 text-[#818cf8]',
    },
    {
      id: 'receivables',
      label: 'Company Receivables',
      value: formatPKR(metrics.receivables),
      subLabel: 'Unsettled milestone invoices & foreign receivables',
      change: '-6% pending collection',
      isPositive: true,
      category: 'capital' as const,
      icon: TrendingUp,
      accentColor: 'border-[#34d399]',
      iconBg: 'bg-[#34d399]/15 text-[#34d399]',
    },
    {
      id: 'expenditures',
      label: 'Total Expenditures (OpEx)',
      value: formatPKR(metrics.totalExpenditures),
      subLabel: `Staff: ${formatPKR(metrics.employeePayroll, true)} | Founder: ${formatPKR(metrics.founderCompensation, true)} | SaaS: ${formatPKR(metrics.saasSubscriptions, true)}`,
      change: `${metrics.profitMargin}% net margin`,
      isPositive: metrics.netProfit >= 0,
      category: 'capital' as const,
      icon: TrendingDown,
      accentColor: 'border-[#f87171]',
      iconBg: 'bg-[#f87171]/15 text-[#f87171]',
    },
    {
      id: 'mrr',
      label: 'Monthly Recurring (MRR)',
      value: formatPKR(metrics.mrr),
      subLabel: 'Predictable retainer & SLA client subscription run-rate',
      change: '+12% vs last month',
      isPositive: true,
      category: 'recurring' as const,
      icon: Repeat,
      accentColor: 'border-[#a78bfa]',
      iconBg: 'bg-[#a78bfa]/15 text-[#a78bfa]',
    },
    {
      id: 'arr',
      label: 'Yearly Recurring (ARR)',
      value: formatPKR(metrics.arr),
      subLabel: 'Annualized retainer contract baseline (MRR x 12)',
      change: '+24% vs last year',
      isPositive: true,
      category: 'recurring' as const,
      icon: BarChart2,
      accentColor: 'border-[#fbbf24]',
      iconBg: 'bg-[#fbbf24]/15 text-[#fbbf24]',
    },
    {
      id: 'payroll',
      label: 'Total Monthly Payroll',
      value: formatPKR(metrics.employeePayroll + metrics.founderSalaries),
      subLabel: `Staff: ${formatPKR(metrics.employeePayroll, true)} | Founders: ${formatPKR(metrics.founderSalaries, true)}`,
      change: '100% on-time disbursement',
      isPositive: true,
      category: 'recurring' as const,
      icon: Users,
      accentColor: 'border-[#38bdf8]',
      iconBg: 'bg-[#38bdf8]/15 text-[#38bdf8]',
    },
    {
      id: 'runway',
      label: 'Liquid Reserves & Runway',
      value: `${metrics.runwayMonths} Months`,
      subLabel: `Total Cash: ${formatPKR(metrics.cashInBank, true)} in Meezan, HBL & SCB`,
      change: 'Low financial risk',
      isPositive: metrics.runwayMonths > 6,
      category: 'all' as const,
      icon: Layers,
      accentColor: 'border-[#fb923c]',
      iconBg: 'bg-[#fb923c]/15 text-[#fb923c]',
    },
  ], [metrics]);

  const filteredSlots = useMemo(() => {
    if (metricFilter === 'all') return metricSlots;
    return metricSlots.filter((s) => s.category === metricFilter || s.category === 'all');
  }, [metricFilter, metricSlots]);

  // Recent commercial documents preview
  const recentDocs = documents.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* ── Top Header Banner ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121915] border border-[#1e2d24] p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Financial Command Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2dd4bf]/15 text-[#2dd4bf] border border-[#2dd4bf]/30">
              PKR Multi-Entity
            </span>
          </div>
          <p className="text-xs text-[#9ca3af] mt-1">
            Real-time balance sheets, automated ledger reconciliation, and business document pipelines in Pakistani Rupees (PKR)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateToSimpleAccounting && (
            <button
              onClick={onNavigateToSimpleAccounting}
              className="px-3.5 py-2 rounded-xl bg-[#17241d] border border-[#263b2f] hover:border-[#2dd4bf] text-xs font-bold text-[#2dd4bf] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Simplified Accounting</span>
            </button>
          )}

          {onNavigateToDocs && (
            <button
              onClick={onNavigateToDocs}
              className="px-3.5 py-2 rounded-xl bg-[#17241d] border border-[#263b2f] hover:border-[#38bdf8] text-xs font-bold text-[#38bdf8] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Docs & Invoicing</span>
            </button>
          )}

          <button
            onClick={onNavigateToCOA}
            className="px-3.5 py-2 rounded-xl bg-[#17241d] border border-[#263b2f] hover:border-white text-xs font-semibold text-white transition-all flex items-center gap-1.5"
          >
            <Building className="w-3.5 h-3.5 text-[#9ca3af]" />
            <span>4-Level COA</span>
          </button>

          <button
            onClick={onOpenNewVoucher}
            className="px-4 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-black transition-all shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Voucher</span>
          </button>
        </div>
      </div>

      {/* ── Quick Liquidity & Bank Reserve Ribbon (Dynamic PKR) ───────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Meezan Operating */}
        <div className="bg-[#141d18] border border-[#203026] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2dd4bf]/15 text-[#2dd4bf] flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#9ca3af] tracking-wider">
                Meezan Bank (Operating)
              </span>
              <p className="text-lg font-black text-white tracking-tight">
                {formatPKR(metrics.operatingCashMeezan)}
              </p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" title="Active Connection" />
        </div>

        {/* 2. HBL Corporate Payroll */}
        <div className="bg-[#141d18] border border-[#203026] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#818cf8]/15 text-[#818cf8] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#9ca3af] tracking-wider">
                HBL Bank (Payroll A/C)
              </span>
              <p className="text-lg font-black text-white tracking-tight">
                {formatPKR(metrics.payrollCashHBL)}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#34d399]">Funded</span>
        </div>

        {/* 3. SCB Sovereign Treasury */}
        <div className="bg-[#141d18] border border-[#203026] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/15 text-[#fbbf24] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#9ca3af] tracking-wider">
                SCB Treasury Yield
              </span>
              <p className="text-lg font-black text-white tracking-tight">
                {formatPKR(metrics.treasuryReserveSCB)}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#fbbf24]">16.5% KIBOR</span>
        </div>

        {/* 4. Monthly Burn Rate & Runway */}
        <div className="bg-[#141d18] border border-[#203026] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f43f5e]/15 text-[#f43f5e] flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#9ca3af] tracking-wider">
                Monthly Burn Rate
              </span>
              <p className="text-lg font-black text-white tracking-tight">
                {formatPKR(metrics.monthlyBurnRate)}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#9ca3af]">
            {metrics.runwayMonths} mo runway
          </span>
        </div>
      </div>

      {/* ── Row: 8 Core Metric Slots Grid with Filter Switcher ────────────── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Executive Performance Metrics</h2>
            <span className="text-xs text-[#6b7280]">({filteredSlots.length} active indicators in PKR)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#141d18] border border-[#203026] p-1 rounded-xl">
            {(['all', 'recurring', 'capital'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setMetricFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  metricFilter === filter
                    ? 'bg-[#2dd4bf] text-[#052e24] font-bold shadow-sm'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
              >
                {filter === 'all' ? 'All 8 Indicators' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Stats Modern Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSlots.map((slot) => {
            const Icon = slot.icon;
            return (
              <div
                key={slot.id}
                className="bg-[#121915] border border-[#1e2d24] hover:border-[#2dd4bf]/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-lg group relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-[#9ca3af] leading-tight">
                    {slot.label}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${slot.iconBg}`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="my-3">
                  <h3 className="text-2xl font-black text-white tracking-tight font-mono">
                    {slot.value}
                  </h3>
                  <p className="text-[11px] text-[#6b7280] mt-1 line-clamp-1">{slot.subLabel}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#18241d]">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
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

                  <span className="text-[10px] text-[#4b5563] uppercase tracking-wider font-semibold">
                    Live Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Row: Cashflow Analytics & Recent Business Documents ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Cashflow Bar Statistics (7 cols) */}
        <div className="lg:col-span-7 bg-[#121915] border border-[#1b2620] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Net Liquidity Inflow vs Outflow</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-[#162a21] text-[#2dd4bf] font-mono font-bold">
                  +{formatPKR(metrics.netProfit, true)} Net
                </span>
              </div>
              <p className="text-xs text-[#9ca3af] mt-0.5">Automated settlement analysis across Meezan, HBL and SCB accounts</p>
            </div>

            <div className="bg-[#16201b] border border-[#223328] p-0.5 rounded-lg flex text-xs">
              <button
                onClick={() => setActiveRange('Weekly')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  activeRange === 'Weekly' ? 'bg-[#2dd4bf] text-[#052e24] font-bold' : 'text-[#9ca3af]'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setActiveRange('Monthly')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  activeRange === 'Monthly' ? 'bg-[#2dd4bf] text-[#052e24] font-bold' : 'text-[#9ca3af]'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="py-4">
            <div className="flex items-end justify-between gap-3 h-40 px-2">
              {FINANCIAL_WALLET.weeklyBarStats.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-[#16201b] rounded-md overflow-hidden flex flex-col justify-end h-32 p-0.5">
                    <div
                      className="w-full rounded transition-all duration-300 group-hover:brightness-125"
                      style={{
                        height: `${item.height}%`,
                        backgroundColor: item.active ? '#2dd4bf' : '#818cf8',
                      }}
                    />
                  </div>
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
                <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider">
                  Total Income (PKR)
                </span>
                <p className="text-sm font-black text-white font-mono">
                  {formatPKR(metrics.totalRevenue)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#16201b] border border-[#223328]">
              <div className="w-8 h-8 rounded-lg bg-[#ef4444]/20 text-[#ef4444] flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider">
                  Total Expenses (PKR)
                </span>
                <p className="text-sm font-black text-white font-mono">
                  {formatPKR(metrics.totalExpenditures)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Commercial Documents Pipeline (5 cols) */}
        <div className="lg:col-span-5 bg-[#121915] border border-[#1b2620] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2620] mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Recent Invoices & SOWs</h3>
                  <p className="text-[11px] text-[#9ca3af]">Contracts, Quotations & Receipts (PKR)</p>
                </div>
              </div>

              {onNavigateToDocs && (
                <button
                  onClick={onNavigateToDocs}
                  className="text-xs font-bold text-[#2dd4bf] hover:underline flex items-center gap-1"
                >
                  <span>Docs Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={onNavigateToDocs}
                  className="p-3 rounded-xl bg-[#16201b] border border-[#223328] hover:border-[#2dd4bf] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#1e2d24] text-[#9ca3af] group-hover:text-[#2dd4bf] flex items-center justify-center uppercase font-mono text-[10px] font-bold">
                      {doc.docType.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate group-hover:text-[#2dd4bf] transition-colors">
                        {doc.title}
                      </p>
                      <p className="text-[11px] text-[#6b7280]">{doc.clientName} &bull; {doc.docNumber}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <span className="text-xs font-bold text-white font-mono block">
                      {formatPKR(doc.totalAmount)}
                    </span>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        doc.status === 'paid' || doc.status === 'approved'
                          ? 'bg-[#10b981]/15 text-[#34d399]'
                          : 'bg-[#fbbf24]/15 text-[#fbbf24]'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Transaction Feed Bottom */}
          <div className="pt-4 border-t border-[#1b2620] mt-3">
            <div className="flex items-center justify-between text-xs text-[#9ca3af] mb-2">
              <span className="font-semibold">Latest General Ledger Activity</span>
              <span className="font-mono text-[11px]">Today</span>
            </div>
            <div className="space-y-1.5">
              {entries.slice(0, 2).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Building className="w-3.5 h-3.5 text-[#2dd4bf] shrink-0" />
                    <span className="text-white font-medium truncate">{tx.entity}</span>
                  </div>
                  <span
                    className={`font-mono font-bold shrink-0 ${
                      tx.type === 'income' ? 'text-[#34d399]' : 'text-[#ef4444]'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}{formatPKR(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
