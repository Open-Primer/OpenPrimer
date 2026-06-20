import { NextRequest, NextResponse } from 'next/server';
import { generateCourseContent, translateCourseContent, generateCurriculum } from '@/lib/ai';
import { dbService } from '@/lib/db';
import { verifySession } from '@/lib/authHelper';

export async function POST(req: NextRequest) {
  try {
    const user = await verifySession(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Session missing or invalid token.' }, { status: 401 });
    }

    const body = await req.json();
    const { type, name, level, targetLang, courseSlug, isCurriculum, taskId } = body;

    if (type === 'translation') {
      await translateCourseContent(courseSlug, targetLang || 'fr', taskId);
      triggerTaskWorker(req.url);
      return NextResponse.json({ success: true, message: 'Translation complete.' });
    } else {
      let result: any = null;
      if (isCurriculum) {
        await generateCurriculum(name, level || 'L1', targetLang || 'en');
      } else {
        result = await generateCourseContent(name, level || 'L1', targetLang || 'en', taskId);
      }
      triggerTaskWorker(req.url);
      return NextResponse.json({ 
        success: true, 
        message: 'Generation complete.', 
        title: result?.title, 
        slug: result?.slug 
      });
    }
  } catch (error: any) {
    console.error('[GENERATE ERROR]', error);
    return NextResponse.json({ success: false, error: 'Content generation failed. Please try again later.' }, { status: 500 });
  }
}

async function triggerTaskWorker(requestUrl: string) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      console.warn('[EAGER TRIGGER] CRON_SECRET is not configured. Skipping worker trigger.');
      return;
    }
    const origin = new URL(requestUrl).origin;
    const triggerUrl = `${origin}/api/tasks/run`;
    console.log(`[EAGER TRIGGER] Triggering worker endpoint at ${triggerUrl}...`);
    
    // We run the fetch asynchronously and do not await it so it doesn't block the request response
    fetch(triggerUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        console.error(`[EAGER TRIGGER ERROR] Worker returned status ${res.status}: ${text}`);
      } else {
        console.log('[EAGER TRIGGER SUCCESS] Worker triggered successfully.');
      }
    }).catch(err => {
      console.error('[EAGER TRIGGER ERROR] Fetch failed during worker invocation:', err);
    });
  } catch (err) {
    console.error('[EAGER TRIGGER ERROR] Unexpected error setting up worker trigger:', err);
  }
}
