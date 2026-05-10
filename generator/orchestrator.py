import os
import json
import asyncio
from pathlib import Path
from datetime import datetime

CONTENT_DIR = Path("../content")

class OpenPrimerVersioningEngine:
    def __init__(self, current_version="1.0.0"):
        self.version = current_version
        self.today = datetime.now().strftime("%Y-%m-%d")

    async def generate_section(self, subject, level, module_name, section_title, section_num):
        print(f"      [v{self.version}] Synthesizing: {section_title}...")
        
        content = f"""---
title: {section_title}
level: {level}
subject: {subject}
module: {module_name}
section: {section_num}
duration: "10 heures"
version: "{self.version}"
updatedAt: "{self.today}"
---

# Section {section_num} : {section_title}

## 1. Introduction
Bienvenue dans la version **{self.version}** de ce module. 
Dernière mise à jour : **{self.today}**.

## 2. Contenu Académique
Le concept de **stabilité** est ici analysé sous l'angle de la version **{self.version}**. 

<MetaNote title="Notes de Version">
  Cette version inclut des corrections sur les schémas cinétiques et une bibliographie mise à jour.
</MetaNote>

<FillInBlanks 
  sentence="La version actuelle du cours est la [...]." 
  answer="{self.version}" 
/>

---
*OpenPrimer Academic Engine v{self.version}*
"""
        return content

    async def process_syllabus(self, syllabus):
        uni = syllabus.get("University", {})
        bach = uni.get("Bachelor", {})
        
        for level_key, subjects in bach.items():
            for subject, modules in subjects.items():
                for module_name, details in modules.items():
                    sections = ["Fondations", "Théorie Avancée", "Applications"]
                    
                    module_dir = CONTENT_DIR / level_key / subject / module_name.replace(" ", "_")
                    module_dir.mkdir(parents=True, exist_ok=True)

                    for i, section_title in enumerate(sections, 1):
                        file_name = f"section_{i}_" + section_title.lower().replace(" ", "_") + ".mdx"
                        file_path = module_dir / file_name

                        content = await self.generate_section(subject, level_key, module_name, section_title, i)
                        with open(file_path, "w", encoding="utf-8") as f:
                            f.write(content)
                        
                        print(f"        {section_title} (v{self.version}) OK.")

async def main():
    if not Path("syllabus.json").exists(): return
    with open("syllabus.json", "r", encoding="utf-8") as f:
        syllabus = json.load(f)
    
    # On peut passer la version en paramètre pour l'industrialisation
    generator = OpenPrimerVersioningEngine(current_version="1.1.0")
    await generator.process_syllabus(syllabus)

if __name__ == "__main__":
    asyncio.run(main())
