You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Concepts Fondamentaux: Problème, Algorithme et Programme

Pour naviguer efficacement dans le monde de l'informatique et de la résolution de problèmes, il est impératif de bien distinguer et de comprendre les liens entre trois concepts fondamentaux : le problème, l'algorithme et le programme. Bien qu'interdépendants, chacun représente une étape distincte dans le processus de transformation d'une question abstraite en une solution concrète et exécutable.

Un **problème** peut être défini comme une tâche ou une question bien spécifiée qui nécessite une solution. Il se caractérise par un ensemble d'entrées (données initiales) et un ensemble de sorties désirées (résultats attendus). Par exemple, "trier une liste de nombres" est un problème : l'entrée est une liste non ordonnée, la sortie est la même liste, mais ordonnée. La définition claire du problème est la première étape cruciale, car elle délimite précisément ce que l'on cherche à accomplir.

Un **algorithme** est une séquence finie et non ambiguë d'instructions précises, conçue pour résoudre un problème donné ou pour accomplir une tâche spécifique. C'est une méthode ou une procédure pas-à-pas qui, appliquée aux entrées du problème, garantit d'atteindre les sorties désirées en un nombre fini d'étapes. L'algorithme est une solution conceptuelle, indépendante de tout langage de programmation ou machine particulière. Il décrit le "comment faire" de manière abstraite. Par exemple, l'algorithme de tri par insertion est une méthode pour trier une liste, distincte de son implémentation. Des ouvrages comme ceux de Cormen et al. [[WIDGET:ref1]] ou Wirth [[WIDGET:ref2]] détaillent la conception et l'analyse de ces méthodes.

Enfin, un **programme** est l'implémentation concrète d'un algorithme dans un langage de programmation spécifique, rendu exécutable par une machine. C'est la traduction des instructions abstraites de l'algorithme en code compréhensible par un ordinateur. Si l'algorithme est la "recette" pour résoudre un problème, le programme est le "plat cuisiné" qui peut être consommé. Un même algorithme peut donner lieu à de multiples programmes, écrits dans différents langages (C++, Python, Java, etc.), comme le montre Sedgewick [[WIDGET:ref3]].

En résumé, le **problème** est le *quoi* (l'objectif), l'**algorithme** est le *comment* (la méthode), et le **programme** est le *avec quoi* (l'implémentation concrète). La distinction est fondamentale : un algorithme peut exister sans être programmé, et un programme sans algorithme clair sous-jacent risque d'être inefficace ou incorrect. L'étude de l'algorithmique se concentre sur la conception et l'analyse des algorithmes, avant même leur traduction en code.

## L'Algorithmique au Cœur de l'Informatique et de la Pensée Structurée

L'algorithmique n'est pas seulement une branche de l'informatique ; elle en est le cœur battant et le moteur intellectuel. Son rôle central se manifeste à plusieurs niveaux, tant dans la discipline elle-même que comme méthode de pensée applicable à de nombreux domaines.

En informatique, l'algorithmique est la clé de l'**efficacité** et de l'**optimisation**. La performance d'un logiciel ou d'un système dépend directement de la qualité des algorithmes qu'il utilise. Un algorithme bien conçu peut réduire considérablement le temps de calcul et les ressources nécessaires pour résoudre un problème, transformant une tâche irréalisable en une opération rapide et économique. L'étude de la **complexité algorithmique**, qui analyse la quantité de ressources (temps et mémoire) requises par un algorithme en fonction de la taille de ses entrées, est un pilier de l'informatique théorique et pratique. Choisir l'algorithme le plus adapté à un problème donné est une décision cruciale pour les ingénieurs et les chercheurs, comme le soulignent les travaux de Aho, Hopcroft et Ullman [[WIDGET:ref4]] ou Brassard et Bratley [[WIDGET:ref5]]. Que ce soit pour la recherche d'informations sur internet, le traitement d'images, la cryptographie ou l'intelligence artificielle, des algorithmes performants sont indispensables.

Au-delà de son application directe dans la conception de logiciels, l'algorithmique est une méthode de **pensée structurée et logique** universelle. Elle enseigne à décomposer un problème complexe en sous-problèmes plus petits et gérables, à identifier les étapes nécessaires à leur résolution, à définir des règles claires et non ambiguës, et à anticiper les différents scénarios possibles. Cette approche systématique, qui consiste à formaliser le raisonnement, est précieuse dans une multitude de domaines.

Par exemple, en ingénierie, la conception d'un processus de fabrication suit une logique algorithmique. En logistique, l'optimisation des tournées de livraison repose sur des algorithmes complexes. En finance, la modélisation des marchés et la prise de décision automatisée sont intrinsèquement algorithmiques. Même dans la vie quotidienne, organiser une tâche ménagère, suivre une recette de cuisine ou assembler un meuble sont des activités qui, sans être formalisées, relèvent d'une pensée séquentielle et logique inspirée par l'algorithmique.

Ainsi, l'algorithmique n'est pas seulement l'art de concevoir des instructions pour les machines ; c'est aussi l'art de structurer la pensée humaine pour résoudre des problèmes de manière efficace et rigoureuse, quel que soit le contexte. Elle développe des compétences essentielles en analyse, en synthèse et en abstraction, qui sont transférables et fondamentales dans le monde moderne.
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, etc. inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format).
4. No figure prefixes like "Figure 1:" in visual captions.


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