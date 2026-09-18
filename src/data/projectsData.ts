export interface ProjectCardItem {
  id: string;
  title: string;
  category: string;
  tasksCount: number;
  progressPercent: number;
  themeColor: 'purple' | 'teal' | 'orange';
  bgGradient: string;
  avatarsCount: number;
}

export interface TodayTaskItem {
  id: string;
  category: string;
  title: string;
  colorTag: string;
  completed: boolean;
}

export interface CalendarEventItem {
  id: string;
  time: string;
  tag: string;
  title: string;
  color: string;
}

export interface CalendarDateGroup {
  date: string;
  events: CalendarEventItem[];
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  type: 'sow' | 'quotation' | 'legal' | 'invoice' | 'spec' | 'folder';
  size: string;
  syncedAt: string;
  folderPath: string;
  status: 'synced' | 'syncing' | 'pending';
  driveId: string;
}

export const OMNYSYNC_PROJECTS: ProjectCardItem[] = [
  {
    id: 'p-1',
    title: 'Web Development',
    category: 'Full-stack Platform',
    tasksCount: 10,
    progressPercent: 96,
    themeColor: 'purple',
    bgGradient: 'bg-gradient-to-br from-[#6d4cb8] to-[#5939a8]',
    avatarsCount: 7,
  },
  {
    id: 'p-2',
    title: 'Mobile App Design',
    category: 'iOS & Android UX',
    tasksCount: 12,
    progressPercent: 46,
    themeColor: 'teal',
    bgGradient: 'bg-gradient-to-br from-[#3ca997] to-[#2d8d7e]',
    avatarsCount: 9,
  },
  {
    id: 'p-3',
    title: 'Facebook Brand UI Kit',
    category: 'Design Systems',
    tasksCount: 22,
    progressPercent: 73,
    themeColor: 'orange',
    bgGradient: 'bg-gradient-to-br from-[#f26c4f] to-[#dd5739]',
    avatarsCount: 3,
  },
];

export const TODAY_TASKS: TodayTaskItem[] = [
  {
    id: 'tt-1',
    category: 'Mobile App',
    title: 'Prepare Figma file',
    colorTag: 'border-l-[#f97316]',
    completed: false,
  },
  {
    id: 'tt-2',
    category: 'UX wireframes',
    title: 'Design UX wireframes',
    colorTag: 'border-l-[#8b5cf6]',
    completed: false,
  },
  {
    id: 'tt-3',
    category: 'Mobile App',
    title: 'Research',
    colorTag: 'border-l-[#10b981]',
    completed: true,
  },
];

export const CALENDAR_GROUPS: CalendarDateGroup[] = [
  {
    date: 'Oct 20, 2021',
    events: [
      {
        id: 'ev-1',
        time: '10:00',
        tag: 'Dribbble shot',
        title: 'Facebook Brand',
        color: 'border-l-[#10b981]',
      },
      {
        id: 'ev-2',
        time: '13:20',
        tag: 'Design',
        title: 'Task Management',
        color: 'border-l-[#f97316]',
      },
    ],
  },
  {
    date: 'Oct 21, 2021',
    events: [
      {
        id: 'ev-3',
        time: '10:00',
        tag: 'UX Research',
        title: 'Sleep App',
        color: 'border-l-[#8b5cf6]',
      },
      {
        id: 'ev-4',
        time: '13:20',
        tag: 'Design',
        title: 'Task Management',
        color: 'border-l-[#f97316]',
      },
      {
        id: 'ev-5',
        time: '10:00',
        tag: 'Dribbble Shot',
        title: 'Meet Up',
        color: 'border-l-[#10b981]',
      },
    ],
  },
  {
    date: 'Oct 22, 2021',
    events: [
      {
        id: 'ev-6',
        time: '10:00',
        tag: 'Dribbble Shot',
        title: 'Meet Up',
        color: 'border-l-[#10b981]',
      },
      {
        id: 'ev-7',
        time: '11:00',
        tag: 'Design',
        title: 'Mobile App',
        color: 'border-l-[#f97316]',
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
  },
];
