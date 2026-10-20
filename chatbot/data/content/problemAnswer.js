import { problems } from "../problems.js";
import { pick } from "../say.js";

export function startProblem(id, session) {

  const p = problems[id];

  if (!p) {
    return null;
  }

  session.lastTopic = id;

  if (!p.triage) {
    return fullAdvice(p.advice, session);
  }

  session.pendingTriage = id;

  return `${pick(p.intro)}\n\n${p.triage.question}`;
}


export function answerTriage(message, session) {

  const id = session.pendingTriage;

  if (!id) {
    return null;
  }

  const p = problems[id];

  if (!p?.triage) {
    session.pendingTriage = null;
    return null;
  }

  const options = p.triage.options;

  const key = Object.keys(options).find(key =>
    options[key].match?.test(message)
  );

  // IMPORTANT:
  // Don't clear the triage if we don't understand the answer.
  if (!key) {
    return `I'm not quite sure. ${p.triage.question}`;
  }

  session.pendingTriage = null;

  return fullAdvice(options[key], session);
}


function fullAdvice(advice, session) {

  const parts = [];

  if (advice.warning) {
    parts.push(`⚠️ ${advice.warning}`);
  }

  if (advice.escalate) {

    session.pending = "contact_offer";

    parts.push(
      "I'd suggest having a professional take a look before carrying out the repair."
    );

    parts.push(
      "If you'd like, I can help you arrange a callback."
    );

    return parts.join("\n\n");
  }

  if (advice.materials) {

    parts.push(
      "You'll need:\n" +
      advice.materials
        .map(item => `• ${item}`)
        .join("\n")
    );
  }

  if (advice.steps) {

    parts.push(
      "Steps:\n" +
      advice.steps
        .map((step, index) => `${index + 1}. ${step}`)
        .join("\n")
    );
  }

  parts.push(
    "If you give me the wall size, I can also estimate the paint quantity or cost."
  );

  return parts.join("\n\n");
}


export function followUp(message, session) {

  const id = session.lastTopic;

  if (!id) {
    return null;
  }

  const p = problems[id];

  if (!p?.followUps) {
    return null;
  }

  if (
    /\bhow long\b|\bhow many hours\b|\bhow many days\b/i.test(message)
  ) {
    return p.followUps.time ?? null;
  }

  if (
    /\b(cost|price)\b|\bhow much\b/i.test(message)
  ) {
    return p.followUps.cost ?? null;
  }

  return null;
}