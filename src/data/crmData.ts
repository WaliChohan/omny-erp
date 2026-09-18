// ─── CRM Data Layer ───────────────────────────────────────────────────────────
// All interfaces are backend-ready: replace mock arrays with API responses later.

// ── Schedule ────────────────────────────────────────────────────────────────

export interface ScheduleToggle {
  id: string;
  label: string;
  active: boolean;
}

export const SCHEDULE_DATE = '28 march';

export const SCHEDULE_TOGGLES: ScheduleToggle[] = [
  { id: 'calls',    label: 'Calls',    active: false },
  { id: 'meetings', label: 'Meetings', active: true  },
  { id: 'followup', label: 'Follow-Up',active: false },
  { id: 'demos',    label: 'Demos',    active: false },
  { id: 'tasks',    label: 'Tasks',    active: true  },
];

// ── Workspace Metrics ────────────────────────────────────────────────────────

export interface WorkspaceMetric {
  id: string;
  count: number;
  label: string;
  badgeColor: string; // Tailwind bg class
}

export const WORKSPACE_METRICS: WorkspaceMetric[] = [
  { id: 'deals', count: 34, label: 'Deals', badgeColor: 'bg-[#00e676]' },
  { id: 'won',   count: 20, label: 'won',   badgeColor: 'bg-[#f97316]' },
  { id: 'lost',  count: 3,  label: 'lost',  badgeColor: 'bg-[#dc2626]' },
];

// ── Lead Filter Categories ───────────────────────────────────────────────────

export type LeadFilter = 'All' | 'Hot Clients' | 'Great Interest' | 'Medium Interest' | 'Low Interest';

export const LEAD_FILTERS: LeadFilter[] = [
  'All',
  'Hot Clients',
  'Great Interest',
  'Medium Interest',
  'Low Interest',
];

// ── Lead Card ────────────────────────────────────────────────────────────────

export type LeadSource = 'LinkedIn' | 'Email' | 'Referral' | 'Cold Call' | 'Twitter';

export interface LeadCard {
  id: string;
  name: string;
  title: string;         // e.g. "Marketing Director of Microsoft"
  avatarInitials: string;
  avatarColor: string;   // Tailwind bg class for initials avatar
  sources: LeadSource[];
  priority: LeadFilter;  // maps to filter category
  /** Rating 1–5 dots */
  rating: 1 | 2 | 3 | 4 | 5;
}

export const CRM_LEADS: LeadCard[] = [
  {
    id: 'lead-1',
    name: 'Jane Doe',
    title: 'Marketing Director of Microsoft',
    avatarInitials: 'JD',
    avatarColor: 'bg-[#7c3aed]',
    sources: ['LinkedIn', 'Email'],
    priority: 'Hot Clients',
    rating: 4,
  },
  {
    id: 'lead-2',
    name: 'Alex Kim',
    title: 'Head of Product at Stripe',
    avatarInitials: 'AK',
    avatarColor: 'bg-[#0284c7]',
    sources: ['LinkedIn', 'Email'],
    priority: 'Great Interest',
    rating: 3,
  },
  {
    id: 'lead-3',
    name: 'Sofia Reyes',
    title: 'VP Sales at Salesforce',
    avatarInitials: 'SR',
    avatarColor: 'bg-[#d97706]',
    sources: ['Referral'],
    priority: 'Hot Clients',
    rating: 5,
  },
  {
    id: 'lead-4',
    name: 'Marcus Chen',
    title: 'CTO at Figma',
    avatarInitials: 'MC',
    avatarColor: 'bg-[#059669]',
    sources: ['Cold Call', 'LinkedIn'],
    priority: 'Medium Interest',
    rating: 2,
  },
  {
    id: 'lead-5',
    name: 'Priya Patel',
    title: 'COO at Notion',
    avatarInitials: 'PP',
    avatarColor: 'bg-[#db2777]',
    sources: ['Email'],
    priority: 'Great Interest',
    rating: 3,
  },
  {
    id: 'lead-6',
    name: 'James Wright',
    title: 'Director of Engineering at Vercel',
    avatarInitials: 'JW',
    avatarColor: 'bg-[#64748b]',
    sources: ['Twitter', 'Email'],
    priority: 'Low Interest',
    rating: 1,
  },
  {
    id: 'lead-7',
    name: 'Layla Hassan',
    title: 'Chief Strategy Officer at HubSpot',
    avatarInitials: 'LH',
    avatarColor: 'bg-[#f97316]',
    sources: ['LinkedIn'],
    priority: 'Hot Clients',
    rating: 5,
  },
];

// ─── Pipeline / Deals ────────────────────────────────────────────────────────

export type DealStage =
  | 'prospecting'
  | 'qualified'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won';

export interface Deal {
  id: string;
  name: string;              // Contact / company name
  title: string;             // Role & company
  avatarInitials: string;
  avatarColor: string;       // Tailwind bg class
  sources: LeadSource[];
  priority: LeadFilter;
  rating: 1 | 2 | 3 | 4 | 5;
  stage: DealStage;
  dealValue: number;         // USD
  expectedCloseDate: string; // ISO date string
  notes?: string;
}

