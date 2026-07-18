You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "cycle_economique_graph",
      "componentType": "Image",
      "sectionAnchor": "## Introduction aux Cycles Économiques",
      "props": {
        "alt": "Graphique stylisé d'un cycle économique",
        "caption": "_Ce graphique illustre les fluctuations typiques de l'activité économique, soulignant la nature cyclique de la croissance et les écarts par rapport à la tendance de long terme, un concept fondamental pour comprendre la macroéconomie dynamique._",
        "description": "Cette figure représente un cycle économique stylisé, illustrant les phases récurrentes d'expansion et de contraction de l'activité économique autour d'une tendance de croissance à long terme. Elle met en évidence les sommets (pics) et les creux (troughs) qui délimitent les périodes de prospérité et de récession, ainsi que la trajectoire ascendante générale de l'économie sur le long terme, symbolisant le progrès technologique et l'accumulation de capital.",
        "searchQuery": "cycle économique stylisé",
        "title": "Cycle Économique Stylisé"
      }
    },
    {
      "id": "rbc_overview_flowchart",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les Modèles de Cycles Économiques Réels (RBC)",
      "props": {
        "code": "graph TD; A[Choc de productivité positif] --> B{Augmentation de la productivité du travail et du capital}; B --> C[Augmentation de la production et du revenu]; C --> D{Augmentation de l'épargne et de l'investissement}; D --> E[Augmentation du stock de capital futur]; E --> F[Augmentation de l'offre de travail (effet de substitution intertemporel)]; F --> G[Augmentation de la production]; G --> H[Nouvel équilibre avec production et consommation plus élevées]; H --> I[Retour à la tendance de croissance à long terme];"
      }
    },
    {
      "id": "macro_fluctuations_intro",
      "componentType": "Video",
      "sectionAnchor": "## Introduction aux Fluctuations Macroéconomiques",
      "props": {
        "description": "Cette vidéo offre une introduction complète aux fluctuations macroéconomiques, explorant les concepts clés tels que les cycles économiques, les récessions et les expansions. Elle présente également les différentes approches théoriques utilisées pour modéliser et comprendre ces phénomènes, notamment les modèles de cycles économiques réels (RBC) et les modèles DSGE Néo-Keynésiens, en soulignant leurs prémisses et leurs objectifs distincts.",
        "duration": "8:45",
        "searchQuery": "fluctuations macroéconomiques introduction modèles RBC DSGE",
        "title": "Introduction aux Fluctuations Macroéconomiques"
      }
    },
    {
      "id": "rbc_production_function",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Les Modèles de Cycles Économiques Réels (RBC)",
      "props": {
        "alt": "Déplacement de la fonction de production agrégée",
        "caption": "_L'illustration montre comment un choc technologique positif, un élément central des modèles RBC, se traduit par une augmentation de la productivité et un déplacement de la fonction de production, augmentant ainsi le potentiel de production de l'économie._",
        "description": "Cette figure illustre un déplacement vers le haut de la fonction de production agrégée, Y = A * F(K, L), suite à un choc technologique positif (augmentation de A). Un tel choc permet à l'économie de produire plus de biens et services avec les mêmes quantités de capital (K) et de travail (L), ou d'atteindre le même niveau de production avec moins d'intrants. Ce déplacement représente une amélioration de l'efficacité productive de l'économie.",
        "searchQuery": "fonction production choc technologique RBC",
        "title": "Déplacement de la Fonction de Production suite à un Choc Technologique"
      }
    },
    {
      "id": "rbc_propagation_mechanism",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les Modèles de Cycles Économiques Réels (RBC)",
      "props": {
        "code": "graph TD; A[Choc de productivité positif] --> B[Augmentation du salaire réel anticipé]; B --> C[Augmentation de l'offre de travail (substitution intertemporelle)]; C --> D[Augmentation de l'investissement]; D --> E[Augmentation du stock de capital]; E --> F[Augmentation de la production]; F --> G[Augmentation de la consommation et de l'épargne]; G --> H[Effets multiplicateurs sur l'activité économique];"
      }
    },
    {
      "id": "dsge_microfoundations",
      "componentType": "Video",
      "sectionAnchor": "## Les Modèles DSGE Néo-Keynésiens",
      "props": {
        "description": "Cette vidéo explore en profondeur les microfondations des modèles DSGE (Dynamic Stochastic General Equilibrium), expliquant comment les décisions des agents économiques (ménages, entreprises) sont modélisées à partir de principes d'optimisation. Elle détaille le concept d'optimisation intertemporelle, où les agents prennent des décisions aujourd'hui en tenant compte de leurs conséquences futures, un pilier essentiel pour comprendre la dynamique des variables macroéconomiques dans ces modèles.",
        "duration": "12:10",
        "searchQuery": "DSGE microfondations optimisation intertemporelle",
        "title": "Microfondations et Optimisation Intertemporelle dans les Modèles DSGE"
      }
    },
    {
      "id": "hodrick_prescott_filter_example",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Méthodes Empiriques d'Analyse des Cycles",
      "props": {
        "alt": "Décomposition du PIB par le filtre de Hodrick-Prescott",
        "caption": "_L'application du filtre de Hodrick-Prescott est une méthode courante en macroéconomie pour isoler la composante cyclique des séries temporelles, permettant d'analyser les fluctuations économiques indépendamment de la tendance de croissance à long terme._",
        "description": "Cette figure présente un exemple de décomposition d'une série temporelle du Produit Intérieur Brut (PIB) en ses composantes de tendance et cyclique, en utilisant le filtre de Hodrick-Prescott. La ligne de tendance lisse représente la croissance potentielle à long terme de l'économie, tandis que la composante cyclique capture les déviations à court terme du PIB par rapport à cette tendance, révélant les phases d'expansion et de contraction.",
        "searchQuery": "filtre Hodrick-Prescott PIB décomposition",
        "title": "Décomposition du PIB avec le Filtre de Hodrick-Prescott"
      }
    },
    {
      "id": "time_series_decomposition_process",
      "componentType": "Mermaid",
      "sectionAnchor": "## Méthodes Empiriques d'Analyse des Cycles",
      "props": {
        "code": "graph TD; A[Série temporelle macroéconomique brute] --> B{Filtrage (ex: Hodrick-Prescott, Baxter-King)}; B --> C[Composante de tendance (croissance à long terme)]; B --> D[Composante cyclique (fluctuations à court terme)]; C --> E[Analyse de la croissance potentielle]; D --> F[Analyse des cycles économiques];"
      }
    },
    {
      "id": "impulse_response_function_example",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Évaluation et Applications des Modèles",
      "props": {
        "alt": "Fonctions de réponse impulsionnelle d'un choc technologique",
        "caption": "_Les fonctions de réponse impulsionnelle sont cruciales pour visualiser la réaction des variables macroéconomiques à des chocs exogènes, offrant un aperçu de la dynamique interne des modèles et de leur pertinence empirique._",
        "description": "Cette figure illustre des fonctions de réponse impulsionnelle (FRI) montrant l'impact dynamique d'un choc technologique positif sur le PIB et l'emploi au fil du temps. Après le choc, le PIB et l'emploi augmentent initialement, puis convergent progressivement vers un nouveau niveau d'équilibre supérieur ou vers leur tendance de croissance. Les FRI sont des outils essentiels pour évaluer la dynamique des modèles macroéconomiques et leur capacité à reproduire les faits stylisés des cycles économiques.",
        "searchQuery": "fonctions réponse impulsionnelle choc technologique",
        "title": "Fonctions de Réponse Impulsionnelle: Choc Technologique"
      }
    },
    {
      "id": "rbc_vs_nk_dsge",
      "componentType": "Mermaid",
      "sectionAnchor": "## Comparaison des Modèles RBC et DSGE Néo-Keynésiens",
      "props": {
        "code": "graph TD; subgraph Modèles RBC; A[Chocs réels (technologie, préférences)]; B[Marchés parfaitement concurrentiels]; C[Agents rationnels, optimisation intertemporelle]; D[Flexibilité des prix et salaires]; end; subgraph Modèles Néo-Keynésiens DSGE; E[Chocs nominaux (politique monétaire)]; F[Concurrence imparfaite, rigidités nominales]; G[Agents rationnels, optimisation intertemporelle]; H[Politique monétaire active]; end; A --> I[Fluctuations endogènes]; E --> I; I[Cycles Économiques];"
      }
    },
    {
      "id": "dsge_model_structure",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Les Modèles DSGE Néo-Keynésiens",
      "props": {
        "alt": "Structure simplifiée d'un modèle DSGE Néo-Keynésien",
        "caption": "_La structure d'un modèle DSGE Néo-Keynésien intègre les comportements optimisateurs des agents et les rigidités nominales pour analyser l'impact des politiques monétaires et budgétaires sur les fluctuations macroéconomiques._",
        "description": "Cette figure présente une structure générale simplifiée d'un modèle DSGE Néo-Keynésien, mettant en évidence ses principaux blocs constitutifs. Elle inclut généralement les ménages (optimisation de la consommation et du travail), les entreprises (optimisation de la production et de l'investissement, avec rigidités nominales), la banque centrale (règle de politique monétaire) et le gouvernement (politique budgétaire). Ces blocs interagissent dans un cadre d'équilibre général dynamique et stochastique.",
        "searchQuery": "structure modèle DSGE Néo-Keynésien",
        "title": "Structure d'un Modèle DSGE Néo-Keynésien"
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. CRITICAL MEDIA RULES:
   - Image components MUST NOT contain "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "year" properties.
   - Video components MUST NOT contain "url", "id", "provider", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   - Audio components MUST NOT contain "url", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   These fields are FORBIDDEN in the raw widgets JSON for Image, Video, and Audio. They are resolved automatically downstream by the external-resource-resolver pipeline using the component's title/searchQuery/description. Any media component missing these fields is CORRECT and must NOT be rejected. If a media component DOES contain any of these forbidden fields (even with a seemingly valid URL), that IS an error and should be flagged.
6. For other components (Quiz, SolvedExercise, UnsolvedExercise, FillInBlanks, Mermaid): "url", "wikipediaLink", "wikipediaUrl" can be null or omitted — this is acceptable. Do NOT reject those component types for missing URL fields.
7. For UnsolvedExercise components, the props must contain "title", "problem", and "correctAnswer". Do NOT reject them for missing "questions" or "tasks" as those are not part of the UnsolvedExercise props structure.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'interactiveComponents')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.