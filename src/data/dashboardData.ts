export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  icon: string;
  iconBg: string;
  sparkline: number[];
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: 'order' | 'payment' | 'lead' | 'stock' | 'hr' | 'project' | 'invoice' | 'proposal';
}

export interface ModuleItem {
  id: string;
  name: string;
  badge: string;
  icon: string;
  category: string;
  accent: string;
}

export interface ChannelShare {
  name: string;
  percent: number;
  revenue: string;
  color: string;
}

export interface ProductItem {
  id: number;
  name: string;
  categoryIcon: string;
  sold: number;
  revenue: string;
}

export interface StockAlert {
  id: string;
  product: string;
  icon: string;
  currentStock: number;
  status: 'Low' | 'Critical';
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export const METRICS_DATA: MetricCardData[] = [
  {
    id: 'metric-revenue',
    title: 'Billable Revenue',
    value: 'PKR 14.8M',
    change: '+ 18%',
    isPositive: true,
    period: 'vs. last 30 days',
    icon: 'coins',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    sparkline: [24, 28, 32, 34, 40, 42, 48],
  },
  {
    id: 'metric-mrr',
    title: 'SEO & Retainer MRR',
    value: 'PKR 1.85M',
    change: '+ 12%',
    isPositive: true,
    period: 'vs. last 30 days',
    icon: 'repeat',
    iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    sparkline: [18, 22, 24, 28, 30, 32, 36],
  },
  {
    id: 'metric-customers',
    title: 'Active Clients',
    value: '24 Active',
    change: '+ 3',
    isPositive: true,
    period: 'vs. last 30 days',
    icon: 'users',
    iconBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    sparkline: [15, 19, 20, 22, 27, 31, 38],
  },
  {
    id: 'metric-profit',
    title: 'Pipeline Value',
    value: 'PKR 9.6M',
    change: '+ 22%',
    isPositive: true,
    period: 'open deals',
    icon: 'trending',
    iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    sparkline: [10, 14, 18, 20, 22, 24, 28],
  },
];

export const SALES_OVERVIEW_DAYS = [
  { day: '22 Mar', revenue: 28, orders: 40 },
  { day: '23 Mar', revenue: 35, orders: 52 },
  { day: '24 Mar', revenue: 26, orders: 44 },
  { day: '25 Mar', revenue: 42, orders: 58 },
  { day: '26 Mar', revenue: 48, orders: 65 },
  { day: '27 Mar', revenue: 62, orders: 48 },
  { day: '28 Mar', revenue: 75, orders: 50 },
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    title: 'Quote sent — HVAC booking portal',
    detail: 'PKR 1.2M · CoolAir Pros',
    time: '2 min ago',
    type: 'proposal',
  },
  {
    id: '2',
    title: 'Invoice paid',
    detail: 'INV-1042 · PKR 480K',
    time: '12 min ago',
    type: 'payment',
  },
  {
    id: '3',
    title: 'New lead from Google Ads',
    detail: 'HomeServe HVAC · SEO + site',
    time: '25 min ago',
    type: 'lead',
  },
  {
    id: '4',
    title: 'Project milestone approved',
    detail: 'ComfortZone mobile app · Phase 2',
    time: '38 min ago',
    type: 'project',
  },
  {
    id: '5',
    title: 'Retainer renewed',
    detail: 'Apex Plumbing · SEO monthly',
    time: '1 hr ago',
    type: 'invoice',
  },
];

export const ERP_MODULES: ModuleItem[] = [
  {
    id: 'crm',
    name: 'CRM & Pipeline',
    badge: '8 Follow-ups',
    icon: 'user-check',
    category: 'Sales',
    accent: 'bg-pink-950/60 text-pink-400 border-pink-800/40',
  },
  {
    id: 'clients',
    name: 'Clients',
    badge: '24 Accounts',
    icon: 'building',
    category: 'Accounts',
    accent: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40',
  },
  {
    id: 'projects',
    name: 'Projects',
    badge: '11 Active',
    icon: 'briefcase',
    category: 'Delivery',
    accent: 'bg-violet-950/60 text-violet-400 border-violet-800/40',
  },
  {
    id: 'finance',
    name: 'Finance',
    badge: '2 Overdue',
    icon: 'dollar',
    category: 'Billing',
    accent: 'bg-yellow-950/60 text-yellow-400 border-yellow-800/40',
  },
  {
    id: 'documents',
    name: 'Documents',
    badge: 'Quotes & SOWs',
    icon: 'file',
    category: 'Docs',
    accent: 'bg-teal-950/60 text-teal-400 border-teal-800/40',
  },
  {
    id: 'portal',
    name: 'Client Portal',
    badge: 'Live access',
    icon: 'shield',
    category: 'Portal',
    accent: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    badge: 'Agency KPIs',
    icon: 'chart',
    category: 'BI',
    accent: 'bg-sky-950/60 text-sky-400 border-sky-800/40',
  },
  {
    id: 'todo',
    name: 'Team Tasks',
    badge: '14 Open',
    icon: 'check',
    category: 'Ops',
    accent: 'bg-slate-900/80 text-slate-300 border-slate-700/40',
  },
];

export const SALES_BY_CHANNEL: ChannelShare[] = [
  { name: 'Websites', percent: 34, revenue: 'PKR 5.0M', color: '#10b981' },
  { name: 'Custom Software', percent: 28, revenue: 'PKR 4.1M', color: '#38bdf8' },
  { name: 'SEO Retainers', percent: 22, revenue: 'PKR 3.3M', color: '#a855f7' },
  { name: 'Mobile Apps', percent: 16, revenue: 'PKR 2.4M', color: '#f97316' },
];

/** @deprecated retail demo — kept for type compatibility */
export const TOP_PRODUCTS: ProductItem[] = [];
/** @deprecated retail demo — kept for type compatibility */
export const LOW_STOCK_ALERTS: StockAlert[] = [];

export const UPCOMING_TASKS: TaskItem[] = [
  {
    id: 't1',
    title: 'Send HVAC portal proposal to CoolAir Pros',
    dueDate: '28 Sep 2026',
    priority: 'High',
    completed: false,
  },
  {
    id: 't2',
    title: 'Kickoff ComfortZone booking app sprint',
    dueDate: '28 Sep 2026',
    priority: 'High',
    completed: false,
  },
  {
    id: 't3',
    title: 'Publish Apex Plumbing SEO monthly report',
    dueDate: '29 Sep 2026',
    priority: 'Medium',
    completed: false,
  },
  {
    id: 't4',
    title: 'Invoice HomeServe for website milestone 2',
    dueDate: '30 Sep 2026',
    priority: 'Medium',
    completed: false,
  },
  {
    id: 't5',
    title: 'Client portal walkthrough — Summit HVAC',
    dueDate: '1 Oct 2026',
    priority: 'Low',
    completed: false,
  },
];
