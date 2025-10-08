// src/lib/analytics.ts
type EventName =
  | "cta_click"
  | "nav_click"
  | "scroll_to_product"
  | "feedback_requested"
  | "feedback_returned"
  | "download_pdf"
  | "download_txt";

export function track(event: EventName, props: Record<string, unknown> = {}) {
  // Stub: swap with PostHog/Amplitude later.
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, props);
  }
}
