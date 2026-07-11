import './load-env';
import * as fs from 'fs';
import * as path from 'path';

import { stitchLessonContent, validateMdxContent } from '../src/lib/ai';
import { preprocessMdx } from '../src/lib/content';
import { resolveAndPersistMedia } from '../src/lib/media-resolver';
import { dbService } from '../src/lib/db';
import { cleanPathSegment } from '../src/lib/translations';

function stripOuterCodeFences(content: string): string {
  if (!content) return '';
  let clean = content.trim();
  if (clean.startsWith('```markdown') && clean.endsWith('```')) {
    clean = clean.substring(11, clean.length - 3).trim();
  } else if (clean.startsWith('```mdx') && clean.endsWith('```')) {
    clean = clean.substring(6, clean.length - 3).trim();
  } else if (clean.startsWith('```') && clean.endsWith('```')) {
    clean = clean.substring(3, clean.length - 3).trim();
  }
  return clean;
}

function parseFrontmatter(content: string) {
  const cleanContent = stripOuterCodeFences(content);
  const meta: Record<string, any> = {};
  
  if (cleanContent.startsWith('---')) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
    const match = cleanContent.match(frontmatterRegex);
    if (match) {
      const yamlContent = match[1];
      const lines = yamlContent.split(/\r?\n/);
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let val = line.substring(colonIndex + 1).trim();
          
          // Clean standard and French quotes
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          if (val.startsWith('« ') && val.endsWith(' »')) val = val.slice(2, -2);
          if (val.startsWith('«') && val.endsWith('»')) val = val.slice(1, -1);
          
          meta[key] = val.trim();
        }
      }
    }
  }
  
  return meta;
}

async function run() {
  const draftsDir = path.join(process.cwd(), 'drafts_revisions');
  if (!fs.existsSync(draftsDir)) {
    console.error(`Drafts directory not found: ${draftsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(draftsDir);
  const narrativeFiles = files.filter(f => f.startsWith('final_reconstructed_narrative_') && f.endsWith('.md'));
  
  console.log(`Found ${narrativeFiles.length} narrative drafts to restitch.`);
  
  let successCount = 0;
  let failCount = 0;

  for (const narrativeFile of narrativeFiles) {
    const slug = narrativeFile.replace('final_reconstructed_narrative_', '').replace('.md', '');
    console.log(`\n--------------------------------------------------`);
    console.log(`Processing slug: ${slug}`);
    
    const narrativePath = path.join(draftsDir, narrativeFile);
    const widgetsPath = path.join(draftsDir, `final_stage2_widgets_${slug}.json`);
    const stitchedPath = path.join(draftsDir, `final_stage3_stitched_${slug}.mdx`);
    
    // Check if stitched file exists to extract original metadata frontmatter
    if (!fs.existsSync(stitchedPath)) {
      console.warn(`⚠️ Stitched file does not exist at ${stitchedPath}. Skipping metadata extraction.`);
      continue;
    }
    
    const existingStitchedContent = fs.readFileSync(stitchedPath, 'utf-8');
    const meta = parseFrontmatter(existingStitchedContent);
    
    if (!meta.title || !meta.subject) {
      console.error(`❌ Could not extract title or subject metadata from ${stitchedPath}.`);
      failCount++;
      continue;
    }
    
    console.log(`Extracted metadata: "${meta.title}" | Subject: "${meta.subject}" | Level: "${meta.level || 'L3'}"`);

    // Read narrative MD
    const narrativeMdx = fs.readFileSync(narrativePath, 'utf-8');
    
    // Read widgets JSON
    let parsedWidgets: any = {};
    if (fs.existsSync(widgetsPath)) {
      try {
        const widgetsRaw = fs.readFileSync(widgetsPath, 'utf-8');
        parsedWidgets = JSON.parse(widgetsRaw);
        console.log(`Loaded widgets from ${widgetsPath}`);
      } catch (e: any) {
        console.error(`❌ Failed to parse widgets JSON at ${widgetsPath}:`, e.message);
        failCount++;
        continue;
      }
    } else {
      console.warn(`⚠️ Widgets JSON file not found at ${widgetsPath}. Stitched with empty widgets.`);
    }

    const isTerminalEvaluation = slug === 'evaluation-finale' || slug === 'final-evaluation' || slug === 'evaluation-terminale';
    const isSummative = meta.summative === 'true' || meta.summative === true;

    // 1. Stitch narrative and widgets
    let stitchedContent = stitchLessonContent(narrativeMdx, parsedWidgets, isTerminalEvaluation);
    
    // 2. Wrap with frontmatter
    let mdxWithFrontmatter = `---
title: "${meta.title}"
subject: "${meta.subject}"
level: "${meta.level || 'L3'}"
module: "${meta.module || meta.title}"
order: ${meta.order || 1}${isSummative ? '\nsummative: true' : ''}
---

${stitchedContent}`;

    // 3. Apply preprocessMdx (WFTA normalization layer)
    const preprocessedMdx = preprocessMdx(mdxWithFrontmatter, 'fr', isSummative, slug);
    
    // 4. Resolve media resources
    console.log(`Resolving media for: ${slug}`);
    const resolvedMdx = await resolveAndPersistMedia(preprocessedMdx, 'fr');
    
    // 5. Save back to drafts directory
    fs.writeFileSync(stitchedPath, resolvedMdx, 'utf-8');
    console.log(`💾 Saved stitched file to ${stitchedPath}`);

    // 6. Save to Supabase DB
    const cleanCrsSlug = cleanPathSegment(meta.subject);
    const cleanLsnSlug = cleanPathSegment(slug);
    console.log(`Saving to Supabase. Course: "${cleanCrsSlug}", Lesson: "${cleanLsnSlug}"`);
    try {
      const dbResult = await dbService.saveLesson({
        course_slug: cleanCrsSlug,
        lesson_slug: cleanLsnSlug,
        lang: 'fr',
        title: meta.title,
        content: resolvedMdx,
        order: Number(meta.order || 1)
      });
      if (dbResult.error) {
        throw dbResult.error;
      }
      console.log(`✅ Successfully saved to Supabase.`);
    } catch (dbErr: any) {
      console.error(`❌ Failed to save to Supabase:`, dbErr.message || dbErr);
      failCount++;
      continue;
    }

    // 7. Validate MDX parsing
    console.log(`Validating MDX rendering integrity...`);
    const validationResult = await validateMdxContent(resolvedMdx, 'fr');
    if (!validationResult.success) {
      console.error(`❌ MDX validation FAILED:`, validationResult.error);
      failCount++;
    } else {
      console.log(`✅ MDX validation PASSED!`);
      successCount++;
    }
  }

  console.log(`\n==================================================`);
  console.log(`Stitching completed: ${successCount} successful, ${failCount} failed.`);
  console.log(`==================================================`);
  if (failCount > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error(`Fatal error in restitch runner:`, err);
  process.exit(1);
});
