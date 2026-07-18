You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:ConceptLink:finance_quantitative:finance quantitative]] (Type: "ConceptLink", ID: "finance_quantitative", Topic: "finance quantitative")
- Anchor: [[WIDGET:Glossary:processus_stochastique:processus stochastiques]] (Type: "Glossary", ID: "processus_stochastique", Topic: "processus stochastiques")
- Anchor: [[WIDGET:RealPerson:shreve:Steven E. Shreve]] (Type: "RealPerson", ID: "shreve", Topic: "Steven E. Shreve")
- Anchor: [[WIDGET:RealPerson:bjork:Tomas Björk]] (Type: "RealPerson", ID: "bjork", Topic: "Tomas Björk")
- Anchor: [[WIDGET:ConceptLink:sigma_algebre:σ-algèbre]] (Type: "ConceptLink", ID: "sigma_algebre", Topic: "σ-algèbre")
- Anchor: [[WIDGET:Glossary:mesure_probabilite:mesure de probabilité]] (Type: "Glossary", ID: "mesure_probabilite", Topic: "mesure de probabilité")
- Anchor: [[WIDGET:ConceptLink:variable_aleatoire:variable aléatoire]] (Type: "ConceptLink", ID: "variable_aleatoire", Topic: "variable aléatoire")
- Anchor: [[WIDGET:Glossary:fonction_mesurable:fonction mesurable]] (Type: "Glossary", ID: "fonction_mesurable", Topic: "fonction mesurable")
- Anchor: [[WIDGET:ConceptLink:esperance_conditionnelle:espérance conditionnelle]] (Type: "ConceptLink", ID: "esperance_conditionnelle", Topic: "espérance conditionnelle")
- Anchor: [[WIDGET:RealPerson:kolmogorov:Andreï Kolmogorov]] (Type: "RealPerson", ID: "kolmogorov", Topic: "Andreï Kolmogorov")
- Anchor: [[WIDGET:ConceptLink:espace_mesurable:espaces mesurables]] (Type: "ConceptLink", ID: "espace_mesurable", Topic: "espaces mesurables")
- Anchor: [[WIDGET:Glossary:tribu:tribus]] (Type: "Glossary", ID: "tribu", Topic: "tribus")
- Anchor: [[WIDGET:ConceptLink:variable_aleatoire:variables aléatoires]] (Type: "ConceptLink", ID: "variable_aleatoire", Topic: "variables aléatoires")
- Anchor: [[WIDGET:ConceptLink:esperance_conditionnelle:espérance conditionnelle]] (Type: "ConceptLink", ID: "esperance_conditionnelle", Topic: "espérance conditionnelle")
- Anchor: [[WIDGET:ConceptLink:martingale:martingales]] (Type: "ConceptLink", ID: "martingale", Topic: "martingales")
- Anchor: [[WIDGET:Glossary:integrale_stochastique:intégrales stochastiques]] (Type: "Glossary", ID: "integrale_stochastique", Topic: "intégrales stochastiques")
- Anchor: [[WIDGET:RealPerson:ito:Kiyosi Itô]] (Type: "RealPerson", ID: "ito", Topic: "Kiyosi Itô")

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
"The interactive components block contains an incorrect Wikipedia URL for one entry and boilerplate 'year' values across all entries. Please refer to the 'fields' section for detailed feedback.
Detailed errors:
- Field "interactiveComponents": The `interactiveComponents` array contains multiple issues. 1. Incorrect Wikipedia URL: The component with `id: 'tribu'` has a `searchQuery` of 'Tribu (mathématiques)' but its `wikipediaUrl` points to the 'Σ-algèbre' page. These are distinct Wikipedia pages, and the URL should be corrected to `https://fr.wikipedia.org/wiki/Tribu_(math%C3%A9matiques)`. 2. Boilerplate 'year' property: The `year` property is present with the value '2023' for *all* interactive components. This field is not a standard or meaningful property for most of these component types (e.g., a concept or a person does not inherently have a 'year' of '2023' in this context, unlike a publication year). Its universal presence with the same value suggests it is a boilerplate or template value rather than specific, high-quality data, which violates the rule against placeholders and template values. This field should either be removed if not applicable, or populated with specific, meaningful data if it serves a defined purpose for each component type."
Please fix these issues and regenerate.