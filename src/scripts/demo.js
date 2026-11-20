import { createState, selectTask, elapsed, toggle, reset, log, formatTime } from '../lib/console.mjs';

const state = createState(['WORK', 'GYM', 'STUDYING', 'READING', 'CREATING']);
const dial = document.querySelector('[data-dial]');
const disc = document.querySelector('[data-disc]');
const feedback = document.querySelector('[data-feedback]');
const savedRecords = [];
let rotation = 0;
let savedUntil = 0;
const now = () => performance.now();

function render() {
  const running = state.active === state.selected;
  const task = state.tasks[state.selected];
  const time = formatTime(elapsed(state, now()));
  document.querySelectorAll('[data-time]').forEach(element => { element.textContent = time; });
  document.querySelectorAll('[data-task]').forEach(element => { element.textContent = task; });
  document.querySelectorAll('[data-start-label]').forEach(element => { element.textContent = running ? 'PAUSE' : 'START'; });
  document.querySelectorAll('[data-play-icon]').forEach(element => { element.textContent = running ? 'Ⅱ' : '▶'; });
  document.querySelector('[data-status]')?.classList.toggle('is-recording', running);
  document.querySelector('[data-status-label]').textContent = now() < savedUntil ? 'SAVED' : running ? 'REC' : 'IDLE';
  document.querySelectorAll('[data-widget-status]').forEach(element => { element.textContent = now() < savedUntil ? 'SAVED' : running ? 'REC' : 'IDLE'; });
  document.querySelector('.start-key')?.setAttribute('aria-label', `${running ? 'Pause' : 'Start'} ${task} timer`);
  dial?.setAttribute('aria-label', `Select task. Current task ${task}. Click for next; use left and right arrow keys.`);
}
function turn(step) {
  selectTask(state, step);
  rotation += step * (360 / state.tasks.length);
  disc.style.transform = `rotate(${rotation}deg)`;
  savedUntil = 0;
  feedback.textContent = `${state.tasks[state.selected]} selected.`;
  render();
}
dial?.addEventListener('click', () => turn(1));
dial?.addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    turn(event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 1);
  }
});
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
  const task = state.tasks[state.selected];
  const action = button.dataset.action;
  savedUntil = 0;
  if (action === 'start') {
    toggle(state, now());
    feedback.textContent = `${task} ${state.active === state.selected ? 'started' : 'paused'}.`;
  } else if (action === 'reset') {
    reset(state, now());
    feedback.textContent = `${task} reset.`;
  } else if (action === 'log') {
    const record = log(state, now());
    savedRecords.push(record);
    savedUntil = now() + 1800;
    feedback.textContent = `${task} saved: ${formatTime(record.duration)}. Demo only.`;
    document.querySelector('[data-demo-log]').textContent = `${savedRecords.length} SESSION${savedRecords.length === 1 ? '' : 'S'} SAVED`;
  }
  render();
}));
render();
let ticker = setInterval(render, 250);
document.addEventListener('visibilitychange', () => {
  clearInterval(ticker);
  if (!document.hidden) { render(); ticker = setInterval(render, 250); }
});
window.addEventListener('pagehide', () => clearInterval(ticker));
document.querySelectorAll('.todo input').forEach(input => input.addEventListener('change', () => {
  const count = document.querySelectorAll('.todo input:checked').length;
  document.querySelector('[data-todo-count]').textContent = `${count} / 3 DONE`;
}));
