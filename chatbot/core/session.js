

const STORAGE_KEY = "everodai_session";
const hasStorage = typeof sessionStorage !== "undefined";

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
    const saved = hasStorage ? sessionStorage.getItem(STORAGE_KEY) : null;
    return saved ? { ...defaultSession, ...JSON.parse(saved) } : { ...defaultSession };
  } catch (err) {
    return { ...defaultSession };
  }
}

export const session = loadInitialState();

export function saveSession() {
  if (!hasStorage) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn("Could not save session:", err);
  }
}


export function resetSession() {
  for (const k of Object.keys(session)) delete session[k];
  Object.assign(session, structuredClone(defaultSession));
  saveSession();
}

export function resetFlows(){
  session.activeFlow = null;
  session.invoiceStep = 0;  session.invoiceData = {};
  session.paintStep = 0;    session.paintData = {};
  session.attempts = 0;   session.editField = null;
   session.pendingTriage = null;
  session.pending = null;
  session.lastTopic = null;    
   
}