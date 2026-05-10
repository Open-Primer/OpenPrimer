import os
import json
import asyncio
from pathlib import Path
from tenacity import retry, stop_after_attempt, wait_exponential
from prompt_templates import MASTER_PROMPT

# Mock for Vertex AI if not configured
try:
    from google.cloud import aiplatform
    import vertexai
    from vertexai.generative_models import GenerativeModel
    VERTEX_AVAILABLE = True
except ImportError:
    VERTEX_AVAILABLE = False

CONTENT_DIR = Path("../content")

class OpenPrimerGenerator:
    def __init__(self, project_id=None, location="us-central1"):
        self.project_id = project_id
        if VERTEX_AVAILABLE and project_id:
            vertexai.init(project_id=project_id, location=location)
            self.model = GenerativeModel("gemini-1.5-flash")
        else:
            print("Vertex AI not initialized. Running in MOCK mode.")
            self.model = None

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_page(self, subject, level, module_name, topic):
        prompt = MASTER_PROMPT.format(
            subject=subject,
            level=level,
            module_name=module_name,
            topic=topic,
            context="No additional context provided."
        )

        if self.model:
            response = await self.model.generate_content_async(prompt)
            return response.text
        else:
            return f"""---
title: {topic}
level: {level}
subject: {subject}
module: {module_name}
---

# {topic}

Ceci est un contenu de démonstration pour le module **{topic}**. 

Dans une version réelle, l'IA synthétiserait ici les connaissances académiques relatives à ce sujet, en s'appuyant sur les meilleurs syllabus mondiaux.

## Test de connaissances
<Quiz>
  <Question q="Est-ce que ce composant interactif fonctionne ?">
    <Option text="Non, c'est cassé" />
    <Option text="Oui, parfaitement !" correct />
    <Option text="Peut-être" />
  </Question>
</Quiz>
"""

    async def process_syllabus(self, syllabus):
        for level_key, subjects in syllabus.get("University", {}).get("Bachelor", {}).items():
            for subject, modules in subjects.items():
                for module_name, topics in modules.items():
                    module_dir = CONTENT_DIR / level_key / subject / module_name.replace(" ", "_")
                    module_dir.mkdir(parents=True, exist_ok=True)

                    for topic in topics:
                        file_name = topic.lower().replace(" ", "_").replace("(", "").replace(")", "") + ".mdx"
                        file_path = module_dir / file_name

                        if file_path.exists():
                            print(f"Skipping {topic}, already exists.")
                            continue

                        print(f"Generating: {topic}...")
                        content = await self.generate_page(subject, level_key, module_name, topic)
                        
                        with open(file_path, "w", encoding="utf-8") as f:
                            f.write(content)
                        
                        print(f"Saved to {file_path}")
                        # Sleep to respect rate limits in mock/free mode
                        await asyncio.sleep(1)

async def main():
    # Load syllabus
    with open("syllabus.json", "r", encoding="utf-8") as f:
        syllabus = json.load(f)

    # Init generator
    # Replace with your GCP project ID if available
    project_id = os.getenv("GCP_PROJECT_ID")
    generator = OpenPrimerGenerator(project_id=project_id)

    await generator.process_syllabus(syllabus)

if __name__ == "__main__":
    asyncio.run(main())
