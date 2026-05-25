import os
import json
from google.cloud import aiplatform
from vertexai.generative_models import GenerativeModel
import vertexai

def generate_syllabus(subject, level):
    project_id = os.getenv("GCP_PROJECT_ID", "project-31f1d0d7-25e7-46c9-ad5")
    vertexai.init(project=project_id, location="us-central1")
    model = GenerativeModel("gemini-1.5-pro")
    
    prompt = f"""
    ACT AS A SENIOR ACADEMIC DEAN.
    Generate a complete academic syllabus for '{subject}' at level '{level}'.
    Return ONLY a JSON object with:
    {{
      "title": "...",
      "level": "{level}",
      "subject": "{subject}",
      "units": [
        {{ "name": "...", "modules": ["...", "..."] }}
      ]
    }}
    """
    
    response = model.generate_content(prompt)
    return response.text

if __name__ == "__main__":
    print(generate_syllabus("Biology", "L1"))
