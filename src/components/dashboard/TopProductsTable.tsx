'use client';

import React, { useState } from 'react';
import {
  Laptop,
  Headphones,
  Watch,
  Coffee,
  Briefcase,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';
import { ProductItem } from '@/data/dashboardData';
import FolderCard from '@/components/common/FolderCard';

interface TopProductsTableProps {
  products: ProductItem[];
  onViewAll?: () => void;
  onSelectProduct?: (productId: string | number) => void;
}

export default function TopProductsTable({
  products,
  onViewAll,
  onSelectProduct,
}: TopProductsTableProps) {
  const [period, setPeriod] = useState('This Month');

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'laptop':
        return <Laptop className="w-3.5 h-3.5 text-[#9ca3af]" />;
      case 'headphones':
        return <Headphones className="w-3.5 h-3.5 text-[#9ca3af]" />;
      case 'watch':
        return <Watch className="w-3.5 h-3.5 text-[#9ca3af]" />;
      case 'coffee':
        return <Coffee className="w-3.5 h-3.5 text-[#9ca3af]" />;
      case 'bag':
        return <Briefcase className="w-3.5 h-3.5 text-[#9ca3af]" />;
      default:
        return <Laptop className="w-3.5 h-3.5 text-[#9ca3af]" />;
    }
  };

  return (
    <FolderCard
      onOpenDetail={onViewAll}
      themeColor="green"
      buttonSize="md"
      minHeight="min-h-[300px]"
      actionTooltip="View Full Inventory Catalogue"
      avatar={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#18261e] border border-[#23382c] flex items-center justify-center text-[#00e676] shadow-sm">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Top Products</h2>
            <p className="text-[11px] text-[#9ca3af]">High volume catalog items</p>
          </div>
        </div>
      }
      badge={
        <div
          onClick={(e) => {
            e.stopPropagation();
            setPeriod(period === 'This Month' ? 'Last Month' : 'This Month');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#15241b] border border-[#203627] text-xs font-semibold text-[#9ca3af] hover:text-white cursor-pointer transition-colors"
        >
          <span>{period}</span>
          <ChevronDown className="w-3 h-3 text-[#6b7280]" />
        </div>
      }
    >
      {/* Table */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#6b7280] border-b border-[#1b2620] pb-2">
              <th className="font-medium pb-2 w-6">#</th>
              <th className="font-medium pb-2">Product</th>
              <th className="font-medium pb-2 text-right">Sold</th>
              <th className="font-medium pb-2 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#17221c]">
            {products.map((p) => (
              <tr
                key={p.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectProduct) onSelectProduct(p.id);
                  else onViewAll?.();
                }}
                className="hover:bg-[#16201b]/70 group transition-colors cursor-pointer"
              >
                <td className="py-2.5 text-[#6b7280] font-medium">{p.id}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-[#18231d] border border-[#223328] flex items-center justify-center">
                      {getProductIcon(p.categoryIcon)}
                    </span>
                    <span className="font-semibold text-white group-hover:text-[#00e676] transition-colors truncate max-w-[120px] sm:max-w-none">
                      {p.name}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 text-right text-[#9ca3af] font-medium">
                  {p.sold}
                </td>
                <td className="py-2.5 text-right font-bold text-white">
                  {p.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FolderCard>
  );
}
