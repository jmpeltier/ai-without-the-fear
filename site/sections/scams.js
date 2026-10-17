import { h, sectionHeader, store } from '../ui.js';

const SCENARIOS = [
  {
    title: 'The late-night call',
    scenario: 'Your phone rings at 11 p.m. It\'s your grandson\'s voice, crying: "Grandma, I wrecked the car and I\'m in jail. Please don\'t tell Mom. My lawyer will call you. I need $4,000 in gift cards for bail, tonight."',
    answer: 'scam',
    redFlags: ['Panic and a deadline', '"Don\'t tell Mom" keeps you from checking', 'Payment by gift cards', 'A voice can be copied from a short clip of online video'],
    whatToDo: 'Hang up. Call your grandson, or his parents, on the number you already have. Ask for your family safe word.',
  },
  {
    title: 'The celebrity investment video',
    scenario: 'A video on Facebook shows a famous billionaire saying he\'s "giving back" with a new crypto platform that doubles your money in 30 days. His lips move a little oddly. A link says "Only 50 spots left."',
    answer: 'scam',
    redFlags: ['Guaranteed, fast returns', 'A celebrity endorsement in an ad', 'Pressure: "only 50 spots"', 'Paying in cryptocurrency', 'Lips that don\'t quite match the words'],
    whatToDo: 'Scroll past. Real investments don\'t come from celebrity videos in your feed. If you want to invest, talk to a licensed advisor you chose yourself.',
  },
  {
    title: 'The email from "your bank"',
    scenario: 'A polished email with your bank\'s logo, perfect grammar, and your first name: "We noticed an unusual sign-in. To avoid suspension, confirm your account within 24 hours." There\'s a big blue "Verify Now" button.',
    answer: 'scam',
    redFlags: ['Urgency: "within 24 hours"', 'A link asking you to sign in or confirm details', 'Perfect spelling no longer proves anything, since AI writes clean emails'],
    whatToDo: 'Don\'t tap the button. Open your bank\'s app yourself, or call the number on the back of your card.',
  },
  {
    title: 'The scary pop-up',
    scenario: 'While reading the news, your screen flashes red with a loud alarm: "VIRUS DETECTED! Your computer is locked. Call Microsoft Support now at 1-888-..." It won\'t close.',
    answer: 'scam',
    redFlags: ['A phone number to call on a warning', 'Alarm sounds and scare words', 'Real security warnings never ask you to call'],
    whatToDo: 'Don\'t call. Close the browser. If it won\'t close, restart the computer. Nothing is "locked."',
  },
  {
    title: 'The charming widower',
    scenario: 'A handsome man messages you on Facebook. His photos look like a magazine. He works on an oil rig overseas, so he can\'t meet, and video calls "never work out here." After a month of sweet messages, he needs $2,500 for a plane ticket to finally see you.',
    answer: 'scam',
    redFlags: ['Can\'t meet in person, always a reason why', 'Too-perfect photos (AI can create a face that doesn\'t exist)', 'A money request after building trust'],
    whatToDo: 'Never send money to someone you haven\'t met in person. Tell a friend or family member what\'s going on. They can see clearly when it\'s hard for you to.',
  },
  {
    title: 'The "Social Security" call',
    scenario: 'Caller ID says "Social Security Administration." A stern voice says your Social Security number was used in a crime and will be suspended unless you confirm it and move your savings to a "safe account."',
    answer: 'scam',
    redFlags: ['Threats about your benefits', 'Caller ID can be faked to show any name', 'Asking you to confirm your number or move money'],
    whatToDo: 'Hang up. If you\'re worried, call Social Security yourself at 1-800-772-1213.',
  },
  {
    title: 'The code you asked for',
    scenario: 'You\'re signing in to your bank\'s website on your own. It says "We sent a code to your phone." A text arrives from your bank: "Your code is 482913. We will never call to ask for this code." Nobody asks you for anything else.',
    answer: 'legit',
    redFlags: ['No red flags. You started this yourself, and the text asks for nothing.'],
    whatToDo: 'Type the code into the website. Golden rule: never read that code to anyone who calls you, even if they say they\'re your bank.',
  },
  {
    title: 'The grandson who knows the word',
    scenario: 'Your grandson calls from his usual number: "Hey Grandpa, my car battery died in the grocery store lot on Holcomb Bridge Road. Could you give me a jump?" You ask for the family safe word. He laughs and says it right away.',
    answer: 'legit',
    redFlags: ['No red flags. His own number, no money asked, and he knew the safe word.'],
    whatToDo: 'Grab the jumper cables. This is exactly how the safe word is supposed to work.',
  },
];

