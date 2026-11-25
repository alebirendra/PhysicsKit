import { sanitizeFinite } from './vectorMath';

/**
 * Pure 1D kinematics & integral calculus math utilities.
 * Supports constant acceleration (jerk = 0) and linear time-varying acceleration a(t) = a0 + j*t.
 */

export function accelerationAtTime(a0: number, jerk: number, t: number): number {
  const sa = sanitizeFinite(a0);
  const sj = sanitizeFinite(jerk);
  const st = sanitizeFinite(t);
  return sa + sj * st;
}

export function velocityAtTime(v0: number, a0: number, jerk: number, t: number): number {
  const sv0 = sanitizeFinite(v0);
  const sa = sanitizeFinite(a0);
  const sj = sanitizeFinite(jerk);
  const st = sanitizeFinite(t);
  return sv0 + sa * st + 0.5 * sj * st * st;
}

export function positionAtTime(x0: number, v0: number, a0: number, jerk: number, t: number): number {
  const sx0 = sanitizeFinite(x0);
  const sv0 = sanitizeFinite(v0);
  const sa = sanitizeFinite(a0);
  const sj = sanitizeFinite(jerk);
  const st = sanitizeFinite(t);
  return sx0 + sv0 * st + 0.5 * sa * st * st + (1 / 6) * sj * st * st * st;
}

export function timeInterval(t1: number, t2: number): number {
  return sanitizeFinite(t2) - sanitizeFinite(t1);
}

export function displacement1D(
  x0: number,
  v0: number,
  a0: number,
  jerk: number,
  t1: number,
  t2: number,
): number {
  return positionAtTime(x0, v0, a0, jerk, t2) - positionAtTime(x0, v0, a0, jerk, t1);
}

export function deltaVelocity1D(
  v0: number,
  a0: number,
  jerk: number,
  t1: number,
  t2: number,
): number {
  return velocityAtTime(v0, a0, jerk, t2) - velocityAtTime(v0, a0, jerk, t1);
}

export function averageVelocity1D(
  x0: number,
  v0: number,
  a0: number,
  jerk: number,
  t1: number,
  t2: number,
): number {
  const dt = timeInterval(t1, t2);
  if (Math.abs(dt) < 1e-9) {
    return velocityAtTime(v0, a0, jerk, t1);
  }
  return displacement1D(x0, v0, a0, jerk, t1, t2) / dt;
}

export function averageAcceleration1D(
  v0: number,
  a0: number,
  jerk: number,
  t1: number,
  t2: number,
): number {
  const dt = timeInterval(t1, t2);
  if (Math.abs(dt) < 1e-9) {
    return accelerationAtTime(a0, jerk, t1);
  }
  return deltaVelocity1D(v0, a0, jerk, t1, t2) / dt;
}

export function totalDistance1D(
  v0: number,
  a0: number,
  jerk: number,
  t1: number,
  t2: number,
  samples = 400,
): number {
  const start = Math.min(sanitizeFinite(t1), sanitizeFinite(t2));
  const end = Math.max(sanitizeFinite(t1), sanitizeFinite(t2));
  const dt = end - start;
  if (dt <= 0) return 0;
  const n = Math.max(10, Math.round(samples));
  const step = dt / n;
  let dist = 0;
  for (let i = 0; i < n; i++) {
    const tMid = start + (i + 0.5) * step;
    dist += Math.abs(velocityAtTime(v0, a0, jerk, tMid)) * step;
  }
  return dist;
}

export function riemannMidpointIntegral(
  fn: (t: number) => number,
  t1: number,
  t2: number,
  subintervals: number,
): { sum: number; bars: { tStart: number; tEnd: number; tMid: number; value: number }[] } {
  const start = sanitizeFinite(t1);
  const end = sanitizeFinite(t2);
  const n = Math.max(1, Math.min(200, Math.round(subintervals)));
  const dt = (end - start) / n;
  const bars: { tStart: number; tEnd: number; tMid: number; value: number }[] = [];
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const a = start + i * dt;
    const b = a + dt;
    const mid = 0.5 * (a + b);
    const val = sanitizeFinite(fn(mid));
    sum += val * dt;
    bars.push({ tStart: a, tEnd: b, tMid: mid, value: val });
  }

  return { sum, bars };
}

export function constantAccelSpeedSquared(v0: number, a: number, dx: number): number {
  const sv0 = sanitizeFinite(v0);
  const sa = sanitizeFinite(a);
  const sdx = sanitizeFinite(dx);
  return sv0 * sv0 + 2 * sa * sdx;
}

export function motionBehaviorLabel(v: number, a: number): string {
  const eps = 1e-3;
  if (Math.abs(v) < eps && Math.abs(a) < eps) return 'At rest';
  if (Math.abs(v) < eps) return 'Momentarily at rest (turning or starting)';
  if (Math.abs(a) < eps) return 'Constant velocity';
  return v * a > 0 ? 'Speeding up (v and a same sign)' : 'Slowing down (v and a opposite signs)';
}
