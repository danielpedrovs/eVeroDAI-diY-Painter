const SERVICE_ID  = "service_j3b2g7z";
const TEMPLATE_ID = "template_0oxez2w";
const PUBLIC_KEY  = "EF280Wc-PnadD_T0V";

let initialized = false;

function ensureInit() {
  if (!initialized && window.emailjs) {
    window.emailjs.init(PUBLIC_KEY);
    initialized = true;
  }
}

export function sendLeadEmail(contactData) {
  ensureInit();

  if (!window.emailjs) {
    console.error("EmailJS not loaded — check the <script> tag is on the page.");
    return;
  }

  return window.emailjs
    .send(SERVICE_ID, TEMPLATE_ID, {
      name: contactData.name || "Not provided",
      phone: contactData.phone || "Not provided",
      date: new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }),
    })
    .catch((err) => console.error("Failed to send lead email:", err));
}