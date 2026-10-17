import { h, sectionHeader } from '../ui.js';

const TEXTS = [
  {
    name: '🐑 Nursery rhymes',
    text: `Mary had a little lamb, its fleece was white as snow. And everywhere that Mary went, the lamb was sure to go.
Twinkle, twinkle, little star, how I wonder what you are! Up above the world so high, like a diamond in the sky.
Jack and Jill went up the hill to fetch a pail of water. Jack fell down and broke his crown, and Jill came tumbling after.
Hey diddle diddle, the cat and the fiddle, the cow jumped over the moon. The little dog laughed to see such sport, and the dish ran away with the spoon.
Humpty Dumpty sat on a wall. Humpty Dumpty had a great fall. All the king's horses and all the king's men couldn't put Humpty together again.`,
  },
  {
    name: '🍑 Grandma\'s kitchen',
    text: `Grandma says the secret to good biscuits is cold butter and a warm heart. Grandma says the secret to good tea is more sugar than you think.
Cut the cold butter into the flour with a fork. Pour in the buttermilk and stir until the dough just comes together. Do not stir too much or the biscuits get tough.
Pat the dough out on the counter and cut the biscuits with a glass. Bake the biscuits until the tops are golden.
Serve the biscuits warm with butter and peach jam. Serve the tea cold with lemon and a sprig of mint.
Grandma says the best part of the biscuits is sharing them on the porch. Grandma says the best part of the porch is the company.`,
  },
  {
    name: '🎭 Shakespeare',
    text: `Shall I compare thee to a summer's day? Thou art more lovely and more temperate. Rough winds do shake the darling buds of May, and summer's lease hath all too short a date.
Sometime too hot the eye of heaven shines, and often is his gold complexion dimm'd. And every fair from fair sometime declines, by chance or nature's changing course untrimm'd.
But thy eternal summer shall not fade, nor lose possession of that fair thou ow'st. Nor shall death brag thou wander'st in his shade, when in eternal lines to time thou grow'st.
So long as men can breathe or eyes can see, so long lives this, and this gives life to thee.`,
  },
];

const END = '⏹';
const MAX_GENERATED = 30;
const TOP_CHIPS = 24;

