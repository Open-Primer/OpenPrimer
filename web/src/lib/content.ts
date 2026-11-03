import matter from './matter';
import {
  cleanPathSegment,
  getLocalizedLevelSlug,
  getCanonicalLevelFromSlug,
  getLocalizedSubjectSlug,
  getCanonicalSubjectFromSlug,
  sanitizeMetadataValue,
} from './translations';
import { repairMediaOnRestitution } from './media-resolver';
import { supabase, supabaseAdmin } from './supabase';
import { dbService } from './db';
import {
  stripOuterCodeFences,
  checkWikipediaPage,
  enrichGlossaryWithWikipediaLinks,
  reorderMdxSections,
} from './content/glossary-wikipedia';
import {
  type WikiDetails,
  parseLocalGlossary,
  cleanWikipediaUrl,
  resolveWikiDetails,
  patchEntityAttrsIntoSource,
  enrichEntityTagsWithWikipedia,
  resolvePrecompiledAnchors,
} from './content/wikipedia-enricher';
import {
  cleanGlossaryDefinition,
  healFrenchElisions,
  healEnglishContractions,
  healSpanishPhonotactics,
  healItalianElisions,
  healChinesePunctuation,
  healRtlBiDiAndZwnj,
  healLinguisticContent,
} from './content/linguistic-healers';
import {
  type RegistryEntry,
  isolateJsxForTranslation,
  restoreJsxAfterTranslation,
} from './content/jsx-translation-isolator';
import {
  rehypeMdxSanitizer,
  extractJsxTags,
  healCorruptedAttributes,
} from './content/rehype-mdx-sanitizer';
import { preprocessMdxStage1 } from './content/mdx-preprocess-stage1';
import { preprocessMdxStage2 } from './content/mdx-preprocess-stage2';
import { preprocessMdxStage3 } from './content/mdx-preprocess-stage3';

export * from './content/mdx-healers';
export {
  parseLocalGlossary,
  stripOuterCodeFences,
  checkWikipediaPage,
  enrichGlossaryWithWikipediaLinks,
  reorderMdxSections,
  cleanGlossaryDefinition,
  healFrenchElisions,
  healEnglishContractions,
  healSpanishPhonotactics,
  healItalianElisions,
  healChinesePunctuation,
  healRtlBiDiAndZwnj,
  healLinguisticContent,
  isolateJsxForTranslation,
  restoreJsxAfterTranslation,
  cleanWikipediaUrl,
  resolveWikiDetails,
  patchEntityAttrsIntoSource,
  enrichEntityTagsWithWikipedia,
  resolvePrecompiledAnchors,
  rehypeMdxSanitizer,
  extractJsxTags,
  healCorruptedAttributes,
};
export type { WikiDetails, RegistryEntry };

export function parseAndStripFrontmatter(content: string) {
  content = stripOuterCodeFences(content);
  const meta: Record<string, unknown> = {};
  let body = content;
  
  while (true) {
    body = body.trim();
    if (!body.startsWith('---')) {
      break;
    }
    
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
    const match = body.match(frontmatterRegex);
    if (match) {
      body = body.substring(match[0].length);
      const yamlContent = match[1];
      const lines = yamlContent.split(/\r?\n/);
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let val = line.substring(colonIndex + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          meta[key] = val;
        }
      }
    } else {
      const relaxedRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
      const relaxedMatch = body.match(relaxedRegex);
      if (relaxedMatch) {
        body = body.substring(relaxedMatch[0].length);
        const yamlContent = relaxedMatch[1];
        const lines = yamlContent.split(/\r?\n/);
        for (const line of lines) {
          const colonIndex = line.indexOf(':');
          if (colonIndex !== -1) {
            const key = line.substring(0, colonIndex).trim();
            let val = line.substring(colonIndex + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.substring(1, val.length - 1);
            }
            meta[key] = val;
          }
        }
      } else {
        if (body.startsWith('---') && (body.length === 3 || body[3] === '\n' || body[3] === '\r')) {
          body = body.substring(3).trim();
        }
        break;
      }
    }
  }
  
  return { meta, body };
}

export function getLocalizedCoreModuleText(currentLang: string) {
  const l = (currentLang || 'en').toLowerCase();
  if (l === 'fr') return "Module Principal";
  if (l === 'es') return "Módulo Principal";
  if (l === 'de') return "Kernmodul";
  if (l === 'zh') return "核心模块";
  return "Core Module";
}

export interface NavItem {
  name: string;
  type: 'folder' | 'file';
  path: string;
  children?: NavItem[];
}

