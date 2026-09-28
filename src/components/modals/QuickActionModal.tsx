'use client';

import React, { useState } from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import { CheckCircle, FileText, Receipt, UserPlus, Briefcase } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  actionType: string;
  onClose: () => void;
}

export default function QuickActionModal({
  isOpen,
  actionType,
  onClose,
}: QuickActionModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    customerOrVendor: '',
    category: 'Website',
  });

  const getActionConfig = () => {
    switch (actionType) {
      case 'new_lead':
        return {
          title: 'New Lead',
          description: 'Capture a HVAC / home-services prospect into the CRM pipeline.',
          icon: UserPlus,
          targetLabel: 'Contact / Company',
          amountLabel: 'Estimated deal value (PKR)',
          categories: ['Website', 'SEO', 'Custom Software', 'Mobile App'],
        };
      case 'create_invoice':
        return {
          title: 'Create Invoice',
          description: 'Bill a client for a milestone, retainer, or project phase.',
          icon: Receipt,
          targetLabel: 'Client / Company',
          amountLabel: 'Invoice amount (PKR)',
          categories: ['Milestone', 'Retainer', 'SEO Monthly', 'Change Order'],
        };
      case 'new_quote':
        return {
          title: 'New Quote / Proposal',
          description: 'Draft a proposal for websites, software, SEO, or apps.',
          icon: FileText,
          targetLabel: 'Prospect / Client',
          amountLabel: 'Quoted amount (PKR)',
          categories: ['Website', 'SEO', 'Custom Software', 'Mobile App'],
        };
      case 'new_project':
        return {
          title: 'New Project',
          description: 'Spin up a delivery workspace for an agency engagement.',
          icon: Briefcase,
          targetLabel: 'Client / Company',
          amountLabel: 'Budget (PKR)',
          categories: ['Website', 'SEO', 'Custom Software', 'Mobile App'],
        };
      case 'new_sale':
      case 'new_po':
      case 'add_product':
      default:
        return {
          title: 'Quick Agency Action',
          description: 'Log a client, deal, or billing action.',
          icon: Briefcase,
          targetLabel: 'Client / Company',
          amountLabel: 'Amount (PKR)',
          categories: ['Website', 'SEO', 'Custom Software', 'Mobile App'],
        };
    }
  };

  const config = getActionConfig();
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', amount: '', customerOrVendor: '', category: 'Website' });
      onClose();
    }, 1000);
  };

  return (
    <SideDrawer isOpen={isOpen} onClose={onClose} title={config.title}>
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <CheckCircle className="w-12 h-12 text-[#2dd4bf]" />
          <p className="text-sm font-bold text-white">Saved</p>
          <p className="text-xs text-[#9ca3af]">Ready for your CRM / finance flow.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-1">
          <p className="text-xs text-[#9ca3af]">{config.description}</p>
          <div className="flex items-center gap-2 text-[#2dd4bf]">
            <Icon className="w-4 h-4" />
            <span className="text-xs font-semibold">{config.title}</span>
          </div>
          <label className="block text-[11px] text-[#9ca3af] space-y-1">
            <span>{config.targetLabel}</span>
            <input
              required
              value={formData.customerOrVendor}
              onChange={(e) => setFormData({ ...formData, customerOrVendor: e.target.value })}
              className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
              placeholder="e.g. CoolAir Pros"
            />
          </label>
          <label className="block text-[11px] text-[#9ca3af] space-y-1">
            <span>Title / reference</span>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
              placeholder="e.g. Booking portal proposal"
            />
          </label>
          <label className="block text-[11px] text-[#9ca3af] space-y-1">
            <span>{config.amountLabel}</span>
            <input
              required
              type="number"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#2dd4bf]"
              placeholder="0"
            />
          </label>
          <label className="block text-[11px] text-[#9ca3af] space-y-1">
            <span>Service line</span>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#0f1612] border border-[#223328] rounded-lg px-3 py-2 text-xs text-white outline-none"
            >
              {config.categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold hover:bg-[#5eead4] transition-colors"
          >
            Save
          </button>
        </form>
      )}
    </SideDrawer>
  );
}
