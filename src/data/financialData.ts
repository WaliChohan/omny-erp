// ─── Omnysync Financial Data Layer (PKR Standards) ──────────────────────────

export type FinanceCategoryType =
  | 'project_revenue'
  | 'recurring_revenue'
  | 'salary_employee'
  | 'salary_founder'
  | 'founder_equity'
  | 'saas_subscription'
  | 'opex_general'
  | 'transfer';

export interface FinanceCategoryMeta {
  type: FinanceCategoryType;
  label: string;
  badgeColor: string;
  iconName: string;
  defaultFlow: 'income' | 'expense' | 'transfer';
}

export const FINANCE_CATEGORY_CONFIG: Record<FinanceCategoryType, FinanceCategoryMeta> = {
  project_revenue: {
    type: 'project_revenue',
    label: 'Project One-Time Payment',
    badgeColor: 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30',
    iconName: 'briefcase',
    defaultFlow: 'income',
  },
  recurring_revenue: {
    type: 'recurring_revenue',
    label: 'Client Retainer / SaaS (MRR)',
    badgeColor: 'bg-[#2dd4bf]/15 text-[#2dd4bf] border-[#2dd4bf]/30',
    iconName: 'repeat',
    defaultFlow: 'income',
  },
  salary_employee: {
    type: 'salary_employee',
    label: 'Employee Salaries & Payroll',
    badgeColor: 'bg-[#818cf8]/15 text-[#818cf8] border-[#818cf8]/30',
    iconName: 'users',
    defaultFlow: 'expense',
  },
  salary_founder: {
    type: 'salary_founder',
    label: 'Founder Salaries',
    badgeColor: 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30',
    iconName: 'crown',
    defaultFlow: 'expense',
  },
  founder_equity: {
    type: 'founder_equity',
    label: 'Founder Equity / Dividend Draw',
    badgeColor: 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30',
    iconName: 'shield',
    defaultFlow: 'expense',
  },
  saas_subscription: {
    type: 'saas_subscription',
    label: 'SaaS & Cloud Subscriptions',
    badgeColor: 'bg-[#f43f5e]/15 text-[#fb7185] border-[#f43f5e]/30',
    iconName: 'server',
    defaultFlow: 'expense',
  },
  opex_general: {
    type: 'opex_general',
    label: 'General Operating Expense',
    badgeColor: 'bg-[#9ca3af]/15 text-[#d1d5db] border-[#9ca3af]/30',
    iconName: 'building',
    defaultFlow: 'expense',
  },
  transfer: {
    type: 'transfer',
    label: 'Internal Bank Transfer',
    badgeColor: 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30',
    iconName: 'arrow-right-left',
    defaultFlow: 'transfer',
  },
};

/**
 * Currency Formatter for Pakistani Rupees (PKR)
 */
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

export interface COANode {
  code: string;
  name: string;
  level: 1 | 2 | 3 | 4;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
  currency: string;
  children?: COANode[];
}

export interface LedgerEntry {
  id: string;
  date: string;
  voucherNo: string;
  voucherType: 'JV' | 'PV' | 'RV' | 'SV';
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  status: 'Posted' | 'Pending' | 'Reconciled';
}

export interface VoucherItem {
  id: string;
  voucherNo: string;
  type: 'Journal Voucher' | 'Payment Voucher' | 'Receipt Voucher' | 'Sales Voucher';
  date: string;
  entityName: string;
  totalAmount: number;
  status: 'Approved' | 'Draft' | 'Audited';
  preparedBy: string;
  linesCount: number;
}

export interface SOARow {
  id: string;
  date: string;
  refNo: string;
  description: string;
  debit: number;
  credit: number;
  runningBalance: number;
}

