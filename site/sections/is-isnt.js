import { h, sectionHeader, store } from '../ui.js';

const ANSWERS = [
  { value: 'myth', label: 'Myth' },
  { value: 'fact', label: 'Fact' },
  { value: 'sort of', label: 'Sort of' },
];

const CARDS = [
  {
    statement: 'An AI chatbot looks up its answers, the way a search engine does.',
    answer: 'sort of',
    explain: 'Out of the box, a chatbot answers from patterns it soaked up during training, a bit like a well-read friend answering from memory. Many chatbots can now also search the web and show you links. If you don\'t see links, assume it is answering from memory.',
  },
  {
    statement: 'A chatbot can sound completely sure of itself and still be flat wrong.',
    answer: 'fact',
    explain: 'This is called a "hallucination": the AI fills a gap with something that sounds right but isn\'t. In 2023 two New York lawyers were fined $5,000 for filing a brief with court cases ChatGPT made up. In 2025 the Georgia Court of Appeals threw out a divorce ruling that cited cases that don\'t exist.',
  },
  {
    statement: 'AI is conscious and has real feelings.',
    answer: 'myth',
    explain: 'It learned from billions of sentences people wrote, and people write about feelings constantly. So it is very good at producing what a caring or hurt reply looks like. There is no good evidence that today\'s chatbots actually feel anything. Being kind to it is fine. Trusting it like a friend is where people get into trouble.',
  },
  {
    statement: 'It remembers everything you have ever told it.',
    answer: 'sort of',
    explain: 'It depends on the app and your settings. Some chatbots have a "memory" feature that carries details from one chat to the next, and you can usually view it, delete it, or switch it off. Many also offer a temporary chat that isn\'t saved to your history. Either way, the company may keep your conversations, so don\'t type anything you wouldn\'t want stored.',
  },
  {
    statement: 'AI could take over the world tomorrow.',
    answer: 'myth',
    explain: 'Today\'s chatbots don\'t have goals of their own, and they can only take actions people hook them up to. The real concerns are calmer and closer to home: scams and fake voices or videos, misinformation, privacy, bias, jobs, and energy use. Some researchers do worry about much more powerful future systems, which is why safety research and new rules get so much attention.',
  },
  {
    statement: 'AI only knows about the world up to the day it was trained.',
    answer: 'sort of',
    explain: 'Each model\'s training stops on a "cutoff" date, so on its own it can be months behind the news. Many chatbots now search the web to fill that gap. For anything time-sensitive, like prices, laws, or medicine, check the date on whatever source it shows you.',
  },
  {
    statement: 'AI can be biased.',
    answer: 'fact',
    explain: 'It learned from human writing, and picked up our slants along with our knowledge. It might assume a nurse is "she" and an engineer is "he," or know more about some places and groups than others. Companies work to reduce this, but it is worth a second look on anything that matters.',
  },
  {
    statement: 'AI is genuinely useful for drafting, explaining, and summarizing.',
    answer: 'fact',
    explain: 'This is where it shines. A first draft of a tricky letter. A confusing insurance notice explained in plain English. A long article boiled down to five bullet points. You stay the editor: read it over before you use it.',
  },
  {
    statement: 'AI can replace your doctor or your lawyer.',
    answer: 'myth',
    explain: 'It doesn\'t know your full history, it can be confidently wrong, and nobody is accountable for its advice. Where it really helps is getting ready: ask it to explain a term from your test results, or to list good questions to bring to your appointment.',
  },
];

const SPOT = {
  question: 'Tell me a little about the Chattahoochee River, and suggest a good book about it.',
  sentences: [
    { text: 'The Chattahoochee River begins in the mountains of north Georgia and flows southwest toward Alabama.' },
    { text: 'Farther south, it forms part of the border between Georgia and Alabama.' },
    { text: 'It supplies much of the drinking water for metro Atlanta.' },
    {
      text: 'A 2019 study by the Georgia River Institute found it is the cleanest major river in the Southeast.',
      invented: 'Made up. We invented this study and this institute for the exercise. A specific study with a year and a tidy, flattering finding is a classic hallucination pattern.',
    },
    { text: 'The poet Sidney Lanier wrote a well-known poem about it called "Song of the Chattahoochee."' },
    {
      text: 'For a great read, try "The Hooch Remembers: Two Centuries on Georgia\'s River" by Dr. Harriet Vance (University of Georgia Press, 1994).',
      invented: 'Made up. We invented this book and author for the exercise. Chatbots love to invent book titles that sound perfectly real, complete with a publisher and year. Always look a book up before you go hunting for it.',
    },
  ],
};

