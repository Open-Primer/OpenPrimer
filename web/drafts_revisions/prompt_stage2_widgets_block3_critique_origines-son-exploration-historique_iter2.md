You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "timeline_acoustics_overview",
      "componentType": "Mermaid",
      "sectionAnchor": "Chronologie des grandes étapes de la pensée acoustique",
      "props": {
        "code": "timeline\n    title Chronologie des grandes étapes de la pensée acoustique\n    section Antiquité\n        VIe siècle av. J.-C.: Pythagore et les rapports harmoniques\n        IVe siècle av. J.-C.: Aristote et la propagation du son\n    section Moyen Âge\n        IXe-XIe siècles: Al-Fārābī et la théorie musicale arabe\n    section Renaissance\n        XVe-XVIe siècles: Léonard de Vinci et l'observation des ondes"
      }
    },
    {
      "id": "pythagorean_monochord",
      "componentType": "CustomFigure",
      "sectionAnchor": "Représentation d'un monocorde et des rapports harmoniques de Pythagore",
      "props": {
        "description": "Une illustration schématique d'un monocorde, un instrument ancien utilisé pour étudier les rapports musicaux. Le diagramme montre une corde tendue sur une caisse de résonance avec un chevalet mobile. Des divisions sont marquées sur la corde, illustrant les points où le chevalet peut être placé pour produire des intervalles harmoniques spécifiques, tels que l'octave (1:2), la quinte (2:3) et la quarte (3:4), conformément aux découvertes de Pythagore.",
        "title": "Le monocorde de Pythagore et les rapports harmoniques",
        "url": "pythagorean_monochord_image.jpg",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Monocorde",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Monocorde",
        "year": "VIe siècle av. J.-C."
      }
    },
    {
      "id": "aristote_sound_medium",
      "componentType": "Quote",
      "sectionAnchor": "Citation d'Aristote sur la nécessité d'un milieu pour la propagation du son",
      "props": {
        "quote": "Le son est un mouvement de l'air qui, frappant l'oreille, produit la sensation auditive. Il ne peut y avoir de son sans un milieu pour le transporter.",
        "source": "De l'âme",
        "year": "IVe siècle av. J.-C."
      }
    },
    {
      "id": "al_farabi_monochord_divisions",
      "componentType": "CustomFigure",
      "sectionAnchor": "Représentation des divisions du monocorde et des intervalles musicaux selon Al-Fārābī",
      "props": {
        "description": "Un diagramme détaillé des divisions d'un monocorde, tel qu'il aurait pu être conçu par Al-Fārābī. Le schéma met en évidence les points spécifiques le long de la corde qui correspondent aux intervalles musicaux de la théorie arabe, incluant des quarts de ton et d'autres micro-intervalles. Les rapports de longueur de corde sont annotés pour illustrer la complexité et la précision de son système musical.",
        "title": "Le monocorde et les intervalles d'Al-Fārābī",
        "url": "al_farabi_monochord_image.jpg",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Al-F%C4%81r%C4%81b%C4%AB",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Al-F%C4%81r%C4%81b%C4%AB",
        "year": "IXe-Xe siècles"
      }
    },
    {
      "id": "leonardo_sound_observations",
      "componentType": "Video",
      "sectionAnchor": "Animation des observations de Léonard de Vinci sur la propagation du son",
      "props": {
        "title": "Léonard de Vinci: Observations sur la propagation du son",
        "year": "XVe-XVIe siècles"
      }
    },
    {
      "id": "renaissance_sound_evolution",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des idées sur le son de l'Antiquité à la Renaissance",
      "props": {
        "code": "graph TD\n    A[Antiquité: Pythagore, Aristote] --> B{Moyen Âge: Al-Fārābī};\n    B --> C[Renaissance: Léonard de Vinci];\n    C --> D[XVIIe siècle: Mersenne, Galilée];\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style B fill:#bbf,stroke:#333,stroke-width:2px\n    style C fill:#ccf,stroke:#333,stroke-width:2px\n    style D fill:#cfc,stroke:#333,stroke-width:2px\n    subgraph Évolution des idées sur le son\n        A -- Rapports mathématiques, milieu de propagation --> B\n        B -- Théorie musicale, intervalles --> C\n        C -- Observation empirique, ondes --> D\n    end"
      }
    },
    {
      "id": "vibrating_string_diagram",
      "componentType": "Image",
      "sectionAnchor": "Illustration d'une corde vibrante montrant la relation entre vibration et son",
      "props": {
        "description": "Un diagramme clair d'une corde vibrante fixée à ses deux extrémités. La corde est représentée dans différentes phases de sa vibration, montrant les nœuds et les ventres. Des flèches indiquent le mouvement de la corde, illustrant comment sa vibration génère des ondes sonores dans l'air environnant. Le schéma met en évidence la relation directe entre la fréquence de vibration de la corde et la hauteur du son perçu.",
        "title": "Corde vibrante et production sonore",
        "year": "XVIIe siècle"
      }
    },
    {
      "id": "sound_wave_propagation_diagram",
      "componentType": "CustomFigure",
      "sectionAnchor": "Schéma de la propagation d'une onde sonore dans un milieu, montrant compressions et raréactions",
      "props": {
        "description": "Un schéma didactique illustrant la propagation d'une onde sonore à travers un milieu compressible, tel que l'air. Le diagramme montre des zones alternées de compression (où les particules du milieu sont rapprochées) et de raréfaction (où elles sont espacées). Des flèches indiquent la direction de propagation de l'onde, tandis que les mouvements des particules sont représentés comme des oscillations longitudinales autour de leurs positions d'équilibre.",
        "title": "Propagation d'une onde sonore: compressions et raréactions",
        "url": "sound_wave_propagation_diagram_image.jpg",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Onde_sonore",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Onde_sonore",
        "year": "XVIIe siècle"
      }
    },
    {
      "id": "mersenne_experiment",
      "componentType": "Image",
      "sectionAnchor": "Représentation des expériences de Marin Mersenne sur les cordes vibrantes, illustrant la relation entre les propriétés physiques et la fréquence sonore",
      "props": {
        "description": "Une représentation stylisée des expériences de Marin Mersenne sur les cordes vibrantes. Le schéma montre différentes configurations de cordes (longueur, tension, épaisseur) et les résultats sonores associés. Des annotations indiquent les lois de Mersenne, qui décrivent la relation entre la fréquence d'une corde vibrante et sa longueur, sa tension, sa masse linéaire et son diamètre, établissant ainsi les fondements de l'acoustique physique.",
        "title": "Les expériences de Mersenne sur les cordes vibrantes",
        "year": "1636"
      }
    },
    {
      "id": "timeline_17_18_century_acoustics",
      "componentType": "Mermaid",
      "sectionAnchor": "Chronologie des contributions majeures à l'acoustique aux XVIIe et XVIIIe siècles",
      "props": {
        "code": "timeline\n    title Chronologie des contributions majeures à l'acoustique aux XVIIe et XVIIIe siècles\n    section XVIIe siècle\n        1636: Marin Mersenne publie \"Harmonie universelle\"\n        1638: Galilée étudie la résonance et la vibration\n        1660: Robert Boyle démontre la nécessité d'un milieu pour le son\n        1687: Isaac Newton formule la vitesse du son dans \"Principia Mathematica\"\n    section XVIIIe siècle\n        1701: Joseph Sauveur introduit le concept de son fondamental et harmoniques\n        1747: Leonhard Euler développe l'équation d'onde pour le son\n        1759: Joseph-Louis Lagrange contribue à la théorie des cordes vibrantes"
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. CRITICAL MEDIA RULES:
   - Image components MUST NOT contain "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "year" properties.
   - Video components MUST NOT contain "url", "id", "provider", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   - Audio components MUST NOT contain "url", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   These fields are FORBIDDEN in the raw widgets JSON for Image, Video, and Audio. They are resolved automatically downstream by the external-resource-resolver pipeline using the component's title/searchQuery/description. Any media component missing these fields is CORRECT and must NOT be rejected. If a media component DOES contain any of these forbidden fields (even with a seemingly valid URL), that IS an error and should be flagged.
6. For other components (Quiz, SolvedExercise, UnsolvedExercise, FillInBlanks, Mermaid): "url", "wikipediaLink", "wikipediaUrl" can be null or omitted — this is acceptable. Do NOT reject those component types for missing URL fields.
7. For UnsolvedExercise components, the props must contain "title", "problem", and "correctAnswer". Do NOT reject them for missing "questions" or "tasks" as those are not part of the UnsolvedExercise props structure.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'interactiveComponents')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.