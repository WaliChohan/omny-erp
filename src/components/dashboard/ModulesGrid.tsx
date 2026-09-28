'use client';

import React from 'react';
import {
  UserCheck,
  Coins,
  BarChart3,
  Briefcase,
  Building2,
  FileText,
  ShieldCheck,
  CheckSquare,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { ModuleItem } from '@/data/dashboardData';
import FolderCard from '@/components/common/FolderCard';

interface ModulesGridProps {
  modules: ModuleItem[];
  onSelectModule?: (moduleId: string) => void;
}

export default function ModulesGrid({ modules, onSelectModule }: ModulesGridProps) {
  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'user-check':
        return <UserCheck className="w-4 h-4 text-[#f472b6]" />;
      case 'building':
        return <Building2 className="w-4 h-4 text-[#38bdf8]" />;
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-[#a78bfa]" />;
      case 'dollar':
        return <Coins className="w-4 h-4 text-[#facc15]" />;
      case 'file':
        return <FileText className="w-4 h-4 text-[#2dd4bf]" />;
      case 'shield':
        return <ShieldCheck className="w-4 h-4 text-[#34d399]" />;
      case 'chart':
        return <BarChart3 className="w-4 h-4 text-[#38bdf8]" />;
      case 'check':
        return <CheckSquare className="w-4 h-4 text-[#94a3b8]" />;
      default:
        return <Layers className="w-4 h-4 text-[#00e676]" />;
    }
  };

  const getModuleIconBg = (iconName: string) => {
    switch (iconName) {
      case 'user-check':
        return 'bg-[#341829] border-[#52213e]';
      case 'building':
        return 'bg-[#132c38] border-[#1b4356]';
      case 'briefcase':
        return 'bg-[#241833] border-[#3d2755]';
      case 'dollar':
        return 'bg-[#332e14] border-[#53491c]';
      case 'file':
        return 'bg-[#132d2c] border-[#1c4745]';
      case 'shield':
        return 'bg-[#152e20] border-[#1d4831]';
      case 'chart':
        return 'bg-[#132c38] border-[#1b4356]';
      case 'check':
        return 'bg-[#1e252a] border-[#2f3940]';
      default:
        return 'bg-[#152e20] border-[#1d4831]';
    }
  };

  return (
    <FolderCard
      onOpenDetail={() => onSelectModule?.('crm')}
      themeColor="green"
      buttonSize="md"
      minHeight="min-h-[300px]"
      actionTooltip="Open agency modules"
      avatar={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#18261e] border border-[#23382c] flex items-center justify-center text-[#00e676] shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Agency Modules</h2>
            <p className="text-[11px] text-[#9ca3af]">CRM · delivery · billing · portal</p>
          </div>
        </div>
      }
      badge={
        <span className="px-2.5 py-1 rounded-full bg-[#15241b] border border-[#203627] text-xs font-bold text-[#00e676]">
          {modules.length} Live
        </span>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3">
        {modules.map((mod) => (
          <div
            key={mod.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectModule?.(mod.id);
            }}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#141d18]/80 border border-[#1e2d24] hover:border-[#00e676]/50 hover:bg-[#18261e] cursor-pointer transition-all duration-150 group/item hover:scale-[1.02]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${getModuleIconBg(mod.icon)}`}>
                {getModuleIcon(mod.icon)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate group-hover/item:text-[#00e676] transition-colors">
                  {mod.name}
                </p>
                <p className="text-[10px] text-[#6b7280] truncate">{mod.badge}</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#4b5563] group-hover/item:text-[#00e676] transition-transform group-hover/item:translate-x-0.5 shrink-0" />
          </div>
        ))}
      </div>
    </FolderCard>
  );
}
