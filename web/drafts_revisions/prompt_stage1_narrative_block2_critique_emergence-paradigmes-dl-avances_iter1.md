You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## L'Émergence des Modèles Séquentiels Avancés et du Mécanisme d'Attention

Face aux limitations des Réseaux de Neurones Récurrents (RNN) classiques, notamment leur difficulté à capturer les [[WIDGET:ConceptLink:dependances_long_terme:dépendances à long terme]] et le problème du [[WIDGET:Glossary:vanishing_gradient:gradient évanescent]], la recherche s'est orientée vers des architectures plus sophistiquées. C'est dans ce contexte qu'ont émergé les Long Short-Term Memory (LSTM) et les Gated Recurrent Units (GRU). Ces architectures, introduites respectivement par [[WIDGET:RealPerson:sepp_hochereiter:Sepp Hochreiter]] et Jürgen Schmidhuber en 1997 pour les LSTM, et par Kyunghyun Cho et al. en 2014 pour les GRU, ont révolutionné le traitement des séquences en dotant les neurones récurrents de "mécanismes de porte" (gates). Ces portes (input, forget, output pour LSTM ; reset, update pour GRU) contrôlent le flux d'information, permettant au modèle de décider quelles informations conserver, oublier ou mettre à jour dans son état interne. Cela a considérablement amélioré leur capacité à retenir des informations pertinentes sur de longues périodes, rendant possible des avancées significatives dans des domaines comme la reconnaissance vocale et la traduction automatique.

Cependant, même les LSTM et GRU, bien que plus performants, conservaient une limitation fondamentale : leur nature intrinsèquement séquentielle. Chaque étape de calcul dépendait de la précédente, ce qui entravait la parallélisation et rendait l'entraînement très coûteux sur des séquences de grande taille. De plus, la capacité à "se souvenir" restait limitée, et la modélisation de relations complexes entre des parties très éloignées d'une séquence restait un défi.

La véritable rupture est venue avec l'introduction du [[WIDGET:ConceptLink:mecanisme_attention:mécanisme d'attention]]. Initialement proposé dans le contexte de la traduction automatique par Bahdanau et al. en 2014, puis généralisé et rendu central par [[WIDGET:RealPerson:ashish_vaswani:Ashish Vaswani]] et al. avec l'architecture Transformer en 2017 [[WIDGET:Reference:3]], l'attention a changé la donne. Son principe est simple mais puissant : au lieu de compresser toute l'information d'une séquence d'entrée dans un unique vecteur d'état fixe (comme le ferait un encodeur RNN traditionnel), le mécanisme d'attention permet au modèle de "peser" l'importance de différentes parties de la séquence d'entrée lors de la génération de chaque élément de la séquence de sortie.

Concrètement, lors de la prédiction d'un mot dans une phrase traduite, le modèle ne se contente pas du dernier état caché de l'encodeur ; il examine tous les états cachés de l'encodeur et calcule un ensemble de poids (scores d'attention) qui indiquent à quel point chaque mot d'entrée est pertinent pour le mot de sortie actuel. Ces poids sont ensuite utilisés pour créer une somme pondérée des états d'entrée, offrant un "contexte" dynamique et ciblé.