const GOOD_AT = [
  'First drafts of letters, emails, and toasts',
  'Explaining a confusing word, bill, or form in plain English',
  'Summarizing a long article or document',
  'Brainstorming: gift ideas, recipes from what\'s in the fridge, trip plans',
  'Practicing a conversation or a new language',
];

const BAD_AT = [
  'Being right every time, especially with names, numbers, quotes, and book titles',
  'Knowing today\'s news unless it searches the web',
  'Knowing you, your history, or your situation',
  'Medical, legal, or money decisions on its own',
  'Being a true friend. It is a tool, however warm it sounds',
];

const answerLabel = (value) => ANSWERS.find((a) => a.value === value).label;

function renderGame() {
  const answers = store.get('is-isnt:answers', {});
  let index = Math.min(Object.keys(answers).length, CARDS.length);
  const box = h('div', {});

  const score = () => CARDS.filter((card, i) => answers[i] === card.answer).length;
  const scoreLine = () => h('p', { class: 'eyebrow ii-score' }, `Score: ${score()} of ${Object.keys(answers).length}`);

  function pick(value) {
    answers[index] = value;
    store.set('is-isnt:answers', answers);
    draw();
  }

  function draw() {
    if (index >= CARDS.length) {
      const total = score();
      box.replaceChildren(h('div', { class: 'card ii-done' },
        h('p', { class: 'eyebrow' }, 'Final score'),
        h('p', { class: 'stat' }, `${total} of ${CARDS.length}`),
        h('p', {}, total >= 7 ? 'You could teach this class.' : total >= 4 ? 'Nicely done. The "sort of" cards are the tricky ones.' : 'That\'s exactly why we play. These are easy to get wrong.'),
        h('button', { class: 'btn', type: 'button', onClick: () => { store.set('is-isnt:answers', {}); Object.keys(answers).forEach((k) => delete answers[k]); index = 0; draw(); } }, 'Play again'),
      ));
      return;
    }
    const card = CARDS[index];
    const picked = answers[index];
    box.replaceChildren(h('div', { class: 'card ii-card' },
      h('div', { class: 'ii-card-top' },
        h('p', { class: 'eyebrow' }, `Card ${index + 1} of ${CARDS.length}`),
        scoreLine(),
      ),
      h('p', { class: 'ii-statement' }, `"${card.statement}"`),
      h('div', { class: 'ii-answers', role: 'group', 'aria-label': 'Your answer' },
        ANSWERS.map((a) => h('button', {
          type: 'button',
          class: `choice ii-answer${picked && a.value === card.answer ? ' is-correct' : ''}${picked === a.value && a.value !== card.answer ? ' is-wrong' : ''}`,
          disabled: Boolean(picked),
          onClick: () => pick(a.value),
        }, a.label)),
      ),
      picked && h('div', { class: `callout ${picked === card.answer ? 'good' : 'warn'}`, 'aria-live': 'polite' },
        h('p', {}, h('strong', {}, picked === card.answer ? `Yes! ${answerLabel(card.answer)}.` : `It's "${answerLabel(card.answer)}."`)),
        h('p', {}, card.explain),
      ),
      picked && h('button', { class: 'btn btn-primary btn-big', type: 'button', onClick: () => { index += 1; draw(); } },
        index + 1 < CARDS.length ? 'Next card →' : 'See my score'),
    ));
  }

  draw();
  return box;
}

