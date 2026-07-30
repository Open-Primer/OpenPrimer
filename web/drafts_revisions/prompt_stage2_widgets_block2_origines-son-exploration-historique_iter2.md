You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:Glossary:acoustique:acoustique]] (Type: "Glossary", ID: "acoustique", Topic: "acoustique")
- Anchor: [[WIDGET:RealPerson:pythagore:Pythagore]] (Type: "RealPerson", ID: "pythagore", Topic: "Pythagore")
- Anchor: [[WIDGET:ConceptLink:monochord:monocorde]] (Type: "ConceptLink", ID: "monochord", Topic: "monocorde")
- Anchor: [[WIDGET:ConceptLink:harmonie_des_spheres:Harmonie des sphères]] (Type: "ConceptLink", ID: "harmonie_des_spheres", Topic: "Harmonie des sphères")
- Anchor: [[WIDGET:Biography:pythagore_bio:Biographie de Pythagore, mathématicien et philosophe grec, fondateur de l'école pythagoricienne, célèbre pour ses contributions à la théorie musicale et aux mathématiques.]] (Type: "Biography", ID: "pythagore_bio", Topic: "Biographie de Pythagore, mathématicien et philosophe grec, fondateur de l'école pythagoricienne, célèbre pour ses contributions à la théorie musicale et aux mathématiques.")
- Anchor: [[WIDGET:RealPerson:aristote:Aristote]] (Type: "RealPerson", ID: "aristote", Topic: "Aristote")
- Anchor: [[WIDGET:Glossary:propagation_sonore:propagation sonore]] (Type: "Glossary", ID: "propagation_sonore", Topic: "propagation sonore")
- Anchor: [[WIDGET:RealPerson:al_farabi:Al-Farabi]] (Type: "RealPerson", ID: "al_farabi", Topic: "Al-Farabi")
- Anchor: [[WIDGET:RealPerson:avicenne:Avicenne]] (Type: "RealPerson", ID: "avicenne", Topic: "Avicenne")
- Anchor: [[WIDGET:Glossary:scholastique:scholastique]] (Type: "Glossary", ID: "scholastique", Topic: "scholastique")
- Anchor: [[WIDGET:RealPerson:leonardo_da_vinci:Léonard de Vinci]] (Type: "RealPerson", ID: "leonardo_da_vinci", Topic: "Léonard de Vinci")
- Anchor: [[WIDGET:ConceptLink:echo:l'écho]] (Type: "ConceptLink", ID: "echo", Topic: "l'écho")
- Anchor: [[WIDGET:Biography:galileo_galilei_bio:Biographie de Galilée, astronome, physicien et ingénieur italien, souvent considéré comme le père de la science moderne pour son rôle central dans la révolution scientifique et ses contributions à la méthode expérimentale.]] (Type: "Biography", ID: "galileo_galilei_bio", Topic: "Biographie de Galilée, astronome, physicien et ingénieur italien, souvent considéré comme le père de la science moderne pour son rôle central dans la révolution scientifique et ses contributions à la méthode expérimentale.")
- Anchor: [[WIDGET:RealPerson:galileo_galilei:Galilée]] (Type: "RealPerson", ID: "galileo_galilei", Topic: "Galilée")
- Anchor: [[WIDGET:ConceptLink:frequence:fréquence]] (Type: "ConceptLink", ID: "frequence", Topic: "fréquence")
- Anchor: [[WIDGET:ConceptLink:resonance:résonance]] (Type: "ConceptLink", ID: "resonance", Topic: "résonance")
- Anchor: [[WIDGET:RealPerson:marin_mersenne:Marin Mersenne]] (Type: "RealPerson", ID: "marin_mersenne", Topic: "Marin Mersenne")
- Anchor: [[WIDGET:ConceptLink:frequence:fréquence]] (Type: "ConceptLink", ID: "frequence", Topic: "fréquence")
- Anchor: [[WIDGET:ConceptLink:onde_sonore:onde sonore]] (Type: "ConceptLink", ID: "onde_sonore", Topic: "onde sonore")
- Anchor: [[WIDGET:Glossary:milieu_elastique:milieu élastique]] (Type: "Glossary", ID: "milieu_elastique", Topic: "milieu élastique")
- Anchor: [[WIDGET:RealPerson:pythagore:Pythagore]] (Type: "RealPerson", ID: "pythagore", Topic: "Pythagore")
- Anchor: [[WIDGET:ConceptLink:harmonie_musicale:harmonie musicale]] (Type: "ConceptLink", ID: "harmonie_musicale", Topic: "harmonie musicale")
- Anchor: [[WIDGET:RealPerson:aristote:Aristote]] (Type: "RealPerson", ID: "aristote", Topic: "Aristote")
- Anchor: [[WIDGET:Glossary:onde_mecanique:onde mécanique]] (Type: "Glossary", ID: "onde_mecanique", Topic: "onde mécanique")
- Anchor: [[WIDGET:RealPerson:al_haytham:Al-Haytham]] (Type: "RealPerson", ID: "al_haytham", Topic: "Al-Haytham")
- Anchor: [[WIDGET:RealPerson:roger_bacon:Roger Bacon]] (Type: "RealPerson", ID: "roger_bacon", Topic: "Roger Bacon")
- Anchor: [[WIDGET:RealPerson:galilee:Galilée]] (Type: "RealPerson", ID: "galilee", Topic: "Galilée")
- Anchor: [[WIDGET:ConceptLink:vibration:vibration]] (Type: "ConceptLink", ID: "vibration", Topic: "vibration")
- Anchor: [[WIDGET:RealPerson:marin_mersenne:Marin Mersenne]] (Type: "RealPerson", ID: "marin_mersenne", Topic: "Marin Mersenne")
- Anchor: [[WIDGET:ConceptLink:propagation_ondulatoire:propagation ondulatoire]] (Type: "ConceptLink", ID: "propagation_ondulatoire", Topic: "propagation ondulatoire")
- Anchor: [[WIDGET:RealPerson:isaac_newton:Isaac Newton]] (Type: "RealPerson", ID: "isaac_newton", Topic: "Isaac Newton")
- Anchor: [[WIDGET:RealPerson:pierre_simon_laplace:Pierre-Simon Laplace]] (Type: "RealPerson", ID: "pierre_simon_laplace", Topic: "Pierre-Simon Laplace")
- Anchor: [[WIDGET:RealPerson:leonhard_euler:Leonhard Euler]] (Type: "RealPerson", ID: "leonhard_euler", Topic: "Leonhard Euler")
- Anchor: [[WIDGET:RealPerson:joseph_louis_lagrange:Joseph-Louis Lagrange]] (Type: "RealPerson", ID: "joseph_louis_lagrange", Topic: "Joseph-Louis Lagrange")
- Anchor: [[WIDGET:Glossary:diffraction:diffraction]] (Type: "Glossary", ID: "diffraction", Topic: "diffraction")
- Anchor: [[WIDGET:Glossary:reflexion:réflexion]] (Type: "Glossary", ID: "reflexion", Topic: "réflexion")
- Anchor: [[WIDGET:Glossary:refraction:réfraction]] (Type: "Glossary", ID: "refraction", Topic: "réfraction")
- Anchor: [[WIDGET:ConceptLink:psychoacoustique:psychoacoustique]] (Type: "ConceptLink", ID: "psychoacoustique", Topic: "psychoacoustique")
- Anchor: [[WIDGET:RealPerson:hermann_von_helmholtz:Hermann von Helmholtz]] (Type: "RealPerson", ID: "hermann_von_helmholtz", Topic: "Hermann von Helmholtz")
- Anchor: [[WIDGET:Glossary:acoustique_architecturale:acoustique architecturale]] (Type: "Glossary", ID: "acoustique_architecturale", Topic: "acoustique architecturale")
- Anchor: [[WIDGET:Glossary:acoustique_sous_marine:acoustique sous-marine]] (Type: "Glossary", ID: "acoustique_sous_marine", Topic: "acoustique sous-marine")
- Anchor: [[WIDGET:Glossary:acoustique_medicale:acoustique médicale]] (Type: "Glossary", ID: "acoustique_medicale", Topic: "acoustique médicale")
- Anchor: [[WIDGET:Glossary:acoustique_environnementale:acoustique environnementale]] (Type: "Glossary", ID: "acoustique_environnementale", Topic: "acoustique environnementale")
- Anchor: [[WIDGET:ConceptLink:transformation_de_fourier:transformation de Fourier]] (Type: "ConceptLink", ID: "transformation_de_fourier", Topic: "transformation de Fourier")
- Anchor: [[WIDGET:RealPerson:joseph_fourier:Joseph Fourier]] (Type: "RealPerson", ID: "joseph_fourier", Topic: "Joseph Fourier")
- Anchor: [[WIDGET:EventLink:asa_founding:Fondation de l'Acoustical Society of America]] (Type: "EventLink", ID: "asa_founding", Topic: "Fondation de l'Acoustical Society of America")

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
"The 'RealPerson' component for 'Pythagore' is incomplete. It is missing essential biographical details such as 'dates' and 'wikipediaLink'. For 'RealPerson' components, these properties are expected to be present and populated, as they are not listed among the component types where omission is acceptable for these fields.
Detailed errors:
- Field "interactiveComponents": The 'RealPerson' component with id 'pythagore' is missing the 'dates' and 'wikipediaLink' properties. These are crucial for a complete 'RealPerson' entry and are not among the properties allowed to be omitted for this component type."
Please fix these issues and regenerate.