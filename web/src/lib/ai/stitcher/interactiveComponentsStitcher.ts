import { ensureBlockWidgetsOnOwnLines } from './widgetLineFormatter';
import { replaceWidget, extractAndInjectCitations } from './citationManager';

export function stitchInteractiveComponents(
  narrativeMdx: string,
  widgets: any,
  isTerminal: boolean = false
): { content: string; references: string[] } {
  let content = narrativeMdx.trim();
  if (!widgets) return { content, references: [] };

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



  return { content, references: widgets.references || [] };
}
