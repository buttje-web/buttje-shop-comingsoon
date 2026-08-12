// AUS DER QUELLDATEI GENERIERT - NICHT VON HAND BEARBEITEN.
// Quelle: buttje-faq-2026-08-08.md (Fassung vom 08.08.2026, Rami).
// Generator: (Sitzungs-Scratchpad) faq-generieren.mjs. Der Wortlaut ist
// zeichengenau uebernommen; echte Umlaute und scharfes s bleiben erhalten.
// Der Biozid-Pflichtsatz ist gesetzlich fixiert (Art. 72 Abs. 1 VO 528/2012)
// und als eigener Absatztyp markiert, damit die Seite ihn hervorhebt.

export type FaqAbsatz = { art: "text" | "biozid"; text: string };
export type FaqFrage = { frage: string; anker: string; absaetze: FaqAbsatz[] };
export type FaqTeil = {
  titel: string;
  anker: string;
  /** Kategorie fuer den Link unter jeder Fachantwort; null = keine passende. */
  kategorie: { slug: string; label: string } | null;
  fragen: FaqFrage[];
};

export const FAQ_TEILE: FaqTeil[] = [
  {
    "titel": "Bestellung, Versand und Zahlung",
    "anker": "bestellung-versand-und-zahlung",
    "kategorie": null,
    "fragen": [
      {
        "frage": "Wer kann bei buttje bestellen?",
        "anker": "wer-kann-bei-buttje-bestellen",
        "absaetze": [
          {
            "art": "text",
            "text": "buttje beliefert ausschließlich Gewerbetreibende, Vereine und öffentliche Einrichtungen in Österreich. Privatpersonen können nicht bestellen. Im Bestellvorgang bestätigen Sie, dass Sie als Unternehmer handeln, und geben Ihre Firma an."
          }
        ]
      },
      {
        "frage": "Warum verkauft buttje nicht an Privatpersonen?",
        "anker": "warum-verkauft-buttje-nicht-an-privatpersonen",
        "absaetze": [
          {
            "art": "text",
            "text": "Weil für Verbraucher andere Regeln gelten, insbesondere das vierzehntägige Widerrufsrecht und abweichende Vorgaben zur Preisangabe. Ein Shop, der beides gleichzeitig bedient, muss beide Regelwerke erfüllen. Wir haben uns für den klaren Weg entschieden."
          }
        ]
      },
      {
        "frage": "Sind die Preise netto oder brutto?",
        "anker": "sind-die-preise-netto-oder-brutto",
        "absaetze": [
          {
            "art": "text",
            "text": "Alle Preise auf shop.buttje.at sind Nettopreise ohne Umsatzsteuer. Der Bruttopreis steht bei jedem Artikel klein darunter. Die Umsatzsteuer von 20 Prozent wird im Bestellvorgang gesondert ausgewiesen."
          }
        ]
      },
      {
        "frage": "Wohin liefert buttje?",
        "anker": "wohin-liefert-buttje",
        "absaetze": [
          {
            "art": "text",
            "text": "Innerhalb Österreichs, in alle Bundesländer. Lieferungen nach Deutschland oder in andere Länder sind derzeit nicht möglich."
          }
        ]
      },
      {
        "frage": "Wie lange dauert die Lieferung?",
        "anker": "wie-lange-dauert-die-lieferung",
        "absaetze": [
          {
            "art": "text",
            "text": "Lagernde Ware erreicht Sie in der Regel innerhalb von drei bis sieben Werktagen ab Zahlungseingang. Nicht lagernde Ware beschaffen wir zuerst; die Beschaffung dauert in der Regel etwa eine Woche, danach kommen drei bis sieben Werktage bis zur Zustellung hinzu. Über den voraussichtlichen Liefertermin informieren wir Sie in diesem Fall gesondert. Alle Angaben sind unverbindliche Richtwerte."
          }
        ]
      },
      {
        "frage": "Was kostet der Versand?",
        "anker": "was-kostet-der-versand",
        "absaetze": [
          {
            "art": "text",
            "text": "Die Versandkosten richten sich nach dem Gewicht der Sendung. Ab einem bestimmten Bestellwert liefern wir versandkostenfrei. Die aktuellen Stufen und Schwellen stehen auf der Seite Versand und Zahlung und werden im Bestellvorgang vor dem Kauf angezeigt."
          }
        ]
      },
      {
        "frage": "Welche Zahlungsarten gibt es?",
        "anker": "welche-zahlungsarten-gibt-es",
        "absaetze": [
          {
            "art": "text",
            "text": "Karte, eps-Überweisung, Google Pay und Apple Pay. Kauf auf Rechnung bieten wir derzeit nicht an. Bei regelmäßigem Bedarf sprechen Sie uns an, dann finden wir eine Lösung."
          }
        ]
      },
      {
        "frage": "Bekomme ich eine Rechnung?",
        "anker": "bekomme-ich-eine-rechnung",
        "absaetze": [
          {
            "art": "text",
            "text": "Ja. Die Rechnung kommt automatisch per E-Mail, kurz nach der Bestellung. Sie enthält die gesetzlich vorgeschriebenen Angaben und Ihre UID-Nummer, sofern Sie diese im Bestellvorgang angegeben haben. Bei Lieferungen innerhalb Österreichs weisen wir die österreichische Umsatzsteuer aus."
          }
        ]
      },
      {
        "frage": "Kann ich meine Bestellungen später einsehen?",
        "anker": "kann-ich-meine-bestellungen-spaeter-einsehen",
        "absaetze": [
          {
            "art": "text",
            "text": "Ja. Über den Zugang zum Kundenkonto sehen Sie Ihre bisherigen Bestellungen und können eine frühere Bestellung mit einem Klick wiederholen. Sie brauchen dafür kein Passwort: Sie geben Ihre E-Mail-Adresse ein und erhalten einen Zahlencode zugeschickt. Das Konto entsteht automatisch mit Ihrer ersten Bestellung."
          }
        ]
      },
      {
        "frage": "Warum stehen manche Artikel auf Preis auf Anfrage?",
        "anker": "warum-stehen-manche-artikel-auf-preis-auf-anfrage",
        "absaetze": [
          {
            "art": "text",
            "text": "Weil wir für diese Artikel noch keinen belastbaren Preis nennen können. Wir nennen lieber keinen als einen falschen. Schreiben Sie uns, dann bekommen Sie ein Angebot."
          }
        ]
      },
      {
        "frage": "Liefert buttje auch Kartons und Paletten?",
        "anker": "liefert-buttje-auch-kartons-und-paletten",
        "absaetze": [
          {
            "art": "text",
            "text": "Karton- und Palettenmengen liefern wir auf Anfrage. Ab einer gewissen Menge sinken die Stückkosten deutlich, weil sich die Transportkosten auf mehr Ware verteilen. Wenn Sie regelmäßig dieselben Artikel beziehen, lohnt sich die Anfrage fast immer."
          }
        ]
      },
      {
        "frage": "Kann ich eine Bestellung ändern oder stornieren?",
        "anker": "kann-ich-eine-bestellung-aendern-oder-stornieren",
        "absaetze": [
          {
            "art": "text",
            "text": "Solange die Ware noch nicht versandt ist, meist ja. Melden Sie sich so früh wie möglich unter Angabe der Bestellnummer. Ist die Sendung bereits unterwegs, klären wir den Einzelfall mit Ihnen."
          }
        ]
      },
      {
        "frage": "Was ist bei Transportschäden zu tun?",
        "anker": "was-ist-bei-transportschaeden-zu-tun",
        "absaetze": [
          {
            "art": "text",
            "text": "Melden Sie den Schaden möglichst rasch nach Erhalt, mit Fotos der Ware und der Verpackung. Wir klären den Rest mit dem Versanddienstleister. Je früher die Meldung kommt, desto einfacher ist die Abwicklung. Die genauen Fristen und Pflichten stehen in unseren Allgemeinen Geschäftsbedingungen."
          }
        ]
      },
      {
        "frage": "Kann ich Ware zurückgeben?",
        "anker": "kann-ich-ware-zurueckgeben",
        "absaetze": [
          {
            "art": "text",
            "text": "Als Unternehmer haben Sie kein gesetzliches Widerrufsrecht, das gilt nur für Verbraucher. Bei Fehllieferungen, Transportschäden oder Mängeln melden Sie sich, das regeln wir."
          }
        ]
      },
      {
        "frage": "Wer steht als Absender auf dem Paket?",
        "anker": "wer-steht-als-absender-auf-dem-paket",
        "absaetze": [
          {
            "art": "text",
            "text": "Wir versenden über Logistikpartner. Auf Versandetikett und Lieferpapieren kann deshalb der Name des ausliefernden Lagers stehen und nicht buttje. An Ihrem Vertrag ändert das nichts: Ihr Vertragspartner ist buttje e.U., und Ihre Rechnung kommt von uns."
          }
        ]
      },
      {
        "frage": "Wo finde ich Sicherheitsdatenblätter?",
        "anker": "wo-finde-ich-sicherheitsdatenblaetter",
        "absaetze": [
          {
            "art": "text",
            "text": "Bei allen kennzeichnungspflichtigen Produkten liegt das Sicherheitsdatenblatt des Herstellers auf der jeweiligen Produktseite zum Herunterladen bereit. Fehlt eines, schreiben Sie uns, dann reichen wir es nach."
          }
        ]
      },
      {
        "frage": "Wofür verwenden Ihre Kunden die Ware?",
        "anker": "wofuer-verwenden-ihre-kunden-die-ware",
        "absaetze": [
          {
            "art": "text",
            "text": "Das fragen wir nicht."
          }
        ]
      }
    ]
  },
  {
    "titel": "Müllsäcke und Entsorgung",
    "anker": "muellsaecke-und-entsorgung",
    "kategorie": {
      "slug": "entsorgung",
      "label": "Entsorgung"
    },
    "fragen": [
      {
        "frage": "Was bedeutet Typ 60, Typ 70 und Typ 100 bei Müllsäcken?",
        "anker": "was-bedeutet-typ-60-typ-70-und-typ-100-bei-muellsaecken",
        "absaetze": [
          {
            "art": "text",
            "text": "Die Typenangabe ist eine Branchenkonvention ohne Norm. Sie beschreibt grob die Belastbarkeit: je höher die Zahl, desto reißfester der Sack. Sie ist aber weder genormt noch geschützt, und jeder Hersteller kann sie frei vergeben. Wichtig zu wissen: Die Typenzahl ist keine Angabe der Foliendicke. Der Hersteller DEISS weist ausdrücklich darauf hin, dass ein Sack vom Typ 60 üblicherweise zwischen 25 und 40 Mikrometer liegt und keinesfalls 60. Wer zwei Angebote vergleichen will, vergleicht deshalb Material, Foliendicke und Machart, nicht die Typenzahl."
          }
        ]
      },
      {
        "frage": "Was bedeutet die Angabe my bei Müllsäcken?",
        "anker": "was-bedeutet-die-angabe-my-bei-muellsaecken",
        "absaetze": [
          {
            "art": "text",
            "text": "my steht für Mikrometer, also ein Tausendstel Millimeter, und bezeichnet die Dicke der Folie. Die Angabe sagt etwas über die Materialmenge aus, aber nur begrenzt etwas über die Belastbarkeit. Moderne Folien erreichen bei geringerer Dicke höhere Reißfestigkeit als ältere, weil Rezeptur und Herstellverfahren mehr ausmachen als die reine Stärke. Dicke allein ist deshalb kein Qualitätsmerkmal, sondern nur eine von mehreren Kennzahlen."
          }
        ]
      },
      {
        "frage": "Was ist der Unterschied zwischen LDPE und HDPE bei Müllsäcken?",
        "anker": "was-ist-der-unterschied-zwischen-ldpe-und-hdpe-bei-muellsaecken",
        "absaetze": [
          {
            "art": "text",
            "text": "HDPE ist dünn, steif und raschelt hörbar. Es ist bei gleichem Volumen leichter und günstiger und eignet sich für leichte, trockene Abfälle wie Papier, Verpackungen und Büromüll. LDPE ist weich, dehnbar und deutlich elastischer. Es verträgt Feuchtigkeit, Gewicht und Kanten besser und ist die Wahl für schwere oder scharfkantige Abfälle. Für schwere, kantige Abfälle nimmt man LDPE, für den Papierkorb reicht HDPE."
          }
        ]
      },
      {
        "frage": "Welche Müllsackstärke brauche ich wofür?",
        "anker": "welche-muellsackstaerke-brauche-ich-wofuer",
        "absaetze": [
          {
            "art": "text",
            "text": "Entscheidend ist die Kombination aus Material, Foliendicke und Machart, nicht eine einzelne Zahl. Als Orientierung: Für leichte Büro- und Papierabfälle genügen dünne HDPE-Beutel. Für gemischten Gewerbeabfall aus Küche, Werkstatt oder Reinigung nimmt man LDPE im mittleren Bereich. Für schweren oder scharfkantigen Abfall wie Glas, Metallteile oder Abfälle aus der Bauendreinigung greift man zu den kräftigsten Ausführungen, die üblicherweise als Typ 100 oder Premium verkauft werden. Wer zu dünn kauft, spart einmal und wischt zweimal."
          }
        ]
      },
      {
        "frage": "Wie viele Müllsäcke sind in einer Rolle?",
        "anker": "wie-viele-muellsaecke-sind-in-einer-rolle",
        "absaetze": [
          {
            "art": "text",
            "text": "Das hängt von der Größe ab und steht bei jedem Artikel in der Produktdatenbox. Ein Beispiel aus unserem Sortiment: Der DEISS Universal Plus Müllbeutel mit 30 Litern kommt mit 50 Stück je Rolle. Bei größeren Säcken sind je nach Ausführung deutlich weniger Stück auf einer Rolle, weil das Material dicker ist und die Rolle sonst zu groß würde. Verlassen Sie sich beim Preisvergleich nie auf den Rollenpreis, sondern rechnen Sie auf den Stückpreis um."
          }
        ]
      },
      {
        "frage": "Welche Müllsackgröße passt in welchen Behälter?",
        "anker": "welche-muellsackgroesse-passt-in-welchen-behaelter",
        "absaetze": [
          {
            "art": "text",
            "text": "Wichtig ist nicht nur das Volumen in Litern, sondern die Flachbreite des Sacks. Als Orientierung: rund 60 Liter für Büro- und Kücheneimer, 120 Liter für Reinigungswagen und mittlere Tonnen, 240 Liter für große Rolltonnen. Vor der Bestellung messen Sie Umfang und Höhe des Behälters und vergleichen mit den Maßangaben des Sacks. Ein Sack mit passendem Volumen, aber zu geringer Breite rutscht in die Tonne und ist nicht mehr greifbar."
          }
        ]
      },
      {
        "frage": "Woran erkenne ich, wie viel ein Müllsack wirklich kostet?",
        "anker": "woran-erkenne-ich-wie-viel-ein-muellsack-wirklich-kostet",
        "absaetze": [
          {
            "art": "text",
            "text": "Am Preis pro Stück, nicht am Preis pro Rolle oder Karton. Rollen enthalten je nach Größe und Hersteller unterschiedlich viele Säcke. Bei uns steht die Verpackungseinheit bei jedem Artikel in der Produktdatenbox, damit Sie umrechnen können."
          }
        ]
      },
      {
        "frage": "Wofür sind Hygienebeutel?",
        "anker": "wofuer-sind-hygienebeutel",
        "absaetze": [
          {
            "art": "text",
            "text": "Hygienebeutel sind kleine, meist blickdichte Beutel für Sanitärräume, die neben dem WC bereitliegen oder in einem Spender stecken. Sie werden für Damenhygieneartikel verwendet und in den Restmüll gegeben. In Betrieben mit Publikumsverkehr und in Gastronomiebetrieben gehören sie zur Standardausstattung der Damentoilette."
          }
        ]
      },
      {
        "frage": "Was ist ein Wertstoffsack und wann brauche ich ihn?",
        "anker": "was-ist-ein-wertstoffsack-und-wann-brauche-ich-ihn",
        "absaetze": [
          {
            "art": "text",
            "text": "Wertstoffsäcke sind meist transparente oder eingefärbte Säcke für getrennt gesammelte Fraktionen wie Kunststoff oder Metall. Die Transparenz erlaubt die Sichtkontrolle durch das Entsorgungsunternehmen. Welche Farben und Fraktionen gelten, regelt Ihre Gemeinde und Ihr Entsorger, das ist in Österreich nicht einheitlich. Fragen Sie im Zweifel dort nach, bevor Sie eine Palette bestellen."
          }
        ]
      }
    ]
  },
  {
    "titel": "Papier und Hygiene",
    "anker": "papier-und-hygiene",
    "kategorie": {
      "slug": "papier",
      "label": "Papier"
    },
    "fragen": [
      {
        "frage": "Jumbo, Mini-Jumbo oder Kleinrolle: welches Toilettenpapier für Betriebe?",
        "anker": "jumbo-mini-jumbo-oder-kleinrolle-welches-toilettenpapier-fuer-betriebe",
        "absaetze": [
          {
            "art": "text",
            "text": "Das entscheidet der Spender, nicht das Papier. Jumbo-Rollen haben einen großen Durchmesser, laufen sehr lange und brauchen einen entsprechenden Großrollenspender. Mini-Jumbo ist die kompakte Variante für kleinere Spender und die häufigste Wahl in Büros und Gastronomie. Kleinrollen sind Haushaltsformat und passen in offene Halter. Wer den vorhandenen Spender nicht kennt, misst Außendurchmesser und Kerndurchmesser der alten Rolle, bevor er bestellt."
          }
        ]
      },
      {
        "frage": "Warum ist Jumbo-Toilettenpapier günstiger im Betrieb?",
        "anker": "warum-ist-jumbo-toilettenpapier-guenstiger-im-betrieb",
        "absaetze": [
          {
            "art": "text",
            "text": "Weil weniger Arbeitszeit hineinfließt. Eine Jumbo-Rolle ersetzt viele Kleinrollen, der Spender muss seltener nachgefüllt werden, und es liegen weniger Restrollen herum. Der Papierpreis pro Meter ist nicht zwingend niedriger, der Gesamtaufwand schon. In Objekten mit Publikumsverkehr ist das der größere Posten."
          }
        ]
      },
      {
        "frage": "Was bedeutet 2-lagig, 3-lagig und 4-lagig?",
        "anker": "was-bedeutet-2-lagig-3-lagig-und-4-lagig",
        "absaetze": [
          {
            "art": "text",
            "text": "Die Lagenzahl gibt an, wie viele Papierschichten miteinander verbunden sind. Mehr Lagen bedeuten mehr Weichheit und höhere Saugkraft pro Blatt, aber auch mehr Materialeinsatz und einen höheren Preis. In Sanitärbereichen mit Publikumsverkehr sind zwei Lagen üblich, in repräsentativen Bereichen drei oder vier."
          }
        ]
      },
      {
        "frage": "V-Falz, Z-Falz, C-Falz oder W-Falz: welches Handtuchpapier ist das richtige?",
        "anker": "v-falz-z-falz-c-falz-oder-w-falz-welches-handtuchpapier-ist-das-richtige",
        "absaetze": [
          {
            "art": "text",
            "text": "Auch hier entscheidet der Spender. V-Falz ist die verbreitetste Falzung: Die Tücher sind ineinandergelegt, beim Herausziehen kommt das nächste automatisch nach. Z-Falz ist zweifach gefalzt, dadurch schmaler, und passt in flachere Spender. W-Falz, bei manchen Herstellern auch Multifold genannt, ist mehrfach gefalzt, liegt am kompaktesten im Spender und bietet die höchste Füllmenge, was die Nachfüllintervalle verlängert. C-Falz liegt als einzige dieser Varianten lose aufeinander statt ineinander, das Tuch ist entfaltet größer und wird einzeln entnommen. Passen Falzung und Spender nicht zusammen, zieht der Spender mehrere Blätter auf einmal oder gar keines."
          }
        ]
      },
      {
        "frage": "Was ist der Unterschied zwischen Zellstoff und Recyclingpapier?",
        "anker": "was-ist-der-unterschied-zwischen-zellstoff-und-recyclingpapier",
        "absaetze": [
          {
            "art": "text",
            "text": "Zellstoff wird aus frischen Fasern hergestellt, ist heller, weicher und reißfester. Recyclingpapier besteht aus Altpapier, ist graustichiger und in der Regel günstiger. Für Waschräume mit Kundenkontakt greifen viele Betriebe zu Zellstoff, für Werkstatt, Lager und Personalräume ist Recycling die wirtschaftlichere Wahl. Beide erfüllen dieselbe Aufgabe."
          }
        ]
      },
      {
        "frage": "Wie viel Handtuchpapier verbraucht ein Betrieb?",
        "anker": "wie-viel-handtuchpapier-verbraucht-ein-betrieb",
        "absaetze": [
          {
            "art": "text",
            "text": "Als grobe Faustregel rechnet man mit zwei bis drei Blatt je Handwaschgang. Bei zwanzig Mitarbeitern und fünf Waschgängen pro Person und Tag ergibt das größenordnungsmäßig 200 bis 300 Blatt täglich. Betriebe mit Publikumsverkehr, Gastronomie oder Produktion liegen deutlich darüber. Die Rechnung ersetzt keine eigene Messung, sie hilft nur beim ersten Bestellen."
          }
        ]
      },
      {
        "frage": "Was ist der Unterschied zwischen Küchenrolle und Putztuchrolle?",
        "anker": "was-ist-der-unterschied-zwischen-kuechenrolle-und-putztuchrolle",
        "absaetze": [
          {
            "art": "text",
            "text": "Küchenrollen sind haushaltsübliche Papierrollen für Küche und Pausenraum, meist zwei- oder dreilagig und in Packungen zu wenigen Rollen. Putztuchrollen sind deutlich größer, reißfester und für den gewerblichen Dauereinsatz gedacht, oft in Werkstatt, Produktion und Reinigung. Wer Küchenrollen für Werkstattarbeit einsetzt, verbraucht ein Mehrfaches."
          }
        ]
      },
      {
        "frage": "Was bedeutet die Angabe Blatt oder Meter bei Papierrollen?",
        "anker": "was-bedeutet-die-angabe-blatt-oder-meter-bei-papierrollen",
        "absaetze": [
          {
            "art": "text",
            "text": "Manche Hersteller geben die Blattzahl an, andere die Rollenlänge in Metern, manche beides. Vergleichbar sind zwei Angebote erst, wenn dieselbe Einheit vorliegt. Rechnen Sie über die Blattlänge um: Blattzahl mal Blattlänge ergibt die Rollenlänge. Steht die Blattlänge nicht dabei, fragen Sie nach, bevor Sie den Preis vergleichen."
          }
        ]
      }
    ]
  },
  {
    "titel": "Reinigungsmittel und Chemie",
    "anker": "reinigungsmittel-und-chemie",
    "kategorie": {
      "slug": "chemie",
      "label": "Chemie"
    },
    "fragen": [
      {
        "frage": "Was ist der Unterschied zwischen Grundreiniger und Unterhaltsreiniger?",
        "anker": "was-ist-der-unterschied-zwischen-grundreiniger-und-unterhaltsreiniger",
        "absaetze": [
          {
            "art": "text",
            "text": "Ein Unterhaltsreiniger ist für die tägliche Reinigung gedacht und wird stark verdünnt eingesetzt. Ein Grundreiniger ist wesentlich stärker und löst Altschichten, Pflegefilme und festsitzende Verschmutzungen. Grundreiniger kommen selten zum Einsatz, dann aber in hoher Dosierung, und erfordern Schutzhandschuhe sowie ausreichende Belüftung. Wer Grundreiniger täglich verwendet, greift Beschichtungen an."
          }
        ]
      },
      {
        "frage": "Alkalisch oder sauer: welcher Reiniger für welchen Schmutz?",
        "anker": "alkalisch-oder-sauer-welcher-reiniger-fuer-welchen-schmutz",
        "absaetze": [
          {
            "art": "text",
            "text": "Alkalische Reiniger lösen Fett, Eiweiß und organischen Schmutz und kommen in Küche, Kantine und Werkstatt zum Einsatz. Saure Reiniger lösen Kalk, Urinstein und Rost und gehören in den Sanitärbereich. Neutrale Reiniger sind für die tägliche Unterhaltsreinigung empfindlicher Böden gedacht. Saure und alkalische Produkte dürfen niemals gemischt werden, ebenso wenig chlorhaltige mit sauren Produkten: Dabei können gefährliche Gase entstehen."
          }
        ]
      },
      {
        "frage": "Wie berechne ich die Dosierung von Reinigungskonzentrat?",
        "anker": "wie-berechne-ich-die-dosierung-von-reinigungskonzentrat",
        "absaetze": [
          {
            "art": "text",
            "text": "Die Dosierung steht als Prozentangabe oder als Verhältnis auf dem Etikett des Herstellers und gilt verbindlich. Ein Prozent bedeutet zehn Milliliter Konzentrat auf einen Liter Wasser, bei einem Zehn-Liter-Eimer also 100 Milliliter. Überdosierung reinigt nicht besser: Sie hinterlässt Rückstände und Schlieren, erhöht den Verbrauch und kann Oberflächen angreifen."
          }
        ]
      },
      {
        "frage": "Warum ist Konzentrat günstiger als gebrauchsfertige Ware?",
        "anker": "warum-ist-konzentrat-guenstiger-als-gebrauchsfertige-ware",
        "absaetze": [
          {
            "art": "text",
            "text": "Weil Sie beim Konzentrat kein Wasser bezahlen und kein Wasser transportieren. Ein Liter Konzentrat, der einprozentig dosiert wird, ergibt 100 Liter Gebrauchslösung. Gebrauchsfertige Produkte haben trotzdem ihre Berechtigung: für kleine Flächen, für den Einsatz ohne Dosierstelle und überall dort, wo Anmischen mehr Zeit kostet als es spart. Beides hat seinen Platz, man sollte nur wissen, was man vergleicht."
          }
        ]
      },
      {
        "frage": "Was bedeutet die Angabe pH-Wert bei Reinigungsmitteln?",
        "anker": "was-bedeutet-die-angabe-ph-wert-bei-reinigungsmitteln",
        "absaetze": [
          {
            "art": "text",
            "text": "Der pH-Wert gibt an, ob eine Lösung sauer, neutral oder alkalisch ist, auf einer Skala von 0 bis 14. Unter 7 ist sauer, 7 ist neutral, über 7 alkalisch. Für die Praxis zählt der pH-Wert der fertig angemischten Gebrauchslösung, nicht der des Konzentrats. Für säureempfindliche Beläge wie Naturstein sind saure Produkte ungeeignet."
          }
        ]
      },
      {
        "frage": "Welcher Reiniger eignet sich für welchen Bodenbelag?",
        "anker": "welcher-reiniger-eignet-sich-fuer-welchen-bodenbelag",
        "absaetze": [
          {
            "art": "text",
            "text": "Das hängt vom Belag ab, und die Herstellerangabe des Bodens ist maßgeblich. Als grobe Orientierung: Naturstein wie Marmor und Kalkstein verträgt keine sauren Produkte. Linoleum reagiert empfindlich auf stark alkalische Reiniger. Fliesen und Feinsteinzeug sind unempfindlich, brauchen aber je nach Verschmutzung unterschiedliche Produkte. Im Zweifel prüfen Sie an einer unauffälligen Stelle, bevor Sie eine Fläche behandeln."
          }
        ]
      },
      {
        "frage": "Was bedeuten die Gefahrensymbole auf der Verpackung?",
        "anker": "was-bedeuten-die-gefahrensymbole-auf-der-verpackung",
        "absaetze": [
          {
            "art": "text",
            "text": "Die rautenförmigen roten Symbole stammen aus der europäischen CLP-Verordnung und kennzeichnen Gefahren wie Ätzwirkung, Reizung oder Umweltgefährdung. Ergänzt werden sie durch H-Sätze zur Gefahr und P-Sätze zu Schutzmaßnahmen. Für Betriebe sind sie die Grundlage der Gefährdungsbeurteilung und der Betriebsanweisung. Sie stehen auf dem Etikett und ausführlich im Sicherheitsdatenblatt."
          }
        ]
      },
      {
        "frage": "Wie lagere ich Reinigungsmittel richtig?",
        "anker": "wie-lagere-ich-reinigungsmittel-richtig",
        "absaetze": [
          {
            "art": "text",
            "text": "Kühl, trocken, frostfrei und in der Originalverpackung mit lesbarem Etikett. Saure und alkalische Produkte werden getrennt gelagert, ebenso chlorhaltige Produkte. Reinigungsmittel gehören nicht in Lebensmittelbereiche und nicht in Getränkeflaschen umgefüllt. Für Betriebe gelten die Vorgaben aus der Gefährdungsbeurteilung und dem Sicherheitsdatenblatt."
          }
        ]
      },
      {
        "frage": "Wie lange sind Reinigungsmittel haltbar?",
        "anker": "wie-lange-sind-reinigungsmittel-haltbar",
        "absaetze": [
          {
            "art": "text",
            "text": "Ungeöffnet und richtig gelagert sind die meisten Reinigungsmittel mehrere Jahre verwendbar. Verbindlich ist die Angabe des Herstellers auf dem Gebinde. Angemischte Gebrauchslösung wird dagegen nicht aufbewahrt, sondern jeweils frisch angesetzt: Sie verkeimt und verliert Wirkung."
          }
        ]
      },
      {
        "frage": "Was ist ein Biozidprodukt?",
        "anker": "was-ist-ein-biozidprodukt",
        "absaetze": [
          {
            "art": "text",
            "text": "Biozidprodukte sind Mittel, die Schadorganismen bekämpfen sollen, etwa Desinfektionsmittel oder Produkte gegen Schimmel und Algen. Sie unterliegen der EU-Biozidverordnung 528/2012 und dürfen nur mit entsprechender Zulassung oder Registrierung in Verkehr gebracht werden. Ein Reiniger, der nur Schmutz entfernt, ist kein Biozidprodukt. Werden zusätzlich keimtötende Eigenschaften ausgelobt, gilt das Produkt als Biozidprodukt mit allen Pflichten."
          },
          {
            "art": "biozid",
            "text": "Biozidprodukte vorsichtig verwenden. Vor Gebrauch stets Etikett und Produktinformationen lesen."
          }
        ]
      },
      {
        "frage": "Was ist der Unterschied zwischen Reinigung und Desinfektion?",
        "anker": "was-ist-der-unterschied-zwischen-reinigung-und-desinfektion",
        "absaetze": [
          {
            "art": "text",
            "text": "Reinigung entfernt sichtbaren Schmutz. Desinfektion reduziert die Keimzahl auf ein festgelegtes Maß. Desinfektion ersetzt keine Reinigung, sondern folgt ihr: Auf verschmutzten Flächen erreicht ein Desinfektionsmittel seine Wirkung nicht zuverlässig, weil der Schmutz die Wirkstoffe bindet. Für die meisten gewerblichen Flächen ist gründliche Reinigung das richtige Mittel."
          },
          {
            "art": "biozid",
            "text": "Biozidprodukte vorsichtig verwenden. Vor Gebrauch stets Etikett und Produktinformationen lesen."
          }
        ]
      },
      {
        "frage": "Was ist eine Betriebsanweisung und wer braucht sie?",
        "anker": "was-ist-eine-betriebsanweisung-und-wer-braucht-sie",
        "absaetze": [
          {
            "art": "text",
            "text": "Eine Betriebsanweisung ist eine schriftliche, arbeitsplatzbezogene Anleitung zum sicheren Umgang mit Gefahrstoffen. Sie richtet sich an die Beschäftigten und beruht auf der Gefährdungsbeurteilung und dem Sicherheitsdatenblatt. Betriebe, in denen mit Gefahrstoffen gearbeitet wird, benötigen sie nach dem österreichischen ArbeitnehmerInnenschutzgesetz. Bei einer Kontrolle wird danach gefragt."
          }
        ]
      }
    ]
  },
  {
    "titel": "Handschuhe und Schutzausrüstung",
    "anker": "handschuhe-und-schutzausruestung",
    "kategorie": {
      "slug": "handschuhe",
      "label": "Handschuhe"
    },
    "fragen": [
      {
        "frage": "Nitril, Latex oder Vinyl: welche Einweghandschuhe für die Reinigung?",
        "anker": "nitril-latex-oder-vinyl-welche-einweghandschuhe-fuer-die-reinigung",
        "absaetze": [
          {
            "art": "text",
            "text": "Nitril ist für Reinigungsarbeiten die verbreitetste Wahl: chemikalienbeständig gegenüber vielen Stoffen, reißfest und latexfrei, also ohne Risiko einer Latexallergie. Latex sitzt am besten und hat das feinste Tastgefühl, kann jedoch Allergien auslösen. Vinyl ist die günstigste Variante für kurze, unkritische Tätigkeiten ohne nennenswerten Chemikalienkontakt. Für den Umgang mit Konzentraten und Grundreinigern ist die Prüfkennzeichnung entscheidend, nicht das Material allein."
          }
        ]
      },
      {
        "frage": "Was bedeutet EN ISO 374 bei Schutzhandschuhen?",
        "anker": "was-bedeutet-en-iso-374-bei-schutzhandschuhen",
        "absaetze": [
          {
            "art": "text",
            "text": "EN ISO 374 ist die europäische Normenfamilie für Schutzhandschuhe gegen Chemikalien und Mikroorganismen. Nach EN ISO 374-1 werden Handschuhe in drei Typen eingeteilt: Typ A hält mindestens sechs Prüfchemikalien jeweils mindestens 30 Minuten stand, Typ B mindestens drei Chemikalien jeweils mindestens 30 Minuten, Typ C mindestens einer Chemikalie mindestens 10 Minuten. Die Buchstaben unter dem Piktogramm nennen die geprüften Chemikalien; der Prüfkatalog umfasst seit der Fassung von 2016 achtzehn Substanzen mit den Kennbuchstaben A bis T. Für den Umgang mit Konzentraten ist entscheidend, ob die konkret verwendete Chemikalie geprüft wurde, nicht allein der Typ."
          }
        ]
      },
      {
        "frage": "Was bedeutet die Kennzeichnung VIRUS auf der Handschuhpackung?",
        "anker": "was-bedeutet-die-kennzeichnung-virus-auf-der-handschuhpackung",
        "absaetze": [
          {
            "art": "text",
            "text": "Sie bedeutet, dass der Handschuh nach EN ISO 374-5 zusätzlich auf Dichtheit gegenüber Viren geprüft wurde, über einen Bakteriophagen-Penetrationstest nach ISO 16604, Verfahren B. Ohne diesen Zusatz gilt die Prüfung gegen Mikroorganismen nur für Bakterien und Pilze. Für die normale Gebäudereinigung ist diese Kennzeichnung in der Regel nicht erforderlich."
          }
        ]
      },
      {
        "frage": "Was bedeutet der AQL-Wert bei Einweghandschuhen?",
        "anker": "was-bedeutet-der-aql-wert-bei-einweghandschuhen",
        "absaetze": [
          {
            "art": "text",
            "text": "AQL steht für Acceptable Quality Level und beschreibt, welcher Anteil einer Stichprobe die Dichtheitsprüfung nicht bestehen darf. Je niedriger der Wert, desto dichter die Charge. Für medizinische Einmalhandschuhe schreibt die Norm EN 455-1 einen AQL von höchstens 1,5 vor, geprüft im Wasserdichtheitstest. Handschuhe ohne medizinische Zweckbestimmung unterliegen dieser Vorgabe nicht und können darüber liegen. Wo der Wert angegeben ist, steht er auf der Verpackung oder im technischen Datenblatt."
          }
        ]
      },
      {
        "frage": "Welche Handschuhgröße ist die richtige?",
        "anker": "welche-handschuhgroesse-ist-die-richtige",
        "absaetze": [
          {
            "art": "text",
            "text": "Gemessen wird der Handumfang der dominanten Hand ohne Daumen, an der breitesten Stelle unterhalb der Fingergrundgelenke. Die numerische Handschuhgröße leitet sich von diesem Umfang in Zoll ab, nicht in Zentimetern: Größe 8 steht für einen Umfang von rund 20 bis 22 Zentimetern und entspricht bei den meisten Herstellern der Größe M. Da die Tabellen zwischen Herstellern abweichen, gilt immer die Größentabelle des jeweiligen Produkts. Zu große Handschuhe rutschen und reduzieren die Griffsicherheit, zu kleine reißen an den Fingerspitzen."
          }
        ]
      },
      {
        "frage": "Sind Einweghandschuhe aus dem Reinigungsbedarf auch für medizinische Zwecke geeignet?",
        "anker": "sind-einweghandschuhe-aus-dem-reinigungsbedarf-auch-fuer-medizinische-zwecke-geeignet",
        "absaetze": [
          {
            "art": "text",
            "text": "Nein, sofern sie nicht ausdrücklich als Medizinprodukt gekennzeichnet sind. Handschuhe für medizinische Untersuchungen unterliegen eigenen Vorgaben und tragen eine entsprechende Kennzeichnung. Unsere Handschuhe sind für gewerbliche Reinigungs- und Hygienetätigkeiten bestimmt."
          }
        ]
      }
    ]
  },
  {
    "titel": "Seifen und Waschraum",
    "anker": "seifen-und-waschraum",
    "kategorie": {
      "slug": "seifen",
      "label": "Seifen"
    },
    "fragen": [
      {
        "frage": "Was ist der Unterschied zwischen Cremeseife, Waschlotion und Schaumseife?",
        "anker": "was-ist-der-unterschied-zwischen-cremeseife-waschlotion-und-schaumseife",
        "absaetze": [
          {
            "art": "text",
            "text": "Cremeseife und Waschlotion sind flüssige Handreiniger, die aus einer Flasche oder einem Spender dosiert werden. Schaumseife wird im Spender mit Luft vermischt und kommt bereits aufgeschäumt heraus, was den Verbrauch je Waschgang deutlich senkt. Schaumseife braucht dafür einen passenden Schaumspender; in einen normalen Seifenspender gefüllt funktioniert sie nicht."
          }
        ]
      },
      {
        "frage": "Kanister oder Kartusche: was ist wirtschaftlicher?",
        "anker": "kanister-oder-kartusche-was-ist-wirtschaftlicher",
        "absaetze": [
          {
            "art": "text",
            "text": "Kanister sind pro Liter günstiger und werden in nachfüllbare Spender umgefüllt. Kartuschensysteme sind pro Liter teurer, dafür geschlossen: Es wird nicht umgefüllt, nichts verschüttet, und der Spender bleibt innen sauber. In Betrieben mit hohen Hygieneanforderungen oder vielen Standorten ist das Kartuschensystem oft die bessere Wahl, im eigenen Betriebsgebäude der Kanister."
          }
        ]
      },
      {
        "frage": "Warum sollte Seife im Betrieb parfümfrei sein?",
        "anker": "warum-sollte-seife-im-betrieb-parfuemfrei-sein",
        "absaetze": [
          {
            "art": "text",
            "text": "Muss sie nicht, aber es hat Gründe. In Küchen und Lebensmittelbetrieben kann Parfüm auf die Hände und von dort auf Lebensmittel übergehen. Außerdem sind Duftstoffe eine häufige Ursache von Hautreaktionen bei Personen, die viele Male täglich Hände waschen. Wo beides keine Rolle spielt, ist parfümierte Seife eine Frage des Geschmacks."
          }
        ]
      }
    ]
  },
  {
    "titel": "Einkauf und Kalkulation",
    "anker": "einkauf-und-kalkulation",
    "kategorie": null,
    "fragen": [
      {
        "frage": "Woran erkenne ich, ob ein Angebot wirklich günstig ist?",
        "anker": "woran-erkenne-ich-ob-ein-angebot-wirklich-guenstig-ist",
        "absaetze": [
          {
            "art": "text",
            "text": "Am Preis pro Nutzungseinheit, nicht am Gebindepreis. Bei Papier ist das der Preis je Blatt oder je Meter, bei Säcken der Preis je Stück, bei Konzentraten der Preis je Liter fertiger Gebrauchslösung. Kartons, Rollen und Packungen enthalten je nach Hersteller unterschiedliche Mengen. Deshalb steht bei uns die Verpackungseinheit bei jedem Artikel in der Produktdatenbox."
          }
        ]
      },
      {
        "frage": "Warum schwanken Preise für Verbrauchsgüter?",
        "anker": "warum-schwanken-preise-fuer-verbrauchsgueter",
        "absaetze": [
          {
            "art": "text",
            "text": "Weil Rohstoffpreise, Energiekosten und Transportkosten schwanken und bei Papier und Folie einen großen Anteil am Endpreis ausmachen. Preise für Verbrauchsgüter sind deshalb Tagespreise, keine Jahrespreise. Wir passen unsere Preise regelmäßig an und weisen sie immer netto aus."
          }
        ]
      },
      {
        "frage": "Lohnt sich der Palettenbezug?",
        "anker": "lohnt-sich-der-palettenbezug",
        "absaetze": [
          {
            "art": "text",
            "text": "Wenn Sie einen Artikel dauerhaft in gleichbleibender Menge verbrauchen und Platz zum Lagern haben, meist ja. Die Ersparnis entsteht bei den Transportkosten, nicht beim Produkt selbst. Rechnen Sie gegen, was gebundenes Kapital und Lagerfläche kosten, und ob der Artikel lange genug haltbar ist. Bei Papier und Säcken geht die Rechnung fast immer auf, bei Chemie kommt es auf die Haltbarkeit an."
          }
        ]
      },
      {
        "frage": "Welche Verbrauchsgüter braucht ein Reinigungsbetrieb im Standardsortiment?",
        "anker": "welche-verbrauchsgueter-braucht-ein-reinigungsbetrieb-im-standardsortiment",
        "absaetze": [
          {
            "art": "text",
            "text": "Als Grundausstattung: Müllsäcke in zwei bis drei Größen, Toilettenpapier und Handtuchpapier passend zu den Spendern der betreuten Objekte, Handseife, einen neutralen Unterhaltsreiniger, einen Sanitärreiniger, einen Glasreiniger, Einweghandschuhe und Tücher. Alles Weitere ergibt sich aus den konkreten Objekten. Wer neu anfängt, kauft lieber wenige Artikel in vernünftiger Menge als viele in kleinen Gebinden."
          }
        ]
      }
    ]
  }
];
