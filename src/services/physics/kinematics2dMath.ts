import type { Vector2D } from '../../types/physics';
import { degToRad, radToDeg } from './vectorMath';

export function position2D(
  x0: number,
  y0: number,
  vx0: number,
  vy0: number,
  ax: number,
  ay: number,
  t: number,
): Vector2D {
  return {
    x: x0 + vx0 * t + 0.5 * ax * t * t,
    y: y0 + vy0 * t + 0.5 * ay * t * t,
  };
}

export function velocity2D(
  vx0: number,
  vy0: number,
  ax: number,
  ay: number,
  t: number,
): Vector2D {
  return {
    x: vx0 + ax * t,
    y: vy0 + ay * t,
  };
}

export function displacement2D(r1: Vector2D, r2: Vector2D): Vector2D {
  return {
    x: r2.x - r1.x,
    y: r2.y - r1.y,
  };
}

export function averageVelocity2D(r1: Vector2D, r2: Vector2D, dt: number): Vector2D {
  if (Math.abs(dt) < 1e-9) return { x: 0, y: 0 };
  return {
    x: (r2.x - r1.x) / dt,
    y: (r2.y - r1.y) / dt,
  };
}

export interface AccelerationDecomposition2D {
  aParallelVec: Vector2D;
  aPerpVec: Vector2D;
  aParallelSigned: number;
  aPerpMag: number;
  isSpeedingUp: boolean;
}

/**
 * Decomposes acceleration a = (ax, ay) into components parallel (a_||)
 * and perpendicular (a_perp) to velocity v = (vx, vy).
 */
export function decomposeAcceleration2D(
  vx: number,
  vy: number,
  ax: number,
  ay: number,
): AccelerationDecomposition2D {
  const vMag = Math.hypot(vx, vy);
  if (vMag < 1e-9) {
    return {
      aParallelVec: { x: ax, y: ay },
      aPerpVec: { x: 0, y: 0 },
      aParallelSigned: Math.hypot(ax, ay),
      aPerpMag: 0,
      isSpeedingUp: Math.hypot(ax, ay) > 1e-9,
    };
  }
  const ux = vx / vMag;
  const uy = vy / vMag;
  const aParallelSigned = ax * ux + ay * uy;
  const aParallelVec = { x: aParallelSigned * ux, y: aParallelSigned * uy };
  const aPerpVec = { x: ax - aParallelVec.x, y: ay - aParallelVec.y };
  const aPerpMag = Math.hypot(aPerpVec.x, aPerpVec.y);
  return {
    aParallelVec,
    aPerpVec,
    aParallelSigned,
    aPerpMag,
    isSpeedingUp: aParallelSigned > 1e-6,
  };
}

export function projectileComponents(v0: number, angleDeg: number): Vector2D {
  const rad = degToRad(angleDeg);
  return {
    x: v0 * Math.cos(rad),
    y: v0 * Math.sin(rad),
  };
}

export interface ProjectileState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  angleDeg: number;
}

export function projectileStateAtTime(
  v0: number,
  angleDeg: number,
  y0: number,
  g: number,
  t: number,
): ProjectileState {
  const { x: vx0, y: vy0 } = projectileComponents(v0, angleDeg);
  const x = vx0 * t;
  const y = y0 + vy0 * t - 0.5 * g * t * t;
  const vx = vx0;
  const vy = vy0 - g * t;
  return {
    x,
    y,
    vx,
    vy,
    speed: Math.hypot(vx, vy),
    angleDeg: radToDeg(Math.atan2(vy, vx)),
  };
}

export function projectileHeightAtX(
  x: number,
  v0: number,
  angleDeg: number,
  y0: number,
  g: number,
): number | null {
  const rad = degToRad(angleDeg);
  const cos = Math.cos(rad);
  if (Math.abs(cos) < 1e-6 || v0 <= 0) return null;
  const tan = Math.tan(rad);
  return y0 + x * tan - (g * x * x) / (2 * v0 * v0 * cos * cos);
}

export interface ProjectileFlightSummary {
  timeOfFlight: number;
  timeToApex: number;
  maxHeight: number;
  horizontalRange: number;
  impactSpeed: number;
}

export function projectileFlightSummary(
  v0: number,
  angleDeg: number,
  y0: number,
  g: number,
): ProjectileFlightSummary {
  const safeG = Math.max(0.1, g);
  const safeY0 = Math.max(0, y0);
  const { x: vx0, y: vy0 } = projectileComponents(v0, angleDeg);

  // Solve -0.5*g*t^2 + vy0*t + y0 = 0 -> positive root
  const discriminant = vy0 * vy0 + 2 * safeG * safeY0;
  const timeOfFlight = (vy0 + Math.sqrt(Math.max(0, discriminant))) / safeG;

  const timeToApex = vy0 > 0 ? vy0 / safeG : 0;
  const maxHeight = safeY0 + (vy0 > 0 ? (vy0 * vy0) / (2 * safeG) : 0);
  const horizontalRange = vx0 * timeOfFlight;
  const vyImpact = vy0 - safeG * timeOfFlight;
  const impactSpeed = Math.hypot(vx0, vyImpact);

  return {
    timeOfFlight,
    timeToApex,
    maxHeight,
    horizontalRange,
    impactSpeed,
  };
}

