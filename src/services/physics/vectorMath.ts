import type { PolarVector, Vector2D, Vector3D } from '../../types/physics';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export function sanitizeFinite(value: number, fallback = 0): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }
  return value;
}

export function clampNumber(value: number, min: number, max: number): number {
  const safe = sanitizeFinite(value, min);
  return Math.min(max, Math.max(min, safe));
}

export function degToRad(deg: number): number {
  return sanitizeFinite(deg) * DEG_TO_RAD;
}

export function radToDeg(rad: number): number {
  return sanitizeFinite(rad) * RAD_TO_DEG;
}

export function normalizeAngleDeg(deg: number): number {
  const safe = sanitizeFinite(deg);
  let mod = safe % 360;
  if (mod < 0) mod += 360;
  if (Math.abs(mod - 360) < 1e-9 || Math.abs(mod) < 1e-9) return 0;
  return mod;
}

export function fromPolar(magnitude: number, angleDeg: number): Vector2D {
  const r = Math.max(0, sanitizeFinite(magnitude));
  const rad = degToRad(angleDeg);
  const x = r * Math.cos(rad);
  const y = r * Math.sin(rad);
  return {
    x: Math.abs(x) < 1e-10 ? 0 : x,
    y: Math.abs(y) < 1e-10 ? 0 : y,
  };
}

export function magnitude2D(v: Vector2D): number {
  const x = sanitizeFinite(v.x);
  const y = sanitizeFinite(v.y);
  return Math.hypot(x, y);
}

export function toPolar(v: Vector2D): PolarVector {
  const x = sanitizeFinite(v.x);
  const y = sanitizeFinite(v.y);
  const mag = Math.hypot(x, y);
  if (mag < 1e-12) {
    return { magnitude: 0, angleDeg: 0 };
  }
  const angle = normalizeAngleDeg(radToDeg(Math.atan2(y, x)));
  return { magnitude: mag, angleDeg: angle };
}

export function addVectors2D(a: Vector2D, b: Vector2D): Vector2D {
  return {
    x: sanitizeFinite(a.x) + sanitizeFinite(b.x),
    y: sanitizeFinite(a.y) + sanitizeFinite(b.y),
  };
}

export function subtractVectors2D(a: Vector2D, b: Vector2D): Vector2D {
  return {
    x: sanitizeFinite(a.x) - sanitizeFinite(b.x),
    y: sanitizeFinite(a.y) - sanitizeFinite(b.y),
  };
}

export function negateVector2D(v: Vector2D): Vector2D {
  return {
    x: v.x === 0 ? 0 : -sanitizeFinite(v.x),
    y: v.y === 0 ? 0 : -sanitizeFinite(v.y),
  };
}

export function resolveVector(magnitude: number, angleDeg: number): {
  ax: number;
  ay: number;
  magnitude: number;
  angleDeg: number;
} {
  const m = Math.max(0, sanitizeFinite(magnitude));
  const angle = normalizeAngleDeg(angleDeg);
  const { x, y } = fromPolar(m, angle);
  return {
    ax: x,
    ay: y,
    magnitude: m,
    angleDeg: angle,
  };
}

export function dotProduct2D(a: Vector2D, b: Vector2D): number {
  return sanitizeFinite(a.x) * sanitizeFinite(b.x) + sanitizeFinite(a.y) * sanitizeFinite(b.y);
}

export function angleBetween2D(a: Vector2D, b: Vector2D): number {
  const magA = magnitude2D(a);
  const magB = magnitude2D(b);
  if (magA < 1e-12 || magB < 1e-12) return 0;
  const cosTheta = clampNumber(dotProduct2D(a, b) / (magA * magB), -1, 1);
  return radToDeg(Math.acos(cosTheta));
}

export function scalarProjection2D(a: Vector2D, ontoB: Vector2D): number {
  const magB = magnitude2D(ontoB);
  if (magB < 1e-12) return 0;
  return dotProduct2D(a, ontoB) / magB;
}

export function vectorProjection2D(a: Vector2D, ontoB: Vector2D): Vector2D {
  const magBSq = sanitizeFinite(ontoB.x) ** 2 + sanitizeFinite(ontoB.y) ** 2;
  if (magBSq < 1e-12) return { x: 0, y: 0 };
  const scale = dotProduct2D(a, ontoB) / magBSq;
  return {
    x: ontoB.x * scale,
    y: ontoB.y * scale,
  };
}

export function magnitude3D(v: Vector3D): number {
  return Math.hypot(sanitizeFinite(v.x), sanitizeFinite(v.y), sanitizeFinite(v.z));
}

export function dotProduct3D(a: Vector3D, b: Vector3D): number {
  return (
    sanitizeFinite(a.x) * sanitizeFinite(b.x) +
    sanitizeFinite(a.y) * sanitizeFinite(b.y) +
    sanitizeFinite(a.z) * sanitizeFinite(b.z)
  );
}

export function crossProduct3D(a: Vector3D, b: Vector3D): Vector3D {
  const ax = sanitizeFinite(a.x);
  const ay = sanitizeFinite(a.y);
  const az = sanitizeFinite(a.z);
  const bx = sanitizeFinite(b.x);
  const by = sanitizeFinite(b.y);
  const bz = sanitizeFinite(b.z);

  const cx = ay * bz - az * by;
  const cy = az * bx - ax * bz;
  const cz = ax * by - ay * bx;

  return {
    x: Math.abs(cx) < 1e-10 ? 0 : cx,
    y: Math.abs(cy) < 1e-10 ? 0 : cy,
    z: Math.abs(cz) < 1e-10 ? 0 : cz,
  };
}

export function angleBetween3D(a: Vector3D, b: Vector3D): number {
  const magA = magnitude3D(a);
  const magB = magnitude3D(b);
  if (magA < 1e-12 || magB < 1e-12) return 0;
  const cosTheta = clampNumber(dotProduct3D(a, b) / (magA * magB), -1, 1);
  return radToDeg(Math.acos(cosTheta));
}

export function displacement2D(initialPos: Vector2D, finalPos: Vector2D): {
  delta: Vector2D;
  magnitude: number;
  angleDeg: number;
} {
  const delta = subtractVectors2D(finalPos, initialPos);
  const polar = toPolar(delta);
  return {
    delta,
    magnitude: polar.magnitude,
    angleDeg: polar.angleDeg,
  };
}

export function formatNum(value: number, decimals = 2): string {
  const safe = sanitizeFinite(value);
  const rounded = Math.abs(safe) < 10 ** -(decimals + 2) ? 0 : safe;
  return rounded.toFixed(decimals);
}

export function formatSignedTerm(value: number, decimals = 2): string {
  const safe = sanitizeFinite(value);
  const rounded = Math.abs(safe) < 10 ** -(decimals + 2) ? 0 : safe;
  return rounded < 0 ? `- ${Math.abs(rounded).toFixed(decimals)}` : `+ ${rounded.toFixed(decimals)}`;
}
