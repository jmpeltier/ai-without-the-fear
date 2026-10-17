import { h, sectionHeader, store } from '../ui.js';

const VERDICTS = {
  ok: { label: 'Go ahead', emoji: '✅', tone: 'good' },
  careful: { label: 'Careful', emoji: '⚠️', tone: 'warn' },
  never: { label: 'Never', emoji: '⛔', tone: 'bad' },
};

const ITEMS = [
  { item: 'A question about how long to roast a turkey', verdict: 'ok', why: 'Nothing personal here. Ask away.' },
  { item: 'Your Social Security number', verdict: 'never', why: 'No chatbot needs it. Anything you type may be stored on the company\'s computers, and this number is the key to your identity.' },
  { item: 'A photo of a rash on your arm', verdict: 'careful', why: 'It can describe what it sees, but it is not a doctor and can be confidently wrong. Crop out your face, and call your doctor for anything that worries you.' },
  { item: 'Your bank username and password', verdict: 'never', why: 'Never type a password into a chatbot. No real AI tool will ever ask you for one. If something asks, it is a scam.' },
  { item: 'A draft letter to your HOA about the pool hours', verdict: 'ok', why: 'Great use! It can make your letter clear and polite. Swap real names for "my neighbor" if you like.' },
  { item: 'Your medical test results', verdict: 'careful', why: 'It can explain the terms in plain English. First black out your name, date of birth, and patient ID number. Then check its answers with your doctor.' },
  { item: 'A photo of your grandchild', verdict: 'careful', why: 'Photos of other people, especially children, are theirs too. Ask the parents first, and leave out anything that shows a school or home address.' },
  { item: 'Your credit card number, to "help book a trip"', verdict: 'never', why: 'Let the chatbot plan the trip. Then book on the airline or hotel\'s own website yourself.' },
];

const TOOLS = [
  { name: 'ChatGPT', maker: 'OpenAI', site: 'chatgpt.com' },
  { name: 'Claude', maker: 'Anthropic', site: 'claude.ai' },
  { name: 'Gemini', maker: 'Google', site: 'gemini.google.com' },
  { name: 'Copilot', maker: 'Microsoft', site: 'copilot.com' },
];

const SETTINGS = [
  ['"Use my chats to improve the AI"', 'Most apps have a switch, usually under Settings, then Privacy or Data Controls, that decides whether your conversations help train future versions. You can turn it off. The exact wording changes from app to app and year to year.'],
  ['Temporary or private chats', 'Some apps, Gemini among them, offer a temporary chat that is not kept in your history and not used for training. Handy for one-off private questions.'],
  ['Delete old chats', 'You can delete conversations from your history at any time. Look for a trash can or "Delete" next to each chat.'],
];

const PROMPTS = [
  { label: 'Explain a medical bill', text: 'I\'m retired and not a medical billing expert. Here is a line from my hospital bill (I removed my name and account number): [paste it]. Explain in plain English what each charge means and what questions I should ask the billing office. Use short sentences.' },
  { label: 'Plan a trip to Savannah', text: 'Plan a relaxed 3-day trip to Savannah, Georgia, for two retirees driving from Roswell. We like history, good food, and short walks, not long hikes. Give me a simple day-by-day plan in large-print-friendly bullet points.' },
  { label: 'Grocery list from a recipe', text: 'Turn this recipe into a grocery list grouped by store aisle (produce, dairy, pantry). I\'m cooking for 4. Recipe: [paste it]' },
  { label: 'Write a thank-you note', text: 'Help me write a warm, short thank-you note to my neighbor, who brought soup when I was sick. Sound like me: friendly, a little funny, not too formal. 4 to 5 sentences.' },
  { label: 'Understand a Medicare letter', text: 'I got a letter from my Medicare plan. Here is the text, with my name and ID removed: [paste it]. Tell me in plain English what it says, whether I need to do anything, and by when. I will double-check with the plan by phone.' },
  { label: 'Practice Spanish for a trip', text: 'I\'m going to Mexico in March and know only a little Spanish. Be my patient tutor. Teach me 5 useful phrases for a restaurant, then quiz me one at a time and gently correct me.' },
  { label: 'Questions for my doctor', text: 'I have a check-up next week and want to ask about my knee pain and trouble sleeping. Suggest 6 clear questions I could bring to my doctor, written so I can print them.' },
];

const TIPS = [
  ['Say who you are', '"I\'m a retired teacher who is new to this."'],
  ['Say what you want', '"Help me write a birthday message for my sister."'],
  ['Say how you want it', '"In 5 bullet points, large print friendly."'],
];

