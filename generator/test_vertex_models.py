import vertexai
from vertexai.generative_models import GenerativeModel
import os

PROJECT_ID = "project-31f1d0d7-25e7-46c9-ad5"
LOCATION = "us-central1"

def test_models():
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    
    models_to_test = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro"
    ]
    
    for model_name in models_to_test:
        try:
            model = GenerativeModel(model_name)
            response = model.generate_content("Hi", generation_config={"max_output_tokens": 5})
            print(f"[OK] {model_name}: {response.text.strip()}")
        except Exception as e:
            print(f"[FAIL] {model_name}: {str(e)}")

if __name__ == "__main__":
    test_models()
