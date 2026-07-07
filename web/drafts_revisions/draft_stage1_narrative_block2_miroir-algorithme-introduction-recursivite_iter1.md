Ayant établi les principes fondamentaux de la récursivité, à savoir l'importance cruciale du cas de base et la nature de l'appel récursif, nous allons maintenant explorer des exemples algorithmiques classiques. Ces illustrations concrètes permettront de solidifier notre compréhension de la manière dont la récursivité est appliquée pour résoudre des problèmes de manière élégante et concise.

## Exemples Classiques de Récursivité

La récursivité trouve ses applications les plus directes dans des problèmes dont la définition mathématique ou logique est intrinsèquement récursive. Deux des exemples les plus emblématiques sont le calcul de la factorielle d'un nombre et la génération de la suite de Fibonacci.

### La Fonction Factorielle

La factorielle d'un entier naturel `n`, notée `n!`, est le produit de tous les entiers positifs inférieurs ou égaux à `n`. Sa définition mathématique est la suivante :
*   `n! = n × (n-1) × (n-2) × ... × 1` pour `n > 0`
*   `0! = 1` (par convention)

Cette définition peut être reformulée de manière récursive :
*   `n! = 1` si `n = 0` (Cas de base)
*   `n! = n × (n-1)!` si `n > 0` (Appel récursif)

Observons comment cette structure se traduit en code :

```python
def factorielle(n):
    if n == 0:  # Cas de base
        return 1
    else:       # Appel récursif
        return n * factorielle(n - 1)

# Exemple d'utilisation
# print(factorielle(4))
```

Pour comprendre le fonctionnement, traçons l'exécution de `factorielle(4)` :
1.  `factorielle(4)` est appelée. `n` est 4, ce n'est pas le cas de base. Elle retourne `4 * factorielle(3)`.
2.  `factorielle(3)` est appelée. `n` est 3. Elle retourne `3 * factorielle(2)`.
3.  `factorielle(2)` est appelée. `n` est 2. Elle retourne `2 * factorielle(1)`.
4.  `factorielle(1)` est appelée. `n` est 1. Elle retourne `1 * factorielle(0)`.
5.  `factorielle(0)` est appelée. `n` est 0. C'est le cas de base ! Elle retourne `1`.
6.  L'exécution remonte :
    *   `factorielle(1)` reçoit `1` de `factorielle(0)`, calcule `1 * 1 = 1`.
    *   `factorielle(2)` reçoit `1` de `factorielle(1)`, calcule `2 * 1 = 2`.
    *   `factorielle(3)` reçoit `2` de `factorielle(2)`, calcule `3 * 2 = 6`.
    *   `factorielle(4)` reçoit `6` de `factorielle(3)`, calcule `4 * 6 = 24`.
Le résultat final est `24`. Chaque appel récursif (`n-1`) réduit le problème d'une unité, progressant inévitablement vers le cas de base `n=0`.

### La Suite de Fibonacci

La suite de Fibonacci est une séquence d'entiers où chaque nombre est la somme des deux précédents, commençant généralement par 0 et 1. Sa définition est la suivante :
*   `F(0) = 0` (Premier cas de base)
*   `F(1) = 1` (Deuxième cas de base)
*   `F(n) = F(n-1) + F(n-2)` pour `n > 1` (Appel récursif)

Voici son implémentation récursive :

```python
def fibonacci(n):
    if n == 0:  # Premier cas de base
        return 0
    elif n == 1: # Deuxième cas de base
        return 1
    else:       # Appel récursif
        return fibonacci(n - 1) + fibonacci(n - 2)

# Exemple d'utilisation
# print(fibonacci(5))
```

L'exécution de `fibonacci(5)` est plus complexe car elle implique deux appels récursifs pour chaque étape, formant un arbre d'appels :
*   `fibonacci(5)` appelle `fibonacci(4)` et `fibonacci(3)`.
*   `fibonacci(4)` appelle `fibonacci(3)` et `fibonacci(2)`.
*   `fibonacci(3)` appelle `fibonacci(2)` et `fibonacci(1)`.
*   `fibonacci(2)` appelle `fibonacci(1)` et `fibonacci(0)`.
*   `fibonacci(1)` et `fibonacci(0)` sont les cas de base et retournent `1` et `0` respectivement.

Cette structure met en évidence un inconvénient majeur de la récursivité naïve pour Fibonacci : de nombreux calculs sont répétés (par exemple, `fibonacci(3)` est calculé plusieurs fois). Cela conduit à une complexité temporelle exponentielle, ce qui peut être très inefficace pour de grandes valeurs de `n`. Néanmoins, cet exemple illustre parfaitement la puissance expressive de la récursivité pour traduire directement une définition mathématique.

## La Récursivité en Action: Les Tours de Hanoï

