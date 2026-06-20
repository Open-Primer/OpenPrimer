import { NextRequest, NextResponse } from 'next/server';
import { correctCourseTitle } from '@/lib/ai';

/**
 * POST /api/correct-title
 * Body: { title: string, targetLang?: string, translateToTargetLang?: boolean }
 * Returns: { corrected: string }
 *
 * Used by the admin manual task form to sanitize course titles at entry time:
 * translates non-English titles to English, fixes capitalization and typos.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, targetLang = 'en', translateToTargetLang = true } = body;

    if (!title || typeof title !== 'string' || title.trim().length < 2) {
      return NextResponse.json({ error: 'Title is required and must be at least 2 characters.' }, { status: 400 });
    }

    const corrected = await correctCourseTitle(title.trim(), targetLang, translateToTargetLang);
    return NextResponse.json({ corrected });
  } catch (err: any) {
    console.error('[/api/correct-title] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to correct title.' }, { status: 500 });
  }
}
