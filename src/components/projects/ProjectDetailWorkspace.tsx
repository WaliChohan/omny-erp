'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Columns3,
  FilePlus2,
  FileText,
  Flag,
  LayoutGrid,
  LayoutList,
  MessageSquare,
  PenTool,
  Plus,
  Receipt,
  ScrollText,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useAgency } from '@/context/AgencyContext';
import type { AgencyTask, TaskStatus } from '@/data/tasksData';
import {
  CalendarEventItem,
  ProjectCardItem,
  ProjectMilestone,
  TEAM_MEMBERS,
  TeamMember,
} from '@/data/projectsData';
import { formatPKR } from '@/data/financialData';
import ProjectWorkspaceNav, {
  ProjectNavGroup,
  ProjectTabId,
} from '@/components/projects/ProjectWorkspaceNav';
import ProjectKanbanBoard from '@/components/projects/ProjectKanbanBoard';
import ProjectTaskDrawer from '@/components/projects/ProjectTaskDrawer';
import ProjectChatPanel from '@/components/projects/ProjectChatPanel';
import ProjectMilestonesPanel from '@/components/projects/ProjectMilestonesPanel';
import ProjectTeamPanel from '@/components/projects/ProjectTeamPanel';
import ProjectWhiteboardPanel from '@/components/projects/ProjectWhiteboardPanel';
import ProjectCalendarView from '@/components/projects/ProjectCalendarView';

interface ProjectDetailWorkspaceProps {
  project: ProjectCardItem;
  onBack: () => void;
  onUpdateProject?: (updated: ProjectCardItem) => void;
  onCreateInvoice?: () => void;
  onOpenClient?: () => void;
}

function blankTask(project: ProjectCardItem): AgencyTask {
  return {
    id: '',
    title: '',
    description: '',
    category: 'Dev',
    priority: 'Medium',
    dueDate: project.deadline || new Date().toISOString().slice(0, 10),
    completed: false,
    status: 'todo',
    createdAt: new Date().toISOString().slice(0, 10),
    assignee: project.team[0] || TEAM_MEMBERS[0],
    projectId: project.id,
    clientId: project.clientId,
    checklist: [],
    comments: [],
  };
}

