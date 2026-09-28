// Client portal access & visibility — mock layer for API swap.

export type PortalModuleKey =
  | 'overview'
  | 'projects'
  | 'milestones'
  | 'invoices'
  | 'docs'
  | 'files'
  | 'tickets'
  | 'messages'
  | 'activity';

export const PORTAL_MODULE_LABELS: Record<PortalModuleKey, string> = {
  overview: 'Overview',
  projects: 'Projects',
  milestones: 'Milestones',
  invoices: 'Invoices & payments',
  docs: 'Documents',
  files: 'Files',
  tickets: 'Support tickets',
  messages: 'Messages',
  activity: 'Activity feed',
};

export const DEFAULT_PORTAL_MODULES: Record<PortalModuleKey, boolean> = {
  overview: true,
  projects: true,
  milestones: true,
  invoices: true,
  docs: true,
  files: true,
  tickets: true,
  messages: false,
  activity: true,
};

export interface ClientPortalAccount {
  id: string;
  clientId: string;
  username: string;
  /** Plaintext only in mock localStorage — replace with hashed secrets in production */
  password: string;
  enabled: boolean;
  modules: Record<PortalModuleKey, boolean>;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export function generatePortalPassword(length = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#';
  let out = '';
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function suggestPortalUsername(company: string): string {
  const base = company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '')
    .slice(0, 18);
  return base ? `portal.${base}` : `portal.user${Date.now().toString().slice(-4)}`;
}

export const INITIAL_PORTAL_ACCOUNTS: ClientPortalAccount[] = [
  {
    id: 'portal-1',
    clientId: 'cli-1',
    username: 'portal.coolair',
    password: 'CoolAir#2026',
    enabled: true,
    modules: { ...DEFAULT_PORTAL_MODULES },
    createdAt: '2026-09-01',
    updatedAt: '2026-09-20',
    lastLoginAt: '2026-09-27',
  },
];
