You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Principes fondamentaux de la physique des ondes",
        "slug": "principes-fondamentaux-physique-ondes",
        "level": "L1",
        "subject": "Physique"
      },
      {
        "title": "Introduction à l'histoire des sciences",
        "slug": "introduction-histoire-sciences",
        "level": "L1",
        "subject": "Histoire des Sciences"
      },
      {
        "title": "Bases de la mécanique vibratoire",
        "slug": "bases-mecanique-vibratoire",
        "level": "L1",
        "subject": "Physique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Selon la physique classique, quelle est la nature fondamentale du son ?",
    "options": [
      "Une onde électromagnétique se propageant dans le vide",
      "Une onde de pression mécanique nécessitant un milieu matériel pour se propager",
      "Une particule subatomique émise par les sources sonores",
      "Un phénomène purement psychologique sans base physique objective"
    ],
    "correctIndex": 1,
    "targetSectionId": "remediation-ondes-sonores",
    "sectionTitle": "Rappel sur les ondes sonores"
  },
  "learningObjectives": {
    "knowledge": [
      "Identifier les étapes clés de la conceptualisation du son depuis l'Antiquité jusqu'à l'ère moderne.",
      "Décrire les modèles physiques et philosophiques qui ont tenté d'expliquer la nature du son.",
      "Expliquer l'impact des découvertes scientifiques majeures sur la compréhension du phénomène sonore."
    ],
    "skills": [
      "Analyser des extraits de textes historiques pour dégager les théories dominantes sur le son à différentes époques.",
      "Évaluer la validité et les limites des premières théories acoustiques au regard des principes physiques actuels.",
      "Créer une argumentation structurée sur l'évolution des paradigmes scientifiques en acoustique."
    ],
    "attitudes": [
      "Développer un esprit critique face aux différentes interprétations historiques des phénomènes physiques.",
      "Apprécier la démarche scientifique comme un processus évolutif et cumulatif.",
      "Adopter une posture d'ouverture intellectuelle envers les contributions passées à la science."
    ]
  }
}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).
4. ZERO placeholders, draft markers (e.g. bracketed text like "[insert]"), or template values are allowed. Reject the block if any text or option contains placeholder words like "Option", "placeholder", "todo", "tbd", "tbc", "lorem", "ipsum", "N/A" (or "n/a"), "## Section Name" or empty strings. All text fields must be fully fleshed out and complete.
5. CRITICAL WIDGET CONNECTION: The diagnosticQuiz must be strongly connected to the lesson's topics, containing actual high-quality educational content with specific parameters and a clear explanation of how the question relates to the prerequisites.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'prerequisites', 'diagnosticQuiz', or 'learningObjectives')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.