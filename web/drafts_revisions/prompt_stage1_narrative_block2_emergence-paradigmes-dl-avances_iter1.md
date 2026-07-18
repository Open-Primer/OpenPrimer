You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 2 out of 3.
- You MUST write the content for the following sections:
* Heading: "## L'Émergence des Modèles Séquentiels Avancés et du Mécanisme d'Attention"
  Instructions: "Expliquer l'évolution des modèles séquentiels au-delà des RNN simples (e.g., LSTM, GRU) pour adresser les problèmes de dépendances à long terme. Introduire ensuite le concept révolutionnaire du mécanisme d'attention, en détaillant son fonctionnement et son rôle crucial dans l'amélioration des performances des modèles sur des tâches complexes comme la traduction automatique, menant à l'architecture Transformer."
* Heading: "## Contexte Historique et Jalons Majeurs de l'Apprentissage Profond"
  Instructions: "Situer les avancées architecturales (CNN, RNN, Attention, Transformers) dans une perspective historique. Décrire les moments clés, les défis surmontés et les motivations derrière chaque innovation majeure, soulignant comment chaque nouvelle architecture a répondu à des limitations des précédentes et ouvert de nouvelles voies de recherche."

---

### GLOBAL CONTEXT:
- Course Name: "Deep Learning avancé et modèles génératifs"
- Academic Level: "Master 2nd Year (M2)"
- Lesson Title: "Émergence et Paradigmes des Modèles d'Apprentissage Profond Avancés"
- Discipline: "Général"
- Target Language: "FR"
- References available:
[[WIDGET:Reference:1]] Goodfellow, Ian, et al. 'Generative Adversarial Networks.' Advances in Neural Information Processing Systems 27, 2014.
[[WIDGET:Reference:2]] Kingma, Diederik P., and Max Welling. 'Auto-Encoding Variational Bayes.' International Conference on Learning Representations, 2014.
[[WIDGET:Reference:3]] Vaswani, Ashish, et al. 'Attention Is All You Need.' Advances in Neural Information Processing Systems 30, 2017.
[[WIDGET:Reference:4]] Ho, Jonathan, et al. 'Denoising Diffusion Probabilistic Models.' Advances in Neural Information Processing Systems 33, 2020.
[[WIDGET:Reference:5]] Sohl-Dickstein, Jascha, et al. 'Deep Unsupervised Learning using Nonequilibrium Thermodynamics.' International Conference on Machine Learning, 2015.
[[WIDGET:Reference:6]] Radford, Alec, et al. 'Unsupervised Representation Learning with Deep Convolutional Generative Adversarial Networks.' International Conference on Learning Representations, 2016.
[[WIDGET:Reference:7]] Karras, Tero, et al. 'A Style-Based Generator Architecture for Generative Adversarial Networks.' IEEE/CVF Conference on Computer Vision and Pattern Recognition, 2019.
[[WIDGET:Reference:8]] Devlin, Jacob, et al. 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding.' North American Chapter of the Association for Computational Linguistics, 2019.
[[WIDGET:Reference:9]] Brown, Tom B., et al. 'Language Models are Few-Shot Learners.' Advances in Neural Information Processing Systems 33, 2020.
[[WIDGET:Reference:10]] Rombach, Robin, et al. 'High-Resolution Image Synthesis with Latent Diffusion Models.' IEEE/CVF Conference on Computer Vision and Pattern Recognition, 2022.
[[WIDGET:Reference:11]] Bengio, Yoshua, et al. 'Learning Deep Architectures for AI.' Foundations and Trends in Machine Learning 2.1, 2009.
[[WIDGET:Reference:12]] LeCun, Yann, et al. 'Deep Learning.' Nature 521.7553, 2015.
[[WIDGET:Reference:13]] Chollet, François. 'Deep Learning with Python.' Manning Publications, 2017.
[[WIDGET:Reference:14]] Bishop, Christopher M. 'Pattern Recognition and Machine Learning.' Springer, 2006.
[[WIDGET:Reference:15]] Sutton, Richard S., and Andrew G. Barto. 'Reinforcement Learning: An Introduction.' MIT Press, 2018.
[[WIDGET:Reference:16]] Arjovsky, Martin, et al. 'Wasserstein GAN.' International Conference on Machine Learning, 2017.
[[WIDGET:Reference:17]] Oord, Aaron van den, et al. 'Conditional Image Generation with PixelCNN Decoders.' Advances in Neural Information Processing Systems 29, 2016.
[[WIDGET:Reference:18]] Dhariwal, Prafulla, and Alex Nichol. 'Diffusion Models Beat GANs on Image Synthesis.' Advances in Neural Information Processing Systems 34, 2021.
[[WIDGET:Reference:19]] Goodfellow, Ian, et al. 'Deep Learning.' MIT Press, 2016.
[[WIDGET:Reference:20]] Li, Jiwei, et al. 'A Survey of Generative Adversarial Networks.' arXiv preprint arXiv:1710.07035, 2017.


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
- At least 1-2 block widgets/media (using [[WIDGET:Image:id:description]], [[WIDGET:CustomFigure:id:description]], [[WIDGET:Mermaid:id:description]], [[WIDGET:ComparisonSlider:id]], [[WIDGET:InteractiveDiagram:id]], [[WIDGET:DataChart:id]], or [[WIDGET:Video:id:description]]) placed on separate blank lines.
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
... GET:RealPerson:yann_lecun:Yann LeCun]] sur LeNet-5, ont révolutionné le traitement d'images et la vision par ordinateur [[WIDGET:Reference:12]]. Leur principe repose sur l'utilisation de filtres convolutifs pour extraire automatiquement des caractéristiques hiérarchiques à partir de données d'entrée, telles que les bords, les textures et les formes, sans nécessiter d'ingénierie de caractéristiques manuelle. Grâce à des couches de convolution, de pooling et des couches entièrement connectées, les CNN ont atteint des performances remarquables dans des tâches comme la classification d'images, la détection d'objets et la segmentation sémantique.

