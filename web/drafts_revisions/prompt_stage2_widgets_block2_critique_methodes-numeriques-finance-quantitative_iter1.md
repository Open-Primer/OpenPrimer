You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "black_scholes",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Fischer Black et Myron Scholes",
        "searchQuery": "Modèle Black-Scholes",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_Black-Scholes",
        "year": "1973"
      }
    },
    {
      "id": "option_exotique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Options exotiques",
        "searchQuery": "Option exotique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Option_exotique"
      }
    },
    {
      "id": "edp",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "Équation aux dérivées partielles",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/%C3%89quation_aux_d%C3%A9riv%C3%A9es_partielles",
        "year": "18ème siècle"
      }
    },
    {
      "id": "mesure_neutre_au_risque",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Mesure neutre au risque",
        "searchQuery": "Mesure neutre au risque",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mesure_neutre_au_risque"
      }
    },
    {
      "id": "variable_de_controle",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "Variable de contrôle (statistiques)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Variable_de_contr%C3%B4le",
        "year": "1948"
      }
    },
    {
      "id": "glasserman",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Paul Glasserman",
        "searchQuery": "Paul Glasserman",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Paul_Glasserman",
        "year": "1962"
      }
    },
    {
      "id": "edp_finance",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Équations aux Dérivées Partielles (EDP) en finance",
        "searchQuery": "Équation aux dérivées partielles en finance",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/%C3%89quation_de_Black-Scholes"
      }
    },
    {
      "id": "discretisation",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "Discrétisation",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Discr%C3%A9tisation",
        "year": "20ème siècle"
      }
    },
    {
      "id": "option_asiatique",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "Option asiatique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Option_asiatique",
        "year": "1987"
      }
    },
    {
      "id": "option_americaine",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Options américaines",
        "searchQuery": "Option américaine",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Option_am%C3%A9ricaine"
      }
    },
    {
      "id": "hull",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "John Hull",
        "searchQuery": "John Hull (academic)",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/John_Hull_(academic)",
        "year": "1946"
      }
    },
    {
      "id": "methodes_numeriques",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Méthodes numériques",
        "searchQuery": "Analyse numérique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Analyse_num%C3%A9rique"
      }
    },
    {
      "id": "machine_learning",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Machine Learning",
        "searchQuery": "Apprentissage automatique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Apprentissage_automatique"
      }
    },
    {
      "id": "neural_networks",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Réseaux de neurones",
        "searchQuery": "Réseau de neurones artificiels",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/R%C3%A9seau_de_neurones_artificiels"
      }
    },
    {
      "id": "numerical_optimization",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "Optimisation numérique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Optimisation_num%C3%A9rique",
        "year": "20ème siècle"
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. The "year", "dates", "url", or "wikipediaLink" properties can be "null" or omitted for components that do not require them or where the resource is unresolved/needs backend matching (such as ConceptLink, Location, Glossary, Image, Audio, and Video). Do NOT reject the block or treat "null" or omission as a placeholder or incomplete for these properties on non-applicable component types.

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