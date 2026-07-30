You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:ConceptLink:cite_etat:cités-États]] (Type: "ConceptLink", ID: "cite_etat", Topic: "cités-États")
- Anchor: [[WIDGET:ConceptLink:democratie:démocratie]] (Type: "ConceptLink", ID: "democratie", Topic: "démocratie")
- Anchor: [[WIDGET:Glossary:satrapie:satrapies]] (Type: "Glossary", ID: "satrapie", Topic: "satrapies")
- Anchor: [[WIDGET:RealPerson:miltiade:Miltiade]] (Type: "RealPerson", ID: "miltiade", Topic: "Miltiade")
- Anchor: [[WIDGET:RealPerson:leonidas:Léonidas]] (Type: "RealPerson", ID: "leonidas", Topic: "Léonidas")
- Anchor: [[WIDGET:Glossary:hoplite:hoplite]] (Type: "Glossary", ID: "hoplite", Topic: "hoplite")
- Anchor: [[WIDGET:Glossary:triere:trières]] (Type: "Glossary", ID: "triere", Topic: "trières")
- Anchor: [[WIDGET:ConceptLink:ligue_delos:Ligue de Délos]] (Type: "ConceptLink", ID: "ligue_delos", Topic: "Ligue de Délos")
- Anchor: [[WIDGET:ConceptLink:ligue_delos:Ligue de Délos]] (Type: "ConceptLink", ID: "ligue_delos", Topic: "Ligue de Délos")
- Anchor: [[WIDGET:Glossary:hegemonie:hégémonie]] (Type: "Glossary", ID: "hegemonie", Topic: "hégémonie")
- Anchor: [[WIDGET:RealPerson:pericles:Périclès]] (Type: "RealPerson", ID: "pericles", Topic: "Périclès")
- Anchor: [[WIDGET:ConceptLink:democratie_athenienne:démocratie athénienne]] (Type: "ConceptLink", ID: "democratie_athenienne", Topic: "démocratie athénienne")
- Anchor: [[WIDGET:ConceptLink:ligue_du_peloponnese:Ligue du Péloponnèse]] (Type: "ConceptLink", ID: "ligue_du_peloponnese", Topic: "Ligue du Péloponnèse")
- Anchor: [[WIDGET:RealPerson:thucydide:Thucydide]] (Type: "RealPerson", ID: "thucydide", Topic: "Thucydide")
- Anchor: [[WIDGET:ConceptLink:polis_cl:cité-État]] (Type: "ConceptLink", ID: "polis_cl", Topic: "cité-État")
- Anchor: [[WIDGET:Glossary:oligarchie_gl:oligarchie]] (Type: "Glossary", ID: "oligarchie_gl", Topic: "oligarchie")
- Anchor: [[WIDGET:RealPerson:philip_ii_rp:Philippe II]] (Type: "RealPerson", ID: "philip_ii_rp", Topic: "Philippe II")
- Anchor: [[WIDGET:RealPerson:philip_ii_rp:Philippe II]] (Type: "RealPerson", ID: "philip_ii_rp", Topic: "Philippe II")
- Anchor: [[WIDGET:Glossary:phalanx_gl:phalange]] (Type: "Glossary", ID: "phalanx_gl", Topic: "phalange")
- Anchor: [[WIDGET:RealPerson:alexander_the_great_rp:Alexandre le Grand]] (Type: "RealPerson", ID: "alexander_the_great_rp", Topic: "Alexandre le Grand")
- Anchor: [[WIDGET:ConceptLink:polis_cl:cité]] (Type: "ConceptLink", ID: "polis_cl", Topic: "cité")
- Anchor: [[WIDGET:Glossary:tyrannie_gl:tyrannie]] (Type: "Glossary", ID: "tyrannie_gl", Topic: "tyrannie")
- Anchor: [[WIDGET:RealPerson:thucydides_rp:Thucydide]] (Type: "RealPerson", ID: "thucydides_rp", Topic: "Thucydide")
- Anchor: [[WIDGET:ConceptLink:democratie_cl:démocratie]] (Type: "ConceptLink", ID: "democratie_cl", Topic: "démocratie")

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
"The 'interactiveComponents' array contains duplicate entries for the same concepts and persons. This redundancy should be resolved by ensuring each unique concept or person is represented only once.
Detailed errors:
- Field "interactiveComponents": The 'interactiveComponents' array includes duplicate entries for 'Thucydide' (ids 'thucydide' and 'thucydides_rp'), 'démocratie' (ids 'democratie' and 'democratie_cl'), and 'cité-État' (ids 'cite_etat' and 'polis_cl'). These identical entries should be consolidated to avoid redundancy and improve content management."
Please fix these issues and regenerate.