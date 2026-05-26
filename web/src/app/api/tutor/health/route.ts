import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          status: 'offline', 
          error: 'GEMINI_API_KEY is not configured on the server.' 
        }, 
        { status: 503 }
      );
    }

    return NextResponse.json({ status: 'online' });
  } catch (err: any) {
    return NextResponse.json(
      { 
        status: 'offline', 
        error: err.message 
      }, 
      { status: 500 }
    );
  }
}
