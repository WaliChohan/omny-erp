'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  Circle,
  Bell,
  Cloud,
  FileText,
  FileSpreadsheet,
  Upload,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Calendar,
  LayoutGrid,
} from 'lucide-react';
import {
  OMNYSYNC_PROJECTS,
  TODAY_TASKS,
  CALENDAR_GROUPS,
  GOOGLE_DRIVE_FILES,
  ProjectCardItem,
} from '@/data/projectsData';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import ProjectDetailWorkspace from '@/components/projects/ProjectDetailWorkspace';
import ProjectCalendarView from '@/components/projects/ProjectCalendarView';
import FolderCard from '@/components/common/FolderCard';

interface ProjectsHubViewProps {
  onOpenCreateDocument: () => void;
}

export default function ProjectsHubView({ onOpenCreateDocument }: ProjectsHubViewProps) {
  const [projects, setProjects] = useState<ProjectCardItem[]>(OMNYSYNC_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<ProjectCardItem | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [activeMainView, setActiveMainView] = useState<'hub' | 'calendar'>('hub');

  const [tasks, setTasks] = useState(TODAY_TASKS);
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [driveFiles, setDriveFiles] = useState(GOOGLE_DRIVE_FILES);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSyncDrive = () => {
    setIsSyncingDrive(true);
    setTimeout(() => {
      setIsSyncingDrive(false);
    }, 1200);
  };

  const handleProjectCreated = (newProject: ProjectCardItem) => {
    setProjects([newProject, ...projects]);
    setSelectedProject(newProject);
  };

  const handleUpdateProject = (updated: ProjectCardItem) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedProject(updated);
  };

  // If a project card was clicked, render its dedicated workspace dashboard!
  if (selectedProject) {
    return (
      <ProjectDetailWorkspace
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onUpdateProject={handleUpdateProject}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Projects Hub & Workspaces
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5 font-medium">
            Click any project card to open its dedicated dashboard, team, task manager, timeline, whiteboard, and calendar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Main View Switcher: Hub vs Calendar */}
          <div className="flex items-center gap-1 bg-[#141e18] border border-[#223328] p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveMainView('hub')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMainView === 'hub'
                  ? 'bg-[#2dd4bf] text-[#052e24] shadow-sm'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Projects Hub</span>
            </button>

            <button
              onClick={() => setActiveMainView('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMainView === 'calendar'
                  ? 'bg-[#2dd4bf] text-[#052e24] shadow-sm'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Proper Calendar View</span>
            </button>
          </div>

          <button
            onClick={onOpenCreateDocument}
            className="px-4 py-2 rounded-xl bg-[#141e18] border border-[#223328] hover:border-[#2dd4bf] text-[#2dd4bf] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create SOW / Legal Doc</span>
          </button>

          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-black transition-all shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* If Separate Calendar View is selected */}
      {activeMainView === 'calendar' ? (
        <ProjectCalendarView />
      ) : (
        /* Main Grid: Projects + Tasks + Statistics (Left 8) vs Calendar Schedule (Right 4) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Cols: Project Cards, Today's Tasks, Statistics & Google Drive Quota */}
          <div className="lg:col-span-8 space-y-6">
            {/* Project Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <FolderCard
                  key={proj.id}
                  onOpenDetail={() => setSelectedProject(proj)}
                  themeColor={(proj.themeColor as any) || 'teal'}
                  fillColor="#151d19"
                  borderColor="#223328"
                  buttonSize="md"
                  minHeight="min-h-[200px]"
                  actionTooltip={`Open ${proj.title} Workspace`}
                  avatar={
                    <div className="flex items-center -space-x-2">
                      {proj.team && proj.team.length > 0 ? (
                        proj.team.slice(0, 3).map((m) => (
                          <div
                            key={m.id}
                            className={`w-7 h-7 rounded-full ${m.color} border-2 border-[#151d19] flex items-center justify-center text-[10px] font-bold shadow-sm`}
                            title={m.name}
                          >
                            {m.avatar}
                          </div>
                        ))
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#2dd4bf]/20 border-2 border-[#2dd4bf]/40 flex items-center justify-center text-[10px] font-bold text-[#2dd4bf]">
                          U1
                        </div>
                      )}
                      {proj.avatarsCount > 3 && (
                        <div className="w-7 h-7 rounded-full bg-[#111814] border-2 border-[#223328] text-white flex items-center justify-center text-[10px] font-bold">
                          +{proj.avatarsCount - 3}
                        </div>
                      )}
                    </div>
                  }
                  badge={
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1b2820] border border-[#263c2f] text-[#2dd4bf]">
                      {proj.category}
                    </span>
                  }
                >
                  {/* Card Title & Progress */}
                  <div className="mt-2">
                    <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#2dd4bf] transition-colors">{proj.title}</h3>
                    {proj.client && (
                      <p className="text-[11px] text-[#9ca3af] line-clamp-1 mt-0.5">{proj.client}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-[#9ca3af] mt-2.5 mb-1.5 font-medium">
                      <span>{proj.tasksCount} tasks</span>
                      <span className="font-mono font-bold text-white">{proj.progressPercent}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#111814] h-2 rounded-full overflow-hidden p-0.5 border border-[#1e2d24]">
                      <div
                        className="bg-[#2dd4bf] h-full rounded-full transition-all duration-500"
                        style={{ width: `${proj.progressPercent}%` }}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#6b7280]">
                      <span>Target: {proj.deadline}</span>
                      <span className="text-[#2dd4bf] font-bold group-hover:underline flex items-center gap-0.5">
                        Open Workspace &rarr;
                      </span>
                    </div>
                  </div>
                </FolderCard>
              ))}
            </div>

            {/* Row: Tasks for today (Left 6) vs Statistics (Right 6) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* Tasks for today */}
              <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white tracking-tight">Tasks for today</h3>
                  <span className="text-xs text-[#9ca3af] font-mono">
                    {tasks.filter((t) => t.completed).length}/{tasks.length} done
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#152019] border border-[#1e2d24] hover:bg-[#19271e] cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-8 rounded-full ${t.colorTag.replace('border-l-', 'bg-')}`} />
                        <div>
                          <p className="text-xs font-bold text-white">{t.category}</p>
                          <p className={`text-[11px] ${t.completed ? 'line-through text-[#6b7280]' : 'text-[#9ca3af]'}`}>
                            {t.title}
                          </p>
                        </div>
                      </div>

                      <div className="text-[#6b7280]">
                        {t.completed ? (
                          <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white border border-white">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-[#2b3d32] hover:border-white transition-colors" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics and Pro Plan widget */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white tracking-tight mb-3">Sprint Velocity Stats</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#16211a] border border-[#213328] text-center">
                      <span className="text-xl font-black text-white block">28 h</span>
                      <span className="text-[10px] text-[#9ca3af]">Tracked time</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#16211a] border border-[#213328] text-center">
                      <span className="text-xl font-black text-white block">18</span>
                      <span className="text-[10px] text-[#9ca3af]">Finished tasks</span>
                    </div>
                    <div
                      onClick={() => setIsCreateProjectOpen(true)}
                      className="p-3 rounded-xl bg-[#16211a] border border-[#213328] flex flex-col items-center justify-center cursor-pointer hover:border-[#2dd4bf] transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#2dd4bf] text-[#052e24] font-black flex items-center justify-center text-xs">
                        +
                      </div>
                      <span className="text-[10px] text-[#9ca3af] mt-1">New project</span>
                    </div>
                  </div>
                </div>

                {/* Pro Plan widget with warm glowing gradient */}
                <div className="bg-gradient-to-r from-[#ffe4d6]/10 via-[#fed7aa]/20 to-[#fb923c]/15 border border-[#fb923c]/30 rounded-2xl p-5 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-white tracking-tight">$9.99</span>
                      <span className="text-xs text-[#fed7aa]">p/m</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">Pro Workspace Plan</h4>
                    <p className="text-xs text-[#fed7aa]/80 mt-0.5">
                      Includes unlimited whiteboards & automatic Google Drive sync!
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br from-[#f97316]/40 to-[#ea580c]/60 blur-xl pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Google Drive Real-Time Cloud File Sync Section */}
            <div className="bg-[#121915] border border-[#1b2620] rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1b2620]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf]">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Google Drive Real-Time Cloud Storage
                    </h3>
                    <p className="text-xs text-[#9ca3af]">
                      3.4 GB of 15 GB Used (Free Tier) &bull; Synchronizing SOWs, Legal NDAs & Project Docs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncDrive}
                    disabled={isSyncingDrive}
                    className="px-3 py-1.5 rounded-lg bg-[#16201b] border border-[#223328] hover:border-[#2dd4bf] text-xs text-white flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#2dd4bf] ${isSyncingDrive ? 'animate-spin' : ''}`} />
                    <span>{isSyncingDrive ? 'Syncing...' : 'Sync Now'}</span>
                  </button>

                  <button
                    onClick={onOpenCreateDocument}
                    className="px-3.5 py-1.5 rounded-lg bg-[#2dd4bf] hover:bg-[#26b8a5] text-[#052e24] text-xs font-bold transition-all shadow-md shadow-[#2dd4bf]/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Document</span>
                  </button>
                </div>
              </div>

              {/* Storage Quota Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9ca3af]">Drive Free Tier Quota</span>
                  <span className="font-mono text-white font-semibold">22.6% (11.6 GB Remaining)</span>
                </div>
                <div className="w-full bg-[#18241d] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2dd4bf] h-full rounded-full w-[22.6%]" />
                </div>
              </div>

              {/* Drive Synced Files Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[#6b7280] border-b border-[#1b2620] pb-2 font-semibold">
                      <th className="pb-2">Document Name</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Drive Folder</th>
                      <th className="pb-2">Size</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#17221c]">
                    {driveFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-[#16201b]/60 transition-colors">
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-[#2dd4bf]" />
                            <span className="font-medium text-white hover:text-[#2dd4bf] cursor-pointer">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 uppercase font-mono text-[10px] text-[#9ca3af]">
                          {file.type}
                        </td>
                        <td className="py-2.5 font-mono text-[11px] text-[#6b7280]">
                          {file.folderPath}
                        </td>
                        <td className="py-2.5 font-mono text-white">{file.size}</td>
                        <td className="py-2.5 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#132a21] text-[#2dd4bf] border border-[#1e4635]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />
                            Synced
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Calendar Timeline Schedule */}
          <div className="lg:col-span-4 bg-[#121815] border border-[#1b2620] rounded-2xl p-6 text-white space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2620]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2dd4bf]" />
                <h3 className="text-base font-bold tracking-tight">Timeline Schedule</h3>
              </div>
              <button
                onClick={() => setActiveMainView('calendar')}
                className="text-xs text-[#2dd4bf] hover:underline font-semibold"
              >
                Full Grid &rarr;
              </button>
            </div>

            {/* Timeline Events Grouped by Date */}
            <div className="space-y-6">
              {CALENDAR_GROUPS.map((group) => (
                <div key={group.date} className="space-y-3">
                  <span className="text-xs font-semibold text-[#9ca3af] block">
                    {group.date}
                  </span>

                  <div className="space-y-3">
                    {group.events.map((ev) => (
                      <div key={ev.id} className="flex items-start gap-3">
                        <span className="text-xs font-mono text-[#6b7280] w-12 shrink-0 pt-0.5">
                          {ev.time}
                        </span>
                        <div
                          className={`flex-1 pl-3 border-l-2 ${ev.color} hover:bg-[#16211a] p-1 rounded transition-colors`}
                        >
                          <span className="text-[10px] text-[#9ca3af] block">{ev.tag}</span>
                          <span className="text-xs font-bold text-white block">{ev.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
