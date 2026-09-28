'use client';

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Check,
  X,
  FileText,
  Building,
  CreditCard,
  PieChart,
  Download,
  AlertCircle,
  HelpCircle,
  Briefcase,
  Users,
  Crown,
  Shield,
  Server,
  Trash2,
  Edit2,
  ArrowRightLeft,
  RotateCcw,
} from 'lucide-react';
import {
  SimpleBookkeepingEntry,
  FinanceCategoryType,
  FINANCE_CATEGORY_CONFIG,
  formatPKR,
} from '@/data/financialData';
import { useFinanceStore } from '@/context/FinanceContext';

interface SimpleAccountingViewProps {
  onOpenCreateDoc?: () => void;
}

export default function SimpleAccountingView({ onOpenCreateDoc }: SimpleAccountingViewProps) {
  const {
    entries,
    metrics,
    addEntry,
    updateEntry,
    deleteEntry,
    toggleEntryStatus,
    resetToDefaults,
  } = useFinanceStore();

  const [categoryFilter, setCategoryFilter] = useState<'all' | FinanceCategoryType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'cleared' | 'pending' | 'reconciled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Form Fields State
  const [formCategoryType, setFormCategoryType] = useState<FinanceCategoryType>('project_revenue');
  const [formEntity, setFormEntity] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formTax, setFormTax] = useState('0');
  const [formMethod, setFormMethod] = useState<
    'Meezan Bank' | 'HBL Bank' | 'Standard Chartered' | 'Payoneer / Wise' | 'Cash / Cheque' | 'Credit Card'
  >('Meezan Bank');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');
  const [formProjectName, setFormProjectName] = useState('');

  // Filtered Entries
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      if (categoryFilter !== 'all' && item.categoryType !== categoryFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.entity.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.notes.toLowerCase().includes(q) ||
          (item.projectName && item.projectName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [entries, categoryFilter, statusFilter, searchQuery]);

  // Open modal for new entry
  const handleOpenAdd = (presetType?: FinanceCategoryType) => {
    setEditingEntryId(null);
    const targetType = presetType || 'project_revenue';
    setFormCategoryType(targetType);
    setFormEntity('');
    setFormCategory('');
    setFormAmount('');
    setFormTax('0');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setFormProjectName('');
    setIsModalOpen(true);
  };

  // Open modal for editing existing entry
  const handleOpenEdit = (entry: SimpleBookkeepingEntry) => {
    setEditingEntryId(entry.id);
    setFormCategoryType(entry.categoryType || 'project_revenue');
    setFormEntity(entry.entity);
    setFormCategory(entry.category);
    setFormAmount(entry.amount.toString());
    setFormTax(entry.taxAmount ? entry.taxAmount.toString() : '0');
    setFormMethod(entry.paymentMethod);
    setFormDate(entry.date);
    setFormNotes(entry.notes);
    setFormProjectName(entry.projectName || '');
    setIsModalOpen(true);
  };

  // Submit Handler
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEntity || !formAmount) return;

    const amountNum = parseFloat(formAmount) || 0;
    const taxNum = parseFloat(formTax) || 0;
    const meta = FINANCE_CATEGORY_CONFIG[formCategoryType];
    const flowType = meta ? meta.defaultFlow : 'expense';

    if (editingEntryId) {
      updateEntry(editingEntryId, {
        type: flowType,
        categoryType: formCategoryType,
        category: formCategory || meta.label,
        entity: formEntity,
        amount: amountNum,
        taxAmount: taxNum,
        paymentMethod: formMethod,
        date: formDate,
        notes: formNotes,
        projectName: formProjectName || undefined,
      });
    } else {
      addEntry({
        type: flowType,
        categoryType: formCategoryType,
        category: formCategory || meta.label,
        entity: formEntity,
        amount: amountNum,
        taxAmount: taxNum,
        paymentMethod: formMethod,
        date: formDate,
        status: 'cleared',
        notes: formNotes,
        projectName: formProjectName || undefined,
      });
    }

    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Date,Category Type,Entity/Counterparty,Category,Payment Method,Amount (PKR),Tax (PKR),Status,Project,Notes\n'];
    const rows = filteredEntries.map((e) =>
      `"${e.date}","${e.categoryType}","${e.entity.replace(/"/g, '""')}","${e.category.replace(/"/g, '""')}","${e.paymentMethod}",${e.amount},${e.taxAmount || 0},"${e.status}","${e.projectName || ''}","${(e.notes || '').replace(/"/g, '""')}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `financial-ledger-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header Banner ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121915] border border-[#1e2d24] p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Simplified Accounting Suite</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30">
              PKR Operational Engine
            </span>
          </div>
          <p className="text-xs text-[#9ca3af] mt-1">
            Complete CRUD ledger for project milestones, monthly retainers, team salaries, founder equity, SaaS tooling, and bank sweeps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-[#17241d] border border-[#263b2f] hover:border-white text-xs font-semibold text-white transition-all flex items-center gap-1.5"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#9ca3af]" />
            <span>Export CSV</span>
          </button>

          {onOpenCreateDoc && (
            <button
              onClick={onOpenCreateDoc}
              className="px-3.5 py-2 rounded-xl bg-[#17241d] border border-[#263b2f] hover:border-[#2dd4bf] text-xs font-semibold text-[#2dd4bf] transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Create Invoice / SOW</span>
            </button>
          )}

          <button
            onClick={() => handleOpenAdd()}
            className="px-4 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-black transition-all shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* ── 5 Performance Summary Cards (Dynamic Live Calculated in PKR) ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Revenue */}
        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[#9ca3af]">Total Company Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-[#10b981]/15 text-[#34d399] flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white font-mono">
            {formatPKR(metrics.totalRevenue)}
          </h3>
          <div className="text-[10px] text-[#34d399] font-medium mt-1 flex items-center justify-between">
            <span>Project: {formatPKR(metrics.projectRevenue, true)}</span>
            <span>MRR: {formatPKR(metrics.recurringRevenue, true)}</span>
          </div>
        </div>

        {/* 2. Employee Salaries */}
        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[#9ca3af]">Employee Salaries (Payroll)</span>
            <div className="w-7 h-7 rounded-lg bg-[#818cf8]/15 text-[#818cf8] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white font-mono">
            {formatPKR(metrics.employeePayroll)}
          </h3>
          <p className="text-[10px] text-[#818cf8] font-medium mt-1">
            Engineers, UI/UX & QA team
          </p>
        </div>

        {/* 3. Founder Compensation & Equity */}
        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[#9ca3af]">Founder Comp & Equity</span>
            <div className="w-7 h-7 rounded-lg bg-[#fbbf24]/15 text-[#fbbf24] flex items-center justify-center">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white font-mono">
            {formatPKR(metrics.founderCompensation)}
          </h3>
          <div className="text-[10px] text-[#fbbf24] font-medium mt-1 flex items-center justify-between">
            <span>Salaries: {formatPKR(metrics.founderSalaries, true)}</span>
            <span>Equity: {formatPKR(metrics.founderEquity, true)}</span>
          </div>
        </div>

        {/* 4. SaaS Subscriptions */}
        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[#9ca3af]">SaaS & Tool Subscriptions</span>
            <div className="w-7 h-7 rounded-lg bg-[#f43f5e]/15 text-[#fb7185] flex items-center justify-center">
              <Server className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white font-mono">
            {formatPKR(metrics.saasSubscriptions)}
          </h3>
          <p className="text-[10px] text-[#fb7185] font-medium mt-1">
            AWS, OpenAI, GitHub, Figma
          </p>
        </div>

        {/* 5. Net Operating Profit */}
        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[#9ca3af]">Net Operating Profit</span>
            <div className="w-7 h-7 rounded-lg bg-[#2dd4bf]/15 text-[#2dd4bf] flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-xl font-black text-[#2dd4bf] font-mono">
            {formatPKR(metrics.netProfit)}
          </h3>
          <p className="text-[10px] text-[#9ca3af] font-medium mt-1">
            Net Margin: <strong className="text-white font-mono">{metrics.profitMargin}%</strong>
          </p>
        </div>
      </div>

      {/* ── Transaction Bookkeeping Table & Category Filters ───────────────── */}
      <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-5 space-y-4">
        {/* Category Specific Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#1b2620]">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === 'all'
                ? 'bg-[#2dd4bf] text-[#052e24] shadow-sm'
                : 'bg-[#16201b] text-[#9ca3af] hover:text-white'
            }`}
          >
            All Transactions ({entries.length})
          </button>

          {(
            [
              { type: 'project_revenue', label: '💼 Project Payments', count: entries.filter(e => e.categoryType === 'project_revenue').length },
              { type: 'recurring_revenue', label: '🔄 Retainers (MRR)', count: entries.filter(e => e.categoryType === 'recurring_revenue').length },
              { type: 'salary_employee', label: '👥 Staff Salaries', count: entries.filter(e => e.categoryType === 'salary_employee').length },
              { type: 'salary_founder', label: '👑 Founder Salaries', count: entries.filter(e => e.categoryType === 'salary_founder').length },
              { type: 'founder_equity', label: '🛡️ Founder Equity', count: entries.filter(e => e.categoryType === 'founder_equity').length },
              { type: 'saas_subscription', label: '⚡ SaaS & Tools', count: entries.filter(e => e.categoryType === 'saas_subscription').length },
              { type: 'opex_general', label: '🏢 General OpEx', count: entries.filter(e => e.categoryType === 'opex_general').length },
              { type: 'transfer', label: '🔁 Bank Sweeps', count: entries.filter(e => e.categoryType === 'transfer').length },
            ] as const
          ).map((t) => (
            <button
              key={t.type}
              onClick={() => setCategoryFilter(t.type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === t.type
                  ? 'bg-[#2dd4bf] text-[#052e24] font-bold shadow-sm'
                  : 'bg-[#16201b] text-[#9ca3af] hover:text-white'
              }`}
            >
              <span>{t.label}</span>
              <span className="ml-1 text-[10px] opacity-75 font-mono">({t.count})</span>
            </button>
          ))}
        </div>

        {/* Controls Bar: Search & Status Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search counterparty, category, notes, project..."
                className="bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#6b7280] outline-none w-72"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-1.5 text-xs text-white outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="reconciled">Reconciled</option>
              <option value="cleared">Cleared</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
            <span>Showing <strong className="text-white">{filteredEntries.length}</strong> records</span>
          </div>
        </div>

        {/* Entries Table with Full CRUD */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#6b7280] border-b border-[#1b2620] pb-2 font-semibold">
                <th className="pb-2.5">Date</th>
                <th className="pb-2.5">Category Type</th>
                <th className="pb-2.5">Entity / Counterparty</th>
                <th className="pb-2.5">Description & Project</th>
                <th className="pb-2.5">Payment Method</th>
                <th className="pb-2.5 text-right">Amount (PKR)</th>
                <th className="pb-2.5 text-center">Reconcile</th>
                <th className="pb-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17221c]">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#6b7280]">
                    No transactions match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((item) => {
                  const meta = FINANCE_CATEGORY_CONFIG[item.categoryType] || {
                    label: item.category,
                    badgeColor: 'bg-[#9ca3af]/15 text-[#9ca3af] border-[#9ca3af]/30',
                  };

                  return (
                    <tr key={item.id} className="hover:bg-[#16201b]/60 transition-colors group">
                      <td className="py-3 font-mono text-[#9ca3af] whitespace-nowrap">{item.date}</td>
                      
                      {/* Category Badge */}
                      <td className="py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${meta.badgeColor}`}>
                          {meta.label}
                        </span>
                      </td>

                      {/* Entity / Counterparty */}
                      <td className="py-3 font-bold text-white max-w-[200px] truncate">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.type === 'income'
                                ? 'bg-[#10b981]'
                                : item.type === 'expense'
                                ? 'bg-[#ef4444]'
                                : 'bg-[#38bdf8]'
                            }`}
                          />
                          <span className="truncate">{item.entity}</span>
                        </div>
                      </td>

                      {/* Description & Project */}
                      <td className="py-3 text-[#9ca3af] max-w-xs">
                        <p className="text-white text-xs truncate font-medium">{item.category}</p>
                        <p className="text-[11px] text-[#6b7280] truncate">
                          {item.projectName ? `Project: ${item.projectName}` : item.notes || '—'}
                        </p>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3 text-[#9ca3af] font-medium whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-[#16201b] border border-[#223328] text-[11px]">
                          {item.paymentMethod}
                        </span>
                      </td>

                      {/* Amount in PKR */}
                      <td className="py-3 text-right font-mono font-bold whitespace-nowrap">
                        <span
                          className={
                            item.type === 'income'
                              ? 'text-[#34d399]'
                              : item.type === 'expense'
                              ? 'text-[#f87171]'
                              : 'text-[#38bdf8]'
                          }
                        >
                          {item.type === 'income' ? '+' : item.type === 'expense' ? '-' : ''}
                          {formatPKR(item.amount)}
                        </span>
                        {item.taxAmount > 0 && (
                          <span className="block text-[10px] text-[#6b7280] font-normal font-mono">
                            WHT: {formatPKR(item.taxAmount)}
                          </span>
                        )}
                      </td>

                      {/* Reconcile Status Button */}
                      <td className="py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => toggleEntryStatus(item.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                            item.status === 'reconciled'
                              ? 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30 hover:bg-[#10b981]/25'
                              : item.status === 'cleared'
                              ? 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30 hover:bg-[#38bdf8]/25'
                              : 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30 hover:bg-[#fbbf24]/25'
                          }`}
                          title="Click to toggle reconciliation status"
                        >
                          {item.status === 'reconciled' && <Check className="w-2.5 h-2.5" />}
                          {item.status === 'pending' && <Clock className="w-2.5 h-2.5" />}
                          <span className="capitalize">{item.status}</span>
                        </button>
                      </td>

                      {/* CRUD Actions: Edit & Delete */}
                      <td className="py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#2dd4bf] hover:bg-[#17261e] transition-colors"
                            title="Edit Entry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete this record for "${item.entity}"?`)) {
                                deleteEntry(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#f87171] hover:bg-[#261717] transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Record / Edit Transaction Modal (Complete CRUD) ───────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121915] border border-[#223328] w-full max-w-xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#9ca3af] hover:text-white p-1 rounded-lg hover:bg-[#1a2620] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf]">
                {editingEntryId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {editingEntryId ? 'Edit Transaction Record' : 'Record Financial Transaction (PKR)'}
                </h3>
                <p className="text-xs text-[#9ca3af]">
                  {editingEntryId
                    ? 'Update transaction parameters and recalculate real-time financial metrics'
                    : 'Add project revenue, retainers, staff payroll, founder compensation, or SaaS expenses'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              {/* Category Type Selection */}
              <div>
                <label className="block text-[#d1d5db] font-semibold mb-1.5">Category Classification</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'project_revenue', label: '💼 Project Payment' },
                      { id: 'recurring_revenue', label: '🔄 Retainer / MRR' },
                      { id: 'salary_employee', label: '👥 Staff Payroll' },
                      { id: 'salary_founder', label: '👑 Founder Salary' },
                      { id: 'founder_equity', label: '🛡️ Founder Equity' },
                      { id: 'saas_subscription', label: '⚡ SaaS & Tools' },
                      { id: 'opex_general', label: '🏢 General OpEx' },
                      { id: 'transfer', label: '🔁 Bank Transfer' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormCategoryType(t.id)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border text-center transition-all ${
                        formCategoryType === t.id
                          ? 'bg-[#1b2c22] border-[#2dd4bf] text-[#2dd4bf] shadow-sm'
                          : 'bg-[#141d18] border-[#223328] text-[#9ca3af] hover:border-[#334b3c]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entity & Project */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">
                    {formCategoryType === 'project_revenue' || formCategoryType === 'recurring_revenue'
                      ? 'Client / Customer Name'
                      : formCategoryType === 'salary_employee'
                      ? 'Employee Name / Payroll Batch'
                      : formCategoryType === 'salary_founder' || formCategoryType === 'founder_equity'
                      ? 'Founder Name / Partner'
                      : formCategoryType === 'saas_subscription'
                      ? 'Software / Cloud Provider (AWS, OpenAI, etc.)'
                      : 'Counterparty / Payee'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formEntity}
                    onChange={(e) => setFormEntity(e.target.value)}
                    placeholder="e.g. Acme Corp, AWS Cloud, Staff Payroll"
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Project Name (Optional)</label>
                  <input
                    type="text"
                    value={formProjectName}
                    onChange={(e) => setFormProjectName(e.target.value)}
                    placeholder="e.g. Acme ERP Suite, FinTech Mobile"
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              {/* Title / Description & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Category / Milestone Title</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Milestone 1 Core Backend, April Team Retainer"
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Amount in PKR (Rs.)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="e.g. 1850000"
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Tax & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">FBR / WHT Tax (Rs.)</label>
                  <input
                    type="number"
                    step="1"
                    value={formTax}
                    onChange={(e) => setFormTax(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Payment Method / Bank</label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as any)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Meezan Bank">Meezan Bank Operating</option>
                    <option value="HBL Bank">HBL Corporate Payroll</option>
                    <option value="Standard Chartered">Standard Chartered Treasury</option>
                    <option value="Payoneer / Wise">Payoneer / Wise Multi-currency</option>
                    <option value="Credit Card">Credit Card (SaaS)</option>
                    <option value="Cash / Cheque">Cash / Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[#d1d5db] font-semibold mb-1">Notes / Remittance Reference</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Additional context, wire reference, tax deductions..."
                  className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl p-2.5 text-white outline-none resize-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9ca3af] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-black transition-all shadow-md shadow-[#2dd4bf]/20"
                >
                  {editingEntryId ? 'Update Record' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
