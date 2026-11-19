import test from 'node:test';
import assert from 'node:assert/strict';
import { searchPhysicsContent } from './globalSearch';

test('searching "cross product" returns topic, 3D simulation, equation, and practice question', () => {
  const results = searchPhysicsContent('cross product');
  const categories = new Set(results.map((r) => r.category));
  assert.ok(categories.has('Simulation'), 'should include Cross Product simulation');
  assert.ok(categories.has('Topic'), 'should include Cross Product topic');
  assert.ok(categories.has('Practice'), 'should include Cross Product practice questions');

  const sim = results.find((r) => r.category === 'Simulation');
  assert.equal(sim?.params?.simId, 'cross-product');
});

test('searching empty query returns empty array', () => {
  assert.deepEqual(searchPhysicsContent('   '), []);
});
