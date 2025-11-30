from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import joblib
import os
import uuid

# -------------------------------------------------
# APP SETUP
# -------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, template_folder=BASE_DIR)
CORS(app)

# -------------------------------------------------
# GAME CONFIG
# -------------------------------------------------
GAMES = {

    # ================== BUDGET GAME ==================
    "budget": {
        "name": "Cash Flow Runner",
        "model_path": "cash-flow-runner - beginner/model.pkl",
        "encoder_path": "cash-flow-runner - beginner/encoder.pkl",
        "csv_path": "cash-flow-runner - beginner/user_data.csv",
        "template": "cash-flow-runner - beginner/templates/cash_flow_runner.html",

        "features": [
            "expense_name", "category", "cost_in_rs",
            "frequency", "decision_time_sec", "user_decision"
        ],

        "columns": [
            "user_id", "session_id",
            "expense_name", "category", "cost_in_rs", "frequency",
            "decision_time_sec", "user_decision",
            "ground_truth_type", "prediction", "correct"
        ]
    },

    # ================== PASSIVE POWER ==================
    "passive_power": {
        "name": "Passive Power",
        "model_path": "passive_power - beginner/model.pkl",
        "encoder_path": None,
        "csv_path": "passive_power - beginner/user_data.csv",
        "template": "passive_power - beginner/templates/passive_power.html",

        "features": [
            "monthly_sip",
            "lump_sum_initial",
            "annual_rate_percent",
            "years"
        ],

        "columns": [
            "user_id", "session_id",
            "monthly_sip", "lump_sum_initial",
            "annual_rate_percent", "years",
            "future_value_sip",
            "future_value_lump_sum",
            "total_invested"
        ]
    },

    # ================== DEFI DETECTIVE ==================
    "defi_detective": {
        "name": "DeFi Detective",

        "model_path": "defi_detective - beginner/model.pkl",
        "encoder_path": None,
        "csv_path": "defi_detective - beginner/user_data.csv",
        "template": "defi_detective - beginner/templates/defi_detective.html",

        "features": [
            "time_spent_sec",
            "quiz_score_0_3",
            "wallet_checks_completed_0_4",
            "tx_trace_performed",
            "quiz_correct_ratio",
            "interaction_count",
            "risk_awareness_score_0_100",
            "reward_unlocked"
        ],

        "columns": [
            "user_id",
            "session_id",
            "module",
            "time_spent_sec",
            "quiz_score_0_3",
            "wallet_checks_completed_0_4",
            "tx_trace_performed",
            "quiz_correct_ratio",
            "interaction_count",
            "risk_awareness_score_0_100",
            "reward_unlocked",
            "prediction",
            "timestamp",
            "notes"
        ]
    }
}

# -------------------------------------------------
# LOAD MODELS & PREP CSVs
# -------------------------------------------------
for gid, cfg in GAMES.items():

    print("🎮 Loading:", cfg["name"])

    cfg["model"] = joblib.load(os.path.join(BASE_DIR, cfg["model_path"]))

    if cfg.get("encoder_path"):
        enc = os.path.join(BASE_DIR, cfg["encoder_path"])
        cfg["encoder"] = joblib.load(enc) if os.path.exists(enc) else None
    else:
        cfg["encoder"] = None

    csv_path = os.path.join(BASE_DIR, cfg["csv_path"])
    cfg["csv"] = csv_path

    os.makedirs(os.path.dirname(csv_path), exist_ok=True)

    if not os.path.exists(csv_path):
        pd.DataFrame(columns=cfg["columns"]).to_csv(csv_path, index=False)
        print("✅ CSV created:", csv_path)
    else:
        print("✅ CSV ready:", csv_path)

print("-----------------------------------")

# -------------------------------------------------
# CORE PREDICTION + SAVE
# -------------------------------------------------
def run_prediction(game_id, data):
    cfg = GAMES[game_id]

    user_id = str(data.get("user_id", "guest"))
    session_id = str(data.get("session_id", uuid.uuid4()))

    # ----- BUILD MODEL ROW -----
    model_row = {}

    for f in cfg["features"]:
        try:
            model_row[f] = float(data.get(f, 0))
        except:
            model_row[f] = 0

    df_input = pd.DataFrame([model_row])

    # ----- SAFE PREDICT -----
    try:
        raw_pred = cfg["model"].predict(df_input)[0]

        if cfg["encoder"]:
            label = cfg["encoder"].inverse_transform([int(raw_pred)])[0]
        else:
            label = float(raw_pred) if isinstance(raw_pred, (int, float)) else str(raw_pred)

    except Exception as e:
        print("⚠️ Prediction failed:", e)
        label = "prediction_error"

    print(f"✅ {cfg['name']} predicted → {label}")

    # ----- BUILD OUTPUT ROW -----
    output_row = {
        "user_id": user_id,
        "session_id": session_id
    }

    for f in cfg["features"]:
        output_row[f] = model_row[f]

    # Game‑specific
    if game_id == "budget":
        gt = data.get("ground_truth_type")
        output_row["ground_truth_type"] = gt
        output_row["prediction"] = label
        output_row["correct"] = int(str(gt) == str(label))

    elif game_id == "passive_power":
        output_row["future_value_sip"] = data.get("future_value_sip", 0)
        output_row["future_value_lump_sum"] = data.get("future_value_lump_sum", 0)
        output_row["total_invested"] = data.get("total_invested", 0)

    elif game_id == "defi_detective":
        output_row["module"] = data.get("module")
        output_row["prediction"] = label
        output_row["timestamp"] = data.get("timestamp")
        output_row["notes"] = data.get("notes", "")

    # ----- SAVE CSV -----
    df = pd.read_csv(cfg["csv"])
    df = pd.concat([df, pd.DataFrame([output_row])], ignore_index=True)
    df.to_csv(cfg["csv"], index=False)

    print("💾 Saved:", cfg["csv"])

    return label, session_id


# -------------------------------------------------
# ROUTES
# -------------------------------------------------

@app.route("/")
def home():
    return jsonify(
            {
                "status": "✅ FinForge server running",
                "available_games": list(GAMES.keys())
            },
    )


@app.route("/predict/<game_id>", methods=["POST"])
def predict(game_id):
    if game_id not in GAMES:
        return jsonify({"error": "Invalid game id"}), 404

    payload = request.get_json(force=True)

    label, session_id = run_prediction(game_id, payload)

    return jsonify(
            {
                "game": GAMES[game_id]["name"],
                "session_id": session_id,
                "prediction": label,
                "status": "saved"
            },
    )


# ---------------- FRONTENDS ----------------

@app.route("/game/budget")
def budget_game():
    return render_template(GAMES["budget"]["template"])


@app.route("/game/passive_power")
def passive_power_game():
    return render_template(GAMES["passive_power"]["template"])


@app.route("/game/defi_detective")
def defi_detective_game():
    return render_template(GAMES["defi_detective"]["template"])


# -------------------------------------------------
# RUN
# -------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
