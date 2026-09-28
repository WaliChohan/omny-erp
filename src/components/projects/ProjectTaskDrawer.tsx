'use client';

import React, { useEffect, useState } from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import {
  AgencyTask,
  TaskChecklistItem,
  TaskComment,
  TaskPriority,
  TaskStatus,
} from '@/data/tasksData';
import { TEAM_MEMBERS } from '@/data/projectsData';
import { CheckSquare, Plus, Trash2, MessageSquare, Send } from 'lucide-react';

interface ProjectTaskDrawerProps {
  task: AgencyTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: AgencyTask) => void;
  onDelete: (id: string) => void;
}

export default function ProjectTaskDrawer({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: ProjectTaskDrawerProps) {
  const [draft, setDraft] = useState<AgencyTask | null>(null);
  const [checkText, setCheckText] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setDraft(task ? { ...task, checklist: [...(task.checklist || [])], comments: [...(task.comments || [])] } : null);
    setCheckText('');
    setCommentText('');
  }, [task]);

  if (!draft) return null;

  const save = () => {
    onSave({
      ...draft,
      completed: draft.status === 'done',
    });
    onClose();
  };

  const addCheck = () => {
    if (!checkText.trim()) return;
    const item: TaskChecklistItem = {
      id: `chk-${Date.now()}`,
      text: checkText.trim(),
      done: false,
    };
    setDraft({ ...draft, checklist: [...(draft.checklist || []), item] });
    setCheckText('');
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    const c: TaskComment = {
      id: `cmt-${Date.now()}`,
      author: TEAM_MEMBERS[0]?.name || 'You',
      body: commentText.trim(),
      createdAt: new Date().toISOString(),
    };
    setDraft({ ...draft, comments: [...(draft.comments || []), c] });
    setCommentText('');
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Task details"
      width="max-w-lg"
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              onDelete(draft.id);
              onClose();
            }}
            className="px-3 py-2 rounded-lg border border-[#7f1d1d]/50 text-[#f87171] text-xs font-semibold"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={save}
            className="ml-auto px-4 py-2 rounded-lg bg-[#2dd4bf] text-[#0a0f0d] text-xs font-bold"
          >
            Save task
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-[#6b7280] font-bold">Title</label>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="mt-1 w-full bg-[#0b1210] border border-[#1e2a22] rounded-xl px-3 py-2 text-white font-semibold"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-[#6b7280] font-bold">Description</label>
          <textarea
            value={draft.description || ''}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={4}
            placeholder="Acceptance criteria, links, notes…"
            className="mt-1 w-full bg-[#0b1210] border border-[#1e2a22] rounded-xl px-3 py-2 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#6b7280] font-bold">Status</label>
            <select
              value={draft.status || 'todo'}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as TaskStatus })}
              className="mt-1 w-full bg-[#0b1210] border border-[#1e2a22] rounded-xl px-3 py-2 text-white"
            >
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#6b7280] font-bold">Priority</label>
            <select
              value={draft.priority}
              onChange={(e) => setDraft({ ...draft, priority: e.target.value as TaskPriority })}
              className="mt-1 w-full bg-[#0b1210] border border-[#1e2a22] rounded-xl px-3 py-2 text-white"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#6b7280] font-bold">Due date</label>
            <input
              type="date"
              value={draft.dueDate}
              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
              className="mt-1 w-full bg-[#0b1210] border border-[#1e2a22] rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#6b7280] font-bold">Assignee</label>
            <select
              value={draft.assignee?.id || ''}
              onChange={(e) => {
                const m = TEAM_MEMBERS.find((x) => x.id === e.target.value);
                setDraft({ ...draft, assignee: m });
              }}
              className="mt-1 w-full bg-[#0b1210] border border-[#1e2a22] rounded-xl px-3 py-2 text-white"
            >
              <option value="">Unassigned</option>
              {TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1e2a22] p-3 space-y-2">
          <div className="flex items-center gap-2 text-[#2dd4bf] font-bold text-[11px] uppercase tracking-wider">
            <CheckSquare className="w-3.5 h-3.5" /> Checklist
          </div>
          {(draft.checklist || []).map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-[#e5e7eb]">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() =>
                  setDraft({
                    ...draft,
                    checklist: (draft.checklist || []).map((c) =>
                      c.id === item.id ? { ...c, done: !c.done } : c
                    ),
                  })
                }
              />
              <span className={item.done ? 'line-through text-[#6b7280]' : ''}>{item.text}</span>
              <button
                type="button"
                className="ml-auto text-[#6b7280] hover:text-[#f87171]"
                onClick={() =>
                  setDraft({
                    ...draft,
                    checklist: (draft.checklist || []).filter((c) => c.id !== item.id),
                  })
                }
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </label>
          ))}
          <div className="flex gap-2">
            <input
              value={checkText}
              onChange={(e) => setCheckText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCheck())}
              placeholder="Add checklist item…"
              className="flex-1 bg-[#0b1210] border border-[#1e2a22] rounded-lg px-2 py-1.5 text-white"
            />
            <button type="button" onClick={addCheck} className="px-2 rounded-lg bg-[#141d18] border border-[#1e2a22]">
              <Plus className="w-3.5 h-3.5 text-[#2dd4bf]" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1e2a22] p-3 space-y-2">
          <div className="flex items-center gap-2 text-[#2dd4bf] font-bold text-[11px] uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" /> Comments
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {(draft.comments || []).length === 0 && (
              <p className="text-[11px] text-[#6b7280]">No comments yet.</p>
            )}
            {(draft.comments || []).map((c) => (
              <div key={c.id} className="bg-[#0b1210] rounded-lg p-2 border border-[#1e2a22]">
                <div className="flex justify-between text-[9px] text-[#6b7280] mb-0.5">
                  <span className="text-[#2dd4bf] font-semibold">{c.author}</span>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-[#e5e7eb]">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addComment())}
              placeholder="Write a comment…"
              className="flex-1 bg-[#0b1210] border border-[#1e2a22] rounded-lg px-2 py-1.5 text-white"
            />
            <button type="button" onClick={addComment} className="px-2 rounded-lg bg-[#2dd4bf] text-[#0a0f0d]">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}
