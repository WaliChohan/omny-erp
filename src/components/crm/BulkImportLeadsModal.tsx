'use client';

import React, { useMemo, useState } from 'react';
import SideDrawer from '@/components/ui/SideDrawer';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Table2,
} from 'lucide-react';
import { LeadCard, LeadFilter, LeadSource } from '@/data/crmData';

interface BulkImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: LeadCard[]) => void;
}

type FieldKey =
  | 'skip'
  | 'name'
  | 'title'
  | 'company'
  | 'email'
  | 'phone'
  | 'priority'
  | 'rating'
  | 'source'
  | 'status'
  | 'estimatedValue';

const FIELD_OPTIONS: { key: FieldKey; label: string }[] = [
  { key: 'skip', label: '— Skip —' },
  { key: 'name', label: 'Full name' },
  { key: 'title', label: 'Title / role' },
  { key: 'company', label: 'Company' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'priority', label: 'Priority' },
  { key: 'rating', label: 'Rating (1-5)' },
  { key: 'source', label: 'Source' },
  { key: 'status', label: 'Status' },
  { key: 'estimatedValue', label: 'Est. value (PKR)' },
];

const SAMPLE = `Full Name\tTitle\tCompany\tEmail\tPhone\tPriority\tRating\tSource
David Miller\tVP Technology\tAcme HVAC\tdavid@acmehvac.com\t+1 415 555 0101\tHot Clients\t5\tLinkedIn
Sarah Jenkins\tHead of Growth\tComfortZone\tsarah@comfortzone.io\t+1 415 555 0102\tGreat Interest\t4\tEmail
Robert Taylor\tOwner\tApex Plumbing\trtaylor@apexplumb.com\t+1 212 555 0103\tMedium Interest\t3\tReferral`;

function splitLine(line: string): string[] {
  // CSV with quotes OR TSV
  if (line.includes('\t')) return line.split('\t').map((c) => c.trim());
  const cols: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
      continue;
    }
    if (ch === ',' && !inQ) {
      cols.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  cols.push(cur.trim());
  return cols;
}

function guessField(header: string): FieldKey {
  const h = header.toLowerCase().replace(/[_\s]+/g, '');
  if (/^(fullname|fullname|contact|lead)$/.test(h) || h.includes('fullname')) return 'name';
  if (/title|role|designation|job/.test(h)) return 'title';
  if (/company|org|account|business/.test(h)) return 'company';
  if (/email|mail/.test(h)) return 'email';
  if (/phone|mobile|cell|tel/.test(h)) return 'phone';
  if (/priority|heat|tier/.test(h)) return 'priority';
  if (/rating|score|stars/.test(h)) return 'rating';
  if (/source|channel|origin/.test(h)) return 'source';
  if (/status|stage/.test(h)) return 'status';
  if (/value|amount|deal|budget|pkr|revenue/.test(h)) return 'estimatedValue';
  return 'skip';
}

const AVATAR_COLORS = ['bg-[#00e676]', 'bg-[#38bdf8]', 'bg-[#a855f7]', 'bg-[#f59e0b]', 'bg-[#f43f5e]'];

