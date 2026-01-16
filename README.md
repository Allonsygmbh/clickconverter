# ClickConverter

Dynamische Landingpages basierend auf Google Ads Keywords - steigere deine Conversion-Rate um bis zu 187%.

## Live Demo

Starte den Development Server:

```bash
npm install
npm run dev
```

Dann öffne [http://localhost:3000](http://localhost:3000) und teste die interaktive Demo:
1. Scrolle zur "Erlebe die Magie selbst" Sektion
2. Gib verschiedene Keywords ein (z.B. "conversion", "marketing", "ecommerce")
3. Sieh wie sich die Preview-Karte in Echtzeit anpasst

## Features

- **Problem-fokussierte Headline**: "67% deiner Besucher gehen..." - weckt sofort Aufmerksamkeit
- **Interaktive Live-Demo**: Besucher können die Personalisierung selbst ausprobieren
- **Social Proof**: Statistiken und Testimonials mit konkreten Zahlen
- **Transparente Preise**: Free, Pro und Enterprise Pläne
- **FAQ-Sektion**: Beantwortet häufige Fragen
- **Mobile-optimiert**: Sticky CTA auf Mobile, responsive Design
- **Professionelles Design**: Modernes UI mit durchdachter Farbpalette

## Technologie

- **Framework**: Next.js 14 (App Router)
- **Sprache**: TypeScript
- **Styling**: Custom CSS (kein Framework, volle Kontrolle)
- **Deployment**: Vercel-ready

## Seitenstruktur

1. **Header** - Fixiert, mit Logo und CTA
2. **Hero** - Problem-Statement + Hauptversprechen
3. **Social Proof** - Logos + Statistiken
4. **Live Demo** - Interaktive Keyword-Personalisierung
5. **Benefits** - 3 Hauptvorteile mit Zahlen
6. **How it Works** - 3-Schritt-Prozess
7. **Testimonials** - 3 Kundenstimmen mit Metriken
8. **Pricing** - 3-Tier Preismodell
9. **FAQ** - 5 häufige Fragen
10. **Final CTA** - Letzte Handlungsaufforderung
11. **Footer** - Links und Copyright

## Für Marketing-Teams optimiert

Diese Landingpage wurde speziell für Marketing-Professionals gestaltet:

- **ROI-fokussierte Sprache**: Konkrete Zahlen statt vager Versprechen
- **Niedrige Einstiegshürde**: "Kostenlos starten", "Keine Kreditkarte"
- **Vertrauensaufbau**: DSGVO-konform, 5 Min Setup
- **Klare Value Proposition**: Problem → Lösung → Beweis

## Anpassung

Die Demo-Inhalte können in `app/page.tsx` im `demoContents` Objekt angepasst werden:

```typescript
const demoContents = {
  conversion: {
    badge: "Conversion-Optimierung",
    headline: "Steigere deine Conversion-Rate sofort",
    description: "...",
    cta: "ROI berechnen",
    color: "#10b981"
  },
  // ... weitere Keywords
};
```

## Deployment

```bash
npm run build
npm start
```

Oder direkt auf Vercel deployen.
