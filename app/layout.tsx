import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import JsonLd from "./components/JsonLd";
import { CartProvider } from "./components/CartContext";
import { ORG, SITE_URL, SITE_NAME } from "./lib/seo";
import { KAUFBAR } from "./lib/shop-mode";
import { loadCart } from "@/lib/cart/actions";

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORG.name,
  legalName: ORG.legalName,
  url: ORG.url,
  // Kein "email" hier: siehe Begruendung in app/lib/seo.ts.
  telephone: ORG.telephone,
  vatID: ORG.vatID,
  address: {
    "@type": "PostalAddress",
    streetAddress: ORG.address.streetAddress,
    postalCode: ORG.address.postalCode,
    addressLocality: ORG.address.addressLocality,
    addressCountry: ORG.address.addressCountry,
  },
  areaServed: ORG.areaServed,
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "buttje Shop - Verbrauchsgüter & Hygienebedarf für Gewerbe",
    template: "%s | buttje Shop",
  },
  description:
    "buttje Shop, Wien. Verbrauchsgüter und Hygienebedarf für Gewerbe: Müllsäcke, Papier, Seifen, Handschuhe, Chemie und Zubehör. Nettopreise, Lieferung innerhalb Österreichs.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  /*
    Vorschaubild fuer geteilte Links, hier als Standard fuer ALLE Seiten.
    Seiten mit eigenem openGraph-Block erben es, solange sie kein eigenes
    Bild setzen - keine tut das.

    metadataBase oben macht daraus eine vollstaendige Adresse mit
    https://shop.buttje.at davor. Ein relativer Pfad genuegt hier nicht:
    Die Vorschau-Dienste holen das Bild ohne Kenntnis unserer Seite.

    Die KI-Kennzeichnung ist in die Datei GEBRANNT. Bei einem geteilten
    Link gibt es kein HTML, in dem ein Label stehen koennte - siehe
    scripts/og-bild.py und den Kopf von app/components/KiLabel.tsx.
  */
  openGraph: {
    type: "website",
    locale: "de_AT",
    siteName: SITE_NAME,
    url: "/",
    title: "buttje Shop - Verbrauchsgüter & Hygienebedarf für Gewerbe",
    description:
      "Verbrauchsgüter und Hygienebedarf für Gewerbe in Wien: Müllsäcke, Papier, Seifen, Handschuhe, Chemie und Zubehör. Nettopreise, Lieferung innerhalb Österreichs.",
    images: [
      {
        url: "/og/og-standard.jpg",
        width: 1200,
        height: 630,
        alt: "buttje Shop, Wien: Kartons, Kanister, Müllsäcke und Zubehör (KI-generiert)",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/*
          Verbindung zur Bild-Herkunft vorbereiten.

          Die Produktfotos liegen auf einer anderen Herkunft als die Seite.
          Ohne diesen Hinweis beginnen Namensaufloesung, Verbindungsaufbau
          und Verschluesselung erst, wenn der Browser das erste Bild
          anfordert. Das groesste sichtbare Bild - der Massstab fuer die
          Ladezeit - haengt genau daran.

          crossOrigin ist noetig, weil Bilder anonym geladen werden; ohne
          das Attribut baut der Browser die Verbindung ein zweites Mal auf.
        */}
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-base text-text">
        <JsonLd data={organizationLd} />
        {/* Privacy-friendly analytics by Plausible (offizielles Snippet,
            individuelle Script-URL + Init-Logik unveraendert). Nur in
            Production, damit localhost-Tests die Statistik nicht verfaelschen.
            Der Stub puffert Custom Events, bis das Script geladen ist. */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Eigene Zugriffe ausschliessen.

                Das Plausible-Script PRUEFT localStorage.plausible_ignore
                bereits von sich aus und sendet dann nichts. Was ihm fehlt:
                Es SETZT den Marker nirgends - im Script kommen weder
                location.search noch setItem vor. Der Aufruf mit
                ?plausible_ignore=true blieb deshalb wirkungslos.
                Diese Zeilen schliessen genau diese Luecke.

                beforeInteractive ist Pflicht, nicht Geschmack: Der Marker
                muss stehen, BEVOR der Tracker den ersten Seitenaufruf
                meldet - sonst zaehlt der erste Aufruf trotzdem.

                ?plausible_ignore=false raeumt den Marker wieder weg, sonst
                kaeme man ohne Entwicklerkonsole nicht mehr aus dem
                Ausschluss heraus. */}
            <Script id="plausible-ignore" strategy="beforeInteractive">
              {`try{var v=new URLSearchParams(location.search).get('plausible_ignore');
if(v==='true'){localStorage.plausible_ignore='true'}
else if(v==='false'){localStorage.removeItem('plausible_ignore')}}catch(e){}`}
            </Script>
            <Script
              async
              src="https://plausible.io/js/pa-3m0ddr1EURbtPlkQ6msfD.js"
              strategy="afterInteractive"
            />
            <Script id="plausible-init" strategy="afterInteractive">
              {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
  plausible.init()`}
            </Script>
          </>
        )}
        {/* Im Katalogmodus gibt es keinen Warenkorb - dann auch keinen
            CartProvider und keinen Cart-Abruf pro Seitenaufruf. */}
        {KAUFBAR ? (
          <CartProvider initialCount={(await loadCart())?.totalQuantity ?? 0}>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </CartProvider>
        ) : (
          <>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </>
        )}
      </body>
    </html>
  );
}
