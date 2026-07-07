You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quel est le principe de l'algorithme de tri à bulles (Bubble Sort) ?",
          "explanation": "Le tri à bulles fonctionne en parcourant la liste plusieurs fois, comparant les éléments adjacents et les échangeant s'ils ne sont pas dans le bon ordre. Les éléments 'plus lourds' (plus grands) 'remontent' progressivement vers la fin de la liste.",
          "options": [
            {
              "text": "Comparer des éléments adjacents et les échanger s'ils sont dans le mauvais ordre, répétant le processus jusqu'à ce que la liste soit triée.",
              "correct": true
            },
            {
              "text": "Trouver le plus petit élément et le placer au début de la liste, puis répéter pour le reste de la liste.",
              "correct": false
            },
            {
              "text": "Diviser la liste en deux, trier chaque moitié, puis fusionner les moitiés triées.",
              "correct": false
            },
            {
              "text": "Insérer chaque élément à sa position correcte dans la partie déjà triée de la liste.",
              "correct": false
            }
          ]
        },
        {
          "q": "Décrivez le fonctionnement de l'algorithme de tri par sélection (Selection Sort).",
          "explanation": "Le tri par sélection parcourt la liste pour trouver l'élément minimum (ou maximum) et le place à la position correcte au début (ou à la fin) de la partie triée de la liste. Ce processus est répété pour le reste de la liste non triée.",
          "options": [
            {
              "text": "Il compare et échange des paires d'éléments adjacents de manière répétée.",
              "correct": false
            },
            {
              "text": "Il divise la liste en sous-listes plus petites, les trie, puis les combine.",
              "correct": false
            },
            {
              "text": "Il trouve le minimum (ou maximum) dans la partie non triée de la liste et l'échange avec le premier élément non trié.",
              "correct": true
            },
            {
              "text": "Il insère chaque élément dans sa position correcte au sein d'une sous-liste déjà triée.",
              "correct": false
            }
          ]
        },
        {
          "q": "Comment fonctionne l'algorithme de tri par insertion (Insertion Sort) ?",
          "explanation": "Le tri par insertion construit la liste triée un élément à la fois. Il prend un élément de la partie non triée et l'insère à sa position correcte dans la partie déjà triée de la liste.",
          "options": [
            {
              "text": "Il échange des éléments adjacents s'ils sont dans le désordre.",
              "correct": false
            },
            {
              "text": "Il sélectionne le plus petit élément restant et le place à la bonne position.",
              "correct": false
            },
            {
              "text": "Il construit la liste triée un élément à la fois en insérant chaque nouvel élément à sa place correcte dans la sous-liste déjà triée.",
              "correct": true
            },
            {
              "text": "Il utilise une approche diviser pour régner pour trier les éléments.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle est la complexité temporelle dans le meilleur des cas pour le tri par insertion (Insertion Sort) ?",
          "explanation": "Dans le meilleur des cas, lorsque la liste est déjà triée, le tri par insertion ne fait que parcourir la liste une fois pour vérifier que chaque élément est à sa place, ce qui donne une complexité de O(n).",
          "options": [
            {
              "text": "O(n^2)",
              "correct": false
            },
            {
              "text": "O(n log n)",
              "correct": false
            },
            {
              "text": "O(n)",
              "correct": true
            },
            {
              "text": "O(1)",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle est la complexité temporelle dans le pire des cas pour le tri à bulles (Bubble Sort) et le tri par sélection (Selection Sort) ?",
          "explanation": "Le tri à bulles et le tri par sélection ont tous deux une complexité temporelle de O(n^2) dans le pire des cas, car ils nécessitent des comparaisons et des échanges (ou des recherches) imbriquées sur la taille de la liste.",
          "options": [
            {
              "text": "O(n log n)",
              "correct": false
            },
            {
              "text": "O(n)",
              "correct": false
            },
            {
              "text": "O(n^2)",
              "correct": true
            },
            {
              "text": "O(log n)",
              "correct": false
            }
          ]
        },
        {
          "q": "Parmi les algorithmes de tri élémentaires suivants, lequel est généralement considéré comme stable ?",
          "explanation": "Un algorithme de tri est stable s'il préserve l'ordre relatif des éléments égaux. Le tri à bulles, s'il est implémenté correctement, peut être stable. Le tri par sélection n'est généralement pas stable. Quick Sort et Heap Sort ne sont pas des tris élémentaires et ne sont pas stables par défaut.",
          "options": [
            {
              "text": "Tri par sélection (Selection Sort)",
              "correct": false
            },
            {
              "text": "Tri à bulles (Bubble Sort)",
              "correct": true
            },
            {
              "text": "Tri rapide (Quick Sort)",
              "correct": false
            },
            {
              "text": "Tri par tas (Heap Sort)",
              "correct": false
            }
          ]
        },
        {
          "q": "Qu'est-ce qu'un algorithme de tri 'in-place' ?",
          "explanation": "Un algorithme de tri 'in-place' (ou 'sur place') est un algorithme qui ne nécessite qu'une quantité constante ou très faible de mémoire auxiliaire, indépendamment de la taille de l'entrée, car il modifie directement le tableau d'entrée.",
          "options": [
            {
              "text": "Un algorithme qui nécessite une quantité significative de mémoire auxiliaire proportionnelle à la taille de l'entrée.",
              "correct": false
            },
            {
              "text": "Un algorithme qui trie les éléments en les plaçant dans un nouveau tableau.",
              "correct": false
            },
            {
              "text": "Un algorithme qui trie les éléments directement dans le tableau d'entrée, sans utiliser beaucoup de mémoire supplémentaire.",
              "correct": true
            },
            {
              "text": "Un algorithme qui trie les éléments en les comparant à une clé externe.",
              "correct": false
            }
          ]
        },
        {
          "q": "Dans quel scénario le tri par insertion (Insertion Sort) est-il particulièrement efficace ?",
          "explanation": "Le tri par insertion est très efficace pour les petites listes ou les listes qui sont déjà presque triées, car sa complexité dans le meilleur des cas est O(n).",
          "options": [
            {
              "text": "Pour de très grandes listes de données non triées.",
              "correct": false
            },
            {
              "text": "Lorsque la liste est presque triée.",
              "correct": true
            },
            {
              "text": "Lorsque la mémoire est une contrainte majeure et que la liste est très grande.",
              "correct": false
            },
            {
              "text": "Pour des données qui doivent être triées en parallèle.",
              "correct": false
            }
          ]
        },
        {
          "q": "Lequel des algorithmes de tri élémentaires (bulle, sélection, insertion) est généralement le plus performant pour des listes de petite taille ?",
          "explanation": "Bien que tous aient une complexité O(n^2) dans le pire des cas, le tri par insertion a souvent de meilleures performances pratiques pour de très petites listes en raison de son faible coût constant et de sa complexité O(n) dans le meilleur des cas.",
          "options": [
            {
              "text": "Tri à bulles",
              "correct": false
            },
            {
              "text": "Tri par sélection",
              "correct": false
            },
            {
              "text": "Tri par insertion",
              "correct": true
            },
            {
              "text": "Ils sont tous équivalents pour les petites tailles.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel algorithme de tri élémentaire minimise le nombre d'échanges (swaps) ?",
          "explanation": "Le tri par sélection minimise le nombre d'échanges car il n'effectue qu'un seul échange par passe (pour placer l'élément minimum à sa position correcte), contrairement au tri à bulles ou au tri par insertion qui peuvent effectuer de nombreux échanges ou décalages.",
          "options": [
            {
              "text": "Tri à bulles",
              "correct": false
            },
            {
              "text": "Tri par sélection",
              "correct": true
            },
            {
              "text": "Tri par insertion",
              "correct": false
            },
            {
              "text": "Aucun, ils effectuent tous un nombre similaire d'échanges.",
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
    "Knuth, Donald E. 1997. The Art of Computer Programming, Vol. 3: Sorting and Searching. 2nd ed. Reading, MA: Addison-Wesley Professional.",
    "Sedgewick, Robert, and Kevin Wayne. 2011. Algorithms. 4th ed. Boston: Addison-Wesley.",
    "Weiss, Mark Allen. 2014. Data Structures and Algorithm Analysis in C++. 4th ed. Boston: Pearson.",
    "Goodrich, Michael T., Roberto Tamassia, and Michael H. Goldwasser. 2014. Data Structures and Algorithms in Java. 6th ed. Hoboken, NJ: Wiley.",
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