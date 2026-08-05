/*
  Sichtbare KI-Kennzeichnung, als HTML-Element AUF dem Bild.

  ANLASS: Artikel 50 der EU-KI-Verordnung, anwendbar seit 02.08.2026.
  Fotorealistische KI-Inhalte muessen sichtbar gekennzeichnet sein. Ein
  Hinweis allein im Alt-Text genuegt nicht, weil sehende Nutzer ihn nicht
  wahrnehmen. Die Leitlinien der Kommission lassen neben der Einbettung in
  die Datei ausdruecklich eine gleichwertige Loesung ueber die
  Benutzeroberflaeche zu - das ist dieses Element.

  WARUM NICHT INS BILD GEBRANNT: Ein eingebranntes Label skaliert mit dem
  Bild. Auf der Kachel wird ein Motiv von 1344 px Breite in einem Kasten
  von 294 px gezeigt, das ist Faktor 0,22 - fuer 12 lesbare Pixel braeuchte
  es 55 px in der Datei, also 24 Prozent der Bildbreite. Als HTML-Element
  ist die Groesse fest, unabhaengig von jeder Bildskalierung, und dieselben
  12 px gelten in allen Breiten.

  BARRIEREFREIHEIT: echter Text, kein Bild, kein aria-hidden. Der
  Bildschirmleser liest ihn, und beim Vergroessern der Seite waechst er mit.

  KONTRAST: Der Kasten entkoppelt den Kontrast vom Bildinhalt.
  55 Prozent Deckung reichen ueber jedem der acht Standbilder - gemessen,
  nicht geschaetzt, siehe scripts/ki-label-kontrast.py.
  Im FILM reichen sie nicht: der Schnitt blendet auf Weiss, und ueber
  Reinweiss kommt der Kasten mit 55 Prozent nur auf 3,87:1. Gemessen ueber
  alle 192 gezogenen Bilder faellt er in 42 davon unter 4,5:1. Dort steht
  deshalb stark=true, also 65 Prozent; das haelt selbst gegen Reinweiss
  noch 5,51:1. Siehe scripts/film-label-kontrast.py.
*/
export default function KiLabel({
  className = "",
  lage = "unten",
  stark = false,
}: {
  className?: string;
  /** Ecke im Bildbereich. "oben" braucht der Film, sobald die
      Bedienleiste unten steht. */
  lage?: "unten" | "oben";
  /** Dichterer Kasten fuer bewegte Bilder, siehe Kopf dieser Datei. */
  stark?: boolean;
}) {
  // Position und Deckung stehen bewusst HIER und nicht im uebergebenen
  // className: zwei Utilities derselben Eigenschaft haben dieselbe
  // Spezifitaet, welche gewinnt entscheidet dann die Reihenfolge im
  // erzeugten Stylesheet und nicht die im Attribut. Fuer die
  // Breakpoint-Variante des Heros gilt das nicht, Varianten sortiert
  // Tailwind immer hinter die Grundklassen - die darf ueber className
  // kommen.
  const ort = lage === "oben" ? "top-2 right-2" : "bottom-2 right-2";
  const grund = stark ? "bg-[rgba(14,14,18,0.65)]" : "bg-[rgba(14,14,18,0.55)]";
  return (
    <span
      className={
        // 8 px Abstand zur Bildkante. Der Kasten sitzt damit innerhalb des
        // Bildbereichs, nicht darunter und nicht neben dem Titel - die
        // Zuordnung zum Motiv ist eindeutig.
        // Eckig wie alles im Shop, es gibt hier nirgends einen Radius.
        `absolute ${ort} ${grund} px-[6px] py-[3px] ` +
        "text-[12px] font-medium leading-none tracking-[0.01em] text-text " +
        className
      }
    >
      KI-generiert
    </span>
  );
}
