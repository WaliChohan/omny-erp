'use client';

import React, { useState } from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import { MessageSquarePlus } from 'lucide-react';
import { SupportTicket } from '@/data/portalData';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>, initialMessage: string) => void;
}

export default function NewTicketModal({
  isOpen,
  onClose,
  onSubmit,
}: NewTicketModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Billing' | 'Technical' | 'Milestone Review' | 'Feature Request'>('Technical');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit(
      {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        status: 'Open',
      },
      description.trim()
    );

    setTitle('');
    setDescription('');
    setCategory('Technical');
    setPriority('Medium');
    onClose();
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-lg"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#b8ff00]/15 text-[#b8ff00] border border-[#b8ff00]/30 flex items-center justify-center">
            <MessageSquarePlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Create Support Ticket</h3>
            <p className="text-[11px] text-[#9ca3af]">Direct line to your Omnysync Solutions Lead</p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#141d18] hover:bg-[#1a2620] text-xs font-semibold text-[#9ca3af] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b8ff00] hover:bg-[#a6e600] text-black font-bold text-xs shadow-md shadow-[#b8ff00]/20"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Submit Ticket</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
            Ticket Subject / Issue Summary *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Inquire about Q1 API webhook latency in EU cluster"
            className="w-full bg-[#152019] border border-[#22352a] focus:border-[#2dd4bf] text-white text-xs px-3 py-2 rounded-xl outline-none placeholder-[#6b7280]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#152019] border border-[#22352a] text-white text-xs px-3 py-2 rounded-xl outline-none"
            >
              <option value="Technical">Technical & Infrastructure</option>
              <option value="Billing">Invoices & Billing</option>
              <option value="Milestone Review">Milestone Review</option>
              <option value="Feature Request">Feature Request</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-[#152019] border border-[#22352a] text-white text-xs px-3 py-2 rounded-xl outline-none"
            >
              <option value="Low">Low - Informational</option>
              <option value="Medium">Medium - Normal Operations</option>
              <option value="High">High - Urgent / Production Blocker</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
            Initial Message & Details *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context, specific timestamps, or relevant URLs..."
            className="w-full bg-[#152019] border border-[#22352a] focus:border-[#2dd4bf] text-white text-xs p-3 rounded-xl outline-none placeholder-[#6b7280] resize-none"
          />
        </div>
      </form>
    </SideDrawer>
  );
}
