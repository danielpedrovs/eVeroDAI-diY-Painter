// engine/classifier.js
import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@<pin-a-version>";

const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

async function embed(text) {
  const out = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(out.data);
}
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0); // normalised, so dot = cosine

let index = null; // [{ intent, vec }]
export async function loadIndex(examples) {
  index = [];
  for (const { text, intent } of examples) index.push({ intent, vec: await embed(text) });
}

export async function classify(text, threshold = 0.55) {
  const v = await embed(text);
  let best = { intent: "unknown", score: 0 };
  for (const e of index) {
    const s = dot(v, e.vec);
    if (s > best.score) best = { intent: e.intent, score: s };
  }
  return best.score >= threshold ? best : { intent: "unknown", score: best.score };
}