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
    const { type, name, level, targetLang, courseSlug, isCurriculum } = body;

    if (type === 'translation') {
      await translateCourseContent(courseSlug, targetLang || 'fr');
      return NextResponse.json({ success: true, message: 'Translation complete.' });
    } else {
      if (isCurriculum) {
        await generateCurriculum(name, level || 'L1', targetLang || 'en');
      } else {
        await generateCourseContent(name, level || 'L1', targetLang || 'en');
      }
      return NextResponse.json({ success: true, message: 'Generation complete.' });
    }
  } catch (error: any) {
    console.error('[GENERATE ERROR]', error);
    return NextResponse.json({ success: false, error: 'Content generation failed. Please try again later.' }, { status: 500 });
  }
}
