# backend/cv_utils.py
import re
import base64
from typing import Tuple, Dict, Any

import cv2
import numpy as np

from .config import (
    TONGUE_MIN_RATIO,
    BBOX_MIN_RATIO,
    CENTER_MAX_OFFSET,
    MIN_SHARPNESS,
    DEBUG_LOG_CV,
)


def decode_base64_image(base64_string: str):
    """Decode base64 dataURL image to OpenCV BGR image."""
    if not base64_string:
        return None
    base64_data = re.sub(r'^data:image/.+;base64,', '', base64_string)
    img_bytes = base64.b64decode(base64_data)
    img_array = np.frombuffer(img_bytes, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return img


def analyze_tongue_cv(image) -> Tuple[str, str, str, float, float, int]:
    """
    Extract interpretable features from tongue:
    - dominant hue (for color)
    - white coating percentage
    - sharpness (texture)
    Returns:
      (color_cat, coating_cat, texture_cat, white_percent, sharpness, dominant_hue)
    """
    image = cv2.resize(image, (320, 240))
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # dominant hue
    hist = cv2.calcHist([hsv], [0], None, [180], [0, 180])
    dominant_hue = int(np.argmax(hist))

    if dominant_hue < 10 or dominant_hue > 170:
        color = "red"
    elif 15 < dominant_hue < 35:
        color = "yellow"
    elif 0 <= dominant_hue <= 15:
        color = "pale"
    else:
        color = "normal"

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, white_mask = cv2.threshold(gray, 190, 255, cv2.THRESH_BINARY)
    white_percent = np.sum(white_mask == 255) / white_mask.size * 100

    if white_percent > 45:
        coating = "thick_white"
    elif white_percent > 20:
        coating = "thin_white"
    else:
        coating = "none"

    sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
    texture = "dry" if sharpness < 40 else "smooth"

    if DEBUG_LOG_CV:
        print(
            f"[CV] hue={dominant_hue}, color={color}, white%={white_percent:.2f}, "
            f"sharpness={sharpness:.2f}, coating={coating}, texture={texture}"
        )

    return color, coating, texture, float(white_percent), float(sharpness), dominant_hue


def evaluate_tongue_position(image) -> Tuple[bool, Dict[str, float], str]:
    """
    Heuristic tongue tracking for /auto_tongue_check:
    - Uses HSV range for tongue-ish colors (pink/red)
    - Checks:
      - tongue area ratio
      - bounding box size
      - centering
      - sharpness
    Returns:
      ok (bool), metrics (dict), message (str to display to user)
    """
    h, w = image.shape[:2]

    # central ROI where we expect tongue
    x1, x2 = int(0.15 * w), int(0.85 * w)
    y1, y2 = int(0.25 * h), int(0.9 * h)
    roi = image[y1:y2, x1:x2]

    roi_h, roi_w = roi.shape[:2]
    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)

    # broader pink/red-ish range
    lower = np.array([0, 20, 20])
    upper = np.array([30, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)

    tongue_pixels = np.count_nonzero(mask)
    total_pixels = mask.size
    tongue_ratio = tongue_pixels / total_pixels if total_pixels > 0 else 0.0

    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    bbox_area_ratio = 0.0
    center_offset = 1.0

    if contours:
        c = max(contours, key=cv2.contourArea)
        x, y, wc, hc = cv2.boundingRect(c)
        bbox_area_ratio = (wc * hc) / float(total_pixels)

        cx = x + wc / 2.0
        cy = y + hc / 2.0
        roi_cx = roi_w / 2.0
        roi_cy = roi_h / 2.0

        center_offset = (abs(cx - roi_cx) / roi_w + abs(cy - roi_cy) / roi_h) / 2.0

    ok = True
    if tongue_ratio < TONGUE_MIN_RATIO:
        ok = False
        message = "We can't see enough of your tongue. Move closer and extend it fully."
    elif bbox_area_ratio < BBOX_MIN_RATIO:
        ok = False
        message = "Bring your tongue more into the middle of the frame."
    elif center_offset > CENTER_MAX_OFFSET:
        ok = False
        message = "Center your tongue in the frame."
    elif sharpness < MIN_SHARPNESS:
        ok = False
        message = "Hold still for a second; the image is a bit blurry."
    else:
        message = "Perfect! Tongue is visible and clear – capturing this frame."

    metrics = {
        "tongue_ratio": float(tongue_ratio),
        "bbox_area_ratio": float(bbox_area_ratio),
        "center_offset": float(center_offset),
        "sharpness": float(sharpness),
    }

    if DEBUG_LOG_CV:
        print("[CV] auto_check:", metrics, "ok=", ok)

    return ok, metrics, message


def score_dosha(tongue_color: str, coating: str, texture: str) -> Tuple[str, Dict[str, int]]:
    """
    Simple rule-based scoring for Vata/Pitta/Kapha based on tongue features.
    Acts as a fallback when CNN is not available and as a comparison signal.
    """
    score = {"vata": 0, "pitta": 0, "kapha": 0}

    # Color rules
    if tongue_color == "pale":
        score["vata"] += 2
    elif tongue_color == "red":
        score["pitta"] += 2
    elif tongue_color == "yellow":
        score["pitta"] += 1
        score["kapha"] += 1

    # Coating rules
    if coating == "none":
        score["vata"] += 1
    elif coating == "thin_white":
        score["kapha"] += 1
    elif coating == "thick_white":
        score["kapha"] += 2

    # Texture rules
    if texture == "dry":
        score["vata"] += 2
    elif texture == "smooth":
        score["kapha"] += 1

    dominant = max(score, key=score.get)
    return dominant, score
