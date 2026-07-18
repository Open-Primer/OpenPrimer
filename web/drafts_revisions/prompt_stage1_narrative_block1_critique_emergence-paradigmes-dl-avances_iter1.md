You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction à l'Apprentissage Profond Avancé

Bienvenue dans ce cours de Master 2 dédié à l'apprentissage profond avancé et aux modèles génératifs. Le domaine de l'[[WIDGET:ConceptLink:intelligence_artificielle:Intelligence Artificielle]] a connu une transformation radicale au cours de la dernière décennie, propulsée par les avancées fulgurantes de l'[[WIDGET:ConceptLink:apprentissage_profond:apprentissage profond]] [[WIDGET:Reference:12]], [[WIDGET:Reference:19]]. Ce cours vise à vous immerger dans les paradigmes les plus récents et les plus influents qui façonnent l'IA contemporaine, allant au-delà des architectures fondamentales pour explorer les modèles capables de comprendre, de générer et d'interagir avec le monde de manière toujours plus sophistiquée.

L'importance de l'apprentissage profond avancé ne peut être sous-estimée. Il est au cœur des innovations qui redéfinissent des secteurs entiers, de la vision par ordinateur à la compréhension du langage naturel, en passant par la découverte de médicaments et la création artistique. Comprendre l'évolution de ces modèles est crucial pour tout futur chercheur ou ingénieur souhaitant contribuer à ce domaine en constante mutation.

L'objectif de cette leçon est de retracer l'évolution des paradigmes des modèles d'apprentissage profond. Nous partirons des fondations qui ont jeté les bases de cette révolution, pour ensuite analyser les architectures qui ont marqué des étapes clés, jusqu'aux modèles génératifs les plus récents et leurs applications. Nous explorerons comment les limitations des architectures précédentes ont stimulé l'innovation, menant à l'émergence de concepts tels que l'attention et les transformeurs, qui sont désormais omniprésents.

