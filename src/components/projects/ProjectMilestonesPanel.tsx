'use client';

import React, { useState } from 'react';
import { ProjectMilestone } from '@/data/projectsData';
import { Plus, Pencil, Trash2, Flag, CheckCircle2, Clock } from 'lucide-react';

interface ProjectMilestonesPanelProps {
  milestones: ProjectMilestone[];
  onChange: (next: ProjectMilestone[]) => void;
  onOpenTask?: (taskId: string) => void;
}

const STATUS_OPTS: ProjectMilestone['status'][] = ['upcoming', 'in_progress', 'done', 'missed'];

const tone: Record<ProjectMilestone['status'], string> = {
  upcoming: 'bg-[#1e2a22] text-[#9ca3af]',
  in_progress: 'bg-[#0c4a6e]/40 text-[#38bdf8]',
  done: 'bg-[#064e3b]/40 text-[#34d399]',
  missed: 'bg-[#7f1d1d]/40 text-[#f87171]',
};

const emptyForm = (): Omit<ProjectMilestone, 'id'> => ({
  title: '',
  description: '',
  dueDate: new Date().toISOString().slice(0, 10),
  status: 'upcoming',
});

export default function ProjectMilestonesPanel({
  milestones,
  onChange,
}: ProjectMilestonesPanelProps) {
  const [editing, setEditing] = useState<ProjectMilestone | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm());

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(emptyForm());
  };

  const startEdit = (m: ProjectMilestone) => {
    setEditing(m);
    setCreating(false);
    setForm({
      title: m.title,
      description: m.description || '',
      dueDate: m.dueDate,
      status: m.status,
      linkedTaskIds: m.linkedTaskIds,
    });
  };

  const save = () => {
    if (!form.title.trim()) return;
    if (editing) {
      onChange(
        milestones.map((m) =>
          m.id === editing.id ? { ...m, ...form, title: form.title.trim() } : m
        )
      );
    } else {
      onChange([
        ...milestones,
        { id: `ms-${Date.now()}`, ...form, title: form.title.trim() },
      ]);
    }
    setCreating(false);
    setEditing(null);
    setForm(emptyForm());
  };

  const remove = (id: string) => {
    if (!confirm('Delete this milestone?')) return;
    onChange(milestones.filter((m) => m.id !== id));
  };

  const showForm = creating || !!editing;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#121915] border border-[#1e2d24] p-5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Flag className="w-4 h-4 text-[#a855f7]" /> Milestones
          </h2>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Phase gates with dates and status — the backbone of delivery planning
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-black flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> New milestone
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-[#2dd4bf]/30 bg-[#0f1a16] p-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#2dd4bf]">
            {editing ? 'Edit milestone' : 'Create milestone'}
          </p>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Milestone title"
            className="w-full bg-[#0b1210] border border-[#1e2a22] rounded-xl px-3 py-2 text-sm text-white font-semibold"
          />
          <textarea
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            placeholder="What does done look like?"
            className="w-full bg-[#0b1210] border border-[#1e2a22] rounded-xl px-3 py-2 text-xs text-white"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="bg-[#0b1210] border border-[#1e2a22] rounded-xl px-3 py-2 text-xs text-white"
            />
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as ProjectMilestone['status'] })
              }
              className="bg-[#0b1210] border border-[#1e2a22] rounded-xl px-3 py-2 text-xs text-white"
            >
              {STATUS_OPTS.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="px-3 py-2 text-xs text-[#9ca3af]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="px-4 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {milestones.length === 0 && !showForm && (
        <div className="rounded-2xl border border-dashed border-[#1e2a22] p-10 text-center">
          <Flag className="w-8 h-8 text-[#4b5563] mx-auto mb-2" />
          <p className="text-sm font-bold text-white">No milestones yet</p>
          <p className="text-[11px] text-[#9ca3af] mt-1">
            Add phase gates so the timeline and calendar stay honest.
          </p>
        </div>
      )}

      <div className="relative space-y-0 pl-4">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[#1e2a22]" />
        {milestones
          .slice()
          .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
          .map((m) => (
            <div key={m.id} className="relative flex gap-4 pb-5">
              <div
                className={`relative z-10 w-6 h-6 rounded-full border-2 border-[#0b1210] flex items-center justify-center shrink-0 ${
                  m.status === 'done'
                    ? 'bg-[#10b981]'
                    : m.status === 'in_progress'
                      ? 'bg-[#38bdf8]'
                      : m.status === 'missed'
                        ? 'bg-[#f87171]'
                        : 'bg-[#374151]'
                }`}
              >
                {m.status === 'done' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                ) : (
                  <Clock className="w-3 h-3 text-white" />
                )}
              </div>
              <div className="flex-1 rounded-2xl bg-[#121915] border border-[#1e2d24] p-4 hover:border-[#2dd4bf]/25 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">{m.title}</p>
                    {m.description && (
                      <p className="text-[11px] text-[#9ca3af] mt-1">{m.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${tone[m.status]}`}>
                        {m.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-[#6b7280] font-mono">Due {m.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(m)}
                      className="p-1.5 rounded-lg text-[#6b7280] hover:text-white hover:bg-[#1a2720]"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(m.id)}
                      className="p-1.5 rounded-lg text-[#6b7280] hover:text-[#f87171] hover:bg-[#2a1212]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