Les **Réseaux de Neurones Récurrents (RNN)**, quant à eux, ont excellé dans le traitement des données séquentielles, comme le langage naturel et les séries temporelles. Leur architecture permet de maintenir un état interne (mémoire) qui capture des informations sur les éléments précédents de la séquence, rendant possible la modélisation de dépendances temporelles. Les RNN ont été les premières architectures efficaces pour des tâches telles que la traduction automatique, la reconnaissance vocale et la génération de texte.

Malgré leurs succès initiaux et leur impact profond, ces architectures présentaient des limitations intrinsèques qui ont motivé la recherche de nouvelles approches.

Pour les **RNN**, la principale difficulté résidait dans la gestion des dépendances à long terme. Lors de l'apprentissage, le [[WIDGET:Glossary:gradient:gradient]] pouvait s'atténuer (vanishing gradient) ou exploser (exploding gradient) au fur et à mesure qu'il se propageait à travers de nombreuses étapes temporelles, rendant difficile l'apprentissage de relations entre des éléments éloignés dans une séquence. Bien que des variantes comme les Long Short-Term Memory (LSTM) et les Gated Recurrent Units (GRU) aient partiellement atténué ce problème, elles ne l'ont pas complètement résolu et restaient intrinsèquement séquentielles, limitant la parallélisation du calcul et donc la vitesse d'entraînement sur de très longues séquences.

Pour les **CNN**, bien qu'exceptionnels pour les données structurées en grille comme les images, leur architecture était moins flexible pour d'autres types de données. Leur champ réceptif fixe et localisé les rendait moins aptes à capturer des dépendances globales ou des relations complexes non spatiales sans des couches très profondes ou des mécanismes ad-hoc. De plus, pour des tâches nécessitant une compréhension contextuelle étendue (par exemple, dans des images très grandes ou des scènes complexes), les CNN pouvaient avoir du mal à intégrer des informations provenant de régions très éloignées de l'image de manière efficace et sans perte d'information. Ces limitations ont ouvert la voie à l'exploration de mécanismes plus généraux et plus puissants pour modéliser les dépendances, quelle que soit leur nature ou leur distance.

[[WIDGET:Quiz:cnn_rnn_limitations:Quiz sur les limitations des CNN et RNN]]
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