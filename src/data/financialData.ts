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

export interface WalletCard {
  id: string;
  type: 'VISA';
  name: string;
  balance: string;
  lastDigits: string;
  expiry: string;
  bgColor: string;
  textColor: string;
}

export const FINANCIAL_WALLET = {
  availableBalance: 8405.00,
  incomeMonth: 9698.00,
  expenseMonth: 4204.00,
  netWeeklyStat: 7432.20,
  cards: [
    {
      id: 'c-1',
      type: 'VISA' as const,
      name: 'Other',
      balance: '$1,842',
      lastDigits: '1499',
      expiry: '04/28',
      bgColor: 'bg-[#f4f4f7] dark:bg-[#1a211e] border border-[#2b3a32]',
      textColor: 'text-white',
    },
    {
      id: 'c-2',
      type: 'VISA' as const,
      name: 'Family card',
      balance: '$4,342.11',
      lastDigits: '1545',
      expiry: '01/28',
      bgColor: 'bg-gradient-to-br from-[#818cf8]/20 to-[#6366f1]/30 border border-[#6366f1]/40',
      textColor: 'text-white',
    },
  ],
  quickContacts: [
    { id: '1', name: 'Jake', initials: 'J', bg: 'bg-[#d97706]' },
    { id: '2', name: 'Dilan', initials: 'D', bg: 'bg-[#db2777]' },
    { id: '3', name: 'Anna', initials: 'A', bg: 'bg-[#0d9488]' },
    { id: '4', name: 'Jhoi', initials: 'J', bg: 'bg-[#b45309]' },
    { id: '5', name: 'Max', initials: 'M', bg: 'bg-[#6366f1]' },
    { id: '6', name: 'Phill', initials: 'P', bg: 'bg-[#e11d48]' },
  ],
  recentTransactions: [
    {
      id: 'tx-1',
      title: 'Airbnb',
      time: 'Oct 14, 2024 04:31 AM',
      amount: -956.50,
      icon: 'home',
    },
    {
      id: 'tx-2',
      title: 'Apple',
      time: 'Oct 13, 2024 11:02 AM',
      amount: -11.20,
      icon: 'apple',
    },
  ],
  weeklyBarStats: [
    { day: 'Mon', height: 75, active: true },
    { day: 'Tue', height: 45, active: false },
    { day: 'Wed', height: 60, active: true },
    { day: 'Thu', height: 35, active: false },
    { day: 'Fri', height: 90, active: false },
    { day: 'Sat', height: 80, active: true },
    { day: 'Sun', height: 70, active: true },
  ],
};

