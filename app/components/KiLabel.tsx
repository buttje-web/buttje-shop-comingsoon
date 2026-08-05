/*
  Sichtbare KI-Kennzeichnung, als HTML-Element AUF dem Bild.

  ANLASS: Artikel 50 der EU-KI-Verordnung, anwendbar seit 02.08.2026.
  Fotorealistische KI-Bilder muessen sichtbar gekennzeichnet sein. Ein
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

  KONTRAST: Der Kasten mit 55 Prozent Deckung entkoppelt den Kontrast vom
  Bildinhalt. Selbst ueber der hellsten Stelle, die in einem der sieben
  Motive unter dem Label liegt, bleibt das Verhaeltnis ueber 4,5:1 -
  gemessen, nicht geschaetzt, siehe scripts/ki-label-kontrast.py.
*/
export default function KiLabel({ className = "" }: { className?: string }) {
  return (
    <span
      className={
        // bottom-2 right-2: 8 px Abstand zur Bildkante. Der Kasten sitzt
        // damit innerhalb des Bildbereichs, nicht darunter und nicht neben
        // dem Titel - die Zuordnung zum Motiv ist eindeutig.
        // Eckig wie alles im Shop, es gibt hier nirgends einen Radius.
        "absolute bottom-2 right-2 bg-[rgba(14,14,18,0.55)] px-[6px] py-[3px] " +
        "text-[12px] font-medium leading-none tracking-[0.01em] text-text " +
        className
      }
    >
      KI-generiert
    </span>
  );
}