export async function getNavigationTree(dir = '', lang: string = 'en'): Promise<NavItem[]> {
  dir = decodeURIComponent(dir);
  const parts = dir.split('/').map(s => s ? cleanPathSegment(s) : s);
  
  if (parts.length === 3) {
    const [rawLevel, rawSubject, courseSlug] = parts;
    const canonicalLevel = getCanonicalLevelFromSlug(rawLevel, lang);
    const canonicalSubject = getCanonicalSubjectFromSlug(rawSubject, lang);
    const level = getLocalizedLevelSlug(canonicalLevel, lang);
    const subject = getLocalizedSubjectSlug(canonicalSubject, lang);
    
    let resolvedSandboxAllowed = false;
    try {
      const nextHeaders = await import('next/headers');
      const cookieStore = await nextHeaders.cookies();
      if (cookieStore.get('op_mock_archiving_levels')?.value || cookieStore.get('op_allow_sandbox')?.value === 'true') {
        resolvedSandboxAllowed = true;
      }
    } catch {}

    if (resolvedSandboxAllowed) {
      if (courseSlug.toLowerCase() === 'classical_mechanics') {
        return [{
          name: "Newton's Laws of Motion",
          type: 'file',
          path: '/' + [level, subject, courseSlug, 'newtons_laws_of_motion'].join('/')
        }];
      }
      if (courseSlug.toLowerCase() === 'geographie_physique_et_climatologie') {
        return [{
          name: "Évaluation Terminale",
          type: 'file',
          path: '/' + [level, subject, courseSlug, 'evaluation-terminale'].join('/')
        }];
      }
      if (courseSlug.toLowerCase() === 'test_widgets') {
        return [{
          name: "4. Évaluations, Quiz & Feedback Interactifs",
          type: 'file',
          path: '/' + [level, subject, courseSlug, 'evaluations_quiz'].join('/')
        }];
      }
      if (courseSlug.toLowerCase() === 'cryptography') {
        const lessons = lang.toLowerCase() === 'es' ? [
          { name: "1. Cifrados Históricos y Fundamentos", slug: "historical_ciphers" },
          { name: "2. Cifrado Simétrico y Entropía", slug: "symmetric_algorithms" },
          { name: "3. Criptografía de Clave Pública e Intercambio de Claves", slug: "asymmetric_key_exchange" },
          { name: "4. El Criptosistema RSA y Firmas Digitales", slug: "asymmetric_rsa" },
          { name: "5. Evaluación Final Sumativa", slug: "final_evaluation" }
        ] : [
          { name: "1. Historical Ciphers & Foundations", slug: "historical_ciphers" },
          { name: "2. Symmetric Encryption & Entropy", slug: "symmetric_algorithms" },
          { name: "3. Public Key Cryptography & Key Exchange", slug: "asymmetric_key_exchange" },
          { name: "4. The RSA Cryptosystem & Digital Signatures", slug: "asymmetric_rsa" },
          { name: "5. Final Summative Evaluation", slug: "final_evaluation" }
        ];
        return lessons.map(l => ({
          name: l.name,
          type: 'file',
          path: '/' + [level, subject, courseSlug, l.slug].join('/')
        }));
      }
      return [{
        name: "Introduction",
        type: 'file',
        path: '/' + [level, subject, courseSlug, 'introduction'].join('/')
      }];
    }

    try {
      const { data: dbLessons } = await supabase
        .from('lessons')
        .select('lesson_slug, title')
        .ilike('course_slug', courseSlug)
        .eq('lang', lang.toLowerCase())
        .order('order', { ascending: true });
      
      if (dbLessons && dbLessons.length > 0) {
        return dbLessons.map((l: { lesson_slug: string; title: string | null }) => ({
          name: l.title || l.lesson_slug.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase()),
          type: 'file',
          path: '/' + [level, subject, courseSlug, l.lesson_slug].join('/')
        }));
      }
    } catch (err) {
      console.error("[Navigation Tree DB] Failed to fetch lessons from database:", err);
    }
    // Return empty list if no lessons found in the requested language
    return [];
  }

  return [];
}

