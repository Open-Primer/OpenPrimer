## Le Tri par Insertion

Le tri par insertion est un algorithme de tri simple qui construit la liste finale triée (ou le tableau) un élément à la fois. Son principe est analogue à la manière dont un joueur de cartes trie les cartes dans sa main : il prend une carte à la fois et l'insère à sa position correcte parmi les cartes déjà triées. L'algorithme parcourt le tableau d'entrée, en considérant chaque élément comme une "clé" à insérer dans la sous-liste déjà triée qui le précède.

Concrètement, l'algorithme divise le tableau en deux parties : une partie gauche déjà triée et une partie droite non triée. Initialement, la partie triée ne contient que le premier élément (considéré comme trié par définition). Pour chaque élément de la partie non triée, il est extrait, puis comparé aux éléments de la partie triée en partant de la droite. Tous les éléments de la partie triée qui sont plus grands que l'élément à insérer sont décalés d'une position vers la droite pour faire de la place. Une fois la position correcte trouvée, l'élément est inséré. Ce processus est répété jusqu'à ce que tous les éléments aient été insérés dans la partie triée.

### Pseudo-code du Tri par Insertion

Voici le pseudo-code détaillé de l'algorithme de tri par insertion. Il opère directement sur le tableau `A` de taille `n`.

```
ALGORITHME TriParInsertion(A, n)
  // A: tableau d'éléments à trier
  // n: nombre d'éléments dans le tableau A

  POUR i DE 1 À n-1 FAIRE
    // Stocker l'élément courant à insérer
    clé = A[i]
    // Initialiser j à l'indice de l'élément précédent
    j = i - 1

    // Décaler les éléments de A[0...i-1] qui sont plus grands que clé,
    // d'une position vers la droite
    TANT QUE j >= 0 ET A[j] > clé FAIRE
      A[j+1] = A[j]
      j = j - 1
    FIN TANT QUE

    // Insérer la clé à sa position correcte
    A[j+1] = clé
  FIN POUR
FIN ALGORITHME
```

[[WIDGET:Mermaid:insertion_sort_flowchart]]
*Figure 1: Diagramme de flux du Tri par Insertion.*

### Exemple Pas à Pas du Tri par Insertion

Considérons le tableau `A = [5, 2, 4, 6, 1, 3]` à trier en ordre croissant.

| Itération `i` | `clé` | `j` initial | Condition `j >= 0 et A[j] > clé` | Action | Tableau `A` |
| :----------- | :--- | :---------- | :------------------------------- | :----- | :------------------ |
| **Initial** | - | - | - | - | `[5, 2, 4, 6, 1, 3]` |
| **`i = 1`** | `2` | `0` | `A[0]` (`5`) > `2` (Vrai) | `A[1] = A[0]` (`5`), `j = -1` | `[5, 5, 4, 6, 1, 3]` |
| | | `-1` | `j >= 0` (Faux) | `A[0] = clé` (`2`) | `[2, 5, 4, 6, 1, 3]` |
| **`i = 2`** | `4` | `1` | `A[1]` (`5`) > `4` (Vrai) | `A[2] = A[1]` (`5`), `j = 0` | `[2, 5, 5, 6, 1, 3]` |
| | | `0` | `A[0]` (`2`) > `4` (Faux) | `A[1] = clé` (`4`) | `[2, 4, 5, 6, 1, 3]` |
| **`i = 3`** | `6` | `2` | `A[2]` (`5`) > `6` (Faux) | `A[3] = clé` (`6`) | `[2, 4, 5, 6, 1, 3]` |
| **`i = 4`** | `1` | `3` | `A[3]` (`6`) > `1` (Vrai) | `A[4] = A[3]` (`6`), `j = 2` | `[2, 4, 5, 6, 6, 3]` |
| | | `2` | `A[2]` (`5`) > `1` (Vrai) | `A[3] = A[2]` (`5`), `j = 1` | `[2, 4, 5, 5, 6, 3]` |
| | | `1` | `A[1]` (`4`) > `1` (Vrai) | `A[2] = A[1]` (`4`), `j = 0` | `[2, 4, 4, 5, 6, 3]` |
| | | `0` | `A[0]` (`2`) > `1` (Vrai) | `A[1] = A[0]` (`2`), `j = -1` | `[2, 2, 4, 5, 6, 3]` |
| | | `-1` | `j >= 0` (Faux) | `A[0] = clé` (`1`) | `[1, 2, 4, 5, 6, 3]` |
| **`i = 5`** | `3` | `4` | `A[4]` (`6`) > `3` (Vrai) | `A[5] = A[4]` (`6`), `j = 3` | `[1, 2, 4, 5, 6, 6]` |
| | | `3` | `A[3]` (`5`) > `3` (Vrai) | `A[4] = A[3]` (`5`), `j = 2` | `[1, 2, 4, 5, 5, 6]` |
| | | `2` | `A[2]` (`4`) > `3` (Vrai) | `A[3] = A[2]` (`4`), `j = 1` | `[1, 2, 4, 4, 5, 6]` |
| | | `1` | `A[1]` (`2`) > `3` (Faux) | `A[2] = clé` (`3`) | `[1, 2, 3, 4, 5, 6]` |
| **Final** | - | - | - | Le tableau est trié. | `[1, 2, 3, 4, 5, 6]` |

