import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
AI_STUDIO_KEY = os.getenv("GEMINI_API_KEY")

def list_models():
    client = genai.Client(api_key=AI_STUDIO_KEY)
    print("--- Available Models ---")
    try:
        for model in client.models.list():
            print(f"{model.name} : {model.supported_actions}")
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    list_models()
