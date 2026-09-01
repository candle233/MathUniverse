'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MathNode } from '@/types/math';
import { initialMathNodes } from '@/data/seedData';
import { disciplines } from '@/data/disciplines';
import { getNodeTypeMeta, getVerificationMeta } from '@/lib/utils';
import { getNodeTitle, getDisciplineName } from '@/lib/i18nHelper';
import { useLanguage } from '@/context/LanguageContext';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ZoomIn, ZoomOut, RefreshCw, Layers, ShieldCheck, Sparkles, Filter, Move, Eye, Zap, Cpu } from 'lucide-react';

interface StarNode {
  id: string;
  node: MathNode;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function KnowledgeStarChart({ selectedNodeId }: { selectedNodeId?: string }) {
  const router = useRouter();
  const { locale, isZh, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedNode, setSelectedNode] = useState<MathNode | null>(() => {
    return initialMathNodes.find((n) => n.id === selectedNodeId) || initialMathNodes[0];
  });
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [graphViewMode, setGraphViewMode] = useState<'ALL' | 'PREREQUISITE_DAG' | 'SEMANTIC_GRAPH'>('ALL');
  const [hoveredNode, setHoveredNode] = useState<MathNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Stream Loading & Performance Mode
  const [cullingEnabled, setCullingEnabled] = useState(true);
  const [renderedCount, setRenderedCount] = useState(initialMathNodes.length);

  // Dragging & Panning state
  const [draggedStarId, setDraggedStarId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Canvas dimensions state
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 900, height: 540 });

