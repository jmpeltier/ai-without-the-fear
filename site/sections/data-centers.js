import { h, sectionHeader, store } from '../ui.js';

// EIA: average US home used 865 kWh per month in 2024.
const HOME_KWH_PER_MONTH = 865;
const HOME_KWH_PER_DAY = (HOME_KWH_PER_MONTH * 12) / 365;
const HOME_AVG_KW = HOME_KWH_PER_DAY / 24;

// OpenAI told Axios in July 2025 that ChatGPT receives about 2.5 billion prompts a day.
const PROMPTS_PER_DAY = 2.5e9;

const ESTIMATES = [
  { id: 'google', name: 'Google Gemini', wh: 0.24, detail: 'median text prompt, reported August 2025' },
  { id: 'openai', name: 'OpenAI ChatGPT', wh: 0.34, detail: 'average query, stated June 2025' },
];

// Assumptions for the comparisons, not measurements: a 1,000-watt microwave, a 10-watt LED bulb, a phone battery of about 15 watt-hours.
const EVERYDAY = [
  { icon: '🍿', label: 'seconds of a microwave', perWh: 3.6 },
  { icon: '💡', label: 'minutes of an LED bulb', perWh: 6 },
  { icon: '📱', label: 'phone charges', perWh: 1 / 15 },
];

const QUESTION_STEPS = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

const BASICS = [
  { stat: '16,000+', label: 'chips Meta used to train one AI model (Llama 3.1, 2024). Training happens once, over weeks to months.' },
  { stat: '900 million', label: 'people use ChatGPT every week (OpenAI, February 2026).' },
  { stat: '2.5 billion', label: 'questions sent to ChatGPT every day (OpenAI, July 2025). Every one runs in a data center.' },
];

const RACKS = [
  { label: 'Average US home', kw: HOME_AVG_KW },
  { label: 'Regular server cabinet', kw: 12 },
  { label: 'Air-cooled AI cabinet', kw: 40 },
  { label: 'Newest AI cabinet', kw: 120 },
];

const US_SHARE = [
  { label: '2023 (measured)', low: 4.4, high: 4.4 },
  { label: '2028 (projected)', low: 6.7, high: 12 },
];

const WORLD_TWH = [
  { label: '2024', twh: 415 },
  { label: '2030 (projected)', twh: 945 },
];

const GEORGIA = [
  { stat: '#2', label: 'Metro Atlanta is the second-largest data center market in the US, behind Northern Virginia (CBRE, end of 2025).' },
  { stat: '2,076 MW', label: 'of data centers under construction around Atlanta at the end of 2025, more than the 1,459 MW already running (CBRE).' },
  { stat: '~10,000 MW', label: 'of new power generation the Georgia PSC approved for Georgia Power on Dec. 19, 2025, mostly to serve data centers. About 6,000 MW of it is new gas plants.' },
  { stat: '$474 million', label: 'in state sales tax Georgia did not collect from data centers in fiscal year 2025, under a tax break (state audit, Dec. 2025).' },
];

const SIDES = {
  for: {
    title: 'Supporters point to',
    items: [
      'Big investment. Amazon Web Services announced $11 billion for data centers in Douglas and Butts counties in January 2025, with at least 550 jobs promised.',
      'Jobs and spending. A state-commissioned study counted about 28,350 construction jobs and 5,471 operations jobs in 2025.',
      'New money flowing into counties that land a project, from construction spending to local taxes.',
      'Georgia Power froze base rates through 2028 and says data center revenue will put about $8.50 a month of "downward pressure" on typical bills in 2029 to 2031.',
    ],
  },
  against: {
    title: 'Critics point to',
    items: [
      'Electric bills. PSC staff warned that if data center demand falls short, customers could be paying over $3 billion a year for power plants nobody needs.',
      'The tax break. The same state audit estimated about 70% of the data center building would have happened without it.',
      'Water. Older "evaporative" cooling can use up to 9 million gallons a day at one site. Closed-loop systems use under 100,000.',
      'Land, noise, and few permanent jobs for the space used. Several metro communities, including Roswell, have paused new data centers to write rules.',
    ],
  },
};

