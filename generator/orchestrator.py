import os
import json
import asyncio
from pathlib import Path

CONTENT_DIR = Path("../content")

class OpenPrimerIndustrialEngine:
    async def generate_module(self, subject, level, module_name, topic, ects=3):
        print(f"  [INDUSTRIAL] Generating {ects} ECTS module: {topic}...")
        
        target_chapters = 5 + (ects * 2)
        wiki_topic = topic.replace(' ', '_')
        
        # Construction des chapitres simulés
        chapters_text = ""
        for i in range(1, target_chapters + 1):
            chapters_text += f"## {i}. Chapitre Technique {i}\n\n"
            chapters_text += f"L'analyse de **{topic}** à ce stade révèle des interactions **fondamentales**. "
            chapters_text += "Il est impératif de noter que les structures **systémiques** sont au cœur de la validation. "
            chapters_text += "Par exemple, l'application du modèle **Alpha-Beta** permet de stabiliser les flux. " * 45
            chapters_text += "\n\n"

        # Template avec TAGS
        template = """---
title: [TOPIC]
level: [LEVEL]
subject: [SUBJECT]
module: [MODULE]
ects: [ECTS]
duration: "[DURATION] heures"
---

# [TOPIC]

[CHAPTERS_CONTENT]

## 📽️ Ressources Vidéos
<Video id="8_Xg3z_9G8M" title="Cours Magistral : [TOPIC]" provider="YouTube" />

## 🧠 Glossaire & Tooltips
<Glossary terms={[
  { "term": "Stabilité", "definition": "Maintien de l'état d'équilibre." },
  { "term": "Flux", "definition": "Vitesse de transfert d'énergie." }
]} />

## ✍️ Examen Final ([ECTS] ECTS)
<Quiz>
  <Question q="Quel est le principe majeur de [TOPIC] ?">
    <Option text="Théorie A" />
    <Option text="Théorie B" correct />
  </Question>
</Quiz>

## 📚 Bibliographie Sélective
1. **Author, A.** (2024). *Advanced Studies in [SUBJECT]*.
2. **Wikipedia** : [[TOPIC]](https://fr.wikipedia.org/wiki/[WIKI_TOPIC])
"""
        # Remplacement
        content = template.replace("[TOPIC]", topic)
        content = content.replace("[LEVEL]", level)
        content = content.replace("[SUBJECT]", subject)
        content = content.replace("[MODULE]", module_name)
        content = content.replace("[ECTS]", str(ects))
        content = content.replace("[DURATION]", str(ects * 10))
        content = content.replace("[WIKI_TOPIC]", wiki_topic)
        content = content.replace("[CHAPTERS_CONTENT]", chapters_text)
        
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

                        content = await self.generate_module(subject, level_key, module_name, topic)
                        with open(file_path, "w", encoding="utf-8") as f:
                            f.write(content)
                        
                        size_kb = os.path.getsize(file_path) / 1024
                        print(f"        Module {topic} GENERATED. Size: {size_kb:.1f} KB")

async def main():
    if not Path("syllabus.json").exists(): return
    with open("syllabus.json", "r", encoding="utf-8") as f:
        syllabus = json.load(f)
    
    generator = OpenPrimerIndustrialEngine()
    await generator.process_syllabus(syllabus)

if __name__ == "__main__":
    asyncio.run(main())
