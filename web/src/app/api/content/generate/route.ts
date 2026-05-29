import { NextRequest, NextResponse } from 'next/server';
import { generateCourseContent, translateCourseContent } from '@/lib/ai';
import { dbService } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, level, targetLang, courseSlug } = body;

    if (type === 'translation') {
      await translateCourseContent(courseSlug, targetLang || 'fr');
      return NextResponse.json({ success: true, message: 'Translation complete.' });
    } else {
      await generateCourseContent(name, level || 'L1', targetLang || 'en');
      return NextResponse.json({ success: true, message: 'Generation complete.' });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
