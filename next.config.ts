import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /*
      CSS in den Kopf einbetten statt als eigene Datei zu verlinken.

      ANLASS: Lighthouse meldete die Stilvorlage als einzige
      renderblockierende Anfrage, geschaetzte 120 ms. Der Browser muss
      sonst das HTML laden, darin den Verweis finden, die Datei anfordern
      und auf sie warten, bevor er zeichnen darf.

      WARUM ES HIER PASST: Die Vorgabe von Next nennt genau diesen Fall -
      atomares CSS wie Tailwind, das klein bleibt. Unsere Datei hat 8,7 KB.
      Der Preis steht in derselben Vorgabe: Eingebettetes CSS laesst sich
      nicht getrennt zwischenspeichern, Wiederkehrer laden es je Seite neu.
      Bei 8,7 KB ist das vertretbar, der Gewinn beim ersten Besuch nicht.

      Gemessen wurde beides, siehe Bericht. CLS bleibt 0: Die Stile stehen
      vor dem Inhalt im Kopf, es gibt keinen Moment ohne Formatierung.
    */
    inlineCss: true,
  },
};

export default nextConfig;
