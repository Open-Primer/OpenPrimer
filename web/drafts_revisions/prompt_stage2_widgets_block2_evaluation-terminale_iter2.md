You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the interactive components of the lesson.

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:ConceptLink:approche_systemique:approche systémique]] (Type: "ConceptLink", ID: "approche_systemique", Topic: "approche systémique")
- Anchor: [[WIDGET:Image:cycle_eau_global]] (Type: "Image", ID: "cycle_eau_global", Topic: "")
- Anchor: [[WIDGET:RealPerson:koppen:Wladimir Köppen]] (Type: "RealPerson", ID: "koppen", Topic: "Wladimir Köppen")
- Anchor: [[WIDGET:ConceptLink:giec:GIEC]] (Type: "ConceptLink", ID: "giec", Topic: "GIEC")
- Anchor: [[WIDGET:Mermaid:interconnexions_geo_clim]] (Type: "Mermaid", ID: "interconnexions_geo_clim", Topic: "")
- Anchor: [[WIDGET:Quiz:concepts_fondamentaux_quiz]] (Type: "Quiz", ID: "concepts_fondamentaux_quiz", Topic: "")
- Anchor: [[WIDGET:RealPerson:koppen:Wladimir Köppen]] (Type: "RealPerson", ID: "koppen", Topic: "Wladimir Köppen")
- Anchor: [[WIDGET:Glossary:teledetection:Télédétection]] (Type: "Glossary", ID: "teledetection", Topic: "Télédétection")
- Anchor: [[WIDGET:Image:carte_koppen_exemple]] (Type: "Image", ID: "carte_koppen_exemple", Topic: "")
- Anchor: [[WIDGET:Mermaid:methodologie_analyse_flux]] (Type: "Mermaid", ID: "methodologie_analyse_flux", Topic: "")
- Anchor: [[WIDGET:RealPerson:tricart:Jean Tricart]] (Type: "RealPerson", ID: "tricart", Topic: "Jean Tricart")
- Anchor: [[WIDGET:RealPerson:strahler:Arthur N. Strahler]] (Type: "RealPerson", ID: "strahler", Topic: "Arthur N. Strahler")
- Anchor: [[WIDGET:Quiz:analyse_documents_quiz]] (Type: "Quiz", ID: "analyse_documents_quiz", Topic: "")
- Anchor: [[WIDGET:ConceptLink:giec:GIEC]] (Type: "ConceptLink", ID: "giec", Topic: "GIEC")
- Anchor: [[WIDGET:Glossary:retroaction_climatique:Rétroaction climatique]] (Type: "Glossary", ID: "retroaction_climatique", Topic: "Rétroaction climatique")
- Anchor: [[WIDGET:ConceptLink:geomorphologie_climatique:Géomorphologie climatique]] (Type: "ConceptLink", ID: "geomorphologie_climatique", Topic: "Géomorphologie climatique")
- Anchor: [[WIDGET:HistoricalAnecdote:paleoclimatologie_giacobini]] (Type: "HistoricalAnecdote", ID: "paleoclimatologie_giacobini", Topic: "")
- Anchor: [[WIDGET:SolvedExercise:analyse_cas_desertification]] (Type: "SolvedExercise", ID: "analyse_cas_desertification", Topic: "")
- Anchor: [[WIDGET:RealPerson:stahler:Arthur N. Strahler]] (Type: "RealPerson", ID: "stahler", Topic: "Arthur N. Strahler")
- Anchor: [[WIDGET:RealPerson:giec:GIEC]] (Type: "RealPerson", ID: "giec", Topic: "GIEC")
- Anchor: [[WIDGET:Image:exam_preparation_desk]] (Type: "Image", ID: "exam_preparation_desk", Topic: "")
- Anchor: [[WIDGET:RealPerson:giec:GIEC]] (Type: "RealPerson", ID: "giec", Topic: "GIEC")
- Anchor: [[WIDGET:Mermaid:essay_structure_flowchart]] (Type: "Mermaid", ID: "essay_structure_flowchart", Topic: "")
- Anchor: [[WIDGET:Glossary:albedo:albédo]] (Type: "Glossary", ID: "albedo", Topic: "albédo")
- Anchor: [[WIDGET:Glossary:cyclone:cyclone tropical]] (Type: "Glossary", ID: "cyclone", Topic: "cyclone tropical")
- Anchor: [[WIDGET:ConceptLink:bilan_radiatif:bilan radiatif terrestre]] (Type: "ConceptLink", ID: "bilan_radiatif", Topic: "bilan radiatif terrestre")
- Anchor: [[WIDGET:Quiz:exam_criteria_quiz]] (Type: "Quiz", ID: "exam_criteria_quiz", Topic: "")

---

### CATALOG AND GUIDELINES:
- ID: "Mermaid"
  Name: "Mermaid Diagram Engine" (Moteur de diagrammes Mermaid)
  Description: "Render rich flowcharts, timelines, and concept maps from descriptive text markup."
  Disciplines: [All Disciplines]
  Educational Level: "All levels"

