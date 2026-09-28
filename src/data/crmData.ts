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

export type LeadSource = 'LinkedIn' | 'Email' | 'Referral' | 'Cold Call' | 'Twitter' | 'Website' | 'Google Ads' | 'Partner';

export type CallOutcome =
  | 'connected'
  | 'no_answer'
  | 'voicemail'
  | 'busy'
  | 'wrong_number'
  | 'callback';

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'note' | 'call' | 'status' | 'import' | 'email';
  outcome?: CallOutcome;
  content: string;
  createdAt: string;
  durationSec?: number;
}

export interface LeadCard {
  id: string;
  name: string;
  title: string;         // e.g. "Marketing Director of Microsoft"
  company?: string;
  email?: string;
  phone?: string;
  avatarInitials: string;
  avatarColor: string;   // Tailwind bg class for initials avatar
  sources: LeadSource[];
  priority: LeadFilter;  // maps to filter category
  /** Rating 1–5 dots */
  rating: 1 | 2 | 3 | 4 | 5;
  status?: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Converted' | 'Lost';
  estimatedValue?: number;
  createdDate?: string;
}

export const CRM_LEADS: LeadCard[] = [
  {
    id: 'lead-0',
    name: 'Murtaza',
    title: 'Owner at CoolAir Pros',
    company: 'CoolAir Pros',
    email: 'murtaza@coolairpros.com',
    phone: '+1 (425) 882-8080',
    avatarInitials: 'M',
    avatarColor: 'bg-[#15803d]',
    sources: ['LinkedIn', 'Email'],
    priority: 'Hot Clients',
    rating: 5,
    status: 'Qualified',
    estimatedValue: 95000,
    createdDate: '2025-03-24',
  },
  {
    id: 'lead-1',
    name: 'Jane Doe',
    title: 'Ops Director at HomeServe',
    company: 'HomeServe Partners',
    email: 'jane.doe@homeserve.co',
    phone: '+1 (415) 882-8080',
    avatarInitials: 'JD',
    avatarColor: 'bg-[#7c3aed]',
    sources: ['LinkedIn', 'Email'],
    priority: 'Hot Clients',
    rating: 4,
    status: 'Qualified',
    estimatedValue: 65000,
    createdDate: '2025-03-24',
  },
  {
    id: 'lead-2',
    name: 'Alex Kim',
    title: 'Head of Product at Stripe',
    company: 'Stripe, Inc.',
    email: 'alex.kim@stripe.com',
    phone: '+1 (415) 345-8812',
    avatarInitials: 'AK',
    avatarColor: 'bg-[#0284c7]',
    sources: ['LinkedIn', 'Email'],
    priority: 'Great Interest',
    rating: 3,
    status: 'Proposal',
    estimatedValue: 48000,
    createdDate: '2025-03-25',
  },
  {
    id: 'lead-3',
    name: 'Sofia Reyes',
    title: 'VP Sales at Salesforce',
    company: 'Salesforce',
    email: 'sreyes@salesforce.com',
    phone: '+1 (415) 901-7000',
    avatarInitials: 'SR',
    avatarColor: 'bg-[#d97706]',
    sources: ['Referral'],
    priority: 'Hot Clients',
    rating: 5,
    status: 'Contacted',
    estimatedValue: 92000,
    createdDate: '2025-03-26',
  },
  {
    id: 'lead-4',
    name: 'Marcus Chen',
    title: 'CTO at Figma',
    company: 'Figma',
    email: 'mchen@figma.com',
    phone: '+1 (415) 555-0199',
    avatarInitials: 'MC',
    avatarColor: 'bg-[#059669]',
    sources: ['Cold Call', 'LinkedIn'],
    priority: 'Medium Interest',
    rating: 2,
    status: 'New',
    estimatedValue: 35000,
    createdDate: '2025-03-26',
  },
  {
    id: 'lead-5',
    name: 'Priya Patel',
    title: 'COO at Notion',
    company: 'Notion Labs',
    email: 'ppatel@makenotion.com',
    phone: '+1 (415) 555-0144',
    avatarInitials: 'PP',
    avatarColor: 'bg-[#db2777]',
    sources: ['Email'],
    priority: 'Great Interest',
    rating: 3,
    status: 'Contacted',
    estimatedValue: 42000,
    createdDate: '2025-03-27',
  },
  {
    id: 'lead-6',
    name: 'James Wright',
    title: 'Director of Engineering at Vercel',
    company: 'Vercel Inc.',
    email: 'jwright@vercel.com',
    phone: '+1 (415) 555-0182',
    avatarInitials: 'JW',
    avatarColor: 'bg-[#64748b]',
    sources: ['Twitter', 'Email'],
    priority: 'Low Interest',
    rating: 1,
    status: 'New',
    estimatedValue: 18000,
    createdDate: '2025-03-27',
  },
  {
    id: 'lead-7',
    name: 'Layla Hassan',
    title: 'Chief Strategy Officer at HubSpot',
    company: 'HubSpot',
    email: 'lhassan@hubspot.com',
    phone: '+1 (888) 482-7768',
    avatarInitials: 'LH',
    avatarColor: 'bg-[#f97316]',
    sources: ['LinkedIn'],
    priority: 'Hot Clients',
    rating: 5,
    status: 'Qualified',
    estimatedValue: 85000,
    createdDate: '2025-03-28',
  },
];


export type LeadPipelineStatus = NonNullable<LeadCard['status']>;

export const LEAD_PIPELINE_STAGES: {
  id: LeadPipelineStatus;
  label: string;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
}[] = [
  { id: 'New', label: 'New', badgeColor: 'bg-[#3b82f6]/20', textColor: 'text-[#60a5fa]', borderColor: 'border-[#1e293b]', glowColor: '#3b82f6' },
  { id: 'Contacted', label: 'Contacted', badgeColor: 'bg-[#a855f7]/20', textColor: 'text-[#c084fc]', borderColor: 'border-[#2e1065]', glowColor: '#a855f7' },
  { id: 'Qualified', label: 'Qualified', badgeColor: 'bg-[#f59e0b]/20', textColor: 'text-[#fbbf24]', borderColor: 'border-[#451a03]', glowColor: '#f59e0b' },
  { id: 'Proposal', label: 'Proposal', badgeColor: 'bg-[#38bdf8]/20', textColor: 'text-[#7dd3fc]', borderColor: 'border-[#0c4a6e]', glowColor: '#38bdf8' },
  { id: 'Converted', label: 'Won / Converted', badgeColor: 'bg-[#00e676]/20', textColor: 'text-[#00e676]', borderColor: 'border-[#052e16]', glowColor: '#00e676' },
  { id: 'Lost', label: 'Lost', badgeColor: 'bg-[#ef4444]/20', textColor: 'text-[#f87171]', borderColor: 'border-[#450a0a]', glowColor: '#ef4444' },
];

// Pipeline / Deals ────────────────────────────────────────────────────────

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
