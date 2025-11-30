# backend/config.py
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).resolve().parents[1]
MODELS_DIR = BASE_DIR / "models"

# CNN model path (to be created after training)
CNN_MODEL_PATH = MODELS_DIR / "tongue_cnn_efficientnet.pt"

# Tongue tracking thresholds (for /auto_tongue_check)
TONGUE_MIN_RATIO = 0.06       # minimum fraction of ROI marked as tongue
BBOX_MIN_RATIO = 0.05         # bounding box of tongue region / ROI area
CENTER_MAX_OFFSET = 0.35      # 0=centered, 1=very off-center
MIN_SHARPNESS = 25.0          # Laplacian variance minimum

# Debug flags
DEBUG_LOG_CV = False
