import { NextResponse } from 'next/server';
import { getPageContent, getNavigationTree } from '@/lib/content';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug')?.split(',') || [];
  const type = searchParams.get('type') || 'page';

  try {
    if (type === 'nav') {
      const tree = getNavigationTree();
      return NextResponse.json(tree);
    }

    const content = await getPageContent(slug);
    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
