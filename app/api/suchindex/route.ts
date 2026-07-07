import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/shopify";

// Kompakter Produktindex fuer die client-seitige Suche.
// Die eigentliche Suche laeuft im Browser — hierher kommt nur der Index,
// nie ein Suchbegriff. Kein Logging.

export async function GET() {
  try {
    const produkte = await getSearchIndex();
    return NextResponse.json(
      { produkte },
      {
        headers: {
          // CDN darf 5 Minuten cachen — Produktdaten aendern sich selten.
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      },
    );
  } catch {
    return NextResponse.json({ produkte: [] }, { status: 502 });
  }
}
