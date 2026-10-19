import Fuse from "../../../../vendor/fuse.mjs";
import { knowledge } from "../../../data/knowledge.js";

// Exact swaps that fuzzy matching can't guess. Check these against your keywords.
const SYNONYMS = {
  labor: "labour",
  labourer: "labour",
  colors: "colours",
  color: "colour",
  lounge: "living room",
  hallway: "hall",
};

// Everyday words that must never be "corrected" into a keyword
const COMMON = new Set([
  "need", "with", "much", "many", "what", "whats", "how", "does", "from", "that",
  "this", "have", "will", "about", "your", "cost", "want", "need", "when", "where",
  "which", "there", "their", "them", "then", "than", "into", "over", "some", "also",
]);

// Vocabulary = every single word (4+ letters) used in your knowledge keywords
const vocab = new Set();
for (const item of Object.values(knowledge)) {
  for (const kw of item?.keywords ?? []) {
    for (const w of kw.toLowerCase().split(/\s+/)) {
      if (/^[a-z]{4,}$/.test(w)) vocab.add(w);
    }
  }
}

const fuse = new Fuse([...vocab], {
  includeScore: true,
  threshold: 0.3,        // 0 = exact, 1 = anything
  ignoreLocation: true,
  minMatchCharLength: 3,
});

export function correctTypos(message) {
  return message.replace(/[a-z]{4,}/g, (word) => {
    if (SYNONYMS[word]) return SYNONYMS[word];
    if (vocab.has(word) || COMMON.has(word)) return word;

    const hit = fuse.search(word, { limit: 1 })[0];
    if (!hit) return word;

    // Safety guards: close score, same first letter, similar length
    const ok =
      hit.score <= 0.2 &&
      hit.item[0] === word[0] &&
      Math.abs(hit.item.length - word.length) <= 2;

    return ok ? hit.item : word;
  });
}