/* =====================================================================
   ACTIVE CLIENT CONFIG  (this file is git-ignored)
   Generated from config.example.js — edit freely per client.
   ===================================================================== */
window.CLIENT_CONFIG = {

  brandName:   "LogiSync",
  tagline:     "Operations Authentication",
  logoFile:    "logo.svg",
  reportTitle: "LogiSync Weekly Report",
  exportPrefix:"LogiSync",

  accentColor: "#0d9488",
  accentLight: "#14b8a6",

  // QA pass-rate target (%) — used to colour the monthly report green/red
  qaTarget: 90,

  supabase: {
    url: "https://hevabfnedijtajgcvlel.supabase.co",
    key: "sb_publishable_kaQgrm2L6yj8BrHxCw20rg_-feu_03S"
  },

  agents: [
    "David", "Khloe", "Nelson", "Edwin", "Calvin", "Jordan",
    "Ashton", "Olivia", "Cayden", "Alex", "Rodney"
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
    teams: ["David", "Khloe", "Nelson", "Edwin", "Calvin", "Jordan", "Ashton", "Olivia", "Cayden", "Alex", "Rodney"],
    notes: [
      "Final Documentation", "Feedback Session", "Fatal Documentation", "1st Documentation",
      "Verbal", "1st Warning", "2nd Warning", "3rd Warning", "No Action", "Action Plan",
      "Termination", "Hold", "System Tampering"
    ],
    statuses: ["Yes", "No", "Not Fail", "Disregarded", "Left", "need follow up"]
  }
};
