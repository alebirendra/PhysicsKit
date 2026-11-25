import { useEffect, useRef, useState } from 'react';
import {
  accelerationAtTime,
  positionAtTime,
  riemannMidpointIntegral,
  velocityAtTime,
} from '../../services/physics/kinematicsMath';
import { clampNumber, formatNum } from '../../services/physics/vectorMath';

export type KinematicsCanvasMode =
  | 'motion'
  | 'velocity-slopes'
  | 'acceleration-slopes'
  | 'constant-accel'
  | 'integrals';

interface KinematicsCanvasProps {
  mode: KinematicsCanvasMode;
  x0: number;
  v0: number;
  a0: number;
  jerk: number;
  tMax: number;
  tNow: number;
  t1: number;
  t2: number;
  integralTarget?: 'velocity' | 'acceleration';
  riemannBins?: number;
  showGrid: boolean;
  showAxisLabels: boolean;
  showLabels: boolean;
  showAreaDecomposition?: boolean;
  zoom?: number;
  onScrubTime?: (t: number) => void;
  ariaLabel: string;
}

interface GraphPlotSpec {
  title: string;
  unitLabel: string;
  color: string;
  fn: (t: number) => number;
  showSecant?: boolean;
  showTangent?: boolean;
  slopeAtNow?: number;
  shadeArea?: 'signed' | 'rect-triangle' | 'riemann';
  rectBaseValue?: number;
  riemannBins?: number;
  extraShiftCurves?: { offset: number; label: string }[];
}

