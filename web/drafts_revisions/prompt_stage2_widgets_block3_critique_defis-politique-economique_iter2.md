You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "lesson_axes",
      "componentType": "Mermaid",
      "sectionAnchor": "Les trois axes majeurs de la politique économique moderne",
      "props": {
        "code": "graph TD\n    A[Politique Économique Moderne] --> B(Stabilité Macroéconomique)\n    B --> B1(Maîtrise de l'inflation)\n    B --> B2(Plein emploi)\n    B --> B3(Équilibre budgétaire)\n\n    A --> C(Croissance Durable et Inclusive)\n    C --> C1(Innovation et Productivité)\n    C --> C2(Investissement)\n    C --> C3(Réduction des inégalités)\n\n    A --> D(Transition Écologique et Sociale)\n    D --> D1(Décarbonation de l'économie)\n    D --> D2(Préservation des ressources)\n    D --> D3(Justice sociale environnementale)"
      }
    },
    {
      "id": "phillips_curve_evolution",
      "componentType": "Image",
      "sectionAnchor": "Évolution de la courbe de Phillips (courte et longue période)",
      "props": {
        "description": "Ce diagramme illustre l'évolution de la courbe de Phillips, un concept économique fondamental reliant l'inflation et le chômage. Il présente la courbe de Phillips de court terme, qui montre une relation inverse entre ces deux variables, et la courbe de Phillips de long terme, qui est verticale au taux de chômage naturel, suggérant l'absence de compromis à long terme entre inflation et chômage. Les déplacements des courbes dus aux anticipations d'inflation et aux chocs d'offre sont également représentés, soulignant la complexité de la gestion macroéconomique.",
        "title": "Évolution de la courbe de Phillips",
        "year": "2023"
      }
    },
    {
      "id": "environmental_policy_impacts",
      "componentType": "Image",
      "sectionAnchor": "Impacts macroéconomiques des politiques environnementales sur l'inflation, la croissance et la compétitivité",
      "props": {
        "description": "Cette figure schématise les impacts macroéconomiques complexes des politiques environnementales. Elle détaille comment des mesures telles que la taxation carbone, les subventions aux énergies renouvelables ou les réglementations strictes peuvent influencer l'inflation (par des coûts de production accrus ou des gains d'efficacité), la croissance économique (par l'investissement vert ou la réallocation des ressources) et la compétitivité des entreprises (par des avantages comparatifs ou des contraintes réglementaires). Le diagramme met en évidence les boucles de rétroaction et les arbitrages potentiels entre ces objectifs.",
        "title": "Impacts macroéconomiques des politiques environnementales",
        "year": "2023"
      }
    },
    {
      "id": "transition_energetique_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Schéma de la transition énergétique et ses leviers politiques",
      "props": {
        "code": "graph TD\n    A[Objectif: Transition Énergétique] --> B(Leviers Politiques)\n    B --> B1(Réglementation et Normes)\n    B1 --> B1a(Normes d'émissions)\n    B1 --> B1b(Efficacité énergétique)\n    B --> B2(Incitations Fiscales et Subventions)\n    B2 --> B2a(Crédits d'impôt pour énergies renouvelables)\n    B2 --> B2b(Subventions à l'innovation verte)\n    B --> B3(Investissements Publics)\n    B3 --> B3a(Infrastructures renouvelables)\n    B3 --> B3b(Recherche et Développement)\n    B --> B4(Marchés Carbone et Tarification)\n    B4 --> B4a(Systèmes d'échange de quotas)\n    B4 --> B4b(Taxe carbone)\n    B --> B5(Coopération Internationale)\n    B5 --> B5a(Accords climatiques)\n    B5 --> B5b(Transfert de technologies)"
      }
    },
    {
      "id": "policy_coordination_matrix",
      "componentType": "Image",
      "sectionAnchor": "Interdépendance des politiques macroéconomiques",
      "props": {
        "description": "Cette matrice illustre l'interdépendance complexe entre les différentes politiques macroéconomiques, telles que la politique monétaire, budgétaire, structurelle et environnementale. Chaque cellule de la matrice représente l'impact potentiel d'une politique sur les objectifs ou les instruments d'une autre, mettant en évidence les synergies et les conflits. Elle souligne la nécessité d'une coordination étroite entre les autorités pour atteindre des objectifs macroéconomiques cohérents et éviter les effets indésirables.",
        "title": "Matrice de coordination des politiques macroéconomiques",
        "year": "2023"
      }
    },
    {
      "id": "global_cooperation_challenges",
      "componentType": "Video",
      "sectionAnchor": "Les enjeux de la coopération internationale face aux biens publics mondiaux",
      "props": {
        "title": "Coopération internationale et biens publics mondiaux",
        "year": "2023"
      }
    },
    {
      "id": "integrated_policy_framework",
      "componentType": "Image",
      "sectionAnchor": "Cadre d'une politique économique intégrée et résiliente",
      "props": {
        "description": "Ce cadre conceptuel présente les éléments clés d'une politique économique intégrée et résiliente. Il met en lumière l'articulation entre les objectifs de stabilité macroéconomique, de croissance durable, d'inclusion sociale et de transition écologique. Le diagramme illustre comment les instruments de politique (monétaire, budgétaire, structurelle, environnementale) doivent être alignés et coordonnés pour faire face aux chocs économiques et environnementaux, tout en favorisant une prospérité à long terme.",
        "title": "Cadre de politique économique intégrée",
        "year": "2023"
      }
    },
    {
      "id": "policy_integration_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Flux d'intégration des objectifs de politique économique",
      "props": {
        "code": "graph TD\n    A[Objectifs Économiques] --> B(Objectifs Sociaux)\n    B --> C(Objectifs Environnementaux)\n    C --> D(Intégration des Politiques)\n    D --> D1(Coordination Budgétaire)\n    D --> D2(Politique Monétaire)\n    D --> D3(Politique Structurelle)\n    D --> D4(Politique Environnementale)\n    D --> D5(Politique Sociale)\n    D --> E(Résultats Optimaux)\n    E --> E1(Croissance Durable)\n    E --> E2(Stabilité)\n    E3(Inclusion)\n    E4(Résilience)"
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