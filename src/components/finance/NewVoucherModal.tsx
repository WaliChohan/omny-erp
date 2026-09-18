'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoucherLine {
  id: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

interface NewVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoucherCreated: (voucher: any) => void;
}

const ACCOUNT_OPTIONS = [
  { code: '1111', name: 'Petty Cash - Main Office' },
  { code: '1112', name: 'JPMorgan Chase Operating A/C' },
  { code: '1121', name: 'Domestic Enterprise Clients' },
  { code: '2111', name: 'AWS & Cloud Deployment Creditors' },
  { code: '4111', name: 'Omnysync Enterprise SaaS Licenses' },
  { code: '4121', name: 'Custom ERP Implementation Fees' },
  { code: '5111', name: 'Hosting & Infrastructure Costs' },
  { code: '5121', name: 'Staff & Contractor Remuneration' },
];

export default function NewVoucherModal({
  isOpen,
  onClose,
  onVoucherCreated,
}: NewVoucherModalProps) {
  const [voucherType, setVoucherType] = useState('Journal Voucher');
  const [entityName, setEntityName] = useState('');
  const [voucherDate, setVoucherDate] = useState('2025-03-28');
  const [lines, setLines] = useState<VoucherLine[]>([
    {
      id: 'l-1',
      accountCode: '1112',
      accountName: 'JPMorgan Chase Operating A/C',
      description: 'Incoming client payment',
      debit: 5000,
      credit: 0,
    },
    {
      id: 'l-2',
      accountCode: '4111',
      accountName: 'Omnysync Enterprise SaaS Licenses',
      description: 'Revenue recognized for SaaS Plan',
      debit: 0,
      credit: 5000,
    },
  ]);

  if (!isOpen) return null;

  const totalDebit = lines.reduce((sum, l) => sum + Number(l.debit || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + Number(l.credit || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference < 0.001 && totalDebit > 0;

  const addLine = () => {
    setLines([
      ...lines,
      {
        id: `l-${Date.now()}`,
        accountCode: '1112',
        accountName: 'JPMorgan Chase Operating A/C',
        description: '',
        debit: 0,
        credit: 0,
      },
    ]);
  };

  const removeLine = (id: string) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((l) => l.id !== id));
  };

  const updateLine = (id: string, field: keyof VoucherLine, value: any) => {
    setLines(
      lines.map((l) => {
        if (l.id !== id) return l;
        if (field === 'accountCode') {
          const opt = ACCOUNT_OPTIONS.find((o) => o.code === value);
          return { ...l, accountCode: value, accountName: opt?.name || '' };
        }
        return { ...l, [field]: value };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    onVoucherCreated({
      voucherType,
      entityName,
      date: voucherDate,
      totalAmount: totalDebit,
      lines,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#121915] border border-[#223328] w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9ca3af] hover:text-white p-1 rounded-lg hover:bg-[#1a2620] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-white tracking-tight">Create Accounting Voucher</h3>
          <p className="text-xs text-[#9ca3af]">
            Double-entry posting. Debits and Credits must balance to zero discrepancy before posting.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Top metadata fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#d1d5db] font-medium mb-1">Voucher Type</label>
              <select
                value={voucherType}
                onChange={(e) => setVoucherType(e.target.value)}
                className="w-full bg-[#16201b] border border-[#223328] rounded-lg px-3 py-2 text-white outline-none focus:border-[#2dd4bf]"
              >
                <option value="Journal Voucher">Journal Voucher (JV)</option>
                <option value="Payment Voucher">Payment Voucher (PV)</option>
                <option value="Receipt Voucher">Receipt Voucher (RV)</option>
                <option value="Sales Voucher">Sales Voucher (SV)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#d1d5db] font-medium mb-1">Counterparty / Entity</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Corp, AWS, Vendor"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="w-full bg-[#16201b] border border-[#223328] rounded-lg px-3 py-2 text-white outline-none focus:border-[#2dd4bf]"
              />
            </div>

            <div>
              <label className="block text-[#d1d5db] font-medium mb-1">Posting Date</label>
              <input
                type="date"
                required
                value={voucherDate}
                onChange={(e) => setVoucherDate(e.target.value)}
                className="w-full bg-[#16201b] border border-[#223328] rounded-lg px-3 py-2 text-white outline-none focus:border-[#2dd4bf]"
              />
            </div>
          </div>

          {/* Line items table */}
          <div className="border border-[#1b2620] rounded-xl overflow-hidden">
            <div className="p-3 bg-[#16201b] flex items-center justify-between border-b border-[#1b2620]">
              <span className="font-bold text-white">Voucher Distribution Lines</span>
              <button
                type="button"
                onClick={addLine}
                className="px-2.5 py-1 rounded bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 text-[#2dd4bf] hover:bg-[#2dd4bf] hover:text-[#052e24] font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
              {lines.map((line) => (
                <div key={line.id} className="grid grid-cols-12 gap-2 items-center bg-[#141e18] p-2 rounded-lg border border-[#1e2d24]">
                  {/* Account Selector */}
                  <div className="col-span-4">
                    <select
                      value={line.accountCode}
                      onChange={(e) => updateLine(line.id, 'accountCode', e.target.value)}
                      className="w-full bg-[#16201b] border border-[#223328] rounded px-2 py-1.5 text-white outline-none"
                    >
                      {ACCOUNT_OPTIONS.map((acc) => (
                        <option key={acc.code} value={acc.code}>
                          {acc.code} - {acc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Line Description */}
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="Line remark..."
                      value={line.description}
                      onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                      className="w-full bg-[#16201b] border border-[#223328] rounded px-2 py-1.5 text-white outline-none"
                    />
                  </div>

                  {/* Debit */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Debit $"
                      value={line.debit || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        updateLine(line.id, 'debit', val);
                        if (val > 0) updateLine(line.id, 'credit', 0);
                      }}
                      className="w-full bg-[#16201b] border border-[#223328] rounded px-2 py-1.5 text-white text-right font-mono outline-none"
                    />
                  </div>

                  {/* Credit */}
                  <div className="col-span-2 flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Credit $"
                      value={line.credit || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        updateLine(line.id, 'credit', val);
                        if (val > 0) updateLine(line.id, 'debit', 0);
                      }}
                      className="w-full bg-[#16201b] border border-[#223328] rounded px-2 py-1.5 text-white text-right font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      disabled={lines.length <= 2}
                      className="text-[#6b7280] hover:text-[#ef4444] disabled:opacity-30 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals and Balance verification footer */}
            <div className="p-3 bg-[#141d18] border-t border-[#1b2620] flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#6b7280]">Total Debits: </span>
                  <span className="font-bold text-white">${totalDebit.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#6b7280]">Total Credits: </span>
                  <span className="font-bold text-white">${totalCredit.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isBalanced ? (
                  <span className="flex items-center gap-1 text-[#10b981] font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Balanced</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#ef4444] font-bold text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>Difference: ${difference.toFixed(2)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#16201b] border border-[#223328] text-[#9ca3af] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isBalanced}
              className="px-5 py-2 rounded-lg bg-[#2dd4bf] hover:bg-[#26b8a5] disabled:opacity-40 disabled:cursor-not-allowed text-[#052e24] font-bold shadow-md shadow-[#2dd4bf]/20 transition-all"
            >
              Post Voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
