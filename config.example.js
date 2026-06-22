/* =====================================================================
   LogiSync — CLIENT CONFIG TEMPLATE
   ---------------------------------------------------------------------
   Copy this file to `config.js` and fill in the values for the client.
   `config.js` is listed in .gitignore so per-client secrets/branding are
   not accidentally committed.

       cp config.example.js config.js   # then edit config.js

   NOTE: the Supabase `key` below is the *publishable* (anon) key, which is
   safe to ship to the browser ONLY when Row Level Security is correctly
   configured. See SECURITY_NOTES.md — the current project allows public
   reads, which you should fix before any real deployment.
   ===================================================================== */
window.CLIENT_CONFIG = {

  brandName:   "LogiSync",
  tagline:     "Operations Authentication",
  logoFile:    "logo.svg",   // animated 3D mark; logo.png is the static favicon/PWA icon
  reportTitle: "LogiSync Weekly Report",
  exportPrefix:"LogiSync",

  accentColor: "#0d9488",
  accentLight: "#14b8a6",

  // QA pass-rate target (%) — used to colour the monthly report green/red
  qaTarget: 90,

  supabase: {
    url: "https://YOUR-PROJECT-ref.supabase.co",
    key: "YOUR_SUPABASE_PUBLISHABLE_KEY"
  },

  agents: [
    "Agent One", "Agent Two", "Agent Three"
  ],

  categories: [
    "Coaching", "Escalations", "Meetings", "Appointments",
    "Training", "Validation", "Daily", "Floor Support"
  ],

  categoryColors: [
    "#38bdf8", "#f43f5e", "#8b5cf6", "#f59e0b",
    "#14b8a6", "#ec4899", "#6366f1", "#84cc16"
  ],

  priorities: ["Normal", "High", "CRITICAL"],

  labels: {
    telemetry:     "Shift Telemetry",
    priorityFocus: "Priority Focus",
    threats:       "Threats",
    liveFeed:      "Live Operations Feed",
    newInput:      "New Priority Input"
  },

  /* ---- Coaching tab dropdowns ---- */
  coaching: {
    issueTags: ["#SystemFocus", "#Fatal", "#Feedback", "#Sticking", "#Incomplete Survey"],
    teams: ["Agent One", "Agent Two", "Agent Three"],
    notes: [
      "Final Documentation", "Feedback Session", "Fatal Documentation", "1st Documentation",
      "Verbal", "1st Warning", "2nd Warning", "3rd Warning", "No Action", "Action Plan",
      "Termination", "Hold", "System Tampering"
    ],
    statuses: ["Yes", "No", "Not Fail", "Disregarded", "Left", "need follow up"]
  }
};
