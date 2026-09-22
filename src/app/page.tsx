'use client';

import React, { useState, useMemo } from 'react';
import OmnysyncTopNav, { OmnysyncNavTab } from '@/components/layout/OmnysyncTopNav';
import TodoList from '@/components/todo/TodoList';
import Sidebar from '@/components/layout/Sidebar';
import ChatView from '@/components/chat/ChatView';
import DocumentManagerView from '@/components/documents/DocumentManagerView';

// Views
import MetricCards from '@/components/dashboard/MetricCards';
import SalesOverviewChart from '@/components/dashboard/SalesOverviewChart';
import RecentActivities from '@/components/dashboard/RecentActivities';
import ModulesGrid from '@/components/dashboard/ModulesGrid';
import SalesByChannel from '@/components/dashboard/SalesByChannel';
import TopProductsTable from '@/components/dashboard/TopProductsTable';
import LowStockAlerts from '@/components/dashboard/LowStockAlerts';
import UpcomingTasks from '@/components/dashboard/UpcomingTasks';

import AnalyticsView from '@/components/analytics/AnalyticsView';
import TabularDataView from '@/components/tabular/TabularDataView';
import ProjectsHubView from '@/components/projects/ProjectsHubView';

import FinancialOverview from '@/components/finance/FinancialOverview';
import ChartOfAccounts from '@/components/finance/ChartOfAccounts';
import GeneralLedgerTable from '@/components/finance/GeneralLedgerTable';
import VoucherManager from '@/components/finance/VoucherManager';
import StatementOfAccounts from '@/components/finance/StatementOfAccounts';
import CRMView from '@/components/crm/CRMView';
import ClientPortalView from '@/components/portal/ClientPortalView';

// Modals
import AskAIModal from '@/components/modals/AskAIModal';
import CreateDocumentModal from '@/components/modals/CreateDocumentModal';
import NewVoucherModal from '@/components/finance/NewVoucherModal';
import QuickActionModal from '@/components/modals/QuickActionModal';

// Mock Data
import {
  METRICS_DATA,
  RECENT_ACTIVITIES,
  ERP_MODULES,
  SALES_BY_CHANNEL,
  TOP_PRODUCTS,
  LOW_STOCK_ALERTS,
  UPCOMING_TASKS,
} from '@/data/dashboardData';

