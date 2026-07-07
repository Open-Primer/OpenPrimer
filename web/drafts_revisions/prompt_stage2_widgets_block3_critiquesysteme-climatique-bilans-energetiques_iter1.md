You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Ce cours a mis en lumière la complexité du système climatique terrestre, un ensemble dynamique d'interactions entre l'atmosphère, les océans, la cryosphère, la biosphère et la lithosphère.",
      "Nous avons exploré le bilan énergétique de la Terre, soulignant l'importance de l'équilibre entre le rayonnement solaire entrant et le rayonnement terrestre sortant pour maintenir une température planétaire stable.",
      "La composition atmosphérique, en particulier la présence des gaz à effet de serre, a été identifiée comme un facteur clé régulant la température de surface via l'effet de serre naturel.",
      "Les perturbations de ce bilan énergétique et de cette composition atmosphérique, qu'elles soient d'origine naturelle ou anthropique, ont des implications profondes sur le climat global.",
      "Comprendre ces mécanismes fondamentaux est essentiel pour appréhender les défis actuels et futurs liés au changement climatique et pour développer des stratégies d'adaptation et d'atténuation efficaces."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Variabilité climatique et changement climatique",
        "description": "La prochaine leçon approfondira les causes naturelles et anthropiques de la variabilité et du changement climatique, en examinant les indicateurs, les modèles et les impacts observés à l'échelle mondiale.",
        "slug": "variabilite-climatique-changement-climatique"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Climatologie",
        "type": "book",
        "description": "Un ouvrage de référence couvrant les principes fondamentaux de la climatologie, y compris les bilans énergétiques, la composition atmosphérique et les grands systèmes climatiques.",
        "author": "Pierre Pagney, Jean-Pierre Chabin",
        "url": "https://www.armand-colin.com/climatologie-9782200616335",
        "year": "2017"
      },
      {
        "title": "Rapports d'évaluation du GIEC (Groupe d'experts intergouvernemental sur l'évolution du climat)",
        "type": "website",
        "description": "Site officiel du GIEC, offrant des rapports scientifiques exhaustifs sur l'état des connaissances concernant le changement climatique, ses causes, ses impacts et les options de réponse.",
        "url": "https://www.ipcc.ch/languages/french/"
      },
      {
        "title": "Le bilan radiatif de la Terre",
        "type": "article",
        "description": "Un article scientifique ou de vulgarisation détaillant les composantes du bilan radiatif terrestre et son rôle crucial dans la régulation du climat planétaire.",
        "author": "CNRS ou Météo-France (ex: dossier thématique)",
        "url": "https://www.cnrs.fr/fr/cnrsinfo/le-bilan-energetique-de-la-terre-un-equilibre-fragile",
        "year": "2020"
      }
    ]
  },
  "glossary": [
    {
      "term": "Bilan énergétique terrestre",
      "definition": "Équilibre entre l'énergie solaire reçue par la Terre et l'énergie réémise vers l'espace sous forme de rayonnement infrarouge. Cet équilibre détermine la température moyenne de la planète."
    },
    {
      "term": "Effet de serre",
      "definition": "Phénomène naturel par lequel certains gaz présents dans l'atmosphère (gaz à effet de serre) retiennent une partie du rayonnement infrarouge émis par la surface terrestre, réchauffant ainsi l'atmosphère et la surface."
    },
    {
      "term": "Gaz à effet de serre (GES)",
      "definition": "Composants gazeux de l'atmosphère, naturels ou anthropiques, qui absorbent et émettent le rayonnement infrarouge, contribuant ainsi à l'effet de serre. Les principaux GES sont la vapeur d'eau, le dioxyde de carbone, le méthane et l'oxyde nitreux."
    },
    {
      "term": "Albédo",
      "definition": "Mesure de la réflectivité d'une surface ou d'un corps. Il représente la fraction du rayonnement solaire incident qui est réfléchie sans être absorbée. L'albédo de la Terre varie en fonction des surfaces (glace, océans, forêts, etc.) et joue un rôle important dans le bilan énergétique."
    }
  ]
}

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in FR.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'conclusionSummary', 'whatsNext', 'goingFurther', or 'glossary')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.