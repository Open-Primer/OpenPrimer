You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:ConceptLink:heritage_grec:héritage culturel]] (Type: "ConceptLink", ID: "heritage_grec", Topic: "héritage culturel")
- Anchor: [[WIDGET:Glossary:cite_etat:cités-États]] (Type: "Glossary", ID: "cite_etat", Topic: "cités-États")
- Anchor: [[WIDGET:Glossary:thalassocratie:thalassocratie]] (Type: "Glossary", ID: "thalassocratie", Topic: "thalassocratie")
- Anchor: [[WIDGET:RealPerson:homere:Homère]] (Type: "RealPerson", ID: "homere", Topic: "Homère")
- Anchor: [[WIDGET:Glossary:thalassocratie:thalassocratie]] (Type: "Glossary", ID: "thalassocratie", Topic: "thalassocratie")
- Anchor: [[WIDGET:ConceptLink:knossos:Knossos]] (Type: "ConceptLink", ID: "knossos", Topic: "Knossos")
- Anchor: [[WIDGET:Glossary:fresque:fresques]] (Type: "Glossary", ID: "fresque", Topic: "fresques")
- Anchor: [[WIDGET:ConceptLink:lineaire_a:Linéaire A]] (Type: "ConceptLink", ID: "lineaire_a", Topic: "Linéaire A")
- Anchor: [[WIDGET:Glossary:labyrinthe:labyrinthe]] (Type: "Glossary", ID: "labyrinthe", Topic: "labyrinthe")
- Anchor: [[WIDGET:RealPerson:dedale:Dédale]] (Type: "RealPerson", ID: "dedale", Topic: "Dédale")
- Anchor: [[WIDGET:Glossary:murs_cyclopeens:murs cyclopéens]] (Type: "Glossary", ID: "murs_cyclopeens", Topic: "murs cyclopéens")
- Anchor: [[WIDGET:ConceptLink:lineaire_b:Linéaire B]] (Type: "ConceptLink", ID: "lineaire_b", Topic: "Linéaire B")
- Anchor: [[WIDGET:RealPerson:homere:Homère]] (Type: "RealPerson", ID: "homere", Topic: "Homère")
- Anchor: [[WIDGET:ConceptLink:guerre_troie:Guerre de Troie]] (Type: "ConceptLink", ID: "guerre_troie", Topic: "Guerre de Troie")
- Anchor: [[WIDGET:RealPerson:agamemnon:Agamemnon]] (Type: "RealPerson", ID: "agamemnon", Topic: "Agamemnon")
- Anchor: [[WIDGET:RealPerson:ulysse:Ulysse]] (Type: "RealPerson", ID: "ulysse", Topic: "Ulysse")
- Anchor: [[WIDGET:ConceptLink:thalassocratie:Thalassocratie]] (Type: "ConceptLink", ID: "thalassocratie", Topic: "Thalassocratie")
- Anchor: [[WIDGET:RealPerson:arthur_evans:Arthur Evans]] (Type: "RealPerson", ID: "arthur_evans", Topic: "Arthur Evans")
- Anchor: [[WIDGET:Glossary:polis:Cités-États]] (Type: "Glossary", ID: "polis", Topic: "Cités-États")

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
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.
2. "RealPerson" or "HistoricalPerson":
   - "name": (string) Full name of the person (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this person (2-4 sentences).
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "dates", "year", "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.
3. "ConceptLink":
   - "name": (string) Name of the concept (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this concept (2-4 sentences).
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.
4. "EventLink", "HistoricalEventLink", "EvenementHistorique", or "ÉvénementHistorique":
   - "name": (string) Name of the event (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this event (2-4 sentences).
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "dates", "year", "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.
5. "Location":
   - "name": (string) Name of the location (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this location (2-4 sentences).
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.
6. "Glossary":
   - "term": (string) Glossary vocabulary term.
   - "definition": (string) Detailed vocabulary definition (2-4 sentences).
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.

DO NOT output any properties that are not explicitly defined in the props catalog above for a given componentType. For instance, do NOT output "year", "dates", "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery" for Biography, RealPerson, HistoricalPerson, ConceptLink, HistoricalEventLink, Location, or Glossary; if you do, the critique agent will reject the block.

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
"The 'interactiveComponents' array contains duplicate IDs. The ID 'thalassocratie' is used for two different Glossary components. All IDs within this array must be unique to ensure proper functionality and referencing.
Detailed errors:
- Field "interactiveComponents": The 'interactiveComponents' array contains duplicate IDs. Specifically, the ID 'thalassocratie' is used more than once. Each component must have a unique 'id'."
Please fix these issues and regenerate.