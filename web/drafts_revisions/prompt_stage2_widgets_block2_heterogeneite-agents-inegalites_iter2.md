You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:ConceptLink:agent_representatif:agent représentatif]] (Type: "ConceptLink", ID: "agent_representatif", Topic: "agent représentatif")
- Anchor: [[WIDGET:RealPerson:thomas_piketty:Thomas Piketty]] (Type: "RealPerson", ID: "thomas_piketty", Topic: "Thomas Piketty")
- Anchor: [[WIDGET:Glossary:coefficient_gini:coefficient de Gini]] (Type: "Glossary", ID: "coefficient_gini", Topic: "coefficient de Gini")
- Anchor: [[WIDGET:Glossary:courbe_lorenz:courbe de Lorenz]] (Type: "Glossary", ID: "courbe_lorenz", Topic: "courbe de Lorenz")
- Anchor: [[WIDGET:ConceptLink:marches_incomplets:marchés incomplets]] (Type: "ConceptLink", ID: "marches_incomplets", Topic: "marchés incomplets")
- Anchor: [[WIDGET:RealPerson:paul_samuelson:Paul Samuelson]] (Type: "RealPerson", ID: "paul_samuelson", Topic: "Paul Samuelson")
- Anchor: [[WIDGET:ConceptLink:pmc_elevee:propension marginale à consommer (PMC)]] (Type: "ConceptLink", ID: "pmc_elevee", Topic: "propension marginale à consommer (PMC)")
- Anchor: [[WIDGET:RealPerson:thomas_piketty:Thomas Piketty]] (Type: "RealPerson", ID: "thomas_piketty", Topic: "Thomas Piketty")
- Anchor: [[WIDGET:Glossary:multiplicateurs_budgetaires:multiplicateurs budgétaires]] (Type: "Glossary", ID: "multiplicateurs_budgetaires", Topic: "multiplicateurs budgétaires")
- Anchor: [[WIDGET:ConceptLink:heterogeneite_agents:hétérogénéité des agents]] (Type: "ConceptLink", ID: "heterogeneite_agents", Topic: "hétérogénéité des agents")
- Anchor: [[WIDGET:Glossary:modeles_dsge:modèles DSGE]] (Type: "Glossary", ID: "modeles_dsge", Topic: "modèles DSGE")
- Anchor: [[WIDGET:RealPerson:piketty_thomas:Thomas Piketty]] (Type: "RealPerson", ID: "piketty_thomas", Topic: "Thomas Piketty")

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
"The 'interactiveComponents' array contains duplicate 'id' values. The ID 'thomas_piketty' is used for two different entries. Each interactive component must have a unique ID.
Detailed errors:
- Field "interactiveComponents": The 'interactiveComponents' array contains duplicate 'id' values. The ID 'thomas_piketty' is used for two different entries. Each interactive component must have a unique ID."
Please fix these issues and regenerate.