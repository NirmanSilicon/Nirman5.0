import os
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights

from sklearn.metrics import confusion_matrix, classification_report
import numpy as np


# ----- Paths -----
BASE_DIR = Path(__file__).resolve().parents[1]
DATASET_DIR = BASE_DIR / "data" / "tongue_dataset"
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "tongue_cnn_efficientnet.pt"


def load_dataset(batch_size: int = 16):
    """
    Load the *entire* dataset for evaluation (no train/val split).
    Uses the same folder structure: data/tongue_dataset/<dosha>/images...
    """

    if not DATASET_DIR.exists():
        raise FileNotFoundError(f"Dataset folder not found: {DATASET_DIR}")

    eval_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    dataset = datasets.ImageFolder(DATASET_DIR, transform=eval_transform)
    class_names = dataset.classes  # folder names as labels, e.g. ["kapha", "pitta", "vata"]

    if len(dataset) == 0:
        raise RuntimeError("Dataset is empty. Put labeled images into data/tongue_dataset/<dosha>/")

    loader = DataLoader(dataset, batch_size=batch_size, shuffle=False, num_workers=0)
    return loader, class_names


def load_model(class_names):
    """
    Load EfficientNet-B0 model and weights from MODEL_PATH.
    Expects checkpoint with: {"model_state_dict", "class_names"}.
    """
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Trained model not found: {MODEL_PATH}")

    checkpoint = torch.load(MODEL_PATH, map_location="cpu")

    ckpt_classes = checkpoint.get("class_names")
    if ckpt_classes is None:
        raise RuntimeError("Checkpoint missing 'class_names' field.")

    # Check that dataset classes match checkpoint classes (order matters)
    if list(ckpt_classes) != list(class_names):
        print("⚠️ Warning: class names in checkpoint and dataset differ.")
        print("  Checkpoint classes:", ckpt_classes)
        print("  Dataset    classes:", class_names)
        print("Using checkpoint classes for decoding predictions.")

    num_classes = len(ckpt_classes)
    model = efficientnet_b0(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    model.load_state_dict(checkpoint["model_state_dict"])

    return model, ckpt_classes


def evaluate(batch_size: int = 16):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("Using device:", device)

    loader, dataset_classes = load_dataset(batch_size=batch_size)
    model, ckpt_classes = load_model(dataset_classes)
    model.to(device)
    model.eval()

    all_labels = []
    all_preds = []

    with torch.no_grad():
        for images, labels in loader:
            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)
            _, preds = outputs.max(1)

            all_labels.extend(labels.cpu().numpy().tolist())
            all_preds.extend(preds.cpu().numpy().tolist())

    all_labels = np.array(all_labels)
    all_preds = np.array(all_preds)

    # Overall accuracy
    accuracy = (all_labels == all_preds).mean()
    print(f"\n✅ Overall accuracy on dataset: {accuracy:.3f}")

    # Confusion matrix
    cm = confusion_matrix(all_labels, all_preds)
    print("\nConfusion Matrix (rows = true, cols = predicted):")
    print("Classes (index):", list(enumerate(ckpt_classes)))
    print(cm)

    # Classification report
    print("\nClassification Report:")
    print(classification_report(all_labels, all_preds, target_names=ckpt_classes, digits=3))


if __name__ == "__main__":
    evaluate()
