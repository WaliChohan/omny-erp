'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Filter,
  CheckCircle2,
  Tag,
  X,
  Users,
  Building,
} from 'lucide-react';
import { CalendarEventItem, OMNYSYNC_PROJECTS } from '@/data/projectsData';

interface ProjectCalendarViewProps {
  projectId?: string; // If provided, scoped to specific project
  onClose?: () => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ProjectCalendarView({ projectId, onClose }: ProjectCalendarViewProps) {
  // Calendar date navigation (Defaults to current month)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // Oct 2025
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>(projectId || 'all');
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // Events state
  const [events, setEvents] = useState<CalendarEventItem[]>([
    {
      id: 'cev-1',
      date: '2025-10-06',
      time: '10:00 AM',
      title: 'Q4 Core Architecture Sprint Planning',
      tag: 'Engineering',
      color: 'bg-indigo-500',
      projectId: 'p-1',
    },
    {
      id: 'cev-2',
      date: '2025-10-10',
      time: '02:30 PM',
      title: 'Mobile Biometric Prototype Review',
      tag: 'UI/UX Demo',
      color: 'bg-teal-500',
      projectId: 'p-2',
    },
    {
      id: 'cev-3',
      date: '2025-10-15',
      time: '11:00 AM',
      title: 'Acme Corp Milestone 1 Sign-off & SOW Delivery',
      tag: 'Client Review',
      color: 'bg-purple-500',
      projectId: 'p-1',
    },
    {
      id: 'cev-4',
      date: '2025-10-20',
      time: '04:00 PM',
      title: 'Meta Design System Accessibility WCAG Audit',
      tag: 'Audit',
      color: 'bg-amber-500',
      projectId: 'p-3',
    },
    {
      id: 'cev-5',
      date: '2025-10-24',
      time: '01:00 PM',
      title: 'Database Failover & High Availability Drill',
      tag: 'DevOps',
      color: 'bg-rose-500',
      projectId: 'p-1',
    },
    {
      id: 'cev-6',
      date: '2025-10-28',
      time: '03:00 PM',
      title: 'FinTech Velocity Payment Gateway Handoff',
      tag: 'Milestone',
      color: 'bg-teal-500',
      projectId: 'p-2',
    },
  ]);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2025-10-18');
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [eventTag, setEventTag] = useState('Sprint Milestone');
  const [eventColor, setEventColor] = useState('bg-teal-500');
  const [eventProj, setEventProj] = useState(projectId || 'p-1');

  // Month metadata
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Compute month grid days
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const mStr = String(month === 0 ? 12 : month).padStart(2, '0');
      const yStr = month === 0 ? year - 1 : year;
      days.push({
        day: d,
        isCurrentMonth: false,
        dateStr: `${yStr}-${mStr}-${String(d).padStart(2, '0')}`,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      days.push({
        day: d,
        isCurrentMonth: true,
        dateStr: `${year}-${mStr}-${String(d).padStart(2, '0')}`,
      });
    }

    // Next month padding to complete grid (up to 35 or 42 cells)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const mStr = String(month + 2 > 12 ? 1 : month + 2).padStart(2, '0');
      const yStr = month + 2 > 12 ? year + 1 : year;
      days.push({
        day: d,
        isCurrentMonth: false,
        dateStr: `${yStr}-${mStr}-${String(d).padStart(2, '0')}`,
      });
    }

    return days;
  }, [year, month]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (selectedProjectFilter !== 'all' && ev.projectId !== selectedProjectFilter) {
        return false;
      }
      return true;
    });
  }, [events, selectedProjectFilter]);

  // Navigate month
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = () => setCurrentDate(new Date(2025, 9, 1));

  // Add event submission
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEv: CalendarEventItem = {
      id: `cev-${Date.now()}`,
      date: eventDate,
      time: eventTime,
      title: eventTitle,
      tag: eventTag,
      color: eventColor,
      projectId: eventProj,
    };

    setEvents([...events, newEv]);
    setIsAddingEvent(false);
    setEventTitle('');
  };

  return (
    <div className="space-y-6">
      {/* ── Calendar Controls Header ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121915] border border-[#1e2d24] p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                {monthName} {year}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#18261e] text-[#2dd4bf] border border-[#263c2f]">
                Interactive Calendar
              </span>
            </div>
            <p className="text-xs text-[#9ca3af]">
              Comprehensive monthly schedule of all project deadlines, team milestones, and client deliveries
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Project Filter */}
          {!projectId && (
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-1.5 text-xs text-white outline-none"
            >
              <option value="all">All Projects</option>
              {OMNYSYNC_PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          )}

          {/* Month Navigation */}
          <div className="flex items-center gap-1 bg-[#16201b] border border-[#223328] p-1 rounded-xl">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1f2d24] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={today}
              className="px-2.5 py-1 text-xs font-bold text-white hover:text-[#2dd4bf] transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1f2d24] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#16201b] border border-[#223328] p-1 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-[#2dd4bf] text-[#052e24]'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              Month Grid
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'agenda'
                  ? 'bg-[#2dd4bf] text-[#052e24]'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              Agenda List
            </button>
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => setIsAddingEvent(true)}
            className="px-3.5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-black transition-all shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* ── Month Grid View ───────────────────────────────────────────────── */}
      {viewMode === 'month' && (
        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl overflow-hidden shadow-xl">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-[#1e2d24] bg-[#141d18]">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-bold uppercase tracking-wider text-[#9ca3af]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 7-Column Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#18241d] bg-[#101613]">
            {calendarGrid.map((cell, idx) => {
              const dayEvents = filteredEvents.filter((ev) => ev.date === cell.dateStr);
              const isToday = cell.dateStr === '2025-10-20';

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                    cell.isCurrentMonth ? 'bg-[#121915]' : 'bg-[#0e1411]/50 opacity-40'
                  } hover:bg-[#16221a]`}
                >
                  {/* Top: Day Number + Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-[#2dd4bf] text-[#052e24] shadow-md shadow-[#2dd4bf]/30'
                          : 'text-[#9ca3af]'
                      }`}
                    >
                      {cell.day}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />
                    )}
                  </div>

                  {/* Events list in this day */}
                  <div className="space-y-1 my-1 flex-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`px-1.5 py-1 rounded text-[10px] font-semibold text-white truncate shadow-sm ${ev.color} cursor-pointer hover:brightness-110`}
                        title={`${ev.time} - ${ev.title}`}
                      >
                        <span className="font-mono text-[9px] opacity-80 mr-1">{ev.time}</span>
                        <span>{ev.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] font-bold text-[#2dd4bf] block pl-1">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Agenda List View ──────────────────────────────────────────────── */}
      {viewMode === 'agenda' && (
        <div className="bg-[#121915] border border-[#1e2d24] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Chronological Event Timeline</h3>

          <div className="divide-y divide-[#1b2620]">
            {filteredEvents.map((ev) => (
              <div key={ev.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-10 rounded-full ${ev.color}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{ev.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#18261e] text-[#2dd4bf] border border-[#23382d]">
                        {ev.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#6b7280] mt-1 font-mono">
                      <span>{ev.date}</span>
                      <span>&bull;</span>
                      <span>{ev.time}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#9ca3af] font-medium">
                    {OMNYSYNC_PROJECTS.find((p) => p.id === ev.projectId)?.title || 'Omnysync Platform'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Add Event Modal ───────────────────────────────────────────────── */}
      {isAddingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121915] border border-[#223328] w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddingEvent(false)}
              className="absolute top-5 right-5 text-[#9ca3af] hover:text-white p-1 rounded-lg hover:bg-[#1a2620] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf]">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Schedule Project Event</h3>
                <p className="text-xs text-[#9ca3af]">Add a milestone, demo or deadline to the calendar</p>
              </div>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#d1d5db] font-semibold mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SOW Milestone 2 Delivery Review"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Tag / Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Client Demo, Sprint"
                    value={eventTag}
                    onChange={(e) => setEventTag(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#d1d5db] font-semibold mb-1">Project</label>
                  <select
                    value={eventProj}
                    onChange={(e) => setEventProj(e.target.value)}
                    className="w-full bg-[#16201b] border border-[#223328] focus:border-[#2dd4bf] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {OMNYSYNC_PROJECTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-[#d1d5db] font-semibold mb-1.5">Color Tag</label>
                <div className="flex gap-2">
                  {[
                    { id: 'bg-teal-500', name: 'Teal' },
                    { id: 'bg-indigo-500', name: 'Indigo' },
                    { id: 'bg-purple-500', name: 'Purple' },
                    { id: 'bg-amber-500', name: 'Amber' },
                    { id: 'bg-rose-500', name: 'Rose' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setEventColor(c.id)}
                      className={`w-7 h-7 rounded-full ${c.id} border-2 transition-all ${
                        eventColor === c.id ? 'border-white scale-110' : 'border-transparent opacity-60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1b2620]">
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="px-4 py-2 rounded-xl text-[#9ca3af] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] font-black shadow-md shadow-[#2dd4bf]/20"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
