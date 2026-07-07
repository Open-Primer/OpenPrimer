You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the interactive components of the lesson.

The narrative text contains the following custom widget anchors that you MUST define:
- Anchor: [[WIDGET:ref1:ref1]] (Type: "ref1", ID: "ref1", Topic: "")
- Anchor: [[WIDGET:ref2:ref2]] (Type: "ref2", ID: "ref2", Topic: "")
- Anchor: [[WIDGET:ref5:ref5]] (Type: "ref5", ID: "ref5", Topic: "")
- Anchor: [[WIDGET:ref4:ref4]] (Type: "ref4", ID: "ref4", Topic: "")
- Anchor: [[WIDGET:ref1:ref1]] (Type: "ref1", ID: "ref1", Topic: "")
- Anchor: [[WIDGET:ref2:ref2]] (Type: "ref2", ID: "ref2", Topic: "")
- Anchor: [[WIDGET:ref3:ref3]] (Type: "ref3", ID: "ref3", Topic: "")
- Anchor: [[WIDGET:ref4:ref4]] (Type: "ref4", ID: "ref4", Topic: "")
- Anchor: [[WIDGET:ref5:ref5]] (Type: "ref5", ID: "ref5", Topic: "")
- Anchor: [[WIDGET:ref1:ref1]] (Type: "ref1", ID: "ref1", Topic: "")
- Anchor: [[WIDGET:ref3:ref3]] (Type: "ref3", ID: "ref3", Topic: "")
- Anchor: [[WIDGET:ref2:ref2]] (Type: "ref2", ID: "ref2", Topic: "")
- Anchor: [[WIDGET:ref6:ref6]] (Type: "ref6", ID: "ref6", Topic: "")

---

### CATALOG AND GUIDELINES:
None anchored.

You must define the "interactiveComponents" array containing one object for each anchor list above.
For each component:
- "id": Must match the ID from the anchor.
- "componentType": Must match the Type from the anchor.
- "sectionAnchor": The markdown heading "## Section Name" where this widget is placed in the narrative.
- "props": The specific properties required for the widget type (Biography: name, dates, description, wikipediaUrl; Citation: quote, author, source, year, commentary; Image: description, alt, caption, searchQuery; etc.).

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
"The 'interactiveComponents' array contains multiple entries with duplicate 'id' values. Each interactive component must have a unique identifier to ensure proper functionality and referencing.
Detailed errors:
- Field "interactiveComponents": The 'id' property for each component within the 'interactiveComponents' array must be unique. Duplicate IDs found include 'ref1', 'ref2', 'ref3', 'ref4', and 'ref5'. Please ensure all component IDs are distinct."
Please fix these issues and regenerate.