export const CHART_OF_ACCOUNTS_4LEVEL: COANode[] = [
  {
    code: '1000',
    name: 'ASSETS',
    level: 1,
    type: 'Asset',
    balance: 248650,
    currency: 'USD',
    children: [
      {
        code: '1100',
        name: 'Current Assets',
        level: 2,
        type: 'Asset',
        balance: 184250,
        currency: 'USD',
        children: [
          {
            code: '1110',
            name: 'Cash & Cash Equivalents',
            level: 3,
            type: 'Asset',
            balance: 92400,
            currency: 'USD',
            children: [
              { code: '1111', name: 'Petty Cash - Main Office', level: 4, type: 'Asset', balance: 3500, currency: 'USD' },
              { code: '1112', name: 'JPMorgan Chase Operating A/C', level: 4, type: 'Asset', balance: 64500, currency: 'USD' },
              { code: '1113', name: 'Silicon Valley Bank Payroll A/C', level: 4, type: 'Asset', balance: 24400, currency: 'USD' },
            ],
          },
          {
            code: '1120',
            name: 'Accounts Receivable (Trade Debtors)',
            level: 3,
            type: 'Asset',
            balance: 62850,
            currency: 'USD',
            children: [
              { code: '1121', name: 'Domestic Enterprise Clients', level: 4, type: 'Asset', balance: 48200, currency: 'USD' },
              { code: '1122', name: 'International Clients Receivable', level: 4, type: 'Asset', balance: 14650, currency: 'USD' },
            ],
          },
          {
            code: '1130',
            name: 'Inventories & Work-in-Progress',
            level: 3,
            type: 'Asset',
            balance: 29000,
            currency: 'USD',
            children: [
              { code: '1131', name: 'Hardware & Warehouse Stock', level: 4, type: 'Asset', balance: 29000, currency: 'USD' },
            ],
          },
        ],
      },
      {
        code: '1200',
        name: 'Non-Current Assets',
        level: 2,
        type: 'Asset',
        balance: 64400,
        currency: 'USD',
        children: [
          {
            code: '1210',
            name: 'Property, Plant & Equipment',
            level: 3,
            type: 'Asset',
            balance: 64400,
            currency: 'USD',
            children: [
              { code: '1211', name: 'Office Workstations & Hardware', level: 4, type: 'Asset', balance: 42000, currency: 'USD' },
              { code: '1212', name: 'Furniture & Fixtures', level: 4, type: 'Asset', balance: 22400, currency: 'USD' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: '2000',
    name: 'LIABILITIES',
    level: 1,
    type: 'Liability',
    balance: 86400,
    currency: 'USD',
    children: [
      {
        code: '2100',
        name: 'Current Liabilities',
        level: 2,
        type: 'Liability',
        balance: 86400,
        currency: 'USD',
        children: [
          {
            code: '2110',
            name: 'Accounts Payable (Trade Creditors)',
            level: 3,
            type: 'Liability',
            balance: 52100,
            currency: 'USD',
            children: [
              { code: '2111', name: 'Cloud Infrastructure & AWS Creditors', level: 4, type: 'Liability', balance: 31200, currency: 'USD' },
              { code: '2112', name: 'Office Supplies Vendors', level: 4, type: 'Liability', balance: 20900, currency: 'USD' },
            ],
          },
          {
            code: '2120',
            name: 'Accrued Payroll & Statutory Liabilities',
            level: 3,
            type: 'Liability',
            balance: 34300,
            currency: 'USD',
            children: [
              { code: '2121', name: 'Salaries & Wages Payable', level: 4, type: 'Liability', balance: 26500, currency: 'USD' },
              { code: '2122', name: 'Withholding Tax Payable', level: 4, type: 'Liability', balance: 7800, currency: 'USD' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: '3000',
    name: 'EQUITY',
    level: 1,
    type: 'Equity',
    balance: 162250,
    currency: 'USD',
    children: [
      {
        code: '3100',
        name: 'Owners Equity',
        level: 2,
        type: 'Equity',
        balance: 162250,
        currency: 'USD',
        children: [
          {
            code: '3110',
            name: 'Capital & Retained Earnings',
            level: 3,
            type: 'Equity',
            balance: 162250,
            currency: 'USD',
            children: [
              { code: '3111', name: 'Common Share Capital', level: 4, type: 'Equity', balance: 100000, currency: 'USD' },
              { code: '3112', name: 'Retained Earnings Brought Forward', level: 4, type: 'Equity', balance: 62250, currency: 'USD' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: '4000',
    name: 'REVENUE',
    level: 1,
    type: 'Revenue',
    balance: 120873,
    currency: 'USD',
    children: [
      {
        code: '4100',
        name: 'Operating Revenues',
        level: 2,
        type: 'Revenue',
        balance: 120873,
        currency: 'USD',
        children: [
          {
            code: '4110',
            name: 'Software Subscription & SaaS',
            level: 3,
            type: 'Revenue',
            balance: 85400,
            currency: 'USD',
            children: [
              { code: '4111', name: 'Omnysync Enterprise SaaS Licenses', level: 4, type: 'Revenue', balance: 85400, currency: 'USD' },
            ],
          },
          {
            code: '4120',
            name: 'Professional Consulting & SOW Services',
            level: 3,
            type: 'Revenue',
            balance: 35473,
            currency: 'USD',
            children: [
              { code: '4121', name: 'Custom ERP Implementation Fees', level: 4, type: 'Revenue', balance: 35473, currency: 'USD' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: '5000',
    name: 'EXPENSES',
    level: 1,
    type: 'Expense',
    balance: 42040,
    currency: 'USD',
    children: [
      {
        code: '5100',
        name: 'Operating Expenses',
        level: 2,
        type: 'Expense',
        balance: 42040,
        currency: 'USD',
        children: [
          {
            code: '5110',
            name: 'Hosting & Infrastructure Costs',
            level: 3,
            type: 'Expense',
            balance: 14500,
            currency: 'USD',
            children: [
              { code: '5111', name: 'AWS & Cloud Deployment', level: 4, type: 'Expense', balance: 14500, currency: 'USD' },
            ],
          },
          {
            code: '5120',
            name: 'Staff & Contractor Remuneration',
            level: 3,
            type: 'Expense',
            balance: 27540,
            currency: 'USD',
            children: [
              { code: '5121', name: 'Software Engineers & Designers', level: 4, type: 'Expense', balance: 27540, currency: 'USD' },
            ],
          },
        ],
      },
    ],
  },
];

export const GENERAL_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'gl-1',
    date: '2025-03-28',
    voucherNo: 'RV-2025-108',
    voucherType: 'RV',
    accountCode: '1112',
    accountName: 'JPMorgan Chase Operating A/C',
    description: 'SaaS Enterprise Subscription from Acme Corp',
    debit: 15400,
    credit: 0,
    status: 'Posted',
  },
  {
    id: 'gl-2',
    date: '2025-03-28',
    voucherNo: 'RV-2025-108',
    voucherType: 'RV',
    accountCode: '4111',
    accountName: 'Omnysync Enterprise SaaS Licenses',
    description: 'Revenue recognition - Acme Corp Q1',
    debit: 0,
    credit: 15400,
    status: 'Posted',
  },
  {
    id: 'gl-3',
    date: '2025-03-27',
    voucherNo: 'PV-2025-042',
    voucherType: 'PV',
    accountCode: '5111',
    accountName: 'AWS & Cloud Deployment',
    description: 'Monthly cloud infrastructure invoice payment',
    debit: 4200,
    credit: 0,
    status: 'Posted',
  },
  {
    id: 'gl-4',
    date: '2025-03-27',
    voucherNo: 'PV-2025-042',
    voucherType: 'PV',
    accountCode: '1112',
    accountName: 'JPMorgan Chase Operating A/C',
    description: 'Disbursement for AWS servers',
    debit: 0,
    credit: 4200,
    status: 'Posted',
  },
  {
    id: 'gl-5',
    date: '2025-03-26',
    voucherNo: 'JV-2025-001',
    voucherType: 'JV',
    accountCode: '1121',
    accountName: 'Domestic Enterprise Clients',
    description: 'Billed SOW Milestone #1 to TechGlobal Inc',
    debit: 12500,
    credit: 0,
    status: 'Reconciled',
  },
  {
    id: 'gl-6',
    date: '2025-03-26',
    voucherNo: 'JV-2025-001',
    voucherType: 'JV',
    accountCode: '4121',
    accountName: 'Custom ERP Implementation Fees',
    description: 'Milestone 1 completed under SOW agreement',
    debit: 0,
    credit: 12500,
    status: 'Reconciled',
  },
];

export const VOUCHERS_LIST: VoucherItem[] = [
  {
    id: 'v-1',
    voucherNo: 'JV-2025-001',
    type: 'Journal Voucher',
    date: '2025-03-26',
    entityName: 'TechGlobal Inc',
    totalAmount: 12500.00,
    status: 'Approved',
    preparedBy: 'Chief Accountant',
    linesCount: 2,
  },
  {
    id: 'v-2',
    voucherNo: 'PV-2025-042',
    type: 'Payment Voucher',
    date: '2025-03-27',
    entityName: 'Amazon Web Services LLC',
    totalAmount: 4200.00,
    status: 'Audited',
    preparedBy: 'Treasury Officer',
    linesCount: 2,
  },
  {
    id: 'v-3',
    voucherNo: 'RV-2025-108',
    type: 'Receipt Voucher',
    date: '2025-03-28',
    entityName: 'Acme Corporation',
    totalAmount: 15400.00,
    status: 'Approved',
    preparedBy: 'Billing Specialist',
    linesCount: 2,
  },
  {
    id: 'v-4',
    voucherNo: 'SV-2025-015',
    type: 'Sales Voucher',
    date: '2025-03-28',
    entityName: 'Starlight Media UK',
    totalAmount: 8900.00,
    status: 'Draft',
    preparedBy: 'Sales Rep #104',
    linesCount: 3,
  },
];

export const STATEMENT_OF_ACCOUNTS_DATA: SOARow[] = [
  {
    id: 'soa-1',
    date: '2025-03-01',
    refNo: 'OPENING',
    description: 'Opening Balance Carried Forward',
    debit: 22000,
    credit: 0,
    runningBalance: 22000,
  },
  {
    id: 'soa-2',
    date: '2025-03-08',
    refNo: 'INV-2025-031',
    description: 'Invoice for Omnysync Annual Enterprise Plan',
    debit: 18500,
    credit: 0,
    runningBalance: 40500,
  },
  {
    id: 'soa-3',
    date: '2025-03-15',
    refNo: 'RV-2025-084',
    description: 'Wire Transfer payment received - Wire Ref #9921',
    debit: 0,
    credit: 22000,
    runningBalance: 18500,
  },
  {
    id: 'soa-4',
    date: '2025-03-22',
    refNo: 'INV-2025-045',
    description: 'Professional Services: Custom Google Drive API Plugin',
    debit: 6500,
    credit: 0,
    runningBalance: 25000,
  },
  {
    id: 'soa-5',
    date: '2025-03-28',
    refNo: 'RV-2025-108',
    description: 'Direct Deposit Payment Received - Ref #00192',
    debit: 0,
    credit: 15400,
    runningBalance: 9600,
  },
];
