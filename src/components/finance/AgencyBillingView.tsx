'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  Receipt,
  Wallet,
  CreditCard,
  TrendingDown,
  TrendingUp,
  Building2,
  Briefcase,
  Check,
  Send,
  X,
} from 'lucide-react';
import { useAgency, FinanceSubTab } from '@/context/AgencyContext';
import { formatPKR, CommercialDocument } from '@/data/financialData';
import { PaymentMethod, ExpenseCategory } from '@/data/billingData';

interface AgencyBillingViewProps {
  subTab: FinanceSubTab;
  onSubTabChange: (tab: FinanceSubTab) => void;
}

const TABS: { id: FinanceSubTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'quotes', label: 'Quotes', icon: FileText },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'expenses', label: 'Expenses', icon: CreditCard },
];

export default function AgencyBillingView({ subTab, onSubTabChange }: AgencyBillingViewProps) {
  const {
    documents,
    payments,
    expenses,
    clients,
    projects,
    createDocument,
    convertQuoteToInvoice,
    markDocumentStatus,
    recordPayment,
    addExpense,
    navigate,
    consumeFocus,
    getClient,
  } = useAgency();

  const [search, setSearch] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState<'quotation' | 'invoice' | null>(null);
  const [payForm, setPayForm] = useState({ amount: 0, method: 'Bank Transfer' as PaymentMethod, note: '' });
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Software' as ExpenseCategory,
    amount: 0,
    vendor: '',
    spentAt: new Date().toISOString().slice(0, 10),
    clientId: '',
    note: '',
  });
  const [createForm, setCreateForm] = useState({
    clientId: '',
    projectId: '',
    title: '',
    amount: 500000,
    description: '',
  });

  useEffect(() => {
    const id = consumeFocus('document');
    if (id) setSelectedDocId(id);
  }, [consumeFocus, subTab]);

  const quotes = useMemo(
    () => documents.filter((d) => d.docType === 'quotation' || d.docType === 'proposal' || d.docType === 'sow'),
    [documents]
  );
  const invoices = useMemo(() => documents.filter((d) => d.docType === 'invoice'), [documents]);

  const metrics = useMemo(() => {
    const openInvoices = invoices.filter((d) => d.status === 'sent' || d.status === 'draft');
    const paid = invoices.filter((d) => d.status === 'paid');
    const receivables = openInvoices.reduce((s, d) => s + d.totalAmount, 0);
    const collected = payments.reduce((s, p) => s + p.amount, 0);
    const opex = expenses.reduce((s, e) => s + e.amount, 0);
    const pipelineQuotes = quotes
      .filter((d) => d.status === 'draft' || d.status === 'sent')
      .reduce((s, d) => s + d.totalAmount, 0);

    const todayMs = Date.now();
    const aging = { current: 0, d30: 0, d60: 0, d90: 0 };
    openInvoices.forEach((d) => {
      const due = new Date(d.dueDate || d.issueDate).getTime();
      const days = Math.floor((todayMs - due) / (1000 * 60 * 60 * 24));
      if (days <= 0) aging.current += d.totalAmount;
      else if (days <= 30) aging.d30 += d.totalAmount;
      else if (days <= 60) aging.d60 += d.totalAmount;
      else aging.d90 += d.totalAmount;
    });

    return {
      receivables,
      collected,
      opex,
      pipelineQuotes,
      openCount: openInvoices.length,
      paidCount: paid.length,
      aging,
    };
  }, [invoices, payments, expenses, quotes]);

  const filterDocs = (list: CommercialDocument[]) => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (d) =>
        d.docNumber.toLowerCase().includes(q) ||
        d.clientName.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q)
    );
  };

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || null;

  const statusClass = (status: CommercialDocument['status']) => {
    const map: Record<string, string> = {
      draft: 'bg-[#1e2538] text-[#a5b4fc] border-[#3b4b73]',
      sent: 'bg-[#132c38] text-[#38bdf8] border-[#1b4356]',
      paid: 'bg-[#142e22] text-[#10b981] border-[#1f4a35]',
      approved: 'bg-[#18261e] text-[#2dd4bf] border-[#274032]',
      expired: 'bg-[#421b24] text-[#f43f5e] border-[#6b2132]',
    };
    return map[status] || map.draft;
  };

  const openCreate = (type: 'quotation' | 'invoice') => {
    setCreateForm({
      clientId: clients[0]?.id || '',
      projectId: '',
      title: '',
      amount: 500000,
      description: type === 'invoice' ? 'Project milestone' : 'Proposed engagement',
    });
    setShowCreateModal(type);
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCreateModal) return;
    createDocument({
      docType: showCreateModal,
      clientId: createForm.clientId || undefined,
      projectId: createForm.projectId || undefined,
      title: createForm.title || undefined,
      amount: Number(createForm.amount) || 0,
      description: createForm.description,
    });
    setShowCreateModal(null);
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || selectedDoc.docType !== 'invoice') return;
    recordPayment({
      invoiceId: selectedDoc.id,
      amount: Number(payForm.amount) || selectedDoc.totalAmount,
      method: payForm.method,
      note: payForm.note || undefined,
    });
    setShowPayModal(false);
  };

  const submitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title.trim() || !expenseForm.amount) return;
    addExpense({
      title: expenseForm.title.trim(),
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      vendor: expenseForm.vendor.trim() || '—',
      spentAt: expenseForm.spentAt,
      clientId: expenseForm.clientId || undefined,
      note: expenseForm.note || undefined,
    });
    setShowExpenseModal(false);
    setExpenseForm({
      title: '',
      category: 'Software',
      amount: 0,
      vendor: '',
      spentAt: new Date().toISOString().slice(0, 10),
      clientId: '',
      note: '',
    });
  };

  const DocList = ({ list }: { list: CommercialDocument[] }) => (
    <div className="rounded-2xl bg-[#121815] border border-[#1a2720] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1a2720] flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-white">{filterDocs(list).length} records</span>
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-[#6b7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search docs..."
            className="w-full bg-[#0f1612] border border-[#223328] rounded-lg pl-8 pr-2 py-1.5 text-xs text-white outline-none focus:border-[#2dd4bf]"
          />
        </div>
      </div>
      <div className="divide-y divide-[#1a2720] max-h-[420px] overflow-y-auto">
        {filterDocs(list).length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6b7280]">No documents yet. Create one to get started.</div>
        ) : (
          filterDocs(list).map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDocId(d.id)}
              className={`w-full text-left px-4 py-3 transition-colors ${
                selectedDocId === d.id ? 'bg-[#18261e]' : 'hover:bg-[#141e18]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{d.docNumber}</p>
                  <p className="text-[11px] text-[#9ca3af] truncate">{d.clientName} · {d.title}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-white">{formatPKR(d.totalAmount, true)}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusClass(d.status)}`}>
                    {d.status}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  const DocDetail = () => {
    if (!selectedDoc) {
      return (
        <div className="rounded-2xl bg-[#121815] border border-[#1a2720] p-8 flex items-center justify-center text-sm text-[#6b7280] min-h-[280px]">
          Select a document to preview actions.
        </div>
      );
    }
    const client = selectedDoc.clientId ? getClient(selectedDoc.clientId) : undefined;
    return (
      <div className="rounded-2xl bg-[#121815] border border-[#1a2720] p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#6b7280] font-semibold">{selectedDoc.docType}</p>
            <h3 className="text-lg font-black text-white">{selectedDoc.docNumber}</h3>
            <p className="text-xs text-[#9ca3af]">{selectedDoc.title}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusClass(selectedDoc.status)}`}>
            {selectedDoc.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-3">
            <p className="text-[10px] text-[#6b7280] uppercase font-semibold">Client</p>
            <p className="text-sm font-bold text-white mt-1">{selectedDoc.clientName}</p>
            <p className="text-[11px] text-[#9ca3af]">{selectedDoc.clientEmail}</p>
          </div>
          <div className="rounded-xl bg-[#0f1612] border border-[#1e2d24] p-3">
            <p className="text-[10px] text-[#6b7280] uppercase font-semibold">Amount</p>
            <p className="text-sm font-black text-[#2dd4bf] mt-1">{formatPKR(selectedDoc.totalAmount)}</p>
            <p className="text-[11px] text-[#9ca3af]">Due {selectedDoc.dueDate}</p>
          </div>
        </div>
        {selectedDoc.projectName && (
          <button
            onClick={() =>
              selectedDoc.projectId &&
              navigate({ tab: 'projects', focus: { kind: 'project', id: selectedDoc.projectId } })
            }
            className="flex items-center gap-2 text-xs text-[#9ca3af] hover:text-[#2dd4bf]"
          >
            <Briefcase className="w-3.5 h-3.5" />
            {selectedDoc.projectName}
          </button>
        )}
        {client && (
          <button
            onClick={() => navigate({ tab: 'clients', focus: { kind: 'client', id: client.id } })}
            className="flex items-center gap-2 text-xs text-[#9ca3af] hover:text-[#2dd4bf]"
          >
            <Building2 className="w-3.5 h-3.5" />
            Open {client.company}
          </button>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedDoc.status === 'draft' && (
            <button
              onClick={() => markDocumentStatus(selectedDoc.id, 'sent')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e2538] border border-[#3b4b73] text-[11px] font-bold text-[#a5b4fc]"
            >
              <Send className="w-3.5 h-3.5" /> Mark sent
            </button>
          )}
          {(selectedDoc.docType === 'quotation' || selectedDoc.docType === 'proposal') && (
            <button
              onClick={() => convertQuoteToInvoice(selectedDoc.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2dd4bf] text-[#052e24] text-[11px] font-bold"
            >
              <Receipt className="w-3.5 h-3.5" /> Convert to invoice
            </button>
          )}
          {selectedDoc.docType === 'invoice' && selectedDoc.status !== 'paid' && (
            <button
              onClick={() => {
                setPayForm({ amount: selectedDoc.totalAmount, method: 'Bank Transfer', note: '' });
                setShowPayModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2dd4bf] text-[#052e24] text-[11px] font-bold"
            >
              <Wallet className="w-3.5 h-3.5" /> Record payment
            </button>
          )}
          {selectedDoc.status === 'paid' && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#10b981]">
              <Check className="w-3.5 h-3.5" /> Paid
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Agency Billing</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">Quotes · invoices · payments · expenses</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openCreate('quotation')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141e18] border border-[#223328] text-xs font-bold text-white hover:border-[#2dd4bf]"
          >
            <Plus className="w-3.5 h-3.5 text-[#2dd4bf]" /> New quote
          </button>
          <button
            onClick={() => openCreate('invoice')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" /> New invoice
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141e18] border border-[#223328] text-xs font-bold text-white"
          >
            <Plus className="w-3.5 h-3.5 text-[#f59e0b]" /> Expense
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#1b2620]">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = subTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSubTabChange(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active
                  ? 'bg-[#2dd4bf] text-[#052e24] shadow-md shadow-[#2dd4bf]/20'
                  : 'bg-[#141e18] text-[#9ca3af] hover:text-white hover:bg-[#19261f]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {subTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Receivables', value: formatPKR(metrics.receivables, true), sub: `${metrics.openCount} open`, tone: 'text-[#f59e0b]' },
              { label: 'Collected', value: formatPKR(metrics.collected, true), sub: `${metrics.paidCount} paid invoices`, tone: 'text-[#10b981]' },
              { label: 'Quote pipeline', value: formatPKR(metrics.pipelineQuotes, true), sub: `${quotes.length} quotes`, tone: 'text-[#38bdf8]' },
              { label: 'Expenses', value: formatPKR(metrics.opex, true), sub: `${expenses.length} entries`, tone: 'text-[#f43f5e]' },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-[#121815] border border-[#1a2720] p-4">
                <p className="text-[10px] uppercase tracking-wider text-[#6b7280] font-semibold">{m.label}</p>
                <p className={`text-xl font-black mt-1 ${m.tone}`}>{m.value}</p>
                <p className="text-[11px] text-[#9ca3af] mt-1">{m.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-[#121815] border border-[#1a2720] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Receivables aging (PKR)</h3>
              <span className="text-[10px] text-[#6b7280]">Open invoices by days past due</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                { label: 'Current', value: metrics.aging.current, tone: 'text-[#10b981]' },
                { label: '1–30 days', value: metrics.aging.d30, tone: 'text-[#fbbf24]' },
                { label: '31–60 days', value: metrics.aging.d60, tone: 'text-[#f59e0b]' },
                { label: '90+ days', value: metrics.aging.d90, tone: 'text-[#f87171]' },
              ].map((b) => (
                <div key={b.label} className="rounded-xl bg-[#0b1210] border border-[#1e2a22] p-3">
                  <p className="text-[10px] text-[#6b7280] font-semibold uppercase tracking-wider">{b.label}</p>
                  <p className={`text-sm font-black mt-1 ${b.tone}`}>{formatPKR(b.value, true)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#121815] border border-[#1a2720] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Recent invoices</h3>
                <button onClick={() => onSubTabChange('invoices')} className="text-[11px] text-[#2dd4bf] font-semibold">
                  View all
                </button>
              </div>
              <div className="space-y-2">
                {invoices.slice(0, 5).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDocId(d.id);
                      onSubTabChange('invoices');
                    }}
                    className="w-full flex items-center justify-between rounded-xl bg-[#0f1612] border border-[#1e2d24] px-3 py-2 hover:border-[#2dd4bf]/40"
                  >
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-white truncate">{d.docNumber}</p>
                      <p className="text-[11px] text-[#9ca3af] truncate">{d.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">{formatPKR(d.totalAmount, true)}</p>
                      <span className={`text-[10px] font-bold ${d.status === 'paid' ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}>
                        {d.status}
                      </span>
                    </div>
                  </button>
                ))}
                {invoices.length === 0 && <p className="text-xs text-[#6b7280]">No invoices yet.</p>}
              </div>
            </div>
            <div className="rounded-2xl bg-[#121815] border border-[#1a2720] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Cash movement</h3>
                <TrendingDown className="w-4 h-4 text-[#6b7280]" />
              </div>
              <div className="space-y-2">
                {payments.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex justify-between text-xs rounded-xl bg-[#0f1612] border border-[#1e2d24] px-3 py-2">
                    <span className="text-[#9ca3af]">{p.clientName} · {p.invoiceNumber}</span>
                    <span className="font-bold text-[#10b981]">+{formatPKR(p.amount, true)}</span>
                  </div>
                ))}
                {expenses.slice(0, 3).map((e) => (
                  <div key={e.id} className="flex justify-between text-xs rounded-xl bg-[#0f1612] border border-[#1e2d24] px-3 py-2">
                    <span className="text-[#9ca3af]">{e.title}</span>
                    <span className="font-bold text-[#f43f5e]">−{formatPKR(e.amount, true)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {(subTab === 'quotes' || subTab === 'invoices') && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-5">
            <DocList list={subTab === 'quotes' ? quotes : invoices} />
          </div>
          <div className="xl:col-span-7">
            <DocDetail />
          </div>
        </div>
      )}

      {subTab === 'payments' && (
        <div className="rounded-2xl bg-[#121815] border border-[#1a2720] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1a2720] text-xs font-bold text-white">
            {payments.length} payments
          </div>
          <div className="divide-y divide-[#1a2720]">
            {payments.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#6b7280]">No payments recorded yet.</div>
            ) : (
              payments.map((p) => (
                <div key={p.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-white">{p.clientName}</p>
                    <p className="text-[11px] text-[#9ca3af]">
                      {p.invoiceNumber} · {p.method} · {p.paidAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-[#10b981]">{formatPKR(p.amount)}</span>
                    {p.clientId && (
                      <button
                        onClick={() => navigate({ tab: 'clients', focus: { kind: 'client', id: p.clientId! } })}
                        className="text-[11px] text-[#2dd4bf] font-semibold"
                      >
                        Client
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {subTab === 'expenses' && (
        <div className="rounded-2xl bg-[#121815] border border-[#1a2720] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1a2720] flex items-center justify-between">
            <span className="text-xs font-bold text-white">{expenses.length} expenses</span>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="text-[11px] font-bold text-[#2dd4bf]"
            >
              + Add
            </button>
          </div>
          <div className="divide-y divide-[#1a2720]">
            {expenses.map((e) => (
              <div key={e.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-white">{e.title}</p>
                  <p className="text-[11px] text-[#9ca3af]">
                    {e.category} · {e.vendor} · {e.spentAt}
                  </p>
                </div>
                <span className="text-sm font-black text-[#f43f5e]">{formatPKR(e.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={submitCreate} className="w-full max-w-md rounded-2xl bg-[#121815] border border-[#1e2d24] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">
                New {showCreateModal === 'invoice' ? 'invoice' : 'quote'}
              </h3>
              <button type="button" onClick={() => setShowCreateModal(null)} className="text-[#6b7280] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="block text-[11px] text-[#9ca3af] space-y-1">
              <span>Client</span>
              <select
                value={createForm.clientId}
                onChange={(e) => setCreateForm((f) => ({ ...f, clientId: e.target.value }))}
                className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.company}</option>
                ))}
              </select>
            </label>
            <label className="block text-[11px] text-[#9ca3af] space-y-1">
              <span>Project (optional)</span>
              <select
                value={createForm.projectId}
                onChange={(e) => setCreateForm((f) => ({ ...f, projectId: e.target.value }))}
                className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="">None</option>
                {projects
                  .filter((p) => !createForm.clientId || p.clientId === createForm.clientId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
              </select>
            </label>
            <label className="block text-[11px] text-[#9ca3af] space-y-1">
              <span>Title</span>
              <input
                value={createForm.title}
                onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
                placeholder="e.g. Booking portal — Phase 1"
              />
            </label>
            <label className="block text-[11px] text-[#9ca3af] space-y-1">
              <span>Amount (PKR)</span>
              <input
                type="number"
                required
                min={0}
                value={createForm.amount}
                onChange={(e) => setCreateForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
              />
            </label>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold">
              Create
            </button>
          </form>
        </div>
      )}

      {showPayModal && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={submitPayment} className="w-full max-w-md rounded-2xl bg-[#121815] border border-[#1e2d24] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Record payment · {selectedDoc.docNumber}</h3>
              <button type="button" onClick={() => setShowPayModal(false)} className="text-[#6b7280] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="block text-[11px] text-[#9ca3af] space-y-1">
              <span>Amount (PKR)</span>
              <input
                type="number"
                required
                min={1}
                value={payForm.amount}
                onChange={(e) => setPayForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
              />
            </label>
            <label className="block text-[11px] text-[#9ca3af] space-y-1">
              <span>Method</span>
              <select
                value={payForm.method}
                onChange={(e) => setPayForm((f) => ({ ...f, method: e.target.value as PaymentMethod }))}
                className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white"
              >
                {(['Bank Transfer', 'Card', 'Cash', 'Payoneer', 'Other'] as PaymentMethod[]).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="block text-[11px] text-[#9ca3af] space-y-1">
              <span>Note</span>
              <input
                value={payForm.note}
                onChange={(e) => setPayForm((f) => ({ ...f, note: e.target.value }))}
                className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
              />
            </label>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold">
              Save payment
            </button>
          </form>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={submitExpense} className="w-full max-w-md rounded-2xl bg-[#121815] border border-[#1e2d24] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Add expense</h3>
              <button type="button" onClick={() => setShowExpenseModal(false)} className="text-[#6b7280] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="block text-[11px] text-[#9ca3af] space-y-1">
              <span>Title</span>
              <input
                required
                value={expenseForm.title}
                onChange={(e) => setExpenseForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-[11px] text-[#9ca3af] space-y-1">
                <span>Category</span>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))}
                  className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white"
                >
                  {(['Software', 'Contractors', 'Ads', 'Travel', 'Office', 'Payroll', 'Other'] as ExpenseCategory[]).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block text-[11px] text-[#9ca3af] space-y-1">
                <span>Amount</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={expenseForm.amount || ''}
                  onChange={(e) => setExpenseForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                  className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
                />
              </label>
            </div>
            <label className="block text-[11px] text-[#9ca3af] space-y-1">
              <span>Vendor</span>
              <input
                value={expenseForm.vendor}
                onChange={(e) => setExpenseForm((f) => ({ ...f, vendor: e.target.value }))}
                className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
              />
            </label>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold">
              Save expense
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
