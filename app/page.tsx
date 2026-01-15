"use client";

import { useState, useEffect, useCallback } from "react";

// SVG Icons als Komponenten
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" />
  </svg>
);

// Demo-Inhalte basierend auf Keywords
interface DemoContent {
  badge: string;
  headline: string;
  description: string;
  cta: string;
  color: string;
}

const demoContents: Record<string, DemoContent> = {
  default: {
    badge: "Personalisierte Erfahrung",
    headline: "Willkommen! Finde genau das, was du suchst",
    description: "Entdecke Lösungen, die perfekt zu deinen Anforderungen passen.",
    cta: "Mehr erfahren",
    color: "#4f46e5"
  },
  conversion: {
    badge: "Conversion-Optimierung",
    headline: "Steigere deine Conversion-Rate sofort",
    description: "Datenbasierte Strategien für messbare Ergebnisse. Im Schnitt +187% Conversion.",
    cta: "ROI berechnen",
    color: "#10b981"
  },
  marketing: {
    badge: "Für Marketing-Teams",
    headline: "Marketing-Automation, die wirklich funktioniert",
    description: "Spare 10+ Stunden pro Woche mit intelligenter Personalisierung.",
    cta: "Demo starten",
    color: "#8b5cf6"
  },
  landingpage: {
    badge: "Landing Page Builder",
    headline: "Erstelle High-Converting Landing Pages",
    description: "Ohne Entwickler. Ohne Designer. In unter 5 Minuten live.",
    cta: "Kostenlos testen",
    color: "#f59e0b"
  },
  ecommerce: {
    badge: "E-Commerce Optimierung",
    headline: "Mehr Umsatz pro Besucher",
    description: "Dynamische Produktseiten steigern den Warenkorbwert um durchschnittlich 34%.",
    cta: "Shop verbinden",
    color: "#ec4899"
  }
};

function getContentByKeyword(keyword: string): DemoContent {
  const k = keyword.toLowerCase().trim();
  if (k.includes("conversion") || k.includes("cro") || k.includes("optimierung")) {
    return demoContents.conversion;
  }
  if (k.includes("marketing") || k.includes("automation") || k.includes("campaign")) {
    return demoContents.marketing;
  }
  if (k.includes("landing") || k.includes("page") || k.includes("builder")) {
    return demoContents.landingpage;
  }
  if (k.includes("shop") || k.includes("ecommerce") || k.includes("produkt") || k.includes("store")) {
    return demoContents.ecommerce;
  }
  return demoContents.default;
}

// FAQ Komponente
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <ChevronDownIcon />
      </button>
      <div className="faq-answer">{answer}</div>
    </div>
  );
}

