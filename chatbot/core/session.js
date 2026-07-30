const STORAGE_KEY = "everodai_session";

const defaultSession = {
  lastIntent: null,
  dimensions: null,
  includeCeiling: null,
  activeFlow: null,
  invoiceStep: 0,
  invoiceData: {},
  lastTopic: null,
  quoteStep: 0,
  quoteData: {},
  contactStep: 0,
  contactData: {},
};

function loadInitialState() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultSession, ...JSON.parse(saved) } : { ...defaultSession };
  } catch (err) {
    console.warn("Could not load saved session:", err);
    return { ...defaultSession };
  }
}

export const session = loadInitialState();

export function saveSession() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn("Could not save session:", err);
  }
}