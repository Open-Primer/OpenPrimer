import React from 'react';

export function stripJsxAndRender(rawMdx: string) {
  // Clean raw MDX content from JSX tags to prevent rendering errors
  let clean = rawMdx;
  
  // Strip code frontmatter if present
  clean = clean.replace(/^---[\s\S]*?---/, '');
  
  // 1. Flatten Quiz / Auto-Evaluation into instructional text
  clean = clean.replace(/<Quiz[\s\S]*?>([\s\S]*?)<\/Quiz>/gi, (quizBlock, innerContent) => {
    const questionRegex = /<Question\b([^>]*?)>([\s\S]*?)<\/Question>/gi;
    let questionsText = '\n\n### 📝 Auto-Évaluation / Quiz :\n';
    let match;
    let qCount = 0;
    while ((match = questionRegex.exec(innerContent)) !== null) {
      qCount++;
      const attrsStr = match[1];
      const optionsBlock = match[2];
      
      const qMatch = attrsStr.match(/\bq="([^"]*)"/i) || attrsStr.match(/\bq='([^']*)'/i) ||
                     attrsStr.match(/\btext="([^"]*)"/i) || attrsStr.match(/\btext='([^']*)'/i) ||
                     attrsStr.match(/\bquestion="([^"]*)"/i) || attrsStr.match(/\bquestion='([^']*)'/i);
      const questionText = qMatch ? qMatch[1] : 'Question';
      
      questionsText += `\n**Question ${qCount} : ${questionText}**\n`;
      
      const optionRegex = /<Option\b([^>]*?)(?:>([\s\S]*?)<\/Option>|\/>)/gi;
      let optMatch;
      while ((optMatch = optionRegex.exec(optionsBlock)) !== null) {
        const optAttrsStr = optMatch[1];
        const optBody = optMatch[2] || '';
        
        const optTextMatch = optAttrsStr.match(/\btext="([^"]*)"/i) || optAttrsStr.match(/\btext='([^']*)'/i);
        const optionText = optTextMatch ? optTextMatch[1] : optBody.trim();
        
        const isCorrect = optAttrsStr.includes('correct={true}') || optAttrsStr.includes('correct="true"') || optAttrsStr.includes('correct=true');
        questionsText += `${isCorrect ? '✅' : '⬜'} ${optionText}${isCorrect ? ' *(Réponse attendue)*' : ''}\n`;
      }
    }
    if (qCount === 0) {
      return '\n\n*(Quiz interactif non disponible)*\n\n';
    }
    return questionsText + '\n';
  });

  // 2. Flatten CodeSandbox blocks
  clean = clean.replace(/<CodeSandbox([^>]*?)>([\s\S]*?)<\/CodeSandbox>/gi, (m, attrs, content) => {
    const titleMatch = attrs.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Exercice de programmation';
    return `\n\n💻 **[Activité pratique de code : ${title}]**\n${content}\n`;
  });

  // 3. Flatten ExternalSandbox
  clean = clean.replace(/<ExternalSandbox([^>]*?)\/>/gi, (m, attrs) => {
    const titleMatch = attrs.match(/title="([^"]+)"/);
    const urlMatch = attrs.match(/url="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Laboratoire de simulation';
    const url = urlMatch ? urlMatch[1] : '';
    return `\n\n🔗 **[Simulation interactive : ${title}]** *(Disponible en version complète à l'adresse : ${url || 'lien'})*\n`;
  });

  // 4. Flatten InteractiveDiagram
  clean = clean.replace(/<InteractiveDiagram([^>]*?)\/>/gi, (m, attrs) => {
    const titleMatch = attrs.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Schéma explicatif';
    return `\n\n📊 **[Schéma interactif : ${title}]** *(Version dynamique non disponible)*\n`;
  });

  // 5. Flatten ComparisonSlider
  clean = clean.replace(/<ComparisonSlider([^>]*?)\/>/gi, (m, attrs) => {
    const leftMatch = attrs.match(/leftTitle="([^"]+)"/);
    const rightMatch = attrs.match(/rightTitle="([^"]+)"/);
    const left = leftMatch ? leftMatch[1] : 'Avant';
    const right = rightMatch ? rightMatch[1] : 'Après';
    return `\n\n🔄 **[Comparatif : ${left} vs ${right}]** *(Version interactive non disponible)*\n`;
  });

  // Helper to extract attributes from JSX tags
  const getAttr = (attrs: string, name: string): string => {
    let match = attrs.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'));
    if (match) return match[1];
    match = attrs.match(new RegExp(`\\b${name}='([^']*)'`, 'i'));
    if (match) return match[1];
    match = attrs.match(new RegExp(`\\b${name}=\\{([^}]*)\\}`, 'i'));
    if (match) return match[1];
    return '';
  };

  // 6. Flatten SolvedExercise & UnsolvedExercise
  clean = clean.replace(/<SolvedExercise([\s\S]*?)(?:\/>|>([\s\S]*?)<\/SolvedExercise>)/gi, (m, attrs, content) => {
    const title = getAttr(attrs, 'title') || "Exercice d'application";
    const solution = getAttr(attrs, 'solution');
    const mainContent = (content || '').trim();
    
    let result = `\n\n✏️ **[Exercice résolu : ${title}]**\n`;
    if (mainContent) {
      result += `${mainContent}\n`;
    }
    if (solution) {
      result += `**Solution :** ${solution}\n`;
    }
    return result;
  });
  clean = clean.replace(/<UnsolvedExercise([\s\S]*?)(?:\/>|>([\s\S]*?)<\/UnsolvedExercise>)/gi, (m, attrs, content) => {
    const title = getAttr(attrs, 'title') || 'Exercice à résoudre';
    const question = getAttr(attrs, 'question');
    const hint = getAttr(attrs, 'hint');
    const solution = getAttr(attrs, 'solution');
    const mainContent = (content || '').trim();
    
    let result = `\n\n✏️ **[Exercice pratique : ${title}]**\n`;
    const body = question || mainContent;
    if (body) {
      result += `${body}\n`;
    }
    if (hint) {
      result += `*Indice :* ${hint}\n`;
    }
    if (solution) {
      result += `*Solution :* ${solution}\n`;
    }
    return result;
  });

  // 7. Flatten mathematical/science utility manipulators
  clean = clean.replace(/<FunctionPlotter([^>]*?)\/>/gi, (m, attrs) => {
    const formulaMatch = attrs.match(/formula="([^"]+)"/);
    const formula = formulaMatch ? formulaMatch[1] : '';
    return `\n\n📈 **[Visualiseur de courbe]**\n${formula ? `Équation : \`y = ${formula}\`` : ''}\n`;
  });
  clean = clean.replace(/<FunctionManipulator([^>]*?)\/>/gi, (m, attrs) => {
    const formulaMatch = attrs.match(/formula="([^"]+)"/);
    const formula = formulaMatch ? formulaMatch[1] : '';
    return `\n\n📈 **[Explorateur de fonction]**\n${formula ? `Équation interactive : \`y = ${formula}\`` : ''}\n`;
  });

  // 8. Flatten Mermaid diagrams
  clean = clean.replace(/<Mermaid([^>]*?)>([\s\S]*?)<\/Mermaid>/gi, (m, attrs, content) => {
    return `\n\n📋 **[Diagramme structurel Mermaid]**\n\`\`\`mermaid\n${content.trim()}\n\`\`\`\n`;
  });

  // 9. Clean up FillInBlanks dot notations and wrappers
  clean = clean.replace(/<FillInBlanks\.Input[^>]*?answer="([^"]+)"[^>]*?\/>/gi, ' **[ $1 ]** ');
  clean = clean.replace(/<FillInBlanks\.Input[^>]*?\/>/gi, ' **[ _______ ]** ');
  clean = clean.replace(/<FillInBlanksQuestion\b[^>]*?q="([^"]+)"[^>]*?\/>/gi, (m, qVal) => {
    return `\n\n📖 **[Exercice à trous]**\n${qVal}\n`;
  });
  clean = clean.replace(/<FillInBlanks[\s\S]*?>([\s\S]*?)<\/FillInBlanks>/gi, (m, content) => {
    return `\n\n📖 **[Exercice à trous]**\n${content.replace(/<[^>]+>/g, '')}\n`;
  });

  // 10. Replace inline named components with text formatting
  clean = clean.replace(/<(?:RealPerson|HistoricalPerson|Event|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|FictionalCharacter|Location|Place|WebsiteLink|ProjectLink|SiteWeb|ProjetLien|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien|LawLink|LienLoi|LienJuridique)\b[^>]*?>([\s\S]*?)<\/(?:RealPerson|HistoricalPerson|Event|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|FictionalCharacter|Location|Place|WebsiteLink|ProjectLink|SiteWeb|ProjetLien|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien|LawLink|LienLoi|LienJuridique)>/gi, '**$1**');
  clean = clean.replace(/<Artwork\b[^>]*?>([\s\S]*?)<\/Artwork>/gi, '*$1*');
  
  // Strip remaining custom tag structures but preserve their content
  clean = clean.replace(/<[A-Za-z0-9_.-]+[^>]*>/g, '');
  clean = clean.replace(/<\/[A-Za-z0-9_.-]+>/g, '');
  
  const lines = clean.split('\n');
  return (
    <div className="space-y-6 select-text opacity-95 leading-relaxed text-slate-300">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} className="text-xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">{trimmed.substring(3)}</h2>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="text-lg font-bold text-white mt-6 mb-3">{trimmed.substring(4)}</h3>;
        }
        if (trimmed.startsWith('#### ')) {
          return <h4 key={idx} className="text-base font-bold text-white mt-4 mb-2">{trimmed.substring(5)}</h4>;
        }
        
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return <li key={idx} className="ml-6 list-disc my-1">{trimmed.substring(2)}</li>;
        }
        if (/^\d+\.\s+/.test(trimmed)) {
          const content = trimmed.replace(/^\d+\.\s+/, '');
          return <li key={idx} className="ml-6 list-decimal my-1">{content}</li>;
        }
        
        if (trimmed.startsWith('> ')) {
          return <blockquote key={idx} className="border-l-4 border-slate-700 pl-4 py-1 italic my-4 text-slate-400">{trimmed.substring(2)}</blockquote>;
        }
        
        return <p key={idx} className="my-4">{trimmed}</p>;
      })}
    </div>
  );
}

interface MdxContentProps {
  source: MDXRemoteSerializeResult;
  rawMdx?: string;
  courseSlug?: string;
  lessonSlug?: string;
}

