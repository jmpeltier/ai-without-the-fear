import { h, sectionHeader } from '../ui.js';

const WORDS = ['The', 'trophy', "didn't", 'fit', 'in', 'the', 'suitcase', 'because', 'it', 'was', 'too', 'big'];
const IT = 8;
const LAST = 11;

// Hand-authored, illustrative attention weights: word index -> [[other word index, weight], ...].
// Only "it" and the last word change when the ending flips.
const SHARED = {
  0: [[1, 6], [3, 1]],
  1: [[3, 3], [6, 3], [LAST, 2], [0, 1]],
  2: [[3, 5], [1, 2]],
  3: [[1, 3], [6, 3], [2, 3], [4, 1]],
  4: [[6, 4], [3, 3]],
  5: [[6, 6], [4, 1]],
  6: [[1, 3], [4, 2], [3, 2], [5, 1]],
  7: [[2, 3], [3, 2], [IT, 2], [LAST, 2]],
  9: [[IT, 4], [LAST, 3]],
  10: [[LAST, 5], [9, 2]],
};
const ENDINGS = {
  big: {
    word: 'big',
    answer: 'trophy',
    weights: { ...SHARED, [IT]: [[1, 6], [LAST, 3], [6, 1.2], [9, 0.6]], [LAST]: [[IT, 4], [10, 3], [1, 3], [6, 1]] },
  },
  small: {
    word: 'small',
    answer: 'suitcase',
    weights: { ...SHARED, [IT]: [[6, 6], [LAST, 3], [1, 1.2], [9, 0.6]], [LAST]: [[IT, 4], [10, 3], [6, 3], [1, 1]] },
  },
};

const wordAt = (i, ending) => (i === LAST ? ending.word : WORDS[i]);

function normalized(pairs) {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  return pairs.map(([i, w]) => [i, w / total]).sort((a, b) => b[1] - a[1]);
}

function renderDemo() {
  let ending = ENDINGS.big;
  let selected = IT;

  const sentence = h('p', { class: 'at-sentence' });
  const detail = h('div', { class: 'at-detail', 'aria-live': 'polite' });
  const toggle = h('div', { class: 'at-toggle', role: 'group', 'aria-label': 'Change the last word' },
    Object.entries(ENDINGS).map(([key, e]) => h('button', {
      type: 'button',
      class: 'btn',
      'data-ending': key,
      onClick: () => { ending = e; draw(); },
    }, `…too ${e.word}`)),
  );

  function draw() {
    const pairs = normalized(ending.weights[selected]);
    const strength = new Map(pairs);
    sentence.replaceChildren(...WORDS.map((_, i) => {
      const word = h('button', {
        type: 'button',
        class: `at-word${i === selected ? ' is-selected' : ''}`,
        'aria-pressed': String(i === selected),
        onClick: () => { selected = i; draw(); },
      }, wordAt(i, ending));
      // Custom properties need setProperty; the style-object shorthand in h() drops them.
      word.style.setProperty('--w', (strength.get(i) || 0).toFixed(2));
      return word;
    }), h('span', { class: 'at-period' }, '.'));

    detail.replaceChildren(
      h('p', {}, 'When reading ', h('strong', {}, `"${wordAt(selected, ending)}"`), ', the model pays most attention to:'),
      ...pairs.slice(0, 3).map(([i, share]) => h('div', { class: 'bar-row' },
        h('span', { class: 'at-bar-word' }, wordAt(i, ending)),
        h('div', { class: 'bar-track' }, h('div', { class: 'bar-fill', style: { width: `${Math.round(share * 100)}%` } })),
        h('span', {}, `${Math.round(share * 100)}%`),
      )),
      selected === IT && h('p', { class: 'at-answer' }, `So here "it" means the `, h('strong', {}, ending.answer), '.'),
    );
    toggle.querySelectorAll('button').forEach((b) => {
      const on = ENDINGS[b.dataset.ending] === ending;
      b.classList.toggle('btn-primary', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }
  draw();

  return h('div', { class: 'card' },
    h('h2', { class: 'at-h2' }, '🔦 Who is "it"?'),
    h('p', {}, 'Read this sentence. What does "it" mean? Easy for you. For decades, it was hard for computers.'),
    sentence,
    h('p', { class: 'at-hint' }, 'Tap any word to see which other words it "pays attention to." Brighter means more attention.'),
    detail,
    h('p', { class: 'at-flip' }, 'Now flip the last word and tap "it" again:'),
    toggle,
    h('p', { class: 'at-label' }, 'The attention percentages here are hand-made illustrations. Real models compute millions of these, in many layers at once.'),
  );
}

export default {
  id: 'attention',
  title: 'The big breakthrough: attention',
  icon: '🔦',
  minutes: 4,
  render(root, section) {
    root.append(
      sectionHeader(section, 'In 2017, Google researchers introduced the "transformer." Its trick, called attention, is to read the whole sentence at once and work out which words matter to each other.'),
      renderDemo(),
      h('div', { class: 'card' },
        h('h2', { class: 'at-h2' }, '📞 Telephone vs. 🎉 a party'),
        h('div', { class: 'at-compare' },
          h('div', { class: 'at-side' },
            h('h3', {}, 'Before: a game of telephone'),
            h('p', {}, 'Older systems read one word at a time and passed a running summary down the line. By the end of a long sentence, the beginning got fuzzy, and they were slow because each step waited on the last.'),
          ),
          h('div', { class: 'at-side is-new' },
            h('h3', {}, 'After: everyone at a party'),
            h('p', {}, 'A transformer is like a party where every word can hear every other word at the same time, and each one tunes in to the voices that matter to it. "It" listens hard to "trophy" and "big."'),
          ),
        ),
        h('p', {}, 'Because every word is handled at once, this design runs beautifully on modern computer chips. That made it practical to train on a huge slice of the internet.'),
      ),
      h('div', { class: 'callout good' },
        h('strong', {}, 'What this means for you. '),
        'This is why today\'s chatbots follow context so well: they keep the whole conversation in view. It\'s also why giving them clear context ("I\'m 72, retired, and new to smartphones...") gets you much better answers.',
      ),
      h('p', { class: 'sources' },
        'Sources: ',
        h('a', { href: 'https://arxiv.org/abs/1706.03762', target: '_blank', rel: 'noopener' }, 'Vaswani et al., "Attention Is All You Need" (2017)'),
        '; ',
        h('a', { href: 'https://en.wikipedia.org/wiki/Attention_Is_All_You_Need', target: '_blank', rel: 'noopener' }, 'its authors worked at Google'),
        '; ',
        h('a', { href: 'https://cs.nyu.edu/~davise/papers/WSOld.html', target: '_blank', rel: 'noopener' }, 'the trophy and suitcase puzzle comes from Hector Levesque\'s "Winograd schemas," a classic test for computers'),
        '.',
      ),
    );
  },
};
