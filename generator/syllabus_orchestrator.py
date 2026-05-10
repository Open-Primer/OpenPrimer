import os
import json
import asyncio
from pathlib import Path

# Mock for Vertex AI
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel
    VERTEX_AVAILABLE = True
except ImportError:
    VERTEX_AVAILABLE = False

class SyllabusOrchestrator:
    def __init__(self, project_id=None):
        if VERTEX_AVAILABLE and project_id:
            vertexai.init(project_id=project_id, location="us-central1")
            self.model = GenerativeModel("gemini-1.5-flash")
        else:
            self.model = None

    async def generate_syllabus(self, subject, level):
        """Generates a structured syllabus for a given subject and level."""
        prompt = f"""
        Génère un syllabus académique complet pour la matière '{subject}' au niveau '{level}'.
        Le syllabus doit être divisé en Unités de Valeur (UV), chaque UV contenant une liste de modules précis.
        Respecte les standards internationaux (ex: Bachelor L1-L3, Lycée, Collège).
        
        Format de réponse: JSON uniquement
        {{
          "title": "Titre du Syllabus",
          "level": "{level}",
          "subject": "{subject}",
          "units": [
            {{
              "name": "Nom de l'UV",
              "modules": ["Module 1", "Module 2", ...]
            }},
            ...
          ]
        }}
        """
        
        if self.model:
            response = await self.model.generate_content_async(prompt)
            # Basic JSON extraction
            text = response.text.strip().replace("```json", "").replace("```", "")
            return json.loads(text)
        else:
            # Mock Data
            return {
                "title": f"{subject} {level} Core",
                "level": level,
                "subject": subject,
                "units": [
                    {"name": f"Intro to {subject}", "modules": ["Fundamentals", "History", "Basic Principles"]},
                    {"name": f"Advanced {subject}", "modules": ["Complex Cases", "Theory", "Applications"]}
                ]
            }

async def main():
    orchestrator = SyllabusOrchestrator(project_id=os.getenv("GCP_PROJECT_ID"))
    
    disciplines = ["Biology", "Physics", "Mathematics", "Sociology", "History"]
    levels = ["L1", "L2", "L3", "Lycée Terminale", "Collège 3ème"]
    
    all_syllabi = []
    
    for subject in disciplines:
        for level in levels:
            print(f"Generating Syllabus for {subject} - {level}...")
            syllabus = await orchestrator.generate_syllabus(subject, level)
            all_syllabi.append(syllabus)
            await asyncio.sleep(1) # Rate limiting
            
    with open("global_syllabi_blueprint.json", "w", encoding="utf-8") as f:
        json.dump(all_syllabi, f, indent=2, ensure_ascii=False)
    
    print("All syllabi blueprints generated in global_syllabi_blueprint.json")

if __name__ == "__main__":
    asyncio.run(main())
