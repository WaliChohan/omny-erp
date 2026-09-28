'use client';

import React, { useState } from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { LeadCard, LeadFilter, LeadSource } from '@/data/crmData';

interface BulkImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: LeadCard[]) => void;
}

const SAMPLE_CSV = `Full Name,Title,Company,Email,Phone,Priority,Rating,Source
David Miller,VP Technology,Acme Systems,david.m@acme.com,+1 415 555 0101,Hot Clients,5,LinkedIn
Sarah Jenkins,Head of Growth,SaaS Velocity,sarah@saasvelocity.com,+1 415 555 0102,Great Interest,4,Email
Robert Taylor,Chief Architect,DataCore Labs,rtaylor@datacore.io,+1 212 555 0103,Medium Interest,3,Referral
Michael Chang,Director of Engineering,OmniFlow,mchang@omniflow.com,+1 408 555 0104,Hot Clients,5,LinkedIn`;

export default function BulkImportLeadsModal({
  isOpen,
  onClose,
  onImportLeads,
}: BulkImportLeadsModalProps) {
  const [importMode, setImportMode] = useState<'paste' | 'file'>('paste');
  const [csvText, setCsvText] = useState('');
  const [parsedLeads, setParsedLeads] = useState<LeadCard[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const parseCSVContent = (content: string) => {
    try {
      const lines = content.trim().split('\n');
      if (lines.length < 2) {
        setErrorMsg('CSV must contain a header row and at least one lead row.');
        setParsedLeads([]);
        return;
      }

      const results: LeadCard[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map((c) => c.trim());

        const name = cols[0] || `Lead ${i}`;
        const title = cols[1] || 'Executive';
        const company = cols[2] || '';
        const email = cols[3] || '';
        const phone = cols[4] || '';
        const priority = (cols[5] as LeadFilter) || 'Hot Clients';
        const rating = (parseInt(cols[6], 10) || 4) as 1 | 2 | 3 | 4 | 5;
        const source = (cols[7] as LeadSource) || 'LinkedIn';

        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        results.push({
          id: `imp-${Date.now()}-${i}`,
          name,
          title: company ? `${title} at ${company}` : title,
          company,
          email,
          phone,
          avatarInitials: initials,
          avatarColor: 'bg-[#00e676]',
          priority,
          rating,
          sources: [source],
          estimatedValue: 40000 + i * 5000,
          status: 'Qualified',
        });
      }

      setParsedLeads(results);
      setErrorMsg(null);
    } catch {
      setErrorMsg('Failed to parse CSV format. Please ensure valid comma-separated rows.');
      setParsedLeads([]);
    }
  };

  const handlePasteChange = (val: string) => {
    setCsvText(val);
    if (val.trim()) {
      parseCSVContent(val);
    } else {
      setParsedLeads([]);
      setErrorMsg(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      parseCSVContent(text);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setCsvText(SAMPLE_CSV);
    parseCSVContent(SAMPLE_CSV);
  };

  const handleCommitImport = () => {
    if (parsedLeads.length === 0) return;
    onImportLeads(parsedLeads);
    onClose();
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-2xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#b8ff00]/20 border border-[#b8ff00]/40 flex items-center justify-center text-[#b8ff00]">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Bulk Import Leads into CRM</h3>
            <p className="text-[11px] text-[#9ca3af]">
              Import contacts via CSV upload or paste comma-separated values directly
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[#9ca3af] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={parsedLeads.length === 0}
            onClick={handleCommitImport}
            className="px-5 py-2 rounded-xl bg-[#b8ff00] hover:bg-[#a3e600] disabled:opacity-40 disabled:hover:bg-[#b8ff00] text-black font-bold text-xs shadow-md shadow-[#b8ff00]/20 flex items-center gap-1.5 transition-all"
          >
            <span>Import {parsedLeads.length} Leads</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Mode Selector */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#141d18] p-1 rounded-xl border border-[#223328] text-xs font-bold">
            <button
              onClick={() => setImportMode('paste')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                importMode === 'paste'
                  ? 'bg-[#b8ff00] text-black shadow-sm'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              Paste CSV
            </button>
            <button
              onClick={() => setImportMode('file')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                importMode === 'file'
                  ? 'bg-[#b8ff00] text-black shadow-sm'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              Upload File
            </button>
          </div>

          <button
            onClick={handleLoadSample}
            className="text-xs text-[#b8ff00] hover:underline flex items-center gap-1 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Leads Data</span>
          </button>
        </div>

        {/* Input area */}
        {importMode === 'paste' ? (
          <div>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => handlePasteChange(e.target.value)}
              placeholder="Paste comma-separated rows here (Full Name, Title, Company, Email, Phone, Priority, Rating, Source)..."
              className="w-full bg-[#141d18] border border-[#223328] focus:border-[#b8ff00] rounded-xl p-3 text-white text-xs font-mono outline-none resize-none"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#223328] hover:border-[#b8ff00] rounded-2xl p-8 text-center bg-[#141d18]/50 transition-colors">
            <FileSpreadsheet className="w-10 h-10 text-[#9ca3af] mx-auto mb-2" />
            <p className="text-xs font-bold text-white">Select a CSV file from your computer</p>
            <p className="text-[11px] text-[#6b7280] mt-1">Supports standard CSV exports from HubSpot, Salesforce, LinkedIn</p>
            <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b2a22] border border-[#263e32] hover:border-[#b8ff00] text-[#b8ff00] text-xs font-bold cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Browse CSV File</span>
              <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/30 text-xs text-[#f87171] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedLeads.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Ready to Import ({parsedLeads.length} Leads Detected)</span>
              </span>
            </div>

            <div className="border border-[#1e2d24] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#16201b] text-[#9ca3af] sticky top-0 font-semibold">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Title & Company</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Priority</th>
                    <th className="p-2 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2620] bg-[#121915]">
                  {parsedLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="p-2 font-bold text-white">{lead.name}</td>
                      <td className="p-2 text-[#9ca3af] truncate max-w-xs">{lead.title}</td>
                      <td className="p-2 font-mono text-[11px] text-[#6b7280]">{lead.email || '—'}</td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#18261e] text-[#b8ff00] border border-[#23382d]">
                          {lead.priority}
                        </span>
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-white">{lead.rating}/5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SideDrawer>
  );
}