function sortingGame(box = h('div', { class: 'safe-game' })) {
  const answers = store.get('safe-use:answers', {});
  const score = h('p', { class: 'safe-score', 'aria-live': 'polite' });
  const updateScore = () => {
    const done = ITEMS.filter((it) => answers[it.item]);
    const right = done.filter((it) => answers[it.item] === it.verdict).length;
    score.textContent = done.length
      ? `You've sorted ${done.length} of ${ITEMS.length}. ${right} matched our answer.`
      : `Sort all ${ITEMS.length}. Tap your answer for each one.`;
  };

  const cards = ITEMS.map((it) => {
    const reveal = h('div', { class: 'safe-reveal' });
    const buttons = Object.entries(VERDICTS).map(([key, v]) =>
      h('button', { class: 'choice', type: 'button', 'data-verdict': key, onClick: () => pick(key) }, `${v.emoji} ${v.label}`));
    const show = (choice) => {
      const v = VERDICTS[it.verdict];
      buttons.forEach((b) => {
        const key = b.dataset.verdict;
        b.classList.toggle('is-correct', key === it.verdict);
        b.classList.toggle('is-wrong', key === choice && choice !== it.verdict);
      });
      reveal.replaceChildren(h('div', { class: `callout ${v.tone}` },
        h('strong', {}, `${v.emoji} ${v.label}. `), it.why));
    };
    function pick(choice) {
      answers[it.item] = choice;
      store.set('safe-use:answers', answers);
      show(choice);
      updateScore();
    }
    if (answers[it.item]) show(answers[it.item]);
    return h('div', { class: 'card safe-item' },
      h('p', { class: 'safe-item-q' }, it.item),
      h('div', { class: 'choices safe-choices' }, buttons),
      reveal);
  });

  updateScore();
  box.replaceChildren(score, ...cards, h('button', {
    class: 'btn', type: 'button',
    onClick: () => {
      store.set('safe-use:answers', {});
      sortingGame(box);
    },
  }, '↺ Start over'));
  return box;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = h('textarea', { style: { position: 'fixed', opacity: '0' } });
    area.value = text;
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

function promptCard(p) {
  const btn = h('button', {
    class: 'btn btn-primary', type: 'button',
    onClick: async () => {
      btn.textContent = (await copyText(p.text)) ? '✓ Copied! Paste it into a chatbot' : 'Press and hold the text to copy';
      setTimeout(() => { btn.textContent = '📋 Copy this prompt'; }, 2500);
    },
  }, '📋 Copy this prompt');
  return h('div', { class: 'card safe-prompt' },
    h('h3', {}, p.label),
    h('p', { class: 'safe-prompt-text' }, p.text),
    btn);
}

export default {
  id: 'safe-use',
  title: 'Try it safely',
  icon: '🛟',
  minutes: 5,
  render(root, section) {
    root.append(
      sectionHeader(section, 'Treat a chatbot like a helpful stranger at the library: great for questions, recipes and letters, but not someone you hand your wallet to.'),

      h('h2', {}, 'Should I paste this into a chatbot?'),
      h('p', {}, 'For each item, tap Go ahead, Careful, or Never.'),
      sortingGame(),

      h('h2', {}, 'How to get started'),
      h('p', {}, 'These four big ones each have a free version that works in your web browser, plus an official phone app. You don\'t need to pay to try them.'),
      h('ul', { class: 'safe-tools' }, TOOLS.map((t) => h('li', { class: 'card' },
        h('strong', {}, t.name), ` by ${t.maker}`, h('br'), h('span', { class: 'safe-site' }, t.site)))),
      h('div', { class: 'callout warn' },
        h('strong', {}, 'Watch out for look-alike apps. '),
        'App stores have had copycats with names like "Chat GTP" that charge pricey subscriptions. Before you tap Install, check the maker\'s name under the app title: OpenAI, Anthropic, Google, or Microsoft. If you install a fake one, deleting it does not cancel the subscription. Cancel it in your app store settings.'),

      h('h3', {}, 'Settings worth knowing'),
      h('dl', { class: 'safe-settings' }, SETTINGS.map(([term, desc]) => [h('dt', {}, term), h('dd', {}, desc)])),

      h('h2', {}, 'Prompt starter kit'),
      h('p', {}, 'A "prompt" is just what you type to the chatbot. Copy one of these, paste it in, and change the details to fit you.'),
      h('div', { class: 'card safe-tips' },
        h('h3', {}, 'The recipe for a good prompt'),
        h('ol', {}, TIPS.map(([tip, eg]) => h('li', {}, h('strong', {}, tip), h('br'), h('span', { class: 'safe-eg' }, eg))))),
      h('div', { class: 'safe-prompts' }, PROMPTS.map(promptCard)),

      h('div', { class: 'callout good' },
        h('strong', {}, 'What this means for you. '),
        'Try it with everyday things: letters, recipes, trips, explaining jargon. Keep secrets like passwords, account numbers and your Social Security number out of it. And double-check anything important (health, money, legal) with a real person or the official source.'),

      h('p', { class: 'sources' }, 'Sources: ',
        'Official apps, all listed as free with optional paid plans: ',
        h('a', { href: 'https://apps.apple.com/us/app/chatgpt/id6448311069' }, 'ChatGPT (App Store, OpenAI OpCo, LLC)'), ', ',
        h('a', { href: 'https://apps.apple.com/us/app/claude-by-anthropic/id6473753684' }, 'Claude (App Store, Anthropic PBC)'), ', ',
        h('a', { href: 'https://apps.apple.com/us/app/google-gemini/id6477489729' }, 'Google Gemini (App Store, Google LLC)'), ', ',
        h('a', { href: 'https://copilot.com/' }, 'Microsoft Copilot (free tier, iOS and Android apps)'), '; ',
        h('a', { href: 'https://claude.com/pricing' }, 'Claude Free plan'), '. ',
        'Look-alike apps: ',
        h('a', { href: 'https://www.checkbook.org/national/consumers-notebook/articles/Fraud-Alert-Fake-ChatGPT-Apps-Commonplace-in-App-Stores-7813' }, 'Consumers\' Checkbook, "Fake ChatGPT Apps Commonplace in App Stores" (2023)'), '. ',
        'Privacy settings: ',
        h('a', { href: 'https://privacy.claude.com/en/articles/12109829' }, 'Anthropic privacy help'), ', ',
        h('a', { href: 'https://blog.google/products/gemini/temporary-chats-privacy-controls/' }, 'Google, Gemini Temporary Chats (Aug 2025)'), ', ',
        h('a', { href: 'https://support.microsoft.com/topic/microsoft-copilot-privacy-controls-8e479f27-6eb6-48c5-8d6a-c134062e2be6' }, 'Microsoft Copilot privacy controls'), '.'),
    );
  },
};
