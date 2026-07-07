You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quelle est la principale différence en termes d'accès aux éléments entre un tableau (array) et une liste chaînée (linked list) ?",
          "explanation": "Les tableaux permettent un accès direct à n'importe quel élément via son index, tandis que les listes chaînées nécessitent de parcourir la liste depuis le début pour atteindre un élément spécifique.",
          "options": [
            {
              "text": "Accès séquentiel pour les deux.",
              "correct": false
            },
            {
              "text": "Accès direct (aléatoire) pour les tableaux, séquentiel pour les listes chaînées.",
              "correct": true
            },
            {
              "text": "Accès direct pour les listes chaînées, séquentiel pour les tableaux.",
              "correct": false
            },
            {
              "text": "Accès direct pour les deux.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle structure de données est généralement plus efficace pour les opérations d'insertion ou de suppression d'éléments au milieu de la collection ?",
          "explanation": "Dans un tableau, l'insertion ou la suppression au milieu nécessite de décaler tous les éléments suivants, ce qui est coûteux (O(n)). Dans une liste chaînée, il suffit de modifier quelques pointeurs (O(1)) une fois l'emplacement trouvé (O(n) pour trouver l'emplacement).",
          "options": [
            {
              "text": "Les tableaux.",
              "correct": false
            },
            {
              "text": "Les listes chaînées.",
              "correct": true
            },
            {
              "text": "Les deux sont également efficaces.",
              "correct": false
            },
            {
              "text": "Cela dépend de la taille de la collection.",
              "correct": false
            }
          ]
        },
        {
          "q": "Comment la mémoire est-elle typiquement allouée pour un tableau par rapport à une liste chaînée ?",
          "explanation": "Un tableau est un bloc de mémoire contigu, tandis qu'une liste chaînée est composée de nœuds dispersés en mémoire, liés par des pointeurs.",
          "options": [
            {
              "text": "Les deux allouent de la mémoire de manière contiguë.",
              "correct": false
            },
            {
              "text": "Les tableaux allouent de la mémoire de manière contiguë, les listes chaînées de manière non contiguë.",
              "correct": true
            },
            {
              "text": "Les listes chaînées allouent de la mémoire de manière contiguë, les tableaux de manière non contiguë.",
              "correct": false
            },
            {
              "text": "La mémoire est allouée dynamiquement pour les deux.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle affirmation est vraie concernant la taille des tableaux et des listes chaînées ?",
          "explanation": "La taille d'un tableau est généralement définie à sa création et ne peut pas être facilement modifiée. Les listes chaînées peuvent croître ou décroître dynamiquement en ajoutant ou supprimant des nœuds.",
          "options": [
            {
              "text": "Les tableaux ont une taille fixe, les listes chaînées ont une taille dynamique.",
              "correct": true
            },
            {
              "text": "Les listes chaînées ont une taille fixe, les tableaux ont une taille dynamique.",
              "correct": false
            },
            {
              "text": "Les deux ont une taille fixe.",
              "correct": false
            },
            {
              "text": "Les deux ont une taille dynamique.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle structure de données a un coût mémoire supplémentaire par élément pour stocker des pointeurs ?",
          "explanation": "Chaque nœud d'une liste chaînée contient non seulement la donnée, mais aussi un ou plusieurs pointeurs vers le(s) nœud(s) suivant(s) (et précédent(s) pour les listes doublement chaînées), ce qui représente un surcoût mémoire par rapport à un tableau qui ne stocke que les données.",
          "options": [
            {
              "text": "Les tableaux.",
              "correct": false
            },
            {
              "text": "Les listes chaînées.",
              "correct": true
            },
            {
              "text": "Les deux.",
              "correct": false
            },
            {
              "text": "Aucune des deux.",
              "correct": false
            }
          ]
        },
        {
          "q": "Dans une liste doublement chaînée, chaque nœud contient des pointeurs vers quels autres nœuds ?",
          "explanation": "Une liste doublement chaînée permet de parcourir la liste dans les deux sens (avant et arrière) car chaque nœud a un pointeur vers le suivant et un pointeur vers le précédent.",
          "options": [
            {
              "text": "Uniquement le nœud suivant.",
              "correct": false
            },
            {
              "text": "Uniquement le nœud précédent.",
              "correct": false
            },
            {
              "text": "Le nœud suivant et le nœud précédent.",
              "correct": true
            },
            {
              "text": "Le premier et le dernier nœud de la liste.",
              "correct": false
            }
          ]
        },
        {
          "q": "Pour implémenter une file d'attente (queue) où les insertions se font à la fin et les suppressions au début, quelle structure de données est la plus appropriée pour une performance optimale ?",
          "explanation": "Une liste chaînée simple permet des insertions en O(1) à la fin (si on maintient un pointeur vers la queue) et des suppressions en O(1) au début, ce qui est idéal pour une file d'attente. Un tableau dynamique peut être efficace mais les opérations de redimensionnement peuvent être coûteuses.",
          "options": [
            {
              "text": "Un tableau statique.",
              "correct": false
            },
            {
              "text": "Un tableau dynamique (redimensionnable).",
              "correct": false
            },
            {
              "text": "Une liste chaînée simple.",
              "correct": true
            },
            {
              "text": "Une liste doublement chaînée.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle est la complexité temporelle pour accéder à un élément arbitraire dans un tableau par son index ?",
          "explanation": "L'accès à un élément dans un tableau par son index est une opération à temps constant, car l'adresse mémoire de l'élément peut être calculée directement.",
          "options": [
            {
              "text": "O(n)",
              "correct": false
            },
            {
              "text": "O(log n)",
              "correct": false
            },
            {
              "text": "O(1)",
              "correct": true
            },
            {
              "text": "O(n log n)",
              "correct": false
            }
          ]
        },
        {
          "q": "Dans quel scénario l'utilisation d'un tableau est-elle généralement préférable à celle d'une liste chaînée ?",
          "explanation": "Les tableaux excellent pour l'accès direct (O(1)) et sont plus efficaces en mémoire si la taille est connue et fixe, car ils n'ont pas le surcoût des pointeurs.",
          "options": [
            {
              "text": "Lorsque le nombre d'éléments est très variable et que les insertions/suppressions sont fréquentes.",
              "correct": false
            },
            {
              "text": "Lorsque l'accès aléatoire aux éléments est fréquent et que la taille de la collection est relativement fixe.",
              "correct": true
            },
            {
              "text": "Lorsque la mémoire disponible est très limitée et que chaque octet compte.",
              "correct": false
            },
            {
              "text": "Lorsque l'ordre des éléments n'a pas d'importance.",
              "correct": false
            }
          ]
        },
        {
          "q": "Dans quel scénario l'utilisation d'une liste chaînée est-elle généralement préférable à celle d'un tableau ?",
          "explanation": "Les listes chaînées sont plus performantes pour les insertions et suppressions car elles ne nécessitent pas de décalage d'éléments.",
          "options": [
            {
              "text": "Lorsque les données doivent être stockées de manière contiguë en mémoire.",
              "correct": false
            },
            {
              "text": "Lorsque les opérations de recherche par index sont primordiales.",
              "correct": false
            },
            {
              "text": "Lorsque les insertions et suppressions fréquentes sont nécessaires, surtout au milieu de la collection.",
              "correct": true
            },
            {
              "text": "Lorsque la taille maximale de la collection est connue à l'avance et ne change pas.",
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
    "Sedgewick, Robert, and Kevin Wayne. 2011. Algorithms. 4th ed. Boston: Addison-Wesley.",
    "Knuth, Donald E. 1997. The Art of Computer Programming, Vol. 1: Fundamental Algorithms. 3rd ed. Reading, MA: Addison-Wesley.",
    "Goodrich, Michael T., Roberto Tamassia, and Michael H. Goldwasser. 2014. Data Structures and Algorithms in Java. 6th ed. Hoboken, NJ: John Wiley & Sons.",
    "Wirth, Niklaus. 1986. Algorithms & Data Structures. Englewood Cliffs, NJ: Prentice-Hall.",
    "Aho, Alfred V., John E. Hopcroft, and Jeffrey D. Ullman. 1983. Data Structures and Algorithms. Reading, MA: Addison-Wesley."
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