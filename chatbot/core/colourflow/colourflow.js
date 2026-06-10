import { session } from "../session.js";
import { detectPreferences } from "./detectpreferences.js";
import { generateSuggestion } from "./suggestionEngine.js";

let userPreferences = {
  room: null,
  style: null,
  mood: null
};

export function handleColourFlow(input) {
  input = input.toLowerCase();

  // update preferences
  userPreferences = detectPreferences(input, userPreferences);

  // STEP 1 → ROOM
  if (!userPreferences.room) {
    return "Which room are you painting?";
  }

  // STEP 2 → STYLE
  if (!userPreferences.style) {
    return "Do you prefer modern or classic style?";
  }

  // STEP 3 → MOOD
  if (!userPreferences.mood) {
    return "Do you want bright or neutral colours?";
  }

  // FINAL
  const result = generateSuggestion(userPreferences);

  resetPreferences();
  session.activeFlow = null;

  return result;
}

function resetPreferences() {
  userPreferences = {
    room: null,
    style: null,
    mood: null
  };
}