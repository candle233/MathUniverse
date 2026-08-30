'use client';

import React, { useRef, useEffect, useState } from 'react';
import { PlotDataPayload } from '../../types/sandbox.ts';
import { useLanguage } from '@/context/LanguageContext';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';

interface Plot2DCanvasProps {
  payload?: PlotDataPayload;
  width?: number;
  height?: number;
  className?: string;
}

export default function Plot2DCanvas({
  payload,
  width = 600,
  height = 360,
  className = '',
}: Plot2DCanvasProps) {
  const { isZh } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  const resetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = (canvas.clientWidth || width) * dpr;
    canvas.height = (canvas.clientHeight || height) * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.clientWidth || width;
    const h = canvas.clientHeight || height;

    // Clear background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    if (!payload) {
      ctx.fillStyle = '#475569';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(isZh ? '等待计算绘图数据...' : 'Waiting for plot data...', w / 2, h / 2);
      return;
    }

    const xRange = payload.xRange || [-5, 5];
    const yRange = payload.yRange || [-3, 3];

    // Coordinate mapping helper
    const xMin = (xRange[0] + pan.x) / zoom;
    const xMax = (xRange[1] + pan.x) / zoom;
    const yMin = (yRange[0] + pan.y) / zoom;
    const yMax = (yRange[1] + pan.y) / zoom;

    const pad = 35;
    const plotW = w - 2 * pad;
    const plotH = h - 2 * pad;

    const toScreenX = (x: number) => pad + ((x - xMin) / (xMax - xMin || 1)) * plotW;
    const toScreenY = (y: number) => h - pad - ((y - yMin) / (yMax - yMin || 1)) * plotH;

    // 1. Draw Grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
    ctx.lineWidth = 1;
    const xStep = Math.pow(10, Math.floor(Math.log10(xMax - xMin || 1))) || 1;
    const yStep = Math.pow(10, Math.floor(Math.log10(yMax - yMin || 1))) || 1;

    ctx.font = '10px monospace';
    ctx.fillStyle = '#64748b';

    // Vertical grid lines
    const startX = Math.floor(xMin / xStep) * xStep;
    for (let x = startX; x <= xMax; x += xStep) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, pad);
      ctx.lineTo(sx, h - pad);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(x.toFixed(1), sx, h - pad + 14);
    }

    // Horizontal grid lines
    const startY = Math.floor(yMin / yStep) * yStep;
    for (let y = startY; y <= yMax; y += yStep) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(pad, sy);
      ctx.lineTo(w - pad, sy);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(y.toFixed(1), pad - 6, sy + 3);
    }

    // 2. Draw Axes (x=0, y=0)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.lineWidth = 1.5;
    if (xMin <= 0 && xMax >= 0) {
      const sx0 = toScreenX(0);
      ctx.beginPath();
      ctx.moveTo(sx0, pad);
      ctx.lineTo(sx0, h - pad);
      ctx.stroke();
    }
    if (yMin <= 0 && yMax >= 0) {
      const sy0 = toScreenY(0);
      ctx.beginPath();
      ctx.moveTo(pad, sy0);
      ctx.lineTo(w - pad, sy0);
      ctx.stroke();
    }

    // 3. Render Riemann Sum Rectangles
    if (payload.riemannRects && payload.riemannRects.length > 0) {
      payload.riemannRects.forEach((rect) => {
        const rx = toScreenX(rect.x);
        const rw = toScreenX(rect.x + rect.width) - rx;
        const ry0 = toScreenY(0);
        const ryH = toScreenY(rect.height);
        const top = Math.min(ry0, ryH);
        const rh = Math.abs(ryH - ry0);

        ctx.fillStyle = rect.isPositive ? 'rgba(6, 182, 212, 0.25)' : 'rgba(244, 63, 94, 0.25)';
        ctx.strokeStyle = rect.isPositive ? '#06b6d4' : '#f43f5e';
        ctx.lineWidth = 1;
        ctx.fillRect(rx, top, rw, rh);
        ctx.strokeRect(rx, top, rw, rh);
      });
    }

    // 4. Render Sequence Limits & Epsilon Bands
    if (payload.sequenceLimit) {
      const { L, N, epsilon, points } = payload.sequenceLimit;
      const syL = toScreenY(L);
      const syUpper = toScreenY(L + epsilon);
      const syLower = toScreenY(L - epsilon);

      // Epsilon Band
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.fillRect(pad, syUpper, plotW, syLower - syUpper);
      ctx.strokeRect(pad, syUpper, plotW, syLower - syUpper);

      // L Center Line
      ctx.setLineDash([]);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pad, syL);
      ctx.lineTo(w - pad, syL);
      ctx.stroke();

      // N cutoff line
      if (N > 0) {
        const sxN = toScreenX(N);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(sxN, pad);
        ctx.lineTo(sxN, h - pad);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Scatter points
      points.forEach((pt) => {
        const sx = toScreenX(pt.n);
        const sy = toScreenY(pt.val);
        ctx.fillStyle = pt.isInside ? '#10b981' : '#f43f5e';
        ctx.beginPath();
        ctx.arc(sx, sy, pt.n >= N ? 3.5 : 2.5, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // 5. Render Vector Field Quiver Arrows
    if (payload.vectorField && payload.vectorField.grid) {
      const maxArrowLen = 14;
      payload.vectorField.grid.forEach((arrow) => {
        const sx = toScreenX(arrow.x);
        const sy = toScreenY(arrow.y);
        const angle = -arrow.angle; // Canvas Y axis is flipped
        const len = Math.min(maxArrowLen, Math.max(4, arrow.magnitude * 4));

        ctx.strokeStyle = 'rgba(168, 85, 247, 0.65)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        const ex = sx + len * Math.cos(angle);
        const ey = sy + len * Math.sin(angle);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Arrowhead
        ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
        ctx.beginPath();
        ctx.arc(ex, ey, 1.5, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // 6. Render 2D Curves
    if (payload.curves && payload.curves.length > 0) {
      payload.curves.forEach((curve) => {
        if (!curve.points || curve.points.length < 2) return;
        ctx.strokeStyle = curve.color || '#38bdf8';
        ctx.lineWidth = curve.strokeWidth || 2;
        if (curve.dashPattern) ctx.setLineDash(curve.dashPattern);
        else ctx.setLineDash([]);

        ctx.beginPath();
        curve.points.forEach((pt, idx) => {
          const sx = toScreenX(pt.x);
          const sy = toScreenY(pt.y);
          if (idx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    // 7. Title / Legend
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(payload.title || (isZh ? '2D 函数与动力系统交互图 (2D Function & Phase Canvas)' : '2D Function & Phase Canvas'), pad, pad - 12);
  }, [payload, zoom, pan, width, height, isZh]);

  // Mouse Handlers for Pan & Hover
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const xRange = payload?.xRange || [-5, 5];
    const yRange = payload?.yRange || [-3, 3];
    const pad = 35;
    const plotW = canvas.clientWidth - 2 * pad;
    const plotH = canvas.clientHeight - 2 * pad;

    const xMin = (xRange[0] + pan.x) / zoom;
    const xMax = (xRange[1] + pan.x) / zoom;
    const yMin = (yRange[0] + pan.y) / zoom;
    const yMax = (yRange[1] + pan.y) / zoom;

    const mathX = xMin + ((px - pad) / plotW) * (xMax - xMin);
    const mathY = yMin + ((canvas.clientHeight - pad - py) / plotH) * (yMax - yMin);
    setHoverCoord({ x: mathX, y: mathY });

    if (isDragging) {
      const dx = (e.clientX - dragStart.x) * 0.02;
      const dy = (e.clientY - dragStart.y) * 0.02;
      setPan((p) => ({ x: p.x - dx, y: p.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className={`relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoverCoord(null);
        }}
      />

      {/* Control Buttons */}
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 backdrop-blur-md">
        <button
          onClick={() => setZoom((z) => Math.min(5, z * 1.25))}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
          title={isZh ? '放大' : 'Zoom in'}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.2, z / 1.25))}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
          title={isZh ? '缩小' : 'Zoom out'}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={resetView}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
          title={isZh ? '重置视角' : 'Reset View'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hover Coordinates Tooltip */}
      {hoverCoord && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-cyan-300 backdrop-blur-md">
          <Crosshair className="w-3 h-3 text-slate-400" />
          <span>
            x: {hoverCoord.x.toFixed(3)}, y: {hoverCoord.y.toFixed(3)}
          </span>
        </div>
      )}
    </div>
  );
}
