// src/ga4.js
export const GA_MEASUREMENT_ID = "G-SDERQ98ZFH";

function hasGtag() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

// Send a manual page_view (SPA-safe). Call on first load and on route changes.
export function gaPageView({
  path = window.location.pathname + window.location.search,
  title = document.title,
} = {}) {
  if (!hasGtag()) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
  });
}

// Generic event helper
export function gaEvent(name, params = {}) {
  if (!hasGtag()) return;
  window.gtag("event", name, params);
}

// Optional: quick "app ready" ping to confirm tag is live
export function gaReady() {
  gaEvent("app_ready", { app: "sensuality_quiz" });
}