export interface SimpleBookkeepingEntry {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  categoryType: FinanceCategoryType;
  category: string;
  entity: string; // Customer, Vendor, Employee, Founder, Bank
  amount: number; // In PKR
  taxAmount: number; // In PKR (FBR / WHT)
  paymentMethod: 'Meezan Bank' | 'HBL Bank' | 'Standard Chartered' | 'Payoneer / Wise' | 'Cash / Cheque' | 'Credit Card';
  date: string;
  status: 'cleared' | 'pending' | 'reconciled';
  notes: string;
  referenceDocId?: string;
  projectId?: string;
  projectName?: string;
}

// ─── Initial PKR Seed Data ───────────────────────────────────────────────────

export const INITIAL_BOOKKEEPING_ENTRIES_PKR: SimpleBookkeepingEntry[] = [
  // 1. Project One-Time Payment
  {
    id: 'sbe-1',
    type: 'income',
    categoryType: 'project_revenue',
    category: 'Enterprise ERP Implementation',
    entity: 'Acme Global Corp (US/PK)',
    amount: 2850000,
    taxAmount: 0,
    paymentMethod: 'Payoneer / Wise',
    date: '2025-04-02',
    status: 'reconciled',
    notes: 'Milestone 1 Core Architecture & Multi-tenant Schema Delivery',
    referenceDocId: 'doc-inv-101',
    projectName: 'Acme ERP Suite',
  },
  // 2. Client Recurring Retainer (MRR)
  {
    id: 'sbe-2',
    type: 'income',
    categoryType: 'recurring_revenue',
    category: 'Monthly Dedicated Team Retainer',
    entity: 'FinTech Velocity UK',
    amount: 1450000,
    taxAmount: 0,
    paymentMethod: 'Meezan Bank',
    date: '2025-04-03',
    status: 'reconciled',
    notes: 'Monthly Retainer for 3 Senior Engineers & UI Lead (April 2025)',
    referenceDocId: 'doc-inv-102',
    projectName: 'FinTech Velocity Mobile & API',
  },
  // 3. Employee Salaries (Staff Payroll)
  {
    id: 'sbe-3',
    type: 'expense',
    categoryType: 'salary_employee',
    category: 'Engineering & Design Team Salaries',
    entity: 'Staff Payroll Disbursement (8 Team Members)',
    amount: 1850000,
    taxAmount: 92500,
    paymentMethod: 'HBL Bank',
    date: '2025-04-05',
    status: 'reconciled',
    notes: 'Monthly staff salaries: Lead Fullstack, DevOps, 3 Mobile Devs, QA, 2 UI/UX Designers (WHT deducted)',
  },
  // 4. Founder Salaries
  {
    id: 'sbe-4',
    type: 'expense',
    categoryType: 'salary_founder',
    category: 'Co-Founders Monthly Remuneration',
    entity: 'CEO & CTO Executive Compensation',
    amount: 900000,
    taxAmount: 45000,
    paymentMethod: 'Meezan Bank',
    date: '2025-04-05',
    status: 'reconciled',
    notes: 'Founder executive base: Rs. 450,000 for CEO & Rs. 450,000 for CTO',
  },
  // 5. Founder Equity / Dividend Distribution
  {
    id: 'sbe-5',
    type: 'expense',
    categoryType: 'founder_equity',
    category: 'Quarterly Profit Equity Distribution',
    entity: 'Founding Partners Dividend Draw',
    amount: 1200000,
    taxAmount: 180000,
    paymentMethod: 'Meezan Bank',
    date: '2025-04-06',
    status: 'cleared',
    notes: 'Q1 2025 Net Profit Dividend Draw split according to 50/50 cap table equity',
  },
  // 6. Expensive SaaS & Cloud Subscriptions (AWS, OpenAI, GitHub, Figma)
  {
    id: 'sbe-6',
    type: 'expense',
    categoryType: 'saas_subscription',
    category: 'Cloud Infrastructure & AI Models',
    entity: 'AWS Cloud & OpenAI API Platform',
    amount: 485000,
    taxAmount: 0,
    paymentMethod: 'Credit Card',
    date: '2025-04-07',
    status: 'reconciled',
    notes: 'AWS US-East Kubernetes Cluster, RDS PostgreSQL, OpenAI GPT-4o & Anthropic API compute',
  },
  // 7. SaaS Subscriptions (Developer Tools & Team Seats)
  {
    id: 'sbe-7',
    type: 'expense',
    categoryType: 'saas_subscription',
    category: 'Developer Tooling & Enterprise Seats',
    entity: 'GitHub Enterprise, Figma, Cursor, Slack & Google Workspace',
    amount: 165000,
    taxAmount: 0,
    paymentMethod: 'Credit Card',
    date: '2025-04-08',
    status: 'reconciled',
    notes: 'Monthly developer productivity software and Google Workspace business org seats',
  },
  // 8. Project One-Time Payment 2
  {
    id: 'sbe-8',
    type: 'income',
    categoryType: 'project_revenue',
    category: 'Custom Design System & NPM Component Kit',
    entity: 'Meta Ecosystems Hub',
    amount: 1950000,
    taxAmount: 0,
    paymentMethod: 'Payoneer / Wise',
    date: '2025-04-10',
    status: 'cleared',
    notes: 'Sprint 2 Deliverable: Tailwind CSS 4 token architecture and Storybook test suite',
    referenceDocId: 'doc-sow-501',
    projectName: 'Design System & Component Kit',
  },
  // 9. Client Recurring Retainer (MRR 2)
  {
    id: 'sbe-9',
    type: 'income',
    categoryType: 'recurring_revenue',
    category: 'SaaS Enterprise Maintenance SLA',
    entity: 'Apex Global Logistics',
    amount: 750000,
    taxAmount: 0,
    paymentMethod: 'Meezan Bank',
    date: '2025-04-11',
    status: 'cleared',
    notes: 'Monthly 24/7 SLA uptime and carrier routing optimization support',
    referenceDocId: 'doc-prop-401',
  },
  // 10. General Operating Expenses (Office & Compliance)
  {
    id: 'sbe-10',
    type: 'expense',
    categoryType: 'opex_general',
    category: 'Office Space & High-Speed Optical Fiber',
    entity: 'Tech Park Lahore Management',
    amount: 320000,
    taxAmount: 32000,
    paymentMethod: 'HBL Bank',
    date: '2025-04-12',
    status: 'reconciled',
    notes: 'Monthly premises rent, 500Mbps dedicated fiber internet, and standby generator fuel',
  },
  // 11. Internal Bank Transfer
  {
    id: 'sbe-11',
    type: 'transfer',
    categoryType: 'transfer',
    category: 'Liquidity Sweep to Treasury Yield Reserve',
    entity: 'Meezan Operating A/C -> SCB Treasury Reserve',
    amount: 1500000,
    taxAmount: 0,
    paymentMethod: 'Standard Chartered',
    date: '2025-04-14',
    status: 'cleared',
    notes: 'Transferred surplus monthly cash to high-yield sovereign treasury reserve',
  },
];

