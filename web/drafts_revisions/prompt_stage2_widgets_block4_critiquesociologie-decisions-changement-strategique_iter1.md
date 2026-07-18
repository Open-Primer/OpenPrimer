You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "The analysis revealed key insights into the topic.",
      "Further research is recommended to explore specific areas in more detail."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Review the findings",
        "description": "Go over the main conclusions and their implications.",
        "slug": "review-findings"
      },
      {
        "title": "Identify actionable steps",
        "description": "Determine what practical actions can be taken based on the insights.",
        "slug": "actionable-steps"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "The Future of AI",
        "type": "book",
        "description": "An in-depth look at the potential trajectory of artificial intelligence.",
        "author": "Dr. Ava Sharma",
        "year": "2023"
      },
      {
        "title": "Understanding Climate Change",
        "type": "article",
        "description": "A comprehensive overview of the causes and effects of global warming.",
        "author": "Environmental Science Journal",
        "year": "2022"
      }
    ]
  },
  "glossary": [
    {
      "term": "Paradigm",
      "definition": "A typical example or pattern of something; a model."
    },
    {
      "term": "Synergy",
      "definition": "The interaction or cooperation of two or more organizations, substances, or other agents to produce a combined effect greater than the sum of their separate effects."
    }
  ]
}

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in FR.
3. Absolutely ZERO placeholders, draft markers, TBDs, lorem ipsum text, or template values (like "your_youtube_id" or "placeholder") in the goingFurther, whatsNext, or glossary items. All fields must contain real, fully translated, complete information. Reject if any empty strings or dummy templates are used. Note that for goingFurther items, omitting the "url" property entirely is perfectly acceptable if a real URL is not known; do not reject items for not having a "url" property, but reject them if they have a dummy/placeholder URL like "example.com" or "placeholder.com".

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