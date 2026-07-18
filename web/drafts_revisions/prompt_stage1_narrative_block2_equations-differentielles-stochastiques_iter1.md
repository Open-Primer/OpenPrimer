You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 2 out of 3.
- You MUST write the content for the following sections:
* Heading: "## Théorèmes d'Existence et d'Unicité des Solutions d'EDS"
  Instructions: "Détailler les conditions (e.g., conditions de Lipschitz et de croissance linéaire) sous lesquelles une EDS admet une solution unique. Présenter les théorèmes clés garantissant l'existence et l'unicité des solutions, et discuter de leur importance pratique pour la validité des modèles financiers."
* Heading: "## EDS Linéaires et l'Équation de Black-Scholes"
  Instructions: "Étudier les propriétés et les méthodes de résolution des EDS linéaires, en fournissant des exemples pertinents. Introduire l'EDS de Black-Scholes pour la modélisation du prix des actifs financiers, en expliquant sa dérivation et son rôle central dans la valorisation des options et la gestion des risques."

---

### GLOBAL CONTEXT:
- Course Name: "Finance quantitative et modélisation stochastique"
- Academic Level: "Master 1st Year (M1)"
- Lesson Title: "Équations Différentielles Stochastiques (EDS)"
- Discipline: "Finance Quantitative"
- Target Language: "FR"
- References available:
[[WIDGET:Reference:1]] Shreve, Steven E. Stochastic Calculus for Finance I: The Binomial Asset Pricing Model. Springer, 2004.
[[WIDGET:Reference:2]] Shreve, Steven E. Stochastic Calculus for Finance II: Continuous-Time Models. Springer, 2004.
[[WIDGET:Reference:3]] Hull, John C. Options, Futures, and Other Derivatives. Pearson, 2018.
[[WIDGET:Reference:4]] Björk, Tomas. Arbitrage Theory in Continuous Time. Oxford University Press, 2009.
[[WIDGET:Reference:5]] Cont, Rama, and Peter Tankov. Financial Modelling with Jump Processes. Chapman and Hall/CRC, 2004.
[[WIDGET:Reference:6]] Karatzas, Ioannis, and Steven E. Shreve. Brownian Motion and Stochastic Calculus. Springer, 1991.
[[WIDGET:Reference:7]] Musiela, Marek, and Marek Rutkowski. Martingale Methods in Financial Modelling. Springer, 2005.
[[WIDGET:Reference:8]] Baxter, Martin, and Andrew Rennie. Financial Calculus: An Introduction to Derivative Pricing. Cambridge University Press, 1996.
[[WIDGET:Reference:9]] Glasserman, Paul. Monte Carlo Methods in Financial Engineering. Springer, 2004.
[[WIDGET:Reference:10]] Duffie, Darrell. Dynamic Asset Pricing Theory. Princeton University Press, 2001.
[[WIDGET:Reference:11]] Lamberton, Damien, and Bernard Lapeyre. Introduction to Stochastic Calculus Applied to Finance. Chapman and Hall/CRC, 2008.
[[WIDGET:Reference:12]] Neftci, Salih N. An Introduction to the Mathematics of Financial Derivatives. Academic Press, 2000.
[[WIDGET:Reference:13]] Oksendal, Bernt. Stochastic Differential Equations: An Introduction with Applications. Springer, 2003.
[[WIDGET:Reference:14]] Wilmott, Paul. Paul Wilmott on Quantitative Finance. John Wiley & Sons, 2006.
[[WIDGET:Reference:15]] Brigo, Damiano, and Fabio Mercurio. Interest Rate Models - Theory and Practice. Springer, 2006.
[[WIDGET:Reference:16]] Gatheral, Jim. The Volatility Surface: A Practitioner's Guide. John Wiley & Sons, 2006.
[[WIDGET:Reference:17]] Jeanblanc, Monique, Marc Yor, and Marc Chesney. Mathematical Methods for Financial Markets. Springer, 2009.
[[WIDGET:Reference:18]] Protter, Philip E. Stochastic Integration and Differential Equations. Springer, 2005.
[[WIDGET:Reference:19]] Kwok, Yue-Kuen. Mathematical Models of Financial Derivatives. Springer, 2008.
[[WIDGET:Reference:20]] Pascucci, Andrea. PDE and Martingale Methods in Option Pricing. Springer, 2011.


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
- At least 2-3 block widgets/media (using [[WIDGET:Image:id:description]], [[WIDGET:CustomFigure:id:description]], [[WIDGET:Mermaid:id:description]], [[WIDGET:ComparisonSlider:id]], [[WIDGET:InteractiveDiagram:id]], [[WIDGET:DataChart:id]], or [[WIDGET:Video:id:description]]) placed on separate blank lines.
- ABSOLUTE PROHIBITION ON HORIZONTAL SEPARATOR LINES (like `---` or `___`) immediately below or above any widget.
Choose from the following options:
1. [[WIDGET:Biography:unique_id]] - For key historical figures, scientists, authors, or artists. (e.g. [[WIDGET:Biography:rousseau]] or [[WIDGET:Biography:robespierre]] or [[WIDGET:Biography:louis_xvi]])
2. [[WIDGET:Image:unique_id:description]] (or [[WIDGET:CustomFigure:unique_id:description]]) - For relevant paintings, historical photos, maps, diagrams, or illustrations. Note: in the generated MDX component catalog, this maps to the CustomFigure component. (e.g. [[WIDGET:Image:prise_bastille:La prise de la Bastille le 14 juillet 1789]])
3. [[WIDGET:Video:unique_id:description]] - For relevant documentaries, video archives, or animations. (e.g. [[WIDGET:Video:revolution_francaise:Documentaire sur les grandes étapes de la Révolution française]])
4. [[WIDGET:Audio:unique_id:description]] - For audio speeches, narrations, or pronunciations. (e.g. [[WIDGET:Audio:declaration_droits:Enregistrement sonore de la Déclaration des droits]])
5. [[WIDGET:Mermaid:unique_id:description]] - For timelines, flowcharts, or structural diagrams. (e.g. [[WIDGET:Mermaid:timeline_causes:Chronologie des causes de la Révolution]])
6. [[WIDGET:Quiz:unique_id]] - For formative multiple-choice quizzes to verify student comprehension.
7. [[WIDGET:SolvedExercise:unique_id]] - For step-by-step resolved exercises, coding snippets, or analytical case studies.
8. [[WIDGET:UnsolvedExercise:unique_id]] - For unsolved application exercises or practice questions.
9. [[WIDGET:FillInBlanks:unique_id]] - For interactive fill-in-the-blanks sentences.
10. [[WIDGET:RealPerson:unique_id:Person Name]] - Inline hover-card highlight for any person mentioned. (e.g. "...alors que [[WIDGET:RealPerson:louis_xvi:Louis XVI]] convoque...")
11. [[WIDGET:ConceptLink:unique_id:Concept Name]] - Inline hover-card highlight for conceptual terms. (e.g. "...l'essor de la [[WIDGET:ConceptLink:souverainete:Souveraineté]] populaire...")
12. [[WIDGET:Glossary:unique_id:Term]] - Inline hover-card highlight for vocabulary definitions. (e.g. "...les députés du [[WIDGET:Glossary:tiers_etat:Tiers État]] se réunissent...")
13. [[WIDGET:Quote:unique_id:description]] - Block widget for a famous quotation or author quote, including original/translation and source. Scribe must place this anchor on a separate blank line. (e.g. [[WIDGET:Quote:marie_curie_perseverance:Citation de Marie Curie sur la persévérance dans la recherche scientifique]])

