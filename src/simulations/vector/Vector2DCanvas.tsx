import { useEffect, useRef, useState } from 'react';
import type { Vector2D } from '../../types/physics';
import { clampNumber } from '../../services/physics/vectorMath';

export interface CanvasVectorItem {
  id: string;
  tail: Vector2D;
  head: Vector2D;
  color: string;
  label: string;
  dashed?: boolean;
  lineWidth?: number;
  draggableHead?: boolean;
  draggableTail?: boolean;
  showComponents?: boolean;
  labelPosition?: 'head' | 'midpoint';
}

export interface CanvasOverlayPolygon {
  points: Vector2D[];
  fillColor: string;
  strokeColor?: string;
}

export interface CanvasAngleArc {
  center: Vector2D;
  startRad: number;
  endRad: number;
  radiusUnits: number;
  color: string;
  label?: string;
}

export interface CanvasSegment {
  from: Vector2D;
  to: Vector2D;
  color: string;
  dashed?: boolean;
  width?: number;
  label?: string;
}

interface Vector2DCanvasProps {
  vectors: CanvasVectorItem[];
  polygons?: CanvasOverlayPolygon[];
  arcs?: CanvasAngleArc[];
  segments?: CanvasSegment[];
  showGrid: boolean;
  showAxisLabels: boolean;
  showVectorLabels: boolean;
  zoom: number;
  unitSuffix?: string;
  onDragVector?: (id: string, target: 'head' | 'tail', worldPos: Vector2D) => void;
  ariaLabel: string;
}

