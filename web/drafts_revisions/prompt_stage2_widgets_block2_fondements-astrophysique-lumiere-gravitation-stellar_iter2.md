You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:ConceptLink:astrophysique_moderne:astrophysique moderne]] (Type: "ConceptLink", ID: "astrophysique_moderne", Topic: "astrophysique moderne")
- Anchor: [[WIDGET:ConceptLink:rayonnement_electromagnetique:rayonnement électromagnétique]] (Type: "ConceptLink", ID: "rayonnement_electromagnetique", Topic: "rayonnement électromagnétique")
- Anchor: [[WIDGET:Glossary:corps_noir:corps noir]] (Type: "Glossary", ID: "corps_noir", Topic: "corps noir")
- Anchor: [[WIDGET:Glossary:spectroscopie:spectroscopie]] (Type: "Glossary", ID: "spectroscopie", Topic: "spectroscopie")
- Anchor: [[WIDGET:RealPerson:gustav_kirchhoff:Gustav Kirchhoff]] (Type: "RealPerson", ID: "gustav_kirchhoff", Topic: "Gustav Kirchhoff")
- Anchor: [[WIDGET:RealPerson:isaac_newton:Isaac Newton]] (Type: "RealPerson", ID: "isaac_newton", Topic: "Isaac Newton")
- Anchor: [[WIDGET:RealPerson:albert_einstein:Albert Einstein]] (Type: "RealPerson", ID: "albert_einstein", Topic: "Albert Einstein")
- Anchor: [[WIDGET:ConceptLink:courbure_espace_temps:courbure de l'espace-temps]] (Type: "ConceptLink", ID: "courbure_espace_temps", Topic: "courbure de l'espace-temps")
- Anchor: [[WIDGET:ConceptLink:sequence_principale:séquence principale]] (Type: "ConceptLink", ID: "sequence_principale", Topic: "séquence principale")
- Anchor: [[WIDGET:Glossary:diagramme_hr:Diagramme de Hertzsprung-Russell]] (Type: "Glossary", ID: "diagramme_hr", Topic: "Diagramme de Hertzsprung-Russell")
- Anchor: [[WIDGET:RealPerson:ejnar_hertzsprung:Ejnar Hertzsprung]] (Type: "RealPerson", ID: "ejnar_hertzsprung", Topic: "Ejnar Hertzsprung")
- Anchor: [[WIDGET:RealPerson:henry_norris_russell:Henry Norris Russell]] (Type: "RealPerson", ID: "henry_norris_russell", Topic: "Henry Norris Russell")
- Anchor: [[WIDGET:ConceptLink:spectroscopie_astronomique:spectroscopie astronomique]] (Type: "ConceptLink", ID: "spectroscopie_astronomique", Topic: "spectroscopie astronomique")
- Anchor: [[WIDGET:ConceptLink:gravitation:gravitation]] (Type: "ConceptLink", ID: "gravitation", Topic: "gravitation")
- Anchor: [[WIDGET:RealPerson:isaac_newton:Isaac Newton]] (Type: "RealPerson", ID: "isaac_newton", Topic: "Isaac Newton")
- Anchor: [[WIDGET:Glossary:relativite_generale:relativité générale]] (Type: "Glossary", ID: "relativite_generale", Topic: "relativité générale")
- Anchor: [[WIDGET:RealPerson:albert_einstein:Albert Einstein]] (Type: "RealPerson", ID: "albert_einstein", Topic: "Albert Einstein")
- Anchor: [[WIDGET:ConceptLink:evolution_stellaire:évolution stellaire]] (Type: "ConceptLink", ID: "evolution_stellaire", Topic: "évolution stellaire")
- Anchor: [[WIDGET:Glossary:diagramme_hr:Diagramme de Hertzsprung-Russell]] (Type: "Glossary", ID: "diagramme_hr", Topic: "Diagramme de Hertzsprung-Russell")

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

🚨 PREVIOUS CRITIQUE:
"The 'interactiveComponents' array contains multiple components with empty 'props' objects. All interactive elements must be fully populated with real, high-quality, professional educational content, and incomplete fields like empty 'props' are not allowed.
Detailed errors:
- Field "interactiveComponents": All components within the 'interactiveComponents' array have empty 'props' objects. For 'ConceptLink', 'Glossary', and 'RealPerson' components, the 'props' object must contain relevant data (e.g., for 'RealPerson', it should include biography details, dates, and a Wikipedia link). These empty 'props' are considered incomplete fields and must be populated."
Please fix these issues and regenerate.