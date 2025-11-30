# LeafSense AI - Digital Crop Doctor

A complete AI-powered crop disease diagnosis system with a Python FastAPI backend and React web frontend.

## Features

- **Leaf Disease Diagnosis**: Upload leaf images for instant AI-powered disease detection
- **Disease Packs**: Browse comprehensive disease information for common crops
- **AI Chatbot**: Ask questions about diseases, treatments, and prevention
- **CNN Model**: TensorFlow-based leaf disease classification
- **Mobile-First UI**: Responsive design optimized for farmers

## Project Structure

```
/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── model_loader.py         # CNN model loader
│   ├── requirements.txt        # Python dependencies
│   ├── disease_packs.json      # Disease information database
│   └── ml/
│       ├── train_cnn.py        # CNN training script
│       ├── leaf_model.h5       # Trained model (generated)
│       └── class_names.json    # Class labels (generated)
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        └── components/
            ├── BottomNav.jsx
            ├── HomeScreen.jsx
            ├── DiagnoseScreen.jsx
            ├── DiseasePacksScreen.jsx
            ├── ChatScreen.jsx
            └── ProfileScreen.jsx
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Train the CNN Model (Optional)

If you have a training dataset:

```bash
python ml/train_cnn.py
```

Dataset structure should be:
```
dataset/
  train/
    healthy/
    early_blight/
    late_blight/
    rust/
  val/
    (same structure)
```

For demo purposes, the backend will use simulated predictions if the model isn't available.

### 3. Run the Backend

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

API Endpoints:
- `GET /health` - Health check
- `POST /predict` - Predict disease from leaf image
- `POST /chat` - Rule-based chatbot
- `GET /disease-packs` - Get disease information

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

## How to Use

1. **Start Backend**: `cd backend && uvicorn main:app --host 0.0.0.0 --port 8000`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **Upload Leaf**: Go to Diagnose tab and upload a leaf image
5. **View Results**: Get instant disease prediction with confidence score
6. **Browse Diseases**: Check Disease Packs for comprehensive disease info
7. **Ask Questions**: Use Chat to ask about treatments and prevention

## Technology Stack

### Backend
- **Framework**: FastAPI
- **ML**: TensorFlow/Keras
- **Image Processing**: PIL
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS (Mobile-first responsive)
- **State**: React Hooks

## Disease Classification

The CNN model classifies leaf images into 4 categories:
1. **Healthy** - No disease
2. **Early Blight** - Fungal infection on older leaves
3. **Late Blight** - Rapid fungal infection
4. **Rust** - Orange/brown pustules on leaves

## API Examples

### Predict Disease
```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@leaf_image.jpg"
```

Response:
```json
{
  "predicted_class": "early_blight",
  "confidence": 92.5
}
```

### Ask Chat
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d {
    "disease": "early_blight",
    "question": "How do I treat this?"
  }
```

### Get Disease Packs
```bash
curl http://localhost:8000/disease-packs
```

## Future Enhancements

- Real CNN model training with agricultural datasets
- Multi-language support
- Weather-based recommendations
- Community sharing features
- Mobile app (React Native)
- Real-time crop monitoring

## License

Created for agricultural improvement and farmer empowerment.

## Support

For issues or questions, please reach out to the development team.
