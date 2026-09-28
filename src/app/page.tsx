'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import UpcomingTasks from '@/components/dashboard/UpcomingTasks';

import AnalyticsView from '@/components/analytics/AnalyticsView';
import ClientsView from '@/components/clients/ClientsView';
import SettingsView from '@/components/settings/SettingsView';
import ProjectsHubView from '@/components/projects/ProjectsHubView';

import AgencyBillingView from '@/components/finance/AgencyBillingView';
import CRMView from '@/components/crm/CRMView';
import ClientPortalView from '@/components/portal/ClientPortalView';

// Modals
import AskAIModal from '@/components/modals/AskAIModal';
import CreateDocumentModal from '@/components/modals/CreateDocumentModal';
import QuickActionModal from '@/components/modals/QuickActionModal';
import { useAgency, FinanceSubTab } from '@/context/AgencyContext';

// Mock Data
import {
  METRICS_DATA,
  RECENT_ACTIVITIES,
  ERP_MODULES,
  SALES_BY_CHANNEL,
  UPCOMING_TASKS,
} from '@/data/dashboardData';

export default function AppMasterPage() {
  const { navigation, clearNavigation } = useAgency();
  const [activeTab, setActiveTab] = useState<OmnysyncNavTab>('dashboard');
  const [financeSubTab, setFinanceSubTab] = useState<FinanceSubTab>('overview');
  const [sidebarNav, setSidebarNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!navigation) return;
    const tab = navigation.tab === 'settings' ? 'tabular' : (navigation.tab as OmnysyncNavTab);
    setActiveTab(tab);
    setSidebarNav(navigation.tab === 'settings' ? 'settings' : navigation.tab);
    if (navigation.financeSub) setFinanceSubTab(navigation.financeSub);
    clearNavigation();
  }, [navigation, clearNavigation]);

  // Modals
  const [isAskAIOpen, setIsAskAIOpen] = useState(false);
  const [isCreateDocOpen, setIsCreateDocOpen] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);

  // Filter modules for dashboard view
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return ERP_MODULES;
    const q = searchQuery.toLowerCase();
    return ERP_MODULES.filter(
      (m) => m.name.toLowerCase().includes(q) || m.badge.toLowerCase().includes(q)
    );
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
    else if (id === 'clients') setActiveTab('clients');
    else if (id === 'todo') setActiveTab('todo');
    else if (id === 'portal') setActiveTab('portal');
    else if (id === 'chat') setActiveTab('chat');
    else if (id === 'documents') setActiveTab('documents');
    else if (id === 'settings') {
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
          else if (tab === 'finance') {
            setSidebarNav('finance');
            setFinanceSubTab('overview');
          }
          else if (tab === 'crm') setSidebarNav('crm');
          else if (tab === 'clients') setSidebarNav('clients');
          else if (tab === 'todo') setSidebarNav('todo');
          else if (tab === 'portal') setSidebarNav('portal');
          else if (tab === 'chat') setSidebarNav('chat');
          else if (tab === 'documents') setSidebarNav('documents');
          else if (tab === 'projects' || tab === 'drive' || tab === 'calendar') setSidebarNav('projects');
          else if (tab === 'tabular') setSidebarNav('clients');
        }}
        onOpenAskAI={() => setIsAskAIOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Body Layout: Sidebar + Dynamic Content canvas */}
      <div className="flex-1 flex min-w-0">
        {/* Left Sidebar (visible everywhere except chat which has its own channel sidebar) */}
        {activeTab !== 'chat' && (
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
                  OMNYSYNC Command Center
                </h1>
                <p className="text-xs text-[#9ca3af]">
                  Websites, custom software, SEO &amp; apps — built for HVAC and home-services agencies.
                </p>
              </div>

              {/* KPI Metric Cards */}
              <MetricCards
                metrics={METRICS_DATA}
                onSelectMetric={(id) => {
                  if (id === 'metric-revenue') {
                    setActiveTab('finance');
                    setSidebarNav('finance');
                    setFinanceSubTab('overview');
                  } else if (id === 'metric-mrr') {
                    setActiveTab('finance');
                    setSidebarNav('finance');
                    setFinanceSubTab('invoices');
                  } else if (id === 'metric-customers') {
                    setActiveTab('crm');
                    setSidebarNav('crm');
                  } else if (id === 'metric-profit') {
                    setActiveTab('crm');
                    setSidebarNav('crm');
                  }
                }}
              />

              {/* Sales Overview + Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-8 flex flex-col">
                  <SalesOverviewChart
                    onViewAnalytics={() => {
                      setActiveTab('analytics');
                      setSidebarNav('analytics');
                    }}
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col">
                  <RecentActivities
                    activities={RECENT_ACTIVITIES}
                    onViewAll={() => {
                      setActiveTab('projects');
                      setSidebarNav('projects');
                    }}
                    onSelectActivity={(type) => {
                      if (type === 'payment' || type === 'invoice') {
                        setActiveTab('finance');
                        setSidebarNav('finance');
                      } else if (type === 'lead' || type === 'proposal') {
                        setActiveTab('crm');
                        setSidebarNav('crm');
                      } else if (type === 'project') {
                        setActiveTab('projects');
                        setSidebarNav('projects');
                      } else {
                        setActiveTab('clients');
                        setSidebarNav('clients');
                      }
                    }}
                  />
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
                        setSidebarNav('finance');
                        setFinanceSubTab('overview');
                      } else if (id === 'crm') {
                        setActiveTab('crm');
                        setSidebarNav('crm');
                      } else if (id === 'clients') {
                        setActiveTab('clients');
                        setSidebarNav('clients');
                      } else if (id === 'projects') {
                        setActiveTab('projects');
                        setSidebarNav('projects');
                      } else if (id === 'documents') {
                        setActiveTab('documents');
                        setSidebarNav('documents');
                      } else if (id === 'portal') {
                        setActiveTab('portal');
                        setSidebarNav('portal');
                      } else if (id === 'analytics') {
                        setActiveTab('analytics');
                        setSidebarNav('analytics');
                      } else if (id === 'todo') {
                        setActiveTab('todo');
                        setSidebarNav('todo');
                      } else {
                        setActiveTab('dashboard');
                        setSidebarNav('dashboard');
                      }
                    }}
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col">
                  <SalesByChannel channels={SALES_BY_CHANNEL} />
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div>
                <UpcomingTasks
                  initialTasks={UPCOMING_TASKS}
                  onViewAll={() => {
                    setActiveTab('todo');
                    setSidebarNav('todo');
                  }}
                />
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
            <div className="animate-in fade-in duration-150">
              <AgencyBillingView
                subTab={financeSubTab}
                onSubTabChange={setFinanceSubTab}
              />
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

          {/* TAB 5: Agency Clients roster */}
          {sidebarNav === 'settings' && (
            <div className="animate-in fade-in duration-150">
              <SettingsView />
            </div>
          )}

          {(activeTab === 'clients' || (activeTab === 'tabular' && sidebarNav !== 'settings')) && sidebarNav !== 'settings' && (
            <div className="animate-in fade-in duration-150">
              <ClientsView />
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

      <QuickActionModal
        isOpen={Boolean(activeQuickAction)}
        actionType={activeQuickAction || ''}
        onClose={() => setActiveQuickAction(null)}
      />
    </div>
  );
}
