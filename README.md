# ClickConverter

Dynamische Landingpages basierend auf Google Ads Keywords.

## Konzept

ClickConverter ist ein SaaS-Tool, das Landingpages automatisch an die Suchbegriffe der Besucher anpasst. Wenn ein Nutzer auf eine Google-Anzeige klickt, wird das Keyword aus der URL extrahiert und die Seite zeigt personalisierte Inhalte.

## Demo

Teste verschiedene Keywords:

- [Standard-Ansicht](http://localhost:3000)
- [Marketing Manager](http://localhost:3000?keyword=conversion+rate+optimization)
- [Startup-Gr\u00fcnder](http://localhost:3000?keyword=landing+page+builder)
- [E-Commerce Manager](http://localhost:3000?keyword=online+shop+optimierung)
- [Agentur](http://localhost:3000?keyword=white+label+agentur)

## Unterst\u00fctzte URL-Parameter

- `keyword` - Hauptparameter
- `utm_term` - Google Ads Standard
- `q` - Suchbegriff
- `search` - Alternative
- `k`, `kw` - Kurzformen

## Technologie

- **Framework**: Next.js 14 (App Router)
- **Sprache**: TypeScript
- **Styling**: CSS (kein Framework)
- **Deployment**: Vercel-ready

## Installation

```bash
npm install
npm run dev
```

\u00d6ffne [http://localhost:3000](http://localhost:3000) im Browser.

## Wie es funktioniert

1. Besucher klickt auf Google-Anzeige mit Keyword in URL
2. ClickConverter extrahiert das Keyword aus URL-Parametern
3. Passende Persona wird basierend auf Keywords ermittelt
4. Seite zeigt personalisierte Headlines, Benefits, Testimonials

## Personas

| ID | Name | Keywords | Farbe |
|----|------|----------|-------|
| default | Besucher | - | Indigo |
| conversion | Sarah | conversion, cro | Gr\u00fcn |
| startup | Max | landing page, saas | Orange |
| ecommerce | Lisa | shop, produkt, sales | Pink |
| agency | Tom | agentur, white label | Violett |

## Roadmap

- [ ] KI-basierte Keyword-zu-Content Zuordnung
- [ ] A/B-Testing Integration
- [ ] Analytics Dashboard
- [ ] White-Label Optionen
- [ ] Shopify/WordPress Plugins
