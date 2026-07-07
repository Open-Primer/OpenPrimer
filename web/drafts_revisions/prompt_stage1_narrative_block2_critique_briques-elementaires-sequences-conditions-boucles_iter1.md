You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
La séquence est la base de tout algorithme. Même les algorithmes les plus complexes, qui intègrent des conditions et des boucles, sont fondamentalement des assemblages de séquences. Chaque bloc d'instructions à l'intérieur d'une condition ou d'une boucle est lui-même une séquence. La compréhension approfondie de cette structure élémentaire est donc indispensable avant de pouvoir aborder des concepts plus avancés de contrôle de flux. Elle garantit que les opérations sont effectuées dans un ordre logique et prévisible, ce qui est la pierre angulaire de la fiabilité de tout système informatique.

## Les structures conditionnelles (Si-Alors-Sinon)

Si les algorithmes séquentiels sont suffisants pour des tâches linéaires et prévisibles, la plupart des problèmes du monde réel exigent une capacité de prise de décision. Un algorithme doit souvent adapter son comportement en fonction de l'état des données ou de certaines conditions rencontrées lors de son exécution. C'est là qu'interviennent les structures conditionnelles, permettant à un algorithme de choisir quelle séquence d'instructions exécuter. Elles introduisent une bifurcation dans le flux d'exécution, rendant les algorithmes dynamiques et réactifs.

La forme la plus simple de structure conditionnelle est le "Si-Alors" (ou If-Then en anglais). Elle permet d'exécuter un bloc d'instructions *seulement si* une certaine condition est vraie. Si la condition est fausse, le bloc d'instructions est simplement ignoré, et l'exécution se poursuit avec l'instruction suivante après la structure conditionnelle.

En pseudo-code, cela se présente comme suit :


Si (condition est vraie) Alors
    // Bloc d'instructions à exécuter
    Instruction A
    Instruction B
Fin Si
// L'exécution continue ici


**Exemple simple de "Si-Alors" :**
Imaginons un algorithme qui affiche un message de bienvenue uniquement si l'utilisateur est majeur.


Algorithme VérifierMajeur
  Variables : age : Entier
  Début
    Afficher "Quel est votre âge ?"
    Lire age
    Si (age >= 18) Alors
      Afficher "Bienvenue sur notre plateforme !"
    Fin Si
    Afficher "Fin du programme."
  Fin


Dans cet exemple, si `age` est 17, le message de bienvenue ne s'affiche pas, et le programme passe directement à "Fin du programme.".

Cependant, il est souvent nécessaire de prévoir une alternative lorsque la condition initiale n'est pas remplie. C'est le rôle de la structure "Si-Alors-Sinon" (If-Then-Else). Elle offre deux chemins d'exécution mutuellement exclusifs : un bloc d'instructions est exécuté si la condition est vraie, et un autre bloc est exécuté si la condition est fausse.

En pseudo-code :


Si (condition est vraie) Alors
    // Bloc d'instructions si la condition est vraie
    Instruction X
    Instruction Y
Sinon
    // Bloc d'instructions si la condition est fausse
    Instruction Z
    Instruction W
Fin Si
// L'exécution continue ici


**Exemple de "Si-Alors-Sinon" :**
Reprenons l'exemple de l'âge, mais cette fois, nous voulons informer l'utilisateur s'il n'est pas majeur.


Algorithme VérifierMajeurAvecAlternative
  Variables : age : Entier
  Début
    Afficher "Quel est votre âge ?"
    Lire age
    Si (age >= 18) Alors
      Afficher "Bienvenue sur notre plateforme !"
    Sinon
      Afficher "Désolé, l'accès est réservé aux personnes majeures."
    Fin Si
    Afficher "Fin du programme."
  Fin


Pour évaluer les conditions, les algorithmes utilisent des **opérateurs de comparaison** et des **opérateurs logiques**.

