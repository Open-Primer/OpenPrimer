You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 2 out of 3.
- You MUST write the content for the following sections:
* Heading: "## Mitochondries, Lysosomes et Peroxysomes : Énergie et Catabolisme Cellulaire"
  Instructions: "Décrire la structure et la fonction des mitochondries (respiration cellulaire, production d'ATP). Expliquer la morphologie et le rôle des lysosomes dans la dégradation des macromolécules et le recyclage cellulaire. Détailler les peroxysomes et leur fonction dans l'oxydation des acides gras et la détoxification."
* Heading: "## Le Cytosquelette et la Spécificité Eucaryote face aux Procaryotes"
  Instructions: "Décrire les trois principaux composants du cytosquelette (microtubules, filaments d'actine, filaments intermédiaires) et leurs rôles dans le maintien de la forme cellulaire, le mouvement et le transport intracellulaire. Réaliser une comparaison structurale et fonctionnelle détaillée entre la cellule eucaryote et la cellule procaryote, en soulignant les différences clés en termes de compartimentation et d'organisation."

---

### GLOBAL CONTEXT:
- Course Name: "Biologie cellulaire et moléculaire"
- Academic Level: "University Year 1 / Bachelor 1st Year (L1)"
- Lesson Title: "L'Architecture de la Cellule Eucaryote : Organites et Fonctions"
- Discipline: "Biologie"
- Target Language: "FR"
- References available:
[ref1] Alberts, B., Johnson, A., Lewis, J., Raff, M., Roberts, K., & Walter, P. (2017). 'Biologie moléculaire de la cellule' (6e éd.). Médecine-Sciences Flammarion.
[ref2] Lodish, H., Berk, A., Kaiser, C. A., Krieger, M., Bretscher, A., Ploegh, H., Amon, A., & Scott, M. P. (2016). 'Biologie cellulaire et moléculaire' (8e éd.). De Boeck Supérieur.
[ref3] Campbell, N. A., Reece, J. B., Urry, L. A., Cain, M. L., Wasserman, S. A., Minorsky, P. V., & Jackson, R. B. (2017). 'Biologie' (11e éd.). Pearson Education France.
[ref4] Raven, P. H., Johnson, G. B., Mason, K. A., Losos, J. B., & Singer, S. R. (2017). 'Biologie' (11e éd.). De Boeck Supérieur.
[ref5] Karp, G. (2019). 'Biologie cellulaire et moléculaire : Concepts et expériences' (8e éd.). De Boeck Supérieur.
[ref6] Lehninger, A. L., Nelson, D. L., & Cox, M. M. (2017). 'Principes de biochimie' (7e éd.). Flammarion Médecine-Sciences.


---