export default function ProjectDetailWorkspace({
  project: initialProject,
  onBack,
  onUpdateProject,
  onCreateInvoice,
  onOpenClient,
}: ProjectDetailWorkspaceProps) {
  const agency = useAgency();
  const {
    getTasksForProject,
    addTask,
    updateTask,
    deleteTask,
    createDocument,
    createHubDocument,
    setActiveHubDocument,
    navigate,
    getDocsForProject,
    getHubDocsForProject,
    clients,
    updateProject,
  } = agency;

  const [project, setProject] = useState<ProjectCardItem>(initialProject);
  const [activeTab, setActiveTab] = useState<ProjectTabId>('overview');
  const seededRef = useRef(false);

  const [taskViewMode, setTaskViewMode] = useState<'list' | 'kanban'>('kanban');
  const [taskSearch, setTaskSearch] = useState('');
  const [taskFilterAssignee, setTaskFilterAssignee] = useState('all');
  const [taskFilterStatus, setTaskFilterStatus] = useState<'all' | TaskStatus>('all');
  const [taskFilterPriority, setTaskFilterPriority] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [editingTask, setEditingTask] = useState<AgencyTask | null>(null);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('edit');
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setProject(initialProject);
  }, [initialProject]);

  const tasks = getTasksForProject(project.id);

  useEffect(() => {
    if (seededRef.current) return;
    if (getTasksForProject(project.id).length > 0) {
      seededRef.current = true;
      return;
    }
    const seed = project.tasks?.length
      ? project.tasks
      : [
          {
            title: 'Discovery & scope lock',
            priority: 'High' as const,
            dueDate: project.deadline,
            completed: false,
            status: 'todo' as const,
            assignee: project.team[0] || TEAM_MEMBERS[0],
          },
          {
            title: 'Build milestone 1 deliverable',
            priority: 'High' as const,
            dueDate: project.deadline,
            completed: false,
            status: 'in_progress' as const,
            assignee: project.team[1] || project.team[0] || TEAM_MEMBERS[0],
          },
        ];
    seed.forEach((t: any) => {
      addTask({
        title: t.title,
        description: t.description,
        category: 'Dev',
        priority: t.priority,
        dueDate: t.dueDate,
        completed: !!t.completed,
        status: t.status || (t.completed ? 'done' : 'todo'),
        assignee: t.assignee,
        projectId: project.id,
        clientId: project.clientId,
        checklist: [],
        comments: [],
      });
    });
    seededRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const doneCount = tasks.filter((t) => t.status === 'done' || t.completed).length;

  // Live progress from tasks (depend on counts, not array identity)
  useEffect(() => {
    const total = tasks.length;
    const progressPercent = total > 0 ? Math.round((doneCount / total) * 100) : project.progressPercent || 0;
    if (progressPercent === project.progressPercent && total === (project.tasksCount || 0)) return;
    const next = {
      ...project,
      progressPercent,
      tasksCount: total,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setProject(next);
    onUpdateProject?.(next);
    updateProject(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id, doneCount, tasks.length]);

  const persistProject = (next: ProjectCardItem) => {
    const stamped = { ...next, updatedAt: new Date().toISOString().slice(0, 10) };
    setProject(stamped);
    onUpdateProject?.(stamped);
    updateProject(stamped);
  };

  const commercialDocs = getDocsForProject(project.id);
  const hubDocs = getHubDocsForProject(project.id);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (taskFilterAssignee !== 'all' && t.assignee?.id !== taskFilterAssignee) return false;
      if (taskFilterStatus !== 'all') {
        const st = t.status || (t.completed ? 'done' : 'todo');
        if (st !== taskFilterStatus) return false;
      }
      if (taskFilterPriority !== 'all' && t.priority !== taskFilterPriority) return false;
      if (taskSearch.trim()) {
        const q = taskSearch.toLowerCase();
        const blob = `${t.title} ${t.description || ''}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, taskFilterAssignee, taskFilterStatus, taskFilterPriority, taskSearch]);

  const milestones = project.milestones || [];

  const calendarEvents: CalendarEventItem[] = useMemo(() => {
    const taskEv = tasks.map((t) => ({
      id: `task-${t.id}`,
      time: 'Due',
      tag: 'Task',
      title: t.title,
      color:
        t.priority === 'High' ? 'bg-[#f87171]' : t.priority === 'Medium' ? 'bg-[#fbbf24]' : 'bg-[#34d399]',
      date: t.dueDate,
      projectId: project.id,
      assignee: t.assignee?.name,
    }));
    const msEv = milestones.map((m) => ({
      id: `ms-${m.id}`,
      time: 'Milestone',
      tag: 'Milestone',
      title: m.title,
      color: 'bg-[#a855f7]',
      date: m.dueDate,
      projectId: project.id,
    }));
    return [...taskEv, ...msEv];
  }, [tasks, milestones, project.id]);

  const navGroups: ProjectNavGroup[] = [
    {
      id: 'plan',
      label: 'Plan',
      tabs: [
        { id: 'overview', label: 'Overview', icon: LayoutGrid },
        { id: 'milestones', label: 'Milestones', icon: Flag, badge: milestones.length },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
      ],
    },
    {
      id: 'execute',
      label: 'Execute',
      tabs: [
        { id: 'tasks', label: 'Tasks', icon: CheckCircle2, badge: tasks.length },
        { id: 'team', label: 'Team', icon: Users, badge: project.team.length },
      ],
    },
    {
      id: 'collab',
      label: 'Collaborate',
      tabs: [
        { id: 'chat', label: 'Chat', icon: MessageSquare },
        { id: 'whiteboard', label: 'Whiteboard', icon: PenTool },
      ],
    },
    {
      id: 'deliver',
      label: 'Deliver',
      tabs: [
        {
          id: 'docs',
          label: 'Docs',
          icon: FileText,
          badge: commercialDocs.length + hubDocs.length,
        },
      ],
    },
  ];

  const setTaskStatus = (id: string, status: TaskStatus) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    updateTask({ ...t, status, completed: status === 'done' });
  };

  const openCreateTask = () => {
    setDrawerMode('create');
    setEditingTask(blankTask(project));
    setIsTaskDrawerOpen(true);
  };

  const openEditTask = (t: AgencyTask) => {
    setDrawerMode('edit');
    setEditingTask(t);
    setIsTaskDrawerOpen(true);
  };

  const handleSaveTask = (t: AgencyTask) => {
    if (drawerMode === 'create' || !t.id) {
      addTask({
        title: t.title,
        description: t.description,
        category: t.category || 'Dev',
        priority: t.priority,
        dueDate: t.dueDate,
        completed: t.status === 'done',
        status: t.status || 'todo',
        assignee: t.assignee,
        projectId: project.id,
        clientId: project.clientId,
        checklist: t.checklist || [],
        comments: t.comments || [],
      });
    } else {
      updateTask({ ...t, projectId: project.id, clientId: project.clientId });
    }
  };

  const clearTaskFilters = () => {
    setTaskSearch('');
    setTaskFilterAssignee('all');
    setTaskFilterStatus('all');
    setTaskFilterPriority('all');
  };

  const bulkSetStatus = (status: TaskStatus) => {
    selectedIds.forEach((id) => setTaskStatus(id, status));
    setSelectedIds([]);
  };

  const bulkDelete = () => {
    if (!selectedIds.length) return;
    if (!confirm(`Delete ${selectedIds.length} task(s)?`)) return;
    selectedIds.forEach((id) => deleteTask(id));
    setSelectedIds([]);
  };

  const createProjectCommercialDoc = (docType: 'sow' | 'quotation' | 'invoice') => {
    const client = project.clientId ? clients.find((c) => c.id === project.clientId) : undefined;
    const commercial = createDocument({
      docType,
      clientId: project.clientId,
      projectId: project.id,
      title:
        docType === 'sow'
          ? `SOW — ${project.title}`
          : docType === 'quotation'
            ? `Quote — ${project.title}`
            : `Invoice — ${project.title}`,
      amount: project.budget,
      description: `${docType.toUpperCase()} for ${project.title}`,
    });
    const hubType = docType === 'sow' ? 'proposal' : docType === 'quotation' ? 'quotation' : 'invoice';
    const hub = createHubDocument({
      docNumber: commercial.docNumber,
      type: hubType,
      subtype: 'standard',
      status: 'draft',
      clientId: project.clientId,
      projectId: project.id,
      clientName: client?.name || project.client || 'Client',
      clientCompany: client?.company || project.client || 'Client',
      clientEmail: client?.email || '',
      clientPhone: client?.phone || '',
      clientAddress: client?.city || '',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: project.deadline,
      currency: 'PKR',
      subtotal: project.budget,
      taxRate: 0,
      taxAmount: 0,
      discountAmount: 0,
      grandTotal: project.budget,
      notes: `Generated from project workspace: ${project.title}`,
      terms: 'Net 15. Payment via bank transfer to OMNYSYNC.',
      proposalHeadline: docType === 'sow' ? `Statement of Work — ${project.title}` : undefined,
      proposalSubhead:
        docType === 'sow'
          ? 'Scope, deliverables, timeline, and commercial terms for this engagement.'
          : undefined,
      sections:
        docType === 'sow'
          ? [
              {
                id: 's1',
                sectionNumber: '01',
                title: 'Scope of Work',
                content: `OMNYSYNC will deliver ${project.title} including discovery, design, build, QA, and launch support.`,
              },
              {
                id: 's2',
                sectionNumber: '02',
                title: 'Deliverables',
                content: 'Milestone-based deliverables as listed in the commercial line items.',
              },
              {
                id: 's3',
                sectionNumber: '03',
                title: 'Timeline',
                content: `Target completion ${project.deadline}. Client feedback SLA: 3 business days.`,
              },
              {
                id: 's4',
                sectionNumber: '04',
                title: 'Fees & Payment',
                content: 'Fees in PKR. Kickoff deposit + milestone invoices. Net 15.',
              },
            ]
          : undefined,
      items: [
        {
          id: 'item-1',
          itemType: 'service',
          skuOrCode: docType.toUpperCase(),
          description: project.title,
          quantity: 1,
          unitName: 'project',
          unitPrice: project.budget,
          taxRate: 0,
          discount: 0,
          totalPrice: project.budget,
        },
      ],
    });
    setActiveHubDocument(hub);
    navigate({ tab: 'documents', focus: { kind: 'document', id: hub.id } });
  };

  const taskCounts = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t.assignee?.id) map[t.assignee.id] = (map[t.assignee.id] || 0) + 1;
    });
    return map;
  }, [tasks]);

  const filtersActive =
    taskSearch ||
    taskFilterAssignee !== 'all' ||
    taskFilterStatus !== 'all' ||
    taskFilterPriority !== 'all';

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Banner */}
      <div className={`relative overflow-hidden rounded-3xl border border-white/10 ${project.bgGradient} p-6 shadow-xl`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/70 hover:text-white mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All projects
            </button>
            <h1 className="text-2xl font-black text-white tracking-tight">{project.title}</h1>
            <p className="text-sm text-white/75 mt-1 max-w-2xl">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/25 text-white/90 border border-white/10">
                {project.category}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/25 text-white/90 border border-white/10 capitalize">
                {project.status || 'active'}
              </span>
              {project.client && (
                <button
                  type="button"
                  onClick={onOpenClient}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#2dd4bf]/20 text-[#b8ff00] border border-[#2dd4bf]/30 hover:bg-[#2dd4bf]/30"
                >
                  {project.client}
                </button>
              )}
              <span className="text-[10px] font-mono text-white/70 px-2.5 py-1">
                Due {project.deadline}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Progress</p>
              <p className="text-3xl font-black text-white font-mono">{project.progressPercent}%</p>
              <p className="text-[11px] text-white/70">
                {doneCount}/{tasks.length} tasks done · {formatPKR(project.spent, true)} /{' '}
                {formatPKR(project.budget, true)}
              </p>
            </div>
            <div className="w-48 h-2 rounded-full bg-black/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#b8ff00]"
                style={{ width: `${Math.min(100, project.progressPercent)}%` }}
              />
            </div>
            {onCreateInvoice && (
              <button
                type="button"
                onClick={onCreateInvoice}
                className="mt-1 px-3 py-1.5 rounded-xl bg-white/15 text-white text-[11px] font-bold border border-white/20 hover:bg-white/25"
              >
                Quick invoice
              </button>
            )}
          </div>
        </div>
      </div>

      <ProjectWorkspaceNav groups={navGroups} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'tasks' as const, label: 'Open task board' },
              { id: 'milestones' as const, label: 'Milestones' },
              { id: 'chat' as const, label: 'Project chat' },
              { id: 'whiteboard' as const, label: 'Whiteboard' },
              { id: 'docs' as const, label: 'Docs & SOW' },
            ].map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setActiveTab(a.id)}
                className="px-3 py-2 rounded-xl bg-[#141d18] border border-[#1e2a22] text-[11px] font-bold text-white hover:border-[#2dd4bf]/40"
              >
                {a.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Tasks done', value: `${doneCount}/${tasks.length}`, tone: 'text-[#2dd4bf]' },
              { label: 'Milestones', value: String(milestones.length), tone: 'text-[#a855f7]' },
              {
                label: 'Docs',
                value: String(commercialDocs.length + hubDocs.length),
                tone: 'text-[#38bdf8]',
              },
              {
                label: 'Budget used',
                value: project.budget ? `${Math.round((project.spent / project.budget) * 100)}%` : '—',
                tone: 'text-[#fbbf24]',
              },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl bg-[#121915] border border-[#1e2d24] p-4">
                <p className="text-[10px] uppercase tracking-wider text-[#6b7280] font-bold">{c.label}</p>
                <p className={`text-2xl font-black mt-1 ${c.tone}`}>{c.value}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#121915] border border-[#1e2d24] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Upcoming tasks</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('tasks')}
                  className="text-[11px] text-[#2dd4bf] font-semibold"
                >
                  Board →
                </button>
              </div>
              {tasks.filter((t) => !t.completed && t.status !== 'done').slice(0, 5).length === 0 ? (
                <p className="text-xs text-[#6b7280]">All caught up.</p>
              ) : (
                <div className="space-y-2">
                  {tasks
                    .filter((t) => !t.completed && t.status !== 'done')
                    .slice(0, 5)
                    .map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => openEditTask(t)}
                        className="w-full text-left p-2.5 rounded-xl bg-[#0b1210] border border-[#1e2a22] hover:border-[#2dd4bf]/30"
                      >
                        <p className="text-xs font-bold text-white">{t.title}</p>
                        <p className="text-[10px] text-[#6b7280] mt-0.5">
                          {t.status || 'todo'} · due {t.dueDate}
                        </p>
                      </button>
                    ))}
                </div>
              )}
            </div>
            <div className="rounded-2xl bg-[#121915] border border-[#1e2d24] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Milestone pulse</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('milestones')}
                  className="text-[11px] text-[#2dd4bf] font-semibold"
                >
                  Manage →
                </button>
              </div>
              {milestones.length === 0 ? (
                <p className="text-xs text-[#6b7280]">No milestones — add phase gates in Plan.</p>
              ) : (
                <div className="space-y-2">
                  {milestones.slice(0, 4).map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-[#0b1210] border border-[#1e2a22] flex justify-between gap-2"
                    >
                      <p className="text-xs font-bold text-white">{m.title}</p>
                      <span className="text-[10px] text-[#9ca3af] capitalize shrink-0">
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'milestones' && (
        <ProjectMilestonesPanel
          milestones={milestones}
          onChange={(next: ProjectMilestone[]) => persistProject({ ...project, milestones: next })}
        />
      )}

      {activeTab === 'calendar' && (
        <div className="rounded-2xl border border-[#1e2d24] overflow-hidden bg-[#121915]">
          <ProjectCalendarView
            projectId={project.id}
            externalEvents={calendarEvents}
            onEventClick={(ev) => {
              if (ev.id.startsWith('task-')) {
                const id = ev.id.replace('task-', '');
                const t = tasks.find((x) => x.id === id);
                if (t) openEditTask(t);
              } else if (ev.id.startsWith('ms-')) {
                setActiveTab('milestones');
              }
            }}
          />
        </div>
      )}

      {activeTab === 'team' && (
        <ProjectTeamPanel
          team={project.team}
          taskCounts={taskCounts}
          onChange={(team: TeamMember[]) =>
            persistProject({ ...project, team, avatarsCount: team.length })
          }
        />
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#121915] border border-[#1e2d24] p-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Tasks</h2>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                Enterprise board — create, drag statuses, open cards for checklist & comments
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-[#0b1210] border border-[#1e2a22] rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setTaskViewMode('kanban')}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                    taskViewMode === 'kanban' ? 'bg-[#2dd4bf] text-[#052e24]' : 'text-[#9ca3af]'
                  }`}
                >
                  <Columns3 className="w-3.5 h-3.5" /> Board
                </button>
                <button
                  type="button"
                  onClick={() => setTaskViewMode('list')}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                    taskViewMode === 'list' ? 'bg-[#2dd4bf] text-[#052e24]' : 'text-[#9ca3af]'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" /> List
                </button>
              </div>
              <button
                type="button"
                onClick={openCreateTask}
                className="px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-black flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> New task
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center rounded-2xl bg-[#0b1210] border border-[#1e2a22] p-3">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="w-3.5 h-3.5 text-[#6b7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Search tasks…"
                className="w-full bg-[#141d18] border border-[#1e2a22] rounded-xl pl-8 pr-3 py-2 text-xs text-white"
              />
            </div>
            <select
              value={taskFilterStatus}
              onChange={(e) => setTaskFilterStatus(e.target.value as any)}
              className="bg-[#141d18] border border-[#1e2a22] rounded-xl px-2 py-2 text-[11px] text-white"
            >
              <option value="all">All statuses</option>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
            <select
              value={taskFilterPriority}
              onChange={(e) => setTaskFilterPriority(e.target.value as any)}
              className="bg-[#141d18] border border-[#1e2a22] rounded-xl px-2 py-2 text-[11px] text-white"
            >
              <option value="all">All priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={taskFilterAssignee}
              onChange={(e) => setTaskFilterAssignee(e.target.value)}
              className="bg-[#141d18] border border-[#1e2a22] rounded-xl px-2 py-2 text-[11px] text-white"
            >
              <option value="all">All assignees</option>
              {project.team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            {filtersActive && (
              <button
                type="button"
                onClick={clearTaskFilters}
                className="px-2 py-2 text-[11px] text-[#9ca3af] flex items-center gap-1 hover:text-white"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#18261e] border border-[#2dd4bf]/30 px-3 py-2">
              <span className="text-[11px] text-[#2dd4bf] font-bold">{selectedIds.length} selected</span>
              <button type="button" onClick={() => bulkSetStatus('in_progress')} className="text-[10px] font-bold text-white px-2 py-1 rounded-lg bg-[#141d18]">
                → In progress
              </button>
              <button type="button" onClick={() => bulkSetStatus('done')} className="text-[10px] font-bold text-white px-2 py-1 rounded-lg bg-[#141d18]">
                → Done
              </button>
              <button type="button" onClick={bulkDelete} className="text-[10px] font-bold text-[#f87171] px-2 py-1 rounded-lg bg-[#2a1212] flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
              <button type="button" onClick={() => setSelectedIds([])} className="ml-auto text-[10px] text-[#9ca3af]">
                Clear selection
              </button>
            </div>
          )}

          {filteredTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#1e2a22] p-10 text-center">
              <p className="text-sm font-bold text-white">
                {tasks.length === 0 ? 'No tasks on this project yet' : 'No tasks match filters'}
              </p>
              <p className="text-[11px] text-[#9ca3af] mt-1">
                {tasks.length === 0
                  ? 'Create the first deliverable to kick off the board.'
                  : 'Try clearing filters.'}
              </p>
              <button
                type="button"
                onClick={tasks.length === 0 ? openCreateTask : clearTaskFilters}
                className="mt-3 px-3 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold"
              >
                {tasks.length === 0 ? 'Create task' : 'Clear filters'}
              </button>
            </div>
          ) : taskViewMode === 'kanban' ? (
            <ProjectKanbanBoard
              tasks={filteredTasks}
              onStatusChange={setTaskStatus}
              onOpenTask={openEditTask}
            />
          ) : (
            <div className="rounded-2xl bg-[#121915] border border-[#1e2d24] overflow-hidden divide-y divide-[#18241d]">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 flex flex-wrap items-center gap-3 hover:bg-[#16211a]"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(task.id)}
                    onChange={(e) => {
                      setSelectedIds((prev) =>
                        e.target.checked ? [...prev, task.id] : prev.filter((x) => x !== task.id)
                      );
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setTaskStatus(
                        task.id,
                        task.status === 'done' || task.completed ? 'todo' : 'done'
                      )
                    }
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      task.completed || task.status === 'done'
                        ? 'bg-[#10b981] border-[#10b981] text-black'
                        : 'border-[#384e40]'
                    }`}
                  >
                    {(task.completed || task.status === 'done') && (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditTask(task)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p
                      className={`text-sm font-bold ${
                        task.completed || task.status === 'done'
                          ? 'line-through text-[#6b7280]'
                          : 'text-white'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-[10px] text-[#6b7280]">
                      {task.status || 'todo'} · {task.priority} · due {task.dueDate}
                    </p>
                  </button>
                  <span className="text-[10px] text-[#9ca3af]">{task.assignee?.name || 'Unassigned'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'chat' && (
        <ProjectChatPanel projectId={project.id} projectTitle={project.title} />
      )}

      {activeTab === 'whiteboard' && (
        <ProjectWhiteboardPanel projectId={project.id} projectTitle={project.title} />
      )}

      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#121915] border border-[#1e2d24] p-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Project documents</h2>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                Create letterhead SOW, quotes, and invoices linked to this engagement
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => createProjectCommercialDoc('sow')}
                className="px-3 py-2 rounded-xl bg-[#141d18] border border-[#1e2a22] text-xs font-bold text-white flex items-center gap-1.5"
              >
                <ScrollText className="w-3.5 h-3.5 text-[#a855f7]" /> New SOW
              </button>
              <button
                type="button"
                onClick={() => createProjectCommercialDoc('quotation')}
                className="px-3 py-2 rounded-xl bg-[#141d18] border border-[#1e2a22] text-xs font-bold text-white flex items-center gap-1.5"
              >
                <FilePlus2 className="w-3.5 h-3.5 text-[#38bdf8]" /> New quote
              </button>
              <button
                type="button"
                onClick={() => createProjectCommercialDoc('invoice')}
                className="px-3 py-2 rounded-xl bg-[#141d18] border border-[#1e2a22] text-xs font-bold text-white flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5 text-[#fbbf24]" /> New invoice
              </button>
            </div>
          </div>
          {commercialDocs.length + hubDocs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#1e2a22] p-10 text-center">
              <p className="text-sm font-bold text-white">No documents linked yet</p>
              <p className="text-[11px] text-[#9ca3af] mt-1">
                Generate an SOW or quote to kick off commercial paperwork.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {commercialDocs.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() =>
                    navigate({ tab: 'finance', financeSub: d.docType === 'invoice' ? 'invoices' : 'quotes' })
                  }
                  className="text-left rounded-2xl bg-[#121915] border border-[#1e2d24] p-4 hover:border-[#2dd4bf]/30"
                >
                  <p className="text-[10px] uppercase tracking-wider text-[#6b7280] font-bold">
                    {d.docType}
                  </p>
                  <p className="text-sm font-bold text-white mt-1">{d.title}</p>
                  <p className="text-[11px] text-[#9ca3af] mt-1">
                    {d.docNumber} · {formatPKR(d.totalAmount, true)} · {d.status}
                  </p>
                </button>
              ))}
              {hubDocs.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setActiveHubDocument(d);
                    navigate({ tab: 'documents', focus: { kind: 'document', id: d.id } });
                  }}
                  className="text-left rounded-2xl bg-[#121915] border border-[#1e2d24] p-4 hover:border-[#2dd4bf]/30"
                >
                  <p className="text-[10px] uppercase tracking-wider text-[#6b7280] font-bold">
                    Hub · {d.type}
                  </p>
                  <p className="text-sm font-bold text-white mt-1">{d.docNumber}</p>
                  <p className="text-[11px] text-[#9ca3af] mt-1">
                    {formatPKR(d.grandTotal, true)} · {d.status}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <ProjectTaskDrawer
        task={editingTask}
        isOpen={isTaskDrawerOpen}
        mode={drawerMode}
        onClose={() => {
          setIsTaskDrawerOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={(id) => deleteTask(id)}
      />
    </div>
  );
}
