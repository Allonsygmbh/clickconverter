import { NextRequest, NextResponse } from 'next/server';

interface ParsedContent {
  title: string;
  metaDescription: string;
  headlines: string[];
  paragraphs: string[];
  buttons: string[];
  navigation: string[];
}

interface PersonalizedContent {
  headlines: string[];
  paragraphs: string[];
  buttons: string[];
  heroHeadline: string;
  heroSubheadline: string;
  heroCta: string;
}

export async function POST(request: NextRequest) {
  try {
    const { content, keyword } = await request.json();

    if (!content || !keyword) {
      return NextResponse.json(
        { error: 'Content and keyword are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Du bist ein Conversion-Optimierungs-Experte. Deine Aufgabe ist es, Website-Inhalte so zu personalisieren, dass sie perfekt auf einen bestimmten Suchbegriff abgestimmt sind.

Der Besucher hat nach "${keyword}" gesucht und ist auf dieser Website gelandet.

Hier sind die aktuellen Inhalte der Website:

HEADLINES:
${content.headlines.slice(0, 5).map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')}

PARAGRAPHS:
${content.paragraphs.slice(0, 4).map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

BUTTONS/CTAs:
${content.buttons.slice(0, 4).map((b: string, i: number) => `${i + 1}. ${b}`).join('\n')}

Erstelle personalisierte Versionen dieser Inhalte, die:
1. Den Suchbegriff "${keyword}" natürlich integrieren
2. Die Suchintention des Besuchers direkt ansprechen
3. Relevanter und überzeugender für jemanden sind, der nach "${keyword}" sucht
4. Die ursprüngliche Bedeutung und den Kontext beibehalten
5. Nicht zu werblich oder pushy klingen

Antworte NUR mit einem JSON-Objekt in diesem exakten Format (keine Markdown-Formatierung, kein \`\`\`json):
{
  "heroHeadline": "Personalisierte Hauptüberschrift mit ${keyword}-Fokus",
  "heroSubheadline": "Personalisierter Untertitel der die ${keyword}-Vorteile hervorhebt",
  "heroCta": "Personalisierter Call-to-Action Button Text",
  "headlines": ["Headline 1", "Headline 2", "Headline 3"],
  "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"],
  "buttons": ["Button 1", "Button 2"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein Experte für Conversion-Optimierung und Personalisierung. Antworte immer nur mit validem JSON, ohne Markdown-Formatierung.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to personalize content' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from LLM' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let personalizedContent: PersonalizedContent;
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanedResponse = assistantMessage.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.slice(7);
      }
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.slice(3);
      }
      if (cleanedResponse.endsWith('```')) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      cleanedResponse = cleanedResponse.trim();

      personalizedContent = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse LLM response:', assistantMessage);
      return NextResponse.json(
        { error: 'Failed to parse LLM response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      personalized: personalizedContent,
      keyword,
    });

  } catch (error) {
    console.error('Personalization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
