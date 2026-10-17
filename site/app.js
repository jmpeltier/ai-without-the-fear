import { h, store } from './ui.js';
import timeline from './sections/timeline.js';
import nextWord from './sections/next-word.js';
import tokens from './sections/tokens.js';
import attention from './sections/attention.js';
import inference from './sections/inference.js';
import tinyModel from './sections/tiny-model.js';
import isIsnt from './sections/is-isnt.js';
import dataCenters from './sections/data-centers.js';
import safeUse from './sections/safe-use.js';
import scams from './sections/scams.js';
import takeaways from './sections/takeaways.js';

const WELCOME_MINUTES = 2;

const SECTIONS = [timeline, nextWord, tokens, attention, inference, tinyModel, isIsnt, dataCenters, safeUse, scams, takeaways]
  .map((section, i) => ({ ...section, number: i + 1 }));

const byId = new Map(SECTIONS.map((s) => [s.id, s]));
const app = document.getElementById('app');
const pager = document.getElementById('pager');

function siteUrl() {
  return location.href.split('#')[0];
}

function renderHome() {
  const visited = new Set(store.get('visited', []));
  return h('div', { class: 'home' },
    h('section', { class: 'hero' },
      h('p', { class: 'eyebrow' }, 'Seniors Enriched Learning · Roswell, GA'),
      h('h1', {}, 'AI Without the Fear'),
      h('p', { class: 'lede' }, 'When it started, what it is, what it isn\'t, and how to use it. Tap any part below to play along. This page stays up after class, so come back anytime.'),
      h('a', { class: 'btn btn-primary btn-big', href: `#/${SECTIONS[0].id}` }, 'Start at the beginning →'),
    ),
    h('ol', { class: 'section-grid' },
      SECTIONS.map((s) => h('li', {},
        h('a', { class: `section-card${visited.has(s.id) ? ' is-visited' : ''}`, href: `#/${s.id}` },
          h('span', { class: 'section-icon', 'aria-hidden': 'true' }, s.icon),
          h('span', { class: 'section-card-text' },
            h('span', { class: 'section-num' }, `Part ${s.number}`),
            h('span', { class: 'section-title' }, s.title),
          ),
          visited.has(s.id) && h('span', { class: 'visited-mark', 'aria-label': 'visited' }, '✓'),
        ),
      )),
    ),
    h('p', { class: 'footnote' },
      'No sign-up, no tracking, nothing you type here leaves your device. ',
      h('a', { href: '#/present' }, 'Instructor view'),
    ),
  );
}

function renderPresenter() {
  const qr = h('div', { class: 'qr', role: 'img', 'aria-label': `QR code for ${siteUrl()}` });
  if (window.QRCode) {
    new window.QRCode(qr, { text: siteUrl(), width: 320, height: 320, correctLevel: window.QRCode.CorrectLevel.M });
  } else {
    qr.append(h('p', {}, 'QR library did not load. Share the link below instead.'));
  }
  let clock = WELCOME_MINUTES;
  const rows = [
    h('tr', {}, h('td', {}, '0:00'), h('td', {}, '👋 Welcome, scan the code'), h('td', {}, `${WELCOME_MINUTES} min`)),
    ...SECTIONS.map((s) => {
      const start = clock;
      clock += s.minutes;
      return h('tr', {},
        h('td', {}, `0:${String(start).padStart(2, '0')}`),
        h('td', {}, h('a', { href: `#/${s.id}` }, `${s.icon} ${s.title}`)),
        h('td', {}, `${s.minutes} min`),
      );
    }),
  ];
  return h('div', { class: 'presenter' },
    h('h1', {}, 'Scan to play along'),
    qr,
    h('p', { class: 'qr-url' }, siteUrl()),
    h('h2', {}, `Run of show · ${clock} minutes`),
    h('table', { class: 'run-of-show' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Start'), h('th', {}, 'Part'), h('th', {}, 'Length'))),
      h('tbody', {}, rows),
    ),
  );
}

function renderPager(current) {
  pager.replaceChildren();
  if (!current) return;
  const i = SECTIONS.indexOf(current);
  const prev = SECTIONS[i - 1];
  const next = SECTIONS[i + 1];
  pager.append(
    prev ? h('a', { class: 'btn', href: `#/${prev.id}` }, `← ${prev.title}`) : h('a', { class: 'btn', href: '#/' }, '← All parts'),
    h('span', { class: 'pager-count' }, `${current.number} / ${SECTIONS.length}`),
    next ? h('a', { class: 'btn btn-primary', href: `#/${next.id}` }, `${next.title} →`) : h('a', { class: 'btn btn-primary', href: '#/' }, 'All parts ✓'),
  );
}

function route() {
  const id = location.hash.replace(/^#\/?/, '');
  const section = byId.get(id);
  app.replaceChildren();
  document.body.dataset.view = section ? 'section' : id || 'home';
  if (section) {
    const root = h('article', { class: 'section', id: `sec-${section.id}` });
    app.append(root);
    section.render(root, section);
    store.set('visited', [...new Set([...store.get('visited', []), section.id])]);
    document.title = `${section.title} · AI Without the Fear`;
  } else {
    app.append(id === 'present' ? renderPresenter() : renderHome());
    document.title = 'AI Without the Fear';
  }
  renderPager(section);
  window.scrollTo(0, 0);
  app.focus({ preventScroll: true });
}

const TEXT_SIZES = ['normal', 'large', 'huge'];
function applyTextSize(size) {
  document.documentElement.dataset.textSize = size;
  store.set('textSize', size);
}
document.getElementById('text-size').addEventListener('click', () => {
  const current = document.documentElement.dataset.textSize || 'normal';
  applyTextSize(TEXT_SIZES[(TEXT_SIZES.indexOf(current) + 1) % TEXT_SIZES.length]);
});
applyTextSize(store.get('textSize', 'normal'));

window.addEventListener('hashchange', route);
route();
