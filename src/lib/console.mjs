export function createState(tasks) {
  if (!tasks.length || tasks.length > 10) throw new RangeError('Choose 1 to 10 tasks');
  return { tasks: [...tasks], selected: 0, active: null, started: 0, durations: tasks.map(() => 0) };
}
export function selectTask(state, step) {
  state.selected = ((state.selected + step) % state.tasks.length + state.tasks.length) % state.tasks.length;
}
export function elapsed(state, now, index = state.selected) {
  return state.durations[index] + (state.active === index ? Math.max(0, now - state.started) : 0);
}
function pause(state, now) {
  if (state.active !== null) state.durations[state.active] = elapsed(state, now, state.active);
  state.active = null;
}
export function toggle(state, now) {
  const alreadyRunning = state.active === state.selected;
  pause(state, now);
  if (!alreadyRunning) {
    state.active = state.selected;
    state.started = now;
  }
}
export function reset(state, now) {
  if (state.active === state.selected) pause(state, now);
  state.durations[state.selected] = 0;
}
export function log(state, now) {
  const record = { task: state.tasks[state.selected], duration: elapsed(state, now) };
  reset(state, now);
  return record;
}
export function formatTime(milliseconds) {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map(value => String(value).padStart(2, '0')).join(':');
}
