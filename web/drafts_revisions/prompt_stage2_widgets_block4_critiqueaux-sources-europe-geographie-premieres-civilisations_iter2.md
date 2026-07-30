You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "The importance of understanding complex systems is growing.",
      "Interconnectedness and feedback loops are key characteristics.",
      "Modeling and simulation are crucial tools for analysis."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Explore System Dynamics",
        "description": "Learn about the System Dynamics methodology for modeling complex systems.",
        "slug": "explore-system-dynamics"
      },
      {
        "title": "Read 'Thinking in Systems'",
        "description": "Delve into Donella Meadows' seminal work on systems thinking.",
        "slug": "read-thinking-in-systems"
      },
      {
        "title": "Apply Concepts to a Real-World Problem",
        "description": "Choose a problem you care about and try to identify its systemic components.",
        "slug": "apply-concepts-real-world-problem"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Thinking in Systems: A Primer",
        "type": "book",
        "description": "A classic introduction to systems thinking by Donella H. Meadows.",
        "author": "Donella H. Meadows",
        "year": "2008"
      },
      {
        "title": "The Fifth Discipline: The Art & Practice of The Learning Organization",
        "type": "book",
        "description": "Peter Senge's influential work on organizational learning and systems thinking.",
        "author": "Peter M. Senge",
        "year": "1990"
      },
      {
        "title": "Complexity Explorer",
        "type": "website",
        "description": "An online learning platform offering courses on complex systems.",
        "url": "https://www.complexityexplorer.org/"
      }
    ]
  },
  "glossary": [
    {
      "term": "System",
      "definition": "A set of interconnected parts forming a complex whole."
    },
    {
      "term": "Feedback Loop",
      "definition": "A process in which the outputs of a system are routed back as inputs as part of a chain of cause-and-effect that forms a circuit or loop."
    },
    {
      "term": "Emergence",
      "definition": "The appearance of novel properties or behaviors in a system that are not present in its individual parts."
    }
  ]
}

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in FR.
3. Absolutely ZERO placeholders, draft markers, TBDs, lorem ipsum text, "N/A", "## Section Name", or template values (like "your_youtube_id" or "placeholder") in the goingFurther, whatsNext, or glossary items. All fields must contain real, fully translated, complete information. Reject if any empty strings or dummy templates are used. Note that for goingFurther items, omitting the "url" property entirely is perfectly acceptable if a real URL is not known; do not reject items for not having a "url" property, but reject them if they have a dummy/placeholder URL like "example.com" or "placeholder.com".
4. CRITICAL WIDGET CONNECTION: The glossary, transition steps (whatsNext), and goingFurther items must be strongly connected to the lesson's topics and highly informative. Glossary definitions must be detailed and context-specific.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'conclusionSummary', 'whatsNext', 'goingFurther', or 'glossary')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.