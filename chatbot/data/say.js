const last = new WeakMap();

export function pick(list) {
  if (!Array.isArray(list)) return list;
  const prev = last.get(list);
  const choices = list.length > 1 ? list.filter(x => x !== prev) : list;
  const out = choices[Math.floor(Math.random() * choices.length)];
  last.set(list, out);
  return out; // never the same line twice in a row
}