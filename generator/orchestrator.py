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
    async def generate_page(self, subject, level, module_name, topic, context=None):
        prompt = f"""
        Génère un cours de niveau {level} sur le sujet : {topic}.
        Inclus impérativement :
        1. Pré-requis (Compétences nécessaires avant ce cours).
        2. Contenu théorique structuré et rigoureux.
        3. Glossaire des termes techniques utilisés.
        4. Liens Wikipedia de référence.
        5. Quiz interactif (min 3 questions).
        6. Une section 'Ressources Vidéo' pointant vers des chaînes académiques (MIT, KhanAcademy).
        
        Format: MDX avec composants <Quiz>, <Glossary>, <Video />.
        """

        if self.model:
            response = await self.model.generate_content_async(prompt)
            return response.text
        else:
            # PRO-LEVEL MOCK TEMPLATE
            return f"""---
title: {topic}
level: {level}
subject: {subject}
module: {module_name}
prerequisites: ["Basic Chemistry", "Introduction to Life Sciences"]
duration: "45 min"
---

# {topic}

<header className="pro-header">
  **Prerequisites:** {level} Level understanding of Cell Structures.
  **Objectives:** Master the {topic} fundamentals and its industrial applications.
</header>

## Core Theory
Welcome to the advanced study of **{topic}**. This module covers the essential mechanisms and latest research findings in the field.

> "Knowledge is the only resource that increases when shared." - OpenPrimer Motto.

## Visual Resources
<Video id="dQw4w9WgXcQ" title="Core concepts of {topic}" provider="YouTube" />

## Academic References
- [Wikipedia: {topic}](https://en.wikipedia.org/wiki/{topic.replace(' ', '_')})
- [MIT OpenCourseWare: {subject}](https://ocw.mit.edu/search/?q={subject})

## Technical Glossary
<Glossary terms={[
  {{ term: "Concept A", definition: "First key definition for {topic}" }},
  {{ term: "Concept B", definition: "Second key definition for {topic}" }}
]} />

## Knowledge Check
<Quiz>
  <Question q="What is the primary function of {topic}?">
    <Option text="Option A" />
    <Option text="Option B" correct />
    <Option text="Option C" />
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
                        # Optionnel: On pourrait ici appeler un scraper pour récupérer du context
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
