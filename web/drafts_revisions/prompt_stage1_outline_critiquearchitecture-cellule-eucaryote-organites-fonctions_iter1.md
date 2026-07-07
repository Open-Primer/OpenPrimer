You are the Outline Critic Agent. Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la Cellule Eucaryote",
      "description": "Présenter la cellule eucaryote comme l'unité fondamentale de la vie complexe. Expliquer la nécessité de la compartimentation et le rôle des organites. Introduire brièvement les thèmes abordés dans la leçon."
    },
    {
      "heading": "## Le Système Endomembranaire : Noyau, Réticulum Endoplasmique et Appareil de Golgi",
      "description": "Décrire la morphologie et les fonctions du noyau (enveloppe nucléaire, chromatine, nucléole). Expliquer la structure et les rôles du réticulum endoplasmique (rugueux et lisse) dans la synthèse et le repliement des protéines, la synthèse lipidique et la détoxification. Détailler l'appareil de Golgi (cis, médian, trans) et son rôle dans la maturation, le tri et le transport des protéines et lipides."
    },
    {
      "heading": "## Mitochondries, Lysosomes et Peroxysomes : Énergie et Catabolisme Cellulaire",
      "description": "Décrire la structure et la fonction des mitochondries (respiration cellulaire, production d'ATP). Expliquer la morphologie et le rôle des lysosomes dans la dégradation des macromolécules et le recyclage cellulaire. Détailler les peroxysomes et leur fonction dans l'oxydation des acides gras et la détoxification."
    },
    {
      "heading": "## Le Cytosquelette et la Spécificité Eucaryote face aux Procaryotes",
      "description": "Décrire les trois principaux composants du cytosquelette (microtubules, filaments d'actine, filaments intermédiaires) et leurs rôles dans le maintien de la forme cellulaire, le mouvement et le transport intracellulaire. Réaliser une comparaison structurale et fonctionnelle détaillée entre la cellule eucaryote et la cellule procaryote, en soulignant les différences clés en termes de compartimentation et d'organisation."
    },
    {
      "heading": "## Conclusion : L'Interdépendance des Organites",
      "description": "Récapituler les points clés de la leçon sur l'architecture et les fonctions des organites eucaryotes. Souligner l'interdépendance et la coordination des organites pour le bon fonctionnement cellulaire. Ouvrir sur l'importance de cette connaissance pour comprendre les processus physiologiques et pathologiques."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 1 / Bachelor 1st Year (L1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Description morphologique et fonctionnelle détaillée du noyau, réticulum endoplasmique, appareil de Golgi, mitochondries, lysosomes, peroxysomes et cytosquelette. Comparaison avec la cellule procaryote.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
Do NOT wrap your JSON response in markdown code blocks.