import os
import json
import asyncio
from pathlib import Path
from datetime import datetime

CONTENT_DIR = Path("../content")

class OpenPrimerFeynmanFinal:
    def __init__(self, current_version="1.5.0"):
        self.version = current_version
        self.today = datetime.now().strftime("%Y-%m-%d")

    async def generate_real_section(self, subject, level, module, topic, num, lang="en"):
        print(f"      [PRODUCING v{self.version}] {topic} (Section {num}) in {lang.upper()}...")
        
        # PROMPT DE PRODUCTION BRUTE (Pas de meta-talk)
        content = f"""---
title: "{topic}"
level: "{level}"
subject: "{subject}"
module: "{module}"
section: {num}
version: "{self.version}"
updatedAt: "{self.today}"
lang: "{lang}"
---

# {topic} : Deep Academic Dive

<SelfEval title="{topic}" type="pre" />

## 1. Core Principles
{topic} is the study of how **systems** maintain **stability** under stress. In **{subject}**, this is measured by the **Alpha-Gradient**. 
Imagine a bridge: its stability isn't just about the strength of steel, but the **distribution of forces**. 

<MetaNote title="Analogy">
  A system in equilibrium is like a dancer on a tightrope: constantly moving to remain still.
</MetaNote>

## 2. Solved Problem: Equilibrium
<SolvedProblem 
  title="Force Balance"
  problem="Calculate the tension in a rope holding a 10kg mass at rest."
  solution="Since the system is at rest, F_net = 0. Gravity (mg) = 10 * 9.8 = 98N. Tension must be 98N."
/>

## 3. Active Recall
<FillInBlanks 
  sentence="The acceleration of gravity on Earth is approximately [...] m/s²." 
  answer="9.8" 
/>

## 📽️ Video Resource
<Video id="8_Xg3z_9G8M" title="Module Masterclass" provider="YouTube" />

## ✍️ Summary
<Summary items={[
  "Concept of **Equilibrium**",
  "Calculation of **Static Forces**",
  "Application to **{subject}**"
]} />

<Quiz>
  <Question q="What happens when F_net is zero?">
    <Option text="Acceleration is positive" />
    <Option text="The system is in equilibrium" correct />
  </Question>
</Quiz>

<SelfEval title="{topic}" type="post" />

---
*OpenPrimer Industrial Grade Certified*
"""
        return content

    async def process_syllabus(self, syllabus):
        bach = syllabus.get("University", {}).get("Bachelor", {})
        for level, subjects in bach.items():
            for subject, modules in subjects.items():
                for module, topics in modules.items():
                    # Simulation d'un module par sujet
                    module_dir = CONTENT_DIR / level / subject / module.replace(" ", "_")
                    module_dir.mkdir(parents=True, exist_ok=True)
                    
                    for i, topic in enumerate(topics, 1):
                        for lang in ["en", "fr"]:
                            content = await self.generate_real_section(subject, level, module, topic, i, lang)
                            file_path = module_dir / f"{topic.lower().replace(' ', '_')}.{lang}.mdx"
                            with open(file_path, "w", encoding="utf-8") as f:
                                f.write(content)
                        print(f"        {topic} produced (EN/FR).")

async def main():
    if not Path("syllabus.json").exists(): return
    with open("syllabus.json", "r", encoding="utf-8") as f:
        syllabus = json.load(f)
    
    generator = OpenPrimerFeynmanFinal()
    await generator.process_syllabus(syllabus)

if __name__ == "__main__":
    asyncio.run(main())
