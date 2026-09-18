'use client';

import React, { useState } from 'react';
import {
  Laptop,
  Headphones,
  Watch,
  Coffee,
  Briefcase,
  ChevronDown
} from 'lucide-react';
import { ProductItem } from '@/data/dashboardData';

interface TopProductsTableProps {
  products: ProductItem[];
}

export default function TopProductsTable({ products }: TopProductsTableProps) {
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
    <div className="bg-[#121815] border border-[#1b2620] rounded-xl p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white tracking-tight">Top Products</h2>
        <button
          onClick={() => setPeriod(period === 'This Month' ? 'Last Month' : 'This Month')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16201b] border border-[#223328] text-xs text-[#9ca3af] hover:text-white transition-colors"
        >
          <span>{period}</span>
          <ChevronDown className="w-3 h-3 text-[#6b7280]" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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
              <tr key={p.id} className="hover:bg-[#16201b]/50 group transition-colors">
                <td className="py-2.5 text-[#6b7280] font-medium">{p.id}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-[#18231d] border border-[#223328] flex items-center justify-center">
                      {getProductIcon(p.categoryIcon)}
                    </span>
                    <span className="font-medium text-white group-hover:text-[#00e676] transition-colors truncate max-w-[120px] sm:max-w-none">
                      {p.name}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 text-right text-[#9ca3af] font-medium">
                  {p.sold}
                </td>
                <td className="py-2.5 text-right font-semibold text-white">
                  {p.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
