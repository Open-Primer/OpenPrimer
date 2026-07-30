You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 3 out of 3.
- You MUST write the content for the following sections:
* Heading: "## Athènes et Sparte : Deux Modèles, Des Interactions"
  Instructions: "Comparer les deux cités-États sur des points clés : politique, société, économie, culture et valeurs. Mettre en évidence leurs différences fondamentales et leurs quelques similitudes. Aborder brièvement les périodes de coopération et de conflit (notamment les guerres médiques et la guerre du Péloponnèse) qui ont marqué leurs relations."
* Heading: "## Conclusion : L'Héritage des Cités-États Grecques"
  Instructions: "Récapituler les points essentiels du cours : l'importance de la Polis, la diversité des modèles politiques (démocratie athénienne, oligarchie spartiate) et la notion de citoyenneté. Souligner l'influence durable de ces concepts et de ces civilisations sur l'histoire et la pensée politique occidentale."

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
... es :

*   **Les Homoioi (Les Égaux)** : C'étaient les citoyens à part entière, les seuls à avoir des droits politiques. Ils étaient avant tout des soldats professionnels, vivant de manière communautaire et entièrement dévoués à l'État. Ils ne travaillaient pas la terre, leur subsistance étant assurée par les Hilotes. Leur vie était régie par une discipline stricte et un entraînement militaire constant.

*   **Les Périèques** : Littéralement "ceux qui habitent autour", les Périèques étaient des hommes libres mais non-citoyens. Ils vivaient dans les cités périphériques de la Laconie, exerçaient des métiers (artisans, commerçants, agriculteurs) et devaient servir dans l'armée spartiate, mais n'avaient aucun droit politique. Ils constituaient une sorte de classe moyenne essentielle à l'économie spartiate.

*   **Les Hilotes** : C'était la classe la plus nombreuse et la plus opprimée. Les [[WIDGET:Glossary:hilotes:Hilotes]] étaient des serfs d'État, attachés à la terre et travaillant pour les Homoioi. Ils étaient considérés comme la propriété collective de l'État spartiate et étaient constamment surveillés et réprimés, leur nombre important (parfois dix fois supérieur à celui des Homoioi) représentant une menace permanente de révolte. La crainte des Hilotes était un facteur majeur de l'organisation militaire et de la discipline spartiate [[WIDGET:Reference:4]].

Au cœur de la société spartiate se trouvait l'[[WIDGET:Glossary:agogé:Agogé]], le système d'éducation militaire. Dès l'âge de sept ans, les garçons spartiates étaient retirés de leurs familles pour vivre dans des casernes, où ils subissaient un entraînement physique et militaire intensif. L'Agogé visait à forger des guerriers obéissants, endurants, courageux et loyaux envers la cité. L'accent était mis sur la discipline, la frugalité, l'endurance à la douleur et la soumission à l'autorité. Les filles recevaient également une éducation physique rigoureuse, car on attendait d'elles qu'elles donnent naissance à des enfants forts et sains.

L'importance de l'armée dans la vie spartiate ne peut être sous-estimée. Elle était le pilier de l'identité spartiate, la garantie de sa survie et le fondement de son organisation sociale. Chaque citoyen était un soldat, et la vie entière était subordonnée aux exigences militaires. Cette obsession pour la force armée et la discipline a permis à Sparte de devenir la puissance militaire terrestre dominante de la Grèce antique pendant plusieurs siècles.

[[WIDGET:Image:spartan_warriors:Comment la représentation de guerriers spartiates, avec leur équipement uniforme et leur formation serrée, illustre-t-elle les valeurs de discipline, d'unité et de force militaire collective qui définissaient la société spartiate ?]]

[[WIDGET:Mermaid:spartan_social_hierarchy:Diagramme illustrant la structure hiérarchique de la société spartiate, distinguant les Homoioi, les Périèques et les Hilotes, et montrant les relations de pouvoir et de dépendance entre ces classes sociales.]]
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


10. Since this is the LAST block, you MUST end with the ## Conclusion section containing at least two comprehensive academic paragraphs, and all conclusion widgets in this exact order:
  [[WIDGET:conclusionSummary]]
  [[WIDGET:whatsNext]]
  [[WIDGET:goingFurther]]
  followed by [[WIDGET:finalEvaluation]]


🚨 CRITIQUE FROM PREVIOUS ATTEMPT 🚨
The critique agent rejected your previous attempt for this block. Correct the following issues:
"[Block 3, Attempt 1] Failed to map rejected sections. Retrying globally."

Write the content for the specified sections. Return ONLY the markdown content. Do NOT wrap the response in markdown code blocks.