You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "black_scholes",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Fischer Black et Myron Scholes",
        "searchQuery": "Fischer Black Myron Scholes",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Black-Scholes",
        "year": "1973"
      }
    },
    {
      "id": "option_exotique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "exotiques",
        "searchQuery": "option exotique finance",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Option_exotique",
        "year": "1973"
      }
    },
    {
      "id": "edp",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "équation aux dérivées partielles",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/%C3%89quation_aux_d%C3%A9riv%C3%A9es_partielles",
        "year": "1973"
      }
    },
    {
      "id": "mesure_neutre_au_risque",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "mesure neutre au risque",
        "searchQuery": "mesure neutre au risque",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mesure_neutre_au_risque",
        "year": "1973"
      }
    },
    {
      "id": "variable_de_controle",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "variable de contrôle Monte Carlo",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/M%C3%A9thode_de_Monte-Carlo_par_cha%C3%AEnes_de_Markov#R%C3%A9duction_de_la_variance",
        "year": "1973"
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
        "year": "1973"
      }
    },
    {
      "id": "edp_finance",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Équations aux Dérivées Partielles (EDP)",
        "searchQuery": "équations aux dérivées partielles finance",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/%C3%89quation_aux_d%C3%A9riv%C3%A9es_partielles_en_finance",
        "year": "1973"
      }
    },
    {
      "id": "discretisation",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "discrétisation mathématiques",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Discr%C3%A9tisation",
        "year": "1973"
      }
    },
    {
      "id": "option_asiatique",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "option asiatique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Option_asiatique",
        "year": "1973"
      }
    },
    {
      "id": "option_americaine",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "options américaines",
        "searchQuery": "option américaine finance",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Option_am%C3%A9ricaine",
        "year": "1973"
      }
    },
    {
      "id": "hull",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "John Hull",
        "searchQuery": "John C. Hull",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/John_C._Hull",
        "year": "1973"
      }
    },
    {
      "id": "methodes_numeriques",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "méthodes numériques",
        "searchQuery": "méthodes numériques",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Analyse_num%C3%A9rique",
        "year": "1973"
      }
    },
    {
      "id": "machine_learning",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Machine Learning",
        "searchQuery": "Machine Learning",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Apprentissage_automatique",
        "year": "1973"
      }
    },
    {
      "id": "neural_networks",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "réseaux de neurones",
        "searchQuery": "réseaux de neurones artificiels",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/R%C3%A9seau_de_neurones_artificiels",
        "year": "1973"
      }
    },
    {
      "id": "numerical_optimization",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "optimisation numérique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Optimisation_(math%C3%A9matiques)",
        "year": "1973"
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