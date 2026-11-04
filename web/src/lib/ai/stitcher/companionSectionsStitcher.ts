import { ensureBlockWidgetsOnOwnLines } from './widgetLineFormatter';
import { extractAndInjectCitations } from './citationManager';

export function stitchCompanionSections(
  content: string,
  widgets: any,
  lang: string = 'fr',
  isTerminal: boolean = false
): string {
  if (!widgets) return content;
  let finalContent = content;

  // Render GoingFurther suggested readings widget (no url tag at this point)
  let goingFurtherItemsStr = '';
  if (widgets.goingFurther && Array.isArray(widgets.goingFurther.items) && widgets.goingFurther.items.length > 0) {
    goingFurtherItemsStr = `<GoingFurther>\n  ${widgets.goingFurther.items.map((it: any) => {
      const authorAttr = it.author ? ` author="${it.author.replace(/"/g, '&quot;')}"` : '';
      const yearAttr = it.year ? ` year="${it.year.replace(/"/g, '&quot;')}"` : '';
      const refNumAttr = it.refNum ? ` refNum={${it.refNum}}` : '';
      const urlAttr = it.url ? ` url="${it.url.replace(/"/g, '&quot;')}"` : '';
      return `<GoingFurtherItem title="${it.title.replace(/"/g, '&quot;')}" type="${it.type}"${authorAttr}${yearAttr}${refNumAttr}${urlAttr} description="${it.description.replace(/"/g, '&quot;')}" />`;
    }).join('\n  ')}\n</GoingFurther>`;
  }

  const parsedSteps = (widgets.whatsNext.steps || []).map((s: any) => ({
    title: s.title || '',
    description: s.description || '',
    slug: s.slug || '',
    subject: s.subject || '',
    level: s.level || ''
  }));
  const stepsEncoded = Buffer.from(JSON.stringify(parsedSteps)).toString('base64');
  const whatsNextStr = `<WhatsNext itemsBase64="${stepsEncoded}" />`;

  const summaryStr = `<Summary items={${JSON.stringify(widgets.conclusionSummary.items)}} />`;

  // Clean up/strip any existing widgets or anchors first to prevent duplicates or out-of-order rendering
  content = content
    .replace(/\[\[\s*WIDGET\s*:\s*conclusionSummary\s*\]\]/gi, '')
    .replace(/\[\[\s*WIDGET\s*:\s*whatsNext\s*\]\]/gi, '')
    .replace(/\[\[\s*WIDGET\s*:\s*goingFurther\s*\]\]/gi, '')
    .replace(/<Summary\b[^>]*>(?:[\s\S]*?<\/Summary>)?/gi, '')
    .replace(/<WhatsNext\b[^>]*>(?:[\s\S]*?<\/WhatsNext>)?/gi, '')
    .replace(/<GoingFurther\b[^>]*>[\s\S]*?<\/GoingFurther>/gi, '');

  const conclusionRegex = /^(#{2,3}\s*(?:Conclusion|Synthèse|Discussion|Synthèse\s*&\s*Discussion|Synthèse\s*&amp;\s*Discussion|Summary\s*&\s*Conclusion|Summary|Fazit|结论)[^\n]*)/mi;
  const conclusionMatch = content.match(conclusionRegex);
  
  if (conclusionMatch) {
    const headerText = conclusionMatch[0];
    const headerIdx = conclusionMatch.index!;
    
    // Find next heading
    const postHeader = content.substring(headerIdx + headerText.length);
    const nextHeadingRegex = /^#{2,3}\s+/m;
    const nextHeadingMatch = postHeader.match(nextHeadingRegex);
    
    let sectionEnd = content.length;
    if (nextHeadingMatch) {
      sectionEnd = headerIdx + headerText.length + nextHeadingMatch.index!;
    }
    
    const prose = content.substring(headerIdx + headerText.length, sectionEnd).trim();
    
    const rebuiltConclusion = `${headerText}\n\n${prose ? prose + '\n\n' : ''}${summaryStr}${whatsNextStr ? '\n\n' + whatsNextStr : ''}${goingFurtherItemsStr ? '\n\n' + goingFurtherItemsStr : ''}`;
    content = content.substring(0, headerIdx) + rebuiltConclusion + content.substring(sectionEnd);
  } else {
    content = content.trim() + `\n\n## Conclusion\n\n${summaryStr}${whatsNextStr ? '\n\n' + whatsNextStr : ''}${goingFurtherItemsStr ? '\n\n' + goingFurtherItemsStr : ''}`;
  }

  let finalEvalStr = '';
  if (widgets.finalEvaluation) {
    const finalEvalType = (widgets.finalEvaluation.type || '').toLowerCase();
    if (finalEvalType === "quiz" || finalEvalType === "qcm") {
      const fProps = widgets.finalEvaluation.props || {};
      finalEvalStr = `<Quiz durationLimit={${fProps.durationLimit || 1800}}${fProps.limit ? ` limit={${fProps.limit}}` : ''}>\n  ${(fProps.questions || []).map((q: any) => `  <Question q="${(q.q || '').replace(/"/g, '&quot;')}" explanation="${(q.explanation || '').replace(/"/g, '&quot;')}">\n    ${(q.options || []).map((o: any) => `<Option text="${(o.text || '').replace(/"/g, '&quot;')}" correct={${o.correct}} />`).join('\n    ')}\n  </Question>`).join('\n  ')}\n</Quiz>`;
    } else {
      const promptVal = (widgets.finalEvaluation.props?.prompt || "Rédigez un essai de synthèse structuré sur les concepts clés de cette leçon.").replace(/"/g, '&quot;');
      const subjectVal = (widgets.finalEvaluation.props?.subject || "Essai de synthèse").replace(/"/g, '&quot;');
      finalEvalStr = `<EssayEvaluation prompt="${promptVal}" subject="${subjectVal}" durationLimit={3600} />`;
    }
  }

  // Remove any existing finalEvaluation anchors
  content = content.replace(/\[\[\s*WIDGET\s*:\s*finalEvaluation\s*\]\]/gi, '');

  const contentLowerTmp = content.toLowerCase();
  let langKey = 'en';
  if (contentLowerTmp.includes('présentation') || contentLowerTmp.includes('introduction') || contentLowerTmp.includes('références') || contentLowerTmp.includes('glossaire') || contentLowerTmp.includes('conclusion') || contentLowerTmp.includes('synthèse')) {
    langKey = 'fr';
  } else if (contentLowerTmp.includes('referencias') || contentLowerTmp.includes('glosario') || contentLowerTmp.includes('conclusión')) {
    langKey = 'es';
  } else if (contentLowerTmp.includes('referenzen') || contentLowerTmp.includes('glossar') || contentLowerTmp.includes('fazit')) {
    langKey = 'de';
  } else if (contentLowerTmp.includes('参考文献') || contentLowerTmp.includes('词汇表') || contentLowerTmp.includes('结论')) {
    langKey = 'zh';
  }

  const finalEvalHeadings: Record<string, string> = {
    fr: '## Évaluation Finale',
    en: '## Final Evaluation',
    es: '## Evaluación Final',
    de: '## Abschlussbewertung',
    zh: '## 最终评估'
  };

  const selfEvalHeadings: Record<string, string> = {
    fr: '## Auto-évaluation',
    en: '## Self-Evaluation',
    es: '## Autoevaluación',
    de: '## Selbstbewertung',
    zh: '## 自我评估'
  };

  if (finalEvalStr) {
    const evalHeading = isTerminal ? finalEvalHeadings[langKey] : selfEvalHeadings[langKey];
    const evalRegex = /^(#{2,3}\s*(?:Évaluation|Evaluation|Évaluation\s*Finale|Evaluation\s*Finale|Summative\s*Evaluation|Final\s*Evaluation|Quiz|Final\s*Quiz|Assessment|Abschlussbewertung|Evaluación|Evaluación\s*Final|最终评估|测试|测验)[^\n]*)/mi;
    const evalMatch = content.match(evalRegex);

    if (evalMatch) {
      const headerText = evalMatch[0];
      const headerIdx = evalMatch.index!;
      
      // Find next heading
      const postHeader = content.substring(headerIdx + headerText.length);
      const nextHeadingRegex = /^#{2,3}\s+/m;
      const nextHeadingMatch = postHeader.match(nextHeadingRegex);
      
      let sectionEnd = content.length;
      if (nextHeadingMatch) {
        sectionEnd = headerIdx + headerText.length + nextHeadingMatch.index!;
      }
      
      const prose = content.substring(headerIdx + headerText.length, sectionEnd).trim();
      const rebuiltSection = `${evalHeading}\n\n${prose ? prose + '\n\n' : ''}${finalEvalStr}`;
      content = content.substring(0, headerIdx) + rebuiltSection + content.substring(sectionEnd);
    } else {
      content = content.trim() + `\n\n${evalHeading}\n\n${finalEvalStr}`;
    }
  } else {
    // Remove any existing finalEvaluation anchors or sections
    const evalRegex = /^(#{2,3}\s*(?:Évaluation|Evaluation|Évaluation\s*Finale|Evaluation\s*Finale|Summative\s*Evaluation|Final\s*Evaluation|Quiz|Final\s*Quiz|Assessment|Abschlussbewertung|Evaluación|Evaluación\s*Final|最终评估|测试|测验)[^\n]*)/mi;
    content = content.replace(evalRegex, '');
  }

  // Strip markdown links ([text](url)) from glossary definitions to remove visible [Wikipedia] brackets
  const cleanGlossaryDef = (def: string): string => (def || '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')  // [text](url) -> text
    .replace(/\[\[([^\]]+)\]\]/g, '$1')          // [[text]] -> text
    .trim();
  const contentLower = content.toLowerCase();
  let glossaryHeading = '### Glossaire';
  let refHeading = '### Références';

  if (contentLower.includes('references') || contentLower.includes('glossary') || contentLower.includes('summary')) {
    glossaryHeading = '### Glossary';
    refHeading = '### References';
  } else if (contentLower.includes('referencias') || contentLower.includes('glosario') || contentLower.includes('conclusión')) {
    glossaryHeading = '### Glosario';
    refHeading = '### Referencias';
  } else if (contentLower.includes('referenzen') || contentLower.includes('glossar') || contentLower.includes('fazit')) {
    glossaryHeading = '### Glossar';
    refHeading = '### Referenzen';
  } else if (contentLower.includes('参考文献') || contentLower.includes('词汇表') || contentLower.includes('结论')) {
    glossaryHeading = '### 词汇表';
    refHeading = '### 参考文献';
  }

  // Strip any existing glossary and references headings to prevent duplication
  const glossaireRegex = /^#{2,3}\s*(?:Glossaire|Glossary|Lexique|Glosario|Glossar|词汇表)[^\n]*/gmi;
  const referencesRegex = /^#{2,3}\s*(?:Références|References|Réf\.|Réf|Bibliography|Referencias|Referenzen|参考文献)[^\n]*/gmi;
  
  content = content
    .replace(glossaireRegex, '')
    .replace(referencesRegex, '');

  if (Array.isArray(widgets.glossary) && widgets.glossary.length > 0) {
    const serializableItems = widgets.glossary.map((g: any) => ({
      term: g.term,
      definition: cleanGlossaryDef(g.definition),
      wikipediaUrl: g.wikipediaUrl || undefined
    }));
    const glossaryBase64 = Buffer.from(JSON.stringify(serializableItems)).toString('base64');
    const glossaryStr = `\n\n\n${glossaryHeading}\n\n<GlossaryBlock itemsBase64="${glossaryBase64}" />`;
    content = content.trim() + glossaryStr;
  }

  // Convert [refN] citations in the narrative text to WFTA Reference widget anchors
  content = content.replace(/\[ref[-_]?\s*(\d+)\]/gi, (match, numStr) => {
    const num = parseInt(numStr, 10);
    if (num > 0 && num <= widgets.references.length) {
      return `[[WIDGET:Reference:${num}]]`;
    }
    return match;
  });

  // Map all references from widgets.references into a clean structured list
  const referencesList: string[] = [];
  widgets.references.forEach((ref: string, idx: number) => {
    const refNum = idx + 1;
    const cleanRef = ref.replace(/^\[\d+\]\s*/, '');
    referencesList.push(`[${refNum}] ${cleanRef}`);
  });

  if (referencesList.length > 0) {
    const referencesStr = `\n\n\n${refHeading}\n\n${referencesList.join('\n')}`;
    content = content.trim() + referencesStr;
  }

  // Replace unresolved suffix-augmented block widgets (Image, CustomFigure, Video, Audio, Mermaid, ClimateImpactMap)
  // with self-closing tags carrying a `description` prop so that renumberFiguresAndCaptions can process them correctly.
  const blockWidgetTypes = /^(Image|CustomFigure|Video|Audio|Mermaid|ClimateImpactMap|climate_impact_map|DataChart|StructureViewer3D|FunctionPlotter|FunctionManipulator|DynamicSimulation)$/i;
  content = content.replace(/\[\[\s*WIDGET\s*:\s*([^:\s\]]+)\s*:\s*([^:\s\]]+)\s*(?::\s*([^\]]*?))?\s*\]\]/gi, (match, type, id, topic) => {
    const canonicalType = /^climate_impact_map$/i.test(type) ? 'ClimateImpactMap' : type;
    if (blockWidgetTypes.test(type)) {
      const description = topic ? topic.trim() : id.replace(/_/g, ' ');
      const safeDesc = description.replace(/"/g, '&quot;');
      return `<${canonicalType} id="${id}" description="${safeDesc}" />`;
    }
    // Inline hover-card widgets: emit non-self-closing tags
    const displayVal = topic ? topic.trim() : id.replace(/_/g, ' ');
    const cleanDisplay = displayVal.replace(/"/g, '&quot;');
    return `<${canonicalType} id="${id}" name="${cleanDisplay}" term="${cleanDisplay}">${displayVal}</${canonicalType}>`;
  });

  // Clean up any remaining unresolved [[WIDGET:...]] placeholders
  content = content.replace(/\[\[\s*WIDGET\s*:.*?\]\]+/gi, '');

  // Clean up empty self-closing InteractiveDiagram components without hotspotsBase64
  content = content.replace(/<InteractiveDiagram(?![\s\S]*?hotspotsBase64)[^>]*?\/>/gi, '');

  // Clean up generic/empty developer placeholders at the end of lessons
  content = content.replace(/<FunctionPlotter\s+fn=["']x\^2["']\s*\/?>/gi, '');

  // Nested function to sequentially renumber figures and diagrams in order of appearance
  function renumberFiguresAndCaptions(text: string, lang: string): string {
    let counter = 1;
    const tagRegex = /<(Image|CustomFigure|Mermaid)\b([\s\S]*?)\/?>/gi;
    
    return text.replace(tagRegex, (tagMatch, tagName, attrsStr) => {
      const captionRegex = /\bcaption=(?:"([^"]*)"|'([^']*)'|\{([\s\S]*?)\})/i;
      const captionMatch = attrsStr.match(captionRegex);
      
      let captionText = '';
      let matchedDelimiter = '"';
      
      if (captionMatch) {
        captionText = captionMatch[1] || captionMatch[2] || captionMatch[3] || '';
        if (captionMatch[2] !== undefined) matchedDelimiter = "'";
        if (captionMatch[3] !== undefined) matchedDelimiter = '{';
      }
      
      // Decorative illustrations are excluded from figure numbering
      if (attrsStr.includes('isIllustration="true"') || attrsStr.includes('isIllustration={true}')) {
        return tagMatch;
      }

      // If caption is empty/missing, look for description
      if (!captionText.trim()) {
        const descRegex = /\bdescription=(?:"([^"]*)"|'([^']*)'|\{([\s\S]*?)\})/i;
        const descMatch = attrsStr.match(descRegex);
        if (descMatch) {
          captionText = descMatch[1] || descMatch[2] || descMatch[3] || '';
        }
      }
      
      let cleanCaption = captionText.trim();
      const prefixRegex = /^(?:figure|fig|illustration|abbildung|abb|image|custom\s*figure)\s*(?:\d+(?:\.\d+)*[a-z]?|\b(?![a-z]')([a-z])\b)?\s*(?:[:：\-–—]\s*)*/i;
      cleanCaption = cleanCaption.replace(prefixRegex, '').trim();
      
      // Do not add figure prefix if caption is completely empty
      if (!cleanCaption) {
        return tagMatch;
      }

      const FIGURE_PREFIXES: Record<string, string> = {
        FR: `Figure ${counter} : `,
        EN: `Figure ${counter}: `,
        DE: `Abbildung ${counter}: `,
        ES: `Figura ${counter}: `,
        ZH: `图 ${counter}: `,
        PT: `Figura ${counter}: `,
        AR: `الشكل ${counter}: `,
        HI: `चित्र ${counter}: `,
        UR: `تصویر ${counter}: `
      };
      const prefix = FIGURE_PREFIXES[lang.toUpperCase()] || `Figure ${counter}: `;
      
      const newCaptionText = `${prefix}${cleanCaption}`;
      counter++;
      
      let newAttrsStr = attrsStr;
      if (captionMatch) {
        const fullAttrMatch = captionMatch[0];
        let newAttrStr = '';
        if (matchedDelimiter === '{') {
          newAttrStr = `caption={\`${newCaptionText.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}`;
        } else {
          newAttrStr = `caption=${matchedDelimiter}${newCaptionText.replace(new RegExp(matchedDelimiter, 'g'), '\\' + matchedDelimiter)}${matchedDelimiter}`;
        }
        newAttrsStr = attrsStr.replace(fullAttrMatch, newAttrStr);
      } else {
        newAttrsStr = ` caption="${newCaptionText}"` + attrsStr;
      }
      
      return `<${tagName}${newAttrsStr}/>`;
    });
  }

  // Renumber figures sequentially
  content = renumberFiguresAndCaptions(content, langKey);

  // Clean up any trailing unbalanced closing brackets ']' at the end of lines
  content = content.split('\n').map(line => {
    let cleanLine = line;
    const openCount = (cleanLine.match(/\[/g) || []).length;
    const closeCount = (cleanLine.match(/\]/g) || []).length;
    if (closeCount > openCount) {
      while (cleanLine.trim().endsWith(']') && (cleanLine.match(/\]/g) || []).length > (cleanLine.match(/\[/g) || []).length) {
        cleanLine = cleanLine.trim().slice(0, -1);
      }
    }
    return cleanLine;
  }).join('\n');

  content = content.replace(/```mdx/g, '').replace(/```/g, '').trim();
  content = ensureBlockWidgetsOnOwnLines(content);

  return content;
}
