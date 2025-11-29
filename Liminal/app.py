from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import joblib
import os

# -------------------------------------------------
# APP SETUP
# -------------------------------------------------
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# -------------------------------------------------
# GAME CONFIGURATION
# -------------------------------------------------

GAMES = {
    "market": {
        "name": "Market Simulator",
        "model": joblib.load("market-simulator/model.pkl"),
        "encoder": joblib.load("market-simulator/label_encoder.pkl"),
        "csv": "market-simulator/user_data_store.csv",
        "features": [
            "market_volatility", "news_sentiment", "reaction_time_ms",
            "high_risk_moves", "safe_moves", "social_follow_score",
            "impulse_buy_score", "loss_aversion_score",
            "debt_ratio", "reward_points",
        ]
    },

    "budget": {
        "name": "Cash Flow Runner",
        "model": joblib.load("cash-flow-runner/model.pkl"),
        "encoder": None,  # if binary or already strings, else load encoder.pkl
        "csv": "cash-flow-runner/user_data.csv",
        "features": [
            "cost_in_rs",
            "frequency",
            "decision_time_sec",
            "user_decision"
        ]
    }
}

# -------------------------------------------------
# LOAD MODELS & PREPARE CSVs
# -------------------------------------------------

for gid, cfg in GAMES.items():

    print(f"🎮 Loading {cfg['name']}")

    cfg["model"] = joblib.load(os.path.join(BASE_DIR, cfg["model_path"]))
    cfg["encoder"] = joblib.load(os.path.join(BASE_DIR, cfg["encoder_path"]))

    csv_file = os.path.join(BASE_DIR, cfg["csv_path"])
    cfg["csv"] = csv_file

    os.makedirs(os.path.dirname(csv_file), exist_ok=True)

    if not os.path.exists(csv_file):
        pd.DataFrame(columns=cfg["columns"]).to_csv(csv_file, index=False)
        print("✅ CSV created:", csv_file)
    else:
        print("✅ CSV ready:", csv_file)

    print("--- LOADED ---")


# -------------------------------------------------
# CORE PREDICTION PIPELINE
# -------------------------------------------------

def run_prediction(game_id, data):
    cfg = GAMES[game_id]

    user_id = data.get("user_id", "guest")
    session_id = data.get("session_id", "session_demo")

    x = [data.get(f, "") for f in cfg["features"]]

    model = cfg["model"]
    encoder = cfg["encoder"]

    # predict
    numeric_pred = int(model.predict([x])[0])
    label = encoder.inverse_transform([numeric_pred])[0]

    print(f"✅ {cfg['name']} -> {label}")

    row = {
        "user_id": user_id,
        "session_id": session_id,
        "predicted_type": label
    }

    for f in cfg["features"]:
        row[f] = data.get(f)

    # Add correctness for Budget game only
    if game_id == "budget":
        gt = data.get("ground_truth_type")
        row["correct"] = int(gt == label)

    df = pd.read_csv(cfg["csv"])
    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    df.to_csv(cfg["csv"], index=False)

    return label, session_id


# -------------------------------------------------
# ROUTES
# -------------------------------------------------

@app.route("/")
def home():
    return {
        "status": "✅ FinForge multi-game server running",
        "available_games": list(GAMES.keys())
    }


# --------------------------- API ---------------------------

@app.route("/predict/<game_id>", methods=["POST"])
def predict(game_id):
    if game_id not in GAMES:
        return jsonify({"error": "Invalid game"}), 404

    game = GAMES[game_id]

    payload = request.get_json(force=True)

    # -------- IDs --------
    user_id = payload.get("user_id", "demo_user")
    session_id = payload.get("session_id", str(uuid.uuid4()))

    # -------- Feature Vector --------
    model = game["model"]
    features = game["features"]

    x = [payload.get(f, 0) for f in features]

    expected = model.n_features_in_

    x += [0] * (expected - len(x))
    x = x[:expected]

    # -------- Prediction --------
    y_pred = model.predict([x])[0]

    encoder = game.get("encoder")

    if encoder:
        label = encoder.inverse_transform([int(y_pred)])[0]
    else:
        label = str(y_pred)

    # -------- Save To CSV --------
    row = payload.copy()
    row["user_id"] = user_id
    row["session_id"] = session_id
    row["prediction"] = label

    file = game["csv"]

    df = pd.read_csv(file) if os.path.exists(file) else pd.DataFrame()

    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    df.to_csv(file, index=False)

    print("✅ SAVED:", label)

    return jsonify(
            {
                "game": game["name"],
                "session_id": session_id,
                "prediction": label,
                "status": "saved"
            },
    )


# --------------------------- FRONTENDS ---------------------------

@app.route("/game/market")
def market_game():
    return render_template(GAMES["market"]["template"])


@app.route("/game/budget")
def budget_game():
    return render_template(GAMES["budget"]["template"])


# -------------------------------------------------
# RUN
# -------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
