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

test('searching "definite integral" and "2.5.1" finds Chapter 2 kinematics topics and simulation', () => {
  const integralResults = searchPhysicsContent('definite integral');
  assert.ok(
    integralResults.some((r) => r.category === 'Topic' && r.params?.chapterId === 'kinematics'),
    'should find Chapter 2 definite integral topics',
  );
  assert.ok(
    integralResults.some((r) => r.category === 'Simulation' && r.params?.simId === 'kinematics-integrals'),
    'should find kinematics-integrals simulation',
  );

  const secResults = searchPhysicsContent('2.5.1');
  assert.ok(
    secResults.some((r) => r.params?.topicId === 'area-under-at-graph'),
    'should match topic by section number 2.5.1',
  );
});
