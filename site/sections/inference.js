import { h, sectionHeader } from '../ui.js';

// Hand-authored, illustrative numbers. Not measured from any real model.
// Each step's attention has one weight per token in the context so far; the last one is the newest token itself.
const STARTS = [
  {
    id: 'sky',
    label: 'The sky is',
    prompt: ['The', 'sky', 'is'],
    steps: [
      { attention: [0.12, 0.62, 0.26], candidates: [{ word: 'blue', pct: 62 }, { word: 'clear', pct: 14 }, { word: 'gray', pct: 8 }, { word: 'dark', pct: 6 }, { word: 'falling', pct: 2 }], pick: 'blue' },
      { attention: [0.06, 0.30, 0.14, 0.50], candidates: [{ word: 'and', pct: 41 }, { word: 'today', pct: 18 }, { word: '.', pct: 16 }, { word: 'again', pct: 9 }, { word: 'with', pct: 5 }], pick: 'and' },
      { attention: [0.05, 0.22, 0.08, 0.30, 0.35], candidates: [{ word: 'the', pct: 46 }, { word: 'clear', pct: 17 }, { word: 'I', pct: 9 }, { word: 'bright', pct: 8 }, { word: 'there', pct: 6 }], pick: 'the' },
      { attention: [0.04, 0.34, 0.05, 0.17, 0.12, 0.28], candidates: [{ word: 'sun', pct: 52 }, { word: 'air', pct: 15 }, { word: 'clouds', pct: 12 }, { word: 'birds', pct: 7 }, { word: 'grass', pct: 4 }], pick: 'sun' },
      { attention: [0.03, 0.12, 0.06, 0.10, 0.07, 0.18, 0.44], candidates: [{ word: 'is', pct: 48 }, { word: 'shines', pct: 20 }, { word: 'feels', pct: 9 }, { word: 'was', pct: 7 }, { word: 'rises', pct: 5 }], pick: 'is' },
      { attention: [0.03, 0.10, 0.04, 0.12, 0.04, 0.08, 0.39, 0.20], candidates: [{ word: 'shining', pct: 44 }, { word: 'warm', pct: 21 }, { word: 'out', pct: 14 }, { word: 'bright', pct: 10 }, { word: 'hot', pct: 6 }], pick: 'shining' },
      { attention: [0.04, 0.10, 0.04, 0.10, 0.10, 0.04, 0.20, 0.08, 0.30], candidates: [{ word: '.', pct: 57 }, { word: 'brightly', pct: 18 }, { word: 'down', pct: 9 }, { word: 'today', pct: 7 }, { word: 'again', pct: 4 }], pick: '.' },
    ],
  },
  {
    id: 'once',
    label: 'Once upon a',
    prompt: ['Once', 'upon', 'a'],
    steps: [
      { attention: [0.30, 0.35, 0.35], candidates: [{ word: 'time', pct: 88 }, { word: 'hill', pct: 3 }, { word: 'midnight', pct: 2 }, { word: 'dream', pct: 1 }, { word: 'star', pct: 1 }], pick: 'time' },
      { attention: [0.20, 0.15, 0.15, 0.50], candidates: [{ word: ',', pct: 55 }, { word: 'there', pct: 22 }, { word: 'in', pct: 12 }, { word: 'a', pct: 5 }, { word: 'the', pct: 3 }], pick: ',' },
      { attention: [0.25, 0.10, 0.05, 0.35, 0.25], candidates: [{ word: 'there', pct: 41 }, { word: 'a', pct: 18 }, { word: 'in', pct: 15 }, { word: 'the', pct: 9 }, { word: 'an', pct: 6 }], pick: 'there' },
      { attention: [0.12, 0.06, 0.04, 0.20, 0.08, 0.50], candidates: [{ word: 'lived', pct: 47 }, { word: 'was', pct: 30 }, { word: 'were', pct: 9 }, { word: 'once', pct: 4 }, { word: 'came', pct: 3 }], pick: 'lived' },
      { attention: [0.10, 0.04, 0.04, 0.12, 0.03, 0.27, 0.40], candidates: [{ word: 'a', pct: 63 }, { word: 'an', pct: 14 }, { word: 'two', pct: 8 }, { word: 'the', pct: 6 }, { word: 'three', pct: 4 }], pick: 'a' },
      { attention: [0.22, 0.04, 0.06, 0.20, 0.03, 0.08, 0.22, 0.15], candidates: [{ word: 'king', pct: 26 }, { word: 'girl', pct: 18 }, { word: 'princess', pct: 16 }, { word: 'little', pct: 14 }, { word: 'man', pct: 9 }], pick: 'king' },
      { attention: [0.06, 0.03, 0.03, 0.12, 0.04, 0.10, 0.24, 0.08, 0.30], candidates: [{ word: '.', pct: 34 }, { word: 'who', pct: 31 }, { word: 'named', pct: 14 }, { word: 'and', pct: 9 }, { word: 'in', pct: 6 }], pick: '.' },
    ],
  },
  {
    id: 'georgia',
    label: 'Summers in Georgia are',
    prompt: ['Summers', 'in', 'Georgia', 'are'],
    steps: [
      { attention: [0.40, 0.06, 0.34, 0.20], candidates: [{ word: 'hot', pct: 58 }, { word: 'humid', pct: 21 }, { word: 'long', pct: 8 }, { word: 'beautiful', pct: 5 }, { word: 'mild', pct: 2 }], pick: 'hot' },
      { attention: [0.15, 0.04, 0.25, 0.12, 0.44], candidates: [{ word: 'and', pct: 52 }, { word: '.', pct: 20 }, { word: ',', pct: 12 }, { word: 'here', pct: 5 }, { word: 'but', pct: 4 }], pick: 'and' },
      { attention: [0.20, 0.03, 0.30, 0.07, 0.30, 0.10], candidates: [{ word: 'humid', pct: 64 }, { word: 'sticky', pct: 14 }, { word: 'long', pct: 8 }, { word: 'dry', pct: 3 }, { word: 'sunny', pct: 3 }], pick: 'humid' },
      { attention: [0.08, 0.03, 0.18, 0.06, 0.15, 0.15, 0.35], candidates: [{ word: ',', pct: 41 }, { word: '.', pct: 36 }, { word: 'too', pct: 9 }, { word: 'here', pct: 6 }, { word: 'all', pct: 4 }], pick: ',' },
      { attention: [0.06, 0.02, 0.40, 0.04, 0.10, 0.04, 0.14, 0.20], candidates: [{ word: "y'all", pct: 33 }, { word: 'and', pct: 27 }, { word: 'so', pct: 15 }, { word: 'but', pct: 12 }, { word: 'especially', pct: 6 }], pick: "y'all" },
      { attention: [0.05, 0.02, 0.15, 0.05, 0.08, 0.03, 0.12, 0.10, 0.40], candidates: [{ word: '.', pct: 71 }, { word: '!', pct: 18 }, { word: 'and', pct: 4 }, { word: 'so', pct: 3 }, { word: 'but', pct: 2 }], pick: '.' },
    ],
  },
];

