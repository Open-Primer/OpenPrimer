You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "acropole_athenes",
      "componentType": "Image",
      "sectionAnchor": "La Polis Grecque: Fondements et Organisation",
      "props": {
        "alt": "Vue panoramique de l'Acropole d'Athènes avec ses temples majestueux.",
        "caption": "Comment l'Acropole d'Athènes, avec ses temples majestueux, incarne-t-elle à la fois la puissance religieuse et la défense stratégique de la Polis ?",
        "description": "L'Acropole d'Athènes est une ancienne citadelle située sur un rocher au-dessus de la ville d'Athènes et contient les vestiges de plusieurs bâtiments antiques d'une grande importance architecturale et historique, dont le Parthénon. Elle servait à la fois de centre religieux, abritant des temples dédiés aux divinités protectrices de la cité, et de forteresse défensive, offrant une position stratégique dominante.",
        "searchQuery": "Acropole Athènes",
        "title": "L'Acropole d'Athènes"
      }
    },
    {
      "id": "structure_sociale_polis",
      "componentType": "Mermaid",
      "sectionAnchor": "La Polis Grecque: Fondements et Organisation",
      "props": {
        "code": "graph TD\n    subgraph Polis Grecque\n        C[Citoyens]\n        F[Femmes]\n        M[Mètèques]\n        E[Esclaves]\n    end\n\n    C -- Droits Politiques & Civiques --> Assemblée[Assemblée/Ecclésia];\n    C -- Service Militaire --> Armée[Armée];\n    C -- Propriété Foncière --> Terre[Terre];\n\n    F -- Rôle Domestique & Religieux --> Foyer[Foyer];\n    F -- Pas de Droits Politiques --> C;\n\n    M -- Liberté Personnelle --> M;\n    M -- Activités Commerciales/Artisanales --> Commerce[Commerce];\n    M -- Pas de Droits Politiques --> C;\n    M -- Paiement de Taxes --> Taxes[Taxes];\n    M -- Service Militaire (parfois) --> Armée;\n\n    E -- Propriété d'autrui --> Maître[Maître];\n    E -- Travail Forcé --> Travail[Travail];\n    E -- Aucun Droit --> C;\n\n    Assemblée -- Décisions --> C;\n    Armée -- Défense --> C;\n    Terre -- Richesse --> C;"
      }
    },
    {
      "id": "parthenon_athenes",
      "componentType": "Image",
      "sectionAnchor": "Athènes: Le Berceau de la Démocratie",
      "props": {
        "alt": "Le Parthénon, temple grec antique, avec ses colonnes doriques et ses frises sculptées.",
        "caption": "Comment l'architecture du Parthénon, avec ses proportions harmonieuses et ses frises narratives, reflète-t-elle les idéaux de beauté, de raison et de puissance civique de la démocratie athénienne ?",
        "description": "Le Parthénon est un temple dorique périptère situé sur l'Acropole d'Athènes, dédié à la déesse Athéna, protectrice de la cité. Construit au Ve siècle av. J.-C., il est considéré comme le summum de l'architecture grecque classique, caractérisé par ses proportions harmonieuses, ses colonnes élégantes et ses frises sculptées qui dépeignent des scènes mythologiques et des processions civiques, reflétant les idéaux esthétiques et civiques de l'Athènes démocratique.",
        "searchQuery": "Parthénon Athènes",
        "title": "Le Parthénon d'Athènes"
      }
    },
    {
      "id": "athenian_democracy_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Athènes: Le Berceau de la Démocratie",
      "props": {
        "code": "graph TD\n    C[Citoyens Athéniens] --> E[Ecclésia (Assemblée du Peuple)];\n    E -- Élit --> B[Boulè (Conseil des 500)];\n    E -- Élit par tirage au sort --> H[Héliée (Tribunaux Populaires)];\n    E -- Élit par vote --> M[Magistrats (Stratèges, Archontes)];\n\n    B -- Prépare les lois --> E;\n    B -- Gère les affaires courantes --> M;\n\n    H -- Juge les affaires --> C;\n\n    M -- Exécute les lois --> E;\n    M -- Dirige l'armée --> C;\n\n    style C fill:#f9f,stroke:#333,stroke-width:2px\n    style E fill:#ccf,stroke:#333,stroke-width:2px\n    style B fill:#cfc,stroke:#333,stroke-width:2px\n    style H fill:#ffc,stroke:#333,stroke-width:2px\n    style M fill:#fcc,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "spartan_warriors",
      "componentType": "Image",
      "sectionAnchor": "Sparte: La Cité Guerrière",
      "props": {
        "alt": "Représentation de guerriers spartiates en formation de combat, équipés de boucliers et de lances.",
        "caption": "Comment la représentation de guerriers spartiates, avec leur équipement uniforme et leur formation serrée, illustre-t-elle les valeurs de discipline, d'unité et de force militaire collective qui définissaient la société spartiate ?",
        "description": "Une représentation de guerriers spartiates, les Homoioi, en formation de phalange, vêtus de leur armure distinctive, incluant le casque corinthien, le bouclier rond (hoplon) et la lance (dory). Leur posture rigide et leur équipement uniforme soulignent la discipline militaire stricte et l'unité collective qui étaient au cœur de la société spartiate, où l'entraînement militaire commençait dès l'enfance et la vie était entièrement dédiée au service de l'État.",
        "searchQuery": "Guerriers Spartiates",
        "title": "Guerriers Spartiates en Phalange"
      }
    },
    {
      "id": "spartan_social_hierarchy",
      "componentType": "Mermaid",
      "sectionAnchor": "Sparte: La Cité Guerrière",
      "props": {
        "code": "graph TD\n    subgraph Société Spartiate\n        H[Homoioi (Égaux)]\n        P[Périèques]\n        I[Hilotes]\n    end\n\n    H -- Dirigent l'État --> Gouvernement[Gouvernement Spartiate];\n    H -- Propriétaires de terres --> Terres[Terres];\n    H -- Service Militaire à plein temps --> Armée[Armée Spartiate];\n\n    P -- Hommes libres, mais sans droits politiques --> P;\n    P -- Commerce & Artisanat --> Commerce[Commerce];\n    P -- Service Militaire (auxiliaire) --> Armée;\n    P -- Autonomie locale --> Villes[Villes Périèques];\n\n    I -- Serfs d'État --> État[État Spartiate];\n    I -- Cultivent les terres des Homoioi --> Terres;\n    I -- Fournissent la nourriture --> Homoioi;\n    I -- Sans droits, soumis --> Homoioi;\n    I -- Révoltes fréquentes --> Homoioi;"
      }
    },
    {
      "id": "map_greek_city_states",
      "componentType": "Image",
      "sectionAnchor": "La Guerre du Péloponnèse: Le Conflit des Modèles",
      "props": {
        "alt": "Carte des cités-États grecques et de leurs alliances avant la Guerre du Péloponnèse.",
        "caption": "Comment cette carte des cités-États grecques et de leurs alliances potentielles avant la Guerre du Péloponnèse permet-elle de comprendre les dynamiques de pouvoir et les tensions géopolitiques qui ont mené au conflit entre Athènes et Sparte ?",
        "description": "Une carte de la Grèce antique montrant la répartition géographique des principales cités-États grecques et de leurs sphères d'influence avant le déclenchement de la Guerre du Péloponnèse. La carte met en évidence les alliances potentielles, notamment la Ligue de Délos dominée par Athènes et la Ligue du Péloponnèse dirigée par Sparte, illustrant les tensions géopolitiques et les rivalités pour l'hégémonie qui ont conduit au conflit dévastateur entre ces deux puissances.",
        "searchQuery": "Carte Cités-États Grecques Guerre Péloponnèse",
        "title": "Carte des Cités-États Grecques et Alliances"
      }
    },
    {
      "id": "athens_sparta_comparison",
      "componentType": "Mermaid",
      "sectionAnchor": "La Guerre du Péloponnèse: Le Conflit des Modèles",
      "props": {
        "code": "graph LR\n    subgraph Athènes\n        A_Pol[Système Politique: Démocratie]\n        A_Soc[Structure Sociale: Citoyens, Femmes, Mètèques, Esclaves]\n        A_Eco[Économie: Commerce Maritime, Artisanat]\n        A_Val[Valeurs: Philosophie, Art, Rhétorique, Liberté]\n    end\n\n    subgraph Sparte\n        S_Pol[Système Politique: Oligarchie Militaire]\n        S_Soc[Structure Sociale: Homoioi, Périèques, Hilotes]\n        S_Eco[Économie: Agriculture, Autarcie]\n        S_Val[Valeurs: Discipline, Obéissance, Force Militaire]\n    end\n\n    A_Pol -- Contraste --> S_Pol;\n    A_Soc -- Contraste --> S_Soc;\n    A_Eco -- Contraste --> S_Eco;\n    A_Val -- Contraste --> S_Val;"
      }
    },
    {
      "id": "athens_sparta_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "Conclusion: L'Héritage des Cités-États",
      "props": {
        "limit": 4,
        "questions": [
          {
            "q": "Quelle institution était le cœur de la démocratie athénienne, où tous les citoyens masculins pouvaient voter directement sur les lois ?",
            "options": [
              {
                "text": "La Boulè",
                "correct": false
              },
              {
                "text": "L'Héliée",
                "correct": false
              },
              {
                "text": "L'Ecclésia",
                "correct": true
              },
              {
                "text": "Les Archontes",
                "correct": false
              }
            ],
            "explanation": "L'Ecclésia était l'assemblée du peuple où les citoyens athéniens exerçaient leur droit de vote direct."
          },
          {
            "q": "Quelle était la principale caractéristique de la société spartiate ?",
            "options": [
              {
                "text": "Son développement commercial et maritime.",
                "correct": false
              },
              {
                "text": "Son système démocratique avancé.",
                "correct": false
              },
              {
                "text": "Son organisation militaire et sa discipline stricte.",
                "correct": true
              },
              {
                "text": "Sa tolérance religieuse et culturelle.",
                "correct": false
              }
            ],
            "explanation": "Sparte était une société fortement militarisée, axée sur la discipline et la formation guerrière dès le plus jeune âge."
          },
          {
            "q": "Qui étaient les \"Hilotes\" dans la société spartiate ?",
            "options": [
              {
                "text": "Les citoyens à part entière.",
                "correct": false
              },
              {
                "text": "Les étrangers résidant à Sparte.",
                "correct": false
              },
              {
                "text": "Les serfs d'État, attachés à la terre.",
                "correct": true
              },
              {
                "text": "Les membres de l'assemblée spartiate.",
                "correct": false
              }
            ],
            "explanation": "Les Hilotes étaient une population asservie, propriété de l'État spartiate, qui cultivait les terres pour les Homoioi."
          },
          {
            "q": "Le Parthénon est un symbole architectural de quelle cité-État grecque ?",
            "options": [
              {
                "text": "Sparte",
                "correct": false
              },
              {
                "text": "Corinthe",
                "correct": false
              },
              {
                "text": "Thèbes",
                "correct": false
              },
              {
                "text": "Athènes",
                "correct": true
              }
            ],
            "explanation": "Le Parthénon est le temple emblématique de l'Acropole d'Athènes, dédié à la déesse Athéna."
          }
        ]
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, "N/A", "## Section Name", or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. CRITICAL MEDIA RULES:
   - Image components MUST NOT contain "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "year" properties.
   - Video components MUST NOT contain "url", "id", "provider", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   - Audio components MUST NOT contain "url", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   These fields are FORBIDDEN in the raw widgets JSON for Image, Video, and Audio. They are resolved automatically downstream by the external-resource-resolver pipeline using the component's title/searchQuery/description. Any media component missing these fields is CORRECT and must NOT be rejected. If a media component DOES contain any of these forbidden fields (even with a seemingly valid URL), that IS an error and should be flagged.
6. For other components (Quiz, SolvedExercise, UnsolvedExercise, FillInBlanks, Mermaid): "url", "wikipediaLink", "wikipediaUrl" can be null or omitted — this is acceptable. Do NOT reject those component types for missing URL fields.
7. For UnsolvedExercise components, the props must contain "title", "problem", and "correctAnswer". Do NOT reject them for missing "questions" or "tasks" as those are not part of the UnsolvedExercise props structure.
8. CRITICAL IMAGE RELEVANCE: Every Image or media component must have a strong, direct connection with the current lesson/concept, and must be highly informative (not merely decorative or filler). The caption/description must clearly explain its relevance. Reject if decorative/generic or lacking clear informative value.
9. CRITICAL INTERACTIVE WIDGETS CONNECTION: Every interactive widget (Quiz, SolvedExercise, UnsolvedExercise, Mermaid chart, DataChart, and simulations) must be strongly connected to the lesson. You must verify that the choice of parameters, equations, inputs, or datasets is highly specific to the lesson's topic (not generic defaults). Verify that every interactive widget has a clear, detailed explanation or solution section explaining the logic and how the parameters relate to the lesson's concepts. Reject the block if any interactive widget has generic parameters or lacks a proper explanation section.

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