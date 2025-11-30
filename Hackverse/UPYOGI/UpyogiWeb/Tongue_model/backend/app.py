# backend/app.py
import os

from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS

# Internal project modules
from . import cv_utils
from .ml_cnn import predict_dosha_with_cnn
from .remedies import REMEDIES
from .config import BASE_DIR
from .rag_engine import get_rag_advice


app = Flask(
    __name__,
    static_folder=str(BASE_DIR / "frontend" / "static"),
    static_url_path="/static"
)
CORS(app)


@app.route("/")
def home():
    # Serve the frontend index.html from ../frontend
    frontend_dir = BASE_DIR / "frontend"
    return send_from_directory(frontend_dir, "index.html")


@app.route("/auto_tongue_check", methods=["POST"])
def auto_tongue_check():
    data = request.get_json(force=True)
    image_data = data.get("image_data")

    img = cv_utils.decode_base64_image(image_data)
    if img is None:
        return jsonify({"ok": False, "message": "No valid image received."}), 400

    ok, metrics, message = cv_utils.evaluate_tongue_position(img)

    return jsonify({
        "ok": ok,
        "message": message,
        **metrics
    })


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(force=True)

    image_data = data.get("image_data")
    disease_key = data.get("disease_key")
    symptoms = data.get("symptoms", "")

    if not image_data:
        return jsonify({
            "error": "No image_data received. Please capture a photo first."
        }), 400

    img = cv_utils.decode_base64_image(image_data)
    if img is None:
        return jsonify({"error": "Could not decode image."}), 400

    # CV features (for explainability & rule-based fallback)
    tongue_color, coating, texture, white_percent, sharpness, hue = cv_utils.analyze_tongue_cv(img)

    # CNN + rule-based fusion
    dosha_info = predict_dosha_with_cnn(img, tongue_color, coating, texture)

    final_dosha = dosha_info["final_dosha"]
    ml_dosha = dosha_info["ml_dosha"]
    ml_probs = dosha_info["ml_probs"]
    rule_dosha = dosha_info["rule_dosha"]
    rule_score = dosha_info["rule_score"]
    message = dosha_info["message"]

    # --- RAG advice (Ayurvedic KB) ---
    tongue_features = {
        "tongue_color": tongue_color,
        "coating": coating,
        "texture": texture,
    }
    rag_info = get_rag_advice(
        dosha=final_dosha,
        problem=disease_key,
        symptoms=symptoms,
        tongue_features=tongue_features,
        top_k=3
    )

    # Existing static fallback REMEDIES (if configured)
    remedies_block = REMEDIES.get(final_dosha, {}).get(disease_key)

    if remedies_block:
        fallback_remedies = remedies_block["remedies"]
        fallback_diet = remedies_block["diet"]
        fallback_lifestyle = remedies_block["lifestyle"]
    else:
        fallback_remedies = []
        fallback_diet = []
        fallback_lifestyle = []

    # Merge RAG + fallback: RAG first, then fallback items appended
    def merge_lists(primary, secondary):
        seen = set()
        out = []
        for x in primary + secondary:
            if x and x not in seen:
                seen.add(x)
                out.append(x)
        return out

    final_remedies = merge_lists(rag_info.get("rag_remedies", []), fallback_remedies)
    final_diet = merge_lists(rag_info.get("rag_diet", []), fallback_diet)
    final_lifestyle = merge_lists(rag_info.get("rag_lifestyle", []), fallback_lifestyle)

    return jsonify({
        "dosha": final_dosha,
        "ml_dosha": ml_dosha,
        "ml_probs": ml_probs,
        "rule_dosha": rule_dosha,
        "rule_score": rule_score,
        "tongue_color": tongue_color,
        "coating": coating,
        "texture": texture,
        "white_percent": white_percent,
        "edge_variance": sharpness,
        "dominant_hue": hue,
        "remedies": final_remedies,
        "diet": final_diet,
        "lifestyle": final_lifestyle,
        "message": message,
        "note": "This is not a medical diagnosis. Please consult a qualified Ayurvedic doctor for serious conditions.",
        # Extra RAG debug info (optional, useful for your testing/JSON view)
        "rag_used": rag_info.get("rag_used", False),
        "rag_hits": rag_info.get("rag_hits", []),
    })



if __name__ == "__main__":
    # For local dev; Docker will use gunicorn CMD in Dockerfile
    app.run(host="0.0.0.0", port=5000, debug=True)
