'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Search,
  Bell,
  MessageSquare,
  User,
  X
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDateClick?: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  return (
    <header className="h-16 bg-[#0d1310] border-b border-[#1a2620] px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left section: Back button & Date Pill */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          aria-label="Back"
          className="w-8 h-8 rounded-lg bg-[#141d18] border border-[#1e2d24] flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-[#1a2620] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141d18] border border-[#1e2d24] text-xs font-medium text-[#d1d5db]">
          <Calendar className="w-3.5 h-3.5 text-[#9ca3af]" />
          <span>28 March 2025</span>
        </div>
      </div>

      {/* Center section: Prominent Green Search Bar matching screenshot */}
      <div className="flex-1 max-w-2xl mx-2">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3.5 pointer-events-none text-[#0d1f14]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search anything... (orders, customers, products...)"
            className="w-full bg-[#00c853] hover:bg-[#00d85a] focus:bg-[#00e676] text-[#052e16] placeholder-[#064e26] font-medium text-xs md:text-sm pl-10 pr-9 py-2 rounded-full outline-none transition-all shadow-sm focus:ring-2 focus:ring-[#00e676]/40"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-[#052e16] hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right section: Notifications, Chat, Profile Avatar */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-full bg-[#141d18] border border-[#1e2d24] flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-[#1a2620] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4444] text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#0d1310]">
              3
            </span>
          </button>

          {showNotificationToast && (
            <div className="absolute right-0 mt-2 w-72 bg-[#141c18] border border-[#1e2d24] rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#1f2e25]">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="text-[10px] bg-[#00e676]/20 text-[#00e676] px-1.5 py-0.5 rounded">3 New</span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="text-[#d1d5db] hover:bg-[#19241e] p-1.5 rounded cursor-pointer">
                  <p className="font-medium text-white">High Priority Order #SO-1042</p>
                  <p className="text-[11px] text-[#9ca3af]">Awaiting fulfillment approval</p>
                </div>
                <div className="text-[#d1d5db] hover:bg-[#19241e] p-1.5 rounded cursor-pointer">
                  <p className="font-medium text-white">Low stock alert on Office Chairs</p>
                  <p className="text-[11px] text-[#ef4444]">Only 3 units remaining</p>
                </div>
                <div className="text-[#d1d5db] hover:bg-[#19241e] p-1.5 rounded cursor-pointer">
                  <p className="font-medium text-white">Leave request from Sarah Miller</p>
                  <p className="text-[11px] text-[#9ca3af]">Approved by HR manager</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          aria-label="Messages"
          className="w-8 h-8 rounded-full bg-[#141d18] border border-[#1e2d24] flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-[#1a2620] transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#1b2b22] border border-[#274032] flex items-center justify-center text-[#00e676] overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#00e676]/50 transition-all">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
