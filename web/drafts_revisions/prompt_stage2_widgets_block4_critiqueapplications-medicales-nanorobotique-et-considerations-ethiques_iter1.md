You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quelle est l'une des principales applications des nanotechnologies en médecine?",
          "explanation": "Les nanotechnologies permettent de développer des systèmes de livraison de médicaments qui ciblent spécifiquement les cellules malades, minimisant les effets secondaires sur les tissus sains.",
          "options": [
            {
              "text": "La construction de gratte-ciel.",
              "correct": false
            },
            {
              "text": "La livraison ciblée de médicaments.",
              "correct": true
            },
            {
              "text": "La production d'énergie nucléaire.",
              "correct": false
            },
            {
              "text": "La fabrication de vêtements.",
              "correct": false
            }
          ]
        },
        {
          "q": "Qu'est-ce que la nanorobotique médicale?",
          "explanation": "La nanorobotique médicale implique la création de dispositifs minuscules capables d'effectuer des tâches précises à l'intérieur du corps, comme la détection de maladies ou la réparation de tissus.",
          "options": [
            {
              "text": "L'étude des robots géants.",
              "correct": false
            },
            {
              "text": "La conception de robots à l'échelle macroscopique pour la chirurgie.",
              "correct": false
            },
            {
              "text": "Le développement de machines à l'échelle nanométrique ou micrométrique pour des applications biomédicales.",
              "correct": true
            },
            {
              "text": "La fabrication de jouets robotiques.",
              "correct": false
            }
          ]
        },
        {
          "q": "Parmi les considérations éthiques liées aux nanotechnologies médicales, laquelle est la plus pertinente concernant l'amélioration humaine?",
          "explanation": "L'amélioration humaine par les nanotechnologies soulève des questions éthiques importantes sur qui aura accès à ces technologies et si cela pourrait créer de nouvelles inégalités sociales.",
          "options": [
            {
              "text": "Le coût élevé des traitements.",
              "correct": false
            },
            {
              "text": "La question de l'équité d'accès aux technologies d'amélioration.",
              "correct": true
            },
            {
              "text": "La difficulté de stockage des nanomatériaux.",
              "correct": false
            },
            {
              "text": "L'impact sur l'environnement.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est le concept de \"théranostique\" en nanomédecine?",
          "explanation": "La théranostique utilise des nanomatériaux pour combiner des capacités de diagnostic (imagerie) et de traitement (livraison de médicaments) au sein d'une même plateforme.",
          "options": [
            {
              "text": "Une méthode de diagnostic uniquement.",
              "correct": false
            },
            {
              "text": "Une combinaison de thérapie et de diagnostic dans une seule approche.",
              "correct": true
            },
            {
              "text": "Une nouvelle forme de thérapie génique.",
              "correct": false
            },
            {
              "text": "L'étude des effets secondaires des médicaments.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est un défi majeur pour l'application des nanorobots in vivo?",
          "explanation": "L'alimentation, la navigation et le contrôle précis des nanorobots dans l'environnement complexe du corps humain sont des défis techniques majeurs.",
          "options": [
            {
              "text": "Leur taille trop grande.",
              "correct": false
            },
            {
              "text": "La difficulté de les alimenter en énergie et de les contrôler une fois à l'intérieur du corps.",
              "correct": true
            },
            {
              "text": "Le manque de matériaux disponibles pour leur fabrication.",
              "correct": false
            },
            {
              "text": "Leur incapacité à interagir avec les cellules.",
              "correct": false
            }
          ]
        },
        {
          "q": "Comment les nanoparticules peuvent-elles améliorer l'imagerie médicale?",
          "explanation": "Les nanoparticules peuvent être conçues pour s'accumuler dans des zones spécifiques (par exemple, des tumeurs) et améliorer le contraste dans diverses modalités d'imagerie comme l'IRM ou la tomographie.",
          "options": [
            {
              "text": "En rendant les images floues.",
              "correct": false
            },
            {
              "text": "En agissant comme agents de contraste pour améliorer la visibilité des structures.",
              "correct": true
            },
            {
              "text": "En augmentant la dose de radiation nécessaire.",
              "correct": false
            },
            {
              "text": "En remplaçant complètement les équipements d'imagerie existants.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle est une préoccupation éthique majeure concernant la vie privée et les nanotechnologies médicales?",
          "explanation": "Les nanodispositifs implantables ou ingérables pourraient potentiellement collecter des informations très sensibles sur la santé d'un individu, soulevant des questions sur la protection de la vie privée et le consentement.",
          "options": [
            {
              "text": "Le coût des nanomatériaux.",
              "correct": false
            },
            {
              "text": "La possibilité de collecter des données biométriques très détaillées sans consentement.",
              "correct": true
            },
            {
              "text": "La difficulté de recycler les nanodispositifs.",
              "correct": false
            },
            {
              "text": "Le risque de contamination environnementale.",
              "correct": false
            }
          ]
        }
      ]
    }
  },
  "references": [
    "Freitas, R. A., Jr. What is nanomedicine? Nanomedicine: Nanotechnology, Biology and Medicine 1, 2-9 (2005).",
    "Nelson, B. J., Kaliakatsos, I. K., & Abbott, J. J. Microrobots for minimally invasive medicine. Annual Review of Biomedical Engineering 12, 55-85 (2010).",
    "Resnik, D. B. The ethics of nanomedicine. Journal of Medical Ethics 32, 607-610 (2006).",
    "Lammers, T., Kiessling, F., Ashford, M., & Hennink, W. E. Theranostic nanomedicine. Advanced Drug Delivery Reviews 64, 1386-1388 (2012)."
  ]
}

Ensure:
1. Bibliography entries are valid academic citations.
2. Quizzes are mathematically/scientifically accurate.
3. No HTML or custom Hover-Card tags inside quiz strings.
4. Absolutely ZERO placeholders or generic filler text (like "Option A", "Option B", "Option", etc.) are allowed in the quiz questions or options. All questions and options must contain actual high-quality academic content in the target language. Reject if any question has dummy options.
5. If this is a terminal evaluation (isTerminalEvaluation is false), the "references" array must be strictly empty ([]).
6. If this is a terminal evaluation, no media (images, video, audio) or Mermaid diagrams are allowed in the quiz questions/explanations unless they are absolutely functional to the assessment itself (e.g. diagram-based logic puzzles). Decorative images or non-essential diagrams must be rejected.
7. If this is a terminal evaluation, no hover cards (RealPerson, ConceptLink, Glossary) are allowed in the quiz questions/explanations.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'finalEvaluation' or 'references')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.