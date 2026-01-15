"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { getPersonaByKeyword, getAllPersonas, Persona } from "@/lib/personas";

function LandingPageContent() {
  const searchParams = useSearchParams();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [activePersonaId, setActivePersonaId] = useState<string>("default");

  useEffect(() => {
    // Extract keyword from various possible URL parameters
    // Google Ads typically uses: utm_term, keyword, q, search, k
    const possibleParams = ["keyword", "utm_term", "q", "search", "k", "kw"];
    let foundKeyword: string | null = null;

    for (const param of possibleParams) {
      const value = searchParams.get(param);
      if (value) {
        foundKeyword = value;
        break;
      }
    }

    setKeyword(foundKeyword);
    const matchedPersona = getPersonaByKeyword(foundKeyword);
    setPersona(matchedPersona);
    setActivePersonaId(matchedPersona.id);
  }, [searchParams]);

  const handlePersonaSwitch = (personaId: string) => {
    const allPersonas = getAllPersonas();
    const selected = allPersonas.find((p) => p.id === personaId);
    if (selected) {
      setPersona(selected);
      setActivePersonaId(personaId);
      // Update URL for demo purposes
      const url = new URL(window.location.href);
      if (selected.keywords[0]) {
        url.searchParams.set("keyword", selected.keywords[0]);
      } else {
        url.searchParams.delete("keyword");
      }
      window.history.pushState({}, "", url.toString());
    }
  };

  if (!persona) {
    return <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>Laden...</div>;
  }

  const allPersonas = getAllPersonas();

  return (
    <>
      {/* Demo Banner */}
      <div className="demo-banner">
        <strong>Demo:</strong> Dies ist ein Proof of Concept. W\u00e4hle unten verschiedene Personas, um zu sehen, wie sich die Seite anpasst.
      </div>

      {/* Persona Switcher for Demo */}
      <div className="persona-switcher">
        <div className="container">
          <div className="persona-switcher-inner">
            <span className="persona-switcher-label">Simuliere Besucher:</span>
            <div className="persona-buttons">
              {allPersonas.map((p) => (
                <button
                  key={p.id}
                  className={`persona-btn ${activePersonaId === p.id ? "active" : ""}`}
                  onClick={() => handlePersonaSwitch(p.id)}
                  style={
                    activePersonaId === p.id
                      ? { borderColor: p.accentColor, backgroundColor: p.accentColor }
                      : {}
                  }
                >
                  <span className="avatar">{p.avatar}</span>
                  <span>{p.id === "default" ? "Standard" : p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero animate-in" style={{ "--accent-color": persona.accentColor } as React.CSSProperties}>
        <div className="container">
          <div className="hero-badge">
            <span className="avatar">{persona.avatar}</span>
            <span>Optimiert f\u00fcr: <strong>{persona.role}</strong></span>
          </div>
          <h1>{persona.headline}</h1>
          <p className="subheadline">{persona.subheadline}</p>
          <div className="hero-cta">
            <button className="btn btn-primary" style={{ backgroundColor: persona.accentColor }}>
              {persona.cta.primary}
            </button>
            <button className="btn btn-secondary">{persona.cta.secondary}</button>
          </div>

          {/* Show detected keyword */}
          <div className="keyword-display">
            Erkanntes Keyword: <code>{keyword || "(kein Keyword)"}</code> → Persona: <code>{persona.id}</code>
          </div>
        </div>
      </section>

      {/* Pain Points & Benefits */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-column">
              <h3><span className="icon-pain">✗</span> Deine aktuellen Probleme</h3>
              <ul className="feature-list">
                {persona.painPoints.map((pain, i) => (
                  <li key={i}>
                    <span className="icon-pain">✗</span>
                    {pain}
                  </li>
                ))}
              </ul>
            </div>
            <div className="feature-column">
              <h3><span className="icon-benefit">✓</span> Mit ClickConverter</h3>
              <ul className="feature-list">
                {persona.benefits.map((benefit, i) => (
                  <li key={i}>
                    <span className="icon-benefit">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="testimonial-section">
        <div className="container">
          <div className="testimonial-card">
            <p className="testimonial-quote">"{persona.testimonial.quote}"</p>
            <p className="testimonial-author">{persona.testimonial.author}</p>
            <p className="testimonial-company">{persona.testimonial.company}</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>So funktioniert ClickConverter</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number" style={{ backgroundColor: persona.accentColor }}>1</div>
              <h4>Snippet einbauen</h4>
              <p>F\u00fcge unser JavaScript-Snippet auf deiner Landingpage ein - fertig in 2 Minuten.</p>
            </div>
            <div className="step">
              <div className="step-number" style={{ backgroundColor: persona.accentColor }}>2</div>
              <h4>Keywords definieren</h4>
              <p>Ordne Keywords zu Content-Varianten zu - oder lass unsere KI das automatisch erledigen.</p>
            </div>
            <div className="step">
              <div className="step-number" style={{ backgroundColor: persona.accentColor }}>3</div>
              <h4>Conversion steigern</h4>
              <p>Jeder Besucher sieht personalisierte Inhalte - deine Conversion-Rate steigt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={{ background: `linear-gradient(135deg, ${persona.accentColor} 0%, ${persona.accentColor}dd 100%)` }}>
        <div className="container">
          <h2>Bereit, deine Conversion zu steigern?</h2>
          <p>Starte kostenlos und sehe selbst den Unterschied.</p>
          <button className="btn btn-primary">{persona.cta.primary}</button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>ClickConverter - Dynamische Landingpages f\u00fcr Google Ads</p>
          <p style={{ marginTop: "8px", opacity: 0.7 }}>
            Proof of Concept | URL-Parameter: <code>?keyword=dein-suchbegriff</code>
          </p>
        </div>
      </footer>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: "100px", textAlign: "center" }}>Laden...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