export function Vector2DCanvas({
  vectors,
  polygons = [],
  arcs = [],
  segments = [],
  showGrid,
  showAxisLabels,
  showVectorLabels,
  zoom,
  unitSuffix = '',
  onDragVector,
  ariaLabel,
}: Vector2DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 640, height: 460 });
  const [hoveredHandle, setHoveredHandle] = useState<{ id: string; target: 'head' | 'tail' } | null>(null);
  const draggingRef = useRef<{ id: string; target: 'head' | 'tail' } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ width: Math.floor(rect.width), height: Math.floor(rect.height) });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const basePixelsPerUnit = Math.min(size.width, size.height) / 18;
  const pxPerUnit = basePixelsPerUnit * clampNumber(zoom, 0.5, 2.2);
  const originX = size.width / 2;
  const originY = size.height / 2;

  const worldToScreen = (p: Vector2D) => ({
    x: originX + p.x * pxPerUnit,
    y: originY - p.y * pxPerUnit,
  });

  const screenToWorld = (sx: number, sy: number): Vector2D => ({
    x: Math.round(((sx - originX) / pxPerUnit) * 10) / 10,
    y: Math.round(((originY - sy) / pxPerUnit) * 10) / 10,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(size.width * dpr);
    canvas.height = Math.floor(size.height * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Clean scientific stage background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size.width, size.height);

    const maxUnitsX = Math.ceil(size.width / (2 * pxPerUnit)) + 1;
    const maxUnitsY = Math.ceil(size.height / (2 * pxPerUnit)) + 1;

    // Grid lines
    if (showGrid) {
      ctx.lineWidth = 1;
      for (let gx = -maxUnitsX; gx <= maxUnitsX; gx++) {
        const sx = originX + gx * pxPerUnit;
        ctx.strokeStyle = gx % 5 === 0 ? '#E2E8F0' : '#F1F5F9';
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, size.height);
        ctx.stroke();
      }
      for (let gy = -maxUnitsY; gy <= maxUnitsY; gy++) {
        const sy = originY - gy * pxPerUnit;
        ctx.strokeStyle = gy % 5 === 0 ? '#E2E8F0' : '#F1F5F9';
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(size.width, sy);
        ctx.stroke();
      }
    }

    // Coordinate axes
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(size.width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, size.height);
    ctx.stroke();

    // Axis ticks and labels
    if (showAxisLabels) {
      ctx.fillStyle = '#64748B';
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const tickStep = zoom < 0.75 ? 2 : 1;

      for (let gx = -maxUnitsX; gx <= maxUnitsX; gx += tickStep) {
        if (gx === 0) continue;
        const sx = originX + gx * pxPerUnit;
        if (sx < 18 || sx > size.width - 18) continue;
        ctx.beginPath();
        ctx.moveTo(sx, originY - 3);
        ctx.lineTo(sx, originY + 3);
        ctx.stroke();
        if (gx % 2 === 0 || zoom >= 1.1) {
          ctx.fillText(String(gx), sx, originY + 6);
        }
      }

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let gy = -maxUnitsY; gy <= maxUnitsY; gy += tickStep) {
        if (gy === 0) continue;
        const sy = originY - gy * pxPerUnit;
        if (sy < 16 || sy > size.height - 16) continue;
        ctx.beginPath();
        ctx.moveTo(originX - 3, sy);
        ctx.lineTo(originX + 3, sy);
        ctx.stroke();
        if (gy % 2 === 0 || zoom >= 1.1) {
          ctx.fillText(String(gy), originX - 7, sy);
        }
      }

      ctx.font = '600 12px "DM Sans", sans-serif';
      ctx.fillStyle = '#334155';
      ctx.textAlign = 'right';
      ctx.fillText(`x${unitSuffix ? ` (${unitSuffix})` : ''}`, size.width - 10, originY - 14);
      ctx.textAlign = 'left';
      ctx.fillText(`y${unitSuffix ? ` (${unitSuffix})` : ''}`, originX + 10, 14);
    }

    // Polygons (parallelogram, projection triangle)
    for (const poly of polygons) {
      if (poly.points.length < 3) continue;
      ctx.save();
      ctx.beginPath();
      const first = worldToScreen(poly.points[0]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < poly.points.length; i++) {
        const pt = worldToScreen(poly.points[i]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fillStyle = poly.fillColor;
      ctx.fill();
      if (poly.strokeColor) {
        ctx.strokeStyle = poly.strokeColor;
        ctx.lineWidth = 1.25;
        ctx.setLineDash([5, 4]);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Helper segments (projection lines, etc.)
    for (const seg of segments) {
      const s1 = worldToScreen(seg.from);
      const s2 = worldToScreen(seg.to);
      ctx.save();
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = seg.width ?? 1.5;
      if (seg.dashed) ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
      ctx.stroke();
      if (seg.label && showVectorLabels) {
        ctx.fillStyle = seg.color;
        ctx.font = '600 11px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(seg.label, (s1.x + s2.x) / 2, (s1.y + s2.y) / 2 - 8);
      }
      ctx.restore();
    }

    // Angle arcs
    for (const arc of arcs) {
      const c = worldToScreen(arc.center);
      const rPx = arc.radiusUnits * pxPerUnit;
      ctx.save();
      ctx.strokeStyle = arc.color;
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      // Canvas y is inverted, so negate angles for screen space
      let diff = arc.endRad - arc.startRad;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      const anticlockwise = diff > 0;
      ctx.arc(c.x, c.y, rPx, -arc.startRad, -arc.endRad, anticlockwise);
      ctx.stroke();

      if (arc.label) {
        const midRad = arc.startRad + diff / 2;
        const lx = c.x + (rPx + 14) * Math.cos(midRad);
        const ly = c.y - (rPx + 14) * Math.sin(midRad);
        ctx.fillStyle = arc.color;
        ctx.font = '600 11px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(arc.label, lx, ly);
      }
      ctx.restore();
    }

    // Component projection guides for vectors with showComponents=true
    for (const vec of vectors) {
      if (!vec.showComponents) continue;
      const tailS = worldToScreen(vec.tail);
      const headS = worldToScreen(vec.head);
      const cornerS = worldToScreen({ x: vec.head.x, y: vec.tail.y });

      ctx.save();
      ctx.strokeStyle = vec.color;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(headS.x, headS.y);
      ctx.lineTo(cornerS.x, cornerS.y);
      ctx.moveTo(headS.x, headS.y);
      ctx.lineTo(tailS.x, headS.y);
      ctx.stroke();

      // Bold colored component legs along axes
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(tailS.x, tailS.y);
      ctx.lineTo(cornerS.x, cornerS.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tailS.x, tailS.y);
      ctx.lineTo(tailS.x, headS.y);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Vectors
    for (const vec of vectors) {
      const tailS = worldToScreen(vec.tail);
      const headS = worldToScreen(vec.head);
      const dx = headS.x - tailS.x;
      const dy = headS.y - tailS.y;
      const len = Math.hypot(dx, dy);

      ctx.save();
      ctx.strokeStyle = vec.color;
      ctx.fillStyle = vec.color;
      ctx.lineWidth = vec.lineWidth ?? 2.75;
      ctx.lineCap = 'round';
      if (vec.dashed) ctx.setLineDash([6, 4]);

      if (len > 3) {
        const angle = Math.atan2(dy, dx);
        const headLen = Math.min(13, Math.max(8, len * 0.25));
        const shaftEndX = headS.x - (headLen - 2) * Math.cos(angle);
        const shaftEndY = headS.y - (headLen - 2) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(tailS.x, tailS.y);
        ctx.lineTo(shaftEndX, shaftEndY);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(headS.x, headS.y);
        ctx.lineTo(
          headS.x - headLen * Math.cos(angle - Math.PI / 7),
          headS.y - headLen * Math.sin(angle - Math.PI / 7),
        );
        ctx.lineTo(
          headS.x - headLen * Math.cos(angle + Math.PI / 7),
          headS.y - headLen * Math.sin(angle + Math.PI / 7),
        );
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(tailS.x, tailS.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draggable handle indicator
      if (vec.draggableHead) {
        const isHot = hoveredHandle?.id === vec.id && hoveredHandle.target === 'head';
        ctx.beginPath();
        ctx.arc(headS.x, headS.y, isHot ? 8 : 5.5, 0, Math.PI * 2);
        ctx.fillStyle = isHot ? vec.color : '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = vec.color;
        ctx.stroke();
      }
      if (vec.draggableTail) {
        const isHot = hoveredHandle?.id === vec.id && hoveredHandle.target === 'tail';
        ctx.beginPath();
        ctx.arc(tailS.x, tailS.y, isHot ? 8 : 5.5, 0, Math.PI * 2);
        ctx.fillStyle = isHot ? vec.color : '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = vec.color;
        ctx.stroke();
      }

      if (showVectorLabels && vec.label) {
        const useMid = vec.labelPosition === 'midpoint';
        const anchorX = useMid ? (tailS.x + headS.x) / 2 : headS.x;
        const anchorY = useMid ? (tailS.y + headS.y) / 2 : headS.y;
        const offsetX = useMid ? (dy >= 0 ? 18 : -18) : dx >= 0 ? 10 : -10;
        const offsetY = useMid ? (dx >= 0 ? -12 : 12) : dy <= 0 ? -10 : 14;
        ctx.font = '600 12px "DM Sans", sans-serif';
        const metrics = ctx.measureText(vec.label);
        const padX = 5;
        const boxW = metrics.width + padX * 2;
        const boxH = 18;
        const lx = clampNumber(anchorX + offsetX, boxW / 2 + 6, size.width - boxW / 2 - 6);
        const ly = clampNumber(anchorY + offsetY, 14, size.height - 14);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.fillRect(lx - boxW / 2, ly - boxH / 2, boxW, boxH);
        ctx.fillStyle = vec.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(vec.label, lx, ly);
      }

      ctx.restore();
    }

    // Origin marker
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(originX, originY, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, [size, vectors, polygons, arcs, segments, showGrid, showAxisLabels, showVectorLabels, zoom, pxPerUnit, originX, originY, unitSuffix, hoveredHandle]);

  const findHitHandle = (clientX: number, clientY: number): { id: string; target: 'head' | 'tail' } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;

    for (let i = vectors.length - 1; i >= 0; i--) {
      const vec = vectors[i];
      if (vec.draggableHead) {
        const hs = worldToScreen(vec.head);
        if (Math.hypot(sx - hs.x, sy - hs.y) <= 16) {
          return { id: vec.id, target: 'head' };
        }
      }
      if (vec.draggableTail) {
        const ts = worldToScreen(vec.tail);
        if (Math.hypot(sx - ts.x, sy - ts.y) <= 16) {
          return { id: vec.id, target: 'tail' };
        }
      }
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!onDragVector) return;
    const hit = findHitHandle(e.clientX, e.clientY);
    if (hit) {
      draggingRef.current = hit;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (draggingRef.current && onDragVector) {
      const world = screenToWorld(sx, sy);
      const maxCoord = Math.max(6, Math.round(8 / clampNumber(zoom, 0.5, 2.2)));
      onDragVector(draggingRef.current.id, draggingRef.current.target, {
        x: clampNumber(world.x, -maxCoord, maxCoord),
        y: clampNumber(world.y, -maxCoord, maxCoord),
      });
      return;
    }

    if (onDragVector) {
      setHoveredHandle(findHitHandle(e.clientX, e.clientY));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggingRef.current) {
      draggingRef.current = null;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] select-none">
      <canvas
        ref={canvasRef}
        data-testid="vector-2d-canvas"
        aria-label={ariaLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ cursor: draggingRef.current ? 'grabbing' : hoveredHandle ? 'grab' : 'default' }}
        className="w-full h-full block rounded-lg touch-none"
      />
    </div>
  );
}
