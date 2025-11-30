import os
import json
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def build_cnn_model(num_classes=4):
    """Build a simple CNN model for leaf disease classification."""
    model = keras.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def train_model():
    """Train the CNN model on leaf disease dataset."""
    # Dataset paths
    train_dir = 'dataset/train'
    val_dir = 'dataset/val'
    
    # Check if dataset exists
    if not os.path.exists(train_dir):
        print("Dataset not found. Please ensure dataset/train and dataset/val exist.")
        print("Dataset structure should be:")
        print("  dataset/train/healthy/, early_blight/, late_blight/, rust/")
        print("  dataset/val/healthy/, early_blight/, late_blight/, rust/")
        print("\nFor demo purposes, training will be skipped.")
        print("Using simulated model instead.")
        return None
    
    # Class names
    class_names = ['healthy', 'early_blight', 'late_blight', 'rust']
    
    # Data generators
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True
    )
    
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    # Load training data
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='sparse'
    )
    
    # Load validation data
    val_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='sparse'
    )
    
    # Build and train model
    model = build_cnn_model(len(class_names))
    
    print("Training CNN model for leaf disease classification...")
    model.fit(
        train_generator,
        epochs=10,
        validation_data=val_generator
    )
    
    # Save model
    model.save('backend/ml/leaf_model.h5')
    print("Model saved to backend/ml/leaf_model.h5")
    
    # Save class names
    with open('backend/ml/class_names.json', 'w') as f:
        json.dump(class_names, f)
    print("Class names saved to backend/ml/class_names.json")
    
    return model

if __name__ == '__main__':
    train_model()
