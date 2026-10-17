import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:8765/';
const ROUTES = ['', 'present', 'timeline', 'next-word', 'tokens', 'attention', 'tiny-model', 'is-isnt', 'data-centers', 'safe-use', 'scams', 'takeaways'];
const VIEWPORTS = [{ name: 'phone', width: 375, height: 800 }, { name: 'desktop', width: 1280, height: 900 }];
const only = process.argv.slice(2);

mkdirSync('shots', { recursive: true });
const browser = await chromium.launch();
let failures = 0;

for (const vp of VIEWPORTS) {
  for (const scheme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: vp, colorScheme: scheme });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

    for (const route of ROUTES.filter((r) => !only.length || only.includes(r || 'home'))) {
      errors.length = 0;
      await page.goto(`${BASE}#/${route}`);
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const text = await page.locator('#app').innerText();
      const problems = [];
      if (errors.length) problems.push(`errors: ${errors.join(' | ')}`);
      if (overflow > 1) problems.push(`horizontal overflow ${overflow}px`);
      if (text.includes('Coming soon')) problems.push('still a stub');
      if (text.trim().length < 40) problems.push('nearly empty');
      const label = `${vp.name}-${scheme}-${route || 'home'}`;
      if (scheme === 'light' || vp.name === 'phone') await page.screenshot({ path: `shots/${label}.png`, fullPage: true });
      if (problems.length) { failures++; console.log(`FAIL ${label}: ${problems.join('; ')}`); }
      else console.log(`ok   ${label}`);
    }
    await context.close();
  }
}

await browser.close();
console.log(failures ? `${failures} failing checks` : 'all checks passed');
process.exit(failures ? 1 : 0);
