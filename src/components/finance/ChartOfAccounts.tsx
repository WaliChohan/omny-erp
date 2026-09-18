'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileSpreadsheet,
  Search,
  Plus,
  ArrowRightLeft,
  Check
} from 'lucide-react';
import { CHART_OF_ACCOUNTS_4LEVEL, COANode } from '@/data/financialData';

interface COAProps {
  onSelectAccount?: (account: COANode) => void;
}

export default function ChartOfAccounts({ onSelectAccount }: COAProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCodes, setExpandedCodes] = useState<Record<string, boolean>>({
    '1000': true,
    '1100': true,
    '1110': true,
    '2000': true,
    '2100': true,
    '3000': false,
    '4000': true,
    '5000': false,
  });

  const toggleExpand = (code: string) => {
    setExpandedCodes((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    const traverse = (nodes: COANode[]) => {
      for (const node of nodes) {
        all[node.code] = true;
        if (node.children) traverse(node.children);
      }
    };
    traverse(CHART_OF_ACCOUNTS_4LEVEL);
    setExpandedCodes(all);
  };

  const collapseAll = () => {
    setExpandedCodes({});
  };

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-[#2dd4bf]/20 text-[#2dd4bf] border-[#2dd4bf]/30';
      case 2:
        return 'bg-[#818cf8]/20 text-[#818cf8] border-[#818cf8]/30';
      case 3:
        return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30';
      case 4:
        return 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  // Render recursive tree row
  const renderNode = (node: COANode, depth: number = 0) => {
    const isExpanded = expandedCodes[node.code];
    const hasChildren = node.children && node.children.length > 0;
    const isMatching =
      !searchQuery ||
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.code.includes(searchQuery);

    return (
      <div key={node.code} className="select-none">
        <div
          onClick={() => {
            if (hasChildren) toggleExpand(node.code);
            else onSelectAccount?.(node);
          }}
          className={`flex items-center justify-between py-2.5 px-3 rounded-lg cursor-pointer transition-all duration-150 ${
            depth === 0
              ? 'bg-[#141e18] border border-[#203126] my-1.5'
              : 'hover:bg-[#16221a] border-b border-[#18231c]'
          }`}
          style={{ paddingLeft: `${Math.max(12, depth * 24)}px` }}
        >
          {/* Left: Code, Expand Arrow, Icon, Name */}
          <div className="flex items-center gap-2.5 min-w-0">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.code);
                }}
                className="w-5 h-5 rounded flex items-center justify-center text-[#9ca3af] hover:text-white"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#2dd4bf]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-5 h-5 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]/40"></span>
              </span>
            )}

            <span className="font-mono text-xs font-bold text-[#d1d5db] shrink-0">
              {node.code}
            </span>

            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${getLevelBadge(
                node.level
              )}`}
            >
              L{node.level}
            </span>

            <span
              className={`text-xs truncate ${
                depth === 0
                  ? 'font-black text-white text-sm uppercase tracking-wide'
                  : depth === 1
                  ? 'font-bold text-white'
                  : depth === 2
                  ? 'font-medium text-[#e5e7eb]'
                  : 'text-[#9ca3af]'
              }`}
            >
              {node.name}
            </span>
          </div>

          {/* Right: Type badge & Balance */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-block text-[10px] text-[#6b7280] uppercase font-semibold">
              {node.type}
            </span>
            <span
              className={`font-mono text-xs font-bold ${
                node.balance < 0 ? 'text-[#ef4444]' : 'text-white'
              }`}
            >
              ${node.balance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Recursive Children */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-5 space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1b2620]">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">4-Level Chart of Accounts</h3>
          <p className="text-xs text-[#9ca3af]">
            Hierarchical ledger tree: L1 Primary &rarr; L2 Sub-category &rarr; L3 Control &rarr; L4 Posting
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6b7280] absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search account code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#16201b] border border-[#223328] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#6b7280] outline-none focus:border-[#2dd4bf]"
            />
          </div>

          <button
            onClick={expandAll}
            className="px-2.5 py-1.5 rounded-lg bg-[#16201b] border border-[#223328] text-xs text-[#9ca3af] hover:text-white transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1.5 rounded-lg bg-[#16201b] border border-[#223328] text-xs text-[#9ca3af] hover:text-white transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* COA Tree List */}
      <div className="space-y-1">
        {CHART_OF_ACCOUNTS_4LEVEL.map((rootNode) => renderNode(rootNode, 0))}
      </div>
    </div>
  );
}