const QUESTIONS_TO_ASK = [
  'How much water will it use, and what kind of cooling?',
  'Who pays for new power lines and plants if the data center leaves?',
  'How many permanent local jobs, not just construction?',
  'What tax breaks is it getting, and for how long?',
  'How loud will it be, and how far from homes?',
];

const SOURCES = [
  ['Meta: Llama 3.1 trained on over 16,000 H100 GPUs, July 23, 2024', 'https://ai.meta.com/blog/meta-llama-3-1/'],
  ['TechCrunch: ChatGPT reaches 900M weekly active users (OpenAI announcement), Feb. 27, 2026', 'https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users'],
  ['TechCrunch: ChatGPT users send 2.5 billion prompts a day (OpenAI to Axios), July 21, 2025', 'https://techcrunch.com/2025/07/21/chatgpt-users-send-2-5-billion-prompts-a-day/'],
  ['SemiAnalysis: GB200 rack power (about 120 kW), CPU racks (up to 12 kW), air-cooled H100 racks (about 40 kW), July 17, 2024', 'https://newsletter.semianalysis.com/p/gb200-hardware-architecture-and-component'],
  ['US EIA: average home used 865 kWh a month in 2024, May 12, 2025', 'https://www.eia.gov/todayinEnergy/detail.php?id=65244'],
  ['MIT Technology Review: Google reports 0.24 Wh per median Gemini text prompt, Aug. 21, 2025 (company-reported)', 'https://www.technologyreview.com/2025/08/21/1122288/google-gemini-ai-energy/'],
  ['Sam Altman, "The Gentle Singularity": average ChatGPT query about 0.34 Wh, June 2025 (company-stated, no method published)', 'https://blog.samaltman.com/the-gentle-singularity'],
  ['Lawrence Berkeley National Lab: data centers 4.4% of US electricity in 2023, 6.7% to 12% by 2028, Dec. 2024', 'https://energyanalysis.lbl.gov/news/berkeley-lab-report-evaluates-increase-electricity-demand-data-centers'],
  ['Scientific American / Nature on the IEA "Energy and AI" report: 415 TWh in 2024, 945 TWh by 2030, Apr. 10, 2025', 'https://scientificamerican.com/article/ai-will-drive-doubling-of-data-center-energy-demand-by-2030'],
  ['CBRE: Atlanta emerges as one of North America\'s fastest-growing data center hubs, Mar. 4, 2026', 'https://www.cbre.com/press-releases/atlanta-emerges-as-one-of-north-americas-fastest-growing-data-center-hubs'],
  ['GPB News: Georgia PSC approves Georgia Power\'s data center expansion, Dec. 19, 2025', 'https://www.gpb.org/news/2025/12/19/georgia-psc-gives-the-greenlight-georgia-powers-massive-data-center-spurred'],
  ['WSB-TV: PSC approves Georgia Power base rate freeze through 2028; about 80% of projected growth from data centers, July 1, 2025', 'https://www.wsbtv.com/news/local/georgia-psc-approves-plan-freeze-georgia-power-base-power-rates/JXNC3CLU7BAIRGFGBPUFR3K2CA/'],
  ['Atlanta News First: data center tax break debate and Georgia Power\'s $8.50 a month estimate, Jan. 16, 2026', 'https://www.atlantanewsfirst.com/2026/01/16/data-centers-come-under-fire-state-lawmakers/'],
  ['Capitol Beat: state audit of the data center tax break ($474 million, jobs, 70%), Jan. 5, 2026', 'https://capitol-beat.org/2026/01/state-report-says-data-centers-a-boon-to-economy-despite-tax-giveaway/'],
  ['Compute Law: status of Georgia\'s data center sales tax exemption after the 2026 session, updated Aug. 3, 2026', 'https://computelaw.blog/tax/georgia-ai-data-center-sales-tax-exemption/'],
  ['Atlanta News First: AWS pledges $11 billion in Georgia, Jan. 8, 2025', 'https://www.atlantanewsfirst.com/2025/01/08/amazon-subsidiary-pledges-11-billion-build-more-data-ai-infrastructure-metro-atlanta'],
  ['Hoodline: Atlanta weighs data center cooling rules; water figures from the Metropolitan North Georgia Water Planning District, Aug. 18, 2026', 'https://hoodline.com/2026/08/atlanta-weighs-forcing-data-centers-off-tap-water-for-cooling/'],
  ['Atlanta News First: Roswell approves 90-day data center moratorium, Jan. 13, 2026', 'https://www.atlantanewsfirst.com/2026/01/13/city-roswells-new-leaders-approve-moratorium-data-centers/'],
  ['Georgia PSC: public comments page', 'https://psc.ga.gov/public-comments/'],
];

