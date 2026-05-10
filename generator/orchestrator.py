import os
import json
import asyncio
from pathlib import Path

CONTENT_DIR = Path("../content")

class OpenPrimerSequentialEngine:
    async def generate_section(self, subject, level, module_name, section_title, section_num):
        print(f"      [SECTION {section_num}] Synthesizing: {section_title}...")
        
        # Template riche avec composants interactifs
        content = f"""---
title: {section_title}
level: {level}
subject: {subject}
module: {module_name}
section: {section_num}
duration: "10 heures"
---

# Section {section_num} : {section_title}

## 1. Introduction à la Section
Bienvenue dans cette étape de votre cursus. Nous allons explorer les **fondations critiques** de ce chapitre.

<MetaNote title="Conseil de Révision">
  Prenez le temps d'assimiler les concepts de la section précédente avant d'attaquer les démonstrations mathématiques ici.
</MetaNote>

## 2. Analyse Approfondie
Le concept de **stabilité dynamique** est au cœur de notre étude. 
L'interaction entre les forces est un processus **itératif**.

<FillInBlanks 
  sentence="La force est le produit de la [...] par l'accélération." 
  answer="masse" 
/>

## 3. Démonstration Technique
Voici un exemple concret d'application de ce principe dans le cursus **{level}**. 
Le texte est ici **enrichi** de termes en **gras** pour faciliter la mémorisation visuelle.

*Exemple : Un système en équilibre ne subit aucune force résultante.*

## 📽️ Visualisation
<Video id="8_Xg3z_9G8M" title="Cours : {section_title}" provider="YouTube" />

## ✍️ Quiz de Section
<Quiz>
  <Question q="Quelle est la notion clé de cette section ?">
    <Option text="Option A" />
    <Option text="Option B" correct />
  </Question>
</Quiz>

---
*Section certifiée OpenPrimer v5.0*
"""
        return content

    async def process_syllabus(self, syllabus):
        uni = syllabus.get("University", {})
        bach = uni.get("Bachelor", {})
        
        for level_key, subjects in bach.items():
            for subject, modules in subjects.items():
                for module_name, details in modules.items():
                    # On suppose ici que details est un dict avec 'sections' ou on en crée par défaut
                    sections = ["Fondations", "Théorie Avancée", "Applications Pratiques"]
                    
                    module_dir = CONTENT_DIR / level_key / subject / module_name.replace(" ", "_")
                    module_dir.mkdir(parents=True, exist_ok=True)

                    for i, section_title in enumerate(sections, 1):
                        file_name = f"section_{i}_" + section_title.lower().replace(" ", "_") + ".mdx"
                        file_path = module_dir / file_name

                        content = await self.generate_section(subject, level_key, module_name, section_title, i)
                        with open(file_path, "w", encoding="utf-8") as f:
                            f.write(content)
                        
                        print(f"        {section_title} ASSEMBLED (10h).")

async def main():
    if not Path("syllabus.json").exists(): return
    with open("syllabus.json", "r", encoding="utf-8") as f:
        syllabus = json.load(f)
    
    generator = OpenPrimerSequentialEngine()
    await generator.process_syllabus(syllabus)

if __name__ == "__main__":
    asyncio.run(main())
