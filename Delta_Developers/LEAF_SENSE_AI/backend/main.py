from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from model_loader import model_loader

app = FastAPI(title="LeafSense AI Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load disease packs on startup
DISEASE_PACKS = None

@app.on_event("startup")
async def load_disease_packs():
    global DISEASE_PACKS
    try:
        with open('backend/disease_packs.json', 'r') as f:
            DISEASE_PACKS = json.load(f)
        print("✓ Disease packs loaded")
    except Exception as e:
        print(f"✗ Error loading disease packs: {e}")
        DISEASE_PACKS = {"packs": []}

# Pydantic models
class ChatRequest(BaseModel):
    disease: str
    question: str

class ChatResponse(BaseModel):
    answer: str

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok"}

# Disease prediction endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Predict leaf disease from image."""
    try:
        contents = await file.read()
        result = model_loader.predict(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Chat endpoint
@app.post("/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    """Rule-based chatbot for disease questions."""
    disease = request.disease.lower()
    question = request.question.lower()
    
    # Simple rule-based responses
    if "why" in question or "cause" in question:
        if "blight" in disease:
            answer = "Late blight and early blight are usually caused by high humidity and poor airflow between plants. Fungal spores thrive in wet conditions. Ensure good air circulation, avoid overhead watering, and maintain proper plant spacing."
        elif "rust" in disease:
            answer = "Rust typically develops in warm, wet conditions with poor air circulation. High humidity creates ideal conditions for fungal spore germination."
        else:
            answer = "This disease develops when environmental conditions favor the pathogen. Factors include temperature, humidity, moisture, and plant stress."
    
    elif "treatment" in question or "what should i do" in question or "cure" in question:
        if "blight" in disease:
            answer = "For blight: 1) Remove infected leaves immediately. 2) Apply fungicides (copper-based or mancozeb). 3) Improve ventilation. 4) Avoid wetting foliage. 5) Space plants properly. 6) Remove severely affected plants."
        elif "rust" in disease:
            answer = "For rust: 1) Remove and destroy infected leaves. 2) Apply sulfur or copper fungicides. 3) Improve air circulation. 4) Avoid overhead watering. 5) Remove debris from field."
        else:
            answer = "Consult a local agricultural extension office for specific treatment recommendations for this disease."
    
    elif "prevent" in question or "prevention" in question:
        if "blight" in disease:
            answer = "Prevention: Use resistant varieties, practice crop rotation, ensure good drainage, avoid excess nitrogen, mulch soil, stake/trellis plants for airflow, water at soil level only."
        elif "rust" in disease:
            answer = "Prevention: Maintain proper spacing, use resistant varieties, avoid excess nitrogen, water in morning only, remove debris, practice crop rotation."
        else:
            answer = "General prevention: Use resistant varieties, practice crop rotation, ensure proper plant spacing, avoid stress, and maintain good field hygiene."
    
    elif disease == "healthy":
        answer = "Great news! Your plant appears healthy. Continue with regular maintenance: proper watering, adequate spacing, balanced fertilization, and regular monitoring for early signs of disease."
    
    else:
        answer = "I can help with questions about disease causes, treatments, and prevention. Could you ask more specifically about symptoms, what to do, or how to prevent this disease?"
    
    return ChatResponse(answer=answer)

# Disease packs endpoint
@app.get("/disease-packs")
async def get_disease_packs():
    """Return predefined disease information packs."""
    if DISEASE_PACKS is None:
        return {"packs": []}
    return DISEASE_PACKS

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
