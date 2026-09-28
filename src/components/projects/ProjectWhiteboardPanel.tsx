'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Eraser, Plus, Trash2, StickyNote } from 'lucide-react';

interface Sticky {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface ProjectWhiteboardPanelProps {
  projectId: string;
  projectTitle: string;
}

const COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#ddd6fe'];

export default function ProjectWhiteboardPanel({
  projectId,
  projectTitle,
}: ProjectWhiteboardPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [stickies, setStickies] = useState<Sticky[]>([]);
  const [noteText, setNoteText] = useState('');
  const drawKey = `omnysync_wb_${projectId}`;
  const stickyKey = `omnysync_wb_notes_${projectId}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(stickyKey);
      setStickies(raw ? JSON.parse(raw) : []);
    } catch {
      setStickies([]);
    }
  }, [projectId, stickyKey]);

  useEffect(() => {
    try {
      localStorage.setItem(stickyKey, JSON.stringify(stickies));
    } catch {
      /* ignore */
    }
  }, [stickies, stickyKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const saved = localStorage.getItem(drawKey);
      if (saved) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = saved;
        return;
      }
    } catch {
      /* ignore */
    }
    ctx.fillStyle = '#101613';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [projectId, drawKey]);

  const persistDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      localStorage.setItem(drawKey, canvas.toDataURL('image/png'));
    } catch {
      /* ignore */
    }
  };

  const start = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const move = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing) return;
    setDrawing(false);
    persistDraw();
  };

  const clearBoard = () => {
    if (!confirm('Clear drawing on this whiteboard?')) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#101613';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    try {
      localStorage.removeItem(drawKey);
    } catch {
      /* ignore */
    }
  };

  const addSticky = () => {
    if (!noteText.trim()) return;
    setStickies((prev) => [
      ...prev,
      {
        id: `st-${Date.now()}`,
        text: noteText.trim(),
        x: 24 + (prev.length % 4) * 140,
        y: 24 + Math.floor(prev.length / 4) * 100,
        color: COLORS[prev.length % COLORS.length],
      },
    ]);
    setNoteText('');
  };

  const removeSticky = (id: string) => {
    setStickies((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#121915] border border-[#1e2d24] p-5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">{projectTitle} whiteboard</h2>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Freehand sketch + sticky notes · persisted locally per project
          </p>
        </div>
        <button
          type="button"
          onClick={clearBoard}
          className="px-3 py-2 rounded-xl border border-[#1e2a22] text-[#9ca3af] text-xs font-bold flex items-center gap-1.5 hover:text-white"
        >
          <Eraser className="w-3.5 h-3.5" /> Clear drawing
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-[#1e2a22] bg-[#101613]">
        <canvas
          ref={canvasRef}
          width={900}
          height={420}
          className="w-full h-[420px] cursor-crosshair"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
        />
        {stickies.map((s) => (
          <div
            key={s.id}
            className="absolute w-32 p-2 rounded-lg shadow-lg text-[11px] text-slate-900 font-medium"
            style={{ left: s.x, top: s.y, background: s.color }}
          >
            <div className="flex justify-between gap-1 mb-1">
              <StickyNote className="w-3 h-3 opacity-60" />
              <button type="button" onClick={() => removeSticky(s.id)} className="opacity-50 hover:opacity-100">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            {s.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSticky())}
          placeholder="Add a sticky note…"
          className="flex-1 bg-[#141d18] border border-[#1e2a22] rounded-xl px-3 py-2 text-xs text-white"
        />
        <button
          type="button"
          onClick={addSticky}
          className="px-3 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Sticky
        </button>
      </div>
      {stickies.length === 0 && (
        <p className="text-[11px] text-[#6b7280]">No stickies yet — capture decisions and open questions.</p>
      )}
    </div>
  );
}
