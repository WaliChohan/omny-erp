'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useWhiteboard } from '@/context/WhiteboardContext';
import {
  X,
  Download,
  RotateCcw,
  RotateCw,
  Trash2,
  Pen,
  Square,
  Circle,
  Minus,
  ArrowUpRight,
  Type,
  Eraser,
  Palette,
  Check,
  StickyNote,
} from 'lucide-react';

type Tool = 'pen' | 'line' | 'arrow' | 'rect' | 'circle' | 'eraser' | 'text';

const COLORS = [
  { label: 'Lime Accent', value: '#b8ff00' },
  { label: 'Teal Mint', value: '#2dd4bf' },
  { label: 'Cyan Sky', value: '#38bdf8' },
  { label: 'Amber Gold', value: '#fbbf24' },
  { label: 'Rose Coral', value: '#f43f5e' },
  { label: 'Purple Violet', value: '#a855f7' },
  { label: 'Pure White', value: '#ffffff' },
  { label: 'Slate Gray', value: '#94a3b8' },
];

const STROKE_SIZES = [
  { label: 'Fine', value: 2 },
  { label: 'Medium', value: 4 },
  { label: 'Bold', value: 8 },
  { label: 'Marker', value: 16 },
];

export default function WhiteboardModal() {
  const { isOpen, closeWhiteboard } = useWhiteboard();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [currentColor, setCurrentColor] = useState<string>('#b8ff00');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  // Undo / Redo stacks
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Text / Sticky Note Prompt
  const [textInput, setTextInput] = useState<{ x: number; y: number; text: string } | null>(null);

  // Snapshot before drawing shapes
  const snapshotRef = useRef<ImageData | null>(null);

  // Background color of canvas
  const CANVAS_BG = '#0a0f0d';

  const saveToLocalStorage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL();
      localStorage.setItem('omnysync_whiteboard_data', dataUrl);
    } catch {
      // ignore storage quota errors
    }
  }, []);

  const pushHistoryState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    setHistory((prev) => {
      const trimmed = prev.slice(0, historyStep + 1);
      return [...trimmed, currentData].slice(-25); // retain last 25 states
    });
    setHistoryStep((prev) => Math.min(prev + 1, 24));
    saveToLocalStorage();
  }, [historyStep, saveToLocalStorage]);

  // Initialize Canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw subtle grid dots
    ctx.fillStyle = 'rgba(45, 212, 191, 0.08)';
    const spacing = 32;
    for (let x = spacing; x < canvas.width; x += spacing) {
      for (let y = spacing; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Restore from localStorage if exists
    const savedData = localStorage.getItem('omnysync_whiteboard_data');
    if (savedData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const initData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initData]);
        setHistoryStep(0);
      };
      img.src = savedData;
    } else {
      const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialData]);
      setHistoryStep(0);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    // Set canvas dimensions based on container
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        initCanvas();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, initCanvas]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    const mouseEvt = e as React.MouseEvent<HTMLCanvasElement>;
    return {
      x: mouseEvt.clientX - rect.left,
      y: mouseEvt.clientY - rect.top,
    };
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (activeTool === 'text') {
      setTextInput({ x: coords.x, y: coords.y, text: '' });
      return;
    }

    setIsDrawing(true);
    setStartPos(coords);

    // Save snapshot for shapes preview
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = activeTool === 'eraser' ? CANVAS_BG : currentColor;
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const coords = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (activeTool === 'pen' || activeTool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else {
      // Restore previous snapshot for clean dynamic shape rendering
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }

      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = currentColor;

      if (activeTool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (activeTool === 'arrow') {
        // Line
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        // Arrow head
        const angle = Math.atan2(coords.y - startPos.y, coords.x - startPos.x);
        const headlen = strokeWidth * 3 + 8;
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        ctx.lineTo(
          coords.x - headlen * Math.cos(angle - Math.PI / 6),
          coords.y - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(coords.x, coords.y);
        ctx.lineTo(
          coords.x - headlen * Math.cos(angle + Math.PI / 6),
          coords.y - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      } else if (activeTool === 'rect') {
        const width = coords.x - startPos.x;
        const height = coords.y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (activeTool === 'circle') {
        const radiusX = Math.abs(coords.x - startPos.x) / 2;
        const radiusY = Math.abs(coords.y - startPos.y) / 2;
        const centerX = Math.min(startPos.x, coords.x) + radiusX;
        const centerY = Math.min(startPos.y, coords.y) + radiusY;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const handleEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStartPos(null);
    pushHistoryState();
  };

  const handleAddText = () => {
    if (!textInput || !textInput.text.trim()) {
      setTextInput(null);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Draw sticky badge
    const padding = 12;
    ctx.font = 'bold 15px Inter, sans-serif';
    const textMetrics = ctx.measureText(textInput.text);
    const boxWidth = textMetrics.width + padding * 2;
    const boxHeight = 36;

    // Background pill/card
    ctx.fillStyle = '#141e18';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(textInput.x, textInput.y - 24, boxWidth, boxHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Text content
    ctx.fillStyle = currentColor;
    ctx.fillText(textInput.text, textInput.x + padding, textInput.y);

    setTextInput(null);
    pushHistoryState();
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx || !history[prevStep]) return;
      ctx.putImageData(history[prevStep], 0, 0);
      setHistoryStep(prevStep);
      saveToLocalStorage();
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx || !history[nextStep]) return;
      ctx.putImageData(history[nextStep], 0, 0);
      setHistoryStep(nextStep);
      saveToLocalStorage();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid dots
    ctx.fillStyle = 'rgba(45, 212, 191, 0.08)';
    const spacing = 32;
    for (let x = spacing; x < canvas.width; x += spacing) {
      for (let y = spacing; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    pushHistoryState();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `omnysync_whiteboard_${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="h-14 bg-[#0d1410]/95 border-b border-[#1b2a22] px-4 md:px-6 flex items-center justify-between shrink-0 select-none shadow-xl z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#b8ff00]/15 border border-[#b8ff00]/40 flex items-center justify-center text-[#b8ff00] shadow-sm">
            <Pen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Omnysync Canvas Whiteboard
              <span className="text-[10px] bg-[#2dd4bf]/20 text-[#2dd4bf] px-2 py-0.5 rounded-full font-semibold border border-[#2dd4bf]/30">
                Anywhere Tool
              </span>
            </h2>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center bg-[#131b16] rounded-lg p-0.5 border border-[#1e2d24]">
            <button
              onClick={handleUndo}
              disabled={historyStep <= 0}
              title="Undo"
              className="p-1.5 rounded text-[#9ca3af] hover:text-white disabled:opacity-30 disabled:hover:text-[#9ca3af] hover:bg-[#1a2620] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyStep >= history.length - 1}
              title="Redo"
              className="p-1.5 rounded text-[#9ca3af] hover:text-white disabled:opacity-30 disabled:hover:text-[#9ca3af] hover:bg-[#1a2620] transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Clear */}
          <button
            onClick={handleClear}
            title="Clear Canvas"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1717] hover:bg-[#2b1717] text-[#f87171] border border-[#3f1f1f] rounded-lg text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Download PNG */}
          <button
            onClick={handleDownload}
            title="Download PNG"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14231b] hover:bg-[#1c3628] text-[#2dd4bf] border border-[#234d38] rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PNG</span>
          </button>

          {/* Close Modal */}
          <button
            onClick={closeWhiteboard}
            className="w-8 h-8 rounded-lg bg-[#141b17] border border-[#202d25] flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-[#1b2620] transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Toolbar & Canvas Workspace */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#0a0f0d]">
        {/* Floating Drawing Palette */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center gap-2 bg-[#0e1612]/90 backdrop-blur-md p-1.5 px-3 rounded-2xl border border-[#1e2d24] shadow-2xl">
          {/* Tool selector */}
          <div className="flex items-center gap-1 bg-[#141d18] p-1 rounded-xl border border-[#1a2620]">
            {[
              { id: 'pen', icon: Pen, title: 'Freehand Pen' },
              { id: 'line', icon: Minus, title: 'Straight Line' },
              { id: 'arrow', icon: ArrowUpRight, title: 'Arrow' },
              { id: 'rect', icon: Square, title: 'Rectangle' },
              { id: 'circle', icon: Circle, title: 'Circle / Oval' },
              { id: 'text', icon: Type, title: 'Sticky Note / Text' },
              { id: 'eraser', icon: Eraser, title: 'Eraser' },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTool === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTool(t.id as Tool)}
                  title={t.title}
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#b8ff00] text-black shadow-md shadow-[#b8ff00]/20 font-bold scale-105'
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#1a241f]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-[#1f2e26]" />

          {/* Stroke Width Selector */}
          <div className="flex items-center gap-1 bg-[#141d18] p-1 rounded-xl border border-[#1a2620]">
            {STROKE_SIZES.map((sz) => (
              <button
                key={sz.value}
                onClick={() => setStrokeWidth(sz.value)}
                title={`${sz.label} (${sz.value}px)`}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  strokeWidth === sz.value
                    ? 'bg-[#2dd4bf] text-[#052e24]'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#19241e]'
                }`}
              >
                {sz.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-[#1f2e26]" />

          {/* Color Palette */}
          <div className="flex items-center gap-1.5 bg-[#141d18] p-1.5 rounded-xl border border-[#1a2620]">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setCurrentColor(c.value)}
                title={c.label}
                className="w-5 h-5 rounded-full relative transition-transform hover:scale-110 flex items-center justify-center"
                style={{ backgroundColor: c.value }}
              >
                {currentColor === c.value && (
                  <Check className="w-3 h-3 text-black stroke-[3]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Text / Sticky Note Input Overlay */}
        {textInput && (
          <div
            className="absolute z-40 bg-[#121915] border border-[#2dd4bf] p-2 rounded-xl shadow-2xl flex items-center gap-2 animate-in zoom-in-95"
            style={{ left: Math.min(textInput.x, 800), top: Math.min(textInput.y, 600) }}
          >
            <input
              type="text"
              autoFocus
              value={textInput.text}
              placeholder="Type note & press Enter..."
              onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddText();
                if (e.key === 'Escape') setTextInput(null);
              }}
              className="bg-[#18231c] border border-[#273d2f] text-white text-xs px-3 py-1.5 rounded-lg outline-none w-56 placeholder-[#6b7280]"
            />
            <button
              onClick={handleAddText}
              className="px-2.5 py-1.5 bg-[#2dd4bf] hover:bg-[#20b8a4] text-[#052e24] text-xs font-bold rounded-lg"
            >
              Add
            </button>
            <button
              onClick={() => setTextInput(null)}
              className="p-1 text-[#9ca3af] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* The Full Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleDraw}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleDraw}
          onTouchEnd={handleEnd}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Floating Hint Tag */}
        <div className="absolute bottom-4 left-6 pointer-events-none text-[11px] text-[#6b7280] bg-[#0f1612]/70 backdrop-blur px-3 py-1.5 rounded-lg border border-[#1a251e]">
          Vector Canvas: Draw shapes, arrows, notes anywhere in the ERP. Changes persist automatically.
        </div>
      </div>
    </div>
  );
}