Le problème des Tours de Hanoï est un puzzle mathématique ou un jeu de réflexion qui sert d'exemple classique pour illustrer la récursivité. Il a été inventé par le mathématicien français Édouard Lucas en 1883.

### Description du Problème

Le jeu se compose de trois piquets (tiges) et d'un certain nombre de disques de tailles différentes, qui peuvent glisser sur n'importe quel piquet. Au début du jeu, tous les disques sont empilés sur un piquet, par ordre de taille croissant (le plus grand disque en bas, le plus petit en haut), formant une tour conique. L'objectif est de déplacer toute la pile de disques du piquet de départ vers un autre piquet, en respectant les règles suivantes :
1.  Un seul disque peut être déplacé à la fois.
2.  Chaque mouvement consiste à prendre le disque supérieur d'une pile et à le placer sur le dessus d'une autre pile.
3.  Aucun disque ne peut être placé sur un disque plus petit que lui.

### La Solution Récursive

La beauté de ce problème réside dans la simplicité et l'élégance de sa solution récursive. Pour déplacer `n` disques d'un piquet source (A) vers un piquet destination (C), en utilisant un piquet auxiliaire (B), la stratégie est la suivante :

1.  **Cas de base** : Si `n = 1` (un seul disque à déplacer), il suffit de déplacer ce disque directement du piquet source au piquet destination. C'est la tâche la plus simple, résolue directement.

2.  **Appel récursif** : Si `n > 1` :
    a.  Déplacer les `n-1` disques supérieurs du piquet source (A) vers le piquet auxiliaire (B), en utilisant le piquet destination (C) comme auxiliaire temporaire.
    b.  Déplacer le plus grand disque (le `n`-ième disque) restant sur le piquet source (A) vers le piquet destination (C).
    c.  Déplacer les `n-1` disques du piquet auxiliaire (B) vers le piquet destination (C), en utilisant le piquet source (A) comme auxiliaire temporaire.

Cette approche décompose le problème complexe du déplacement de `n` disques en trois sous-problèmes plus petits, dont deux sont des instances du problème original avec `n-1` disques. Chaque appel récursif réduit le nombre de disques à déplacer, nous rapprochant du cas de base.

Voici une implémentation conceptuelle :

```python
def tours_de_hanoi(n, source, destination, auxiliaire):
    if n == 1:  # Cas de base: un seul disque à déplacer
        print(f"Déplacer le disque 1 de {source} à {destination}")
    else:       # Appel récursif
        # Étape 1: Déplacer n-1 disques de la source vers l'auxiliaire
        tours_de_hanoi(n - 1, source, auxiliaire, destination)
        # Étape 2: Déplacer le n-ième disque (le plus grand) de la source vers la destination
        print(f"Déplacer le disque {n} de {source} à {destination}")
        # Étape 3: Déplacer les n-1 disques de l'auxiliaire vers la destination
        tours_de_hanoi(n - 1, auxiliaire, destination, source)

# Exemple d'utilisation pour 3 disques
# tours_de_hanoi(3, 'A', 'C', 'B')
```

Pour `n=3` disques, les étapes seraient les suivantes :
1.  `tours_de_hanoi(3, 'A', 'C', 'B')`
    a.  Appelle `tours_de_hanoi(2, 'A', 'B', 'C')`
        i.  Appelle `tours_de_hanoi(1, 'A', 'C', 'B')` -> Déplacer disque 1 de A à C
        ii. Déplacer disque 2 de A à B
        iii. Appelle `tours_de_hanoi(1, 'C', 'B', 'A')` -> Déplacer disque 1 de C à B
    b.  Déplacer disque 3 de A à C
    c.  Appelle `tours_de_hanoi(2, 'B', 'C', 'A')`
        i.  Appelle `tours_de_hanoi(1, 'B', 'A', 'C')` -> Déplacer disque 1 de B à A
        ii. Déplacer disque 2 de B à C
        iii. Appelle `tours_de_hanoi(1, 'A', 'C', 'B')` -> Déplacer disque 1 de A à C

Cette décomposition montre comment un problème apparemment complexe est résolu par une série de problèmes plus simples du même type, jusqu'à atteindre le cas trivial du déplacement d'un seul disque. La récursivité offre ici une solution d'une clarté et d'une concision remarquables.

[[WIDGET:Mermaid:hanoi_recursive_breakdown]]
mermaid
graph TD
    A[Hanoi(N, A, C, B)] --> B{N == 1?}
    B -- Oui --> C[Déplacer Disque 1 de A à C]
    B -- Non --> D[Hanoi(N-1, A, B, C)]
    D --> E[Déplacer Disque N de A à C]
    E --> F[Hanoi(N-1, B, C, A)]

*Légende: Diagramme de flux illustrant la logique récursive de la résolution des Tours de Hanoï. Le problème de déplacer N disques est décomposé en deux sous-problèmes de déplacement de N-1 disques et un mouvement simple du plus grand disque.*