const STAGES = [
  { id: 'read', label: 'Read', title: '1. Read the words so far', caption: 'The model starts with every token written so far, the same chunks you saw in Part 3.', durationMs: 1600 },
  { id: 'numbers', label: 'Numbers', title: '2. Words become numbers', caption: 'Each token becomes a long list of numbers, so the model can do math on it.', durationMs: 2400 },
  { id: 'attend', label: 'Attend', title: '3. Pay attention', caption: 'The newest word looks back at the others, like in Part 4. A thicker line means more attention.', durationMs: 4200 },
  { id: 'predict', label: 'Guess', title: '4. Guess the next word', caption: 'It scores every possible next token, just like the guessing game in Part 2.', durationMs: 2600 },
  { id: 'pick', label: 'Add', title: '5. Pick one and add it', caption: 'The winner joins the sentence, and the whole trip starts again.', durationMs: 2000 },
];
const LAYERS = 3;
const SPEEDS = [{ id: 'slow', label: 'Slow', factor: 1.8 }, { id: 'normal', label: 'Normal', factor: 1 }];
const NUMBERS_PER_CHIP = 6;

const stageIndex = (id) => STAGES.findIndex((s) => s.id === id);
const startById = (id) => STARTS.find((s) => s.id === id);
const isComplete = (state) => state.stepIndex >= startById(state.startId).steps.length;

