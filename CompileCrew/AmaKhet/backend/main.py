from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi_mcp import FastApiMCP
from fastapi.responses import JSONResponse
import json
import os
import uuid
try:
    import tensorflow as tf
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("⚠️  TensorFlow not available. Plant disease detection will be disabled.")

from PIL import Image
import io

app = FastAPI()

from pydantic import BaseModel, Field, PositiveFloat
from typing import Dict

import joblib
import numpy as np


encoder = joblib.load("models/encoder_yield.joblib")
yield_model = joblib.load("models/crop_yield_model.joblib")

# Load plant disease model and data
plant_disease_model = None
plant_disease_data = None

if TENSORFLOW_AVAILABLE:
    try:
        # Try to load from backend/ML/ML first, then fallback to project root
        model_paths = [
            "ML/ML/plant_disease_recog_model_pwp.keras",
            "../ML/ML/plant_disease_recog_model_pwp.keras"
        ]
        
        json_paths = [
            "ML/ML/plant_disease.json",
            "../ML/ML/plant_disease.json"
        ]
        
        for model_path in model_paths:
            if os.path.exists(model_path):
                plant_disease_model = tf.keras.models.load_model(model_path)
                print(f"✅ Loaded model from: {model_path}")
                break
        
        for json_path in json_paths:
            if os.path.exists(json_path):
                with open(json_path, 'r') as file:
                    plant_disease_data = json.load(file)
                print(f"✅ Loaded disease data from: {json_path}")
                break
        
        if plant_disease_model is None or plant_disease_data is None:
            print("⚠️  Could not find ML model or disease data files")
            plant_disease_model = None
            plant_disease_data = None
    except Exception as e:
        print(f"⚠️  Error loading plant disease model: {e}")
        plant_disease_model = None
        plant_disease_data = None
else:
    print("⚠️  TensorFlow not available, skipping plant disease model loading")
    
    # Create a mapping from model indices to disease data
    disease_labels = ['Apple___Apple_scab',
     'Apple___Black_rot',
     'Apple___Cedar_apple_rust',
     'Apple___healthy',
     'Background_without_leaves',
     'Blueberry___healthy',
     'Cherry___Powdery_mildew',
     'Cherry___healthy',
     'Corn___Cercospora_leaf_spot Gray_leaf_spot',
     'Corn___Common_rust',
     'Corn___Northern_Leaf_Blight',
     'Corn___healthy',
     'Grape___Black_rot',
     'Grape__Esca(Black_Measles)',
     'Grape__Leaf_blight(Isariopsis_Leaf_Spot)',
     'Grape___healthy',
     'Orange__Haunglongbing(Citrus_greening)',
     'Peach___Bacterial_spot',
     'Peach___healthy',
     'Pepper,bell__Bacterial_spot',
     'Pepper,bell__healthy',
     'Potato___Early_blight',
     'Potato___Late_blight',
     'Potato___healthy',
     'Raspberry___healthy',
     'Soybean___healthy',
     'Squash___Powdery_mildew',
     'Strawberry___Leaf_scorch',
     'Strawberry___healthy',
     'Tomato___Bacterial_spot',
     'Tomato___Early_blight',
     'Tomato___Late_blight',
     'Tomato___Leaf_Mold',
     'Tomato___Septoria_leaf_spot',
     'Tomato___Spider_mites Two-spotted_spider_mite',
     'Tomato___Target_Spot',
     'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
     'Tomato___Tomato_mosaic_virus',
     'Tomato___healthy']
    
    # Create disease mapping
    disease_mapping = {}
    if plant_disease_data:
        for disease in plant_disease_data:
            disease_mapping[disease['name']] = disease
        print("Plant disease model and data loaded successfully!")
    else:
        print("⚠️  Plant disease data not available")
        disease_mapping = {}
else:
    # Create empty disease mapping when TensorFlow is not available
    disease_mapping = {}


curr_farmer_id = 1
farmers = {
    1 : {
          "lat": 17.924612,
          "log" : 73.712006,
          "fertilizers" : ["DAV"],
          "start_date" : "12-01-2025",
          "end_date" : "12-02-2025",
          "buffer" : 100,
          "soil_characteristics" : {'NDVI_mean': 0.46127950124962236, 'SM_surface': None,           'SM_rootzone': None, 'pH_top30cm': 5.6000000000000005, 'SOC_gkg_top30cm': 36.666666666666664, 'SOC_pct_top30cm': 3.6666666666666665, 'WC33_vpct_top30cm': 41.666666666666664},
          "current_crop" : "wheat",
          "state" : "karnataka",                    
        }

}

fertilizers = {
    "DAV" : {
        "N" : 30,
        "P" : 10,
        "K" : 23
    } 
}


class BMIInput(BaseModel):
    weight_kg: PositiveFloat = Field(..., description="Weight of the person in kilograms")
    height_m: PositiveFloat = Field(..., description="Height of the person in meters")

