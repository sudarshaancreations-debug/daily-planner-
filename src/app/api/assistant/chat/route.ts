import { NextRequest, NextResponse } from 'next/server';

export interface AssistantChatRequest {
  prompt: string;
  tasks?: Array<{
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    priority: string;
    status: string;
  }>;
  contacts?: Array<{
    name: string;
    company: string;
  }>;
  assistantName?: string;
  currentTime?: string;
  currentDate?: string;
  apiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AssistantChatRequest = await req.json();
    const {
      prompt,
      tasks = [],
      contacts = [],
      assistantName = 'Nova',
      currentTime = '9:41 AM',
      currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      apiKey: clientKey,
    } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey =
      clientKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_VERTEX_API_KEY ||
      process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      // Graceful fallback signal to client
      return NextResponse.json({
        success: false,
        fallback: true,
        message: 'No Google Vertex / Gemini API key found. Using built-in local parser.',
      });
    }

    const systemPrompt = `You are ${assistantName}, the Executive AI Assistant in the NIMORA Daily Planner SaaS.
You are helping an executive, architect, or busy professional manage their schedule, meetings, calls, and tasks.
Current Time: ${currentTime}
Current Date: ${currentDate}
Active Schedule: ${JSON.stringify(tasks)}
Contacts: ${JSON.stringify(contacts)}

When the user gives a command, interpret their intent intelligently:
1. If they want to add a task, call, follow-up, or meeting, create a structured task.
2. If they are running late or need to reschedule, adjust times and note any conflicts.
3. If they ask a question about their day, provide a concise, executive spoken summary.

You MUST respond ONLY with a valid JSON object matching this TypeScript structure:
{
  "action": "create_task" | "reschedule" | "answer",
  "spokenResponse": "A crisp, natural sentence to speak aloud to the executive",
  "task": {
    "title": "Title of the task",
    "subtitle": "Relevant contact name, company, or brief context",
    "category": "task" | "call" | "followup" | "note",
    "date": "${currentDate}",
    "startTime": "e.g. 2:00 PM",
    "endTime": "e.g. 2:45 PM",
    "durationMinutes": 45,
    "priority": "low" | "medium" | "high",
    "color": "blue" | "green" | "coral" | "orange" | "gray",
    "notes": "Context notes"
  }
}
Do not wrap in markdown quotes. Output raw JSON only.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            { text: `User voice command: "${prompt}"` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API returned error:', response.status, errText);
      return NextResponse.json({
        success: false,
        fallback: true,
        message: `Gemini API returned status ${response.status}`,
      });
    }

    const data = await response.json();
    const candidateText =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json({
        success: false,
        fallback: true,
        message: 'No response candidate returned from model',
      });
    }

    try {
      const parsedResult = JSON.parse(candidateText);
      return NextResponse.json({
        success: true,
        fallback: false,
        source: 'google-vertex-gemini',
        ...parsedResult,
      });
    } catch {
      return NextResponse.json({
        success: false,
        fallback: true,
        message: 'Could not parse JSON from model output',
      });
    }
  } catch (error: any) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { success: false, fallback: true, error: error.message },
      { status: 500 }
    );
  }
}
