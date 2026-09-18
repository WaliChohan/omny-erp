'use client';

import React from 'react';
import {
  Mouse,
  Shirt,
  Armchair,
  BookOpen,
  HardDrive
} from 'lucide-react';
import { StockAlert } from '@/data/dashboardData';

interface LowStockAlertsProps {
  alerts: StockAlert[];
}

export default function LowStockAlerts({ alerts }: LowStockAlertsProps) {
  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'mouse':
        return <Mouse className="w-3.5 h-3.5 text-[#9ca3af]" />;
      case 'shirt':
        return <Shirt className="w-3.5 h-3.5 text-[#9ca3af]" />;
      case 'chair':
        return <Armchair className="w-3.5 h-3.5 text-[#9ca3af]" />;
      case 'book':
        return <BookOpen className="w-3.5 h-3.5 text-[#9ca3af]" />;
      case 'usb':
        return <HardDrive className="w-3.5 h-3.5 text-[#9ca3af]" />;
      default:
        return <Mouse className="w-3.5 h-3.5 text-[#9ca3af]" />;
    }
  };

  return (
    <div className="bg-[#121815] border border-[#1b2620] rounded-xl p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white tracking-tight">Low Stock Alerts</h2>
        <button className="text-xs text-[#00e676] hover:underline font-medium">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#6b7280] border-b border-[#1b2620] pb-2">
              <th className="font-medium pb-2">Product</th>
              <th className="font-medium pb-2 text-center">Current Stock</th>
              <th className="font-medium pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#17221c]">
            {alerts.map((item) => (
              <tr key={item.id} className="hover:bg-[#16201b]/50 group transition-colors">
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-[#18231d] border border-[#223328] flex items-center justify-center">
                      {getItemIcon(item.icon)}
                    </span>
                    <span className="font-medium text-white group-hover:text-[#00e676] transition-colors truncate max-w-[120px] sm:max-w-none">
                      {item.product}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 text-center text-[#d1d5db] font-semibold">
                  {item.currentStock}
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                      item.status === 'Critical'
                        ? 'bg-[#431414] text-[#f87171] border border-[#6b2222]'
                        : 'bg-[#331b1b] text-[#ef4444] border border-[#4d2424]'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
