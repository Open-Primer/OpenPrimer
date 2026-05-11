import os
import json
import asyncio
import argparse
from pathlib import Path

# Vertex AI Integration
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
        """Generates a structured syllabus for a given subject and level using Vertex AI."""
        prompt = f"""
        ACT AS A SENIOR ACADEMIC DEAN.
        Generate a complete academic syllabus for the subject '{subject}' at the level '{level}'.
        The syllabus must be divided into Value Units (UV), each containing precise, high-density modules.
        Ensure alignment with international educational standards (Vocational, Bachelor, Master, PhD).
        
        REQUIRED JSON FORMAT:
        {{
          "title": "Full Academic Title",
          "level": "{level}",
          "subject": "{subject}",
          "units": [
            {{
              "name": "Unit Name",
              "modules": ["Module 1", "Module 2", ...]
            }}
          ]
        }}
        """
        
        if self.model:
            try:
                response = await self.model.generate_content_async(prompt)
                text = response.text.strip().replace("```json", "").replace("```", "")
                return json.loads(text)
            except Exception as e:
                print(f"Error generating syllabus: {e}")
                return None
        else:
            # Fallback for local testing
            return {
                "title": f"{subject} {level} Standard Curriculum",
                "level": level,
                "subject": subject,
                "units": [
                    {"name": f"Core {subject} Principles", "modules": ["Foundations", "Essential Skills"]},
                    {"name": f"Advanced {subject} Applications", "modules": ["Complex Cases", "Industrial Standards"]}
                ]
            }

async def process_batch(orchestrator, requests):
    results = []
    for req in requests:
        subject = req.get("subject")
        level = req.get("level")
        print(f"Industrializing {subject} @ {level}...")
        syllabus = await orchestrator.generate_syllabus(subject, level)
        if syllabus:
            results.append(syllabus)
        await asyncio.sleep(1)
    return results

async def main():
    parser = argparse.ArgumentParser(description="OpenPrimer Industrial Syllabus Orchestrator")
    parser.add_argument("--subject", type=str, help="Subject name (e.g. Couture)")
    parser.add_argument("--level", type=str, help="Academic Level (e.g. CAP, L1, PhD)")
    parser.add_argument("--queue", type=str, help="Path to a JSON queue file for batch processing")
    args = parser.parse_args()

    orchestrator = SyllabusOrchestrator(project_id=os.getenv("GCP_PROJECT_ID"))
    
    if args.queue:
        queue_path = Path(args.queue)
        if queue_path.exists():
            with open(queue_path, "r", encoding="utf-8") as f:
                requests = json.load(f)
            all_syllabi = await process_batch(orchestrator, requests)
            output_path = "batch_syllabi_output.json"
        else:
            print(f"Queue file {args.queue} not found.")
            return
    elif args.subject and args.level:
        syllabus = await orchestrator.generate_syllabus(args.subject, args.level)
        all_syllabi = [syllabus] if syllabus else []
        output_path = f"syllabus_{args.subject.lower()}_{args.level.lower()}.json"
    else:
        print("Please provide --subject and --level OR a --queue file.")
        return

    if all_syllabi:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(all_syllabi, f, indent=2, ensure_ascii=False)
        print(f"Success! Syllabus data saved to {output_path}")

if __name__ == "__main__":
    asyncio.run(main())
