# backend/ml_cnn.py
from typing import Optional, Dict, Any

import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights
from PIL import Image
import cv2

from .config import CNN_MODEL_PATH
from .cv_utils import score_dosha

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

cnn_model: Optional[nn.Module] = None
cnn_classes: Optional[list] = None

# Same normalization as training (ImageNet)
cnn_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def load_cnn_model():
    global cnn_model, cnn_classes
    if not CNN_MODEL_PATH.exists():
        print(f"⚠️ CNN model not found at {CNN_MODEL_PATH}. Using rule-based dosha only.")
        return

    checkpoint = torch.load(CNN_MODEL_PATH, map_location=device)
    class_names = checkpoint.get("class_names")
    if class_names is None:
        raise RuntimeError("Model checkpoint missing 'class_names' key.")

    num_classes = len(class_names)
    model = efficientnet_b0(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()

    cnn_model = model
    cnn_classes = class_names
    print("✅ Loaded CNN tongue dosha model with classes:", cnn_classes)


# Load at import time
load_cnn_model()


def predict_dosha_with_cnn(img_bgr, tongue_color: str, coating: str, texture: str) -> Dict[str, Any]:
    """
    Wrapper for CNN inference + rule-based backup.
    img_bgr: OpenCV BGR image
    tongue_color/coating/texture: from CV features (for rule-based comparison)
    """
    # Always provide rule-based baseline
    rule_dosha, rule_score = score_dosha(tongue_color, coating, texture)

    if cnn_model is None or cnn_classes is None:
        return {
            "final_dosha": rule_dosha,
            "ml_dosha": None,
            "ml_probs": None,
            "rule_dosha": rule_dosha,
            "rule_score": rule_score,
            "message": f"Detected {rule_dosha.capitalize()} imbalance using CV rules (CNN model not loaded)."
        }

    # CNN path
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(img_rgb)
    with torch.no_grad():
        input_tensor = cnn_transform(pil_img).unsqueeze(0).to(device)
        outputs = cnn_model(input_tensor)
        probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]

    best_idx = probs.argmax()
    ml_dosha = str(cnn_classes[best_idx])
    ml_probs = {str(cnn_classes[i]): float(probs[i]) for i in range(len(cnn_classes))}

    # For now, we trust CNN as final; you could also combine with rule_dosha
    final_dosha = ml_dosha
    message = f"CNN predicts {ml_dosha.capitalize()} dominance (trained on tongue dataset)."

    return {
        "final_dosha": final_dosha,
        "ml_dosha": ml_dosha,
        "ml_probs": ml_probs,
        "rule_dosha": rule_dosha,
        "rule_score": rule_score,
        "message": message
    }
