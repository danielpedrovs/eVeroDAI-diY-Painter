import { session } from "../core/session.js";
import { sendLeadEmail } from "../core/emailService.js";
// import your lead-saving function here, e.g. Supabase insert

const phoneRegex = /(\+?44|0)\s?\d{9,10}/;

export function handleContactFlow(message) {
  if (session.contactStep === 1) {
    const match = message.match(phoneRegex);

    if (!match) {
      return "That doesn't look like a valid UK number — mind trying again?";
    }

    session.contactData.phone = match[0];
    session.contactStep = 2;

    return "Great — and what's your name, so we know who to ask for?";
  }

   if (session.contactStep === 2) {
    session.contactData.name = message.trim();
  sendLeadEmail(session.contactData);   // ← fires the email to you


    session.activeFlow = null;
    session.contactStep = 0;
    session.contactData = {};
     

    return "Thanks! Someone from EveroDecor will call you shortly 📞. If no contact is made, please get back in touch.";
  }

  // fallback safety — shouldn't normally hit this
  session.activeFlow = null;
  return "Let's start over — what's the best number to reach you on?";
}