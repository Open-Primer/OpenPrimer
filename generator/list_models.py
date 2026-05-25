import google.generativeai as genai

AI_STUDIO_KEY = "PLACEHOLDER_KEY"

def list_models():
    genai.configure(api_key=AI_STUDIO_KEY)
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)

if __name__ == "__main__":
    list_models()
