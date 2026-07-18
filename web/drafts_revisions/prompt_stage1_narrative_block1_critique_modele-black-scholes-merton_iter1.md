You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction au Modèle de Black-Scholes-Merton

Avant l'avènement du modèle de Black-Scholes-Merton (BSM), la valorisation des options était largement une affaire d'intuition et de méthodes *ad hoc*, manquant de fondements théoriques rigoureux. Le marché des produits dérivés, bien qu'existant, était fragmenté et moins sophistiqué. La publication révolutionnaire de l'article "The Pricing of Options and Corporate Liabilities" par [[WIDGET:RealPerson:fischer_black:Fischer Black]] et [[WIDGET:RealPerson:myron_scholes:Myron Scholes]] en 1973, suivie des travaux complémentaires de [[WIDGET:RealPerson:robert_merton:Robert Merton]] qui en a étendu la portée théorique, a marqué un tournant décisif dans la finance moderne [[WIDGET:Reference:3]]. Ces travaux ont été couronnés par le Prix de la Banque de Suède en sciences économiques en mémoire d'Alfred Nobel en 1997, décerné à Scholes et Merton (Black étant décédé en 1995).

Le modèle BSM a révolutionné la valorisation des options en fournissant une formule explicite et élégante pour le prix des options européennes, basée sur des principes d'absence d'[[WIDGET:ConceptLink:arbitrage:arbitrage]] et de réplication dynamique. Il a transformé la finance quantitative en une discipline scientifique, permettant aux acteurs du marché de valoriser, de gérer le risque et de négocier des [[WIDGET:Glossary:produit_derive:produits dérivés]] avec une précision sans précédent. Son impact s'est étendu bien au-delà de la simple valorisation des options, influençant la gestion des risques, la structuration des produits financiers complexes et le développement de nouveaux marchés.

[[WIDGET:Mermaid:bsm_historical_context:Contexte historique et impact du modèle de Black-Scholes-Merton]]

Dans cette leçon, nous explorerons en profondeur le modèle de Black-Scholes-Merton. Les objectifs d'apprentissage sont les suivants :
*   Comprendre le contexte historique et l'importance fondamentale du modèle BSM dans la finance quantitative.
*   Identifier et analyser les hypothèses clés sous-jacentes au modèle, ainsi que leurs implications.
*   Dériver l'équation différentielle partielle de Black-Scholes et sa solution.
*   Appréhender la formule de valorisation des options européennes et ses "Greeks" (sensibilités).
*   Discuter des limites du modèle et des extensions courantes développées pour y remédier.

## Les Hypothèses Fondamentales du Modèle

Le modèle de Black-Scholes-Merton repose sur un ensemble d'hypothèses simplificatrices qui sont cruciales pour sa tractabilité mathématique et la dérivation d'une solution en forme fermée. Bien que ces hypothèses ne soient pas toujours parfaitement vérifiées dans le monde réel, elles permettent de construire un cadre théorique robuste qui sert de point de départ à des modèles plus complexes. Comprendre ces hypothèses est essentiel pour apprécier à la fois la puissance et les limites du modèle.

Voici les hypothèses fondamentales du modèle BSM et leur impact sur la modélisation :

1.  **Absence d'opportunités d'arbitrage** : Il n'existe aucune stratégie sans risque permettant de générer un profit positif. Cette hypothèse est la pierre angulaire de la théorie de la valorisation sans arbitrage et garantit l'unicité du prix de l'option [[WIDGET:Reference:4]].
2.  **Marché parfait** :
    *   **Liquidité parfaite** : Les actifs peuvent être achetés ou vendus en toute quantité sans affecter leur prix.
    *   **Absence de coûts de transaction** : Pas de commissions, de frais ou de taxes.
    *   **Divisibilité des actifs** : Il est possible d'acheter ou de vendre des fractions d'actifs.
    *   **Pas de restrictions sur les ventes à découvert** : Les actifs peuvent être vendus à découvert sans coût ni restriction.
    *   **Possibilité d'emprunter et de prêter au taux sans risque** : Les investisseurs peuvent emprunter ou prêter des fonds à un taux d'intérêt sans risque constant.
    Ces conditions simplifient considérablement le problème en éliminant les frictions de marché.
3.  **Taux d'intérêt sans risque constant et connu** : Le taux d'intérêt sans risque ($r$) est constant et identique pour l l'emprunt et le prêt sur toute la durée de vie de l'option. Cette hypothèse simplifie le calcul de la valeur temporelle de l'argent.
4.  **Absence de dividendes sur l'actif sous-jacent** : L'actif sous-jacent (par exemple, une action) ne verse pas de dividendes pendant la durée de vie de l'option. Cette simplification est souvent assouplie dans les extensions du modèle pour inclure des dividendes connus ou continus [[WIDGET:Reference:3]].
5.  **Prix de l'actif sous-jacent suit un mouvement brownien géométrique (MBG)** : C'est l'hypothèse la plus technique et fondamentale. Elle implique que le logarithme du prix de l'actif suit un processus de Wiener (mouvement brownien), et que les rendements de l'actif sont distribués normalement.
    *   **Log-normalité des prix** : Le prix de l'actif sous-jacent à l'échéance est log-normalement distribué. Cela signifie que les prix ne peuvent pas être négatifs.
    *   **Volatilité constante** : La [[WIDGET:Glossary:volatilite:volatilité]] ($\sigma$) de l'actif sous-jacent est constante et connue sur toute la durée de vie de l'option. C'est une simplification majeure, car la volatilité est connue pour varier dans le temps sur les marchés réels.
    *   **Continuité des prix** : Les prix de l'actif sous-jacent évoluent de manière continue, sans sauts brusques. Cela exclut les événements de marché soudains ou les chocs.
    Cette hypothèse permet d'utiliser les outils du calcul stochastique pour modéliser la dynamique des prix [[WIDGET:Reference:2]], [[WIDGET:Reference:11]].

[[WIDGET:Image:log_normal_dist:Illustration de la distribution log-normale des prix de l'actif sous-jacent]]

6.  **Options de style européen** : Le modèle est spécifiquement conçu pour les options européennes, qui ne peuvent être exercées qu'à leur date d'échéance. Les options américaines, qui peuvent être exercées à tout moment avant ou à l'échéance, nécessitent des méthodes de valorisation plus complexes.
7.  **Durée de vie de l'option connue** : La date d'échéance de l'option est fixe et connue.

[[WIDGET:Mermaid:bsm_assumptions_flow:Schéma des hypothèses clés du modèle de Black-Scholes-Merton]]

L'impact combiné de ces hypothèses est de simplifier le problème de valorisation à un point où une solution analytique peut être dérivée. Elles permettent de construire un portefeuille de réplication dynamique qui élimine le risque et, par conséquent, de valoriser l'option sans référence aux préférences de risque des investisseurs. Cependant, la non-réalisation de certaines de ces hypothèses dans la pratique (par exemple, la volatilité constante ou l'absence de sauts de prix) a conduit au développement de modèles d'options plus sophistiqués, qui seront abordés dans des leçons ultérieures.
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