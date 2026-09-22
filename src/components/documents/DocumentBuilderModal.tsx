'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Eye, Download, CheckCircle, FileText, Sparkles, Building2 } from 'lucide-react';
import { ERPDocument, DocumentItem, DocumentType, DocumentSubtype } from '@/types/documentEngine';
import { useDocumentStore } from '@/context/DocumentContext';
import DocumentLayout from './templates/DocumentLayout';
import { exportDocumentToPDF } from './pdf/pdfExporter';

interface DocumentBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocument?: ERPDocument | null;
}

export default function DocumentBuilderModal({
  isOpen,
  onClose,
  initialDocument,
}: DocumentBuilderModalProps) {
  const { createDocument, updateDocument } = useDocumentStore();

  const [type, setType] = useState<DocumentType>(initialDocument?.type || 'invoice');
  const [subtype, setSubtype] = useState<DocumentSubtype>(initialDocument?.subtype || 'standard');
  const [clientCompany, setClientCompany] = useState(initialDocument?.clientCompany || 'Pakistan Chiller House');
  const [clientName, setClientName] = useState(initialDocument?.clientName || 'Operation Manager');
  const [clientEmail, setClientEmail] = useState(initialDocument?.clientEmail || 'procurement@pakistanchillerhouse.com');
  const [clientPhone, setClientPhone] = useState(initialDocument?.clientPhone || '+92 300 8459102');
  const [clientAddress, setClientAddress] = useState(
    initialDocument?.clientAddress || 'Plot 45, Industrial Zone Sector I-9, Islamabad'
  );
  const [clientTaxId, setClientTaxId] = useState(initialDocument?.clientTaxId || 'PK-NTN-8849201');

  const [issueDate, setIssueDate] = useState(
    initialDocument?.issueDate || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    initialDocument?.dueDate ||
      new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [currency, setCurrency] = useState<'USD' | 'PKR' | 'GBP' | 'EUR'>(
    initialDocument?.currency || 'PKR'
  );

  const [notes, setNotes] = useState(initialDocument?.notes || 'Thank you for choosing OmnySync ERP solutions.');
  const [terms, setTerms] = useState(
    initialDocument?.terms || 'Payment terms: 30 days net. 1.5% late interest per month.'
  );

  const [proposalHeadline, setProposalHeadline] = useState(
    initialDocument?.proposalHeadline || 'Where Your Stock, Rentals & Warehouses Are Actually Leaking Money'
  );
  const [proposalSubhead, setProposalSubhead] = useState(
    initialDocument?.proposalSubhead || 'HVAC Equipment Supply, Rental & Servicing UK Import / Multi-City Pakistan'
  );

  // Line items
  const [items, setItems] = useState<DocumentItem[]>(
    initialDocument?.items || [
      {
        id: 'item-1',
        itemType: 'product',
        skuOrCode: 'UK-CHILLER-50T',
        description: 'Refurbished Carrier 50-Ton Industrial Water Chiller (UK Import)',
        quantity: 1,
        unitName: 'Unit',
        unitPrice: 6500000,
        taxRate: 16,
        discount: 0,
        totalPrice: 6500000,
      },
    ]
  );

  const [taxRate, setTaxRate] = useState<number>(initialDocument?.taxRate || 16);
  const [discountAmount, setDiscountAmount] = useState<number>(initialDocument?.discountAmount || 0);

  if (!isOpen) return null;

  // Auto Calculations
  const subtotal = items.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount - discountAmount;

  // Item Handlers
  const handleAddItem = () => {
    const newItem: DocumentItem = {
      id: `item-${Date.now()}`,
      itemType: 'service',
      skuOrCode: 'SERV-GENERAL',
      description: 'New Engineering & ERP Module Service Item',
      quantity: 1,
      unitName: 'Hours',
      unitPrice: 50000,
      taxRate: taxRate,
      discount: 0,
      totalPrice: 50000,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof DocumentItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      })
    );
  };

  const handleSave = () => {
    const prefixMap: Record<DocumentType, string> = {
      invoice: 'INV',
      receipt: 'REC',
      quotation: 'QT',
      proposal: 'PROP',
    };
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const docNumber = initialDocument?.docNumber || `${prefixMap[type]}-2026-${randomNum}`;

    const docPayload: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
      docNumber,
      type,
      subtype,
      status: initialDocument?.status || 'draft',
      clientCompany,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      clientTaxId,
      issueDate,
      dueDate,
      currency,
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      grandTotal,
      notes,
      terms,
      proposalHeadline: type === 'proposal' ? proposalHeadline : undefined,
      proposalSubhead: type === 'proposal' ? proposalSubhead : undefined,
      items,
      sections: initialDocument?.sections,
    };

    if (initialDocument) {
      updateDocument(initialDocument.id, docPayload);
    } else {
      createDocument(docPayload);
    }

    onClose();
  };

  const draftDocumentForPreview: ERPDocument = {
    id: initialDocument?.id || 'draft-preview',
    docNumber: initialDocument?.docNumber || 'PREVIEW-001',
    type,
    subtype,
    status: 'draft',
    clientCompany,
    clientName,
    clientEmail,
    clientPhone,
    clientAddress,
    clientTaxId,
    issueDate,
    dueDate,
    currency,
    subtotal,
    taxRate,
    taxAmount,
    discountAmount,
    grandTotal,
    notes,
    terms,
    proposalHeadline: type === 'proposal' ? proposalHeadline : undefined,
    proposalSubhead: type === 'proposal' ? proposalSubhead : undefined,
    items,
    sections: initialDocument?.sections,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-[#0e1411] border border-[#1e2a23] w-full max-w-7xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-[#1b2720] bg-[#121a16] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00e676]/20 border border-[#00e676]/40 flex items-center justify-center text-[#00e676]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {initialDocument ? 'Edit Document Builder' : 'Create Enterprise Document'}
              </h2>
              <p className="text-xs text-[#9ca3af]">
                Live WYSIWYG Editor with OmnySync Letterhead & Automated PDF Export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportDocumentToPDF(`OmnySync_${type}_${clientCompany}`)}
              className="px-3 py-1.5 rounded-xl bg-[#1a2820] hover:bg-[#23352b] text-white text-xs font-bold border border-[#2a3f33] flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-[#00e676]" />
              Export PDF
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-[#00e676] hover:bg-[#00c853] text-[#052e18] text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-[#00e676]/20 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Save Document
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1b2720] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Split Content Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Form Controls Panel (5 Cols) */}
          <div className="lg:col-span-5 border-r border-[#1b2720] bg-[#101713] p-5 overflow-y-auto space-y-5 text-xs text-[#f3f4f6]">
            {/* Document Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#9ca3af]">Document Type</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'invoice', label: 'Invoice' },
                  { id: 'receipt', label: 'Receipt' },
                  { id: 'quotation', label: 'Quote' },
                  { id: 'proposal', label: 'Proposal' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as DocumentType)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border text-center transition-all ${
                      type === t.id
                        ? 'bg-[#00e676]/15 border-[#00e676] text-[#00e676] shadow-sm'
                        : 'bg-[#15201a] border-[#223328] text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Information */}
            <div className="space-y-3 bg-[#131d17] p-4 rounded-xl border border-[#203025]">
              <div className="flex items-center gap-2 text-white font-bold pb-1 border-b border-[#1f2d24]">
                <Building2 className="w-4 h-4 text-[#00e676]" />
                Client & Entity Information
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#9ca3af] mb-1">Company Name</label>
                  <input
                    type="text"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00e676]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9ca3af] mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00e676]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#9ca3af] mb-1">Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00e676]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9ca3af] mb-1">Tax ID / NTN</label>
                  <input
                    type="text"
                    value={clientTaxId}
                    onChange={(e) => setClientTaxId(e.target.value)}
                    className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00e676]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#9ca3af] mb-1">Address</label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00e676]"
                />
              </div>
            </div>

            {/* Dates & Currency */}
            <div className="grid grid-cols-3 gap-3 bg-[#131d17] p-4 rounded-xl border border-[#203025]">
              <div>
                <label className="block text-[11px] text-[#9ca3af] mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2 py-1.5 text-white outline-none focus:border-[#00e676]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9ca3af] mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2 py-1.5 text-white outline-none focus:border-[#00e676]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9ca3af] mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2 py-1.5 text-white outline-none focus:border-[#00e676]"
                >
                  <option value="PKR">PKR (Rs.)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* Proposal Headline (if proposal) */}
            {type === 'proposal' && (
              <div className="space-y-3 bg-[#131d17] p-4 rounded-xl border border-[#203025]">
                <div className="text-white font-bold pb-1 border-b border-[#1f2d24]">
                  Proposal Cover Title
                </div>
                <div>
                  <label className="block text-[11px] text-[#9ca3af] mb-1">Headline</label>
                  <input
                    type="text"
                    value={proposalHeadline}
                    onChange={(e) => setProposalHeadline(e.target.value)}
                    className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00e676]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9ca3af] mb-1">Subhead</label>
                  <input
                    type="text"
                    value={proposalSubhead}
                    onChange={(e) => setProposalSubhead(e.target.value)}
                    className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00e676]"
                  />
                </div>
              </div>
            )}

            {/* Line Items List */}
            <div className="space-y-3 bg-[#131d17] p-4 rounded-xl border border-[#203025]">
              <div className="flex items-center justify-between pb-1 border-b border-[#1f2d24]">
                <span className="text-white font-bold">Line Items & Costs</span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-2 py-1 bg-[#00e676]/20 hover:bg-[#00e676]/30 text-[#00e676] rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Line Item
                </button>
              </div>

              {items.map((item, idx) => (
                <div key={item.id} className="p-3 bg-[#18241d] rounded-lg border border-[#26382c] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#00e676]">Item #{idx + 1}</span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-400 hover:text-red-300 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#9ca3af]">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      className="w-full bg-[#121c17] border border-[#203025] rounded px-2 py-1 text-white text-xs outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#9ca3af]">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-full bg-[#121c17] border border-[#203025] rounded px-2 py-1 text-white text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#9ca3af]">Unit Price</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                        className="w-full bg-[#121c17] border border-[#203025] rounded px-2 py-1 text-white text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#9ca3af]">Total</label>
                      <div className="px-2 py-1 text-xs font-bold text-white bg-[#121c17] rounded border border-[#203025]">
                        {item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-[#9ca3af]">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00e676]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9ca3af]">Discount Amount</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00e676]"
                  />
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="space-y-3 bg-[#131d17] p-4 rounded-xl border border-[#203025]">
              <div>
                <label className="block text-[11px] text-[#9ca3af] mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00e676]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#9ca3af] mb-1">Terms & Conditions</label>
                <textarea
                  rows={2}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full bg-[#18241d] border border-[#26382c] rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-[#00e676]"
                />
              </div>
            </div>
          </div>

          {/* Right Live Preview Panel (7 Cols) */}
          <div className="lg:col-span-7 bg-[#050806] p-6 overflow-y-auto flex flex-col items-center justify-start">
            <div className="w-full max-w-full space-y-2 mb-3 flex items-center justify-between text-xs text-[#9ca3af]">
              <span className="font-bold flex items-center gap-1 text-[#00e676]">
                <Eye className="w-4 h-4" /> Live Print-Ready A4 Preview
              </span>
              <span className="text-[10px]">Pixel-perfect OmnySync Letterhead rendering</span>
            </div>
            <div className="w-full max-w-[800px] overflow-hidden rounded-xl shadow-2xl">
              <DocumentLayout document={draftDocumentForPreview} isPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
