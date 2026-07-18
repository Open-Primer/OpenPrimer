You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:RealPerson:black_scholes:Black-Scholes-Merton]] (Type: "RealPerson", ID: "black_scholes", Topic: "Black-Scholes-Merton")
- Anchor: [[WIDGET:ConceptLink:option_exotique:exotiques]] (Type: "ConceptLink", ID: "option_exotique", Topic: "exotiques")
- Anchor: [[WIDGET:Glossary:edp:équations aux dérivées partielles (EDP)]] (Type: "Glossary", ID: "edp", Topic: "équations aux dérivées partielles (EDP)")
- Anchor: [[WIDGET:ConceptLink:mesure_neutre_au_risque:mesure neutre au risque]] (Type: "ConceptLink", ID: "mesure_neutre_au_risque", Topic: "mesure neutre au risque")
- Anchor: [[WIDGET:Glossary:variable_de_controle:variable de contrôle]] (Type: "Glossary", ID: "variable_de_controle", Topic: "variable de contrôle")
- Anchor: [[WIDGET:RealPerson:glasserman:Paul Glasserman]] (Type: "RealPerson", ID: "glasserman", Topic: "Paul Glasserman")
- Anchor: [[WIDGET:ConceptLink:edp_finance:Équations aux Dérivées Partielles (EDP)]] (Type: "ConceptLink", ID: "edp_finance", Topic: "Équations aux Dérivées Partielles (EDP)")
- Anchor: [[WIDGET:Glossary:discretisation:discrétisation]] (Type: "Glossary", ID: "discretisation", Topic: "discrétisation")
- Anchor: [[WIDGET:RealPerson:black_scholes:Fischer Black et Myron Scholes]] (Type: "RealPerson", ID: "black_scholes", Topic: "Fischer Black et Myron Scholes")
- Anchor: [[WIDGET:Glossary:option_asiatique:options asiatiques]] (Type: "Glossary", ID: "option_asiatique", Topic: "options asiatiques")
- Anchor: [[WIDGET:ConceptLink:option_americaine:options américaines]] (Type: "ConceptLink", ID: "option_americaine", Topic: "options américaines")
- Anchor: [[WIDGET:RealPerson:hull:John Hull]] (Type: "RealPerson", ID: "hull", Topic: "John Hull")
- Anchor: [[WIDGET:ConceptLink:methodes_numeriques:méthodes numériques]] (Type: "ConceptLink", ID: "methodes_numeriques", Topic: "méthodes numériques")
- Anchor: [[WIDGET:ConceptLink:machine_learning:Machine Learning]] (Type: "ConceptLink", ID: "machine_learning", Topic: "Machine Learning")
- Anchor: [[WIDGET:ConceptLink:neural_networks:réseaux de neurones]] (Type: "ConceptLink", ID: "neural_networks", Topic: "réseaux de neurones")
- Anchor: [[WIDGET:Glossary:numerical_optimization:optimisation numérique]] (Type: "Glossary", ID: "numerical_optimization", Topic: "optimisation numérique")

---

### CATALOG AND GUIDELINES:
- ID: "Mermaid"
  Name: "Mermaid Diagram Engine" (Moteur de diagrammes Mermaid)
  Description: "Render rich flowcharts, timelines, and concept maps from descriptive text markup."
  Disciplines: [All Disciplines]
  Educational Level: "All levels"

### REQUIRED PROPS STRUCTURE per componentType:
1. "Biography":
   - "name": (string) Full name of the person.
   - "dates": (string) Lifespan dates, e.g. "1723-1790" or "1856-1939".
   - "description": (string) Detailed biographical summary focusing on their contributions (8-12 sentences).
   - "wikipediaUrl": (string) Direct canonical link to their English or French Wikipedia page. MANDATORY.
   - "searchQuery": (string) Canonical search query to find the biography on Wikipedia. MANDATORY.
