You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction aux Équations Différentielles Stochastiques

Dans le domaine de la finance quantitative, la modélisation des prix d'actifs et des taux d'intérêt est une tâche complexe, intrinsèquement liée à l'incertitude et à la volatilité des marchés. Historiquement, les premières tentatives de modélisation s'appuyaient sur des équations différentielles ordinaires (EDO), des outils déterministes qui décrivent l'évolution d'un système sans composante aléatoire explicite. Cependant, l'expérience a rapidement montré que ces modèles étaient insuffisants pour capturer la nature imprévisible et les fluctuations erratiques des marchés financiers. Un modèle déterministe, par définition, produirait toujours la même trajectoire future à partir des mêmes conditions initiales, ce qui est en contradiction flagrante avec la réalité observée des prix d'actifs, où les chocs imprévus et les informations nouvelles influencent constamment les trajectoires [[WIDGET:Reference:3]].

La nécessité d'intégrer cette incertitude a conduit au développement des Équations Différentielles Stochastiques (EDS). Les EDS sont des outils mathématiques fondamentaux qui permettent de modéliser des systèmes dynamiques dont l'évolution est influencée par des forces aléatoires. Elles sont devenues la pierre angulaire de la finance quantitative moderne, offrant un cadre rigoureux pour la valorisation des produits dérivés, la gestion des risques et l'optimisation de portefeuille [[WIDGET:Reference:2]], [[WIDGET:Reference:4]].

La source principale de stochasticité dans la plupart des modèles d'EDS en finance est le [[WIDGET:ConceptLink:mouvement_brownien:Mouvement Brownien]], également connu sous le nom de processus de Wiener. Ce processus, nommé d'après le botaniste Robert Brown qui observa le mouvement aléatoire de particules de pollen dans l'eau, a été formalisé mathématiquement par [[WIDGET:RealPerson:wiener_norbert:Norbert Wiener]] et est devenu un pilier de la théorie des processus stochastiques [[WIDGET:Reference:6]]. Le mouvement brownien est caractérisé par des accroissements indépendants et stationnaires, distribués selon une loi normale, et une trajectoire continue mais nulle part différentiable. C'est cette non-différentiabilité qui rend les méthodes de calcul classiques inapplicables et nécessite le développement d'un nouveau calcul, le calcul stochastique, dont l'intégrale d'Itô est une composante essentielle.

[[WIDGET:Image:brownian_motion_path:Exemple de trajectoire simulée d'un mouvement brownien standard, illustrant son caractère aléatoire et continu]]

L'intégration du mouvement brownien dans les modèles financiers permet de représenter la nature imprévisible des chocs de marché et la [[WIDGET:Glossary:volatilite:volatilité]] des prix d'actifs, qui est une mesure de l'amplitude de ces fluctuations. Sans cette composante stochastique, les modèles financiers resteraient des abstractions éloignées de la complexité des marchés réels.

## Fondements Mathématiques et Définitions Clés des EDS

Pour appréhender les Équations Différentielles Stochastiques, il est impératif de maîtriser certains concepts fondamentaux du calcul stochastique. Contrairement au calcul différentiel classique, où les fonctions sont suffisamment lisses pour être dérivées, les trajectoires des processus stochastiques comme le mouvement brownien sont trop irrégulières. Cela a conduit à l'élaboration de l'intégrale d'Itô.

### L'Intégrale d'Itô

L'intégrale d'Itô, développée par le mathématicien japonais [[WIDGET:RealPerson:ito_kiyosi:Kiyosi Itô]], est une généralisation de l'intégrale de Riemann-Stieltjes pour les processus stochastiques. Elle permet d'intégrer des fonctions par rapport à un mouvement brownien. Formellement, pour un processus stochastique $X_t$ et un mouvement brownien $W_t$, l'intégrale d'Itô est définie comme:

$$ \int_0^T X_s \, dW_s $$

Cette intégrale possède des propriétés distinctes de l'intégrale classique, notamment le fait que son espérance est nulle sous certaines conditions, et que son carré est un processus de martingale. C'est un outil crucial pour la construction et la résolution des EDS [[WIDGET:Reference:13]], [[WIDGET:Reference:18]].

### Le Lemme d'Itô

Le lemme d'Itô est l'équivalent stochastique de la règle de la chaîne du calcul différentiel classique. Il est absolument fondamental pour la manipulation des fonctions de processus d'Itô (qui sont les solutions des EDS). Si $X_t$ est un processus d'Itô défini par $dX_t = a(t, X_t) \, dt + b(t, X_t) \, dW_t$, et si $f(t, x)$ est une fonction de classe $C^{1,2}$ (c'est-à-dire une fois continûment différentiable par rapport à $t$ et deux fois par rapport à $x$), alors le processus $Y_t = f(t, X_t)$ est aussi un processus d'Itô et son différentiel stochastique est donné par le lemme d'Itô:

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
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup> inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format. For bibliographic citations, they MUST strictly use the [[WIDGET:Reference:num]] anchor format, e.g. [[WIDGET:Reference:1]]. Reject any block containing raw HTML citation tags or raw bracketed citation anchors like [ref1], [1] in text. Reject any block containing raw Mermaid diagram code (e.g. wrapped in ```mermaid ... ```). All diagrams must be anchored as [[WIDGET:Mermaid:id:description]] anchors).
4. No figure prefixes like "Figure 1:" in visual captions.
5. NO EXTERNAL WIDGET CAPTIONS/DESCRIPTIONS IN NARRATIVE PROSE: REJECT the block if there are any external descriptions, comments, or caption text (such as "*Description: ...*", "Caption: ...", "Légende: ...") placed directly in the narrative prose outside, above, or below a widget anchor (like Image, CustomFigure, Video, Audio, Mermaid, etc.). The description must be strictly inside the anchor itself as the third parameter (e.g. [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] or [[WIDGET:Video:id:description]] or [[WIDGET:Audio:id:description]] or [[WIDGET:Mermaid:id:description]]).
6. Presence of pedagogical widgets: Check that the block contains at least 2-3 inline hover-cards (ConceptLink, Glossary, RealPerson) and at least 2-3 block widgets (Image, CustomFigure, Mermaid, ComparisonSlider, InteractiveDiagram, DataChart, Video) as anchors. If completely missing, reject the block.



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