[[WIDGET:Mermaid:evolution_dl_paradigms:Évolution conceptuelle des paradigmes de l'apprentissage profond]]

Cette exploration nous permettra de saisir non seulement le "comment" mais aussi le "pourquoi" de ces architectures avancées, et de comprendre les défis et opportunités qu'elles présentent. Nous verrons comment des figures comme [[WIDGET:RealPerson:yann_lecun:Yann LeCun]] ont posé les jalons de ce domaine, et comment la recherche continue de repousser les frontières de ce qui est possible. Un [[WIDGET:Glossary:paradigme:paradigme]] en science représente un ensemble de théories, de méthodes et de normes qui définissent une discipline scientifique à un moment donné.

## Les Architectures Fondatrices : CNN et RNN et leurs Limites

Avant l'avènement des architectures plus complexes, les [[WIDGET:ConceptLink:reseaux_neuronaux_convolutifs:Réseaux de Neurones Convolutifs]] (CNN) et les [[WIDGET:ConceptLink:reseaux_neuronaux_recurrents:Réseaux de Neurones Récurrents]] (RNN) ont constitué les piliers de l'apprentissage profond, démontrant des capacités sans précédent dans leurs domaines respectifs.

Les **Réseaux de Neurones Convolutifs (CNN)**, popularisés notamment par les travaux de [[WIDGET:RealPerson:yann_lecun:Yann LeCun]] sur LeNet-5, ont révolutionné le traitement d'images et la vision par ordinateur [[WIDGET:Reference:12]]. Leur principe repose sur l'utilisation de filtres convolutifs pour extraire automatiquement des caractéristiques hiérarchiques à partir de données d'entrée, telles que les bords, les textures et les formes, sans nécessiter d'ingénierie de caractéristiques manuelle. Grâce à des couches de convolution, de pooling et des couches entièrement connectées, les CNN ont atteint des performances remarquables dans des tâches comme la classification d'images, la détection d'objets et la segmentation sémantique.

Les **Réseaux de Neurones Récurrents (RNN)**, quant à eux, ont excellé dans le traitement des données séquentielles, comme le langage naturel et les séries temporelles. Leur architecture permet de maintenir un état interne (mémoire) qui capture des informations sur les éléments précédents de la séquence, rendant possible la modélisation de dépendances temporelles. Les RNN ont été les premières architectures efficaces pour des tâches telles que la traduction automatique, la reconnaissance vocale et la génération de texte.

Malgré leurs succès initiaux et leur impact profond, ces architectures présentaient des limitations intrinsèques qui ont motivé la recherche de nouvelles approches.

Pour les **RNN**, la principale difficulté résidait dans la gestion des dépendances à long terme. Lors de l'apprentissage, le [[WIDGET:Glossary:gradient:gradient]] pouvait s'atténuer (vanishing gradient) ou exploser (exploding gradient) au fur et à mesure qu'il se propageait à travers de nombreuses étapes temporelles, rendant difficile l'apprentissage de relations entre des éléments éloignés dans une séquence. Bien que des variantes comme les Long Short-Term Memory (LSTM) et les Gated Recurrent Units (GRU) aient partiellement atténué ce problème, elles ne l'ont pas complètement résolu et restaient intrinsèquement séquentielles, limitant la parallélisation du calcul et donc la vitesse d'entraînement sur de très longues séquences.

Pour les **CNN**, bien qu'exceptionnels pour les données structurées en grille comme les images, leur architecture était moins flexible pour d'autres types de données. Leur champ réceptif fixe et localisé les rendait moins aptes à capturer des dépendances globales ou des relations complexes non spatiales sans des couches très profondes ou des mécanismes ad-hoc. De plus, pour des tâches nécessitant une compréhension contextuelle étendue (par exemple, dans des images très grandes ou des scènes complexes), les CNN pouvaient avoir du mal à intégrer des informations provenant de régions très éloignées de l'image de manière efficace et sans perte d'information. Ces limitations ont ouvert la voie à l'exploration de mécanismes plus généraux et plus puissants pour modéliser les dépendances, quelle que soit leur nature ou leur distance.

[[WIDGET:Quiz:cnn_rnn_limitations:Quiz sur les limitations des CNN et RNN]]
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup> inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format. For bibliographic citations, they MUST strictly use the [[WIDGET:Reference:num]] anchor format, e.g. [[WIDGET:Reference:1]]. Reject any block containing raw HTML citation tags or raw bracketed citation anchors like [ref1], [1] in text. Reject any block containing raw Mermaid diagram code (e.g. wrapped in ```mermaid ... ```). All diagrams must be anchored as [[WIDGET:Mermaid:id:description]] anchors).
4. No figure prefixes like "Figure 1:" in visual captions.
5. NO EXTERNAL WIDGET CAPTIONS/DESCRIPTIONS IN NARRATIVE PROSE: REJECT the block if there are any external descriptions, comments, or caption text (such as "*Description: ...*", "Caption: ...", "Légende: ...") placed directly in the narrative prose outside, above, or below a widget anchor (like Image, CustomFigure, Video, Audio, Mermaid, etc.). The description must be strictly inside the anchor itself as the third parameter (e.g. [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] or [[WIDGET:Video:id:description]] or [[WIDGET:Audio:id:description]] or [[WIDGET:Mermaid:id:description]]).
6. Presence of pedagogical widgets: Check that the block contains at least 2-3 inline hover-cards (ConceptLink, Glossary, RealPerson) and at least 1-2 block widgets (Image, CustomFigure, Mermaid, ComparisonSlider, InteractiveDiagram, DataChart, Video) as anchors. If completely missing, reject the block.



Your audit must be in dual-mode:
- **"isGlobalRevision" MUST ONLY be set to true if the issues are widespread and catastrophic** (completely unparseable structure, severe length deficiency, or total failure of the block narrative requiring a complete full-text rewrite). If so, provide a comprehensive "globalCritique".
- **For standard, localized, or section-specific mistakes, you MUST set "isGlobalRevision": false**, and list ONLY the rejected sections requiring localized repair in the "sections" array.

Return ONLY a valid JSON object matching blockNarrativeAuditSchema:
```json
{
  "approved": boolean,
  "isGlobalRevision": boolean,
  "globalCritique": "detailed feedback explaining what to fix globally, or empty if approved/local repair",
  "sections": [
    // If approved is false and isGlobalRevision is false, list ONLY the specific sections that are rejected. Do NOT include approved sections.
    {
      "heading": "heading of the rejected section",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific section"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, isGlobalRevision MUST be false, globalCritique MUST be "", and sections MUST be empty.
2. If isGlobalRevision is true: approved MUST be false, isGlobalRevision MUST be true, globalCritique MUST describe the global issues, and sections MUST be empty.
3. If approved is false and isGlobalRevision is false: sections MUST ONLY contain sections that are rejected (with approved set to false). Any approved section MUST be strictly omitted from the array.