# Instructor notes: how chatbots work (Parts 1 to 6)

## Part 1. Where AI came from (7 min)

- Open with the punchline. AI is over 75 years old (Turing, 1950). The "AI" phrase itself comes from the 1955 proposal for the 1956 Dartmouth workshop.
- ELIZA (1966) is the human story. Weizenbaum's secretary asked him to leave the room so she could talk to it. People trusted a very simple chatbot, and that tendency matters for scams later.
- Two AI winters (about 1974 to 1980 and 1987 to 2000) show that hype has crashed before. This is reassuring for anxious attendees.
- Slow down on 2017. The transformer paper from eight Google researchers is the turning point, and it is the "T" in ChatGPT.
- The recent leap had three ingredients. The transformer, a huge amount of text, and enormous computing power.
- ChatGPT numbers. UBS analysts *estimated* 100 million users in about two months (early 2023). OpenAI *reports* 900 million weekly users (Feb 2026). Say "estimated" and "company-reported" out loud.

**Play-along moment.** After you tap through to 2017, say "Now everyone press Start the game. Six events, guess the decade." Give them 2 minutes, then ask "Who got 5 or 6?"

**Likely question.** "Is AI going to keep getting smarter forever?" *Plain answer:* Nobody knows. It has had big jumps and long stalls before. Right now it is improving fast, which is why it is worth learning the basics, but the experts disagree about how far this approach can go.

## Part 2. Guess the next word (7 min)

- The one-sentence idea. A chatbot is your phone's autocomplete on a giant scale, predicting one word at a time.
- The percentages are hand-made illustrations, not real model output. Say so once.
- "The capital of Georgia is..." is the teaching round. Tbilisi is the capital of the country of Georgia. The model picks what usually follows the words, so a vague question can get a confident answer about the wrong Georgia.
- The creativity dial is "temperature." All the way left, it writes the same sentence every time. Push it right and it gets surprising, sometimes silly. This is why the same question can get different answers on different days.
- Tie it to hallucination. It picks likely-sounding words, not looked-up facts. Usually likely and true agree. When they don't, you get a confident wrong answer.

**Play-along moment.** Read each prompt aloud ("Bless your...") and have the room shout the answer before they tap. Then for the dial, "Slide it all the way left and press Write three times. Now slide it all the way right."

**Likely question.** "So does it actually understand anything?" *Plain answer:* It understands patterns in language extremely well, well enough to be very useful. It does not check facts against the world the way you do, so for anything important you still verify.

## Part 3. How AI reads: tokens (3 min)

- A token is a chunk of text, often a whole common word, sometimes a piece of a longer word.
- Rule of thumb. About 4 letters, or roughly three-quarters of a word, per token in English. Google's docs put 100 tokens at about 60 to 80 English words.
- Our splitter is a simplified imitation. Real tokenizers learn their chunks from data. Say this so nobody quotes our splits as gospel.
- Strawberry. Chatbots famously said two r's because they see "straw" + "berry" as chunks, not letters. Newer models usually get it right.
- Practical tip. Double-check exact spellings, counts and account numbers.

**Play-along moment.** "Type your own first and last name. Who got split into the most pieces?" Common names stay whole. Unusual names get chopped.

**Likely question.** "Why should I care about tokens?" *Plain answer:* Mostly you don't need to. It just explains why chatbots can be oddly bad at spelling and counting letters, and why some services limit how long your message can be.

## Part 4. The big breakthrough: attention (4 min)

- Attention means reading the whole sentence at once and working out which words matter to each other.
- The trophy and suitcase sentence is a classic test for computers, from Hector Levesque's "Winograd schemas." People find it trivial. Older computer programs did not.
- The flip is the magic moment. Change "big" to "small" and "it" switches from the trophy to the suitcase. Only one word changed.
- The weights shown are hand-made illustrations. Real models compute millions of these in many layers.
- The analogy. Old systems played telephone, word by word. A transformer is a party where everyone hears everyone at once. Doing everything at once also suits modern chips, which is what made huge training possible.

**Play-along moment.** "Tap the word 'it.' What does it point to? Now press 'too small' and tap 'it' again." Pause and let the room react.

**Likely question.** "Did Google invent ChatGPT then?" *Plain answer:* Google researchers invented the transformer design in 2017 and published it openly. OpenAI built ChatGPT on that design, and now nearly every company uses it.

## Part 5. Watch AI write a sentence (5 min)

- This part ties Parts 2, 3 and 4 together. Every new word is one full trip through the model, in five steps: read the tokens, turn them into numbers, pay attention, guess, then pick and add.
- Use "Next step" to narrate the first word yourself. Then press Play and let the sentence finish on its own while you talk.
- Numbers step. Every token becomes a long list of numbers. Ours shows 6 made-up ones. Meta reports its Llama 3 models use 4,096 to 16,384 numbers per token.
- Attention step. The thick lines are the words the newest word leans on most. It runs in layers, each one refining the last. Our demo shows 3. Meta's biggest Llama 3 has 126.
- The punchline is the end card. A long chatbot answer is this same loop run hundreds or thousands of times, very fast. Every weight and percentage here is hand-made for teaching.
- Try "Summers in Georgia are" for a laugh. It ends on "y'all."

**Play-along moment.** "Pick any starting sentence and press Play. Watch the dots at the top. Raise your hand when your sentence is finished." Then ask "Did yours ever choose a word that was not the top guess?" (No. This demo always takes the top word. Part 2's creativity dial is what changes that.)

**Likely question.** "Does it plan the whole answer before it starts typing?" *Plain answer:* It writes one token at a time, and each one is chosen fresh based on everything so far, including its own earlier words. Researchers have found that models can plan a few words ahead internally (Anthropic found Claude picking a rhyme before writing the line that leads to it, https://www.anthropic.com/research/tracing-thoughts-language-model, March 2025), but what comes out is still one token after another. That's why it can talk itself into a mistake, and why reading the whole answer matters.

## Part 6. Train a tiny AI (4 min)

- This is a real model, trained live on their phone. It counts which word follows which (a "bigram" or word-pair counter).
- Show the counts after training (words read, different words, word pairs). Then Generate a few times. It produces near-sense, near-nonsense. That is the point.
- Tap a word in "Peek inside its brain" to show the table. "After 'grandma' it always saw 'says,' so it always writes 'says.'"
- Same idea as ChatGPT, wildly different scale. ChatGPT read a huge slice of the internet and tuned billions of adjustable settings.
- Be honest. Real models are not word-pair counters. Attention lets them use the whole conversation, which is why they stay on topic.

**Play-along moment.** "Pick Grandma's kitchen, press Train, then press Generate five times. Read me your funniest sentence." Virtual attendees can type theirs in the chat.

**Likely question.** "If I paste my own writing in, does it go anywhere?" *Plain answer:* No. This demo runs entirely on your phone and sends nothing over the internet. (Real chatbots are different. What you type to them goes to the company's computers, which we cover in the safety part.)
