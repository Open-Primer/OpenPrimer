You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la programmation",
        "slug": "intro-programmation",
        "level": "L1",
        "subject": "Informatique"
      },
      {
        "title": "Structures de contrôle (conditions et boucles)",
        "slug": "structures-controle",
        "level": "L1",
        "subject": "Algorithmique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel sera le résultat affiché par le programme suivant ?\n\nx = 10\nsi x > 5 alors\n    x = x + 2\nfin si\nafficher x",
    "options": [
      "10",
      "12",
      "Erreur",
      "Indéfini"
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-fonctions",
    "sectionTitle": "Introduction aux fonctions"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les principes fondamentaux de la modularité et de l'abstraction en programmation.",
      "Évaluer l'impact des fonctions sur la lisibilité et la maintenabilité du code.",
      "Distinguer les concepts de portée de variable (locale vs. globale) et de passage de paramètres."
    ],
    "skills": [
      "Créer des fonctions réutilisables et bien structurées pour résoudre des problèmes algorithmiques.",
      "Évaluer et refactoriser du code existant pour améliorer sa modularité à l'aide de fonctions.",
      "Déboguer efficacement des programmes complexes impliquant des appels de fonctions et des interactions de portée."
    ],
    "attitudes": [
      "Développer une approche systématique pour décomposer les problèmes complexes en sous-problèmes fonctionnels.",
      "Valoriser la conception de code propre, modulaire et documenté pour faciliter la collaboration.",
      "Adopter une rigueur dans la validation et le test des fonctions pour garantir leur robustesse."
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