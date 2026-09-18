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
  type: 'order' | 'payment' | 'lead' | 'stock' | 'hr';
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
    id: 'revenue',
    title: 'Total Revenue',
    value: '$ 48,230',
    change: '+ 12%',
    isPositive: true,
    period: 'vs. last 7 days',
    icon: 'coins',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    sparkline: [24, 28, 22, 34, 30, 42, 48],
  },
  {
    id: 'orders',
    title: 'Total Orders',
    value: '142',
    change: '+ 8%',
    isPositive: true,
    period: 'vs. last 7 days',
    icon: 'cart',
    iconBg: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    sparkline: [18, 22, 21, 28, 26, 32, 36],
  },
  {
    id: 'customers',
    title: 'Total Customers',
    value: '286',
    change: '+ 15%',
    isPositive: true,
    period: 'vs. last 7 days',
    icon: 'users',
    iconBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    sparkline: [15, 19, 23, 20, 27, 31, 38],
  },
  {
    id: 'profit',
    title: 'Total Profit',
    value: '$ 18,450',
    change: '+ 11%',
    isPositive: true,
    period: 'vs. last 7 days',
    icon: 'trending',
    iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    sparkline: [10, 14, 13, 20, 18, 24, 28],
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
    title: 'New order #SO-1042',
    detail: '$450.00',
    time: '2 min ago',
    type: 'order',
  },
  {
    id: '2',
    title: 'Payment received',
    detail: '$280.00',
    time: '12 min ago',
    type: 'payment',
  },
  {
    id: '3',
    title: 'New lead from Website',
    detail: 'John Doe',
    time: '25 min ago',
    type: 'lead',
  },
  {
    id: '4',
    title: 'Stock updated',
    detail: 'Laptop Pro',
    time: '38 min ago',
    type: 'stock',
  },
  {
    id: '5',
    title: 'Leave request approved',
    detail: 'Sarah Miller',
    time: '1 hr ago',
    type: 'hr',
  },
];

export const ERP_MODULES: ModuleItem[] = [
  {
    id: 'sales',
    name: 'Sales & POS',
    badge: '12 Open Orders',
    icon: 'cart',
    category: 'Sales',
    accent: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    badge: '3 Low Stock',
    icon: 'package',
    category: 'Warehouse',
    accent: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40',
  },
  {
    id: 'procurement',
    name: 'Procurement',
    badge: '5 Pending PO',
    icon: 'truck',
    category: 'Supply',
    accent: 'bg-amber-950/60 text-amber-400 border-amber-800/40',
  },
  {
    id: 'crm',
    name: 'CRM',
    badge: '8 Follow-ups',
    icon: 'user-check',
    category: 'Clients',
    accent: 'bg-pink-950/60 text-pink-400 border-pink-800/40',
  },
  {
    id: 'hr',
    name: 'HR',
    badge: '4 Pending Leaves',
    icon: 'user',
    category: 'People',
    accent: 'bg-blue-950/60 text-blue-400 border-blue-800/40',
  },
  {
    id: 'finance',
    name: 'Finance',
    badge: '2 Overdue Bills',
    icon: 'dollar',
    category: 'Accounts',
    accent: 'bg-yellow-950/60 text-yellow-400 border-yellow-800/40',
  },
  {
    id: 'reports',
    name: 'Reports',
    badge: 'View Analytics',
    icon: 'chart',
    category: 'BI',
    accent: 'bg-teal-950/60 text-teal-400 border-teal-800/40',
  },
  {
    id: 'settings',
    name: 'Settings',
    badge: 'System Config',
    icon: 'settings',
    category: 'System',
    accent: 'bg-slate-900/80 text-slate-400 border-slate-700/40',
  },
];

export const SALES_BY_CHANNEL: ChannelShare[] = [
  { name: 'Online Store', percent: 45, revenue: '$21,703', color: '#10b981' },
  { name: 'POS', percent: 28, revenue: '$13,504', color: '#38bdf8' },
  { name: 'Wholesale', percent: 15, revenue: '$7,235', color: '#a855f7' },
  { name: 'Retail', percent: 12, revenue: '$5,788', color: '#f97316' },
];

export const TOP_PRODUCTS: ProductItem[] = [
  { id: 1, name: 'Laptop Pro', categoryIcon: 'laptop', sold: 48, revenue: '$ 11,520' },
  { id: 2, name: 'Wireless Headphones', categoryIcon: 'headphones', sold: 67, revenue: '$ 8,708' },
  { id: 3, name: 'Smart Watch', categoryIcon: 'watch', sold: 54, revenue: '$ 6,480' },
  { id: 4, name: 'Coffee Mug', categoryIcon: 'coffee', sold: 120, revenue: '$ 3,600' },
  { id: 5, name: 'Backpack', categoryIcon: 'bag', sold: 36, revenue: '$ 2,592' },
];

export const LOW_STOCK_ALERTS: StockAlert[] = [
  { id: '1', product: 'Wireless Mouse', icon: 'mouse', currentStock: 5, status: 'Low' },
  { id: '2', product: 'T-Shirt L', icon: 'shirt', currentStock: 8, status: 'Low' },
  { id: '3', product: 'Office Chair', icon: 'chair', currentStock: 3, status: 'Critical' },
  { id: '4', product: 'Notebook', icon: 'book', currentStock: 12, status: 'Low' },
  { id: '5', product: 'USB Drive', icon: 'usb', currentStock: 15, status: 'Low' },
];

export const UPCOMING_TASKS: TaskItem[] = [
  {
    id: 't1',
    title: 'Follow up with John Doe',
    dueDate: '28 Mar 2025',
    priority: 'High',
    completed: false,
  },
  {
    id: 't2',
    title: 'Process purchase order #PO-1021',
    dueDate: '28 Mar 2025',
    priority: 'Medium',
    completed: false,
  },
  {
    id: 't3',
    title: 'Review payroll',
    dueDate: '29 Mar 2025',
    priority: 'Medium',
    completed: false,
  },
  {
    id: 't4',
    title: 'Send monthly report',
    dueDate: '30 Mar 2025',
    priority: 'Low',
    completed: false,
  },
  {
    id: 't5',
    title: 'Inventory stock count',
    dueDate: '31 Mar 2025',
    priority: 'Low',
    completed: false,
  },
];
