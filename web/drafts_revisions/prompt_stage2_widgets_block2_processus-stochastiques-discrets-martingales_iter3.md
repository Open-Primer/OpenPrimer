You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:RealPerson:bachelier:Louis Bachelier]] (Type: "RealPerson", ID: "bachelier", Topic: "Louis Bachelier")
- Anchor: [[WIDGET:RealPerson:black_scholes:Black-Scholes-Merton]] (Type: "RealPerson", ID: "black_scholes", Topic: "Black-Scholes-Merton")
- Anchor: [[WIDGET:ConceptLink:arbitrage:arbitrage]] (Type: "ConceptLink", ID: "arbitrage", Topic: "arbitrage")
- Anchor: [[WIDGET:ConceptLink:sigma_algebra:filtration]] (Type: "ConceptLink", ID: "sigma_algebra", Topic: "filtration")
- Anchor: [[WIDGET:ConceptLink:esperance_conditionnelle:espérance conditionnelle]] (Type: "ConceptLink", ID: "esperance_conditionnelle", Topic: "espérance conditionnelle")
- Anchor: [[WIDGET:ConceptLink:martingale_def:Martingale]] (Type: "ConceptLink", ID: "martingale_def", Topic: "Martingale")
- Anchor: [[WIDGET:ConceptLink:submartingale_def:Sous-martingale]] (Type: "ConceptLink", ID: "submartingale_def", Topic: "Sous-martingale")
- Anchor: [[WIDGET:ConceptLink:supermartingale_def:Sur-martingale]] (Type: "ConceptLink", ID: "supermartingale_def", Topic: "Sur-martingale")
- Anchor: [[WIDGET:RealPerson:doob_joseph:Joseph L. Doob]] (Type: "RealPerson", ID: "doob_joseph", Topic: "Joseph L. Doob")
- Anchor: [[WIDGET:Glossary:stopping_time:temps d'arrêt]] (Type: "Glossary", ID: "stopping_time", Topic: "temps d'arrêt")
- Anchor: [[WIDGET:RealPerson:cox_john:John C. Cox]] (Type: "RealPerson", ID: "cox_john", Topic: "John C. Cox")
- Anchor: [[WIDGET:RealPerson:ross_stephen:Stephen A. Ross]] (Type: "RealPerson", ID: "ross_stephen", Topic: "Stephen A. Ross")
- Anchor: [[WIDGET:RealPerson:rubinstein_mark:Mark Rubinstein]] (Type: "RealPerson", ID: "rubinstein_mark", Topic: "Mark Rubinstein")
- Anchor: [[WIDGET:Glossary:arbitrage:arbitrage]] (Type: "Glossary", ID: "arbitrage", Topic: "arbitrage")
- Anchor: [[WIDGET:ConceptLink:risk_neutral_measure:Mesure de probabilité risque-neutre]] (Type: "ConceptLink", ID: "risk_neutral_measure", Topic: "Mesure de probabilité risque-neutre")
- Anchor: [[WIDGET:ConceptLink:discrete_stochastic_process:processus stochastiques discrets]] (Type: "ConceptLink", ID: "discrete_stochastic_process", Topic: "processus stochastiques discrets")
- Anchor: [[WIDGET:Glossary:martingale:martingale]] (Type: "Glossary", ID: "martingale", Topic: "martingale")
- Anchor: [[WIDGET:ConceptLink:crr_model:modèle de Cox-Ross-Rubinstein (CRR)]] (Type: "ConceptLink", ID: "crr_model", Topic: "modèle de Cox-Ross-Rubinstein (CRR)")
- Anchor: [[WIDGET:RealPerson:shreve_steven:Steven E. Shreve]] (Type: "RealPerson", ID: "shreve_steven", Topic: "Steven E. Shreve")
- Anchor: [[WIDGET:ConceptLink:black_scholes:Black-Scholes-Merton]] (Type: "ConceptLink", ID: "black_scholes", Topic: "Black-Scholes-Merton")

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
"Widget Block 2 rejected.
Detailed errors:
- Field "interactiveComponents": The interactiveComponents array contains several issues: 1. The component with id: black_scholes_person is incorrectly typed as RealPerson. Its name and year properties refer to a model or multiple individuals, not a single person. This should either be a ConceptLink or split into individual RealPerson entries for Black, Scholes, and Merton. 2. The RealPerson component with id: rubinstein_mark has an incorrect end year in its year property. Mark Rubinstein is still alive. 3. The Glossary components with id: stopping_time, id: arbitrage_glossary, and id: martingale incorrectly include a year property, which is not applicable for Glossary components and should be removed."
Please fix these issues and regenerate.