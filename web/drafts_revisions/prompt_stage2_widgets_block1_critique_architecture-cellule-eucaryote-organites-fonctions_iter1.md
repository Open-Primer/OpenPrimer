You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la Biologie Générale",
        "slug": "introduction-biologie-generale",
        "level": "Lycée",
        "subject": "Biologie"
      },
      {
        "title": "La Cellule Procaryote : Structure et Fonction",
        "slug": "cellule-procaryote-structure-fonction",
        "level": "University Year 1",
        "subject": "Biologie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la caractéristique la plus distinctive qui différencie une cellule eucaryote d'une cellule procaryote?",
    "options": [
      "La présence d'une membrane plasmique",
      "La présence de ribosomes",
      "La présence d'un noyau délimité par une membrane",
      "La présence de cytoplasme"
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-cellule-eucaryote",
    "sectionTitle": "Introduction à la Cellule Eucaryote"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser la composition moléculaire et l'organisation spatiale des principaux organites eucaryotes.",
      "Évaluer les rôles spécifiques et interdépendants des organites dans les fonctions cellulaires vitales.",
      "Distinguer les caractéristiques structurelles et fonctionnelles uniques des cellules animales et végétales."
    ],
    "skills": [
      "Interpréter des schémas et des micrographies électroniques pour identifier les organites et leurs localisations.",
      "Comparer et contraster les mécanismes de transport et de communication entre les différents compartiments cellulaires.",
      "Modéliser les voies de synthèse et de dégradation des macromolécules au sein de la cellule eucaryote."
    ],
    "attitudes": [
      "Apprécier la complexité et l'efficacité de l'organisation interne des cellules eucaryotes.",
      "Développer un esprit critique face aux représentations simplifiées des processus cellulaires.",
      "Reconnaître l'importance de l'intégrité structurelle des organites pour la fonction cellulaire globale et la santé."
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