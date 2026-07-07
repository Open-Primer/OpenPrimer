You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quelle est la caractéristique principale d'une séquence d'instructions en algorithmique ?",
          "explanation": "Une séquence d'instructions est un bloc d'opérations exécutées l'une après l'autre, dans l'ordre où elles sont écrites.",
          "options": [
            {
              "text": "Les instructions sont exécutées dans un ordre aléatoire.",
              "correct": false
            },
            {
              "text": "Les instructions sont exécutées de manière conditionnelle.",
              "correct": false
            },
            {
              "text": "Les instructions sont exécutées séquentiellement, de la première à la dernière.",
              "correct": true
            },
            {
              "text": "Les instructions peuvent être répétées indéfiniment.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est le rôle d'une structure conditionnelle (par exemple, SI...ALORS...SINON) ?",
          "explanation": "Les structures conditionnelles permettent de contrôler le flux d'exécution d'un algorithme en fonction de la véracité d'une ou plusieurs conditions.",
          "options": [
            {
              "text": "Répéter un bloc d'instructions plusieurs fois.",
              "correct": false
            },
            {
              "text": "Exécuter un bloc d'instructions uniquement si une certaine condition est vraie.",
              "correct": true
            },
            {
              "text": "Définir une nouvelle variable.",
              "correct": false
            },
            {
              "text": "Afficher un message à l'utilisateur.",
              "correct": false
            }
          ]
        },
        {
          "q": "Dans l'expression logique (A ET B) OU C, si A est VRAI, B est FAUX et C est VRAI, quelle est la valeur de l'expression ?",
          "explanation": "(VRAI ET FAUX) donne FAUX. FAUX OU VRAI donne VRAI. L'opérateur ET est prioritaire sur OU.",
          "options": [
            {
              "text": "VRAI",
              "correct": true
            },
            {
              "text": "FAUX",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle est la différence fondamentale entre une boucle TANT QUE et une boucle POUR ?",
          "explanation": "La boucle POUR (for) est généralement utilisée lorsque le nombre d'itérations est connu ou peut être déterminé au début de la boucle. La boucle TANT QUE (while) est utilisée lorsque le nombre d'itérations est inconnu et dépend d'une condition qui peut changer pendant l'exécution.",
          "options": [
            {
              "text": "TANT QUE est utilisée pour un nombre d'itérations connu à l'avance, POUR pour un nombre inconnu.",
              "correct": false
            },
            {
              "text": "TANT QUE est utilisée pour un nombre d'itérations inconnu à l'avance, POUR pour un nombre connu.",
              "correct": true
            },
            {
              "text": "TANT QUE exécute toujours au moins une fois, POUR peut ne jamais s'exécuter.",
              "correct": false
            },
            {
              "text": "Il n'y a pas de différence fondamentale, elles sont interchangeables.",
              "correct": false
            }
          ]
        },
        {
          "q": "Considérez l'algorithme suivant :\nVARIABLE i : ENTIER\nDEBUT\n    i <- 0\n    TANT QUE i < 3 FAIRE\n        AFFICHER \"Bonjour\"\n        i <- i + 1\n    FIN TANT QUE\nFIN\nCombien de fois le mot \"Bonjour\" sera-t-il affiché ?",
          "explanation": "La variable i prendra successivement les valeurs 0, 1, 2. Pour i=3, la condition i < 3 devient fausse et la boucle s'arrête. Donc, \"Bonjour\" est affiché 3 fois.",
          "options": [
            {
              "text": "0 fois",
              "correct": false
            },
            {
              "text": "1 fois",
              "correct": false
            },
            {
              "text": "3 fois",
              "correct": true
            },
            {
              "text": "Une infinité de fois",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est le résultat de l'algorithme suivant ?\nVARIABLE x : ENTIER\nDEBUT\n    x <- 10\n    SI x > 5 ALORS\n        x <- x + 2\n    SINON\n        x <- x - 1\n    FIN SI\n    AFFICHER x\nFIN",
          "explanation": "x est initialisé à 10. La condition x > 5 (10 > 5) est vraie. Donc, x devient 10 + 2 = 12. L'algorithme affiche 12.",
          "options": [
            {
              "text": "9",
              "correct": false
            },
            {
              "text": "10",
              "correct": false
            },
            {
              "text": "11",
              "correct": false
            },
            {
              "text": "12",
              "correct": true
            }
          ]
        },
        {
          "q": "Une boucle infinie se produit lorsque :",
          "explanation": "Une boucle infinie est une boucle dont la condition de continuation reste toujours vraie, ou dont la condition d'arrêt ne devient jamais fausse, empêchant ainsi le programme de progresser au-delà de cette boucle.",
          "options": [
            {
              "text": "La condition de sortie de la boucle est toujours vraie.",
              "correct": false
            },
            {
              "text": "La condition de sortie de la boucle n'est jamais atteinte ou ne devient jamais fausse.",
              "correct": true
            },
            {
              "text": "La boucle contient trop d'instructions.",
              "correct": false
            },
            {
              "text": "La variable de contrôle de la boucle est initialisée à zéro.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est le rôle de l'opérateur d'affectation (<- ou =) en algorithmique ?",
          "explanation": "L'opérateur d'affectation permet de stocker une valeur (résultat d'une expression, constante, autre variable) dans une variable.",
          "options": [
            {
              "text": "Comparer deux valeurs.",
              "correct": false
            },
            {
              "text": "Déclarer une nouvelle variable.",
              "correct": false
            },
            {
              "text": "Attribuer une valeur à une variable.",
              "correct": true
            },
            {
              "text": "Exécuter une fonction.",
              "correct": false
            }
          ]
        },
        {
          "q": "Considérez l'algorithme :\nVARIABLE compteur : ENTIER\nDEBUT\n    compteur <- 0\n    POUR i DE 1 A 5 FAIRE\n        compteur <- compteur + 1\n    FIN POUR\n    AFFICHER compteur\nFIN\nQuelle valeur sera affichée pour compteur ?",
          "explanation": "La boucle POUR i DE 1 A 5 s'exécute 5 fois (pour i=1, 2, 3, 4, 5). À chaque itération, compteur est incrémenté de 1. Donc, compteur passera de 0 à 5.",
          "options": [
            {
              "text": "0",
              "correct": false
            },
            {
              "text": "1",
              "correct": false
            },
            {
              "text": "5",
              "correct": true
            },
            {
              "text": "6",
              "correct": false
            }
          ]
        },
        {
          "q": "Si un algorithme contient une structure SI imbriquée dans une autre structure SI, comment les conditions sont-elles évaluées ?",
          "explanation": "Pour qu'un bloc d'instructions dans un SI imbriqué soit exécuté, la condition du SI externe doit d'abord être vraie, puis la condition du SI interne doit également être vraie.",
          "options": [
            {
              "text": "Seule la condition la plus interne est évaluée.",
              "correct": false
            },
            {
              "text": "Les deux conditions doivent être vraies pour que le bloc d'instructions interne soit exécuté.",
              "correct": true
            },
            {
              "text": "Les conditions sont évaluées en parallèle.",
              "correct": false
            },
            {
              "text": "Seule la condition la plus externe est évaluée.",
              "correct": false
            }
          ]
        }
      ],
      "durationLimit": 900
    }
  },
  "references": [
    "Brassard, Gilles, et Paul Bratley. 2002. Algorithmique: Conception et analyse. 2e éd. Montréal: Presses Internationales Polytechnique.",
    "Cormen, Thomas H., Charles E. Leiserson, Ronald L. Rivest, et Clifford Stein. 2010. Algorithmique. 3e éd. Paris: Dunod.",
    "Dowek, Gilles. 2002. La logique. Paris: Flammarion.",
    "Meyer, Bertrand. 1994. Conception et programmation orientées objet. Paris: Eyrolles.",
    "Sedgewick, Robert, et Kevin Wayne. 2011. Algorithmes en Java. Paris: Pearson Education France.",
    "Wirth, Niklaus. 1987. Algorithmes et structures de données. Paris: Eyrolles.",
    "Aho, Alfred V., John E. Hopcroft, et Jeffrey D. Ullman. 1987. Structures de données et algorithmes. Paris: InterEditions."
  ]
}

Ensure:
1. Bibliography entries are valid academic citations.
2. Quizzes are mathematically/scientifically accurate.
3. No HTML or custom Hover-Card tags inside quiz strings.
4. The quiz has EXACTLY between 8 and 12 questions.
5. The references array has EXACTLY between 5 and 7 entries.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix, or empty if approved"
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.