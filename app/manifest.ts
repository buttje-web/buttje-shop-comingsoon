import type { MetadataRoute } from "next";

// Web-App-Manifest (PWA-Grunddaten + Home-Screen-Icons).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "buttje Shop",
    short_name: "buttje",
    description:
      "B2B-Onlineshop für Verbrauchsgüter und Hygienebedarf. Verkauf ausschließlich an Gewerbe.",
    start_url: "/",
    display: "browser",
    background_color: "#0E0E12",
    theme_color: "#0E0E12",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
