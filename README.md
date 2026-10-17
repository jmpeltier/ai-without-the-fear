# AI Without the Fear

Play-along companion site for the Seniors Enriched Learning (Roswell, GA) class "AI Without the Fear: When did it start, What It Is, What It Isn't, and How to Use It."

Live site: https://jmpeltier.github.io/ai-without-the-fear/
Instructor view with QR code: https://jmpeltier.github.io/ai-without-the-fear/#/present

- `site/` is the static site (plain HTML, CSS, JavaScript, no build step). Each class part is one file in `site/sections/`, with its content in a data list at the top.
- `notes/` holds instructor talking points per part.
- `verify/check.mjs` loads every page at phone and desktop sizes in light and dark mode and fails on errors or layout overflow. Run `python3 -m http.server 8765` inside `site/`, then `cd verify && npm install && node check.mjs`.

Pushing to `main` republishes the site through GitHub Pages.