### REQUIRED PROPS STRUCTURE per componentType:
1. "Biography":
   - "name": (string) Full name of the person.
   - "dates": (string) Lifespan dates, e.g. "1723-1790" or "1856-1939".
   - "description": (string) Detailed biographical summary focusing on their contributions (8-12 sentences).
   - "wikipediaUrl": (string) Direct link to their English or French Wikipedia page.
2. "Image":
   - "description": (string) Detailed search/generation description for the image (at least 2-3 sentences of visual instructions). Do NOT generate sequential figure prefixes.
   - "alt": (string) Short description for accessibility.
   - "caption": (string) A detailed, italicized caption explaining academic relevance. Do NOT generate sequential figure numbers.
   - "title": (string) Short title of the image.
   - "searchQuery": (string) Highly canonical 1 to 3 search words (e.g. 'Claudio Monteverdi', 'Prise de la Bastille') to search in archives.
3. "Video":
   - "title": (string) Title of the video documentary or lecture segment.
   - "duration": (string) Estimated duration, e.g. "3:15".
4. "Audio":
   - "title": (string) Short descriptive title for the audio.
   - "duration": (string) e.g. "1:30".
   - "description": (string) Detailed description/narration text.
5. "Quiz":
   - "limit": (integer) Number of questions to display.
   - "questions": (array of objects) Each object must have:
     - "q": (string) The question card text.
     - "explanation": (string) Extremely concise, punchy explanation of the correct choice.
     - "options": (array of objects) Each option must have:
       - "text": (string) Option text.
       - "correct": (boolean) Whether correct.
6. "SolvedExercise":
   - "title": (string) Exercise title.
   - "problem": (string) The markdown-formatted problem statement.
   - "solution": (string) Detailed step-by-step solution.
7. "UnsolvedExercise":
   - "title": (string) Exercise title.
   - "problem": (string) Markdown problem statement.
   - "correctAnswer": (string) The correct analytical answer or formula.
8. "FillInBlanks":
   - "sentence": (string) Sentence containing one or more blanks represented by five underscores (_____).
   - "answer": (string) Correct comma-separated answers.
9. "Mermaid":
   - "chart": (string) Valid Mermaid chart notation starting with graph/sequenceDiagram/etc.
10. "RealPerson" or "HistoricalPerson":
   - "name": (string) Full name of the person (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this person (2-4 sentences).
11. "ConceptLink":
   - "name": (string) Name of the concept (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this concept (2-4 sentences).
12. "Glossary":
   - "term": (string) Glossary vocabulary term.
   - "definition": (string) Detailed vocabulary definition (2-4 sentences).
13. "HistoricalAnecdote":
   - "title": (string) Historical anecdote title.
   - "date": (string, optional) Lifespan, period, or date of the anecdote.
   - "content": (string) Interesting detailed narrative (4-8 sentences).
14. "BrilliantIdea":
   - "title": (string, optional) Idea title/theme.
   - "content": (string) Key insight, tip, rule of thumb, or summary (3-6 sentences).

You must define the "interactiveComponents" array containing one object for each anchor listed above.
For each component:
- "id": Must match the ID from the anchor.
- "componentType": Must match the Type from the anchor.
- "sectionAnchor": The markdown heading "## Section Name" where this widget is placed in the narrative.
- "props": The specific properties required for the widget type as described above.

Return ONLY a valid JSON object matching this schema:
\`\`\`json
{
  "interactiveComponents": [
    {
      "id": "string",
      "componentType": "string",
      "sectionAnchor": "string",
      "props": {}
    }
  ]
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.

🚨 PREVIOUS CRITIQUE:
"The RealPerson components are missing essential biographical details. For each RealPerson component, the props object must include dates (e.g., 'YYYY-YYYY') and a wikipediaLink (a valid URL) to provide complete and correct biographical information as required. Additionally, there appear to be two RealPerson components (strahler and stahler) that might refer to the same individual (Arthur N. Strahler); please consolidate or clarify if they are distinct.
Detailed errors:
- Field "koppen": The props object for this RealPerson component is empty. It must include dates (e.g., 'YYYY-YYYY') and a wikipediaLink (a valid URL) to fulfill the requirement for complete biographical details.
- Field "tricart": The props object for this RealPerson component is empty. It must include dates (e.g., 'YYYY-YYYY') and a wikipediaLink (a valid URL) to fulfill the requirement for complete biographical details.
- Field "strahler": The props object for this RealPerson component is empty. It must include dates (e.g., 'YYYY-YYYY') and a wikipediaLink (a valid URL) to fulfill the requirement for complete biographical details.
- Field "stahler": The props object for this RealPerson component is empty. It must include dates (e.g., 'YYYY-YYYY') and a wikipediaLink (a valid URL) to fulfill the requirement for complete biographical details."
Please fix these issues and regenerate.