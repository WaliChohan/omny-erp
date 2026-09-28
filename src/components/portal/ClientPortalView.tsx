'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ClientProfile,
  ClientProject,
  ClientInvoice,
  ClientSharedFile,
  SupportTicket,
  ActivityEvent,
} from '@/data/portalData';
import { useAgency } from '@/context/AgencyContext';

import ClientPortalHeader from './ClientPortalHeader';
import InvoiceModal from './InvoiceModal';
import NewTicketModal from './NewTicketModal';

import {
  CreditCard,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  Download,
  Plus,
  Send,
  Search,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  User,
  ShieldCheck,
  Check,
  Filter,
} from 'lucide-react';

interface ClientPortalViewProps {
  onBackToERP?: () => void;
}

export default function ClientPortalView({ onBackToERP }: ClientPortalViewProps) {
  const {
    clients,
    portalClientId,
    setPortalClientId,
    getPortalBundle,
    addTicket,
    replyToTicket,
    recordPayment,
    tickets: storeTickets,
  } = useAgency();

  const bundle = useMemo(
    () => getPortalBundle(portalClientId),
    [getPortalBundle, portalClientId, storeTickets, clients]
  );
  const profile = bundle.profile;
  const projects = bundle.projects;
  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  const [files, setFiles] = useState<ClientSharedFile[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const activities = bundle.activities;

  useEffect(() => {
    setInvoices(bundle.invoices);
    setFiles(bundle.files);
    setTickets(bundle.tickets);
  }, [bundle]);

  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modal states
  const [selectedInvoice, setSelectedInvoice] = useState<ClientInvoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  // Invoices & Billing tab state
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'Paid' | 'Pending' | 'Overdue'>('all');
  const [invoiceSearch, setInvoiceSearch] = useState('');

  // Projects tab state
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Support tab state
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Files filter
  const [fileFilter, setFileFilter] = useState<string>('All');

  useEffect(() => {
    if (projects.length && !selectedProjectId) setSelectedProjectId(projects[0].id);
    if (tickets.length && !selectedTicketId) setSelectedTicketId(tickets[0].id);
  }, [projects, tickets, selectedProjectId, selectedTicketId]);

  // Update profile balance when invoices change
  /* balanceDue comes from getPortalBundle */

  // Invoice payment handler
  const handlePayInvoice = (invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;
    recordPayment({ invoiceId, amount: inv.amount, method: 'Bank Transfer', note: 'Paid via client portal' });
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === invoiceId
          ? { ...i, status: 'Paid' as const, paidDate: new Date().toISOString().slice(0, 10), paymentMethod: 'Bank Transfer' }
          : i
      )
    );
  };

  const handlePayFullBalance = () => {
    invoices
      .filter((inv) => inv.status === 'Pending' || inv.status === 'Overdue')
      .forEach((inv) => {
        recordPayment({
          invoiceId: inv.id,
          amount: inv.amount,
          method: 'Bank Transfer',
          note: 'Paid via client portal (full balance)',
        });
      });
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.status === 'Pending' || inv.status === 'Overdue'
          ? {
              ...inv,
              status: 'Paid' as const,
              paidDate: new Date().toISOString().slice(0, 10),
              paymentMethod: 'Bank Transfer',
            }
          : inv
      )
    );
  };

  const handleSimulateFileUpload = () => {
    const name = 'Client_Upload_' + Date.now() + '.pdf';
    setFiles((prev) => [
      {
        id: 'file-' + Date.now(),
        name,
        size: 'PDF',
        type: 'pdf',
        uploadedAt: new Date().toISOString().slice(0, 10),
        uploadedBy: profile.name,
        category: 'Deliverable',
      },
      ...prev,
    ]);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReplyText.trim() || !selectedTicketId) return;
    replyToTicket(selectedTicketId, ticketReplyText.trim(), true, profile.name);
    setTicketReplyText('');
  };

  const handleCreateTicket = (
    newTicketData: Omit<import('@/data/portalData').SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>,
    initialMessage: string
  ) => {
    const created = addTicket({
      ...newTicketData,
      clientId: portalClientId,
      messages: [
        {
          id: 'msg-' + Date.now(),
          sender: profile.name,
          isClient: true,
          text: initialMessage,
          timestamp: 'Just now',
        },
      ],
    });
    setSelectedTicketId(created.id);
  };

  // Selected active project & ticket
  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  // Invoices filtered list
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (invoiceFilter !== 'all' && inv.status !== invoiceFilter) return false;
      if (invoiceSearch.trim()) {
        const q = invoiceSearch.toLowerCase();
        const matchNumber = inv.invoiceNumber.toLowerCase().includes(q);
        const matchDesc = inv.description.toLowerCase().includes(q);
        if (!matchNumber && !matchDesc) return false;
      }
      return true;
    });
  }, [invoices, invoiceFilter, invoiceSearch]);

  // Invoice calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((acc, inv) => acc + inv.amount, 0);
  const totalPending = invoices
    .filter((inv) => inv.status === 'Pending')
    .reduce((acc, inv) => acc + inv.amount, 0);
  const totalOverdue = invoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((acc, inv) => acc + inv.amount, 0);

  // Files filtered list
  const filteredFiles = useMemo(() => {
    if (fileFilter === 'All') return files;
    return files.filter((f) => f.category === fileFilter);
  }, [files, fileFilter]);

  return (
    <div className="min-h-screen bg-[#0b0f0d] flex flex-col text-[#f3f4f6]">
      {/* Streamlined Client Portal Header */}
      <div className="px-4 md:px-8 pt-4 flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-[#6b7280] font-semibold">Portal account</span>
        <select
          value={portalClientId}
          onChange={(e) => setPortalClientId(e.target.value)}
          className="bg-[#141d18] border border-[#223328] text-white text-xs rounded-lg px-2.5 py-1.5 outline-none"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.company}</option>
          ))}
        </select>
      </div>
      <ClientPortalHeader
        profile={profile}
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        onPayBalance={handlePayFullBalance}
        onBackToERP={onBackToERP}
      />

      {/* Main Portal View Canvas */}
      <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & CLIENT COMMAND HUB                                       */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Welcome Banner */}
            <div className="bg-gradient-to-r from-[#121c16] via-[#101713] to-[#121c16] border border-[#1e2e24] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2dd4bf] uppercase tracking-wider">
                    Welcome back
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8ff00]" />
                  <span className="text-xs text-[#9ca3af]">Account Verified</span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {profile.name} • <span className="text-[#2dd4bf]">{profile.company}</span>
                </h1>
                <p className="text-xs text-[#9ca3af]">
                  You have <span className="text-white font-semibold">{projects.length} active enterprise projects</span> and{' '}
                  <span className="text-white font-semibold">
                    {invoices.filter((i) => i.status === 'Pending').length} pending invoice
                  </span>{' '}
                  under management.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('invoices')}
                  className="px-4 py-2 rounded-xl bg-[#141f19] hover:bg-[#1a2921] border border-[#23382b] text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4 text-[#2dd4bf]" />
                  <span>View Billing</span>
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="px-4 py-2 rounded-xl bg-[#b8ff00] hover:bg-[#a6e600] text-black font-bold text-xs shadow-md shadow-[#b8ff00]/20 transition-all flex items-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Active Milestones</span>
                </button>
              </div>
            </div>

            {/* Top Cards: Balance Summary + Assigned Solution Lead */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Outstanding Balance Card */}
              <div className="md:col-span-6 lg:col-span-5 bg-[#121915] border border-[#1b2a22] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 flex items-center justify-center font-bold">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
                        Outstanding Account Balance
                      </h3>
                      <p className="text-[11px] text-[#6b7280]">Settlement via ACH or Corporate Wire</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
                    Net 15 Terms
                  </span>
                </div>

                <div className="my-4">
                  <div className="text-3xl font-black text-white">
                    ${profile.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-[#9ca3af] mt-1">
                    {profile.balanceDue > 0
                      ? 'Invoice INV-2025-049 due April 5, 2025'
                      : 'All invoices settled! You have zero outstanding balances.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#18261e] flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('invoices')}
                    className="text-xs text-[#2dd4bf] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>View all invoices</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {profile.balanceDue > 0 && (
                    <button
                      onClick={handlePayFullBalance}
                      className="px-4 py-1.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Balance</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Assigned Solutions Lead & Team Card */}
              <div className="md:col-span-6 lg:col-span-7 bg-[#121915] border border-[#1b2a22] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#2dd4bf]/15 text-[#2dd4bf] border border-[#2dd4bf]/30 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
                        Assigned Omnysync Lead
                      </h3>
                      <p className="text-[11px] text-[#6b7280]">Direct Account & Technical Oversight</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#b8ff00]/15 text-[#b8ff00] border border-[#b8ff00]/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b8ff00] animate-pulse" />
                    Online
                  </span>
                </div>

                <div className="my-3 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#2dd4bf]/40 bg-[#16231c] shrink-0">
                    <img
                      src={profile.accountManager.avatar}
                      alt={profile.accountManager.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{profile.accountManager.name}</h4>
                    <p className="text-xs text-[#2dd4bf]">{profile.accountManager.role}</p>
                    <p className="text-[11px] text-[#6b7280]">{profile.accountManager.email}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#18261e] flex items-center justify-between">
                  <span className="text-xs text-[#9ca3af]">Guaranteed Response SLA: &lt; 2 Hours</span>
                  <button
                    onClick={() => setActiveTab('support')}
                    className="px-4 py-1.5 rounded-xl bg-[#14231b] hover:bg-[#1a3225] border border-[#224534] text-[#2dd4bf] font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Direct Message</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Projects Summary Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#9ca3af] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#2dd4bf]" />
                  Active Client Projects & Progress
                </h2>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-xs text-[#2dd4bf] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Detailed milestone breakdown</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {projects.map((proj) => {
                  const completedMilestones = proj.milestones.filter((m) => m.completed).length;
                  const totalMilestones = proj.milestones.length;

                  return (
                    <div
                      key={proj.id}
                      className="bg-[#121915] border border-[#1b2a22] hover:border-[#233d2f] transition-all rounded-2xl p-5 space-y-4 shadow-xl group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#18261e] text-[#2dd4bf] border border-[#223b2e]">
                              {proj.code}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#b8ff00]/15 text-[#b8ff00] border border-[#b8ff00]/30">
                              {proj.status}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-white mt-1.5 group-hover:text-[#2dd4bf] transition-colors">
                            {proj.name}
                          </h3>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-lg font-black text-white">{proj.progress}%</span>
                          <span className="text-[10px] text-[#9ca3af] block">Progress</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-[#152019] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#2dd4bf] to-[#b8ff00] rounded-full transition-all duration-500"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-[#9ca3af]">
                          <span>{proj.currentPhase}</span>
                          <span>
                            {completedMilestones}/{totalMilestones} Milestones
                          </span>
                        </div>
                      </div>

                      {/* Project Meta Footer */}
                      <div className="pt-3 border-t border-[#18261e] grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-[#6b7280] block">Target Delivery</span>
                          <span className="font-semibold text-white">{proj.targetDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#6b7280] block">Lead Developer</span>
                          <span className="font-semibold text-[#2dd4bf] truncate block">
                            {proj.leadDeveloper}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-[#101713] border border-[#1b2a22] rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#9ca3af] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2dd4bf]" />
                Recent Portal Activity & Events
              </h2>

              <div className="divide-y divide-[#17231c]">
                {activities.map((act) => (
                  <div key={act.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{act.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#18261e] text-[#2dd4bf] border border-[#203629]">
                          {act.badge}
                        </span>
                      </div>
                      <p className="text-[#9ca3af] text-[11px]">{act.description}</p>
                    </div>

                    <span className="text-[10px] text-[#6b7280] whitespace-nowrap">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INVOICES & BILLING                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'invoices' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Billing Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#121915] border border-[#1b2a22] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#2dd4bf]/15 text-[#2dd4bf] flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-black text-white">
                    ${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-[#9ca3af] font-medium">Total Invoiced</div>
                </div>
              </div>

              <div className="bg-[#121915] border border-[#1b2a22] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#b8ff00]/15 text-[#b8ff00] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-black text-[#b8ff00]">
                    ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-[#9ca3af] font-medium">Settled to Date</div>
                </div>
              </div>

              <div className="bg-[#121915] border border-[#1b2a22] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#fbbf24]/15 text-[#fbbf24] flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-black text-[#fbbf24]">
                    ${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-[#9ca3af] font-medium">Pending Net 15</div>
                </div>
              </div>

              <div className="bg-[#121915] border border-[#1b2a22] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f43f5e]/15 text-[#f43f5e] flex items-center justify-center font-bold">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-black text-[#f43f5e]">
                    ${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-[#9ca3af] font-medium">Overdue Invoices</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="bg-[#101713] border border-[#1b2a22] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                {(['all', 'Pending', 'Paid', 'Overdue'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setInvoiceFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      invoiceFilter === filter
                        ? 'bg-[#2dd4bf] text-[#052e24] shadow-sm font-bold'
                        : 'bg-[#141e18] text-[#9ca3af] hover:text-white hover:bg-[#1a2820]'
                    }`}
                  >
                    {filter === 'all' ? 'All Invoices' : filter}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-[#6b7280] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  placeholder="Search invoice # or keyword..."
                  className="w-full bg-[#152019] border border-[#1f3025] focus:border-[#2dd4bf] text-white text-xs pl-8 pr-3 py-1.5 rounded-lg outline-none placeholder-[#6b7280]"
                />
              </div>
            </div>

            {/* Invoices Table */}
            <div className="border border-[#1b2a22] rounded-2xl overflow-hidden bg-[#101713] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#131d17] border-b border-[#1b2a22] text-[#9ca3af] uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Invoice #</th>
                      <th className="px-4 py-3 font-semibold">Description</th>
                      <th className="px-4 py-3 font-semibold">Issue Date</th>
                      <th className="px-4 py-3 font-semibold">Due Date</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold text-center">Status</th>
                      <th className="px-5 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#17231c]">
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-[#9ca3af]">
                          No invoices matching the current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((inv) => {
                        const isPaid = inv.status === 'Paid';
                        const isOverdue = inv.status === 'Overdue';

                        return (
                          <tr
                            key={inv.id}
                            className="hover:bg-[#142019] transition-colors group cursor-pointer"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsInvoiceModalOpen(true);
                            }}
                          >
                            <td className="px-5 py-3.5 font-bold text-white">
                              {inv.invoiceNumber}
                            </td>
                            <td className="px-4 py-3.5 text-[#d1d5db] max-w-xs truncate">
                              {inv.description}
                            </td>
                            <td className="px-4 py-3.5 text-[#9ca3af]">{inv.issueDate}</td>
                            <td className={`px-4 py-3.5 font-medium ${isOverdue ? 'text-[#f43f5e]' : 'text-[#9ca3af]'}`}>
                              {inv.dueDate}
                            </td>
                            <td className="px-4 py-3.5 font-black text-white">
                              ${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider inline-block ${
                                  isPaid
                                    ? 'bg-[#b8ff00]/15 text-[#b8ff00] border-[#b8ff00]/30'
                                    : isOverdue
                                    ? 'bg-[#f43f5e]/15 text-[#f43f5e] border-[#f43f5e]/30'
                                    : 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30'
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedInvoice(inv);
                                  setIsInvoiceModalOpen(true);
                                }}
                                className="px-3 py-1 rounded-lg bg-[#18261e] hover:bg-[#203529] text-[#2dd4bf] font-semibold text-xs border border-[#234031] transition-colors"
                              >
                                View / Pay
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PROJECTS & DELIVERABLES                                             */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Project Picker Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedProjectId === proj.id
                      ? 'bg-[#2dd4bf] text-[#052e24] shadow-md shadow-[#2dd4bf]/20'
                      : 'bg-[#121915] text-[#9ca3af] hover:text-white border border-[#1b2a22]'
                  }`}
                >
                  {proj.name} ({proj.code})
                </button>
              ))}
            </div>

            {/* Active Project Details Card */}
            <div className="bg-[#121915] border border-[#1b2a22] rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#18261e] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#18261e] text-[#2dd4bf] border border-[#223b2e]">
                      {activeProject.code}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#b8ff00]/15 text-[#b8ff00] border border-[#b8ff00]/30">
                      {activeProject.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">{activeProject.name}</h2>
                  <p className="text-xs text-[#9ca3af] mt-0.5">{activeProject.currentPhase}</p>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-[10px] text-[#6b7280] block">Contract Budget</span>
                    <span className="font-bold text-white">${activeProject.budget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6b7280] block">Invoiced / Spent</span>
                    <span className="font-bold text-[#2dd4bf]">${activeProject.spent.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6b7280] block">Target Completion</span>
                    <span className="font-bold text-white">{activeProject.targetDate}</span>
                  </div>
                </div>
              </div>

              {/* Milestones Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
                  Milestone Deliverables & Acceptance Checklist
                </h3>

                <div className="space-y-2.5">
                  {activeProject.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                        m.completed
                          ? 'bg-[#101713] border-[#1a2720]'
                          : 'bg-[#141e18] border-[#22352a]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          m.completed
                            ? 'bg-[#b8ff00]/20 text-[#b8ff00]'
                            : 'bg-[#fbbf24]/20 text-[#fbbf24]'
                        }`}
                      >
                        {m.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-xs font-semibold ${
                              m.completed ? 'line-through text-[#6b7280]' : 'text-white'
                            }`}
                          >
                            {m.title}
                          </h4>
                          <span className="text-[11px] text-[#9ca3af] shrink-0">Due {m.dueDate}</span>
                        </div>
                        {m.notes && <p className="text-[11px] text-[#2dd4bf] mt-0.5">{m.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shared Files Drive */}
            <div className="bg-[#101713] border border-[#1b2a22] rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#18261e] pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#2dd4bf]" />
                    Shared Client Deliverables & Documents Drive
                  </h3>
                  <p className="text-xs text-[#9ca3af]">
                    Access signed statements of work, architecture specs, and security audits.
                  </p>
                </div>

                <button
                  onClick={handleSimulateFileUpload}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#20b8a4] text-[#052e24] font-bold text-xs shadow-md transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>

              {/* File Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Contract', 'Specification', 'Deliverable', 'Report'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFileFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      fileFilter === cat
                        ? 'bg-[#1a2b22] text-[#2dd4bf] border border-[#2d503d]'
                        : 'text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* File Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="bg-[#121a15] border border-[#1b2a22] hover:border-[#264434] p-4 rounded-xl flex flex-col justify-between space-y-3 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-[#6b7280]">
                        <span className="font-bold px-1.5 py-0.5 rounded bg-[#17231c] text-[#2dd4bf]">
                          {file.category}
                        </span>
                        <span>{file.size}</span>
                      </div>
                      <p className="text-xs font-bold text-white mt-2 group-hover:text-[#2dd4bf] transition-colors line-clamp-2">
                        {file.name}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#17241d] flex items-center justify-between text-[10px] text-[#9ca3af]">
                      <span>{file.uploadedAt}</span>
                      <button
                        onClick={() => alert(`Downloading ${file.name}...`)}
                        className="p-1 rounded bg-[#16221b] text-[#2dd4bf] hover:bg-[#22352a]"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SUPPORT & TICKET SYSTEM (WITH THREADED CHAT)                        */}
        {/* ========================================================================= */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200 items-stretch">
            {/* Left Rail: Ticket List */}
            <div className="lg:col-span-5 bg-[#101713] border border-[#1b2a22] rounded-2xl p-4 flex flex-col space-y-3 shadow-xl max-h-[780px]">
              <div className="flex items-center justify-between pb-3 border-b border-[#18261e]">
                <div>
                  <h3 className="text-sm font-bold text-white">Support & Inquiries</h3>
                  <p className="text-[11px] text-[#9ca3af]">Dedicated thread with Solutions Lead</p>
                </div>
                <button
                  onClick={() => setIsNewTicketModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#b8ff00] hover:bg-[#a6e600] text-black font-bold text-xs shadow-md shadow-[#b8ff00]/20 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Ticket</span>
                </button>
              </div>

              {/* Tickets List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {tickets.map((tkt) => {
                  const isSelected = tkt.id === selectedTicketId;
                  const isHigh = tkt.priority === 'High';

                  return (
                    <div
                      key={tkt.id}
                      onClick={() => setSelectedTicketId(tkt.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#15231c] border-[#2dd4bf] shadow-md shadow-[#2dd4bf]/10'
                          : 'bg-[#121a15] border-[#1a2820] hover:border-[#22382b]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-[#2dd4bf]">{tkt.ticketNumber}</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full border ${
                            isHigh
                              ? 'bg-[#f43f5e]/15 text-[#f43f5e] border-[#f43f5e]/30'
                              : 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30'
                          }`}
                        >
                          {tkt.priority} Priority
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{tkt.title}</h4>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5 line-clamp-1">{tkt.description}</p>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#18261e] text-[10px] text-[#6b7280]">
                        <span>{tkt.category}</span>
                        <span className="text-[#2dd4bf]">{tkt.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Rail: Threaded Chat / Discussion */}
            <div className="lg:col-span-7 bg-[#121915] border border-[#1b2a22] rounded-2xl flex flex-col shadow-xl max-h-[780px] overflow-hidden">
              {/* Ticket Header */}
              <div className="p-4 border-b border-[#18261e] bg-[#0e1511] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2dd4bf]">{activeTicket.ticketNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#18261e] text-[#9ca3af] border border-[#22352a]">
                      {activeTicket.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#b8ff00]/15 text-[#b8ff00] border border-[#b8ff00]/30">
                      {activeTicket.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{activeTicket.title}</h3>
                </div>
              </div>

              {/* Thread Messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#0a0f0d]">
                {activeTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isClient ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-[#6b7280] mb-1">
                      <span className="font-semibold text-[#9ca3af]">{msg.sender}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed ${
                        msg.isClient
                          ? 'bg-[#193325] text-white border border-[#28573d] rounded-tr-none'
                          : 'bg-[#141d18] text-[#d1d5db] border border-[#1e2e25] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input Bar */}
              <form onSubmit={handleSendReply} className="p-3 bg-[#0e1511] border-t border-[#18261e] flex items-center gap-2">
                <input
                  type="text"
                  value={ticketReplyText}
                  onChange={(e) => setTicketReplyText(e.target.value)}
                  placeholder="Type a response to your Omnysync Solutions Lead..."
                  className="flex-1 bg-[#141e18] border border-[#1f3025] focus:border-[#2dd4bf] text-white text-xs px-4 py-2.5 rounded-xl outline-none placeholder-[#6b7280]"
                />
                <button
                  type="submit"
                  disabled={!ticketReplyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#2dd4bf] hover:bg-[#20b8a4] disabled:bg-[#1a382e] disabled:text-[#4d7063] text-[#052e24] font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Invoice Viewer / Payment Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        profile={profile}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onPayInvoice={handlePayInvoice}
      />

      {/* New Support Ticket Modal */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
}
