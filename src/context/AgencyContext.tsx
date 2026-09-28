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
import { CRM_LEADS, LeadCard, LeadActivity, CallOutcome } from '@/data/crmData';
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
import { ERPDocument, DocumentStatus, DocumentType as HubDocType } from '@/types/documentEngine';
import { INITIAL_DOCUMENTS } from '@/data/mockDocuments';
import { AgencyTask, INITIAL_AGENCY_TASKS } from '@/data/tasksData';
import {
  SupportTicket,
  ClientProfile,
  ClientProject,
  ClientInvoice,
  ClientSharedFile,
  ActivityEvent,
} from '@/data/portalData';
import { INITIAL_SUPPORT_TICKETS } from '@/data/ticketsData';

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
  importLeads: (leads: LeadCard[]) => void;
  importClients: (clients: AgencyClient[]) => void;
  leadActivities: LeadActivity[];
  addLeadActivity: (activity: Omit<LeadActivity, 'id' | 'createdAt'> & { createdAt?: string }) => LeadActivity;
  getLeadActivities: (leadId: string) => LeadActivity[];
  logCall: (input: {
    leadId: string;
    outcome: CallOutcome;
    notes: string;
    durationSec?: number;
  }) => LeadActivity;

  getClient: (id: string) => AgencyClient | undefined;
  getProjectsForClient: (clientId: string) => ProjectCardItem[];
  getDocsForClient: (clientId: string) => CommercialDocument[];
  getDocsForProject: (projectId: string) => CommercialDocument[];

  hubDocuments: ERPDocument[];
  activeHubDocument: ERPDocument | null;
  setActiveHubDocument: (doc: ERPDocument | null) => void;
  createHubDocument: (doc: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => ERPDocument;
  updateHubDocument: (id: string, updates: Partial<ERPDocument>) => void;
  deleteHubDocument: (id: string) => void;
  updateHubDocumentStatus: (id: string, status: DocumentStatus) => void;
  duplicateHubDocument: (id: string) => ERPDocument;
  convertHubDocument: (id: string, targetType: HubDocType) => ERPDocument;
  addSignatureToHubDocument: (
    id: string,
    signerName: string,
    signerTitle: string,
    signerEmail: string,
    signatureDataUrl?: string
  ) => void;
  getHubDocsForClient: (clientId: string) => ERPDocument[];
  getHubDocsForProject: (projectId: string) => ERPDocument[];

  tasks: AgencyTask[];
  addTask: (task: Omit<AgencyTask, 'id' | 'createdAt' | 'completed'> & { completed?: boolean }) => AgencyTask;
  updateTask: (task: AgencyTask) => void;
  deleteTask: (id: string) => void;
  getTasksForProject: (projectId: string) => AgencyTask[];
  toggleTask: (id: string) => void;

  portalClientId: string;
  setPortalClientId: (id: string) => void;
  tickets: SupportTicket[];
  addTicket: (
    ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages' | 'status'> & {
      messages?: SupportTicket['messages'];
      status?: SupportTicket['status'];
    }
  ) => SupportTicket;
  replyToTicket: (ticketId: string, text: string, isClient?: boolean, sender?: string) => void;
  getPortalBundle: (clientId?: string) => {
    profile: ClientProfile;
    projects: ClientProject[];
    invoices: ClientInvoice[];
    files: ClientSharedFile[];
    tickets: SupportTicket[];
    activities: ActivityEvent[];
  };

  agencyMetrics: {
    activeClients: number;
    mrr: number;
    pipelineValue: number;
    openProjects: number;
    receivables: number;
    collected: number;
    expensesTotal: number;
    openTasks: number;
    quotesOpen: number;
    invoicesPaid: number;
  };
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
  const [leadActivities, setLeadActivities] = useState<LeadActivity[]>([
    {
      id: 'act-seed-1',
      leadId: 'lead-0',
      type: 'note',
      content: 'Inbound interest in booking portal + dispatch app.',
      createdAt: '2026-09-26T10:00:00.000Z',
    },
    {
      id: 'act-seed-2',
      leadId: 'lead-0',
      type: 'call',
      outcome: 'connected',
      content: 'Discovery call — scoped HVAC field workflows.',
      createdAt: '2026-09-27T14:30:00.000Z',
      durationSec: 720,
    },
  ]);
  const [projects, setProjects] = useState<ProjectCardItem[]>(OMNYSYNC_PROJECTS);
  const [documents, setDocuments] = useState<CommercialDocument[]>(COMMERCIAL_DOCUMENTS);
  const [payments, setPayments] = useState<AgencyPayment[]>(INITIAL_PAYMENTS);
  const [expenses, setExpenses] = useState<AgencyExpense[]>(INITIAL_EXPENSES);
  const [hubDocuments, setHubDocuments] = useState<ERPDocument[]>(INITIAL_DOCUMENTS);
  const [activeHubDocument, setActiveHubDocument] = useState<ERPDocument | null>(null);
  const [tasks, setTasks] = useState<AgencyTask[]>(INITIAL_AGENCY_TASKS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [portalClientId, setPortalClientId] = useState<string>('cli-1');
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
        if (parsed.leadActivities?.length) setLeadActivities(parsed.leadActivities);
        if (parsed.projects?.length) setProjects(parsed.projects);
        if (parsed.documents?.length) setDocuments(parsed.documents);
        if (parsed.payments?.length) setPayments(parsed.payments);
        if (parsed.expenses?.length) setExpenses(parsed.expenses);
        if (parsed.hubDocuments?.length) setHubDocuments(parsed.hubDocuments);
        if (parsed.tasks?.length) setTasks(parsed.tasks);
        if (parsed.tickets?.length) setTickets(parsed.tickets);
        if (parsed.portalClientId) setPortalClientId(parsed.portalClientId);
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
        JSON.stringify({
          clients,
          leads,
          leadActivities,
          projects,
          documents,
          payments,
          expenses,
          hubDocuments,
          tasks,
          tickets,
          portalClientId,
        })
      );
    } catch {
      /* ignore */
    }
  }, [clients, leads, leadActivities, projects, documents, payments, expenses, hubDocuments, tasks, tickets, portalClientId, hydrated]);

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
    [ clients, leads, leadActivities, projects, documents.length, navigate, showToast]
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

  const createHubDocument = useCallback(
    (docData: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt' | 'version'>): ERPDocument => {
      const newDoc: ERPDocument = {
        ...docData,
        id: `hub-${Date.now()}`,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setHubDocuments((prev) => [newDoc, ...prev]);
      return newDoc;
    },
    []
  );

  const updateHubDocument = useCallback((id: string, updates: Partial<ERPDocument>) => {
    setHubDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString() } : doc
      )
    );
  }, []);

  const deleteHubDocument = useCallback((id: string) => {
    setHubDocuments((prev) => prev.filter((d) => d.id !== id));
    setActiveHubDocument((cur) => (cur?.id === id ? null : cur));
  }, []);

  const updateHubDocumentStatus = useCallback((id: string, status: DocumentStatus) => {
    setHubDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status, updatedAt: new Date().toISOString() } : doc
      )
    );
  }, []);

  const duplicateHubDocument = useCallback(
    (id: string): ERPDocument => {
      const original = hubDocuments.find((d) => d.id === id);
      if (!original) throw new Error('Original document not found');
      const prefixMap: Record<HubDocType, string> = {
        invoice: 'INV',
        receipt: 'REC',
        quotation: 'QT',
        proposal: 'PROP',
      };
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const duplicatedDoc: ERPDocument = {
        ...original,
        id: `hub-${Date.now()}`,
        docNumber: `${prefixMap[original.type]}-2026-${randomNum}`,
        status: 'draft',
        version: 1,
        parentDocumentId: original.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setHubDocuments((prev) => [duplicatedDoc, ...prev]);
      return duplicatedDoc;
    },
    [hubDocuments]
  );

  const convertHubDocument = useCallback(
    (id: string, targetType: HubDocType): ERPDocument => {
      const source = hubDocuments.find((d) => d.id === id);
      if (!source) throw new Error('Source document not found');
      const prefixMap: Record<HubDocType, string> = {
        invoice: 'INV',
        receipt: 'REC',
        quotation: 'QT',
        proposal: 'PROP',
      };
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const convertedDoc: ERPDocument = {
        ...source,
        id: `hub-${Date.now()}`,
        docNumber: `${prefixMap[targetType]}-2026-${randomNum}`,
        type: targetType,
        status: targetType === 'receipt' ? 'paid' : 'draft',
        convertedFromType: source.type,
        parentDocumentId: source.id,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setHubDocuments((prev) => [convertedDoc, ...prev]);
      showToast(`Converted to ${targetType}`);
      return convertedDoc;
    },
    [hubDocuments, showToast]
  );

  const addSignatureToHubDocument = useCallback(
    (
      id: string,
      signerName: string,
      signerTitle: string,
      signerEmail: string,
      signatureDataUrl?: string
    ) => {
      setHubDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                signature: {
                  id: `sig-${Date.now()}`,
                  signerName,
                  signerTitle,
                  signerEmail,
                  signatureDataUrl,
                  signedAt: new Date().toISOString(),
                },
                status: 'accepted' as DocumentStatus,
                updatedAt: new Date().toISOString(),
              }
            : doc
        )
      );
    },
    []
  );

  const getHubDocsForClient = useCallback(
    (clientId: string) => {
      const client = clients.find((c) => c.id === clientId);
      return hubDocuments.filter(
        (d) =>
          d.clientId === clientId ||
          (!!client && (d.clientCompany === client.company || d.clientEmail === client.email))
      );
    },
    [hubDocuments, clients]
  );

  const getHubDocsForProject = useCallback(
    (projectId: string) => hubDocuments.filter((d) => d.projectId === projectId),
    [hubDocuments]
  );

  const addTask = useCallback(
    (input: Omit<AgencyTask, 'id' | 'createdAt' | 'completed'> & { completed?: boolean }) => {
      const completed = input.completed ?? false;
      const task: AgencyTask = {
        ...input,
        id: `task-${Date.now()}`,
        createdAt: today(),
        completed,
        status: input.status ?? (completed ? 'done' : 'todo'),
      };
      setTasks((prev) => [task, ...prev]);
      showToast('Task created');
      return task;
    },
    [showToast]
  );

  const updateTask = useCallback((task: AgencyTask) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const completed = !t.completed;
        return { ...t, completed, status: completed ? 'done' : t.status === 'done' ? 'todo' : t.status };
      })
    );
  }, []);

  const addTicket = useCallback(
    (
      input: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages' | 'status'> & {
        messages?: SupportTicket['messages'];
        status?: SupportTicket['status'];
      }
    ) => {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const ticket: SupportTicket = {
        ...input,
        id: `tkt-${Date.now()}`,
        ticketNumber: `TKT-2026-${String(tickets.length + 401)}`,
        status: input.status || 'Open',
        createdAt: now,
        updatedAt: now,
        messages: input.messages || [],
      };
      setTickets((prev) => [ticket, ...prev]);
      showToast('Support ticket opened');
      return ticket;
    },
    [tickets.length, showToast]
  );

  const replyToTicket = useCallback((ticketId: string, text: string, isClient = true, sender = 'Client') => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              updatedAt: now,
              status: t.status === 'Resolved' ? t.status : 'In Progress',
              messages: [
                ...t.messages,
                { id: `tm-${Date.now()}`, sender, isClient, text, timestamp: now },
              ],
            }
          : t
      )
    );
  }, []);

  const getPortalBundle = useCallback(
    (clientId?: string) => {
      const id = clientId || portalClientId;
      const client = clients.find((c) => c.id === id) || clients[0];
      const profile: ClientProfile = {
        id: client?.id || 'cli-unknown',
        name: client?.name || 'Guest',
        company: client?.company || 'Client',
        email: client?.email || '',
        phone: client?.phone || '',
        tier: (client?.mrr || 0) >= 150000 ? 'Enterprise' : (client?.mrr || 0) > 0 ? 'Growth' : 'Standard',
        accountNumber: `ACC-${(client?.id || 'X').toUpperCase()}`,
        balanceDue: documents
          .filter(
            (d) =>
              d.docType === 'invoice' &&
              d.status !== 'paid' &&
              (d.clientId === client?.id || d.clientName === client?.company)
          )
          .reduce((s, d) => s + d.totalAmount, 0),
        currency: 'PKR',
        accountManager: {
          name: client?.accountManager || 'Sarah Connor',
          role: 'Account Manager',
          email: 'hello@omnysync.io',
          avatar: '',
        },
      };

      const projectsForClient: ClientProject[] = getProjectsForClient(client?.id || '').map((p) => ({
        id: p.id,
        name: p.title,
        code: p.id.toUpperCase(),
        status:
          p.progressPercent >= 100 ? 'Completed' : p.progressPercent >= 80 ? 'In Review' : 'In Progress',
        progress: p.progressPercent,
        currentPhase: p.category,
        startDate: p.deadline,
        targetDate: p.deadline,
        leadDeveloper: p.team[0]?.name || 'OMNYSYNC Team',
        budget: p.budget,
        spent: p.spent,
        milestones: (p.tasks || []).slice(0, 4).map((t) => ({
          id: t.id,
          title: t.title,
          dueDate: t.dueDate,
          completed: t.completed,
        })),
      }));

      const invoices: ClientInvoice[] = documents
        .filter(
          (d) =>
            d.docType === 'invoice' &&
            (d.clientId === client?.id || d.clientName === client?.company)
        )
        .map((d) => ({
          id: d.id,
          invoiceNumber: d.docNumber,
          issueDate: d.issueDate,
          dueDate: d.dueDate,
          amount: d.totalAmount,
          status:
            d.status === 'paid'
              ? 'Paid'
              : d.status === 'expired'
                ? 'Overdue'
                : 'Pending',
          description: d.title,
          items: d.items.map((it) => ({
            description: it.description,
            quantity: it.qty,
            unitPrice: it.unitPrice,
            total: it.total,
          })),
          paidDate: d.status === 'paid' ? d.dueDate : undefined,
          paymentMethod: d.status === 'paid' ? 'Bank Transfer' : undefined,
        }));

      const files: ClientSharedFile[] = getHubDocsForClient(client?.id || '').map((d) => ({
        id: d.id,
        name: `${d.docNumber} — ${d.type}.pdf`,
        size: 'PDF',
        type: d.type,
        uploadedAt: (d.updatedAt || d.issueDate || '').slice(0, 10),
        uploadedBy: 'OMNYSYNC',
        category:
          d.type === 'proposal' || d.type === 'quotation'
            ? 'Specification'
            : d.type === 'invoice' || d.type === 'receipt'
              ? 'Contract'
              : 'Deliverable',
      }));

      const clientTickets = tickets.filter((t) => !t.clientId || t.clientId === client?.id);

      const activities: ActivityEvent[] = [
        ...invoices.slice(0, 3).map((inv, idx) => ({
          id: `act-inv-${idx}`,
          type: 'invoice' as const,
          title: `Invoice ${inv.invoiceNumber}`,
          description: `${inv.status} · PKR ${inv.amount.toLocaleString()}`,
          timestamp: inv.issueDate,
          badge: inv.status,
        })),
        ...projectsForClient.slice(0, 2).map((pr, idx) => ({
          id: `act-pr-${idx}`,
          type: 'project' as const,
          title: pr.name,
          description: `${pr.progress}% · ${pr.currentPhase}`,
          timestamp: pr.targetDate,
          badge: pr.status,
        })),
      ];

      return {
        profile,
        projects: projectsForClient,
        invoices,
        files,
        tickets: clientTickets.length ? clientTickets : tickets,
        activities,
      };
    },
    [portalClientId, clients, documents, tickets, getProjectsForClient, getHubDocsForClient]
  );

  const agencyMetrics = useMemo(() => {
    const activeClients = clients.filter((c) => c.status === 'Active' || c.status === 'Onboarding').length;
    const mrr = clients
      .filter((c) => c.status === 'Active' || c.status === 'Onboarding')
      .reduce((s, c) => s + c.mrr, 0);
    const pipelineValue = leads
      .filter((l) => l.status !== 'Converted' && l.status !== 'Lost')
      .reduce((s, l) => s + (l.estimatedValue || 0), 0);
    const openProjects = projects.filter((p) => p.progressPercent < 100).length;
    const invoicesList = documents.filter((d) => d.docType === 'invoice');
    const receivables = invoicesList
      .filter((d) => d.status === 'sent' || d.status === 'draft')
      .reduce((s, d) => s + d.totalAmount, 0);
    const collected = payments.reduce((s, p) => s + p.amount, 0);
    const expensesTotal = expenses.reduce((s, e) => s + e.amount, 0);
    const openTasks = tasks.filter((t) => !t.completed).length;
    const quotesOpen = documents.filter(
      (d) =>
        (d.docType === 'quotation' || d.docType === 'proposal') &&
        (d.status === 'draft' || d.status === 'sent')
    ).length;
    const invoicesPaid = invoicesList.filter((d) => d.status === 'paid').length;
    return {
      activeClients,
      mrr,
      pipelineValue,
      openProjects,
      receivables,
      collected,
      expensesTotal,
      openTasks,
      quotesOpen,
      invoicesPaid,
    };
  }, [clients, leads, projects, documents, payments, expenses, tasks]);


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

  const importLeads = useCallback((incoming: LeadCard[]) => {
    if (!incoming.length) return;
    setLeads((prev) => {
      const emails = new Set(prev.map((l) => (l.email || '').toLowerCase()).filter(Boolean));
      const phones = new Set(prev.map((l) => (l.phone || '').replace(/\D/g, '')).filter(Boolean));
      const next = [...prev];
      for (const lead of incoming) {
        const email = (lead.email || '').toLowerCase();
        const phone = (lead.phone || '').replace(/\D/g, '');
        if (email && emails.has(email)) continue;
        if (phone && phones.has(phone)) continue;
        next.push(lead);
        if (email) emails.add(email);
        if (phone) phones.add(phone);
      }
      return next;
    });
    const stamp = new Date().toISOString();
    setLeadActivities((prev) => [
      {
        id: `act-import-${Date.now()}`,
        leadId: incoming[0]?.id || 'import',
        type: 'import',
        content: `Imported ${incoming.length} lead(s) via bulk CSV/TSV.`,
        createdAt: stamp,
      },
      ...prev,
    ]);
    showToast(`Imported ${incoming.length} lead(s)`);
  }, [showToast]);

  
  const importClients = useCallback(
    (incoming: AgencyClient[]) => {
      if (!incoming.length) return;
      setClients((prev) => {
        const emails = new Set(prev.map((c) => c.email.toLowerCase()).filter(Boolean));
        const companies = new Set(prev.map((c) => c.company.toLowerCase()).filter(Boolean));
        const next = [...prev];
        for (const c of incoming) {
          const email = (c.email || '').toLowerCase();
          const company = (c.company || '').toLowerCase();
          if (email && emails.has(email)) continue;
          if (company && companies.has(company)) continue;
          next.push(c);
          if (email) emails.add(email);
          if (company) companies.add(company);
        }
        return next;
      });
      showToast(`Imported ${incoming.length} client(s)`);
    },
    [showToast]
  );