function renderSpot() {
  const tapped = new Set(store.get('is-isnt:spotted', []));
  let revealed = false;
  const inventedCount = SPOT.sentences.filter((s) => s.invented).length;
  const box = h('div', {});

  function draw() {
    const found = [...tapped].filter((i) => SPOT.sentences[i].invented).length;
    box.replaceChildren(h('div', { class: 'card' },
      h('p', { class: 'ii-bubble ii-you' }, h('span', { class: 'eyebrow' }, 'You asked'), SPOT.question),
      h('div', { class: 'ii-bubble ii-bot' },
        h('span', { class: 'eyebrow' }, 'Chatbot'),
        h('div', { class: 'ii-sentences' },
          SPOT.sentences.map((s, i) => {
            const show = tapped.has(i) || revealed;
            const status = show && s.invented ? ' is-wrong' : '';
            return h('div', {},
              h('button', {
                type: 'button',
                class: `choice ii-sentence${status}`,
                'aria-pressed': tapped.has(i) ? 'true' : 'false',
                onClick: () => { tapped.add(i); store.set('is-isnt:spotted', [...tapped]); draw(); },
              }, s.text),
              show && s.invented && h('p', { class: 'ii-note bad' }, s.invented),
              tapped.has(i) && !s.invented && h('p', { class: 'ii-note' }, 'Not this one. This sentence is true.'),
            );
          }),
        ),
      ),
      h('p', { class: 'ii-score', 'aria-live': 'polite' }, h('strong', {}, `Found ${found} of ${inventedCount} made-up details.`),
        found === inventedCount ? ' Great eye. Notice how normal they looked next to the true ones.' : ''),
      h('div', { class: 'ii-row' },
        !revealed && found < inventedCount && h('button', { class: 'btn', type: 'button', onClick: () => { revealed = true; draw(); } }, 'Show me'),
        (tapped.size > 0 || revealed) && h('button', { class: 'btn btn-quiet', type: 'button', onClick: () => { tapped.clear(); revealed = false; store.set('is-isnt:spotted', []); draw(); } }, 'Start over'),
      ),
    ));
  }

  draw();
  return box;
}

export default {
  id: 'is-isnt',
  title: "What AI is and isn't",
  icon: '🪞',
  minutes: 7,
  render(root, section) {
    root.append(
      sectionHeader(section, 'A chatbot is a very well-read pattern machine. It is not a search engine, a person, or a crystal ball. Let\'s sort the myths from the facts.'),

      h('h2', {}, 'Myth or fact?'),
      h('p', {}, 'Read each card and tap your answer. Some are a solid "sort of."'),
      renderGame(),

      h('h2', {}, 'Spot the hallucination'),
      h('p', {}, 'Here is a realistic chatbot answer. Most of it is true. Two details are completely made up. Tap any sentence you think is invented.'),
      renderSpot(),

      h('h2', {}, 'AI is good at, AI is bad at'),
      h('div', { class: 'ii-columns' },
        h('div', { class: 'callout good' },
          h('h3', {}, '👍 Good at'),
          h('ul', {}, GOOD_AT.map((item) => h('li', {}, item))),
        ),
        h('div', { class: 'callout bad' },
          h('h3', {}, '👎 Bad at'),
          h('ul', {}, BAD_AT.map((item) => h('li', {}, item))),
        ),
      ),

      h('div', { class: 'callout' },
        h('p', { class: 'eyebrow' }, 'What this means for you'),
        h('p', {}, 'Treat a chatbot like a bright, eager assistant who sometimes makes things up with a straight face. Let it draft and explain. Check anything that matters: names, numbers, quotes, and book titles most of all.'),
      ),

      h('p', { class: 'sources' },
        'Sources: Lawyers fined $5,000 over fake ChatGPT citations, June 22, 2023 (',
        h('a', { href: 'https://www.lawnext.com/2023/06/court-imposes-sanctions-on-lawyers-who-filed-bogus-cases-after-relying-on-chatgpt-for-legal-research.html', target: '_blank', rel: 'noopener' }, 'LawSites'),
        '). Georgia Court of Appeals vacates order citing nonexistent cases, July 2025 (',
        h('a', { href: 'https://www.theregister.com/2025/07/08/georgia_appeals_court_ai_caselaw/', target: '_blank', rel: 'noopener' }, 'The Register'),
        '). The "study" and the book in the hallucination exercise were invented for this class on purpose.',
      ),
    );
  },
};
