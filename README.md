# AI Without the Fear

Play-along companion site for the Seniors Enriched Learning (Roswell, GA) class "AI Without the Fear: When did it start, What It Is, What It Isn't, and How to Use It."

Live site: https://jmpeltier.github.io/ai-without-the-fear/
Instructor view with QR code: https://jmpeltier.github.io/ai-without-the-fear/#/present

- `site/` is the static site (plain HTML, CSS, JavaScript, no build step). Each class part is one file in `site/sections/`, with its content in a data list at the top.
- `notes/` holds instructor talking points per part.
- `verify/check.mjs` loads every page at phone and desktop sizes in light and dark mode and fails on errors or layout overflow. Run `python3 -m http.server 8765` inside `site/`, then `cd verify && npm install && node check.mjs`.

Pushing to `main` republishes the site through GitHub Pages.


Prompt to build this site:

 /pstack:poteto-mode I want to build an interactive demo for a 1 hour class for https://www.selroswellga.org  Here is what the class will be on "AI Without the Fear: When did it start, What It Is, What It Isn't, and How to Use It

Artificial intelligence is everywhere in the news, but what is it really? This plain-English session explains how tools like ChatGPT and Claude actually work, what they can and can't do, how to try them safely, and how to spot AI-related scams. No technical background needed. Bring your questions.
"  I also want to make it interactive so that the class can scan a QR code that will take them to a website where they can interact with the material.   I want the material to be fun and engaging but also current.  For example people are concerned about data centers so explaining why they are needed and why so many and so large is helpful.   I do want to start at the beginning of AI and give a quick explaination of where AI started and how the transformer model lead the the latest LLM models.  I want to explain how LLM's work in a simple fashion and give easy to understand examples and demos that the class can "play along" with during the 1hr and for some time after the class is over.


can you create a public github repo on my jmpeltier and use github to host this class so the students QR code will work.

 /pstack:poteto-mode It would be nice to show a good animation of the transformer model doing inference.   If you take the sentence "The sky is ..." as a starting
  example and then it could expand on that sentence to even a few more words.