const fmt = (n, digits = 0) => n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
const fmtSmart = (n) => fmt(n, n < 10 ? 1 : 0);

const statTiles = (tiles) => h('div', { class: 'dc-tiles' },
  tiles.map((t) => h('div', { class: 'card dc-tile' },
    h('p', { class: 'stat' }, t.stat),
    h('p', { class: 'stat-label' }, t.label),
  )),
);

function barRow(label, percent, value, extraClass = '') {
  return h('div', { class: 'bar-row' },
    h('span', {}, label),
    h('div', { class: 'bar-track' }, h('div', { class: `bar-fill ${extraClass}`, style: { width: `${Math.max(percent, 1.5)}%` } })),
    h('span', { class: 'dc-bar-value' }, value),
  );
}

function renderRacks() {
  const max = Math.max(...RACKS.map((r) => r.kw));
  return h('div', { class: 'card' },
    h('p', { class: 'eyebrow' }, 'Power used by one cabinet, running all day'),
    RACKS.map((r) => barRow(r.label, (r.kw / max) * 100, `${fmtSmart(r.kw)} kW`)),
    h('p', { class: 'dc-caption' }, `One of the newest AI cabinets, about the size of a refrigerator, draws as much power as about ${fmt(Math.round(120 / HOME_AVG_KW / 10) * 10)} average American homes. A big data center holds hundreds or even thousands of them, and all that heat has to be carried away with air or water.`),
  );
}

