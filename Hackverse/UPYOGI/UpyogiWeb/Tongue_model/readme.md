🌿 AyurScan — Ayurvedic Tongue Diagnosis using AI (Deep Learning + Ayurveda)

AyurScan is an advanced **AI-powered Ayurvedic Tongue Diagnosis System** that predicts **Dosha imbalance (Vata, Pitta, Kapha)** and suggests health issues using **Deep Learning + Image Processing + Ayurvedic principles**.

This project combines:
- 🧠 **CNN-based Deep Learning Model (PyTorch + EfficientNet)**
- 📷 **OpenCV Tongue Image Preprocessing**
- 🌿 **Ayurvedic Dosha Mapping**
- ⚡ **Fast Flask API Backend**
- 🎨 **Modern Frontend with Dark Mode + History + Smart Capture**

Fully built for Hackathons, Startups, Research & Production.

---

## ✨ Features

### 🔬 **AI + Ayurvedic Diagnosis**
- Predicts **Vata / Pitta / Kapha** imbalance from tongue image  
- Provides **Ayurvedic-based health issue suggestions**  
- Gives **severity insights**  

### 🎥 **Smart Auto-Capture (Vision Mode)**
- Live camera feed  
- Auto capture when tongue is detected  
- Clear UI alerts & warnings  

### 🌓 **Dark Mode**
- Saves theme in LocalStorage  
- Professional UI look  

### 📚 **Scan History**
- Stores last 10 scans locally  
- Click to reopen previous results  
- Clear history button  

### ⚙️ **Real Backend Integration**
- `/analyze` endpoint for AI prediction  
- `/auto_tongue_check` for smart auto-capture  
- Fully working frontend ↔ backend connection  

### 🎨 **Modern UI**
- Google Outfit font  
- Smooth animations  
- Mobile responsive  
- Toast notifications  
- Loading indicators  

---

# 📁 Project Folder Structure

AYUR-PROJECT/
│
├── backend/
│ ├── app.py # Main Flask server
│ ├── ml_cnn.py # Deep learning model (PyTorch)
│ ├── cv_utils.py # Image processing (OpenCV)
│ ├── config.py # Label mappings / constants
│ ├── tongue_cnn_efficientnet.pt # Trained model
│ ├── requirements.txt
│ └── static/
│ └── uploads/ # Uploaded images (auto created)
│
├── frontend/
│ ├── index.html # Main UI
│ ├── style.css # Stylesheets
│ ├── main.js # API + Camera + Logic
│ └── assets/
│ ├── logos/
│ ├── icons/
│ └── sample_images/
│
├── .gitignore
└── README.md

yaml
Copy code

---

# 🚀 Installation Guide

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/bhataakib02/Nirman5.0
cd Hackverse/AYUR-PROJECT
🔧 Backend Setup (Flask + PyTorch)
Make sure Python 3.10+ installed.

2️⃣ Create Virtual Environment
bash
Copy code
python -m venv venv
venv\Scripts\activate   # windows
3️⃣ Install Requirements
bash
Copy code
pip install -r requirements.txt
If TensorFlow conflicts appear → ignore, this project uses PyTorch only.

4️⃣ Run the Backend
bash
Copy code
python app.py
Backend will start on:

cpp
Copy code
http://127.0.0.1:5000
🎨 Frontend Setup
Simply open:

bash
Copy code
frontend/index.html
Or run a local server:

bash
Copy code
cd frontend
python -m http.server 8000
🔌 API Documentation
POST /analyze
Send tongue image → get Dosha + health predictions.

Request (multipart/form-data)
arduino
Copy code
image: <file>
Response
json
Copy code
{
  "dosha": "Pitta",
  "confidence": 0.87,
  "issues": ["Acidity", "Heat in body", "Inflammation"],
  "severity": "moderate"
}
GET /auto_tongue_check
Auto-capture logic for live mode.

🧠 Model Details (EfficientNet Deep Learning)
Model Type: EfficientNet-B0

Framework: PyTorch

Training Images: 600+ real Ayurvedic labeled tongue images

Classes: Vata, Pitta, Kapha

Accuracy: 84% on validation

Preprocessing:

Resize → 224 × 224

RGB correction

Tongue region isolation

Adaptive histogram equalization


🛠️ For Developers
Enable Debug Logs:
arduino
Copy code
export FLASK_DEBUG=1
Change Model:
Replace tongue_cnn_efficientnet.pt in backend.

🧾 License
MIT License. Free for research, hackathons, commercial use.

🤝 Contributing
PRs are welcome!

New model?

Better UI?

Add Ayurveda datasets?

Feel free to contribute.


AyurScan — combining AI + Ayurveda + Innovation 🌿

---
