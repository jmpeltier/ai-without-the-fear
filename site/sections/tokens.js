import { h, sectionHeader } from '../ui.js';

// Words common enough that a real tokenizer would almost certainly keep them whole.
const COMMON_WORDS = new Set(`
a about after again all also always am an and any are around as ask at away back be because been before being best better big
book both boy but by call came can car care cat child children city class come could day did do does dog done down each eat
end even every eye face family far feel few find first five food for four friend from full get girl give go god going good
got great had hand happy has have he head hear heart help her here high him his home house how i if in into is it its just
keep kind know large last late learn left let life like line little live long look love made make man many may me mean men
might mind money more morning most mother much music must my name need never new next nice night no not now number of off
often old on once one only open or other our out over own page paper part people place play please put read real right road
room run said same saw say school see seem she should show side small so some something song soon sound start still stop
story student study such sun sure take talk teacher tell than thank thanks that the their them then there these they thing
think this those three time to today together too took tree try turn two under until up us use very walk want war was
watch water way we week well went were what when where which while white who why will with word work world would write
year yes yet you young your hello bless everywhere bridge street margaret dorothy elizabeth jennifer michael
ai chat robot phone computer email text photo picture video internet google apple
georgia atlanta roswell south southern church sunday biscuit tea sweet grandma grandpa
john mary james robert linda susan david barbara william patricia richard nancy thomas karen carol betty
`.trim().split(/\s+/));

// Familiar word pieces. Real tokenizers learn tens of thousands of these from data.
const PIECES = new Set(`
straw berry ing tion sion ness ment able ible less ful ous ive est er ed ly al ical ize ise ism ist ity ure ance ence ship hood
un re in dis pre pro con com over under inter trans super anti auto tele micro photo graph phone ology
art ific ial intel lig ence chat bot gram mar ber ger son ton ville land ford wood field
tok en izer token cool ever every thing body where some one any
`.trim().split(/\s+/));

const MAX_PIECE = 6;

const SHORT_WORD = 5;
// A rough syllable: up to the consonant (or familiar pair like "tr" or "ch") that starts the next vowel sound.
const SYLLABLE = /^[^aeiouy]*[aeiouy]+[^aeiouy]*?(?=(?:ch|sh|th|ph|wh|[bcdfgkpt][rl]|st|[^aeiouy])[aeiouy]|$)/i;

function pieceAt(lower, i) {
  for (let len = Math.min(MAX_PIECE, lower.length - i); len >= 2; len--) {
    const fitsEnd = i + len === lower.length;
    if ((len >= 3 || fitsEnd) && PIECES.has(lower.slice(i, i + len))) return len;
  }
  return 0;
}

function splitWord(word) {
  const lower = word.toLowerCase();
  if (word.length <= SHORT_WORD || COMMON_WORDS.has(lower)) return [word];
  const parts = [];
  let i = 0;
  while (i < word.length) {
    let len = pieceAt(lower, i) || (lower.slice(i).match(SYLLABLE)?.[0].length ?? 0) || word.length - i;
    // Avoid a dangling one-letter scrap at the end.
    if (word.length - (i + len) === 1) len++;
    parts.push(word.slice(i, i + len));
    i += len;
  }
  return parts;
}

// Like real tokenizers, a leading space rides along with the word after it.
function tokenize(text) {
  const tokens = [];
  for (const [, space, chunk] of text.matchAll(/(\s*)(\p{L}+|\p{N}{1,3}|[^\s\p{L}\p{N}])/gu)) {
    const pieces = /\p{L}/u.test(chunk) ? splitWord(chunk) : [chunk];
    pieces.forEach((p, i) => tokens.push((i === 0 ? space.replace(/\s+/g, ' ') : '') + p));
  }
  return tokens;
}

const SAMPLES = ['Hello, my name is Margaret Whitfield.', 'Bless your heart!', 'strawberry', 'Artificial intelligence is everywhere.'];
const COLORS = 6;