const VERDICT_LABEL = { scam: '🚩 Scam', legit: '👍 Real' };

const WORDS_A = ['purple', 'sleepy', 'jolly', 'brave', 'fuzzy', 'golden', 'quiet', 'silly', 'lucky', 'mighty', 'breezy', 'cozy', 'dizzy', 'humble', 'rusty', 'sunny', 'tiny', 'velvet', 'wobbly', 'zesty', 'polka', 'minty', 'peachy', 'frosty'];
const WORDS_B = ['pelican', 'teapot', 'banjo', 'pickle', 'walrus', 'canoe', 'muffin', 'lantern', 'turnip', 'gazebo', 'kazoo', 'pancake', 'tortoise', 'meadow', 'biscuit', 'pinecone', 'trombone', 'goose', 'acorn', 'magnolia', 'hammock', 'okra', 'snowshoe', 'peacock'];

function pickRandom(list) {
  const n = new Uint32Array(1);
  crypto.getRandomValues(n);
  return list[n[0] % list.length];
}

function quiz() {
  const box = h('div', { class: 'scam-quiz' });
  const results = [];

  function showRound(i) {
    if (i === SCENARIOS.length) return showFinal();
    const s = SCENARIOS[i];
    const feedback = h('div', { 'aria-live': 'polite' });
    const buttons = Object.entries(VERDICT_LABEL).map(([key, label]) =>
      h('button', { class: 'choice', type: 'button', 'data-answer': key, onClick: () => answer(key) }, label));

    function answer(choice) {
      results[i] = choice === s.answer;
      buttons.forEach((b) => {
        b.disabled = true;
        b.classList.toggle('is-correct', b.dataset.answer === s.answer);
        b.classList.toggle('is-wrong', b.dataset.answer === choice && choice !== s.answer);
      });
      feedback.replaceChildren(
        h('div', { class: `callout ${s.answer === 'scam' ? 'bad' : 'good'}` },
          h('p', {}, h('strong', {}, results[i] ? 'You got it! ' : 'Tricky one. '), `This one is ${s.answer === 'scam' ? 'a scam' : 'real'}.`),
          h('p', { class: 'scam-label' }, s.answer === 'scam' ? 'Red flags:' : 'Why it\'s fine:'),
          h('ul', {}, s.redFlags.map((f) => h('li', {}, f))),
          h('p', {}, h('strong', {}, 'What to do: '), s.whatToDo)),
        h('button', { class: 'btn btn-primary btn-big', type: 'button', onClick: () => showRound(i + 1) },
          i + 1 === SCENARIOS.length ? 'See my score' : 'Next story →'),
      );
    }

    box.replaceChildren(h('div', { class: 'card' },
      h('p', { class: 'eyebrow' }, `Story ${i + 1} of ${SCENARIOS.length}`),
      h('h3', {}, s.title),
      h('p', { class: 'scam-story' }, s.scenario),
      h('p', {}, h('strong', {}, 'Real or scam?')),
      h('div', { class: 'choices scam-choices' }, buttons),
      feedback));
    if (i > 0) box.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function showFinal() {
    const right = results.filter(Boolean).length;
    const best = Math.max(right, store.get('scams:best', 0));
    store.set('scams:best', best);
    box.replaceChildren(h('div', { class: 'card scam-final' },
      h('p', { class: 'stat' }, `${right} of ${SCENARIOS.length}`),
      h('p', { class: 'stat-label' }, `Your best on this device: ${best} of ${SCENARIOS.length}`),
      h('p', {}, right >= SCENARIOS.length - 1
        ? 'Sharp eyes! You\'d make a great scam spotter for your whole family.'
        : 'Scammers are good at this, and AI makes them better. That\'s why the "hang up and call back" habit matters more than spotting every trick.'),
      h('button', { class: 'btn', type: 'button', onClick: () => { results.length = 0; showRound(0); box.scrollIntoView({ block: 'start', behavior: 'smooth' }); } }, '↺ Play again')));
    box.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  showRound(0);
  return box;
}

function safeWordBuilder() {
  const word = h('p', { class: 'scam-safeword', 'aria-live': 'polite' }, 'Tap the button ↓');
  return h('div', { class: 'card scam-builder' },
    word,
    h('button', {
      class: 'btn btn-primary btn-big', type: 'button',
      onClick: () => { word.textContent = `${pickRandom(WORDS_A)} ${pickRandom(WORDS_B)}`; },
    }, '🎲 Make me a safe word'),
    h('p', { class: 'scam-small' }, 'Made right here on your phone. Nobody else sees it, and it isn\'t saved.'));
}

const IF_IT_HAPPENS = [
  ['Hang up and call back.', 'Use a number you already know: from your contacts, the back of your card, or a statement. Not the number that called you.'],
  ['Never pay with gift cards, crypto, or a wire transfer.', 'No real business or government agency asks for gift cards. Scammers like these because the money is nearly impossible to get back.'],
  ['Tell someone.', 'Scammers say "keep this secret." Talking to a friend or family member breaks the spell.'],
  ['Report it.', [h('a', { href: 'https://reportfraud.ftc.gov' }, 'ReportFraud.ftc.gov'), ' (Federal Trade Commission) and ', h('a', { href: 'https://www.ic3.gov' }, 'ic3.gov'), ' (the FBI\'s internet crime center).']],
  ['Call the AARP Fraud Watch Network Helpline.', [h('a', { href: 'tel:+18779083360' }, '877-908-3360'), ', Monday to Friday, 8 a.m. to 8 p.m. Eastern. Trained volunteers can help you figure out what to do next.']],
];

export default {
  id: 'scams',
  title: 'Spot the AI scam',
  icon: '🕵️',
  minutes: 7,
  render(root, section) {
    root.append(
      sectionHeader(section, 'Scammers now use AI to copy voices, fake videos, and write flawless emails. The good news: the old tricks underneath haven\'t changed, and neither has the best defense.'),

      h('h2', {}, 'Real or scam?'),
      h('p', {}, 'Read each short story and decide. Two of them are real.'),
      quiz(),

      h('h2', {}, 'Pick a family safe word'),
      h('p', {}, 'AI can copy someone\'s voice from just a short clip, like a video posted online. So a voice on the phone is no longer proof. The FBI recommends families agree on a secret word or phrase to prove who\'s really calling. The FTC adds: don\'t trust the voice; call the person back on a number you know.'),
      safeWordBuilder(),
      h('ul', { class: 'scam-tips' },
        h('li', {}, 'Share it in person with family, not by text or on Facebook.'),
        h('li', {}, 'Pick something silly. Don\'t use a pet\'s name or anything a stranger could find online.'),
        h('li', {}, 'In an "emergency" call, ask for the word. A scammer won\'t know it.')),

      h('h2', {}, 'If it happens to you'),
      h('ol', { class: 'scam-steps' }, IF_IT_HAPPENS.map(([head, body]) => h('li', { class: 'card' }, h('strong', {}, head), ' ', body))),
      h('p', {}, 'Falling for a scam is not a sign of foolishness. These are professionals. Report it anyway, because it helps stop them.'),

      h('div', { class: 'callout good' },
        h('strong', {}, 'What this means for you. '),
        'Fear and hurry are the scammer\'s tools. When a call, email, or video makes your heart race, slow down, hang up, and check on your own.'),

      h('p', { class: 'sources' }, 'Sources: ',
        h('a', { href: 'https://www.ic3.gov/psa/2024/psa241203' }, 'FBI IC3, "Criminals Use Generative Artificial Intelligence to Facilitate Financial Fraud," PSA I-120324-PSA, Dec. 3, 2024'), ' (secret word, voice clones, fake profile photos, celebrity videos, call back); ',
        h('a', { href: 'https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes' }, 'FTC, "Scammers use AI to enhance their family emergency schemes" (2023)'), '; ',
        h('a', { href: 'https://consumer.ftc.gov/articles/avoiding-and-reporting-gift-card-scams' }, 'FTC, gift card scams'), '; ',
        h('a', { href: 'https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams' }, 'FTC, phishing'), '; ',
        h('a', { href: 'https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams' }, 'FTC, tech support scams'), '; ',
        h('a', { href: 'https://consumer.ftc.gov/articles/what-know-about-romance-scams' }, 'FTC, romance scams'), '; ',
        h('a', { href: 'https://consumer.ftc.gov/consumer-alerts/2018/12/what-social-security-scam-sounds' }, 'FTC, Social Security impostors and the real SSA number'), '; ',
        h('a', { href: 'https://ag.ny.gov/press-release/2024/investor-alert-attorney-general-james-warns-new-yorkers-investment-scams-using' }, 'New York Attorney General, deepfake investment scams (Aug. 2024)'), '; ',
        h('a', { href: 'https://www.aarp.org/money/scams-fraud/helpline.html' }, 'AARP Fraud Watch Network Helpline'), '; ',
        h('a', { href: 'https://www.ic3.gov' }, 'IC3'), '.'),
    );
  },
};
