You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Cette leçon a exploré le voyage fascinant des molécules inorganiques simples vers les systèmes vivants complexes, marquant l'émergence de la vie.",
      "Nous avons examiné les conditions de la Terre primitive qui ont favorisé la formation des molécules organiques, les briques élémentaires du vivant.",
      "Le concept d'auto-réplication, en particulier celui impliquant les acides nucléiques, a été mis en lumière comme une étape cruciale vers l'organisation du vivant.",
      "L'apparition des membranes, menant aux premières protocellules, a fourni la compartimentalisation nécessaire aux réactions biochimiques essentielles.",
      "En somme, cette leçon a souligné que la vie, telle que nous la connaissons, est le résultat d'une interaction complexe entre structures cellulaires et processus moléculaires, en constante évolution."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "La Cellule : Unité Fondamentale du Vivant",
        "description": "Après avoir exploré les mécanismes de l'émergence du vivant, nous allons maintenant plonger au cœur de l'unité fondamentale de la vie : la cellule. Cette leçon détaillera les structures et fonctions des cellules procaryotes et eucaryotes, leurs composants essentiels et les processus vitaux qu'elles abritent.",
        "slug": "la-cellule-unite-fondamentale-du-vivant"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "L'Origine de la Vie",
        "type": "book",
        "description": "Un ouvrage classique qui explore les théories et les preuves scientifiques concernant l'apparition de la vie sur Terre, des molécules prébiotiques aux premières cellules.",
        "author": "Alexander Oparin",
        "url": "https://example.com/oparin-origine-vie",
        "year": "1924"
      },
      {
        "title": "La Cellule : Une Aventure au Cœur du Vivant",
        "type": "book",
        "description": "Un livre accessible qui démystifie la biologie cellulaire, expliquant les fonctions des organites et les processus fondamentaux de la vie cellulaire.",
        "author": "Marc Henry",
        "url": "https://example.com/henry-cellule",
        "year": "2010"
      },
      {
        "title": "The Miller-Urey Experiment",
        "type": "video",
        "description": "Une explication visuelle de l'expérience historique de Miller-Urey, démontrant la formation d'acides aminés dans des conditions simulant la Terre primitive.",
        "author": "TED-Ed",
        "url": "https://www.youtube.com/watch?v=NNR_Q_J_Q_Q",
        "year": "2014"
      },
      {
        "title": "Le Monde de l'ARN",
        "type": "article",
        "description": "Un article scientifique vulgarisé sur l'hypothèse du monde de l'ARN, une théorie clé sur l'origine de la vie où l'ARN aurait joué un rôle central avant l'ADN et les protéines.",
        "author": "Pour la Science",
        "url": "https://example.com/monde-arn",
        "year": "2018"
      }
    ]
  },
  "glossary": [
    {
      "term": "Cellule",
      "definition": "Unité structurelle et fonctionnelle fondamentale de tout organisme vivant, capable de se reproduire de manière autonome et de maintenir son homéostasie. Elle est délimitée par une membrane plasmique et contient du matériel génétique."
    },
    {
      "term": "Acide nucléique",
      "definition": "Macromolécule biologique essentielle à toutes les formes de vie, responsable du stockage et de l'expression de l'information génétique. Les deux principaux types sont l'ADN (acide désoxyribonucléique) et l'ARN (acide ribonucléique)."
    },
    {
      "term": "Protéine",
      "definition": "Macromolécule biologique composée de chaînes d'acides aminés liées par des liaisons peptidiques. Les protéines remplissent une multitude de fonctions vitales dans les organismes, agissant comme enzymes, transporteurs, structures, hormones, etc."
    },
    {
      "term": "Origine de la vie",
      "definition": "Le processus naturel par lequel la vie est apparue à partir de matière non vivante, généralement désigné par le terme d'abiogenèse. Ce domaine de recherche explore les conditions et les mécanismes qui ont conduit à l'émergence des premières formes de vie sur Terre."
    }
  ]
}

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in FR.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix, or empty if approved"
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.