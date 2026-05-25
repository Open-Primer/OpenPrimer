import asyncio
import os
from orchestrator import OpenPrimerFeynmanElite
from dotenv import load_dotenv

load_dotenv()

async def generate_single():
    # Force the key from .env to be sure
    os.environ["GEMINI_API_KEY"] = "AIzaSyAAQabaeDb4r8dokdRObFoFR6c0CS8D06c"
    
    agent = OpenPrimerFeynmanElite()
    topic = "Chemical components of the cell: Water, pH, and Biomolecules"
    level = "L1"
    subject = "Biology"
    
    print(f"--- Generating Course Content: {topic} ---")
    content = await agent.generate_module(topic, level, subject, lang='FR')
    
    if content:
        output_file = "chemical_components_l1.fr.mdx"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Success! Course saved to {output_file}")
    else:
        print("Generation failed.")

if __name__ == "__main__":
    asyncio.run(generate_single())
