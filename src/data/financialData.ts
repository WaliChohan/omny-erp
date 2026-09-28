// ─── OMNYSYNC Agency Billing Data (slim) ─────────────────────────────────────
// COA / ledger / voucher seeds removed — Agency Billing uses quotes, invoices,
// payments, and expenses via AgencyContext + billingData.

export function formatPKR(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rs. 0';
  
  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    if (abs >= 10000000) {
      // 1 Crore (10M)
      return `${sign}Rs. ${(abs / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 1000000) {
      // 1 Million
      return `${sign}PKR ${(abs / 1000000).toFixed(2)}M`;
    }
    if (abs >= 1000) {
      return `${sign}PKR ${(abs / 1000).toFixed(1)}k`;
    }
  }

  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

// ─── Commercial Documents Suite ──────────────────────────────────────────────

export type DocumentType =
  | 'invoice'
  | 'receipt'
  | 'quotation'
  | 'proposal'
  | 'sow'
  | 'po';

export interface DocumentLineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number; // in PKR
  total: number; // in PKR
}

export interface CommercialDocument {
  id: string;
  docType: DocumentType;
  docNumber: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'approved' | 'expired';
  items: DocumentLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount?: number;
  totalAmount: number;
  notes?: string;
  terms?: string;
  projectId?: string;
  projectName?: string;
  clientId?: string;
  leadId?: string;
}

export const COMMERCIAL_DOCUMENTS: CommercialDocument[] = [
  {
    id: 'doc-inv-101',
    docType: 'invoice',
    clientId: 'cli-1',
    docNumber: 'INV-2025-0101',
    title: 'Enterprise ERP Implementation - Milestone 1',
    clientName: 'CoolAir Pros',
    clientEmail: 'james@coolairpros.com',
    clientAddress: '100 Silicon Ave, Suite 400 & Lahore Tech Park',
    issueDate: '2025-04-01',
    dueDate: '2025-04-15',
    currency: 'PKR',
    status: 'paid',
    projectId: 'p-1',
    projectName: 'CoolAir Pros — Booking Portal',
    items: [
      { id: 'i1', description: 'Core Next.js & PostgreSQL Multi-tenant Schemas', qty: 1, unitPrice: 1600000, total: 1600000 },
      { id: 'i2', description: 'Double-Entry General Ledger & Real-time Chart of Accounts', qty: 1, unitPrice: 1250000, total: 1250000 },
    ],
    subtotal: 2850000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 2850000,
    notes: 'Thank you for your business. Payment received via Direct Wire Transfer.',
    terms: 'Standard Net 15 Days. Governed by Omnysync Master Services Agreement.',
  },
  {
    id: 'doc-inv-102',
    docType: 'invoice',
    docNumber: 'INV-2025-0102',
    title: 'Monthly Dedicated Engineering Retainer (April 2025)',
    clientName: 'FinTech Velocity UK',
    clientEmail: 'accounts@fintechvelocity.io',
    clientAddress: 'London UK / Clifton Karachi',
    issueDate: '2025-04-01',
    dueDate: '2025-04-10',
    currency: 'PKR',
    status: 'paid',
    projectId: 'p-2',
    projectName: 'FinTech Velocity Mobile & API',
    items: [
      { id: 'i3', description: '3 Senior Fullstack Engineers & UI/UX Design System Lead', qty: 1, unitPrice: 1450000, total: 1450000 },
    ],
    subtotal: 1450000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 1450000,
    notes: 'Monthly recurring retainer invoice for April sprint cycle.',
    terms: 'Monthly rolling retainer payable on the 1st week of each billing month.',
  },
  {
    id: 'doc-rec-201',
    docType: 'receipt',
    docNumber: 'REC-2025-0044',
    title: 'Official Payment Receipt #0044',
    clientName: 'Acme Global Corp',
    clientEmail: 'billing@acmeglobal.com',
    issueDate: '2025-04-02',
    dueDate: '2025-04-02',
    currency: 'PKR',
    status: 'paid',
    projectId: 'p-1',
    projectName: 'Enterprise ERP Platform',
    items: [
      { id: 'r1', description: 'Settlement for Invoice #INV-2025-0101 (Meezan Ref #99218)', qty: 1, unitPrice: 2850000, total: 2850000 },
    ],
    subtotal: 2850000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 2850000,
    notes: 'Official Electronic Receipt — Cleared and Reconciled by Meezan Bank Ltd.',
  },
  {
    id: 'doc-sow-501',
    docType: 'sow',
    docNumber: 'SOW-2025-0034',
    title: 'Statement of Work: Design System & NPM Component Kit',
    clientName: 'Meta Ecosystems Hub',
    clientEmail: 'design-systems@meta.com',
    issueDate: '2025-03-25',
    dueDate: '2025-04-30',
    currency: 'PKR',
    status: 'approved',
    projectId: 'p-3',
    projectName: 'Design System & Component Kit',
    items: [
      { id: 's1', description: 'Design Token Hierarchy & Tailwind CSS 4 Variables', qty: 1, unitPrice: 850000, total: 850000 },
      { id: 's2', description: 'Accessible Component Stems (40 Production Components)', qty: 1, unitPrice: 750000, total: 750000 },
      { id: 's3', description: 'Storybook Automated Visual Regression & NPM CI/CD', qty: 1, unitPrice: 350000, total: 350000 },
    ],
    subtotal: 1950000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 1950000,
    notes: 'Approved Statement of Work for Sprint 1 & 2 deliverable milestones.',
    terms: 'Governed by Master Agreement. 50% upfront, 50% on QA acceptance.',
  },
  {
    id: 'doc-prop-401',
    docType: 'proposal',
    docNumber: 'PROP-2025-0012',
    title: 'Omnysync Enterprise Fleet Logistics Proposal',
    clientName: 'Apex Global Logistics',
    clientEmail: 'contracts@apexlogistics.com',
    issueDate: '2025-04-05',
    dueDate: '2025-05-01',
    currency: 'PKR',
    status: 'sent',
    items: [
      { id: 'p1', description: 'Phase 1: Real-time Multi-carrier Fleet Tracking Engine', qty: 1, unitPrice: 2200000, total: 2200000 },
      { id: 'p2', description: 'Phase 2: Automated Dispatch & Route Optimization AI', qty: 1, unitPrice: 1800000, total: 1800000 },
      { id: 'p3', description: 'Phase 3: 24/7 SLA Enterprise Support (Annualized)', qty: 1, unitPrice: 900000, total: 900000 },
    ],
    subtotal: 4900000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 4900000,
    notes: 'Commercial modernization proposal prepared by Omnysync Solutions Team.',
    terms: 'Proposal valid for 30 days. Subject to signed Statement of Work.',
  },
];

