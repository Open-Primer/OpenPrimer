You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "La cellule eucaryote se distingue par sa complexité et sa compartimentalisation interne, abritant de nombreux organites spécialisés.",
      "Chaque organite joue un rôle crucial, allant du stockage de l'information génétique dans le noyau à la production d'énergie par les mitochondries.",
      "Le réticulum endoplasmique et l'appareil de Golgi sont essentiels pour la synthèse, la modification et le transport des protéines et des lipides.",
      "Les lysosomes et les peroxysomes sont responsables de la dégradation et de la détoxification, maintenant l'homéostasie cellulaire.",
      "Le cytosquelette assure le maintien de la forme cellulaire, le mouvement et le transport intracellulaire, soulignant l'organisation dynamique et hautement régulée de la cellule eucaryote."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "La Division Cellulaire : Mitose et Méiose",
        "description": "Après avoir exploré la structure et les fonctions des organites, nous aborderons les mécanismes fondamentaux par lesquels les cellules eucaryotes se reproduisent, assurant la croissance, la réparation des tissus et la transmission du matériel génétique.",
        "slug": "division-cellulaire-mitose-meiose"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Biologie Moléculaire de la Cellule",
        "type": "book",
        "description": "Ouvrage de référence mondialement reconnu, offrant une exploration exhaustive et détaillée de la biologie cellulaire et moléculaire, avec des illustrations claires et des explications approfondies sur l'architecture et les fonctions cellulaires.",
        "author": "Bruce Alberts, Alexander Johnson, Julian Lewis, David Morgan, Martin Raff, Keith Roberts, Peter Walter",
        "url": "https://www.deboecksuperieur.com/ouvrage/9782807302911-biologie-moleculaire-de-la-cellule",
        "year": "2017"
      },
      {
        "title": "Khan Academy - Biologie Cellulaire et Fonction",
        "type": "website",
        "description": "Ressources éducatives gratuites et interactives couvrant les concepts fondamentaux de la biologie cellulaire, avec des vidéos explicatives, des articles et des exercices pour renforcer la compréhension de l'architecture et des processus cellulaires.",
        "url": "https://fr.khanacademy.org/science/biology/cell-structure-and-function"
      }
    ]
  },
  "glossary": [
    {
      "term": "Cellule eucaryote",
      "definition": "Type de cellule caractérisée par la présence d'un noyau bien défini, délimité par une membrane nucléaire, et d'organites spécialisés également délimités par des membranes, permettant une compartimentalisation des fonctions cellulaires."
    },
    {
      "term": "Organite",
      "definition": "Structure spécialisée, délimitée par une membrane (à l'exception des ribosomes et du cytosquelette), présente dans le cytoplasme des cellules eucaryotes et remplissant une fonction biologique spécifique et essentielle à la vie cellulaire."
    },
    {
      "term": "Noyau",
      "definition": "Le plus grand organite de la cellule eucaryote, contenant le matériel génétique (ADN) organisé en chromosomes. Il régule l'expression génique et contrôle les activités cellulaires en dirigeant la synthèse des protéines."
    },
    {
      "term": "Mitochondrie",
      "definition": "Organite à double membrane, souvent appelé la 'centrale énergétique' de la cellule. Elle est responsable de la production de la majeure partie de l'énergie cellulaire sous forme d'ATP par le processus de respiration cellulaire."
    },
    {
      "term": "Réticulum endoplasmique",
      "definition": "Réseau complexe de membranes interconnectées formant des sacs et des tubules dans le cytoplasme. Le RE rugueux est impliqué dans la synthèse et la modification des protéines destinées à être sécrétées ou insérées dans les membranes, tandis que le RE lisse est impliqué dans la synthèse des lipides et la détoxification."
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