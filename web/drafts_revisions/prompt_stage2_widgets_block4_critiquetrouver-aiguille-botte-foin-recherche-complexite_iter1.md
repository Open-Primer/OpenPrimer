You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Qu'est-ce que la complexité algorithmique mesure principalement ?",
          "explanation": "La complexité algorithmique évalue l'efficacité d'un algorithme en termes de ressources (temps et espace mémoire) qu'il consomme en fonction de la taille de l'entrée.",
          "options": [
            {
              "text": "La beauté du code.",
              "correct": false
            },
            {
              "text": "La quantité de mémoire et de temps nécessaire à l'exécution d'un algorithme.",
              "correct": true
            },
            {
              "text": "Le nombre de lignes de code.",
              "correct": false
            },
            {
              "text": "La popularité de l'algorithme.",
              "correct": false
            }
          ]
        },
        {
          "q": "La notation Grand O (O) est utilisée pour décrire quoi ?",
          "explanation": "La notation Grand O fournit une borne supérieure asymptotique sur le temps d'exécution ou l'espace mémoire requis par un algorithme, décrivant son comportement dans le pire des cas.",
          "options": [
            {
              "text": "La borne inférieure de la complexité d'un algorithme.",
              "correct": false
            },
            {
              "text": "La complexité exacte d'un algorithme.",
              "correct": false
            },
            {
              "text": "La borne supérieure de la complexité d'un algorithme dans le pire des cas.",
              "correct": true
            },
            {
              "text": "La complexité moyenne d'un algorithme.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle est la complexité temporelle dans le pire des cas pour une recherche linéaire dans un tableau de `n` éléments ?",
          "explanation": "Dans le pire des cas, la recherche linéaire doit parcourir tous les `n` éléments du tableau pour trouver l'élément ou déterminer qu'il n'est pas présent.",
          "options": [
            {
              "text": "O(1)",
              "correct": false
            },
            {
              "text": "O(log n)",
              "correct": false
            },
            {
              "text": "O(n)",
              "correct": true
            },
            {
              "text": "O(n^2)",
              "correct": false
            }
          ]
        },
        {
          "q": "Pour qu'une recherche binaire soit efficace, quelle condition doit être remplie par le tableau de données ?",
          "explanation": "La recherche binaire fonctionne en divisant le tableau en deux à chaque étape, ce qui n'est possible et efficace que si le tableau est préalablement trié.",
          "options": [
            {
              "text": "Le tableau doit contenir uniquement des nombres entiers.",
              "correct": false
            },
            {
              "text": "Le tableau doit être trié.",
              "correct": true
            },
            {
              "text": "Le tableau doit être vide.",
              "correct": false
            },
            {
              "text": "Le tableau doit être de petite taille.",
              "correct": false
            }
          ]
        },
        {
          "q": "Un algorithme avec une complexité temporelle de O(log n) signifie que son temps d'exécution :",
          "explanation": "La complexité logarithmique indique que le temps d'exécution augmente très lentement, car le nombre d'opérations est proportionnel au logarithme de la taille de l'entrée, typique des algorithmes qui divisent le problème en sous-problèmes.",
          "options": [
            {
              "text": "Augmente linéairement avec la taille de l'entrée.",
              "correct": false
            },
            {
              "text": "Diminue à mesure que la taille de l'entrée augmente.",
              "correct": false
            },
            {
              "text": "Augmente très lentement à mesure que la taille de l'entrée augmente.",
              "correct": true
            },
            {
              "text": "Est constant quelle que soit la taille de l'entrée.",
              "correct": false
            }
          ]
        },
        {
          "q": "Qu'est-ce que la complexité spatiale d'un algorithme mesure ?",
          "explanation": "La complexité spatiale mesure la quantité de mémoire (hors entrée) qu'un algorithme utilise pour son exécution en fonction de la taille de l'entrée.",
          "options": [
            {
              "text": "Le temps nécessaire à l'algorithme pour s'exécuter.",
              "correct": false
            },
            {
              "text": "La quantité de mémoire auxiliaire utilisée par l'algorithme.",
              "correct": true
            },
            {
              "text": "Le nombre de lignes de code de l'algorithme.",
              "correct": false
            },
            {
              "text": "La difficulté de comprendre l'algorithme.",
              "correct": false
            }
          ]
        },
        {
          "q": "Le 'cas moyen' de la complexité algorithmique décrit :",
          "explanation": "Le cas moyen analyse la performance de l'algorithme sur une distribution d'entrées représentatives, souvent plus réaliste que le pire des cas.",
          "options": [
            {
              "text": "La performance de l'algorithme sur une entrée spécifique.",
              "correct": false
            },
            {
              "text": "La performance de l'algorithme dans le pire des scénarios.",
              "correct": false
            },
            {
              "text": "La performance attendue de l'algorithme sur une distribution d'entrées typiques.",
              "correct": true
            },
            {
              "text": "La performance de l'algorithme dans le meilleur des scénarios.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est l'algorithme de recherche le plus approprié pour trouver un élément dans un tableau non trié ?",
          "explanation": "La recherche linéaire est le seul algorithme de recherche simple qui fonctionne directement sur un tableau non trié, car elle ne dépend pas de l'ordre des éléments.",
          "options": [
            {
              "text": "Recherche binaire.",
              "correct": false
            },
            {
              "text": "Recherche par interpolation.",
              "correct": false
            },
            {
              "text": "Recherche linéaire.",
              "correct": true
            },
            {
              "text": "Recherche par hachage (si la structure de hachage n'est pas déjà construite).",
              "correct": false
            }
          ]
        },
        {
          "q": "Un algorithme de complexité O(n^2) est considéré comme ayant une complexité :",
          "explanation": "Une complexité polynomiale est de la forme O(n^k) où k est une constante positive. O(n^2) en est un exemple. Les complexités exponentielles sont de la forme O(k^n).",
          "options": [
            {
              "text": "Logarithmique.",
              "correct": false
            },
            {
              "text": "Linéaire.",
              "correct": false
            },
            {
              "text": "Polynomiale.",
              "correct": true
            },
            {
              "text": "Exponentielle.",
              "correct": false
            }
          ]
        },
        {
          "q": "Si un algorithme a une complexité O(n), et que la taille de l'entrée `n` double, comment le temps d'exécution est-il affecté ?",
          "explanation": "Pour une complexité linéaire O(n), le temps d'exécution est directement proportionnel à la taille de l'entrée. Si `n` double, le temps d'exécution double également.",
          "options": [
            {
              "text": "Il reste le même.",
              "correct": false
            },
            {
              "text": "Il est multiplié par 4.",
              "correct": false
            },
            {
              "text": "Il double.",
              "correct": true
            },
            {
              "text": "Il est divisé par 2.",
              "correct": false
            }
          ]
        }
      ],
      "durationLimit": 600
    }
  },
  "references": [
    "Cormen, Thomas H., Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein. 2009. Introduction to Algorithms. 3rd ed. Cambridge, MA: MIT Press.",
    "Knuth, Donald E. 1997. The Art of Computer Programming, Vol. 3: Sorting and Searching. 2nd ed. Reading, MA: Addison-Wesley.",
    "Sedgewick, Robert, and Kevin Wayne. 2011. Algorithms. 4th ed. Boston: Addison-Wesley.",
    "Aho, Alfred V., John E. Hopcroft, and Jeffrey D. Ullman. 1974. The Design and Analysis of Computer Algorithms. Reading, MA: Addison-Wesley.",
    "Goodrich, Michael T., and Roberto Tamassia. 2014. Algorithm Design: Foundations, Analysis, and Internet Examples. 2nd ed. Hoboken, NJ: John Wiley & Sons.",
    "Skiena, Steven S. 2008. The Algorithm Design Manual. 2nd ed. London: Springer.",
    "Garey, Michael R., and David S. Johnson. 1979. Computers and Intractability: A Guide to the Theory of NP-Completeness. New York: W. H. Freeman."
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