You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 2 out of 3.
- You MUST write the content for the following sections:
* Heading: "## Athènes : Le Berceau de la Démocratie"
  Instructions: "Présenter Athènes comme un exemple majeur de Polis. Décrire son système politique démocratique (assemblée du peuple, boule, héliée), en soulignant ses principes et son fonctionnement. Évoquer la vie quotidienne, la culture, les arts et la philosophie athénienne, ainsi que le rôle des citoyens dans cette société."
* Heading: "## Sparte : L'Oligarchie Militaire"
  Instructions: "Présenter Sparte comme un contre-exemple frappant d'Athènes. Décrire son système politique oligarchique et son organisation sociale rigide, centrée sur l'éducation militaire (agogé) et la discipline. Expliquer le rôle des différentes classes sociales (Homoioi, Périèques, Hilotes) et l'importance de l'armée dans la vie spartiate."

---

### GLOBAL CONTEXT:
- Course Name: "Grèce antique"
- Academic Level: "Middle School (secondary_1)"
- Lesson Title: "L'émergence des cités-États : La Polis, Athènes et Sparte"
- Discipline: "Histoire"
- Target Language: "FR"
- References available:
[[WIDGET:Reference:1]] Jean-Pierre Vernant, "Mythe et pensée chez les Grecs: Études de psychologie historique", La Découverte, 2007.
[[WIDGET:Reference:2]] Pierre Lévêque, "Clio: Introduction à l'histoire", Armand Colin, 2001.
[[WIDGET:Reference:3]] Moses Finley, "Économie et société en Grèce ancienne", Seuil, 1984.
[[WIDGET:Reference:4]] Paul Cartledge, "Les Grecs: Portrait d'un peuple", Flammarion, 2002.
[[WIDGET:Reference:5]] Jacqueline de Romilly, "La Grèce antique à la découverte de la liberté", Éditions de Fallois, 1989.
[[WIDGET:Reference:6]] Claude Mossé, "La Grèce archaïque d'Homère à Eschyle", Seuil, 1984.
[[WIDGET:Reference:7]] Jean-Pierre Vernant, "L'Univers, les Dieux, les Hommes: Récits grecs des origines", Seuil, 1999.


### LEVEL CONSTRAINTS (from database — MANDATORY to enforce):
- Minimum words per lesson block: 1000 — Maximum: 1500
- Minimum inline hover-cards per block: **2** (ConceptLink, RealPerson, Glossary)
- Minimum block widgets per block: **1** (Image, Mermaid, Video, DataChart, etc.)
- Minimum biographies (RealPerson) in this lesson: 1
- Minimum concept links (ConceptLink) in this lesson: 3
- Minimum glossary terms in this lesson: 3
- Minimum bibliographic references in this lesson: 2
- **MANDATED widget types for this level** (must include at least one): HistoricalAnecdote, Quiz, Image, Mermaid
- **DISCOURAGED widget types for this level** (avoid unless essential): None

---

### PRE-EXISTING WIDGET INVENTORY:
The following relevant media and database resources are available for this course. If any of these are highly relevant to the current section, you should refer/embed them using their exact ID as [[WIDGET:id]] on a separate blank line:
- ID: "Mermaid"
  Name: "Mermaid Diagram Engine" (Moteur de diagrammes Mermaid)
  Description: "Render rich flowcharts, timelines, and concept maps from descriptive text markup."
  Disciplines: [All Disciplines]
  Educational Level: "All levels"

