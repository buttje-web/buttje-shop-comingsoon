// Plausible Custom Events. No-op, wenn das Script nicht geladen ist
// (Dev-Modus, Adblocker) - Aufrufer muessen nichts pruefen.

type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: EventProps }) => void;
  }
}

export function trackEvent(event: string, props?: EventProps): void {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;
  window.plausible(event, props ? { props } : undefined);
}
