'use client';

import React, { useState } from 'react';
import {
  Plus,
  ArrowUpRight,
  GripVertical,
  Calendar,
  ChevronDown,
  Target,
  TrendingUp,
} from 'lucide-react';
import {
  PIPELINE_STAGES,
  PIPELINE_DEALS,
  type Deal,
  type DealStage,
  type LeadFilter,
  LEAD_FILTERS,
} from '@/data/crmData';

// ─── Shared Primitives (reused from CRMView aesthetic) ───────────────────────

function SourceTag({ source }: { source: string }) {
  const colorMap: Record<string, string> = {
    LinkedIn: 'bg-[#0077b5]/20 text-[#38bdf8] border-[#0077b5]/30',
    Email: 'bg-[#1e2d24] text-[#9ca3af] border-[#2a3c30]',
    Referral: 'bg-[#7c3aed]/20 text-[#a78bfa] border-[#7c3aed]/30',
    'Cold Call': 'bg-[#f97316]/20 text-[#fb923c] border-[#f97316]/30',
    Twitter: 'bg-[#1da1f2]/20 text-[#7dd3fc] border-[#1da1f2]/30',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
        colorMap[source] ?? 'bg-[#1e2d24] text-[#9ca3af] border-[#2a3c30]'
      }`}
    >
      {source}
    </span>
  );
}

function RatingDots({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  const colors = ['#ef4444', '#f97316', '#fbbf24', '#00e676', '#00e676'];
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-all"
          style={{
            backgroundColor: i < rating ? colors[rating - 1] : '#2a2a2a',
            boxShadow: i < rating ? `0 0 4px ${colors[rating - 1]}80` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ─── Empty Column State ───────────────────────────────────────────────────────

function EmptyColumnState({ stageLabel }: { stageLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 px-4">
      {/* Illustrative icon */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
          <Target className="w-6 h-6 text-[#3a3a3a]" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
          <span className="text-[10px] text-[#4b5563]">?</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-[#4b5563]">No Deals in</p>
        <p className="text-xs font-bold text-[#3a3a3a]">{stageLabel}</p>
      </div>
    </div>
  );
}

// ─── Deal Kanban Card ─────────────────────────────────────────────────────────

interface DealCardProps {
  deal: Deal;
  stageColor: string;
  onStageChange: (id: string, newStage: DealStage) => void;
  isDragging: boolean;
  onDragStart: (id: string) => void;
}

function DealCard({ deal, stageColor, onStageChange, isDragging, onDragStart }: DealCardProps) {
  const [showStagePicker, setShowStagePicker] = useState(false);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(deal.id)}
      className={`group relative bg-[#111111] border rounded-xl p-3.5 flex flex-col gap-2.5 transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
        isDragging
          ? 'opacity-40 scale-95'
          : 'hover:border-[#333] hover:shadow-lg hover:shadow-black/50 hover:-translate-y-0.5'
      } border-[#1e1e1e]`}
    >
      {/* Top: Grip + Avatar + Link */}
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <GripVertical className="w-3.5 h-3.5 text-[#3a3a3a] mt-0.5 shrink-0 group-hover:text-[#555] transition-colors" />

        <div className="flex-1 flex items-start justify-between gap-1">
          {/* Avatar */}
          <div className="flex items-start gap-2">
            <div
              className={`w-8 h-8 rounded-lg ${deal.avatarColor} flex items-center justify-center text-white font-black text-[11px] shrink-0 shadow-sm ring-1 ring-black`}
            >
              {deal.avatarInitials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white leading-tight truncate max-w-[130px]">
                {deal.name}
              </p>
              <p className="text-[10px] text-[#6b7280] leading-snug mt-0.5 line-clamp-2 max-w-[130px]">
                {deal.title}
              </p>
            </div>
          </div>

          {/* Expand icon */}
          <button
            aria-label="View deal"
            className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#6b7280] hover:text-white hover:border-[#444] transition-all opacity-0 group-hover:opacity-100 shrink-0"
          >
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Deal Value Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg px-2.5 py-1">
          <TrendingUp className="w-3 h-3 text-[#00e676]" />
          <span className="text-xs font-black text-white font-mono">
            ${deal.dealValue.toLocaleString()}
          </span>
        </div>
        <RatingDots rating={deal.rating} />
      </div>

      {/* Sources */}
      <div className="flex flex-wrap gap-1">
        {deal.sources.map((s) => (
          <SourceTag key={s} source={s} />
        ))}
      </div>

      {/* Close Date + Priority */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-1 text-[10px] text-[#4b5563]">
          <Calendar className="w-2.5 h-2.5" />
          <span>{new Date(deal.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <span className="text-[10px] font-semibold text-[#6b7280] capitalize">
          {deal.priority.toLowerCase()}
        </span>
      </div>

      {/* Stage mover dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowStagePicker((v) => !v)}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0d0d0d] border border-[#1e1e1e] hover:border-[#333] transition-colors text-[10px] font-semibold text-[#6b7280] hover:text-white"
        >
          <span>Move to stage</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {showStagePicker && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#111] border border-[#222] rounded-xl overflow-hidden shadow-2xl shadow-black/60 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {PIPELINE_STAGES.filter((s) => s.id !== deal.stage).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onStageChange(deal.id, s.id);
                  setShowStagePicker(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#1a1a1a] transition-colors text-left"
              >
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.badgeColor} ${s.textColor}`}
                >
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  stageId: DealStage;
  label: string;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  deals: Deal[];
  dragOverStage: DealStage | null;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (stage: DealStage) => void;
  onDragOver: (stage: DealStage) => void;
  onDragLeave: () => void;
  onStageChange: (id: string, newStage: DealStage) => void;
  totalValue: number;
}

function KanbanColumn({
  stageId,
  label,
  badgeColor,
  textColor,
  borderColor,
  glowColor,
  deals,
  dragOverStage,
  draggingId,
  onDragStart,
  onDrop,
  onDragOver,
  onDragLeave,
  onStageChange,
  totalValue,
}: KanbanColumnProps) {
  const isOver = dragOverStage === stageId;

  return (
    <div
      className="flex flex-col gap-3 min-w-[240px] flex-1"
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(stageId);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(stageId);
      }}
      onDragLeave={onDragLeave}
    >
      {/* Column Header */}
      <div
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all ${
          isOver
            ? `border-[${glowColor}] bg-[${glowColor}]/5`
            : `${borderColor} bg-[#0d0d0d]`
        }`}
        style={isOver ? { borderColor: glowColor, backgroundColor: `${glowColor}10` } : undefined}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Stage badge pill */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black shrink-0 ${badgeColor} ${textColor}`}
          >
            {label}
          </span>
          {/* Count badge */}
          <span className="w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[10px] font-bold text-[#9ca3af] flex items-center justify-center shrink-0">
            {deals.length}
          </span>
        </div>

        {/* Column total value */}
        {deals.length > 0 && (
          <span className="text-[10px] font-bold text-[#4b5563] font-mono shrink-0 ml-2">
            ${totalValue.toLocaleString()}
          </span>
        )}
      </div>

      {/* Drop zone + cards */}
      <div
        className={`flex-1 flex flex-col gap-2.5 min-h-[120px] p-2 rounded-xl border border-dashed transition-all duration-200 ${
          isOver
            ? 'border-[#444] bg-[#111]'
            : 'border-[#1a1a1a] bg-transparent'
        }`}
      >
        {deals.length === 0 ? (
          <EmptyColumnState stageLabel={label} />
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              stageColor={glowColor}
              isDragging={draggingId === deal.id}
              onDragStart={onDragStart}
              onStageChange={onStageChange}
            />
          ))
        )}

        {/* Drag-over visual hint */}
        {isOver && draggingId && (
          <div
            className="h-12 rounded-lg border-2 border-dashed flex items-center justify-center text-[11px] text-[#4b5563] transition-all"
            style={{ borderColor: `${glowColor}60` }}
          >
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pipeline Summary Bar ─────────────────────────────────────────────────────

function PipelineSummary({ deals }: { deals: Deal[] }) {
  const totalValue = deals.reduce((a, d) => a + d.dealValue, 0);
  const wonDeals = deals.filter((d) => d.stage === 'closed_won');
  const wonValue = wonDeals.reduce((a, d) => a + d.dealValue, 0);
  const winRate = deals.length ? Math.round((wonDeals.length / deals.length) * 100) : 0;

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl">
      {[
        { label: 'Total Pipeline', value: `$${totalValue.toLocaleString()}`, accent: 'text-white' },
        { label: 'Closed Won', value: `$${wonValue.toLocaleString()}`, accent: 'text-[#00e676]' },
        { label: 'Win Rate', value: `${winRate}%`, accent: 'text-[#38bdf8]' },
        { label: 'Total Deals', value: `${deals.length}`, accent: 'text-[#fbbf24]' },
      ].map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && <div className="w-px h-6 bg-[#1e1e1e]" />}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-[#4b5563] uppercase tracking-widest font-bold">
              {s.label}
            </span>
            <span className={`text-base font-black leading-none ${s.accent}`}>{s.value}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Sales Pipeline View ─────────────────────────────────────────────────

export default function SalesPipelineView() {
  const [deals, setDeals] = useState<Deal[]>(PIPELINE_DEALS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);
  const [activeFilter, setActiveFilter] = useState<LeadFilter | 'All'>('All');

  // Filter deals by priority
  const filteredDeals =
    activeFilter === 'All' ? deals : deals.filter((d) => d.priority === activeFilter);

  // Group filtered deals by stage
  const dealsByStage = (stageId: DealStage) =>
    filteredDeals.filter((d) => d.stage === stageId);

  const columnTotalValue = (stageId: DealStage) =>
    dealsByStage(stageId).reduce((acc, d) => acc + d.dealValue, 0);

  // Drag handlers
  const handleDragStart = (id: string) => setDraggingId(id);

  const handleDrop = (targetStage: DealStage) => {
    if (!draggingId) return;
    setDeals((prev) =>
      prev.map((d) => (d.id === draggingId ? { ...d, stage: targetStage } : d))
    );
    setDraggingId(null);
    setDragOverStage(null);
  };

  const handleStageChange = (dealId: string, newStage: DealStage) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );
  };

  return (
    <div className="space-y-5">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Sales Pipeline</h2>
          <p className="text-xs text-[#4b5563] mt-0.5">
            Drag cards between columns or use the stage selector to move deals
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['All', ...LEAD_FILTERS.filter((f) => f !== 'All')] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f as LeadFilter | 'All')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                  activeFilter === f
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-[#6b7280] border-[#1e1e1e] hover:border-[#333] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Add Deal */}
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00e676] hover:bg-[#00c764] text-black text-xs font-black transition-all shadow-md shadow-[#00e676]/20">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            Add Deal
          </button>
        </div>
      </div>

      {/* ── Pipeline Summary ────────────────────────────────────────────────── */}
      <PipelineSummary deals={deals} />

      {/* ── Kanban Board ────────────────────────────────────────────────────── */}
      <div
        className="overflow-x-auto pb-4"
        onDragEnd={() => {
          setDraggingId(null);
          setDragOverStage(null);
        }}
      >
        <div className="flex gap-3 min-w-max">
          {PIPELINE_STAGES.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stageId={stage.id}
              label={stage.label}
              badgeColor={stage.badgeColor}
              textColor={stage.textColor}
              borderColor={stage.borderColor}
              glowColor={stage.glowColor}
              deals={dealsByStage(stage.id)}
              totalValue={columnTotalValue(stage.id)}
              dragOverStage={dragOverStage}
              draggingId={draggingId}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragOver={setDragOverStage}
              onDragLeave={() => setDragOverStage(null)}
              onStageChange={handleStageChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
