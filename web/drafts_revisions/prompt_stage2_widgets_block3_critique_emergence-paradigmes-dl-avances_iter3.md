You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "evolution_dl_paradigms",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution conceptuelle des paradigmes de l'apprentissage profond",
      "props": {
        "code": "graph TD\n    A[Apprentissage Automatique Traditionnel] --> B(Réseaux de Neurones Artificiels);\n    B --> C{Apprentissage Profond};\n    C --> D[CNN: Vision par Ordinateur];\n    C --> E[RNN/LSTM: Traitement du Langage Naturel];\n    D --> F[Transformer: Mécanisme d'Attention];\n    E --> F;\n    F --> G[Modèles Génératifs: Diffusion, GANs];\n    G --> H[IA Générative];"
      }
    },
    {
      "id": "cnn_rnn_limitations",
      "componentType": "Quiz",
      "sectionAnchor": "Quiz sur les limitations des CNN et RNN",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle est une limitation majeure des Réseaux de Neurones Convolutifs (CNN) pour les tâches de traitement de séquences longues?",
            "options": [
              {
                "text": "Ils sont incapables de traiter des images de haute résolution.",
                "correct": false
              },
              {
                "text": "Leur architecture ne gère pas naturellement les dépendances temporelles ou séquentielles.",
                "correct": true
              },
              {
                "text": "Ils nécessitent trop de données d'entraînement pour être efficaces.",
                "correct": false
              },
              {
                "text": "Ils sont sujets au problème de la disparition du gradient.",
                "correct": false
              }
            ],
            "explanation": "Les CNN excellent dans la reconnaissance de motifs spatiaux mais ne sont pas intrinsèquement conçus pour capturer les dépendances temporelles ou séquentielles, ce qui est crucial pour les données comme le texte ou l'audio."
          },
          {
            "q": "Parmi les problèmes suivants, lequel est le plus souvent associé aux Réseaux de Neurones Récurrents (RNN) lors du traitement de séquences très longues?",
            "options": [
              {
                "text": "L'incapacité à apprendre des motifs locaux.",
                "correct": false
              },
              {
                "text": "Le problème de la disparition ou de l'explosion du gradient, rendant difficile l'apprentissage des dépendances à long terme.",
                "correct": true
              },
              {
                "text": "Une sensibilité excessive au bruit dans les données d'entrée.",
                "correct": false
              },
              {
                "text": "Une complexité de calcul trop faible pour les grandes séquences.",
                "correct": false
              }
            ],
            "explanation": "Les RNN souffrent du problème de la disparition ou de l'explosion du gradient, ce qui les rend inefficaces pour capturer des informations sur de très longues dépendances dans une séquence."
          },
          {
            "q": "Quelle affirmation décrit le mieux une limitation commune aux architectures CNN et RNN avant l'avènement des Transformers?",
            "options": [
              {
                "text": "Leur incapacité à être déployés sur des appareils mobiles.",
                "correct": false
              },
              {
                "text": "Une difficulté à traiter efficacement les dépendances globales ou les relations à longue portée sans une complexité computationnelle élevée ou des problèmes de gradient.",
                "correct": true
              },
              {
                "text": "Leur dépendance exclusive aux données labellisées pour l'entraînement.",
                "correct": false
              },
              {
                "text": "L'impossibilité d'effectuer un apprentissage par transfert.",
                "correct": false
              }
            ],
            "explanation": "Avant les Transformers, les CNN et RNN avaient des difficultés à modéliser efficacement les dépendances globales ou à longue portée dans les données, soit en raison de la taille du champ réceptif (CNN), soit des problèmes de gradient (RNN)."
          }
        ]
      }
    },
    {
      "id": "attention_mechanism_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme simplifié du mécanisme d'attention, montrant comment les poids sont calculés et appliqués pour créer un vecteur de contexte",
      "props": {
        "code": "graph LR\n    A[Requête (Query)] --> C{Calcul de Similarité};\n    B[Clé (Key)] --> C;\n    C --> D[Poids d'Attention];\n    D --> E{Pondération des Valeurs};\n    F[Valeur (Value)] --> E;\n    E --> G[Vecteur de Contexte];"
      }
    },
    {
      "id": "deep_learning_timeline",
      "componentType": "Image",
      "sectionAnchor": "Chronologie des architectures majeures de l'apprentissage profond, de CNN à Transformer",
      "props": {
        "description": "Une chronologie visuelle illustrant les jalons et l'évolution des architectures majeures de l'apprentissage profond, commençant par les Réseaux de Neurones Convolutifs (CNN) et les Réseaux de Neurones Récurrents (RNN), puis progressant vers des innovations clés comme les LSTMs, les mécanismes d'attention, et culminant avec l'introduction des architectures Transformer. Chaque jalon est représenté avec son année d'introduction et une brève description de son impact sur le domaine.",
        "title": "Chronologie des Architectures Majeures de l'Apprentissage Profond",
        "year": "2012-2020"
      }
    },
    {
      "id": "deep_learning_to_generative",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des architectures d'apprentissage profond vers les modèles génératifs",
      "props": {
        "code": "graph TD\n    A[Apprentissage Profond Discriminatif] --> B(CNN, RNN);\n    B --> C{Modèles Séquence-à-Séquence};\n    C --> D[Mécanismes d'Attention];\n    D --> E[Transformer];\n    E --> F[Modèles Génératifs];\n    F --> G[GANs, VAEs, Modèles de Diffusion];\n    G --> H[IA Générative];"
      }
    },
    {
      "id": "yoshua_bengio_generative_ai",
      "componentType": "Quote",
      "sectionAnchor": "Citationde Yoshua Bengio sur l'importance de l'IA générative",
      "props": {
        "quote": "L'IA générative est une étape cruciale vers une IA plus générale, capable de comprendre et de manipuler le monde de manière plus abstraite et créative.",
        "source": "Yoshua Bengio, lors d'une conférence sur l'IA",
        "text": "L'IA générative est une étape cruciale vers une IA plus générale, capable de comprendre et de manipuler le monde de manière plus abstraite et créative.",
        "title": "L'importance de l'IA Générative",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Yoshua_Bengio",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Yoshua_Bengio"
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