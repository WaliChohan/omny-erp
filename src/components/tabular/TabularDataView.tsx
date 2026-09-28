'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Settings2,
  List,
  LayoutGrid,
  Download,
  ChevronDown,
  ChevronRight,
  Check
} from 'lucide-react';
import {
  INITIAL_STUDENTS_DATA,
  TABULAR_SUMMARY_COUNTS,
  TabularStudent
} from '@/data/tabularData';

export default function TabularDataView() {
  const [activeFilterTab, setActiveFilterTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCourse, setSelectedCourse] = useState('Product Design Fundame...');

  const filterTabs = [
    { id: 'ALL', label: `All Students ${TABULAR_SUMMARY_COUNTS.total}` },
    { id: 'Critical', label: `Critical ${TABULAR_SUMMARY_COUNTS.critical}` },
    { id: 'Needs Attention', label: `Needs Attention ${TABULAR_SUMMARY_COUNTS.needsAttention}` },
    { id: 'Warning', label: `Warning ${TABULAR_SUMMARY_COUNTS.warning}` },
    { id: 'Healthy', label: `Healthy ${TABULAR_SUMMARY_COUNTS.healthy}` },
    { id: 'Recovered', label: `Recovered ${TABULAR_SUMMARY_COUNTS.recovered}` },
  ];

  // Filter students based on active pill tab and search query
  const filteredStudents = useMemo(() => {
    return INITIAL_STUDENTS_DATA.filter((s) => {
      let matchesTab = true;
      if (activeFilterTab === 'Critical') {
        matchesTab = s.primaryRisk === 'Critical';
      } else if (activeFilterTab === 'Needs Attention') {
        matchesTab = s.status === 'Needs Attention';
      } else if (activeFilterTab === 'Warning') {
        matchesTab = s.primaryRisk === 'Warning';
      } else if (activeFilterTab === 'Healthy') {
        matchesTab = s.status === 'Healthy';
      } else if (activeFilterTab === 'Recovered') {
        matchesTab = s.riskScore < 5;
      }

      const matchesSearch =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.primaryRiskReason.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeFilterTab, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: TabularStudent['status']) => {
    switch (status) {
      case 'At-Risk':
        return 'bg-[#421b24] text-[#f43f5e] border border-[#6b2132]';
      case 'Needs Attention':
        return 'bg-[#3b2816] text-[#f59e0b] border border-[#5a3a1b]';
      case 'Healthy':
        return 'bg-[#142e22] text-[#10b981] border border-[#1f4a35]';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const getPrimaryRiskBadge = (risk: TabularStudent['primaryRisk']) => {
    switch (risk) {
      case 'Critical':
        return 'bg-[#421b24] text-[#f43f5e]';
      case 'Warning':
        return 'bg-[#3b2816] text-[#f59e0b]';
      case 'None':
        return 'bg-[#142e22] text-[#10b981]';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-6 space-y-5">
      {/* Header section matching Screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">All Students</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5 font-medium">
            5 students need your attention right now
          </p>
        </div>

        <button
          onClick={() => alert('Exporting all student retention data to CSV / Excel...')}
          className="px-5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md shadow-[#2563eb]/25 flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Breakdown counters dots row */}
      <div className="flex flex-wrap items-center gap-5 text-xs font-bold pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
          <span className="text-white">Critical <span className="text-[#9ca3af] font-normal font-mono">{TABULAR_SUMMARY_COUNTS.critical}</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
          <span className="text-white">Needs Attention <span className="text-[#9ca3af] font-normal font-mono">{TABULAR_SUMMARY_COUNTS.needsAttention}</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
          <span className="text-white">Warning <span className="text-[#9ca3af] font-normal font-mono">{TABULAR_SUMMARY_COUNTS.warning}</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span className="text-white">Healthy <span className="text-[#9ca3af] font-normal font-mono">{TABULAR_SUMMARY_COUNTS.healthy}</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#a855f7]"></span>
          <span className="text-white">Recovered <span className="text-[#9ca3af] font-normal font-mono">{TABULAR_SUMMARY_COUNTS.recovered}</span></span>
        </div>
      </div>

      {/* Filter Tabs Pills Row matching Screenshot 2 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => {
          const isActive = activeFilterTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1e2a23] text-white border border-[#2dd4bf]/40 shadow-sm'
                  : 'bg-[#141e18] text-[#9ca3af] hover:text-white border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Course Dropdown */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#16201b] border border-[#223328] text-xs font-semibold text-white hover:border-[#2dd4bf] transition-colors">
            <span className="text-[#9ca3af] font-normal">Course:</span>
            <span>{selectedCourse}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6b7280]" />
          </button>
        </div>

        {/* Action buttons: Filter, Sort, Manage, View toggles */}
        <div className="flex items-center gap-2 text-xs">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16201b] border border-[#223328] text-[#9ca3af] hover:text-white transition-colors">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16201b] border border-[#223328] text-[#9ca3af] hover:text-white transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort</span>
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16201b] border border-[#223328] text-[#9ca3af] hover:text-white transition-colors">
            <Settings2 className="w-3.5 h-3.5" />
            <span>Manage</span>
          </button>

          <div className="flex items-center bg-[#16201b] p-0.5 rounded-xl border border-[#223328]">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-[#223328] text-white' : 'text-[#6b7280]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#223328] text-white' : 'text-[#6b7280]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-width Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] text-white text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl outline-none transition-colors"
        />
      </div>

      {/* Main Tabular Data View */}
      <div className="overflow-x-auto rounded-xl border border-[#1b2620]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#141d18] text-[#6b7280] border-b border-[#1b2620] font-semibold">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={
                    filteredStudents.length > 0 &&
                    selectedIds.length === filteredStudents.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-[#2a3c30] bg-[#16201b] accent-[#2dd4bf]"
                />
              </th>
              <th className="py-3 px-3">Students</th>
              <th className="py-3 px-3">Course</th>
              <th className="py-3 px-3">Progress &#x21C5;</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Risk Score &#x21C5;</th>
              <th className="py-3 px-3">Primary Risk</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#17221c]">
            {filteredStudents.map((student) => {
              const isSelected = selectedIds.includes(student.id);
              return (
                <tr
                  key={student.id}
                  className={`hover:bg-[#16211a] transition-colors group ${
                    isSelected ? 'bg-[#18281f]' : ''
                  }`}
                >
                  {/* Row Checkbox */}
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(student.id)}
                      className="rounded border-[#2a3c30] bg-[#16201b] accent-[#2dd4bf]"
                    />
                  </td>

                  {/* Student Avatar + Name + Subtitle */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${student.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        {student.avatarInitials}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-[#2dd4bf] transition-colors">
                          {student.name}
                        </p>
                        <p className="text-[11px] text-[#6b7280]">{student.lastActive}</p>
                      </div>
                    </div>
                  </td>

                  {/* Course & Milestone */}
                  <td className="py-3.5 px-3">
                    <p className="font-medium text-[#d1d5db]">{student.course}</p>
                    <p className="text-[11px] text-[#6b7280]">{student.currentMilestone}</p>
                  </td>

                  {/* Progress bar + % + Flag note */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-1.5 min-w-[150px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#1d2922] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#2563eb] h-full rounded-full transition-all"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-mono font-bold text-white">
                          {student.progress}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9ca3af] truncate">
                        {student.progressFlag}
                      </p>
                    </div>
                  </td>

                  {/* Status Pill Badge */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(
                        student.status
                      )}`}
                    >
                      {student.status === 'Healthy' && <span className="mr-1">&#x2764;</span>}
                      {student.status !== 'Healthy' && <span className="mr-1">&#x26A0;</span>}
                      {student.status}
                    </span>
                  </td>

                  {/* Risk Score Meter */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2 min-w-[90px]">
                      <div className="w-12 bg-[#1d2922] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.riskScore > 75
                              ? 'bg-[#ef4444]'
                              : student.riskScore > 30
                              ? 'bg-[#f59e0b]'
                              : 'bg-[#10b981]'
                          }`}
                          style={{ width: `${student.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-white text-xs">
                        {student.riskScore}%
                      </span>
                    </div>
                  </td>

                  {/* Primary Risk */}
                  <td className="py-3.5 px-3">
                    <div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-0.5 ${getPrimaryRiskBadge(
                          student.primaryRisk
                        )}`}
                      >
                        {student.primaryRisk}
                      </span>
                      <p className="text-[11px] text-[#6b7280] truncate max-w-[140px]">
                        {student.primaryRiskReason}
                      </p>
                    </div>
                  </td>

                  {/* Contextual Action Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Opening ${student.actionText} for ${student.name}`)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#2563eb]/60 text-[#60a5fa] hover:bg-[#2563eb] hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1 group/btn"
                    >
                      <span>{student.actionText}</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
