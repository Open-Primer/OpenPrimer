import os
import json
import asyncio
from pathlib import Path
from datetime import datetime
from prompt_templates import MASTER_ELITE_PROMPT, CURATOR_ELITE_PROMPT, ACADEMIC_SCALING, TARGET_LANGUAGES

CONTENT_DIR = Path("../content")
CONFIG_DIR = Path("./config")

class OpenPrimerFeynmanElite:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.version = "1.7.0-Gold"
        self.max_attempts = 3

    async def generate_module(self, topic, level, subject, unit, lang='EN'):
        scale = ACADEMIC_SCALING.get(level, ACADEMIC_SCALING["L1"])
        print(f"      [PRODUCING {level}] {topic} ({lang}) - Target: {scale['length']}...")
        
        # 1. Initial Generation
        prompt = MASTER_ELITE_PROMPT.format(
            topic=topic,
            level=level,
            subject=subject,
            target_length=scale["length"],
            math_requirement=scale["math"],
            lang=lang
        )
        
        content = await self._call_llm(prompt)
        
        # 2. Curation Loop (Limited to 3 attempts)
        is_valid = False
        attempt = 1
        while not is_valid and attempt <= self.max_attempts:
            review = await self.curate_module(content, level, scale["length"], attempt)
            
            if review["status"] == "APPROVED" or review["score"] > 85:
                is_valid = True
                print(f"      ✅ Approved (Attempt {attempt}, Score: {review['score']}/100)")
            else:
                if attempt == self.max_attempts:
                    print(f"      ⚠️ Max attempts reached. Marking {topic} as 'REVIEW_REQUIRED'.")
                    content = f"<!-- REVIEW_REQUIRED: {review['feedback']} -->\n" + content
                    break
                
                attempt += 1
                print(f"      ❌ Rejected ({attempt-1}/{self.max_attempts}): {review['feedback']}. Retrying...")
                content = await self._call_llm(f"{prompt}\n\nCRITICAL FEEDBACK FROM CURATOR (Attempt {attempt-1}): {review['feedback']}")
                
        return content

    async def curate_module(self, content, level, min_len, attempt):
        curator_prompt = CURATOR_ELITE_PROMPT.format(
            level=level,
            min_words=min_len,
            attempt=attempt
        )
        # Mocking Curator AI Call
        response = await self._call_llm(f"{curator_prompt}\n\nCONTENT TO REVIEW:\n{content[:3000]}...")
        # In production, parse JSON from LLM response
        return {"status": "APPROVED", "score": 90, "feedback": "Criteria met."}

    async def _call_llm(self, prompt):
        # Mocking LLM API
        return f"# {prompt[:100]}...\n(Simulated high-density academic content for OpenPrimer v1.7)"

    async def run_industrial_task(self, config_file):
        """Loads subjects and levels from a config file (to be moved to Supabase)."""
        if not Path(config_file).exists():
            print(f"Config {config_file} missing.")
            return

        with open(syllabus_file, "r", encoding="utf-8") as f:
            syllabus = json.load(f)

        print(f"🚀 Industrial Production Starting for: {syllabus['title']}")
        
        for unit in syllabus.get("units", []):
            unit_name = unit.get("name", "General")
            unit_dir = p / unit_name.replace(" ", "_")
            unit_dir.mkdir(parents=True, exist_ok=True)
            
            for topic in unit.get("modules", []):
                for lang in TARGET_LANGUAGES:
                    content = await self.generate_module(topic, syllabus["level"], syllabus["subject"], unit_name, lang)
                    file_path = unit_dir / f"{topic.lower().replace(' ', '_')}.{lang}.mdx"
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)
                print(f"      ✅ Module [{topic}] Finalized in all 5 languages.")

async def main():
    generator = OpenPrimerFeynmanElite()
    # Triggering Classical Mechanics specifically
    await generator.process_local_syllabus("../content/L1/Physics/Classical_Mechanics")

if __name__ == "__main__":
    asyncio.run(main())
