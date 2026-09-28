'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AGENCY_CLIENTS,
  AgencyClient,
  ClientStatus,
  ServiceLine,
} from '@/data/clientsData';
import { CRM_LEADS, LeadCard } from '@/data/crmData';
import { OMNYSYNC_PROJECTS, ProjectCardItem, TEAM_MEMBERS } from '@/data/projectsData';
import {
  CommercialDocument,
  DocumentLineItem,
  DocumentType,
  COMMERCIAL_DOCUMENTS,
} from '@/data/financialData';
import {
  AgencyExpense,
  AgencyPayment,
  ExpenseCategory,
  INITIAL_EXPENSES,
  INITIAL_PAYMENTS,
  PaymentMethod,
} from '@/data/billingData';

export type AgencyTab =
  | 'dashboard'
  | 'analytics'
  | 'finance'
  | 'projects'
  | 'clients'
  | 'crm'
  | 'todo'
  | 'portal'
  | 'chat'
  | 'documents'
  | 'settings';

export type FinanceSubTab = 'overview' | 'quotes' | 'invoices' | 'payments' | 'expenses';

export type FocusKind = 'client' | 'lead' | 'project' | 'document' | 'payment' | 'expense';

export interface AgencyFocus {
  kind: FocusKind;
  id: string;
}

export interface AgencyNavigation {
  tab: AgencyTab;
  financeSub?: FinanceSubTab;
  focus?: AgencyFocus;
}

interface AgencyContextType {
  clients: AgencyClient[];
  leads: LeadCard[];
  projects: ProjectCardItem[];
  documents: CommercialDocument[];
  payments: AgencyPayment[];
  expenses: AgencyExpense[];
  navigation: AgencyNavigation | null;
  toast: string | null;

  navigate: (nav: AgencyNavigation) => void;
  clearNavigation: () => void;
  consumeFocus: (kind: FocusKind) => string | null;
  showToast: (msg: string) => void;

  upsertClient: (client: AgencyClient) => void;
  updateClientStatus: (id: string, status: ClientStatus) => void;
  convertLeadToClient: (leadId: string) => AgencyClient | null;
  createProjectForClient: (
    clientId: string,
    input?: Partial<Pick<ProjectCardItem, 'title' | 'category' | 'budget' | 'description' | 'deadline'>>
  ) => ProjectCardItem | null;
  createDocument: (input: {
    docType: DocumentType;
    clientId?: string;
    leadId?: string;
    projectId?: string;
    title?: string;
    amount?: number;
    description?: string;
  }) => CommercialDocument;
  convertQuoteToInvoice: (quoteId: string) => CommercialDocument | null;
  markDocumentStatus: (id: string, status: CommercialDocument['status']) => void;
  recordPayment: (input: {
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    note?: string;
  }) => AgencyPayment | null;
  addExpense: (
    input: Omit<AgencyExpense, 'id' | 'status'> & { status?: AgencyExpense['status'] }
  ) => AgencyExpense;
  updateProject: (project: ProjectCardItem) => void;
  addLead: (lead: LeadCard) => void;
  updateLead: (lead: LeadCard) => void;

  getClient: (id: string) => AgencyClient | undefined;
  getProjectsForClient: (clientId: string) => ProjectCardItem[];
  getDocsForClient: (clientId: string) => CommercialDocument[];
  getDocsForProject: (projectId: string) => CommercialDocument[];
}

const STORAGE_KEY = 'omnysync_agency_store_v1';

const AgencyContext = createContext<AgencyContextType | null>(null);

function today() {
  return new Date().toISOString().slice(0, 10);
}

function docPrefix(type: DocumentType) {
  switch (type) {
    case 'invoice':
      return 'INV';
    case 'quotation':
      return 'QT';
    case 'proposal':
      return 'PROP';
    case 'receipt':
      return 'RCT';
    case 'sow':
      return 'SOW';
    default:
      return 'DOC';
  }
}

