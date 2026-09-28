'use client';

import React, { useMemo, useState } from 'react';
import { Sparkles, Download, TrendingUp, Users, Briefcase, Wallet, FileText, CheckSquare } from 'lucide-react';
import { useAgency } from '@/context/AgencyContext';
import { formatPKR } from '@/data/financialData';

interface AnalyticsViewProps {
  onOpenAskAI: () => void;
}

export default function AnalyticsView({ onOpenAskAI }: AnalyticsViewProps) {
  const { agencyMetrics, clients, projects, documents, payments, expenses, tasks, navigate } = useAgency();
  const [timeframe, setTimeframe] = useState('This quarter');

  const serviceMix = useMemo(() => {
    const counts: Record<string, number> = {};
    clients.forEach((c) => c.services.forEach((s) => { counts[s] = (counts[s] || 0) + 1; }));
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts)
      .map(([name, n]) => ({ name, percent: Math.round((n / total) * 100), count: n }))
      .sort((a, b) => b.percent - a.percent);
  }, [clients]);

  const projectHealth = useMemo(() => {
    if (!projects.length) return [];
    return [...projects]
      .sort((a, b) => b.progressPercent - a.progressPercent)
      .slice(0, 6)
      .map((p) => ({
        id: p.id,
        title: p.title,
        client: p.client || '—',
        progress: p.progressPercent,
        budget: p.budget,
      }));
  }, [projects]);

  const cashSeries = useMemo(() => {
    const map: Record<string, { in: number; out: number }> = {};
    payments.forEach((p) => {
      const m = p.paidAt.slice(0, 7);
      map[m] = map[m] || { in: 0, out: 0 };
      map[m].in += p.amount;
    });
    expenses.forEach((e) => {
      const m = e.spentAt.slice(0, 7);
      map[m] = map[m] || { in: 0, out: 0 };
      map[m].out += e.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, v]) => ({ month, ...v, net: v.in - v.out }));
  }, [payments, expenses]);

  const maxNet = Math.max(1, ...cashSeries.map((c) => Math.abs(c.net)));

  const cards = [
    { label: 'Active clients', value: String(agencyMetrics.activeClients), icon: Users, tab: 'clients' as const },
    { label: 'Retainer MRR', value: formatPKR(agencyMetrics.mrr, true), icon: TrendingUp, tab: 'clients' as const },
    { label: 'Pipeline', value: formatPKR(agencyMetrics.pipelineValue, true), icon: FileText, tab: 'crm' as const },
    { label: 'Open projects', value: String(agencyMetrics.openProjects), icon: Briefcase, tab: 'projects' as const },
    { label: 'Receivables', value: formatPKR(agencyMetrics.receivables, true), icon: Wallet, tab: 'finance' as const },
    { label: 'Open tasks', value: String(agencyMetrics.openTasks), icon: CheckSquare, tab: 'todo' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Agency Analytics</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Live metrics from CRM, clients, projects, and billing — not demo charts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeframe(timeframe === 'This quarter' ? 'YTD' : 'This quarter')}
            className="px-3 py-1.5 rounded-lg bg-[#141e18] border border-[#223328] text-xs font-semibold text-[#9ca3af]"
          >
            {timeframe}
          </button>
          <button
            onClick={onOpenAskAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e2538] border border-[#3b4b73] text-xs font-semibold text-[#a5b4fc]"
          >
            <Sparkles className="w-3.5 h-3.5" /> Ask AI
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141e18] border border-[#223328] text-xs font-semibold text-[#9ca3af]">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              onClick={() => navigate({ tab: c.tab, financeSub: c.tab === 'finance' ? 'overview' : undefined })}
              className="rounded-2xl bg-[#121815] border border-[#1a2720] p-4 text-left hover:border-[#2dd4bf]/40 transition-colors"
            >
              <div className="flex items-center gap-2 text-[#2dd4bf] mb-2">
                <Icon className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider text-[#6b7280] font-semibold">{c.label}</span>
              </div>
              <p className="text-lg font-black text-white">{c.value}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-[#121815] border border-[#1a2720] p-5">
          <h3 className="text-sm font-bold text-white mb-1">Cash movement</h3>
          <p className="text-[11px] text-[#6b7280] mb-4">Payments in vs expenses out (from agency store)</p>
          {cashSeries.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#6b7280]">
              No payments or expenses yet. Record them in Finance to populate this chart.
            </div>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {cashSeries.map((c) => (
                <div key={c.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-md ${c.net >= 0 ? 'bg-[#10b981]' : 'bg-[#f43f5e]'}`}
                    style={{ height: `${Math.max(8, (Math.abs(c.net) / maxNet) * 120)}px` }}
                    title={formatPKR(c.net)}
                  />
                  <span className="text-[9px] text-[#6b7280]">{c.month.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-2">
              <p className="text-[10px] text-[#6b7280]">Collected</p>
              <p className="font-bold text-[#10b981]">{formatPKR(agencyMetrics.collected, true)}</p>
            </div>
            <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-2">
              <p className="text-[10px] text-[#6b7280]">Expenses</p>
              <p className="font-bold text-[#f43f5e]">{formatPKR(agencyMetrics.expensesTotal, true)}</p>
            </div>
            <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-2">
              <p className="text-[10px] text-[#6b7280]">Paid invoices</p>
              <p className="font-bold text-white">{agencyMetrics.invoicesPaid}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#121815] border border-[#1a2720] p-5">
          <h3 className="text-sm font-bold text-white mb-1">Service mix</h3>
          <p className="text-[11px] text-[#6b7280] mb-4">Active client services across the roster</p>
          {serviceMix.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#6b7280]">No clients yet.</div>
          ) : (
            <div className="space-y-2.5">
              {serviceMix.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-semibold">{s.name}</span>
                    <span className="text-[#9ca3af]">{s.percent}% · {s.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#0f1612] overflow-hidden">
                    <div className="h-full rounded-full bg-[#2dd4bf]" style={{ width: `${s.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-[#121815] border border-[#1a2720] p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">Project delivery health</h3>
          <button onClick={() => navigate({ tab: 'projects' })} className="text-[11px] font-bold text-[#2dd4bf]">
            Open projects
          </button>
        </div>
        {projectHealth.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#6b7280]">No projects in the store yet.</div>
        ) : (
          <div className="space-y-2">
            {projectHealth.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate({ tab: 'projects', focus: { kind: 'project', id: p.id } })}
                className="w-full flex items-center gap-3 rounded-xl bg-[#0f1612] border border-[#1e2d24] px-3 py-2.5 hover:border-[#2dd4bf]/40 text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{p.title}</p>
                  <p className="text-[11px] text-[#9ca3af] truncate">{p.client}</p>
                </div>
                <div className="w-28">
                  <div className="h-1.5 rounded-full bg-[#18261e] overflow-hidden">
                    <div className="h-full bg-[#2dd4bf]" style={{ width: `${p.progress}%` }} />
                  </div>
                  <p className="text-[10px] text-[#6b7280] mt-1 text-right">{p.progress}%</p>
                </div>
                <span className="text-[11px] font-bold text-white shrink-0">{formatPKR(p.budget, true)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-[#121815] border border-[#1a2720] p-4 flex flex-wrap gap-3 text-xs text-[#9ca3af]">
        <span>{documents.length} billing docs</span>
        <span>·</span>
        <span>{tasks.filter((t) => !t.completed).length} open tasks</span>
        <span>·</span>
        <span>{agencyMetrics.quotesOpen} open quotes</span>
      </div>
    </div>
  );
}
