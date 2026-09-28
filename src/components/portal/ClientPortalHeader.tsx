'use client';

import React, { useState } from 'react';
import {
  Share2,
  Building2,
  ShieldCheck,
  Bell,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  CreditCard,
  User,
  X,
  CheckCircle,
} from 'lucide-react';
import { ClientProfile } from '@/data/portalData';
import { PortalModuleKey } from '@/data/portalAccounts';

interface ClientPortalHeaderProps {
  profile: ClientProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onPayBalance?: () => void;
  onBackToERP?: () => void;
  /** When set, only enabled portal modules render as tabs */
  modules?: Partial<Record<PortalModuleKey, boolean>>;
  onLogout?: () => void;
}

export default function ClientPortalHeader({
  profile,
  activeTab,
  onTabChange,
  onPayBalance,
  onBackToERP,
  modules,
  onLogout,
}: ClientPortalHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const moduleForTab: Record<string, PortalModuleKey | PortalModuleKey[]> = {
    overview: 'overview',
    invoices: 'invoices',
    projects: ['projects', 'milestones', 'docs', 'files'],
    support: ['tickets', 'messages'],
    activity: 'activity',
  };

  const isTabVisible = (id: string) => {
    if (!modules) return true;
    const keys = moduleForTab[id];
    if (!keys) return true;
    const list = Array.isArray(keys) ? keys : [keys];
    return list.some((k) => modules[k] !== false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Hub' },
    { id: 'invoices', label: 'Invoices & Billing' },
    { id: 'projects', label: 'Projects & Deliverables' },
    { id: 'support', label: 'Support & Messaging' },
  ].filter((t) => isTabVisible(t.id));

  return (
    <header className="bg-[#0a0f0d] border-b border-[#18261f] sticky top-0 z-40 select-none shadow-xl">
      {/* Upper Brand & Account Status Bar */}
      <div className="px-4 md:px-8 py-3 flex items-center justify-between border-b border-[#141e18] gap-4">
        {/* Left: Brand + Role Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('overview')}>
            <div className="w-8 h-8 rounded-lg bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf] shadow-sm shadow-[#2dd4bf]/20">
              <Share2 className="w-4 h-4 text-[#2dd4bf] transform rotate-90" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wider text-white">OMNYSYNC</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#b8ff00]/15 text-[#b8ff00] border border-[#b8ff00]/30">
                  Client Portal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Account Info Chip */}
        <div className="hidden lg:flex items-center gap-3 bg-[#111814] px-3.5 py-1.5 rounded-xl border border-[#1b2820]">
          <div className="flex items-center gap-2 text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#2dd4bf]" />
            <span className="font-semibold text-white">{profile.company}</span>
            <span className="text-[#6b7280]">({profile.accountNumber})</span>
          </div>
          <div className="h-3 w-px bg-[#1f2d24]" />
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#b8ff00]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{profile.tier} Tier</span>
          </div>
        </div>

        {/* Right: Balance Due + Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Outstanding balance indicator */}
          {profile.balanceDue > 0 && (
            <button
              onClick={onPayBalance}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a1714] border border-[#3b2a1a] hover:border-[#f59e0b] text-xs transition-all group"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#f59e0b]" />
              <div className="text-left">
                <span className="text-[10px] text-[#9ca3af] block leading-none">Due Balance</span>
                <span className="text-xs font-black text-[#f59e0b] group-hover:text-white">
                  ${profile.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className="text-[10px] bg-[#f59e0b] text-black font-bold px-1.5 py-0.5 rounded ml-1">
                Pay
              </span>
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-8 h-8 rounded-lg bg-[#141d18] border border-[#1e2d24] flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-[#1a2620] transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#2dd4bf] ring-2 ring-[#0a0f0d]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-[#121915] border border-[#1e2d24] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#1a2620]">
                  <span className="text-xs font-bold text-white">Client Alerts</span>
                  <span className="text-[10px] bg-[#2dd4bf]/20 text-[#2dd4bf] px-1.5 py-0.5 rounded font-semibold">2 New</span>
                </div>
                <div className="py-2 space-y-2 text-xs">
                  <div className="p-1.5 rounded hover:bg-[#19241e] cursor-pointer">
                    <p className="font-semibold text-white">Invoice INV-2025-049 Ready</p>
                    <p className="text-[11px] text-[#2dd4bf]">Milestone 3 Deliverables posted</p>
                  </div>
                  <div className="p-1.5 rounded hover:bg-[#19241e] cursor-pointer">
                    <p className="font-semibold text-white">Redis Cluster Scaled</p>
                    <p className="text-[11px] text-[#9ca3af]">Ticket TKT-2025-401 resolved by Liam</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Account Popover */}
          <div className="relative">
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="flex items-center gap-2 bg-[#141d18] border border-[#1e2d24] hover:border-[#2dd4bf]/50 rounded-xl px-2.5 py-1.5 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf] font-bold text-xs">
                {profile.name.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-white hidden md:inline">{profile.name}</span>
              <ChevronDown className="w-3 h-3 text-[#6b7280]" />
            </button>

            {showAccountDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#121915] border border-[#1e2d24] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in space-y-2">
                <div className="pb-2 border-b border-[#1b2820]">
                  <p className="text-xs font-bold text-white">{profile.name}</p>
                  <p className="text-[11px] text-[#9ca3af]">{profile.email}</p>
                  <p className="text-[10px] text-[#2dd4bf] mt-0.5 font-semibold">{profile.company}</p>
                </div>

                <div className="text-xs space-y-1 text-[#9ca3af]">
                  <div className="flex justify-between py-1">
                    <span>Account Tier:</span>
                    <span className="text-white font-semibold">{profile.tier}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Assigned Lead:</span>
                    <span className="text-[#2dd4bf] font-semibold">{profile.accountManager.name}</span>
                  </div>
                </div>

                {onBackToERP && (
                  <button
                    onClick={onBackToERP}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a2620] hover:bg-[#23352b] text-[#2dd4bf] text-xs font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to ERP Command</span>
                  </button>
                )}
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1414] hover:bg-[#2a1a1a] text-[#f87171] text-xs font-semibold transition-colors"
                  >
                    Sign out of portal
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick ERP Switcher Button */}
          {onBackToERP && (
            <button
              onClick={onBackToERP}
              title="Return to Internal ERP Staff View"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141e18] hover:bg-[#1b2a21] border border-[#22352a] text-xs font-semibold text-[#9ca3af] hover:text-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#2dd4bf]" />
              <span>Back to ERP</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs matching dark mode pill pattern */}
      <div className="px-4 md:px-8 py-2 flex items-center gap-2 overflow-x-auto bg-[#0d1410]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#2dd4bf] text-[#052e24] shadow-md shadow-[#2dd4bf]/25 scale-[1.02]'
                  : 'bg-[#131b16] text-[#9ca3af] hover:text-white hover:bg-[#19241e] border border-[#1a2620]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
