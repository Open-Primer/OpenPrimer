You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:ConceptLink:marches_financiers:marchés financiers]] (Type: "ConceptLink", ID: "marches_financiers", Topic: "marchés financiers")
- Anchor: [[WIDGET:Glossary:bulle_speculative:bulle spéculative]] (Type: "Glossary", ID: "bulle_speculative", Topic: "bulle spéculative")
- Anchor: [[WIDGET:RealPerson:hyman_minsky:Hyman Minsky]] (Type: "RealPerson", ID: "hyman_minsky", Topic: "Hyman Minsky")
- Anchor: [[WIDGET:Glossary:effet_de_levier:effet de levier]] (Type: "Glossary", ID: "effet_de_levier", Topic: "effet de levier")
- Anchor: [[WIDGET:RealPerson:irving_fisher:Irving Fisher]] (Type: "RealPerson", ID: "irving_fisher", Topic: "Irving Fisher")
- Anchor: [[WIDGET:ConceptLink:risque_systemique:risque systémique]] (Type: "ConceptLink", ID: "risque_systemique", Topic: "risque systémique")
- Anchor: [[WIDGET:Glossary:bulle_financiere:bulles financières]] (Type: "Glossary", ID: "bulle_financiere", Topic: "bulles financières")
- Anchor: [[WIDGET:ConceptLink:irrational_exuberance:exubérance irrationnelle]] (Type: "ConceptLink", ID: "irrational_exuberance", Topic: "exubérance irrationnelle")
- Anchor: [[WIDGET:RealPerson:robert_shiller:Robert Shiller]] (Type: "RealPerson", ID: "robert_shiller", Topic: "Robert Shiller")
- Anchor: [[WIDGET:RealPerson:irving_fisher:Irving Fisher]] (Type: "RealPerson", ID: "irving_fisher", Topic: "Irving Fisher")
- Anchor: [[WIDGET:Glossary:politiques_macroprudentielles:politiques macroprudentielles]] (Type: "Glossary", ID: "politiques_macroprudentielles", Topic: "politiques macroprudentielles")
- Anchor: [[WIDGET:ConceptLink:risque_systemique:risque systémique]] (Type: "ConceptLink", ID: "risque_systemique", Topic: "risque systémique")
- Anchor: [[WIDGET:ConceptLink:exuberance_irrationnelle:exubérance irrationnelle]] (Type: "ConceptLink", ID: "exuberance_irrationnelle", Topic: "exubérance irrationnelle")
- Anchor: [[WIDGET:RealPerson:hyman_minsky:Hyman Minsky]] (Type: "RealPerson", ID: "hyman_minsky", Topic: "Hyman Minsky")
- Anchor: [[WIDGET:ConceptLink:contagion_financiere:contagion financière]] (Type: "ConceptLink", ID: "contagion_financiere", Topic: "contagion financière")

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
"The block contains multiple instances of the placeholder value "N/A" for the 'year' property within various interactive components. This violates the rule against placeholders and incomplete fields. Specifically, for 'RealPerson' components, the 'year' property should contain actual dates or be null, not a placeholder. For 'ConceptLink' and 'Glossary' components, while 'year' is optional, it should be omitted or set to null rather than using "N/A".
Detailed errors:
- Field "interactiveComponents": The 'year' property for all 'RealPerson' components (Hyman Minsky, Irving Fisher, Robert Shiller) is set to "N/A", which is a placeholder. This property should contain actual birth/death dates or be null if unknown. Additionally, for all 'ConceptLink' and 'Glossary' components, the 'year' property is also set to "N/A". For these component types, the 'year' property should either be omitted entirely or explicitly set to null if not applicable or unresolved, rather than using a placeholder."
Please fix these issues and regenerate.