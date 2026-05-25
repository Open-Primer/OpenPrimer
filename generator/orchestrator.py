import os
import json
import asyncio
import argparse
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from prompt_templates import ARCHITECT_PROMPT, WRITER_PROMPT, ACADEMIC_SCALING, WRITING_STYLES, PEDAGOGICAL_PATTERNS
from google import genai

load_dotenv()

CONTENT_DIR = Path("../content")
# Using the institutional key from environment
AI_STUDIO_KEY = os.getenv("GEMINI_API_KEY")

class OpenPrimerFeynmanElite:
    def __init__(self, arch_model="gemini-flash-lite-latest", write_model="gemini-flash-lite-latest"):
        self.client = genai.Client(api_key=AI_STUDIO_KEY)
        self.arch_model_name = arch_model
        self.write_model_name = write_model
        self.version = "3.2.0-Vanguard-Industrial"

    def get_patterns_text(self):
        return "\n".join([f"- {k}: {v}" for k, v in PEDAGOGICAL_PATTERNS.items()])

    async def generate_module(self, topic, level, subject, lang='EN'):
        """
        Standard two-stage generation. 
        Note: For mass production, use submit_batch_job instead.
        """
        try:
            # 1. Architect (Blueprint)
            patterns_list = self.get_patterns_text()
            arch_prompt = ARCHITECT_PROMPT.format(
                topic=topic, 
                level=level, 
                patterns_list=patterns_list
            )
            
            resp_arch = self.client.models.generate_content(
                model=self.arch_model_name,
                contents=arch_prompt,
                config={'response_mime_type': 'application/json'}
            )
            
            blueprint = json.loads(resp_arch.text)
            pattern_key = blueprint.get("assigned_pattern", "FIRST_PRINCIPLES")
            pattern_desc = PEDAGOGICAL_PATTERNS.get(pattern_key, "")

            # 2. Writer (Final Content)
            style_desc = WRITING_STYLES["technical_expert"]
            target_len = ACADEMIC_SCALING.get(level, ACADEMIC_SCALING["L1"])["length"]
            
            write_prompt = WRITER_PROMPT.format(
                topic=topic, 
                blueprint=json.dumps(blueprint, indent=2), 
                lang=lang,
                style_description=style_desc,
                target_length=target_len,
                pattern_name=pattern_key,
                pattern_description=pattern_desc
            )
            
            resp_write = self.client.models.generate_content(
                model=self.write_model_name,
                contents=write_prompt
            )
            return resp_write.text
        except Exception as e:
            import traceback
            print(f"      [LLM ERROR] {e}")
            traceback.print_exc()
            return None

    async def submit_batch_job(self, syllabus_path):
        """
        Submits chapters for asynchronous processing via Vertex AI Batch API.
        Saves 50% on token costs.
        """
        print(f"      [BATCH] Preparing batch job for {syllabus_path}...")
        # Implementation of Batch Job submission would go here
        # For now, we simulate the submission
        await asyncio.sleep(1)
        print(f"      [BATCH] Job submitted successfully (Simulated). Status: PENDING")

    async def translate_content(self, content, target_langs):
        """
        Uses Cloud Translation API (Standard) instead of LLM to save tokens.
        """
        print(f"      [TRANS] Translating content to {target_langs} using Cloud Translation API...")
        # Mocking translation for now
        return {lang: f"[{lang}] {content[:100]}..." for lang in target_langs}

    async def process_local_syllabus(self, syllabus_path, use_batch=False):
        p = Path(syllabus_path)
        if not p.exists(): return

        with open(p, "r", encoding="utf-8") as f:
            syllabus = json.load(f)

        print(f"\n--- Processing Syllabus: {syllabus['subject']} ({syllabus['level']}) ---")
        
        if use_batch:
            await self.submit_batch_job(syllabus_path)
            return

        base_dir = CONTENT_DIR / syllabus["level"] / syllabus["subject"] / syllabus["id"]
        
        for unit in syllabus.get("units", []):
            unit_name = unit.get("name", "General").replace(" ", "_")
            unit_dir = base_dir / unit_name
            unit_dir.mkdir(parents=True, exist_ok=True)
            
            for topic in unit.get("modules", []):
                print(f"   > Generating Module: {topic}")
                content = await self.generate_module(topic, syllabus["level"], syllabus["subject"], 'EN')
                
                if content:
                    # Save English version
                    file_path = unit_dir / f"{topic.lower().replace(' ', '_')}.en.mdx"
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)
                    
                    # Translation Stage
                    translations = await self.translate_content(content, ["fr", "es", "de", "zh"])
                    for lang, translated_text in translations.items():
                        trans_path = unit_dir / f"{topic.lower().replace(' ', '_')}.{lang}.mdx"
                        with open(trans_path, "w", encoding="utf-8") as f:
                            f.write(translated_text)

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch", action="store_true", help="Submit as a batch job")
    parser.add_argument("--syllabus", type=str, default="./syllabus_physics_l1.json")
    args = parser.parse_args()

    generator = OpenPrimerFeynmanElite()
    await generator.process_local_syllabus(args.syllabus, use_batch=args.batch)

if __name__ == "__main__":
    asyncio.run(main())
