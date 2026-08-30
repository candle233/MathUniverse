'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { initialMathNodes } from '@/data/seedData';
import { MathNode } from '@/types/math';
import {
  computeMinimumPrerequisiteClosure,
  compute3DCosmosLayout,
  computeTransitiveReduction,
  COSMIC_NEBULAE,
  mapDisciplineToNebula,
  getOrbitalShell,
  CosmicNode3D,
  PrerequisiteClosureResult,
  BottleneckInfo,
} from '@/lib/prerequisiteClosure';
import { getNodeTypeMeta, getVerificationMeta, getBottleneckReasonEn, getBottleneckBadgeEn } from '@/lib/utils';
import { InlineLaTeX } from '@/components/math/LaTeXRenderer';
import { useLanguage } from '@/context/LanguageContext';
import { getNodeTitle } from '@/lib/i18nHelper';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  RotateCw,
  Eye,
  Layers,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Move,
  Zap,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Orbit,
  BookOpen,
  Filter,
  Navigation,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface NebulaDustParticle {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  orbitAngle: number;
  orbitSpeed: number;
  orbitRadius: number;
  nebulaId: string;
}

interface StarfieldParticle {
  x: number;
  y: number;
  z: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
}

export default function Cosmos3DGraph() {
  const router = useRouter();
  const { locale, isZh, t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Core selection state
  const [selectedTargetId, setSelectedTargetId] = useState<string>('thm-stokes');
  const [knownNodeIds, setKnownNodeIds] = useState<string[]>(['def-limit-sequence']);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeDiscipline, setActiveDiscipline] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'flow' | 'hasse' | 'full'>('flow');

  // Camera & Interaction state
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(true);
  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  const [showDust, setShowDust] = useState(true);
  const rotationRef = useRef({ x: 0.35, y: 0.45 });
  const zoomRef = useRef(1.15);
  const panOffsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 });

  // Canvas dimensions state
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 1000, height: 580 });

  // Camera flythrough animation target
  const flyAnimationRef = useRef<{
    active: boolean;
    startRot: { x: number; y: number };
    targetRot: { x: number; y: number };
    startZoom: number;
    targetZoom: number;
    startPan: { x: number; y: number };
    targetPan: { x: number; y: number };
    progress: number;
    durationFrames: number;
  } | null>(null);

  // Time ticker for truth particle flow
  const animTimeRef = useRef<number>(0);

  // 1. Compute stable 3D cosmological layout
  const cosmos3DMap = useMemo(() => {
    return compute3DCosmosLayout(initialMathNodes);
  }, []);

  const cosmos3DList = useMemo(() => {
    return Array.from(cosmos3DMap.values());
  }, [cosmos3DMap]);

  // 2. Compute Minimum Prerequisite Closure
  const closureResult: PrerequisiteClosureResult | null = useMemo(() => {
    return computeMinimumPrerequisiteClosure(selectedTargetId, knownNodeIds, initialMathNodes);
  }, [selectedTargetId, knownNodeIds]);

  // 3. Compute Hasse transitive reduction for entire graph
  const fullHasseEdges = useMemo(() => {
    return computeTransitiveReduction(initialMathNodes);
  }, []);

  // 4. Generate Volumetric Nebula Particle Cloud (180 particles around 6 centroids)
  const nebulaDustParticles: NebulaDustParticle[] = useMemo(() => {
    const dust: NebulaDustParticle[] = [];
    Object.values(COSMIC_NEBULAE).forEach((nebula) => {
      for (let i = 0; i < 28; i++) {
        const orbitRadius = 40 + Math.random() * 85;
        const orbitAngle = Math.random() * Math.PI * 2;
        dust.push({
          x: nebula.centroid[0] + (Math.random() - 0.5) * 60,
          y: nebula.centroid[1] + (Math.random() - 0.5) * 60,
          z: nebula.centroid[2] + (Math.random() - 0.5) * 60,
          radius: Math.random() * 22 + 10,
          color: nebula.color,
          alpha: Math.random() * 0.18 + 0.04,
          pulseSpeed: Math.random() * 0.03 + 0.01,
          orbitAngle,
          orbitSpeed: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
          orbitRadius,
          nebulaId: nebula.id,
        });
      }
    });
    return dust;
  }, []);

  // 5. Starfield background particles (200 celestial stars)
  const backgroundStars: StarfieldParticle[] = useMemo(() => {
    const stars: StarfieldParticle[] = [];
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1200,
        y: (Math.random() - 0.5) * 900,
        z: (Math.random() - 0.5) * 1200,
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.7 + 0.25,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
      });
    }
    return stars;
  }, []);

  // Flythrough Camera Trigger function
  const triggerCameraFlyTo = useCallback((targetRotation: { x: number; y: number }, targetZ: number = 1.2, targetP = { x: 0, y: 0 }) => {
    flyAnimationRef.current = {
      active: true,
      startRot: { ...rotationRef.current },
      targetRot: targetRotation,
      startZoom: zoomRef.current,
      targetZoom: targetZ,
      startPan: { ...panOffsetRef.current },
      targetPan: targetP,
      progress: 0,
      durationFrames: 50,
    };
    setIsRotating(false);
  }, []);

  // Jump camera to specific nebula centroid
  const jumpToNebula = (nebulaId: string) => {
    const nebula = COSMIC_NEBULAE[nebulaId];
    if (!nebula) return;
    setActiveDiscipline(nebulaId);

    // Calculate rotation angle to look at nebula centroid
    const angleY = Math.atan2(-nebula.centroid[0], nebula.centroid[2]) + 0.2;
    const angleX = -Math.atan2(nebula.centroid[1], Math.hypot(nebula.centroid[0], nebula.centroid[2])) * 0.7;

    triggerCameraFlyTo({ x: angleX, y: angleY }, 1.35);
  };

  // Fly to target node
  const flyToNode = (nodeId: string) => {
    const nodePos = cosmos3DMap.get(nodeId);
    if (!nodePos) return;

    setSelectedTargetId(nodeId);
    const angleY = Math.atan2(-nodePos.x, nodePos.z);
    const angleX = -Math.atan2(nodePos.y, Math.hypot(nodePos.x, nodePos.z)) * 0.6;
    triggerCameraFlyTo({ x: angleX, y: angleY }, 1.45);
  };

  // Reset Camera View
  const resetCamera = () => {
    triggerCameraFlyTo({ x: 0.35, y: 0.45 }, 1.15, { x: 0, y: 0 });
    setIsRotating(true);
    setActiveDiscipline('all');
  };

  // Toggle known node
  const toggleKnownNode = (nodeId: string) => {
    setKnownNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

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

  // Main 3D Canvas Perspective Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      animTimeRef.current += 1;
      const time = animTimeRef.current;

      // Handle Camera Flythrough Smoothstep Easing
      if (flyAnimationRef.current && flyAnimationRef.current.active) {
        const fly = flyAnimationRef.current;
        fly.progress += 1 / fly.durationFrames;
        if (fly.progress >= 1) {
          fly.progress = 1;
          fly.active = false;
          rotationRef.current = fly.targetRot;
          zoomRef.current = fly.targetZoom;
          panOffsetRef.current = fly.targetPan;
        } else {
          // Cubic ease-in-out
          const t = fly.progress;
          const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          rotationRef.current = {
            x: fly.startRot.x + (fly.targetRot.x - fly.startRot.x) * ease,
            y: fly.startRot.y + (fly.targetRot.y - fly.startRot.y) * ease,
          };
          zoomRef.current = fly.startZoom + (fly.targetZoom - fly.startZoom) * ease;
          panOffsetRef.current = {
            x: fly.startPan.x + (fly.targetPan.x - fly.startPan.x) * ease,
            y: fly.startPan.y + (fly.targetPan.y - fly.startPan.y) * ease,
          };
        }
      } else if (isRotatingRef.current && !isDraggingRef.current && !isPanningRef.current) {
        // Slow ambient cosmic rotation
        rotationRef.current.x += 0.0008;
        rotationRef.current.y += 0.0022;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2 + panOffsetRef.current.x;
      const cy = canvas.height / 2 + panOffsetRef.current.y;
      const fov = 480;
      const rotation = rotationRef.current;
      const zoom = zoomRef.current;
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);

      // 3D Perspective Projection Function
      const project3D = (x: number, y: number, z: number) => {
        // Yaw (Y rotation)
        const x1 = x * cosY + z * sinY;
        const y1 = y;
        const z1 = -x * sinY + z * cosY;

        // Pitch (X rotation)
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const distance = fov + z2 * zoom;
        const scale = distance > 15 ? (fov / distance) * zoom : 0.1;

        return {
          sx: cx + x2 * scale,
          sy: cy + y2 * scale,
          depth: z2,
          scale,
        };
      };

      // 1. Render Background Celestial Starfield
      backgroundStars.forEach((st, idx) => {
        const p = project3D(st.x, st.y, st.z);
        if (p.depth > -fov && p.scale > 0.05) {
          const twinkle = Math.sin(time * st.twinkleSpeed + idx) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.fillStyle = `rgba(226, 232, 240, ${st.alpha * twinkle * Math.min(1, p.scale * 1.1)})`;
          ctx.arc(p.sx, p.sy, Math.max(0.6, st.radius * p.scale), 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      // 2. Render Volumetric Nebula Dust Clouds
      if (showDust) {
        nebulaDustParticles.forEach((dp, idx) => {
          if (activeDiscipline !== 'all' && dp.nebulaId !== activeDiscipline) return;

          // Orbit particle slightly around its centroid
          const curAngle = dp.orbitAngle + time * dp.orbitSpeed;
          const nebula = COSMIC_NEBULAE[dp.nebulaId];
          const px = nebula.centroid[0] + Math.cos(curAngle) * dp.orbitRadius;
          const py = nebula.centroid[1] + Math.sin(curAngle * 0.7) * (dp.orbitRadius * 0.5);
          const pz = nebula.centroid[2] + Math.sin(curAngle) * dp.orbitRadius;

          const p = project3D(px, py, pz);
          if (p.depth > -fov && p.scale > 0.05) {
            const rad = dp.radius * p.scale;
            if (rad > 1) {
              const pulse = Math.sin(time * dp.pulseSpeed + idx) * 0.25 + 0.75;
              const grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, rad);
              grad.addColorStop(0, `${dp.color}${Math.floor(dp.alpha * pulse * 255).toString(16).padStart(2, '0')}`);
              grad.addColorStop(1, 'transparent');

              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(p.sx, p.sy, rad, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        });
      }

      // 3. Render 6 Cosmic Nebula Center Halos
      Object.entries(COSMIC_NEBULAE).forEach(([key, nebula]) => {
        if (activeDiscipline !== 'all' && key !== activeDiscipline) return;

        const p = project3D(nebula.centroid[0], nebula.centroid[1], nebula.centroid[2]);
        if (p.depth > -fov && p.scale > 0.05) {
          const glowRadius = 95 * p.scale;
          const grad = ctx.createRadialGradient(p.sx, p.sy, 5, p.sx, p.sy, glowRadius);
          grad.addColorStop(0, `${nebula.color}40`);
          grad.addColorStop(0.5, `${nebula.color}15`);
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, glowRadius, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      // 4. Render Edges (Full, Hasse, or Prerequisite Flow)
      const closureActiveIds = new Set([
        ...(closureResult?.allPrerequisiteIds || []),
        selectedTargetId,
      ]);

      const edgesToRender: Array<{ from: string; to: string; isPrereqFlow: boolean }> = [];

      if (viewMode === 'full') {
        initialMathNodes.forEach((n) => {
          n.dependencies.forEach((depId) => {
            const isFlow = closureActiveIds.has(n.id) && closureActiveIds.has(depId);
            edgesToRender.push({ from: n.id, to: depId, isPrereqFlow: isFlow });
          });
        });
      } else if (viewMode === 'hasse') {
        fullHasseEdges.forEach((e) => {
          const isFlow = closureActiveIds.has(e.from) && closureActiveIds.has(e.to);
          edgesToRender.push({ from: e.from, to: e.to, isPrereqFlow: isFlow });
        });
      } else {
        // 'flow' mode: Render minimal Hasse reduction of the active prerequisite closure + subtle background edges
        if (closureResult?.hasseEdges) {
          closureResult.hasseEdges.forEach((e) => {
            edgesToRender.push({ from: e.from, to: e.to, isPrereqFlow: true });
          });
        }
        // Add faint skeleton edges
        fullHasseEdges.forEach((e) => {
          if (!closureActiveIds.has(e.from) || !closureActiveIds.has(e.to)) {
            edgesToRender.push({ from: e.from, to: e.to, isPrereqFlow: false });
          }
        });
      }

      edgesToRender.forEach(({ from, to, isPrereqFlow }) => {
        const sourcePos = cosmos3DMap.get(from);
        const targetPos = cosmos3DMap.get(to);
        if (!sourcePos || !targetPos) return;

        const p1 = project3D(sourcePos.x, sourcePos.y, sourcePos.z);
        const p2 = project3D(targetPos.x, targetPos.y, targetPos.z);

        if (p1.depth <= -fov || p2.depth <= -fov) return;

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);

        if (isPrereqFlow) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.4 * Math.min(2, p1.scale);
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Animated Truth Energy Particle Pulses flowing from Prerequisite to Dependent (p2 -> p1)
          const particleCount = 2;
          for (let pi = 0; pi < particleCount; pi++) {
            const particlePhase = ((time * 0.015 + pi / particleCount) % 1.0);
            // Direction: from prerequisite (to/p2) to dependent (from/p1)
            const curX = p2.sx + (p1.sx - p2.sx) * particlePhase;
            const curY = p2.sy + (p1.sy - p2.sy) * particlePhase;

            ctx.beginPath();
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.arc(curX, curY, Math.max(1.8, 3.2 * p1.scale), 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.strokeStyle = 'rgba(71, 85, 105, 0.22)';
          ctx.lineWidth = 0.8;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      });

      // 5. Project and Sort Nodes by Depth (Painter's Algorithm)
      const projectedNodes = cosmos3DList
        .map((cn) => {
          const proj = project3D(cn.x, cn.y, cn.z);
          return { cn, proj };
        })
        .filter((item) => item.proj.depth > -fov)
        .sort((a, b) => b.proj.depth - a.proj.depth);

      // 6. Draw 3D Star Nodes
      const bottleneckSet = new Set((closureResult?.criticalBottlenecks || []).map((b) => b.node.id));

      projectedNodes.forEach(({ cn, proj }) => {
        const { node, starMagnitude, nebulaColor } = cn;
        const isTarget = node.id === selectedTargetId;
        const isPrereq = closureResult?.allPrerequisiteIds.includes(node.id);
        const isKnown = knownNodeIds.includes(node.id);
        const isHovered = hoveredNodeId === node.id;
        const isBottleneck = bottleneckSet.has(node.id);

        const baseRadius = (isTarget ? starMagnitude * 1.9 : isPrereq ? starMagnitude * 1.4 : starMagnitude) * proj.scale;
        const nodeRadius = Math.max(2.5, Math.min(28, baseRadius));

        // Outer Glowing Halo
        if (isTarget || isPrereq || isBottleneck || isHovered || proj.scale > 0.9) {
          const haloRadius = nodeRadius * (isTarget ? 3.2 : isBottleneck ? 2.6 : 2.0);
          const haloGrad = ctx.createRadialGradient(proj.sx, proj.sy, nodeRadius * 0.4, proj.sx, proj.sy, haloRadius);

          if (isTarget) {
            haloGrad.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
            haloGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          } else if (isBottleneck) {
            haloGrad.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
            haloGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          } else if (isKnown) {
            haloGrad.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
            haloGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          } else if (isPrereq) {
            haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.65)');
            haloGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
          } else {
            haloGrad.addColorStop(0, `${nebulaColor}55`);
            haloGrad.addColorStop(1, 'transparent');
          }

          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, haloRadius, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Star Body
        ctx.beginPath();
        let bodyColor = nebulaColor;
        if (node.nodeType === 'AXIOM') bodyColor = '#f59e0b';
        else if (node.nodeType === 'DEFINITION') bodyColor = '#10b981';
        else if (node.nodeType === 'LEMMA') bodyColor = '#8b5cf6';
        else if (node.nodeType === 'THEOREM') bodyColor = '#0ea5e9';
        else if (node.nodeType === 'CONJECTURE') bodyColor = '#f43f5e';

        if (isTarget) bodyColor = '#fbbf24';
        else if (isKnown) bodyColor = '#34d399';
        else if (isPrereq) bodyColor = '#38bdf8';

        ctx.fillStyle = bodyColor;

        if (isTarget || isBottleneck) {
          ctx.shadowColor = isTarget ? '#f59e0b' : '#ef4444';
          ctx.shadowBlur = 16;
        }
        ctx.arc(proj.sx, proj.sy, nodeRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Bottleneck Ring Indicator
        if (isBottleneck) {
          ctx.beginPath();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.8 * proj.scale;
          ctx.setLineDash([3, 3]);
          ctx.arc(proj.sx, proj.sy, nodeRadius + 4 * proj.scale, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Node Title Labels
        if (isTarget || isPrereq || isBottleneck || isHovered || proj.scale > 1.05) {
          ctx.font = `${isTarget ? 'bold 12px' : isBottleneck ? 'bold 11px' : '10px'} sans-serif`;
          ctx.fillStyle = isTarget
            ? '#fbbf24'
            : isBottleneck
            ? '#fca5a5'
            : isKnown
            ? '#a7f3d0'
            : isPrereq
            ? '#e0f2fe'
            : '#cbd5e1';

          const displayTitle = getNodeTitle(node, locale);
          ctx.fillText(displayTitle, proj.sx + nodeRadius + 5, proj.sy + 3);

          // Bottleneck badge badge text
          if (isBottleneck) {
            ctx.font = 'bold 9px sans-serif';
            ctx.fillStyle = '#ef4444';
            ctx.fillText(isZh ? '⚡ 关键拓扑枢纽' : '⚡ Key Milestone', proj.sx + nodeRadius + 5, proj.sy + 15);
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [
    cosmos3DList,
    cosmos3DMap,
    selectedTargetId,
    knownNodeIds,
    closureResult,
    fullHasseEdges,
    showDust,
    activeDiscipline,
    viewMode,
    hoveredNodeId,
    nebulaDustParticles,
    backgroundStars,
    locale,
    isZh,
  ]);

  // Raycasting / Screen-Space Hit Detection
  const findNodeUnderMouse = useCallback((clientX: number, clientY: number): CosmicNode3D | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    // Convert CSS-space pointer coords into bitmap space so they match the projection coordinates
    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);
    const mouseX = (clientX - rect.left) * scaleX;
    const mouseY = (clientY - rect.top) * scaleY;

    const cx = canvas.width / 2 + panOffsetRef.current.x;
    const cy = canvas.height / 2 + panOffsetRef.current.y;
    const fov = 480;
    const rotation = rotationRef.current;
    const zoom = zoomRef.current;

    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);

    let closestNode: CosmicNode3D | null = null;
    let minDistance = Infinity;

    cosmos3DList.forEach((cn) => {
      const x1 = cn.x * cosY + cn.z * sinY;
      const y1 = cn.y;
      const z1 = -cn.x * sinY + cn.z * cosY;

      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      const distance = fov + z2 * zoom;
      if (distance <= 15) return;
      const scale = (fov / distance) * zoom;

      const sx = cx + x2 * scale;
      const sy = cy + y2 * scale;

      const hitRadius = Math.max(12, cn.starMagnitude * scale + 6);
      const dist = Math.hypot(mouseX - sx, mouseY - sy);

      if (dist <= hitRadius && dist < minDistance) {
        minDistance = dist;
        closestNode = cn;
      }
    });

    return closestNode;
  }, [cosmos3DList]);

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    lastMouseRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    if (e.button === 2 || e.shiftKey) {
      isPanningRef.current = true;
    } else {
      isDraggingRef.current = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;

    if (isDraggingRef.current) {
      rotationRef.current.x += dy * 0.006;
      rotationRef.current.y += dx * 0.006;
    } else if (isPanningRef.current) {
      panOffsetRef.current.x += dx;
      panOffsetRef.current.y += dy;
    } else {
      // Hover detection
      const hit = findNodeUnderMouse(e.clientX, e.clientY);
      setHoveredNodeId(hit ? hit.node.id : null);
    }

    lastMouseRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const dist = Math.hypot(e.clientX - lastMouseRef.current.x, e.clientY - lastMouseRef.current.y);
    const duration = Date.now() - lastMouseRef.current.time;

    if (dist < 6 && duration < 350) {
      const hit = findNodeUnderMouse(e.clientX, e.clientY);
      if (hit) {
        setSelectedTargetId(hit.node.id);
      }
    }

    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const hit = findNodeUnderMouse(e.clientX, e.clientY);
    if (hit) {
      router.push(`/node/${hit.node.slug}`);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    zoomRef.current = Math.min(3.8, Math.max(0.35, zoomRef.current * zoomFactor));
  };

  const selectedNode = useMemo(() => {
    return initialMathNodes.find((n) => n.id === selectedTargetId) || initialMathNodes[0];
  }, [selectedTargetId]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl space-y-4 p-6">
      {/* Top Header & Cosmic Discipline Nebula Jump Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Orbit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-base">
                {isZh ? '3D 数学宇宙知识星系 (3D Mathematical Knowledge Cosmos)' : '3D Mathematical Knowledge Cosmos'}
              </h3>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                {isZh ? '六大星云拓扑引力场' : 'Six-Nebula Topological Gravity Field'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isZh
                ? '公理星核 ➔ 基础定义 ➔ 引理星座 ➔ 高阶定理螺旋外旋臂 · 3D库仑斥力与胡克引力拓扑聚类'
                : 'Axiom cores ➔ base definitions ➔ lemma constellations ➔ spiral arms of advanced theorems · 3D Coulomb repulsion & Hooke-gravity clustering'}
            </p>
          </div>
        </div>

        {/* View Mode & Nebula Jump Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Target Theorem Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700">
            <Crosshair className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-slate-400">{isZh ? '目标定理:' : 'Target theorem:'}</span>
            <select
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="bg-transparent text-amber-300 text-xs outline-none font-semibold cursor-pointer max-w-[160px] truncate"
            >
              {initialMathNodes.map((n) => (
                <option key={n.id} value={n.id} className="bg-slate-900 text-slate-200">
                  {isZh ? `${n.titleZh} (${n.titleEn})` : n.titleEn || n.titleZh}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('flow')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'flow'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isZh ? '只高亮前置依赖闭包流 (推荐)' : 'Highlight only the prerequisite closure flow (recommended)'}
            >
              {t('graph.flowView')}
            </button>
            <button
              onClick={() => setViewMode('hasse')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'hasse'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isZh ? 'Hasse 极小必要推导骨架 (去除冗余传递边)' : 'Minimal Hasse derivation skeleton (redundant transitive edges removed)'}
            >
              {t('graph.hasseView')}
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'full'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isZh ? '全量依赖连线' : 'Full dependency edges'}
            >
              {t('graph.fullView')}
            </button>
          </div>
        </div>
      </div>

      {/* Six Discipline Nebula Jump Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-semibold whitespace-nowrap mr-1 flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" /> {t('graph.nebulaeCruise')}:
        </span>
        <button
          onClick={resetCamera}
          className={`px-2.5 py-1 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
            activeDiscipline === 'all'
              ? 'bg-slate-800 text-slate-100 border-slate-600 font-bold'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          {t('graph.universeOverview')}
        </button>
        {Object.values(COSMIC_NEBULAE).map((nebula) => (
          <button
            key={nebula.id}
            onClick={() => jumpToNebula(nebula.id)}
            className={`px-2.5 py-1 rounded-xl border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeDiscipline === nebula.id
                ? 'bg-slate-800 text-slate-100 font-bold shadow-lg'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
            style={{
              borderColor: activeDiscipline === nebula.id ? nebula.color : undefined,
              boxShadow: activeDiscipline === nebula.id ? `0 0 12px ${nebula.glowColor}` : undefined,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: nebula.color }} />
            <span>{isZh ? nebula.nameZh.split(' ')[0] : nebula.nameEn}</span>
          </button>
        ))}
      </div>

      {/* Main 3D Cosmos Viewport with HUD Overlays */}
      <div
        ref={containerRef}
        className="relative w-full h-[580px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden cursor-grab active:cursor-grabbing"
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
          className="w-full h-full block"
        />

        {/* Top-Left Learning Metric HUD Panel */}
        {closureResult && (
          <div className="absolute top-4 left-4 p-4 rounded-2xl glass-panel-glow border border-cyan-500/40 space-y-3 max-w-sm text-xs pointer-events-auto backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-100 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>{isZh ? '极小前置推导闭包 (Prereq Closure)' : 'Minimal Prerequisite Closure'}</span>
              </span>
              <span className="text-amber-400 font-mono font-bold text-sm">
                {closureResult.readinessPercentage}% {t('graph.readinessPercentage')}
              </span>
            </div>

            {/* Readiness Progress Bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${closureResult.readinessPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">{t('graph.totalPrereqsCount')}</span>
                <span className="text-cyan-300 font-bold text-sm">
                  {closureResult.allPrerequisiteIds.length} {isZh ? '项星宿' : 'nodes'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">{t('graph.unlearnedNodesCount')}</span>
                <span className="text-amber-300 font-bold text-sm">
                  {closureResult.unlearnedPrerequisiteNodes.length} {isZh ? '项节点' : 'nodes'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 text-slate-300">
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> {t('graph.estStudyHours')}:
              </span>
              <span className="text-emerald-400 font-bold font-mono">
                {closureResult.totalEstimatedHours} {t('graph.hours')}
              </span>
            </div>

            {/* Critical Bottleneck Milestone Theorems */}
            {closureResult.criticalBottlenecks.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  {isZh ? '关键拓扑枢纽定理 (Bottleneck Gates):' : 'Critical Bottleneck Milestone Theorems:'}
                </span>
                <div className="space-y-1">
                  {closureResult.criticalBottlenecks.map(({ node, reason }) => (
                    <div
                      key={node.id}
                      onClick={() => flyToNode(node.id)}
                      className="p-1.5 px-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-200 text-[11px] flex items-center justify-between hover:bg-rose-900/50 cursor-pointer transition-colors"
                      title={isZh ? reason : getBottleneckReasonEn(reason)}
                    >
                      <span className="font-semibold">{getNodeTitle(node, locale)}</span>
                      <span className="text-[10px] text-rose-400 font-mono">
                        {isZh ? reason.split(' ')[0] : getBottleneckBadgeEn(reason)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top-Right Node Inspector Floating Card */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 p-4 rounded-2xl glass-panel-glow border border-cyan-500/40 text-left shadow-2xl backdrop-blur-md pointer-events-auto space-y-2.5">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${
                  getNodeTypeMeta(selectedNode.nodeType, locale).color
                }`}
              >
                {getNodeTypeMeta(selectedNode.nodeType, locale).label}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">MSC {selectedNode.mscCode}</span>
            </div>

            <h4 className="font-bold text-slate-100 text-sm">{getNodeTitle(selectedNode, locale)}</h4>
            {isZh && (
              <p className="text-xs text-slate-400 font-mono">{selectedNode.titleEn}</p>
            )}

            <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-cyan-200 font-mono overflow-x-auto">
              <InlineLaTeX formula={selectedNode.statementLatex} />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                {getVerificationMeta(selectedNode.verification, locale).short}
              </span>
              <span className="text-slate-400">{selectedNode.proofs.length} {isZh ? '份形式化证明' : 'proof(s)'}</span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => toggleKnownNode(selectedNode.id)}
                className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  knownNodeIds.includes(selectedNode.id)
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{knownNodeIds.includes(selectedNode.id) ? (isZh ? '已掌握' : 'Mastered') : (isZh ? '标记已学' : 'Mark Learned')}</span>
              </button>

              <Link
                href={`/node/${selectedNode.slug}`}
                className="py-1.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{isZh ? '详情' : 'Details'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Left Utility Buttons */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              isRotating
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? (isZh ? '自转巡航' : 'Orbit Cruise') : (isZh ? '定格观察' : 'Freeze View')}</span>
          </button>

          <button
            onClick={() => setShowDust(!showDust)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              showDust
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showDust ? t('graph.nebulaDustOn') : t('graph.nebulaDustOff')}</span>
          </button>

          <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                zoomRef.current = Math.min(3.8, zoomRef.current * 1.2);
              }}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors cursor-pointer"
              title={t('graph.zoomIn')}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                zoomRef.current = Math.max(0.35, zoomRef.current * 0.8);
              }}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors cursor-pointer"
              title={t('graph.zoomOut')}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Right Control Hint */}
        <div className="absolute bottom-4 right-4 p-2 px-3 rounded-xl glass-panel text-[11px] text-slate-400 flex items-center gap-2 pointer-events-none">
          <Move className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('graph.controlsHint')}</span>
        </div>
      </div>

      {/* Interactive Step-by-Step Learning Trajectory Checklist */}
      {closureResult && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>
                {isZh
                  ? `通往《${closureResult.targetNode.titleZh}》的拓扑学习阶梯（勾选以动态消除已掌握前置）：`
                  : `Topological learning path to "${getNodeTitle(closureResult.targetNode, locale)}" (tick steps to dynamically clear mastered prerequisites):`}
              </span>
            </span>
            <span className="text-slate-400 text-[11px]">
              {isZh ? '拓扑顺序排列 · 顺流而下' : 'Sorted in topological order · flow downstream from axioms'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {closureResult.learningSequence.map((n, idx) => {
              const isKnown = knownNodeIds.includes(n.id);
              const isTarget = n.id === selectedTargetId;
              const isBottleneck = closureResult.criticalBottlenecks.some((b) => b.node.id === n.id);

              return (
                <button
                  key={n.id}
                  onClick={() => toggleKnownNode(n.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isTarget
                      ? 'bg-amber-500/20 border-amber-500/70 text-amber-300 font-bold'
                      : isKnown
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : isBottleneck
                      ? 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-500">{idx + 1}.</span>
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      isKnown ? 'text-emerald-400' : isTarget ? 'text-amber-400' : 'text-slate-600'
                    }`}
                  />
                  <span>{getNodeTitle(n, locale)}</span>
                  {isBottleneck && <span className="text-[9px] px-1 py-0.2 rounded bg-rose-900/60 text-rose-300">{isZh ? '枢纽' : 'Gate'}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
