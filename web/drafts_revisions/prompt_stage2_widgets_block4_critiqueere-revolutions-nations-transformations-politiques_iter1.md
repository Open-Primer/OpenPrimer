You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quel événement symbolise le début de la Révolution française le 14 juillet 1789 ?",
          "explanation": "La prise de la Bastille, une prison royale, est devenue le symbole de la chute de l'Ancien Régime et du début de la Révolution française.",
          "options": [
            {
              "text": "La prise de la Bastille",
              "correct": true
            },
            {
              "text": "Le serment du Jeu de paume",
              "correct": false
            },
            {
              "text": "La Déclaration des Droits de l'Homme et du Citoyen",
              "correct": false
            },
            {
              "text": "La fuite à Varennes",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel philosophe des Lumières a fortement influencé les idées de souveraineté populaire et de contrat social, centrales dans les révolutions de la fin du XVIIIe siècle ?",
          "explanation": "Jean-Jacques Rousseau, avec ses œuvres comme 'Du Contrat social', a développé des théories sur la souveraineté du peuple et la volonté générale, qui ont profondément inspiré les révolutionnaires.",
          "options": [
            {
              "text": "Voltaire",
              "correct": false
            },
            {
              "text": "Jean-Jacques Rousseau",
              "correct": true
            },
            {
              "text": "Montesquieu",
              "correct": false
            },
            {
              "text": "Denis Diderot",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel était l'objectif principal du Congrès de Vienne (1814-1815) après les guerres napoléoniennes ?",
          "explanation": "Le Congrès de Vienne visait principalement à restaurer les monarchies renversées par Napoléon et à redessiner la carte de l'Europe pour garantir un équilibre des puissances et prévenir de futures hégémonies.",
          "options": [
            {
              "text": "Établir une démocratie paneuropéenne",
              "correct": false
            },
            {
              "text": "Restaurer l'ordre monarchique et l'équilibre des puissances en Europe",
              "correct": true
            },
            {
              "text": "Promouvoir l'unification de l'Allemagne et de l'Italie",
              "correct": false
            },
            {
              "text": "Mettre fin à la traite négrière",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle déclaration fondamentale, adoptée en 1789, a proclamé les droits naturels et inaliénables de l'homme et du citoyen en France ?",
          "explanation": "La Déclaration des Droits de l'Homme et du Citoyen, adoptée le 26 août 1789, est un texte fondamental de la Révolution française qui énonce un ensemble de droits naturels, individuels et collectifs.",
          "options": [
            {
              "text": "La Constitution civile du clergé",
              "correct": false
            },
            {
              "text": "La Déclaration d'indépendance des États-Unis",
              "correct": false
            },
            {
              "text": "La Déclaration des Droits de l'Homme et du Citoyen",
              "correct": true
            },
            {
              "text": "Le Code Napoléon",
              "correct": false
            }
          ]
        },
        {
          "q": "Comment le concept de 'nation' a-t-il évolué et gagné en importance durant l'ère des révolutions ?",
          "explanation": "L'ère des révolutions a vu l'émergence du nationalisme, où la nation n'était plus le sujet du roi, mais une entité souveraine composée de citoyens partageant des liens culturels et historiques.",
          "options": [
            {
              "text": "Il est resté une simple désignation géographique sans connotation politique.",
              "correct": false
            },
            {
              "text": "Il est devenu synonyme de la personne du monarque.",
              "correct": false
            },
            {
              "text": "Il a commencé à désigner une communauté politique unie par une culture, une langue ou une histoire commune, détentrice de la souveraineté",
              "correct": true
            },
            {
              "text": "Il a été remplacé par l'idée d'empire universel.",
              "correct": false
            }
          ]
        }
      ],
      "durationLimit": 300
    }
  },
  "references": [
    "Doyle, William. 2002. *The Oxford History of the French Revolution*. 2nd ed. Oxford: Oxford University Press.",
    "Palmer, R. R. 1959. *The Age of the Democratic Revolution: A Political History of Europe and America, 1760-1800*. Princeton, NJ: Princeton University Press.",
    "Blanning, T. C. W. 2007. *The Pursuit of Glory: Europe 1648-1815*. New York: Viking.",
    "Hobsbawm, E. J. 1992. *Nations and Nationalism since 1780: Programme, Myth, Reality*. 2nd ed. Cambridge: Cambridge University Press."
  ]
}

Ensure:
1. Bibliography entries are valid academic citations.
2. Quizzes are mathematically/scientifically accurate.
3. No HTML or custom Hover-Card tags inside quiz strings.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'finalEvaluation' or 'references')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.