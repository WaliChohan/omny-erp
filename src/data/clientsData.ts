// Agency client roster — mock layer ready for API swap.

export type ClientStatus = 'Active' | 'Onboarding' | 'Paused' | 'Churned';
export type ServiceLine = 'Website' | 'Custom Software' | 'SEO' | 'Mobile App' | 'Retainer';

export interface AgencyClient {
  id: string;
  name: string;
  company: string;
  industry: string;
  email: string;
  phone: string;
  status: ClientStatus;
  services: ServiceLine[];
  mrr: number;
  lifetimeValue: number;
  openProjects: number;
  accountManager: string;
  city: string;
  joinedAt: string;
  lastTouch: string;
  notes?: string;
  leadId?: string;
  contactIds?: string[];
}

export const CLIENT_STATUS_FILTERS: Array<'All' | ClientStatus> = [
  'All',
  'Active',
  'Onboarding',
  'Paused',
  'Churned',
];

export const AGENCY_CLIENTS: AgencyClient[] = [
  {
    id: 'cli-1',
    name: 'James Porter',
    company: 'CoolAir Pros',
    industry: 'HVAC',
    email: 'james@coolairpros.com',
    phone: '+1 (602) 555-0142',
    status: 'Active',
    services: ['Website', 'Custom Software', 'SEO'],
    mrr: 185000,
    lifetimeValue: 4200000,
    openProjects: 2,
    accountManager: 'Sarah Connor',
    city: 'Phoenix, AZ',
    joinedAt: '2024-11-12',
    lastTouch: '2026-09-26',
    notes: 'Booking portal + Google Business SEO focus.',
    leadId: 'lead-0',
  },
  {
    id: 'cli-2',
    name: 'Maria Delgado',
    company: 'ComfortZone HVAC',
    industry: 'HVAC',
    email: 'maria@comfortzone.io',
    phone: '+1 (480) 555-0198',
    status: 'Active',
    services: ['Mobile App', 'Custom Software'],
    mrr: 0,
    lifetimeValue: 2800000,
    openProjects: 1,
    accountManager: 'Alex Vance',
    city: 'Scottsdale, AZ',
    joinedAt: '2025-02-03',
    lastTouch: '2026-09-27',
    leadId: 'lead-1',
  },
  {
    id: 'cli-3',
    name: 'Derek Hale',
    company: 'Apex Plumbing Co.',
    industry: 'Plumbing',
    email: 'derek@apexplumb.com',
    phone: '+1 (623) 555-0111',
    status: 'Active',
    services: ['SEO', 'Website'],
    mrr: 95000,
    lifetimeValue: 1100000,
    openProjects: 1,
    accountManager: 'Elena Rostova',
    city: 'Glendale, AZ',
    joinedAt: '2025-06-18',
    lastTouch: '2026-09-25',
  },
  {
    id: 'cli-4',
    name: 'Nina Shah',
    company: 'HomeServe Partners',
    industry: 'Home Services',
    email: 'nina@homeserve.co',
    phone: '+1 (702) 555-0177',
    status: 'Onboarding',
    services: ['Website', 'SEO'],
    mrr: 120000,
    lifetimeValue: 240000,
    openProjects: 1,
    accountManager: 'Sarah Connor',
    city: 'Las Vegas, NV',
    joinedAt: '2026-09-10',
    lastTouch: '2026-09-28',
  },
  {
    id: 'cli-5',
    name: 'Owen Blake',
    company: 'Summit HVAC Group',
    industry: 'HVAC',
    email: 'owen@summithvac.com',
    phone: '+1 (801) 555-0133',
    status: 'Active',
    services: ['Custom Software', 'Retainer'],
    mrr: 210000,
    lifetimeValue: 5100000,
    openProjects: 2,
    accountManager: 'Devon Miles',
    city: 'Salt Lake City, UT',
    joinedAt: '2024-04-22',
    lastTouch: '2026-09-24',
  },
  {
    id: 'cli-6',
    name: 'Priya Nair',
    company: 'BrightSpark Electrical',
    industry: 'Electrical',
    email: 'priya@brightspark.tech',
    phone: '+1 (858) 555-0166',
    status: 'Paused',
    services: ['Website'],
    mrr: 0,
    lifetimeValue: 650000,
    openProjects: 0,
    accountManager: 'Liam Chen',
    city: 'San Diego, CA',
    joinedAt: '2025-01-09',
    lastTouch: '2026-08-12',
  },
  {
    id: 'cli-7',
    name: 'Tom Rivera',
    company: 'RapidRoof Pros',
    industry: 'Roofing',
    email: 'tom@rapidroof.com',
    phone: '+1 (512) 555-0188',
    status: 'Active',
    services: ['SEO', 'Mobile App'],
    mrr: 75000,
    lifetimeValue: 890000,
    openProjects: 1,
    accountManager: 'Marcus Brody',
    city: 'Austin, TX',
    joinedAt: '2025-09-01',
    lastTouch: '2026-09-22',
  },
  {
    id: 'cli-8',
    name: 'Helen Cho',
    company: 'NestCare Properties',
    industry: 'Property Mgmt',
    email: 'helen@nestcare.com',
    phone: '+1 (206) 555-0120',
    status: 'Churned',
    services: ['Website'],
    mrr: 0,
    lifetimeValue: 420000,
    openProjects: 0,
    accountManager: 'Elena Rostova',
    city: 'Seattle, WA',
    joinedAt: '2023-08-14',
    lastTouch: '2026-05-30',
  },
];

export function formatClientPKR(n: number): string {
  if (n >= 1_000_000) return `PKR ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `PKR ${Math.round(n / 1_000)}K`;
  return `PKR ${n.toLocaleString()}`;
}
