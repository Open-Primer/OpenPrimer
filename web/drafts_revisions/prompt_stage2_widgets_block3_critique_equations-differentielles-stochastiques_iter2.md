You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "brownian_motion_path",
      "componentType": "Image",
      "sectionAnchor": "## Mouvement Brownien et Intégrale d'Itô",
      "props": {
        "description": "Cette image représente une trajectoire simulée d'un mouvement brownien standard en deux dimensions. La courbe illustre le caractère aléatoire et continu du mouvement, où chaque pas est indépendant des précédents et la trajectoire ne présente aucune direction privilégiée. Ce type de trajectoire est fondamental pour comprendre la composante stochastique des Équations Différentielles Stochastiques (EDS).",
        "title": "Trajectoire de Mouvement Brownien",
        "year": "2007"
      }
    },
    {
      "id": "eds_components",
      "componentType": "Mermaid",
      "sectionAnchor": "## Définition et Structure d'une EDS",
      "props": {
        "alt": "Diagramme des composantes d'une EDS",
        "caption": "*Diagramme illustrant les composantes fondamentales d'une Équation Différentielle Stochastique (EDS), incluant le terme de dérive, le terme de diffusion et le mouvement brownien, ainsi que leur rôle respectif dans la dynamique du processus stochastique.*",
        "title": "Composantes d'une EDS",
        "url": "https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVEQKIiwiZWRpdG9yTWVyYmFpZCI6eyJzYXZlZCI6ZmFsc2UsInRleHQiOiJncmFwaCBURAogICAgQVtcdXJsaW5lXuJDcXVhdGlvbiBEaWZmXHUwMGU5cmVudGllbGxlIFN0b2NoYXN0aXF1ZShFU0QpXSBcbiAgICBBIC0tPiBCe0NvbXBvc2FudGVzIENsXHUwMGU5c30gXG4gICAgQiAtLT4gQ1tUZXJtZSBkZSBEXHUwMGU5cml2ZSAoRHJpZnQpXSBcbiAgICBDIC0tPiBDMVtGb25jdGlvbiBkXHUwMGU5dGVybWluaXN0ZSBmKHQsIFhfdCldXG4gICAgQzEgLS0+IENyW1JlcHImI3hBMzU7c2VudGUgbGEgdGVuZGFuY2Ugb3UgbGEgcGFydGllIHByXHUwMGU5dmlzaWJsZV1cbiAgICBCIC0tPiBEW1Rlcm1lIGRlIERpZmZ1c2lvbiAoRGlmZnVzaW9uKV1cbiAgICBEIC0tPiBEMVtGb25jdGlvbiBzdG9jaGFzdGlxdWUgZyh0LCBYX3QpXVxuICAgIEQxIC0tPiBEcltSZXByZSZneDk2NztzZW50ZSBsYSB2b2xhdGl0XHUwMGU5IG91IGxhIHBhcnRpZSBhbFx1MDBlOWF0b2lyZV1cbiAgICBCIC0tPiBFXU1vdXZlbWVudCBCcm93bmllbiAoV190KV1cbiAgICBFIC0tPiBFMVtQcm9jZXNzdXMgc3RvY2hhc3Rpb3F1ZSBjb250aW51XVxuICAgIEUxIC0tPiBFMlZTU291cmNlIGRlIGwnYWxcdTAwZWE0YXRvaXJlLCBpbmNyXHUwMGU5bWVudHMgZ2F1c3NpZW5zXVxuICAgIEEgLS0+IEZbRm9ybWUgR2VuXHUwMGU5cmFsZTogZFx1MDBlMjlYfHQgPSBmKHQsIFhfdClkdCArIGcodCwgWF90KWRXX3RdIn0sInVwZGF0ZUVkaXRvciI6ZmFsc2UsInNlbGVjdGVkVGhlbWUiOiJkZWZhdWx0In0)"
      }
    },
    {
      "id": "eds_existence_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Existence et Unicité des Solutions",
      "props": {
        "alt": "Diagramme des conditions d'existence et d'unicité des solutions d'EDS",
        "caption": "*Diagramme illustrant les conditions de Lipschitz et de croissance linéaire sur les coefficients d'une EDS, qui sont nécessaires pour garantir l'existence et l'unicité d'une solution forte.*",
        "title": "Conditions d'Existence et d'Unicité des Solutions d'EDS",
        "url": "https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVEQKIiwiZWRpdG9yTWVyYmFpZCI6eyJzYXZlZCI6ZmFsc2UsInRleHQiOiJncmFwaCBURAogICAgQVtDb25kaXRpb25zIGQnRXhpc3RlbmNlIGV0IGQnVW5pY2l0XHUwMGU5XSBcbiAgICBBIC0tPiBCe0NvZWZmaWNpZW50cyBmIGV0IGd9XG4gICAgQiAtLT4gQ3tDb25kaXRpb24gZGUgTGlwc2NoaXR6fVxuICAgIEMgLS0+IEMxW3xmKHQseCkgLSBmKHQseSl8IDw9IEt8eC15fV1cbiAgICBDIC0tPiBDMlt8Zyh0LHgpIC0gZyh0LHkpfCA8PSBLfHh5fV1cbiAgICBCIC0tPiBEe0NvbmRpdGlvbiBkZSBDcm9pc3NhbmNlIExpblx1MDBlOWFpcmV9XG4gICAgRCAtLT4gRDFWfGYodCwxKXwgKyB8Zyh0LDEpfSA8PSBLKDEgKyB8eHwpXVxuICAgIEMgJiBEIC0tPiBFX1RoXHUwMGU5b3JcdTAwZThtZSBkJ0V4aXN0ZW5jZSBldCBkJ1VuaWNpdFx1MDBlOWNpdFx1MDBlOWd9XG4gICAgRSAtLT4gRltTb2x1dGlvbiBYX3QgZXhpc3RlIGV0IGVzdCB1bmlxdWVdXG4gICAgRiAtLT4gR1tQb3VyIHVuIHRlbXAgVCBmaW5pIGV0IHVuZSBjb25kaXRpb24gaW5pdGlhbGUgWF8wXVxuICAgICJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJzZWxlY3RlZFRoZW1lIjoiZGVmYXVsdCJ9)"
      }
    },
    {
      "id": "eds_linear_example",
      "componentType": "Image",
      "sectionAnchor": "## Exemples d'EDS Simples",
      "props": {
        "description": "Cette figure illustre une trajectoire simulée d'une Équation Différentielle Stochastique linéaire. Contrairement au mouvement brownien pur, cette trajectoire montre une tendance (dérive) et une volatilité (diffusion) qui peuvent dépendre de l'état actuel du processus. Elle met en évidence comment les termes de dérive et de diffusion interagissent pour former un chemin stochastique avec une structure sous-jacente.",
        "title": "Trajectoire d'une EDS Linéaire",
        "year": "2007"
      }
    },
    {
      "id": "jump_diffusion_vs_gbm",
      "componentType": "Image",
      "sectionAnchor": "## EDS avec Sauts (Jump-Diffusion)",
      "props": {
        "description": "Cette figure compare une trajectoire de processus de diffusion avec sauts (jump-diffusion) à une trajectoire de mouvement brownien géométrique (GBM). La trajectoire de jump-diffusion se caractérise par des changements brusques et discontinus (sauts) superposés à un mouvement diffusif continu, tandis que le GBM présente une évolution continue et exponentielle. Cette comparaison est cruciale pour modéliser des phénomènes financiers où des événements rares mais significatifs peuvent survenir.",
        "title": "Jump-Diffusion vs. Mouvement Brownien Géométrique",
        "year": "2007"
      }
    },
    {
      "id": "eds_advanced_topics",
      "componentType": "Mermaid",
      "sectionAnchor": "## Applications Avancées et Extensions",
      "props": {
        "alt": "Schéma des applications avancées des EDS en finance",
        "caption": "*Schéma illustrant les diverses applications avancées des Équations Différentielles Stochastiques (EDS) dans des domaines tels que la finance quantitative, la physique, l'ingénierie et la biologie, ainsi que leurs extensions théoriques.*",
        "title": "Applications Avancées des EDS",
        "url": "https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVEQKIiwiZWRpdG9yTWVyYmFpZCI6eyJzYXZlZCI6ZmFsc2UsInRleHQiOiJncmFwaCBURAogICAgQVtBcHBsaWNhdGlvbnMgQXZhbmNcdTAwZWE5ZXMgZGVzIEVEU10gLS0+IEJ7RmluYW5jZSBRdWFudGl0YXRpdmV9XG4gICAgQiAtLT4gQjFbTW9kXHUwMGU5bGlzYXRpb24gZGVzIHByaXggZCdhc3NldHMgKEJsYWNrLVNjaG9sZXMpXVxuICAgIEIxIC0tPiBCMWFbT3B0aW9ucywgcHJvZHVpdHMgZGVyZXZcdTAwZWE5c11cbiAgICBCIC0tPiBCMltHZXN0aW9uIGRlIHBvcnRlZmV1aWxsZV1cbiAgICBCMiAtLT4gQjJhW09wdGltaXNhdGlvbiBzdG9jaGFzdGlxdWVdXG4gICAgQSBhbmQgQ3tQaHlzaXF1ZSBldCBJbmdcdTAwZWE5bmlcHUwMGU5cmlleX1cbiAgICBDIC0tPiBDMVtNb3V2ZW1lbnQgZGUgcGFydGljdWxlcyAoTGFuZ2V2aW4pXVxuICAgIEMgLS0+IEMyW0ZpbHRyYWdlIGRlIEthbG1hbl1cbiAgICBBIC0tPiBEe0Jpb2xvZ2llIGV0IE1cdTAwZWE5ZGVjaW5lfVxuICAgIEQgLS0+IERxW0R5bmFtaXF1ZSBkZXMgcG9wdWxhdGlvbnNdXG4gICAgRCAtLT4gRDJbTW9kXHUwMGU5bGlzYXRpb24gZGUgbGEgcHJvcGFnYXRpb24gZGUgbWFsYWRpZXNdXG4gICAgQSBhbmQgRXtFeHRlbnNpb25zIGRlcyBFRFN9XG4gICAgRSAtLT4gRTFbRUFTIGF2ZWMgc2F1dHMgKEp1bXAtRGlmZnVzaW9uKV1cbiAgICBFIC0tPiBFMltFRFMgcmV0cm9ncmFkZXMgKEJTREVzKV1cbiAgICBFIC0tPiBFM1tFRFMgXHUwMGUwIGNvZWZmaWNpZW50cyBkXHUwMGU5cGVuZGFudHMgZHUgcGFzc1x1MDBlOV1cbiAgICJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJzZWxlY3RlZFRoZW1lIjoiZGVmYXVsdCJ9)"
      }
    },
    {
      "id": "eds_conclusion_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "## Conclusion",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Qu'est-ce qui distingue principalement une Équation Différentielle Stochastique (EDS) d'une Équation Différentielle Ordinaire (EDO) ?",
            "options": [
              {
                "text": "L'EDS inclut un terme de dérive.",
                "correct": false
              },
              {
                "text": "L'EDS modélise uniquement des phénomènes physiques.",
                "correct": false
              },
              {
                "text": "L'EDS contient un terme de diffusion lié à un processus stochastique (comme le mouvement brownien).",
                "correct": true
              },
              {
                "text": "L'EDS n'a pas de solution unique.",
                "correct": false
              }
            ],
            "explanation": "La présence d'un terme de diffusion stochastique est la caractéristique clé des EDS, introduisant l'aléatoire dans la dynamique du système."
          },
          {
            "q": "Le mouvement brownien est-il un processus à variation bornée ?",
            "options": [
              {
                "text": "Oui, toujours.",
                "correct": false
              },
              {
                "text": "Non, il est à variation infinie sur tout intervalle de temps non nul.",
                "correct": true
              },
              {
                "text": "Seulement si le temps est discret.",
                "correct": false
              },
              {
                "text": "Cela dépend de la dimension de l'espace.",
                "correct": false
              }
            ],
            "explanation": "Le mouvement brownien est un processus à variation infinie, ce qui est une propriété fondamentale qui le distingue des fonctions différentiables classiques et justifie l'intégrale d'Itô."
          },
          {
            "q": "Quelles sont les conditions principales pour garantir l'existence et l'unicité d'une solution forte à une EDS ?",
            "options": [
              {
                "text": "Les coefficients de dérive et de diffusion doivent être constants.",
                "correct": false
              },
              {
                "text": "Les coefficients doivent satisfaire les conditions de Lipschitz et de croissance linéaire.",
                "correct": true
              },
              {
                "text": "Le processus stochastique doit être un mouvement brownien standard.",
                "correct": false
              },
              {
                "text": "La condition initiale doit être déterministe.",
                "correct": false
              },
              {
                "text": "Les coefficients doivent être mesurables par rapport à la filtration.",
                "correct": true
              }
            ],
            "explanation": "Les conditions de Lipschitz et de croissance linéaire sur les coefficients de dérive et de diffusion, ainsi que leur mesurabilité par rapport à la filtration, sont essentielles pour l'existence et l'unicité d'une solution forte."
          }
        ]
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. CRITICAL MEDIA RULES:
   - Image components MUST NOT contain "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "year" properties.
   - Video components MUST NOT contain "url", "id", "provider", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   - Audio components MUST NOT contain "url", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   These fields are FORBIDDEN in the raw widgets JSON for Image, Video, and Audio. They are resolved automatically downstream by the external-resource-resolver pipeline using the component's title/searchQuery/description. Any media component missing these fields is CORRECT and must NOT be rejected. If a media component DOES contain any of these forbidden fields (even with a seemingly valid URL), that IS an error and should be flagged.
6. For other components (Quiz, SolvedExercise, UnsolvedExercise, FillInBlanks, Mermaid): "url", "wikipediaLink", "wikipediaUrl" can be null or omitted — this is acceptable. Do NOT reject those component types for missing URL fields.
7. For UnsolvedExercise components, the props must contain "title", "problem", and "correctAnswer". Do NOT reject them for missing "questions" or "tasks" as those are not part of the UnsolvedExercise props structure.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'interactiveComponents')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.