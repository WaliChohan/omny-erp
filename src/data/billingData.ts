import { formatPKR } from '@/data/financialData';

export type PaymentMethod = 'Bank Transfer' | 'Card' | 'Cash' | 'Payoneer' | 'Other';
export type ExpenseCategory =
  | 'Software'
  | 'Contractors'
  | 'Ads'
  | 'Travel'
  | 'Office'
  | 'Payroll'
  | 'Other';

export interface AgencyPayment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId?: string;
  clientName: string;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  note?: string;
}

export interface AgencyExpense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  vendor: string;
  spentAt: string;
  projectId?: string;
  clientId?: string;
  status: 'recorded' | 'reimbursed';
  note?: string;
}

export const INITIAL_PAYMENTS: AgencyPayment[] = [
  {
    id: 'pay-1',
    invoiceId: 'doc-inv-101',
    invoiceNumber: 'INV-2025-0101',
    clientId: 'cli-1',
    clientName: 'CoolAir Pros',
    amount: 2850000,
    method: 'Bank Transfer',
    paidAt: '2025-04-12',
    note: 'Milestone 1 paid in full',
  },
];

export const INITIAL_EXPENSES: AgencyExpense[] = [
  {
    id: 'exp-1',
    title: 'Vercel + OpenAI stack',
    category: 'Software',
    amount: 185000,
    vendor: 'SaaS vendors',
    spentAt: '2026-09-05',
    status: 'recorded',
  },
  {
    id: 'exp-2',
    title: 'Contract SEO specialist (Apex)',
    category: 'Contractors',
    amount: 220000,
    vendor: 'Freelance',
    spentAt: '2026-09-12',
    projectId: undefined,
    clientId: 'cli-3',
    status: 'recorded',
  },
  {
    id: 'exp-3',
    title: 'Google Ads — HVAC lead gen',
    category: 'Ads',
    amount: 95000,
    vendor: 'Google Ads',
    spentAt: '2026-09-20',
    status: 'recorded',
  },
];

export { formatPKR };