@app.get("/bmi", operation_id="calculate_bmi", summary="this tool is used to calculate bmi based on weigth and height")
def calculate_bmi(input: BMIInput) -> Dict[str,float]:
    """
    compute bmi using weight and height
    sample request 
    {
        "weight_m" : 64.0,
        "height_m" : 1.5 
    }
    """
    bmi_value = input.weight_kg / (input.height_m ** 2)
    return {"bmi": bmi_value}

# mcp = FastApiMCP(app, name="BMI MCP", description="Simple application to calculate BMI")
# mcp.mount_http()




### soil function
    
######



class CropYieldInput(BaseModel):
    Jstate: str = Field(..., description="State name")
    Jdistrict: str = Field(..., description="District name")
    Jseason: str = Field(..., description="Season (e.g., Kharif, Rabi)")
    Jcrops: str = Field(..., description="Crop name")
    Jarea: PositiveFloat = Field(..., description="Area of cultivation in hectares")

# --------- Endpoint for Crop Yield Prediction ----------
@app.get(
    "/crop_yield",
    operation_id="predict_crop_yield",
    summary="Predict crop yield production for a given state, district, season, crop, and area"
)
def predict_crop_yield(input: CropYieldInput) -> Dict[str, str]:
    """
    Predicts crop yield based on input parameters using encoder and ML model.
    """

    # Encode categorical values (state, district, season, crop)
    encoded_features = encoder.transform([[input.Jstate, input.Jdistrict, input.Jseason, input.Jcrops]])
    
    # Combine encoded categorical with numerical (area)
    final_features = np.hstack([encoded_features, [[input.Jarea]]])

    # Predict production
    prediction = yield_model.predict(final_features)[0]

    return {
        "Predicted Production": f"{prediction:.2f}",
        "message": f"Predicted production for {input.Jcrops} in {input.Jdistrict}, {input.Jstate} ({input.Jseason}) on {input.Jarea} hectares is {prediction:.2f}."
    }



# Load your trained crop recommendation model
crop_recommendation_model = joblib.load("models/crop_recommendation_model.joblib")

# --------- Input model for Crop Recommendation ----------
@app.get(
    "/crop_recommendation",
    operation_id="recommend_crop",
    summary="Recommend best crop based on soil and environmental parameters"
)
def recommend_crop(
    n_params: float,
    p_params: float,
    k_params: float,
    t_params: float,
    h_params: float,
    ph_params: float,
    r_params: float
) -> Dict[str, str]:
    """
    Predicts the best crop to cultivate based on input soil and environmental parameters.
    """

    # Prepare input for model as 2D array (1 sample)
    model_input = np.array([[n_params, p_params, k_params, t_params, h_params, ph_params, r_params]])
    
    # Debug print to verify input
    print("Model Input:", model_input)
    
    # Predict crop
    predicted_crop = crop_recommendation_model.predict(model_input)[0]

    return {
        "Predicted Crop": predicted_crop,
        "message": f"Based on the given parameters, the recommended crop is {predicted_crop}."
    }




# Load models and encoders
fertilizer_model = joblib.load("models/fertilizer_model.joblib")
soil_encoder = joblib.load("models/soil_encoder.joblib")
crop_encoder = joblib.load("models/encoder_yield.joblib")  # same encoder used in crop yield

# --------- Endpoint for Fertilizer Recommendation ----------
@app.get(
    "/fertilizer_recommendation",
    operation_id="recommend_fertilizer",
    summary="Recommend best fertilizer based on environmental and soil parameters"
)
def recommend_fertilizer(
    temp: float,
    humidity: float,
    moisture: float,
    soil_type: str,
    crop_type: str,
    nitrogen: float,
    potassium: float,
    phosphorous: float
) -> Dict[str, str]:
    """
    Predicts the best fertilizer to use based on input environmental and soil parameters.
    """

    # Encode categorical variables
    soil_encoded = soil_encoder.transform([[soil_type]])
    crop_encoded = crop_encoder.transform([[crop_type]])

    # Combine all inputs
    model_input = np.hstack([
        soil_encoded,
        crop_encoded,
        [[temp, humidity, moisture, nitrogen, potassium, phosphorous]]
    ])

    # Debug print to verify input
    print("Fertilizer Model Input:", model_input)

    # Predict fertilizer
    predicted_fertilizer = fertilizer_model.predict(model_input)[0]

    return {
        "Predicted Fertilizer": predicted_fertilizer,
        "message": f"Based on the given parameters, the recommended fertilizer is {predicted_fertilizer}."
    }


# --------- Plant Disease Detection Endpoint ----------
def preprocess_image(image_bytes):
    """Preprocess image for the model"""
    try:
        # Load and resize image
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert('RGB')
        image = image.resize((160, 160))
        
        # Convert to array and normalize
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error preprocessing image: {str(e)}")

