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

    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    const body = await req.json();
    const { type, name, level, targetLang, courseSlug, isCurriculum, taskId } = body;

    if (type === 'translation') {
      await translateCourseContent(courseSlug, targetLang || 'fr', taskId);
      triggerTaskWorker(req.url, authHeader);
      return NextResponse.json({ success: true, message: 'Translation complete.' });
    } else {
      let result: any = null;
      if (isCurriculum) {
        await generateCurriculum(name, level || 'L1', targetLang || 'en');
      } else {
        result = await generateCourseContent(name, level || 'L1', targetLang || 'en', taskId);
      }
      triggerTaskWorker(req.url, authHeader);
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

async function triggerTaskWorker(requestUrl: string, userAuthHeader?: string | null) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const origin = new URL(requestUrl).origin;
    const triggerUrl = `${origin}/api/tasks/run`;
    console.log(`[EAGER TRIGGER] Triggering worker endpoint at ${triggerUrl}...`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (cronSecret) {
      headers['Authorization'] = `Bearer ${cronSecret}`;
    } else if (userAuthHeader) {
      headers['Authorization'] = userAuthHeader;
    } else {
      console.warn('[EAGER TRIGGER] Neither CRON_SECRET nor user session is available. Skipping worker trigger.');
      return;
    }

    // We run the fetch asynchronously and do not await it so it doesn't block the request response
    fetch(triggerUrl, {
      method: 'POST',
      headers
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
