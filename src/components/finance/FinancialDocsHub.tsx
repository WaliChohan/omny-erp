'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Trash2,
  Building,
  Check,
  X,
  Send,
  Eye,
  DollarSign,
  Receipt,
  FileCheck,
  HelpCircle,
} from 'lucide-react';
import {
  CommercialDocument,
  DocumentType,
  DocumentLineItem,
  formatPKR,
} from '@/data/financialData';
import { OMNYSYNC_PROJECTS } from '@/data/projectsData';
import { useFinanceStore } from '@/context/FinanceContext';

export default function FinancialDocsHub() {
  const { documents, addDocument, updateDocument, deleteDocument, markDocumentStatus } = useFinanceStore();

  const [activeTab, setActiveTab] = useState<'all' | DocumentType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'paid' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected document for preview modal
  const [previewDoc, setPreviewDoc] = useState<CommercialDocument | null>(null);

  // Document creation studio modal
  const [isCreating, setIsCreating] = useState(false);
  const [docType, setDocType] = useState<DocumentType>('invoice');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [taxRate, setTaxRate] = useState<number>(0);
  const [notes, setNotes] = useState('Payment due within standard contract terms. Thank you for your business.');
  const [terms, setTerms] = useState('Standard Net 15 days payment cycle. Governed by Omnysync Master Agreement.');

  // Line items for document creation (in PKR)
  const [lineItems, setLineItems] = useState<DocumentLineItem[]>([
    { id: '1', description: 'Enterprise Architecture & Cloud Implementation', qty: 1, unitPrice: 1500000, total: 1500000 },
  ]);

  // Handle line item update
  const updateLineItem = (id: string, field: keyof DocumentLineItem, value: any) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'qty' || field === 'unitPrice') {
          const qty = field === 'qty' ? parseFloat(value) || 0 : item.qty;
          const price = field === 'unitPrice' ? parseFloat(value) || 0 : item.unitPrice;
          updated.total = qty * price;
        }
        return updated;
      })
    );
  };

  const addLineItem = () => {
    const newItem: DocumentLineItem = {
      id: `${Date.now()}`,
      description: 'Professional Engineering Milestone',
      qty: 1,
      unitPrice: 500000,
      total: 500000,
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((i) => i.id !== id));
    }
  };

  // Subtotal and Total calculations for creation
  const subtotal = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + (item.total || 0), 0);
  }, [lineItems]);

  const taxAmount = useMemo(() => {
    return Math.round((subtotal * (taxRate || 0)) / 100);
  }, [subtotal, taxRate]);

  const totalAmount = useMemo(() => {
    return subtotal + taxAmount;
  }, [subtotal, taxAmount]);

  // Filtered documents list
  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      if (activeTab !== 'all' && d.docType !== activeTab) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.title.toLowerCase().includes(q) ||
          d.clientName.toLowerCase().includes(q) ||
          d.docNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [documents, activeTab, statusFilter, searchQuery]);

  // Aggregate stats
  const stats = useMemo(() => {
    const invoices = documents.filter((d) => d.docType === 'invoice');
    const totalInvoiced = invoices.reduce((a, b) => a + b.totalAmount, 0);
    const paidInvoices = invoices.filter((d) => d.status === 'paid').reduce((a, b) => a + b.totalAmount, 0);
    const quotes = documents.filter((d) => d.docType === 'quotation' || d.docType === 'proposal');
    const totalPipeline = quotes.reduce((a, b) => a + b.totalAmount, 0);
    const sows = documents.filter((d) => d.docType === 'sow');

    return { totalInvoiced, paidInvoices, totalPipeline, sowsCount: sows.length };
  }, [documents]);

  // Create new document submission
  const handleSaveDocument = (status: 'draft' | 'sent' | 'approved' | 'paid') => {
    if (!title || !clientName) {
      alert('Please enter a Document Title and Client Name.');
      return;
    }

    const selectedProj = OMNYSYNC_PROJECTS.find((p) => p.id === projectId);
    const prefix =
      docType === 'invoice'
        ? 'INV'
        : docType === 'receipt'
        ? 'REC'
        : docType === 'quotation'
        ? 'QT'
        : docType === 'proposal'
        ? 'PROP'
        : docType === 'sow'
        ? 'SOW'
        : 'PO';

    addDocument({
      docType,
      docNumber: `${prefix}-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      clientName,
      clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@client.com`,
      clientAddress: clientAddress || 'Lahore / Karachi, Pakistan',
      issueDate,
      dueDate,
      currency: 'PKR',
      status,
      items: lineItems,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      notes,
      terms,
      projectId: projectId || undefined,
      projectName: selectedProj?.title,
    });

    setIsCreating(false);
    // Reset form
    setTitle('');
    setClientName('');
    setClientEmail('');
    setClientAddress('');
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121915] border border-[#1e2d24] p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Commercial & Financial Documents</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30">
              PKR Invoicing Studio
            </span>
          </div>
          <p className="text-xs text-[#9ca3af] mt-1">
            Create, issue and track official Invoices, Payment Receipts, Quotations, Proposals, Statements of Work (SOW), and Purchase Orders.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-black transition-all shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Document</span>
        </button>
      </div>

      {/* ── High-Level Commercial Stats (in PKR) ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-4">
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Total Invoiced (PKR)</span>
          <p className="text-2xl font-black text-white font-mono mt-1">{formatPKR(stats.totalInvoiced)}</p>
          <span className="text-[11px] text-[#34d399] font-medium">Billed across enterprise clients</span>
        </div>

        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-4">
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Collected Settlements</span>
          <p className="text-2xl font-black text-[#10b981] font-mono mt-1">{formatPKR(stats.paidInvoices)}</p>
          <span className="text-[11px] text-[#9ca3af]">Official payment receipts issued</span>
        </div>

        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-4">
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Open Pipeline / Quotes</span>
          <p className="text-2xl font-black text-[#818cf8] font-mono mt-1">{formatPKR(stats.totalPipeline)}</p>
          <span className="text-[11px] text-[#9ca3af]">Active quotations & proposals</span>
        </div>

        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-4">
          <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Statements of Work (SOW)</span>
          <p className="text-2xl font-black text-[#fbbf24] font-mono mt-1">{stats.sowsCount} SOWs</p>
          <span className="text-[11px] text-[#9ca3af]">Executed project deliverable scopes</span>
        </div>
      </div>

      {/* ── Document Type Filter Tabs ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#1b2620]">
        {[
          { id: 'all', label: 'All Documents' },
          { id: 'invoice', label: 'Invoices' },
          { id: 'receipt', label: 'Payment Receipts' },
          { id: 'quotation', label: 'Quotations / Estimates' },
          { id: 'proposal', label: 'Proposals' },
          { id: 'sow', label: "Statement of Work (SOW's)" },
          { id: 'po', label: 'Purchase Orders' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#2dd4bf] text-[#052e24] shadow-md shadow-[#2dd4bf]/20'
                : 'bg-[#141e18] text-[#9ca3af] hover:text-white hover:bg-[#19261f]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Search & Filter Toolbar ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doc title, number, client..."
            className="w-full bg-[#141d18] border border-[#203026] focus:border-[#2dd4bf] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#6b7280] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#141d18] border border-[#203026] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="approved">Approved</option>
            <option value="sent">Sent / Pending</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* ── Documents Grid / Table ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#121915] border border-[#1e2d24] rounded-2xl">
            <FileText className="w-8 h-8 text-[#4b5563] mx-auto mb-2" />
            <p className="text-sm font-bold text-white">No documents found</p>
            <p className="text-xs text-[#6b7280] mt-1">Try changing your search or create a new document.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#121915] border border-[#1e2d24] hover:border-[#2dd4bf]/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-lg group"
            >
              <div>
                {/* Header: Doc Type Pill + Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono tracking-wider bg-[#18261e] text-[#2dd4bf] border border-[#23382d]">
                    {doc.docType}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        doc.status === 'paid' || doc.status === 'approved'
                          ? 'bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30'
                          : doc.status === 'sent'
                          ? 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30'
                          : 'bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]/30'
                      }`}
                    >
                      {doc.status}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete document "${doc.docNumber}"?`)) {
                          deleteDocument(doc.id);
                        }
                      }}
                      className="text-[#6b7280] hover:text-[#ef4444] p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title & Client */}
                <h3 className="text-sm font-bold text-white group-hover:text-[#2dd4bf] transition-colors leading-snug line-clamp-1">
                  {doc.title}
                </h3>
                <p className="text-xs text-[#9ca3af] mt-0.5">{doc.clientName}</p>
                <p className="text-[11px] font-mono text-[#6b7280] mt-1">{doc.docNumber}</p>

                {doc.projectName && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#16211a] border border-[#203227] text-[10px] text-[#9ca3af]">
                    <span>Project:</span>
                    <strong className="text-white font-medium">{doc.projectName}</strong>
                  </div>
                )}
              </div>

              {/* Bottom: Amount & View Actions */}
              <div className="pt-4 border-t border-[#18241d] mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6b7280] block">Total Value</span>
                  <span className="text-lg font-black text-white font-mono">
                    {formatPKR(doc.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-3 py-1.5 rounded-lg bg-[#18261e] hover:bg-[#22362b] border border-[#263c2f] text-[#2dd4bf] text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Document Creation Studio Modal ─────────────────────────────────── */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121915] border border-[#223328] w-full max-w-4xl rounded-2xl shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsCreating(false)}
              className="absolute top-5 right-5 text-[#9ca3af] hover:text-white p-1 rounded-lg hover:bg-[#1a2620] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1b2620]">
              <div className="w-10 h-10 rounded-xl bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Commercial & Financial Document Studio (PKR)
                </h3>
                <p className="text-xs text-[#9ca3af]">
                  Generate official Invoices, Receipts, Quotations, Proposals, and Statements of Work in Pakistani Rupees
                </p>
              </div>
            </div>

            <div className="space-y-5 text-xs">
              {/* Document Type Selector */}
              <div>
                <label className="block text-[#d1d5db] font-bold mb-2">Select Document Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { id: 'invoice', label: 'Invoice' },
                    { id: 'receipt', label: 'Receipt' },
                    { id: 'quotation', label: 'Quotation' },
                    { id: 'proposal', label: 'Proposal' },
                    { id: 'sow', label: 'SOW' },
                    { id: 'po', label: 'Purchase Order' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setDocType(t.id as DocumentType)}
                      className={`py-2 px-3 rounded-xl font-bold border text-center transition-all ${
                        docType === t.id
                          ? 'bg-[#2dd4bf] text-[#052e24] border-[#2dd4bf] shadow-md shadow-[#2dd4bf]/20'
                          : 'border-[#223328] text-[#9ca3af] hover:border-[#334b3c] bg-[#16201b]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Services Agreement SOW #1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Link to Project (Optional)</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="">None (Independent Document)</option>
                    {OMNYSYNC_PROJECTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Client / Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Corporation"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Client Email</label>
                  <input
                    type="email"
                    placeholder="billing@acmecorp.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Billing Address</label>
                  <input
                    type="text"
                    placeholder="Lahore / Karachi, Pakistan"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Due / Validity Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Line Items Table (PKR) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Deliverables & Pricing Line Items (PKR)</span>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="text-xs text-[#2dd4bf] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="border border-[#1e2d24] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#16201b] text-[#9ca3af]">
                      <tr>
                        <th className="p-2.5">Description / Deliverable</th>
                        <th className="p-2.5 w-20 text-center">Qty</th>
                        <th className="p-2.5 w-36 text-right">Unit Price (Rs.)</th>
                        <th className="p-2.5 w-36 text-right">Total (PKR)</th>
                        <th className="p-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2d24] bg-[#121915]">
                      {lineItems.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                              className="w-full bg-transparent text-white outline-none border-b border-transparent focus:border-[#2dd4bf]"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => updateLineItem(item.id, 'qty', e.target.value)}
                              className="w-16 bg-[#16201b] border border-[#223328] rounded p-1 text-center text-white outline-none"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              step="1"
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                              className="w-32 bg-[#16201b] border border-[#223328] rounded p-1 text-right text-white font-mono outline-none"
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-white">
                            {formatPKR(item.total || 0)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeLineItem(item.id)}
                              className="text-[#6b7280] hover:text-[#ef4444]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculations Summary in PKR */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-1.5 p-3 rounded-xl bg-[#16201b] border border-[#223328]">
                  <div className="flex justify-between text-[#9ca3af]">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#9ca3af]">
                    <span>Tax Rate (%):</span>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-14 bg-[#121915] border border-[#223328] rounded px-1.5 py-0.5 text-right font-mono text-white outline-none"
                    />
                  </div>
                  <div className="flex justify-between text-[#9ca3af]">
                    <span>Tax Amount:</span>
                    <span className="font-mono text-white">{formatPKR(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-[#223328] font-bold text-sm">
                    <span className="text-white">Total Amount:</span>
                    <span className="text-[#2dd4bf] font-mono">{formatPKR(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Notes / Instructions</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl p-2.5 text-white outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Terms & Conditions</label>
                  <textarea
                    rows={2}
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl p-2.5 text-white outline-none resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1b2620]">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-[#9ca3af] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDocument('draft')}
                  className="px-4 py-2 rounded-xl bg-[#17241d] border border-[#263b2f] hover:border-[#2dd4bf] text-white font-bold"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDocument('sent')}
                  className="px-5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] font-black shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Issue & Mark Sent</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Document Preview & Print Modal ─────────────────────────────────── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121915] border border-[#223328] w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1b2620] mb-6">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase font-mono bg-[#2dd4bf]/20 text-[#2dd4bf]">
                  {previewDoc.docType}
                </span>
                <span className="font-mono text-xs text-[#9ca3af]">{previewDoc.docNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Exporting ${previewDoc.docNumber} as PDF...`)}
                  className="px-3 py-1.5 rounded-lg bg-[#18261e] border border-[#223328] hover:border-white text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-[#18261e] border border-[#223328] hover:border-white text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-[#9ca3af] hover:text-white p-1 rounded-lg hover:bg-[#1a2620] transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Formal Sheet (White Paper Preview Effect) */}
            <div className="bg-white text-gray-900 rounded-xl p-8 shadow-inner space-y-6 text-xs">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-200 pb-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-gray-950">OMNYSYNC ERP</h2>
                  <p className="text-gray-500 text-[11px] mt-0.5">Enterprise Cloud Financial & Operations Suite</p>
                  <p className="text-gray-500 text-[11px]">Tech Park Lahore / Clifton Karachi, Pakistan</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-black uppercase text-gray-900 tracking-wider">
                    {previewDoc.docType === 'invoice'
                      ? 'TAX INVOICE'
                      : previewDoc.docType === 'receipt'
                      ? 'OFFICIAL PAYMENT RECEIPT'
                      : previewDoc.docType === 'sow'
                      ? 'STATEMENT OF WORK'
                      : previewDoc.docType.toUpperCase()}
                  </h3>
                  <p className="font-mono text-gray-600 font-bold mt-1">#{previewDoc.docNumber}</p>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-800">
                    Status: {previewDoc.status}
                  </span>
                </div>
              </div>

              {/* Billed To & Dates */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Issued To
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{previewDoc.clientName}</p>
                  <p className="text-gray-600">{previewDoc.clientEmail}</p>
                  <p className="text-gray-600">{previewDoc.clientAddress}</p>
                </div>

                <div className="text-right space-y-1">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Issue Date:</span>
                    <span className="font-mono font-semibold ml-2 text-gray-800">{previewDoc.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Due / Valid Date:</span>
                    <span className="font-mono font-semibold ml-2 text-gray-800">{previewDoc.dueDate}</span>
                  </div>
                  {previewDoc.projectName && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project:</span>
                      <span className="font-semibold ml-2 text-gray-800">{previewDoc.projectName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Line Items */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold text-[11px]">
                    <tr>
                      <th className="p-3">Deliverable / Description</th>
                      <th className="p-3 w-16 text-center">Qty</th>
                      <th className="p-3 w-32 text-right">Rate (PKR)</th>
                      <th className="p-3 w-32 text-right">Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewDoc.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3 font-medium text-gray-900">{item.description}</td>
                        <td className="p-3 text-center text-gray-600">{item.qty}</td>
                        <td className="p-3 text-right font-mono text-gray-600">{formatPKR(item.unitPrice)}</td>
                        <td className="p-3 text-right font-mono font-bold text-gray-900">{formatPKR(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation Block in PKR */}
              <div className="flex justify-end">
                <div className="w-72 space-y-1 text-right">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">{formatPKR(previewDoc.subtotal)}</span>
                  </div>
                  {previewDoc.taxAmount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax ({previewDoc.taxRate}%):</span>
                      <span className="font-mono">{formatPKR(previewDoc.taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-gray-950 pt-2 border-t border-gray-200">
                    <span>Total Amount:</span>
                    <span className="font-mono text-[#0f766e]">{formatPKR(previewDoc.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Notes & Authorized Sign-off */}
              <div className="pt-6 border-t border-gray-200 grid grid-cols-2 gap-6 text-[11px] text-gray-600">
                <div>
                  <p className="font-bold text-gray-800">Notes & Terms:</p>
                  <p className="mt-0.5">{previewDoc.notes || previewDoc.terms}</p>
                </div>
                <div className="text-right flex flex-col justify-end items-end">
                  <div className="w-40 border-b border-gray-400 pb-1 text-center font-mono text-gray-700 text-xs">
                    Omnysync Authorized
                  </div>
                  <span className="text-[10px] text-gray-400 mt-0.5">Managing Director & Finance Lead</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
