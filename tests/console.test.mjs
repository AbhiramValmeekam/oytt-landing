import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, selectTask, elapsed, toggle, reset, log, formatTime } from '../src/lib/console.mjs';

test('timer follows timestamps, pauses and resumes without drift', () => {
  const state = createState(['WORK', 'GYM', 'STUDYING']);
  toggle(state, 1000);
  assert.equal(elapsed(state, 5500), 4500);
  toggle(state, 5500);
  assert.equal(elapsed(state, 12000), 4500);
  toggle(state, 12000);
  assert.equal(elapsed(state, 15000), 7500);
});
test('starting another task pauses the old task and preserves its time', () => {
  const state = createState(['WORK', 'GYM']);
  toggle(state, 0);
  selectTask(state, 1);
  assert.equal(state.active, 0);
  toggle(state, 4000);
  assert.equal(state.active, 1);
  assert.equal(elapsed(state, 8000, 0), 4000);
  assert.equal(elapsed(state, 8000, 1), 4000);
});
test('reset clears only the selected task and stops its clock', () => {
  const state = createState(['WORK', 'GYM']);
  toggle(state, 0);
  selectTask(state, 1);
  reset(state, 2000);
  assert.equal(state.active, 0);
  selectTask(state, -1);
  reset(state, 5000);
  assert.equal(state.active, null);
  assert.equal(elapsed(state, 10000), 0);
});
test('log returns the selected duration and resets it without losing other tasks', () => {
  const state = createState(['WORK', 'GYM']);
  toggle(state, 0);
  selectTask(state, 1);
  toggle(state, 5000);
  const result = log(state, 8000);
  assert.deepEqual(result, {task: 'GYM', duration: 3000});
  assert.equal(state.active, null);
  assert.equal(elapsed(state, 12000), 0);
  assert.equal(elapsed(state, 12000, 0), 5000);
});
test('dial wraps in both directions and validates task counts', () => {
  const state = createState(['WORK', 'GYM', 'STUDYING']);
  selectTask(state, -1);
  assert.equal(state.selected, 2);
  selectTask(state, 1);
  assert.equal(state.selected, 0);
  assert.throws(() => createState([]));
  assert.throws(() => createState(Array(11).fill('WORK')));
});
test('formatting handles negative values and durations over 24 hours', () => {
  assert.equal(formatTime(3723000), '01:02:03');
  assert.equal(formatTime(-10), '00:00:00');
  assert.equal(formatTime(90061000), '25:01:01');
});
