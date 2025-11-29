import os
from pathlib import Path

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights


# ----- Paths -----
BASE_DIR = Path(__file__).resolve().parents[1]
DATASET_DIR = BASE_DIR / "data" / "tongue_dataset"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODELS_DIR / "tongue_cnn_efficientnet.pt"


def get_dataloaders(val_ratio: float = 0.2, batch_size: int = 16):
    """
    Creates train/val dataloaders from data/tongue_dataset/
    where subfolders are dosha labels: vata/, pitta/, kapha/.
    """

    if not DATASET_DIR.exists():
        raise FileNotFoundError(f"Dataset folder not found: {DATASET_DIR}")

    # Data augmentation + normalization (ImageNet style)
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    # ImageFolder automatically uses subfolder names as class labels
    full_dataset = datasets.ImageFolder(DATASET_DIR, transform=train_transform)
    class_names = full_dataset.classes  # e.g. ["kapha", "pitta", "vata"]
    print("Found classes:", class_names)
    n_total = len(full_dataset)
    if n_total == 0:
        raise RuntimeError("Dataset is empty. Put labeled images into data/tongue_dataset/<dosha>/")

    n_val = max(1, int(val_ratio * n_total))
    n_train = n_total - n_val
    print(f"Total images: {n_total} | Train: {n_train} | Val: {n_val}")

    train_dataset, val_dataset = random_split(full_dataset, [n_train, n_val])

    # Important: validation dataset should not use augmentation
    # So we override its transform to val_transform
    val_dataset.dataset.transform = val_transform

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    return train_loader, val_loader, class_names


def build_model(num_classes: int, freeze_backbone: bool = True) -> nn.Module:
    """
    Build EfficientNet-B0 model for 3-class dosha classification.
    If freeze_backbone=True, only final classifier layer is trained initially.
    """
    model = efficientnet_b0(weights=EfficientNet_B0_Weights.DEFAULT)

    if freeze_backbone:
        for param in model.features.parameters():
            param.requires_grad = False

    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    return model


def train_cnn_dosha(
    num_epochs: int = 12,
    lr: float = 1e-4,
    freeze_backbone_epochs: int = 4,
    batch_size: int = 16
):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("Using device:", device)

    train_loader, val_loader, class_names = get_dataloaders(batch_size=batch_size)
    num_classes = len(class_names)

    # Build model
    model = build_model(num_classes=num_classes, freeze_backbone=True)
    model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=lr)

    best_val_acc = 0.0

    for epoch in range(num_epochs):
        # After some epochs, unfreeze backbone for fine-tuning
        if epoch == freeze_backbone_epochs:
            print("Unfreezing backbone for fine-tuning...")
            for param in model.features.parameters():
                param.requires_grad = True
            optimizer = optim.Adam(model.parameters(), lr=lr * 0.5)

        # ---- Train ----
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = outputs.max(1)
            correct += preds.eq(labels).sum().item()
            total += labels.size(0)

        train_loss = running_loss / total
        train_acc = correct / total if total > 0 else 0.0

        # ---- Validation ----
        model.eval()
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                _, preds = outputs.max(1)
                val_correct += preds.eq(labels).sum().item()
                val_total += labels.size(0)

        val_acc = val_correct / val_total if val_total > 0 else 0.0

        print(
            f"Epoch {epoch+1}/{num_epochs} "
            f"| Train Loss={train_loss:.4f} "
            f"| Train Acc={train_acc:.3f} "
            f"| Val Acc={val_acc:.3f}"
        )

        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(
                {
                    "model_state_dict": model.state_dict(),
                    "class_names": class_names,
                },
                MODEL_PATH,
            )
            print(f"✅ Saved new best model to {MODEL_PATH} (val_acc={val_acc:.3f})")

    print("Training complete. Best validation accuracy:", best_val_acc)


if __name__ == "__main__":
    train_cnn_dosha()
2