export default {
  id: 'tokens',
  title: 'How AI reads: tokens',
  icon: '🧩',
  minutes: 4,
  render(root, section) {
    const input = h('input', {
      type: 'text', value: SAMPLES[0], 'aria-label': 'Type a name or sentence', autocomplete: 'off', spellcheck: 'false',
      onInput: () => update(),
    });
    const chips = h('div', { class: 'tk-chips', 'aria-live': 'polite' });
    const tokenCount = h('span', { class: 'stat' });
    const wordCount = h('span', { class: 'stat' });

    function update() {
      const tokens = tokenize(input.value);
      chips.replaceChildren(...(tokens.length
        ? tokens.map((t, i) => h('span', { class: `tk-chip tk-c${i % COLORS}` },
          t.startsWith(' ') && h('span', { class: 'tk-space', 'aria-label': 'space' }, '␣'),
          t.trimStart()))
        : [h('span', { class: 'tk-empty' }, 'Type something above.')]));
      tokenCount.textContent = tokens.length;
      wordCount.textContent = (input.value.match(/\p{L}+/gu) || []).length;
    }
    update();

    root.append(
      sectionHeader(section, 'AI doesn\'t read letter by letter, or even word by word. It chops text into bite-sized chunks called "tokens," like a child sounding out a long word in pieces.'),
      h('div', { class: 'card' },
        h('h2', { class: 'tk-h2' }, '✂️ See your words get chopped'),
        h('p', {}, 'Type your name, your street, or any sentence.'),
        input,
        h('div', { class: 'tk-samples' }, SAMPLES.map((s) => h('button', {
          type: 'button', class: 'btn btn-quiet', onClick: () => { input.value = s; update(); },
        }, s))),
        chips,
        h('div', { class: 'tk-stats' },
          h('div', {}, tokenCount, h('div', { class: 'stat-label' }, 'tokens')),
          h('div', {}, wordCount, h('div', { class: 'stat-label' }, 'words')),
        ),
        h('p', { class: 'tk-label' }, '⚠️ This is a simplified imitation of how real tokenizers work. Real ones learn their chunks from huge amounts of text, so their exact splits will differ.'),
      ),
      h('div', { class: 'callout' },
        h('strong', {}, 'Rule of thumb. '),
        'In English, one token is about 4 letters, or roughly three-quarters of a word. Google says 100 tokens is about 60 to 80 English words. Everyday words usually stay whole. Rare words and names get split into pieces.',
      ),
      h('div', { class: 'card' },
        h('h2', { class: 'tk-h2' }, '🍓 The strawberry puzzle'),
        h('p', {}, 'For a while, a famous party trick was asking a chatbot "How many r\'s are in strawberry?" Many answered two. (There are three.)'),
        h('p', {}, 'Why? The AI doesn\'t see s-t-r-a-w-b-e-r-r-y. It sees chunks, something like "straw" + "berry," each turned into a number. Counting letters inside a chunk is like asking you how many brushstrokes are in a painting you only saw from across the room.'),
        h('p', {}, 'Newer models usually get it right, often by spelling the word out first. But it\'s a good reminder: AI is not reading the way you do.'),
      ),
      h('div', { class: 'callout good' },
        h('strong', {}, 'What this means for you. '),
        'Chatbots are great with meaning and weaker with exact letters and digits. For spelling a name, counting characters, or copying an account number, double-check the result yourself.',
      ),
      h('p', { class: 'sources' },
        'Sources: ',
        h('a', { href: 'https://ai.google.dev/gemini-api/docs/tokens', target: '_blank', rel: 'noopener' }, 'Google Gemini docs: a token is about 4 characters, 100 tokens is about 60 to 80 English words'),
        '; ',
        h('a', { href: 'https://techcrunch.com/2024/08/27/why-ai-cant-spell-strawberry/', target: '_blank', rel: 'noopener' }, 'TechCrunch, "Why AI can\'t spell strawberry" (Aug 2024)'),
        '. The splitter on this page is our own simplified teaching version.',
      ),
    );
  },
};