function renderCalculator() {
  const saved = store.get('data-centers:calc', { step: 2, model: 'openai' });
  let step = Math.min(Math.max(saved.step, 0), QUESTION_STEPS.length - 1);
  let model = ESTIMATES.some((e) => e.id === saved.model) ? saved.model : 'openai';

  const out = h('div', { 'aria-live': 'polite' });
  const slider = h('input', {
    type: 'range', min: 0, max: QUESTION_STEPS.length - 1, step: 1, value: step,
    'aria-label': 'Number of questions',
    onInput: (e) => { step = Number(e.target.value); draw(); },
  });
  const modelButtons = h('div', { class: 'dc-models', role: 'group', 'aria-label': 'Whose estimate' });

  function draw() {
    store.set('data-centers:calc', { step, model });
    const estimate = ESTIMATES.find((e) => e.id === model);
    const questions = QUESTION_STEPS[step];
    const wh = questions * estimate.wh;
    const dailyKWh = (PROMPTS_PER_DAY * estimate.wh) / 1000;

    modelButtons.replaceChildren(...ESTIMATES.map((e) => h('button', {
      type: 'button',
      class: `choice dc-model${e.id === model ? ' is-correct' : ''}`,
      'aria-pressed': e.id === model ? 'true' : 'false',
      onClick: () => { model = e.id; draw(); },
    }, h('strong', {}, `${e.name}: ${e.wh} Wh`), h('span', { class: 'dc-model-detail' }, e.detail))));

    out.replaceChildren(
      h('p', { class: 'dc-questions' }, h('span', { class: 'stat' }, fmt(questions)), ` ${questions === 1 ? 'question' : 'questions'} = `, h('strong', {}, `${fmtSmart(wh)} watt-hours`)),
      h('div', { class: 'dc-everyday' },
        EVERYDAY.map((item) => h('div', { class: 'dc-thing' },
          h('span', { class: 'dc-thing-icon', 'aria-hidden': 'true' }, item.icon),
          h('span', { class: 'stat' }, fmtSmart(wh * item.perWh)),
          h('span', { class: 'stat-label' }, item.label),
        )),
      ),
      h('div', { class: 'callout warn dc-scale' },
        h('p', { class: 'eyebrow' }, 'Now multiply by everyone'),
        h('p', {}, `ChatGPT gets about 2.5 billion questions a day. At ${estimate.wh} Wh each, that is about `, h('strong', {}, `${fmt(dailyKWh / 1000)} megawatt-hours a day`),
          `. That is about what ${fmt(Math.round(dailyKWh / HOME_KWH_PER_DAY / 1000) * 1000)} average American homes use in a day, for text questions to one chatbot alone.`),
      ),
    );
  }

  draw();
  return h('div', { class: 'card dc-calc' },
    h('p', { class: 'eyebrow' }, 'Whose estimate?'),
    modelButtons,
    h('label', { class: 'dc-slider-label' }, 'How many questions? Slide to change.', slider),
    out,
    h('p', { class: 'dc-caption' },
      'Both per-question numbers are reported by the companies themselves and have not been independently checked. Researchers debate them. They count text questions only. Making an image or a video uses much more energy, and so do "thinking" models that work through a problem step by step. Training the model in the first place is not included. Comparisons assume a 1,000-watt microwave, a 10-watt LED bulb, and a 15 watt-hour phone battery.'),
  );
}

function renderCharts() {
  const shareMax = 12;
  const twhMax = Math.max(...WORLD_TWH.map((w) => w.twh));
  return h('div', { class: 'dc-charts' },
    h('div', { class: 'card' },
      h('p', { class: 'eyebrow' }, 'Data centers\' share of all US electricity'),
      US_SHARE.map((s) => h('div', { class: 'bar-row' },
        h('span', {}, s.label),
        h('div', { class: 'bar-track dc-range-track' },
          h('div', { class: 'bar-fill', style: { width: `${(s.low / shareMax) * 100}%` } }),
          s.high > s.low && h('div', { class: 'dc-range', style: { left: `${(s.low / shareMax) * 100}%`, width: `${((s.high - s.low) / shareMax) * 100}%` } }),
        ),
        h('span', { class: 'dc-bar-value' }, s.high > s.low ? `${s.low}–${s.high}%` : `${s.low}%`),
      )),
      h('p', { class: 'dc-caption' }, 'The lighter stripe is the range of the forecast: somewhere between about 1 in 15 and 1 in 8 of every unit of US electricity by 2028. Source: Lawrence Berkeley National Lab for the US Department of Energy.'),
    ),
    h('div', { class: 'card' },
      h('p', { class: 'eyebrow' }, 'Data centers worldwide, terawatt-hours per year'),
      WORLD_TWH.map((w) => barRow(w.label, (w.twh / twhMax) * 100, fmt(w.twh))),
      h('p', { class: 'dc-caption' }, 'About 1.5% of the world\'s electricity in 2024. By 2030, roughly what all of Japan uses today. Source: International Energy Agency.'),
    ),
  );
}

function renderSides() {
  return h('div', { class: 'dc-sides' },
    [['for', 'good'], ['against', 'bad']].map(([key, tone]) => h('div', { class: `callout ${tone}` },
      h('h3', {}, SIDES[key].title),
      h('ul', {}, SIDES[key].items.map((item) => h('li', {}, item))),
    )),
  );
}

