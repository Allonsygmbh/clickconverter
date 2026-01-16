"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
  </svg>
);

const MagicWandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

// Parsed Website Content Interface
interface ParsedContent {
  title: string;
  metaDescription: string;
  favicon: string;
  logo: string;
  headlines: string[];
  paragraphs: string[];
  buttons: string[];
  images: string[];
  navigation: string[];
  baseUrl: string;
}

// Personalized Content Interface
interface PersonalizedContent extends ParsedContent {
  personalizedHeadlines: string[];
  personalizedParagraphs: string[];
  personalizedButtons: string[];
  heroHeadline: string;
  heroSubheadline: string;
  heroCta: string;
  keyword: string;
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

// Call LLM API for real personalization
async function personalizeContentWithLLM(content: ParsedContent, keyword: string): Promise<PersonalizedContent> {
  try {
    const response = await fetch('/api/personalize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: {
          headlines: content.headlines,
          paragraphs: content.paragraphs,
          buttons: content.buttons,
        },
        keyword,
      }),
    });

    if (!response.ok) {
      throw new Error('Personalization API failed');
    }

    const data = await response.json();

    if (!data.success || !data.personalized) {
      throw new Error('Invalid API response');
    }

    return {
      ...content,
      personalizedHeadlines: data.personalized.headlines || content.headlines,
      personalizedParagraphs: data.personalized.paragraphs || content.paragraphs,
      personalizedButtons: data.personalized.buttons || content.buttons,
      heroHeadline: data.personalized.heroHeadline || content.headlines[0] || '',
      heroSubheadline: data.personalized.heroSubheadline || content.paragraphs[0] || '',
      heroCta: data.personalized.heroCta || content.buttons[0] || '',
      keyword,
    };
  } catch (error) {
    console.error('LLM personalization failed:', error);
    // Fallback to basic personalization
    const keywordCapitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
    return {
      ...content,
      personalizedHeadlines: content.headlines.map((h, i) =>
        i === 0 ? `${keywordCapitalized} - ${h}` : h
      ),
      personalizedParagraphs: content.paragraphs,
      personalizedButtons: content.buttons,
      heroHeadline: `${keywordCapitalized} - ${content.headlines[0] || 'Willkommen'}`,
      heroSubheadline: content.paragraphs[0] || '',
      heroCta: content.buttons[0] || 'Jetzt starten',
      keyword,
    };
  }
}

// Parse HTML content
function parseHTML(html: string, baseUrl: string): ParsedContent {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract base URL for resolving relative paths
  const urlObj = new URL(baseUrl);
  const origin = urlObj.origin;

  // Helper to resolve URLs
  const resolveUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return `${origin}${url}`;
    return `${origin}/${url}`;
  };

  // Extract title
  const title = doc.querySelector('title')?.textContent || '';

  // Extract meta description
  const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

  // Extract favicon
  const faviconLink = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  const favicon = resolveUrl(faviconLink?.getAttribute('href') || '/favicon.ico');

  // Extract logo (common patterns)
  const logoSelectors = [
    'img[alt*="logo" i]',
    'img[class*="logo" i]',
    'img[id*="logo" i]',
    '.logo img',
    '#logo img',
    'header img:first-of-type',
    'nav img:first-of-type'
  ];
  let logo = '';
  for (const selector of logoSelectors) {
    const logoEl = doc.querySelector(selector);
    if (logoEl) {
      logo = resolveUrl(logoEl.getAttribute('src') || '');
      break;
    }
  }

  // Extract headlines (h1, h2, h3)
  const headlines: string[] = [];
  doc.querySelectorAll('h1, h2, h3').forEach((el) => {
    const text = el.textContent?.trim();
    if (text && text.length > 3 && text.length < 200) {
      headlines.push(text);
    }
  });

  // Extract paragraphs
  const paragraphs: string[] = [];
  doc.querySelectorAll('p').forEach((el) => {
    const text = el.textContent?.trim();
    if (text && text.length > 20 && text.length < 500) {
      paragraphs.push(text);
    }
  });

  // Extract buttons/CTAs
  const buttons: string[] = [];
  doc.querySelectorAll('button, a[class*="btn"], a[class*="button"], a[class*="cta"], .btn, .button, .cta').forEach((el) => {
    const text = el.textContent?.trim();
    if (text && text.length > 2 && text.length < 50) {
      buttons.push(text);
    }
  });

  // Extract images
  const images: string[] = [];
  doc.querySelectorAll('img').forEach((el) => {
    const src = el.getAttribute('src');
    if (src && !src.includes('tracking') && !src.includes('pixel')) {
      images.push(resolveUrl(src));
    }
  });

  // Extract navigation
  const navigation: string[] = [];
  doc.querySelectorAll('nav a, header a').forEach((el) => {
    const text = el.textContent?.trim();
    if (text && text.length > 1 && text.length < 30) {
      navigation.push(text);
    }
  });

  return {
    title,
    metaDescription,
    favicon,
    logo,
    headlines: headlines.slice(0, 10),
    paragraphs: paragraphs.slice(0, 8),
    buttons: [...new Set(buttons)].slice(0, 6),
    images: images.slice(0, 10),
    navigation: [...new Set(navigation)].slice(0, 8),
    baseUrl: origin
  };
}

