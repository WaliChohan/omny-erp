'use client';

import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  Eye,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight
} from 'lucide-react';
import { VOUCHERS_LIST, VoucherItem } from '@/data/financialData';

interface VoucherManagerProps {
  onOpenNewVoucher: () => void;
}

export default function VoucherManager({ onOpenNewVoucher }: VoucherManagerProps) {
  const [vouchers, setVouchers] = useState<VoucherItem[]>(VOUCHERS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(null);

  const filtered = vouchers.filter(
    (v) =>
      v.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: VoucherItem['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30';
      case 'Audited':
        return 'bg-[#818cf8]/20 text-[#818cf8] border-[#818cf8]/30';
      case 'Draft':
        return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1b2620]">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Voucher Management System</h3>
          <p className="text-xs text-[#9ca3af]">
            Journal Vouchers (JV), Payment Vouchers (PV), Receipt Vouchers (RV), Sales Vouchers (SV)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6b7280] absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search voucher #, counterparty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#16201b] border border-[#223328] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#6b7280] outline-none focus:border-[#2dd4bf] w-56"
            />
          </div>

          <button
            onClick={onOpenNewVoucher}
            className="px-3.5 py-1.5 rounded-lg bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-bold transition-all shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Create Voucher</span>
          </button>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#6b7280] border-b border-[#1b2620] pb-2 font-semibold">
              <th className="pb-2.5">Voucher No</th>
              <th className="pb-2.5">Type</th>
              <th className="pb-2.5">Date</th>
              <th className="pb-2.5">Counterparty</th>
              <th className="pb-2.5">Prepared By</th>
              <th className="pb-2.5 text-center">Lines</th>
              <th className="pb-2.5 text-right">Total Amount</th>
              <th className="pb-2.5 text-center">Status</th>
              <th className="pb-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#17221c]">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-[#16201b]/60 transition-colors">
                <td className="py-2.5 font-mono font-bold text-[#2dd4bf]">{v.voucherNo}</td>
                <td className="py-2.5 font-medium text-white">{v.type}</td>
                <td className="py-2.5 font-mono text-[#9ca3af]">{v.date}</td>
                <td className="py-2.5 text-[#d1d5db] font-semibold">{v.entityName}</td>
                <td className="py-2.5 text-[#9ca3af]">{v.preparedBy}</td>
                <td className="py-2.5 text-center text-[#9ca3af] font-mono">{v.linesCount}</td>
                <td className="py-2.5 text-right font-mono font-bold text-white">
                  ${v.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-2.5 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                      v.status
                    )}`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <button
                    onClick={() => setSelectedVoucher(v)}
                    className="p-1 rounded text-[#9ca3af] hover:text-[#2dd4bf] hover:bg-[#1b2721] transition-colors"
                    title="View Voucher Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Voucher Detail Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121915] border border-[#223328] w-full max-w-lg rounded-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2620]">
              <div>
                <span className="font-mono text-xs font-bold text-[#2dd4bf]">{selectedVoucher.voucherNo}</span>
                <h4 className="text-base font-bold text-white mt-0.5">{selectedVoucher.type}</h4>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedVoucher.status)}`}>
                {selectedVoucher.status}
              </span>
            </div>

            <div className="py-4 space-y-2.5 text-xs text-[#d1d5db]">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Counterparty / Entity:</span>
                <span className="font-bold text-white">{selectedVoucher.entityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Effective Posting Date:</span>
                <span className="font-mono text-white">{selectedVoucher.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Total Distributed Amount:</span>
                <span className="font-mono text-base font-black text-[#2dd4bf]">
                  ${selectedVoucher.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Audited By:</span>
                <span className="text-white">{selectedVoucher.preparedBy}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1b2620] flex items-center justify-between">
              <button
                onClick={() => alert(`Printing official voucher receipt: ${selectedVoucher.voucherNo}`)}
                className="px-3.5 py-1.5 rounded-lg bg-[#16201b] border border-[#223328] text-xs text-white hover:border-[#2dd4bf] flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-[#2dd4bf]" />
                <span>Print Voucher Slip</span>
              </button>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="px-4 py-1.5 rounded-lg bg-[#2dd4bf] text-[#052e24] text-xs font-bold hover:bg-[#26b8a5]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
