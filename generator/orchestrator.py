import os
import json
import asyncio
from pathlib import Path
from datetime import datetime

CONTENT_DIR = Path("../content")

class OpenPrimerGlobalEngine:
    def __init__(self, current_version="1.2.0"):
        self.version = current_version
        self.today = datetime.now().strftime("%Y-%m-%d")
        # Langues cibles pré-générées (Top 5)
        self.target_langs = ["en", "fr", "es", "zh", "ar"]

    async def generate_master_en(self, subject, level, module_name, section_title, section_num):
        print(f"      [MASTER-EN] Synthesizing Core Content: {section_title}...")
        
        # Template riche en Anglais (Plus précis pour l'IA)
        content = f"""---
title: {section_title}
level: {level}
subject: {subject}
module: {module_name}
section: {section_num}
version: "{self.version}"
updatedAt: "{self.today}"
lang: "en"
---

# {section_title}

## 1. Scientific Foundations
The concept of **{section_title}** is pivotal in **{subject}**. 
Experimental data from 2024 suggests a high correlation between stability and flux.

<MetaNote title="Research Note">
  Always prioritize empirical evidence over theoretical models in this section.
</MetaNote>

<FillInBlanks 
  sentence="The core principle is based on the [...] law." 
  answer="thermodynamics" 
/>

---
*OpenPrimer Master Engine (EN) v{self.version}*
"""
        return content

    async def translate_to_lang(self, en_content, target_lang):
        print(f"      [TRANSLATOR] Localizing to {target_lang.upper()}...")
        # Simulation d'un appel API IA pour la traduction
        return en_content.replace("lang: \"en\"", f"lang: \"{target_lang}\"")

    async def process_syllabus(self, syllabus):
        uni = syllabus.get("University", {})
        bach = uni.get("Bachelor", {})
        
        for level_key, subjects in bach.items():
            for subject, modules in subjects.items():
                for module_name, details in modules.items():
                    sections = ["Scientific Foundations", "Advanced Dynamics"]
                    
                    module_dir = CONTENT_DIR / level_key / subject / module_name.replace(" ", "_")
                    module_dir.mkdir(parents=True, exist_ok=True)

                    for i, section_title in enumerate(sections, 1):
                        # 1. Génération de la Source Maîtresse (EN)
                        en_content = await self.generate_master_en(subject, level_key, module_name, section_title, i)
                        
                        # 2. Sauvegarde des versions localisées
                        for lang in self.target_langs:
                            localized = await self.translate_to_lang(en_content, lang)
                            file_path = module_dir / f"section_{i}.{lang}.mdx"
                            with open(file_path, "w", encoding="utf-8") as f:
                                f.write(localized)
                        
                        print(f"        Section {i} deployed in 5 languages.")

async def main():
    if not Path("syllabus.json").exists(): return
    with open("syllabus.json", "r", encoding="utf-8") as f:
        syllabus = json.load(f)
    
    generator = OpenPrimerGlobalEngine()
    await generator.process_syllabus(syllabus)

if __name__ == "__main__":
    asyncio.run(main())