@app.post("/plant_disease_detection")
async def detect_plant_disease(file: UploadFile = File(...)):
    """
    Detect plant disease from uploaded image using trained ML model
    """
    if not TENSORFLOW_AVAILABLE:
        raise HTTPException(status_code=503, detail="TensorFlow not available. Please install TensorFlow to use plant disease detection.")
    
    if plant_disease_model is None:
        raise HTTPException(status_code=503, detail="Plant disease model not loaded. Please ensure the model files are available.")
    
    try:
        # Read image file
        image_bytes = await file.read()
        
        # Preprocess image
        processed_image = preprocess_image(image_bytes)
        
        # Make prediction
        prediction = plant_disease_model.predict(processed_image)
        predicted_class_index = np.argmax(prediction[0])
        confidence = float(prediction[0][predicted_class_index])
        
        # Get disease name
        disease_name = disease_labels[predicted_class_index]
        
        # Get disease information
        disease_info = disease_mapping.get(disease_name, {
            "name": disease_name,
            "cause": "Unknown disease",
            "cure": "Please consult with an agricultural expert"
        })
        
        # Determine if healthy or diseased
        is_healthy = "healthy" in disease_name.lower()
        
        # Generate fertilizer recommendation based on disease
        if is_healthy:
            fertilizer_recommendation = {
                "name": "Balanced NPK Fertilizer",
                "procedure": "Apply balanced NPK fertilizer (20-20-20) at 2g per liter of water, applied every 2 weeks to maintain plant health."
            }
        else:
            # Disease-specific fertilizer recommendations
            if "bacterial" in disease_name.lower():
                fertilizer_recommendation = {
                    "name": "Copper-based Bactericide + Balanced NPK",
                    "procedure": "Apply copper-based bactericide every 7-10 days. Use balanced NPK fertilizer (20-20-20) at 1.5g per liter of water, applied weekly."
                }
            elif "fungal" in disease_info.get("cause", "").lower() or "fungus" in disease_info.get("cause", "").lower():
                fertilizer_recommendation = {
                    "name": "Fungicide + Potassium-rich Fertilizer",
                    "procedure": "Apply appropriate fungicide every 7-10 days. Use potassium-rich fertilizer (15-15-30) at 2g per liter of water, applied weekly."
                }
            elif "virus" in disease_name.lower():
                fertilizer_recommendation = {
                    "name": "Systemic Insecticide + Balanced NPK",
                    "procedure": "Control vector insects with systemic insecticide. Apply balanced NPK fertilizer (20-20-20) at 1.5g per liter of water, applied every 10 days."
                }
            else:
                fertilizer_recommendation = {
                    "name": "General Disease Control + Balanced NPK",
                    "procedure": "Apply appropriate disease control treatment. Use balanced NPK fertilizer (20-20-20) at 2g per liter of water, applied weekly until symptoms improve."
                }
        
        return {
            "disease_name": disease_name,
            "confidence": confidence,
            "is_healthy": is_healthy,
            "disease_info": {
                "cause": disease_info.get("cause", "Unknown cause"),
                "cure": disease_info.get("cure", "Please consult with an agricultural expert")
            },
            "fertilizer_recommendation": fertilizer_recommendation,
            "message": f"Plant disease detection completed with {confidence:.2%} confidence."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")



mcp = FastApiMCP(
    app,
    name="Agri Controller",
    description="MCP for BMI, Soil health, Crop Yield, Crop Recommendation, and Fertilizer Recommendation tools"
)
mcp.mount_http()






# crew_mcp_agent.py
import sys
from crewai import Agent, Task, Crew, Process, LLM
from crewai_tools import MCPServerAdapter
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
load_dotenv()


import os
os.environ["OPENAI_API_KEY"] = "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"

server_params = {"url": "http://127.0.0.1:8000/mcp", "transport": "streamable-http"}
llm = LLM(model="openrouter/openai/gpt-oss-20b:free")

@app.get("/query")
def main(user_query: str):
    with MCPServerAdapter(server_params, connect_timeout=60) as mcp_tools:
        selected_tools = list(mcp_tools)
        ## for  debugging
        print("\n--- AVAILABLE TOOLS ---")
        for tool in selected_tools:
            print(f"Tool: {tool.name} | Description: {tool.description}")
        print("-----------------------\n")
        ###
        agent = Agent(
            role="MCP Tooling Agent",
           ## goal="do not make unneccessary api calls to llm and answer the queries based on tools you have",
            goal="Use available MCP tools to answer queries",
            backstory=f"The current farmer stats are {farmers.get(curr_farmer_id)}",
            tools=selected_tools,
            llm=llm,
            verbose=True,
        )

        task = Task(
            description=user_query,  # 👈 feed user input here
            # expected_output="Answer the query using MCP tools if needed. do not give formatted md, give me plain string",
            expected_output="Plain string answer using MCP tools if needed",
            agent=agent,
            markdown=True,
        )

        crew = Crew(
            agents=[agent],
            tasks=[task],
            process=Process.sequential,
            verbose=True,
        )
        result = crew.kickoff()
        print("\n--- RESULT ---\n", result)

        # Ensure plain string only
        return str(result.raw) if hasattr(result, "raw") else str(result)

if __name__ == "__main__":
    # read user query from command line
    query = " ".join(sys.argv[1:]) or "List available MCP tools and return results."
    main(query)