Les **opérateurs de comparaison** permettent de comparer deux valeurs et de retourner un résultat booléen (Vrai ou Faux) :
*   `=` ou `==` : Égal à (attention à ne pas confondre avec l'affectation `=`)
*   `!=` ou `<>` : Différent de
*   `<` : Inférieur à
*   `>` : Supérieur à
*   `<=` : Inférieur ou égal à
*   `>=` : Supérieur ou égal à

Les **opérateurs logiques** permettent de combiner plusieurs conditions simples pour former des conditions plus complexes :
*   `ET` (AND) : La condition composée est vraie si *toutes* les conditions simples sont vraies.
*   `OU` (OR) : La condition composée est vraie si *au moins une* des conditions simples est vraie.
*   `NON` (NOT) : Inverse la valeur de vérité d'une condition (Vrai devient Faux, Faux devient Vrai).

**Exemple avec opérateurs logiques :**
Déterminer si un nombre est compris entre 10 et 20 (inclus).


Algorithme VerifierIntervalle
  Variables : nombre : Entier
  Début
    Afficher "Entrez un nombre :"
    Lire nombre
    Si (nombre >= 10 ET nombre <= 20) Alors
      Afficher "Le nombre est dans l'intervalle [10, 20]."
    Sinon
      Afficher "Le nombre n'est PAS dans l'intervalle [10, 20]."
    Fin Si
  Fin


Les structures conditionnelles peuvent également être imbriquées (un "Si" à l'intérieur d'un autre "Si") pour gérer des cas de décision plus complexes, bien qu'une imbrication excessive puisse rendre l'algorithme difficile à lire et à maintenir. Dans de tels cas, des structures comme le "Si-Alors-Sinon Si" (If-Then-Else If) ou les structures de "choix multiple" (Switch/Case) peuvent être plus appropriées, mais elles seront abordées dans des leçons ultérieures.

[[WIDGET:Mermaid:conditional_flowchart]]
Diagramme de flux illustrant une structure conditionnelle "Si-Alors-Sinon".

La maîtrise des structures conditionnelles est fondamentale car elles sont le pilier de la logique décisionnelle dans tout programme informatique, permettant aux algorithmes de réagir intelligemment aux différentes situations et entrées.

## Les boucles 'Tant que'

Au-delà de la simple exécution séquentielle et de la prise de décision conditionnelle, de nombreux problèmes algorithmiques nécessitent la répétition d'un ensemble d'instructions. Par exemple, compter jusqu'à un certain nombre, traiter tous les éléments d'une liste, ou attendre une entrée utilisateur valide sont des tâches qui impliquent des exécutions répétées. C'est le rôle des structures itératives, communément appelées **boucles**. Elles permettent d'exécuter un bloc d'instructions plusieurs fois sans avoir à réécrire le code.

Parmi les types de boucles fondamentaux, la boucle "Tant que" (ou While loop en anglais) est l'une des plus courantes et des plus puissantes. Son principe est simple : un bloc d'instructions est répété *tant qu'une condition spécifiée reste vraie*. La condition est évaluée *avant chaque* exécution du corps de la boucle. Si la condition est vraie, le corps de la boucle est exécuté ; si elle est fausse, la boucle se termine et l'exécution se poursuit avec l'instruction qui suit la boucle.

En pseudo-code, la structure est la suivante :


Tant que (condition est vraie) Faire
    // Bloc d'instructions à répéter
    Instruction X
    Instruction Y
Fin Tant que
// L'exécution continue ici


**Exemple de boucle "Tant que" : Compter jusqu'à N**
Supposons que nous voulions afficher les nombres de 1 à 5.


Algorithme CompterJusquaCinq
  Variables : compteur : Entier
  Début
    compteur <- 1 // Initialisation du compteur
    Tant que (compteur <= 5) Faire
      Afficher compteur
      compteur <- compteur + 1 // Incrémentation du compteur
    Fin Tant que
    Afficher "Comptage terminé."
  Fin


Dans cet exemple, la variable `compteur` est initialisée à 1. La condition `compteur <= 5` est vérifiée.
1.  `compteur` est 1 (Vrai) : Affiche 1, `compteur` devient 2.
2.  `compteur` est 2 (Vrai) : Affiche 2, `compteur` devient 3.
3.  `compteur` est 3 (Vrai) : Affiche 3, `compteur` devient 4.
4.  `compteur` est 4 (Vrai) : Affiche 4, `compteur` devient 5.
5.  `compteur` est 5 (Vrai) : Affiche 5, `compteur` devient 6.
6.  `compteur` est 6 (Faux) : La boucle se termine.
Le programme affiche ensuite "Comptage terminé.".

Un aspect crucial de la boucle "Tant que" est la **condition d'arrêt**. Le corps de la boucle doit contenir au moins une instruction qui, à un moment donné, rendra la condition fausse. Si cette condition n'est jamais rendue fausse, la boucle ne se terminera jamais, conduisant à une **boucle infinie**. Une boucle infinie consomme indéfiniment les ressources du système et est une erreur de programmation courante. Dans l'exemple précédent, si nous avions oublié l'instruction `compteur <- compteur + 1`, la condition `compteur <= 5` serait toujours vraie (car `compteur` resterait toujours à 1), et le programme afficherait indéfiniment le nombre 1.

**Exemple de boucle "Tant que" : Saisie de valeur valide**
Un autre usage courant est la validation d'entrée utilisateur, où l'on demande à l'utilisateur de saisir une valeur jusqu'à ce qu'elle respecte un certain critère.


Algorithme SaisieValide
  Variables : note : Entier
  Début
    note <- -1 // Initialisation à une valeur invalide pour entrer dans la boucle
    Tant que (note < 0 OU note > 20) Faire
      Afficher "Veuillez entrer une note entre 0 et 20 :"
      Lire note
    Fin Tant que
    Afficher "La note saisie est : ", note
  Fin


Ici, la boucle continue de demander une note tant que la valeur saisie n'est pas comprise entre 0 et 20. Dès qu'une note valide est entrée, la condition `(note < 0 OU note > 20)` devient fausse, et la boucle s'arrête.

La boucle "Tant que" est particulièrement utile lorsque le nombre d'itérations n'est pas connu à l'avance, mais dépend d'une condition dynamique qui évolue au fur et à mesure de l'exécution de l'algorithme. Elle offre une grande flexibilité pour gérer des scénarios où la répétition est conditionnelle à l'état du système. Comprendre son mécanisme et, surtout, la nécessité d'une condition d'arrêt bien définie est essentiel pour écrire des algorithmes robustes et efficaces.
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (no raw custom component tags, no wrapped verbs in hover-cards).
4. No figure prefixes like "Figure 1:" in visual captions.
5. Word count: The text block must be substantial, containing approximately 750 to 1125 words. Reject if it is too brief, skeletal, or lacks academic depth.
6. Interactive widgets: Ensure between 1 and 1 (at least 1) custom interactive widget anchors [[WIDGET:Type:ID]] are inserted correctly on separate blank lines in this block.


Return ONLY a valid JSON object matching blockNarrativeAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix, or empty if approved"
}
```
Do NOT wrap your JSON response in markdown code blocks.