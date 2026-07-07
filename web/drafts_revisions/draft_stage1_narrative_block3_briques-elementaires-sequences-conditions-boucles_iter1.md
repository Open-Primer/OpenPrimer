Alors que la boucle `Tant que` excelle dans les scénarios où le nombre d'itérations est indéterminé et dépend d'une condition dynamique, il existe de nombreuses situations où le nombre de répétitions est connu à l'avance ou lorsque nous devons parcourir systématiquement une collection d'éléments. Pour ces cas, la boucle `Pour` (souvent appelée `For` dans de nombreux langages de programmation) est l'outil algorithmique de choix.

## Les boucles 'Pour'

La boucle `Pour` est une structure de contrôle itérative conçue spécifiquement pour exécuter un bloc d'instructions un nombre prédéfini de fois. Elle est idéale pour les tâches qui impliquent :
1.  **Un nombre fixe d'itérations** : Par exemple, répéter une action 10 fois pour générer une série de données.
2.  **L'itération sur une séquence** : Parcourir tous les éléments d'une liste, d'un tableau ou d'une plage de nombres, comme les indices d'un tableau.

Sa structure typique implique une variable de contrôle (ou compteur) qui est initialisée au début, testée avant chaque itération, et mise à jour (généralement incrémentée ou décrémentée) à la fin de chaque passage.

La syntaxe générale en pseudo-code est la suivante :

```
Pour (initialisation du compteur ; condition de continuation ; mise à jour du compteur) Faire
    // Bloc d'instructions à répéter
    Instruction A
    Instruction B
Fin Pour
// L'exécution continue ici
```

Alternativement, pour l'itération sur une plage ou une séquence, on peut trouver une forme simplifiée :

```
Pour chaque élément dans Séquence Faire
    // Bloc d'instructions utilisant l'élément courant
    Instruction C (avec élément)
Fin Pour
```

La distinction fondamentale entre `Pour` et `Tant que` réside dans la gestion de la logique d'itération.
*   La boucle `Tant que` est intrinsèquement conditionnelle : elle continue tant qu'une condition est vraie. L'initialisation et la mise à jour de la variable de contrôle (si elle existe) doivent être gérées explicitement avant et à l'intérieur du corps de la boucle. Elle est plus générale et peut, en théorie, simuler n'importe quelle boucle `Pour`.
*   La boucle `Pour` est itérative par nature : elle regroupe l'initialisation, la condition de continuation et la mise à jour du compteur en une seule ligne de déclaration. Cette concision rend le code plus compact et plus lisible pour les itérations dont le cadre est bien défini. Elle est particulièrement adaptée lorsque l'on sait exactement combien de fois la boucle doit s'exécuter ou sur quelle plage de valeurs.

[[WIDGET:Mermaid:for_loop_flow]]

**Exemple 1 : Somme des N premiers entiers**

Considérons le problème de calculer la somme des N premiers entiers positifs (1 + 2 + ... + N). Le nombre d'itérations est clairement défini par la valeur de N.

```
Algorithme SommeNPremiersEntiers
  Variables : N, i, somme : Entier
  Début
    Afficher "Entrez un entier positif N :"
    Lire N
    somme <- 0 // Initialisation de la somme
    Pour (i <- 1 ; i <= N ; i <- i + 1) Faire
      somme <- somme + i // Ajout de l'entier courant à la somme
    Fin Pour
    Afficher "La somme des ", N, " premiers entiers est : ", somme
  Fin
```

Dans cet exemple :
*   `i <- 1` est l'initialisation du compteur `i`.
*   `i <= N` est la condition de continuation. La boucle s'exécute tant que `i` est inférieur ou égal à `N`.
*   `i <- i + 1` est la mise à jour du compteur, exécutée après chaque itération du corps de la boucle.

**Exemple 2 : Affichage d'une table de multiplication**

Un autre cas d'usage courant est l'affichage d'une table de multiplication pour un nombre donné. Par exemple, la table de 7 de 1 à 10.

```
Algorithme TableDeMultiplication
  Variables : nombre, i : Entier
  Début
    Afficher "Entrez le nombre dont vous voulez la table :"
    Lire nombre
    Pour (i <- 1 ; i <= 10 ; i <- i + 1) Faire
      Afficher nombre, " x ", i, " = ", (nombre * i)
    Fin Pour
  Fin
```

Ici, la boucle `Pour` est parfaitement adaptée car nous savons que nous voulons répéter l'opération de multiplication et d'affichage 10 fois, pour `i` allant de 1 à 10.

