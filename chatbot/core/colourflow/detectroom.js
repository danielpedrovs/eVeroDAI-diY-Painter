export function detectRoom(input) {
  input = input.toLowerCase();

  if (input.includes("living")) return "living_room";

  if (input.includes("kitchen")) return "kitchen";

  if (input.includes("bathroom") || input.includes("bath")) return "bathroom";

  if (
    input.includes("kid") ||
    input.includes("child") ||
    input.includes("children")
  ) {
    return "bedroom_kids";
  }

  if (input.includes("bedroom")) return "bedroom";

  if (input.includes("tenancy")) return "end_of_tenancy";

  return null; // 👈 VERY IMPORTANT (no match)
}