export const PIPELINE_STAGES: {
  id: DealStage;
  label: string;
  badgeColor: string;   // pill bg
  textColor: string;    // pill text
  borderColor: string;  // column border accent
  glowColor: string;    // shadow glow
}[] = [
  {
    id: 'prospecting',
    label: 'Prospecting',
    badgeColor: 'bg-[#1d4ed8]',
    textColor: 'text-white',
    borderColor: 'border-[#1d4ed8]/30',
    glowColor: '#1d4ed8',
  },
  {
    id: 'qualified',
    label: 'Qualified Lead',
    badgeColor: 'bg-[#b45309]',
    textColor: 'text-white',
    borderColor: 'border-[#b45309]/30',
    glowColor: '#b45309',
  },
  {
    id: 'proposal_sent',
    label: 'Proposal Sent',
    badgeColor: 'bg-[#c2410c]',
    textColor: 'text-white',
    borderColor: 'border-[#c2410c]/30',
    glowColor: '#c2410c',
  },
  {
    id: 'negotiation',
    label: 'Negotiation',
    badgeColor: 'bg-[#9d174d]',
    textColor: 'text-white',
    borderColor: 'border-[#9d174d]/30',
    glowColor: '#9d174d',
  },
  {
    id: 'closed_won',
    label: 'Closed Won',
    badgeColor: 'bg-[#15803d]',
    textColor: 'text-white',
    borderColor: 'border-[#15803d]/30',
    glowColor: '#15803d',
  },
];

export const PIPELINE_DEALS: Deal[] = [
  {
    id: 'deal-1',
    name: 'Jane Doe',
    title: 'Marketing Director at Microsoft',
    avatarInitials: 'JD',
    avatarColor: 'bg-[#7c3aed]',
    sources: ['LinkedIn', 'Email'],
    priority: 'Hot Clients',
    rating: 4,
    stage: 'prospecting',
    dealValue: 48000,
    expectedCloseDate: '2026-10-15',
    notes: 'Interested in enterprise suite',
  },
  {
    id: 'deal-2',
    name: 'Alex Kim',
    title: 'Head of Product at Stripe',
    avatarInitials: 'AK',
    avatarColor: 'bg-[#0284c7]',
    sources: ['LinkedIn', 'Email'],
    priority: 'Great Interest',
    rating: 3,
    stage: 'prospecting',
    dealValue: 22000,
    expectedCloseDate: '2026-10-30',
  },
  {
    id: 'deal-3',
    name: 'Sofia Reyes',
    title: 'VP Sales at Salesforce',
    avatarInitials: 'SR',
    avatarColor: 'bg-[#d97706]',
    sources: ['Referral'],
    priority: 'Hot Clients',
    rating: 5,
    stage: 'qualified',
    dealValue: 95000,
    expectedCloseDate: '2026-09-30',
    notes: 'Decision maker confirmed',
  },
  {
    id: 'deal-4',
    name: 'Marcus Chen',
    title: 'CTO at Figma',
    avatarInitials: 'MC',
    avatarColor: 'bg-[#059669]',
    sources: ['Cold Call', 'LinkedIn'],
    priority: 'Medium Interest',
    rating: 2,
    stage: 'qualified',
    dealValue: 31500,
    expectedCloseDate: '2026-11-10',
  },
  {
    id: 'deal-5',
    name: 'Priya Patel',
    title: 'COO at Notion',
    avatarInitials: 'PP',
    avatarColor: 'bg-[#db2777]',
    sources: ['Email'],
    priority: 'Great Interest',
    rating: 3,
    stage: 'proposal_sent',
    dealValue: 67000,
    expectedCloseDate: '2026-10-05',
    notes: 'Proposal v2 sent 14 Sep',
  },
  {
    id: 'deal-6',
    name: 'James Wright',
    title: 'Director of Engineering at Vercel',
    avatarInitials: 'JW',
    avatarColor: 'bg-[#64748b]',
    sources: ['Twitter', 'Email'],
    priority: 'Low Interest',
    rating: 1,
    stage: 'negotiation',
    dealValue: 14000,
    expectedCloseDate: '2026-09-25',
  },
  {
    id: 'deal-7',
    name: 'Layla Hassan',
    title: 'Chief Strategy Officer at HubSpot',
    avatarInitials: 'LH',
    avatarColor: 'bg-[#f97316]',
    sources: ['LinkedIn'],
    priority: 'Hot Clients',
    rating: 5,
    stage: 'closed_won',
    dealValue: 120000,
    expectedCloseDate: '2026-09-10',
    notes: 'Contract signed — annual plan',
  },
  {
    id: 'deal-8',
    name: 'Omar Farouk',
    title: 'CEO at Loom',
    avatarInitials: 'OF',
    avatarColor: 'bg-[#0f766e]',
    sources: ['Referral', 'LinkedIn'],
    priority: 'Great Interest',
    rating: 4,
    stage: 'closed_won',
    dealValue: 54000,
    expectedCloseDate: '2026-09-12',
    notes: 'Upsell opportunity next quarter',
  },
];