function drawArrow1D(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y: number,
  x2: number,
  color: string,
  lineWidth = 2.5,
) {
  const dx = x2 - x1;
  if (Math.abs(dx) < 3) return;
  const dir = dx > 0 ? 1 : -1;
  const headLen = Math.min(9, Math.abs(dx) * 0.45);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2 - dir * headLen * 0.6, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y);
  ctx.lineTo(x2 - dir * headLen, y - 4.5);
  ctx.lineTo(x2 - dir * headLen, y + 4.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function KinematicsCanvas({
  mode,
  x0,
  v0,
  a0,
  jerk,
  tMax,
  tNow,
  t1,
  t2,
  integralTarget = 'velocity',
  riemannBins = 10,
  showGrid,
  showAxisLabels,
  showLabels,
  showAreaDecomposition = true,
  zoom = 1,
  onScrubTime,
  ariaLabel,
}: KinematicsCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 640, height: 500 });
  const draggingRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(300, Math.round(rect.width));
      const h = Math.max(400, Math.min(560, Math.round(w * 0.78)));
      setSize({ width: w, height: h });
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const padLeft = 54;
  const padRight = 22;

  const clientXToTime = (clientX: number): number | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const plotW = Math.max(100, size.width - padLeft - padRight);
    const frac = clampNumber((px - padLeft) / plotW, 0, 1);
    return Number((frac * tMax).toFixed(2));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size.width * dpr);
    canvas.height = Math.round(size.height * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.width, size.height);

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size.width, size.height);

    const w = size.width;
    const h = size.height;
    const plotW = Math.max(100, w - padLeft - padRight);

    const ta = Math.min(t1, t2);
    const tb = Math.max(t1, t2);

    // 1. TOP 1D MOTION TRACK STRIP
    const trackTop = 10;
    const trackH = 82;
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(12, trackTop, w - 24, trackH, 8);
    ctx.fill();
    ctx.stroke();

    // Determine spatial bounds over [0, tMax]
    let minX = x0;
    let maxX = x0;
    const samples = 100;
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * tMax;
      const x = positionAtTime(x0, v0, a0, jerk, t);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    }
    minX = Math.min(minX, 0);
    maxX = Math.max(maxX, 0);
    const spanX = Math.max(10, (maxX - minX) / Math.max(0.5, zoom));
    const midX = 0.5 * (minX + maxX);
    const xLow = midX - spanX * 0.58;
    const xHigh = midX + spanX * 0.58;

    const trackLeft = 36;
    const trackRight = w - 36;
    const trackSpanPx = trackRight - trackLeft;
    const worldXToTrackPx = (xVal: number) =>
      trackLeft + ((xVal - xLow) / (xHigh - xLow)) * trackSpanPx;

    const railY = trackTop + 50;
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(trackLeft, railY);
    ctx.lineTo(trackRight, railY);
    ctx.stroke();

    // Tick marks on 1D track
    const roughStep = (xHigh - xLow) / 7;
    const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const tickStep =
      roughStep / mag < 1.5 ? mag : roughStep / mag < 3.5 ? 2 * mag : roughStep / mag < 7.5 ? 5 * mag : 10 * mag;

    const firstTick = Math.ceil(xLow / tickStep) * tickStep;
    ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    for (let tx = firstTick; tx <= xHigh + 1e-6; tx += tickStep) {
      const px = worldXToTrackPx(tx);
      const isZero = Math.abs(tx) < tickStep * 0.05;
      ctx.strokeStyle = isZero ? '#0F172A' : '#CBD5E1';
      ctx.lineWidth = isZero ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(px, railY - (isZero ? 8 : 5));
      ctx.lineTo(px, railY + (isZero ? 8 : 5));
      ctx.stroke();
      if (showAxisLabels) {
        ctx.fillStyle = isZero ? '#0F172A' : '#64748B';
        ctx.fillText(`${formatNum(tx, 0)}`, px, railY + 20);
      }
    }

    // Track header label
    ctx.textAlign = 'left';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('1D Track (+x in meters)', 22, trackTop + 18);

    // Highlight displacement between x(t1) and x(t2) on track
    const xAt1 = positionAtTime(x0, v0, a0, jerk, ta);
    const xAt2 = positionAtTime(x0, v0, a0, jerk, tb);
    const p1x = worldXToTrackPx(xAt1);
    const p2x = worldXToTrackPx(xAt2);

    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(p1x, railY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(p2x, railY, 4, 0, Math.PI * 2);
    ctx.fill();

    if (Math.abs(p2x - p1x) > 4) {
      drawArrow1D(ctx, p1x, railY - 16, p2x, '#DC2626', 2);
      if (showLabels) {
        ctx.font = '600 10px system-ui, sans-serif';
        ctx.fillStyle = '#B91C1C';
        ctx.textAlign = 'center';
        ctx.fillText(`Δx = ${formatNum(xAt2 - xAt1, 1)} m`, 0.5 * (p1x + p2x), railY - 22);
      }
    }

    // Live particle at tNow
    const xNow = positionAtTime(x0, v0, a0, jerk, tNow);
    const vNow = velocityAtTime(v0, a0, jerk, tNow);
    const aNow = accelerationAtTime(a0, jerk, tNow);
    const pNowX = clampNumber(worldXToTrackPx(xNow), trackLeft, trackRight);

    // Velocity & acceleration arrows attached to particle
    const vArrowLen = clampNumber(vNow * 2.5, -56, 56);
    const aArrowLen = clampNumber(aNow * 4, -42, 42);
    drawArrow1D(ctx, pNowX, railY - 7, pNowX + vArrowLen, '#059669', 2.4);
    drawArrow1D(ctx, pNowX, railY + 7, pNowX + aArrowLen, '#DC2626', 2);

    ctx.fillStyle = '#2563EB';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pNowX, railY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (showLabels) {
      ctx.font = '600 10px ui-monospace, monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#1D4ED8';
      ctx.fillText(
        `t=${formatNum(tNow, 2)}s  x=${formatNum(xNow, 1)}m  v=${formatNum(vNow, 1)}m/s  a=${formatNum(aNow, 1)}m/s²`,
        w - 22,
        trackTop + 18,
      );
    }

    // 2. CONFIGURE TIME-SERIES PLOTS BASED ON MODE
    const xFn = (t: number) => positionAtTime(x0, v0, a0, jerk, t);
    const vFn = (t: number) => velocityAtTime(v0, a0, jerk, t);
    const aFn = (t: number) => accelerationAtTime(a0, jerk, t);

    let plots: GraphPlotSpec[] = [];
    if (mode === 'motion') {
      plots = [
        {
          title: 'Position x(t)',
          unitLabel: 'm',
          color: '#2563EB',
          fn: xFn,
          showSecant: false,
          showTangent: false,
        },
        {
          title: 'Velocity v(t)',
          unitLabel: 'm/s',
          color: '#059669',
          fn: vFn,
        },
      ];
    } else if (mode === 'velocity-slopes') {
      plots = [
        {
          title: 'Position x(t) — Secant (v_avg) vs. Tangent (v_inst)',
          unitLabel: 'm',
          color: '#2563EB',
          fn: xFn,
          showSecant: true,
          showTangent: true,
          slopeAtNow: vNow,
        },
        {
          title: 'Instantaneous Velocity v(t) = dx/dt',
          unitLabel: 'm/s',
          color: '#059669',
          fn: vFn,
        },
      ];
    } else if (mode === 'acceleration-slopes') {
      plots = [
        {
          title: 'Velocity v(t) — Secant (a_avg) vs. Tangent (a_inst)',
          unitLabel: 'm/s',
          color: '#059669',
          fn: vFn,
          showSecant: true,
          showTangent: true,
          slopeAtNow: aNow,
        },
        {
          title: 'Instantaneous Acceleration a(t) = dv/dt',
          unitLabel: 'm/s²',
          color: '#DC2626',
          fn: aFn,
        },
      ];
    } else if (mode === 'constant-accel') {
      plots = [
        {
          title: 'Acceleration a(t) — Area = Δv',
          unitLabel: 'm/s²',
          color: '#DC2626',
          fn: aFn,
          shadeArea: 'signed',
        },
        {
          title: 'Velocity v(t) — Area = Δx (Rect + Tri)',
          unitLabel: 'm/s',
          color: '#059669',
          fn: vFn,
          shadeArea: showAreaDecomposition ? 'rect-triangle' : 'signed',
          rectBaseValue: v0,
        },
        {
          title: 'Position x(t) = x₀ + v₀t + ½at²',
          unitLabel: 'm',
          color: '#2563EB',
          fn: xFn,
        },
      ];
    } else {
      // integrals mode
      if (integralTarget === 'acceleration') {
        plots = [
          {
            title: 'Acceleration a(t) — Riemann Midpoint Sum → ∫ a(t) dt = Δv',
            unitLabel: 'm/s²',
            color: '#DC2626',
            fn: aFn,
            shadeArea: 'riemann',
            riemannBins,
          },
          {
            title: 'Velocity Family v(t) = ∫ a(t) dt + C (C = v₀)',
            unitLabel: 'm/s',
            color: '#2563EB',
            fn: vFn,
            extraShiftCurves: [
              { offset: -6, label: 'C − 6' },
              { offset: 6, label: 'C + 6' },
            ],
          },
        ];
      } else {
        plots = [
          {
            title: 'Velocity v(t) — Signed Riemann Sum → ∫ v(t) dt = Δx',
            unitLabel: 'm/s',
            color: '#059669',
            fn: vFn,
            shadeArea: 'riemann',
            riemannBins,
          },
          {
            title: 'Position x(t) = x(t₁) + ∫[t₁→t] v(u) du',
            unitLabel: 'm',
            color: '#2563EB',
            fn: xFn,
          },
        ];
      }
    }

    // 3. RENDER EACH PLOT
    const graphsTop = trackTop + trackH + 12;
    const graphsAvailH = h - graphsTop - 18;
    const gap = 14;
    const plotH = (graphsAvailH - gap * (plots.length - 1)) / plots.length;

    const timeToPx = (t: number) => padLeft + (clampNumber(t, 0, tMax) / tMax) * plotW;

    plots.forEach((plot, pIdx) => {
      const py0 = graphsTop + pIdx * (plotH + gap);
      const py1 = py0 + plotH;

      // Compute Y bounds across [0, tMax]
      let yMin = 0;
      let yMax = 0;
      for (let i = 0; i <= 120; i++) {
        const t = (i / 120) * tMax;
        const val = plot.fn(t);
        yMin = Math.min(yMin, val);
        yMax = Math.max(yMax, val);
        if (plot.extraShiftCurves) {
          for (const sc of plot.extraShiftCurves) {
            yMin = Math.min(yMin, val + sc.offset);
            yMax = Math.max(yMax, val + sc.offset);
          }
        }
      }
      const rawSpan = Math.max(4, (yMax - yMin) / Math.max(0.5, zoom));
      const padY = rawSpan * 0.16;
      const yLow = yMin - padY;
      const yHigh = yMax + padY;

      const valToPx = (val: number) =>
        py1 - ((val - yLow) / Math.max(1e-6, yHigh - yLow)) * plotH;

      const zeroY = clampNumber(valToPx(0), py0, py1);

      // Plot frame
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.fillRect(padLeft, py0, plotW, plotH);
      ctx.strokeRect(padLeft, py0, plotW, plotH);

      // Grid lines
      if (showGrid) {
        ctx.strokeStyle = '#F1F5F9';
        ctx.lineWidth = 1;
        const tTicks = Math.min(10, Math.max(4, Math.round(tMax)));
        for (let i = 1; i < tTicks; i++) {
          const gx = timeToPx((i / tTicks) * tMax);
          ctx.beginPath();
          ctx.moveTo(gx, py0);
          ctx.lineTo(gx, py1);
          ctx.stroke();
        }
        for (let j = 1; j <= 3; j++) {
          const gy = py0 + (j / 4) * plotH;
          ctx.beginPath();
          ctx.moveTo(padLeft, gy);
          ctx.lineTo(padLeft + plotW, gy);
          ctx.stroke();
        }
      }

      // Clip inside plot area for shaded areas & curves
      ctx.save();
      ctx.beginPath();
      ctx.rect(padLeft, py0, plotW, plotH);
      ctx.clip();

      // Zero horizontal axis
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(padLeft, zeroY);
      ctx.lineTo(padLeft + plotW, zeroY);
      ctx.stroke();

      // Highlight [t1, t2] window gently
      const xT1 = timeToPx(ta);
      const xT2 = timeToPx(tb);
      if (xT2 > xT1) {
        ctx.fillStyle = 'rgba(241, 245, 249, 0.55)';
        ctx.fillRect(xT1, py0, xT2 - xT1, plotH);
      }

      // Shaded areas
      if (plot.shadeArea === 'signed' && tb > ta) {
        const steps = 60;
        for (let i = 0; i < steps; i++) {
          const a = ta + (i / steps) * (tb - ta);
          const b = ta + ((i + 1) / steps) * (tb - ta);
          const mid = 0.5 * (a + b);
          const val = plot.fn(mid);
          const pxA = timeToPx(a);
          const pxB = timeToPx(b);
          const pxV = valToPx(val);
          ctx.fillStyle = val >= 0 ? 'rgba(37, 99, 235, 0.18)' : 'rgba(225, 29, 72, 0.18)';
          ctx.fillRect(pxA, Math.min(zeroY, pxV), Math.max(1, pxB - pxA + 0.5), Math.abs(pxV - zeroY));
        }
      } else if (plot.shadeArea === 'rect-triangle' && tb > ta) {
        const vBase = plot.rectBaseValue ?? plot.fn(ta);
        const yBase = valToPx(vBase);
        const yEnd = valToPx(plot.fn(tb));
        // Rectangle part from 0 to vBase
        ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
        ctx.fillRect(xT1, Math.min(zeroY, yBase), xT2 - xT1, Math.abs(yBase - zeroY));
        // Triangle part from vBase to v(t2)
        ctx.fillStyle = 'rgba(5, 150, 105, 0.25)';
        ctx.beginPath();
        ctx.moveTo(xT1, yBase);
        ctx.lineTo(xT2, yBase);
        ctx.lineTo(xT2, yEnd);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.5)';
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(xT1, yBase);
        ctx.lineTo(xT2, yBase);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (plot.shadeArea === 'riemann' && tb > ta) {
        const { bars } = riemannMidpointIntegral(plot.fn, ta, tb, plot.riemannBins ?? 10);
        for (const bar of bars) {
          const bx1 = timeToPx(bar.tStart);
          const bx2 = timeToPx(bar.tEnd);
          const by = valToPx(bar.value);
          ctx.fillStyle = bar.value >= 0 ? 'rgba(37, 99, 235, 0.24)' : 'rgba(225, 29, 72, 0.24)';
          ctx.strokeStyle = bar.value >= 0 ? 'rgba(29, 78, 216, 0.7)' : 'rgba(190, 18, 60, 0.7)';
          ctx.lineWidth = 1;
          const topY = Math.min(zeroY, by);
          const rectH = Math.abs(by - zeroY);
          ctx.fillRect(bx1, topY, Math.max(1, bx2 - bx1), rectH);
          ctx.strokeRect(bx1, topY, Math.max(1, bx2 - bx1), rectH);
        }
      }

      // Optional family curves (antiderivative + C)
      if (plot.extraShiftCurves) {
        for (const sc of plot.extraShiftCurves) {
          ctx.strokeStyle = '#CBD5E1';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          for (let i = 0; i <= 120; i++) {
            const t = (i / 120) * tMax;
            const px = timeToPx(t);
            const py = valToPx(plot.fn(t) + sc.offset);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Main function curve
      ctx.strokeStyle = plot.color;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let i = 0; i <= 160; i++) {
        const t = (i / 160) * tMax;
        const px = timeToPx(t);
        const py = valToPx(plot.fn(t));
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Secant line between t1 and t2
      if (plot.showSecant && tb > ta) {
        const y1 = plot.fn(ta);
        const y2 = plot.fn(tb);
        const secSlope = (y2 - y1) / (tb - ta);
        const extStart = Math.max(0, ta - 0.8);
        const extEnd = Math.min(tMax, tb + 0.8);
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(timeToPx(extStart), valToPx(y1 + secSlope * (extStart - ta)));
        ctx.lineTo(timeToPx(extEnd), valToPx(y1 + secSlope * (extEnd - ta)));
        ctx.stroke();
        ctx.setLineDash([]);

        // Endpoints
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(timeToPx(ta), valToPx(y1), 4.2, 0, Math.PI * 2);
        ctx.arc(timeToPx(tb), valToPx(y2), 4.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tangent line at tNow
      if (plot.showTangent && plot.slopeAtNow !== undefined) {
        const yNow = plot.fn(tNow);
        const m = plot.slopeAtNow;
        const span = tMax * 0.22;
        const lt1 = tNow - span;
        const lt2 = tNow + span;
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(timeToPx(lt1), valToPx(yNow + m * (lt1 - tNow)));
        ctx.lineTo(timeToPx(lt2), valToPx(yNow + m * (lt2 - tNow)));
        ctx.stroke();
      }

      // Vertical interval markers t1, t2
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(xT1, py0);
      ctx.lineTo(xT1, py1);
      ctx.moveTo(xT2, py0);
      ctx.lineTo(xT2, py1);
      ctx.stroke();
      ctx.setLineDash([]);

      // Playhead vertical cursor at tNow
      const xNowPx = timeToPx(tNow);
      const yNowPx = valToPx(plot.fn(tNow));
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(xNowPx, py0);
      ctx.lineTo(xNowPx, py1);
      ctx.stroke();

      ctx.fillStyle = plot.color;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(xNowPx, yNowPx, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Axis labels & Plot title
      ctx.textAlign = 'left';
      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.fillText(plot.title, padLeft + 8, py0 + 15);

      if (showAxisLabels) {
        ctx.font = '10px ui-monospace, monospace';
        ctx.fillStyle = '#64748B';
        ctx.textAlign = 'right';
        ctx.fillText(formatNum(yHigh, 1), padLeft - 6, py0 + 11);
        ctx.fillText('0', padLeft - 6, clampNumber(zeroY + 3, py0 + 22, py1 - 12));
        ctx.fillText(formatNum(yLow, 1), padLeft - 6, py1 - 4);
        ctx.fillText(plot.unitLabel, padLeft - 6, py0 + plotH * 0.5);
      }

      // Time axis ticks on bottom plot only
      if (pIdx === plots.length - 1 && showAxisLabels) {
        ctx.font = '10px ui-monospace, monospace';
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';
        const steps = Math.min(8, Math.max(4, Math.round(tMax)));
        for (let i = 0; i <= steps; i++) {
          const tVal = (i / steps) * tMax;
          ctx.fillText(`${formatNum(tVal, 1)}s`, timeToPx(tVal), py1 + 13);
        }
      }
    });
  }, [
    mode,
    x0,
    v0,
    a0,
    jerk,
    tMax,
    tNow,
    t1,
    t2,
    integralTarget,
    riemannBins,
    showGrid,
    showAxisLabels,
    showLabels,
    showAreaDecomposition,
    zoom,
    size,
  ]);

  return (
    <div ref={containerRef} className="w-full select-none">
      <canvas
        ref={canvasRef}
        aria-label={ariaLabel}
        role="img"
        style={{ width: size.width, height: size.height }}
        className="w-full rounded-lg border border-slate-200 cursor-ew-resize touch-none"
        onPointerDown={(e) => {
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          const nextT = clientXToTime(e.clientX);
          if (nextT !== null) onScrubTime?.(nextT);
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          const nextT = clientXToTime(e.clientX);
          if (nextT !== null) onScrubTime?.(nextT);
        }}
        onPointerUp={(e) => {
          draggingRef.current = false;
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
      />
      <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>Drag horizontally across any graph to scrub time t.</span>
        <span className="font-mono">
          Green arrow: v · Red arrow: a
        </span>
      </div>
    </div>
  );
}
