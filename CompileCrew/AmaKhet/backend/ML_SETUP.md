# Plant Disease Detection ML Setup

This guide explains how to set up the plant disease detection feature using the trained ML model.

## Prerequisites

1. **Python Dependencies**: Make sure you have the required packages installed:
   ```bash
   pip install tensorflow pillow fastapi python-multipart
   ```

2. **ML Model Files**: Ensure you have the following files in the `ML/ML/` directory:
   - `plant_disease_recog_model_pwp.keras` - The trained TensorFlow model
   - `plant_disease.json` - Disease information database

## Setup Instructions

### Option 1: Automatic Setup (Recommended)
Run the setup script to copy ML files to the backend directory:
```bash
cd backend
python setup_ml_files.py
```

### Option 2: Manual Setup
1. Copy the ML files to `backend/ML/ML/`:
   ```bash
   mkdir -p backend/ML/ML
   cp ML/ML/plant_disease_recog_model_pwp.keras backend/ML/ML/
   cp ML/ML/plant_disease.json backend/ML/ML/
   ```

## Running the Backend

1. **Start the FastAPI server**:
   ```bash
   cd backend
   python main.py
   ```

2. **Verify the setup**: The server should start and show:
   ```
   ✅ Loaded model from: ML/ML/plant_disease_recog_model_pwp.keras
   ✅ Loaded disease data from: ML/ML/plant_disease.json
   Plant disease model and data loaded successfully!
   ```

## API Endpoint

The plant disease detection endpoint is available at:
```
POST http://localhost:8000/plant_disease_detection
```

**Request**: Multipart form data with image file
**Response**: JSON with disease analysis results

### Example Response:
```json
{
  "disease_name": "Tomato___Early_blight",
  "confidence": 0.95,
  "is_healthy": false,
  "disease_info": {
    "cause": "Fungus Alternaria solani.",
    "cure": "Apply fungicides and remove infected leaves."
  },
  "fertilizer_recommendation": {
    "name": "Fungicide + Potassium-rich Fertilizer",
    "procedure": "Apply appropriate fungicide every 7-10 days. Use potassium-rich fertilizer (15-15-30) at 2g per liter of water, applied weekly."
  },
  "message": "Plant disease detection completed with 95.00% confidence."
}
```

## Supported Plant Diseases

The model can detect diseases in the following plants:
- Apple (Apple scab, Black rot, Cedar apple rust, Healthy)
- Blueberry (Healthy)
- Cherry (Powdery mildew, Healthy)
- Corn (Cercospora leaf spot, Common rust, Northern Leaf Blight, Healthy)
- Grape (Black rot, Esca, Leaf blight, Healthy)
- Orange (Huanglongbing/Citrus greening)
- Peach (Bacterial spot, Healthy)
- Pepper (Bacterial spot, Healthy)
- Potato (Early blight, Late blight, Healthy)
- Raspberry (Healthy)
- Soybean (Healthy)
- Squash (Powdery mildew)
- Strawberry (Leaf scorch, Healthy)
- Tomato (Bacterial spot, Early blight, Late blight, Leaf Mold, Septoria leaf spot, Spider mites, Target Spot, Yellow Leaf Curl Virus, Mosaic virus, Healthy)

## Troubleshooting

### Model Loading Issues
- Ensure the model file path is correct
- Check that TensorFlow is properly installed
- Verify the model file is not corrupted

### Image Processing Issues
- Supported formats: JPG, PNG, JPEG
- Recommended image size: Clear images of plant leaves
- Ensure good lighting and focus on affected areas

### API Connection Issues
- Verify the backend server is running on port 8000
- Check CORS settings if running frontend on different port
- Ensure all required dependencies are installed

## Frontend Integration

The frontend CropDiseaseCard component automatically:
1. Accepts image uploads
2. Sends images to the backend API
3. Displays disease analysis results
4. Shows confidence levels
5. Provides fertilizer recommendations

Make sure the frontend is configured to connect to `http://localhost:8000` for the API calls.
