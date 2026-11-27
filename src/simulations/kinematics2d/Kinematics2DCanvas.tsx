import { useEffect, useRef, useState } from 'react';
import {
  circularStateAtTime,
  decomposeAcceleration2D,
  position2D,
  projectileFlightSummary,
  projectileStateAtTime,
  riverCrossingSummary,
  velocity2D,
} from '../../services/physics/kinematics2dMath';
import { formatNum } from '../../services/physics/vectorMath';

export type Kinematics2DCanvasMode = 'vectors-2d' | 'projectile' | 'circular' | 'relative';

interface Kinematics2DCanvasProps {
  mode: Kinematics2DCanvasMode;
  tNow: number;
  // vectors-2d params
  vx0: number;
  vy0: number;
  ax: number;
  ay: number;
  t1: number;
  t2: number;
  tMax: number;
  // projectile params
  launchSpeed: number;
  launchAngleDeg: number;
  launchHeight: number;
  gravity: number;
  showComplementary: boolean;
  // circular params
  radius: number;
  circSpeed0: number;
  tangentialAccel: number;
  // relative params
  riverWidth: number;
  boatSpeed: number;
  upstreamAngleDeg: number;
  currentSpeed: number;
  // display flags
  showGrid: boolean;
  showAxisLabels: boolean;
  showLabels: boolean;
  showComponents: boolean;
  showResultant: boolean;
  zoom: number;
  ariaLabel: string;
}

function drawVectorArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lineWidth = 2.5,
  dashed = false,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 3) return;
  const headLen = Math.min(10, Math.max(6, len * 0.25));
  const angle = Math.atan2(dy, dx);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  if (dashed) ctx.setLineDash([5, 4]);

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - headLen * 0.65 * Math.cos(angle), y2 - headLen * 0.65 * Math.sin(angle));
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLen * Math.cos(angle - Math.PI / 7),
    y2 - headLen * Math.sin(angle - Math.PI / 7),
  );
  ctx.lineTo(
    x2 - headLen * Math.cos(angle + Math.PI / 7),
    y2 - headLen * Math.sin(angle + Math.PI / 7),
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string,
  align: CanvasTextAlign = 'left',
) {
  ctx.save();
  ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  const metrics = ctx.measureText(text);
  const padX = 5;
  const bw = metrics.width + padX * 2;
  const bh = 18;
  const bx = align === 'center' ? x - bw / 2 : align === 'right' ? x - bw + padX : x - padX;
  const by = y - bh / 2;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.9)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function Kinematics2DCanvas(props: Kinematics2DCanvasProps) {
  const {
    mode,
    tNow,
    vx0,
    vy0,
    ax,
    ay,
    t1,
    t2,
    tMax,
    launchSpeed,
    launchAngleDeg,
    launchHeight,
    gravity,
    showComplementary,
    radius,
    circSpeed0,
    tangentialAccel,
    riverWidth,
    boatSpeed,
    upstreamAngleDeg,
    currentSpeed,
    showGrid,
    showAxisLabels,
    showLabels,
    showComponents,
    showResultant,
    zoom,
    ariaLabel,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 640, height: 480 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(300, Math.round(rect.width));
      const h = Math.max(380, Math.min(540, Math.round(w * 0.75)));
      setSize({ width: w, height: h });
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size.width, size.height);

    const w = size.width;
    const h = size.height;

    if (mode === 'vectors-2d') {
      // Auto-fit bounds across [0, tMax]
      let minX = -2;
      let maxX = 12;
      let minY = -2;
      let maxY = 12;
      for (let i = 0; i <= 60; i++) {
        const t = (i / 60) * tMax;
        const p = position2D(0, 0, vx0, vy0, ax, ay, t);
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
      }
      const spanX = Math.max(10, maxX - minX);
      const spanY = Math.max(10, maxY - minY);
      const scale = (Math.min((w - 84) / spanX, (h - 84) / spanY)) * zoom;
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      const toPx = (wx: number, wy: number) => ({
        x: w / 2 + (wx - midX) * scale,
        y: h / 2 - (wy - midY) * scale,
      });

      const origin = toPx(0, 0);

      if (showGrid) {
        ctx.strokeStyle = '#F1F5F9';
        ctx.lineWidth = 1;
        const stepMeters = spanX > 30 ? 5 : spanX > 15 ? 2 : 1;
        const startGx = Math.floor((midX - w / (2 * scale)) / stepMeters) * stepMeters;
        const endGx = Math.ceil((midX + w / (2 * scale)) / stepMeters) * stepMeters;
        for (let gx = startGx; gx <= endGx; gx += stepMeters) {
          const px = toPx(gx, 0).x;
          ctx.beginPath();
          ctx.moveTo(px, 0);
          ctx.lineTo(px, h);
          ctx.stroke();
        }
        const startGy = Math.floor((midY - h / (2 * scale)) / stepMeters) * stepMeters;
        const endGy = Math.ceil((midY + h / (2 * scale)) / stepMeters) * stepMeters;
        for (let gy = startGy; gy <= endGy; gy += stepMeters) {
          const py = toPx(0, gy).y;
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(w, py);
          ctx.stroke();
        }
      }

      // Axes
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, origin.y);
      ctx.lineTo(w, origin.y);
      ctx.moveTo(origin.x, 0);
      ctx.lineTo(origin.x, h);
      ctx.stroke();

      if (showAxisLabels) {
        ctx.fillStyle = '#64748B';
        ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('x (m)', w - 38, Math.max(16, Math.min(h - 10, origin.y - 8)));
        ctx.fillText('y (m)', Math.max(8, Math.min(w - 40, origin.x + 8)), 16);
      }

      // Trajectory curve
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const t = (i / 120) * tMax;
        const p = position2D(0, 0, vx0, vy0, ax, ay, t);
        const px = toPx(p.x, p.y);
        if (i === 0) ctx.moveTo(px.x, px.y);
        else ctx.lineTo(px.x, px.y);
      }
      ctx.stroke();

      // r(t1), r(t2), and displacement Δr
      const r1 = position2D(0, 0, vx0, vy0, ax, ay, t1);
      const r2 = position2D(0, 0, vx0, vy0, ax, ay, t2);
      const p1 = toPx(r1.x, r1.y);
      const p2 = toPx(r2.x, r2.y);

      drawVectorArrow(ctx, origin.x, origin.y, p1.x, p1.y, '#94A3B8', 1.8, true);
      drawVectorArrow(ctx, origin.x, origin.y, p2.x, p2.y, '#64748B', 1.8, true);
      if (showResultant) {
        drawVectorArrow(ctx, p1.x, p1.y, p2.x, p2.y, '#7C3AED', 2.4, true);
      }

      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 4.5, 0, Math.PI * 2);
      ctx.arc(p2.x, p2.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Current particle at tNow
      const rNow = position2D(0, 0, vx0, vy0, ax, ay, tNow);
      const vNow = velocity2D(vx0, vy0, ax, ay, tNow);
      const pNow = toPx(rNow.x, rNow.y);

      drawVectorArrow(ctx, origin.x, origin.y, pNow.x, pNow.y, '#2563EB', 2.2);

      const vecScalePx = 12 * zoom;
      const vTip = { x: pNow.x + vNow.x * vecScalePx, y: pNow.y - vNow.y * vecScalePx };
      drawVectorArrow(ctx, pNow.x, pNow.y, vTip.x, vTip.y, '#059669', 2.8);

      const accelScalePx = 14 * zoom;
      const aTip = { x: pNow.x + ax * accelScalePx, y: pNow.y - ay * accelScalePx };
      drawVectorArrow(ctx, pNow.x, pNow.y, aTip.x, aTip.y, '#DC2626', 2.8);

      if (showComponents) {
        const decomp = decomposeAcceleration2D(vNow.x, vNow.y, ax, ay);
        const parTip = {
          x: pNow.x + decomp.aParallelVec.x * accelScalePx,
          y: pNow.y - decomp.aParallelVec.y * accelScalePx,
        };
        const perpTip = {
          x: pNow.x + decomp.aPerpVec.x * accelScalePx,
          y: pNow.y - decomp.aPerpVec.y * accelScalePx,
        };
        drawVectorArrow(ctx, pNow.x, pNow.y, parTip.x, parTip.y, '#D97706', 2, true);
        drawVectorArrow(ctx, pNow.x, pNow.y, perpTip.x, perpTip.y, '#4F46E5', 2, true);
        if (showLabels) {
          drawBadge(ctx, parTip.x + 8, parTip.y - 8, 'a∥', '#B45309');
          drawBadge(ctx, perpTip.x + 8, perpTip.y + 8, 'a⊥', '#4F46E5');
        }
      }

      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(pNow.x, pNow.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (showLabels) {
        drawBadge(ctx, p1.x - 6, p1.y - 12, `t₁=${formatNum(t1, 1)}s`, '#475569', 'right');
        drawBadge(ctx, p2.x + 6, p2.y - 12, `t₂=${formatNum(t2, 1)}s`, '#475569', 'left');
        if (showResultant) {
          drawBadge(ctx, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2 - 12, 'Δr', '#6D28D9', 'center');
        }
        drawBadge(ctx, vTip.x + 8, vTip.y, 'v(t)', '#047857');
        drawBadge(ctx, aTip.x + 8, aTip.y, 'a', '#B91C1C');
      }
    } else if (mode === 'projectile') {
      const summary = projectileFlightSummary(launchSpeed, launchAngleDeg, launchHeight, gravity);
      const compSummary = projectileFlightSummary(launchSpeed, 90 - launchAngleDeg, launchHeight, gravity);

      const maxRange = Math.max(
        10,
        summary.horizontalRange,
        showComplementary && launchHeight < 0.01 ? compSummary.horizontalRange : 0,
      );
      const maxH = Math.max(
        6,
        summary.maxHeight,
        showComplementary && launchHeight < 0.01 ? compSummary.maxHeight : 0,
      );

      const padLeft = 52;
      const padRight = 36;
      const padBottom = 46;
      const padTop = 34;
      const scale =
        Math.min((w - padLeft - padRight) / (maxRange * 1.12), (h - padTop - padBottom) / (maxH * 1.18)) *
        zoom;

      const originX = padLeft;
      const groundY = h - padBottom;
      const toPx = (wx: number, wy: number) => ({
        x: originX + wx * scale,
        y: groundY - wy * scale,
      });

      if (showGrid) {
        ctx.strokeStyle = '#F1F5F9';
        ctx.lineWidth = 1;
        const stepM = maxRange > 80 ? 20 : maxRange > 35 ? 10 : 5;
        for (let gx = 0; gx <= maxRange * 1.25; gx += stepM) {
          const px = toPx(gx, 0).x;
          ctx.beginPath();
          ctx.moveTo(px, padTop - 10);
          ctx.lineTo(px, groundY);
          ctx.stroke();
        }
        for (let gy = 0; gy <= maxH * 1.3; gy += stepM) {
          const py = toPx(0, gy).y;
          ctx.beginPath();
          ctx.moveTo(originX, py);
          ctx.lineTo(w - 16, py);
          ctx.stroke();
        }
      }

      // Ground & y-axis
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(0, groundY, w, h - groundY);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(16, groundY);
      ctx.lineTo(w - 16, groundY);
      ctx.stroke();

      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(originX, padTop - 10);
      ctx.lineTo(originX, groundY);
      ctx.stroke();

      if (showAxisLabels) {
        ctx.fillStyle = '#475569';
        ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('x (m)', w - 42, groundY + 18);
        ctx.fillText('y (m)', originX - 38, padTop);
      }

      // Cliff block if launchHeight > 0
      if (launchHeight > 0.05) {
        const launchPx = toPx(0, launchHeight);
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(originX - 24, launchPx.y, 24, groundY - launchPx.y);
        ctx.strokeStyle = '#94A3B8';
        ctx.strokeRect(originX - 24, launchPx.y, 24, groundY - launchPx.y);
      }

      // Complementary ghost arc (90 - theta)
      if (showComplementary && launchHeight < 0.05 && launchAngleDeg > 5 && launchAngleDeg < 85) {
        ctx.save();
        ctx.strokeStyle = '#93C5FD';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const t = (i / 80) * compSummary.timeOfFlight;
          const st = projectileStateAtTime(launchSpeed, 90 - launchAngleDeg, launchHeight, gravity, t);
          const px = toPx(st.x, Math.max(0, st.y));
          if (i === 0) ctx.moveTo(px.x, px.y);
          else ctx.lineTo(px.x, px.y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Full parabolic path
      ctx.save();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * summary.timeOfFlight;
        const st = projectileStateAtTime(launchSpeed, launchAngleDeg, launchHeight, gravity, t);
        const px = toPx(st.x, Math.max(0, st.y));
        if (i === 0) ctx.moveTo(px.x, px.y);
        else ctx.lineTo(px.x, px.y);
      }
      ctx.stroke();
      ctx.restore();

      // Apex & Range landmarks
      const apexState = projectileStateAtTime(
        launchSpeed,
        launchAngleDeg,
        launchHeight,
        gravity,
        summary.timeToApex,
      );
      const apexPx = toPx(apexState.x, summary.maxHeight);
      const landPx = toPx(summary.horizontalRange, 0);

      ctx.save();
      ctx.strokeStyle = '#CBD5E1';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(apexPx.x, apexPx.y);
      ctx.lineTo(apexPx.x, groundY);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(landPx.x, landPx.y, 4, 0, Math.PI * 2);
      ctx.fill();

      if (showLabels) {
        drawBadge(ctx, apexPx.x, Math.max(18, apexPx.y - 24), `H = ${formatNum(summary.maxHeight, 1)} m`, '#1D4ED8', 'center');
        drawBadge(ctx, landPx.x, groundY + 18, `R = ${formatNum(summary.horizontalRange, 1)} m`, '#0F172A', 'center');
      }

      // Current projectile ball & velocity vector
      const clampedT = Math.min(tNow, summary.timeOfFlight);
      const cur = projectileStateAtTime(launchSpeed, launchAngleDeg, launchHeight, gravity, clampedT);
      const curPx = toPx(cur.x, Math.max(0, cur.y));

      const vArrowScale = 2.4;
      const vxEnd = { x: curPx.x + cur.vx * vArrowScale, y: curPx.y };
      const vyEnd = { x: curPx.x, y: curPx.y - cur.vy * vArrowScale };
      const vEnd = { x: curPx.x + cur.vx * vArrowScale, y: curPx.y - cur.vy * vArrowScale };

      if (showComponents) {
        drawVectorArrow(ctx, curPx.x, curPx.y, vxEnd.x, vxEnd.y, '#059669', 2, true);
        drawVectorArrow(ctx, curPx.x, curPx.y, vyEnd.x, vyEnd.y, '#D97706', 2, true);
      }
      if (showResultant) {
        drawVectorArrow(ctx, curPx.x, curPx.y, vEnd.x, vEnd.y, '#0F172A', 2.8);
      }

      // Downward g arrow
      drawVectorArrow(ctx, curPx.x, curPx.y, curPx.x, curPx.y + 34, '#DC2626', 2.2);

      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc(curPx.x, curPx.y, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (showLabels) {
        if (showComponents) {
          drawBadge(ctx, vxEnd.x + 6, vxEnd.y, `vx=${formatNum(cur.vx, 1)}`, '#047857');
          if (Math.abs(cur.vy) > 0.3) {
            drawBadge(ctx, vyEnd.x - 8, vyEnd.y, `vy=${formatNum(cur.vy, 1)}`, '#B45309', 'right');
          }
        }
        drawBadge(ctx, curPx.x, curPx.y + 44, 'g', '#B91C1C', 'center');
      }
    } else if (mode === 'circular') {
      const cx = w / 2;
      const cy = h / 2;
      const rPx = Math.min(w, h) * 0.31 * zoom;
      const meterToPx = rPx / radius;

      if (showGrid) {
        ctx.strokeStyle = '#F1F5F9';
        ctx.lineWidth = 1;
        const step = 32;
        for (let gx = cx % step; gx < w; gx += step) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }
        for (let gy = cy % step; gy < h; gy += step) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }
      }

      // Axes through center
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(w - 20, cy);
      ctx.moveTo(cx, 20);
      ctx.lineTo(cx, h - 20);
      ctx.stroke();

      if (showAxisLabels) {
        ctx.fillStyle = '#64748B';
        ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('+x', w - 28, cy - 8);
        ctx.fillText('+y', cx + 8, 22);
      }

      // Orbit ring
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const st = circularStateAtTime(radius, circSpeed0, tangentialAccel, tNow);
      const px = cx + st.x * meterToPx;
      const py = cy - st.y * meterToPx;

      // Swept angle arc
      ctx.strokeStyle = '#93C5FD';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, -st.thetaRad, true);
      ctx.stroke();

      // Radius arm
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Velocity & Acceleration vector scaling (keep legible across speeds)
      const vScale = 6.5;
      const aScale = Math.min(10, 72 / Math.max(4, st.aTotal));

      const vTip = { x: px + st.vx * vScale, y: py - st.vy * vScale };
      drawVectorArrow(ctx, px, py, vTip.x, vTip.y, '#059669', 2.8);

      // Inward radial centripetal vector
      const cos = Math.cos(st.thetaRad);
      const sin = Math.sin(st.thetaRad);
      const acVec = { x: -st.ac * cos, y: -st.ac * sin };
      const atVec = { x: -st.at * sin, y: st.at * cos };

      const acTip = { x: px + acVec.x * aScale, y: py - acVec.y * aScale };
      const atTip = { x: px + atVec.x * aScale, y: py - atVec.y * aScale };
      const aNetTip = { x: px + st.ax * aScale, y: py - st.ay * aScale };

      if (showComponents) {
        drawVectorArrow(ctx, px, py, acTip.x, acTip.y, '#DC2626', 2.4, Math.abs(st.at) > 0.05);
        if (Math.abs(st.at) > 0.05) {
          drawVectorArrow(ctx, px, py, atTip.x, atTip.y, '#D97706', 2.4, true);
          ctx.save();
          ctx.strokeStyle = '#CBD5E1';
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(acTip.x, acTip.y);
          ctx.lineTo(aNetTip.x, aNetTip.y);
          ctx.moveTo(atTip.x, atTip.y);
          ctx.lineTo(aNetTip.x, aNetTip.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      if (showResultant) {
        drawVectorArrow(ctx, px, py, aNetTip.x, aNetTip.y, '#4F46E5', 3);
      }

      // Center dot & orbiting particle
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (showLabels) {
        const rMidX = cx + st.x * meterToPx * 0.45;
        const rMidY = cy - st.y * meterToPx * 0.45;
        drawBadge(ctx, rMidX + 12, rMidY + 12, `R=${formatNum(radius, 1)}m`, '#475569', 'left');
        drawBadge(ctx, vTip.x + 6, vTip.y, `v=${formatNum(st.speed, 1)}`, '#047857');
        if (showComponents) {
          drawBadge(ctx, acTip.x - 8, acTip.y - 12, `ac=${formatNum(st.ac, 1)}`, '#B91C1C', 'right');
          if (Math.abs(st.at) > 0.05) {
            drawBadge(ctx, atTip.x + 6, atTip.y - 10, `at=${formatNum(st.at, 1)}`, '#B45309');
          }
        }
        if (showResultant && Math.abs(st.at) > 0.05) {
          drawBadge(ctx, aNetTip.x, aNetTip.y - 12, `|a|=${formatNum(st.aTotal, 1)}`, '#4F46E5', 'center');
        }
      }
    } else {
      // Relative velocity: River-boat crossing
      const summary = riverCrossingSummary(riverWidth, boatSpeed, upstreamAngleDeg, currentSpeed);
      const bankTopY = 76;
      const bankBotY = h - 74;
      const channelH = bankBotY - bankTopY;
      const scale = (channelH / riverWidth) * Math.min(1.2, zoom);
      const startX = w * 0.34;
      const startY = bankBotY;

      // River water background
      ctx.fillStyle = '#EFF6FF';
      ctx.fillRect(0, bankTopY, w, channelH);
      // Banks
      ctx.fillStyle = '#ECFDF5';
      ctx.fillRect(0, 0, w, bankTopY);
      ctx.fillRect(0, bankBotY, w, h - bankBotY);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, bankTopY);
      ctx.lineTo(w, bankTopY);
      ctx.moveTo(0, bankBotY);
      ctx.lineTo(w, bankBotY);
      ctx.stroke();

      // Animated water current stream chevrons
      if (showGrid && Math.abs(currentSpeed) > 0.05) {
        ctx.save();
        ctx.strokeStyle = '#BFDBFE';
        ctx.lineWidth = 1.8;
        const offset = (tNow * currentSpeed * 18) % 80;
        for (let row = 1; row <= 3; row++) {
          const ry = bankTopY + (channelH * row) / 4;
          for (let rx = -80 + offset; rx < w + 80; rx += 80) {
            const dir = currentSpeed >= 0 ? 1 : -1;
            ctx.beginPath();
            ctx.moveTo(rx - 8 * dir, ry - 5);
            ctx.lineTo(rx, ry);
            ctx.lineTo(rx - 8 * dir, ry + 5);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // Straight-across target line & dock
      ctx.save();
      ctx.strokeStyle = '#94A3B8';
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(startX, bankBotY);
      ctx.lineTo(startX, bankTopY);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(startX - 10, bankTopY - 6, 20, 6);
      if (showAxisLabels) {
        drawBadge(ctx, startX, bankTopY - 22, 'Target Dock (0 drift)', '#334155', 'center');
        ctx.fillStyle = '#475569';
        ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText(`River Width W = ${formatNum(riverWidth, 0)} m`, 18, bankTopY + 18);
        ctx.fillText('Downstream (+x) →', w - 124, bankTopY + 18);
      }

      // Actual shore path & boat position at tNow (wrap within crossingTime)
      const effectiveTime = Number.isFinite(summary.crossingTime)
        ? Math.min(tNow % Math.max(0.5, summary.crossingTime + 1), summary.crossingTime)
        : Math.min(tNow, 12);

      const landX = Number.isFinite(summary.downstreamDrift)
        ? startX + summary.downstreamDrift * scale
        : startX + summary.vBG.x * 15 * scale;
      const landY = Number.isFinite(summary.downstreamDrift) ? bankTopY : startY - summary.vBG.y * 15 * scale;

      if (showResultant) {
        ctx.save();
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(landX, landY);
        ctx.stroke();
        ctx.restore();
      }

      const bx = startX + summary.vBG.x * effectiveTime * scale;
      const by = startY - summary.vBG.y * effectiveTime * scale;

      // Velocity triangle at boat
      const vPx = 15;
      const bwTip = { x: bx + summary.vBW.x * vPx, y: by - summary.vBW.y * vPx };
      const wgTip = { x: bwTip.x + summary.vWG.x * vPx, y: bwTip.y - summary.vWG.y * vPx };
      const bgTip = { x: bx + summary.vBG.x * vPx, y: by - summary.vBG.y * vPx };

      if (showComponents) {
        drawVectorArrow(ctx, bx, by, bwTip.x, bwTip.y, '#2563EB', 2.5);
        drawVectorArrow(ctx, bwTip.x, bwTip.y, wgTip.x, wgTip.y, '#059669', 2.5);
      }
      if (showResultant) {
        drawVectorArrow(ctx, bx, by, bgTip.x, bgTip.y, '#DC2626', 3);
      }

      // Boat hull oriented along boat heading v_BW
      const headingCanvasAngle = Math.atan2(-summary.vBW.y, summary.vBW.x);
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(headingCanvasAngle);
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-9, -7);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-9, 7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      if (showLabels) {
        if (showComponents) {
          drawBadge(ctx, (bx + bwTip.x) / 2 - 10, (by + bwTip.y) / 2, 'v_BW', '#1D4ED8', 'right');
          drawBadge(ctx, (bwTip.x + wgTip.x) / 2, bwTip.y - 12, 'v_WG', '#047857', 'center');
        }
        if (showResultant) {
          drawBadge(ctx, bgTip.x + 8, bgTip.y, `v_BG=${formatNum(summary.groundSpeed, 1)}`, '#B91C1C');
        }
        if (Number.isFinite(summary.downstreamDrift)) {
          drawBadge(
            ctx,
            Math.max(60, Math.min(w - 70, landX)),
            bankTopY - 6,
            `Drift: ${formatNum(summary.downstreamDrift, 1)} m`,
            '#B91C1C',
            'center',
          );
        }
      }
    }

    ctx.restore();
  }, [
    mode,
    size,
    tNow,
    vx0,
    vy0,
    ax,
    ay,
    t1,
    t2,
    tMax,
    launchSpeed,
    launchAngleDeg,
    launchHeight,
    gravity,
    showComplementary,
    radius,
    circSpeed0,
    tangentialAccel,
    riverWidth,
    boatSpeed,
    upstreamAngleDeg,
    currentSpeed,
    showGrid,
    showAxisLabels,
    showLabels,
    showComponents,
    showResultant,
    zoom,
  ]);

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={ariaLabel}
        style={{ width: size.width, height: size.height }}
        className="block rounded-lg border border-slate-100 select-none"
      />
    </div>
  );
}
