'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  LayoutGrid,
  Plus,
  Trash2,
  Users,
  PenTool,
  Check,
  X,
  Sparkles,
  Link as LinkIcon,
  Download,
  AlertCircle,
  TrendingUp,
  Tag,
  Kanban,
  Edit2,
  Layers,
  RotateCcw,
} from 'lucide-react';
import {
  ProjectCardItem,
  ProjectTask,
  TeamMember,
  TEAM_MEMBERS,
  GOOGLE_DRIVE_FILES,
} from '@/data/projectsData';
import { COMMERCIAL_DOCUMENTS, CommercialDocument } from '@/data/financialData';
import ProjectCalendarView from '@/components/projects/ProjectCalendarView';
import FolderCard from '@/components/common/FolderCard';
import GooeyFolderTabs, { TabItem } from '@/components/ui/GooeyFolderTabs';

interface ProjectDetailWorkspaceProps {
  project: ProjectCardItem;
  onBack: () => void;
  onUpdateProject?: (updated: ProjectCardItem) => void;
  onCreateInvoice?: () => void;
  onOpenClient?: () => void;
}

export default function ProjectDetailWorkspace({
  project: initialProject,
  onBack,
  onUpdateProject,
  onCreateInvoice,
  onOpenClient,
}: ProjectDetailWorkspaceProps) {
  const [project, setProject] = useState<ProjectCardItem>(initialProject);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'team' | 'tasks' | 'timeline' | 'calendar' | 'docs' | 'whiteboard'
  >('overview');

  // Tasks state inside project
  const [tasks, setTasks] = useState<ProjectTask[]>(
    project.tasks || [
      {
        id: 'pt-1',
        projectId: project.id,
        title: 'Architectural Blueprint & Database Design',
        priority: 'High',
        dueDate: project.deadline,
        completed: true,
        status: 'done',
        assignee: project.team[0] || TEAM_MEMBERS[0],
      },
      {
        id: 'pt-2',
        projectId: project.id,
        title: 'Develop core API gateway and security tokens',
        priority: 'High',
        dueDate: project.deadline,
        completed: false,
        status: 'in_progress',
        assignee: project.team[1] || TEAM_MEMBERS[1],
      },
      {
        id: 'pt-3',
        projectId: project.id,
        title: 'Design responsive UI components & theme tokens',
        priority: 'Medium',
        dueDate: project.deadline,
        completed: false,
        status: 'todo',
        assignee: project.team[2] || TEAM_MEMBERS[2],
      },
    ]
  );

  // New task modal
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState(project.deadline);
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState<string>(
    project.team[0]?.id || TEAM_MEMBERS[0].id
  );

  // Add team member modal
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Link Doc modal
  const [isLinkingDoc, setIsLinkingDoc] = useState(false);
  const [selectedDocIdToLink, setSelectedDocIdToLink] = useState('');

  // Project Whiteboard Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#2dd4bf');
  const [drawSize, setDrawSize] = useState(3);
  const [stickyNotes, setStickyNotes] = useState<
    { id: string; text: string; x: number; y: number; color: string }[]
  >([
    { id: 'sn-1', text: 'Define Sprint 2 Scope & Acceptance Criteria', x: 40, y: 40, color: 'bg-amber-400' },
    { id: 'sn-2', text: 'Security review for Bank API Webhooks', x: 260, y: 40, color: 'bg-emerald-400' },
  ]);
  const [newStickyText, setNewStickyText] = useState('');

  // Task filter inside project
  const [taskFilterAssignee, setTaskFilterAssignee] = useState<string>('all');
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>('all');

  // Compute progress
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const progressPercent =
    tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : project.progressPercent;

  // Days remaining calculation
  const daysRemaining = useMemo(() => {
    const deadlineDate = new Date(project.deadline).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((deadlineDate - now) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 0;
  }, [project.deadline]);

  // Linked Docs
  const linkedCommercialDocs = useMemo(() => {
    return COMMERCIAL_DOCUMENTS.filter(
      (d) => d.projectId === project.id || (project.linkedDocIds && project.linkedDocIds.includes(d.id))
    );
  }, [project]);

  const linkedDriveFiles = useMemo(() => {
    return GOOGLE_DRIVE_FILES.filter(
      (f) => f.projectId === project.id || (project.linkedDocIds && project.linkedDocIds.includes(f.id))
    );
  }, [project]);

  // Handle task completion toggle
  const toggleTaskCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          status: nextCompleted ? 'done' : 'in_progress',
        };
      })
    );
  };

  // Handle add task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const assignee =
      TEAM_MEMBERS.find((m) => m.id === newTaskAssigneeId) || project.team[0] || TEAM_MEMBERS[0];

    const newTask: ProjectTask = {
      id: `pt-${Date.now()}`,
      projectId: project.id,
      title: newTaskTitle,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      completed: false,
      status: 'todo',
      assignee,
    };

    setTasks([...tasks, newTask]);
    setIsAddingTask(false);
    setNewTaskTitle('');
  };

  // Handle add member to project
  const handleAddMemberToProject = (member: TeamMember) => {
    if (!project.team.some((m) => m.id === member.id)) {
      const updatedTeam = [...project.team, member];
      const updatedProj = { ...project, team: updatedTeam, avatarsCount: updatedTeam.length };
      setProject(updatedProj);
      if (onUpdateProject) onUpdateProject(updatedProj);
    }
    setIsAddingMember(false);
  };

  // Handle link document
  const handleLinkDoc = () => {
    if (!selectedDocIdToLink) return;
    const currentLinked = project.linkedDocIds || [];
    if (!currentLinked.includes(selectedDocIdToLink)) {
      const updated = { ...project, linkedDocIds: [...currentLinked, selectedDocIdToLink] };
      setProject(updated);
      if (onUpdateProject) onUpdateProject(updated);
    }
    setIsLinkingDoc(false);
  };

  // Whiteboard Canvas Drawing Logic
  useEffect(() => {
    if (activeTab !== 'whiteboard') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill dark background once
    ctx.fillStyle = '#101613';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawSize;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#101613';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const addStickyNote = () => {
    if (!newStickyText.trim()) return;
    const newNote = {
      id: `sn-${Date.now()}`,
      text: newStickyText,
      x: 50 + (stickyNotes.length % 4) * 180,
      y: 120 + Math.floor(stickyNotes.length / 4) * 140,
      color: 'bg-amber-300',
    };
    setStickyNotes([...stickyNotes, newNote]);
    setNewStickyText('');
  };

  const removeStickyNote = (id: string) => {
    setStickyNotes(stickyNotes.filter((n) => n.id !== id));
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => {
    if (taskFilterAssignee !== 'all' && t.assignee.id !== taskFilterAssignee) return false;
    if (taskFilterStatus !== 'all') {
      if (taskFilterStatus === 'completed' && !t.completed) return false;
      if (taskFilterStatus === 'pending' && t.completed) return false;
    }
    return true;
  });

  const workspaceTabs: TabItem[] = [
    { id: 'overview', label: 'Workspace Dashboard', icon: LayoutGrid },
    { id: 'team', label: 'Team Members', icon: Users, badge: project.team.length },
    { id: 'tasks', label: 'Tasks & To-Do', icon: CheckCircle2, badge: tasks.length },
    { id: 'timeline', label: 'Milestone Timeline', icon: Clock },
    { id: 'calendar', label: 'Separate Calendar View', icon: Calendar },
    { id: 'docs', label: 'Project Docs', icon: FileText, badge: linkedCommercialDocs.length + linkedDriveFiles.length },
    { id: 'whiteboard', label: 'Project Whiteboard', icon: PenTool },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-wrap items-center gap-2 px-1 pt-1">
        {onOpenClient && (
          <button
            onClick={onOpenClient}
            className="px-3 py-1.5 rounded-lg bg-[#141e18] border border-[#223328] text-[11px] font-bold text-[#9ca3af] hover:text-white"
          >
            Open client
          </button>
        )}
        {onCreateInvoice && (
          <button
            onClick={onCreateInvoice}
            className="px-3 py-1.5 rounded-lg bg-[#2dd4bf] text-[#052e24] text-[11px] font-bold"
          >
            Bill milestone
          </button>
        )}
      </div>

      {/* ── Top Navigation Bar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141e18] border border-[#223328] hover:border-[#2dd4bf] text-xs font-bold text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#2dd4bf]" />
          <span>Back to Projects Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#18261e] text-[#2dd4bf] border border-[#23382d]">
            Project ID: {project.id}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30">
            Status: On Track
          </span>
        </div>
      </div>

      {/* ── Project Header Card ───────────────────────────────────────────── */}
      <div className={`${project.bgGradient} rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden`}>
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
                {project.category}
              </span>
              <h1 className="text-3xl font-black tracking-tight mt-2">{project.title}</h1>
              <p className="text-xs text-white/80 mt-1 max-w-2xl">
                {project.description || 'Omnysync enterprise project workspace.'}
              </p>
              {project.client && (
                <p className="text-xs text-white/90 font-semibold mt-1">
                  Client: <span className="underline">{project.client}</span>
                </p>
              )}
            </div>

            {/* Quick KPI stats in header */}
            <div className="flex items-center gap-3">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-center min-w-[100px]">
                <span className="text-[10px] text-white/70 uppercase font-bold tracking-wider block">Deadline</span>
                <span className="text-base font-black font-mono">{daysRemaining}d left</span>
                <span className="text-[10px] text-white/60 block">{project.deadline}</span>
              </div>

              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-center min-w-[100px]">
                <span className="text-[10px] text-white/70 uppercase font-bold tracking-wider block">Budget</span>
                <span className="text-base font-black font-mono">${(project.budget || 30000).toLocaleString()}</span>
                <span className="text-[10px] text-white/60 block">${(project.spent || 0).toLocaleString()} spent</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Overall Completion</span>
              <span className="font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/20">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Gooey Folder Tabs Container (Organic SVG Meltdown) ──────────────── */}
      <GooeyFolderTabs
        tabs={workspaceTabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as any)}
      >
        {/* ── TAB 1: WORKSPACE DASHBOARD / OVERVIEW ─────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FolderCard
                onOpenDetail={() => setActiveTab('tasks')}
                themeColor="teal"
                fillColor="#151e19"
                borderColor="#223328"
                buttonSize="md"
                minHeight="min-h-[160px]"
                actionTooltip="View Full Task Board"
                avatar={
                  <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Completed Tasks</span>
                }
              >
                <div className="pt-2">
                  <p className="text-3xl font-black text-white font-mono">
                    {completedTasksCount} / {tasks.length}
                  </p>
                  <p className="text-xs text-[#2dd4bf] mt-1 font-semibold">{progressPercent}% verified complete</p>
                </div>
              </FolderCard>

              <FolderCard
                onOpenDetail={() => setActiveTab('team')}
                themeColor="teal"
                fillColor="#151e19"
                borderColor="#223328"
                buttonSize="md"
                minHeight="min-h-[160px]"
                actionTooltip="Manage Assigned Team"
                avatar={
                  <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Assigned Team</span>
                }
              >
                <div className="pt-2">
                  <p className="text-3xl font-black text-white font-mono">{project.team.length} Members</p>
                  <div className="flex items-center -space-x-1.5 mt-2">
                    {project.team.map((m) => (
                      <div
                        key={m.id}
                        title={`${m.name} - ${m.role}`}
                        className={`w-7 h-7 rounded-full ${m.color} text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#151e19] shadow-sm`}
                      >
                        {m.avatar}
                      </div>
                    ))}
                  </div>
                </div>
              </FolderCard>

              <FolderCard
                onOpenDetail={() => setActiveTab('docs')}
                themeColor="blue"
                fillColor="#151e19"
                borderColor="#223328"
                buttonSize="md"
                minHeight="min-h-[160px]"
                actionTooltip="View SOW & Invoices"
                avatar={
                  <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Linked Contracts</span>
                }
              >
                <div className="pt-2">
                  <p className="text-3xl font-black text-white font-mono">
                    {linkedCommercialDocs.length + linkedDriveFiles.length} Docs
                  </p>
                  <span className="text-xs text-[#38bdf8] font-bold mt-1 block group-hover:underline">
                    View SOW & Invoices &rarr;
                  </span>
                </div>
              </FolderCard>
            </div>

            {/* Quick Tasks Preview */}
            <div className="bg-[#151e19] border border-[#223328] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b2620]">
                <h3 className="text-sm font-bold text-white tracking-tight">Active Sprint Deliverables</h3>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs text-[#2dd4bf] hover:underline font-semibold"
              >
                Open Full Task Board
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskCompleted(task.id)}
                  className="p-3 rounded-xl bg-[#16201b] border border-[#223328] hover:border-[#2dd4bf] transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-[#10b981] border-[#10b981] text-black'
                          : 'border-[#384e40]'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${task.completed ? 'line-through text-[#6b7280]' : 'text-white'}`}>
                        {task.title}
                      </p>
                      <p className="text-[11px] text-[#9ca3af]">Due: {task.dueDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full ${task.assignee.color} text-white text-[10px] font-bold flex items-center justify-center`}
                      title={task.assignee.name}
                    >
                      {task.assignee.avatar}
                    </div>
                    <span className="text-[10px] text-[#9ca3af] hidden sm:inline">{task.assignee.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: TEAM MEMBERS SECTION ───────────────────────────────────── */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#121915] border border-[#1e2d24] p-5 rounded-2xl">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Project Roster & Roles</h2>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                Team members assigned to collaborate on sprints, code reviews, and deliverable sign-offs
              </p>
            </div>

            <button
              onClick={() => setIsAddingMember(true)}
              className="px-3.5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-black transition-all shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.team.map((member) => (
              <div
                key={member.id}
                className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-5 flex items-start gap-3 hover:border-[#2dd4bf]/40 transition-colors"
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${member.color} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md`}
                >
                  {member.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{member.name}</h3>
                  <p className="text-xs text-[#2dd4bf] font-medium">{member.role}</p>
                  <p className="text-[11px] text-[#6b7280] truncate mt-0.5">{member.email}</p>

                  <div className="mt-3 pt-2 border-t border-[#18241d] flex items-center justify-between text-[11px] text-[#9ca3af]">
                    <span>Assigned Tasks:</span>
                    <strong className="text-white font-mono">
                      {tasks.filter((t) => t.assignee.id === member.id).length}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Team Member Modal */}
          {isAddingMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-[#121915] border border-[#223328] w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                <button
                  onClick={() => setIsAddingMember(false)}
                  className="absolute top-5 right-5 text-[#9ca3af] hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-base font-bold text-white mb-3">Add Team Member to Project</h3>
                <p className="text-xs text-[#9ca3af] mb-4">Select an Omnysync staff member to assign to this sprint</p>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {TEAM_MEMBERS.map((m) => {
                    const isAlready = project.team.some((t) => t.id === m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => !isAlready && handleAddMemberToProject(m)}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isAlready
                            ? 'bg-[#18261e] border-[#203227] opacity-50 cursor-not-allowed'
                            : 'bg-[#141e18] border-[#223328] hover:border-[#2dd4bf] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${m.color} text-white font-bold flex items-center justify-center text-xs`}>
                            {m.avatar}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{m.name}</p>
                            <p className="text-[11px] text-[#9ca3af]">{m.role}</p>
                          </div>
                        </div>
                        {isAlready ? (
                          <span className="text-[10px] text-[#9ca3af] font-semibold">Assigned</span>
                        ) : (
                          <Plus className="w-4 h-4 text-[#2dd4bf]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: TASKS & TO-DO LIST WITH PERSON ASSIGNMENT ────────────────── */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121915] border border-[#1e2d24] p-5 rounded-2xl">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Project Tasks & To-Do List</h2>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                Assign deliverables directly to team members with target deadlines and priority tags
              </p>
            </div>

            <button
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-black transition-all shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Assign New Task</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9ca3af] font-semibold">Filter by Assignee:</span>
              <select
                value={taskFilterAssignee}
                onChange={(e) => setTaskFilterAssignee(e.target.value)}
                className="bg-[#141e18] border border-[#203026] focus:border-[#2dd4bf] rounded-xl px-3 py-1.5 text-xs text-white outline-none"
              >
                <option value="all">All Assignees</option>
                {project.team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#141e18] p-1 rounded-xl border border-[#203026]">
              {(['all', 'pending', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setTaskFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    taskFilterStatus === st
                      ? 'bg-[#2dd4bf] text-[#052e24] font-bold'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl overflow-hidden divide-y divide-[#18241d]">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-[#6b7280] text-xs">
                No tasks match the selected filter.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-[#16211a] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTaskCompleted(task.id)}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        task.completed
                          ? 'bg-[#10b981] border-[#10b981] text-black'
                          : 'border-[#384e40] hover:border-white'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold leading-tight ${
                          task.completed ? 'line-through text-[#6b7280]' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#9ca3af] mt-1">
                        <span>Due: {task.dueDate}</span>
                        <span>&bull;</span>
                        <span
                          className={`font-semibold ${
                            task.priority === 'High'
                              ? 'text-[#f87171]'
                              : task.priority === 'Medium'
                              ? 'text-[#fbbf24]'
                              : 'text-[#34d399]'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Assignee Badge Pill */}
                  <div className="flex items-center gap-2 bg-[#17221c] border border-[#203227] px-3 py-1.5 rounded-xl">
                    <div
                      className={`w-6 h-6 rounded-full ${task.assignee.color} text-white font-bold text-[10px] flex items-center justify-center`}
                    >
                      {task.assignee.avatar}
                    </div>
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-white block leading-tight">
                        {task.assignee.name}
                      </span>
                      <span className="text-[9px] text-[#9ca3af] block">{task.assignee.role}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Task Modal */}
          {isAddingTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-[#121915] border border-[#223328] w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="absolute top-5 right-5 text-[#9ca3af] hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-base font-bold text-white mb-1">Assign New Task</h3>
                <p className="text-xs text-[#9ca3af] mb-4">
                  Create a task and assign it to a team member in this project
                </p>

                <form onSubmit={handleAddTask} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#d1d5db] font-semibold mb-1">Task Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#d1d5db] font-semibold mb-1">Assign To</label>
                      <select
                        value={newTaskAssigneeId}
                        onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                        className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                      >
                        {project.team.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#d1d5db] font-semibold mb-1">Priority</label>
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as any)}
                        className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#d1d5db] font-semibold mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white font-mono outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1b2620]">
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="px-4 py-2 rounded-xl text-[#9ca3af] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] font-black shadow-md shadow-[#2dd4bf]/20"
                    >
                      Assign Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: TIMELINE / GANTT VIEW ──────────────────────────────────── */}
      {activeTab === 'timeline' && (
        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Project Milestone Timeline</h2>
            <p className="text-xs text-[#9ca3af] mt-0.5">
              Sprint deliverables mapped across time with completion checkpoints
            </p>
          </div>

          <div className="space-y-4">
            {[
              { phase: 'Sprint 1: Scope & Architecture', status: 'Completed', range: 'Week 1 - 2', progress: 100, color: 'bg-[#10b981]' },
              { phase: 'Sprint 2: Core Engineering & Integrations', status: 'In Progress', range: 'Week 3 - 5', progress: 65, color: 'bg-[#2dd4bf]' },
              { phase: 'Sprint 3: UI/UX Handoff & Security Audit', status: 'Upcoming', range: 'Week 6 - 7', progress: 20, color: 'bg-[#818cf8]' },
              { phase: 'Sprint 4: Final Sign-off & Production Deployment', status: 'Scheduled', range: 'Week 8', progress: 0, color: 'bg-[#fbbf24]' },
            ].map((sprint, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#16201b] border border-[#223328] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{sprint.phase}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#18261e] text-[#2dd4bf]">
                      {sprint.range}
                    </span>
                  </div>
                  <span className="font-mono text-[#9ca3af] font-semibold">{sprint.progress}%</span>
                </div>

                <div className="w-full bg-[#101713] h-2 rounded-full overflow-hidden">
                  <div className={`${sprint.color} h-full rounded-full transition-all duration-500`} style={{ width: `${sprint.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: SEPARATE PROPER CALENDAR VIEW ───────────────────────────── */}
      {activeTab === 'calendar' && (
        <ProjectCalendarView projectId={project.id} />
      )}

      {/* ── TAB 6: PROJECT DOCUMENTS HUB ──────────────────────────────────── */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121915] border border-[#1e2d24] p-5 rounded-2xl">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Project Documents & Legal SOWs</h2>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                All Statement of Works, Quotations, Invoices, and Specifications linked to this project
              </p>
            </div>

            <button
              onClick={() => setIsLinkingDoc(true)}
              className="px-4 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-black transition-all shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
            >
              <LinkIcon className="w-3.5 h-3.5 stroke-[3]" />
              <span>Link Existing Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkedCommercialDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#121915] border border-[#1e2d24] hover:border-[#2dd4bf] rounded-2xl p-5 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#18261e] text-[#2dd4bf] border border-[#263c2f]">
                      {doc.docType}
                    </span>
                    <span className="text-xs font-bold text-[#10b981] capitalize">{doc.status}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{doc.title}</h3>
                  <p className="text-xs text-[#9ca3af] mt-0.5">{doc.clientName} &bull; {doc.docNumber}</p>
                </div>

                <div className="pt-4 border-t border-[#18241d] mt-4 flex items-center justify-between">
                  <span className="text-base font-mono font-bold text-white">${doc.totalAmount.toLocaleString()}</span>
                  <span className="text-[11px] text-[#2dd4bf] font-semibold">Verified Electronic SOW</span>
                </div>
              </div>
            ))}

            {linkedDriveFiles.map((file) => (
              <div
                key={file.id}
                className="bg-[#121915] border border-[#1e2d24] hover:border-[#38bdf8] rounded-2xl p-5 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#15232d] text-[#38bdf8] border border-[#1f3747]">
                      {file.type}
                    </span>
                    <span className="text-xs font-bold text-[#38bdf8]">{file.size}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{file.name}</h3>
                  <p className="text-xs text-[#6b7280] font-mono mt-0.5">{file.folderPath}</p>
                </div>

                <div className="pt-4 border-t border-[#18241d] mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-[#9ca3af]">Synced to Google Drive</span>
                  <span className="text-xs text-[#38bdf8] font-semibold">Cloud Ready</span>
                </div>
              </div>
            ))}
          </div>

          {/* Link Document Modal */}
          {isLinkingDoc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-[#121915] border border-[#223328] w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                <button
                  onClick={() => setIsLinkingDoc(false)}
                  className="absolute top-5 right-5 text-[#9ca3af] hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-base font-bold text-white mb-1">Link Document to Project</h3>
                <p className="text-xs text-[#9ca3af] mb-4">
                  Attach an existing SOW, contract, or quotation to {project.title}
                </p>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#d1d5db] font-semibold mb-1">Select Document</label>
                    <select
                      value={selectedDocIdToLink}
                      onChange={(e) => setSelectedDocIdToLink(e.target.value)}
                      className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                    >
                      <option value="">Choose a document...</option>
                      {COMMERCIAL_DOCUMENTS.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.docNumber} - {doc.title} (${doc.totalAmount.toLocaleString()})
                        </option>
                      ))}
                      {GOOGLE_DRIVE_FILES.map((file) => (
                        <option key={file.id} value={file.id}>
                          Drive: {file.name} ({file.size})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1b2620]">
                    <button
                      type="button"
                      onClick={() => setIsLinkingDoc(false)}
                      className="px-4 py-2 rounded-xl text-[#9ca3af] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleLinkDoc}
                      className="px-5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] font-black shadow-md shadow-[#2dd4bf]/20"
                    >
                      Link Document
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 7: DEDICATED PROJECT WHITEBOARD ────────────────────────────── */}
      {activeTab === 'whiteboard' && (
        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-5 space-y-4">
          {/* Whiteboard Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1b2620]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                {project.title} &bull; Collaborative Visual Whiteboard
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#18261e] text-[#2dd4bf]">
                Canvas Scoped to Project
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Color choices */}
              <div className="flex items-center gap-1.5 bg-[#16201b] border border-[#223328] p-1 rounded-xl">
                {['#2dd4bf', '#818cf8', '#fbbf24', '#f43f5e', '#ffffff'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setDrawColor(c)}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      drawColor === c ? 'scale-125 border-white' : 'border-transparent opacity-60'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Stroke Size */}
              <select
                value={drawSize}
                onChange={(e) => setDrawSize(parseInt(e.target.value))}
                className="bg-[#16201b] border border-[#223328] rounded-xl px-2 py-1 text-xs text-white outline-none"
              >
                <option value={2}>Fine (2px)</option>
                <option value={4}>Medium (4px)</option>
                <option value={8}>Bold (8px)</option>
              </select>

              <button
                onClick={clearWhiteboard}
                className="px-3 py-1.5 rounded-xl bg-[#16201b] border border-[#223328] hover:border-[#ef4444] text-xs text-[#ef4444] font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Canvas</span>
              </button>
            </div>
          </div>

          {/* Sticky Notes Quick Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newStickyText}
              onChange={(e) => setNewStickyText(e.target.value)}
              placeholder="Add a quick sticky note / idea..."
              className="bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-1.5 text-xs text-white flex-1 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && addStickyNote()}
            />
            <button
              onClick={addStickyNote}
              className="px-4 py-1.5 rounded-xl bg-[#2dd4bf] text-[#052e24] font-bold text-xs shadow-md shadow-[#2dd4bf]/20"
            >
              + Add Sticky Note
            </button>
          </div>

          {/* Canvas Viewport */}
          <div className="relative border border-[#1e2d24] rounded-xl overflow-hidden shadow-inner bg-[#101613]">
            <canvas
              ref={canvasRef}
              width={960}
              height={500}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-[500px] cursor-crosshair"
            />

            {/* Render Sticky Notes Overlay */}
            {stickyNotes.map((note) => (
              <div
                key={note.id}
                style={{ top: `${note.y}px`, left: `${note.x}px` }}
                className={`absolute ${note.color} text-black p-3 rounded-xl shadow-xl w-44 font-sans text-xs select-none border border-black/10`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] uppercase font-bold text-black/60">Idea Note</span>
                  <button
                    onClick={() => removeStickyNote(note.id)}
                    className="text-black/50 hover:text-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-semibold text-gray-900 leading-snug">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      </GooeyFolderTabs>
    </div>
  );
}
