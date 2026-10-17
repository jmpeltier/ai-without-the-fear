import { h, sectionHeader, store } from '../ui.js';

const FIRST_YEAR = 1950;

// `plain` never mentions the year, because the guessing game shows it with the year hidden.
const EVENTS = [
  {
    year: 1950,
    title: 'Alan Turing asks: can machines think?',
    plain: 'British mathematician Alan Turing proposes the "imitation game." If you trade typed notes with a hidden partner and can\'t tell whether it is a person or a machine, maybe the machine is thinking.',
    why: 'People still argue about his test today. This paper is the starting gun for the whole field.',
  },
  {
    year: 1956,
    title: 'A summer workshop names the field',
    plain: 'A handful of researchers meet at Dartmouth College in New Hampshire. Their proposal for the meeting coined the phrase "artificial intelligence."',
    why: 'They hoped to make real progress in one summer. It took a little longer than that.',
  },
  {
    year: 1966,
    title: 'ELIZA, one of the first chatbots',
    plain: 'Joseph Weizenbaum at MIT builds ELIZA, which played a therapist by turning your own words back into questions. His secretary reportedly asked him to leave the room so she could talk to it in private.',
    why: 'People warm up to a chatty machine fast, even a very simple one. Worth remembering today.',
  },
  {
    year: 1974,
    title: 'The first "AI winter"',
    plain: 'Big promises go unmet. Funding gets cut and AI research freezes over for the rest of the decade.',
    why: 'AI hype has burst before. A little healthy skepticism is part of the story.',
  },
  {
    year: 1987,
    title: 'A second, longer winter',
    plain: '"Expert systems," giant rule books typed in by hand, turn out costly and fragile. The money dries up again, well into the next decade.',
    why: 'Writing every rule by hand doesn\'t scale. The eventual fix was letting computers learn from examples.',
  },
  {
    year: 1997,
    title: 'Deep Blue beats the chess champion',
    plain: 'IBM\'s Deep Blue computer defeats world chess champion Garry Kasparov in a six-game match in New York.',
    why: 'A huge headline. But Deep Blue could only play chess. It couldn\'t hold a conversation or recognize a cat.',
  },
  {
    year: 2012,
    title: 'Computers learn to see',
    plain: 'A program called AlexNet, trained on a huge collection of labeled photos using video-game graphics chips, wins a photo-recognition contest by a wide margin.',
    why: 'This kicked off "deep learning." Instead of writing rules, you show the computer mountains of examples and let it find the patterns.',
  },
  {
    year: 2016,
    title: 'AlphaGo wins at Go',
    plain: 'Google DeepMind\'s AlphaGo beats champion Lee Sedol 4 games to 1 in Seoul, South Korea. Go is an ancient board game far more open-ended than chess.',
    why: 'It learned largely from examples and practice games, not hand-written strategy.',
  },
  {
    year: 2017,
    title: 'The turning point: "Attention Is All You Need"',
    plain: 'Eight researchers at Google publish a paper describing the "transformer," a new design that reads a whole passage at once and works out which words matter to each other.',
    why: 'This is the "T" in ChatGPT. Nearly every chatbot you have heard of is built on it. More on this in Part 4.',
    turningPoint: true,
  },
  {
    year: 2020,
    title: 'GPT-3 writes surprisingly well',
    plain: 'OpenAI\'s GPT-3, a transformer trained on an enormous amount of text, can write essays, poems and computer code. It has 175 billion adjustable settings inside.',
    why: 'Bigger model, plus more data, plus more computing power, suddenly produced abilities nobody programmed in directly.',
  },
  {
    year: 2022,
    title: 'ChatGPT launches',
    plain: 'OpenAI opens ChatGPT to the public for free on November 30. An estimated 100 million people use it within about two months, which analysts at UBS called the fastest ramp of any consumer app in history.',
    why: 'AI jumped from lab curiosity to kitchen-table conversation almost overnight.',
  },
  {
    year: 2023,
    title: 'Claude and Gemini join in',
    plain: 'Anthropic releases Claude in March, and Google announces Gemini in December. Now several big chatbots compete.',
    why: 'Different companies, same basic recipe: a transformer trained on a vast amount of text.',
  },
  {
    year: 2024,
    title: 'Models that "think" before answering',
    plain: 'OpenAI\'s o1, released in September, spends extra time working a problem through step by step before it replies.',
    why: 'Taking time to "show its work" made chatbots noticeably better at math and logic puzzles.',
  },
  {
    year: 2024,
    title: 'AI moves into your phone',
    plain: 'In late October, Apple Intelligence arrives on iPhones with a software update, adding writing help and smarter notification summaries.',
    why: 'You may already be using AI without opening a chatbot at all.',
  },
  {
    year: 2025,
    title: 'AI agents: from talking to doing',
    plain: 'Tools such as Anthropic\'s Claude Code start taking multi-step actions on a computer for you, like reading files and writing software, not just chatting.',
    why: 'An "agent" is a chatbot that can use tools. Handy, and a reason to stay in charge of what it is allowed to touch.',
  },
  {
    year: 2026,
    title: 'You are here',
    plain: 'OpenAI says ChatGPT reached 900 million weekly users in February. Assistants like Claude Cowork and Google\'s Gemini take on whole multi-step tasks, and new, more capable models arrive every few months.',
    why: 'The pace is fast, which is exactly why a class like this is worth your hour.',
  },
];

const DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
const QUIZ_LENGTH = 6;

const decadeOf = (year) => Math.floor(year / 10) * 10;

function decadeChoices(year) {
  const answer = decadeOf(year);
  const others = DECADES.filter((d) => d !== answer)
    .sort((a, b) => Math.abs(a - answer) - Math.abs(b - answer) || Math.random() - 0.5)
    .slice(0, 3);
  return [answer, ...others].sort((a, b) => a - b);
}

function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderExplorer(lastYear) {
  let current = 0;
  const span = lastYear - FIRST_YEAR;

  const ruler = h('div', { class: 'tl-ruler', 'aria-hidden': 'true' },
    EVENTS.map((e) => h('span', {
      class: `tl-tick${e.turningPoint ? ' is-turning' : ''}`,
      style: { left: `${((e.year - FIRST_YEAR) / span) * 100}%` },
    })),
    h('span', { class: 'tl-ruler-label start' }, FIRST_YEAR),
    h('span', { class: 'tl-ruler-label end' }, lastYear),
  );
  const marker = h('span', { class: 'tl-marker' });
  ruler.append(marker);

  const chips = EVENTS.map((e, i) => h('button', {
    type: 'button',
    class: `tl-chip${e.turningPoint ? ' is-turning' : ''}`,
    'aria-label': `${e.year}: ${e.title}`,
    onClick: () => show(i),
  }, e.year));

  const card = h('div', { class: 'tl-card', 'aria-live': 'polite' });
  const prev = h('button', { type: 'button', class: 'btn', onClick: () => show(current - 1) }, '← Earlier');
  const next = h('button', { type: 'button', class: 'btn btn-primary', onClick: () => show(current + 1) }, 'Later →');

  function show(i) {
    current = Math.max(0, Math.min(EVENTS.length - 1, i));
    const e = EVENTS[current];
    card.className = `tl-card${e.turningPoint ? ' is-turning' : ''}`;
    card.replaceChildren(
      h('p', { class: 'tl-year' }, e.year, e.turningPoint && h('span', { class: 'tl-badge' }, '★ Turning point')),
      h('h3', {}, e.title),
      h('p', {}, e.plain),
      h('p', { class: 'tl-why' }, h('strong', {}, 'Why it matters: '), e.why),
    );
    chips.forEach((c, j) => c.setAttribute('aria-pressed', String(j === current)));
    marker.style.left = `${((e.year - FIRST_YEAR) / span) * 100}%`;
    prev.disabled = current === 0;
    next.disabled = current === EVENTS.length - 1;
  }
  show(0);

  return h('div', { class: 'card' },
    h('h2', { class: 'tl-h2' }, `Tap through ${span} years`),
    ruler,
    h('div', { class: 'tl-chips' }, chips),
    card,
    h('div', { class: 'tl-nav' }, prev, next),
  );
}