// The model: for every word, how many times each other word came right after it.
function train(text) {
  const follows = new Map();
  const starts = [];
  let total = 0;
  for (const sentence of text.split(/[.!?]+/)) {
    const words = sentence.toLowerCase().match(/[\p{L}\p{N}']+/gu);
    if (!words) continue;
    total += words.length;
    starts.push(words[0]);
    [...words, END].forEach((word, i, all) => {
      if (i === 0) return;
      const prev = all[i - 1];
      if (!follows.has(prev)) follows.set(prev, new Map());
      const counts = follows.get(prev);
      counts.set(word, (counts.get(word) || 0) + 1);
    });
  }
  return { follows, starts, total };
}

function pickWeighted(counts) {
  const entries = [...counts];
  let r = Math.random() * entries.reduce((s, [, n]) => s + n, 0);
  return entries.find(([, n]) => (r -= n) < 0)?.[0] ?? entries[entries.length - 1][0];
}

function generate(model, startWord) {
  const words = [startWord ?? model.starts[Math.floor(Math.random() * model.starts.length)]];
  while (words.length < MAX_GENERATED) {
    const counts = model.follows.get(words[words.length - 1]);
    if (!counts) break;
    const next = pickWeighted(counts);
    if (next === END) break;
    words.push(next);
  }
  return words;
}

const display = (word) => (word === 'i' ? 'I' : word);

export default {
  id: 'tiny-model',
  title: 'Train a tiny AI',
  icon: '🐣',
  minutes: 4,
  render(root, section) {
    let model = null;
    let chosen = TEXTS[0];

    const textarea = h('textarea', { rows: '6', 'aria-label': 'Training text', onInput: () => markStale() }, chosen.text);
    const status = h('p', { class: 'tm-status', 'aria-live': 'polite' }, 'Not trained yet. Pick some text, then press Train.');
    const trainBtn = h('button', { type: 'button', class: 'btn btn-primary btn-big', onClick: () => doTrain() }, '🎓 Train');
    const genBtn = h('button', { type: 'button', class: 'btn btn-big', disabled: true, onClick: () => doGenerate() }, '✨ Generate');
    const output = h('div', { class: 'tm-output', 'aria-live': 'polite' });
    const vocab = h('div', { class: 'tm-vocab' });
    const table = h('div', { class: 'tm-table', 'aria-live': 'polite' });
    const learned = h('div', { class: 'tm-learned', hidden: true },
      h('h3', {}, '🔍 Peek inside its brain'),
      h('p', {}, 'Tap a word to see what the model learned can come next.'),
      vocab, table);

    const picker = h('div', { class: 'tm-picker', role: 'group', 'aria-label': 'Training text' },
      TEXTS.map((t) => h('button', {
        type: 'button', class: 'btn', 'aria-pressed': String(t === chosen),
        onClick: (e) => {
          chosen = t;
          textarea.value = t.text;
          picker.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget)));
          markStale();
        },
      }, t.name)),
    );

    function markStale() {
      if (!model) return;
      model = null;
      genBtn.disabled = true;
      genBtn.classList.remove('btn-primary');
      trainBtn.classList.add('btn-primary');
      learned.hidden = true;
      output.replaceChildren();
      status.textContent = 'The text changed. Press Train to teach it the new text.';
    }

    function doTrain() {
      const next = train(textarea.value);
      if (!next.total) { status.textContent = 'There are no words to learn from yet. Type or paste some text.'; return; }
      model = next;
      genBtn.disabled = false;
      genBtn.classList.add('btn-primary');
      trainBtn.classList.remove('btn-primary');
      const pairs = [...model.follows.values()].reduce((s, m) => s + m.size, 0);
      status.replaceChildren(
        h('span', { class: 'tm-big' }, model.total), ' words read, ',
        h('span', { class: 'tm-big' }, model.follows.size), ' different words, ',
        h('span', { class: 'tm-big' }, pairs), ' "what comes next" pairs learned.',
      );
      const byFrequency = [...model.follows].sort((a, b) => sum(b[1]) - sum(a[1])).slice(0, TOP_CHIPS).map(([w]) => w);
      vocab.replaceChildren(...byFrequency.map(wordChip));
      table.replaceChildren();
      learned.hidden = false;
      output.replaceChildren(h('p', { class: 'tm-hint' }, 'Trained! Now press Generate.'));
    }

    function doGenerate() {
      const words = generate(model);
      const sentence = words.map(display).join(' ');
      output.replaceChildren(
        h('p', { class: 'tm-sentence' }, sentence.charAt(0).toUpperCase() + sentence.slice(1), '.'),
        h('p', { class: 'tm-hint' }, 'Tap a word below to see why it went that way.'),
        h('div', { class: 'tm-vocab' }, [...new Set(words)].map(wordChip)),
      );
    }

    function wordChip(word) {
      return h('button', { type: 'button', class: 'tm-chip', onClick: () => showNext(word) }, display(word));
    }

    function showNext(word) {
      const counts = model.follows.get(word);
      const total = sum(counts);
      const rows = [...counts].sort((a, b) => b[1] - a[1]);
      table.replaceChildren(
        h('p', {}, 'After ', h('strong', {}, `"${display(word)}"`), ` it saw (${total} time${total === 1 ? '' : 's'}):`),
        h('table', {},
          h('thead', {}, h('tr', {}, h('th', {}, 'Next word'), h('th', {}, 'Times'), h('th', {}, 'Chance'))),
          h('tbody', {}, rows.map(([next, n]) => h('tr', {},
            h('td', {}, next === END ? '(end of sentence)' : display(next)),
            h('td', {}, n),
            h('td', {}, `${Math.round((n / total) * 100)}%`),
          ))),
        ),
      );
      learned.hidden = false;
      table.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    root.append(
      sectionHeader(section, 'Let\'s build a real (very tiny) AI right here on your phone. It reads some text, counts which word tends to follow which, then writes new sentences from those counts.'),
      h('div', { class: 'card' },
        h('h2', { class: 'tm-h2' }, '1. Pick what it reads'),
        picker,
        h('p', { class: 'tm-hint' }, 'Or erase the box and paste your own text: a favorite poem, a recipe, a family letter. It never leaves your phone.'),
        textarea,
        h('h2', { class: 'tm-h2' }, '2. Teach it, then let it write'),
        h('div', { class: 'tm-buttons' }, trainBtn, genBtn),
        status,
        output,
        learned,
      ),
      h('div', { class: 'callout' },
        h('strong', {}, 'Same idea, wildly different scale. '),
        'ChatGPT, Claude and Gemini also learned to predict the next word from text. But they read a huge slice of the internet and books instead of a few rhymes, and they tune billions of adjustable settings instead of keeping a simple tally.',
      ),
      h('div', { class: 'callout warn' },
        h('strong', {}, 'Being honest about the difference. '),
        'Our tiny model only looks at the one word right before. That\'s why it rambles. Real models are not just word-pair counters. They use the transformer\'s attention (Part 4) to weigh the whole conversation at once, which lets them follow ideas, grammar and context across many paragraphs.',
      ),
      h('div', { class: 'callout good' },
        h('strong', {}, 'What this means for you. '),
        'An AI can only echo patterns in what it learned from. Feed it rhymes, it talks in rhymes. That\'s why chatbots can repeat the mistakes and blind spots of the text they were trained on.',
      ),
      h('p', { class: 'sources' }, 'This demo is a simple word-pair counter (a "bigram" or Markov model), computed live in your browser. Nursery rhymes and Shakespeare\'s Sonnet 18 are in the public domain. The kitchen text is original.'),
    );
  },
};

function sum(counts) {
  let total = 0;
  for (const n of counts.values()) total += n;
  return total;
}