### PREVIOUS TEXT (for transitions and context):
Below is the text generated in the previous blocks. Do NOT repeat any definitions, concepts, or sentences from this text. Start writing immediately from where it left off, ensuring a smooth transition:
"""
...  :** Le REL stocke et libère des ions calcium (Ca²⁺), jouant un rôle vital dans la signalisation cellulaire, notamment la contraction musculaire.

Pour mieux comprendre les distinctions entre le RER et le REL, voici un tableau comparatif :

| Caractéristique | Réticulum Endoplasmique Rugueux (RER) | Réticulum Endoplasmique Lisse (REL) |
|-----------------|---------------------------------------|-------------------------------------|
| **Ribosomes**   | Présents, attachés à la surface       | Absents                             |
| **Morphologie** | Sacs membraneux (citernes) aplatis    | Tubules interconnectés              |
| **Fonctions**   | Synthèse et repliement des protéines sécrétées/membranaires, glycosylation initiale, contrôle qualité des protéines | Synthèse des lipides (phospholipides, stéroïdes), détoxification, stockage et libération du Ca²⁺ |
| **Continuité**  | En continuité avec l'enveloppe nucléaire | Souvent en continuité avec le RER   |

### L'Appareil de Golgi

L'appareil de Golgi, ou complexe golgien, est un organite composé de sacs membraneux aplatis appelés citernes, empilés les uns sur les autres pour former des dictyosomes. Il est généralement situé près du noyau et du RE. L'appareil de Golgi est polarisé, avec trois régions fonctionnellement distinctes :
[[WIDGET:image-golgi-structure]]
- **Face _cis_ (ou réseau _cis_-golgien) :** C'est la face d'entrée, recevant les vésicules de transport contenant des protéines et des lipides du RER.
- **Citernes médianes :** Au centre de l'appareil de Golgi, ces citernes sont le site de nombreuses modifications enzymatiques des protéines et des lipides, notamment la maturation des chaînes oligosaccharidiques (glycosylation).
- **Face _trans_ (ou réseau _trans_-golgien) :** C'est la face de sortie, où les protéines et les lipides sont triés et empaquetés dans des vésicules de transport destinées à diverses destinations cellulaires (lysosomes, membrane plasmique, sécrétion extracellulaire).

Les fonctions principales de l'appareil de Golgi incluent la maturation, le tri et le transport des protéines et des lipides synthétisés dans le RE. Il agit comme une station de traitement et de distribution, assurant que chaque molécule atteint sa destination correcte dans la cellule ou à l'extérieur.

Pour visualiser le flux au sein du système endomembranaire, consultez le schéma ci-dessous :

```mermaid
graph TD
    A[Noyau] --> B(Enveloppe Nucléaire);
    B --> C[Réticulum Endoplasmique Rugueux (RER)];
    C -- Protéines & Lipides --> D[Appareil de Golgi];
    D -- Vésicules de Transport --> E{Destinations Cellulaires};
    E -- Sécrétion --> F[Extérieur de la Cellule];
    E -- Lysosomes --> G[Dégradation];
    E -- Membrane Plasmatique --> H[Intégration Membranaire];
    C -- Synthèse Lipides --> I[Réticulum Endoplasmique Lisse (REL)];
    I -- Détoxification / Ca2+ Stockage --> J[Fonctions Spécifiques];

    subgraph Système Endomembranaire
        C
        D
        I
        E
    end
```
"""

---

⚠️ CRITICAL MARKUP & XML/JSX COMPLIANCE RULES (MDX SAFETY MANDATE):
1. ABSOLUTE PROHIBITION ON RAW INTERACTIVE OR CUSTOM JSX/HTML TAGS. Absolutely no custom JSX/HTML tags (such as <ConceptLink>, <RealPerson>, <Glossary>, etc.) are allowed inline in prose. Exclusively use [[WIDGET:id]] anchors for all widgets, media, links, or elements.
2. NO RAW HTML FOR LISTS. Use Markdown bullets/numbering.
3. NO LITERAL CURLY BRACES in plain text. Wrap in LaTeX or backticks.
4. NO STRAY import/export statements.
5. NO WIDGET ANCHORS INSIDE LISTS OR TABLES. Place them on separate blank lines.
6. Captions of images or Mermaid diagrams must NOT contain figure prefixes (like 'Figure 1:', 'Image A -'). CAPTIONS MUST ONLY contain the descriptive prose.
7. ACADEMIC REFERENCES CITATION MANDATE: You MUST actively cite the references listed under "### GLOBAL CONTEXT:" (if any) throughout the prose. Cite them inline using the format [ref1], [ref2], etc., where [ref1] maps to the first reference in the Global Context list, [ref2] to the second, and so on. Do not define a bibliography section here; simply cite them inline in this format.




🚨 CRITIQUE FROM PREVIOUS ATTEMPT 🚨
The critique agent rejected your previous attempt for this block. Correct the following issues:
"Failed to map rejected sections. Retrying globally."

Write the content for the specified sections. Return ONLY the markdown content. Do NOT wrap the response in markdown code blocks.