import type { Metadata } from "next";
import LegalArticle from "../components/LegalArticle";

export const metadata: Metadata = { title: "Widerruf" };

export default function WiderrufPage() {
  return (
    <LegalArticle eyebrow="Rechtliches" title="Hinweis zum Widerrufsrecht">
      <p>
        buttje e.U. verkauft ausschließlich an Unternehmer, juristische Personen
        des öffentlichen Rechts und Vereine. Ein gesetzliches Widerrufsrecht, wie
        es Verbrauchern im Fernabsatz zusteht, besteht im unternehmerischen
        Geschäftsverkehr nicht.
      </p>
      <p>
        Eine freiwillige Rücknahme einwandfreier Ware ist nur nach vorheriger
        Absprache und auf Kulanzbasis möglich; die Rücksendekosten trägt in diesem
        Fall der Kunde. Mangelhafte Ware wird im Rahmen der gesetzlichen
        Gewährleistung bearbeitet (siehe AGB Punkt 7).
      </p>
    </LegalArticle>
  );
}
