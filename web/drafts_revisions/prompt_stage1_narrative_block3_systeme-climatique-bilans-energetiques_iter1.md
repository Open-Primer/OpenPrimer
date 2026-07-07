You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 3 out of 3.
- You MUST write the content for the following sections:
* Heading: "## Conclusion: Synthèse et perspectives"
  Instructions: "Récapituler les points clés abordés concernant les bilans énergétiques et la composition atmosphérique. Souligner l'interdépendance de ces éléments dans la régulation du climat terrestre. Ouvrir sur les enjeux actuels du changement climatique et l'importance de ces concepts pour les études futures."

---

### GLOBAL CONTEXT:
- Course Name: "Géographie physique et climatologie"
- Academic Level: "University Year 3 / Bachelor 3rd Year (L3)"
- Lesson Title: "Le système climatique terrestre: bilans énergétiques et composition atmosphérique"
- Discipline: "Géographie"
- Target Language: "FR"
- References available:
[ref1] Barry, R.G. et Chorley, R.J. (2009). «Atmosphere, Weather and Climate». Routledge.
[ref2] Strahler, A.N. et Strahler, A.H. (2006). «Introducing Physical Geography». John Wiley & Sons.
[ref3] Tricart, J. et Cailleux, A. (1965). «Traité de géomorphologie». SEDES.
[ref4] Viers, G. (1990). «Éléments de climatologie». Nathan.
[ref5] Peltier, R. (2005). «La Terre: géographie physique». Ellipses.
[ref6] GIEC (2021). «Changement climatique 2021: Les bases scientifiques physiques». Contribution du Groupe de travail I au sixième Rapport d'évaluation du Groupe d'experts intergouvernemental sur l'évolution du climat.


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
You are REQUIRED to include:
- At least 2-3 inline hover-cards (using [[WIDGET:RealPerson:id:Name]], [[WIDGET:ConceptLink:id:Concept Name]], or [[WIDGET:Glossary:id:Term]]) for key figures, concepts, or technical terms in this block of prose.
- At least 1-2 block widgets/media (using [[WIDGET:Image:id]], [[WIDGET:Mermaid:id]], [[WIDGET:ComparisonSlider:id]], [[WIDGET:InteractiveDiagram:id]], [[WIDGET:DataChart:id]], or [[WIDGET:Video:id]]) placed on separate blank lines.
Choose from the following options:
1. [[WIDGET:Biography:unique_id]] - For key historical figures, scientists, authors, or artists. (e.g. [[WIDGET:Biography:rousseau]] or [[WIDGET:Biography:robespierre]] or [[WIDGET:Biography:louis_xvi]])
2. [[WIDGET:Image:unique_id]] - For relevant paintings, historical photos, maps, diagrams, or illustrations. (e.g. [[WIDGET:Image:prise_bastille]])
3. [[WIDGET:Video:unique_id]] - For relevant documentaries, video archives, or animations. (e.g. [[WIDGET:Video:revolution_francaise]])
4. [[WIDGET:Audio:unique_id]] - For audio speeches, narrations, or pronunciations. (e.g. [[WIDGET:Audio:declaration_droits]])
5. [[WIDGET:Mermaid:unique_id]] - For timelines, flowcharts, or structural diagrams. (e.g. [[WIDGET:Mermaid:timeline_causes]])
6. [[WIDGET:Quiz:unique_id]] - For formative multiple-choice quizzes to verify student comprehension.
7. [[WIDGET:SolvedExercise:unique_id]] - For step-by-step resolved exercises, coding snippets, or analytical case studies.
8. [[WIDGET:UnsolvedExercise:unique_id]] - For unsolved application exercises or practice questions.
9. [[WIDGET:FillInBlanks:unique_id]] - For interactive fill-in-the-blanks sentences.
10. [[WIDGET:RealPerson:unique_id:Person Name]] - Inline hover-card highlight for any person mentioned. (e.g. "...alors que [[WIDGET:RealPerson:louis_xvi:Louis XVI]] convoque...")
11. [[WIDGET:ConceptLink:unique_id:Concept Name]] - Inline hover-card highlight for conceptual terms. (e.g. "...l'essor de la [[WIDGET:ConceptLink:souverainete:Souveraineté]] populaire...")
12. [[WIDGET:Glossary:unique_id:Term]] - Inline hover-card highlight for vocabulary definitions. (e.g. "...les députés du [[WIDGET:Glossary:tiers_etat:Tiers État]] se réunissent...")

Please write them exactly in this anchor format [[WIDGET:Type:unique_id]] (or with topic/label for highlights). Do NOT write raw JSX/HTML tags!

---

