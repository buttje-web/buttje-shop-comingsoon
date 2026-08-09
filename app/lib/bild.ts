/*
  Bildadressen der Warenwirtschaft auf die gebrauchte Groesse bringen.

  AUSGANGSLAGE: Die Herstellerfotos liegen als 2048x2048-PNG mit rund
  4,7 MB je Datei. Ausgeliefert wurden sie bisher unveraendert - auch fuer
  eine Kachel, die 255 Bildpunkte breit ist, und fuer das 64 Punkte grosse
  Vorschaubild im Sackerl.

  WAS DER BILDDIENST KANN, gemessen an einer echten Datei:
    ohne Parameter                        4.845 KB  PNG
    ?width=400                              147 KB  PNG
    ?width=400 mit Accept: image/webp        10 KB  WebP

  ZUM FORMAT, WEIL ES LEICHT FALSCH VERSTANDEN WIRD: Ein Parameter
  "format=webp" bewirkt nichts. Gemessen liefert die Adresse mit und ohne
  ihn dasselbe PNG. WebP entsteht ueber die Aushandlung: Der Dienst sieht
  den Accept-Kopf des Browsers und schickt WebP, wenn der Browser es
  nennt. Jeder aktuelle Browser tut das. Deshalb setzt dieser Helfer nur
  die BREITE - das Format kommt von allein, und wir schreiben keinen
  Parameter in die Adresse, der nachweislich folgenlos ist.

  Der Gewinn steckt damit fast vollstaendig in width.
*/

/** Eine Bildadresse mit fester Zielbreite. */
export function bildBreite(url: string, breite: number): string {
  // Die Adressen tragen bereits "?v=..." (Fassungsnummer). Die muss
  // erhalten bleiben, sonst zeigt der Zwischenspeicher alte Staende.
  const trenner = url.includes("?") ? "&" : "?";
  return `${url}${trenner}width=${Math.round(breite)}`;
}

/** srcSet aus mehreren Breiten, in der "w"-Schreibweise. */
export function bildSrcSet(url: string, breiten: number[]): string {
  return breiten.map((b) => `${bildBreite(url, b)} ${b}w`).join(", ");
}

/*
  Stufen fuer die Produktkacheln.

  Gemessene Darstellungsbreiten des Kachelbilds:
    Fenster 1440 -> 255 px      (vier Spalten)
    Fenster 1280 -> 241 px      (vier Spalten)
    Fenster 1024 -> 259 px      (drei Spalten)
    Fenster  768 -> 182 px      (drei Spalten)
    Fenster  390 -> 307 px      (eine Spalte)
  Der groesste Fall ist knapp unter 480 mit rund 390 px, also 780 auf
  einem Netzhautbildschirm. Darueber hinaus braucht die Kachel nichts,
  deshalb endet die Leiter bei 800.
*/
export const KACHEL_STUFEN = [160, 240, 320, 480, 640, 800];

/*
  sizes fuer das Raster der Uebersicht
  (1 Spalte / ab 480 zwei / ab 768 drei / ab 1280 vier).

  Die Werte liegen bewusst eine Spur ueber der gemessenen Breite: zu
  klein geschaetzt holt der Browser ein unscharfes Bild, zu gross nur
  eine Stufe zuviel.
*/
export const KACHEL_SIZES =
  "(min-width: 1320px) 260px, (min-width: 1280px) 20vw, (min-width: 768px) 30vw, (min-width: 480px) 42vw, 80vw";

/*
  Produktseite: zwei Spalten ab 768, darunter volle Breite.
  Bei 1440 ist die Bildspalte 564 px breit, also 1128 auf einem
  Netzhautbildschirm - daher die Leiter bis 1200.
*/
export const DETAIL_STUFEN = [320, 480, 640, 900, 1200];
export const DETAIL_SIZES =
  "(min-width: 1320px) 570px, (min-width: 768px) 46vw, 92vw";

/*
  Vorschaubild im Sackerl: 64 x 64 Punkte, also 128 auf einem
  Netzhautbildschirm. Eine einzige Stufe genuegt, ein srcSet waere hier
  Aufwand ohne Ertrag.
*/
export const SACKERL_BREITE = 128;
