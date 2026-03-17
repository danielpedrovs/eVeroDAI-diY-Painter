export const DEFAULT_RATE_PER_M2 = 12;

export function estimateLabourCost(area, ratePerM2 = DEFAULT_RATE_PER_M2){
  const total = area * ratePerM2;
  return Number(total.toFixed(2));
}

export function formatMoney(amount, currency = "GBP", locale = "en-GB"){
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
