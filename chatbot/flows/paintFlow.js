import { calculatePaint } from "../domain/calculator.js";

const NUM = "(\\d+(?:\\.\\d+)?)";
const SEP = "\\s*(?:m|metres?|meters?)?\\s*(?:by|x|×|\\*)\\s*";
const SIZE_RE = new RegExp(NUM + SEP + NUM + "(?:" + SEP + NUM + ")?", "i");

export function parseSize(text) {
  const m = text.replace(/(\d),(\d)/g, "$1.$2").match(SIZE_RE);
  if (!m) return null;
  return { a: Number(m[1]), b: Number(m[2]), c: m[3] != null ? Number(m[3]) : null };
}

export function extractDimensions(text) {
  text = text.toLowerCase();
  const dims = {};

  const w = text.match(/(\d+(?:\.\d+)?)\s*walls?\b/);
  if (w) dims.walls = parseFloat(w[1]);

  const size = parseSize(text);
  if (size) {
    if (size.c != null) {
      Object.assign(dims, { length: size.a, width: size.b, height: size.c, isRoom: true });
    } else {
      Object.assign(dims, { width: size.a, height: size.b });
    }
    return dims;
  }

  const wh = text.match(/(\d+(?:\.\d+)?)\s*met(?:er|re)s?\s*wide\s*and\s*(\d+(?:\.\d+)?)\s*met(?:er|re)s?\s*high/);
  if (wh) return { ...dims, width: parseFloat(wh[1]), height: parseFloat(wh[2]) };

  return dims.walls ? dims : null;
}

function freshState() {
  return { dims: {}, walls: null, isRoom: false, includeCeiling: null, misses: 0 };
}

// Call when the answer has been delivered (or the user cancels)
export function resetPaintFlow(session) {
 session.paint = null; session.pending = null; 
 session.contactStep = 0; session.contactData = {}; 
 session.quoteStep = 0; session.quoteData = {};
// stops decisionNode routing new messages back here
}

export function handlePaintFlow(message, session) {
  const text = message.toLowerCase();

  // A new paint request never inherits anything from an earlier one
  const restart = /how much paint|paint quantity|measure paint|calculate paint|new (paint )?(calculation|room)/.test(text);
  if (!session.paint || restart) session.paint = freshState();
  const p = session.paint; // own state: other nodes can't overwrite it

  // 1. Collect what THIS message gives us
  if (/\broom\b/.test(text) && !p.isRoom) {
    p.isRoom = true;
    p.misses = 0; // progress: the next prompt is a fresh question, not a retry
  }

  const w = text.match(/(\d+)\s*walls?\b/);
  if (w) p.walls = Number(w[1]);

  const size = parseSize(text);
  if (size) {
    if (size.c != null) {
      p.isRoom = true; // three numbers = length, width, height
      p.dims = { length: size.a, width: size.b, height: size.c };
    } else if (p.isRoom) {
      p.dims = { length: size.a, width: size.b, height: p.dims.height }; // height defaults to 2.4
    } else {
      p.dims = { width: size.a, height: size.b }; // one wall
    }
  }

  const d = p.dims;

  // 2. Do we have a usable size?
  const hasSize = p.isRoom
    ? Boolean(d.length && d.width)
    : Boolean(d.width && d.height);

  if (!hasSize) {
    const misses = p.misses;
    p.misses += 1;
    const gotWalls = !p.isRoom && w ? `Got it, ${p.walls} walls. ` : "";

    if (p.isRoom) {
      return misses === 0
        ? "Got it, a whole room. Send length by width, and height if it isn't about 2.4 m, e.g. 4 by 3 by 2.4."
        : "I didn't catch that. Please send the room as length by width by height in metres, e.g. 4 by 3 by 2.4.";
    }
    return gotWalls + (misses === 0
      ? "Tell me the wall size (e.g. 3 by 2.4), or say 'room' to paint a whole room."
      : "I didn't catch that. For one wall try '3 by 2.4'. For a whole room, say 'room' and I'll ask for the length, width and height.");
  }

  // 3. Ceiling (only possible when we know the room's length and width)
  if (p.includeCeiling == null) {
    const yes = /^(yes|yeah|yep|y|sure|ok)\b|\b(with|include|including)\b.*\bceiling\b/.test(text);
    const no  = /^(no|nope|n)\b|\b(no|without|exclude)\b.*\bceiling\b/.test(text);

    if (!p.isRoom) p.includeCeiling = false;
    else if (yes)  p.includeCeiling = true;
    else if (no)   p.includeCeiling = false;
    else return "Do you want to include the ceiling? (yes / no)";
  }

  // 4. Calculate
  const result = calculatePaint({
    width: d.width,
    length: d.length || d.width,
    height: d.height || 2.4,
    walls: p.isRoom ? null : (p.walls || 1), // null => calculator uses the room perimeter
    includeCeiling: p.includeCeiling
  });


  return result;
}