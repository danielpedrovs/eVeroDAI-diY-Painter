import { detectRoom } from "./detectroom.js";

export function detectPreferences(input, userPreferences) {
  input = input.toLowerCase();

  // ROOM
  if (!userPreferences.room) {
    const room = detectRoom(input);
    if (room) userPreferences.room = room;
  }

  // STYLE
  if (!userPreferences.style) {
    if (input.includes("modern") || input.includes("clean")) {
      userPreferences.style = "modern";
    }
    if (input.includes("classic") || input.includes("traditional")) {
      userPreferences.style = "classic";
    }
  }

  // MOOD
  if (!userPreferences.mood) {
    if (
      input.includes("neutral") ||
      input.includes("calm") ||
      input.includes("simple")
    ) {
      userPreferences.mood = "neutral";
    }

    if (
      input.includes("bright") ||
      input.includes("bold") ||
      input.includes("colourful")
    ) {
      userPreferences.mood = "bright";
    }
  }

  return userPreferences;
}