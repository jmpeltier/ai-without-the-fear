import { h, sectionHeader, store } from '../ui.js';

const KEY_IDEAS = [
  { icon: '🕰️', text: 'AI is not new. The name was coined in 1956. What\'s new is how good it got.' },
  { icon: '💡', text: 'The big leap was the "transformer," a 2017 idea that lets a computer weigh every word against every other word.' },
  { icon: '⌨️', text: 'A chatbot predicts the next word, like your phone\'s autocomplete, only far bigger.' },
  { icon: '🤥', text: 'It can be confidently wrong. Double-check anything about health, money, or the law.' },
  { icon: '🏭', text: 'Giant data centers are why it\'s fast, and why they\'re so big and use so much power.' },
  { icon: '🔒', text: 'Never paste secrets: passwords, account numbers, your Social Security number.' },
  { icon: '📞', text: 'Scammers use AI too. Pick a family safe word, and hang up and call back on a number you know.' },
];

const GLOSSARY = [
  ['AI (artificial intelligence)', 'Computer programs that do things we used to think needed a human mind, like understanding language or recognizing faces.'],
  ['Chatbot', 'An AI you talk with by typing or speaking, like ChatGPT or Claude.'],
  ['LLM (large language model)', 'The engine inside a chatbot. A program that learned language patterns from an enormous amount of text.'],
  ['Transformer', 'The 2017 design that made modern chatbots possible. It looks at all the words at once to see which ones matter to each other.'],
  ['Token', 'A chunk of a word. AI reads and writes in these small pieces, a bit like syllables.'],
  ['Training', 'The long "schooling" stage where the AI reads huge amounts of text and slowly gets better at predicting the next word.'],
  ['Hallucination', 'When an AI states something false as if it were true. It isn\'t lying; it\'s guessing badly.'],
  ['Prompt', 'Whatever you type or say to the AI. Your question or request.'],
  ['Deepfake', 'A fake video, photo, or voice made by AI to look or sound like a real person.'],
  ['Data center', 'A huge building full of computers. This is where the AI actually runs when you use it.'],
];

function questionsBox() {
  const status = h('p', { class: 'take-saved', 'aria-live': 'polite' });
  const area = h('textarea', {
    id: 'take-questions', rows: 5, 'aria-labelledby': 'take-questions-label',
    placeholder: 'For example: Can I use AI to help with my family history research?',
    onInput: () => {
      store.set('takeaways:questions', area.value);
      status.textContent = '✓ Saved on this device';
    },
  });
  area.value = store.get('takeaways:questions', '');
  return h('div', { class: 'card take-questions' },
    h('h2', { id: 'take-questions-label' }, 'Questions to bring next time'),
    h('p', {}, 'Jot down anything you\'re still wondering about. It stays on your phone, only you can see it, and it\'s here when you come back.'),
    area,
    status);
}

export default {
  id: 'takeaways',
  title: 'Take-home cheat sheet',
  icon: '📝',
  minutes: 3,
  render(root, section) {
    root.append(
      sectionHeader(section, 'Everything from today on one page. Keep it, print it, or share it with a friend.'),

      h('button', { class: 'btn btn-primary btn-big take-print', type: 'button', onClick: () => window.print() }, '🖨️ Print this page'),

      h('h2', {}, '7 things to remember'),
      h('ol', { class: 'take-ideas' }, KEY_IDEAS.map((idea) =>
        h('li', { class: 'card' }, h('span', { class: 'take-icon', 'aria-hidden': 'true' }, idea.icon), h('span', {}, idea.text)))),

      h('h2', {}, 'Plain-English glossary'),
      h('dl', { class: 'take-glossary' }, GLOSSARY.map(([term, def]) => h('div', {}, h('dt', {}, term), h('dd', {}, def)))),

      questionsBox(),

      h('div', { class: 'callout good take-thanks' },
        h('strong', {}, 'Thank you for coming! '),
        'This page stays online after class, so come back anytime to replay the games, copy a prompt, or make a new safe word.'),

      h('p', { class: 'sources' }, 'Sources: ',
        h('a', { href: 'https://home.dartmouth.edu/about/artificial-intelligence-ai-coined-dartmouth' }, 'Dartmouth, "Artificial Intelligence (AI) Coined at Dartmouth" (1956 workshop)'), '; ',
        h('a', { href: 'https://arxiv.org/abs/1706.03762' }, 'Vaswani et al., "Attention Is All You Need," submitted June 12, 2017'), '. ',
        'Safety tips are sourced in the "Try it safely" and "Spot the AI scam" parts.'),
    );
  },
};
