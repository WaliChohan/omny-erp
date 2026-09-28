import { TEAM_MEMBERS, TeamMember } from '@/data/projectsData';

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskCategory = 'Finance' | 'Sales' | 'Dev' | 'Operations' | 'General';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

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
  assignee?: TeamMember;
  clientId?: string;
  projectId?: string;
}

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
  },
  {
    id: 'task-4',
    title: 'Invoice HomeServe website milestone 2',
    description: 'Create and send invoice from project billing.',
    category: 'Finance',
    priority: 'Medium',
    dueDate: '2026-10-02',
    completed: false,
    createdAt: '2026-09-28',
    assignee: TEAM_MEMBERS[3],
    clientId: 'cli-4',
  },
  {
    id: 'task-5',
    title: 'Client portal walkthrough — Summit HVAC',
    description: 'Demo invoices, files, and ticket flow in the portal.',
    category: 'General',
    priority: 'Low',
    dueDate: '2026-10-03',
    completed: false,
    createdAt: '2026-09-28',
    assignee: TEAM_MEMBERS[4],
    clientId: 'cli-5',
  },
];