### PREVIOUS TEXT (for transitions and context):
Below is the text generated in the previous blocks. Do NOT repeat any definitions, concepts, or sentences from this text. Start writing immediately from where it left off, ensuring a smooth transition:
"""
... o, la Terre absorbe le rayonnement solaire et émet son propre rayonnement infrarouge vers l'espace. La température d'équilibre peut être calculée en utilisant la [[WIDGET:ConceptLink:loi_stefan_boltzmann:loi de Stefan-Boltzmann]], qui relie la puissance rayonnée par un corps noir à sa température.

En supposant un albédo moyen de la Terre (environ 0,3) et une constante solaire (environ 1361 W/m²), la température d'équilibre théorique de la Terre sans atmosphère serait d'environ -18°C (255 K) [ref2]. Cette valeur est significativement inférieure à la température moyenne observée de +15°C, ce qui met en évidence l'importance de l'atmosphère et de l'effet de serre naturel.

### Modèle à une couche atmosphérique

Pour illustrer l'effet de serre, un modèle conceptuel plus élaboré est le modèle à une couche atmosphérique. Ce modèle simplifie l'atmosphère en une seule couche gazeuse qui est transparente au rayonnement solaire incident mais opaque au rayonnement infrarouge terrestre.

Dans ce modèle, la surface terrestre absorbe le rayonnement solaire et émet du rayonnement infrarouge. La couche atmosphérique absorbe tout le rayonnement infrarouge émis par la surface et réémet à son tour du rayonnement infrarouge à la fois vers l'espace et vers la surface terrestre. Pour maintenir l'équilibre énergétique, la surface doit se réchauffer davantage pour compenser le rayonnement infrarouge réémis par l'atmosphère vers le bas. Ce modèle simple prédit une température de surface terrestre d'environ +30°C, ce qui est supérieur à la température observée.

[[WIDGET:Mermaid:one_layer_model_diagram]]
mermaid
graph TD
    A[Rayonnement Solaire Incident] --> B{Surface Terrestre}
    B -- Rayonnement IR Émis --> C[Couche Atmosphérique (GES)]
    C -- Rayonnement IR vers l'Espace --> D(Espace)
    C -- Rayonnement IR vers la Surface --> B
    B -- Chaleur Latente/Sensible --> C

*Diagramme conceptuel du modèle à une couche atmosphérique, illustrant les flux d'énergie et le rôle de la couche de gaz à effet de serre.*

### Limites des modèles simplifiés

Ces modèles, bien qu'utiles pour illustrer le principe de l'effet de serre, présentent des limites importantes :
*   **Simplification excessive:** Ils ne tiennent pas compte de la structure verticale complexe de l'atmosphère, des variations de concentration des GES, de la présence de nuages, des transferts de chaleur par convection et évaporation, ni des cycles biogéochimiques [ref1].
*   **Homogénéité:** Ils supposent une Terre et une atmosphère homogènes, sans variations géographiques ou saisonnières.
*   **Absence de dynamique:** Ils ignorent les mouvements atmosphériques et océaniques qui redistribuent l'énergie.

Malgré ces simplifications, ils démontrent clairement que la présence de gaz absorbant le rayonnement infrarouge dans l'atmosphère est indispensable pour maintenir la Terre à une température propice à la vie, et que toute modification de la concentration de ces gaz peut altérer cet équilibre thermique [ref6].
"""

---

⚠️ CRITICAL MARKUP & XML/JSX COMPLIANCE RULES (MDX SAFETY MANDATE):
1. ABSOLUTE PROHIBITION ON RAW INTERACTIVE OR CUSTOM JSX/HTML TAGS. Absolutely no custom JSX/HTML tags (such as <ConceptLink>, <RealPerson>, <Glossary>, etc.) are allowed inline in prose. Exclusively use [[WIDGET:id]] anchors for all widgets, media, links, or elements.
2. NO RAW HTML FOR LISTS. Use Markdown bullets/numbering.
3. NO LITERAL CURLY BRACES in plain text. Wrap in LaTeX or backticks.
4. NO STRAY import/export statements.
5. NO WIDGET ANCHORS INSIDE LISTS OR TABLES. Place them on separate blank lines.
6. Captions of images or Mermaid diagrams must NOT contain figure prefixes (like 'Figure 1:', 'Image A -'). CAPTIONS MUST ONLY contain the descriptive prose.
7. ACADEMIC REFERENCES CITATION MANDATE: You MUST actively cite the references listed under "### GLOBAL CONTEXT:" (if any) throughout the prose. Cite them inline using the format [ref1], [ref2], etc., where [ref1] maps to the first reference in the Global Context list, [ref2] to the second, and so on. Do not define a bibliography section here; simply cite them inline in this format.

8. Since this is the LAST block, you MUST end with the ## Conclusion section containing at least two comprehensive academic paragraphs, and all conclusion widgets in this exact order:
  [[WIDGET:conclusionSummary]]
  [[WIDGET:whatsNext]]
  [[WIDGET:goingFurther]]
  followed by [[WIDGET:finalEvaluation]]



Write the content for the specified sections. Return ONLY the markdown content. Do NOT wrap the response in markdown code blocks.