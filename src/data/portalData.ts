export interface ClientProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  tier: 'Enterprise' | 'Growth' | 'Standard';
  accountNumber: string;
  balanceDue: number;
  currency: string;
  accountManager: {
    name: string;
    role: string;
    email: string;
    avatar: string;
  };
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  description: string;
  items: InvoiceItem[];
  paidDate?: string;
  paymentMethod?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  notes?: string;
}

export interface ClientProject {
  id: string;
  name: string;
  code: string;
  status: 'In Progress' | 'In Review' | 'Completed' | 'On Hold';
  progress: number;
  currentPhase: string;
  startDate: string;
  targetDate: string;
  leadDeveloper: string;
  milestones: ProjectMilestone[];
  budget: number;
  spent: number;
}

export interface ClientSharedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  category: 'Contract' | 'Specification' | 'Deliverable' | 'Report';
  downloadUrl?: string;
}

export interface TicketMessage {
  id: string;
  sender: string;
  isClient: boolean;
  avatar?: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: 'Billing' | 'Technical' | 'Milestone Review' | 'Feature Request';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface ActivityEvent {
  id: string;
  type: 'invoice' | 'project' | 'file' | 'ticket';
  title: string;
  description: string;
  timestamp: string;
  badge: string;
}

// Initial Mock Data
export const MOCK_CLIENT_PROFILE: ClientProfile = {
  id: 'cli-8842',
  name: 'Marcus Vance',
  company: 'Vance Dynamics Global Inc.',
  email: 'm.vance@vancedynamics.com',
  phone: '+1 (555) 392-8812',
  tier: 'Enterprise',
  accountNumber: 'ACC-VD-2025',
  balanceDue: 14500.0,
  currency: 'USD',
  accountManager: {
    name: 'Elena Rostova',
    role: 'Principal ERP Solutions Lead',
    email: 'elena.r@omnysync.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
};

export const MOCK_CLIENT_PROJECTS: ClientProject[] = [
  {
    id: 'proj-01',
    name: 'Global Supply Chain Automation Suite',
    code: 'VD-ERP-Q1',
    status: 'In Progress',
    progress: 74,
    currentPhase: 'Phase 3: Multi-Warehouse ERP Integration',
    startDate: '2025-01-15',
    targetDate: '2025-05-30',
    leadDeveloper: 'Liam Henderson (Tech Lead)',
    budget: 95000,
    spent: 70300,
    milestones: [
      { id: 'm1', title: 'Architecture Review & Schema Migration', dueDate: '2025-02-10', completed: true },
      { id: 'm2', title: 'Warehouse Logistics API Endpoint Sync', dueDate: '2025-03-15', completed: true },
      { id: 'm3', title: 'Real-Time Inventory Reconciliation Engine', dueDate: '2025-04-12', completed: false, notes: 'Currently undergoing load testing' },
      { id: 'm4', title: 'User Acceptance Testing & Staging Rollout', dueDate: '2025-05-15', completed: false },
    ],
  },
  {
    id: 'proj-02',
    name: 'Customer Portal & B2B Checkout Redesign',
    code: 'VD-B2B-Q2',
    status: 'In Review',
    progress: 92,
    currentPhase: 'Phase 4: Security Audit & Sign-off',
    startDate: '2025-02-01',
    targetDate: '2025-04-20',
    leadDeveloper: 'Sophia Chen (Full-stack)',
    budget: 48000,
    spent: 44160,
    milestones: [
      { id: 'm2-1', title: 'UX Figma Wireframes & Stakeholder Approval', dueDate: '2025-02-18', completed: true },
      { id: 'm2-2', title: 'Payment Gateway (Stripe & Wire) Implementation', dueDate: '2025-03-10', completed: true },
      { id: 'm2-3', title: 'Role-Based Access Control & Single Sign-On', dueDate: '2025-03-29', completed: true },
      { id: 'm2-4', title: 'Final Pen-Testing and Penetration Report', dueDate: '2025-04-10', completed: false },
    ],
  },
];

export const MOCK_CLIENT_INVOICES: ClientInvoice[] = [
  {
    id: 'inv-1049',
    invoiceNumber: 'INV-2025-049',
    issueDate: '2025-03-15',
    dueDate: '2025-04-05',
    amount: 14500.0,
    status: 'Pending',
    description: 'Phase 3 Milestone Deliverable: Supply Chain Pipeline Sync',
    items: [
      { description: 'Sprint 5 & 6 Enterprise Backend Integration', quantity: 80, unitPrice: 125.0, total: 10000.0 },
      { description: 'Dedicated DevOps & Database Cluster Scaling', quantity: 30, unitPrice: 150.0, total: 4500.0 },
    ],
  },
  {
    id: 'inv-1038',
    invoiceNumber: 'INV-2025-038',
    issueDate: '2025-02-28',
    dueDate: '2025-03-20',
    amount: 18200.0,
    status: 'Paid',
    paidDate: '2025-03-18',
    paymentMethod: 'ACH Direct Deposit (Wire Ref #99238)',
    description: 'B2B Portal Phase 2 Completion: Payment Gateway & SSO Engine',
    items: [
      { description: 'Stripe Elements & Multi-Currency Settlement Engine', quantity: 90, unitPrice: 130.0, total: 11700.0 },
      { description: 'Enterprise SSO (Okta & Azure AD) Integration', quantity: 50, unitPrice: 130.0, total: 6500.0 },
    ],
  },
  {
    id: 'inv-1025',
    invoiceNumber: 'INV-2025-025',
    issueDate: '2025-02-01',
    dueDate: '2025-02-20',
    amount: 12500.0,
    status: 'Paid',
    paidDate: '2025-02-15',
    paymentMethod: 'Corporate Credit Card (*4199)',
    description: 'Quarterly Infrastructure Retainer & Cloud Telemetry Setup',
    items: [
      { description: 'Cloud Infrastructure Retainer (Q1 2025)', quantity: 1, unitPrice: 12500.0, total: 12500.0 },
    ],
  },
  {
    id: 'inv-1011',
    invoiceNumber: 'INV-2025-011',
    issueDate: '2025-01-10',
    dueDate: '2025-01-30',
    amount: 8400.0,
    status: 'Paid',
    paidDate: '2025-01-28',
    paymentMethod: 'ACH Wire Settlement',
    description: 'Initial Architectural Blueprint & Requirements Discovery',
    items: [
      { description: 'Solutions Architecture & Technical Specifications', quantity: 60, unitPrice: 140.0, total: 8400.0 },
    ],
  },
];

export const MOCK_SHARED_FILES: ClientSharedFile[] = [
  {
    id: 'file-01',
    name: 'Omnysync_Enterprise_SLA_VanceDynamics_2025.pdf',
    size: '2.4 MB',
    type: 'PDF',
    uploadedAt: '2025-03-20',
    uploadedBy: 'Elena Rostova (Omnysync)',
    category: 'Contract',
  },
  {
    id: 'file-02',
    name: 'Phase_3_Architecture_Data_Flow_Diagram.png',
    size: '4.8 MB',
    type: 'Image',
    uploadedAt: '2025-03-18',
    uploadedBy: 'Liam Henderson (Tech Lead)',
    category: 'Specification',
  },
  {
    id: 'file-03',
    name: 'B2B_Security_Audit_Preliminary_Signoff.pdf',
    size: '1.9 MB',
    type: 'PDF',
    uploadedAt: '2025-03-12',
    uploadedBy: 'Sophia Chen (Full-stack)',
    category: 'Deliverable',
  },
  {
    id: 'file-04',
    name: 'Monthly_Infrastructure_Telemetry_Report_Feb.xlsx',
    size: '860 KB',
    type: 'Spreadsheet',
    uploadedAt: '2025-03-02',
    uploadedBy: 'DevOps Automated Reporter',
    category: 'Report',
  },
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-401',
    ticketNumber: 'TKT-2025-401',
    title: 'Inquiry regarding webhook latency on European warehouse cluster',
    description: 'We noticed a 300ms spike in webhook callbacks during peak morning order batches from Frankfurt.',
    category: 'Technical',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2025-03-27 09:14',
    updatedAt: '2025-03-28 11:30',
    messages: [
      {
        id: 'msg-1',
        sender: 'Marcus Vance',
        isClient: true,
        text: 'Hi Elena, our EU team noted that order webhooks had higher response times around 08:00 UTC today. Can we inspect the queuing worker?',
        timestamp: '2025-03-27 09:14 AM',
      },
      {
        id: 'msg-2',
        sender: 'Elena Rostova (Omnysync Lead)',
        isClient: false,
        text: 'Good morning Marcus! We received the alert. Liam investigated and deployed 2 additional Redis worker pods in Frankfurt. Latency is back to 38ms.',
        timestamp: '2025-03-27 10:25 AM',
      },
      {
        id: 'msg-3',
        sender: 'Marcus Vance',
        isClient: true,
        text: 'Confirmed on our telemetry dashboard, metrics look silky smooth now. Thank you for the rapid turnaround!',
        timestamp: '2025-03-27 11:02 AM',
      },
      {
        id: 'msg-4',
        sender: 'Elena Rostova (Omnysync Lead)',
        isClient: false,
        text: 'Always a pleasure Marcus. We will monitor the queue through Monday before marking this ticket resolved.',
        timestamp: '2025-03-28 11:30 AM',
      },
    ],
  },
  {
    id: 'tkt-394',
    ticketNumber: 'TKT-2025-394',
    title: 'Custom CSV export field request for Q1 Audit Committee',
    description: 'Requesting addition of internal cost-center IDs in the exportable billing breakdown ledger.',
    category: 'Billing',
    priority: 'Medium',
    status: 'Resolved',
    createdAt: '2025-03-15 14:20',
    updatedAt: '2025-03-16 16:45',
    messages: [
      {
        id: 'msg-10',
        sender: 'Marcus Vance',
        isClient: true,
        text: 'Could we include Cost Center # in the invoice CSV export?',
        timestamp: '2025-03-15 02:20 PM',
      },
      {
        id: 'msg-11',
        sender: 'Elena Rostova (Omnysync Lead)',
        isClient: false,
        text: 'Done! The export template now includes Cost Center mapping. You can download the refreshed CSV directly from the Invoices tab.',
        timestamp: '2025-03-16 04:45 PM',
      },
    ],
  },
];

export const MOCK_ACTIVITY_FEED: ActivityEvent[] = [
  {
    id: 'act-1',
    type: 'invoice',
    title: 'Invoice INV-2025-049 Issued',
    description: 'Phase 3 Milestone Deliverable invoice generated for $14,500.00 due April 5.',
    timestamp: '2 hours ago',
    badge: 'Billing',
  },
  {
    id: 'act-2',
    type: 'project',
    title: 'Milestone Completed',
    description: 'Warehouse Logistics API Endpoint Sync reached 100% completion.',
    timestamp: '1 day ago',
    badge: 'Project Update',
  },
  {
    id: 'act-3',
    type: 'file',
    title: 'New Document Uploaded',
    description: 'Omnysync_Enterprise_SLA_VanceDynamics_2025.pdf was added to Shared Files.',
    timestamp: '3 days ago',
    badge: 'Deliverables',
  },
  {
    id: 'act-4',
    type: 'ticket',
    title: 'Ticket TKT-2025-401 Response',
    description: 'Elena Rostova responded to latency inquiry: EU Redis cluster scaled.',
    timestamp: 'Yesterday',
    badge: 'Support',
  },
];