2. "RealPerson" or "HistoricalPerson":
   - "name": (string) Full name of the person (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this person (2-4 sentences).
   - "wikipediaUrl": (string) Direct canonical link to their Wikipedia page. MANDATORY.
   - "searchQuery": (string) Canonical search query to find the person on Wikipedia. MANDATORY.
   ⚠️ CRITICAL: Do NOT add a "year", "dates", "birthYear", or "deathYear" field for RealPerson/HistoricalPerson. These fields are NOT in the schema and will cause validation failure. Dates are resolved automatically via Wikidata after generation.
3. "ConceptLink":
   - "name": (string) Name of the concept (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this concept (2-4 sentences).
   - "wikipediaUrl": (string) Direct canonical link to their Wikipedia page. MANDATORY.
   - "searchQuery": (string) Canonical search query to find the concept on Wikipedia. MANDATORY.
4. "EventLink", "HistoricalEventLink", "EvenementHistorique", or "ÉvénementHistorique":
   - "name": (string) Name of the event (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this event (2-4 sentences).
   - "wikipediaUrl": (string) Direct canonical link to their Wikipedia page. MANDATORY.
   - "searchQuery": (string) Canonical search query to find the event on Wikipedia. MANDATORY.
5. "Location":
   - "name": (string) Name of the location (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this location (2-4 sentences).
   - "wikipediaUrl": (string) Direct canonical link to their Wikipedia page. MANDATORY.
   - "searchQuery": (string) Canonical search query to find the location on Wikipedia. MANDATORY.
6. "Glossary":
   - "term": (string) Glossary vocabulary term.
   - "definition": (string) Detailed vocabulary definition (2-4 sentences).
   - "wikipediaUrl": (string) Direct canonical link to their Wikipedia page. MANDATORY.
   - "searchQuery": (string) Canonical search query to find the term on Wikipedia. MANDATORY.

DO NOT output any properties that are not explicitly defined in the props catalog above for a given componentType. For instance, do NOT output "year", "dates", "url", or "wikipediaLink" for ConceptLink, HistoricalEventLink, Location, or Glossary; if you do, the critique agent will reject the block.

You must define the "interactiveComponents" array containing one object for each anchor listed above.
For each component:
- "id": Must match the ID from the anchor.
- "componentType": Must match the Type from the anchor.
- "sectionAnchor": The markdown heading "## Section Name" where this widget is placed in the narrative.
- "props": The specific properties required for the widget type as described above.

Return ONLY a valid JSON object matching this schema:
\`\`\`json
{
  "interactiveComponents": [
    {
      "id": "string",
      "componentType": "string",
      "sectionAnchor": "string",
      "props": {}
    }
  ]
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.

🚨 PREVIOUS CRITIQUE:
"The block contains multiple instances of placeholder or incorrect 'year' values across various component types. Specifically, the 'year' property for 'RealPerson' components is incorrect for biographical dates, and for 'ConceptLink' and 'Glossary' components, it is present with a seemingly arbitrary value ('1973') when it should be null or omitted as it is not applicable. Additionally, the 'wikipediaUrl' for the 'black_scholes' 'RealPerson' component links to the model, not the individuals.
Detailed errors:
- Field "interactiveComponents": Several interactive components have issues:
- The 'black_scholes' (RealPerson) component's 'wikipediaUrl' points to the Black-Scholes model page instead of the biographies of Fischer Black and Myron Scholes. The 'year' '1973' is the model's publication year, not a biographical date for the individuals.
- The 'glasserman' (RealPerson) component has an incorrect 'year' of '1973'. Paul Glasserman was born in 1962.
- The 'hull' (RealPerson) component has an incorrect 'year' of '1973'. John Hull was born in 1946.
- All 'ConceptLink' and 'Glossary' components (e.g., 'option_exotique', 'edp', 'mesure_neutre_au_risque', 'variable_de_controle', 'edp_finance', 'discretisation', 'option_asiatique', 'option_americaine', 'methodes_numeriques', 'machine_learning', 'neural_networks', 'numerical_optimization') incorrectly include the 'year' property with the value '1973'. For these component types, the 'year' property is not applicable and should be omitted or set to null."
Please fix these issues and regenerate.