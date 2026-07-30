You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "theatre_epidaure",
      "componentType": "Image",
      "sectionAnchor": "Comment l'architecture du théâtre d'Épidaure reflète-t-elle l'acoustique et la fonction sociale du spectacle dans la Grèc'antique ?",
      "props": {
        "alt": "Théâtre d'Épidaure, vue aérienne",
        "caption": "_Comment la conception semi-circulaire et la pente des gradins du théâtre d'Épidaure, combinées à l'utilisation de matériaux spécifiques, ont-elles permis d'atteindre une acoustique quasi parfaite, rendant chaque mot audible même depuis les rangées les plus éloignées, et quelle était l'importance de cette prouesse technique pour la fonction sociale et religieuse du théâtre antique ?_",
        "description": "Vue aérienne du théâtre d'Épidaure, un amphithéâtre antique grec remarquablement conservé, situé en Argolide. Il est célèbre pour son acoustique exceptionnelle et sa capacité à accueillir un vaste public, témoignant de l'ingéniosité architecturale grecque pour les spectacles dramatiques et rituels.",
        "searchQuery": "Théâtre Épidaure architecture acoustique",
        "title": "Théâtre d'Épidaure"
      }
    },
    {
      "id": "evolution_theatre_grec",
      "componentType": "Mermaid",
      "sectionAnchor": "Visualisation des étapes clés de l'évolution du théâtre grec, de ses origines religieuses aux grands dramaturges.",
      "props": {
        "code": "graph TD\n    A[Origines religieuses: Dithyrambes] --> B(Théâtre de Dionysos à Athènes);\n    B --> C{Développement du drame};\n    C --> D[Thespis: Premier acteur];\n    D --> E[Eschyle: Ajout d'un deuxième acteur, dialogue];\n    E --> F[Sophocle: Ajout d'un troisième acteur, complexité psychologique];\n    F --> G[Euripide: Réalisme, critique sociale];\n    G --> H[Comédie Ancienne: Aristophane];\n    H --> I[Comédie Nouvelle: Ménandre];\n    I --> J[Influence sur le théâtre romain et occidental];"
      }
    },
    {
      "id": "parthenon_architecture",
      "componentType": "Image",
      "sectionAnchor": "Comment l'architecture du Parthénon, avec ses colonnes doriques et ses proportions harmonieuses, illustre-t-elle la recherche de perfection et d'équilibre dans l'art grec antique ?",
      "props": {
        "alt": "Parthénon, Acropole d'Athènes",
        "caption": "_En quoi les subtiles corrections optiques appliquées à l'architecture du Parthénon, telles que l'entasis des colonnes et la légère courbure du stylobate, démontrent-elles la quête grecque de l'idéal de perfection et d'harmonie, et comment ces principes esthétiques continuent-ils d'influencer l'architecture contemporaine ?_",
        "description": "Représentation du Parthénon, temple dorique dédié à la déesse Athéna, situé sur l'Acropole d'Athènes. Construit au Ve siècle av. J.-C., il incarne les principes de l'ordre dorique, avec ses colonnes cannelées, son entablement simple et ses proportions calculées pour créer une illusion d'équilibre et de perfection visuelle.",
        "searchQuery": "Parthénon architecture dorique",
        "title": "Architecture du Parthénon"
      }
    },
    {
      "id": "philosophical_lineage",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme illustrant la filiation intellectuelle et l'influence des trois grands philosophes grecs : Socrate, Platon et Aristote, et leurs contributions majeures.",
      "props": {
        "code": "graph TD\n    A[Socrate (470-399 av. J.-C.)] --> B(Méthode Socratique: Maïeutique, Ironie);\n    B --> C(Recherche de la Vérité, Vertu);\n    C --> D[Platon (428-348 av. J.-C.)];\n    D --> E(Théorie des Idées/Formes);\n    E --> F(L'Académie d'Athènes);\n    F --> G(La République, Allégorie de la Caverne);\n    G --> H[Aristote (384-322 av. J.-C.)];\n    H --> I(Empirisme, Logique, Éthique à Nicomaque);\n    I --> J(Le Lycée);\n    J --> K(Classification des sciences, Politique);\n    D -- Maître/Élève --> A;\n    H -- Élève --> D;"
      }
    },
    {
      "id": "quiz_arts_pensee_grecque",
      "componentType": "Quiz",
      "sectionAnchor": "Quiz sur les arts et la pensée grecque",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle caractéristique architecturale majeure du théâtre d'Épidaure est directement responsable de son acoustique exceptionnelle ?",
            "options": [
              {
                "text": "La présence d'un toit en bois au-dessus de la scène.",
                "correct": false
              },
              {
                "text": "La forme semi-circulaire des gradins et l'inclinaison des sièges.",
                "correct": true
              },
              {
                "text": "L'utilisation de miroirs paraboliques pour amplifier le son.",
                "correct": false
              },
              {
                "text": "La construction entièrement en marbre poli.",
                "correct": false
              }
            ],
            "explanation": "La forme semi-circulaire et la pente optimisée des gradins permettaient une diffusion uniforme du son, assurant une clarté acoustique remarquable pour tous les spectateurs."
          },
          {
            "q": "Quel ordre architectural est principalement illustré par le Parthénon, caractérisé par ses colonnes robustes et ses chapiteaux simples ?",
            "options": [
              {
                "text": "L'ordre corinthien.",
                "correct": false
              },
              {
                "text": "L'ordre ionique.",
                "correct": false
              },
              {
                "text": "L'ordre dorique.",
                "correct": true
              },
              {
                "text": "L'ordre composite.",
                "correct": false
              }
            ],
            "explanation": "Le Parthénon est l'exemple le plus emblématique de l'ordre dorique, reconnaissable à ses colonnes sans base et à ses chapiteaux épurés."
          },
          {
            "q": "Identifiez la bonne séquence chronologique de la filiation intellectuelle entre ces philosophes grecs majeurs.",
            "options": [
              {
                "text": "Platon, Socrate, Aristote",
                "correct": false
              },
              {
                "text": "Aristote, Platon, Socrate",
                "correct": false
              },
              {
                "text": "Socrate, Platon, Aristote",
                "correct": true
              },
              {
                "text": "Socrate, Aristote, Platon",
                "correct": false
              }
            ],
            "explanation": "Socrate fut le maître de Platon, qui à son tour fut le maître d'Aristote, établissant une lignée philosophique fondamentale."
          }
        ]
      }
    },
    {
      "id": "parlement_grec_moderne",
      "componentType": "Image",
      "sectionAnchor": "Comment l'architecture du Parlement hellénique à Athènes, construit au XIXe siècle, reflète-t-elle les idéaux esthétiques et politiques de la Grèc'antique ?",
      "props": {
        "alt": "Parlement hellénique à Athènes",
        "caption": "_En quoi l'adoption du style néoclassique pour le Parlement hellénique au XIXe siècle, avec ses références directes à l'architecture grecque antique, symbolise-t-elle la volonté de la Grèce moderne de se réapproprier son identité historique et de projeter une image de continuité avec les idéaux démocratiques et esthétiques de l'Antiquité ?_",
        "description": "Le bâtiment du Parlement hellénique, anciennement le Palais Royal, situé sur la place Syntagma à Athènes. Construit entre 1836 et 1842 dans un style néoclassique, il intègre des éléments architecturaux grecs antiques, tels que des colonnes et des frontons, pour affirmer un lien avec l'héritage démocratique et culturel de la Grèce antique.",
        "searchQuery": "Parlement grec Athènes architecture néoclassique",
        "title": "Parlement hellénique, Athènes"
      }
    },
    {
      "id": "heritage_grec_moderne",
      "componentType": "Video",
      "sectionAnchor": "Découvrez comment l'héritage de la Grèc'antique continue de façonner notre monde moderne, de l'architecture aux idées politiques et philosophiques.",
      "props": {
        "description": "Ce segment vidéo explore les multiples facettes de l'influence de la Grèce antique sur la civilisation contemporaine. Il met en lumière comment les concepts grecs de démocratie, de philosophie, d'art, d'architecture et de sport ont traversé les siècles pour façonner nos institutions, nos modes de pensée et notre culture actuelle, offrant des exemples concrets de cette persistance.",
        "duration": "5:45",
        "searchQuery": "Héritage Grèce antique monde moderne",
        "title": "L'héritage de la Grèce antique dans le monde moderne"
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