function advance(state) {
  if (isComplete(state)) return state;
  const i = stageIndex(state.stage);
  if (i < STAGES.length - 1) return { ...state, stage: STAGES[i + 1].id };
  return { ...state, stepIndex: state.stepIndex + 1, stage: STAGES[0].id };
}

function skipWord(state) {
  if (isComplete(state)) return state;
  if (state.stage !== 'pick') return { ...state, stage: 'pick' };
  const next = advance(state);
  return isComplete(next) ? next : { ...next, stage: 'pick' };
}

const freshState = (startId) => ({ startId, stepIndex: 0, stage: STAGES[0].id });

// Tokens on screen: the prompt, every word already picked, and (during "pick") the word being added.
function contextFor(state) {
  const start = startById(state.startId);
  const done = start.steps.slice(0, state.stepIndex).map((s) => s.pick);
  return [...start.prompt, ...done];
}

function sentenceText(tokens) {
  return tokens.join(' ').replace(/ ([.,!])/g, '$1');
}

// Earlier layers lean on nearby words; the last layer lands on the hand-authored weights.
function layerWeights(attention, layer) {
  const n = attention.length;
  const recency = attention.map((_, j) => 2 ** (j - n));
  const recencyTotal = recency.reduce((a, b) => a + b, 0);
  const mix = (layer + 1) / LAYERS;
  return attention.map((w, j) => mix * w + (1 - mix) * (recency[j] / recencyTotal));
}

// A stable, made-up list of numbers per word so "sky" always looks the same.
function numbersFor(word) {
  let seed = [...word].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 7);
  return Array.from({ length: NUMBERS_PER_CHIP }, () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return Math.round(((seed >>> 8) / 0xffffff * 2 - 1) * 100) / 100;
  });
}

const SVG_NS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

