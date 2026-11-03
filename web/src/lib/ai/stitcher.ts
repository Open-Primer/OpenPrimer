/**
 * @file stitcher.ts
 * @description Injects and stitches validated interactive widgets, citations,
 * callouts, and pedagogical blocks into raw narrative MDX course material.
 */

export function getCitedReferenceNumbers(narrativeText: string): Set<number> {
  const cited = new Set<number>();
  
  // 1. Match [X](#ref-X)
  const mdLinkRegex = /\[(\d+)\]\(#ref-\1\)/g;
  let match;
  while ((match = mdLinkRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  // 2. Match href="#ref-X" or href='#ref-X'
  const hrefRegex = /href=["']#ref-(\d+)["']/g;
  while ((match = hrefRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  // 3. Match refNum={X}
  const refNumRegex = /refNum=\{\s*(\d+)\s*\}/g;
  while ((match = refNumRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  // 4. Match <sup>X</sup> or <sup>[X]</sup> or similar
  const supRegex = /<sup>\s*\[?(\d+)\]?\s*<\/sup>/gi;
  while ((match = supRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  return cited;
}

function replaceWidget(content: string, widgetName: string, widgetStr: string): { content: string, replaced: boolean } {
  const escapedName = widgetName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  // Match [[WIDGET:widgetName]], [[WIDGET:Type:widgetName]], or [[WIDGET:Type:widgetName:Topic]]
  const regex = new RegExp(`\\[\\[\\s*WIDGET\\s*:\\s*(?:[^:\\s\\]]+\\s*:\\s*)?${escapedName}\\s*(?::\\s*([^\\]]+))?\\s*\\]\\]`, 'gi');
  if (regex.test(content)) {
    return { content: content.replace(regex, widgetStr), replaced: true };
  }
  return { content, replaced: false };
}

export function extractAndInjectCitations(content: string, references: string[]): string {
  let updatedContent = content;
  const citationTagRegex = /<(Citation|QuoteBlock|InteractiveQuote)\b([^>]*?)>/gi;
  
  updatedContent = updatedContent.replace(citationTagRegex, (match, tagName, attrsStr) => {
    const authorMatch = attrsStr.match(/author=(["'])([\s\S]*?)\1/);
    const sourceMatch = attrsStr.match(/source=(["'])([\s\S]*?)\1/);
    const yearMatch = attrsStr.match(/year=(["'])([\s\S]*?)\1/);
    const refNumMatch = attrsStr.match(/refNum=\{\s*(\d+)\s*\}/);
    
    const author = authorMatch ? authorMatch[2].trim() : '';
    const source = sourceMatch ? sourceMatch[2].trim() : '';
    const year = yearMatch ? yearMatch[2].trim() : '';
    let refNum = refNumMatch ? parseInt(refNumMatch[1], 10) : null;
    
    if (!author && !source) {
      return match;
    }
    
    let bibEntry = author;
    if (source) {
      bibEntry += bibEntry ? `, *${source}*` : `*${source}*`;
    }
    if (year) {
      bibEntry += bibEntry ? `, ${year}` : year;
    }
    
    if (bibEntry && !bibEntry.endsWith('.')) {
      bibEntry += '.';
    }
    
    if (bibEntry) {
      let existingIdx = references.findIndex(r => {
        const cleanR = r.toLowerCase().replace(/[*_.]/g, '');
        const cleanBib = bibEntry.toLowerCase().replace(/[*_.]/g, '');
        return cleanR.includes(cleanBib) || cleanBib.includes(cleanR);
      });
      
      if (existingIdx !== -1) {
        refNum = existingIdx + 1;
      } else {
        references.push(bibEntry);
        refNum = references.length;
      }
    }
    
    if (refNum !== null) {
      let newAttrsStr = attrsStr;
      if (attrsStr.includes('refNum=')) {
        newAttrsStr = newAttrsStr.replace(/refNum=\{\s*\d+\s*\}/g, `refNum={${refNum}}`);
      } else {
        newAttrsStr = newAttrsStr.trim() + ` refNum={${refNum}}`;
      }
      return `<${tagName} ${newAttrsStr}>`;
    }
    
    return match;
  });
  
  return updatedContent;
}

export function ensureBlockWidgetsOnOwnLines(text: string): string {
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

  const blockTags = [
    'Image', 'CustomFigure', 'Video', 'Audio', 'ClimateImpactMap', 'DataChart',
    'StructureViewer3D', 'FunctionPlotter', 'FunctionManipulator', 'DynamicSimulation',
    'FillInBlanks', 'Summary', 'WhatsNext', 'EssayEvaluation', 'GoingFurther',
    'Quiz', 'SolvedExercise', 'UnsolvedExercise', 'Mermaid',
    'CriticalThinking', 'ScientificMethod', 'HistoricalAnecdote', 'HistoricalEvent',
    'HistoricalFact', 'PointOfView', 'AnecdoteHistorique', 'FaitHistorique',
    'MethodeScientifique', 'PointDeVue', 'AcademicSkeptic', 'SceptiqueAcademique'
  ];

  for (const tag of blockTags) {
    // Match either self-closing tag or open/close tag, including surrounding horizontal spaces
    const pattern = new RegExp(`[ \\t]*(<${tag}\\b[^>]*?\\/>|<${tag}\\b[^>]*?>[\\s\\S]*?<\\/${tag}>)[ \\t]*`, 'gi');
    processed = processed.replace(pattern, (match) => {
      return `\n\n${match.trim()}\n\n`;
    });
  }

  // Normalize consecutive newlines to exactly two
  processed = processed.replace(/\n{3,}/g, '\n\n');

  // 3. Restore inline code
  processed = processed.replace(/__INLINE_CODE_PLACEHOLDER_(\d+)__/g, (match, idx) => {
    return inlineCodes[parseInt(idx, 10)];
  });

  // 4. Restore code blocks
  processed = processed.replace(/__CODE_BLOCK_PLACEHOLDER_(\d+)__/g, (match, idx) => {
    return codeBlocks[parseInt(idx, 10)];
  });
  
  return processed.trim();
}

export function stitchLessonContent(narrativeMdx: string, widgets: any, isTerminalEvaluation: boolean = false): string {
  // [FIX G9] Remove duplicate [[WIDGET:conclusionSummary]] etc. that the Scribe may have
  // inlined in prose. The stitcher is the authoritative injector of these conclusion anchors.

  let content = narrativeMdx.trim();

  // Compile Category A (direct markdown/prose enclosers) inline *before* suffix normalization
  const categoryAMap: { [key: string]: string } = {
    didyouknow: "DidYouKnow",
    lesaviezvous: "LeSaviezVous",
    historicalanecdote: "HistoricalAnecdote",
    anecdotehistorique: "AnecdoteHistorique",
    pointofview: "PointOfView",
    pointdevue: "PointDeVue",
    criticalthinking: "CriticalThinking",
    espritcritique: "EspritCritique",
    scientificmethod: "ScientificMethod",
    methodescientifique: "MethodeScientifique",
    scientificdebate: "ScientificDebate",
    debatscientifique: "DebatScientifique",
    openquestion: "OpenQuestion",
    historicalfact: "HistoricalFact",
    faithistorique: "FaitHistorique",
    historicalevent: "HistoricalEvent",
    evenementhistorique: "EvenementHistorique",
    brilliantidea: "BrilliantIdea",
    ideebrillante: "IdeeBrillante"
  };

  content = content.replace(/\[\[\s*WIDGET\s*:\s*(DidYouKnow|LeSaviezVous|HistoricalAnecdote|AnecdoteHistorique|PointOfView|PointDeVue|CriticalThinking|EspritCritique|ScientificMethod|MethodeScientifique|ScientificDebate|DebatScientifique|OpenQuestion|HistoricalFact|FaitHistorique|HistoricalEvent|EvenementHistorique|BrilliantIdea|IdeeBrillante)\s*:\s*([^:\s\]]+)\s*:\s*([\s\S]*?)\s*\]\]/gi, (match, type, id, payload) => {
    const canonicalType = categoryAMap[type.toLowerCase()] || type;
    return `<${canonicalType}>\n${payload.trim()}\n</${canonicalType}>`;
  });

  // Suffix-augmented anchors [[WIDGET:Type:ID:Topic]] are left intact here to preserve metadata for stitching fallbacks.

  // Initialize references array if not present
  if (!widgets) widgets = {};
  if (!widgets.references || !Array.isArray(widgets.references)) {
    widgets.references = [];
  }
  if (!widgets.interactiveComponents || !Array.isArray(widgets.interactiveComponents)) {
    widgets.interactiveComponents = [];
  }
  if (!widgets.whatsNext) {
    widgets.whatsNext = { steps: [] };
  }
  if (!widgets.conclusionSummary) {
    widgets.conclusionSummary = { items: [] };
  }

  // Pre-process goingFurther items to construct bibliographic references if author/year are present
  if (widgets.goingFurther && Array.isArray(widgets.goingFurther.items)) {
    widgets.goingFurther.items.forEach((it: any) => {
      if (it.author || it.year) {
        const title = it.title || '';
        const author = it.author || '';
        const year = it.year || '';
        
        let bibEntry = '';
        if (author && year) {
          bibEntry = `${author}. ${year}. *${title}*.`;
        } else if (author) {
          bibEntry = `${author}. *${title}*.`;
        } else if (year) {
          bibEntry = `*${title}* (${year}).`;
        } else {
          bibEntry = `*${title}*.`;
        }
        
        // Find existing index in widgets.references
        let existingIdx = widgets.references.findIndex((r: string) => {
          const cleanR = r.toLowerCase().replace(/[*_.]/g, '').trim();
          const cleanBib = bibEntry.toLowerCase().replace(/[*_.]/g, '').trim();
          return cleanR.includes(cleanBib) || cleanBib.includes(cleanR);
        });
        
        let refNum: number;
        if (existingIdx !== -1) {
          refNum = existingIdx + 1;
        } else {
          widgets.references.push(bibEntry);
          refNum = widgets.references.length;
        }
        
        // Store refNum on the item so it renders with the badge
        it.refNum = refNum;
      }
    });
  }
  if (isTerminalEvaluation) {
    let finalEvalStr = '';
    if (widgets && widgets.finalEvaluation) {
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

    let goingFurtherItemsStr = '';
    if (widgets && widgets.goingFurther && Array.isArray(widgets.goingFurther.items) && widgets.goingFurther.items.length > 0) {
      goingFurtherItemsStr = `<GoingFurther>\n  ${widgets.goingFurther.items.map((it: any) => {
        const authorAttr = it.author ? ` author="${it.author.replace(/"/g, '&quot;')}"` : '';
        const yearAttr = it.year ? ` year="${it.year.replace(/"/g, '&quot;')}"` : '';
        const refNumAttr = it.refNum ? ` refNum={${it.refNum}}` : '';
        const urlAttr = it.url ? ` url="${it.url.replace(/"/g, '&quot;')}"` : '';
        return `<GoingFurtherItem title="${it.title.replace(/"/g, '&quot;')}" type="${it.type}"${authorAttr}${yearAttr}${refNumAttr}${urlAttr} description="${it.description.replace(/"/g, '&quot;')}" />`;
      }).join('\n  ')}\n</GoingFurther>`;
    }

    let whatsNextStr = '';
    if (widgets && widgets.whatsNext) {
      const parsedSteps = (widgets.whatsNext.steps || []).map((s: any) => ({
        title: s.title || '',
        description: s.description || '',
        slug: s.slug || '',
        subject: s.subject || '',
        level: s.level || ''
      }));
      const stepsEncoded = Buffer.from(JSON.stringify(parsedSteps)).toString('base64');
      whatsNextStr = `<WhatsNext itemsBase64="${stepsEncoded}" />`;
    }

    let combined = finalEvalStr;
    if (goingFurtherItemsStr) {
      combined += `\n\n${goingFurtherItemsStr}`;
    }
    if (whatsNextStr) {
      combined += `\n\n${whatsNextStr}`;
    }
    return combined;
  }
  if (widgets) {
    widgets.references = widgets.references || [];
    content = extractAndInjectCitations(content, widgets.references);
  }

  const prerequisitesStr = widgets.prerequisites && Array.isArray(widgets.prerequisites.items) && widgets.prerequisites.items.length > 0
    ? `<Prerequisites items={${JSON.stringify(widgets.prerequisites.items)}} />`
    : '';

  const diagnosticQuizStr = widgets.diagnosticQuiz && widgets.diagnosticQuiz.question
    ? `<DiagnosticQuiz question="${widgets.diagnosticQuiz.question.replace(/"/g, '&quot;')}" options={${JSON.stringify(widgets.diagnosticQuiz.options)}} correctIndex={${widgets.diagnosticQuiz.correctIndex}} targetSectionId="${widgets.diagnosticQuiz.targetSectionId}" sectionTitle="${widgets.diagnosticQuiz.sectionTitle.replace(/"/g, '&quot;')}" />`
    : '';

  const objectivesStr = widgets.learningObjectives && Array.isArray(widgets.learningObjectives.knowledge) && widgets.learningObjectives.knowledge.length > 0
    ? `<Objectives>
  <Knowledge>
    <ul className="list-disc pl-4 space-y-1">
      ${widgets.learningObjectives.knowledge.map((k: string) => `<li>${k.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</li>`).join('\n      ')}
    </ul>
  </Knowledge>
  <Skills>
    <ul className="list-disc pl-4 space-y-1">
      ${widgets.learningObjectives.skills.map((s: string) => `<li>${s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</li>`).join('\n      ')}
    </ul>
  </Skills>
  <Attitudes>
    <ul className="list-disc pl-4 space-y-1">
      ${widgets.learningObjectives.attitudes.map((a: string) => `<li>${a.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</li>`).join('\n      ')}
    </ul>
  </Attitudes>
</Objectives>`
    : '';

  // Stitch New Pedagogical Widgets
  if (widgets.previousLessonSummary) {
    const prevSummaryStr = `<PreviousLessonSummary previousLessonTitle="${(widgets.previousLessonSummary.previousLessonTitle || '').replace(/"/g, '&quot;')}" keyTakeaways={${JSON.stringify(widgets.previousLessonSummary.keyTakeaways || [])}} cognitiveBridge="${(widgets.previousLessonSummary.cognitiveBridge || '').replace(/"/g, '&quot;')}" />`;
    content = replaceWidget(content, 'previousLessonSummary', prevSummaryStr).content;
  } else {
    content = replaceWidget(content, 'previousLessonSummary', '').content;
  }

  if (widgets.careerProfile) {
    const careerOutlook = widgets.careerProfile.careerOutlook || {};
    const careerStr = `<CareerProfile profession="${(widgets.careerProfile.profession || '').replace(/"/g, '&quot;')}" discipline="${(widgets.careerProfile.discipline || '').replace(/"/g, '&quot;')}" courseConnection="${(widgets.careerProfile.courseConnection || '').replace(/"/g, '&quot;')}" keyMissions={${JSON.stringify(widgets.careerProfile.keyMissions || [])}} careerOutlook={${JSON.stringify({ demand: careerOutlook.demand || '', typicalEmployers: careerOutlook.typicalEmployers || [], salaryIndication: careerOutlook.salaryIndication || '' })}} />`;
    content = replaceWidget(content, 'careerProfile', careerStr).content;
  } else {
    content = replaceWidget(content, 'careerProfile', '').content;
  }

  if (widgets.researchFocus) {
    const researchStr = `<ResearchFocus question="${(widgets.researchFocus.question || '').replace(/"/g, '&quot;')}" category="${(widgets.researchFocus.category || '').replace(/"/g, '&quot;')}" context="${(widgets.researchFocus.context || '').replace(/"/g, '&quot;')}" whyUnresolved="${(widgets.researchFocus.whyUnresolved || '').replace(/"/g, '&quot;')}" activeHypotheses={${JSON.stringify(widgets.researchFocus.activeHypotheses || [])}} />`;
    content = replaceWidget(content, 'researchFocus', researchStr).content;
  } else {
    content = replaceWidget(content, 'researchFocus', '').content;
  }

  if (widgets.recentNewsBridge) {
    const newsStr = `<RecentNewsBridge eventTitle="${(widgets.recentNewsBridge.eventTitle || '').replace(/"/g, '&quot;')}" date="${(widgets.recentNewsBridge.date || '').replace(/"/g, '&quot;')}" source="${(widgets.recentNewsBridge.source || '').replace(/"/g, '&quot;')}" description="${(widgets.recentNewsBridge.description || '').replace(/"/g, '&quot;')}" courseConnection="${(widgets.recentNewsBridge.courseConnection || '').replace(/"/g, '&quot;')}" whyItMatters="${(widgets.recentNewsBridge.whyItMatters || '').replace(/"/g, '&quot;')}" />`;
    content = replaceWidget(content, 'recentNewsBridge', newsStr).content;
  } else {
    content = replaceWidget(content, 'recentNewsBridge', '').content;
  }

  if (prerequisitesStr) {
    const { content: content1, replaced: repPrereq } = replaceWidget(content, 'prerequisites', prerequisitesStr);
    content = content1;
    if (!repPrereq) {
      content = `${prerequisitesStr}\n\n${content}`;
    }
  } else {
    content = replaceWidget(content, 'prerequisites', '').content;
  }

  if (diagnosticQuizStr) {
    const { content: content2, replaced: repDiag } = replaceWidget(content, 'diagnosticQuiz', diagnosticQuizStr);
    content = content2;
    if (!repDiag) {
      if (prerequisitesStr) {
        content = content.replace(prerequisitesStr, `${prerequisitesStr}\n\n${diagnosticQuizStr}`);
      } else {
        content = `${diagnosticQuizStr}\n\n${content}`;
      }
    }
  } else {
    content = replaceWidget(content, 'diagnosticQuiz', '').content;
  }

  if (objectivesStr) {
    const { content: content3, replaced: repObj } = replaceWidget(content, 'learningObjectives', objectivesStr);
    content = content3;
    if (!repObj) {
      const introIdx = content.indexOf('## Introduction');
      const presIdx = content.indexOf('## Présentation');
      const targetIdx = introIdx !== -1 ? introIdx : (presIdx !== -1 ? presIdx : -1);

      if (targetIdx !== -1) {
        const nextHeadingIdx = content.indexOf('##', targetIdx + 15);
        if (nextHeadingIdx !== -1) {
          content = content.slice(0, nextHeadingIdx).trim() + `\n\n${objectivesStr}\n\n` + content.slice(nextHeadingIdx);
        } else {
          content = content + `\n\n${objectivesStr}`;
        }
      } else {
        if (diagnosticQuizStr) {
          content = content.replace(diagnosticQuizStr, `${diagnosticQuizStr}\n\n${objectivesStr}`);
        } else if (prerequisitesStr) {
          content = content.replace(prerequisitesStr, `${prerequisitesStr}\n\n${objectivesStr}`);
        } else {
          content = `${objectivesStr}\n\n${content}`;
        }
      }
    }
  } else {
    content = replaceWidget(content, 'learningObjectives', '').content;
  }

  widgets.interactiveComponents.forEach((comp: any) => {
    let compStr = '';
    const props = comp.props || {};

    if (comp.componentType === "Quiz") {
      compStr = `<Quiz durationLimit={${props.durationLimit || 300}}${props.limit ? ` limit={${props.limit}}` : ''}>\n  ${(props.questions || []).map((q: any) => `  <Question q="${(q.q || '').replace(/"/g, '&quot;')}" explanation="${(q.explanation || '').replace(/"/g, '&quot;')}"${q.multiple ? ' multiple={true}' : ''}>\n    ${(q.options || []).map((o: any) => `<Option text="${(o.text || '').replace(/"/g, '&quot;')}" correct={${o.correct}} />`).join('\n    ')}\n  </Question>`).join('\n  ')}\n</Quiz>`;
    } else if (comp.componentType === "FillInBlanks") {
      // [FIX A2] Use question/blanks props matching the component contract (not legacy sentence/answer).
      compStr = `<FillInBlanks question="${(props.question || props.sentence || '').replace(/"/g, '&quot;')}" blanks='${props.blanks ? JSON.stringify(props.blanks) : JSON.stringify([props.answer || ''])}' />`;
    } else if (comp.componentType === "SolvedExercise") {
      const problem = (props.problem || '').trim();
      const solution = (props.solution || '').trim();
      if (problem.length >= 10 || solution.length >= 10) {
        compStr = `<SolvedExercise title="${(props.title || '').replace(/"/g, '&quot;')}" solution="${solution.replace(/"/g, '&quot;')}">\n  ${problem}\n</SolvedExercise>`;
      } else {
        compStr = '';
      }
    } else if (comp.componentType === "UnsolvedExercise") {
      const problem = (props.problem || '').trim();
      if (problem.length >= 10) {
        compStr = `<UnsolvedExercise title="${(props.title || '').replace(/"/g, '&quot;')}" correctAnswer="${(props.correctAnswer || '').replace(/"/g, '&quot;')}" explanation="${(props.explanation || '').replace(/"/g, '&quot;')}">\n  ${problem}\n</UnsolvedExercise>`;
      } else {
        compStr = '';
      }
    } else if (comp.componentType === "Mermaid") {
      const chart = (props.chart || '').trim();
      if (chart.length >= 15 && /graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|journey/i.test(chart)) {
        const mCaption = props.caption ? ` caption="${(props.caption || '').replace(/"/g, '&quot;')}"` : '';
        const safeChart = chart.replace(/`/g, '\\`').replace(/\${/g, '\\${');
        compStr = `<Mermaid chart={\`${safeChart}\`}${mCaption} />`;
      } else {
        compStr = '';
      }
    } else if (comp.componentType === "FunctionPlotter") {
      compStr = `<FunctionPlotter fn="${props.fn || 'x^2'}" domain={${JSON.stringify(props.domain || [-10, 10])}} />`;
    } else if (comp.componentType === "CodeSandbox") {
      compStr = `<CodeSandbox initialCode={\`${props.initialCode || ''}\`} language="${props.language || 'javascript'}" />`;
    } else if (comp.componentType === "DataChart") {
      compStr = `<DataChart title="${(props.title || '').replace(/"/g, '&quot;')}" data={${JSON.stringify(props.data || [])}} xKey="${props.xKey || 'label'}" yKey="${props.yKey || 'value'}" />`;
    } else if (comp.componentType === "PronunciationSandbox" || comp.componentType === "SandboxPrononciation") {
      const pWord = (props.word || '').replace(/"/g, '&quot;');
      const pIpa = props.ipa ? ` ipa="${props.ipa.replace(/"/g, '&quot;')}"` : '';
      const pLang = props.lang ? ` lang="${props.lang.replace(/"/g, '&quot;')}"` : '';
      const pDef = props.definition ? ` definition="${props.definition.replace(/"/g, '&quot;')}"` : '';
      const pExp = props.explanation ? ` explanation="${props.explanation.replace(/"/g, '&quot;')}"` : '';
      compStr = `<PronunciationSandbox word="${pWord}"${pIpa}${pLang}${pDef}${pExp} />`;
    } else if (comp.componentType === "Video") {
      const vTitle = (props.title || '').replace(/"/g, '&quot;');
      const vIdAttr = props.id ? ` id="${props.id.replace(/"/g, '&quot;')}"` : '';
      const vProvider = props.provider ? ` provider="${props.provider.replace(/"/g, '&quot;')}"` : '';
      const vUrl = props.url ? ` url="${props.url.replace(/"/g, '&quot;')}"` : '';
      const vDur = props.duration ? ` duration="${props.duration.replace(/"/g, '&quot;')}"` : '';
      const vUnres = props.unresolved !== undefined ? ` unresolved={${props.unresolved}}` : '';
      compStr = `<Video title="${vTitle}"${vIdAttr}${vProvider}${vUrl}${vDur}${vUnres} />`;
    } else if (comp.componentType === "Audio") {
      const aTitle = (props.title || '').replace(/"/g, '&quot;');
      const aUrl = (props.url || '').replace(/"/g, '&quot;');
      const aDur = props.duration ? ` duration="${props.duration.replace(/"/g, '&quot;')}"` : '';
      const aAi = props.aiGenerated !== undefined ? ` aiGenerated={${props.aiGenerated}}` : '';
      const aUnres = props.unresolved !== undefined ? ` unresolved={${props.unresolved}}` : '';
      const aAlt = props.alt ? ` alt="${props.alt.replace(/"/g, '&quot;')}"` : '';
      const aDesc = props.description ? ` description="${props.description.replace(/"/g, '&quot;')}"` : '';
      compStr = `<Audio title="${aTitle}" url="${aUrl}"${aDur}${aAi}${aUnres}${aAlt}${aDesc} />`;
    } else if (comp.componentType === "OralEvaluation" || comp.componentType === "EvaluationOrale") {
      const oPrompt = (props.prompt || '').replace(/"/g, '&quot;');
      const oSubject = props.subject ? ` subject="${props.subject.replace(/"/g, '&quot;')}"` : '';
      const oGrading = props.gradingSystem ? ` gradingSystem="${props.gradingSystem.replace(/"/g, '&quot;')}"` : '';
      const oDur = props.durationLimit ? ` durationLimit={${props.durationLimit}}` : '';
      const oFinal = props.isFinal !== undefined ? ` isFinal={${props.isFinal}}` : '';
      const oCalc = props.calculatorAllowed !== undefined ? ` calculatorAllowed={${props.calculatorAllowed}}` : '';
      const oDocs = props.externalDocumentsAllowed !== undefined ? ` externalDocumentsAllowed={${props.externalDocumentsAllowed}}` : '';
      const oWeb = props.webBrowsingAllowed !== undefined ? ` webBrowsingAllowed={${props.webBrowsingAllowed}}` : '';
      const oAi = props.aiTutorAssistanceAllowed !== undefined ? ` aiTutorAssistanceAllowed={${props.aiTutorAssistanceAllowed}}` : '';
      compStr = `<OralEvaluation prompt="${oPrompt}"${oSubject}${oGrading}${oDur}${oFinal}${oCalc}${oDocs}${oWeb}${oAi} />`;
    } else if (comp.componentType === "Biography") {
      const bName = (props.name || '').replace(/"/g, '&quot;');
      const bDates = props.dates ? ` dates="${props.dates.replace(/"/g, '&quot;')}"` : '';
      const bDesc = (props.description || '').replace(/"/g, '&quot;');
      const bWiki = props.wikipediaUrl ? ` wikipediaUrl="${props.wikipediaUrl.replace(/"/g, '&quot;')}"` : '';
      compStr = `<Biography name="${bName}"${bDates} description="${bDesc}"${bWiki} />`;
    } else if (comp.componentType === "Image") {
      const src = (props.src || props.url || '').trim();
      if (src && !props.unresolved) {
        const rawDesc = props.description || props.caption || props.alt || '';
        const mDesc = (props.description || rawDesc).replace(/"/g, '&quot;');
        const mAlt = ` alt="${(props.alt || rawDesc).replace(/"/g, '&quot;')}"`;
        const mCap = ` caption="${(props.caption || rawDesc).replace(/"/g, '&quot;')}"`;
        const mTitle = props.title ? ` title="${props.title.replace(/"/g, '&quot;')}"` : '';
        const mSrc = ` src="${src.replace(/"/g, '&quot;')}"`;
        const mFallbackUrl = props.fallbackUrl ? ` fallbackUrl="${props.fallbackUrl.replace(/"/g, '&quot;')}"` : '';
        const mIsIllustration = props.isIllustration !== undefined ? ` isIllustration={${props.isIllustration}}` : '';
        compStr = `<Image description="${mDesc}"${mAlt}${mCap}${mTitle}${mSrc}${mFallbackUrl}${mIsIllustration} />`;
      } else {
        compStr = '';
      }
    } else if (comp.componentType === "climate_impact_map" || comp.componentType === "ClimateImpactMap") {
      const mDesc = (props.description || '').replace(/"/g, '&quot;');
      const mAlt = props.alt ? ` alt="${props.alt.replace(/"/g, '&quot;')}"` : '';
      const mCap = props.caption ? ` caption="${props.caption.replace(/"/g, '&quot;')}"` : '';
      const mTitle = props.title ? ` title="${props.title.replace(/"/g, '&quot;')}"` : '';
      const mSrc = props.src ? ` src="${props.src.replace(/"/g, '&quot;')}"` : '';
      const mFallbackUrl = props.fallbackUrl ? ` fallbackUrl="${props.fallbackUrl.replace(/"/g, '&quot;')}"` : '';
      const mUnresolved = props.unresolved !== undefined ? ` unresolved={${props.unresolved}}` : '';
      compStr = `<ClimateImpactMap description="${mDesc}"${mAlt}${mCap}${mTitle}${mSrc}${mFallbackUrl}${mUnresolved} />`;
    } else if (comp.componentType === "Citation") {
      const cQuote = (props.quote || '').replace(/"/g, '&quot;');
      const cAuthor = (props.author || '').replace(/"/g, '&quot;');
      const cSource = (props.source || '').replace(/"/g, '&quot;');
      const cYear = props.year ? ` year="${props.year.replace(/"/g, '&quot;')}"` : '';
      const cOrig = props.original ? ` original="${props.original.replace(/"/g, '&quot;')}"` : '';
      const cComm = props.commentary ? ` commentary="${props.commentary.replace(/"/g, '&quot;')}"` : '';
      compStr = `<Citation quote="${cQuote}" author="${cAuthor}" source="${cSource}"${cYear}${cOrig}${cComm} />`;
    } else if (comp.componentType === "Epistemology") {
      const eTitle = (props.title || 'Critical Perspective').replace(/"/g, '&quot;');
      const eContent = props.content || '';
      compStr = `<Epistemology title="${eTitle}">\n${eContent}\n</Epistemology>`;
    } else if (comp.componentType === "MatchingEvaluation" || comp.componentType === "AssociationCorrespondance") {
      const titleAttr = props.title ? ` title="${props.title.replace(/"/g, '&quot;')}"` : '';
      const pairsAttr = (props.pairs || '').replace(/"/g, '&quot;');
      const explAttr = props.explanation ? ` explanation="${props.explanation.replace(/"/g, '&quot;')}"` : '';
      compStr = `<MatchingEvaluation pairs="${pairsAttr}"${titleAttr}${explAttr} />`;
    } else if (comp.componentType === "ReorderEvaluation" || comp.componentType === "ReordonnerItems") {
      const titleAttr = props.title ? ` title="${props.title.replace(/"/g, '&quot;')}"` : '';
      const itemsAttr = (props.items || '').replace(/"/g, '&quot;');
      const explAttr = props.explanation ? ` explanation="${props.explanation.replace(/"/g, '&quot;')}"` : '';
      compStr = `<ReorderEvaluation items="${itemsAttr}"${titleAttr}${explAttr} />`;
    } else if (comp.componentType === "Quiz") {
      const qProps = props || {};
      const qLimit = qProps.limit ? ` limit={${qProps.limit}}` : '';
      const qDuration = qProps.durationLimit ? ` durationLimit={${qProps.durationLimit}}` : '';
      const qMode = qProps.mode ? ` mode="${qProps.mode}"` : '';
      const qQDuration = qProps.questionDurationLimit ? ` questionDurationLimit={${qProps.questionDurationLimit}}` : '';
      const questionsMarkup = (qProps.questions || []).map((q: any) => {
        const qText = (q.q || '').replace(/"/g, '&quot;');
        const qExpl = (q.explanation || '').replace(/"/g, '&quot;');
        const qMultiple = q.multiple ? ' multiple={true}' : '';
        const optionsMarkup = (q.options || []).map((o: any) => {
          return `<Option text="${(o.text || '').replace(/"/g, '&quot;')}" correct={${o.correct}} />`;
        }).join('\n    ');
        return `  <Question q="${qText}" explanation="${qExpl}"${qMultiple}>\n    ${optionsMarkup}\n  </Question>`;
      }).join('\n  ');
      compStr = `<Quiz${qLimit}${qDuration}${qMode}${qQDuration}>\n  ${questionsMarkup}\n</Quiz>`;
    } else if (comp.componentType === "SolvedExercise" || comp.componentType === "ExerciceResolut") {
      const sTitle = (props.title || '').replace(/"/g, '&quot;');
      const sProblem = props.problem || '';
      const sSolution = props.solution || '';
      compStr = `<SolvedExercise title="${sTitle}">\n${sProblem}\n<Solution>\n${sSolution}\n</Solution>\n</SolvedExercise>`;
    } else if (comp.componentType === "UnsolvedExercise" || comp.componentType === "ExerciceACompleter") {
      const uTitle = (props.title || '').replace(/"/g, '&quot;');
      const uProblem = props.problem || '';
      const uCorrectAnswer = (props.correctAnswer || '').replace(/"/g, '&quot;');
      compStr = `<UnsolvedExercise title="${uTitle}" correctAnswer="${uCorrectAnswer}">\n${uProblem}\n</UnsolvedExercise>`;
    } else if (comp.componentType === "FillInBlanks" || comp.componentType === "TextesATrous") {
      // [FIX A2] Use question/blanks props to match healFillInBlanks normalization.
      const fQuestion = (props.question || props.sentence || '').replace(/"/g, '&quot;');
      const fBlanks = props.blanks ? JSON.stringify(props.blanks) : JSON.stringify([props.answer || '']);
      compStr = `<FillInBlanks question="${fQuestion}" blanks='${fBlanks}' />`;
    } else if (comp.componentType === "Mermaid") {
      const mChart = props.chart || '';
      compStr = `<Mermaid>\n${mChart}\n</Mermaid>`;
    } else {
      const props = comp.props || {};
      const attrStrings: string[] = [];
      Object.entries(props).forEach(([key, val]) => {
        if (key === 'description' || key === 'commentary' || key === 'definition') {
          attrStrings.push(`${key}="${String(val).replace(/"/g, '&quot;')}"`);
        } else if (typeof val === 'string') {
          attrStrings.push(`${key}="${val.replace(/"/g, '&quot;')}"`);
        } else if (typeof val === 'boolean' || typeof val === 'number') {
          attrStrings.push(`${key}={${val}}`);
        }
      });
      const childrenVal = props.name || props.title || props.term || props.word || comp.id;
      compStr = `<${comp.componentType} id="${comp.id}" ${attrStrings.join(' ')}>${childrenVal}</${comp.componentType}>`;
    }

    const { content: contentComp, replaced: repComp } = replaceWidget(content, comp.id, compStr);
    content = contentComp;
    if (!repComp) {
      const sectionHeader = comp.sectionAnchor || '##';
      const headingIdx = content.indexOf(sectionHeader);
      if (headingIdx !== -1) {
        const nextHeadingIdx = content.indexOf('##', headingIdx + sectionHeader.length);
        if (nextHeadingIdx !== -1) {
          content = content.slice(0, nextHeadingIdx).trim() + `\n\n${compStr}\n\n` + content.slice(nextHeadingIdx);
        } else {
          content = content + `\n\n${compStr}`;
        }
      } else {
        const summaryRegex = /\[\[\s*WIDGET\s*:\s*conclusionSummary\s*\]\]/i;
        if (summaryRegex.test(content)) {
          content = content.replace(summaryRegex, `${compStr}\n\n[[WIDGET:conclusionSummary]]`);
        } else {
          content = content + `\n\n${compStr}`;
        }
      }
    }
  });

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
    const evalHeading = isTerminalEvaluation ? finalEvalHeadings[langKey] : selfEvalHeadings[langKey];
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

