import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import fs from 'fs';
import path from 'path';

function countUniqueMdxLessons(): number {
  const contentPath = path.join(process.cwd(), '../content');
  if (!fs.existsSync(contentPath)) return 0;
  
  const uniqueLessons = new Set<string>();
  
  function scan(dir: string) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        scan(fullPath);
      } else if (item.name.endsWith('.mdx')) {
        const normalized = item.name.replace(/\.(en|fr|es|de|zh)\.mdx$/, '');
        const relativePath = path.relative(contentPath, path.join(dir, normalized));
        uniqueLessons.add(relativePath.split(path.sep).join('/'));
      }
    }
  }
  
  scan(contentPath);
  return uniqueLessons.size;
}

export async function GET() {
  try {
    const { data: courses } = await dbService.getAllCourses();
    const activeCourses = courses || [];
    
    // 1. Languages Count
    const uniqueLangs = new Set<string>();
    activeCourses.forEach(c => {
      c.languages?.forEach((l: string) => uniqueLangs.add(l.toLowerCase()));
    });
    const totalLanguages = uniqueLangs.size || 2;
    
    // 2. Curricula Count
    const totalCurricula = activeCourses.filter(c => c.is_active).length || 10;
    
    // 3. Total Courses/Lessons Count
    const totalCourses = countUniqueMdxLessons() || 25;
    
    return NextResponse.json({
      total_languages: totalLanguages,
      total_curricula: totalCurricula,
      total_courses: totalCourses
    });
  } catch (error) {
    console.error("Error generating dynamic stats:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
