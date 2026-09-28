'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  SimpleBookkeepingEntry,
  CommercialDocument,
  LedgerEntry,
  VoucherItem,
  COANode,
  CHART_OF_ACCOUNTS_4LEVEL,
  GENERAL_LEDGER_ENTRIES,
  VOUCHERS_LIST,
  STATEMENT_OF_ACCOUNTS_DATA,
  COMMERCIAL_DOCUMENTS,
  INITIAL_BOOKKEEPING_ENTRIES_PKR,
  FinanceCategoryType,
  formatPKR,
} from '@/data/financialData';

export interface FinancialMetrics {
  totalRevenue: number;
  projectRevenue: number;
  recurringRevenue: number;
  mrr: number;
  arr: number;
  totalExpenditures: number;
  employeePayroll: number;
  founderCompensation: number;
  founderSalaries: number;
  founderEquity: number;
  saasSubscriptions: number;
  generalOpex: number;
  netProfit: number;
  profitMargin: number;
  cashInBank: number;
  operatingCashMeezan: number;
  payrollCashHBL: number;
  treasuryReserveSCB: number;
  exportGatewayPayoneer: number;
  monthlyBurnRate: number;
  runwayMonths: number;
  receivables: number;
  payables: number;
  companyEquity: number;
  reconciledPercentage: number;
}

interface FinanceContextType {
  // Live State
  entries: SimpleBookkeepingEntry[];
  documents: CommercialDocument[];
  vouchers: VoucherItem[];
  ledgerEntries: LedgerEntry[];
  chartOfAccounts: COANode[];
  
  // Dynamic Calculated Metrics (PKR)
  metrics: FinancialMetrics;

  // Bookkeeping CRUD
  addEntry: (entry: Omit<SimpleBookkeepingEntry, 'id'>) => SimpleBookkeepingEntry;
  updateEntry: (id: string, updates: Partial<SimpleBookkeepingEntry>) => void;
  deleteEntry: (id: string) => void;
  toggleEntryStatus: (id: string) => void;

  // Commercial Documents CRUD
  addDocument: (doc: Omit<CommercialDocument, 'id'>) => CommercialDocument;
  updateDocument: (id: string, updates: Partial<CommercialDocument>) => void;
  deleteDocument: (id: string) => void;
  markDocumentStatus: (id: string, status: CommercialDocument['status']) => void;

  // Vouchers & Ledger CRUD
  addVoucher: (voucher: Omit<VoucherItem, 'id'>, lines?: { accountCode: string; accountName: string; debit: number; credit: number; description: string }[]) => VoucherItem;
  updateVoucher: (id: string, updates: Partial<VoucherItem>) => void;
  deleteVoucher: (id: string) => void;
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id'>) => LedgerEntry;
  deleteLedgerEntry: (id: string) => void;

  // Reset to default seed
  resetToDefaults: () => void;
}

