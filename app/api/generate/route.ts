import { NextRequest, NextResponse } from 'next/server';

function getClient() {
  const OpenAI = require('openai');
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { title, abstract, readability, focus } = await req.json();
    if (!title && !abstract) return NextResponse.json({ error: 'Title or abstract is required' }, { status: 400 });

    const client = getClient();

    const readabilityInstructions: Record<string, string> = {
      patient: 'Write at an 8th-grade reading level. Use simple language, avoid jargon, and explain any medical terms in plain English. Use analogies to help understanding.',
      educated: 'Write at a college-educated general reader level. Minimize jargon, define necessary technical terms, and make complex concepts accessible.',
      professional: 'Write for healthcare professionals. You may use appropriate medical terminology while still ensuring clarity. Focus on clinical relevance.',
    };

    const focusInstructions: Record<string, string> = {
      full: 'Provide a comprehensive plain language summary covering: what the study was about, what they did (methods), what they found (results), and what it means (implications).',
      methods: 'Focus specifically on explaining the study methodology and design in plain language. What type of study was it? Who were the participants? How was data collected?',
      results: 'Focus on the key findings and results of the study. What were the main outcomes? Include relevant statistics translated into plain language.',
      limitations: 'Focus on explaining the study limitations and potential biases in accessible language.',
      clinical: 'Focus on the clinical implications and real-world relevance of the findings. What should patients or clinicians do with this information?',
    };

    const systemPrompt = `You are an expert medical communicator and health literacy specialist. Translate complex medical research into accessible, accurate, and clear language. Always maintain scientific accuracy while making content accessible. Include appropriate caveats about generalizability and the preliminary nature of research findings.`;

    const userPrompt = `Generate a plain language summary of the following medical/scientific research:\n\nTitle: ${title || '(No title provided)'}\n\nAbstract/Key Text:\n${abstract || '(No abstract provided — use the title to generate a general summary)'}\n\nReadability Level: ${readabilityInstructions[readability] || readabilityInstructions.patient}\n\nFocus: ${focusInstructions[focus] || focusInstructions.full}`;

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