// Same row: a low hump that stays in the gap above the row. Row above: an S-curve through the gap into that chip's bottom.
function arcPath(from, to) {
  if (Math.abs(from.top - to.top) < 4 || to.bottom > from.top) {
    const top = Math.min(from.top, to.top);
    const lift = Math.max(20, Math.min(30, Math.abs(from.x - to.x) * 0.25));
    return `M ${from.x} ${from.top} C ${from.x} ${top - lift}, ${to.x} ${top - lift}, ${to.x} ${to.top}`;
  }
  const mid = (from.top + to.bottom) / 2;
  return `M ${from.x} ${from.top} C ${from.x} ${mid}, ${to.x} ${mid}, ${to.x} ${to.bottom}`;
}
const arcEnd = (from, to) => (Math.abs(from.top - to.top) < 4 || to.bottom > from.top ? to.top : to.bottom);

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderPlayer(root) {
  let state = freshState(STARTS[0].id);
  let speed = SPEEDS[1];
  let timer = null;

  const startButtons = STARTS.map((s) => h('button', {
    type: 'button', class: 'btn inf-start', 'data-start': s.id,
    onClick: () => { stop(); state = freshState(s.id); draw(); },
  }, `${s.label} …`));
  const stepper = h('ol', { class: 'inf-stepper', 'aria-label': 'Stages' },
    STAGES.map((s) => h('li', { 'data-stage': s.id }, h('span', { class: 'inf-dot', 'aria-hidden': 'true' }), h('span', { class: 'inf-step-label' }, s.label))),
  );
  const progress = h('p', { class: 'inf-progress' });
  const title = h('p', { class: 'inf-title' });
  const caption = h('p', { class: 'inf-caption' });
  const chips = h('div', { class: 'inf-chips' });
  const arcs = svg('svg', { class: 'inf-arcs', 'aria-hidden': 'true' });
  const stage = h('div', { class: 'inf-stage' }, arcs, chips);
  const panel = h('div', { class: 'inf-panel', 'aria-live': 'polite' });

  const playBtn = h('button', { type: 'button', class: 'btn btn-primary btn-big inf-play', onClick: () => (timer ? stop() : play()) });
  const stepBtn = h('button', { type: 'button', class: 'btn inf-next-step', onClick: () => { stop(); state = advance(state); draw(); } }, 'Next step ›');
  const wordBtn = h('button', { type: 'button', class: 'btn inf-next-word', onClick: () => { stop(); state = skipWord(state); draw(); } }, 'Next word »');
  const restartBtn = h('button', { type: 'button', class: 'btn inf-restart', onClick: () => { stop(); state = freshState(state.startId); draw(); } }, '↺ Restart');
  const speedButtons = SPEEDS.map((s) => h('button', {
    type: 'button', class: 'btn inf-speed', 'data-speed': s.id,
    onClick: () => { speed = s; draw(); },
  }, s.label));

  const card = h('div', { class: 'card inf-card' },
    h('h2', { class: 'inf-h2' }, '🎬 One trip per word'),
    h('div', { class: 'inf-starts', role: 'group', 'aria-label': 'Pick a starting sentence' }, startButtons),
    stepper,
    h('div', { class: 'inf-head', 'aria-live': 'polite' }, progress, title, caption),
    stage,
    panel,
    h('div', { class: 'inf-controls' },
      playBtn,
      h('div', { class: 'inf-row' }, stepBtn, wordBtn),
      h('div', { class: 'inf-row' }, restartBtn, h('div', { class: 'inf-speeds', role: 'group', 'aria-label': 'Speed' }, speedButtons)),
    ),
  );

  function stop() {
    clearTimeout(timer);
    timer = null;
    syncPlayButton();
  }

  function schedule() {
    const ms = STAGES[stageIndex(state.stage)].durationMs * speed.factor;
    timer = setTimeout(tick, ms);
  }

  function tick() {
    timer = null;
    if (!root.isConnected) { teardown(); return; }
    state = advance(state);
    if (!isComplete(state)) schedule();
    draw();
  }

  function play() {
    if (isComplete(state)) { state = freshState(state.startId); draw(); }
    schedule();
    syncPlayButton();
  }

  function syncPlayButton() {
    playBtn.textContent = timer ? '⏸ Pause' : isComplete(state) ? '▶ Play again' : '▶ Play';
    playBtn.setAttribute('aria-pressed', String(Boolean(timer)));
  }

  function chip(word, extraClass = '') {
    return h('span', { class: `inf-chip ${extraClass}` },
      h('span', { class: 'inf-word' }, word),
      h('span', { class: 'inf-vec', 'aria-hidden': 'true' },
        numbersFor(word).map((v) => {
          const bar = h('span', { class: `inf-num${v < 0 ? ' is-neg' : ''}` });
          bar.style.setProperty('--v', Math.abs(v).toFixed(2));
          return bar;
        }),
      ),
    );
  }

  function drawChips(context, step) {
    const s = state.stage;
    const attending = s === 'attend' && step;
    const finalWeights = attending ? step.attention : null;
    const maxW = finalWeights ? Math.max(...finalWeights.slice(0, -1)) : 1;
    const nodes = context.map((word, i) => {
      const newest = i === context.length - 1;
      const el = chip(word, `${newest && step ? 'is-newest' : ''}`);
      if (finalWeights && !newest) el.style.setProperty('--w', (finalWeights[i] / maxW).toFixed(2));
      return el;
    });
    let added = null;
    if (step && s === 'pick') {
      added = chip(step.pick, 'is-added');
      nodes.push(added);
    } else if (step) {
      nodes.push(h('span', { class: 'inf-chip is-ghost', 'aria-label': 'next word goes here' }, h('span', { class: 'inf-word' }, '?'), h('span', { class: 'inf-vec' })));
    }
    chips.dataset.stage = isComplete(state) ? 'done' : s;
    chips.replaceChildren(...nodes);
    return added;
  }

  function drawArcs(context, step) {
    arcs.replaceChildren();
    if (state.stage !== 'attend' || !step) return;
    const box = stage.getBoundingClientRect();
    arcs.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    arcs.setAttribute('width', box.width);
    arcs.setAttribute('height', box.height);
    const anchors = [...chips.children].slice(0, context.length).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, top: r.top - box.top, bottom: r.bottom - box.top };
    });
    const from = anchors[anchors.length - 1];
    for (let layer = 0; layer < LAYERS; layer++) {
      const weights = layerWeights(step.attention, layer);
      const maxW = Math.max(...weights.slice(0, -1));
      const g = svg('g', { class: 'inf-layer', 'data-layer': layer });
      g.style.setProperty('--i', layer);
      anchors.slice(0, -1).forEach((to, j) => {
        const rel = weights[j] / maxW;
        const path = svg('path', { d: arcPath(from, to), pathLength: '1', class: 'inf-arc' });
        path.style.setProperty('--rel', rel.toFixed(2));
        path.style.strokeWidth = (1.5 + rel * 7).toFixed(1);
        g.append(path, svg('circle', { cx: to.x, cy: arcEnd(from, to), r: (2 + rel * 4).toFixed(1), class: 'inf-arc-end', style: `--rel:${rel.toFixed(2)}` }));
      });
      arcs.append(g);
    }
  }

  function bars(step, { grow, pickWinner }) {
    const rows = step.candidates.map((c) => {
      const fill = h('div', { class: 'bar-fill', style: { width: grow ? '0%' : `${c.pct}%` } });
      const isPick = c.word === step.pick;
      return { c, fill, row: h('div', { class: `bar-row inf-cand${pickWinner ? (isPick ? ' is-pick' : ' is-faded') : ''}` },
        h('span', { class: 'inf-cand-word' }, c.word),
        h('div', { class: 'bar-track' }, fill),
        h('span', { class: 'inf-pct' }, `${c.pct}%`),
      ) };
    });
    if (grow) requestAnimationFrame(() => requestAnimationFrame(() => rows.forEach((r) => { r.fill.style.width = `${r.c.pct}%`; })));
    return rows.map((r) => r.row);
  }

  // Shares of the attention the newest word spends on the other words, so the bars read like Part 4.
  function attentionRows(context, step) {
    const others = context.slice(0, -1).map((word, i) => ({ word, w: step.attention[i] }));
    const total = others.reduce((sum, o) => sum + o.w, 0);
    return others
      .sort((a, b) => b.w - a.w)
      .slice(0, 3)
      .map(({ word, w }) => {
        const pct = Math.round((w / total) * 100);
        return h('div', { class: 'bar-row inf-cand' },
          h('span', { class: 'inf-cand-word' }, word),
          h('div', { class: 'bar-track' }, h('div', { class: 'bar-fill', style: { width: `${pct}%` } })),
          h('span', { class: 'inf-pct' }, `${pct}%`),
        );
      });
  }

  const PANELS = {
    read: (context) => [
      h('p', { class: 'inf-panel-title' }, `${context.length} tokens so far:`),
      h('p', { class: 'inf-quote' }, `“${sentenceText(context)} …”`),
      h('p', { class: 'inf-panel-note' }, 'Its guess for the blank will appear here.'),
    ],
    numbers: (context) => {
      const word = context[context.length - 1];
      return [
        h('p', { class: 'inf-panel-title' }, `“${word}” becomes:`),
        h('p', { class: 'inf-digits' }, `[ ${numbersFor(word).slice(0, 5).join(', ')}, … ]`),
        h('p', { class: 'inf-panel-note' }, 'Here, 6 made-up numbers per word. Real models use thousands.'),
      ];
    },
    attend: (context, step) => [
      h('ol', { class: 'inf-layers', 'aria-label': 'Attention layers' },
        Array.from({ length: LAYERS }, (_, i) => h('li', { style: `--i:${i}` }, `Layer ${i + 1}`)),
        h('li', { class: 'inf-layers-more' }, '… real models have dozens'),
      ),
      h('p', { class: 'inf-panel-title' }, `“${context[context.length - 1]}” looks mostly at:`),
      ...attentionRows(context, step),
    ],
    predict: (context, step) => [
      h('p', { class: 'inf-panel-title' }, 'Its top guesses:'),
      ...bars(step, { grow: true, pickWinner: false }),
    ],
    pick: (context, step) => [
      h('p', { class: 'inf-panel-title' }, `Picked “${step.pick}”.`),
      ...bars(step, { grow: false, pickWinner: true }),
    ],
  };

  function endCard() {
    return [
      h('p', { class: 'inf-end-title' }, 'That\'s it.'),
      h('p', {}, 'A chatbot writing a long answer is this loop run hundreds or thousands of times, very fast.'),
      h('p', { class: 'inf-panel-note' }, 'Real models choose from tens of thousands of possible tokens, stack dozens of attention layers, and have billions of settings. Meta\'s Llama 3, for example, picks from about 128,000 tokens, and its biggest version has 126 layers and 405 billion settings. The numbers in this demo are hand-made.'),
    ];
  }

  function fly(added) {
    if (!added || reducedMotion()) return;
    const source = [...panel.querySelectorAll('.inf-cand.is-pick .inf-cand-word')][0];
    if (!source) return;
    const a = source.getBoundingClientRect();
    const b = added.getBoundingClientRect();
    added.style.transition = 'none';
    added.style.transform = `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(1.15)`;
    added.getBoundingClientRect();
    added.style.transition = '';
    added.style.transform = '';
  }

  function draw() {
    const start = startById(state.startId);
    const done = isComplete(state);
    const step = done ? null : start.steps[state.stepIndex];
    const context = contextFor(state);
    const current = done ? STAGES.length : stageIndex(state.stage);
    const meta = STAGES[Math.min(current, STAGES.length - 1)];

    card.style.setProperty('--layer-ms', `${Math.round((STAGES[stageIndex('attend')].durationMs * speed.factor) / (LAYERS + 0.5))}ms`);
    card.dataset.stage = done ? 'done' : state.stage;
    startButtons.forEach((b) => {
      const on = b.dataset.start === state.startId;
      b.classList.toggle('btn-primary', on);
      b.setAttribute('aria-pressed', String(on));
    });
    speedButtons.forEach((b) => {
      const on = b.dataset.speed === speed.id;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    [...stepper.children].forEach((li, i) => {
      li.classList.toggle('is-current', i === current);
      li.classList.toggle('is-done', i < current);
    });

    progress.textContent = done ? `Finished: ${start.steps.length} new words` : `Word ${state.stepIndex + 1} of ${start.steps.length}`;
    title.textContent = done ? 'Sentence complete' : meta.title;
    caption.textContent = done ? 'Every new word took one full trip through the model.' : meta.caption;

    const added = drawChips(context, step);
    panel.replaceChildren(...(done ? endCard() : PANELS[state.stage](context, step)));
    drawArcs(context, step);
    fly(added);
    stepBtn.disabled = done;
    wordBtn.disabled = done;
    syncPlayButton();
  }

  const resize = new ResizeObserver(() => {
    if (!root.isConnected) { teardown(); return; }
    const done = isComplete(state);
    drawArcs(contextFor(state), done ? null : startById(state.startId).steps[state.stepIndex]);
  });

  function teardown() {
    clearTimeout(timer);
    timer = null;
    resize.disconnect();
  }

  return { card, start: () => { draw(); resize.observe(chips); } };
}

export default {
  id: 'inference',
  title: 'Watch AI write a sentence',
  icon: '🎬',
  minutes: 5,
  render(root, section) {
    const player = renderPlayer(root);
    root.append(
      sectionHeader(section, 'Now put the pieces together. Here is one full trip through a transformer for each new word. Press Play and watch the sentence grow.'),
      player.card,
      h('div', { class: 'callout good' },
        h('strong', {}, 'What this means for you. '),
        'A chatbot writes its answer one token at a time, each one a fresh guess based on everything before it, including its own earlier words. That\'s why a reply can start strong and then drift, and why it is worth reading all the way to the end.',
      ),
      h('p', { class: 'sources' },
        'The attention weights, numbers and percentages in this demo are hand-made illustrations, not output from a real model. Real-model figures (128,000-token vocabulary, 126 layers, 405 billion parameters, and 4,096 to 16,384 numbers per token) are company-reported in ',
        h('a', { href: 'https://arxiv.org/abs/2407.21783', target: '_blank', rel: 'noopener' }, 'Meta\'s "The Llama 3 Herd of Models" (2024)'),
        '. For comparison, ',
        h('a', { href: 'https://huggingface.co/openai-community/gpt2/raw/main/config.json', target: '_blank', rel: 'noopener' }, 'OpenAI\'s 2019 GPT-2 had 50,257 tokens'),
        '.',
      ),
    );
    player.start();
  },
};
