import { h, sectionHeader, store } from '../ui.js';

// Hand-authored, illustrative percentages. Not measured from any real model.
const ROUNDS = [
  {
    prompt: 'Peanut butter and ...',
    options: [{ word: 'jelly', pct: 78 }, { word: 'banana', pct: 8 }, { word: 'honey', pct: 6 }, { word: 'pickles', pct: 1 }],
    note: 'You\'ve seen "peanut butter and jelly" thousands of times. So has the model. Most-seen wins.',
  },
  {
    prompt: 'Happy birthday to ...',
    options: [{ word: 'you', pct: 91 }, { word: 'me', pct: 4 }, { word: 'my', pct: 3 }, { word: 'Grandpa', pct: 1 }],
    note: 'Song lyrics are about as predictable as language gets.',
  },
  {
    prompt: 'Bless your ...',
    options: [{ word: 'heart', pct: 93 }, { word: 'soul', pct: 3 }, { word: 'little', pct: 2 }, { word: 'socks', pct: 0.5 }],
    note: 'Every Southerner knows what comes next, and exactly what it means.',
  },
  {
    prompt: 'I\'ll have a glass of sweet ...',
    options: [{ word: 'tea', pct: 72 }, { word: 'wine', pct: 14 }, { word: 'milk', pct: 3 }, { word: 'lemonade', pct: 3 }],
    note: 'The words before the blank matter. "A glass of sweet" points straight at tea.',
  },
  {
    prompt: 'The capital of Georgia is ...',
    options: [{ word: 'Atlanta', pct: 82 }, { word: 'Tbilisi', pct: 10 }, { word: 'a', pct: 3 }, { word: 'Savannah', pct: 2 }],
    note: 'Tbilisi is the capital of the country of Georgia. The model never "looks it up." It picks what usually follows these words, so a vague question can get a confident answer to the wrong Georgia.',
  },
];

// A tiny hand-built next-word table for the creativity dial. Weights are illustrative.
const NEXT = {
  START: { My: 5, The: 3, Grandma: 2 },
  My: { dog: 5, grandma: 3, neighbor: 2, toaster: 0.15 },
  The: { dog: 5, cat: 3, preacher: 1.2, moon: 0.15 },
  Grandma: { makes: 5, sings: 2, drives: 1.5, juggles: 0.15 },
  grandma: { makes: 5, sings: 2, drives: 1.5, juggles: 0.15 },
  dog: { loves: 5, chases: 3, sings: 0.2 },
  cat: { ignores: 5, loves: 3, juggles: 0.15 },
  neighbor: { waters: 5, loves: 2, juggles: 0.2 },
  toaster: { sings: 3, loves: 1 },
  preacher: { loves: 4, sings: 2, juggles: 0.2 },
  moon: { sings: 3, ignores: 1 },
  makes: { biscuits: 6, pie: 3, trouble: 0.4 },
  sings: { hymns: 5, loudly: 3, opera: 0.4 },
  drives: { slowly: 6, fast: 1, tractors: 0.3 },
  juggles: { biscuits: 2, pie: 1, tractors: 1 },
  loves: { biscuits: 5, me: 3, Sundays: 2, opera: 0.2 },
  chases: { squirrels: 6, cars: 2, trouble: 0.4 },
  ignores: { me: 6, everyone: 2, gravity: 0.2 },
  waters: { tomatoes: 6, flowers: 3, mailboxes: 0.2 },
};
const ENDINGS = { '.': 8, 'every morning.': 1.2, 'at midnight.': 0.2 };
const MAX_WORDS = 8;

function sampleNext(weights, temperature) {
  const entries = Object.entries(weights);
  if (temperature === 0) return entries.reduce((best, e) => (e[1] > best[1] ? e : best));
  const scaled = entries.map(([w, p]) => [w, p ** (1 / temperature)]);
  const total = scaled.reduce((s, [, p]) => s + p, 0);
  let r = Math.random() * total;
  const pick = scaled.find(([, p]) => (r -= p) <= 0) || scaled[scaled.length - 1];
  return [pick[0], weights[pick[0]]];
}

function writeSentence(temperature) {
  const words = [];
  let key = 'START';
  while (NEXT[key] && words.length < MAX_WORDS) {
    const [word, weight] = sampleNext(NEXT[key], temperature);
    const total = Object.values(NEXT[key]).reduce((s, p) => s + p, 0);
    words.push({ word, share: weight / total });
    key = word;
  }
  const [ending, weight] = sampleNext(ENDINGS, temperature);
  if (ending === '.') words[words.length - 1].word += '.';
  else words.push({ word: ending, share: weight / Object.values(ENDINGS).reduce((s, p) => s + p, 0) });
  return words;
}

const DIAL_LABELS = [
  [0, 'Predictable: always the top word'],
  [0.6, 'Sensible: usually the top word'],
  [1.2, 'Playful: surprises now and then'],
  [Infinity, 'Wild: long shots get picked a lot'],
];
const dialLabel = (t) => DIAL_LABELS.find(([max]) => t <= max)[1];

