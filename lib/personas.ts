export interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  keywords: string[];
  headline: string;
  subheadline: string;
  painPoints: string[];
  benefits: string[];
  testimonial: {
    quote: string;
    author: string;
    company: string;
  };
  cta: {
    primary: string;
    secondary: string;
  };
  accentColor: string;
}

export const personas: Record<string, Persona> = {
  // Default persona when no keyword matches
  default: {
    id: "default",
    name: "Besucher",
    role: "Marketing Professional",
    avatar: "👤",
    keywords: [],
    headline: "Verwandle Klicks in Kunden",
    subheadline: "Dynamische Landingpages, die sich automatisch an deine Besucher anpassen",
    painPoints: [
      "Generische Landingpages mit niedriger Conversion",
      "Hohe Kosten pro Akquisition",
      "Keine Personalisierung ohne Entwickler",
    ],
    benefits: [
      "Bis zu 3x h\u00f6here Conversion-Rates",
      "Automatische Keyword-Personalisierung",
      "In 5 Minuten eingerichtet",
    ],
    testimonial: {
      quote: "ClickConverter hat unsere Conversion-Rate verdoppelt - ohne eine Zeile Code.",
      author: "Marketing Team",
      company: "SaaS Startup",
    },
    cta: {
      primary: "Kostenlos testen",
      secondary: "Demo ansehen",
    },
    accentColor: "#6366f1",
  },

  // Marketing Manager searching for conversion optimization
  conversion: {
    id: "conversion",
    name: "Sarah",
    role: "Marketing Manager",
    avatar: "👩‍💼",
    keywords: ["conversion", "conversion rate", "conversion optimization", "cro", "conversion rate optimization"],
    headline: "Steigere deine Conversion-Rate um bis zu 300%",
    subheadline: "Zeige jedem Besucher genau das, was er sucht - automatisch basierend auf seinem Suchbegriff",
    painPoints: [
      "A/B-Tests dauern Wochen f\u00fcr signifikante Ergebnisse",
      "Generische Landingpages performen schlecht",
      "Personalisierung ist zu komplex und teuer",
    ],
    benefits: [
      "Sofortige Personalisierung ohne Wartezeit",
      "Keyword-zu-Content Matching in Echtzeit",
      "Nachweisbare ROI-Steigerung",
    ],
    testimonial: {
      quote: "Unsere Conversion-Rate stieg von 2,3% auf 7,1% - in nur 2 Wochen nach der Integration.",
      author: "Sarah M\u00fcller",
      company: "GrowthHQ",
    },
    cta: {
      primary: "Conversion steigern",
      secondary: "ROI-Rechner",
    },
    accentColor: "#10b981",
  },

  // Startup founder looking for landing page solutions
  startup: {
    id: "startup",
    name: "Max",
    role: "Startup Gr\u00fcnder",
    avatar: "🚀",
    keywords: ["landing page", "landingpage", "startup", "saas", "landing page builder", "schnell"],
    headline: "Launch personalisierte Landingpages in Minuten",
    subheadline: "Kein Entwickler n\u00f6tig. Kein Design-Team. Nur du und deine Google Ads.",
    painPoints: [
      "Kein Budget f\u00fcr teure Entwickler",
      "Zu wenig Zeit f\u00fcr komplexe Tools",
      "Jeder Klick muss z\u00e4hlen bei begrenztem Budget",
    ],
    benefits: [
      "Setup in unter 5 Minuten",
      "Kostenlos starten, skalieren wenn's l\u00e4uft",
      "Maximale Effizienz f\u00fcr jedes Ad-Budget",
    ],
    testimonial: {
      quote: "Als Solopreneur habe ich keine Zeit f\u00fcr komplizierte Tools. ClickConverter war in 10 Minuten live.",
      author: "Max Weber",
      company: "LaunchFast.io",
    },
    cta: {
      primary: "Jetzt starten",
      secondary: "Preise ansehen",
    },
    accentColor: "#f59e0b",
  },

  // E-Commerce manager focused on product pages
  ecommerce: {
    id: "ecommerce",
    name: "Lisa",
    role: "E-Commerce Manager",
    avatar: "🛒",
    keywords: ["ecommerce", "e-commerce", "shop", "produkt", "product", "online shop", "verkauf", "sales"],
    headline: "Personalisierte Produktseiten f\u00fcr jeden Suchbegriff",
    subheadline: "Zeige Besuchern genau das Produkt-Highlight, das sie suchen - automatisch",
    painPoints: [
      "Hohe Absprungrate auf Produktseiten",
      "Kunden finden nicht, was sie suchen",
      "Zu viele Produkte, zu wenig Personalisierung",
    ],
    benefits: [
      "Dynamische Produkthervorhebung",
      "Keyword-basierte Produktempfehlungen",
      "Nahtlose Shop-Integration",
    ],
    testimonial: {
      quote: "Unsere Warenkorbgr\u00f6\u00dfe ist um 40% gestiegen, seit wir ClickConverter nutzen.",
      author: "Lisa Schmidt",
      company: "StyleStore",
    },
    cta: {
      primary: "Shop optimieren",
      secondary: "E-Commerce Demo",
    },
    accentColor: "#ec4899",
  },

  // Agency looking for client solutions
  agency: {
    id: "agency",
    name: "Tom",
    role: "Agentur Inhaber",
    avatar: "🏢",
    keywords: ["agentur", "agency", "kunden", "clients", "white label", "reseller"],
    headline: "Biete deinen Kunden personalisierte Landingpages",
    subheadline: "White-Label L\u00f6sung f\u00fcr Agenturen - skaliere dein Angebot ohne Mehraufwand",
    painPoints: [
      "Kunden erwarten Personalisierung",
      "Entwicklungskosten fressen Margen",
      "Skalierung ohne Team-Wachstum schwierig",
    ],
    benefits: [
      "White-Label unter deiner Marke",
      "Unbegrenzte Kunden-Accounts",
      "Automatische Reports f\u00fcr Kunden",
    ],
    testimonial: {
      quote: "Wir haben ClickConverter als Upsell eingef\u00fchrt - 80% unserer Kunden nutzen es jetzt.",
      author: "Tom Bauer",
      company: "Digital Growth Agency",
    },
    cta: {
      primary: "Agentur-Demo",
      secondary: "Partner werden",
    },
    accentColor: "#8b5cf6",
  },
};

export function getPersonaByKeyword(keyword: string | null): Persona {
  if (!keyword) return personas.default;

  const normalizedKeyword = keyword.toLowerCase().trim();

  for (const persona of Object.values(personas)) {
    if (persona.keywords.some(k => normalizedKeyword.includes(k) || k.includes(normalizedKeyword))) {
      return persona;
    }
  }

  return personas.default;
}

export function getAllPersonas(): Persona[] {
  return Object.values(personas);
}
