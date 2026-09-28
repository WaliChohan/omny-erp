'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Phone,
  PhoneOff,
  PhoneCall,
  Voicemail,
  PhoneMissed,
  Clock,
  MessageSquarePlus,
  SkipForward,
  CheckCircle2,
} from 'lucide-react';
import { LeadCard, CallOutcome, LeadActivity } from '@/data/crmData';
import { useAgency } from '@/context/AgencyContext';

interface CallDialerPanelProps {
  lead: LeadCard;
  queue?: LeadCard[];
  onOpenLead?: (lead: LeadCard) => void;
}

const OUTCOMES: { id: CallOutcome; label: string; icon: React.ElementType; tone: string }[] = [
  { id: 'connected', label: 'Connected', icon: CheckCircle2, tone: 'border-[#2dd4bf]/40 text-[#2dd4bf]' },
  { id: 'no_answer', label: 'No answer', icon: PhoneMissed, tone: 'border-[#f59e0b]/40 text-[#f59e0b]' },
  { id: 'voicemail', label: 'Voicemail', icon: Voicemail, tone: 'border-[#38bdf8]/40 text-[#38bdf8]' },
  { id: 'busy', label: 'Busy', icon: PhoneOff, tone: 'border-[#a855f7]/40 text-[#a855f7]' },
  { id: 'callback', label: 'Callback', icon: Clock, tone: 'border-[#b8ff00]/40 text-[#b8ff00]' },
  { id: 'wrong_number', label: 'Wrong #', icon: PhoneOff, tone: 'border-[#f87171]/40 text-[#f87171]' },
];

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function CallDialerPanel({ lead, queue = [], onOpenLead }: CallDialerPanelProps) {
  const { logCall, addLeadActivity, getLeadActivities } = useAgency();
  const [dialing, setDialing] = useState(false);
  const [live, setLive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState<CallOutcome>('connected');
  const activities = getLeadActivities(lead.id);

  useEffect(() => {
    setDialing(false);
    setLive(false);
    setSeconds(0);
    setNotes('');
    setOutcome('connected');
  }, [lead.id]);

  useEffect(() => {
    if (!live && !dialing) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [live, dialing]);

  const nextLead = useMemo(() => {
    if (!queue.length) return null;
    const idx = queue.findIndex((l) => l.id === lead.id);
    if (idx < 0) return queue[0];
    return queue[(idx + 1) % queue.length] || null;
  }, [queue, lead.id]);

  const startDial = () => {
    setDialing(true);
    setSeconds(0);
    setTimeout(() => {
      setDialing(false);
      setLive(true);
    }, 1200);
  };

  const hangUpAndLog = () => {
    logCall({
      leadId: lead.id,
      outcome,
      notes: notes.trim() || `Speed-dial ${outcome.replace('_', ' ')} — ${lead.name}`,
      durationSec: seconds,
    });
    setLive(false);
    setDialing(false);
    setSeconds(0);
    setNotes('');
  };

  const addNoteOnly = () => {
    if (!notes.trim()) return;
    addLeadActivity({
      leadId: lead.id,
      type: 'note',
      content: notes.trim(),
    });
    setNotes('');
  };

  return (
    <div className="rounded-2xl border border-[#2dd4bf]/25 bg-gradient-to-br from-[#0f1a16] to-[#0b1210] p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#2dd4bf] font-bold">Speed dialer</p>
          <h3 className="text-sm font-bold text-white mt-0.5">{lead.name}</h3>
          <p className="text-[11px] text-[#9ca3af]">{lead.phone || 'No phone on file'}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg text-white tabular-nums">{fmtDuration(seconds)}</p>
          <p className="text-[10px] text-[#6b7280]">
            {dialing ? 'Ringing…' : live ? 'On call' : 'Idle'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {!live && !dialing ? (
          <button
            type="button"
            onClick={startDial}
            disabled={!lead.phone}
            className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-[#2dd4bf] text-[#0a0f0d] font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <PhoneCall className="w-4 h-4" /> Simulate dial
          </button>
        ) : (
          <button
            type="button"
            onClick={hangUpAndLog}
            className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-[#f87171] text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <PhoneOff className="w-4 h-4" /> End & log
          </button>
        )}
        {nextLead && onOpenLead && (
          <button
            type="button"
            onClick={() => onOpenLead(nextLead)}
            className="px-3 py-2.5 rounded-xl border border-[#1e2a22] text-[#9ca3af] text-xs font-semibold flex items-center gap-1.5 hover:text-white"
          >
            <SkipForward className="w-3.5 h-3.5" /> Next
          </button>
        )}
      </div>

      <div>
        <p className="text-[10px] text-[#9ca3af] font-semibold mb-1.5 uppercase tracking-wider">Outcome</p>
        <div className="grid grid-cols-3 gap-1.5">
          {OUTCOMES.map((o) => {
            const Icon = o.icon;
            const active = outcome === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setOutcome(o.id)}
                className={`px-2 py-2 rounded-lg border text-[10px] font-semibold flex items-center justify-center gap-1 ${
                  active ? o.tone + ' bg-white/5' : 'border-[#1e2a22] text-[#6b7280]'
                }`}
              >
                <Icon className="w-3 h-3" /> {o.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[10px] text-[#9ca3af] font-semibold mb-1.5 uppercase tracking-wider">
          Remarks / notes
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="What did they say? Next step?"
          className="w-full bg-[#0b1210] border border-[#1e2a22] rounded-xl p-2.5 text-[11px] text-white focus:outline-none focus:border-[#2dd4bf]/40"
        />
        <button
          type="button"
          onClick={addNoteOnly}
          className="mt-2 text-[11px] text-[#2dd4bf] font-semibold flex items-center gap-1"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" /> Save note only
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Phone className="w-3.5 h-3.5 text-[#9ca3af]" />
          <p className="text-[10px] uppercase tracking-wider text-[#9ca3af] font-bold">Timeline</p>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {activities.length === 0 && (
            <p className="text-[11px] text-[#6b7280]">No calls or notes yet.</p>
          )}
          {activities.map((a: LeadActivity) => (
            <div
              key={a.id}
              className="p-2.5 rounded-xl bg-[#141d18] border border-[#1e2a22] text-[11px]"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[#2dd4bf] font-semibold uppercase text-[9px] tracking-wider">
                  {a.type}
                  {a.outcome ? ` · ${a.outcome.replace('_', ' ')}` : ''}
                </span>
                <span className="text-[9px] font-mono text-[#6b7280]">
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-[#e5e7eb]">{a.content}</p>
              {typeof a.durationSec === 'number' && (
                <p className="text-[10px] text-[#6b7280] mt-1">Duration {fmtDuration(a.durationSec)}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
