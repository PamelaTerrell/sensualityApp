// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { gaPageView, gaReady } from "./ga4"; // ⬅️ add this

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ---- GA4: fire ONE initial page_view + a ready ping (StrictMode-safe) ----
function sendInitialPVOnce() {
  try {
    if (!sessionStorage.getItem("ga_initial_pv_sent")) {
      gaPageView(); // manual SPA-safe page_view
      gaReady();    // optional "app_ready" event (shows in DebugView)
      sessionStorage.setItem("ga_initial_pv_sent", "1");
    }
  } catch (_) {
    // sessionStorage may be blocked; still try to send once
    gaPageView();
    gaReady();
  }
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(sendInitialPVOnce, 0);
} else {
  window.addEventListener("DOMContentLoaded", sendInitialPVOnce, { once: true });
}
// -------------------------------------------------------------------------

reportWebVitals();
