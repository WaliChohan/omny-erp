'use client';

import React from 'react';
import {
  Zap,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Truck,
  UserCheck,
  CreditCard,
  BarChart3,
  FileText,
  Settings,
  ChevronRight,
  PlusCircle,
  Receipt,
  PackagePlus,
  ClipboardList,
  CheckSquare,
  ShieldCheck,
} from 'lucide-react';


interface SidebarProps {
  currentNav: string;
  onNavSelect: (id: string) => void;
  onOpenQuickAction: (actionType: string) => void;
}

export default function Sidebar({
  currentNav,
  onNavSelect,
  onOpenQuickAction,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales & POS', icon: ShoppingCart },
    { id: 'crm', label: 'CRM', icon: Users },
    { id: 'todo', label: 'To‑Do', icon: CheckSquare },
    { id: 'portal', label: 'Client Portal', icon: ShieldCheck },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'procurement', label: 'Procurement', icon: Truck },
    { id: 'hr', label: 'HR', icon: UserCheck },
    { id: 'finance', label: 'Finance & Accounting', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const quickActions = [
    { id: 'new_sale', label: 'New Sale', icon: ShoppingCart },
    { id: 'create_invoice', label: 'Create Invoice', icon: Receipt },
    { id: 'add_product', label: 'Add Product', icon: PackagePlus },
    { id: 'new_po', label: 'New Purchase Order', icon: ClipboardList },
  ];

  return (
    <aside className="w-64 bg-[#0d1310] border-r border-[#1a2620] flex flex-col shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-2.5 border-b border-[#17221c]">
        <div className="w-8 h-8 rounded-lg bg-[#00e676] flex items-center justify-center text-black font-black shadow-md shadow-[#00e676]/20">
          <Zap className="w-5 h-5 fill-black text-black" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-bold text-white tracking-tight">FlowERP</span>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-[#1b3d2b] text-[#00e676] border border-[#27593e] shadow-sm'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#141e18]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-[#00e676]'
                      : 'text-[#6b7280] group-hover:text-white'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.id !== 'dashboard' && (
                <ChevronRight className="w-3.5 h-3.5 text-[#4b5563] group-hover:text-[#9ca3af] transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Actions Panel */}
      <div className="p-3 border-t border-[#17221c] bg-[#0c110e]/60 space-y-1.5">
        <div className="px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">
          <Zap className="w-3 h-3 text-[#00e676]" />
          <span>Quick Actions</span>
        </div>
        {quickActions.map((action) => {
          const ActionIcon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onOpenQuickAction(action.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#d1d5db] hover:text-white hover:bg-[#141f19] border border-transparent hover:border-[#1e2d24] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <ActionIcon className="w-3.5 h-3.5 text-[#00e676]" />
                <span>{action.label}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-[#4b5563] group-hover:text-[#9ca3af] transition-transform group-hover:translate-x-0.5" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
