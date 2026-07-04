const STOPWORDS = [
   "for", "relative", "regarding", "about", "job", "amount",
  "total", "price", "of", "a", "an", "the", "and", "to", "quote",
  "from", "with", "on", "in", "at", "my", "standard", "business",
  "details", "default"
];

const JOB_KEYWORDS = [
"painting", "decorating", "wallpapering", "wallpaper",
  "plastering", "tiling", "flooring", "rendering", "woodwork"
];

function extractAddress(text) {
  const postcodeMatch = text.match(/\b([A-Za-z]{1,2}\d[A-Za-z\d]?)\s*(\d[A-Za-z]{2})\b/);
  if (!postcodeMatch) return null;

  const postcode = `${postcodeMatch[1]} ${postcodeMatch[2]}`.toUpperCase();

  // grab the chunk of text right before the postcode that looks like a street address
  const beforeText = text.slice(0, postcodeMatch.index);
  const streetMatch = beforeText.match(/(\d+\s+[a-z][a-z\s]*?)(?:,|$)/i);

  return streetMatch ? `${streetMatch[1].trim()}, ${postcode}` : postcode;
}

function extractPrice(text) {
  const match = text.match(
    /£\s?(\d+(?:\.\d{1,2})?)|(\d+(?:\.\d{1,2})?)\s?£|(\d+(?:\.\d{1,2})?)\s?(?:pounds|gbp)/i
  );
  return match ? parseFloat(match[1] || match[2] || match[3]) : null;
}

function extractName(text) {
  // grab up to 3 words after "for", strip stopwords out of that chunk
 const match = text.match(/for\s+((?:[a-z]+\s*){1,4})/i);
  if (!match) return null;

  const candidateWords = match[1].trim().split(/\s+/);

  const nameWords = [];
  for (const word of candidateWords) {
    const lower = word.toLowerCase();
    if (STOPWORDS.includes(lower) || JOB_KEYWORDS.includes(lower)) break;
    nameWords.push(word);
  }

  if (!nameWords.length) return null;

  return nameWords
    .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function extractJob(text) {
  const lower = text.toLowerCase();
  const found = JOB_KEYWORDS.find(keyword => lower.includes(keyword));
  if (!found) return null;

  let phraseMatch = text.match(
    new RegExp(`(${found}[^.,£]*?job[^.,£]*)`, "i")
  );

  let phrase = phraseMatch ? phraseMatch[1].trim() : `${found} work`;

  // strip trailing "amount / total / price / £..." if it got swallowed in
  phrase = phrase.replace(/\s*(amount|total|price)\b.*$/i, "").trim();

  return phrase || `${found} work`;
}

export function parseQuotePhrase(text) {
  return {
    customerName: extractName(text),
    description: extractJob(text),
    price: extractPrice(text),
    address: extractAddress(text)
  };
}