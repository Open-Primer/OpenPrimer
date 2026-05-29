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
    // Fetch dynamic courses
    const { data: courses } = await dbService.getAllCourses();
    const activeCourses = courses || [];
    
    // 1. Languages Count
    const uniqueLangs = new Set<string>();
    activeCourses.forEach(c => {
      c.languages?.forEach((l: string) => uniqueLangs.add(l.toLowerCase()));
    });
    // Default to 2 languages only if we had an error and no courses array was fetched
    const totalLanguages = courses !== null ? uniqueLangs.size : 2;
    
    // 2. Curricula Count (Only count active curricula)
    const totalCurricula = courses !== null ? activeCourses.filter((c: any) => c.is_active).length : 10;
    
    // 3. Total Courses/Lessons Count
    const mdxCount = countUniqueMdxLessons();
    const totalCourses = mdxCount > 0 ? mdxCount : 0;
 
    // 4. Fetch dynamic student stats
    const { data: dbUsers } = await dbService.getUsers();
    const activeUsers = dbUsers || [];
    const totalStudents = dbUsers !== null ? activeUsers.length : 11;
 
    // 5. Dynamic Validation Rate based on user levels
    const avgLevel = activeUsers.length > 0
      ? activeUsers.reduce((acc: number, u: any) => acc + (u.level || 0), 0) / activeUsers.length
      : 0;
    const validationRate = dbUsers !== null ? (activeUsers.length > 0 ? Math.min(100, Math.round(avgLevel * 7.5)) : 0) : 84;
    
    return NextResponse.json({
      total_languages: totalLanguages,
      total_curricula: totalCurricula,
      total_courses: totalCourses,
      total_students: totalStudents,
      validation_rate: validationRate
    });
  } catch (error) {
    console.error("Error generating dynamic stats:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
