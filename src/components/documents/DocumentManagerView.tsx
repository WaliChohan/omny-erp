'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Copy,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
  Receipt,
  PenTool,
  Eye,
  Trash2,
  Building2,
  Sparkles,
  X,
} from 'lucide-react';
import { useDocumentStore } from '@/context/DocumentContext';
import { useAgency } from '@/context/AgencyContext';
import { ERPDocument, DocumentType, DocumentStatus } from '@/types/documentEngine';
import DocumentBuilderModal from './DocumentBuilderModal';
import DocumentLayout from './templates/DocumentLayout';
import { exportDocumentToPDF } from './pdf/pdfExporter';

export default function DocumentManagerView() {
  const { clients, projects, navigate } = useAgency();
  const {
    documents,
    activeDocument,
    setActiveDocument,
    deleteDocument,
    updateDocumentStatus,
    duplicateDocument,
    convertDocument,
    addSignatureToDocument,
  } = useDocumentStore();

  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  // Modals
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ERPDocument | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isESignModalOpen, setIsESignModalOpen] = useState(false);

  // E-Sign form state
  const [signerName, setSignerName] = useState('');
  const [signerTitle, setSignerTitle] = useState('');
  const [signerEmail, setSignerEmail] = useState('');

  // Filtered documents
  const filteredDocuments = documents.filter((doc) => {
    if (selectedType !== 'all' && doc.type !== selectedType) return false;
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    if (clientFilter !== 'all') {
      const c = clients.find((x) => x.id === clientFilter);
      if (doc.clientId !== clientFilter && doc.clientCompany !== c?.company) return false;
    }
    if (projectFilter !== 'all' && doc.projectId !== projectFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.docNumber.toLowerCase().includes(q) ||
        doc.clientCompany.toLowerCase().includes(q) ||
        doc.clientName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Metrics
  const totalInvoiced = documents
    .filter((d) => d.type === 'invoice' && d.status === 'paid')
    .reduce((acc, curr) => acc + curr.grandTotal, 0);

  const pendingQuotations = documents.filter(
    (d) => d.type === 'quotation' && d.status !== 'cancelled'
  ).length;

  const totalProposals = documents.filter((d) => d.type === 'proposal').length;
  const totalReceipts = documents.filter((d) => d.type === 'receipt').length;

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'paid':
      case 'accepted':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {status}
          </span>
        );
      case 'sent':
      case 'viewed':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/30">
            {status}
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
            {status}
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-slate-500/15 text-slate-400 border border-slate-500/30">
            {status}
          </span>
        );
    }
  };

  const handleOpenCreate = () => {
    setEditingDoc(null);
    setIsBuilderOpen(true);
  };

  const handleOpenEdit = (doc: ERPDocument) => {
    setEditingDoc(doc);
    setIsBuilderOpen(true);
  };

  const handleOpenPreview = (doc: ERPDocument) => {
    setActiveDocument(doc);
    setIsPreviewModalOpen(true);
  };

  const handleOpenESign = (doc: ERPDocument) => {
    setActiveDocument(doc);
    setSignerName(doc.clientName);
    setSignerTitle('Client Representative');
    setSignerEmail(doc.clientEmail);
    setIsESignModalOpen(true);
  };

  const handleSubmitESign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDocument) return;
    addSignatureToDocument(activeDocument.id, signerName, signerTitle, signerEmail);
    setIsESignModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-[#f3f4f6]">
      <div className="flex flex-wrap gap-2 mb-4">
        <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="bg-[#141d18] border border-[#223328] text-xs text-white rounded-lg px-2.5 py-1.5 outline-none">
          <option value="all">All clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.company}</option>
          ))}
        </select>
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="bg-[#141d18] border border-[#223328] text-xs text-white rounded-lg px-2.5 py-1.5 outline-none">
          <option value="all">All projects</option>
          {projects
            .filter((p) => clientFilter === 'all' || p.clientId === clientFilter)
            .map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
        </select>
        <button type="button" onClick={() => navigate({ tab: 'clients' })} className="text-[11px] font-bold text-[#2dd4bf]">Open clients</button>
      </div>

      {/* Top Title & Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Document Generation & Lifecycle Hub
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#00e676]/20 text-[#00e676] border border-[#00e676]/30">
              OmnySync Brand Engine
            </span>
          </div>
          <p className="text-xs text-[#9ca3af]">
            Create, preview, export, e-sign, and track Invoices, Receipts, Quotations, and Proposals
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#00e676] hover:bg-[#00c853] text-[#052e18] font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00e676]/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Document
        </button>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#121915] border border-[#223328] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-[#9ca3af] text-xs font-medium">
            <span>Total Invoiced (Paid)</span>
            <CheckCircle className="w-4 h-4 text-[#00e676]" />
          </div>
          <div className="text-xl font-extrabold text-white">
            Rs. {totalInvoiced.toLocaleString()}
          </div>
          <p className="text-[10px] text-[#9ca3af]">Verified General Ledger Receipts</p>
        </div>

        <div className="bg-[#121915] border border-[#223328] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-[#9ca3af] text-xs font-medium">
            <span>Active Quotations</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-extrabold text-white">{pendingQuotations} Quotes</div>
          <p className="text-[10px] text-sky-400">Ready for 1-click Invoice conversion</p>
        </div>

        <div className="bg-[#121915] border border-[#223328] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-[#9ca3af] text-xs font-medium">
            <span>Enterprise Proposals</span>
            <FileCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-extrabold text-white">{totalProposals} Proposals</div>
          <p className="text-[10px] text-indigo-400">Multi-section Scope & Cost tables</p>
        </div>

        <div className="bg-[#121915] border border-[#223328] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-[#9ca3af] text-xs font-medium">
            <span>Payment Vouchers / Receipts</span>
            <Receipt className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-extrabold text-white">{totalReceipts} Receipts</div>
          <p className="text-[10px] text-purple-400">Electronic e-signed audit vouchers</p>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#1b2620] pb-3">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Documents' },
            { id: 'invoice', label: 'Invoices' },
            { id: 'receipt', label: 'Receipts' },
            { id: 'quotation', label: 'Quotations' },
            { id: 'proposal', label: 'Proposals' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === t.id
                  ? 'bg-[#00e676] text-[#052e18] shadow-md shadow-[#00e676]/20'
                  : 'bg-[#141e18] text-[#9ca3af] hover:text-white hover:bg-[#19261f]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Search by doc #, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141e18] border border-[#223328] focus:border-[#00e676] text-xs text-white pl-9 pr-3 py-1.5 rounded-xl outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#141e18] border border-[#223328] text-xs text-white px-3 py-1.5 rounded-xl outline-none focus:border-[#00e676]"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted / Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Main Document Data Table */}
      <div className="bg-[#121915] border border-[#223328] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#17221c] text-[#9ca3af] font-bold uppercase tracking-wider text-[11px] border-b border-[#223328]">
              <tr>
                <th className="p-3.5">Document #</th>
                <th className="p-3.5">Client & Entity</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Issue Date</th>
                <th className="p-3.5">Grand Total</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2d24] text-slate-300 font-medium">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#9ca3af]">
                    No documents found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#16211a] transition-colors">
                    {/* Doc Number */}
                    <td className="p-3.5 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#00e676]" />
                        <span>{doc.docNumber}</span>
                        {doc.convertedFromType && (
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono"
                            title={`Converted from ${doc.convertedFromType}`}
                          >
                            from {doc.convertedFromType}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Client & Entity */}
                    <td className="p-3.5">
                      <div className="font-bold text-white">{doc.clientCompany || doc.clientName}</div>
                      <div className="text-[10px] text-[#9ca3af]">{doc.clientEmail}</div>
                    </td>

                    {/* Type */}
                    <td className="p-3.5">
                      <span className="capitalize font-bold text-slate-300">{doc.type}</span>
                    </td>

                    {/* Issue Date */}
                    <td className="p-3.5 font-mono text-[#9ca3af]">{doc.issueDate}</td>

                    {/* Grand Total */}
                    <td className="p-3.5 font-extrabold text-white">
                      {doc.currency} {doc.grandTotal.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="p-3.5">{getStatusBadge(doc.status)}</td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview */}
                        <button
                          onClick={() => handleOpenPreview(doc)}
                          className="p-1.5 rounded-lg bg-[#18241d] hover:bg-[#23352b] text-[#00e676] transition-colors"
                          title="View Live Letterhead Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Print / Export */}
                        <button
                          onClick={() => {
                            setActiveDocument(doc);
                            setTimeout(() => exportDocumentToPDF(`OmnySync_${doc.docNumber}`), 100);
                          }}
                          className="p-1.5 rounded-lg bg-[#18241d] hover:bg-[#23352b] text-sky-400 transition-colors"
                          title="Print / Export PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* E-Sign */}
                        {!doc.signature && (
                          <button
                            onClick={() => handleOpenESign(doc)}
                            className="p-1.5 rounded-lg bg-[#18241d] hover:bg-[#23352b] text-indigo-400 transition-colors"
                            title="Add Client E-Signature"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* 1-Click Converters */}
                        {doc.type === 'quotation' && (
                          <button
                            onClick={() => convertDocument(doc.id, 'invoice')}
                            className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold transition-colors flex items-center gap-1"
                            title="Convert Quotation to Invoice"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            To Invoice
                          </button>
                        )}

                        {doc.type === 'invoice' && (
                          <button
                            onClick={() => convertDocument(doc.id, 'receipt')}
                            className="px-2 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-[10px] font-bold transition-colors flex items-center gap-1"
                            title="Convert Invoice to Receipt"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            To Receipt
                          </button>
                        )}

                        {/* Duplicate */}
                        <button
                          onClick={() => duplicateDocument(doc.id)}
                          className="p-1.5 rounded-lg bg-[#18241d] hover:bg-[#23352b] text-slate-400 hover:text-white transition-colors"
                          title="Duplicate Document"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 rounded-lg bg-[#18241d] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Builder Modal */}
      <DocumentBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        initialDocument={editingDoc}
      />

      {/* Live Preview Fullscreen Modal */}
      {isPreviewModalOpen && activeDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#0e1411] border border-[#1e2a23] w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1b2720] bg-[#121a16] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-white">
                  Document Preview — #{activeDocument.docNumber}
                </span>
                {getStatusBadge(activeDocument.status)}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => exportDocumentToPDF(`OmnySync_${activeDocument.docNumber}`)}
                  className="px-4 py-1.5 rounded-xl bg-[#00e676] hover:bg-[#00c853] text-[#052e18] text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-[#00e676]/20 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1b2720] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#050806] p-6 overflow-y-auto flex items-center justify-center">
              <DocumentLayout document={activeDocument} />
            </div>
          </div>
        </div>
      )}

      {/* E-Sign Acceptance Modal */}
      {isESignModalOpen && activeDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121915] border border-[#223328] w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsESignModalOpen(false)}
              className="absolute top-4 right-4 text-[#9ca3af] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Record Digital Signature</h3>
                <p className="text-xs text-[#9ca3af]">Accept document #{activeDocument.docNumber}</p>
              </div>
            </div>

            <form onSubmit={handleSubmitESign} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#d1d5db] font-medium mb-1">Signer Name</label>
                <input
                  type="text"
                  required
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full bg-[#16201b] border border-[#223328] focus:border-[#00e676] rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[#d1d5db] font-medium mb-1">Title / Role</label>
                <input
                  type="text"
                  required
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  className="w-full bg-[#16201b] border border-[#223328] focus:border-[#00e676] rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[#d1d5db] font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={signerEmail}
                  onChange={(e) => setSignerEmail(e.target.value)}
                  className="w-full bg-[#16201b] border border-[#223328] focus:border-[#00e676] rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="p-3 bg-[#18241d] rounded-xl border border-[#26382c] text-[11px] text-[#9ca3af] space-y-1">
                <div className="text-white font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#00e676]" /> Cryptographic Verification
                </div>
                <p>Digital timestamp and client IP will be embedded on the document letterhead.</p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsESignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#16201b] text-white hover:bg-[#1f2e27]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00e676] hover:bg-[#00c853] text-[#052e18] font-extrabold flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Verify & E-Sign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