export default function AppMasterPage() {
  const [activeTab, setActiveTab] = useState<OmnysyncNavTab>('dashboard');
  const [financeSubTab, setFinanceSubTab] = useState<'overview' | 'coa' | 'ledger' | 'vouchers' | 'soa'>('overview');
  const [sidebarNav, setSidebarNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAskAIOpen, setIsAskAIOpen] = useState(false);
  const [isCreateDocOpen, setIsCreateDocOpen] = useState(false);
  const [isNewVoucherOpen, setIsNewVoucherOpen] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);

  // Filter modules/products for dashboard view
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return ERP_MODULES;
    const q = searchQuery.toLowerCase();
    return ERP_MODULES.filter(
      (m) => m.name.toLowerCase().includes(q) || m.badge.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return TOP_PRODUCTS;
    const q = searchQuery.toLowerCase();
    return TOP_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredAlerts = useMemo(() => {
    if (!searchQuery.trim()) return LOW_STOCK_ALERTS;
    const q = searchQuery.toLowerCase();
    return LOW_STOCK_ALERTS.filter((a) => a.product.toLowerCase().includes(q));
  }, [searchQuery]);

  // Handle sidebar navigation mapping to main tabs
  const handleSidebarSelect = (id: string) => {
    setSidebarNav(id);
    if (id === 'dashboard') setActiveTab('dashboard');
    else if (id === 'analytics') setActiveTab('analytics');
    else if (id === 'finance') {
      setActiveTab('finance');
      setFinanceSubTab('overview');
    } else if (id === 'projects') setActiveTab('projects');
    else if (id === 'crm') setActiveTab('crm');
    else if (id === 'todo') setActiveTab('todo');
    else if (id === 'portal') setActiveTab('portal');
    else if (id === 'chat') setActiveTab('chat');
    else if (id === 'documents') setActiveTab('documents');
    else if (id === 'hr' || id === 'sales' || id === 'inventory' || id === 'reports') {
      setActiveTab('tabular');
    }
  };

  // If Client Portal is active, render the dedicated client portal layout
  if (activeTab === 'portal') {
    return (
      <div className="min-h-screen bg-[#0b0f0d]">
        <ClientPortalView
          onBackToERP={() => {
            setActiveTab('dashboard');
            setSidebarNav('dashboard');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f0d] flex flex-col text-[#f3f4f6]">
      {/* Universal Top Navigation matching Screenshot 4 */}
      <OmnysyncTopNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'dashboard') setSidebarNav('dashboard');
          else if (tab === 'analytics') setSidebarNav('analytics');
          else if (tab === 'finance') setSidebarNav('finance');
          else if (tab === 'crm') setSidebarNav('crm');
          else if (tab === 'todo') setSidebarNav('todo');
          else if (tab === 'portal') setSidebarNav('portal');
          else if (tab === 'chat') setSidebarNav('chat');
          else if (tab === 'documents') setSidebarNav('documents');
        }}
        onOpenAskAI={() => setIsAskAIOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Body Layout: Optional collapsible sidebar + Content canvas */}
      <div className="flex-1 flex min-w-0">
        {/* Left Sidebar (visible on dashboard, finance, todo & documents tabs) */}
        {(activeTab === 'dashboard' || activeTab === 'finance' || activeTab === 'todo' || activeTab === 'documents') && (
          <Sidebar
            currentNav={sidebarNav}
            onNavSelect={handleSidebarSelect}
            onOpenQuickAction={(actionId) => setActiveQuickAction(actionId)}
          />
        )}

        {/* Dynamic View Canvas */}
        {activeTab === 'chat' ? (
          <ChatView />
        ) : (
          <main className="flex-1 p-4 md:p-8 space-y-6 max-w-[1680px] w-full mx-auto overflow-y-auto">
          {/* TAB 1: ERP Command Center (Screenshot 1) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  ERP Command Center
                </h1>
                <p className="text-xs text-[#9ca3af]">
                  Everything you need, all in one place.
                </p>
              </div>

              {/* KPI Metric Cards */}
              <MetricCards metrics={METRICS_DATA} />

              {/* Sales Overview + Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-8 flex flex-col">
                  <SalesOverviewChart />
                </div>
                <div className="lg:col-span-4 flex flex-col">
                  <RecentActivities activities={RECENT_ACTIVITIES} />
                </div>
              </div>

              {/* Modules Grid + Sales by Channel Donut */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-8 flex flex-col">
                  <ModulesGrid
                    modules={filteredModules}
                    onSelectModule={(id) => {
                      if (id === 'finance') {
                        setActiveTab('finance');
                        setFinanceSubTab('coa');
                      } else if (id === 'hr' || id === 'crm') {
                        setActiveTab('tabular');
                      } else {
                        setActiveQuickAction(id);
                      }
                    }}
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col">
                  <SalesByChannel channels={SALES_BY_CHANNEL} />
                </div>
              </div>

              {/* Top Products, Low Stock Alerts, Tasks */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
                <TopProductsTable products={filteredProducts} />
                <LowStockAlerts alerts={filteredAlerts} />
                <UpcomingTasks initialTasks={UPCOMING_TASKS} />
              </div>
            </div>
          )}

          {/* TAB 2: Omnysync Analytics & AI Summary (Screenshot 4) */}
          {activeTab === 'analytics' && (
            <div className="animate-in fade-in duration-150">
              <AnalyticsView onOpenAskAI={() => setIsAskAIOpen(true)} />
            </div>
          )}

          {/* TAB 3: Financial Engine Suite (Screenshot 5 + 4-Level COA + Double-Entry Ledger) */}
          {activeTab === 'finance' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Financial Sub-Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#1b2620]">
                {[
                  { id: 'overview', label: 'Wallet & Banking' },
                  { id: 'coa', label: '4-Level Chart of Accounts' },
                  { id: 'ledger', label: 'Double-Entry General Ledger' },
                  { id: 'vouchers', label: 'Vouchers (JV/PV/RV)' },
                  { id: 'soa', label: 'Statement of Accounts' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setFinanceSubTab(st.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      financeSubTab === st.id
                        ? 'bg-[#2dd4bf] text-[#052e24] shadow-md shadow-[#2dd4bf]/20'
                        : 'bg-[#141e18] text-[#9ca3af] hover:text-white hover:bg-[#19261f]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Sub-view rendering */}
              {financeSubTab === 'overview' && (
                <FinancialOverview
                  onOpenNewVoucher={() => setIsNewVoucherOpen(true)}
                  onNavigateToCOA={() => setFinanceSubTab('coa')}
                />
              )}

              {financeSubTab === 'coa' && <ChartOfAccounts />}

              {financeSubTab === 'ledger' && <GeneralLedgerTable />}

              {financeSubTab === 'vouchers' && (
                <VoucherManager onOpenNewVoucher={() => setIsNewVoucherOpen(true)} />
              )}

              {financeSubTab === 'soa' && <StatementOfAccounts />}
            </div>
          )}

          {/* TAB 4: Omnysync Projects Hub & Google Drive Storage (Screenshot 3) */}
          {(activeTab === 'projects' || activeTab === 'drive' || activeTab === 'calendar') && (
            <div className="animate-in fade-in duration-150">
              <ProjectsHubView
                onOpenCreateDocument={() => setIsCreateDocOpen(true)}
              />
            </div>
          )}

          {/* TAB 5: High-Density Tabular Data View (Screenshot 2) */}
          {activeTab === 'tabular' && (
            <div className="animate-in fade-in duration-150">
              <TabularDataView />
            </div>
          )}

          {/* TAB 6: CRM Workspace & Lead Management */}
          {activeTab === 'crm' && (
            <div className="animate-in fade-in duration-150">
              <CRMView />
            </div>
          )}
          {activeTab === 'todo' && (
            <div className="animate-in fade-in duration-150">
              <TodoList />
            </div>
          )}
          {activeTab === 'documents' && (
            <div className="animate-in fade-in duration-150">
              <DocumentManagerView />
            </div>
          )}
          </main>
        )}
      </div>

      {/* Global Interactive Modals */}
      <AskAIModal
        isOpen={isAskAIOpen}
        onClose={() => setIsAskAIOpen(false)}
      />

      <CreateDocumentModal
        isOpen={isCreateDocOpen}
        onClose={() => setIsCreateDocOpen(false)}
      />

      <NewVoucherModal
        isOpen={isNewVoucherOpen}
        onClose={() => setIsNewVoucherOpen(false)}
        onVoucherCreated={(v) => {
          alert(`Successfully posted ${v.voucherType} for $${v.totalAmount.toLocaleString()} to General Ledger!`);
          setFinanceSubTab('ledger');
        }}
      />

      <QuickActionModal
        isOpen={Boolean(activeQuickAction)}
        actionType={activeQuickAction || ''}
        onClose={() => setActiveQuickAction(null)}
      />
    </div>
  );
}
