You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Practice Exercises, Visual Diagrams, and Multimedia components of the lesson (quizzes, exercises, charts, videos, and audios).

The narrative text contains the following custom widget anchors that you MUST define in this block:
- Anchor: [[WIDGET:Image:theatre_epidaure:Comment l'architecture du théâtre d'Épidaure reflète-t-elle l'acoustique et la fonction sociale du spectacle dans la Grèc'antique ?]] (Type: "Image", ID: "theatre_epidaure", Topic: "Comment l'architecture du théâtre d'Épidaure reflète-t-elle l'acoustique et la fonction sociale du spectacle dans la Grèc'antique ?")
- Anchor: [[WIDGET:Mermaid:evolution_theatre_grec:Visualisation des étapes clés de l'évolution du théâtre grec, de ses origines religieuses aux grands dramaturges.]] (Type: "Mermaid", ID: "evolution_theatre_grec", Topic: "Visualisation des étapes clés de l'évolution du théâtre grec, de ses origines religieuses aux grands dramaturges.")
- Anchor: [[WIDGET:Image:parthenon_architecture:Comment l'architecture du Parthénon, avec ses colonnes doriques et ses proportions harmonieuses, illustre-t-elle la recherche de perfection et d'équilibre dans l'art grec antique ?]] (Type: "Image", ID: "parthenon_architecture", Topic: "Comment l'architecture du Parthénon, avec ses colonnes doriques et ses proportions harmonieuses, illustre-t-elle la recherche de perfection et d'équilibre dans l'art grec antique ?")
- Anchor: [[WIDGET:Mermaid:philosophical_lineage:Diagramme illustrant la filiation intellectuelle et l'influence des trois grands philosophes grecs : Socrate, Platon et Aristote, et leurs contributions majeures.]] (Type: "Mermaid", ID: "philosophical_lineage", Topic: "Diagramme illustrant la filiation intellectuelle et l'influence des trois grands philosophes grecs : Socrate, Platon et Aristote, et leurs contributions majeures.")
- Anchor: [[WIDGET:Quiz:quiz_arts_pensee_grecque]] (Type: "Quiz", ID: "quiz_arts_pensee_grecque", Topic: "")
- Anchor: [[WIDGET:Image:parlement_grec_moderne:Comment l'architecture du Parlement hellénique à Athènes, construit au XIXe siècle, reflète-t-elle les idéaux esthétiques et politiques de la Grèc'antique ?]] (Type: "Image", ID: "parlement_grec_moderne", Topic: "Comment l'architecture du Parlement hellénique à Athènes, construit au XIXe siècle, reflète-t-elle les idéaux esthétiques et politiques de la Grèc'antique ?")
- Anchor: [[WIDGET:HistoricalAnecdote:renaissance_olympique:La renaissance des Jeux Olympiques modernes en 1896 à Athènes fut un hommage direct à l'héritage sportif et culturel de la Grèc'antique, visant à promouvoir la paix et l'entente internationale par le sport.]] (Type: "HistoricalAnecdote", ID: "renaissance_olympique", Topic: "La renaissance des Jeux Olympiques modernes en 1896 à Athènes fut un hommage direct à l'héritage sportif et culturel de la Grèc'antique, visant à promouvoir la paix et l'entente internationale par le sport.")
- Anchor: [[WIDGET:Video:heritage_grec_moderne:Découvrez comment l'héritage de la Grèc'antique continue de façonner notre monde moderne, de l'architecture aux idées politiques et philosophiques.]] (Type: "Video", ID: "heritage_grec_moderne", Topic: "Découvrez comment l'héritage de la Grèc'antique continue de façonner notre monde moderne, de l'architecture aux idées politiques et philosophiques.")

---

### CATALOG AND GUIDELINES:
- ID: "Mermaid"
  Name: "Mermaid Diagram Engine" (Moteur de diagrammes Mermaid)
  Description: "Render rich flowcharts, timelines, and concept maps from descriptive text markup."
  Disciplines: [All Disciplines]
  Educational Level: "All levels"

### REQUIRED PROPS STRUCTURE per componentType:
1. "Image":
   - "description": (string) Detailed academic description of what the image depicts (at least 2-3 sentences). Must have a strong, direct connection with the current lesson/concept, and must be highly informative (never generic or decorative). Write it as a description of an existing image (e.g., "Carte linguistique de la péninsule italienne montrant la répartition des principaux groupes de dialectes...") rather than drawing instructions for a designer (e.g. do NOT say "Générer une carte..."). Do NOT generate sequential figure prefixes.
   - "alt": (string) Short description for accessibility.
   - "caption": (string) A detailed, italicized, and highly pedagogical inquiry-based caption. It must NOT be a simple descriptive summary of what the image shows (avoid plain descriptions like "Un buste de Pythagore"). Instead, it MUST pose a thought-provoking question, prompt active reflection, or highlight specific academic utility to make the learner think (e.g. "En quoi la structure géométrique de ce monocorde permet-elle de visualiser concrètement les rapports harmoniques ?"). Do NOT generate sequential figure numbers.
   - "title": (string) Short title of the image.
   - "searchQuery": (string) Highly canonical 1 to 3 search words (e.g. 'Claudio Monteverdi', 'Prise de la Bastille') to search in archives.
   ⛔ ABSOLUTELY FORBIDDEN for Image: Do NOT output "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "year" for Image components under any circumstances. These fields do not exist for Image. The URL is resolved automatically downstream by the media-resolver pipeline using the searchQuery and description. Including any of these fields — even with a seemingly valid URL — will cause a pipeline error and block validation.
2. "Video":
   - "title": (string) Title of the video documentary or lecture segment.
   - "duration": (string) Estimated duration, e.g. "3:15".
   - "description": (string) Detailed description of the video's content, documentary topic, or lecture segment. MANDATORY.
   - "searchQuery": (string) Canonical search query to find this video on platforms like YouTube. MANDATORY.
   ⛔ ABSOLUTELY FORBIDDEN for Video: Do NOT output "url", "id", "provider", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" for Video components under any circumstances. These fields do not exist for Video in the initial widget definition. The resource is resolved automatically downstream by the external-resource-resolver pipeline using the searchQuery and title. Including any of these fields will cause a pipeline error and block validation.
3. "Audio":
   - "title": (string) Short descriptive title for the audio.
   - "duration": (string) e.g. "1:30".
   - "description": (string) Detailed description/narration text. MANDATORY.
   - "searchQuery": (string) Canonical search query to find this audio resource. MANDATORY.
   ⛔ ABSOLUTELY FORBIDDEN for Audio: Do NOT output "url", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" for Audio components under any circumstances. These fields do not exist for Audio in the initial widget definition. The resource is resolved automatically downstream by the external-resource-resolver pipeline using the searchQuery and title. Including any of these fields will cause a pipeline error and block validation.
4. "Quiz":
   - "limit": (integer) Number of questions to display.
   - "questions": (array of objects) Each object must have:
     - "q": (string) The question card text.
     - "explanation": (string) Extremely concise, punchy explanation of the correct choice(s).
     - "multiple": (boolean, optional) Set to true if the question has MULTIPLE correct answers — the student must select ALL of them. Omit or set false for standard single-answer questions. Use multiple=true for at most 25% of questions to add variety.
     - "options": (array of objects) Each option must have:
       - "text": (string) Option text.
       - "correct": (boolean) Whether correct. For multiple=true, mark ALL correct options as correct=true.
5. "SolvedExercise":
   - "title": (string) Exercise title.
   - "problem": (string) The markdown-formatted problem statement.
   - "solution": (string) Detailed step-by-step solution.
6. "UnsolvedExercise":
   - "title": (string) Exercise title.
   - "problem": (string) Markdown problem statement.
   - "correctAnswer": (string) The correct analytical answer or formula.
7. "FillInBlanks":
   - "sentence": (string) Sentence containing one or more blanks represented by five underscores (_____).
   - "answer": (string) Correct comma-separated answers.
8. "Mermaid":
   - "chart": (string) Valid Mermaid chart notation starting with graph/sequenceDiagram/etc.

DO NOT output any properties that are not explicitly defined in the props catalog above for a given componentType. For instance, do NOT output "year", "dates", "url", "wikipediaUrl", "wikipediaLink", "imageUrl", "id", "provider", or "unresolved" for Image, Audio, Video, Quiz, SolvedExercise, UnsolvedExercise, or Mermaid; if you do, the critique agent will reject the block.

You must define the "interactiveComponents" array containing one object for each anchor listed above.
For each component:
- "id": Must match the ID from the anchor.
- "componentType": Must match the Type from the anchor.
- "sectionAnchor": The markdown heading "## Section Name" where this widget is placed in the narrative.
- "props": The specific properties required for the widget type as described above.

⚠️ CRITICAL INSTRUCTION ON INTERACTIVE WIDGETS & SIMULATORS:
- ALL interactive widgets (such as quizzes, solved/unsolved exercises, Mermaid charts, DataCharts, and simulations like "FunctionPlotter", "FunctionManipulator", "DynamicSimulation", "BasicMathExplorer", "ChemicalStoichiometry", etc.) MUST be strongly connected to the lesson.
- Choice of Parameters: You must ensure that the choice of parameters, equations, formulas, variables, inputs, or datasets is highly customized, topic-specific, and not generic. Never use default placeholders (such as "y = x^2" or generic template arrays).
- Explanation Section: Every interactive widget must include a clear, detailed explanation or solution section explaining how these parameters and inputs relate to the lesson's concepts, showing real academic depth.
- Concurrency: If the same widget is used multiple times, configure each instance with different, highly topic-relevant parameters.
- Mandatory Caption/Legend: You MUST specify a detailed, academic caption/description/legend (via the "caption" or "description" prop) for every single interactive widget, simulator, Mermaid chart, and data table. This caption/legend is required for accessibility and academic rigor and must describe the widget and its parameters.

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
"The widget block contains placeholder values. All interactive elements must be fully populated with real, high-quality, professional educational content. Zero placeholders, draft markers, bracketed texts, or template values are allowed.
Detailed errors:
- Field "interactiveComponents": The 'interactiveComponents' array contains a placeholder component with 'placeholderId', 'placeholderType', and 'placeholderAnchor'. This violates the rule that all interactive elements must be fully populated with real, high-quality, professional educational content and must not contain any placeholders or skeletal text."
Please fix these issues and regenerate.