'use client';

import React from 'react';
import {
  FileText,
  CreditCard,
  UserPlus,
  Briefcase,
  Receipt,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { ActivityItem } from '@/data/dashboardData';
import FolderCard from '@/components/common/FolderCard';

interface RecentActivitiesProps {
  activities: ActivityItem[];
  onSelectActivity?: (type: string) => void;
  onViewAll?: () => void;
}

export default function RecentActivities({
  activities,
  onSelectActivity,
  onViewAll,
}: RecentActivitiesProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'proposal':
      case 'order':
        return <FileText className="w-3.5 h-3.5 text-[#00e676]" />;
      case 'payment':
      case 'invoice':
        return <CreditCard className="w-3.5 h-3.5 text-[#00e676]" />;
      case 'lead':
        return <UserPlus className="w-3.5 h-3.5 text-[#00e676]" />;
      case 'project':
        return <Briefcase className="w-3.5 h-3.5 text-[#00e676]" />;
      case 'stock':
      case 'hr':
        return <Receipt className="w-3.5 h-3.5 text-[#00e676]" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-[#00e676]" />;
    }
  };

  return (
    <FolderCard
      onOpenDetail={onViewAll}
      themeColor="green"
      buttonSize="md"
      minHeight="min-h-[300px]"
      actionTooltip="View agency activity"
      avatar={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#18261e] border border-[#23382c] flex items-center justify-center text-[#00e676] shadow-sm">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Recent Activities</h2>
            <p className="text-[11px] text-[#9ca3af]">Leads · projects · billing</p>
          </div>
        </div>
      }
    >
      <div className="space-y-2.5 pt-2 flex-1 flex flex-col justify-around">
        {activities.map((item) => (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectActivity?.(item.type);
            }}
            className="flex items-center justify-between p-2 rounded-xl bg-[#141d18]/60 hover:bg-[#19271f] border border-transparent hover:border-[#22382a] group cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#162b1f] border border-[#1e442e] flex items-center justify-center shrink-0">
                {getActivityIcon(item.type)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate group-hover:text-[#00e676] transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-[#6b7280] truncate">
                  <span className="text-[#9ca3af]">{item.detail}</span> · {item.time}
                </p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#4b5563] group-hover:text-[#00e676] transition-transform group-hover:translate-x-0.5 shrink-0" />
          </div>
        ))}
      </div>
    </FolderCard>
  );
}
