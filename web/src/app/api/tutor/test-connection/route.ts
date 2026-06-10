import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/authHelper';

export async function POST(request: Request) {
  try {
    const user = await verifySession(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { provider, apiKey, model } = await request.json();

    if (!provider || !apiKey) {
      return NextResponse.json({ success: false, error: 'Parameters missing' }, { status: 400 });
    }

    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 2
        })
      });
      if (res.ok) {
        return NextResponse.json({ success: true });
      } else {
        const text = await res.text();
        return NextResponse.json({ success: false, error: text }, { status: 400 });
      }
    } 
    
    if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model || 'claude-3-5-haiku-20241022',
          max_tokens: 2,
          messages: [{ role: 'user', content: 'test' }]
        })
      });
      if (res.ok) {
        return NextResponse.json({ success: true });
      } else {
        const text = await res.text();
        return NextResponse.json({ success: false, error: text }, { status: 400 });
      }
    }

    if (provider === 'gemini') {
      const geminiModel = model || 'gemini-2.5-flash';
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'test' }] }],
          generationConfig: { maxOutputTokens: 2 }
        })
      });
      if (res.ok) {
        return NextResponse.json({ success: true });
      } else {
        const text = await res.text();
        return NextResponse.json({ success: false, error: text }, { status: 400 });
      }
    }

    return NextResponse.json({ success: false, error: 'Unknown provider' }, { status: 400 });

  } catch (err: any) {
    console.error('[TEST CONNECTION ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