export async function getPageContent(slug: string[], lang: string = 'en', strict: boolean = false) {
  slug = slug.map(s => cleanPathSegment(decodeURIComponent(s)));
  if (slug.length >= 3) {
    const courseSlug = slug[2];
    const lessonSlug = slug[3] || 'introduction';
    try {
      // 1. Try exact language match
      const { data: dbLesson } = await dbService.getLesson(courseSlug, lessonSlug, lang);
      if (dbLesson) {
        const cleanedContent = stripOuterCodeFences(dbLesson.content);
        const { meta: manualMeta, body: cleanBody } = parseAndStripFrontmatter(cleanedContent);
        const { data: meta } = matter(cleanedContent);
        
        // Dynamic Media Link Repair (YouTube, Audio, Images)
        const repairedBody = await repairMediaOnRestitution(cleanBody, lang);
        if (repairedBody !== cleanBody) {
          const newDbContent = matter.stringify(repairedBody, meta || {});
          supabaseAdmin
            .from('lessons')
            .update({ content: newDbContent })
            .ilike('course_slug', courseSlug)
            .ilike('lesson_slug', lessonSlug)
            .eq('lang', lang.toLowerCase())
            .then(({ error }: { error: { message: string } | null }) => {
              if (error) {
                console.error("[Media Repair] Failed to update lesson in database:", error);
              } else {
                console.log(`[Media Repair] Successfully updated lesson in database for ${courseSlug}/${lessonSlug}`);
              }
            });
        }

        const isSummative = !!(meta?.summative === true || meta?.summative === 'true' || manualMeta?.summative === 'true' || manualMeta?.summative === true);
        const processedContent = preprocessMdx(repairedBody, lang, isSummative, lessonSlug, dbLesson.order);
        const { resolvedContent } = await resolvePrecompiledAnchors(processedContent, lang);

        // Run glossary enrichment FIRST so local definitions are available for entity tag resolution
        const metaSubject = sanitizeMetadataValue(meta.subject || manualMeta.subject || getCanonicalSubjectFromSlug(slug[1], lang));
        const glossaryEnriched = await enrichGlossaryWithWikipediaLinks(resolvedContent, lang);
        const enrichedEntities = await enrichEntityTagsWithWikipedia(glossaryEnriched, lang, metaSubject);

        // Write enriched entity attributes back to DB asynchronously.
        // We patch the attrs into the original repairedBody (pre-preprocessMdx) so the
        // stored content stays processable on next load without double-transformation.
        if (enrichedEntities !== glossaryEnriched) {
          const patchedSource = patchEntityAttrsIntoSource(repairedBody, enrichedEntities);
          if (patchedSource !== repairedBody) {
            const enrichedDbContent = matter.stringify(patchedSource, meta || {});
            supabaseAdmin
              .from('lessons')
              .update({ content: enrichedDbContent })
              .ilike('course_slug', courseSlug)
              .ilike('lesson_slug', lessonSlug)
              .eq('lang', lang.toLowerCase())
              .then(({ error }: { error: { message: string } | null }) => {
                if (error) console.error('[Entity Enrichment] DB write-back failed:', error);
                else console.log(`[Entity Enrichment] Wrote enriched entity attrs to DB for ${courseSlug}/${lessonSlug}`);
              });
          }
        }

        const enriched = healCorruptedAttributes(healLinguisticContent(enrichedEntities, lang));
        return {
          meta: {
            title: sanitizeMetadataValue(dbLesson.title || meta.title || manualMeta.title || lessonSlug.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())),
            subject: metaSubject,
            level: sanitizeMetadataValue(meta.level || manualMeta.level || getCanonicalLevelFromSlug(slug[0], lang)),
            module: sanitizeMetadataValue(meta.module || manualMeta.module || getLocalizedCoreModuleText(lang))
          },
          content: enriched
        };
      }

      if (strict) {
        return null;
      }

      // 2. Fallback: lesson exists in DB but in a different language — fetch any available lang
      const { data: fallbackLesson } = await supabase
        .from('lessons')
        .select('*')
        .ilike('course_slug', courseSlug)
        .ilike('lesson_slug', lessonSlug)
        .limit(1)
        .single();

      if (fallbackLesson) {
        console.log(`[Page Content DB] Falling back to lang '${fallbackLesson.lang}' for ${courseSlug}/${lessonSlug} (requested: ${lang})`);
        const cleanedContent = stripOuterCodeFences(fallbackLesson.content);
        const { meta: manualMeta, body: cleanBody } = parseAndStripFrontmatter(cleanedContent);
        const { data: meta } = matter(cleanedContent);

        // Dynamic Media Link Repair (YouTube, Audio, Images) for fallback lang
        const repairedBody = await repairMediaOnRestitution(cleanBody, fallbackLesson.lang || lang);
        if (repairedBody !== cleanBody) {
          const newDbContent = matter.stringify(repairedBody, meta || {});
          supabaseAdmin
            .from('lessons')
            .update({ content: newDbContent })
            .ilike('course_slug', courseSlug)
            .ilike('lesson_slug', lessonSlug)
            .eq('lang', fallbackLesson.lang)
            .then(({ error }: { error: { message: string } | null }) => {
              if (error) {
                console.error("[Media Repair Fallback] Failed to update database:", error);
              } else {
                console.log(`[Media Repair Fallback] Successfully updated lesson in database for ${courseSlug}/${lessonSlug}`);
              }
            });
        }

        const isSummative = !!(meta?.summative === true || meta?.summative === 'true' || manualMeta?.summative === 'true' || manualMeta?.summative === true);
        const activeLang = fallbackLesson.lang || lang;
        const processedContent = preprocessMdx(repairedBody, activeLang, isSummative, lessonSlug, fallbackLesson.order);
        const { resolvedContent } = await resolvePrecompiledAnchors(processedContent, activeLang);

        // Run glossary enrichment FIRST so local definitions are available for entity tag resolution
        const fbMetaSubject = sanitizeMetadataValue(meta.subject || manualMeta.subject || getCanonicalSubjectFromSlug(slug[1], lang));
        const fbGlossaryEnriched = await enrichGlossaryWithWikipediaLinks(resolvedContent, activeLang);
        const enrichedEntities = await enrichEntityTagsWithWikipedia(fbGlossaryEnriched, activeLang, fbMetaSubject);

        // Write enriched entity attributes back to DB asynchronously (fallback lang).
        if (enrichedEntities !== fbGlossaryEnriched) {
          const patchedSource = patchEntityAttrsIntoSource(repairedBody, enrichedEntities);
          if (patchedSource !== repairedBody) {
            const enrichedDbContent = matter.stringify(patchedSource, meta || {});
            supabaseAdmin
              .from('lessons')
              .update({ content: enrichedDbContent })
              .ilike('course_slug', courseSlug)
              .ilike('lesson_slug', lessonSlug)
              .eq('lang', fallbackLesson.lang)
              .then(({ error }: { error: { message: string } | null }) => {
                if (error) console.error('[Entity Enrichment Fallback] DB write-back failed:', error);
                else console.log(`[Entity Enrichment Fallback] Wrote enriched entity attrs to DB for ${courseSlug}/${lessonSlug}`);
              });
          }
        }

        const enriched = healLinguisticContent(enrichedEntities, activeLang);
        return {
          meta: {
            title: sanitizeMetadataValue(fallbackLesson.title || meta.title || manualMeta.title || lessonSlug.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())),
            subject: fbMetaSubject,
            level: sanitizeMetadataValue(meta.level || manualMeta.level || getCanonicalLevelFromSlug(slug[0], lang)),
            module: sanitizeMetadataValue(meta.module || manualMeta.module || getLocalizedCoreModuleText(activeLang))
          },
          content: enriched
        };
      }
    } catch (err) {
      console.error("[Page Content DB] Failed to resolve lesson from database:", err);
    }
  }

  return null;
}

