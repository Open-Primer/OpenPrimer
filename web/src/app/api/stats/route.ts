import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { isRateLimited } from '@/lib/rateLimit';
import fs from 'fs';
import path from 'path';

let cachedMdxCount: number | null = null;
let lastScanTime = 0;
const CACHE_TTL = 300000; // 5 minutes

function countUniqueMdxLessons(): number {
  const now = Date.now();
  if (cachedMdxCount !== null && now - lastScanTime < CACHE_TTL) {
    return cachedMdxCount;
  }

  const contentPath = path.join(process.cwd(), '../content');
  if (!fs.existsSync(contentPath)) return 0;
  
  const uniqueLessons = new Set<string>();
  
  function scan(dir: string) {
    try {
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
    } catch (e) {
      console.warn("Scan warning for content directory:", e);
    }
  }
  
  try {
    scan(contentPath);
    cachedMdxCount = uniqueLessons.size;
    lastScanTime = now;
    return cachedMdxCount;
  } catch (err) {
    console.error("Error scanning MDX content:", err);
    return cachedMdxCount ?? 0;
  }
}

export async function GET(req: NextRequest) {
  // Rate limit: 60 req/min per IP (public aggregate data)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  if (await isRateLimited(ip, 60, 60000, 'stats')) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    // Fetch dynamic courses
    const { data: courses } = await dbService.getAllCourses();
    const activeCourses = courses || [];
    
    // 1. Languages Count
    const uniqueLangs = new Set<string>();
    activeCourses.forEach(c => {
      c.languages?.forEach((l: string) => uniqueLangs.add(l.toLowerCase()));
    });
    // Default to 0 languages if no courses fetched
    const totalLanguages = courses !== null ? uniqueLangs.size : 0;
    
    // 2. Curricula Count (Only count active curricula)
    const totalCurricula = courses !== null ? activeCourses.filter((c: any) => c.is_active).length : 0;
    
    // 3. Total Courses/Lessons Count
    const mdxCount = countUniqueMdxLessons();
    const totalCourses = mdxCount > 0 ? mdxCount : 0;
 
    // 4. Fetch dynamic student stats
    const { data: dbUsers } = await dbService.getUsers();
    const activeUsers = dbUsers || [];
    const totalStudents = dbUsers !== null ? activeUsers.length : 0;
 
    // 5. Dynamic Validation Rate based on user validations
    const usersWithValidations = activeUsers.filter((u: any) => (u.level && u.level > 1) || (u.kp && u.kp > 0)).length;
    const validationRate = dbUsers !== null ? (totalStudents > 0 ? Math.round((usersWithValidations / totalStudents) * 100) : 0) : 0;

    // 6. Dynamic Platform Rating
    const { data: feedbacks } = await dbService.getCourseFeedbacks();
    const activeFeedbacks = feedbacks || [];
    const ratingCount = activeFeedbacks.length;
    const averageRating = ratingCount > 0
      ? activeFeedbacks.reduce((acc: number, f: any) => acc + f.rating, 0) / ratingCount
      : 0;
    const platformRating = ratingCount > 0 ? `${averageRating.toFixed(1)}/5` : "0.0/5";
    
    return NextResponse.json({
      total_languages: totalLanguages,
      total_curricula: totalCurricula,
      total_courses: totalCourses,
      total_students: totalStudents,
      validation_rate: validationRate,
      platform_rating: platformRating
    });
  } catch (error) {
    console.error('[STATS ERROR]', error);
    return NextResponse.json({ error: 'Unable to load stats' }, { status: 500 });
  }
}
