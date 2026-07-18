You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the conclusion, glossary, and transition widgets of the lesson:
Course: "Finance quantitative et modélisation stochastique"
Level: "Master 1st Year (M1)"
Lesson Title: "Les Grecques et la Sensibilité des Options"
Language: "FR"

You must define the following JSON properties:
1. "conclusionSummary": An object containing an "items" array, which contains key takeaways of this lesson as complete sentences ending with periods (at least 5 bullet points).
2. "whatsNext": An object containing a "steps" array of transition steps/lessons. Each step object must have "title", "description" (a text showing the transition/link), and "slug" (slug of the next lesson).
3. "goingFurther": An object with an "items" array containing at least 5 to 7 high-quality, authoritative external resources (books, articles, videos, websites, research papers). For video and website types, you must provide a real, valid, functional URL (e.g. a specific working YouTube video URL or a real Wikipedia/academic portal URL). For books and research papers, the URL is optional and can be omitted. If you do not know a real, specific, valid URL, you MUST completely omit the "url" property from that item instead of generating a placeholder URL like "example.com" or "placeholder.com". Generate enough items (at least 5-7) so that even if some links fail automated reachability validation checks, the lesson will still display a rich selection of resources.
4. "glossary": An array of at least 12 to 15 key technical terms with detailed definitions.

Return ONLY a valid JSON object matching this schema:
```json
{
  "conclusionSummary": {
    "items": ["string"]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "string",
        "description": "string",
        "slug": "string"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "string",
        "type": "string", // "book", "article", "video", "website", "research"
        "description": "string",
        "author": "string", // optional
        "year": "string", // optional
        "url": "string" // optional
      }
    ]
  },
  "glossary": [
    { "term": "string", "definition": "string" }
  ]
}
```
Do NOT wrap your JSON response in markdown code blocks.

🚨 PREVIOUS CRITIQUE:
"The definition of 'Delta' in the glossary contains an inaccuracy. While Delta can sometimes be used as an approximation for the probability of an option expiring in-the-money, it is not its formal definition. Delta primarily measures the sensitivity of the option price to changes in the underlying asset's price. The statement 'Il représente également la probabilité que l'option termine dans la monnaie' should be removed or rephrased to maintain academic accuracy.
Detailed errors:
- Field "glossary": The definition of 'Delta' includes the statement 'Il représente également la probabilité que l'option termine dans la monnaie'. This is an oversimplification and not strictly accurate from an academic standpoint. Delta's primary role is to measure price sensitivity to the underlying asset. This part of the definition should be removed to ensure scientific accuracy."
Please fix these issues and regenerate.