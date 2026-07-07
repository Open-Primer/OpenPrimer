You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Principes Fondamentaux de la Chimie Générale",
        "slug": "chimie-generale-fondamentaux",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Chimie"
      },
      {
        "title": "Introduction à la Biologie Générale",
        "slug": "biologie-generale-introduction",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Biologie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la caractéristique fondamentale qui distingue les organismes vivants de la matière inanimée, selon la perspective cellulaire et moléculaire?",
    "options": [
      "La capacité de se déplacer de manière autonome.",
      "La présence d'un noyau cellulaire bien défini.",
      "La possession d'un matériel génétique (ADN ou ARN) et une organisation cellulaire.",
      "La capacité de réaliser la photosynthèse pour produire de l'énergie."
    ],
    "correctIndex": 2,
    "targetSectionId": "section-1-introduction-cellulaire",
    "sectionTitle": "Introduction à la Cellule et aux Macromolécules"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les théories clés sur l'origine de la vie et l'évolution des premières cellules.",
      "Évaluer les caractéristiques distinctives des cellules procaryotes et eucaryotes.",
      "Distinguer les rôles des principales macromolécules biologiques dans la structure et la fonction cellulaire."
    ],
    "skills": [
      "Appliquer les principes de la méthode scientifique pour interpréter des données expérimentales sur l'émergence du vivant.",
      "Comparer et contraster les mécanismes fondamentaux de réplication, transcription et traduction chez les procaryotes et eucaryotes.",
      "Modéliser la structure et les interactions des composants cellulaires à partir de représentations schématiques."
    ],
    "attitudes": [
      "Développer une appréciation critique des preuves scientifiques soutenant les théories de l'évolution cellulaire.",
      "Adopter une curiosité intellectuelle envers les questions non résolues concernant l'origine et la complexité de la vie.",
      "Reconnaître l'importance de la biologie cellulaire et moléculaire comme fondement des sciences de la vie et de la médecine."
    ]
  }
}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix, or empty if approved"
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.