// Fetch website via CORS proxy
async function fetchWebsite(url: string): Promise<string> {
  // Use allorigins.win as CORS proxy
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch website');
  }
  return response.text();
}

export default function Home() {
  // Main Analyzer State
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [utmKeyword, setUtmKeyword] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [parsedContent, setParsedContent] = useState<ParsedContent | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent | null>(null);
  const [showPersonalized, setShowPersonalized] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  const analysisSteps = [
    "Website wird geladen...",
    "Struktur wird analysiert...",
    "Inhalte werden extrahiert...",
    "KI optimiert Content für dein Keyword...",
    "Personalisierte Version wird erstellt..."
  ];

  const handleAnalyze = useCallback(async () => {
    if (!websiteUrl) return;

    setError(null);
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setParsedContent(null);
    setPersonalizedContent(null);

    try {
      // Normalize URL
      let url = websiteUrl.trim();
      if (!url.startsWith('http')) {
        url = `https://${url}`;
      }

      // Step 1: Fetch website
      setAnalysisStep(0);
      await new Promise(r => setTimeout(r, 500));

      const html = await fetchWebsite(url);

      // Step 2: Analyze structure
      setAnalysisStep(1);
      await new Promise(r => setTimeout(r, 600));

      // Step 3: Extract content
      setAnalysisStep(2);
      await new Promise(r => setTimeout(r, 500));

      const parsed = parseHTML(html, url);
      setParsedContent(parsed);

      // Step 4: Personalize with AI (real LLM call)
      setAnalysisStep(3);

      const keyword = utmKeyword || 'Conversion';
      const personalized = await personalizeContentWithLLM(parsed, keyword);

      // Step 5: Generate preview
      setAnalysisStep(4);
      await new Promise(r => setTimeout(r, 300));

      setPersonalizedContent(personalized);
      setIsAnalyzing(false);

      // Scroll to preview
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      setError('Die Website konnte nicht geladen werden. Bitte überprüfe die URL.');
      setIsAnalyzing(false);
    }
  }, [websiteUrl, utmKeyword]);

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
              <a href="#how-it-works" className="header-link" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>So funktioniert's</a>
              <a href="#pricing" className="header-link" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Preise</a>
              <button className="btn btn-primary btn-sm">Kostenlos starten</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Main Analyzer */}
      <section className="hero-analyzer">
        <div className="hero-bg-effects">
          <div className="hero-gradient-orb orb-1"></div>
          <div className="hero-gradient-orb orb-2"></div>
          <div className="hero-gradient-orb orb-3"></div>
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge-new">
              <SparklesIcon />
              KI-gestützte Website-Personalisierung
            </div>

            <h1 className="hero-headline">
              <span className="hero-headline-top">Verwandle jeden Besucher in einen Kunden</span>
              <span className="hero-headline-highlight">Spare bis zu 73% deiner Werbekosten</span>
            </h1>

            <p className="hero-description">
              Gib deine Website-URL ein und sieh in Echtzeit, wie ClickConverter deinen Content
              automatisch an jeden Suchbegriff anpasst. Jeder Besucher sieht genau das, was er gesucht hat.
            </p>

            {/* Main Analyzer Input */}
            <div className="analyzer-hero-box">
              <div className="analyzer-hero-inputs">
                <div className="analyzer-hero-input-group main">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                      <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                    </svg>
                    Deine Website-URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://deine-website.de"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="analyzer-hero-input"
                  />
                </div>

                <div className="analyzer-hero-input-group">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                    Google Suchbegriff
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. marketing automation"
                    value={utmKeyword}
                    onChange={(e) => setUtmKeyword(e.target.value)}
                    className="analyzer-hero-input"
                  />
                </div>

                <button
                  className="analyzer-hero-btn"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !websiteUrl}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="btn-spinner"></span>
                      Analysiere...
                    </>
                  ) : (
                    <>
                      <MagicWandIcon />
                      Website analysieren
                    </>
                  )}
                </button>
              </div>

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="analysis-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{analysisSteps[analysisStep]}</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="analysis-error">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="hero-trust-row">
              <span><CheckIcon /> Keine Anmeldung nötig</span>
              <span><CheckIcon /> Kostenlose Analyse</span>
              <span><CheckIcon /> DSGVO-konform</span>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section - Only shows after analysis */}
      {personalizedContent && (
        <section className="preview-section" ref={previewRef}>
          <div className="container">
            <div className="preview-header">
              <div className="preview-header-left">
                <h2>Deine personalisierte Website-Vorschau</h2>
                <p>So sehen Besucher deine Seite, wenn sie nach "<strong>{personalizedContent.keyword}</strong>" suchen</p>
              </div>
              <div className="preview-toggle">
                <button
                  className={`toggle-btn ${!showPersonalized ? 'active' : ''}`}
                  onClick={() => setShowPersonalized(false)}
                >
                  Original
                </button>
                <button
                  className={`toggle-btn ${showPersonalized ? 'active' : ''}`}
                  onClick={() => setShowPersonalized(true)}
                >
                  <SparklesIcon />
                  Personalisiert
                </button>
              </div>
            </div>

            {/* Browser Preview */}
            <div className="website-preview-container">
              <div className="browser-chrome">
                <div className="browser-header">
                  <div className="browser-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <div className="browser-url-bar">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                    <span>{parsedContent?.baseUrl}{showPersonalized ? `?utm_term=${encodeURIComponent(personalizedContent.keyword)}` : ''}</span>
                  </div>
                </div>

                <div className="browser-content">
                  {/* Reconstructed Website */}
                  <div className={`preview-website ${showPersonalized ? 'personalized' : ''}`}>
                    {/* Navigation */}
                    <div className="preview-nav">
                      {personalizedContent.logo ? (
                        <img src={personalizedContent.logo} alt="Logo" className="preview-logo-img" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <div className="preview-logo-placeholder">{parsedContent?.title?.charAt(0) || 'W'}</div>
                      )}
                      <div className="preview-nav-links">
                        {personalizedContent.navigation.slice(0, 5).map((item, i) => (
                          <span key={i}>{item}</span>
                        ))}
                      </div>
                    </div>

                    {/* Hero Section */}
                    <div className="preview-hero-section">
                      {/* Personalization Indicator */}
                      {showPersonalized && (
                        <div className="personalization-badge">
                          <SparklesIcon />
                          KI-optimiert für "{personalizedContent.keyword}"
                        </div>
                      )}

                      <h1>
                        {showPersonalized
                          ? personalizedContent.heroHeadline || personalizedContent.personalizedHeadlines[0] || personalizedContent.headlines[0]
                          : personalizedContent.headlines[0] || 'Willkommen'}
                      </h1>

                      <p className="preview-hero-text">
                        {showPersonalized
                          ? personalizedContent.heroSubheadline || personalizedContent.personalizedParagraphs[0] || personalizedContent.paragraphs[0]
                          : personalizedContent.paragraphs[0] || 'Entdecke unsere Lösung.'}
                      </p>

                      {(personalizedContent.buttons[0] || personalizedContent.heroCta) && (
                        <button className="preview-cta-button">
                          {showPersonalized
                            ? personalizedContent.heroCta || personalizedContent.personalizedButtons[0] || personalizedContent.buttons[0]
                            : personalizedContent.buttons[0]}
                        </button>
                      )}
                    </div>

                    {/* Features/Content Section */}
                    <div className="preview-features-section">
                      <h2>
                        {showPersonalized
                          ? personalizedContent.personalizedHeadlines[1] || personalizedContent.headlines[1] || 'Features'
                          : personalizedContent.headlines[1] || 'Features'}
                      </h2>

                      <div className="preview-features-grid">
                        {personalizedContent.paragraphs.slice(1, 4).map((para, i) => (
                          <div key={i} className="preview-feature-card">
                            {personalizedContent.images[i] && (
                              <div className="feature-image-placeholder">
                                <img
                                  src={personalizedContent.images[i]}
                                  alt=""
                                  onError={(e) => { e.currentTarget.parentElement!.innerHTML = '<div class="image-fallback">Bild</div>'; }}
                                />
                              </div>
                            )}
                            <p>
                              {showPersonalized
                                ? personalizedContent.personalizedParagraphs[i + 1] || para
                                : para}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className="preview-cta-section">
                      <h3>
                        {showPersonalized
                          ? personalizedContent.personalizedHeadlines[2] || personalizedContent.headlines[2] || 'Bereit zu starten?'
                          : personalizedContent.headlines[2] || 'Bereit zu starten?'}
                      </h3>

                      <div className="preview-cta-buttons">
                        {personalizedContent.buttons.slice(0, 2).map((btn, i) => (
                          <button key={i} className={`preview-cta-button ${i === 1 ? 'secondary' : ''}`}>
                            {showPersonalized
                              ? personalizedContent.personalizedButtons[i] || btn
                              : btn}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Stats */}
            <div className="improvement-stats">
              <div className="stat-card highlight">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="stat-number">+187%</div>
                <div className="stat-label">Erwartete Conversion-Steigerung</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" />
                  </svg>
                </div>
                <div className="stat-number">5 Min</div>
                <div className="stat-label">Setup-Zeit</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="stat-number">-43%</div>
                <div className="stat-label">Niedrigere Akquisekosten</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="stat-number">{personalizedContent.headlines.length + personalizedContent.paragraphs.length}</div>
                <div className="stat-label">Personalisierte Elemente</div>
              </div>
            </div>

            {/* CTA */}
            <div className="preview-cta-box">
              <h3>Beeindruckt? Das ist erst der Anfang.</h3>
              <p>Aktiviere ClickConverter für deine Website und steigere deine Conversions sofort.</p>
              <button className="btn btn-primary btn-lg">
                Jetzt kostenlos aktivieren
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Social Proof - Quick Stats */}
      <section className="social-proof-mini">
        <div className="container">
          <div className="social-proof-inner">
            <div className="social-proof-stat">
              <strong>2.7x</strong>
              <span>mehr Conversions</span>
            </div>
            <div className="social-proof-divider"></div>
            <div className="social-proof-stat">
              <strong>500+</strong>
              <span>aktive Teams</span>
            </div>
            <div className="social-proof-divider"></div>
            <div className="social-proof-stat">
              <strong>12M+</strong>
              <span>personalisierte Besuche</span>
            </div>
            <div className="social-proof-divider"></div>
            <div className="social-proof-stat">
              <strong>4.9/5</strong>
              <span>Kundenbewertung</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2>So einfach funktioniert ClickConverter</h2>
          <p className="section-subtitle">In 3 Schritten zu mehr Conversions - keine technischen Kenntnisse nötig</p>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Snippet einbauen</h4>
                <p>Kopiere unser JavaScript-Snippet in deine Seite. Funktioniert mit WordPress, Webflow, Shopify und jeder anderen Website.</p>
              </div>
            </div>

            <div className="step-arrow">
              <ArrowRightIcon />
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>KI trainieren</h4>
                <p>Unsere KI analysiert deine Website und erstellt automatisch personalisierte Varianten für jeden Suchbegriff.</p>
              </div>
            </div>

            <div className="step-arrow">
              <ArrowRightIcon />
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Mehr konvertieren</h4>
                <p>Jeder Besucher sieht sofort relevante Inhalte. Deine Conversion-Rate steigt automatisch.</p>
              </div>
            </div>
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
                <div className="pricing-description">Für wachsende Teams</div>
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
                <div className="pricing-description">Für große Unternehmen</div>
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
              answer="Nein, im Gegenteil. Da die Personalisierung clientseitig passiert, sehen Suchmaschinen immer deine Standard-Inhalte. Für Besucher von Google Ads wird dann personalisiert. Dein organisches Ranking bleibt unberührt."
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
