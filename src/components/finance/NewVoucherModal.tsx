'use client';

import React, { useState } from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import { Plus, Trash2, CheckCircle2, AlertCircle, Landmark } from 'lucide-react';
import { formatPKR } from '@/data/financialData';
import { useFinanceStore } from '@/context/FinanceContext';

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
  onVoucherCreated?: (voucher: any) => void;
}

const ACCOUNT_OPTIONS = [
  { code: '1111', name: 'Petty Cash - Lahore Office (PKR)' },
  { code: '1112', name: 'Meezan Bank Operating A/C #0289' },
  { code: '1113', name: 'HBL Corporate Payroll A/C #9102' },
  { code: '1114', name: 'Standard Chartered Treasury Reserve' },
  { code: '1121', name: 'Domestic Enterprise Clients Receivable' },
  { code: '1122', name: 'Export & Foreign Clients Receivable' },
  { code: '2111', name: 'AWS & Cloud Subscriptions Payable' },
  { code: '2121', name: 'Staff Salaries & Wages Accrued' },
  { code: '2122', name: 'FBR Withholding Tax (WHT) Payable' },
  { code: '3111', name: 'Founders Paid-Up Share Capital' },
  { code: '3112', name: 'Retained Earnings' },
  { code: '4111', name: 'Enterprise Monthly Retainers & MRR' },
  { code: '4121', name: 'Project Milestones & SOW Custom Dev' },
  { code: '5111', name: 'Software Engineers & Designers Payroll' },
  { code: '5112', name: 'Founder Executive Salaries' },
  { code: '5121', name: 'Founders Profit Equity Withdrawals' },
  { code: '5131', name: 'AWS Cloud & OpenAI API Credits' },
  { code: '5132', name: 'GitHub, Figma, Cursor & Tools' },
  { code: '5141', name: 'Office Lease & Optical Fiber Internet' },
];