export default {
  id: 'data-centers',
  title: 'Why all the data centers?',
  icon: '🏭',
  minutes: 7,
  render(root, section) {
    root.append(
      sectionHeader(section, 'Every chatbot answer is worked out on a computer in a big warehouse somewhere. Georgia is one of the busiest places in the country for building those warehouses, and people have real questions about it.'),

      h('h2', {}, 'What is a data center?'),
      h('p', {}, 'Picture a warehouse full of computers stacked in tall cabinets, plus the power lines to run them and the cooling to keep them from overheating. AI needs these for two jobs:'),
      h('ul', {},
        h('li', {}, h('strong', {}, 'Training: '), 'teaching the model once. Think of it as writing the cookbook. It takes weeks to months on many thousands of specialized chips.'),
        h('li', {}, h('strong', {}, 'Answering: '), 'cooking from the cookbook, every time anyone asks anything. Small per question, but it never stops.'),
      ),
      statTiles(BASICS),

      h('h2', {}, 'Why are they so big?'),
      h('p', {}, 'AI runs on special chips called GPUs, originally built for video-game graphics. They are packed tightly together, they run hot, and they are thirsty for electricity.'),
      renderRacks(),

      h('h2', {}, 'What does one question cost?'),
      h('p', {}, 'Pick whose estimate to use, then slide to choose how many questions you might ask.'),
      renderCalculator(),

      h('h2', {}, 'The big picture'),
      renderCharts(),

      h('h2', {}, 'Here in Georgia'),
      statTiles(GEORGIA),
      h('p', {}, 'About 80% of the extra electricity Georgia Power expects to need comes from data centers. The decisions about building power plants and setting your rates are made by the Georgia Public Service Commission (PSC), five commissioners elected statewide.'),
      h('p', {}, 'In March 2026 the state Senate voted to end the data center sales tax break early, but the bill died in the House. The break runs through 2031. Closer to home, Roswell\'s city council voted unanimously in January 2026 to pause new data center applications for 90 days while it wrote rules. Check with the city for where that stands today.'),

      h('h2', {}, 'Two sides of the story'),
      renderSides(),

      h('h2', {}, 'What can I do?'),
      h('div', { class: 'card' },
        h('ul', { class: 'dc-todo' },
          h('li', {}, h('strong', {}, 'Tell the PSC what you think. '), 'Anyone can send a public comment on a case before the Commission at ', h('a', { href: 'https://psc.ga.gov/public-comments/', target: '_blank', rel: 'noopener' }, 'psc.ga.gov/public-comments'), '. Comments must arrive at least 24 hours before the vote.'),
          h('li', {}, h('strong', {}, 'Show up locally. '), 'Data centers are approved by city and county zoning boards. Their meetings are public.'),
          h('li', {}, h('strong', {}, 'Ask good questions, '), 'whether you are for a project or against it:'),
        ),
        h('ol', { class: 'dc-ask' }, QUESTIONS_TO_ASK.map((q) => h('li', {}, q))),
      ),

      h('div', { class: 'callout' },
        h('p', { class: 'eyebrow' }, 'What this means for you'),
        h('p', {}, 'Your own questions to a chatbot use a tiny amount of energy. The concern is the scale: billions of questions a day, plus training, plus images and video. That scale is why data centers are coming to Georgia, and why the choices about who pays for them are being made right now, in public.'),
      ),

      h('p', { class: 'sources' }, 'Sources. Homes-equivalent and per-cabinet comparisons are our own arithmetic from the figures below. ',
        SOURCES.map(([label, url], i) => [h('a', { href: url, target: '_blank', rel: 'noopener' }, label), i < SOURCES.length - 1 ? '. ' : '.']),
      ),
    );
  },
};
