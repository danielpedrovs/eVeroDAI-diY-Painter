export function buildBrandResponse(list, category) {

  const intros = {
    premium: "If you're looking for top quality, I’d recommend:",
    mid: "Good reliable options are:",
    budget: "If you want something more affordable, try:"
  };

  const intro = intros[category] || "Here are some options:";

  const lines = list.map(
    b => `• ${b.name} – ${b.features.join(", ")}`
  );

  return `${intro}

${lines.join("\n")}

👉 I can also suggest the best option based on your room.`;
}