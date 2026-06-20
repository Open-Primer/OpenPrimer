import './env-loader';
import path from 'path';
import fs from 'fs';
import { supabaseAdmin } from '../src/lib/supabase';
import { preprocessMdx } from '../src/lib/content';

interface AuditIssue {
  type: string;
  detail: string;
}

interface LessonAuditResult {
  id: string;
  course_slug: string;
  lesson_slug: string;
  lang: string;
  title: string;
  isCompliant: boolean;
  issues: AuditIssue[];
  originalContent: string;
  normalizedContent: string;
  wasUpdated: boolean;
}

async function run() {
  const normalizeMode = process.argv.includes('--normalize');
  console.log(`=== STARTING MDX AUDIT ${normalizeMode ? '(WITH NORMALIZATION)' : '(READ-ONLY AUDIT)'} ===`);

  // Fetch all lessons
  const { data: lessons, error } = await supabaseAdmin
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, title, content, order');

  if (error || !lessons) {
    console.error("[-] Error fetching lessons:", error);
    process.exit(1);
  }

  console.log(`[+] Fetched ${lessons.length} lessons from the database.`);

  const results: LessonAuditResult[] = [];

  for (const lesson of lessons) {
    const issues: AuditIssue[] = [];
    const content = lesson.content || '';

    // 1. Audit Check: Check for nested / non-self-closing Option tags: <Option ...>Text</Option>
    const legacyOptionRegex = /<Option\b([^>]*?)>([\s\S]*?)<\/Option>/gi;
    let match;
    while ((match = legacyOptionRegex.exec(content)) !== null) {
      const attrs = match[1];
      const textVal = match[2].trim();
      issues.push({
        type: 'Legacy Nested Option',
        detail: `Found nested Option tag with body "${textVal}" and attributes: ${attrs.trim()}`
      });
    }

    // 2. Audit Check: Check for non-self-closing Option tags without closing tag but also no self-closing slash
    const unclosedOptionRegex = /<Option\b([^>]*?)(?<!\/)>/gi;
    let match2;
    while ((match2 = unclosedOptionRegex.exec(content)) !== null) {
      const fullTag = match2[0];
      // If it doesn't end with /> and there's no closing </Option> nearby, it's malformed
      if (!fullTag.endsWith('/>') && !content.slice(match2.index).match(/^<Option[\s\S]*?>[\s\S]*?<\/Option>/i)) {
        issues.push({
          type: 'Malformed Option Tag',
          detail: `Found non-self-closing Option tag: "${fullTag}"`
        });
      }
    }

    // 3. Audit Check: Check for Option tags missing correct attribute
    const optionTags = content.match(/<Option\b[^>]*\/?>/gi) || [];
    for (const tag of optionTags) {
      if (!tag.includes('correct=')) {
        issues.push({
          type: 'Missing Correct Attribute',
          detail: `Option tag does not define 'correct' property: ${tag}`
        });
      }
      // Check for Flat-Prop text attribute:
      if (!tag.includes('text=') && tag.endsWith('/>')) {
        issues.push({
          type: 'Missing Text Attribute',
          detail: `Self-closing Option tag lacks 'text' attribute: ${tag}`
        });
      }
    }

    // 4. Audit Check: Check for placeholder text
    const lowerContent = content.toLowerCase();
    const placeholders = ['lorem ipsum', '[placeholder]', '[à compléter]', 'insérer ici', '... pour compléter', 'example to complete'];
    for (const placeholder of placeholders) {
      if (lowerContent.includes(placeholder)) {
        issues.push({
          type: 'Placeholder Content',
          detail: `Found placeholder term: "${placeholder}"`
        });
      }
    }

    const isCompliant = issues.length === 0;
    const normalized = preprocessMdx(content, lesson.lang);
    const contentDiffers = normalized !== content;

    let wasUpdated = false;
    if (normalizeMode && contentDiffers) {
      console.log(`[*] Normalizing and updating lesson: "${lesson.title}" (${lesson.course_slug}/${lesson.lesson_slug}) [${lesson.lang}]`);
      const { error: updateErr } = await supabaseAdmin
        .from('lessons')
        .update({ content: normalized })
        .eq('id', lesson.id);

      if (updateErr) {
        console.error(`[-] Failed to update lesson ${lesson.id}:`, updateErr);
      } else {
        wasUpdated = true;
      }
    }

    results.push({
      id: lesson.id,
      course_slug: lesson.course_slug,
      lesson_slug: lesson.lesson_slug,
      lang: lesson.lang,
      title: lesson.title,
      isCompliant,
      issues,
      originalContent: content,
      normalizedContent: normalized,
      wasUpdated
    });
  }

  // Generate Report
  const totalLessons = results.length;
  const nonCompliant = results.filter(r => !r.isCompliant);
  const updatedCount = results.filter(r => r.wasUpdated).length;

  console.log(`\n=== AUDIT SUMMARY ===`);
  console.log(`Total Lessons Audited: ${totalLessons}`);
  console.log(`Non-Compliant Lessons found: ${nonCompliant.length}`);
  console.log(`Lessons Updated/Normalized: ${updatedCount}`);

  // Create Markdown Report
  let report = `# MDX Compliance & Normalization Audit Report

**Date:** ${new Date().toISOString()}
**Normalize Mode:** ${normalizeMode ? 'ENABLED (Database updated)' : 'DISABLED (Read-only)'}

## Summary Metrics
| Metric | Count |
| :--- | :--- |
| **Total Lessons Audited** | ${totalLessons} |
| **Compliant Lessons** | ${totalLessons - nonCompliant.length} |
| **Non-Compliant Lessons** | ${nonCompliant.length} |
| **Lessons Normalized/Updated** | ${updatedCount} |

## Audit Details by Lesson
`;

  if (nonCompliant.length === 0) {
    report += `\n🎉 **All lessons are 100% compliant with the Flat-Prop JSX specification and pedagogical quality guidelines!**\n`;
  } else {
    report += `\n### Non-Compliant Lessons:\n`;
    for (const r of nonCompliant) {
      report += `\n### 📘 ${r.title} (\`${r.lang}\`)
- **Course:** \`${r.course_slug}\`
- **Lesson Slug:** \`${r.lesson_slug}\`
- **Updated in DB:** ${r.wasUpdated ? '✅ Yes (Normalized)' : '❌ No'}
- **Detected Issues:**
${r.issues.map(iss => `  - **[${iss.type}]** ${iss.detail}`).join('\n')}
`;
    }
  }

  const reportPath = path.join(__dirname, '../artifacts/audit_results.md');
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`[+] Audit report written to artifacts/audit_results.md`);
}

run().catch(console.error);
