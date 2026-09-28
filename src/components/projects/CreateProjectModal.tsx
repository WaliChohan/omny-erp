'use client';

import React, { useState } from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import { Plus, Check, Briefcase } from 'lucide-react';
import { ProjectCardItem, TEAM_MEMBERS, TeamMember } from '@/data/projectsData';
import { COMMERCIAL_DOCUMENTS } from '@/data/financialData';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: ProjectCardItem) => void;
}

const THEMES = [
  { id: 'purple', label: 'Royal Purple', gradient: 'bg-gradient-to-br from-[#6d4cb8] to-[#5939a8]' },
  { id: 'teal', label: 'Emerald Mint', gradient: 'bg-gradient-to-br from-[#3ca997] to-[#2d8d7e]' },
  { id: 'orange', label: 'Sunset Coral', gradient: 'bg-gradient-to-br from-[#f26c4f] to-[#dd5739]' },
  { id: 'blue', label: 'Electric Blue', gradient: 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8]' },
  { id: 'emerald', label: 'Forest Jade', gradient: 'bg-gradient-to-br from-[#059669] to-[#047857]' },
];

export default function CreateProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Full-stack Platform');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [budget, setBudget] = useState('45000');
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([
    TEAM_MEMBERS[0],
    TEAM_MEMBERS[1],
  ]);
  const [linkedDocId, setLinkedDocId] = useState<string>('');

  const toggleMember = (member: TeamMember) => {
    if (selectedMembers.some((m) => m.id === member.id)) {
      if (selectedMembers.length > 1) {
        setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
      }
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: ProjectCardItem = {
      id: `p-${Date.now()}`,
      title,
      category,
      client: client || undefined,
      description: description || 'Enterprise solution delivery sprint.',
      deadline,
      budget: parseFloat(budget) || 45000,
      spent: 0,
      themeColor: (selectedTheme.id as any) || 'teal',
      bgGradient: selectedTheme.gradient,
      progressPercent: 0,
      status: 'planning',
      archived: false,
      milestones: [],
      tasksCount: 0,
      avatarsCount: selectedMembers.length,
      team: selectedMembers,
      linkedDocIds: linkedDocId ? [linkedDocId] : [],
    };

    onProjectCreated(newProject);
    onClose();
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-2xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf]">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Create New Workspace Project</h3>
            <p className="text-[11px] text-[#9ca3af]">Initiate project milestone workspace & connect Google Drive storage</p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[#9ca3af] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-bold shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Project</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Title */}
        <div>
          <label className="block text-[#d1d5db] font-semibold mb-1">Project Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Next-Gen Mobile App & API Gateway"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
          />
        </div>

        {/* Category & Client */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[#d1d5db] font-semibold mb-1">Category / Type</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
            >
              <option value="Full-stack Platform">Full-stack Platform</option>
              <option value="Mobile App Dev">Mobile App Dev</option>
              <option value="Cloud Migration">Cloud Migration</option>
              <option value="AI / ML Pipeline">AI / ML Pipeline</option>
              <option value="Security Audit">Security Audit</option>
            </select>
          </div>

          <div>
            <label className="block text-[#d1d5db] font-semibold mb-1">Client Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Apex Global Logistics"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
            />
          </div>
        </div>

        {/* Budget, Deadline, Linked SOW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[#d1d5db] font-semibold mb-1">Budget ($ USD)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-[#d1d5db] font-semibold mb-1">Target Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-[#d1d5db] font-semibold mb-1">Linked SOW Document</label>
            <select
              value={linkedDocId}
              onChange={(e) => setLinkedDocId(e.target.value)}
              className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none text-[11px]"
            >
              <option value="">No Document Linked</option>
              {COMMERCIAL_DOCUMENTS.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.docNumber} - {doc.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[#d1d5db] font-semibold mb-1">Project Scope & Description</label>
          <textarea
            rows={2}
            placeholder="Brief summary of key objectives, sprint cycles, and deliverable milestones..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#141d18] border border-[#1e2a22] focus:border-[#2dd4bf] rounded-xl p-2.5 text-white outline-none resize-none"
          />
        </div>

        {/* Theme Color Selector */}
        <div>
          <label className="block text-[#d1d5db] font-semibold mb-1.5">Card Visual Theme</label>
          <div className="grid grid-cols-5 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme)}
                className={`h-10 rounded-xl flex items-center justify-center border transition-all ${
                  theme.gradient
                } ${
                  selectedTheme.id === theme.id
                    ? 'border-white scale-105 shadow-md shadow-white/20'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                {selectedTheme.id === theme.id && <Check className="w-4 h-4 text-white stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Team Members Assignment */}
        <div>
          <label className="block text-[#d1d5db] font-semibold mb-1.5">
            Assign Team Members ({selectedMembers.length} selected)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TEAM_MEMBERS.map((member) => {
              const isSelected = selectedMembers.some((m) => m.id === member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => toggleMember(member)}
                  className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#18261e] border-[#2dd4bf] text-white'
                      : 'bg-[#141d18] border-[#1e2a22] text-[#9ca3af] hover:border-[#334b3c]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full ${member.color} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}
                  >
                    {member.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold truncate leading-tight">{member.name}</p>
                    <p className="text-[9px] text-[#6b7280] truncate">{member.role}</p>
                  </div>
                  {isSelected && <Check className="w-3 h-3 text-[#2dd4bf] shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </SideDrawer>
  );
}
