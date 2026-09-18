'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { TaskItem } from '@/data/dashboardData';

interface UpcomingTasksProps {
  initialTasks: TaskItem[];
}

export default function UpcomingTasks({ initialTasks }: UpcomingTasksProps) {
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
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#3c1717] text-[#ef4444] border border-[#592323]">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#352514] text-[#f59e0b] border border-[#52391b]">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#162f22] text-[#00e676] border border-[#214a33]">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#121815] border border-[#1b2620] rounded-xl p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white tracking-tight">Upcoming Tasks</h2>
        <button className="text-xs text-[#00e676] hover:underline font-medium">
          View All
        </button>
      </div>

      {/* Tasks list */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-around">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-[#16201b]/60 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Custom Checkbox */}
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
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
                  className={`text-xs font-medium truncate transition-colors ${
                    task.completed
                      ? 'text-[#6b7280] line-through'
                      : 'text-white group-hover:text-[#00e676]'
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-[11px] text-[#6b7280]">{task.dueDate}</p>
              </div>
            </div>

            {/* Priority tag */}
            <div className="shrink-0 ml-2">
              {getPriorityBadge(task.priority)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
