import os
import json
import asyncio
import argparse
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from prompt_templates import ARCHITECT_PROMPT, WRITER_PROMPT, ACADEMIC_SCALING, WRITING_STYLES

# Vertex AI Integration
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel
    VERTEX_AVAILABLE = True
except ImportError:
    VERTEX_AVAILABLE = False

load_dotenv()

CONTENT_DIR = Path("../content")

class OpenPrimerFeynmanElite:
    def __init__(self, simulate=False, arch_model="gemini-1.5-pro", write_model="gemini-1.5-flash"):
        self.target_languages = ["en", "fr", "es", "de", "zh"]
        self.simulate = simulate
        self.project_id = os.getenv("GCP_PROJECT_ID")
        print(f"      [INIT] VERTEX_AVAILABLE: {VERTEX_AVAILABLE}, PROJECT_ID: {self.project_id}")
        
        if not simulate and VERTEX_AVAILABLE and self.project_id:
            try:
                vertexai.init(project=self.project_id, location="us-central1")
                self.arch_model = GenerativeModel(arch_model)
                self.write_model = GenerativeModel(write_model)
                print(f"      [INIT] Models Loaded: {arch_model}, {write_model}")
            except Exception as e:
                print(f"      [INIT] Vertex AI Init Failed: {e}")
                self.arch_model = None
                self.write_model = None
        else:
            self.arch_model = None
            self.write_model = None
        self.version = "2.0.0-Agentic"

    async def _call_llm(self, model, prompt, is_json=False):
        if self.simulate:
            # (Simulation logic remains same)
            return "Simulated content"
        
        try:
            response = await model.generate_content_async(
                prompt,
                generation_config={"response_mime_type": "application/json"} if is_json else None
            )
            return response.text
        except Exception as e:
            print(f"      LLM Error: {e}")
            return None

    async def generate_module(self, topic, level, subject, lang='EN'):
        scale = ACADEMIC_SCALING.get(level, ACADEMIC_SCALING["L1"])
        style = WRITING_STYLES["master_scientist"]
        
        print(f"      [STAGE 1: ARCHITECT] Designing blueprint for {topic}...")
        arch_prompt = ARCHITECT_PROMPT.format(topic=topic, level=level)
        blueprint_raw = await self._call_llm(self.arch_model, arch_prompt, is_json=True)
        if not blueprint_raw: return None
        
        blueprint = json.loads(blueprint_raw)
        
        print(f"      [STAGE 2: WRITER] Producing content ({lang}) - {scale['length']} words...")
        writer_prompt = WRITER_PROMPT.format(
            topic=topic,
            style_description=style,
            lang=lang,
            target_length=scale["length"],
            blueprint=json.dumps(blueprint, indent=2)
        )
        
        content = await self._call_llm(self.write_model, writer_prompt)
        return content

    async def process_local_syllabus(self, syllabus_path, suffix=""):
        p = Path(syllabus_path)
        if not p.exists(): return

        with open(p, "r", encoding="utf-8") as f:
            syllabus = json.load(f)

        base_dir = CONTENT_DIR / syllabus["level"] / syllabus["subject"] / (syllabus["id"] + suffix)
        
        for unit in syllabus.get("units", []):
            unit_dir = base_dir / unit.get("name", "General").replace(" ", "_")
            unit_dir.mkdir(parents=True, exist_ok=True)
            
            for topic in unit.get("modules", []):
                # Generate only EN for comparison speed
                content = await self.generate_module(topic, syllabus["level"], syllabus["subject"], 'EN')
                if content:
                    file_path = unit_dir / f"{topic.lower().replace(' ', '_')}.en.mdx"
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--compare", action="store_true")
    args = parser.parse_args()

    if args.compare:
        # Matrix: (Arch, Writer)
        matrix = [
            ("gemini-1.5-flash", "gemini-1.5-flash", "flash_15_standard"),
            ("gemini-1.5-flash", "gemini-1.5-flash-002", "mixed_vanguard_writer"),
            ("gemini-1.5-flash-002", "gemini-1.5-flash", "mixed_vanguard_architect"),
            ("gemini-1.5-flash-002", "gemini-1.5-flash-002", "flash_15_v002_vanguard")
        ]
        
        tmp_dir = Path("./tmp_comparison")
        tmp_dir.mkdir(exist_ok=True)
        
        for arch, write, suffix in matrix:
            print(f"\nRunning Comparison: Architect={arch} | Writer={write}")
            generator = OpenPrimerFeynmanElite(arch_model=arch, write_model=write)
            
            # We use a topic to test quality
            topic = "Newton's Laws of Motion"
            content = await generator.generate_module(topic, "L1", "Physics", 'EN')
            
            if content:
                file_path = tmp_dir / f"newton_laws_{suffix}.mdx"
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"      [SUCCESS] Sample saved to {file_path}")
            
    else:
        generator = OpenPrimerFeynmanElite()
        await generator.process_local_syllabus("./syllabus_physics_l1.json")

if __name__ == "__main__":
    asyncio.run(main())
