'use client';

import React from 'react';
import {
  ShoppingCart,
  CreditCard,
  UserPlus,
  Package,
  CalendarCheck,
  ChevronRight
} from 'lucide-react';
import { ActivityItem } from '@/data/dashboardData';

interface RecentActivitiesProps {
  activities: ActivityItem[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-3.5 h-3.5 text-[#00e676]" />;
      case 'payment':
        return <CreditCard className="w-3.5 h-3.5 text-[#00e676]" />;
      case 'lead':
        return <UserPlus className="w-3.5 h-3.5 text-[#00e676]" />;
      case 'stock':
        return <Package className="w-3.5 h-3.5 text-[#00e676]" />;
      case 'hr':
        return <CalendarCheck className="w-3.5 h-3.5 text-[#00e676]" />;
      default:
        return <ShoppingCart className="w-3.5 h-3.5 text-[#00e676]" />;
    }
  };

  return (
    <div className="bg-[#121815] border border-[#1b2620] rounded-xl p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-sm font-semibold text-white tracking-tight">Recent Activities</h2>
        <button className="text-xs text-[#00e676] hover:underline font-medium">
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-3 flex-1 flex flex-col justify-around">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-1 group cursor-pointer hover:bg-[#16201b]/50 px-2 rounded-lg transition-colors -mx-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#162b1f] border border-[#1e442e] flex items-center justify-center shrink-0">
                {getActivityIcon(item.type)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate group-hover:text-[#00e676] transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-[#6b7280] truncate">
                  <span className="text-[#9ca3af]">{item.detail}</span> · {item.time}
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
