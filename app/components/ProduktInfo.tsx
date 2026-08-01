import {
  inhaltFuer,
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

function Datenzeile({ feld, wert }: { feld: string; wert?: string | null }) {
  if (!wert) return null;
  return (
    <div className="flex flex-wrap gap-x-4 border-b border-line py-2 last:border-b-0">
      <dt className="w-[13ch] shrink-0 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted">
        {feld}
      </dt>
      <dd className="text-[0.92rem] text-text-soft">{wert}</dd>
    </div>
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

  const t = inhalt.technik ?? {};
  // Box nur zeigen, wenn wenigstens ein Feld belegt ist.
  const hatDaten = Boolean(
    hersteller || sku || ean || ve || t.inhalt || t.ph || t.gisbau || t.weitere?.length,
  );
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
          <dl className="max-w-[52ch] border border-line px-4 py-1">
            <Datenzeile feld="Hersteller" wert={hersteller} />
            <Datenzeile feld="Artikelnr." wert={sku} />
            <Datenzeile feld="EAN" wert={ean} />
            <Datenzeile feld="Einheit" wert={ve} />
            <Datenzeile feld="Inhalt" wert={t.inhalt} />
            <Datenzeile feld="pH-Wert" wert={t.ph} />
            <Datenzeile feld="GISBAU" wert={t.gisbau} />
            {/* Warengruppen-spezifische Zusatzzeilen, Reihenfolge wie gepflegt */}
            {(t.weitere ?? []).map(([feld, wert]) => (
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
