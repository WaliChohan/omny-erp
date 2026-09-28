'use client';

import React, { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AgencyTask, TaskStatus, TASK_STATUS_COLUMNS } from '@/data/tasksData';
import { Calendar, CheckSquare, MessageSquare, GripVertical } from 'lucide-react';

interface ProjectKanbanBoardProps {
  tasks: AgencyTask[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onOpenTask: (task: AgencyTask) => void;
}

function statusOf(t: AgencyTask): TaskStatus {
  return t.status || (t.completed ? 'done' : 'todo');
}

function KanbanCard({
  task,
  onOpen,
}: {
  task: AgencyTask;
  onOpen: (t: AgencyTask) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { status: statusOf(task) },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  const checklist = task.checklist || [];
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl bg-[#141d18] border border-[#1e2a22] p-3 shadow-sm hover:border-[#2dd4bf]/35 transition-colors"
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-0.5 text-[#6b7280] hover:text-white cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => onOpen(task)} className="flex-1 text-left min-w-0">
          <p className="text-xs font-bold text-white leading-snug">{task.title}</p>
          {task.description && (
            <p className="text-[10px] text-[#9ca3af] mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                task.priority === 'High'
                  ? 'bg-[#7f1d1d]/40 text-[#f87171]'
                  : task.priority === 'Medium'
                    ? 'bg-[#78350f]/40 text-[#fbbf24]'
                    : 'bg-[#064e3b]/40 text-[#34d399]'
              }`}
            >
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-[9px] text-[#6b7280] flex items-center gap-0.5">
                <Calendar className="w-3 h-3" /> {task.dueDate}
              </span>
            )}
            {checklist.length > 0 && (
              <span className="text-[9px] text-[#9ca3af] flex items-center gap-0.5">
                <CheckSquare className="w-3 h-3" /> {doneCount}/{checklist.length}
              </span>
            )}
            {(task.comments?.length || 0) > 0 && (
              <span className="text-[9px] text-[#9ca3af] flex items-center gap-0.5">
                <MessageSquare className="w-3 h-3" /> {task.comments!.length}
              </span>
            )}
          </div>
          {task.assignee && (
            <div className="flex items-center gap-1.5 mt-2">
              <div
                className={`w-5 h-5 rounded-full ${task.assignee.color} text-white text-[9px] font-bold flex items-center justify-center`}
              >
                {task.assignee.avatar}
              </div>
              <span className="text-[10px] text-[#9ca3af]">{task.assignee.name}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

function Column({
  id,
  label,
  tone,
  tasks,
  onOpen,
}: {
  id: TaskStatus;
  label: string;
  tone: string;
  tasks: AgencyTask[];
  onOpen: (t: AgencyTask) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[220px] max-w-[280px] rounded-2xl bg-[#0b1210] border ${tone} ${
        isOver ? 'border-[#2dd4bf] bg-[#0f1a16]' : 'border-[#1e2a22]'
      } flex flex-col max-h-[560px]`}
    >
      <div className="px-3 py-2.5 border-b border-[#1e2a22] flex items-center justify-between sticky top-0 bg-[#0b1210]/95 rounded-t-2xl">
        <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">{label}</h3>
        <span className="text-[10px] font-mono text-[#6b7280] bg-[#141d18] px-1.5 py-0.5 rounded">
          {tasks.length}
        </span>
      </div>
      <div className="p-2 space-y-2 overflow-y-auto flex-1">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <KanbanCard key={t.id} task={t} onOpen={onOpen} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <p className="text-[10px] text-[#4b5563] text-center py-6">Drop tasks here</p>
        )}
      </div>
    </div>
  );
}

export default function ProjectKanbanBoard({
  tasks,
  onStatusChange,
  onOpenTask,
}: ProjectKanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const byStatus = useMemo(() => {
    const map: Record<TaskStatus, AgencyTask[]> = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };
    tasks.forEach((t) => map[statusOf(t)].push(t));
    return map;
  }, [tasks]);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const taskId = String(active.id);
    let nextStatus: TaskStatus | null = null;
    const overId = String(over.id);
    if (TASK_STATUS_COLUMNS.some((c) => c.id === overId)) {
      nextStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) nextStatus = statusOf(overTask);
    }
    if (!nextStatus) return;
    const current = tasks.find((t) => t.id === taskId);
    if (!current || statusOf(current) === nextStatus) return;
    onStatusChange(taskId, nextStatus);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-2">
        {TASK_STATUS_COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            tone={col.tone}
            tasks={byStatus[col.id]}
            onOpen={onOpenTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="rounded-xl bg-[#18261e] border border-[#2dd4bf]/50 p-3 shadow-xl w-[240px]">
            <p className="text-xs font-bold text-white">{activeTask.title}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
