You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux Défis Contemporains",
      "description": "Présenter l'objectif de la leçon, rappeler brièvement les concepts clés de la sociologie des organisations et du management stratégique étudiés précédemment, et introduire la nécessité d'aborder les défis actuels pour une compréhension complète du domaine."
    },
    {
      "heading": "## La Digitalisation et la Mondialisation: Nouveaux Paradigmes Organisationnels",
      "description": "Expliquer l'impact profond de la digitalisation (automatisation, IA, big data) et de la mondialisation (chaînes de valeur globales, diversité culturelle) sur les structures organisationnelles, les modes de travail et les stratégies managériales. Discuter des opportunités et des menaces associées."
    },
    {
      "heading": "## Éthique et Responsabilité Sociale des Entreprises (RSE): Au Cœur des Préoccupations Managériales",
      "description": "Aborder l'importance croissante de l'éthique des affaires et de la RSE. Examiner comment les organisations intègrent les dimensions sociales, environnementales et de gouvernance dans leurs stratégies, et les implications pour leur légitimité et leur performance."
    },
    {
      "heading": "## Intégration des Connaissances: Appliquer les Cadres Théoriques aux Défis Actuels",
      "description": "Faire le lien entre les théories et concepts de la sociologie des organisations et du management stratégique vus dans le cours (ex: théories de la contingence, pouvoir, culture organisationnelle, stratégies concurrentielles) et les défis contemporains. Montrer comment ces cadres aident à analyser et à répondre aux enjeux actuels."
    },
    {
      "heading": "## Perspectives Futures et Rôle du Manager Stratégique",
      "description": "Proposer des pistes de réflexion sur l'évolution future des organisations et du management. Discuter du rôle du manager comme acteur clé de la transformation, capable d'anticiper, d'innover et de gérer la complexité dans un environnement en mutation constante."
    },
    {
      "heading": "## Conclusion Générale du Cours",
      "description": "Synthétiser les principaux enseignements de l'ensemble du cours, souligner l'interconnexion des concepts et l'importance d'une approche holistique. Ouvrir sur la pertinence continue de la sociologie des organisations et du management stratégique pour les futurs professionnels."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Intégration des connaissances acquises et discussion des enjeux émergents (digitalisation, RSE, mondialisation, éthique), avec une conclusion générale du cours.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.