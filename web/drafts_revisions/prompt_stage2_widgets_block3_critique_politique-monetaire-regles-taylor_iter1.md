You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "objectifs_politique_monetaire",
      "componentType": "Image",
      "sectionAnchor": "Les objectifs fondamentaux de la politique monétaire",
      "props": {
        "description": "Une illustration conceptuelle des objectifs fondamentaux que toute politique monétaire moderne cherche à atteindre. Elle met en évidence la stabilité des prix comme objectif principal, souvent complétée par le plein emploi, la croissance économique durable et la stabilité financière. Le diagramme peut montrer des flèches ou des liens indiquant comment ces objectifs peuvent parfois être complémentaires ou, au contraire, entrer en conflit, nécessitant des arbitrages de la part des banques centrales.",
        "title": "Objectifs de la politique monétaire",
        "year": "2023"
      }
    },
    {
      "id": "flux_politique_monetaire",
      "componentType": "Mermaid",
      "sectionAnchor": "Schéma simplifié des mécanismes de transmission de la politique monétaire",
      "props": {
        "code": "graph TD\n    A[Banque Centrale] --> B{Décision de Politique Monétaire};\n    B --> C[Taux Directeurs];\n    C --> D[Taux d'intérêt du marché interbancaire];\n    D --> E[Taux d'intérêt des banques commerciales];\n    E --> F[Coût du crédit pour ménages et entreprises];\n    F --> G[Investissement & Consommation];\n    G --> H[Demande Agrégée];\n    H --> I[Inflation & Croissance Économique];\n    B --> J[Opérations d'Open Market];\n    J --> D;\n    B --> K[Exigences de Réserves];\n    K --> D;"
      }
    },
    {
      "id": "impact_rigidites_politique_monetaire",
      "componentType": "Image",
      "sectionAnchor": "L'impact des rigidités nominales sur la transmission de la politique monétaire",
      "props": {
        "description": "Une représentation graphique ou schématique de la manière dont les rigidités nominales, telles que la rigidité des salaires ou des prix, peuvent influencer l'efficacité et la vitesse de transmission des impulsions de politique monétaire à l'économie réelle. Le graphique pourrait montrer comment, en présence de rigidités, une modification des taux d'intérêt met plus de temps à affecter l'inflation ou la production, ou comment son impact est atténué.",
        "title": "Rigidités nominales et politique monétaire",
        "year": "2023"
      }
    },
    {
      "id": "fonctions_banque_centrale",
      "componentType": "Image",
      "sectionAnchor": "Les fonctions clés d'une banque centrale moderne, incluant l'émission, la régulation et la politique monétaire",
      "props": {
        "description": "Un diagramme illustrant les multiples fonctions d'une banque centrale moderne. Il devrait inclure l'émission de monnaie, la régulation et la supervision bancaire, la gestion des réserves de change, le rôle de prêteur en dernier ressort, et bien sûr, la formulation et la mise en œuvre de la politique monétaire. Chaque fonction pourrait être représentée par un nœud ou une section distincte, avec des liens montrant leurs interconnexions.",
        "title": "Fonctions clés de la Banque Centrale",
        "year": "2023"
      }
    },
    {
      "id": "instruments_politique_monetaire",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme des instruments de politique monétaire (conventionnels et non conventionnels)",
      "props": {
        "code": "graph TD\n    A[Instruments de Politique Monétaire] --> B{Conventionnels};\n    A --> C{Non Conventionnels};\n    B --> B1[Taux Directeurs];\n    B --> B2[Opérations d'Open Market];\n    B --> B3[Exigences de Réserves];\n    C --> C1[Assouplissement Quantitatif (QE)];\n    C --> C2[Forward Guidance];\n    C --> C3[Taux d'intérêt négatifs];\n    C --> C4[Opérations de refinancement ciblées (TLTRO)];"
      }
    },
    {
      "id": "canaux_transmission_politique_monetaire",
      "componentType": "Image",
      "sectionAnchor": "Schéma des principaux canaux de transmission de la politique monétaire à l'économie réelle",
      "props": {
        "description": "Un schéma détaillé des différents canaux par lesquels les décisions de politique monétaire se propagent à l'économie réelle. Cela inclurait le canal des taux d'intérêt, le canal du crédit (offre et demande), le canal du taux de change, le canal des prix des actifs (actions, immobilier) et le canal des anticipations. Chaque canal serait représenté avec ses étapes intermédiaires et son impact final sur l'inflation, la production et l'emploi.",
        "title": "Canaux de transmission de la politique monétaire",
        "year": "2023"
      }
    },
    {
      "id": "transmission_monetaire_explication",
      "componentType": "Video",
      "sectionAnchor": "Vidéo explicative sur les mécanismes de transmission de la politique monétaire",
      "props": {
        "title": "Les mécanismes de transmission de la politique monétaire expliqués",
        "year": "2023"
      }
    },
    {
      "id": "taylor_rule_formula",
      "componentType": "Image",
      "sectionAnchor": "Formulation de la Règle de Taylor et ses composantes",
      "props": {
        "description": "Une représentation visuelle de la formule mathématique de la Règle de Taylor, expliquant chaque composante : le taux d'intérêt nominal cible, le taux d'intérêt réel d'équilibre, l'écart d'inflation par rapport à la cible, et l'écart de production (output gap). La figure pourrait également inclure une brève explication de la signification de chaque terme et des coefficients typiques utilisés.",
        "title": "Formulation de la Règle de Taylor",
        "year": "2023"
      }
    },
    {
      "id": "taylor_rule_logic",
      "componentType": "Mermaid",
      "sectionAnchor": "Logique de décision de la Règle de Taylor",
      "props": {
        "code": "graph TD\n    A[Inflation Actuelle] --> B{Comparaison avec Cible d'Inflation};\n    C[Production Actuelle] --> D{Comparaison avec Production Potentielle (Output Gap)};\n    B -- Écart d'Inflation --> E[Ajustement du Taux d'Intérêt];\n    D -- Écart de Production --> E;\n    E --> F[Taux d'Intérêt Nominal Cible (Règle de Taylor)];\n    G[Taux d'Intérêt Réel d'Équilibre] --> F;"
      }
    },
    {
      "id": "taylor_rule_historical_fit",
      "componentType": "Image",
      "sectionAnchor": "Exemple d'application historique de la Règle de Taylor par la Réserve fédérale",
      "props": {
        "description": "Un graphique montrant l'application historique de la Règle de Taylor, superposée aux taux des fonds fédéraux réels décidés par la Réserve fédérale des États-Unis sur une période donnée. Le graphique permet de visualiser dans quelle mesure la politique monétaire réelle a suivi les préconisations de la Règle de Taylor, et d'identifier les périodes de déviance significative.",
        "title": "Règle de Taylor et politique de la Fed",
        "year": "2023"
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