import os
import json
import asyncio
import argparse
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from prompt_templates import ARCHITECT_PROMPT, WRITER_PROMPT, ACADEMIC_SCALING, WRITING_STYLES
from google import genai

load_dotenv()

CONTENT_DIR = Path("../content")
AI_STUDIO_KEY = "AIzaSyCYUPTeO1Vq39HcOXrolyEFEU-PN-QP2zw"

class OpenPrimerFeynmanElite:
    def __init__(self, simulate=False, arch_model="gemini-flash-latest", write_model="gemini-flash-latest"):
        self.target_languages = ["en", "fr", "es", "de", "zh"]
        self.simulate = simulate
        
        if not simulate:
            print(f"      [INIT] Using GenAI SDK (Account: vanguard.mysterious)")
            self.client = genai.Client(api_key=AI_STUDIO_KEY)
            self.arch_model_name = arch_model
            self.write_model_name = write_model
        
        self.version = "3.1.0-Vanguard"

    async def generate_module(self, topic, level, subject, lang='EN'):
        if self.simulate:
            return "# Simulated Content\nPedagogical excellence in progress."
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # 1. Architect (Blueprint)
                arch_prompt = ARCHITECT_PROMPT.format(topic=topic, level=level, subject=subject, lang=lang)
                resp_arch = self.client.models.generate_content(
                    model=self.arch_model_name,
                    contents=arch_prompt
                )
                blueprint = resp_arch.text
                
                await asyncio.sleep(2)
                
                # 2. Writer (Final Content)
                style_desc = WRITING_STYLES["technical_expert"]
                target_len = ACADEMIC_SCALING.get(level, ACADEMIC_SCALING["L1"])["length"]
                
                write_prompt = WRITER_PROMPT.format(
                    topic=topic, 
                    blueprint=blueprint, 
                    lang=lang,
                    style_description=style_desc,
                    target_length=target_len
                )
                
                resp_write = self.client.models.generate_content(
                    model=self.write_model_name,
                    contents=write_prompt
                )
                return resp_write.text
            except Exception as e:
                err_msg = str(e)
                if ("503" in err_msg or "429" in err_msg) and attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 15
                    print(f"      [RETRY] {err_msg[:100]}... Waiting {wait_time}s...")
                    await asyncio.sleep(wait_time)
                    continue
                print(f"      LLM Error: {e}")
                return None

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
            ("gemini-flash-latest", "gemini-flash-latest", "flash_latest"),
            ("gemini-flash-latest", "gemini-3.1-flash-lite", "mixed_31_writer"),
            ("gemini-3.1-flash-lite", "gemini-flash-latest", "mixed_31_architect"),
            ("gemini-3.1-flash-lite", "gemini-3.1-flash-lite", "flash_31_lite_vanguard")
        ]
        
        tmp_dir = Path("./tmp_comparison")
        tmp_dir.mkdir(exist_ok=True)
        
        for arch, write, suffix in matrix:
            print(f"\nRunning Comparison: Architect={arch} | Writer={write}")
            generator = OpenPrimerFeynmanElite(arch_model=arch, write_model=write)
            
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
