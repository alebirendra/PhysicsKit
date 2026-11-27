import test from 'node:test';
import assert from 'node:assert/strict';
import {
  circularStateAtTime,
  decomposeAcceleration2D,
  projectileFlightSummary,
  projectileHeightAtX,
  projectileStateAtTime,
  riverCrossingSummary,
} from './kinematics2dMath';

test('parabolic trajectory y(x) matches time-parametric projectile state (x(t), y(t))', () => {
  const v0 = 24;
  const angleDeg = 38;
  const y0 = 5;
  const g = 9.8;
  const t = 1.6;
  const state = projectileStateAtTime(v0, angleDeg, y0, g, t);
  const yFromX = projectileHeightAtX(state.x, v0, angleDeg, y0, g);
  assert.ok(yFromX !== null);
  assert.ok(Math.abs(state.y - yFromX) < 1e-9);
});

test('complementary launch angles (30 deg and 60 deg) on flat ground yield equal range', () => {
  const f30 = projectileFlightSummary(20, 30, 0, 9.8);
  const f60 = projectileFlightSummary(20, 60, 0, 9.8);
  assert.ok(Math.abs(f30.horizontalRange - f60.horizontalRange) < 1e-9);
  assert.ok(f60.maxHeight > f30.maxHeight);
  assert.ok(f60.timeOfFlight > f30.timeOfFlight);
});

test('45 degrees maximizes horizontal range for level ground launch', () => {
  const f40 = projectileFlightSummary(25, 40, 0, 9.8);
  const f45 = projectileFlightSummary(25, 45, 0, 9.8);
  const f50 = projectileFlightSummary(25, 50, 0, 9.8);
  assert.ok(f45.horizontalRange > f40.horizontalRange);
  assert.ok(f45.horizontalRange > f50.horizontalRange);
});

test('acceleration decomposition yields orthogonal parallel and perpendicular vectors', () => {
  const decomp = decomposeAcceleration2D(6, 8, 2, -5);
  const dot =
    decomp.aParallelVec.x * decomp.aPerpVec.x + decomp.aParallelVec.y * decomp.aPerpVec.y;
  assert.ok(Math.abs(dot) < 1e-9);
  const reconX = decomp.aParallelVec.x + decomp.aPerpVec.x;
  const reconY = decomp.aParallelVec.y + decomp.aPerpVec.y;
  assert.ok(Math.abs(reconX - 2) < 1e-9 && Math.abs(reconY - -5) < 1e-9);
});

test('circular motion computes centripetal, tangential, and net acceleration accurately', () => {
  const uniform = circularStateAtTime(4, 8, 0, 1.5);
  assert.ok(Math.abs(uniform.ac - 16) < 1e-9); // v^2 / R = 64 / 4 = 16
  assert.ok(Math.abs(uniform.aTotal - 16) < 1e-9);
  // Velocity is always perpendicular to position vector (r . v = 0)
  assert.ok(Math.abs(uniform.x * uniform.vx + uniform.y * uniform.vy) < 1e-9);

  const nonUniform = circularStateAtTime(5, 4, 3, 2); // v = 4 + 3*2 = 10 -> ac = 100/5 = 20, at = 3
  assert.ok(Math.abs(nonUniform.speed - 10) < 1e-9);
  assert.ok(Math.abs(nonUniform.ac - 20) < 1e-9);
  assert.ok(Math.abs(nonUniform.aTotal - Math.hypot(20, 3)) < 1e-9);
});

test('river-boat relative velocity cancels downstream drift at asin(v_current / v_boat)', () => {
  const straightAcross = riverCrossingSummary(100, 5, 0, 3);
  assert.ok(Math.abs(straightAcross.crossingTime - 20) < 1e-9);
  assert.ok(Math.abs(straightAcross.downstreamDrift - 60) < 1e-9);
  assert.ok(straightAcross.upstreamZeroDriftAngleDeg !== null);

  const zeroDrift = riverCrossingSummary(100, 5, straightAcross.upstreamZeroDriftAngleDeg!, 3);
  assert.ok(Math.abs(zeroDrift.downstreamDrift) < 1e-9);
  assert.ok(Math.abs(zeroDrift.vBG.y - 4) < 1e-9);
  assert.ok(Math.abs(zeroDrift.crossingTime - 25) < 1e-9);
});
