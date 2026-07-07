You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Qu'est-ce que la récursivité en programmation ?",
          "explanation": "La récursivité est une technique où une fonction s'appelle elle-même pour résoudre un problème, en le décomposant en sous-problèmes plus petits de même nature.",
          "options": [
            {
              "text": "Une fonction qui ne s'appelle jamais elle-même.",
              "correct": false
            },
            {
              "text": "Une fonction qui s'appelle elle-même pour résoudre un problème en le décomposant en sous-problèmes similaires.",
              "correct": true
            },
            {
              "text": "Une boucle infinie sans condition d'arrêt.",
              "correct": false
            },
            {
              "text": "Une technique de programmation qui utilise uniquement des boucles itératives.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quels sont les deux éléments fondamentaux d'une fonction récursive ?",
          "explanation": "Toute fonction récursive doit avoir un cas de base (condition d'arrêt) et un pas récursif (appel de la fonction sur un problème plus petit).",
          "options": [
            {
              "text": "Une variable globale et une boucle 'for'.",
              "correct": false
            },
            {
              "text": "Un cas de base et un pas récursif.",
              "correct": true
            },
            {
              "text": "Une condition 'if-else' et un pointeur.",
              "correct": false
            },
            {
              "text": "Une structure de données et un algorithme de tri.",
              "correct": false
            }
          ]
        },
        {
          "q": "Pourquoi le cas de base est-il crucial dans une fonction récursive ?",
          "explanation": "Le cas de base est la condition d'arrêt qui empêche la fonction de s'appeler indéfiniment, évitant ainsi une boucle infinie et un débordement de pile.",
          "options": [
            {
              "text": "Il améliore la performance de la fonction.",
              "correct": false
            },
            {
              "text": "Il définit la condition d'arrêt et empêche la récursion infinie.",
              "correct": true
            },
            {
              "text": "Il permet de gérer les erreurs de compilation.",
              "correct": false
            },
            {
              "text": "Il initialise les variables locales de la fonction.",
              "correct": false
            }
          ]
        },
        {
          "q": "Considérons la fonction factorielle récursive. Quel est son cas de base ?",
          "explanation": "La factorielle de 0 est définie comme 1. C'est le point où la récursion s'arrête et commence à retourner des valeurs.",
          "options": [
            {
              "text": "factorielle(n) si n est un nombre pair.",
              "correct": false
            },
            {
              "text": "factorielle(0) = 1.",
              "correct": true
            },
            {
              "text": "factorielle(1) = 0.",
              "correct": false
            },
            {
              "text": "factorielle(n) si n est un nombre négatif.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est l'un des principaux avantages de l'utilisation de la récursivité ?",
          "explanation": "Pour certains problèmes (comme les traversées d'arbres ou les algorithmes de division et conquête), la récursivité peut rendre le code plus concis, élégant et facile à comprendre.",
          "options": [
            {
              "text": "Elle garantit toujours une meilleure performance que l'itération.",
              "correct": false
            },
            {
              "text": "Elle réduit la consommation de mémoire de la pile d'appels.",
              "correct": false
            },
            {
              "text": "Elle peut rendre le code plus élégant et plus facile à lire pour certains problèmes.",
              "correct": true
            },
            {
              "text": "Elle élimine le besoin de cas de base.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est un inconvénient majeur de la récursivité par rapport à l'itération ?",
          "explanation": "Chaque appel de fonction récursive ajoute une nouvelle trame à la pile d'appels. Si la profondeur de récursion est trop grande, cela peut entraîner un débordement de pile (stack overflow) et une consommation de mémoire plus élevée.",
          "options": [
            {
              "text": "Elle est toujours plus rapide à exécuter.",
              "correct": false
            },
            {
              "text": "Elle peut entraîner un débordement de pile (stack overflow) pour des problèmes de grande taille.",
              "correct": true
            },
            {
              "text": "Elle est plus difficile à déboguer que les boucles.",
              "correct": false
            },
            {
              "text": "Elle ne peut pas résoudre tous les problèmes que l'itération peut résoudre.",
              "correct": false
            }
          ]
        },
        {
          "q": "Dans quel scénario la récursivité est-elle souvent une approche naturelle et élégante ?",
          "explanation": "Les problèmes qui peuvent être naturellement décomposés en sous-problèmes de même type, comme la traversée de structures de données arborescentes ou graphiques, sont souvent bien adaptés à une solution récursive.",
          "options": [
            {
              "text": "Calculs simples et répétitifs comme la somme d'une série.",
              "correct": false
            },
            {
              "text": "Opérations sur des structures de données linéaires comme des tableaux.",
              "correct": false
            },
            {
              "text": "Problèmes impliquant des structures de données récursives comme les arbres ou les graphes.",
              "correct": true
            },
            {
              "text": "Gestion de bases de données relationnelles.",
              "correct": false
            }
          ]
        },
        {
          "q": "Qu'est-ce que la récursion terminale (tail recursion) ?",
          "explanation": "La récursion terminale est une forme de récursion où l'appel récursif est la dernière opération effectuée par la fonction. Certains compilateurs peuvent optimiser cela en le transformant en itération, évitant ainsi le débordement de pile.",
          "options": [
            {
              "text": "Une récursion qui ne possède pas de cas de base.",
              "correct": false
            },
            {
              "text": "Une récursion où l'appel récursif est la dernière opération effectuée par la fonction.",
              "correct": true
            },
            {
              "text": "Une récursion qui utilise une structure de données de type file (queue).",
              "correct": false
            },
            {
              "text": "Une récursion qui se termine toujours après un nombre fixe d'appels.",
              "correct": false
            }
          ]
        },
        {
          "q": "Comment la pile d'appels (call stack) est-elle affectée par les appels de fonctions récursives ?",
          "explanation": "Chaque appel de fonction récursive ajoute une nouvelle trame (stack frame) à la pile d'appels pour stocker les variables locales et l'adresse de retour. Cela peut consommer beaucoup de mémoire et potentiellement causer un débordement de pile.",
          "options": [
            {
              "text": "La pile d'appels n'est pas utilisée par les fonctions récursives.",
              "correct": false
            },
            {
              "text": "Chaque appel récursif ajoute une nouvelle trame à la pile d'appels.",
              "correct": true
            },
            {
              "text": "La pile d'appels est vidée à chaque appel récursif.",
              "correct": false
            },
            {
              "text": "La pile d'appels est uniquement utilisée pour les fonctions itératives.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle est la principale différence conceptuelle entre une solution itérative et une solution récursive pour un même problème ?",
          "explanation": "L'itération utilise des boucles pour répéter des instructions, tandis que la récursion résout un problème en le décomposant en sous-problèmes identiques et en s'appelant elle-même jusqu'à atteindre un cas de base.",
          "options": [
            {
              "text": "L'itération est toujours plus rapide que la récursion.",
              "correct": false
            },
            {
              "text": "L'itération utilise des boucles, tandis que la récursion utilise des appels de fonction à elle-même.",
              "correct": true
            },
            {
              "text": "La récursion ne peut pas résoudre les problèmes que l'itération peut résoudre.",
              "correct": false
            },
            {
              "text": "L'itération nécessite un cas de base, contrairement à la récursion.",
              "correct": false
            }
          ]
        }
      ],
      "durationLimit": 600
    }
  },
  "references": [
    "Cormen, Thomas H., Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein. 2022. *Introduction to Algorithms*. 4th ed. Cambridge, MA: MIT Press.",
    "Sedgewick, Robert, and Kevin Wayne. 2011. *Algorithms*. 4th ed. Upper Saddle River, NJ: Addison-Wesley Professional.",
    "Wirth, Niklaus. 1976. *Algorithms + Data Structures = Programs*. Englewood Cliffs, NJ: Prentice-Hall.",
    "Knuth, Donald E. 1997. *The Art of Computer Programming, Vol. 1: Fundamental Algorithms*. 3rd ed. Reading, MA: Addison-Wesley.",
    "Aho, Alfred V., John E. Hopcroft, and Jeffrey D. Ullman. 1983. *Data Structures and Algorithms*. Reading, MA: Addison-Wesley.",
    "Goodrich, Michael T., Roberto Tamassia, and Michael H. Goldwasser. 2013. *Data Structures and Algorithms in Python*. Hoboken, NJ: John Wiley & Sons."
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