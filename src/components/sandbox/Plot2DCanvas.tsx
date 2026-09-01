'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlotDataPayload } from '../../types/sandbox';
import { useLanguage } from '@/context/LanguageContext';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crosshair,
  Maximize2,
  Minimize2,
  Download,
  Grid,
  BarChart3,
} from 'lucide-react';

interface Plot2DCanvasProps {
  payload?: PlotDataPayload;
  width?: number;
  height?: number;
  className?: string;
  allowFullscreen?: boolean;
}

export default function Plot2DCanvas({
  payload,
  width = 600,
  height = 360,
  className = '',
  allowFullscreen = true,
}: Plot2DCanvasProps) {
  const { isZh } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width,
    height,
  });

  const resetView = useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  }, []);

  // Update container size on resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerSize({
            width: Math.max(200, Math.floor(entry.contentRect.width)),
            height: Math.max(160, Math.floor(entry.contentRect.height || height)),
          });
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [height]);

  // Keyboard shortcut handler for Fullscreen (Esc to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === '+' || e.key === '=') {
        if (isFullscreen) setZoom((z) => Math.min(10, z * 1.2));
      } else if (e.key === '-' || e.key === '_') {
        if (isFullscreen) setZoom((z) => Math.max(0.1, z / 1.2));
      } else if (e.key === '0' && isFullscreen) {
        resetView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, resetView]);

  // Unified Draw Function
  const renderToCanvas = useCallback(
    (canvas: HTMLCanvasElement | null, w: number, h: number) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform before scaling
      ctx.scale(dpr, dpr);

      // 1. Clear background
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 30, w / 2, h / 2, w / 1.1);
      bgGrad.addColorStop(0, '#060d1d');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      if (!payload) {
        ctx.fillStyle = '#475569';
        ctx.font = '13px monospace';
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

      const padLeft = 45;
      const padRight = 30;
      const padTop = 35;
      const padBottom = 35;
      const plotW = w - padLeft - padRight;
      const plotH = h - padTop - padBottom;

      const toScreenX = (x: number) => padLeft + ((x - xMin) / (xMax - xMin || 1)) * plotW;
      const toScreenY = (y: number) => h - padBottom - ((y - yMin) / (yMax - yMin || 1)) * plotH;

      // 2. Draw Grid & Coordinate Ticks
      if (showGrid) {
        const xSpan = xMax - xMin || 1;
        const ySpan = yMax - yMin || 1;
        const xStep = Math.pow(10, Math.floor(Math.log10(xSpan / 6))) || 1;
        const yStep = Math.pow(10, Math.floor(Math.log10(ySpan / 6))) || 1;

        ctx.font = '11px monospace';
        ctx.fillStyle = '#64748b';

        // Vertical grid lines
        const startX = Math.floor(xMin / xStep) * xStep;
        for (let x = startX; x <= xMax + xStep * 0.5; x += xStep) {
          const sx = toScreenX(x);
          if (sx >= padLeft && sx <= w - padRight) {
            ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sx, padTop);
            ctx.lineTo(sx, h - padBottom);
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillText(Number(x.toFixed(3)).toString(), sx, h - padBottom + 16);
          }
        }

        // Horizontal grid lines
        const startY = Math.floor(yMin / yStep) * yStep;
        for (let y = startY; y <= yMax + yStep * 0.5; y += yStep) {
          const sy = toScreenY(y);
          if (sy >= padTop && sy <= h - padBottom) {
            ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padLeft, sy);
            ctx.lineTo(w - padRight, sy);
            ctx.stroke();

            ctx.textAlign = 'right';
            ctx.fillText(Number(y.toFixed(3)).toString(), padLeft - 8, sy + 4);
          }
        }
      }

      // 3. Draw Main Axes (x=0, y=0)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.lineWidth = 1.5;
      if (xMin <= 0 && xMax >= 0) {
        const sx0 = toScreenX(0);
        ctx.beginPath();
        ctx.moveTo(sx0, padTop);
        ctx.lineTo(sx0, h - padBottom);
        ctx.stroke();
      }
      if (yMin <= 0 && yMax >= 0) {
        const sy0 = toScreenY(0);
        ctx.beginPath();
        ctx.moveTo(padLeft, sy0);
        ctx.lineTo(w - padRight, sy0);
        ctx.stroke();
      }

      // 4. Render Riemann Sum Rectangles
      if (payload.riemannRects && payload.riemannRects.length > 0) {
        payload.riemannRects.forEach((rect) => {
          const rx = toScreenX(rect.x);
          const rw = toScreenX(rect.x + rect.width) - rx;
          const ry0 = toScreenY(0);
          const ryH = toScreenY(rect.height);
          const top = Math.min(ry0, ryH);
          const rh = Math.abs(ryH - ry0);

          ctx.fillStyle = rect.isPositive ? 'rgba(6, 182, 212, 0.28)' : 'rgba(244, 63, 94, 0.28)';
          ctx.strokeStyle = rect.isPositive ? '#06b6d4' : '#f43f5e';
          ctx.lineWidth = 1.2;
          ctx.fillRect(rx, top, rw, rh);
          ctx.strokeRect(rx, top, rw, rh);
        });
      }

      // 5. Render Sequence Limits & Epsilon Bands
      if (payload.sequenceLimit) {
        const { L, N, epsilon, points } = payload.sequenceLimit;
        const syL = toScreenY(L);
        const syUpper = toScreenY(L + epsilon);
        const syLower = toScreenY(L - epsilon);

        // Epsilon Band
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.setLineDash([4, 4]);
        ctx.fillRect(padLeft, syUpper, plotW, syLower - syUpper);
        ctx.strokeRect(padLeft, syUpper, plotW, syLower - syUpper);

        // L Center Line
        ctx.setLineDash([]);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(padLeft, syL);
        ctx.lineTo(w - padRight, syL);
        ctx.stroke();

        // N cutoff line
        if (N > 0) {
          const sxN = toScreenX(N);
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(sxN, padTop);
          ctx.lineTo(sxN, h - padBottom);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Scatter points
        points.forEach((pt) => {
          const sx = toScreenX(pt.n);
          const sy = toScreenY(pt.val);
          ctx.fillStyle = pt.isInside ? '#10b981' : '#f43f5e';
          ctx.beginPath();
          ctx.arc(sx, sy, pt.n >= N ? 4 : 2.5, 0, 2 * Math.PI);
          ctx.fill();
        });
      }

      // 6. Render Vector Field Quiver Arrows & Streamlines
      if (payload.vectorField && payload.vectorField.grid) {
        const maxArrowLen = 16;
        payload.vectorField.grid.forEach((arrow) => {
          const sx = toScreenX(arrow.x);
          const sy = toScreenY(arrow.y);
          if (sx < padLeft || sx > w - padRight || sy < padTop || sy > h - padBottom) return;

          const angle = -arrow.angle; // Canvas Y axis inverted
          const len = Math.min(maxArrowLen, Math.max(5, arrow.magnitude * 4.5));

          ctx.strokeStyle = 'rgba(168, 85, 247, 0.75)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          const ex = sx + len * Math.cos(angle);
          const ey = sy + len * Math.sin(angle);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          // Arrowhead
          ctx.fillStyle = 'rgba(192, 132, 252, 0.9)';
          ctx.beginPath();
          ctx.arc(ex, ey, 1.8, 0, 2 * Math.PI);
          ctx.fill();
        });
      }

      // 7. Render 2D Curves
      if (payload.curves && payload.curves.length > 0) {
        payload.curves.forEach((curve) => {
          if (!curve.points || curve.points.length < 2) return;
          ctx.strokeStyle = curve.color || '#38bdf8';
          ctx.lineWidth = (curve.strokeWidth || 2) * (w > 800 ? 1.3 : 1);
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

      // 8. Title Banner
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        payload.title || (isZh ? '2D 函数与动力系统交互图' : '2D Function & Phase Canvas'),
        padLeft,
        padTop - 12
      );
    },
    [payload, zoom, pan, showGrid, isZh]
  );

  // Render normal canvas
  useEffect(() => {
    if (!isFullscreen && canvasRef.current) {
      renderToCanvas(canvasRef.current, containerSize.width, containerSize.height);
    }
  }, [isFullscreen, renderToCanvas, containerSize]);

  // Render fullscreen canvas
  useEffect(() => {
    if (isFullscreen && fullscreenCanvasRef.current) {
      const modalW = window.innerWidth * 0.94;
      const modalH = window.innerHeight * 0.78;
      renderToCanvas(fullscreenCanvasRef.current, modalW, modalH);
    }
  }, [isFullscreen, renderToCanvas, zoom, pan, showGrid]);

  // Mouse Wheel Zoom centered at cursor
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    const nextZoom = Math.max(0.1, Math.min(12, zoom * zoomFactor));

    const xRange = payload?.xRange || [-5, 5];
    const yRange = payload?.yRange || [-3, 3];
    const pad = 40;
    const plotW = canvas.clientWidth - 2 * pad;
    const plotH = canvas.clientHeight - 2 * pad;

    const xSpan = (xRange[1] - xRange[0]) / zoom;
    const ySpan = (yRange[1] - yRange[0]) / zoom;

    const mathX = (xRange[0] + pan.x) / zoom + ((px - pad) / plotW) * xSpan;
    const mathY = (yRange[0] + pan.y) / zoom + ((canvas.clientHeight - pad - py) / plotH) * ySpan;

    // Shift pan so mathX, mathY remains under cursor
    const newPanX = mathX * nextZoom - (px / canvas.clientWidth) * (xRange[1] - xRange[0]);
    const newPanY = mathY * nextZoom - ((canvas.clientHeight - py) / canvas.clientHeight) * (yRange[1] - yRange[0]);

    setZoom(nextZoom);
    setPan({ x: newPanX * 0.1 + pan.x * 0.9, y: newPanY * 0.1 + pan.y * 0.9 });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const xRange = payload?.xRange || [-5, 5];
    const yRange = payload?.yRange || [-3, 3];
    const pad = 40;
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
      const dx = (e.clientX - dragStart.x) * (0.02 / zoom);
      const dy = (e.clientY - dragStart.y) * (0.02 / zoom);
      setPan((p) => ({ x: p.x - dx * 2, y: p.y + dy * 2 }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Snapshot PNG Download
  const handleDownloadSnapshot = () => {
    const activeCanvas = isFullscreen ? fullscreenCanvasRef.current : canvasRef.current;
    if (!activeCanvas) return;
    const url = activeCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `mathuniverse_plot2d_${Date.now()}.png`;
    a.click();
  };

  return (
    <>
      {/* Normal Embedded Canvas Container */}
      <div
        ref={containerRef}
        style={{ height }}
        className={`relative w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner group ${className}`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onDoubleClick={resetView}
          onMouseLeave={() => {
            setIsDragging(false);
            setHoverCoord(null);
          }}
        />

        {/* Toolbar Controls */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 backdrop-blur-md shadow-lg transition-opacity">
          <button
            onClick={() => setZoom((z) => Math.min(10, z * 1.25))}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            title={isZh ? '放大 (+)' : 'Zoom In (+)'}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.1, z / 1.25))}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            title={isZh ? '缩小 (-)' : 'Zoom Out (-)'}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            title={isZh ? '重置视角 (0)' : 'Reset View (0)'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDownloadSnapshot}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            title={isZh ? '导出高清 PNG 图片' : 'Export PNG Snapshot'}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          {allowFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all font-bold cursor-pointer"
              title={isZh ? '全屏放大图像 (展开至全高清大窗口)' : 'Expand to Fullscreen Modal'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Hover Coordinates Indicator */}
        {hoverCoord && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-cyan-300 backdrop-blur-md shadow-md">
            <Crosshair className="w-3 h-3 text-cyan-400" />
            <span>
              x: {hoverCoord.x.toFixed(3)}, y: {hoverCoord.y.toFixed(3)}
            </span>
          </div>
        )}

        {/* Scale ratio badge */}
        <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800/80 pointer-events-none">
          {((zoom || 1) * 100).toFixed(0)}% · {isZh ? '滚轮缩放 / 拖拽平移' : 'Scroll to zoom / Drag'}
        </div>
      </div>

      {/* Fullscreen Magnification Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/10">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-base">
                  {payload?.title || (isZh ? '2D 数学函数与几何动力系统高清全屏视图' : '2D Math Function & Geometry Fullscreen View')}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {isZh
                    ? `实时视口缩放: ${(zoom * 100).toFixed(0)}% · 支持鼠标滚轮以指针为中心平滑缩放、双击重置`
                    : `Viewport Zoom: ${(zoom * 100).toFixed(0)}% · Mouse wheel zoom centered at cursor, double click to reset`}
                </p>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowGrid((g) => !g)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  showGrid
                    ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>{isZh ? '网格' : 'Grid'}</span>
              </button>

              <button
                onClick={() => setZoom((z) => Math.min(12, z * 1.25))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{isZh ? '放大' : 'Zoom In'}</span>
              </button>

              <button
                onClick={() => setZoom((z) => Math.max(0.1, z / 1.25))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>{isZh ? '缩小' : 'Zoom Out'}</span>
              </button>

              <button
                onClick={resetView}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isZh ? '重置视角 (0)' : 'Reset'}</span>
              </button>

              <button
                onClick={handleDownloadSnapshot}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isZh ? '导出 PNG 高清图' : 'Export PNG'}</span>
              </button>

              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>{isZh ? '退出全屏 (ESC)' : 'Exit (ESC)'}</span>
              </button>
            </div>
          </div>

          {/* Modal Main Viewport */}
          <div className="flex-1 w-full relative my-4 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center">
            <canvas
              ref={fullscreenCanvasRef}
              className="w-full h-full block cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
              onDoubleClick={resetView}
              onMouseLeave={() => {
                setIsDragging(false);
                setHoverCoord(null);
              }}
            />

            {/* Coordinates Floating Badge */}
            {hoverCoord && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/90 border border-cyan-500/50 text-xs font-mono text-cyan-200 backdrop-blur-md shadow-2xl">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span>
                  x = {hoverCoord.x.toFixed(4)}, y = {hoverCoord.y.toFixed(4)}
                </span>
              </div>
            )}

            {/* Legend Box */}
            {payload?.curves && payload.curves.length > 0 && (
              <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 backdrop-blur-md text-xs font-mono">
                {payload.curves.map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <span
                      className="w-3 h-1.5 rounded-full inline-block"
                      style={{ backgroundColor: c.color || '#38bdf8' }}
                    />
                    <span className="text-slate-300">{c.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer Tips */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-slate-800/80">
            <span>{isZh ? '💡 快捷键提示: [滚轮] 放大/缩小 · [拖拽] 平移画面 · [双击 / 0] 恢复原点 · [ESC] 退出' : '💡 Tips: [Scroll] Zoom in/out · [Drag] Pan · [Double Click / 0] Reset · [ESC] Exit'}</span>
            <span className="text-cyan-400 font-bold">{isZh ? '高清原生物理分辨率' : 'Native High-DPI Canvas'}</span>
          </div>
        </div>
      )}
    </>
  );
}