function renderQuiz() {
  const body = h('div', {});
  let questions = [];
  let index = 0;
  let score = 0;

  function start() {
    questions = shuffled(EVENTS).slice(0, QUIZ_LENGTH);
    index = 0;
    score = 0;
    ask();
  }

  function ask() {
    const e = questions[index];
    const feedback = h('div', { 'aria-live': 'polite' });
    const choices = decadeChoices(e.year);
    const buttons = choices.map((decade) => h('button', {
      type: 'button',
      class: 'choice',
      onClick: () => answer(decade),
    }, `${decade}s`));

    function answer(decade) {
      const right = decade === decadeOf(e.year);
      if (right) score++;
      buttons.forEach((b, j) => {
        const d = choices[j];
        b.disabled = true;
        if (d === decadeOf(e.year)) b.classList.add('is-correct');
        else if (d === decade) b.classList.add('is-wrong');
      });
      const last = index === questions.length - 1;
      feedback.replaceChildren(
        h('div', { class: `callout ${right ? 'good' : 'bad'}` },
          h('strong', {}, right ? 'Yes! ' : 'Not quite. '),
          `It was ${e.year}. ${e.why}`,
        ),
        h('button', { type: 'button', class: 'btn btn-primary', onClick: () => { if (last) finish(); else { index++; ask(); } } },
          last ? 'See my score' : 'Next event →'),
      );
    }

    body.replaceChildren(
      h('p', { class: 'eyebrow' }, `Event ${index + 1} of ${questions.length} · score ${score}`),
      h('h3', {}, e.title),
      h('p', {}, e.plain),
      h('p', { class: 'tl-ask' }, 'Which decade was this?'),
      h('div', { class: 'choices tl-decades' }, buttons),
      feedback,
    );
  }

  function finish() {
    const best = Math.max(score, store.get('timeline:best', 0));
    store.set('timeline:best', best);
    body.replaceChildren(
      h('p', { class: 'stat' }, `${score} / ${questions.length}`),
      h('p', { class: 'stat-label' }, `Your best on this device: ${best} / ${QUIZ_LENGTH}`),
      h('p', {}, score >= 5 ? 'History buff! ' : 'Most people guess "recent" for everything. ', 'The surprise is how old the idea of AI really is.'),
      h('button', { type: 'button', class: 'btn btn-primary', onClick: start }, 'Play again'),
    );
  }

  body.append(
    h('p', {}, `We'll show you ${QUIZ_LENGTH} events with the year hidden. Pick the decade.`),
    h('button', { type: 'button', class: 'btn btn-primary btn-big', onClick: start }, 'Start the game'),
  );
  return h('div', { class: 'card' }, h('h2', { class: 'tl-h2' }, '🎯 Guess the year'), body);
}

export default {
  id: 'timeline',
  title: 'Where AI came from',
  icon: '🕰️',
  minutes: 8,
  render(root, section) {
    const thisYear = new Date().getFullYear();
    const age = thisYear - FIRST_YEAR;
    root.append(
      sectionHeader(section, `AI isn't new. People have been working on it for over ${age} years. What's new is how good it suddenly got, and why.`),
      renderExplorer(thisYear),
      renderQuiz(),
      h('div', { class: 'callout good' },
        h('strong', {}, 'What this means for you. '),
        `AI has had booms and busts for ${age} years. The recent leap came from three things arriving together: the transformer design (2017), enormous amounts of text from the internet, and huge computing power. It is a big step, not magic, and not the first time the headlines have run hot.`,
      ),
      h('p', { class: 'sources' },
        'Sources: ',
        sourceLinks([
          ['Turing 1950', 'https://en.wikipedia.org/wiki/Computing_Machinery_and_Intelligence'],
          ['Dartmouth workshop', 'https://en.wikipedia.org/wiki/Dartmouth_workshop'],
          ['ELIZA', 'https://en.wikipedia.org/wiki/ELIZA'],
          ['AI winters (about 1974 to 1980 and 1987 to 2000)', 'https://en.wikipedia.org/wiki/AI_winter'],
          ['Deep Blue vs Kasparov', 'https://en.wikipedia.org/wiki/Deep_Blue_versus_Garry_Kasparov'],
          ['AlexNet', 'https://en.wikipedia.org/wiki/AlexNet'],
          ['AlphaGo vs Lee Sedol', 'https://en.wikipedia.org/wiki/AlphaGo_versus_Lee_Sedol'],
          ['"Attention Is All You Need" (arXiv)', 'https://arxiv.org/abs/1706.03762'],
          ['its Google authorship', 'https://en.wikipedia.org/wiki/Attention_Is_All_You_Need'],
          ['GPT-3 paper, 175 billion parameters', 'https://arxiv.org/abs/2005.14165'],
          ['ChatGPT launch date', 'https://en.wikipedia.org/wiki/ChatGPT'],
          ['100 million users is a UBS analyst estimate (Reuters)', 'https://cyprus-mail.com/2023/02/05/chatgpt-sets-record-for-fastest-growing-user-base'],
          ['Claude releases, Claude Code, Cowork', 'https://en.wikipedia.org/wiki/Claude_(language_model)'],
          ['Gemini releases', 'https://en.wikipedia.org/wiki/Gemini_(language_model)'],
          ['OpenAI o1', 'https://en.wikipedia.org/wiki/OpenAI_o1'],
          ['Apple Intelligence', 'https://en.wikipedia.org/wiki/Apple_Intelligence'],
          ['900 million weekly users is company-reported (TechCrunch)', 'https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users'],
          ['Google\'s September 2026 model and agent updates', 'https://blog.google/innovation-and-ai/technology/ai/google-ai-updates-september-2026/'],
        ]),
      ),
    );
  },
};

function sourceLinks(pairs) {
  return pairs.flatMap(([label, href], i) => [i ? '; ' : '', h('a', { href, target: '_blank', rel: 'noopener' }, label)]).concat('.');
}