export async function getFirstAvailableLanguage(slug: string[]): Promise<string | null> {
  slug = slug.map(s => cleanPathSegment(decodeURIComponent(s)));
  // 1. Check the DB lessons table first (handles DB-only courses like 'revolution')
  if (slug.length >= 3) {
    const courseSlug = slug[2];
    const lessonSlug = slug[3] || 'introduction';

    let resolvedSandboxAllowed = false;
    try {
      const nextHeaders = await import('next/headers');
      const cookieStore = await nextHeaders.cookies();
      if (cookieStore.get('op_mock_archiving_levels')?.value || cookieStore.get('op_allow_sandbox')?.value === 'true') {
        resolvedSandboxAllowed = true;
      }
    } catch {}

    if (resolvedSandboxAllowed) {
      try {
        const { data: courseData } = await dbService.getSyllabus(courseSlug);
        if (courseData && courseData.languages && courseData.languages.length > 0) {
          return courseData.languages[0];
        }
      } catch {}
      return 'en';
    }

    try {
      const { data: dbLessons } = await supabase
        .from('lessons')
        .select('lang')
        .ilike('course_slug', courseSlug)
        .ilike('lesson_slug', lessonSlug)
        .limit(1);
      if (dbLessons && dbLessons.length > 0 && dbLessons[0].lang) {
        console.log(`[getFirstAvailableLanguage] Found lang '${dbLessons[0].lang}' in DB for ${courseSlug}/${lessonSlug}`);
        return dbLessons[0].lang;
      }
      // Also try any lesson for this course if lesson-specific slug not found
      const { data: anyLessons } = await supabase
        .from('lessons')
        .select('lang')
        .ilike('course_slug', courseSlug)
        .limit(1);
      if (anyLessons && anyLessons.length > 0 && anyLessons[0].lang) {
        console.log(`[getFirstAvailableLanguage] Found lang '${anyLessons[0].lang}' in DB for course ${courseSlug}`);
        return anyLessons[0].lang;
      }
    } catch (err) {
      // DB lookup failed
    }
  }
  return null;
}

export function preprocessMdx(
  content: string,
  lang: string = 'en',
  isSummative: boolean = false,
  lessonSlug?: string,
  lessonOrder?: number
): string {
  const stage1 = preprocessMdxStage1(content, lang, isSummative, lessonSlug, lessonOrder);
  const { processed: stage2, citationBlocks } = preprocessMdxStage2(stage1, lang);
  return preprocessMdxStage3(stage2, lang, citationBlocks);
}
