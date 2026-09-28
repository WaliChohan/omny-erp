'use client';

import React, { useState } from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import { FileText, CheckCircle, Cloud, Download, Sparkles } from 'lucide-react';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateDocumentModal({
  isOpen,
  onClose,
}: CreateDocumentModalProps) {
  const [docType, setDocType] = useState<'sow' | 'quotation' | 'legal' | 'spec'>('sow');
  const [clientName, setClientName] = useState('Acme Corporation');
  const [projectName, setProjectName] = useState('Enterprise ERP & Cloud Sync');
  const [amount, setAmount] = useState('45,000');
  const [timeline, setTimeline] = useState('8 Weeks');
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const getDocTitle = () => {
    switch (docType) {
      case 'sow':
        return `Statement of Work (SOW) - ${projectName}`;
      case 'quotation':
        return `Commercial Quotation Q-2025 - ${clientName}`;
      case 'legal':
        return `Master Non-Disclosure Agreement (NDA) - ${clientName}`;
      case 'spec':
        return `Project Technical Specification v1.0 - ${projectName}`;
    }
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Create Internal & Legal Project Documents
            </h3>
            <p className="text-[11px] text-[#9ca3af]">
              Generate SOWs, Legal NDAs, Quotations, and Specs with Google Drive Sync
            </p>
          </div>
        </div>
      }
      footer={
        !isGenerated ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#16201b] border border-[#223328] text-xs text-[#9ca3af] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="px-5 py-2 rounded-lg bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-bold shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate & Sync to Drive</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setIsGenerated(false)}
              className="px-3 py-1.5 rounded-lg bg-[#16201b] border border-[#223328] text-xs text-[#9ca3af] hover:text-white"
            >
              Create Another
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Downloading document...')}
                className="px-4 py-2 rounded-lg bg-[#16201b] border border-[#2dd4bf]/40 text-[#2dd4bf] hover:bg-[#2dd4bf]/10 text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Copy</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#2dd4bf] text-[#052e24] text-xs font-bold hover:bg-[#26b8a5]"
              >
                Done
              </button>
            </div>
          </div>
        )
      }
    >
      {!isGenerated ? (
        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#d1d5db] font-medium mb-1">Document Template</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-lg px-3 py-2 text-white outline-none"
              >
                <option value="sow">Statement of Work (SOW)</option>
                <option value="quotation">Commercial Quotation</option>
                <option value="legal">Legal Non-Disclosure Agreement (NDA)</option>
                <option value="spec">Project Technical Specification</option>
              </select>
            </div>

            <div>
              <label className="block text-[#d1d5db] font-medium mb-1">Client / Counterparty</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-lg px-3 py-2 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#d1d5db] font-medium mb-1">Project Name</label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-lg px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[#d1d5db] font-medium mb-1">Commercial Value ($)</label>
              <input
                type="text"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-lg px-3 py-2 text-white outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#d1d5db] font-medium mb-1">Delivery Timeline / Duration</label>
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-lg px-3 py-2 text-white outline-none"
            />
          </div>

          {/* Google Drive sync confirmation badge */}
          <div className="p-3 rounded-xl bg-[#14221b] border border-[#1e382b] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#2dd4bf]">
              <Cloud className="w-4 h-4" />
              <span className="font-semibold">Auto-Sync destination: Google Drive /Omnysync/{docType.toUpperCase()}/</span>
            </div>
            <span className="text-[10px] bg-[#2dd4bf]/20 text-[#2dd4bf] px-2 py-0.5 rounded font-mono">15 GB Tier</span>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-xs">
          {/* Success sync pill */}
          <div className="p-4 rounded-xl bg-[#132a20] border border-[#224835] flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#2dd4bf] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Document Successfully Created & Synced</h4>
              <p className="text-[11px] text-[#2dd4bf]">
                Uploaded to Google Drive: /Omnysync/{docType.toUpperCase()}/{getDocTitle()}.docx
              </p>
            </div>
          </div>

          {/* Document preview mockup */}
          <div className="bg-[#141e18] border border-[#1e2d24] rounded-xl p-5 text-xs text-[#d1d5db] font-mono space-y-2">
            <p className="font-bold text-white text-sm pb-2 border-b border-[#223328] font-sans">
              {getDocTitle()}
            </p>
            <p>PARTIES: Omnysync Technologies & {clientName}</p>
            <p>PROJECT SCOPE: {projectName}</p>
            <p>ESTIMATED BUDGET: ${amount} USD</p>
            <p>TIMELINE: {timeline}</p>
            <p className="pt-2 text-[11px] text-[#6b7280]">
              Governing Law: Standard International Commercial Enterprise Law.
            </p>
          </div>
        </div>
      )}
    </SideDrawer>
  );
}
