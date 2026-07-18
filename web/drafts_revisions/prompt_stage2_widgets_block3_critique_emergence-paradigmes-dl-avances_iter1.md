You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "evolution_dl_paradigms",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution conceptuelle des paradigmes de l'apprentissage profond",
      "props": {
        "code": "graph TD\n    A[Apprentissage Automatique Traditionnel] --> B(Apprentissage Profond);\n\n    B --> C1(Réseaux de Neurones Artificiels - ANNs);\n    C1 --> D1(Perceptron Multicouche - MLP);\n\n    B --> C2(Réseaux de Neurones Convolutifs - CNNs);\n    C2 --> D2(Reconnaissance d'images, Vision par ordinateur);\n\n    B --> C3(Réseaux de Neurones Récurrents - RNNs);\n    C3 --> D3(Traitement du Langage Naturel - NLP, Séquences);\n    D3 --> E1(LSTM/GRU);\n\n    B --> C4(Mécanismes d'Attention);\n    C4 --> D4(Transformers);\n    D4 --> E2(Modèles de Langage à Grande Échelle - LLMs);\n\n    B --> C5(Modèles Génératifs);\n    C5 --> D5(GANs, VAEs, Diffusion Models);\n    D5 --> E3(Création de contenu, Synthèse d'images/texte);\n\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style B fill:#bbf,stroke:#333,stroke-width:2px\n    style C1 fill:#ccf,stroke:#333,stroke-width:1px\n    style C2 fill:#ccf,stroke:#333,stroke-width:1px\n    style C3 fill:#ccf,stroke:#333,stroke-width:1px\n    style C4 fill:#ccf,stroke:#333,stroke-width:1px\n    style C5 fill:#ccf,stroke:#333,stroke-width:1px\n    style D1 fill:#ddf,stroke:#333,stroke-width:1px\n    style D2 fill:#ddf,stroke:#333,stroke-width:1px\n    style D3 fill:#ddf,stroke:#333,stroke-width:1px\n    style D4 fill:#ddf,stroke:#333,stroke-width:1px\n    style D5 fill:#ddf,stroke:#333,stroke-width:1px\n    style E1 fill:#eef,stroke:#333,stroke-width:1px\n    style E2 fill:#eef,stroke:#333,stroke-width:1px\n    style E3 fill:#eef,stroke:#333,stroke-width:1px"
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
            "q": "Quelle est une limitation majeure des Réseaux de Neurones Convolutifs (CNN) en matière de compréhension contextuelle globale d'une image ?",
            "options": [
              {
                "text": "Ils sont sensibles aux rotations et aux changements d'échelle des objets.",
                "correct": true
              },
              {
                "text": "Ils nécessitent une grande quantité de données étiquetées pour l'entraînement.",
                "correct": false
              },
              {
                "text": "Ils ont du mal à capturer les relations spatiales à longue portée entre les objets.",
                "correct": true
              },
              {
                "text": "Leur architecture est trop simple pour des tâches complexes.",
                "correct": false
              }
            ],
            "explanation": "Les CNNs excellent dans la détection de motifs locaux, mais peinent à comprendre les relations spatiales complexes et les dépendances à longue portée sans mécanismes additionnels. Ils sont également sensibles aux transformations géométriques."
          },
          {
            "q": "Quel est le principal défi rencontré par les Réseaux de Neurones Récurrents (RNN) traditionnels lors du traitement de séquences très longues ?",
            "options": [
              {
                "text": "Le problème de la disparition ou de l'explosion du gradient.",
                "correct": true
              },
              {
                "text": "Leur incapacité à traiter des données séquentielles.",
                "correct": false
              },
              {
                "text": "Une complexité de calcul trop faible.",
                "correct": false
              },
              {
                "text": "Ils ne peuvent pas apprendre de dépendances à court terme.",
                "correct": false
              }
            ],
            "explanation": "Les RNNs traditionnels souffrent du problème de la disparition ou de l'explosion du gradient, ce qui rend difficile l'apprentissage des dépendances à long terme dans les séquences."
          },
          {
            "q": "Comparé aux architectures plus récentes comme les Transformers, quelle est une limitation commune aux CNNs et RNNs concernant le parallélisme de calcul ?",
            "options": [
              {
                "text": "Les CNNs et RNNs sont intrinsèquement plus parallèles que les Transformers.",
                "correct": false
              },
              {
                "text": "Les RNNs traitent les séquences de manière séquentielle, limitant le parallélisme, tandis que les CNNs ont un parallélisme limité par la taille des noyaux.",
                "correct": true
              },
              {
                "text": "Les deux architectures sont entièrement parallèles, ce qui n'est pas une limitation.",
                "correct": false
              },
              {
                "text": "Leur besoin de GPU spécifiques limite leur parallélisme.",
                "correct": false
              }
            ],
            "explanation": "Les RNNs traitent les données séquentiellement, ce qui entrave le parallélisme. Bien que les CNNs soient plus parallèles que les RNNs, ils ne peuvent pas traiter toutes les parties d'une entrée simultanément comme les Transformers, qui utilisent l'attention pour calculer les dépendances en parallèle."
          }
        ]
      }
    },
    {
      "id": "attention_mechanism_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme simplifié du mécanisme d'attention, montrant comment les poids sont calculés et appliqués pour créer un vecteur de contexte",
      "props": {
        "code": "graph TD\n    A[Entrée Séquentielle] --> B(Encoder);\n    B --> C(Représentations Cachées Hi);\n    A --> D(Décodeur);\n\n    C -- Query (Q) --> E{Calcul des Scores d'Attention};\n    C -- Key (K) --> E;\n    E --> F(Scores d'Attention);\n    F --> G(Softmax);\n    G --> H(Poids d'Attention Wi);\n\n    C -- Value (V) --> I{Application des Poids};\n    H --> I;\n    I --> J(Vecteur de Contexte C);\n\n    J --> D;\n    D --> K(Sortie Séquentielle);\n\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style B fill:#bbf,stroke:#333,stroke-width:2px\n    style C fill:#ccf,stroke:#333,stroke-width:1px\n    style D fill:#bbf,stroke:#333,stroke-width:2px\n    style E fill:#ddf,stroke:#333,stroke-width:1px\n    style F fill:#eef,stroke:#333,stroke-width:1px\n    style G fill:#eef,stroke:#333,stroke-width:1px\n    style H fill:#eef,stroke:#333,stroke-width:1px\n    style I fill:#ddf,stroke:#333,stroke-width:1px\n    style J fill:#ccf,stroke:#333,stroke-width:1px\n    style K fill:#f9f,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "deep_learning_timeline",
      "componentType": "Image",
      "sectionAnchor": "Chronologie des architectures majeures de l'apprentissage profond, de CNN à Transformer",
      "props": {
        "description": "Cette chronologie illustre l'évolution des architectures majeures de l'apprentissage profond, depuis les premiers réseaux de neurones convolutifs (CNN) et récurrents (RNN) jusqu'aux modèles basés sur l'attention comme les Transformers. Elle met en évidence les jalons clés et les innovations qui ont conduit à des avancées significatives dans des domaines tels que la vision par ordinateur et le traitement du langage naturel, culminant avec l'émergence des modèles génératifs.",
        "title": "Chronologie des Architectures d'Apprentissage Profond",
        "year": "2023"
      }
    },
    {
      "id": "deep_learning_to_generative",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des architectures d'apprentissage profond vers les modèles génératifs",
      "props": {
        "code": "graph TD\n    A[Apprentissage Profond Traditionnel] --> B(CNNs);\n    A --> C(RNNs);\n\n    B --> D(Vision par Ordinateur);\n    C --> E(Traitement du Langage Naturel);\n\n    F[Mécanismes d'Attention] --> G(Transformers);\n    G --> H(Modèles de Langage à Grande Échelle - LLMs);\n    G --> I(Vision Transformer - ViT);\n\n    J[Modèles Génératifs] --> K(GANs - Generative Adversarial Networks);\n    J --> L(VAEs - Variational Autoencoders);\n    J --> M(Diffusion Models);\n\n    H --> N(Génération de Texte);\n    I --> O(Génération d'Images);\n    K --> O;\n    L --> O;\n    M --> O;\n\n    subgraph Évolution\n        A --> F;\n        F --> J;\n    end\n\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style B fill:#bbf,stroke:#333,stroke-width:1px\n    style C fill:#bbf,stroke:#333,stroke-width:1px\n    style D fill:#ccf,stroke:#333,stroke-width:1px\n    style E fill:#ccf,stroke:#333,stroke-width:1px\n    style F fill:#f9f,stroke:#333,stroke-width:2px\n    style G fill:#bbf,stroke:#333,stroke-width:1px\n    style H fill:#ccf,stroke:#333,stroke-width:1px\n    style I fill:#ccf,stroke:#333,stroke-width:1px\n    style J fill:#f9f,stroke:#333,stroke-width:2px\n    style K fill:#bbf,stroke:#333,stroke-width:1px\n    style L fill:#bbf,stroke:#333,stroke-width:1px\n    style M fill:#bbf,stroke:#333,stroke-width:1px\n    style N fill:#ccf,stroke:#333,stroke-width:1px\n    style O fill:#ccf,stroke:#333,stroke-width:1px"
      }
    },
    {
      "id": "yoshua_bengio_generative_ai",
      "componentType": "Quote",
      "sectionAnchor": "Citationde Yoshua Bengio sur l'importance de l'IA générative",
      "props": {
        "quote": "L'IA générative est une étape cruciale vers une intelligence artificielle plus générale, capable non seulement de reconnaître des motifs, mais aussi de créer et d'imaginer, ce qui est fondamental pour la compréhension du monde et l'interaction avec celui-ci.",
        "source": "Yoshua Bengio"
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