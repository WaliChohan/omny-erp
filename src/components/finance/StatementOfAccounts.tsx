'use client';

import React, { useState } from 'react';
import { Download, Calendar, Printer, FileText, User } from 'lucide-react';
import { STATEMENT_OF_ACCOUNTS_DATA, SOARow } from '@/data/financialData';

export default function StatementOfAccounts() {
  const [selectedEntity, setSelectedEntity] = useState('Acme Corporation');
  const [dateRange, setDateRange] = useState('March 2025');

  const closingBalance = STATEMENT_OF_ACCOUNTS_DATA[STATEMENT_OF_ACCOUNTS_DATA.length - 1].runningBalance;
  const totalBilled = STATEMENT_OF_ACCOUNTS_DATA.reduce((sum, r) => sum + r.debit, 0);
  const totalPaid = STATEMENT_OF_ACCOUNTS_DATA.reduce((sum, r) => sum + r.credit, 0);

  return (
    <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1b2620]">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Statement of Accounts (SOA)</h3>
          <p className="text-xs text-[#9ca3af]">
            Official customer and vendor ledger summary showing invoice charges, payments, and running balance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="bg-[#16201b] border border-[#223328] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#2dd4bf]"
          >
            <option value="Acme Corporation">Acme Corporation (Client)</option>
            <option value="TechGlobal Inc">TechGlobal Inc (Enterprise)</option>
            <option value="Amazon Web Services LLC">Amazon Web Services LLC (Vendor)</option>
          </select>

          <button
            onClick={() => alert(`Exported Statement of Accounts for ${selectedEntity}`)}
            className="px-3 py-1.5 rounded-lg bg-[#16201b] border border-[#223328] hover:border-[#2dd4bf] text-xs text-white flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#2dd4bf]" />
            <span>Export SOA</span>
          </button>
        </div>
      </div>

      {/* Account summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#152019] border border-[#1e2e24] p-3 rounded-xl">
          <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider">Total Debits (Billed)</span>
          <p className="text-lg font-black text-white mt-0.5">${totalBilled.toLocaleString()}</p>
        </div>
        <div className="bg-[#152019] border border-[#1e2e24] p-3 rounded-xl">
          <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider">Total Credits (Settled)</span>
          <p className="text-lg font-black text-[#10b981] mt-0.5">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-[#152019] border border-[#1e2e24] p-3 rounded-xl">
          <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider">Closing Outstanding Balance</span>
          <p className="text-lg font-black text-[#2dd4bf] mt-0.5">${closingBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* SOA Statement Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#6b7280] border-b border-[#1b2620] pb-2 font-semibold">
              <th className="pb-2.5">Date</th>
              <th className="pb-2.5">Reference / Voucher</th>
              <th className="pb-2.5">Transaction Description</th>
              <th className="pb-2.5 text-right">Debit ($)</th>
              <th className="pb-2.5 text-right">Credit ($)</th>
              <th className="pb-2.5 text-right">Running Balance ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#17221c]">
            {STATEMENT_OF_ACCOUNTS_DATA.map((row) => (
              <tr key={row.id} className="hover:bg-[#16201b]/60 transition-colors">
                <td className="py-2.5 font-mono text-[#9ca3af]">{row.date}</td>
                <td className="py-2.5 font-mono font-bold text-[#2dd4bf]">{row.refNo}</td>
                <td className="py-2.5 font-medium text-white">{row.description}</td>
                <td className="py-2.5 text-right font-mono font-semibold text-white">
                  {row.debit > 0 ? `$${row.debit.toLocaleString()}` : '-'}
                </td>
                <td className="py-2.5 text-right font-mono font-semibold text-[#10b981]">
                  {row.credit > 0 ? `$${row.credit.toLocaleString()}` : '-'}
                </td>
                <td className="py-2.5 text-right font-mono font-bold text-white">
                  ${row.runningBalance.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
