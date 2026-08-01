import {
  inhaltFuer,
  boxZeilen,
  SDB_DOWNLOADS_AKTIV,
  SDB_VERFUEGBAR,
} from "../produktdaten";

/*
  Gegliederter Produktinhalt unterhalb des Kaufbereichs:
    Aufmacher · Anwendung · Dosierung · Gut zu wissen · Zertifikate
    · Produktdaten-Box · Datenblätter (vorerst ausgeblendet)

  Bewusst OHNE Fuelltext-Abschnitte wie "Beschreibung" oder "Zusammenfassung".
  Jeder Abschnitt erscheint nur, wenn er Inhalt hat. Produkte ohne Eintrag in
  app/produktdaten.ts rendern gar nichts von hier — die Seite bleibt dann wie
  bisher bei Headline, Bild und Kaufbereich.
*/

function Abschnitt({ titel, text }: { titel: string; text?: string }) {
  if (!text) return null;
  return (
    <section className="border-t border-line pt-6">
      <h2 className="eyebrow mb-2">{titel}</h2>
      <p className="max-w-[62ch] text-[0.95rem] leading-relaxed text-text-soft">
        {text}
      </p>
    </section>
  );
}

/*
  Eine Box-Zeile als zwei Grid-Zellen.

  FRUEHER stand hier eine feste Label-Breite (w-[13ch]). Lange Labels wie
  "FASSUNGSVERMOEGEN" liefen darueber hinaus und ueberlagerten den Wert.
  Jetzt bestimmt die Grid-Spalte max-content ihre Breite selbst — sie ist
  immer so breit wie das laengste Label der jeweiligen Box, nie schmaler.
  Unter 420 px klappt das Grid auf eine Spalte um, Label ueber Wert.
*/
function Datenzeile({ feld, wert }: { feld: string; wert?: string | null }) {
  if (!wert) return null;
  return (
    <>
      <dt className="border-b border-line py-2 pr-4 text-[0.72rem] font-semibold uppercase leading-[1.6] tracking-[0.14em] text-muted max-[419px]:border-b-0 max-[419px]:pb-0">
        {feld}
      </dt>
      <dd className="border-b border-line py-2 text-[0.92rem] leading-[1.35] text-text-soft max-[419px]:pt-0">
        {wert}
      </dd>
    </>
  );
}

export default function ProduktInfo({
  sku,
  hersteller,
  ean,
  ve,
}: {
  sku: string;
  hersteller?: string | null;
  ean?: string | null;
  ve?: string | null;
}) {
  const inhalt = inhaltFuer(sku);
  if (!inhalt) return null;

  const zeilen = boxZeilen(sku, { hersteller, ean, ve });
  const hatDaten = zeilen.length > 0;
  const zeigeDownloads = SDB_DOWNLOADS_AKTIV && SDB_VERFUEGBAR.has(sku);

  return (
    <div className="mt-12 flex flex-col gap-8">
      {/* Aufmacher — traegt keine Zwischenueberschrift, er fuehrt in den Text */}
      <p className="max-w-[62ch] text-[1.05rem] leading-relaxed text-text">
        {inhalt.aufmacher}
      </p>

      <Abschnitt titel="Anwendung" text={inhalt.anwendung} />
      <Abschnitt titel="Dosierung" text={inhalt.dosierung} />
      <Abschnitt titel="Gut zu wissen" text={inhalt.gutZuWissen} />
      <Abschnitt titel="Zertifikate" text={inhalt.zertifikate} />

      {hatDaten && (
        <section className="border-t border-line pt-6">
          <h2 className="eyebrow mb-3">Produktdaten</h2>
          <dl className="grid max-w-[52ch] grid-cols-1 border border-line px-4 py-1 [&>*:nth-last-child(-n+2)]:border-b-0 min-[420px]:grid-cols-[max-content_1fr]">
            {zeilen.map(([feld, wert]) => (
              <Datenzeile key={feld} feld={feld} wert={wert} />
            ))}
          </dl>
        </section>
      )}

      {/* Datenblaetter und Downloads.
          GEBAUT, ABER AUS: Die SDB-PDFs liegen ausserhalb von public/ und sind
          ueber keine URL erreichbar. Erst nach Ramis Freigabe scharfschalten —
          siehe Kommentar an SDB_DOWNLOADS_AKTIV in app/produktdaten.ts. */}
      {zeigeDownloads && (
        <section className="border-t border-line pt-6">
          <h2 className="eyebrow mb-3">Datenblätter und Downloads</h2>
          <a
            href={`/datenblaetter/${sku}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-line-strong px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
          >
            Sicherheitsdatenblatt (PDF)
          </a>
        </section>
      )}
    </div>
  );
}