export default function NewVoucherModal({
  isOpen,
  onClose,
  onVoucherCreated,
}: NewVoucherModalProps) {
  const { addVoucher } = useFinanceStore();
  const [voucherType, setVoucherType] = useState<'Journal Voucher' | 'Payment Voucher' | 'Receipt Voucher' | 'Sales Voucher'>('Journal Voucher');
  const [entityName, setEntityName] = useState('');
  const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split('T')[0]);
  const [lines, setLines] = useState<VoucherLine[]>([
    {
      id: 'l-1',
      accountCode: '1112',
      accountName: 'Meezan Bank Operating A/C #0289',
      description: 'Incoming client payment / settlement',
      debit: 500000,
      credit: 0,
    },
    {
      id: 'l-2',
      accountCode: '4111',
      accountName: 'Enterprise Monthly Retainers & MRR',
      description: 'Revenue recognized for Monthly Plan',
      debit: 0,
      credit: 500000,
    },
  ]);

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
        accountName: 'Meezan Bank Operating A/C #0289',
        description: '',
        debit: 0,
        credit: 0,
      },
    ]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 2) {
      setLines(lines.filter((l) => l.id !== id));
    }
  };

  const updateLine = (id: string, field: keyof VoucherLine, val: any) => {
    setLines(
      lines.map((l) => {
        if (l.id !== id) return l;
        if (field === 'accountCode') {
          const acc = ACCOUNT_OPTIONS.find((a) => a.code === val);
          return {
            ...l,
            accountCode: val,
            accountName: acc ? acc.name : l.accountName,
          };
        }
        return { ...l, [field]: val };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced || !entityName.trim()) return;

    const prefix =
      voucherType === 'Journal Voucher'
        ? 'JV'
        : voucherType === 'Payment Voucher'
        ? 'PV'
        : voucherType === 'Receipt Voucher'
        ? 'RV'
        : 'SV';

    const newVoucher = addVoucher(
      {
        voucherNo: `${prefix}-2025-${Math.floor(100 + Math.random() * 900)}`,
        type: voucherType,
        date: voucherDate,
        entityName,
        totalAmount: totalDebit,
        status: 'Approved',
        preparedBy: 'Financial Controller',
        linesCount: lines.length,
      },
      lines.map((l) => ({
        accountCode: l.accountCode,
        accountName: l.accountName,
        debit: l.debit,
        credit: l.credit,
        description: l.description || `${voucherType} for ${entityName}`,
      }))
    );

    if (onVoucherCreated) {
      onVoucherCreated(newVoucher);
    }
    onClose();
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-2xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf]">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Create & Post General Ledger Voucher (PKR)
            </h3>
            <p className="text-[11px] text-[#9ca3af]">
              Double-entry balanced posting engine with real-time audit verification
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {isBalanced ? (
              <span className="flex items-center gap-1 text-[#10b981] font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Balanced ({formatPKR(totalDebit)})</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[#ef4444] font-bold text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>Diff: {formatPKR(difference)}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#16201b] border border-[#223328] text-xs text-[#9ca3af] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isBalanced || !entityName.trim()}
              className="px-5 py-2 rounded-lg bg-[#2dd4bf] hover:bg-[#26b8a5] disabled:opacity-40 disabled:cursor-not-allowed text-[#052e24] text-xs font-bold shadow-md shadow-[#2dd4bf]/20 transition-all"
            >
              Post to Ledger
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Top voucher metadata row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[#d1d5db] font-medium mb-1">Voucher Type</label>
            <select
              value={voucherType}
              onChange={(e) => setVoucherType(e.target.value as any)}
              className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-lg px-3 py-2 text-white outline-none"
            >
              <option value="Journal Voucher">Journal Voucher (JV)</option>
              <option value="Payment Voucher">Payment Voucher (PV)</option>
              <option value="Receipt Voucher">Receipt Voucher (RV)</option>
              <option value="Sales Voucher">Sales Voucher (SV)</option>
            </select>
          </div>

          <div>
            <label className="block text-[#d1d5db] font-medium mb-1">Vendor / Client / Entity</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Corp, AWS, Staff Payroll"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-lg px-3 py-2 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[#d1d5db] font-medium mb-1">Posting Date</label>
            <input
              type="date"
              value={voucherDate}
              onChange={(e) => setVoucherDate(e.target.value)}
              className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-lg px-3 py-2 text-white font-mono outline-none"
            />
          </div>
        </div>

        {/* Dynamic line items table */}
        <div className="border border-[#1b2620] rounded-xl overflow-hidden bg-[#121915]">
          <div className="p-3 bg-[#16201b] border-b border-[#1b2620] flex items-center justify-between">
            <span className="font-bold text-white text-xs">Double-Entry Ledger Postings (PKR)</span>
            <button
              type="button"
              onClick={addLine}
              className="px-2.5 py-1 rounded bg-[#1e2d24] border border-[#2d4737] hover:border-[#2dd4bf] text-[#2dd4bf] text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Line</span>
            </button>
          </div>

          <div className="p-2 space-y-2">
            {lines.map((line) => (
              <div
                key={line.id}
                className="grid grid-cols-12 gap-2 items-center bg-[#141d18] p-2 rounded-lg border border-[#1e2a22]"
              >
                {/* Account selector */}
                <div className="col-span-5">
                  <select
                    value={line.accountCode}
                    onChange={(e) => updateLine(line.id, 'accountCode', e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] rounded px-2 py-1.5 text-white outline-none text-[11px]"
                  >
                    {ACCOUNT_OPTIONS.map((acc) => (
                      <option key={acc.code} value={acc.code}>
                        {acc.code} - {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Line Description */}
                <div className="col-span-3">
                  <input
                    type="text"
                    placeholder="Line remark..."
                    value={line.description}
                    onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] rounded px-2 py-1.5 text-white outline-none text-[11px]"
                  />
                </div>

                {/* Debit */}
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Debit Rs."
                    value={line.debit || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      updateLine(line.id, 'debit', val);
                      if (val > 0) updateLine(line.id, 'credit', 0);
                    }}
                    className="w-full bg-[#16201b] border border-[#223328] rounded px-2 py-1.5 text-white text-right font-mono outline-none text-[11px]"
                  />
                </div>

                {/* Credit */}
                <div className="col-span-2 flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Credit Rs."
                    value={line.credit || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      updateLine(line.id, 'credit', val);
                      if (val > 0) updateLine(line.id, 'debit', 0);
                    }}
                    className="w-full bg-[#16201b] border border-[#223328] rounded px-2 py-1.5 text-white text-right font-mono outline-none text-[11px]"
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

          {/* Totals footer */}
          <div className="p-3 bg-[#141d18] border-t border-[#1b2620] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[#6b7280]">Total Debits: </span>
              <span className="font-bold text-white">{formatPKR(totalDebit)}</span>
            </div>
            <div>
              <span className="text-[#6b7280]">Total Credits: </span>
              <span className="font-bold text-white">{formatPKR(totalCredit)}</span>
            </div>
          </div>
        </div>
      </form>
    </SideDrawer>
  );
}
