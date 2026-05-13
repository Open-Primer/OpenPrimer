from google import genai

AI_STUDIO_KEY = "AIzaSyCYUPTeO1Vq39HcOXrolyEFEU-PN-QP2zw"

def list_models():
    client = genai.Client(api_key=AI_STUDIO_KEY)
    for model in client.models.list():
        print(f"{model.name} : {model.supported_actions}")

if __name__ == "__main__":
    list_models()