// ─── 4-Level Chart of Accounts (PKR Standardized) ─────────────────────────────

export const CHART_OF_ACCOUNTS_4LEVEL: COANode[] = [
  {
    code: '1000',
    name: 'ASSETS (اثاثہ جات)',
    level: 1,
    type: 'Asset',
    balance: 24550000,
    currency: 'PKR',
    children: [
      {
        code: '1100',
        name: 'Current Assets & Liquidity',
        level: 2,
        type: 'Asset',
        balance: 19800000,
        currency: 'PKR',
        children: [
          {
            code: '1110',
            name: 'Cash & Bank Balances',
            level: 3,
            type: 'Asset',
            balance: 14950000,
            currency: 'PKR',
            children: [
              { code: '1111', name: 'Petty Cash - Lahore Office', level: 4, type: 'Asset', balance: 150000, currency: 'PKR' },
              { code: '1112', name: 'Meezan Bank Operating A/C #0289', level: 4, type: 'Asset', balance: 6850000, currency: 'PKR' },
              { code: '1113', name: 'HBL Corporate Payroll A/C #9102', level: 4, type: 'Asset', balance: 2450000, currency: 'PKR' },
              { code: '1114', name: 'Standard Chartered Treasury Reserve', level: 4, type: 'Asset', balance: 5500000, currency: 'PKR' },
            ],
          },
          {
            code: '1120',
            name: 'Accounts Receivable (Trade Debtors)',
            level: 3,
            type: 'Asset',
            balance: 4850000,
            currency: 'PKR',
            children: [
              { code: '1121', name: 'Domestic Enterprise Clients Receivable', level: 4, type: 'Asset', balance: 1650000, currency: 'PKR' },
              { code: '1122', name: 'Export & Foreign Clients (USD/PKR)', level: 4, type: 'Asset', balance: 3200000, currency: 'PKR' },
            ],
          },
        ],
      },
      {
        code: '1200',
        name: 'Non-Current Assets',
        level: 2,
        type: 'Asset',
        balance: 4750000,
        currency: 'PKR',
        children: [
          {
            code: '1210',
            name: 'Hardware, Workstations & Servers',
            level: 3,
            type: 'Asset',
            balance: 4750000,
            currency: 'PKR',
            children: [
              { code: '1211', name: 'MacBook Pro & Developer Workstations', level: 4, type: 'Asset', balance: 3600000, currency: 'PKR' },
              { code: '1212', name: 'Office Fixtures & High-End Furniture', level: 4, type: 'Asset', balance: 1150000, currency: 'PKR' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: '2000',
    name: 'LIABILITIES (واجبات)',
    level: 1,
    type: 'Liability',
    balance: 2850000,
    currency: 'PKR',
    children: [
      {
        code: '2100',
        name: 'Current Liabilities',
        level: 2,
        type: 'Liability',
        balance: 2850000,
        currency: 'PKR',
        children: [
          {
            code: '2110',
            name: 'Accounts Payable & SaaS Creditors',
            level: 3,
            type: 'Liability',
            balance: 650000,
            currency: 'PKR',
            children: [
              { code: '2111', name: 'AWS & Cloud Subscriptions Payable', level: 4, type: 'Liability', balance: 485000, currency: 'PKR' },
              { code: '2112', name: 'Office Services & Vendor Bills', level: 4, type: 'Liability', balance: 165000, currency: 'PKR' },
            ],
          },
          {
            code: '2120',
            name: 'Payroll & FBR Tax Withholdings',
            level: 3,
            type: 'Liability',
            balance: 2200000,
            currency: 'PKR',
            children: [
              { code: '2121', name: 'Staff Salaries & Wages Accrued', level: 4, type: 'Liability', balance: 1850000, currency: 'PKR' },
              { code: '2122', name: 'FBR Withholding Tax (WHT) Payable', level: 4, type: 'Liability', balance: 350000, currency: 'PKR' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: '3000',
    name: 'EQUITY & RESERVES (سرمایہ)',
    level: 1,
    type: 'Equity',
    balance: 21700000,
    currency: 'PKR',
    children: [
      {
        code: '3100',
        name: 'Founders Capital & Retained Earnings',
        level: 2,
        type: 'Equity',
        balance: 21700000,
        currency: 'PKR',
        children: [
          {
            code: '3110',
            name: 'Equity Capital & Accumulated Profits',
            level: 3,
            type: 'Equity',
            balance: 21700000,
            currency: 'PKR',
            children: [
              { code: '3111', name: 'Founders Paid-Up Share Capital', level: 4, type: 'Equity', balance: 10000000, currency: 'PKR' },
              { code: '3112', name: 'Retained Earnings Brought Forward', level: 4, type: 'Equity', balance: 6500000, currency: 'PKR' },
              { code: '3113', name: 'Current Year Net Profit Reserve', level: 4, type: 'Equity', balance: 5200000, currency: 'PKR' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: '4000',
    name: 'REVENUE & INFLOWS (آمدنی)',
    level: 1,
    type: 'Revenue',
    balance: 7000000,
    currency: 'PKR',
    children: [
      {
        code: '4100',
        name: 'Operating Revenues',
        level: 2,
        type: 'Revenue',
        balance: 7000000,
        currency: 'PKR',
        children: [
          {
            code: '4110',
            name: 'Recurring Client Retainers & SaaS MRR',
            level: 3,
            type: 'Revenue',
            balance: 2200000,
            currency: 'PKR',
            children: [
              { code: '4111', name: 'Enterprise Monthly Retainers', level: 4, type: 'Revenue', balance: 1450000, currency: 'PKR' },
              { code: '4112', name: 'Omnysync Cloud SaaS Licenses', level: 4, type: 'Revenue', balance: 750000, currency: 'PKR' },
            ],
          },
          {
            code: '4120',
            name: 'Project Milestones & SOW Custom Dev',
            level: 3,
            type: 'Revenue',
            balance: 4800000,
            currency: 'PKR',
            children: [
              { code: '4121', name: 'Custom ERP & Mobile Engineering Fees', level: 4, type: 'Revenue', balance: 4800000, currency: 'PKR' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: '5000',
    name: 'EXPENSES & OUTFLOWS (اخراجات)',
    level: 1,
    type: 'Expense',
    balance: 4970000,
    currency: 'PKR',
    children: [
      {
        code: '5100',
        name: 'Operating Expenses',
        level: 2,
        type: 'Expense',
        balance: 4970000,
        currency: 'PKR',
        children: [
          {
            code: '5110',
            name: 'Staff Salaries & Remuneration',
            level: 3,
            type: 'Expense',
            balance: 2750000,
            currency: 'PKR',
            children: [
              { code: '5111', name: 'Software Engineers & Designers Payroll', level: 4, type: 'Expense', balance: 1850000, currency: 'PKR' },
              { code: '5112', name: 'Founder Executive Salaries', level: 4, type: 'Expense', balance: 900000, currency: 'PKR' },
            ],
          },
          {
            code: '5120',
            name: 'Founder Equity & Dividend Draws',
            level: 3,
            type: 'Expense',
            balance: 1200000,
            currency: 'PKR',
            children: [
              { code: '5121', name: 'Founders Profit Equity Withdrawals', level: 4, type: 'Expense', balance: 1200000, currency: 'PKR' },
            ],
          },
          {
            code: '5130',
            name: 'Expensive SaaS Subscriptions & Cloud',
            level: 3,
            type: 'Expense',
            balance: 650000,
            currency: 'PKR',
            children: [
              { code: '5131', name: 'AWS Cloud & OpenAI API Credits', level: 4, type: 'Expense', balance: 485000, currency: 'PKR' },
              { code: '5132', name: 'GitHub, Figma, Cursor & Tools', level: 4, type: 'Expense', balance: 165000, currency: 'PKR' },
            ],
          },
          {
            code: '5140',
            name: 'Office & Facilities OpEx',
            level: 3,
            type: 'Expense',
            balance: 370000,
            currency: 'PKR',
            children: [
              { code: '5141', name: 'Office Lease, Fiber Internet & Utilities', level: 4, type: 'Expense', balance: 370000, currency: 'PKR' },
            ],
          },
        ],
      },
    ],
  },
];

// ─── Double-Entry General Ledger Entries (PKR Standardized) ───────────────────

export const GENERAL_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'gl-1',
    date: '2025-04-02',
    voucherNo: 'RV-2025-101',
    voucherType: 'RV',
    accountCode: '1112',
    accountName: 'Meezan Bank Operating A/C',
    description: 'Milestone 1 Payment received from Acme Global Corp',
    debit: 2850000,
    credit: 0,
    status: 'Posted',
  },
  {
    id: 'gl-2',
    date: '2025-04-02',
    voucherNo: 'RV-2025-101',
    voucherType: 'RV',
    accountCode: '4121',
    accountName: 'Custom ERP & Mobile Engineering Fees',
    description: 'Revenue recognized for Acme ERP Milestone 1',
    debit: 0,
    credit: 2850000,
    status: 'Posted',
  },
  {
    id: 'gl-3',
    date: '2025-04-05',
    voucherNo: 'PV-2025-042',
    voucherType: 'PV',
    accountCode: '5111',
    accountName: 'Software Engineers & Designers Payroll',
    description: 'Disbursement of Monthly Staff Salaries',
    debit: 1850000,
    credit: 0,
    status: 'Posted',
  },
  {
    id: 'gl-4',
    date: '2025-04-05',
    voucherNo: 'PV-2025-042',
    voucherType: 'PV',
    accountCode: '1113',
    accountName: 'HBL Corporate Payroll A/C',
    description: 'Direct salary transfers to team bank accounts',
    debit: 0,
    credit: 1850000,
    status: 'Posted',
  },
  {
    id: 'gl-5',
    date: '2025-04-05',
    voucherNo: 'PV-2025-043',
    voucherType: 'PV',
    accountCode: '5112',
    accountName: 'Founder Executive Salaries',
    description: 'CEO & CTO Executive Remuneration (Rs. 450k each)',
    debit: 900000,
    credit: 0,
    status: 'Posted',
  },
  {
    id: 'gl-6',
    date: '2025-04-05',
    voucherNo: 'PV-2025-043',
    voucherType: 'PV',
    accountCode: '1112',
    accountName: 'Meezan Bank Operating A/C',
    description: 'Funds transferred to founders personal accounts',
    debit: 0,
    credit: 900000,
    status: 'Posted',
  },
  {
    id: 'gl-7',
    date: '2025-04-07',
    voucherNo: 'PV-2025-044',
    voucherType: 'PV',
    accountCode: '5131',
    accountName: 'AWS Cloud & OpenAI API Credits',
    description: 'Monthly cloud cluster and AI token compute expense',
    debit: 485000,
    credit: 0,
    status: 'Posted',
  },
  {
    id: 'gl-8',
    date: '2025-04-07',
    voucherNo: 'PV-2025-044',
    voucherType: 'PV',
    accountCode: '1112',
    accountName: 'Meezan Bank Operating A/C',
    description: 'Card settlement for AWS infrastructure invoice',
    debit: 0,
    credit: 485000,
    status: 'Posted',
  },
];

// ─── Vouchers List (PKR Standardized) ────────────────────────────────────────

export const VOUCHERS_LIST: VoucherItem[] = [
  {
    id: 'v-1',
    voucherNo: 'RV-2025-101',
    type: 'Receipt Voucher',
    date: '2025-04-02',
    entityName: 'Acme Global Corp',
    totalAmount: 2850000,
    status: 'Approved',
    preparedBy: 'Chief Financial Officer',
    linesCount: 2,
  },
  {
    id: 'v-2',
    voucherNo: 'PV-2025-042',
    type: 'Payment Voucher',
    date: '2025-04-05',
    entityName: 'Engineering & Design Team',
    totalAmount: 1850000,
    status: 'Audited',
    preparedBy: 'HR & Payroll Lead',
    linesCount: 2,
  },
  {
    id: 'v-3',
    voucherNo: 'PV-2025-043',
    type: 'Payment Voucher',
    date: '2025-04-05',
    entityName: 'Co-Founders (CEO & CTO)',
    totalAmount: 900000,
    status: 'Audited',
    preparedBy: 'Managing Director',
    linesCount: 2,
  },
  {
    id: 'v-4',
    voucherNo: 'PV-2025-044',
    type: 'Payment Voucher',
    date: '2025-04-07',
    entityName: 'Amazon Web Services & OpenAI',
    totalAmount: 485000,
    status: 'Approved',
    preparedBy: 'Lead DevOps Architect',
    linesCount: 2,
  },
];

// ─── Statement of Accounts Data (PKR Standardized) ───────────────────────────

export const STATEMENT_OF_ACCOUNTS_DATA: SOARow[] = [
  {
    id: 'soa-1',
    date: '2025-03-01',
    refNo: 'OPENING',
    description: 'Opening Balance Carried Forward',
    debit: 3500000,
    credit: 0,
    runningBalance: 3500000,
  },
  {
    id: 'soa-2',
    date: '2025-03-15',
    refNo: 'INV-2025-089',
    description: 'Invoice for Custom Microservices Architecture',
    debit: 2850000,
    credit: 0,
    runningBalance: 6350000,
  },
  {
    id: 'soa-3',
    date: '2025-03-25',
    refNo: 'RV-2025-084',
    description: 'Wire settlement received via Meezan Bank',
    debit: 0,
    credit: 3500000,
    runningBalance: 2850000,
  },
  {
    id: 'soa-4',
    date: '2025-04-02',
    refNo: 'RV-2025-101',
    description: 'Final Milestone Settlement - Wire #99218',
    debit: 0,
    credit: 2850000,
    runningBalance: 0,
  },
];

// ─── Commercial Documents Suite (PKR Standardized) ───────────────────────────

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
}

export const COMMERCIAL_DOCUMENTS: CommercialDocument[] = [
  {
    id: 'doc-inv-101',
    docType: 'invoice',
    docNumber: 'INV-2025-0101',
    title: 'Enterprise ERP Implementation - Milestone 1',
    clientName: 'Acme Global Corp',
    clientEmail: 'billing@acmeglobal.com',
    clientAddress: '100 Silicon Ave, Suite 400 & Lahore Tech Park',
    issueDate: '2025-04-01',
    dueDate: '2025-04-15',
    currency: 'PKR',
    status: 'paid',
    projectId: 'p-1',
    projectName: 'Enterprise ERP Platform',
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

export const FINANCIAL_WALLET = {
  availableBalance: 14950000,
  incomeMonth: 7000000,
  expenseMonth: 4970000,
  netWeeklyStat: 2030000,
  cards: [
    {
      id: 'c-1',
      type: 'VISA' as const,
      name: 'Meezan Corporate Debit',
      balance: 'Rs. 6,850,000',
      lastDigits: '1499',
      expiry: '04/28',
      bgColor: 'bg-[#18231d] border border-[#233829]',
      textColor: 'text-white',
    },
    {
      id: 'c-2',
      type: 'VISA' as const,
      name: 'Standard Chartered Treasury',
      balance: 'Rs. 5,500,000',
      lastDigits: '8821',
      expiry: '09/28',
      bgColor: 'bg-gradient-to-br from-[#2dd4bf]/20 to-[#0f766e]/30 border border-[#2dd4bf]/40',
      textColor: 'text-white',
    },
  ],
  weeklyBarStats: [
    { day: 'Mon', height: 75, active: true },
    { day: 'Tue', height: 45, active: false },
    { day: 'Wed', height: 85, active: true },
    { day: 'Thu', height: 50, active: false },
    { day: 'Fri', height: 95, active: true },
    { day: 'Sat', height: 60, active: false },
    { day: 'Sun', height: 40, active: false },
  ],
  recentTransactions: [
    {
      id: 'tx-1',
      title: 'Acme Global Milestone 1',
      time: 'Apr 02, 2025',
      amount: 2850000,
      icon: 'arrow-down-left',
    },
    {
      id: 'tx-2',
      title: 'Monthly Staff Engineering Payroll',
      time: 'Apr 05, 2025',
      amount: -1850000,
      icon: 'users',
    },
    {
      id: 'tx-3',
      title: 'Founders Executive Salaries',
      time: 'Apr 05, 2025',
      amount: -900000,
      icon: 'crown',
    },
    {
      id: 'tx-4',
      title: 'AWS Cloud & OpenAI Infrastructure',
      time: 'Apr 07, 2025',
      amount: -485000,
      icon: 'server',
    },
  ],
};
