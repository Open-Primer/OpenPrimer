You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:ConceptLink:cosmologie_physique:cosmologie physique]] (Type: "ConceptLink", ID: "cosmologie_physique", Topic: "cosmologie physique")
- Anchor: [[WIDGET:RealPerson:einstein:Albert Einstein]] (Type: "RealPerson", ID: "einstein", Topic: "Albert Einstein")
- Anchor: [[WIDGET:Glossary:univers_observable:Univers observable]] (Type: "Glossary", ID: "univers_observable", Topic: "Univers observable")
- Anchor: [[WIDGET:Glossary:decalage_vers_rouge:décalage vers le rouge]] (Type: "Glossary", ID: "decalage_vers_rouge", Topic: "décalage vers le rouge")
- Anchor: [[WIDGET:RealPerson:v_slipher:Vesto Slipher]] (Type: "RealPerson", ID: "v_slipher", Topic: "Vesto Slipher")
- Anchor: [[WIDGET:RealPerson:e_hubble:Edwin Hubble]] (Type: "RealPerson", ID: "e_hubble", Topic: "Edwin Hubble")
- Anchor: [[WIDGET:RealPerson:g_lemaitre:Georges Lemaître]] (Type: "RealPerson", ID: "g_lemaitre", Topic: "Georges Lemaître")
- Anchor: [[WIDGET:ConceptLink:loi_hubble_lemaitre:Loi de Hubble-Lemaître]] (Type: "ConceptLink", ID: "loi_hubble_lemaitre", Topic: "Loi de Hubble-Lemaître")
- Anchor: [[WIDGET:ConceptLink:constante_hubble:constante de Hubble]] (Type: "ConceptLink", ID: "constante_hubble", Topic: "constante de Hubble")
- Anchor: [[WIDGET:Glossary:chandelles_standard:chandelles standard]] (Type: "Glossary", ID: "chandelles_standard", Topic: "chandelles standard")
- Anchor: [[WIDGET:ConceptLink:relativite_generale:Relativité Générale]] (Type: "ConceptLink", ID: "relativite_generale", Topic: "Relativité Générale")
- Anchor: [[WIDGET:RealPerson:a_einstein:Albert Einstein]] (Type: "RealPerson", ID: "a_einstein", Topic: "Albert Einstein")
- Anchor: [[WIDGET:ConceptLink:principe_cosmologique:Principe Cosmologique]] (Type: "ConceptLink", ID: "principe_cosmologique", Topic: "Principe Cosmologique")
- Anchor: [[WIDGET:Glossary:metrique_flrw:Métrique de Friedmann-Lemaître-Robertson-Walker (FLRW)]] (Type: "Glossary", ID: "metrique_flrw", Topic: "Métrique de Friedmann-Lemaître-Robertson-Walker (FLRW)")
- Anchor: [[WIDGET:Glossary:fond_diffus_cosmologique:Fond Diffus Cosmologique (CMB)]] (Type: "Glossary", ID: "fond_diffus_cosmologique", Topic: "Fond Diffus Cosmologique (CMB)")
- Anchor: [[WIDGET:RealPerson:a_penzias:Arno Penzias]] (Type: "RealPerson", ID: "a_penzias", Topic: "Arno Penzias")
- Anchor: [[WIDGET:RealPerson:r_wilson:Robert Wilson]] (Type: "RealPerson", ID: "r_wilson", Topic: "Robert Wilson")
- Anchor: [[WIDGET:ConceptLink:recombinaison_cosmique:recombinaison]] (Type: "ConceptLink", ID: "recombinaison_cosmique", Topic: "recombinaison")
- Anchor: [[WIDGET:ConceptLink:matiere_noire:Matière Noire]] (Type: "ConceptLink", ID: "matiere_noire", Topic: "Matière Noire")
- Anchor: [[WIDGET:ConceptLink:energie_sombre:Énergie Sombre]] (Type: "ConceptLink", ID: "energie_sombre", Topic: "Énergie Sombre")
- Anchor: [[WIDGET:RealPerson:f_zwicky:Fritz Zwicky]] (Type: "RealPerson", ID: "f_zwicky", Topic: "Fritz Zwicky")
- Anchor: [[WIDGET:RealPerson:s_perlmutter:Saul Perlmutter]] (Type: "RealPerson", ID: "s_perlmutter", Topic: "Saul Perlmutter")
- Anchor: [[WIDGET:RealPerson:b_schmidt:Brian Schmidt]] (Type: "RealPerson", ID: "b_schmidt", Topic: "Brian Schmidt")
- Anchor: [[WIDGET:RealPerson:a_riess:Adam Riess]] (Type: "RealPerson", ID: "a_riess", Topic: "Adam Riess")
- Anchor: [[WIDGET:ConceptLink:matiere_noire:Matière Noire]] (Type: "ConceptLink", ID: "matiere_noire", Topic: "Matière Noire")
- Anchor: [[WIDGET:ConceptLink:energie_sombre:Énergie Sombre]] (Type: "ConceptLink", ID: "energie_sombre", Topic: "Énergie Sombre")
- Anchor: [[WIDGET:Glossary:flrw_metric:Métrique de Friedmann-Lemaître-Robertson-Walker]] (Type: "Glossary", ID: "flrw_metric", Topic: "Métrique de Friedmann-Lemaître-Robertson-Walker")
- Anchor: [[WIDGET:ConceptLink:densite_critique:densité critique]] (Type: "ConceptLink", ID: "densite_critique", Topic: "densité critique")
- Anchor: [[WIDGET:RealPerson:s_hawking:Stephen Hawking]] (Type: "RealPerson", ID: "s_hawking", Topic: "Stephen Hawking")
- Anchor: [[WIDGET:RealPerson:e_hubble:Edwin Hubble]] (Type: "RealPerson", ID: "e_hubble", Topic: "Edwin Hubble")

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
"The widget block contains placeholder text in the 'year' property of multiple interactive components. All fields must be fully populated with real, high-quality content, and 'N/A' or similar template values are not permitted.
Detailed errors:
- Field "interactiveComponents": Several interactive components contain placeholder text 'N/A' in their 'year' property. Specifically, the components with 'id's 'cosmologie_physique', 'univers_observable', and 'decalage_vers_rouge' have 'year' values like 'N/A (concept established over time, not a single year or event.)', 'N/A (concept)', and 'N/A (phenomenon)'. The 'year' field must either contain a specific year or be entirely omitted if not applicable, but must not contain any placeholder text."
Please fix these issues and regenerate.