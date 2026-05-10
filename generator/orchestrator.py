import os
import json
import asyncio
from pathlib import Path

CONTENT_DIR = Path("../content")

class OpenPrimerGenerator:
    async def generate_page(self, subject, level, module_name, topic):
        print(f"  [PRO] Generating rich content for: {topic}...")
        wiki_topic = topic.replace(' ', '_')
        
        template = """---
title: {{TOPIC}}
level: {{LEVEL}}
subject: {{SUBJECT}}
module: {{MODULE}}
prerequisites: ["General Science Foundations"]
duration: "45 min"
---

# {{TOPIC}}

<header className="pro-header">
  **Welcome to the study of {{TOPIC}}!** This module covers the essential principles of {{SUBJECT}} at the {{LEVEL}} level. 
</header>

## Core Theory
In this section, we explore the fundamental mechanics of **{{TOPIC}}**. Understanding these concepts is critical for mastering the {{MODULE}} module.

### Key Principles
1. **Observation**: Identifying the primary characteristics of {{TOPIC}}.
2. **Analysis**: Breaking down the interactions within the {{SUBJECT}} framework.
3. **Synthesis**: Integrating {{TOPIC}} with existing knowledge.

## Visual Learning
<Video id="dQw4w9WgXcQ" title="Deep Dive: {{TOPIC}}" provider="YouTube" />

## Technical Glossary
<Glossary terms={[
  { "term": "Primary Structure", "definition": "The basic building block of this topic." },
  { "term": "Secondary Function", "definition": "How this concept interacts with the environment." }
]} />

## Academic References
- [Wikipedia: {{TOPIC}}](https://en.wikipedia.org/wiki/{{WIKI}})
- [MIT OpenCourseWare: {{SUBJECT}}](https://ocw.mit.edu/search/?q={{SUBJECT}})

## Knowledge Check
<Quiz>
  <Question q="What is the primary goal of studying {{TOPIC}}?">
    <Option text="To memorize facts" />
    <Option text="To understand the underlying principles" correct />
    <Option text="To ignore interactions" />
  </Question>
  <Question q="Which reference is recommended for further reading?">
    <Option text="Wikipedia" correct />
    <Option text="Local newspaper" />
    <Option text="Social media" />
  </Question>
</Quiz>

---
*This content was synthesized by the OpenPrimer AI Engine.*
"""
        content = template.replace("{{TOPIC}}", topic)
        content = content.replace("{{LEVEL}}", level)
        content = content.replace("{{SUBJECT}}", subject)
        content = content.replace("{{MODULE}}", module_name)
        content = content.replace("{{WIKI}}", wiki_topic)
        return content

    async def process_syllabus(self, syllabus):
        uni = syllabus.get("University", {})
        bach = uni.get("Bachelor", {})
        
        for level_key, subjects in bach.items():
            if not isinstance(subjects, dict): continue
            for subject, modules in subjects.items():
                if not isinstance(modules, dict): continue
                for module_name, topics in modules.items():
                    if not isinstance(topics, list): continue
                    
                    module_dir = CONTENT_DIR / level_key / subject / module_name.replace(" ", "_")
                    module_dir.mkdir(parents=True, exist_ok=True)

                    for topic in topics:
                        file_name = topic.lower().replace(" ", "_").replace("'", "_") + ".mdx"
                        file_path = module_dir / file_name

                        content = await self.generate_page(subject, level_key, module_name, topic)
                        with open(file_path, "w", encoding="utf-8") as f:
                            f.write(content)
                        
                        print(f"        Saved to {file_path}")
                        await asyncio.sleep(0.05)

async def main():
    with open("syllabus.json", "r", encoding="utf-8") as f:
        syllabus = json.load(f)
    generator = OpenPrimerGenerator()
    await generator.process_syllabus(syllabus)

if __name__ == "__main__":
    asyncio.run(main())