export default function Home() {
  const [demoKeyword, setDemoKeyword] = useState("");
  const [activeContent, setActiveContent] = useState<DemoContent>(demoContents.default);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDemoChange = useCallback((keyword: string) => {
    setDemoKeyword(keyword);
    setIsAnimating(true);
    setTimeout(() => {
      setActiveContent(getContentByKeyword(keyword));
      setIsAnimating(false);
    }, 150);
  }, []);

  const exampleKeywords = [
    "conversion optimierung",
    "marketing automation",
    "landing page",
    "ecommerce"
  ];

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <a href="/" className="logo">
              <div className="logo-icon">C</div>
              ClickConverter
            </a>
            <div className="header-cta">
              <a href="#demo" className="header-link" onClick={(e) => { e.preventDefault(); scrollToSection('demo'); }}>Live Demo</a>
              <a href="#pricing" className="header-link" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Preise</a>
              <button className="btn btn-primary btn-sm">Kostenlos starten</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <SparklesIcon />
            Neu: KI-gestützte Personalisierung
          </div>

          <h1>
            <span className="highlight">67%</span> deiner Besucher gehen, weil sie nicht finden, was sie suchen
          </h1>

          <p className="hero-subtitle">
            ClickConverter passt deine Landingpage automatisch an jeden Google-Suchbegriff an.
            Jeder Besucher sieht genau das, was er gesucht hat.
          </p>

          <div className="hero-cta-group">
            <button className="btn btn-primary btn-lg">Jetzt kostenlos starten</button>
            <button className="btn btn-secondary" onClick={() => scrollToSection('demo')}>
              Live Demo ansehen
            </button>
          </div>

          <div className="hero-trust">
            <span><CheckIcon /> Keine Kreditkarte</span>
            <span><CheckIcon /> Setup in 5 Minuten</span>
            <span><CheckIcon /> DSGVO-konform</span>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="social-proof">
        <div className="container">
          <div className="social-proof-inner">
            <p className="social-proof-text">Vertraut von Marketing-Teams bei</p>
            <div className="social-proof-logos">
              <span className="social-proof-logo">TechStartup</span>
              <span className="social-proof-logo">GrowthCo</span>
              <span className="social-proof-logo">ScaleUp</span>
              <span className="social-proof-logo">MarketPro</span>
              <span className="social-proof-logo">ConvertHQ</span>
            </div>

            <div className="social-proof-stats">
              <div className="stat-item">
                <div className="stat-number">2.7x</div>
                <div className="stat-label">Mehr Conversions</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Aktive Teams</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">12M+</div>
                <div className="stat-label">Personalisierte Besuche</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5 Min</div>
                <div className="stat-label">Setup-Zeit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="demo-section" id="demo">
        <div className="container">
          <h2>Erlebe die Magie selbst</h2>
          <p className="section-subtitle">
            Gib einen Suchbegriff ein und sieh, wie sich deine Landingpage in Echtzeit anpasst
          </p>

          <div className="demo-box">
            <div className="demo-input-group">
              <div className="demo-input-wrapper">
                <input
                  type="text"
                  className="demo-input"
                  placeholder="z.B. conversion optimierung"
                  value={demoKeyword}
                  onChange={(e) => handleDemoChange(e.target.value)}
                />
              </div>
              <button className="demo-btn" onClick={() => handleDemoChange(demoKeyword || "conversion")}>
                Transformation zeigen
              </button>
            </div>

            <div className="demo-examples">
              <span style={{ color: 'rgba(255,255,255,0.6)', marginRight: '8px' }}>Probiere:</span>
              {exampleKeywords.map((kw) => (
                <button
                  key={kw}
                  className="demo-example"
                  onClick={() => handleDemoChange(kw)}
                >
                  {kw}
                </button>
              ))}
            </div>

            {/* Preview Card */}
            <div className="demo-preview" style={{ opacity: isAnimating ? 0.5 : 1 }}>
              <div className="demo-preview-header">
                <div className="demo-preview-dot"></div>
                <div className="demo-preview-dot"></div>
                <div className="demo-preview-dot"></div>
                <div className="demo-preview-url">
                  deine-website.de{demoKeyword ? `?keyword=${encodeURIComponent(demoKeyword)}` : ''}
                </div>
              </div>
              <div className="demo-preview-content">
                <div className="demo-preview-badge" style={{ background: `${activeContent.color}20`, color: activeContent.color }}>
                  {activeContent.badge}
                </div>
                <h3 style={{ color: activeContent.color }}>{activeContent.headline}</h3>
                <p>{activeContent.description}</p>
                <div className="demo-preview-cta" style={{ background: activeContent.color }}>
                  {activeContent.cta}
                </div>
              </div>
            </div>

            <p className="demo-label">
              So sehen deine Besucher deine Seite - personalisiert auf ihren Suchbegriff
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <h2>Warum Marketing-Teams ClickConverter lieben</h2>
          <p className="section-subtitle">
            Keine wochenlangen A/B-Tests. Keine teuren Entwickler. Sofortige Personalisierung.
          </p>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" width="32" height="32">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <div className="benefit-stat">+187%</div>
              <h3>Mehr Conversions</h3>
              <p>Im Durchschnitt steigern unsere Kunden ihre Conversion-Rate um 187% innerhalb der ersten 30 Tage.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" width="32" height="32">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="benefit-stat">5 Min</div>
              <h3>Setup-Zeit</h3>
              <p>Ein Snippet einbauen, Keywords definieren, fertig. Keine Entwickler, keine komplexe Integration.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" width="32" height="32">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
              </div>
              <div className="benefit-stat">KI</div>
              <h3>Automatische Varianten</h3>
              <p>Unsere KI erstellt automatisch Content-Varianten für neue Keywords. Du musst nichts mehr manuell pflegen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>So einfach funktioniert es</h2>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>Snippet einbinden</h4>
              <p>Kopiere unser JavaScript-Snippet in deine Seite. Funktioniert mit jeder Website, jedem CMS.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h4>Keywords zuordnen</h4>
              <p>Definiere, welche Inhalte bei welchen Suchbegriffen erscheinen sollen - oder lass unsere KI das erledigen.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h4>Conversions steigern</h4>
              <p>Jeder Besucher sieht sofort personalisierte Inhalte. Deine Conversion-Rate steigt automatisch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2>Das sagen unsere Kunden</h2>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-metric">+195% Conversion</div>
                <p className="testimonial-quote">
                  "Wir haben jahrelang A/B-Tests gemacht und nie solche Ergebnisse gesehen.
                  Mit ClickConverter haben wir unsere Conversion-Rate in 3 Wochen verdreifacht."
                </p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">SM</div>
                  <div className="testimonial-info">
                    <h5>Sandra M.</h5>
                    <p>Head of Growth, SaaS-Unternehmen</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-metric">10h/Woche gespart</div>
                <p className="testimonial-quote">
                  "Früher haben wir für jede Kampagne separate Landingpages gebaut.
                  Jetzt machen wir eine Seite und ClickConverter erledigt den Rest."
                </p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">TK</div>
                  <div className="testimonial-info">
                    <h5>Thomas K.</h5>
                    <p>Marketing Manager, E-Commerce</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-metric">-43% CAC</div>
                <p className="testimonial-quote">
                  "Unsere Customer Acquisition Costs sind um 43% gesunken, weil jetzt mehr
                  Besucher konvertieren. Das Tool hat sich in einer Woche amortisiert."
                </p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">LH</div>
                  <div className="testimonial-info">
                    <h5>Lisa H.</h5>
                    <p>CMO, B2B Software</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="container">
          <h2>Transparente Preise</h2>
          <p className="section-subtitle">Starte kostenlos. Skaliere, wenn du wächst.</p>

          <div className="pricing-grid">
            {/* Free */}
            <div className="pricing-card">
              <div className="pricing-header">
                <div className="pricing-name">Starter</div>
                <div className="pricing-price">0 EUR<span>/Monat</span></div>
                <div className="pricing-description">Perfekt zum Testen</div>
              </div>
              <ul className="pricing-features">
                <li><CheckIcon /> 1.000 Besucher/Monat</li>
                <li><CheckIcon /> 5 Keyword-Regeln</li>
                <li><CheckIcon /> 1 Website</li>
                <li><CheckIcon /> Basis-Analytics</li>
                <li><CheckIcon /> Community-Support</li>
              </ul>
              <button className="btn btn-secondary">Kostenlos starten</button>
            </div>

            {/* Pro */}
            <div className="pricing-card featured">
              <div className="pricing-badge">Beliebt</div>
              <div className="pricing-header">
                <div className="pricing-name">Pro</div>
                <div className="pricing-price">49 EUR<span>/Monat</span></div>
                <div className="pricing-description">Fur wachsende Teams</div>
              </div>
              <ul className="pricing-features">
                <li><CheckIcon /> 50.000 Besucher/Monat</li>
                <li><CheckIcon /> Unbegrenzte Keywords</li>
                <li><CheckIcon /> 5 Websites</li>
                <li><CheckIcon /> KI-Varianten-Generator</li>
                <li><CheckIcon /> Erweiterte Analytics</li>
                <li><CheckIcon /> Priority Support</li>
              </ul>
              <button className="btn btn-primary">Jetzt starten</button>
            </div>

            {/* Enterprise */}
            <div className="pricing-card">
              <div className="pricing-header">
                <div className="pricing-name">Enterprise</div>
                <div className="pricing-price">Individuell</div>
                <div className="pricing-description">Fur große Unternehmen</div>
              </div>
              <ul className="pricing-features">
                <li><CheckIcon /> Unbegrenzte Besucher</li>
                <li><CheckIcon /> Unbegrenzte Websites</li>
                <li><CheckIcon /> White-Label Option</li>
                <li><CheckIcon /> Custom Integrationen</li>
                <li><CheckIcon /> Dedicated Account Manager</li>
                <li><CheckIcon /> SLA garantiert</li>
              </ul>
              <button className="btn btn-secondary">Kontakt aufnehmen</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="container">
          <h2>Häufig gestellte Fragen</h2>

          <div className="faq-grid">
            <FAQItem
              question="Wie funktioniert ClickConverter technisch?"
              answer="ClickConverter liest den URL-Parameter (z.B. utm_term, keyword) aus, den Google Ads automatisch mitschickt. Basierend auf diesem Keyword werden dann vordefinierte Inhalte auf deiner Seite ausgetauscht - Headlines, Texte, Bilder, CTAs. Das passiert clientseitig in Millisekunden."
            />
            <FAQItem
              question="Beeinflusst das mein SEO?"
              answer="Nein, im Gegenteil. Da die Personalisierung clientseitig passiert, sehen Suchmaschinen immer deine Standard-Inhalte. Fur Besucher von Google Ads wird dann personalisiert. Dein organisches Ranking bleibt unberührt."
            />
            <FAQItem
              question="Funktioniert das mit meinem CMS/Website-Builder?"
              answer="Ja, ClickConverter funktioniert mit jeder Website - WordPress, Webflow, Shopify, custom HTML, React, Vue, und allen anderen. Du fügst einfach unser JavaScript-Snippet ein und definierst CSS-Selektoren für die zu personalisierenden Elemente."
            />
            <FAQItem
              question="Ist ClickConverter DSGVO-konform?"
              answer="Ja, zu 100%. Wir speichern keine personenbezogenen Daten deiner Besucher. Die Personalisierung basiert ausschließlich auf dem Suchbegriff, der in der URL steht - das ist keine personenbezogene Information."
            />
            <FAQItem
              question="Kann ich ClickConverter vor dem Kauf testen?"
              answer="Absolut! Unser Starter-Plan ist komplett kostenlos und beinhaltet alle Kernfunktionen. Du kannst sofort loslegen und upgraden, wenn du mehr Besucher oder Features brauchst."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <h2>Bereit, deine Conversions zu verdoppeln?</h2>
          <p>Starte in 5 Minuten. Keine Kreditkarte erforderlich.</p>
          <button className="btn btn-primary btn-lg">Jetzt kostenlos starten</button>
          <p className="final-cta-trust">
            Bereits 500+ Marketing-Teams vertrauen auf ClickConverter
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-logo">ClickConverter</div>
            <div className="footer-links">
              <a href="#">Datenschutz</a>
              <a href="#">Impressum</a>
              <a href="#">AGB</a>
              <a href="#">Support</a>
            </div>
            <div className="footer-copyright">
              2026 ClickConverter. Alle Rechte vorbehalten.
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="mobile-cta">
        <button className="btn btn-primary">Kostenlos starten</button>
      </div>
    </>
  );
}
