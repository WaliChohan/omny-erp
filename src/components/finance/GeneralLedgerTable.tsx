'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  AlertCircle,
  FileText,
  Search,
  Download,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { formatPKR } from '@/data/financialData';
import { useFinanceStore } from '@/context/FinanceContext';

export default function GeneralLedgerTable() {
  const { ledgerEntries } = useFinanceStore();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    return ledgerEntries.filter((entry) => {
      const matchType = filterType === 'ALL' || entry.voucherType === filterType;
      const matchSearch =
        !searchQuery ||
        entry.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.accountCode.includes(searchQuery) ||
        entry.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [ledgerEntries, filterType, searchQuery]);

  // Compute total debits and credits
  const totalDebit = filteredEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = filteredEntries.reduce((sum, e) => sum + e.credit, 0);
  const isBalanced = totalDebit === totalCredit;

  return (
    <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-5 space-y-4">
      {/* Header with Balance verification banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#1b2620]">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Double-Entry General Ledger (PKR)</h3>
          <p className="text-xs text-[#9ca3af]">
            Real-time multi-account transaction postings with automatic debit/credit verification in Pakistani Rupees
          </p>
        </div>

        {/* Balance Status Badge */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold ${
            isBalanced
              ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30'
              : 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30'
          }`}
        >
          {isBalanced ? (
            <CheckCircle className="w-4 h-4 text-[#10b981]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#ef4444]" />
          )}
          <span>
            {isBalanced ? 'BALANCED: Debits = Credits' : 'UNBALANCED: Discrepancy detected'}
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-[#16201b] p-1 rounded-lg border border-[#223328] text-xs">
          {['ALL', 'JV', 'PV', 'RV', 'SV'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterType === type ? 'bg-[#2dd4bf] text-[#052e24] font-bold' : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              {type === 'ALL' ? 'All Vouchers' : type}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#6b7280] absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter by account, voucher #, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#16201b] border border-[#223328] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#6b7280] outline-none focus:border-[#2dd4bf] w-64"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#6b7280] border-b border-[#1b2620] pb-2 font-semibold">
              <th className="pb-2.5">Date</th>
              <th className="pb-2.5">Voucher #</th>
              <th className="pb-2.5">Acc. Code</th>
              <th className="pb-2.5">Account Title</th>
              <th className="pb-2.5">Description</th>
              <th className="pb-2.5 text-right">Debit (Rs.)</th>
              <th className="pb-2.5 text-right">Credit (Rs.)</th>
              <th className="pb-2.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#17221c]">
            {filteredEntries.map((row) => (
              <tr key={row.id} className="hover:bg-[#16201b]/60 transition-colors">
                <td className="py-2.5 text-[#9ca3af] font-mono whitespace-nowrap">{row.date}</td>
                <td className="py-2.5 whitespace-nowrap">
                  <span className="font-mono font-bold text-[#2dd4bf] bg-[#2dd4bf]/10 px-2 py-0.5 rounded border border-[#2dd4bf]/20">
                    {row.voucherNo}
                  </span>
                </td>
                <td className="py-2.5 font-mono text-[#d1d5db] font-semibold">{row.accountCode}</td>
                <td className="py-2.5 font-medium text-white max-w-[200px] truncate">{row.accountName}</td>
                <td className="py-2.5 text-[#9ca3af] max-w-[260px] truncate">{row.description}</td>
                <td className="py-2.5 text-right font-mono font-semibold text-white whitespace-nowrap">
                  {row.debit > 0 ? formatPKR(row.debit) : '—'}
                </td>
                <td className="py-2.5 text-right font-mono font-semibold text-white whitespace-nowrap">
                  {row.credit > 0 ? formatPKR(row.credit) : '—'}
                </td>
                <td className="py-2.5 text-center whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#16291f] text-[#10b981] border border-[#224832]">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#203126] font-bold text-xs bg-[#141e18]">
              <td colSpan={5} className="py-3 px-2 text-right uppercase tracking-wider text-[#9ca3af]">
                Total Sum:
              </td>
              <td className="py-3 text-right font-mono text-[#2dd4bf] text-sm font-black whitespace-nowrap">
                {formatPKR(totalDebit)}
              </td>
              <td className="py-3 text-right font-mono text-[#2dd4bf] text-sm font-black whitespace-nowrap">
                {formatPKR(totalCredit)}
              </td>
              <td className="py-3 text-center">
                <span className="text-[10px] text-[#10b981] font-mono font-bold">BALANCED</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
