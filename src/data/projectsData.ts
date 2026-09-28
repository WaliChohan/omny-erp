export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  color: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  completed: boolean;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  assignee: TeamMember;
}

export interface ProjectCardItem {
  id: string;
  title: string;
  category: string;
  client?: string;
  description?: string;
  deadline: string;
  budget: number;
  spent: number;
  tasksCount: number;
  progressPercent: number;
  themeColor: 'purple' | 'teal' | 'orange' | 'blue' | 'emerald';
  bgGradient: string;
  avatarsCount: number;
  team: TeamMember[];
  tasks?: ProjectTask[];
  linkedDocIds?: string[];
}

export interface TodayTaskItem {
  id: string;
  category: string;
  title: string;
  colorTag: string;
  completed: boolean;
  assignee?: TeamMember;
  dueDate?: string;
}

export interface CalendarEventItem {
  id: string;
  time: string;
  tag: string;
  title: string;
  color: string;
  date?: string; // YYYY-MM-DD
  projectId?: string;
  assignee?: string;
}

export interface CalendarDateGroup {
  date: string;
  events: CalendarEventItem[];
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  type: 'sow' | 'quotation' | 'legal' | 'invoice' | 'spec' | 'proposal' | 'receipt' | 'folder';
  size: string;
  syncedAt: string;
  folderPath: string;
  status: 'synced' | 'syncing' | 'pending';
  driveId: string;
  projectId?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Sarah Connor',
    role: 'Lead Architect',
    avatar: 'SC',
    email: 'sarah.c@omnysync.io',
    color: 'bg-emerald-500',
  },
  {
    id: 'tm-2',
    name: 'Alex Vance',
    role: 'Senior Fullstack Dev',
    avatar: 'AV',
    email: 'alex.v@omnysync.io',
    color: 'bg-indigo-500',
  },
  {
    id: 'tm-3',
    name: 'Elena Rostova',
    role: 'Lead UI/UX Designer',
    avatar: 'ER',
    email: 'elena.r@omnysync.io',
    color: 'bg-pink-500',
  },
  {
    id: 'tm-4',
    name: 'Devon Miles',
    role: 'Cloud & DevOps Engineer',
    avatar: 'DM',
    email: 'devon.m@omnysync.io',
    color: 'bg-amber-500',
  },
  {
    id: 'tm-5',
    name: 'Liam Chen',
    role: 'Frontend Specialist',
    avatar: 'LC',
    email: 'liam.c@omnysync.io',
    color: 'bg-teal-500',
  },
  {
    id: 'tm-6',
    name: 'Marcus Brody',
    role: 'QA & Compliance Lead',
    avatar: 'MB',
    email: 'marcus.b@omnysync.io',
    color: 'bg-purple-500',
  },
];

