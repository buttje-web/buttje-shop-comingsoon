import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import JsonLd from "./components/JsonLd";
import { ORG, SITE_URL } from "./lib/seo";

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORG.name,
  legalName: ORG.legalName,
  url: ORG.url,
  email: ORG.email,
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
    default: "buttje Shop — Verbrauchsgüter & Hygienebedarf für Gewerbe",
    template: "%s | buttje Shop",
  },
  description:
    "buttje Shop, Wien. Verbrauchsgüter und Hygienebedarf für Gewerbe: Müllsäcke, Papier, Seifen, Handschuhe, Chemie und Zubehör. Nettopreise, Lieferung DE und AT.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-base text-text">
        <JsonLd data={organizationLd} />
        {/* Privacy-friendly analytics by Plausible (offizielles Snippet,
            individuelle Script-URL + Init-Logik unveraendert). Nur in
            Production, damit localhost-Tests die Statistik nicht verfaelschen.
            Der Stub puffert Custom Events, bis das Script geladen ist. */}
        {process.env.NODE_ENV === "production" && (
          <>
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
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