Le tri par insertion est particulièrement efficace pour les petits tableaux ou les tableaux qui sont déjà partiellement triés. Il est également un algorithme de tri en place, ce qui signifie qu'il ne nécessite qu'une quantité minimale de mémoire auxiliaire.

## Le Tri à Bulles

Le tri à bulles est un autre algorithme de tri simple, souvent enseigné pour sa facilité de compréhension, bien qu'il soit généralement inefficace pour les grands ensembles de données. Son nom provient du fait que les éléments les plus grands "remontent" progressivement vers la fin du tableau, comme des bulles dans l'eau.

Le principe du tri à bulles repose sur des comparaisons et des échanges répétés d'éléments adjacents. L'algorithme parcourt le tableau plusieurs fois. À chaque passage, il compare chaque paire d'éléments adjacents et les échange s'ils sont dans le mauvais ordre (par exemple, si le premier est plus grand que le second pour un tri croissant). Ce processus garantit qu'à la fin de chaque passage complet, le plus grand élément non encore trié se trouve à sa position finale correcte à la fin de la partie non triée du tableau. Les passages sont répétés jusqu'à ce qu'aucun échange ne soit effectué pendant un passage, ce qui indique que le tableau est entièrement trié. Une optimisation courante consiste à réduire la taille de la partie à parcourir à chaque passage, car les derniers éléments sont déjà triés.

### Pseudo-code du Tri à Bulles

Voici le pseudo-code détaillé de l'algorithme de tri à bulles. Il opère directement sur le tableau `A` de taille `n`.

```
ALGORITHME TriABulles(A, n)
  // A: tableau d'éléments à trier
  // n: nombre d'éléments dans le tableau A

  POUR i DE 0 À n-2 FAIRE
    // Indicateur pour détecter si des échanges ont eu lieu pendant ce passage
    echangesEffectues = FAUX

    // Parcourir le tableau de 0 à n-2-i
    // Les i derniers éléments sont déjà à leur place finale
    POUR j DE 0 À n-2-i FAIRE
      // Comparer les éléments adjacents
      SI A[j] > A[j+1] ALORS
        // Échanger A[j] et A[j+1]
        temp = A[j]
        A[j] = A[j+1]
        A[j+1] = temp
        echangesEffectues = VRAI
      FIN SI
    FIN POUR

    // Si aucun échange n'a été effectué pendant ce passage,
    // le tableau est trié et nous pouvons sortir
    SI echangesEffectues == FAUX ALORS
      SORTIR
    FIN SI
  FIN POUR
FIN ALGORITHME
```

### Exemple Pas à Pas du Tri à Bulles

Considérons le tableau `A = [5, 1, 4, 2, 8]` à trier en ordre croissant.

| Passage `i` | `j` | Comparaison `A[j]` vs `A[j+1]` | Échange ? | Tableau `A` (après échange) | `echangesEffectues` |
| :---------- | :-- | :------------------------------ | :-------- | :-------------------------- | :------------------ |
| **Initial** | - | - | - | `[5, 1, 4, 2, 8]` | - |
| **`i = 0`** | | | | | `FAUX` |
| | `0` | `5` vs `1` (`5 > 1`) | Oui | `[1, 5, 4, 2, 8]` | `VRAI` |
| | `1` | `5` vs `4` (`5 > 4`) | Oui | `[1, 4, 5, 2, 8]` | `VRAI` |
| | `2` | `5` vs `2` (`5 > 2`) | Oui | `[1, 4, 2, 5, 8]` | `VRAI` |
| | `3` | `5` vs `8` (`5 > 8`) | Non | `[1, 4, 2, 5, 8]` | `VRAI` |
| | **Fin boucle `j`** | | | | `VRAI` (continue) |
| **`i = 1`** | | | | | `FAUX` |
| | `0` | `1` vs `4` (`1 > 4`) | Non | `[1, 4, 2, 5, 8]` | `FAUX` |
| | `1` | `4` vs `2` (`4 > 2`) | Oui | `[1, 2, 4, 5, 8]` | `VRAI` |
| | `2` | `4` vs `5` (`4 > 5`) | Non | `[1, 2, 4, 5, 8]` | `VRAI` |
| | **Fin boucle `j`** | | | | `VRAI` (continue) |
| **`i = 2`** | | | | | `FAUX` |
| | `0` | `1` vs `2` (`1 > 2`) | Non | `[1, 2, 4, 5, 8]` | `FAUX` |
| | `1` | `2` vs `4` (`2 > 4`) | Non | `[1, 2, 4, 5, 8]` | `FAUX` |
| | **Fin boucle `j`** | | | | `FAUX` (sortir) |
| **Final** | - | - | - | `[1, 2, 4, 5, 8]` | Le tableau est trié. |

Dans cet exemple, après le deuxième passage (`i=1`), le tableau est déjà trié. Le troisième passage (`i=2`) ne trouve aucun échange, ce qui permet à l'algorithme de détecter que le tableau est trié et de s'arrêter prématurément, évitant ainsi des comparaisons inutiles. Le tri à bulles est un algorithme de tri en place. Sa simplicité est son principal avantage pédagogique, mais sa complexité en temps quadratique le rend peu pratique pour les grands volumes de données.