export default function BulkImportLeadsModal({
  isOpen,
  onClose,
  onImportLeads,
}: BulkImportLeadsModalProps) {
  const [rawText, setRawText] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<FieldKey[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'map' | 'preview'>('input');

  const parseTable = (content: string) => {
    const lines = content
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .map((l) => l.trimEnd())
      .filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      setErrorMsg('Need a header row and at least one data row (CSV or TSV).');
      setHeaders([]);
      setRows([]);
      return false;
    }
    const hdrs = splitLine(lines[0]);
    const body = lines.slice(1).map(splitLine);
    const map = hdrs.map(guessField);
    // Ensure name is mapped somehow
    if (!map.includes('name') && map[0] === 'skip') map[0] = 'name';
    setHeaders(hdrs);
    setRows(body);
    setMapping(map);
    setErrorMsg(null);
    return true;
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setRawText(text);
      if (parseTable(text)) setStep('map');
    };
    reader.readAsText(file);
  };

  const previewLeads = useMemo(() => {
    if (!rows.length || !mapping.length) return [] as LeadCard[];
    const out: LeadCard[] = [];
    rows.forEach((cols, i) => {
      const get = (key: FieldKey) => {
        const idx = mapping.indexOf(key);
        return idx >= 0 ? (cols[idx] || '').trim() : '';
      };
      const name = get('name') || `Lead ${i + 1}`;
      const title = get('title') || 'Contact';
      const company = get('company');
      const email = get('email');
      const phone = get('phone');
      const priority = (get('priority') as LeadFilter) || 'Hot Clients';
      const ratingRaw = parseInt(get('rating'), 10);
      const rating = (Number.isFinite(ratingRaw)
        ? Math.min(5, Math.max(1, ratingRaw))
        : 3) as 1 | 2 | 3 | 4 | 5;
      const source = (get('source') as LeadSource) || 'LinkedIn';
      const statusRaw = get('status');
      const estimatedValue = parseFloat(get('estimatedValue').replace(/[^0-9.]/g, '')) || undefined;
      const initials = name
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      out.push({
        id: `imp-${Date.now()}-${i}`,
        name,
        title: company ? `${title} at ${company}` : title,
        company,
        email,
        phone,
        avatarInitials: initials || 'LD',
        avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
        priority: (['Hot Clients', 'Great Interest', 'Medium Interest', 'Low Interest'] as LeadFilter[]).includes(
          priority as LeadFilter
        )
          ? (priority as LeadFilter)
          : 'Hot Clients',
        rating,
        sources: [source || 'LinkedIn'],
        status: (statusRaw as LeadCard['status']) || 'New',
        estimatedValue,
        createdDate: new Date().toISOString().slice(0, 10),
      });
    });
    return out;
  }, [rows, mapping]);

  const handleImport = () => {
    if (!previewLeads.length) {
      setErrorMsg('Nothing to import.');
      return;
    }
    onImportLeads(previewLeads);
    setRawText('');
    setHeaders([]);
    setRows([]);
    setMapping([]);
    setStep('input');
    onClose();
  };

  return (
    <SideDrawer isOpen={isOpen} onClose={onClose} title="Bulk import leads" width="max-w-2xl">
      <div className="space-y-4 text-xs">
        <div className="flex items-center gap-2 text-[11px] text-[#9ca3af]">
          <span className={step === 'input' ? 'text-[#2dd4bf] font-bold' : ''}>1. Paste / upload</span>
          <ArrowRight className="w-3 h-3" />
          <span className={step === 'map' ? 'text-[#2dd4bf] font-bold' : ''}>2. Map columns</span>
          <ArrowRight className="w-3 h-3" />
          <span className={step === 'preview' ? 'text-[#2dd4bf] font-bold' : ''}>3. Preview</span>
        </div>

        {step === 'input' && (
          <>
            <p className="text-[#9ca3af]">
              Paste CSV or TSV with a header row. Columns are detected dynamically — map any headers next.
            </p>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={10}
              placeholder="Paste spreadsheet rows here…"
              className="w-full bg-[#0b1210] border border-[#1e2a22] rounded-xl p-3 text-[#e5e7eb] font-mono text-[11px] focus:outline-none focus:border-[#2dd4bf]/50"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setRawText(SAMPLE);
                  if (parseTable(SAMPLE)) setStep('map');
                }}
                className="px-3 py-2 rounded-lg bg-[#141d18] border border-[#1e2a22] text-[#9ca3af] hover:text-white flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Load sample TSV
              </button>
              <label className="px-3 py-2 rounded-lg bg-[#141d18] border border-[#1e2a22] text-[#9ca3af] hover:text-white flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> Upload .csv / .tsv
                <input
                  type="file"
                  accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  if (parseTable(rawText)) setStep('map');
                }}
                className="ml-auto px-4 py-2 rounded-lg bg-[#2dd4bf] text-[#0a0f0d] font-bold flex items-center gap-1.5"
              >
                Detect columns <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}

        {step === 'map' && (
          <>
            <div className="flex items-center gap-2 text-[#2dd4bf] font-semibold">
              <Table2 className="w-4 h-4" /> Map {headers.length} columns → lead fields
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {headers.map((h, i) => (
                <div
                  key={`${h}-${i}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#141d18] border border-[#1e2a22]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{h || `Column ${i + 1}`}</p>
                    <p className="text-[10px] text-[#6b7280] truncate">
                      e.g. {rows[0]?.[i] || '—'}
                    </p>
                  </div>
                  <select
                    value={mapping[i]}
                    onChange={(e) => {
                      const next = [...mapping];
                      next[i] = e.target.value as FieldKey;
                      setMapping(next);
                    }}
                    className="bg-[#0b1210] border border-[#1e2a22] rounded-lg px-2 py-1.5 text-white"
                  >
                    {FIELD_OPTIONS.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-3 py-2 rounded-lg border border-[#1e2a22] text-[#9ca3af]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep('preview')}
                disabled={!mapping.includes('name')}
                className="ml-auto px-4 py-2 rounded-lg bg-[#2dd4bf] text-[#0a0f0d] font-bold disabled:opacity-40"
              >
                Preview {rows.length} rows
              </button>
            </div>
          </>
        )}

        {step === 'preview' && (
          <>
            <div className="rounded-xl border border-[#1e2a22] overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-[#141d18] text-[#9ca3af] sticky top-0">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Name</th>
                    <th className="px-3 py-2 font-semibold">Company</th>
                    <th className="px-3 py-2 font-semibold">Email</th>
                    <th className="px-3 py-2 font-semibold">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {previewLeads.slice(0, 50).map((l) => (
                    <tr key={l.id} className="border-t border-[#1e2a22]">
                      <td className="px-3 py-2 text-white">{l.name}</td>
                      <td className="px-3 py-2 text-[#9ca3af]">{l.company || '—'}</td>
                      <td className="px-3 py-2 text-[#9ca3af]">{l.email || '—'}</td>
                      <td className="px-3 py-2 text-[#9ca3af]">{l.phone || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('map')}
                className="px-3 py-2 rounded-lg border border-[#1e2a22] text-[#9ca3af]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleImport}
                className="ml-auto px-4 py-2 rounded-lg bg-[#b8ff00] text-[#0a0f0d] font-bold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Import {previewLeads.length} leads
              </button>
            </div>
          </>
        )}

        {errorMsg && (
          <div className="flex items-start gap-2 text-[#f87171] bg-[#2a1212] border border-[#7f1d1d]/50 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </SideDrawer>
  );
}
