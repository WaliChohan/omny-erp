export interface FinanceSettings {
  /** Cash / equity on hand in PKR */
  cashOnHand: number;
  /** Monthly salary & fixed payroll in PKR */
  monthlyPayroll: number;
  /** Extra fixed monthly opex beyond expense ledger (rent, tools) in PKR */
  fixedOpex: number;
  updatedAt: string;
}

export const DEFAULT_FINANCE_SETTINGS: FinanceSettings = {
  cashOnHand: 12500000,
  monthlyPayroll: 1800000,
  fixedOpex: 350000,
  updatedAt: '2026-09-28',
};
