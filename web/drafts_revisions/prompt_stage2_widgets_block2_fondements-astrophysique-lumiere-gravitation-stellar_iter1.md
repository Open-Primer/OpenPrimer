You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:ConceptLink:astrophysique_moderne:astrophysique moderne]] (Type: "ConceptLink", ID: "astrophysique_moderne", Topic: "astrophysique moderne")
- Anchor: [[WIDGET:Glossary:evolution_stellaire:évolution stellaire]] (Type: "Glossary", ID: "evolution_stellaire", Topic: "évolution stellaire")
- Anchor: [[WIDGET:ConceptLink:rayonnement_electromagnetique:rayonnement électromagnétique]] (Type: "ConceptLink", ID: "rayonnement_electromagnetique", Topic: "rayonnement électromagnétique")
- Anchor: [[WIDGET:ConceptLink:corps_noir:corps noir]] (Type: "ConceptLink", ID: "corps_noir", Topic: "corps noir")
- Anchor: [[WIDGET:Glossary:loi_de_wien:loi de Wien]] (Type: "Glossary", ID: "loi_de_wien", Topic: "loi de Wien")
- Anchor: [[WIDGET:RealPerson:wilhelm_wien:Wilhelm Wien]] (Type: "RealPerson", ID: "wilhelm_wien", Topic: "Wilhelm Wien")
- Anchor: [[WIDGET:Glossary:loi_de_stefan_boltzmann:loi de Stefan-Boltzmann]] (Type: "Glossary", ID: "loi_de_stefan_boltzmann", Topic: "loi de Stefan-Boltzmann")
- Anchor: [[WIDGET:RealPerson:josef_stefan:Josef Stefan]] (Type: "RealPerson", ID: "josef_stefan", Topic: "Josef Stefan")
- Anchor: [[WIDGET:ConceptLink:analyse_spectrale:analyse spectrale]] (Type: "ConceptLink", ID: "analyse_spectrale", Topic: "analyse spectrale")
- Anchor: [[WIDGET:ConceptLink:hr_diagram:Diagramme de Hertzsprung-Russell]] (Type: "ConceptLink", ID: "hr_diagram", Topic: "Diagramme de Hertzsprung-Russell")
- Anchor: [[WIDGET:RealPerson:ejnar_hertzsprung:Ejnar Hertzsprung]] (Type: "RealPerson", ID: "ejnar_hertzsprung", Topic: "Ejnar Hertzsprung")
- Anchor: [[WIDGET:RealPerson:henry_norris_russell:Henry Norris Russell]] (Type: "RealPerson", ID: "henry_norris_russell", Topic: "Henry Norris Russell")
- Anchor: [[WIDGET:Glossary:sequence_principale:Séquence Principale]] (Type: "Glossary", ID: "sequence_principale", Topic: "Séquence Principale")
- Anchor: [[WIDGET:ConceptLink:gravitation_newtonienne:gravitation newtonienne]] (Type: "ConceptLink", ID: "gravitation_newtonienne", Topic: "gravitation newtonienne")
- Anchor: [[WIDGET:RealPerson:isaac_newton:Isaac Newton]] (Type: "RealPerson", ID: "isaac_newton", Topic: "Isaac Newton")
- Anchor: [[WIDGET:RealPerson:albert_einstein:Albert Einstein]] (Type: "RealPerson", ID: "albert_einstein", Topic: "Albert Einstein")
- Anchor: [[WIDGET:Glossary:relativite_generale:Relativité Générale]] (Type: "Glossary", ID: "relativite_generale", Topic: "Relativité Générale")
- Anchor: [[WIDGET:RealPerson:isaac_newton:Isaac Newton]] (Type: "RealPerson", ID: "isaac_newton", Topic: "Isaac Newton")
- Anchor: [[WIDGET:RealPerson:albert_einstein:Albert Einstein]] (Type: "RealPerson", ID: "albert_einstein", Topic: "Albert Einstein")
- Anchor: [[WIDGET:ConceptLink:astrophysique_moderne:astrophysique moderne]] (Type: "ConceptLink", ID: "astrophysique_moderne", Topic: "astrophysique moderne")
- Anchor: [[WIDGET:Glossary:matiere_noire:matière noire]] (Type: "Glossary", ID: "matiere_noire", Topic: "matière noire")
- Anchor: [[WIDGET:Glossary:energie_noire:énergie noire]] (Type: "Glossary", ID: "energie_noire", Topic: "énergie noire")

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