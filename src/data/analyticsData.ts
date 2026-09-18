export interface MonthlyBarData {
  month: string;
  profit: number;
  displayValue: string;
}

export const MONTHLY_PROFIT_DATA: MonthlyBarData[] = [
  { month: 'Jan', profit: 24000, displayValue: '$24,000' },
  { month: 'Feb', profit: 18000, displayValue: '$18,000' },
  { month: 'Mar', profit: 32000, displayValue: '$32,000' },
  { month: 'Apr', profit: 15000, displayValue: '$15,000' },
  { month: 'May', profit: 45000, displayValue: '$45,000' },
  { month: 'Jun', profit: 72000, displayValue: '$72,000' },
  { month: 'Jul', profit: 84000, displayValue: '$84,000' },
  { month: 'Aug', profit: 68000, displayValue: '$68,000' },
  { month: 'Sep', profit: 54000, displayValue: '$54,000' },
  { month: 'Oct', profit: 75000, displayValue: '$75,000' },
  { month: 'Nov', profit: 42000, displayValue: '$42,000' },
  { month: 'Dec', profit: 82000, displayValue: '$82,000' },
];

export const PROFIT_MARGIN_POINTS = [
  { month: 'Jan', val: 30 },
  { month: 'Feb', val: 42 },
  { month: 'Mar', val: 35 },
  { month: 'Apr', val: 55 },
  { month: 'May', val: 48 },
  { month: 'Jun', val: 68, active: true },
  { month: 'Jul', val: 62 },
];

export const STAFF_PERFORMANCE_POINTS = [
  { score: '25', val: 35 },
  { score: '50', val: 36 },
  { score: '75', val: 40 },
  { score: '100', val: 88, active: true },
];