export interface CircularMotionState {
  thetaRad: number;
  thetaDeg: number;
  x: number;
  y: number;
  speed: number;
  vx: number;
  vy: number;
  ac: number;
  at: number;
  aTotal: number;
  ax: number;
  ay: number;
  period: number | null;
}

/**
 * Computes instantaneous 2D kinematics on a circle of radius R centered at origin,
 * starting at theta(0) = 0 with initial speed v0 and constant tangential acceleration at.
 * Motion proceeds counterclockwise when speed >= 0.
 */
export function circularStateAtTime(
  radius: number,
  v0: number,
  at: number,
  t: number,
): CircularMotionState {
  const R = Math.max(0.1, radius);
  const speed = Math.max(0, v0 + at * t);
  // Arc length s = v0*t + 0.5*at*t^2 (clamped cleanly if v0 + at*t hits 0)
  let s = v0 * t + 0.5 * at * t * t;
  if (at < 0 && v0 + at * t < 0) {
    const tStop = -v0 / at;
    s = v0 * tStop + 0.5 * at * tStop * tStop;
  }
  const thetaRad = s / R;
  const thetaDeg = ((radToDeg(thetaRad) % 360) + 360) % 360;

  const cos = Math.cos(thetaRad);
  const sin = Math.sin(thetaRad);
  const x = R * cos;
  const y = R * sin;

  // Tangent unit vector (CCW): (-sin, cos); Radial outward unit vector: (cos, sin)
  const vx = -speed * sin;
  const vy = speed * cos;

  const ac = (speed * speed) / R;
  const effectiveAt = speed === 0 && at < 0 ? 0 : at;
  // Total acceleration vector = (-ac * cos - effectiveAt * sin, -ac * sin + effectiveAt * cos)
  const ax = -ac * cos - effectiveAt * sin;
  const ay = -ac * sin + effectiveAt * cos;
  const aTotal = Math.hypot(ac, effectiveAt);
  const period = Math.abs(at) < 1e-9 && speed > 1e-6 ? (2 * Math.PI * R) / speed : null;

  return {
    thetaRad,
    thetaDeg,
    x,
    y,
    speed,
    vx,
    vy,
    ac,
    at: effectiveAt,
    aTotal,
    ax,
    ay,
    period,
  };
}

export interface RiverCrossingSummary {
  vBW: Vector2D;
  vWG: Vector2D;
  vBG: Vector2D;
  groundSpeed: number;
  crossingTime: number;
  downstreamDrift: number;
  actualPathLength: number;
  upstreamZeroDriftAngleDeg: number | null;
}

/**
 * River-boat 2D relative velocity model:
 * - +x points downstream along the river bank; +y points straight across the river (width W).
 * - upstreamAngleDeg = 0 aims straight across (+y); positive values aim upstream (-x).
 */
export function riverCrossingSummary(
  riverWidth: number,
  boatSpeedWater: number,
  upstreamAngleDeg: number,
  currentSpeed: number,
): RiverCrossingSummary {
  const rad = degToRad(upstreamAngleDeg);
  const vBW: Vector2D = {
    x: -boatSpeedWater * Math.sin(rad),
    y: boatSpeedWater * Math.cos(rad),
  };
  const vWG: Vector2D = {
    x: currentSpeed,
    y: 0,
  };
  const vBG: Vector2D = {
    x: vBW.x + vWG.x,
    y: vBW.y + vWG.y,
  };
  const groundSpeed = Math.hypot(vBG.x, vBG.y);
  const crossingTime = vBG.y > 1e-4 ? riverWidth / vBG.y : Infinity;
  const downstreamDrift = Number.isFinite(crossingTime) ? vBG.x * crossingTime : Infinity;
  const actualPathLength = Number.isFinite(crossingTime) ? Math.hypot(riverWidth, downstreamDrift) : Infinity;
  const upstreamZeroDriftAngleDeg =
    boatSpeedWater > Math.abs(currentSpeed)
      ? radToDeg(Math.asin(currentSpeed / boatSpeedWater))
      : null;

  return {
    vBW,
    vWG,
    vBG,
    groundSpeed,
    crossingTime,
    downstreamDrift,
    actualPathLength,
    upstreamZeroDriftAngleDeg,
  };
}
