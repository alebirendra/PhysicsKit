import test from 'node:test';
import assert from 'node:assert/strict';
import {
  accelerationAtTime,
  averageAcceleration1D,
  averageVelocity1D,
  constantAccelSpeedSquared,
  deltaVelocity1D,
  displacement1D,
  motionBehaviorLabel,
  positionAtTime,
  riemannMidpointIntegral,
  totalDistance1D,
  velocityAtTime,
} from './kinematicsMath';

test('constant acceleration formulas x(t), v(t), and v^2 = v0^2 + 2a*dx agree', () => {
  const x0 = 2;
  const v0 = 4;
  const a = 3;
  const t = 5;

  const v = velocityAtTime(v0, a, 0, t);
  const x = positionAtTime(x0, v0, a, 0, t);
  assert.equal(v, 19);
  assert.equal(x, 59.5);

  const dx = x - x0;
  assert.equal(constantAccelSpeedSquared(v0, a, dx), v * v);
});

test('displacement equals definite integral of velocity while total distance captures reversal', () => {
  // v(t) = 4 - 2t reverses sign at t = 2s; over [0, 4]: dx = 0, distance = 8 m
  const x0 = 0;
  const v0 = 4;
  const a = -2;

  const dx = displacement1D(x0, v0, a, 0, 0, 4);
  const dist = totalDistance1D(v0, a, 0, 0, 4, 800);
  const avgV = averageVelocity1D(x0, v0, a, 0, 0, 4);

  assert.ok(Math.abs(dx) < 1e-9);
  assert.ok(Math.abs(avgV) < 1e-9);
  assert.ok(Math.abs(dist - 8) < 0.02);
});

test('time-varying acceleration a(t) = a0 + j*t integrates to exact delta-v and displacement', () => {
  // a(t) = 1 + 2t -> v(t) = v0 + t + t^2; over [1, 3], dv = (3 + 9) - (1 + 1) = 10
  const dv = deltaVelocity1D(5, 1, 2, 1, 3);
  assert.ok(Math.abs(dv - 10) < 1e-9);

  const aAvg = averageAcceleration1D(5, 1, 2, 1, 3);
  assert.ok(Math.abs(aAvg - 5) < 1e-9);
  assert.equal(accelerationAtTime(1, 2, 2), 5);

  const { sum } = riemannMidpointIntegral((t) => accelerationAtTime(1, 2, t), 1, 3, 20);
  assert.ok(Math.abs(sum - 10) < 1e-9);
});

test('motionBehaviorLabel distinguishes speeding up vs slowing down by sign agreement', () => {
  assert.match(motionBehaviorLabel(-6, -2), /Speeding up/);
  assert.match(motionBehaviorLabel(6, -2), /Slowing down/);
  assert.match(motionBehaviorLabel(4, 0), /Constant velocity/);
});
