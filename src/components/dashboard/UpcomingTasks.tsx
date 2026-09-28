'use client';

import React, { useState } from 'react';
import { Check, CheckSquare } from 'lucide-react';
import { TaskItem } from '@/data/dashboardData';
import FolderCard from '@/components/common/FolderCard';

interface UpcomingTasksProps {
  initialTasks: TaskItem[];
  onViewAll?: () => void;
}

export default function UpcomingTasks({ initialTasks, onViewAll }: UpcomingTasksProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const getPriorityBadge = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#3c1717] text-[#ef4444] border border-[#592323]">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#352514] text-[#f59e0b] border border-[#52391b]">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#162f22] text-[#00e676] border border-[#214a33]">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <FolderCard
      onOpenDetail={onViewAll}
      themeColor="green"
      buttonSize="md"
      minHeight="min-h-[300px]"
      actionTooltip="Open To-Do & Task Manager"
      avatar={
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#18261e] border border-[#23382c] flex items-center justify-center text-[#00e676] shadow-sm">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Upcoming Tasks</h2>
            <p className="text-[11px] text-[#9ca3af]">Sprint priorities & todos</p>
          </div>
        </div>
      }
      badge={
        <span className="px-2.5 py-1 rounded-full bg-[#15241b] border border-[#203627] text-xs font-bold text-[#00e676]">
          {tasks.filter((t) => t.completed).length}/{tasks.length} Done
        </span>
      }
    >
      {/* Tasks list */}
      <div className="space-y-2 pt-2 flex-1 flex flex-col justify-around">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={(e) => {
              e.stopPropagation();
              toggleTask(task.id);
            }}
            className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-[#16201b]/80 border border-transparent hover:border-[#22382a] cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Custom Checkbox */}
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                  task.completed
                    ? 'bg-[#00e676] border-[#00e676] text-black'
                    : 'border-[#2e4235] bg-[#141d18] group-hover:border-[#00e676]'
                }`}
              >
                {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              {/* Text info */}
              <div className="min-w-0">
                <p
                  className={`text-xs font-semibold truncate transition-colors ${
                    task.completed
                      ? 'text-[#6b7280] line-through'
                      : 'text-white group-hover:text-[#00e676]'
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-[10px] text-[#6b7280]">{task.dueDate}</p>
              </div>
            </div>

            {/* Priority tag */}
            <div className="shrink-0 ml-2">
              {getPriorityBadge(task.priority)}
            </div>
          </div>
        ))}
      </div>
    </FolderCard>
  );
}