  // Compute upstream prerequisites and downstream dependents for highlighting
  const highlightedSet = useMemo(() => {
    if (!selectedNode) return { ancestors: new Set<string>(), descendants: new Set<string>() };

    // BFS ancestors
    const ancestors = new Set<string>();
    const queue = [...selectedNode.dependencies];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (!ancestors.has(curr)) {
        ancestors.add(curr);
        const match = initialMathNodes.find((n) => n.id === curr);
        if (match) queue.push(...match.dependencies);
      }
    }

    // BFS descendants
    const descendants = new Set<string>();
    const descQueue = [...selectedNode.dependents];
    while (descQueue.length > 0) {
      const curr = descQueue.shift()!;
      if (!descendants.has(curr)) {
        descendants.add(curr);
        const match = initialMathNodes.find((n) => n.id === curr);
        if (match) descQueue.push(...match.dependents);
      }
    }

    return { ancestors, descendants };
  }, [selectedNode]);

  // Simulation positions
  const simulationRef = useRef<StarNode[]>([]);
  // Track last rendered count so the 60fps render loop only touches React state on actual change
  const lastRenderedCountRef = useRef(0);

  // Automatically update canvas size on container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setCanvasDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Initialize node layout centered in canvas space
  useEffect(() => {
    const centerX = canvasDimensions.width / 2;
    const centerY = canvasDimensions.height / 2;

    const nodes: StarNode[] = initialMathNodes.map((n, i) => {
      const angle = (i / initialMathNodes.length) * 2 * Math.PI;
      const dist = 160 + (i % 4) * 55;
      return {
        id: n.id,
        node: n,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: n.nodeType === 'THEOREM' ? 18 : n.nodeType === 'AXIOM' ? 22 : 15,
      };
    });

    simulationRef.current = nodes;
  }, [canvasDimensions.width, canvasDimensions.height]);

  // Exact screen to world coordinate transform
  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / (rect.width || 1);
      const scaleY = canvas.height / (rect.height || 1);

      const canvasX = (screenX - rect.left) * scaleX;
      const canvasY = (screenY - rect.top) * scaleY;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const worldX = (canvasX - (offset.x + centerX)) / zoom + centerX;
      const worldY = (canvasY - (offset.y + centerY)) / zoom + centerY;
      return { x: worldX, y: worldY };
    },
    [offset, zoom]
  );

  // Find node under world coordinates
  const findNodeAtWorld = useCallback(
    (worldX: number, worldY: number) => {
      const hitTolerance = Math.max(8, 14 / zoom);
      return simulationRef.current.find((star) => {
        const dx = star.x - worldX;
        const dy = star.y - worldY;
        return Math.sqrt(dx * dx + dy * dy) <= star.radius + hitTolerance;
      });
    },
    [zoom]
  );

  // Canvas render loop with Frustum Culling & Level of Detail (LOD)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // Transform coordinate system
      ctx.translate(offset.x + centerX, offset.y + centerY);
      ctx.scale(zoom, zoom);
      ctx.translate(-centerX, -centerY);

      const allNodes = simulationRef.current;

      // 1. Calculate Viewport Bounding Box in World Coordinates (with padding margin)
      const margin = 90; // Padding to smoothly stream in entering stars
      const worldMinX = (- (offset.x + centerX)) / zoom + centerX - margin;
      const worldMaxX = (width - (offset.x + centerX)) / zoom + centerX + margin;
      const worldMinY = (- (offset.y + centerY)) / zoom + centerY - margin;
      const worldMaxY = (height - (offset.y + centerY)) / zoom + centerY + margin;

      // 2. Filter visible stars based on Viewport Frustum Culling
      const visibleStars = allNodes.filter((star) => {
        if (selectedDiscipline !== 'all' && star.node.disciplineId !== selectedDiscipline) {
          return false;
        }
        if (!cullingEnabled) return true; // Full view mode
        // Always include selected star, or check bounding box intersection
        if (selectedNode?.id === star.id) return true;
        return (
          star.x >= worldMinX - star.radius &&
          star.x <= worldMaxX + star.radius &&
          star.y >= worldMinY - star.radius &&
          star.y <= worldMaxY + star.radius
        );
      });

      if (lastRenderedCountRef.current !== visibleStars.length) {
        lastRenderedCountRef.current = visibleStars.length;
        setRenderedCount(visibleStars.length);
      }
      const visibleIdSet = new Set(visibleStars.map((s) => s.id));

      // 3. Draw Links (Dual-Graph: Prerequisite DAG + Semantic Multi-Graph)
      visibleStars.forEach((sourceStar) => {
        // 3A. Prerequisite DAG Edges (Solid cyan/slate arrows)
        if (graphViewMode === 'ALL' || graphViewMode === 'PREREQUISITE_DAG') {
          sourceStar.node.dependencies.forEach((targetId) => {
            const targetStar = allNodes.find((n) => n.id === targetId);
            if (!targetStar) return;

            // Only render edge if at least one endpoint is in viewport
            if (!visibleIdSet.has(sourceStar.id) && !visibleIdSet.has(targetStar.id)) return;

            const isUpstream =
              highlightedSet.ancestors.has(targetId) &&
              (selectedNode?.id === sourceStar.id || highlightedSet.ancestors.has(sourceStar.id));
            const isSelectedEdge = selectedNode?.id === sourceStar.id || selectedNode?.id === targetId;

            ctx.beginPath();
            ctx.moveTo(sourceStar.x, sourceStar.y);
            ctx.lineTo(targetStar.x, targetStar.y);

            if (isSelectedEdge || isUpstream) {
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 2.5;
              ctx.setLineDash([]);
            } else {
              ctx.strokeStyle = 'rgba(51, 65, 85, 0.45)';
              ctx.lineWidth = 1;
              ctx.setLineDash([4, 4]);
            }
            ctx.stroke();

            // Draw directional arrow on edge
            const midX = (sourceStar.x + targetStar.x) / 2;
            const midY = (sourceStar.y + targetStar.y) / 2;
            const angle = Math.atan2(targetStar.y - sourceStar.y, targetStar.x - sourceStar.x);

            ctx.save();
            ctx.translate(midX, midY);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-6, -3);
            ctx.lineTo(-6, 3);
            ctx.closePath();
            ctx.fillStyle = isSelectedEdge || isUpstream ? '#38bdf8' : 'rgba(100, 116, 139, 0.6)';
            ctx.fill();
            ctx.restore();
          });
        }

        // 3B. Semantic Multi-Graph Edges (Neon violet / emerald glowing dashed lines)
        if (graphViewMode === 'ALL' || graphViewMode === 'SEMANTIC_GRAPH') {
          (sourceStar.node.semanticEdges || []).forEach((edge) => {
            const targetStar = allNodes.find((n) => n.id === edge.toNodeId);
            if (!targetStar) return;

            if (!visibleIdSet.has(sourceStar.id) && !visibleIdSet.has(targetStar.id)) return;

            const isSelectedEdge = selectedNode?.id === sourceStar.id || selectedNode?.id === targetStar.id;

            let strokeColor = 'rgba(192, 132, 252, 0.4)'; // violet default
            if (edge.relationType === 'EQUIVALENT_TO') strokeColor = 'rgba(56, 189, 248, 0.6)';
            else if (edge.relationType === 'GENERALIZES') strokeColor = 'rgba(52, 211, 153, 0.6)';
            else if (edge.relationType === 'SPECIALIZES') strokeColor = 'rgba(251, 191, 36, 0.6)';
            else if (edge.relationType === 'MOTIVATES') strokeColor = 'rgba(244, 114, 182, 0.6)';

            ctx.beginPath();
            // Quadratic curve offset for semantic multi-edges
            const midX = (sourceStar.x + targetStar.x) / 2;
            const midY = (sourceStar.y + targetStar.y) / 2;
            const dx = targetStar.x - sourceStar.x;
            const dy = targetStar.y - sourceStar.y;
            const norm = Math.hypot(dx, dy) || 1;
            const ctrlX = midX - (dy / norm) * 25;
            const ctrlY = midY + (dx / norm) * 25;

            ctx.moveTo(sourceStar.x, sourceStar.y);
            ctx.quadraticCurveTo(ctrlX, ctrlY, targetStar.x, targetStar.y);

            ctx.strokeStyle = isSelectedEdge ? '#c084fc' : strokeColor;
            ctx.lineWidth = isSelectedEdge ? 2.5 : 1.5;
            ctx.setLineDash([6, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw diamond / relation badge on semantic edge center
            if (!isLowLOD && (isSelectedEdge || zoom > 0.8)) {
              ctx.save();
              ctx.fillStyle = isSelectedEdge ? '#c084fc' : '#1e1b4b';
              ctx.strokeStyle = '#c084fc';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(ctrlX, ctrlY, 3.5, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
              ctx.restore();
            }
          });
        }
      });

      // 4. Draw Visible Star Nodes (with Level of Detail optimization)
      const isLowLOD = zoom < 0.55;

      visibleStars.forEach((star) => {
        const isSelected = selectedNode?.id === star.id;
        const isHovered = hoveredNode?.id === star.id;
        const isAncestor = highlightedSet.ancestors.has(star.id);
        const isDescendant = highlightedSet.descendants.has(star.id);

        // High LOD: Outer radial glow
        if (!isLowLOD && (isSelected || isHovered || isAncestor || isDescendant)) {
          const glowGrad = ctx.createRadialGradient(
            star.x,
            star.y,
            star.radius * 0.5,
            star.x,
            star.y,
            star.radius * 2.2
          );
          if (isSelected) {
            glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
            glowGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
          } else if (isAncestor) {
            glowGrad.addColorStop(0, 'rgba(192, 132, 252, 0.5)');
            glowGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');
          } else if (isDescendant) {
            glowGrad.addColorStop(0, 'rgba(52, 211, 153, 0.5)');
            glowGrad.addColorStop(1, 'rgba(52, 211, 153, 0)');
          } else {
            glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          }
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.2, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Node Circle Body
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);

        let fillColor = '#1e293b';
        if (star.node.nodeType === 'AXIOM') fillColor = '#d97706'; // amber
        if (star.node.nodeType === 'THEOREM') fillColor = '#0284c7'; // sky
        if (star.node.nodeType === 'LEMMA') fillColor = '#7c3aed'; // violet
        if (star.node.nodeType === 'DEFINITION') fillColor = '#059669'; // emerald
        if (star.node.nodeType === 'CONJECTURE') fillColor = '#e11d48'; // rose

        ctx.fillStyle = fillColor;
        ctx.fill();

        // Border stroke
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2.5 : 1.5;
        ctx.strokeStyle = isSelected
          ? '#38bdf8'
          : isHovered
          ? '#ffffff'
          : isAncestor
          ? '#c084fc'
          : isDescendant
          ? '#34d399'
          : 'rgba(255, 255, 255, 0.3)';
        ctx.stroke();

        // Node label & title (skip detailed title when zoomed very far out to maximize FPS)
        if (!isLowLOD) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const labelAbbr = isZh
            ? star.node.nodeType === 'AXIOM'
              ? '公理'
              : star.node.nodeType === 'THEOREM'
              ? '定理'
              : star.node.nodeType === 'LEMMA'
              ? '引理'
              : star.node.nodeType === 'DEFINITION'
              ? '定义'
              : '猜想'
            : star.node.nodeType === 'AXIOM'
            ? 'Axiom'
            : star.node.nodeType === 'THEOREM'
            ? 'Thm'
            : star.node.nodeType === 'LEMMA'
            ? 'Lem'
            : star.node.nodeType === 'DEFINITION'
            ? 'Def'
            : 'Conj';
          ctx.fillText(labelAbbr, star.x, star.y);

          // Title text underneath
          ctx.fillStyle = isSelected ? '#38bdf8' : isHovered ? '#f1f5f9' : '#94a3b8';
          ctx.font = `${isSelected ? 'bold ' : ''}11px sans-serif`;
          ctx.fillText(getNodeTitle(star.node, locale), star.x, star.y + star.radius + 14);
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [offset, zoom, selectedNode, hoveredNode, highlightedSet, selectedDiscipline, graphViewMode, cullingEnabled, isZh, locale]);

  const mouseDownPosRef = useRef({ x: 0, y: 0, time: 0 });

  // Mouse Down: check if clicking a star to drag or background to pan
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseDownPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    const { x, y } = screenToWorld(e.clientX, e.clientY);
    const clicked = findNodeAtWorld(x, y);

    if (clicked) {
      setDraggedStarId(clicked.id);
      setSelectedNode(clicked.node);
    } else {
      setIsPanning(true);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  // Mouse Move: move dragged star, pan canvas, or detect hover
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedStarId) {
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      const star = simulationRef.current.find((s) => s.id === draggedStarId);
      if (star) {
        star.x = x;
        star.y = y;
      }
    } else if (isPanning) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Hover detection with precise world coords
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      const hovered = findNodeAtWorld(x, y);
      setHoveredNode(hovered ? hovered.node : null);
    }
  };

  // Mouse Up: release drag / pan, and navigate if it was a clean click
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const dist = Math.hypot(e.clientX - mouseDownPosRef.current.x, e.clientY - mouseDownPosRef.current.y);
    const duration = Date.now() - mouseDownPosRef.current.time;

    if (draggedStarId && dist < 6 && duration < 400) {
      const star = simulationRef.current.find((s) => s.id === draggedStarId);
      if (star) {
        router.push(`/node/${star.node.slug}`);
      }
    }

    setDraggedStarId(null);
    setIsPanning(false);
  };

  // Mouse Wheel: zoom in / out around center
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    setZoom((z) => Math.min(3.5, Math.max(0.25, z * zoomFactor)));
  };

  // Touch handlers for mobile / iPad support
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      mouseDownPosRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      const { x, y } = screenToWorld(touch.clientX, touch.clientY);
      const clicked = findNodeAtWorld(x, y);

      if (clicked) {
        setDraggedStarId(clicked.id);
        setSelectedNode(clicked.node);
      } else {
        setIsPanning(true);
        lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (draggedStarId) {
        const { x, y } = screenToWorld(touch.clientX, touch.clientY);
        const star = simulationRef.current.find((s) => s.id === draggedStarId);
        if (star) {
          star.x = x;
          star.y = y;
        }
      } else if (isPanning) {
        const dx = touch.clientX - lastMousePosRef.current.x;
        const dy = touch.clientY - lastMousePosRef.current.y;
        setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const dist = Math.hypot(touch.clientX - mouseDownPosRef.current.x, touch.clientY - mouseDownPosRef.current.y);
      const duration = Date.now() - mouseDownPosRef.current.time;

      if (draggedStarId && dist < 8 && duration < 450) {
        const star = simulationRef.current.find((s) => s.id === draggedStarId);
        if (star) {
          router.push(`/node/${star.node.slug}`);
        }
      }
    }
    setDraggedStarId(null);
    setIsPanning(false);
  };

  // Double click node to directly navigate to its dedicated page
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = screenToWorld(e.clientX, e.clientY);
    const clicked = findNodeAtWorld(x, y);
    if (clicked) {
      router.push(`/node/${clicked.node.slug}`);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl relative flex flex-col min-h-[640px]">
      {/* Top Filter & HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-900/90 border-b border-slate-800 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm">{isZh ? '全学科数学知识星空图谱 (Knowledge Cosmos DAG)' : 'Knowledge Cosmos DAG (All-Discipline Math)'}</h3>
              {/* Live Streaming Culling Indicator */}
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>{isZh ? `视口流式加载: ${renderedCount} / ${initialMathNodes.length} 星宿` : `Viewport streaming: ${renderedCount} / ${initialMathNodes.length} stars`}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{isZh ? '支持拖拽星宿节点、平移画布与滚轮缩放，点击追踪严格前置推导' : 'Drag stars, pan the canvas, and scroll to zoom — click a node to trace its prerequisites'}</p>
          </div>
        </div>

        {/* Discipline Filter Buttons — single horizontal scroll row on mobile
            (mirrors the 3D view's Nebula Cruise row), wrapped from sm up */}
        <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto pb-1 sm:flex-wrap">
          <button
            onClick={() => setSelectedDiscipline('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedDiscipline === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('graph.allDisciplines')}
          </button>
          {disciplines.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDiscipline(d.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedDiscipline === d.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {getDisciplineName(d, locale)}
            </button>
          ))}
        </div>

        {/* Graph Mode Switcher & Streaming Mode & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dual Graph Mode Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setGraphViewMode('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                graphViewMode === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isZh ? '双图全貌 (Dual)' : 'Dual Graph'}
            </button>
            <button
              onClick={() => setGraphViewMode('PREREQUISITE_DAG')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                graphViewMode === 'PREREQUISITE_DAG'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isZh ? '推导 DAG' : 'Prereq DAG'}
            </button>
            <button
              onClick={() => setGraphViewMode('SEMANTIC_GRAPH')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                graphViewMode === 'SEMANTIC_GRAPH'
                  ? 'bg-purple-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isZh ? '语义关联网' : 'Semantic'}
            </button>
          </div>

          <button
            onClick={() => setCullingEnabled(!cullingEnabled)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 cursor-pointer ${
              cullingEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title={
              cullingEnabled
                ? isZh
                  ? '已开启视口动态流式加载 (极速流畅)'
                  : 'Viewport streaming enabled (fast & smooth)'
                : isZh
                ? '已开启全量加载模式'
                : 'Full-load mode enabled (all stars rendered)'
            }
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{cullingEnabled ? t('graph.streamLoading') : t('graph.fullMode')}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setZoom((z) => Math.min(3.5, z * 1.2))}
              className="p-2 min-h-[36px] min-w-[36px] hover:bg-slate-700 rounded text-slate-300 transition-colors cursor-pointer"
              title={t('graph.zoomIn')}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.25, z * 0.8))}
              className="p-2 min-h-[36px] min-w-[36px] hover:bg-slate-700 rounded text-slate-300 transition-colors cursor-pointer"
              title={t('graph.zoomOut')}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
              className="p-2 min-h-[36px] min-w-[36px] hover:bg-slate-700 rounded text-slate-300 transition-colors cursor-pointer"
              title={isZh ? '重置视图' : 'Reset View'}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        className={`relative flex-1 w-full h-[540px] bg-slate-950 math-grid-pattern overflow-hidden ${
          draggedStarId
            ? 'cursor-grabbing'
            : isPanning
            ? 'cursor-grabbing'
            : hoveredNode
            ? 'cursor-pointer'
            : 'cursor-grab'
        }`}
      >
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full block"
        />

        {/* Legend Overlay */}
        <div className="absolute top-4 left-4 p-3 rounded-xl glass-panel text-xs text-slate-300 space-y-1.5 pointer-events-none">
          <div className="font-semibold text-slate-200 text-[11px] mb-1 flex items-center gap-1">
            <Move className="w-3 h-3 text-cyan-400" />
            <span>{isZh ? '拖拽平移 / 双图视口' : 'Drag to Pan / Dual-Graph'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block"></span>
            <span>{isZh ? '当前选中节点 (双击直达页面)' : 'Selected node (double-click to open page)'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-400 inline-block"></span>
            <span>{isZh ? '前置依赖祖先 (Prerequisites)' : 'Prerequisite ancestors (upstream)'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
            <span>{isZh ? '下游推论后继 (Dependents)' : 'Downstream dependents (successors)'}</span>
          </div>
          <div className="pt-1 border-t border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400">
            <span className="w-3 h-0.5 bg-sky-400 inline-block"></span>
            <span>{isZh ? '实线箭头: 逻辑推导 DAG' : 'Solid: Prereq DAG Edge'}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="w-3 h-0.5 border-b border-purple-400 border-dashed inline-block"></span>
            <span>{isZh ? '虚线弧线: 语义关联网 (等价/推广)' : 'Dashed: Semantic Multi-Graph Edge'}</span>
          </div>
        </div>

        {/* Selected Node Details Floating Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] overflow-y-auto p-4 rounded-2xl glass-panel-glow border border-cyan-500/40 text-left shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200 z-20 pointer-events-auto">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                  getNodeTypeMeta(selectedNode.nodeType, locale).color
                }`}
              >
                {getNodeTypeMeta(selectedNode.nodeType, locale).label}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">MSC {selectedNode.mscCode}</span>
            </div>

            <h4 className="font-bold text-slate-100 text-base mb-1">{getNodeTitle(selectedNode, locale)}</h4>
            {locale === 'zh' && (
              <p className="text-xs text-slate-400 font-mono mb-3">{selectedNode.titleEn}</p>
            )}

            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-cyan-200 font-mono mb-3 overflow-x-auto">
              <InlineLaTeX formula={selectedNode.statementLatex} />
            </div>

            {/* Verification Status */}
            <div className="flex items-center justify-between text-xs text-slate-300 mb-4 pb-3 border-b border-slate-800">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                {getVerificationMeta(selectedNode.verification, locale).short}
              </span>
              <span className="text-slate-400">
                {isZh
                  ? `${selectedNode.proofs.length} 份证明`
                  : `${selectedNode.proofs.length} ${selectedNode.proofs.length === 1 ? 'proof' : 'proofs'}`}
              </span>
            </div>

            {/* Prerequisites & Dependents counts */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isZh ? '前置依赖' : 'Prerequisites'}</span>
                <span className="font-bold text-purple-300">
                  {isZh
                    ? `${selectedNode.dependencies.length} 个定理`
                    : `${selectedNode.dependencies.length} ${selectedNode.dependencies.length === 1 ? 'theorem' : 'theorems'}`}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isZh ? '下游应用' : 'Applications'}</span>
                <span className="font-bold text-emerald-300">
                  {isZh
                    ? `${selectedNode.dependents.length} 个推论`
                    : `${selectedNode.dependents.length} ${selectedNode.dependents.length === 1 ? 'corollary' : 'corollaries'}`}
                </span>
              </div>
            </div>

            {/* Semantic Relations List */}
            {selectedNode.semanticEdges && selectedNode.semanticEdges.length > 0 && (
              <div className="mb-4 p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1.5">
                <span className="text-[11px] font-bold text-purple-300 block">
                  {isZh ? '语义关联 (Semantic Relations):' : 'Semantic Relations:'}
                </span>
                <div className="space-y-1">
                  {selectedNode.semanticEdges.map((edge) => {
                    const target = initialMathNodes.find((n) => n.id === edge.toNodeId);
                    return (
                      <div
                        key={edge.id}
                        onClick={() => {
                          if (target) setSelectedNode(target);
                        }}
                        className="flex items-center justify-between p-1.5 rounded bg-slate-900/80 hover:bg-purple-900/40 border border-slate-800 text-[11px] cursor-pointer transition-colors"
                      >
                        <span className="text-purple-300 font-medium truncate mr-1">
                          {target ? getNodeTitle(target, locale) : edge.toNodeId}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-200 font-mono shrink-0">
                          {edge.relationType}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action CTA Link */}
            <Link
              href={`/node/${selectedNode.slug}`}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-colors cursor-pointer"
            >
              <span>{isZh ? '查看严谨形式化证明' : 'View Rigorous Formal Proofs'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
