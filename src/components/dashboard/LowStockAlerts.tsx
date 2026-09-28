'use client';

import React from 'react';
import {
  Mouse,
  Shirt,
  Armchair,
  BookOpen,
  HardDrive,
  AlertTriangle
} from 'lucide-react';
import { StockAlert } from '@/data/dashboardData';
import FolderCard from '@/components/common/FolderCard';

interface LowStockAlertsProps {
  alerts: StockAlert[];
  onViewAll?: () => void;
  onOrderRestock?: (product: string) => void;
}

export default function LowStockAlerts({
  alerts,
  onViewAll,
  onOrderRestock,
}: LowStockAlertsProps) {
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
    <FolderCard
      onOpenDetail={onViewAll}
      themeColor="orange"
      buttonSize="md"
      minHeight="min-h-[300px]"
      actionTooltip="Create Restock Purchase Order"
      avatar={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#2a1b14] border border-[#3d261d] flex items-center justify-center text-[#f97316] shadow-sm">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Low Stock Alerts</h2>
            <p className="text-[11px] text-[#9ca3af]">Critical threshold triggers</p>
          </div>
        </div>
      }
      badge={
        <span className="px-2.5 py-1 rounded-full bg-[#2e1818] border border-[#482525] text-xs font-bold text-[#f87171]">
          {alerts.length} Action Needed
        </span>
      }
    >
      {/* Table */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#6b7280] border-b border-[#1b2620] pb-2">
              <th className="font-medium pb-2">Product</th>
              <th className="font-medium pb-2 text-center">Stock</th>
              <th className="font-medium pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#17221c]">
            {alerts.map((item) => (
              <tr
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOrderRestock) onOrderRestock(item.product);
                  else onViewAll?.();
                }}
                className="hover:bg-[#16201b]/70 group transition-colors cursor-pointer"
              >
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-[#18231d] border border-[#223328] flex items-center justify-center">
                      {getItemIcon(item.icon)}
                    </span>
                    <span className="font-semibold text-white group-hover:text-[#f97316] transition-colors truncate max-w-[120px] sm:max-w-none">
                      {item.product}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 text-center text-[#d1d5db] font-bold">
                  {item.currentStock}
                </td>
                <td className="py-2.5 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
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
    </FolderCard>
  );
}