function renderRounds() {
  const body = h('div', {});
  let index = 0;
  let matches = 0;

  function show() {
    const round = ROUNDS[index];
    const ranked = [...round.options].sort((a, b) => b.pct - a.pct);
    const top = ranked[0].word;
    const reveal = h('div', { 'aria-live': 'polite' });
    const guesses = round.options.map((o) => h('button', {
      type: 'button',
      class: 'choice nw-guess',
      onClick: () => pick(o.word),
    }, o.word));

    function pick(word) {
      if (word === top) matches++;
      guesses.forEach((g, i) => {
        g.disabled = true;
        const w = round.options[i].word;
        if (w === top) g.classList.add('is-correct');
        else if (w === word) g.classList.add('is-wrong');
      });
      const bars = ranked.map((o) => {
        const fill = h('div', { class: 'bar-fill', style: { width: '0%' } });
        return { o, fill, row: h('div', { class: `bar-row${o.word === word ? ' nw-yours' : ''}` },
          h('span', { class: 'nw-word' }, o.word, o.word === word && h('span', { class: 'nw-you' }, ' ← you')),
          h('div', { class: 'bar-track' }, fill),
          h('span', { class: 'nw-pct' }, `${o.pct}%`),
        ) };
      });
      const last = index === ROUNDS.length - 1;
      reveal.replaceChildren(
        h('p', { class: 'nw-reveal-title' }, 'What a model might rank (illustrative):'),
        ...bars.map((b) => b.row),
        h('p', { class: 'nw-note' }, round.note),
        h('button', { type: 'button', class: 'btn btn-primary', onClick: () => { if (last) finish(); else { index++; show(); } } },
          last ? 'How did I do?' : 'Next round →'),
      );
      requestAnimationFrame(() => requestAnimationFrame(() => bars.forEach((b) => { b.fill.style.width = `${b.o.pct}%`; })));
    }

    body.replaceChildren(
      h('p', { class: 'eyebrow' }, `Round ${index + 1} of ${ROUNDS.length}`),
      h('p', { class: 'nw-prompt' }, round.prompt),
      h('p', {}, 'Tap the word you think comes next.'),
      h('div', { class: 'choices nw-grid' }, guesses),
      reveal,
    );
  }

  function finish() {
    store.set('next-word:matches', matches);
    body.replaceChildren(
      h('p', { class: 'stat' }, `${matches} / ${ROUNDS.length}`),
      h('p', { class: 'stat-label' }, 'times you picked the same word the model would rank first'),
      h('p', {}, 'If you matched most of them, congratulations: you think like a language model. You\'ve read so much English that you just know what usually comes next. The AI learned the same way, from far more reading than any person could ever do.'),
      h('button', { type: 'button', class: 'btn', onClick: () => { index = 0; matches = 0; show(); } }, 'Play again'),
    );
  }

  show();
  return h('div', { class: 'card' }, h('h2', { class: 'nw-h2' }, '🔮 Can you beat the autocomplete?'), body);
}

function renderDial() {
  let temperature = 0;
  const label = h('p', { class: 'nw-dial-label', 'aria-live': 'polite' });
  const slider = h('input', {
    type: 'range', min: '0', max: '2', step: '0.1', value: '0',
    'aria-label': 'Creativity dial',
    onInput: (e) => { temperature = Number(e.target.value); label.textContent = dialLabel(temperature); },
  });
  label.textContent = dialLabel(temperature);
  const output = h('ol', { class: 'nw-sentences', 'aria-live': 'polite' });

  function write() {
    const words = writeSentence(temperature);
    const line = h('li', { class: 'nw-sentence' },
      words.map(({ word, share }) => h('span', {
        class: `nw-token${share < 0.1 ? ' is-longshot' : share < 0.35 ? ' is-unusual' : ''}`,
        title: `${Math.round(share * 100)}% likely`,
      }, word)),
    );
    output.prepend(line);
    while (output.children.length > 5) output.lastChild.remove();
  }

  return h('div', { class: 'card' },
    h('h2', { class: 'nw-h2' }, '🎛️ The creativity dial'),
    h('p', {}, 'Chatbots don\'t always pick the single most likely word. A setting engineers call "temperature" decides how adventurous to be. Slide it, then press the button a few times.'),
    h('div', { class: 'nw-dial' }, h('span', {}, '🧊 Predictable'), h('span', {}, 'Wild 🌶️')),
    slider,
    label,
    h('button', { type: 'button', class: 'btn btn-primary btn-big nw-write', onClick: write }, '✍️ Write a sentence'),
    output,
    h('p', { class: 'nw-legend' },
      h('span', { class: 'nw-token' }, 'likely'), ' ',
      h('span', { class: 'nw-token is-unusual' }, 'less likely'), ' ',
      h('span', { class: 'nw-token is-longshot' }, 'long shot'),
    ),
  );
}

export default {
  id: 'next-word',
  title: 'Guess the next word',
  icon: '🔮',
  minutes: 7,
  render(root, section) {
    root.append(
      sectionHeader(section, 'A chatbot is autocomplete on a giant scale. It looks at your words and predicts the next one. Then the next. Then the next, over and over, until the answer is done.'),
      h('div', { class: 'callout' },
        'You already use a tiny version of this. When your phone suggests the next word while you text, that\'s the same basic idea. ChatGPT, Claude and Gemini just do it with far more practice.',
      ),
      renderRounds(),
      renderDial(),
      h('div', { class: 'callout warn' },
        h('strong', {}, 'Why chatbots sometimes make things up. '),
        'The model picks words that sound likely, not facts it looked up. Most of the time, likely and true line up. When they don\'t, you get a smooth, confident sentence that is simply wrong. People call that a "hallucination."',
      ),
      h('div', { class: 'callout good' },
        h('strong', {}, 'What this means for you. '),
        'Treat a chatbot like a well-read friend who talks fast: great for ideas, drafts and explanations. For anything that matters (a dose, a date, a dollar amount), check it somewhere trustworthy.',
      ),
      h('p', { class: 'sources' }, 'All percentages and word tables on this page are hand-made illustrations for teaching, not output from a real model.'),
    );
  },
};