### PEDAGOGICAL WIDGETS MANDATE (CRITICAL):
To make this curriculum visually rich, interactive, and academically rigorous, you MUST actively insert pedagogical widgets using bracketed anchors directly in the prose. 
- CRITICAL IMAGE RELEVANCE & CAPTIONING: Every Image or CustomFigure anchor you generate MUST have a strong, direct connection with the current lesson/concept, and must be highly informative (never generic, decorative, or filler). Visual captions for these figures must strictly be inquiry-based and academically relevant rather than purely descriptive. For example, instead of a plain caption like "Cette image représente un monocorde", write an inquiry-based caption like "Comment ce schéma d'un monocorde permet-il de visualiser concrètement les rapports harmoniques des longueurs de cordes ?". All captions must prompt active reflection, invite the learner to think, or show academic utility.
- CRITICAL INTERACTIVE WIDGET CONNECTION: Every interactive widget anchor (such as Quiz, SolvedExercise, UnsolvedExercise, FillInBlanks, Mermaid, DataChart, and other interactive diagrams/simulations) MUST be strongly connected to the lesson. Ensure they are placed in a context where they have specific parameters, equations, or data relevant to the lesson topics, and where a detailed explanation is pedagogically appropriate. You MUST provide a detailed description acting as a legend/caption in the anchor itself (e.g., [[WIDGET:Mermaid:id:Detailed description of the diagram and its variables]).
You are REQUIRED to include:
- At least 2 inline hover-cards (using [[WIDGET:RealPerson:id:Name]], [[WIDGET:ConceptLink:id:Concept Name]], or [[WIDGET:Glossary:id:Term]]) for key figures, concepts, or technical terms in this block of prose.
- MANDATORY: At least 1 block widgets/media placed on separate blank lines, chosen from: [[WIDGET:Image:id:description]], [[WIDGET:CustomFigure:id:description]], [[WIDGET:Mermaid:id:description]], [[WIDGET:ComparisonSlider:id]], [[WIDGET:InteractiveDiagram:id]], [[WIDGET:DataChart:id]], [[WIDGET:Video:id:description]].
- MEDIA COMPOSITION REQUIREMENT: Each narrative block MUST include at minimum (a) at least 1 image or figure ([[WIDGET:Image]] or [[WIDGET:CustomFigure]]) showing a relevant diagram, formula, or scientific illustration AND (b) at least 1 structural/diagrammatic widget ([[WIDGET:Mermaid]] for flowcharts/timelines/graphs, or [[WIDGET:Video]] for a pedagogical video). These are NOT optional — a block with only text and hover-cards will be REJECTED.
- MANDATED WIDGET TYPES for this academic level: you MUST include at least one occurrence of each of the following widget types across the lesson: HistoricalAnecdote, Quiz, Image, Mermaid.

- ABSOLUTE PROHIBITION ON HORIZONTAL SEPARATOR LINES (like `---` or `___`) immediately below or above any widget.
Choose from the following options:
1. [[WIDGET:Biography:unique_id]] - For key historical figures, scientists, authors, or artists. (e.g. [[WIDGET:Biography:rousseau]] or [[WIDGET:Biography:robespierre]] or [[WIDGET:Biography:louis_xvi]])
2. [[WIDGET:Image:unique_id:description]] (or [[WIDGET:CustomFigure:unique_id:description]]) - For relevant paintings, historical photos, maps, diagrams, or illustrations. Note: in the generated MDX component catalog, this maps to the CustomFigure component. (e.g. [[WIDGET:Image:prise_bastille:La prise de la Bastille le 14 juillet 1789]])
3. [[WIDGET:Video:unique_id:description]] - For relevant documentaries, video archives, or animations. (e.g. [[WIDGET:Video:revolution_francaise:Documentaire sur les grandes étapes de la Révolution française]])
4. [[WIDGET:Audio:unique_id:description]] - For audio speeches, narrations, musical examples, or pronunciations. (e.g. [[WIDGET:Audio:declaration_droits:Enregistrement sonore de la Déclaration des droits]])
5. [[WIDGET:Mermaid:unique_id:description]] - For timelines, flowcharts, or structural diagrams. (e.g. [[WIDGET:Mermaid:timeline_causes:Chronologie des causes de la Révolution]])
6. [[WIDGET:Quiz:unique_id]] - For formative multiple-choice quizzes to verify student comprehension.
7. [[WIDGET:SolvedExercise:unique_id]] - For step-by-step resolved exercises, coding snippets, or analytical case studies.
8. [[WIDGET:UnsolvedExercise:unique_id]] - For unsolved application exercises or practice questions.
9. [[WIDGET:FillInBlanks:unique_id]] - For interactive fill-in-the-blanks sentences.
10. [[WIDGET:RealPerson:unique_id:Person Name]] - Inline hover-card highlight for any person mentioned. (e.g. "...alors que [[WIDGET:RealPerson:louis_xvi:Louis XVI]] convoque...")
11. [[WIDGET:ConceptLink:unique_id:Concept Name]] - Inline hover-card highlight for conceptual terms. (e.g. "...l'essor de la [[WIDGET:ConceptLink:souverainete:Souveraineté]] populaire...")
12. [[WIDGET:Glossary:unique_id:Term]] - Inline hover-card highlight for vocabulary definitions. (e.g. "...les députés du [[WIDGET:Glossary:tiers_etat:Tiers État]] se réunissent...")
13. [[WIDGET:Quote:unique_id:description]] - Block widget for a famous quotation or author quote, including original/translation and source (renders as Citation in MDX). Scribe must place this anchor on a separate blank line. (e.g. [[WIDGET:Quote:marie_curie_perseverance:Citation de Marie Curie sur la persévérance dans la recherche scientifique]])
14. [[WIDGET:EventLink:unique_id:Event Name]] - Inline hover-card highlight for any key historical, cultural, or scientific event. (e.g. "...après la [[WIDGET:EventLink:bataille_marignan:Bataille de Marignan]] en 1515...")

Please write them exactly in this anchor format [[WIDGET:Type:unique_id:description]] (or [[WIDGET:Type:unique_id]] where description is not applicable, or with topic/label for highlights). Do NOT write raw JSX/HTML tags!

---

### PREVIOUS TEXT (for transitions and context):
Below is the text generated in the previous blocks. Do NOT repeat any definitions, concepts, or sentences from this text. Start writing immediately from where it left off, ensuring a smooth transition:
"""
... des esclaves ou des paysans dépendants.

[[WIDGET:Image:acropole_athenes:Comment l'Acropole d'Athènes, avec ses temples majestueux, incarne-t-elle à la fois la puissance religieuse et la défense stratégique de la Polis ?]]

Au cœur de la Polis se trouvait la notion de citoyenneté. Être citoyen en Grèce antique n'était pas un droit universel, mais un privilège réservé à une minorité. Généralement, seuls les hommes adultes, nés de parents citoyens de la Polis, étaient considérés comme citoyens. Cette citoyenneté conférait des droits importants :
*   **Droits politiques** : Participer aux assemblées, voter les lois, élire les magistrats, et parfois même être tiré au sort pour exercer des fonctions publiques.
*   **Droits juridiques** : Être protégé par les lois de la cité, ester en justice.
*   **Droits sociaux et religieux** : Participer aux cultes publics, aux fêtes civiques et aux banquets.
*   **Droits fonciers** : Posséder des terres au sein du territoire de la Polis.

Cependant, la citoyenneté impliquait aussi des devoirs stricts :
*   **Devoir militaire** : Servir dans l'armée de la cité pour la défendre.
*   **Devoir fiscal** : Payer des impôts pour financer les dépenses publiques.
*   **Devoir civique** : Participer activement à la vie politique et religieuse de la Polis.

La majorité de la population était exclue de la citoyenneté et donc de la vie politique. Parmi eux, on trouvait :
*   **Les femmes** : Qu'elles soient citoyennes par naissance ou non, les femmes étaient exclues de la sphère publique et politique. Leur rôle était principalement domestique et religieux.
*   **Les esclaves** : Considérés comme des biens meubles, ils n'avaient aucun droit et étaient la propriété d'un maître. Ils constituaient une part importante de la main-d'œuvre dans l'agriculture, l'artisanat et les mines, et leur travail permettait aux citoyens de se consacrer aux affaires publiques. Comme l'a montré [[WIDGET:RealPerson:moses_finley:Moses Finley]], l'esclavage était une institution fondamentale de l'économie grecque [[WIDGET:Reference:3]].
*   **Les Mètèques** : Ce terme désignait les étrangers résidant dans la cité. Ils étaient libres, pouvaient exercer un métier, posséder des biens et devaient payer des impôts et parfois servir dans l'armée, mais ils n'avaient aucun droit politique et ne pouvaient pas posséder de terres. Le terme [[WIDGET:Glossary:meteques:Mètèque]] est essentiel pour comprendre la structure sociale des cités grecques.

La Polis était donc une société hiérarchisée où la participation politique était l'apanage d'une élite masculine. Cette structure, bien que restrictive, a permis l'émergence de formes de gouvernement et de débats politiques d'une richesse inégalée pour l'époque.

[[WIDGET:Mermaid:structure_sociale_polis:Diagramme illustrant la hiérarchie sociale et politique d'une Polis grecque typique, distinguant les citoyens, les femmes, les mètèques et les esclaves, et montrant les flux de droits et de devoirs entre ces catégories.]]
"""

---

⚠️ CRITICAL MARKUP & XML/JSX COMPLIANCE RULES (MDX SAFETY MANDATE):
1. ABSOLUTE PROHIBITION ON RAW INTERACTIVE OR CUSTOM JSX/HTML TAGS. Absolutely no custom JSX/HTML tags (such as <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup>) are allowed inline in prose. Exclusively use [[WIDGET:id]] anchors for all widgets, media, links, or elements. For inline bibliographic reference citations, you MUST exclusively use [[WIDGET:Reference:num]] (e.g. [[WIDGET:Reference:1]]) instead of any HTML/JSX markup or brackets. Agent 3a must never attempt to output raw JSX/HTML tags; all features must strictly use [[WIDGET:id]] anchors.
2. NO RAW HTML FOR LISTS. Use Markdown bullets/numbering.
3. NO LITERAL CURLY BRACES in plain text. Wrap in LaTeX or backticks.
4. NO STRAY import/export statements.
5. NO WIDGET ANCHORS INSIDE LISTS OR TABLES. Place them on separate blank lines.
6. Captions of images or Mermaid diagrams must NOT contain figure prefixes (like 'Figure 1:', 'Image A -'). CAPTIONS MUST ONLY contain the descriptive prose.
7. ACADEMIC REFERENCES CITATION MANDATE: You MUST actively cite the references listed under "### GLOBAL CONTEXT:" (if any) throughout the prose. Cite them inline using the format [[WIDGET:Reference:1]], [[WIDGET:Reference:2]], etc., where [[WIDGET:Reference:1]] maps to the first reference in the Global Context list, [[WIDGET:Reference:2]] to the second, and so on. Exclusively use [[WIDGET:Reference:num]] anchors. Do not define a bibliography section here; simply cite them inline in this format.
8. MANDATORY DESCRIPTION FOR MEDIA WIDGETS: For all media/visual widgets (including Image, CustomFigure, Video, Audio, and Mermaid), you MUST append the description/caption as the third parameter in the widget anchor: [[WIDGET:Type:id:description]]. Absolute prohibition on placing external descriptions, captions, or comments (such as "*Description: ...*", "Caption: ...", "Légende: ...") directly in the narrative prose outside the anchor.
9. ABSOLUTE PROHIBITION ON RAW MERMAID DIAGRAMS. Never write raw Mermaid diagram code (e.g. wrapped in ```mermaid ... ```) directly in the narrative prose. Instead, you MUST only generate a widget anchor like `[[WIDGET:Mermaid:id:description]]` on a separate blank line, describing what the diagram should display in the description. The actual Mermaid diagram code will be generated later by the Widgets Architect (Agent 3b).






Write the content for the specified sections. Return ONLY the markdown content. Do NOT wrap the response in markdown code blocks.