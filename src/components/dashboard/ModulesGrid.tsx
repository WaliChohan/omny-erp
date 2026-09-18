'use client';

import React from 'react';
import {
  ShoppingCart,
  Package,
  Truck,
  UserCheck,
  User,
  Coins,
  BarChart3,
  Settings,
  ChevronRight
} from 'lucide-react';
import { ModuleItem } from '@/data/dashboardData';

interface ModulesGridProps {
  modules: ModuleItem[];
  onSelectModule?: (moduleId: string) => void;
}

export default function ModulesGrid({ modules, onSelectModule }: ModulesGridProps) {
  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'cart':
        return <ShoppingCart className="w-4 h-4 text-[#00e676]" />;
      case 'package':
        return <Package className="w-4 h-4 text-[#38bdf8]" />;
      case 'truck':
        return <Truck className="w-4 h-4 text-[#fbbf24]" />;
      case 'user-check':
        return <UserCheck className="w-4 h-4 text-[#f472b6]" />;
      case 'user':
        return <User className="w-4 h-4 text-[#60a5fa]" />;
      case 'dollar':
        return <Coins className="w-4 h-4 text-[#facc15]" />;
      case 'chart':
        return <BarChart3 className="w-4 h-4 text-[#2dd4bf]" />;
      case 'settings':
        return <Settings className="w-4 h-4 text-[#94a3b8]" />;
      default:
        return <ShoppingCart className="w-4 h-4 text-[#00e676]" />;
    }
  };

  const getModuleIconBg = (iconName: string) => {
    switch (iconName) {
      case 'cart':
        return 'bg-[#152e20] border-[#1d4831]';
      case 'package':
        return 'bg-[#132c38] border-[#1b4356]';
      case 'truck':
        return 'bg-[#332b17] border-[#4e401f]';
      case 'user-check':
        return 'bg-[#341829] border-[#52213e]';
      case 'user':
        return 'bg-[#14283d] border-[#1d3d5f]';
      case 'dollar':
        return 'bg-[#332e14] border-[#53491c]';
      case 'chart':
        return 'bg-[#132d2c] border-[#1c4745]';
      case 'settings':
        return 'bg-[#1e252a] border-[#2f3940]';
      default:
        return 'bg-[#152e20] border-[#1d4831]';
    }
  };

  return (
    <div className="bg-[#121815] border border-[#1b2620] rounded-xl p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white tracking-tight">Modules</h2>
        <button className="px-2.5 py-1 rounded-md bg-[#16201b] border border-[#223328] text-xs font-medium text-[#9ca3af] hover:text-white hover:border-[#2f4a39] transition-colors">
          Quick Access
        </button>
      </div>

      {/* 2x4 Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {modules.map((mod) => (
          <div
            key={mod.id}
            onClick={() => onSelectModule?.(mod.id)}
            className="flex items-center justify-between p-3 rounded-lg bg-[#141b17] border border-[#1d2922] hover:border-[#2b4033] hover:bg-[#18231d] cursor-pointer transition-all duration-150 group"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${getModuleIconBg(
                  mod.icon
                )}`}
              >
                {getModuleIcon(mod.icon)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate group-hover:text-[#00e676] transition-colors">
                  {mod.name}
                </p>
                <p className="text-[11px] text-[#6b7280] truncate mt-0.5">
                  {mod.badge}
                </p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#4b5563] group-hover:text-[#9ca3af] transition-transform group-hover:translate-x-0.5 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
