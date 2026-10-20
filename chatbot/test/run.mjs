import { processMessage, detectIntent } from "../core/mainEngine/pipeline/engine.js";
import { resetSession } from "../core/session.js";



const VERBOSE = process.argv.includes("--verbose");
const ONLY = process.argv.find(a => a.startsWith("--only="))?.split("=")[1];

/**
 * A step is { say, reply?, intent? }
 *   reply:  RegExp | string (substring) | function(reply) => boolean
 *   intent: expected intent name (checked without running flows)
 * Steps inside one scenario share a session (a conversation).
 * Every scenario starts with a clean session.
 */
const scenarios = [
  {
    name: "greeting",
    steps: [{ say: "hello", reply: /help with your painting/i }],
  },
  {
    name: "paint quantity, one shot",
    steps: [{ say: "how much paint 4 walls 5 by 3", reply: /litres|L per coat/i }],
  },
  {
    name: "paint quantity, room with ceiling",
    steps: [
      { say: "how much paint" },
      { say: "room 4 by 2", reply: /ceiling/i },
      { say: "yes", reply: /total:\s*36\.8/i },
    ],
  },
  {
    name: "cost estimate",
    steps: [{ say: "how much will it cost 5 by 3 at 20 per m2", reply: /£/ }],
  },
  {
    name: "invoice one-shot extraction",
    steps: [
      {
        say: "invoice for John. he lives at 2 buckingham palace road for a painting work at the value of 800£",
        reply: /default business details/i,
      },
    ],
  },
  {
    name: "exit word leaves a flow",
    steps: [
      { say: "create invoice for John" },
      { say: "exit", reply: /what would you like to do/i },
    ],
  },
  {
    name: "typos and synonyms",
    steps: [
      { say: "whats the labor cost to paint a flat", intent: "costEstimate" },
      { say: "how much paitn do i need", intent: "paintQuantity" },
      { say: "peeling pant on my wall", intent: "peelingPaint" },
      { say: "colur ideas for living room", intent: "colourAdvice" },
    ],
  },
  {
    name: "repair advice",
    steps: [
      { say: "my wall has a crack", reply: /filler/i },
      { say: "the paint is peeling", reply: /scrape/i },
    ],
  },
];

// ---------- runner ----------
function matches(expected, reply) {
  if (expected instanceof RegExp) return expected.test(reply);
  if (typeof expected === "function") return expected(reply);
  return String(reply).toLowerCase().includes(String(expected).toLowerCase());
}

let passed = 0, failed = 0, unchecked = 0;
const failures = [];

for (const sc of scenarios) {
  if (ONLY && !sc.name.includes(ONLY)) continue;
  resetSession();
  console.log(`\n▶ ${sc.name}`);

  for (const step of sc.steps) {
    let reply, intent;
    try {
      if (step.intent) intent = await detectIntent(step.say);
      if (step.reply || !step.intent) reply = await processMessage(step.say);
    } catch (err) {
      failed++;
      failures.push(`${sc.name}: "${step.say}" threw ${err.message}`);
      console.log(`  ✖ "${step.say}"  THREW ${err.message}`);
      break; // the rest of the conversation is meaningless
    }

    const problems = [];
    if (step.intent && intent !== step.intent)
      problems.push(`intent: expected ${step.intent}, got ${intent}`);
    if (step.reply && !matches(step.reply, reply))
      problems.push(`reply did not match ${step.reply}`);

    const checked = step.intent || step.reply;
    if (!checked) unchecked++;

    if (problems.length) {
      failed++;
      failures.push(`${sc.name}: "${step.say}" → ${problems.join("; ")}`);
      console.log(`  ✖ "${step.say}"  ${problems.join("; ")}`);
      console.log(`    bot: ${String(reply).slice(0, 120)}`);
    } else {
      if (checked) passed++;
      console.log(`  ${checked ? "✔" : "·"} "${step.say}"`);
      if (VERBOSE && reply) console.log(`    bot: ${reply}`);
    }
  }
}

console.log(`\n${passed} passed, ${failed} failed, ${unchecked} unchecked`);
if (failed) {
  console.log("\nFailures:\n" + failures.map(f => " - " + f).join("\n"));
  process.exit(1);
}