export const OMNYSYNC_PROJECTS: ProjectCardItem[] = [
  {
    id: 'p-1',
    title: 'CoolAir Pros — Booking Portal',
    category: 'Custom Software · HVAC',
    client: 'CoolAir Pros',
    description: 'Customer booking portal, technician dispatch board, and Google Business SEO integrations for an HVAC franchise.',
    deadline: '2025-05-15',
    budget: 68000,
    spent: 54400,
    tasksCount: 10,
    progressPercent: 96,
    themeColor: 'purple',
    bgGradient: 'bg-gradient-to-br from-[#6d4cb8] to-[#5939a8]',
    avatarsCount: 7,
    team: [TEAM_MEMBERS[0], TEAM_MEMBERS[1], TEAM_MEMBERS[4]],
    linkedDocIds: ['gdf-1', 'gdf-4'],
    tasks: [
      {
        id: 'pt-101',
        projectId: 'p-1',
        title: 'Optimize GraphQL Ledger queries',
        priority: 'High',
        dueDate: '2025-04-10',
        completed: true,
        status: 'done',
        assignee: TEAM_MEMBERS[1],
      },
      {
        id: 'pt-102',
        projectId: 'p-1',
        title: 'Configure automated DB failover replication',
        priority: 'High',
        dueDate: '2025-04-18',
        completed: true,
        status: 'done',
        assignee: TEAM_MEMBERS[3],
      },
      {
        id: 'pt-103',
        projectId: 'p-1',
        title: 'Perform SOC-2 security penetration tests',
        priority: 'Medium',
        dueDate: '2025-05-02',
        completed: false,
        status: 'in_progress',
        assignee: TEAM_MEMBERS[5],
      },
    ],
  },
  {
    id: 'p-2',
    title: 'ComfortZone — Field App',
    category: 'Mobile App · HVAC',
    client: 'ComfortZone HVAC',
    description: 'Next-gen biometric mobile banking application with instant peer-to-peer settlements and card controls.',
    deadline: '2025-06-30',
    budget: 45000,
    spent: 20700,
    tasksCount: 12,
    progressPercent: 46,
    themeColor: 'teal',
    bgGradient: 'bg-gradient-to-br from-[#3ca997] to-[#2d8d7e]',
    avatarsCount: 9,
    team: [TEAM_MEMBERS[2], TEAM_MEMBERS[4], TEAM_MEMBERS[0]],
    linkedDocIds: ['gdf-5', 'gdf-3'],
    tasks: [
      {
        id: 'pt-201',
        projectId: 'p-2',
        title: 'Design Dark Mode UI tokens & icon kit',
        priority: 'High',
        dueDate: '2025-04-20',
        completed: true,
        status: 'done',
        assignee: TEAM_MEMBERS[2],
      },
      {
        id: 'pt-202',
        projectId: 'p-2',
        title: 'Prototype biometric face-ID onboarding flow',
        priority: 'High',
        dueDate: '2025-05-05',
        completed: false,
        status: 'in_progress',
        assignee: TEAM_MEMBERS[2],
      },
      {
        id: 'pt-203',
        projectId: 'p-2',
        title: 'Setup React Native offline-first SQLite cache',
        priority: 'Medium',
        dueDate: '2025-05-25',
        completed: false,
        status: 'todo',
        assignee: TEAM_MEMBERS[4],
      },
    ],
  },
  {
    id: 'p-3',
    title: 'Facebook Brand UI Kit',
    category: 'Design Systems',
    client: 'Meta Ecosystems',
    description: 'Unified cross-platform component library with tokenized accessibility and automated storybook tests.',
    deadline: '2025-04-25',
    budget: 32000,
    spent: 23360,
    tasksCount: 22,
    progressPercent: 73,
    themeColor: 'orange',
    bgGradient: 'bg-gradient-to-br from-[#f26c4f] to-[#dd5739]',
    avatarsCount: 3,
    team: [TEAM_MEMBERS[2], TEAM_MEMBERS[1]],
    linkedDocIds: ['gdf-2', 'gdf-3'],
    tasks: [
      {
        id: 'pt-301',
        projectId: 'p-3',
        title: 'Audit WCAG 2.1 AAA contrast ratios for all widgets',
        priority: 'Medium',
        dueDate: '2025-04-12',
        completed: true,
        status: 'done',
        assignee: TEAM_MEMBERS[2],
      },
      {
        id: 'pt-302',
        projectId: 'p-3',
        title: 'Publish v2.4 NPM package with Tailwind 4 plugin',
        priority: 'High',
        dueDate: '2025-04-22',
        completed: false,
        status: 'review',
        assignee: TEAM_MEMBERS[1],
      },
    ],
  },
];

export const TODAY_TASKS: TodayTaskItem[] = [
  {
    id: 'tt-1',
    category: 'Mobile App',
    title: 'Prepare Figma file for client walk-through',
    colorTag: 'border-l-[#f97316]',
    completed: false,
    assignee: TEAM_MEMBERS[2],
    dueDate: 'Today, 4:00 PM',
  },
  {
    id: 'tt-2',
    category: 'UX wireframes',
    title: 'Design UX wireframes for payment checkout',
    colorTag: 'border-l-[#8b5cf6]',
    completed: false,
    assignee: TEAM_MEMBERS[4],
    dueDate: 'Today, 6:00 PM',
  },
  {
    id: 'tt-3',
    category: 'Backend Core',
    title: 'Research double-entry ledger event sourcing',
    colorTag: 'border-l-[#10b981]',
    completed: true,
    assignee: TEAM_MEMBERS[1],
    dueDate: 'Completed',
  },
];

