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
import { AgencyClient, ClientStatus, ServiceLine } from '@/data/clientsData';
import { TEAM_MEMBERS } from '@/data/projectsData';

export type BulkImportEntity = 'leads' | 'clients';

interface BulkImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity?: BulkImportEntity;
  onImportLeads?: (leads: LeadCard[]) => void;
  onImportClients?: (clients: AgencyClient[]) => void;
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
  | 'estimatedValue'
  | 'industry'
  | 'city'
  | 'mrr'
  | 'services'
  | 'accountManager';

const LEAD_FIELDS: { key: FieldKey; label: string }[] = [
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

const CLIENT_FIELDS: { key: FieldKey; label: string }[] = [
  { key: 'skip', label: '— Skip —' },
  { key: 'name', label: 'Contact name' },
  { key: 'company', label: 'Company' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'industry', label: 'Industry' },
  { key: 'city', label: 'City' },
  { key: 'status', label: 'Status' },
  { key: 'mrr', label: 'MRR (PKR)' },
  { key: 'services', label: 'Services (| or ,)' },
  { key: 'accountManager', label: 'Account manager' },
];

const SAMPLE_LEADS = `Full Name\tTitle\tCompany\tEmail\tPhone\tPriority\tRating\tSource
David Miller\tVP Technology\tAcme HVAC\tdavid@acmehvac.com\t+1 415 555 0101\tHot Clients\t5\tLinkedIn
Sarah Jenkins\tHead of Growth\tComfortZone\tsarah@comfortzone.io\t+1 415 555 0102\tGreat Interest\t4\tEmail`;

const SAMPLE_CLIENTS = `Contact Name\tCompany\tEmail\tPhone\tIndustry\tCity\tStatus\tMRR\tServices
James Porter\tCoolAir Pros\tjames@coolairpros.com\t+1 425 555 0101\tHVAC\tSeattle\tActive\t180000\tWebsite|SEO
Nina Shah\tHomeComfort Co\tnina@homecomfort.co\t+1 206 555 0102\tHome Services\tBellevue\tOnboarding\t95000\tMobile App|Custom Software`;

function splitLine(line: string): string[] {
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

function guessField(header: string, entity: BulkImportEntity): FieldKey {
  const h = header.toLowerCase().replace(/[_\s]+/g, '');
  if (/^(fullname|fullname|contact|lead)$/.test(h) || h.includes('fullname') || h.includes('contact')) return 'name';
  if (/title|role|designation|job/.test(h)) return 'title';
  if (/company|org|account|business/.test(h)) return 'company';
  if (/email|mail/.test(h)) return 'email';
  if (/phone|mobile|cell|tel/.test(h)) return 'phone';
  if (/priority|heat|tier/.test(h)) return 'priority';
  if (/rating|score|stars/.test(h)) return 'rating';
  if (/source|channel|origin/.test(h)) return 'source';
  if (/status|stage/.test(h)) return 'status';
  if (/value|amount|deal|budget|revenue/.test(h) && entity === 'leads') return 'estimatedValue';
  if (/industry|vertical|sector/.test(h)) return 'industry';
  if (/city|location|region/.test(h)) return 'city';
  if (/mrr|retainer|monthly/.test(h)) return 'mrr';
  if (/service|offering|product/.test(h)) return 'services';
  if (/manager|am|owner|rep/.test(h)) return 'accountManager';
  return 'skip';
}

const AVATAR_COLORS = ['bg-[#00e676]', 'bg-[#38bdf8]', 'bg-[#a855f7]', 'bg-[#f59e0b]', 'bg-[#f43f5e]'];
const SERVICE_OPTS: ServiceLine[] = ['Website', 'Custom Software', 'SEO', 'Mobile App', 'Retainer'];

export default function BulkImportLeadsModal({
  isOpen,
  onClose,
  entity = 'leads',
  onImportLeads,
  onImportClients,
}: BulkImportLeadsModalProps) {
  const [rawText, setRawText] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<FieldKey[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'map' | 'preview'>('input');

  const fieldOptions = entity === 'clients' ? CLIENT_FIELDS : LEAD_FIELDS;
  const title = entity === 'clients' ? 'Bulk import clients' : 'Bulk import leads';

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
    const map = hdrs.map((h) => guessField(h, entity));
    if (!map.includes('name') && map[0] === 'skip') map[0] = 'name';
    if (entity === 'clients' && !map.includes('company')) {
      const ci = map.findIndex((m, i) => i > 0 && m === 'skip');
      if (ci >= 0) map[ci] = 'company';
    }
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

  const getCell = (cols: string[], key: FieldKey) => {
    const idx = mapping.indexOf(key);
    return idx >= 0 ? (cols[idx] || '').trim() : '';
  };

  const previewLeads = useMemo(() => {
    if (entity !== 'leads' || !rows.length) return [] as LeadCard[];
    return rows.map((cols, i) => {
      const name = getCell(cols, 'name') || `Lead ${i + 1}`;
      const titleRole = getCell(cols, 'title') || 'Contact';
      const company = getCell(cols, 'company');
      const priority = (getCell(cols, 'priority') as LeadFilter) || 'Hot Clients';
      const ratingRaw = parseInt(getCell(cols, 'rating'), 10);
      const rating = (Number.isFinite(ratingRaw)
        ? Math.min(5, Math.max(1, ratingRaw))
        : 3) as 1 | 2 | 3 | 4 | 5;
      const source = (getCell(cols, 'source') as LeadSource) || 'LinkedIn';
      const initials = name
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      return {
        id: `imp-${Date.now()}-${i}`,
        name,
        title: company ? `${titleRole} at ${company}` : titleRole,
        company,
        email: getCell(cols, 'email'),
        phone: getCell(cols, 'phone'),
        avatarInitials: initials || 'LD',
        avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
        priority: (['Hot Clients', 'Great Interest', 'Medium Interest', 'Low Interest'] as LeadFilter[]).includes(
          priority as LeadFilter
        )
          ? (priority as LeadFilter)
          : 'Hot Clients',
        rating,
        sources: [source || 'LinkedIn'],
        status: (getCell(cols, 'status') as LeadCard['status']) || 'New',
        estimatedValue:
          parseFloat(getCell(cols, 'estimatedValue').replace(/[^0-9.]/g, '')) || undefined,
        createdDate: new Date().toISOString().slice(0, 10),
      } as LeadCard;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, mapping, entity]);

  const previewClients = useMemo(() => {
    if (entity !== 'clients' || !rows.length) return [] as AgencyClient[];
    const today = new Date().toISOString().slice(0, 10);
    return rows.map((cols, i) => {
      const name = getCell(cols, 'name') || `Contact ${i + 1}`;
      const company = getCell(cols, 'company') || name;
      const statusRaw = getCell(cols, 'status') || 'Active';
      const status = (['Active', 'Onboarding', 'Paused', 'Churned'] as ClientStatus[]).includes(
        statusRaw as ClientStatus
      )
        ? (statusRaw as ClientStatus)
        : 'Active';
      const servicesRaw = getCell(cols, 'services');
      const services = servicesRaw
        .split(/[|,]/)
        .map((s) => s.trim())
        .filter((s): s is ServiceLine => SERVICE_OPTS.includes(s as ServiceLine));
      const mrr = parseFloat(getCell(cols, 'mrr').replace(/[^0-9.]/g, '')) || 0;
      return {
        id: `cli-imp-${Date.now()}-${i}`,
        name,
        company,
        industry: getCell(cols, 'industry') || 'Home Services',
        email: getCell(cols, 'email') || `import${i}@example.com`,
        phone: getCell(cols, 'phone') || '',
        status,
        services: services.length ? services : (['Website'] as ServiceLine[]),
        mrr,
        lifetimeValue: mrr * 12,
        openProjects: 0,
        accountManager: getCell(cols, 'accountManager') || TEAM_MEMBERS[0]?.name || 'AM',
        city: getCell(cols, 'city') || 'Remote',
        joinedAt: today,
        lastTouch: today,
        notes: 'Imported via bulk CSV/TSV',
      } as AgencyClient;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, mapping, entity]);

  const previewCount = entity === 'clients' ? previewClients.length : previewLeads.length;

  const handleImport = () => {
    if (!previewCount) {
      setErrorMsg('Nothing to import.');
      return;
    }
    if (entity === 'clients') onImportClients?.(previewClients);
    else onImportLeads?.(previewLeads);
    setRawText('');
    setHeaders([]);
    setRows([]);
    setMapping([]);
    setStep('input');
    onClose();
  };

  const sample = entity === 'clients' ? SAMPLE_CLIENTS : SAMPLE_LEADS;

  return (
    <SideDrawer isOpen={isOpen} onClose={onClose} title={title} width="max-w-2xl">
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
              Paste CSV/TSV with headers. Columns are detected dynamically for{' '}
              <strong className="text-white">{entity}</strong>.
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
                  setRawText(sample);
                  if (parseTable(sample)) setStep('map');
                }}
                className="px-3 py-2 rounded-lg bg-[#141d18] border border-[#1e2a22] text-[#9ca3af] hover:text-white flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Load sample
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
              <Table2 className="w-4 h-4" /> Map {headers.length} columns → {entity} fields
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {headers.map((h, i) => (
                <div
                  key={`${h}-${i}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#141d18] border border-[#1e2a22]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{h || `Column ${i + 1}`}</p>
                    <p className="text-[10px] text-[#6b7280] truncate">e.g. {rows[0]?.[i] || '—'}</p>
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
                    {fieldOptions.map((o) => (
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
                    <th className="px-3 py-2 font-semibold">
                      {entity === 'clients' ? 'City' : 'Phone'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(entity === 'clients' ? previewClients : previewLeads).slice(0, 50).map((row: any) => (
                    <tr key={row.id} className="border-t border-[#1e2a22]">
                      <td className="px-3 py-2 text-white">{row.name}</td>
                      <td className="px-3 py-2 text-[#9ca3af]">{row.company || '—'}</td>
                      <td className="px-3 py-2 text-[#9ca3af]">{row.email || '—'}</td>
                      <td className="px-3 py-2 text-[#9ca3af]">
                        {entity === 'clients' ? row.city || '—' : row.phone || '—'}
                      </td>
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
                <CheckCircle2 className="w-4 h-4" /> Import {previewCount} {entity}
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
