import { knowledge } from "../../data/knowledge.js";

export function generateSuggestion(userPreferences) {
  const { room, style, mood } = userPreferences;

  const data = knowledge.colourSuggestions[room];

  if (!data) {
    return "🎨 Neutral tones like white or grey are always a safe choice.";
  }

  const colours = data[mood] || data.neutral;

  let styleNote = "";

  if (style === "modern") {
    styleNote = "This gives a clean and contemporary look.";
  }

  if (style === "classic") {
    styleNote = "This creates a timeless and elegant atmosphere.";
  }

  return `🎨 Suggested colours: ${colours.join(", ")}

🧱 Finish: ${data.finish}

💡 ${styleNote}`;
}