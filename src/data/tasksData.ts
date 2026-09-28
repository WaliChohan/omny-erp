import { TEAM_MEMBERS, TeamMember } from '@/data/projectsData';

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskCategory = 'Finance' | 'Sales' | 'Dev' | 'Operations' | 'General';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface TaskChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TaskComment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface AgencyTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  status?: TaskStatus;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
  assignee?: TeamMember;
  clientId?: string;
  projectId?: string;
  checklist?: TaskChecklistItem[];
  comments?: TaskComment[];
}

export const TASK_STATUS_COLUMNS: { id: TaskStatus; label: string; tone: string }[] = [
  { id: 'todo', label: 'To Do', tone: 'border-[#6b7280]' },
  { id: 'in_progress', label: 'In Progress', tone: 'border-[#38bdf8]' },
  { id: 'review', label: 'Review', tone: 'border-[#a855f7]' },
  { id: 'done', label: 'Done', tone: 'border-[#10b981]' },
];

export const INITIAL_AGENCY_TASKS: AgencyTask[] = [
  {
    id: 'task-1',
    title: 'Send CoolAir Pros booking-portal proposal',
    description: 'Finalize scope, timeline, and Net-15 terms for HVAC booking + dispatch.',
    category: 'Sales',
    priority: 'High',
    dueDate: '2026-09-29',
    completed: false,
    status: 'in_progress',
    createdAt: '2026-09-26',
    assignee: TEAM_MEMBERS[0],
    clientId: 'cli-1',
    projectId: 'p-1',
    checklist: [
      { id: 'c1', text: 'Confirm scope bullets with AM', done: true },
      { id: 'c2', text: 'Attach pricing sheet', done: false },
      { id: 'c3', text: 'Send via Documents hub', done: false },
    ],
    comments: [
      {
        id: 'cm1',
        author: TEAM_MEMBERS[0].name,
        body: 'Client asked for Net-15 and phased go-live.',
        createdAt: '2026-09-27T11:00:00.000Z',
      },
    ],
  },
  {
    id: 'task-2',
    title: 'ComfortZone field-app sprint kickoff',
    description: 'Align milestones and billable phases with the client AM.',
    category: 'Dev',
    priority: 'High',
    dueDate: '2026-09-30',
    completed: false,
    status: 'todo',
    createdAt: '2026-09-27',
    assignee: TEAM_MEMBERS[1],
    clientId: 'cli-2',
    projectId: 'p-2',
    checklist: [
      { id: 'c1', text: 'Share sprint board link', done: false },
      { id: 'c2', text: 'Confirm offline sync requirement', done: false },
    ],
    comments: [],
  },
  {
    id: 'task-3',
    title: 'Publish Apex Plumbing SEO monthly report',
    description: 'Compile rankings, GSC clicks, and next-month content plan.',
    category: 'Operations',
    priority: 'Medium',
    dueDate: '2026-10-01',
    completed: false,
    status: 'review',
    createdAt: '2026-09-25',
    assignee: TEAM_MEMBERS[2],
    clientId: 'cli-3',
    checklist: [{ id: 'c1', text: 'Export GSC CSV', done: true }],
    comments: [],
  },
  {
    id: 'task-4',
    title: 'Invoice HomeServe website milestone 2',
    description: 'Create and send invoice from project billing.',
    category: 'Finance',
    priority: 'Medium',
    dueDate: '2026-10-02',
    completed: false,
    status: 'todo',
    createdAt: '2026-09-28',
    assignee: TEAM_MEMBERS[3],
    clientId: 'cli-4',
    checklist: [],
    comments: [],
  },
  {
    id: 'task-5',
    title: 'Client portal walkthrough — Summit HVAC',
    description: 'Demo invoices, files, and ticket flow in the portal.',
    category: 'General',
    priority: 'Low',
    dueDate: '2026-10-03',
    completed: false,
    status: 'todo',
    createdAt: '2026-09-28',
    assignee: TEAM_MEMBERS[4],
    clientId: 'cli-5',
    checklist: [],
    comments: [],
  },
];
