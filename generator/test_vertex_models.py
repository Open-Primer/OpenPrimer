import vertexai
from google.cloud import aiplatform

PROJECT_ID = "project-31f1d0d7-25e7-46c9-ad5"
LOCATION = "us-central1"

def list_publisher_models():
    aiplatform.init(project=PROJECT_ID, location=LOCATION)
    
    # This is a bit tricky via SDK, usually we just know them.
    # I'll try common names that I might have missed.
    test_list = [
        "publishers/google/models/gemini-1.5-flash-001",
        "publishers/google/models/gemini-1.5-flash-002",
        "publishers/google/models/gemini-1.5-pro-001",
        "publishers/google/models/gemini-1.5-pro-002",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002"
    ]
    
    print("Testing models directly with GenerativeModel...")
    from vertexai.generative_models import GenerativeModel
    
    for m in test_list:
        try:
            model = GenerativeModel(m)
            print(f"[FOUND] {m}")
        except Exception as e:
            print(f"[MISSING] {m}: {str(e)}")

if __name__ == "__main__":
    list_publisher_models()
