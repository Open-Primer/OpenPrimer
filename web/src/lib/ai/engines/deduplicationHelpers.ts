import { supabaseAdmin } from '@/lib/supabase';
import { isFactualMedia } from '../../media-resolver';

export function extractCustomFigures(mdx: string): Array<{ type: string; description: string; title?: string; caption?: string; searchQuery?: string }> {
  const figures: Array<{ type: string; description: string; title?: string; caption?: string; searchQuery?: string }> = [];
  const regex = /<(CustomFigure|Image)\s+([^>]*)\/>/g;
  let match;
  while ((match = regex.exec(mdx)) !== null) {
    const attrsStr = match[2];
    const typeMatch = attrsStr.match(/type=(["'])([\s\S]*?)\1/i);
    const descMatch = attrsStr.match(/description=(["'])([\s\S]*?)\1/i);
    const titleMatch = attrsStr.match(/title=(["'])([\s\S]*?)\1/i);
    const captionMatch = attrsStr.match(/caption=(["'])([\s\S]*?)\1/i);
    const searchQueryMatch = attrsStr.match(/searchQuery=(["'])([\s\S]*?)\1/i);
    if (typeMatch && descMatch) {
      figures.push({
        type: typeMatch[2],
        description: descMatch[2],
        title: titleMatch ? titleMatch[2] : undefined,
        caption: captionMatch ? captionMatch[2] : undefined,
        searchQuery: searchQueryMatch ? searchQueryMatch[2] : undefined
      });
    }
  }
  return figures;
}

export function areMediaSimilar(fig1: any, fig2: any): boolean {
  if (fig1.type !== fig2.type) return false;
  const desc1 = fig1.description.toLowerCase().trim();
  const desc2 = fig2.description.toLowerCase().trim();
  if (desc1 === desc2) return true;
  
  const words1 = desc1.split(/\s+/).filter((w: string) => w.length > 3);
  const words2 = desc2.split(/\s+/).filter((w: string) => w.length > 3);
  if (words1.length === 0 || words2.length === 0) return false;
  let matches = 0;
  for (const w of words1) {
    if (words2.includes(w)) matches++;
  }
  const similarity = matches / Math.min(words1.length, words2.length);
  return similarity > 0.6;
}

export function normType(t: string): string {
  t = t.toLowerCase().trim();
  if (t === 'minibio' || t === 'biography') return 'biography';
  if (t === 'citation' || t === 'quoteblock' || t === 'interactivequote' || t === 'quote') return 'citation';
  if (t === 'climate_impact_map' || t === 'climateimpactmap') return 'climateimpactmap';
  if (t === 'textesatrous' || t === 'fillinblanks') return 'fillinblanks';
  if (t === 'exerciceresolut' || t === 'solvedexercise') return 'solvedexercise';
  if (t === 'exerciceacompleter' || t === 'unsolvedexercise') return 'unsolvedexercise';
  if (t === 'evaluationorale' || t === 'oralevaluation') return 'oralevaluation';
  if (t === 'associationcorrespondance' || t === 'matchingevaluation') return 'matchingevaluation';
  if (t === 'reordonneritems' || t === 'reorderevaluation') return 'reorderevaluation';
  return t;
}

export function extractInteractiveComponentsFromMdx(mdx: string): any[] {
  const components: any[] = [];
  const tagRegex = /<([A-Z][a-zA-Z0-9_]*)\b([^>]*?)(?:\/>|>([\s\S]*?)<\/\1>)/g;
  let match;
  while ((match = tagRegex.exec(mdx)) !== null) {
    const componentType = match[1];
    const attrsStr = match[2] || '';
    const childrenStr = match[3] || '';
    
    const props: any = {};
    const attrRegex = /([a-zA-Z0-9_-]+)=(?:{(.*?)}|(["'])([\s\S]*?)\3)/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
      const name = attrMatch[1];
      const braceVal = attrMatch[2];
      const quoteVal = attrMatch[4];
      if (braceVal !== undefined) {
        try {
          props[name] = JSON.parse(braceVal);
        } catch (e) {
          props[name] = braceVal;
        }
      } else {
        props[name] = quoteVal;
      }
    }
    
    components.push({
      componentType,
      id: props.id || '',
      props,
      children: childrenStr.trim()
    });
  }
  return components;
}

export function areComponentsDuplicate(c1: any, c2: any): boolean {
  const t1 = normType(c1.componentType || c1.type || '');
  const t2 = normType(c2.componentType || c2.type || '');
  if (t1 !== t2) return false;

  const id1 = String(c1.id || c1.props?.id || '').trim().toLowerCase();
  const id2 = String(c2.id || c2.props?.id || '').trim().toLowerCase();
  if (id1 && id2 && id1 === id2) return true;

  const props1 = c1.props || {};
  const props2 = c2.props || {};

  const REUSABLE_SIMULATORS = [
    'functionplotter', 'functionmanipulator', 'dynamicsimulation', 'basicmathexplorer',
    'chemicalstoichiometry', 'equationmanipulator', 'interactivediagram', 'structureviewer3d',
    'geometry2d', 'codesandbox'
  ];

  if (REUSABLE_SIMULATORS.includes(t1)) {
    const ignoreProps = ['id', 'lang', 'sectionid', 'targetsectionid', 'sectiontitle', 'islink', 'unresolved'];
    const filterProps = (p: any) => Object.keys(p)
      .filter(k => !ignoreProps.includes(k.toLowerCase()))
      .reduce((obj: any, key: string) => {
        obj[key] = p[key];
        return obj;
      }, {});
    const f1 = filterProps(props1);
    const f2 = filterProps(props2);
    return JSON.stringify(f1) === JSON.stringify(f2);
  }

  const cleanText = (txt: any) => String(txt || '').toLowerCase().replace(/[^a-z0-9]/gi, '').trim();

  switch (t1) {
    case 'biography': {
      const name1 = cleanText(props1.name);
      const name2 = cleanText(props2.name);
      if (name1 && name2) {
        if (name1 === name2) return true;
        if (name1.length >= 4 && name2.length >= 4) {
          if (name1.includes(name2) || name2.includes(name1)) return true;
        }
      }
      const wiki1 = String(props1.wikipediaUrl || '').trim().toLowerCase();
      const wiki2 = String(props2.wikipediaUrl || '').trim().toLowerCase();
      if (wiki1 && wiki2 && wiki1 === wiki2) return true;
      break;
    }
    case 'citation': {
      const quote1 = cleanText(props1.quote || props1.text || c1.children || '');
      const quote2 = cleanText(props2.quote || props2.text || c2.children || '');
      if (quote1 && quote2 && quote1 === quote2) return true;
      break;
    }
    case 'quiz': {
      const qs1 = (props1.questions || []).map((q: any) => cleanText(q.q || q.question));
      const qs2 = (props2.questions || []).map((q: any) => cleanText(q.q || q.question));
      if (qs1.length > 0 && qs2.length > 0) {
        for (const q1 of qs1) {
          if (q1 && qs2.includes(q1)) return true;
        }
      }
      break;
    }
    case 'solvedexercise':
    case 'unsolvedexercise': {
      const prob1 = cleanText(props1.problem || c1.children || '');
      const prob2 = cleanText(props2.problem || c2.children || '');
      if (prob1 && prob2 && prob1 === prob2) return true;
      const title1 = cleanText(props1.title);
      const title2 = cleanText(props2.title);
      if (title1 && title2 && title1 === title2) return true;
      break;
    }
    case 'fillinblanks': {
      const q1 = cleanText(props1.question || props1.sentence || '');
      const q2 = cleanText(props2.question || props2.sentence || '');
      if (q1 && q2 && q1 === q2) return true;
      break;
    }
    case 'mermaid': {
      const chart1 = cleanText(props1.chart || c1.children || '');
      const chart2 = cleanText(props2.chart || c2.children || '');
      if (chart1 && chart2 && chart1 === chart2) return true;
      break;
    }
    case 'image':
    case 'climateimpactmap': {
      const fig1 = { type: t1, description: props1.description || '' };
      const fig2 = { type: t2, description: props2.description || '' };
      if (props1.src && props2.src && props1.src === props2.src) return true;
      if (props1.title && props2.title && cleanText(props1.title) === cleanText(props2.title)) return true;
      if (areMediaSimilar(fig1, fig2)) return true;
      break;
    }
    case 'video':
    case 'audio': {
      const url1 = String(props1.url || '').trim().toLowerCase();
      const url2 = String(props2.url || '').trim().toLowerCase();
      if (url1 && url2 && url1 === url2) return true;
      const title1 = cleanText(props1.title);
      const title2 = cleanText(props2.title);
      if (title1 && title2 && title1 === title2) return true;
      break;
    }
    case 'epistemology': {
      const title1 = cleanText(props1.title);
      const title2 = cleanText(props2.title);
      if (title1 && title2 && title1 === title2) return true;
      break;
    }
    case 'matchingevaluation':
    case 'reorderevaluation': {
      const title1 = cleanText(props1.title);
      const title2 = cleanText(props2.title);
      if (title1 && title2 && title1 === title2) return true;
      break;
    }
  }

  return false;
}

export async function deduplicateLessonWidgetsAndReferences(
  courseSlug: string,
  lessonSlug: string,
  widgets: any,
  narrativeMdx: string,
  lang: string,
  sharedCourseInteractiveComponents: any[]
): Promise<{ widgets: any, narrativeMdx: string }> {
  
  if (!widgets) return { widgets, narrativeMdx };

  // 0. Deduplicate multiple occurrences of the exact same widget anchor ID in the narrative MDX text
  const seenAnchorIds = new Set<string>();
  const rawAnchorRegex = /\[\[\s*WIDGET\s*:\s*(?:([^:\s\]]+)\s*:\s*)?([^:\s\]]+)\s*(?::\s*([^\\]]+))?\s*\]\]/gi;
  let rawMatch;
  let cleanedMdx = '';
  let lastIdx = 0;
  rawAnchorRegex.lastIndex = 0;
  while ((rawMatch = rawAnchorRegex.exec(narrativeMdx)) !== null) {
    const fullAnchor = rawMatch[0];
    const widgetId = rawMatch[2].toLowerCase();
    
    cleanedMdx += narrativeMdx.substring(lastIdx, rawMatch.index);
    if (seenAnchorIds.has(widgetId)) {
      console.log(`[DEDUPLICATION] Removed duplicate anchor for widget "${widgetId}" from narrative.`);
      cleanedMdx += '';
    } else {
      seenAnchorIds.add(widgetId);
      cleanedMdx += fullAnchor;
    }
    lastIdx = rawAnchorRegex.lastIndex;
  }
  cleanedMdx += narrativeMdx.substring(lastIdx);
  narrativeMdx = cleanedMdx;

  const otherLessonsComponents: any[] = [];
  try {
    const { data: dbLessons, error: dbErr } = await supabaseAdmin
      .from('lessons')
      .select('lesson_slug, content')
      .eq('course_slug', courseSlug)
      .neq('lesson_slug', lessonSlug)
      .eq('lang', lang.toLowerCase());

    if (!dbErr && dbLessons) {
      for (const les of dbLessons) {
        const extracted = extractInteractiveComponentsFromMdx(les.content || '');
        otherLessonsComponents.push(...extracted);
      }
    }
  } catch (err) {
    console.warn(`[DEDUPLICATION] Failed to fetch other lessons from database:`, err);
  }

  const existingCourseComponents = [...otherLessonsComponents, ...sharedCourseInteractiveComponents];

  if (Array.isArray(widgets.glossary)) {
    const uniqueGlossary: any[] = [];
    for (const entry of widgets.glossary) {
      if (!entry || !entry.term) continue;
      const termNorm = String(entry.term || '').trim().toLowerCase();
      const existingIdx = uniqueGlossary.findIndex(e => String(e.term || '').trim().toLowerCase() === termNorm);
      if (existingIdx !== -1) {
        if ((entry.definition || '').length > (uniqueGlossary[existingIdx].definition || '').length) {
          uniqueGlossary[existingIdx].definition = entry.definition;
        }
      } else {
        uniqueGlossary.push(entry);
      }
    }
    widgets.glossary = uniqueGlossary;
  }

  if (Array.isArray(widgets.references) && widgets.references.length > 0) {
    const uniqueReferences: string[] = [];
    const refMapping = new Map<number, number>();

    widgets.references.forEach((ref: any, idx: number) => {
      if (!ref) return;
      const oldNum = idx + 1;
      const cleanRef = ref.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      let foundIdx = uniqueReferences.findIndex(r => {
        const cleanR = r.toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanR.includes(cleanRef) || cleanRef.includes(cleanR);
      });
      
      if (foundIdx !== -1) {
        refMapping.set(oldNum, foundIdx + 1);
      } else {
        uniqueReferences.push(ref);
        refMapping.set(oldNum, uniqueReferences.length);
      }
    });

    widgets.references = uniqueReferences;

    if (refMapping.size > 0) {
      const updateNum = (numStr: string) => {
        const oldVal = parseInt(numStr, 10);
        const newVal = refMapping.get(oldVal);
        return newVal !== undefined ? String(newVal) : numStr;
      };

      narrativeMdx = narrativeMdx.replace(/\[(\d+)\]\(#ref-\1\)/g, (match, numStr) => {
        const newVal = updateNum(numStr);
        return `[${newVal}](#ref-${newVal})`;
      });

      narrativeMdx = narrativeMdx.replace(/href=(["'])#ref-(\d+)\1/g, (match, quote, numStr) => {
        const newVal = updateNum(numStr);
        return `href=${quote}#ref-${newVal}${quote}`;
      });

      narrativeMdx = narrativeMdx.replace(/refNum=\{\s*(\d+)\s*\}/g, (match, numStr) => {
        const newVal = updateNum(numStr);
        return `refNum={${newVal}}`;
      });

      narrativeMdx = narrativeMdx.replace(/<sup>\s*\[?(\d+)\]?\s*<\/sup>/gi, (match, numStr) => {
        const newVal = updateNum(numStr);
        return `<sup>[${newVal}]</sup>`;
      });
    }
  }

  if (Array.isArray(widgets.interactiveComponents)) {
    const uniqueComponents: any[] = [];
    const filteredComponents: any[] = [];

    for (const comp of widgets.interactiveComponents) {
      if (!comp || !comp.componentType) continue;

      const isInterDuplicate = existingCourseComponents.some(existing => areComponentsDuplicate(comp, existing));
      if (isInterDuplicate) {
        console.log(`[DEDUPLICATION] Removed cross-lesson duplicate interactive component: type="${comp.componentType}", id="${comp.id}"`);
        if (comp.id) {
          const escapedId = comp.id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const anchorRegex = new RegExp(`\\[\\[\\s*WIDGET\\s*:\\s*(?:[^:\\s\\]]+\\s*:\\s*)?${escapedId}\\s*(?::\\s*[^\\]]+)?\\s*\\]\\]`, 'gi');
          narrativeMdx = narrativeMdx.replace(anchorRegex, '');
        }
        continue;
      }

      const original = uniqueComponents.find(existing => areComponentsDuplicate(comp, existing));
      if (original) {
        console.log(`[DEDUPLICATION] Removed intra-lesson duplicate interactive component: type="${comp.componentType}", id="${comp.id}" (Merged -> "${original.id}")`);
        if (comp.id) {
          const escapedId = comp.id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const anchorRegex = new RegExp(`\\[\\[\\s*WIDGET\\s*:\\s*(?:[^:\\s\\]]+\\s*:\\s*)?${escapedId}\\s*(?::\\s*[^\\]]+)?\\s*\\]\\]`, 'gi');
          narrativeMdx = narrativeMdx.replace(anchorRegex, '');
        }
        continue;
      }

      uniqueComponents.push(comp);
      filteredComponents.push(comp);
      
      const isSharedDup = sharedCourseInteractiveComponents.some(existing => areComponentsDuplicate(comp, existing));
      if (!isSharedDup) {
        sharedCourseInteractiveComponents.push(comp);
      }
    }

    widgets.interactiveComponents = filteredComponents;
  }

  return { widgets, narrativeMdx };
}

export function healNarrativeCitations(text: string): string {
  if (!text) return text;

  // 1. Temporarily extract and replace code blocks (```...```) to avoid corrupting code
  const codeBlocks: string[] = [];
  let processed = text.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_PLACEHOLDER_${codeBlocks.length - 1}__`;
  });

  // 2. Temporarily extract and replace inline code (`...`)
  const inlineCodes: string[] = [];
  processed = processed.replace(/`[^`\n]+`/g, (match) => {
    inlineCodes.push(match);
    return `__INLINE_CODE_PLACEHOLDER_${inlineCodes.length - 1}__`;
  });

  // 3. Heal the standard citation patterns
  // Convert [ref1], [ref-1], [ref_1], [ref:1] -> [[WIDGET:Reference:1]]
  processed = processed.replace(/\[ref[-_:]?\s*(\d+)\s*\]/gi, '[[WIDGET:Reference:$1]]');
  
  // Convert standard WIDGET formats like [[WIDGET:reference:1]] -> [[WIDGET:Reference:1]]
  processed = processed.replace(/\[\s*(\d+)\s*\]\s*\(\s*#ref-\1\s*\)/gi, '[[WIDGET:Reference:$1]]');
  processed = processed.replace(/\[\[?\s*WIDGET\s*:\s*(?:reference|referecne|citation|cite)\s*:\s*(\d+)\s*\]\]?/gi, '[[WIDGET:Reference:$1]]');

  // Convert raw stand-alone digits inside brackets like [1], [2] safely to [[WIDGET:Reference:1]]
  // (avoiding array indices or math ranges by requiring preceding non-alphanumeric boundaries)
  processed = processed.replace(/(^|[^a-zA-Z0-9$_])\[(\d+)\]/g, '$1[[WIDGET:Reference:$2]]');

  // 4. Restore inline code
  processed = processed.replace(/__INLINE_CODE_PLACEHOLDER_(\d+)__/g, (match, idx) => {
    return inlineCodes[parseInt(idx, 10)];
  });

  // 5. Restore code blocks
  processed = processed.replace(/__CODE_BLOCK_PLACEHOLDER_(\d+)__/g, (match, idx) => {
    return codeBlocks[parseInt(idx, 10)];
  });

  return processed;
}

export function cleanImproperQuotes(str: string): string {
  if (!str) return '';
  let cleaned = str.trim();
  // 1. Unescape any backslashed quotes
  cleaned = cleaned.replace(/\\"/g, '"').replace(/\\'/g, "'");
  // 2. Remove outer quotes (single, double, guillemets, typographic quotes) and surrounding spaces/non-breaking spaces
  const quotePattern = /^[«»"'“”‘’\s\u00A0\u202F\u2007\u200B\\]+|[«»"'“”‘’\s\u00A0\u202F\u2007\u200B\\]+$/g;
  cleaned = cleaned.replace(quotePattern, '').trim();
  return cleaned;
}
