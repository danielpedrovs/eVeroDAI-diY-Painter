// invoiceExtractor.js

function parseAmount(text) {
  
  // 1. Strongest signal: explicit amount/value/price/cost wording
  const explicitMatch = text.match(
    /\b(?:value|amount|price|cost)\s*(?:of|is|:)?\s*£?\s*(\d+(?:[.,]\d{1,2})?)\b/i
  );

  if (explicitMatch) {
    const value = parseFloat(explicitMatch[1].replace(",", "."));

    if (Number.isFinite(value) && value > 0) {
      return value.toFixed(2);
    }
  }

  // 2. Explicit £ amount
  const poundMatch = text.match(
    /£\s*(\d+(?:[.,]\d{1,2})?)\b/i
  );

  if (poundMatch) {
    const value = parseFloat(poundMatch[1].replace(",", "."));

    if (Number.isFinite(value) && value > 0) {
      return value.toFixed(2);
    }
  }

  // 3. Do not interpret dates as invoice amounts
  if (/\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/.test(text)) {
    return null;
  }

  // 4. No safe amount found
  return null;
}


function formatName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}


function formatPostcode(address) {
  return address.replace(
    /\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/i,
    (_, postcode) => postcode
      .toUpperCase()
      .replace(/\s+/g, "")
      .replace(/(.+)(\d[A-Z]{2})$/, "$1 $2")
  );
}


function extractCustomerName(text) {
  const match = text.match(
    /\b(?:invoice\s+for|for)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+){0,2})(?=\s*[,.]?\s*(?:he|she)\b|\s+lives?\b|\s+at\b|[,.]|$)/i
  );

  if (!match) return null;

  return formatName(match[1]);
}

function extractAddress(text) {

  // 1. "lives at", "address is", "located at"
  let match = text.match(
    /\b(?:lives?\s+at|address(?:\s+is)?|located\s+at)\s+(.+?)(?=\s*(?:[,.]?\s*(?:for|the\s+work|work\s+was|value|amount|price|cost|due\s+date)\b)|$)/i
  );

  // 2. "customer at / invoice for NAME at ADDRESS for..."
  if (!match) {
    match = text.match(
      /\b(?:invoice\s+for|for)\s+[a-zA-Z]+(?:\s+[a-zA-Z]+){0,2}\s+at\s+(.+?)(?=\s+(?:for|value|amount|price|cost|due\s+date)\b|[.,]|$)/i
    );
  }

  if (!match) return null;

  let address = match[1]
    .trim()
    .replace(/[.,]+$/, "");

  return formatPostcode(address);
}

function extractDescription(text) {
   const match = text.match(
    /\b(?:for|from)\s+(?:a\s+)?([a-zA-Z][a-zA-Z\s-]*?)\s+(?:work|job)\b/i
  );

  if (!match) return null;

  return `${match[1].trim()} work`;
}


export function extractInvoiceDetails(message) {

  const result = {
    customerName: extractCustomerName(message),
    customerAddress: extractAddress(message),
    description: extractDescription(message),
    amount: parseAmount(message),
    dueDate: extractDueDate(message)
  };

  function extractDueDate(text) {
  const match = text.match(
    /\b(?:due\s*date|due|payment\s*due)\s*(?:is|:)?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})\b/i
  );

  return match ? match[1] : null;
}

  return result;
}