[[WIDGET:Mermaid:attention_mechanism_flow:Diagramme simplifié du mécanisme d'attention, montrant comment les poids sont calculés et appliqués pour créer un vecteur de contexte]]

Le mécanisme d'attention a eu un impact colossal :
*   **Amélioration des performances :** Il a permis aux modèles de mieux gérer les dépendances à long terme en se concentrant directement sur les informations pertinentes, quelle que soit leur position dans la séquence.
*   **Interprétabilité :** Les poids d'attention peuvent être visualisés, offrant un aperçu de ce sur quoi le modèle se concentre, ce qui est précieux pour comprendre son fonctionnement.
*   **Parallélisation :** En particulier avec l'architecture Transformer, l'attention a permis de s'affranchir de la récurrence séquentielle, ouvrant la voie à une parallélisation massive des calculs et à des entraînements beaucoup plus rapides sur des ensembles de données gigantesques.

Cette innovation a directement mené à l'architecture Transformer, qui, en s'appuyant entièrement sur des mécanismes d'auto-attention (self-attention) et des réseaux de neurones feed-forward, a établi de nouveaux standards de performance dans le traitement du langage naturel et au-delà.

## Contexte Historique et Jalons Majeurs de l'Apprentissage Profond

L'histoire de l'apprentissage profond est jalonnée d'innovations architecturales qui ont chacune répondu à des défis spécifiques et repoussé les limites de ce qui était possible. Chaque nouvelle architecture n'est pas apparue dans le vide, mais comme une réponse directe aux limitations des paradigmes précédents, ouvrant ainsi de nouvelles voies de recherche et d'application.

Au début des années 2000, les **Réseaux de Neurones Convolutifs (CNN)**, dont les fondations ont été posées par [[WIDGET:RealPerson:yann_lecun:Yann LeCun]] et son équipe avec LeNet-5 dans les années 1990, ont connu un renouveau spectaculaire. Leur capacité à extraire des caractéristiques hiérarchiques et spatiales de manière automatique les a rendus inégalés pour les tâches de vision par ordinateur, comme la classification d'images et la détection d'objets [[WIDGET:Reference:12]]. La motivation derrière les CNN était de créer des modèles robustes aux variations spatiales et capables de traiter des données structurées en grille. Cependant, leur nature localisée et leur difficulté à modéliser des dépendances temporelles ou des relations non spatiales ont limité leur applicabilité à d'autres domaines.

Parallèlement, les **Réseaux de Neurones Récurrents (RNN)** ont émergé comme la solution privilégiée pour les données séquentielles, telles que le langage naturel et les séries temporelles. L'idée était de doter les réseaux d'une "mémoire" pour traiter des entrées de longueur variable et capturer des dépendances temporelles. Malgré leur succès initial, les RNN ont rapidement rencontré des problèmes de [[WIDGET:ConceptLink:vanishing_exploding_gradients:gradients évanescents ou explosifs]], rendant difficile l'apprentissage de relations entre des éléments éloignés dans une séquence. Cette limitation a été le moteur de l'innovation des architectures comme les **LSTM** et les **GRU**, qui ont introduit des mécanismes de "portes" pour mieux contrôler le flux d'information et atténuer les problèmes de gradient, permettant ainsi des avancées significatives en traduction automatique et en reconnaissance vocale.

[[WIDGET:CustomFigure:deep_learning_timeline:Chronologie des architectures majeures de l'apprentissage profond, de CNN à Transformer]]

Le véritable tournant est survenu avec le **Mécanisme d'Attention**. La motivation était de surmonter la contrainte du "goulot d'étranglement" des RNN encodeur-décodeur, où toute l'information d'une longue séquence d'entrée devait être compressée dans un vecteur de contexte fixe. L'attention a permis au modèle de "regarder" différentes parties de l'entrée à chaque étape de la sortie, améliorant drastiquement la gestion des dépendances à long terme et la qualité des traductions [[WIDGET:Reference:3]]. C'était une innovation majeure car elle a montré qu'un modèle pouvait dynamiquement pondérer l'importance des informations d'entrée.

L'aboutissement de cette évolution est l'architecture **Transformer** [[WIDGET:Reference:3]]. Publiée en 2017, elle a radicalement changé le paysage de l'apprentissage profond en abandonnant complètement la récurrence et en s'appuyant exclusivement sur des mécanismes d'attention (notamment l'auto-attention multi-têtes). La motivation était double : améliorer encore la capacité à capturer des dépendances complexes et permettre une parallélisation massive de l'entraînement. En résolvant le problème de la dépendance séquentielle, les Transformers ont ouvert la voie à des modèles pré-entraînés gigantesques comme BERT [[WIDGET:Reference:8]] et GPT-3 [[WIDGET:Reference:9]], qui ont établi de nouveaux records de performance dans une multitude de tâches de traitement du langage naturel et ont commencé à s'étendre à d'autres modalités comme la vision. Chaque architecture, des CNN aux Transformers, a ainsi résolu des limitations des précédentes, ouvrant la voie à des applications toujours plus complexes et performantes, et définissant les paradigmes de l'apprentissage profond avancé.
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