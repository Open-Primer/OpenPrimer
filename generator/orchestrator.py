import os
import json
import asyncio
from pathlib import Path
from datetime import datetime

CONTENT_DIR = Path("../content")

class TranslatorAgent:
    async def translate_module(self, source_content, target_lang="en"):
        print(f"      [TRANSLATOR] Localizing module to {target_lang}...")
        # Simulation d'une traduction IA qui préserve les composants MDX
        # Note: L'IA traduirait le texte mais laisserait <Video />, <Quiz />, etc. intacts.
        translated = source_content.replace("# Section", f"# Section ({target_lang})")
        translated = translated.replace("Bienvenue", "Welcome")
        translated = translated.replace("Fondations", "Foundations")
        return translated

class OpenPrimerIndustrialEngine:
    def __init__(self, current_version="1.1.0"):
        self.version = current_version
        self.today = datetime.now().strftime("%Y-%m-%d")
        self.translator = TranslatorAgent()

    async def generate_section(self, subject, level, module_name, section_title, section_num, lang="fr"):
        print(f"      [v{self.version}] Synthesizing {lang.upper()}: {section_title}...")
        
        # Template de base (Langue source)
        content = f"""---
title: {section_title}
level: {level}
subject: {subject}
module: {module_name}
section: {section_num}
duration: "10 heures"
version: "{self.version}"
updatedAt: "{self.today}"
lang: "{lang}"
---

# Section {section_num} : {section_title}

## 1. Introduction
Bienvenue dans la version **{self.version}** de ce module en français.

<MetaNote title="Conseil">
  Démonstration du multilingue industriel.
</MetaNote>

---
*OpenPrimer Industrial Engine v{self.version}*
"""
        return content

    async def process_syllabus(self, syllabus):
        uni = syllabus.get("University", {})
        bach = uni.get("Bachelor", {})
        
        for level_key, subjects in bach.items():
            for subject, modules in subjects.items():
                for module_name, details in modules.items():
                    sections = ["Fondations", "Théorie Avancée"]
                    
                    module_dir = CONTENT_DIR / level_key / subject / module_name.replace(" ", "_")
                    module_dir.mkdir(parents=True, exist_ok=True)

                    for i, section_title in enumerate(sections, 1):
                        # 1. Génération Source (FR)
                        fr_content = await self.generate_section(subject, level_key, module_name, section_title, i, lang="fr")
                        fr_path = module_dir / f"section_{i}.fr.mdx"
                        with open(fr_path, "w", encoding="utf-8") as f:
                            f.write(fr_content)
                        
                        # 2. Traduction Persistante (EN)
                        en_content = await self.translator.translate_module(fr_content, target_lang="en")
                        en_path = module_dir / f"section_{i}.en.mdx"
                        with open(en_path, "w", encoding="utf-8") as f:
                            f.write(en_content)
                        
                        print(f"        Section {i} localized (FR + EN).")

async def main():
    if not Path("syllabus.json").exists(): return
    with open("syllabus.json", "r", encoding="utf-8") as f:
        syllabus = json.load(f)
    
    generator = OpenPrimerIndustrialEngine()
    await generator.process_syllabus(syllabus)

if __name__ == "__main__":
    asyncio.run(main())