const addLeadActivity = useCallback(
    (activity: Omit<LeadActivity, 'id' | 'createdAt'> & { createdAt?: string }) => {
      const row: LeadActivity = {
        ...activity,
        id: `act-${Date.now()}-${Math.floor(Math.random() * 999)}`,
        createdAt: activity.createdAt || new Date().toISOString(),
      };
      setLeadActivities((prev) => [row, ...prev]);
      return row;
    },
    []
  );

  const getLeadActivities = useCallback(
    (leadId: string) => leadActivities.filter((a) => a.leadId === leadId),
    [leadActivities]
  );

  const logCall = useCallback(
    (input: { leadId: string; outcome: CallOutcome; notes: string; durationSec?: number }) => {
      const row = addLeadActivity({
        leadId: input.leadId,
        type: 'call',
        outcome: input.outcome,
        content: input.notes || `Call outcome: ${input.outcome}`,
        durationSec: input.durationSec,
      });
      setLeads((prev) =>
        prev.map((l) =>
          l.id === input.leadId && (!l.status || l.status === 'New')
            ? { ...l, status: 'Contacted' }
            : l
        )
      );
      showToast(`Call logged — ${input.outcome.replace('_', ' ')}`);
      return row;
    },
    [addLeadActivity, showToast]
  );

  const getTasksForProject = useCallback(
    (projectId: string) => tasks.filter((t) => t.projectId === projectId),
    [tasks]
  );

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
      importLeads,
      importClients,
      leadActivities,
      addLeadActivity,
      getLeadActivities,
      logCall,
      getClient,
      getProjectsForClient,
      getDocsForClient,
      getDocsForProject,
      hubDocuments,
      activeHubDocument,
      setActiveHubDocument,
      createHubDocument,
      updateHubDocument,
      deleteHubDocument,
      updateHubDocumentStatus,
      duplicateHubDocument,
      convertHubDocument,
      addSignatureToHubDocument,
      getHubDocsForClient,
      getHubDocsForProject,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      getTasksForProject,
      portalClientId,
      setPortalClientId,
      tickets,
      addTicket,
      replyToTicket,
      getPortalBundle,
      agencyMetrics,
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
      hubDocuments,
      activeHubDocument,
      createHubDocument,
      updateHubDocument,
      deleteHubDocument,
      updateHubDocumentStatus,
      duplicateHubDocument,
      convertHubDocument,
      addSignatureToHubDocument,
      getHubDocsForClient,
      getHubDocsForProject,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      portalClientId,
      tickets,
      addTicket,
      replyToTicket,
      getPortalBundle,
      agencyMetrics,
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
