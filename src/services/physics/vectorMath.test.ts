import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addVectors2D,
  angleBetween2D,
  angleBetween3D,
  crossProduct3D,
  displacement2D,
  dotProduct2D,
  dotProduct3D,
  fromPolar,
  magnitude2D,
  magnitude3D,
  negateVector2D,
  normalizeAngleDeg,
  resolveVector,
  scalarProjection2D,
  subtractVectors2D,
  toPolar,
} from './vectorMath';

test('fromPolar and toPolar convert 3-4-5 right triangle accurately', () => {
  const v = { x: 3, y: 4 };
  const polar = toPolar(v);
  assert.ok(Math.abs(polar.magnitude - 5) < 1e-9);
  assert.ok(Math.abs(polar.angleDeg - 53.130102354) < 1e-6);

  const back = fromPolar(polar.magnitude, polar.angleDeg);
  assert.ok(Math.abs(back.x - 3) < 1e-6);
  assert.ok(Math.abs(back.y - 4) < 1e-6);
});

test('normalizeAngleDeg wraps negative and >360 angles cleanly', () => {
  assert.equal(normalizeAngleDeg(-90), 270);
  assert.equal(normalizeAngleDeg(450), 90);
  assert.equal(normalizeAngleDeg(360), 0);
});

test('addVectors2D and subtractVectors2D compute resultant components', () => {
  const a = { x: 4, y: 2 };
  const b = { x: -1, y: 5 };
  assert.deepEqual(addVectors2D(a, b), { x: 3, y: 7 });
  assert.deepEqual(subtractVectors2D(a, b), { x: 5, y: -3 });
  assert.deepEqual(addVectors2D(a, negateVector2D(b)), { x: 5, y: -3 });
});

test('resolveVector computes Ax = A cos(theta) and Ay = A sin(theta)', () => {
  const res = resolveVector(10, 60);
  assert.ok(Math.abs(res.ax - 5) < 1e-9);
  assert.ok(Math.abs(res.ay - 10 * Math.sin(Math.PI / 3)) < 1e-9);
  assert.ok(Math.abs(magnitude2D({ x: res.ax, y: res.ay }) - 10) < 1e-9);
});

test('dotProduct2D detects perpendicular and parallel vectors', () => {
  const i = { x: 3, y: 0 };
  const j = { x: 0, y: 4 };
  assert.equal(dotProduct2D(i, j), 0);
  assert.ok(Math.abs(angleBetween2D(i, j) - 90) < 1e-9);

  const a = { x: 3, y: 4 };
  const b = { x: 6, y: 8 };
  assert.equal(dotProduct2D(a, b), 50);
  assert.ok(Math.abs(angleBetween2D(a, b) - 0) < 1e-6);
  assert.ok(Math.abs(scalarProjection2D(a, i) - 3) < 1e-9);
});

test('crossProduct3D satisfies right-hand rule (i x j = k) and |A x B| = AB sin(theta)', () => {
  const i = { x: 1, y: 0, z: 0 };
  const j = { x: 0, y: 1, z: 0 };
  const k = crossProduct3D(i, j);
  assert.deepEqual(k, { x: 0, y: 0, z: 1 });
  assert.deepEqual(crossProduct3D(j, i), { x: 0, y: 0, z: -1 });

  const a = { x: 3, y: -2, z: 1 };
  const b = { x: 1, y: 4, z: -2 };
  const c = crossProduct3D(a, b);
  // Orthogonality check: (A x B) . A == 0 and (A x B) . B == 0
  assert.ok(Math.abs(dotProduct3D(c, a)) < 1e-9);
  assert.ok(Math.abs(dotProduct3D(c, b)) < 1e-9);

  const thetaRad = (angleBetween3D(a, b) * Math.PI) / 180;
  const expectedMag = magnitude3D(a) * magnitude3D(b) * Math.sin(thetaRad);
  assert.ok(Math.abs(magnitude3D(c) - expectedMag) < 1e-9);
});

test('displacement2D computes final minus initial position vector', () => {
  const r1 = { x: -2, y: 1 };
  const r2 = { x: 2, y: 4 };
  const disp = displacement2D(r1, r2);
  assert.deepEqual(disp.delta, { x: 4, y: 3 });
  assert.ok(Math.abs(disp.magnitude - 5) < 1e-9);
});
