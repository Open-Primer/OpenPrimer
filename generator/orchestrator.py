import os
import json
import asyncio
from pathlib import Path
from tenacity import retry, stop_after_attempt, wait_exponential

# Mock for Vertex AI
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel
    VERTEX_AVAILABLE = True
except ImportError:
    VERTEX_AVAILABLE = False

CONTENT_DIR = Path("../content")

class OpenPrimerGenerator:
    def __init__(self, project_id=None):
        self.project_id = project_id
        if VERTEX_AVAILABLE and project_id:
            vertexai.init(project_id=project_id, location="us-central1")
            self.model = GenerativeModel("gemini-1.5-flash")
        else:
            print("Vertex AI not initialized. Running in MOCK mode.")
            self.model = None

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_page(self, subject, level, module_name, topic):
        print(f"  [AI] Prompting for: {topic}...")
        if self.model:
            prompt = f"Génère un cours MDX pour {topic} ({subject} {level})."
            response = await self.model.generate_content_async(prompt)
            return response.text
        else:
            wiki_topic = topic.replace(' ', '_')
            return f"---\ntitle: {topic}\nsubject: {subject}\n--- \n# {topic}"

    async def process_syllabus(self, syllabus):
        print("[DEBUG] Starting syllabus processing...")
        uni = syllabus.get("University", {})
        bach = uni.get("Bachelor", {})
        
        for level_key, subjects in bach.items():
            print(f"[DEBUG] Level: {level_key}")
            if not isinstance(subjects, dict): continue
            
            for subject, modules in subjects.items():
                print(f"  [DEBUG] Subject: {subject}")
                if not isinstance(modules, dict): continue
                
                for module_name, topics in modules.items():
                    print(f"    [DEBUG] Module: {module_name}")
                    if not isinstance(topics, list): continue
                    
                    module_dir = CONTENT_DIR / level_key / subject / module_name.replace(" ", "_")
                    module_dir.mkdir(parents=True, exist_ok=True)

                    for topic in topics:
                        print(f"      [DEBUG] Topic: {topic}")
                        file_name = topic.lower().replace(" ", "_").replace("'", "_") + ".mdx"
                        file_path = module_dir / file_name

                        if file_path.exists():
                            print(f"        Skipping {topic}")
                            continue

                        content = await self.generate_page(subject, level_key, module_name, topic)
                        
                        with open(file_path, "w", encoding="utf-8") as f:
                            f.write(content)
                        
                        print(f"        Saved to {file_path}")
                        await asyncio.sleep(0.5)

async def main():
    print("[INIT] Loading syllabus...")
    with open("syllabus.json", "r", encoding="utf-8") as f:
        syllabus = json.load(f)

    project_id = os.getenv("GCP_PROJECT_ID")
    generator = OpenPrimerGenerator(project_id=project_id)
    await generator.process_syllabus(syllabus)

if __name__ == "__main__":
    asyncio.run(main())
