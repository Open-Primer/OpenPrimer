You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
We need to repair specific component keys of the generated widgets JSON for the lesson "Des mythes aux télescopes : L'éveil de la cosmologie" that were rejected by the Widgets Critic (Agent 4B).

⚠️ CRITICAL REMINDER FOR MDX COMPLIANCE:
- Do NOT use raw javascript arrow functions, backticks (`), or complex unescaped double quotes inside interactive component properties (such as "props").
- Keep MCQ options as simple, plain text strings. Never place markdown list items (- or *) or HTML tags inside of quiz "options" or "question" strings.

CONTEXT:
Course: "Introduction à l'astrophysique et à la cosmologie" | Level: "University Year 1 / Bachelor 1st Year (L1)" | Language: "FR"

REJECTED WIDGETS DATA:

--- REJECTED WIDGET 1 ---
Key: "interactiveComponents:babylonian_map"
Critique from Agent 4B:
  "The "description", "alt", and "caption" fields are lazy copy-pastes of the section heading. They must be replaced with the specific content provided in the narrative anchor: "Carte du monde babylonienne (Imago Mundi), représentant la Terre comme un disque plat entouré d'eau et de montagnes lointaines, datant du 6e siècle av. J.-C."."
Current JSON Value:
{
  "id": "babylonian_map",
  "componentType": "Media",
  "sectionAnchor": "1.1. Les Cosmogonies Mythologiques : Un Univers Animé et Symbolique",
  "props": {
    "type": "image",
    "description": "1.1. Les Cosmogonies Mythologiques : Un Univers Animé et Symbolique",
    "alt": "1.1. Les Cosmogonies Mythologiques : Un Univers Animé et Symbolique",
    "caption": "Illustration : 1.1. Les Cosmogonies Mythologiques : Un Univers Animé et Symbolique",
    "title": "1.1. Les Cosmogonies Mythologiques : Un Univers Animé et Symbolique"
  }
}
----------------------------------


--- REJECTED WIDGET 2 ---
Key: "interactiveComponents:ptolemy_model"
Critique from Agent 4B:
  "The "description", "alt", and "caption" fields are lazy copy-pastes of the section heading. They must be replaced with the specific content provided in the narrative anchor: "Diagramme détaillé du modèle géocentrique de Ptolémée, montrant la Terre au centre, les déférents et les épicycles pour expliquer le mouvement rétrograde d'une planète."."
Current JSON Value:
{
  "id": "ptolemy_model",
  "componentType": "Media",
  "sectionAnchor": "2.2. L'Affinement Ptolémaïque : Épicycles et Déférents",
  "props": {
    "type": "image",
    "description": "2.2. L'Affinement Ptolémaïque : Épicycles et Déférents",
    "alt": "2.2. L'Affinement Ptolémaïque : Épicycles et Déférents",
    "caption": "Illustration : 2.2. L'Affinement Ptolémaïque : Épicycles et Déférents",
    "title": "2.2. L'Affinement Ptolémaïque : Épicycles et Déférents"
  }
}
----------------------------------


--- REJECTED WIDGET 3 ---
Key: "interactiveComponents:copernican_model"
Critique from Agent 4B:
  "The "description", "alt", and "caption" fields are lazy copy-pastes of the section heading. They must be replaced with the specific content provided in the narrative anchor: "Schéma du modèle héliocentrique de Copernic, montrant le Soleil au centre et les planètes, y compris la Terre, orbitant autour de lui sur des cercles concentriques."."
Current JSON Value:
{
  "id": "copernican_model",
  "componentType": "Media",
  "sectionAnchor": "3.1. Nicolas Copernic et l'Héliocentrisme",
  "props": {
    "type": "image",
    "description": "3.1. Nicolas Copernic et l'Héliocentrisme",
    "alt": "3.1. Nicolas Copernic et l'Héliocentrisme",
    "caption": "Illustration : 3.1. Nicolas Copernic et l'Héliocentrisme",
    "title": "3.1. Nicolas Copernic et l'Héliocentrisme"
  }
}
----------------------------------


--- REJECTED WIDGET 4 ---
Key: "interactiveComponents:galileo_telescope"
Critique from Agent 4B:
  "The "description", "alt", and "caption" fields are lazy copy-pastes of the section heading. They must be replaced with the specific content provided in the narrative anchor: "Représentation de Galilée observant le ciel avec son télescope, avec des croquis de ses observations des lunes de Jupiter et des phases de Vénus."."
Current JSON Value:
{
  "id": "galileo_telescope",
  "componentType": "Media",
  "sectionAnchor": "4.1. Le Télescope : Une Nouvelle Fenêtre sur l'Univers",
  "props": {
    "type": "image",
    "description": "4.1. Le Télescope : Une Nouvelle Fenêtre sur l'Univers",
    "alt": "4.1. Le Télescope : Une Nouvelle Fenêtre sur l'Univers",
    "caption": "Illustration : 4.1. Le Télescope : Une Nouvelle Fenêtre sur l'Univers",
    "title": "4.1. Le Télescope : Une Nouvelle Fenêtre sur l'Univers"
  }
}
----------------------------------


--- REJECTED WIDGET 5 ---
Key: "interactiveComponents:newton_principia"
Critique from Agent 4B:
  "The "description", "alt", and "caption" fields are lazy copy-pastes of the section heading. They must be replaced with the specific content provided in the narrative anchor: "Page de titre des Philosophiae Naturalis Principia Mathematica d'Isaac Newton, publiée en 1687, un ouvrage fondateur de la physique classique."."
Current JSON Value:
{
  "id": "newton_principia",
  "componentType": "Media",
  "sectionAnchor": "5.1. Les Principia Mathematica et la Loi de la Gravitation",
  "props": {
    "type": "image",
    "description": "5.1. Les Principia Mathematica et la Loi de la Gravitation",
    "alt": "5.1. Les Principia Mathematica et la Loi de la Gravitation",
    "caption": "Illustration : 5.1. Les Principia Mathematica et la Loi de la Gravitation",
    "title": "5.1. Les Principia Mathematica et la Loi de la Gravitation"
  }
}
----------------------------------


--- REJECTED WIDGET 6 ---
Key: "interactiveComponents:video_cosmo_evolution_summary"
Critique from Agent 4B:
  "The 'url' provided is a Rick Roll, which is unacceptable for academic content. The 'title' 'Vidéo académique' is too generic and should be more descriptive of the video's content."
Current JSON Value:
{
  "id": "video_cosmo_evolution_summary",
  "componentType": "Video",
  "sectionAnchor": "Conclusion",
  "props": {
    "title": "Vidéo académique",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "provider": "YouTube"
  }
}
----------------------------------


--- REJECTED WIDGET 7 ---
Key: "finalEvaluation"
Critique from Agent 4B:
  "The quiz questions, options, and explanations are placeholders ('Question d'examen finale ?', 'Option Correcte', 'Explication générale.') and must be replaced with actual academic content relevant to the entire lesson."
Current JSON Value:
{
  "type": "Quiz",
  "props": {
    "durationLimit": 1800,
    "questions": [
      {
        "q": "Question d'examen finale ?",
        "explanation": "Explication générale.",
        "options": [
          {
            "text": "Option Correcte",
            "correct": true
          },
          {
            "text": "Option Incorrecte",
            "correct": false
          }
        ]
      }
    ]
  }
}
----------------------------------


--- REJECTED WIDGET 8 ---
Key: "references"
Critique from Agent 4B:
  "The number of references (6) slightly exceeds the recommended range of 3 to 5 authoritative academic works."
Current JSON Value:
[
  "Luminet, Jean-Pierre. \"Le destin de l'univers: Trous noirs et énergie sombre.\" Fayard, 2006.",
  "Lachièze-Rey, Marc. \"Cosmologie.\" Dunod, 2013.",
  "Carroll, Bradley W., and Dale A. Ostlie. \"An Introduction to Modern Astrophysics.\" Cambridge University Press, 2017.",
  "Hawking, Stephen. \"Une brève histoire du temps: Du Big Bang aux trous noirs.\" Flammarion, 1989.",
  "Séguin, Marc, et Benoît Villeneuve. \"Astronomie et astrophysique.\" De Boeck Supérieur, 2018.",
  "Reeves, Hubert. \"Patience dans l'azur: L'évolution cosmique.\" Seuil, 1981."
]
----------------------------------


INSTRUCTIONS:
1. Repair each rejected widget key to fully resolve its critique.
2. Return a SINGLE JSON object containing ONLY the repaired keys as its top-level properties (or for "interactiveComponents", return the repaired component object).
3. Format of output JSON:
   For top-level keys like "diagnosticQuiz", the output JSON should have:
   {
     "diagnosticQuiz": { ... repaired object ... }
   }
   For "interactiveComponents:compId" keys, return the repaired component object under the component's key, like:
   {
     "interactiveComponents:compId": { ... repaired component object, including id, componentType, sectionAnchor, props, etc. ... }
   }

Do NOT wrap your JSON response in markdown code blocks (```json or ```).