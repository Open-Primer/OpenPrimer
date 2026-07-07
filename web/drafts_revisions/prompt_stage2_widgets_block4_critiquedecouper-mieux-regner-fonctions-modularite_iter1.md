You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Qu'est-ce qu'une fonction en programmation ?",
          "explanation": "Une fonction est une séquence d'instructions regroupées pour accomplir une tâche précise, favorisant la réutilisation du code et la modularité.",
          "options": [
            {
              "text": "Un type de variable pour stocker des données.",
              "correct": false
            },
            {
              "text": "Un bloc de code réutilisable qui effectue une tâche spécifique.",
              "correct": true
            },
            {
              "text": "Une instruction de boucle pour répéter des actions.",
              "correct": false
            },
            {
              "text": "Un commentaire dans le code pour expliquer son fonctionnement.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est l'un des principaux avantages de la modularité en programmation ?",
          "explanation": "La modularité permet de diviser un programme en petites unités indépendantes, ce qui simplifie la compréhension, la modification et la correction des erreurs, ainsi que la collaboration.",
          "options": [
            {
              "text": "Rendre le code plus long et complexe.",
              "correct": false
            },
            {
              "text": "Diminuer la lisibilité du code.",
              "correct": false
            },
            {
              "text": "Faciliter la maintenance, le débogage et la réutilisation du code.",
              "correct": true
            },
            {
              "text": "Augmenter le temps d'exécution du programme.",
              "correct": false
            }
          ]
        },
        {
          "q": "Dans l'appel de fonction `calculerSomme(a, b)`, que représentent `a` et `b` ?",
          "explanation": "Les arguments (ou paramètres effectifs) sont les valeurs passées à une fonction lors de son appel, tandis que les paramètres formels sont les variables définies dans la signature de la fonction pour recevoir ces valeurs.",
          "options": [
            {
              "text": "Les variables globales.",
              "correct": false
            },
            {
              "text": "Les paramètres formels.",
              "correct": false
            },
            {
              "text": "Les arguments (ou paramètres effectifs).",
              "correct": true
            },
            {
              "text": "Les valeurs de retour de la fonction.",
              "correct": false
            }
          ]
        },
        {
          "q": "Une fonction doit-elle toujours retourner une valeur ?",
          "explanation": "Non, certaines fonctions (souvent appelées procédures ou routines) effectuent des actions sans produire de résultat direct à retourner, comme afficher un message ou modifier l'état d'un objet. Elles peuvent retourner 'void' ou rien du tout.",
          "options": [
            {
              "text": "Oui, toujours, c'est obligatoire.",
              "correct": false
            },
            {
              "text": "Non, cela dépend de la tâche qu'elle effectue.",
              "correct": true
            },
            {
              "text": "Seulement si elle prend des paramètres.",
              "correct": false
            },
            {
              "text": "Seulement si elle est appelée depuis la fonction principale.",
              "correct": false
            }
          ]
        },
        {
          "q": "Qu'est-ce qu'une variable locale à une fonction ?",
          "explanation": "Une variable locale n'existe et n'est accessible qu'à l'intérieur du bloc de code (la fonction) où elle a été définie. Sa durée de vie est limitée à l'exécution de cette fonction.",
          "options": [
            {
              "text": "Une variable accessible depuis n'importe où dans le programme.",
              "correct": false
            },
            {
              "text": "Une variable dont la portée est limitée à la fonction où elle est déclarée.",
              "correct": true
            },
            {
              "text": "Une variable qui conserve sa valeur entre les appels de fonction.",
              "correct": false
            },
            {
              "text": "Une variable partagée entre toutes les fonctions du programme.",
              "correct": false
            }
          ]
        },
        {
          "q": "Le principe de 'décomposition fonctionnelle' consiste à :",
          "explanation": "La décomposition fonctionnelle est une stratégie de conception qui vise à simplifier un problème complexe en le subdivisant en sous-problèmes plus petits et gérables, chacun pouvant être résolu par une fonction ou un module indépendant.",
          "options": [
            {
              "text": "Écrire tout le code dans une seule fonction principale pour plus de simplicité.",
              "correct": false
            },
            {
              "text": "Diviser un problème complexe en sous-problèmes plus petits et gérables, chacun résolu par une fonction.",
              "correct": true
            },
            {
              "text": "Utiliser uniquement des variables globales pour faciliter l'accès aux données.",
              "correct": false
            },
            {
              "text": "Ignorer la réutilisation du code pour des raisons de performance.",
              "correct": false
            }
          ]
        },
        {
          "q": "Comment les fonctions contribuent-elles à la réutilisabilité du code ?",
          "explanation": "Une fois qu'une fonction est définie, elle peut être appelée plusieurs fois dans le même programme ou même dans d'autres programmes, évitant ainsi la duplication de code et rendant le développement plus efficace.",
          "options": [
            {
              "text": "En forçant la réécriture du même code plusieurs fois pour des raisons de sécurité.",
              "correct": false
            },
            {
              "text": "En permettant d'appeler le même bloc de code depuis différents endroits du programme.",
              "correct": true
            },
            {
              "text": "En rendant le code plus difficile à comprendre, ce qui décourage la copie.",
              "correct": false
            },
            {
              "text": "En limitant l'utilisation des variables, ce qui simplifie le code.",
              "correct": false
            }
          ]
        },
        {
          "q": "Qu'est-ce qu'un 'effet de bord' (side effect) d'une fonction ?",
          "explanation": "Un effet de bord se produit lorsqu'une fonction modifie un état observable en dehors de sa portée locale, comme la modification d'une variable globale, l'écriture dans un fichier, l'affichage sur la console ou la modification d'une structure de données passée par référence.",
          "options": [
            {
              "text": "Le retour d'une valeur par la fonction.",
              "correct": false
            },
            {
              "text": "Une modification de l'état du programme en dehors de la fonction (ex: modification d'une variable globale, affichage à l'écran).",
              "correct": true
            },
            {
              "text": "Une erreur de compilation qui empêche le programme de s'exécuter.",
              "correct": false
            },
            {
              "text": "L'appel d'une autre fonction à l'intérieur de la fonction courante.",
              "correct": false
            }
          ]
        },
        {
          "q": "Comparé à un programme monolithique (tout dans un seul bloc), un programme modulaire est généralement :",
          "explanation": "La division en modules rend le code plus gérable, chaque module pouvant être testé, développé et débogué indépendamment, ce qui facilite la compréhension et la maintenance globale du système.",
          "options": [
            {
              "text": "Plus difficile à tester et à déboguer.",
              "correct": false
            },
            {
              "text": "Plus facile à comprendre et à maintenir.",
              "correct": true
            },
            {
              "text": "Plus rapide à développer initialement pour des projets complexes.",
              "correct": false
            },
            {
              "text": "Moins performant en exécution en raison des appels de fonctions supplémentaires.",
              "correct": false
            }
          ]
        },
        {
          "q": "Si une fonction reçoit une copie de la valeur d'une variable (passage par valeur), que se passe-t-il si la fonction modifie cette valeur ?",
          "explanation": "En passage par valeur, la fonction travaille sur une copie de l'argument. Toute modification de cette copie n'affecte pas la variable originale en dehors de la fonction, car elles sont indépendantes.",
          "options": [
            {
              "text": "La variable originale est également modifiée.",
              "correct": false
            },
            {
              "text": "Seule la copie à l'intérieur de la fonction est modifiée, la variable originale reste inchangée.",
              "correct": true
            },
            {
              "text": "Le programme génère une erreur de compilation.",
              "correct": false
            },
            {
              "text": "La fonction ne peut pas modifier la valeur car elle est en lecture seule.",
              "correct": false
            }
          ]
        }
      ],
      "durationLimit": 900
    }
  },
  "references": [
    "Knuth, Donald E. 1997. The Art of Computer Programming, Volume 1: Fundamental Algorithms. 3rd ed. Reading, MA: Addison-Wesley.",
    "Pressman, Roger S., and Bruce R. Maxim. 2020. Software Engineering: A Practitioner's Approach. 9th ed. New York: McGraw-Hill Education.",
    "Deitel, Paul, and Harvey Deitel. 2018. C++ How to Program. 10th ed. Boston: Pearson.",
    "Cormen, Thomas H., Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein. 2009. Introduction to Algorithms. 3rd ed. Cambridge, MA: MIT Press.",
    "Dijkstra, Edsger W. 1976. A Discipline of Programming. Englewood Cliffs, NJ: Prentice-Hall.",
    "Wirth, Niklaus. 1976. Algorithms + Data Structures = Programs. Englewood Cliffs, NJ: Prentice-Hall."
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