La boucle `Pour` est un pilier de la programmation structurée. Maîtriser son utilisation permet d'écrire des algorithmes clairs et efficaces pour des tâches répétitives dont le cadre est bien défini. Elle simplifie la gestion des compteurs et des indices, réduisant ainsi les risques d'erreurs comme les boucles infinies ou les erreurs de bornes (off-by-one errors) qui peuvent survenir plus facilement avec des boucles `Tant que` mal gérées.

## Exercices de conception d'algorithmes

Après avoir exploré les trois piliers fondamentaux de l'algorithmique – les séquences d'instructions, les structures conditionnelles (`Si...Alors...Sinon`) et les boucles (`Tant que`, `Pour`) – il est temps de mettre en pratique ces concepts. La véritable maîtrise de l'algorithmique ne réside pas seulement dans la connaissance de ces briques, mais dans leur capacité à les assembler de manière logique et créative pour résoudre des problèmes concrets.

Ces exercices sont conçus pour vous aider à développer votre pensée algorithmique. L'objectif n'est pas seulement d'obtenir la bonne réponse, mais de comprendre le processus de conception :
1.  **Compréhension du problème** : Qu'est-ce qui est demandé ? Quelles sont les entrées ? Quelles sont les sorties attendues ? Y a-t-il des contraintes ?
2.  **Décomposition** : Comment le problème peut-il être divisé en sous-problèmes plus petits et gérables ?
3.  **Choix des structures** : Quelles briques élémentaires (séquence, condition, boucle) sont les plus appropriées pour chaque partie du problème ?
4.  **Logique de construction** : Comment les briques s'enchaînent-elles ? Comment les variables évoluent-elles ?
5.  **Test** : Pensez à des cas de test simples et complexes pour vérifier la correction de votre algorithme.

Nous vous encourageons à rédiger vos algorithmes en pseudo-code, en vous concentrant sur la logique plutôt que sur les détails syntaxiques d'un langage de programmation spécifique.

**Exercices Pratiques :**

1.  **Détermination du plus grand de trois nombres**
    *   **Problème** : Écrire un algorithme qui lit trois nombres entiers et affiche le plus grand d'entre eux.
    *   **Indices** : Utilisez des structures conditionnelles imbriquées ou une série de comparaisons successives.

2.  **Calcul de la factorielle d'un nombre**
    *   **Problème** : Écrire un algorithme qui demande à l'utilisateur un entier positif `N` et calcule sa factorielle (`N! = 1 * 2 * ... * N`). Si l'utilisateur entre un nombre négatif, l'algorithme doit le lui demander à nouveau jusqu'à ce qu'il saisisse un nombre valide.
    *   **Indices** : Combinez une boucle `Tant que` pour la validation de l'entrée et une boucle `Pour` pour le calcul de la factorielle.

3.  **Vérification de la primalité**
    *   **Problème** : Écrire un algorithme qui demande un entier `N` (supérieur à 1) et détermine s'il est un nombre premier. Un nombre premier est un entier supérieur à 1 qui n'a pas d'autres diviseurs positifs que 1 et lui-même.
    *   **Indices** : Utilisez une boucle `Pour` ou `Tant que` pour tester les diviseurs potentiels. Pensez aux optimisations (par exemple, tester seulement jusqu'à la racine carrée de N).

4.  **Inversion d'une chaîne de caractères**
    *   **Problème** : Écrire un algorithme qui lit une chaîne de caractères et affiche cette chaîne inversée. Par exemple, "Bonjour" doit devenir "ruojnoB".
    *   **Indices** : Considérez la chaîne comme une séquence de caractères. Utilisez une boucle pour parcourir la chaîne de la fin vers le début.

5.  **Calcul de la moyenne d'une série de notes**
    *   **Problème** : Écrire un algorithme qui demande à l'utilisateur de saisir des notes (entre 0 et 20). La saisie s'arrête lorsque l'utilisateur entre une valeur négative. L'algorithme doit ensuite afficher la moyenne de toutes les notes valides saisies.
    *   **Indices** : Utilisez une boucle `Tant que` pour la saisie répétée. Maintenez un compte du nombre de notes et de leur somme. N'oubliez pas de gérer le cas où aucune note valide n'est saisie.

Ces exercices couvrent un éventail de défis qui nécessitent l'application combinée des concepts vus jusqu'à présent. Prenez le temps de les aborder méthodiquement, en dessinant des organigrammes ou en écrivant des brouillons de pseudo-code avant de finaliser votre solution. C'est par la pratique régulière que l'on développe une intuition algorithmique solide.