export const CALENDAR_GROUPS: CalendarDateGroup[] = [
  {
    date: 'Oct 20, 2025',
    events: [
      {
        id: 'ev-1',
        time: '10:00',
        tag: 'Dribbble shot',
        title: 'Facebook Brand Design Review',
        color: 'border-l-[#10b981]',
        date: '2025-10-20',
      },
      {
        id: 'ev-2',
        time: '13:20',
        tag: 'Design',
        title: 'Mobile App Architecture Alignment',
        color: 'border-l-[#f97316]',
        date: '2025-10-20',
      },
    ],
  },
  {
    date: 'Oct 21, 2025',
    events: [
      {
        id: 'ev-3',
        time: '10:00',
        tag: 'UX Research',
        title: 'FinTech Onboarding User Test',
        color: 'border-l-[#8b5cf6]',
        date: '2025-10-21',
      },
      {
        id: 'ev-4',
        time: '13:20',
        tag: 'Engineering',
        title: 'Sprint Planning & Release 2.4',
        color: 'border-l-[#f97316]',
        date: '2025-10-21',
      },
      {
        id: 'ev-5',
        time: '16:00',
        tag: 'Client Sync',
        title: 'Acme Corp Milestone Demo',
        color: 'border-l-[#10b981]',
        date: '2025-10-21',
      },
    ],
  },
  {
    date: 'Oct 22, 2025',
    events: [
      {
        id: 'ev-6',
        time: '10:00',
        tag: 'Dribbble Shot',
        title: 'UI Component Showcase',
        color: 'border-l-[#10b981]',
        date: '2025-10-22',
      },
      {
        id: 'ev-7',
        time: '11:00',
        tag: 'Design',
        title: 'Mobile App Polish & Handoff',
        color: 'border-l-[#f97316]',
        date: '2025-10-22',
      },
    ],
  },
];

export const GOOGLE_DRIVE_FILES: GoogleDriveFile[] = [
  {
    id: 'gdf-1',
    name: 'SOW_Omnysync_Web_App_v2.4.docx',
    type: 'sow',
    size: '1.4 MB',
    syncedAt: 'Just now',
    folderPath: '/Omnysync/Projects/SOW/',
    status: 'synced',
    driveId: '1AbC_8dK9...',
    projectId: 'p-1',
  },
  {
    id: 'gdf-2',
    name: 'Master_Services_Agreement_NDA_Final.pdf',
    type: 'legal',
    size: '840 KB',
    syncedAt: '12 min ago',
    folderPath: '/Omnysync/Legal/Contracts/',
    status: 'synced',
    driveId: '2XyZ_4mN2...',
    projectId: 'p-3',
  },
  {
    id: 'gdf-3',
    name: 'Commercial_Quotation_Q-2025-089.pdf',
    type: 'quotation',
    size: '420 KB',
    syncedAt: '1 hour ago',
    folderPath: '/Omnysync/Finance/Quotations/',
    status: 'synced',
    driveId: '3Qwe_9kL1...',
    projectId: 'p-2',
  },
  {
    id: 'gdf-4',
    name: 'Enterprise_Invoice_INV-1042.pdf',
    type: 'invoice',
    size: '310 KB',
    syncedAt: '3 hours ago',
    folderPath: '/Omnysync/Finance/Invoices/',
    status: 'synced',
    driveId: '4Poi_3bV6...',
    projectId: 'p-1',
  },
  {
    id: 'gdf-5',
    name: 'Mobile_Design_System_Spec_v1.0.pdf',
    type: 'spec',
    size: '4.8 MB',
    syncedAt: 'Yesterday',
    folderPath: '/Omnysync/Projects/Specs/',
    status: 'synced',
    driveId: '5Mnb_7jH8...',
    projectId: 'p-2',
  },
];
