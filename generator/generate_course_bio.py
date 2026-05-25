import os
import json
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from prompt_templates import ARCHITECT_PROMPT, WRITER_PROMPT, ACADEMIC_SCALING, WRITING_STYLES, PEDAGOGICAL_PATTERNS
from google import genai

load_dotenv()

# Institutional API Key
AI_STUDIO_KEY = os.getenv("GEMINI_API_KEY", "PLACEHOLDER_KEY")

class BioCourseGenerator:
    def __init__(self, model_name="gemini-1.5-pro-002"):
        self.client = genai.Client(api_key=AI_STUDIO_KEY)
        self.model_name = model_name
        self.total_input_tokens = 0
        self.total_output_tokens = 0

    def get_patterns_text(self):
        return "\n".join([f"- {k}: {v}" for k, v in PEDAGOGICAL_PATTERNS.items()])

    async def generate_course(self, topic, level, subject, lang='EN'):
        print(f"--- Generating Course: {topic} ({level}) ---")
        
        # 1. Architect Stage
        patterns_list = self.get_patterns_text()
        arch_prompt = ARCHITECT_PROMPT.format(
            topic=topic, 
            level=level, 
            patterns_list=patterns_list
        )
        
        print("  [Stage 1] Architecting Blueprint...")
        resp_arch = self.client.models.generate_content(
            model=self.model_name,
            contents=arch_prompt,
            config={'response_mime_type': 'application/json'}
        )
        
        self.total_input_tokens += resp_arch.usage_metadata.prompt_token_count
        self.total_output_tokens += resp_arch.usage_metadata.candidates_token_count
        
        blueprint = json.loads(resp_arch.text)
        pattern_key = blueprint.get("assigned_pattern", "FIRST_PRINCIPLES")
        pattern_desc = PEDAGOGICAL_PATTERNS.get(pattern_key, "")

        # 2. Writer Stage
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
        
        print("  [Stage 2] Generating Content...")
        resp_write = self.client.models.generate_content(
            model=self.model_name,
            contents=write_prompt
        )
        
        self.total_input_tokens += resp_write.usage_metadata.prompt_token_count
        self.total_output_tokens += resp_write.usage_metadata.candidates_token_count
        
        return resp_write.text, blueprint

    def estimate_cost(self):
        # Pricing for Gemini 1.5 Pro (Pay-as-you-go)
        # Input: $1.25 / 1M tokens
        # Output: $5.00 / 1M tokens
        input_cost = (self.total_input_tokens / 1_000_000) * 1.25
        output_cost = (self.total_output_tokens / 1_000_000) * 5.00
        return input_cost + output_cost

async def main():
    generator = BioCourseGenerator()
    topic = "Photosynthesis: Light Reactions"
    level = "L1"
    subject = "Biology"
    
    content, blueprint = await generator.generate_course(topic, level, subject)
    
    cost = generator.estimate_cost()
    
    print("\n--- GENERATION COMPLETE ---")
    print(f"Total Input Tokens: {generator.total_input_tokens}")
    print(f"Total Output Tokens: {generator.total_output_tokens}")
    print(f"Estimated Cost: ${cost:.4f}")
    
    # Save the output
    output_dir = Path("./generated_courses")
    output_dir.mkdir(exist_ok=True)
    
    with open(output_dir / "photosynthesis_l1.mdx", "w", encoding="utf-8") as f:
        f.write(content)
        
    with open(output_dir / "photosynthesis_l1_blueprint.json", "w", encoding="utf-8") as f:
        json.dump(blueprint, f, indent=2)

if __name__ == "__main__":
    asyncio.run(main())
