import { resolveGoingFurtherResource } from '@/lib/wikidata-resolver';
import { fetchWithTimeout } from '../validator/urlReachability';
const UNKNOWN_AUTHOR_MAP: Record<string, string> = { fr: 'Auteur inconnu', en: 'Unknown Author', es: 'Autor desconocido', de: 'Unbekannter Autor', zh: '未知作者', pt: 'Autor desconhecido', ar: 'مؤلف مجهول', hi: 'अज्ञात लेखक', ur: 'نامعلوم مصنف' };
import { detectLanguageLeakage, translateText } from './languageLeakageDetector';

export async function healCompanionWidgets(widgets: any, lang: string): Promise<any> {
  if (!widgets || typeof widgets !== 'object') return widgets;
  const healed = { ...widgets };

  // 5. Whats next validation
  if (widgets.whatsNext && Array.isArray(widgets.whatsNext.steps)) {
    widgets.whatsNext.steps = widgets.whatsNext.steps.filter((s: any) => s && s.title && s.description && !/placeholder|todo/i.test(s.description));
    for (const step of widgets.whatsNext.steps) {
      if (detectLanguageLeakage(step.title, lang)) {
        step.title = await translateText(step.title, lang);
      }
      if (detectLanguageLeakage(step.description, lang)) {
        step.description = await translateText(step.description, lang);
      }
    }
  } else {
    widgets.whatsNext = { steps: [] };
  }

  // 5b. Going further validation
  if (widgets.goingFurther && Array.isArray(widgets.goingFurther.items)) {
    const PLACEHOLDER_URL_PATTERNS = [
      'example.com', 'your_youtube_id', 'youtube.com/watch?v=xxxxxx',
      'youtube.com/watch?v=abcdef', 'youtube.com/watch?v=12345',
      'youtube.com/watch?v=dqw4w9wgxcq', 'test.com', 'placeholder', 'fakeurl'
    ];
    widgets.goingFurther.items = widgets.goingFurther.items.filter((it: any) => {
      if (!it || !it.title || !it.description) return false;
      const isPlTitle = /placeholder|todo|tbd|tbc|lorem|ipsum/i.test(it.title) || /^[\[\(].*[\]\)]$/.test(String(it.title).trim());
      const isPlDesc = /placeholder|todo|tbd|tbc|lorem|ipsum/i.test(it.description) || /^[\[\(].*[\]\)]$/.test(String(it.description).trim());
      return !isPlTitle && !isPlDesc;
    }).map((it: any) => {
      const title = String(it.title).trim();
      const type = ["book", "article", "video", "website", "research", "movie", "film"].includes(it.type) ? it.type : "website";
      let url = (it.url || "").trim();
      const lowerUrl = url.toLowerCase();
      if (url && PLACEHOLDER_URL_PATTERNS.some(p => lowerUrl.includes(p))) {
        url = "";
      }
      const description = String(it.description).trim();
      const author = it.author ? String(it.author).trim() : "";
      const year = it.year ? String(it.year).trim() : "";
      return { title, type, url, description, author, year };
    });

    for (const item of widgets.goingFurther.items) {
      if (detectLanguageLeakage(item.title, lang)) {
        item.title = await translateText(item.title, lang);
      }
      if (detectLanguageLeakage(item.description, lang)) {
        item.description = await translateText(item.description, lang);
      }
      if (item.author && detectLanguageLeakage(item.author, lang)) {
        item.author = await translateText(item.author, lang);
      }

      // [RESOURCE RESOLVER] Deterministic reading resource resolution via Google Books & CrossRef APIs
      try {
        const targetLang = (lang || 'en').toLowerCase().split('-')[0];
        const resolved = await resolveGoingFurtherResource(item.title, item.author, item.type, targetLang);
        if (resolved) {
          if (resolved.url) item.url = resolved.url;
          if (resolved.year) item.year = resolved.year;
          if (resolved.author) item.author = resolved.author;
          if (resolved.title) item.title = resolved.title;
          console.log(`[RESOURCE RESOLVER] Successfully resolved "${item.title}" (${item.type}) -> URL: ${item.url}, Year: ${item.year}`);
        }
      } catch (err) {
        console.error(`[RESOURCE RESOLVER] Error for "${item.title}":`, err);
      }
    }
  } else {
    widgets.goingFurther = { items: [] };
  }

  // 6. Summary points validation (must be complete sentences ending with periods)
  if (widgets.conclusionSummary && Array.isArray(widgets.conclusionSummary.items)) {
    widgets.conclusionSummary.items = widgets.conclusionSummary.items.filter((it: any) => it && String(it).trim().length > 0).map((it: string) => {
      let clean = (it || "").trim();
      if (!clean.endsWith(".") && !clean.endsWith("!") && !clean.endsWith("?")) {
        clean += ".";
      }
      return clean;
    });

    for (let i = 0; i < widgets.conclusionSummary.items.length; i++) {
      if (detectLanguageLeakage(widgets.conclusionSummary.items[i], lang)) {
        widgets.conclusionSummary.items[i] = await translateText(widgets.conclusionSummary.items[i], lang);
      }
    }
  } else {
    widgets.conclusionSummary = { items: [] };
  }

  // 7. Final summative evaluation validation
  if (widgets.finalEvaluation && typeof widgets.finalEvaluation === 'object') {
    widgets.finalEvaluation.type = "Quiz";
    if (!widgets.finalEvaluation.props || typeof widgets.finalEvaluation.props !== 'object') {
      widgets.finalEvaluation.props = {};
    }
    const qProps = widgets.finalEvaluation.props;
    if (!qProps.durationLimit) qProps.durationLimit = 1800;
    
    if (qProps.prompt && detectLanguageLeakage(qProps.prompt, lang)) {
      qProps.prompt = await translateText(qProps.prompt, lang);
    }
    if (qProps.subject && detectLanguageLeakage(qProps.subject, lang)) {
      qProps.subject = await translateText(qProps.subject, lang);
    }

    if (Array.isArray(qProps.questions)) {
      qProps.questions = qProps.questions.filter((q: any) => {
        if (!q || typeof q !== 'object' || !q.q || !Array.isArray(q.options)) return false;
        if (/placeholder|dummy|todo|tbd|tbc|lorem|ipsum|question d'auto-évaluation|evaluation question/i.test(q.q) || /^[\[\(].*[\]\)]$/.test(String(q.q).trim())) return false;
        
        q.options = q.options.filter((o: any) => {
          if (!o) return false;
          const txt = String(o.text || o).trim();
          if (!txt) return false;
          if (/placeholder|dummy|todo|tbd|tbc|lorem|ipsum|option/i.test(txt) || /^[\[\(].*[\]\)]$/.test(txt)) {
            return false;
          }
          return true;
        }).map((o: any) => {
          return { text: String(o.text || o).trim(), correct: !!o.correct };
        });

        return q.options.length >= 2;
      }).map((q: any) => {
        q.q = String(q.q).trim();
        q.explanation = q.explanation ? String(q.explanation).trim() : "";
        if (!q.options.some((o: any) => o.correct)) {
          q.options[0].correct = true;
        }
        return q;
      });

      for (const q of qProps.questions) {
        if (detectLanguageLeakage(q.q, lang)) {
          q.q = await translateText(q.q, lang);
        }
        if (detectLanguageLeakage(q.explanation, lang)) {
          q.explanation = await translateText(q.explanation, lang);
        }
        for (const o of q.options) {
          if (detectLanguageLeakage(o.text, lang)) {
            o.text = await translateText(o.text, lang);
          }
        }
      }

      if (qProps.questions.length === 0) {
        widgets.finalEvaluation = null;
      }
    } else {
      widgets.finalEvaluation = null;
    }
  } else {
    widgets.finalEvaluation = null;
  }

  // 8. Glossary & References validation
  if (Array.isArray(widgets.glossary)) {
    const targetLang = (lang || 'fr').toLowerCase().split('-')[0];
    const healedGlossary = [];
    for (let i = 0; i < widgets.glossary.length; i++) {
      const entry = widgets.glossary[i];
      if (!entry || typeof entry !== 'object') continue;

      let term = (entry.term || "").trim();
      let definition = (entry.definition || "").trim();

      if (!term || !definition) continue;

      const isCircular = term.toLowerCase() === definition.toLowerCase();
      const isShort = definition.length < 8;
      const isPlaceholder = /placeholder|dummy|todo|tbd|tbc|lorem|ipsum|a definir|à définir/i.test(definition) || /placeholder|dummy|todo|tbd|tbc|lorem|ipsum|a definir|à définir/i.test(term) || /^[\[\(].*[\]\)]$/.test(term) || /^[\[\(].*[\]\)]$/.test(definition);

      const isWrongLanguage = (targetLang !== 'en') && (
        /\b(is a|are|refers to|the study of|of the|in the|and the|with the|is the|study of)\b/i.test(definition)
      );

      if (isCircular || isShort || isPlaceholder || isWrongLanguage) {
        console.log(`[GLOSSARY VALIDATOR] Invalid or English glossary entry detected: "${term}": "${definition}". Healing via Wikipedia...`);
        const queryTerm = term || definition;
        let healed = false;
        try {
          const wikiSearchUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(queryTerm)}&srlimit=1`;
          const res = await fetchWithTimeout(wikiSearchUrl);
          if (res.ok) {
            const data = await res.json();
            const searchResult = data.query?.search?.[0];
            if (searchResult) {
              const canonicalTitle = searchResult.title;
              const wikiExtractUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(canonicalTitle)}&redirects=1`;
              const res2 = await fetchWithTimeout(wikiExtractUrl);
              if (res2.ok) {
                const data2 = await res2.json();
                const pages = data2.query?.pages;
                if (pages) {
                  const pageId = Object.keys(pages)[0];
                  if (pageId && pageId !== '-1') {
                    const extract = pages[pageId].extract || '';
                    if (extract && extract.length > 20) {
                      let sentence = extract.split(/[.!?]\s/)[0].trim();
                      if (sentence.length < 30 && extract.split(/[.!?]\s/)[1]) {
                        sentence += '. ' + extract.split(/[.!?]\s/)[1].trim();
                      }
                      if (!sentence.endsWith('.')) sentence += '.';
                      sentence = sentence.replace(/\s*\([^)]*\)/g, '').trim();
                      sentence = sentence.replace(/\s+/g, ' ');
                      
                      healedGlossary.push({
                        term: canonicalTitle,
                        definition: sentence
                      });
                      console.log(`[GLOSSARY VALIDATOR] Healed to: "${canonicalTitle}": "${sentence}"`);
                      healed = true;
                    }
                  }
                }
              }
            }
          }
        } catch (err) {
          console.error(`[GLOSSARY VALIDATOR] Error healing glossary entry:`, err);
        }

        // Fallback to translation if Wikipedia healing failed
        if (!healed) {
          console.log(`[GLOSSARY VALIDATOR] Wikipedia healing failed. Translating term and definition directly...`);
          try {
            const translatedTerm = await translateText(term, targetLang);
            const translatedDef = await translateText(definition, targetLang);
            if (translatedTerm && translatedDef) {
              healedGlossary.push({
                term: translatedTerm,
                definition: translatedDef
              });
              healed = true;
            }
          } catch (tErr) {
            console.error(`[GLOSSARY VALIDATOR] Direct translation of glossary entry failed:`, tErr);
          }
        }

        if (!healed) {
          console.log(`[GLOSSARY VALIDATOR] Wikipedia healing and translation both failed. Preserving original entry.`);
          healedGlossary.push({ term, definition });
        }
      } else {
        healedGlossary.push({ term, definition });
      }
    }

    // Final language leakage sweep for all glossary entries
    for (const g of healedGlossary) {
      if (detectLanguageLeakage(g.term, lang)) {
        g.term = await translateText(g.term, lang);
      }
      if (detectLanguageLeakage(g.definition, lang)) {
        g.definition = await translateText(g.definition, lang);
      }
    }

    widgets.glossary = healedGlossary;
  } else {
    widgets.glossary = [];
  }

  if (Array.isArray(widgets.references)) {
    const resolvedRefs: string[] = [];
    for (const ref of widgets.references) {
      const trimmedRef = String(ref).trim();
      if (!trimmedRef) continue;
      
      // Check if it's a placeholder
      if (/placeholder|todo|tbd|tbc|lorem|ipsum|ref\d+/i.test(trimmedRef)) {
        continue;
      }
      
      try {
        const targetLang = (lang || 'en').toLowerCase().split('-')[0];
        // Treat citation as an article/book type to fetch canonical details
        const resolved = await resolveGoingFurtherResource(trimmedRef, null, 'article', targetLang);
        if (resolved) {
          // Format as a standardized, high-authority citation string
          const authorStr = resolved.author ? resolved.author : (UNKNOWN_AUTHOR_MAP[targetLang.toUpperCase()] || 'Unknown Author');
          const yearStr = resolved.year ? ` (${resolved.year})` : '';
          const titleStr = resolved.title ? `. *${resolved.title}*` : '';
          const urlStr = resolved.url ? `. URL : ${resolved.url}` : '';
          const formatted = `${authorStr}${yearStr}${titleStr}${urlStr}`;
          resolvedRefs.push(formatted);
          console.log(`[REFERENCE RESOLVER] Resolved "${trimmedRef}" -> "${formatted}"`);
        } else {
          resolvedRefs.push(trimmedRef);
        }
      } catch (err) {
        console.error(`[REFERENCE RESOLVER] Error for "${trimmedRef}":`, err);
        resolvedRefs.push(trimmedRef);
      }
    }
    widgets.references = resolvedRefs;
  } else {
    widgets.references = [];
  }

  return widgets;
}