const STORAGE_ENTRIES_KEY = 'omnysync_finance_entries_pkr_v2';
const STORAGE_DOCS_KEY = 'omnysync_finance_docs_pkr_v2';
const STORAGE_VOUCHERS_KEY = 'omnysync_finance_vouchers_pkr_v2';
const STORAGE_LEDGER_KEY = 'omnysync_finance_ledger_pkr_v2';

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  // ── 1. Bookkeeping Entries State ──────────────────────────────────────────
  const [entries, setEntries] = useState<SimpleBookkeepingEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_ENTRIES_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Failed to load finance entries from localStorage:', e);
      }
    }
    return INITIAL_BOOKKEEPING_ENTRIES_PKR;
  });

  // ── 2. Commercial Documents State ─────────────────────────────────────────
  const [documents, setDocuments] = useState<CommercialDocument[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_DOCS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Failed to load finance documents from localStorage:', e);
      }
    }
    return COMMERCIAL_DOCUMENTS;
  });

  // ── 3. Vouchers State ─────────────────────────────────────────────────────
  const [vouchers, setVouchers] = useState<VoucherItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_VOUCHERS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Failed to load finance vouchers from localStorage:', e);
      }
    }
    return VOUCHERS_LIST;
  });

  // ── 4. General Ledger State ───────────────────────────────────────────────
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_LEDGER_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Failed to load finance ledger from localStorage:', e);
      }
    }
    return GENERAL_LEDGER_ENTRIES;
  });

  // ── 5. Chart of Accounts ──────────────────────────────────────────────────
  const [chartOfAccounts, setChartOfAccounts] = useState<COANode[]>(CHART_OF_ACCOUNTS_4LEVEL);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ENTRIES_KEY, JSON.stringify(entries));
      localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(documents));
      localStorage.setItem(STORAGE_VOUCHERS_KEY, JSON.stringify(vouchers));
      localStorage.setItem(STORAGE_LEDGER_KEY, JSON.stringify(ledgerEntries));
    } catch (e) {
      console.error('Failed to sync finance state to localStorage:', e);
    }
  }, [entries, documents, vouchers, ledgerEntries]);

  // ── 6. Dynamic Financial Metrics Calculation (100% in PKR) ────────────────
  const metrics = useMemo<FinancialMetrics>(() => {
    let projectRevenue = 0;
    let recurringRevenue = 0;
    let employeePayroll = 0;
    let founderSalaries = 0;
    let founderEquity = 0;
    let saasSubscriptions = 0;
    let generalOpex = 0;

    entries.forEach((entry) => {
      const amt = Number(entry.amount) || 0;
      switch (entry.categoryType) {
        case 'project_revenue':
          projectRevenue += amt;
          break;
        case 'recurring_revenue':
          recurringRevenue += amt;
          break;
        case 'salary_employee':
          employeePayroll += amt;
          break;
        case 'salary_founder':
          founderSalaries += amt;
          break;
        case 'founder_equity':
          founderEquity += amt;
          break;
        case 'saas_subscription':
          saasSubscriptions += amt;
          break;
        case 'opex_general':
          generalOpex += amt;
          break;
        default:
          if (entry.type === 'income') projectRevenue += amt;
          else if (entry.type === 'expense') generalOpex += amt;
          break;
      }
    });

    const totalRevenue = projectRevenue + recurringRevenue;
    const founderCompensation = founderSalaries + founderEquity;
    const totalExpenditures =
      employeePayroll + founderCompensation + saasSubscriptions + generalOpex;
    const netProfit = totalRevenue - totalExpenditures;
    const profitMargin =
      totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

    // Monthly Recurring Revenue (MRR) - calculated from recurring items or monthly base
    const mrr = recurringRevenue > 0 ? Math.round(recurringRevenue) : 1850000;
    const arr = mrr * 12;

    // Bank Balances (PKR)
    const baseOperating = 6850000;
    const baseHBLPayroll = 2450000;
    const baseSCBReserve = 5500000;
    const basePayoneer = 3200000;

    // Adjust operating with net cashflow
    const netCashDelta = totalRevenue - totalExpenditures;
    const operatingCashMeezan = Math.max(1000000, baseOperating + netCashDelta);
    const payrollCashHBL = baseHBLPayroll;
    const treasuryReserveSCB = baseSCBReserve;
    const exportGatewayPayoneer = basePayoneer;
    const cashInBank =
      operatingCashMeezan + payrollCashHBL + treasuryReserveSCB + exportGatewayPayoneer;

    // Monthly Burn Rate = Fixed Monthly Outflows (Employee Salaries + Founder Salaries + SaaS + Fixed OpEx)
    const monthlyBurnRate =
      employeePayroll + founderSalaries + saasSubscriptions + Math.round(generalOpex * 0.5);
    const runwayMonths =
      monthlyBurnRate > 0 ? Number((cashInBank / monthlyBurnRate).toFixed(1)) : 24.0;

    // Receivables = Unpaid invoices from documents
    const receivables = documents
      .filter((d) => d.docType === 'invoice' && d.status !== 'paid')
      .reduce((sum, d) => sum + (d.totalAmount || 0), 0) || 4850000;

    // Payables = Accrued obligations
    const payables = Math.round(monthlyBurnRate * 0.45);

    // Company Equity = Paid-up capital (10M PKR) + Retained Earnings + Net Profit
    const paidUpCapital = 10000000;
    const retainedEarnings = 6500000;
    const companyEquity = paidUpCapital + retainedEarnings + netProfit;

    const reconciledCount = entries.filter((e) => e.status === 'reconciled').length;
    const reconciledPercentage =
      entries.length > 0 ? Math.round((reconciledCount / entries.length) * 100) : 100;

    return {
      totalRevenue,
      projectRevenue,
      recurringRevenue,
      mrr,
      arr,
      totalExpenditures,
      employeePayroll,
      founderCompensation,
      founderSalaries,
      founderEquity,
      saasSubscriptions,
      generalOpex,
      netProfit,
      profitMargin,
      cashInBank,
      operatingCashMeezan,
      payrollCashHBL,
      treasuryReserveSCB,
      exportGatewayPayoneer,
      monthlyBurnRate,
      runwayMonths,
      receivables,
      payables,
      companyEquity,
      reconciledPercentage,
    };
  }, [entries, documents]);

  // ── 7. Bookkeeping CRUD Handlers ──────────────────────────────────────────
  const addEntry = useCallback(
    (entryData: Omit<SimpleBookkeepingEntry, 'id'>): SimpleBookkeepingEntry => {
      const newEntry: SimpleBookkeepingEntry = {
        ...entryData,
        id: `sbe-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      };
      setEntries((prev) => [newEntry, ...prev]);
      return newEntry;
    },
    []
  );

  const updateEntry = useCallback(
    (id: string, updates: Partial<SimpleBookkeepingEntry>) => {
      setEntries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleEntryStatus = useCallback((id: string) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const nextStatus: 'pending' | 'cleared' | 'reconciled' =
          e.status === 'pending'
            ? 'cleared'
            : e.status === 'cleared'
            ? 'reconciled'
            : 'pending';
        return { ...e, status: nextStatus };
      })
    );
  }, []);

  // ── 8. Commercial Documents CRUD Handlers ─────────────────────────────────
  const addDocument = useCallback(
    (docData: Omit<CommercialDocument, 'id'>): CommercialDocument => {
      const newDoc: CommercialDocument = {
        ...docData,
        id: `doc-${Date.now()}`,
      };
      setDocuments((prev) => [newDoc, ...prev]);
      return newDoc;
    },
    []
  );

  const updateDocument = useCallback(
    (id: string, updates: Partial<CommercialDocument>) => {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
      );
    },
    []
  );

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const markDocumentStatus = useCallback(
    (id: string, status: CommercialDocument['status']) => {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? { ...doc, status } : doc))
      );
    },
    []
  );

  // ── 9. Vouchers & General Ledger Handlers ────────────────────────────────
  const addVoucher = useCallback(
    (
      voucherData: Omit<VoucherItem, 'id'>,
      lines?: { accountCode: string; accountName: string; debit: number; credit: number; description: string }[]
    ): VoucherItem => {
      const newVoucher: VoucherItem = {
        ...voucherData,
        id: `v-${Date.now()}`,
      };
      setVouchers((prev) => [newVoucher, ...prev]);

      // If lines provided, automatically post balanced ledger entries
      if (lines && lines.length > 0) {
        const newLedgerEntries: LedgerEntry[] = lines.map((l, idx) => ({
          id: `gl-${Date.now()}-${idx}`,
          date: newVoucher.date,
          voucherNo: newVoucher.voucherNo,
          voucherType: (newVoucher.voucherNo.split('-')[0] as any) || 'JV',
          accountCode: l.accountCode,
          accountName: l.accountName,
          description: l.description || `${newVoucher.type} for ${newVoucher.entityName}`,
          debit: l.debit,
          credit: l.credit,
          status: newVoucher.status === 'Approved' ? 'Posted' : 'Pending',
        }));
        setLedgerEntries((prev) => [...newLedgerEntries, ...prev]);
      }

      return newVoucher;
    },
    []
  );

  const updateVoucher = useCallback((id: string, updates: Partial<VoucherItem>) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  }, []);

  const deleteVoucher = useCallback((id: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const addLedgerEntry = useCallback(
    (entryData: Omit<LedgerEntry, 'id'>): LedgerEntry => {
      const newEntry: LedgerEntry = {
        ...entryData,
        id: `gl-${Date.now()}`,
      };
      setLedgerEntries((prev) => [newEntry, ...prev]);
      return newEntry;
    },
    []
  );

  const deleteLedgerEntry = useCallback((id: string) => {
    setLedgerEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const resetToDefaults = useCallback(() => {
    setEntries(INITIAL_BOOKKEEPING_ENTRIES_PKR);
    setDocuments(COMMERCIAL_DOCUMENTS);
    setVouchers(VOUCHERS_LIST);
    setLedgerEntries(GENERAL_LEDGER_ENTRIES);
    setChartOfAccounts(CHART_OF_ACCOUNTS_4LEVEL);
    localStorage.removeItem(STORAGE_ENTRIES_KEY);
    localStorage.removeItem(STORAGE_DOCS_KEY);
    localStorage.removeItem(STORAGE_VOUCHERS_KEY);
    localStorage.removeItem(STORAGE_LEDGER_KEY);
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        entries,
        documents,
        vouchers,
        ledgerEntries,
        chartOfAccounts,
        metrics,
        addEntry,
        updateEntry,
        deleteEntry,
        toggleEntryStatus,
        addDocument,
        updateDocument,
        deleteDocument,
        markDocumentStatus,
        addVoucher,
        updateVoucher,
        deleteVoucher,
        addLedgerEntry,
        deleteLedgerEntry,
        resetToDefaults,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinanceStore() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinanceStore must be used within a FinanceProvider');
  }
  return context;
}
