'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  ListTodo,
  Check,
  X,
  Filter,
} from 'lucide-react';

import { TEAM_MEMBERS, TeamMember } from '@/data/projectsData';
import { useAgency } from '@/context/AgencyContext';
import { AgencyTask, TaskPriority as AgencyTaskPriority } from '@/data/tasksData';

export type Task = AgencyTask;
export type TaskPriority = AgencyTaskPriority;
export type TaskCategory = 'All' | AgencyTask['category'];

/* seeded in AgencyContext */

const CATEGORIES: TaskCategory[] = ['All', 'Finance', 'Sales', 'Dev', 'Operations', 'General'];

export default function TodoList() {
  const agency = useAgency();
  const tasks = agency.tasks;
  const setTasks = (updater: any) => {
    if (typeof updater === 'function') {
      const next = updater(agency.tasks);
      // sync diffs
      next.forEach((t: AgencyTask) => {
        const prev = agency.tasks.find((x) => x.id === t.id);
        if (!prev) agency.addTask(t);
        else if (JSON.stringify(prev) !== JSON.stringify(t)) agency.updateTask(t);
      });
      agency.tasks.forEach((t) => {
        if (!next.find((x: AgencyTask) => x.id === t.id)) agency.deleteTask(t.id);
      });
    }
  };
    const [activeCategory, setActiveCategory] = useState<TaskCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // New task form state / modal
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<'Finance' | 'Sales' | 'Dev' | 'Operations' | 'General'>('General');
  const [formPriority, setFormPriority] = useState<TaskPriority>('Medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formAssigneeId, setFormAssigneeId] = useState<string>(TEAM_MEMBERS[0].id);

    // Save to localStorage whenever tasks change
  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem('omnysync_erp_tasks', JSON.stringify(newTasks));
    } catch {
      // ignore
    }
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setFormTitle(task.title);
    setFormDesc(task.description || '');
    setFormCategory(task.category);
    setFormPriority(task.priority);
    setFormDueDate(task.dueDate);
    setFormAssigneeId(task.assignee?.id || TEAM_MEMBERS[0].id);
    setIsAddingTask(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const assignedMember = TEAM_MEMBERS.find((m) => m.id === formAssigneeId) || TEAM_MEMBERS[0];

    if (editingTaskId) {
      const updated = tasks.map((t) =>
        t.id === editingTaskId
          ? {
              ...t,
              title: formTitle.trim(),
              description: formDesc.trim(),
              category: formCategory,
              priority: formPriority,
              dueDate: formDueDate || new Date().toISOString().slice(0, 10),
              assignee: assignedMember,
            }
          : t
      );
      saveTasks(updated);
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: formTitle.trim(),
        description: formDesc.trim(),
        category: formCategory,
        priority: formPriority,
        dueDate: formDueDate || new Date().toISOString().slice(0, 10),
        completed: false,
        createdAt: new Date().toISOString().slice(0, 10),
        assignee: assignedMember,
      };
      saveTasks([newTask, ...tasks]);
    }

    // Reset form
    setFormTitle('');
    setFormDesc('');
    setFormCategory('General');
    setFormPriority('Medium');
    setFormDueDate('');
    setFormAssigneeId(TEAM_MEMBERS[0].id);
    setEditingTaskId(null);
    setIsAddingTask(false);
  };

  // Stats calculation
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityCount = tasks.filter((t) => !t.completed && t.priority === 'High').length;

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Category filter
      if (activeCategory !== 'All' && t.category !== activeCategory) return false;

      // Status filter
      if (statusFilter === 'pending' && t.completed) return false;
      if (statusFilter === 'completed' && !t.completed) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = t.description?.toLowerCase().includes(q);
        const matchCat = t.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      return true;
    });
  }, [tasks, activeCategory, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#b8ff00]/15 text-[#b8ff00] border border-[#b8ff00]/30">
              <ListTodo className="w-5 h-5" />
            </span>
            Task Hub & Dedicated To‑Do
          </h1>
          <p className="text-xs text-[#9ca3af] mt-1">
            Track operational milestones, financial deliverables, and team checklists across all ERP modules.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTaskId(null);
            setFormTitle('');
            setFormDesc('');
            setFormCategory('General');
            setFormPriority('Medium');
            setFormDueDate(new Date().toISOString().slice(0, 10));
            setIsAddingTask(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#b8ff00] hover:bg-[#a3e600] text-black font-bold text-xs shadow-lg shadow-[#b8ff00]/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Quick Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#121915] border border-[#1b2a22] rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2dd4bf]/15 text-[#2dd4bf] flex items-center justify-center font-bold">
            <ListTodo className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-black text-white">{totalCount}</div>
            <div className="text-[11px] text-[#9ca3af] font-medium">Total Tasks</div>
          </div>
        </div>

        <div className="bg-[#121915] border border-[#1b2a22] rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#fbbf24]/15 text-[#fbbf24] flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-black text-[#fbbf24]">{pendingCount}</div>
            <div className="text-[11px] text-[#9ca3af] font-medium">Pending Action</div>
          </div>
        </div>

        <div className="bg-[#121915] border border-[#1b2a22] rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#b8ff00]/15 text-[#b8ff00] flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-black text-[#b8ff00]">{completedCount}</div>
            <div className="text-[11px] text-[#9ca3af] font-medium">Completed ({totalCount ? Math.round((completedCount / totalCount) * 100) : 0}%)</div>
          </div>
        </div>

        <div className="bg-[#121915] border border-[#1b2a22] rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#f43f5e]/15 text-[#f43f5e] flex items-center justify-center font-bold">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-black text-[#f43f5e]">{highPriorityCount}</div>
            <div className="text-[11px] text-[#9ca3af] font-medium">High Priority</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#101713] border border-[#1b2921] rounded-2xl p-3 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#2dd4bf] text-[#052e24] shadow-sm font-bold'
                    : 'bg-[#141e18] text-[#9ca3af] hover:text-white hover:bg-[#1a2820]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Status Toggle */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-[#6b7280] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-[#151f19] border border-[#1e2e25] focus:border-[#2dd4bf] text-white text-xs pl-8 pr-3 py-1.5 rounded-lg outline-none placeholder-[#6b7280]"
              />
            </div>

            {/* Status pills */}
            <div className="flex items-center bg-[#151f19] p-0.5 rounded-lg border border-[#1e2e25]">
              {(['all', 'pending', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-[#1e2e24] text-[#2dd4bf]'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation / Edit Form Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121915] border border-[#1e2d24] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-[#1b2820]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-[#b8ff00]" />
                {editingTaskId ? 'Edit Task' : 'Create New ERP Task'}
              </h3>
              <button
                onClick={() => setIsAddingTask(false)}
                className="p-1 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a2620]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Verify Q3 General Ledger Account Reconciliations"
                  className="w-full bg-[#16211a] border border-[#22352a] focus:border-[#2dd4bf] text-white text-xs px-3 py-2 rounded-lg outline-none placeholder-[#6b7280]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Add context, references, or specific deliverables..."
                  className="w-full bg-[#16211a] border border-[#22352a] focus:border-[#2dd4bf] text-white text-xs p-3 rounded-lg outline-none placeholder-[#6b7280] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#16211a] border border-[#22352a] text-white text-xs px-2.5 py-2 rounded-lg outline-none"
                  >
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Dev">Dev</option>
                    <option value="Operations">Operations</option>
                    <option value="General">General</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                    className="w-full bg-[#16211a] border border-[#22352a] text-white text-xs px-2.5 py-2 rounded-lg outline-none"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full bg-[#16211a] border border-[#22352a] text-white text-xs px-2.5 py-2 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Assignee Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                  Assignee (Staff Member)
                </label>
                <select
                  value={formAssigneeId}
                  onChange={(e) => setFormAssigneeId(e.target.value)}
                  className="w-full bg-[#16211a] border border-[#22352a] text-white text-xs px-2.5 py-2 rounded-lg outline-none"
                >
                  {TEAM_MEMBERS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1b2820]">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#9ca3af] hover:text-white hover:bg-[#1a2620]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#b8ff00] hover:bg-[#a3e600] text-black font-bold text-xs shadow-md shadow-[#b8ff00]/20"
                >
                  {editingTaskId ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Items List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-[#121915] border border-[#1a2620] rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#18241d] text-[#6b7280] flex items-center justify-center mx-auto">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div className="text-white font-bold text-sm">No tasks found</div>
            <p className="text-xs text-[#9ca3af] max-w-sm mx-auto">
              {searchQuery || activeCategory !== 'All' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search keywords.'
                : 'No tasks scheduled yet. Click "+ New Task" above to add your first deliverable!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isHigh = task.priority === 'High';
            const isMed = task.priority === 'Medium';

            return (
              <div
                key={task.id}
                className={`group bg-[#111814] hover:bg-[#141f19] border transition-all rounded-xl p-3.5 flex items-start gap-3.5 ${
                  task.completed
                    ? 'border-[#17221b] opacity-65'
                    : 'border-[#1b2820] hover:border-[#22382b]'
                }`}
              >
                {/* Checkbox Toggle */}
                <button
                  onClick={() => handleToggleTask(task.id)}
                  title={task.completed ? 'Mark pending' : 'Mark complete'}
                  className="mt-0.5 text-[#6b7280] hover:text-[#b8ff00] transition-colors focus:outline-none shrink-0"
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-[#b8ff00]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#4b5563] group-hover:text-[#9ca3af]" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-semibold transition-all ${
                        task.completed
                          ? 'line-through text-[#6b7280]'
                          : 'text-white'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Category pill */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#18261e] text-[#2dd4bf] border border-[#223b2e]">
                      {task.category}
                    </span>

                    {/* Priority Pill */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-[#f43f5e]/15 text-[#f43f5e] border-[#f43f5e]/30'
                          : isMed
                          ? 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30'
                          : 'bg-[#9ca3af]/15 text-[#9ca3af] border-[#9ca3af]/30'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p
                      className={`text-[11px] leading-relaxed line-clamp-2 ${
                        task.completed ? 'text-[#4b5563]' : 'text-[#9ca3af]'
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Due Date & Assignee */}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-[#6b7280] pt-1">
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#4b5563]" />
                        <span>Due {task.dueDate}</span>
                      </div>
                    )}

                    {task.assignee && (
                      <div className="flex items-center gap-1.5 bg-[#17221c] border border-[#203227] px-2 py-0.5 rounded-full">
                        <div
                          className={`w-4 h-4 rounded-full ${task.assignee.color} text-white font-bold text-[8px] flex items-center justify-center`}
                        >
                          {task.assignee.avatar}
                        </div>
                        <span className="text-[10px] font-semibold text-[#d1d5db]">
                          {task.assignee.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons (hover visible) */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => handleStartEdit(task)}
                    title="Edit task"
                    className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a2620] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                    className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#f43f5e] hover:bg-[#251717] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