Please write them exactly in this anchor format [[WIDGET:Type:unique_id:description]] (or [[WIDGET:Type:unique_id]] where description is not applicable, or with topic/label for highlights). Do NOT write raw JSX/HTML tags!

---

### PREVIOUS TEXT (for transitions and context):
Below is the text generated in the previous blocks. Do NOT repeat any definitions, concepts, or sentences from this text. Start writing immediately from where it left off, ensuring a smooth transition:
"""
... 'équivalent stochastique de la règle de la chaîne du calcul différentiel classique. Il est absolument fondamental pour la manipulation des fonctions de processus d'Itô (qui sont les solutions des EDS). Si $X_t$ est un processus d'Itô défini par $dX_t = a(t, X_t) \, dt + b(t, X_t) \, dW_t$, et si $f(t, x)$ est une fonction de classe $C^{1,2}$ (c'est-à-dire une fois continûment différentiable par rapport à $t$ et deux fois par rapport à $x$), alors le processus $Y_t = f(t, X_t)$ est aussi un processus d'Itô et son différentiel stochastique est donné par le lemme d'Itô:

$$ dY_t = \left( \frac{\partial f}{\partial t} + a(t, X_t) \frac{\partial f}{\partial x} + \frac{1}{2} b(t, X_t)^2 \frac{\partial^2 f}{\partial x^2} \right) \, dt + b(t, X_t) \frac{\partial f}{\partial x} \, dW_t $$

Le terme $\frac{1}{2} b(t, X_t)^2 \frac{\partial^2 f}{\partial x^2} \, dt$ est le terme d'Itô, qui n'a pas d'équivalent dans le calcul classique et est une conséquence directe de la nature non-différentiable du mouvement brownien. Ce lemme est omniprésent en finance quantitative, notamment pour dériver des équations aux dérivées partielles (EDP) comme l'équation de Black-Scholes à partir de modèles d'EDS [[WIDGET:Reference:2]], [[WIDGET:Reference:11]].

### Définition Formelle d'une EDS

Une Équation Différentielle Stochastique unidimensionnelle peut être formellement écrite sous la forme:

$$ dX_t = \mu(t, X_t) \, dt + \sigma(t, X_t) \, dW_t $$

où:
*   $X_t$ est le processus stochastique que nous cherchons à modéliser (par exemple, le prix d'un actif financier).
*   $dW_t$ représente le différentiel d'un mouvement brownien standard, source de la stochasticité.
*   $\mu(t, X_t)$ est la fonction de **dérive** (ou *drift*). Elle représente la tendance déterministe du processus, c'est-à-dire la direction moyenne dans laquelle le processus évoluerait en l'absence de chocs aléatoires. En finance, elle est souvent associée au taux de rendement espéré de l'actif [[WIDGET:Reference:1]].
*   $\sigma(t, X_t)$ est la fonction de **diffusion** (ou *volatilité*). Elle mesure l'amplitude des fluctuations aléatoires autour de la tendance déterministe. En finance, elle est directement liée à la volatilité de l'actif, indiquant à quel point le prix de l'actif est susceptible de varier de manière imprévisible [[WIDGET:Reference:14]].

[[WIDGET:Mermaid:eds_components:Diagramme illustrant les composantes d'une Équation Différentielle Stochastique (EDS) et leur rôle]]

L'interprétation économique et probabiliste de ces composantes est cruciale. Le terme de dérive $\mu(t, X_t) \, dt$ capture l'évolution systématique ou prévisible du système, tandis que le terme de diffusion $\sigma(t, X_t) \, dW_t$ représente la composante aléatoire, les chocs imprévus du marché. La combinaison de ces deux termes permet de construire des modèles réalistes pour une multitude de phénomènes financiers, allant de la dynamique des prix d'actions aux modèles de taux d'intérêt et de crédit [[WIDGET:Reference:15]].
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