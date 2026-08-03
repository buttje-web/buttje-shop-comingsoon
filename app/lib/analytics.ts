// Plausible Custom Events. No-op, wenn das Script nicht geladen ist
// (Dev-Modus, Adblocker) - Aufrufer muessen nichts pruefen.
//
// Der Aufruf liegt in try/catch, und das ist kein Schmuck: trackEvent wird
// aus Klick-Handlern heraus aufgerufen. Wirft window.plausible, bricht der
// gesamte Handler ab - der Knopf reagiert dann sichtbar gar nicht mehr.
// Analytics darf einen Kauf nie blockieren, unter keinen Umstaenden.

type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: EventProps }) => void;
  }
}

export function trackEvent(event: string, props?: EventProps): void {
  if (typeof window === "undefined") return;
  const plausible = window.plausible;
  if (typeof plausible !== "function") return;
  try {
    plausible(event, props ? { props } : undefined);
  } catch {
    // Absichtlich geschluckt. Ein fehlgeschlagenes Zaehlen ist ein
    // Datenverlust, ein abgebrochener Klick-Handler ein Umsatzverlust.
  }
}
