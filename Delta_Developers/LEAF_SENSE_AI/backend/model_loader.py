import os
import json
import numpy as np
from tensorflow import keras
from PIL import Image
import io

class ModelLoader:
    def __init__(self):
        self.model = None
        self.class_names = None
        self.load_model()
    
    def load_model(self):
        """Load the trained CNN model."""
        model_path = 'backend/ml/leaf_model.h5'
        class_names_path = 'backend/ml/class_names.json'
        
        if os.path.exists(model_path):
            try:
                self.model = keras.models.load_model(model_path)
                print("✓ Model loaded from", model_path)
            except Exception as e:
                print(f"✗ Error loading model: {e}")
                self.model = None
        else:
            print(f"✗ Model file not found at {model_path}")
            print("Using simulated predictions instead.")
            self.model = None
        
        if os.path.exists(class_names_path):
            with open(class_names_path, 'r') as f:
                self.class_names = json.load(f)
            print("✓ Class names loaded:", self.class_names)
        else:
            self.class_names = ['healthy', 'early_blight', 'late_blight', 'rust']
            print("✗ Class names file not found, using defaults:", self.class_names)
    
    def predict(self, image_data: bytes):
        """
        Predict disease from image data.
        
        Args:
            image_data: Image file bytes
            
        Returns:
            dict with predicted_class and confidence
        """
        try:
            # Load and preprocess image
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            image = image.resize((224, 224))
            image_array = np.array(image) / 255.0
            image_array = np.expand_dims(image_array, axis=0)
            
            if self.model is None:
                # Simulate prediction for demo
                import random
                predicted_class_idx = random.randint(0, len(self.class_names) - 1)
                confidence = round(random.uniform(70, 99), 1)
            else:
                # Use actual model
                predictions = self.model.predict(image_array)
                predicted_class_idx = np.argmax(predictions[0])
                confidence = round(float(predictions[0][predicted_class_idx]) * 100, 1)
            
            predicted_class = self.class_names[predicted_class_idx]
            
            return {
                "predicted_class": predicted_class,
                "confidence": confidence
            }
        except Exception as e:
            print(f"Error during prediction: {e}")
            return {
                "predicted_class": "unknown",
                "confidence": 0
            }

# Global instance
model_loader = ModelLoader()