export function AgencyProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<AgencyClient[]>(AGENCY_CLIENTS);
  const [leads, setLeads] = useState<LeadCard[]>(CRM_LEADS);
  const [projects, setProjects] = useState<ProjectCardItem[]>(OMNYSYNC_PROJECTS);
  const [documents, setDocuments] = useState<CommercialDocument[]>(COMMERCIAL_DOCUMENTS);
  const [payments, setPayments] = useState<AgencyPayment[]>(INITIAL_PAYMENTS);
  const [expenses, setExpenses] = useState<AgencyExpense[]>(INITIAL_EXPENSES);
  const [navigation, setNavigation] = useState<AgencyNavigation | null>(null);
  const [pendingFocus, setPendingFocus] = useState<AgencyFocus | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.clients?.length) setClients(parsed.clients);
        if (parsed.leads?.length) setLeads(parsed.leads);
        if (parsed.projects?.length) setProjects(parsed.projects);
        if (parsed.documents?.length) setDocuments(parsed.documents);
        if (parsed.payments?.length) setPayments(parsed.payments);
        if (parsed.expenses?.length) setExpenses(parsed.expenses);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ clients, leads, projects, documents, payments, expenses })
      );
    } catch {
      /* ignore */
    }
  }, [clients, leads, projects, documents, payments, expenses, hydrated]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const navigate = useCallback((nav: AgencyNavigation) => {
    if (nav.focus) setPendingFocus(nav.focus);
    setNavigation(nav);
  }, []);

  const clearNavigation = useCallback(() => setNavigation(null), []);

  const consumeFocus = useCallback(
    (kind: FocusKind) => {
      if (pendingFocus && pendingFocus.kind === kind) {
        const id = pendingFocus.id;
        setPendingFocus(null);
        return id;
      }
      return null;
    },
    [pendingFocus]
  );

  const getClient = useCallback((id: string) => clients.find((c) => c.id === id), [clients]);

  const getProjectsForClient = useCallback(
    (clientId: string) => {
      const client = clients.find((c) => c.id === clientId);
      return projects.filter(
        (p) => p.clientId === clientId || (!!client && p.client === client.company)
      );
    },
    [projects, clients]
  );

  const getDocsForClient = useCallback(
    (clientId: string) => {
      const client = clients.find((c) => c.id === clientId);
      return documents.filter(
        (d) => d.clientId === clientId || (!!client && d.clientName === client.company)
      );
    },
    [documents, clients]
  );

  const getDocsForProject = useCallback(
    (projectId: string) => documents.filter((d) => d.projectId === projectId),
    [documents]
  );

  const upsertClient = useCallback((client: AgencyClient) => {
    setClients((prev) => {
      const i = prev.findIndex((c) => c.id === client.id);
      if (i === -1) return [client, ...prev];
      const next = [...prev];
      next[i] = client;
      return next;
    });
  }, []);

  const updateClientStatus = useCallback((id: string, status: ClientStatus) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              lastTouch: today(),
              openProjects: status === 'Churned' ? 0 : c.openProjects,
            }
          : c
      )
    );
  }, []);

  const convertLeadToClient = useCallback(
    (leadId: string) => {
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return null;
      const existing = clients.find((c) => c.leadId === leadId || c.email === lead.email);
      if (existing) {
        showToast(`${existing.company} already linked`);
        navigate({ tab: 'clients', focus: { kind: 'client', id: existing.id } });
        return existing;
      }
      const client: AgencyClient = {
        id: `cli-${Date.now()}`,
        name: lead.name,
        company: lead.company || `${lead.name} Co.`,
        industry: 'Home Services',
        email: lead.email || `${lead.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: lead.phone || '—',
        status: 'Onboarding',
        services: ['Website'] as ServiceLine[],
        mrr: 0,
        lifetimeValue: lead.estimatedValue || 0,
        openProjects: 0,
        accountManager: 'Sarah Connor',
        city: '—',
        joinedAt: today(),
        lastTouch: today(),
        leadId: lead.id,
        notes: `Converted from CRM lead ${lead.id}`,
      };
      setClients((prev) => [client, ...prev]);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: 'Converted' as const } : l))
      );
      showToast(`Client created: ${client.company}`);
      navigate({ tab: 'clients', focus: { kind: 'client', id: client.id } });
      return client;
    },
    [leads, clients, navigate, showToast]
  );

  const createProjectForClient = useCallback(
    (
      clientId: string,
      input?: Partial<
        Pick<ProjectCardItem, 'title' | 'category' | 'budget' | 'description' | 'deadline'>
      >
    ) => {
      const client = clients.find((c) => c.id === clientId);
      if (!client) return null;
      const pid = `p-${Date.now()}`;
      const project: ProjectCardItem = {
        id: pid,
        title: input?.title || `${client.company} — Engagement`,
        category: input?.category || 'Website',
        client: client.company,
        clientId: client.id,
        description:
          input?.description ||
          `Delivery workspace for ${client.company} (${client.services.join(', ')}).`,
        deadline:
          input?.deadline || new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
        budget: input?.budget || Math.max(client.mrr * 6, 500000),
        spent: 0,
        tasksCount: 1,
        progressPercent: 5,
        themeColor: 'teal',
        bgGradient: 'bg-gradient-to-br from-[#3ca997] to-[#2d8d7e]',
        avatarsCount: 3,
        team: [TEAM_MEMBERS[0], TEAM_MEMBERS[1], TEAM_MEMBERS[2]],
        tasks: [
          {
            id: `pt-${Date.now()}`,
            projectId: pid,
            title: 'Kickoff & discovery',
            priority: 'High',
            dueDate: today(),
            completed: false,
            status: 'todo',
            assignee: TEAM_MEMBERS[0],
          },
        ],
        linkedDocIds: [],
      };
      setProjects((prev) => [project, ...prev]);
      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId
            ? {
                ...c,
                openProjects: c.openProjects + 1,
                status: c.status === 'Churned' ? 'Active' : c.status,
                lastTouch: today(),
              }
            : c
        )
      );
      showToast(`Project created for ${client.company}`);
      navigate({ tab: 'projects', focus: { kind: 'project', id: project.id } });
      return project;
    },
    [clients, navigate, showToast]
  );

  const createDocument = useCallback(
    (input: {
      docType: DocumentType;
      clientId?: string;
      leadId?: string;
      projectId?: string;
      title?: string;
      amount?: number;
      description?: string;
    }) => {
      const client = input.clientId ? clients.find((c) => c.id === input.clientId) : undefined;
      const lead = input.leadId ? leads.find((l) => l.id === input.leadId) : undefined;
      const project = input.projectId
        ? projects.find((p) => p.id === input.projectId)
        : undefined;
      const amount = input.amount ?? project?.budget ?? lead?.estimatedValue ?? 500000;
      const line: DocumentLineItem = {
        id: '1',
        description: input.description || input.title || 'Professional services',
        qty: 1,
        unitPrice: amount,
        total: amount,
      };
      const doc: CommercialDocument = {
        id: `doc-${Date.now()}`,
        docType: input.docType,
        docNumber: `${docPrefix(input.docType)}-${new Date().getFullYear()}-${String(
          documents.length + 1
        ).padStart(4, '0')}`,
        title:
          input.title ||
          `${input.docType === 'invoice' ? 'Invoice' : 'Quote'} — ${
            client?.company || lead?.company || project?.client || 'Client'
          }`,
        clientName: client?.company || lead?.company || project?.client || 'Prospect',
        clientEmail: client?.email || lead?.email || 'billing@client.com',
        clientAddress: client?.city,
        issueDate: today(),
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        currency: 'PKR',
        status: 'draft',
        items: [line],
        subtotal: amount,
        taxRate: 0,
        taxAmount: 0,
        totalAmount: amount,
        notes: 'Payment due within Net 15. Thank you for partnering with OMNYSYNC.',
        terms: 'Governed by OMNYSYNC Master Services Agreement.',
        projectId: project?.id,
        projectName: project?.title,
        clientId: client?.id || project?.clientId,
        leadId: lead?.id || client?.leadId,
      };
      setDocuments((prev) => [doc, ...prev]);
      showToast(`${doc.docNumber} created`);
      navigate({
        tab: 'finance',
        financeSub: doc.docType === 'invoice' ? 'invoices' : 'quotes',
        focus: { kind: 'document', id: doc.id },
      });
      return doc;
    },
    [clients, leads, projects, documents.length, navigate, showToast]
  );

  const convertQuoteToInvoice = useCallback(
    (quoteId: string) => {
      const quote = documents.find((d) => d.id === quoteId);
      if (!quote) return null;
      const invoice: CommercialDocument = {
        ...quote,
        id: `doc-${Date.now()}`,
        docType: 'invoice',
        docNumber: `INV-${new Date().getFullYear()}-${String(documents.length + 1).padStart(4, '0')}`,
        status: 'sent',
        issueDate: today(),
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        title: quote.title.replace(/Quote|Quotation|Proposal/i, 'Invoice'),
      };
      setDocuments((prev) => [
        invoice,
        ...prev.map((d) => (d.id === quoteId ? { ...d, status: 'approved' as const } : d)),
      ]);
      showToast(`${invoice.docNumber} created from quote`);
      navigate({
        tab: 'finance',
        financeSub: 'invoices',
        focus: { kind: 'document', id: invoice.id },
      });
      return invoice;
    },
    [documents, navigate, showToast]
  );

  const markDocumentStatus = useCallback((id: string, status: CommercialDocument['status']) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  }, []);

  const recordPayment = useCallback(
    (input: { invoiceId: string; amount: number; method: PaymentMethod; note?: string }) => {
      const invoice = documents.find((d) => d.id === input.invoiceId);
      if (!invoice) return null;
      const payment: AgencyPayment = {
        id: `pay-${Date.now()}`,
        invoiceId: invoice.id,
        invoiceNumber: invoice.docNumber,
        clientId: invoice.clientId,
        clientName: invoice.clientName,
        amount: input.amount,
        method: input.method,
        paidAt: today(),
        note: input.note,
      };
      setPayments((prev) => [payment, ...prev]);
      setDocuments((prev) =>
        prev.map((d) => (d.id === invoice.id ? { ...d, status: 'paid' as const } : d))
      );
      if (invoice.clientId) {
        setClients((prev) =>
          prev.map((c) =>
            c.id === invoice.clientId
              ? {
                  ...c,
                  lifetimeValue: c.lifetimeValue + input.amount,
                  lastTouch: today(),
                }
              : c
          )
        );
      }
      showToast(`Payment recorded for ${invoice.docNumber}`);
      navigate({
        tab: 'finance',
        financeSub: 'payments',
        focus: { kind: 'payment', id: payment.id },
      });
      return payment;
    },
    [documents, navigate, showToast]
  );

  const addExpense = useCallback(
    (input: Omit<AgencyExpense, 'id' | 'status'> & { status?: AgencyExpense['status'] }) => {
      const expense: AgencyExpense = {
        ...input,
        id: `exp-${Date.now()}`,
        status: input.status || 'recorded',
      };
      setExpenses((prev) => [expense, ...prev]);
      showToast('Expense recorded');
      return expense;
    },
    [showToast]
  );

  const updateProject = useCallback((project: ProjectCardItem) => {
    setProjects((prev) => {
      const i = prev.findIndex((p) => p.id === project.id);
      if (i === -1) return [project, ...prev];
      const next = [...prev];
      next[i] = project;
      return next;
    });
  }, []);

  const addLead = useCallback((lead: LeadCard) => {
    setLeads((prev) => [lead, ...prev]);
  }, []);

  const updateLead = useCallback((lead: LeadCard) => {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? lead : l)));
  }, []);

  const value = useMemo<AgencyContextType>(
    () => ({
      clients,
      leads,
      projects,
      documents,
      payments,
      expenses,
      navigation,
      toast,
      navigate,
      clearNavigation,
      consumeFocus,
      showToast,
      upsertClient,
      updateClientStatus,
      convertLeadToClient,
      createProjectForClient,
      createDocument,
      convertQuoteToInvoice,
      markDocumentStatus,
      recordPayment,
      addExpense,
      updateProject,
      addLead,
      updateLead,
      getClient,
      getProjectsForClient,
      getDocsForClient,
      getDocsForProject,
    }),
    [
      clients,
      leads,
      projects,
      documents,
      payments,
      expenses,
      navigation,
      toast,
      navigate,
      clearNavigation,
      consumeFocus,
      showToast,
      upsertClient,
      updateClientStatus,
      convertLeadToClient,
      createProjectForClient,
      createDocument,
      convertQuoteToInvoice,
      markDocumentStatus,
      recordPayment,
      addExpense,
      updateProject,
      addLead,
      updateLead,
      getClient,
      getProjectsForClient,
      getDocsForClient,
      getDocsForProject,
    ]
  );

  return (
    <AgencyContext.Provider value={value}>
      {children}
      {toast ? (
        <div className="fixed bottom-6 right-6 z-[80] px-4 py-2.5 rounded-xl bg-[#18261e] border border-[#2dd4bf]/40 text-xs font-semibold text-[#2dd4bf] shadow-xl">
          {toast}
        </div>
      ) : null}
    </AgencyContext.Provider>
  );
}

export function useAgency() {
  const ctx = useContext(AgencyContext);
  if (!ctx) throw new Error('useAgency must be used within AgencyProvider');
  return ctx;
}

export type { ServiceLine, ExpenseCategory, PaymentMethod };
