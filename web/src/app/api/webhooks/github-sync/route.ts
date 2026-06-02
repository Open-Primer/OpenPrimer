import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import matter from 'gray-matter';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');

// Webhook shared secret
const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
const githubToken = process.env.GITHUB_ACCESS_TOKEN;
const githubOwner = process.env.GITHUB_OWNER;
const githubRepo = process.env.GITHUB_REPO;

/**
 * Verify GitHub webhook cryptographic SHA-256 signature
 */
function verifySignature(payload: string, signature: string | null): boolean {
  if (!webhookSecret) {
    console.warn('⚠️ GITHUB_WEBHOOK_SECRET is not defined. Skipping signature verification.');
    return true; // Dev mode / bypass if not configured
  }
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', webhookSecret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/**
 * Increments the course version string.
 * Supports semver (e.g. 1.0.4 -> 1.0.5) or integer versions (e.g. 1 -> 2).
 */
function incrementVersion(currentVersion: string | null | undefined): string {
  if (!currentVersion) return '1.0.0';

  const parts = currentVersion.split('.');
  if (parts.length === 3) {
    const patch = parseInt(parts[2], 10);
    if (!isNaN(patch)) {
      parts[2] = String(patch + 1);
      return parts.join('.');
    }
  }

  const intVersion = parseInt(currentVersion, 10);
  if (!isNaN(intVersion)) {
    return String(intVersion + 1);
  }

  return currentVersion + '-rev';
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256');

    // 1. Cryptographic Verification
    if (!verifySignature(rawBody, signature)) {
      console.warn('🚨 Unauthorized Webhook Access: Invalid signature.');
      return NextResponse.json({ error: 'Unauthorized: Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // 2. We only track pushes on the main branch
    const branchRef = payload.ref || '';
    if (branchRef !== 'refs/heads/main' && branchRef !== 'refs/heads/master') {
      return NextResponse.json({ message: `Ignored push to non-main branch: ${branchRef}` }, { status: 200 });
    }

    const commits = payload.commits || [];
    const modifiedFiles = new Set<string>();
    const addedFiles = new Set<string>();
    const removedFiles = new Set<string>();

    // 3. Scan commits to extract file modifications under content/
    for (const commit of commits) {
      (commit.added || []).forEach((f: string) => {
        if (f.startsWith('content/') && f.endsWith('.mdx')) addedFiles.add(f);
      });
      (commit.modified || []).forEach((f: string) => {
        if (f.startsWith('content/') && f.endsWith('.mdx')) modifiedFiles.add(f);
      });
      (commit.removed || []).forEach((f: string) => {
        if (f.startsWith('content/') && f.endsWith('.mdx')) removedFiles.add(f);
      });
    }

    // Clean overlaps (if added then deleted in same push, ignore)
    removedFiles.forEach(f => {
      addedFiles.delete(f);
      modifiedFiles.delete(f);
    });

    console.log(`📡 Processing GitHub Sync webhook. Added: ${addedFiles.size}, Modified: ${modifiedFiles.size}, Removed: ${removedFiles.size}`);

    // Track which course slugs had modified lessons, to increment their version numbers
    const modifiedCourseSlugs = new Set<string>();

    // 4. Process File Removals (Deletions / Archivals)
    for (const file of Array.from(removedFiles)) {
      const parts = file.replace('content/', '').split('/');
      if (parts.length >= 4) {
        const courseSlug = parts[2];
        const fileName = parts[parts.length - 1];
        const matches = fileName.match(/^(.*?)\.([a-z]{2})\.mdx$/i);
        if (matches) {
          const lessonSlug = matches[1];
          const lang = matches[2].toLowerCase();

          console.log(`🗑️ Deleting lesson "${lessonSlug}" (${lang}) from database...`);
          await supabase
            .from('lessons')
            .delete()
            .match({ course_slug: courseSlug, lesson_slug: lessonSlug, lang: lang });

          modifiedCourseSlugs.add(courseSlug.toLowerCase());
        }
      }
    }

    // 5. Process File Modifications & Additions (Fetch & Upsert)
    const activeChanges = Array.from(new Set([...Array.from(addedFiles), ...Array.from(modifiedFiles)]));
    for (const file of activeChanges) {
      const parts = file.replace('content/', '').split('/');
      if (parts.length >= 4) {
        const courseSlug = parts[2];
        const fileName = parts[parts.length - 1];
        const matches = fileName.match(/^(.*?)\.([a-z]{2})\.mdx$/i);
        if (matches) {
          const lessonSlug = matches[1];
          const lang = matches[2].toLowerCase();

          // Fetch raw contents from GitHub
          const rawUrl = `https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/main/${file}`;
          const headers: Record<string, string> = {
            'Accept': 'text/plain',
            'User-Agent': 'OpenPrimer-Sync-Agent',
          };
          if (githubToken) {
            headers['Authorization'] = `Bearer ${githubToken}`;
          }

          const response = await fetch(rawUrl, { headers });
          if (response.status !== 200) {
            console.error(`🚨 Failed to fetch raw file content from GitHub for ${file}. Status: ${response.status}`);
            continue;
          }

          const fileContent = await response.text();

          // Parse MDX frontmatter
          const { data: frontmatter } = matter(fileContent);
          const title = frontmatter.title || lessonSlug.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

          console.log(`⏳ Synchronizing lesson "${lessonSlug}" (${lang}) in database...`);
          const { error } = await supabase
            .from('lessons')
            .upsert({
              course_slug: courseSlug,
              lesson_slug: lessonSlug,
              lang: lang,
              title: title,
              content: fileContent
            }, {
              onConflict: 'course_slug,lesson_slug,lang'
            });

          if (error) {
            console.error(`🚨 Supabase sync failed for ${file}:`, error.message);
          } else {
            console.log(`✅ Successfully synced lesson "${lessonSlug}" (${lang}).`);
            modifiedCourseSlugs.add(courseSlug.toLowerCase());
          }
        }
      }
    }

    // 6. Update Course Versions and Last Revision Dates in Supabase (Versioning)
    for (const courseSlug of Array.from(modifiedCourseSlugs)) {
      console.log(`📈 Incrementing version for course "${courseSlug}"...`);
      
      const { data: course, error: queryError } = await supabase
        .from('courses')
        .select('version')
        .eq('slug', courseSlug)
        .single();

      if (queryError || !course) {
        console.warn(`⚠️ Could not query course metadata for "${courseSlug}" to update version. Error:`, queryError?.message);
        continue;
      }

      const nextVersion = incrementVersion(course.version);
      const { error: updateError } = await supabase
        .from('courses')
        .update({
          version: nextVersion,
          last_revision_date: new Date().toISOString()
        })
        .eq('slug', courseSlug);

      if (updateError) {
        console.error(`🚨 Failed to update course version for "${courseSlug}":`, updateError.message);
      } else {
        console.log(`🎉 Course "${courseSlug}" version successfully bumped to "${nextVersion}".`);
      }
    }

    return NextResponse.json({
      success: true,
      processed_commits: commits.length,
      synced_courses: Array.from(modifiedCourseSlugs)
    }, { status: 200 });

  } catch (error: any) {
    console.error('🚨 Webhook sync controller crash:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
