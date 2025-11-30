from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import requests
import re
from typing import List, Dict, Optional

app = Flask(__name__)
CORS(app)

# Configuration
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2"
VALID_USAGES = ["home", "garden", "school", "decoration", "gifting"]

# ------------ WASTE TYPE DETECTION ------------
def detect_waste_type(text: str) -> str:
    """Normalize and categorize waste type from user input."""
    t = text.lower()
    
    waste_patterns = {
        "plastic bottles": ["plastic", "bottle", "pet"],
        "metal waste": ["metal", "iron", "steel", "tin", "can", "aluminium", "aluminum"],
        "paper / cardboard waste": ["paper", "cardboard", "newspaper", "carton"],
        "glass waste": ["glass", "jar"],
        "electronic (e-waste)": ["electronic", "e-waste", "battery", "wire", "circuit", "chip"]
    }
    
    for waste_type, keywords in waste_patterns.items():
        if any(keyword in t for keyword in keywords):
            return waste_type
    
    return text.strip()

# ------------ GLOBAL STATE ------------
state = {
    "stage": "ASK_WASTE",
    "waste": None,
    "usage": None,
    "ideas": []
}

def reset_state():
    """Reset the conversation state."""
    state["stage"] = "ASK_WASTE"
    state["waste"] = None
    state["usage"] = None
    state["ideas"] = []

# ------------ PROMPTS ------------
IDEA_PROMPT = """You are ECO-BUDDY for the Trashformers platform.

Waste item: {waste}
Usage place: {usage}

Previously suggested ideas (DO NOT repeat or slightly modify these):
{previous_ideas}

Task: Generate EXACTLY 3 NEW and DISTINCT "Best Out of Waste" ideas that are DIFFERENT from the previous ones.

Rules:
- Do NOT repeat names, concepts, or variations of earlier ideas
- Use the same waste item only
- Be creative and fresh
- Beginner-friendly and practical

For EACH idea include:
1) Name
2) Why it is useful
3) Materials needed
4) Step-by-step instructions

Format each idea clearly numbered as 1), 2), and 3)."""

POST_PROMPT = """You are ECO-BUDDY.

Write a short, friendly Trashformers post description for the idea below.

Idea: {idea}

Requirements:
- 3–5 sentences
- Mention the waste item and where it will be used
- Encourage sustainability
- Simple, engaging tone"""

# ------------ OLLAMA INTEGRATION ------------
def ask_ollama(prompt: str, timeout: int = 120) -> Optional[str]:
    """Send prompt to Ollama and return response."""
    try:
        response = requests.post(
            OLLAMA_URL,
            json={"model": MODEL_NAME, "prompt": prompt, "stream": False},
            timeout=timeout
        )
        response.raise_for_status()
        return response.json().get("response", "").strip()
    except requests.exceptions.RequestException as e:
        print(f"Ollama API error: {e}")
        return None

def extract_ideas(text: str) -> List[str]:
    """Extract numbered ideas from Ollama response."""
    # Split on numbered patterns like "1)", "1.", "1 -", etc.
    parts = re.split(r"\n?\s*\d[\).\-\s]+", text)
    ideas = [part.strip() for part in parts if len(part.strip()) > 30]
    return ideas[:3]

# ------------ API ROUTES ------------
@app.route("/api/eco-buddy", methods=["POST"])
def eco_buddy():
    """Main chatbot endpoint handling multi-stage conversation."""
    try:
        msg_raw = request.json.get("message", "")
        msg = msg_raw.strip().lower()
        
        if not msg:
            return jsonify({"reply": "Please send a message!"}), 400

        # -------- STAGE 1: ASK WASTE --------
        if state["stage"] == "ASK_WASTE":
            state["waste"] = detect_waste_type(msg)
            state["stage"] = "ASK_USAGE"
            return jsonify({
                "reply": f"Nice ♻️ We'll work with **{state['waste']}**.\n\n"
                         "Where do you want to use it? Choose one:\n"
                         "• home\n• garden\n• school\n• decoration\n• gifting"
            })

        # -------- STAGE 2: ASK USAGE --------
        elif state["stage"] == "ASK_USAGE":
            # Check if user provided a valid usage
            if not any(usage in msg for usage in VALID_USAGES):
                return jsonify({
                    "reply": "🙂 I already noted the waste item.\n\n"
                             "Now please tell me *where* you want to use it:\n"
                             "home, garden, school, decoration, or gifting"
                })

            # Valid usage received
            state["usage"] = next(u for u in VALID_USAGES if u in msg)
            state["stage"] = "WAIT_CHOICE"

            # Generate initial ideas
            prompt = IDEA_PROMPT.format(
                waste=state["waste"],
                usage=state["usage"],
                previous_ideas="None"
            )
            
            ideas_text = ask_ollama(prompt)
            
            if not ideas_text:
                return jsonify({
                    "reply": "⚠️ Sorry, I couldn't generate ideas right now. Please try again."
                }), 500
            
            state["ideas"] = extract_ideas(ideas_text)

            return jsonify({
                "reply": f"Here are 3 creative ideas for your **{state['waste']}** ({state['usage']} use):\n\n"
                         f"{ideas_text}\n\n"
                         "✅ Which idea do you like? Reply with **1**, **2**, or **3**.\n"
                         "👉 Or type **more ideas** to see alternatives."
            })

        # -------- STAGE 3: WAIT FOR CHOICE --------
        elif state["stage"] == "WAIT_CHOICE":
            # User wants more ideas
            if "more" in msg:
                prompt = IDEA_PROMPT.format(
                    waste=state["waste"],
                    usage=state["usage"],
                    previous_ideas="\n".join(state["ideas"]) if state["ideas"] else "None"
                )

                ideas_text = ask_ollama(prompt)
                
                if not ideas_text:
                    return jsonify({
                        "reply": "⚠️ Sorry, I couldn't generate more ideas. Please try again."
                    }), 500
                
                state["ideas"] = extract_ideas(ideas_text)

                return jsonify({
                    "reply": f"Here are some more ideas 🔄\n\n{ideas_text}\n\n"
                             "✅ Which idea do you like now? Reply with **1**, **2**, or **3**"
                })

            # User picks an idea
            if msg in ["1", "2", "3"]:
                idx = int(msg) - 1
                
                if 0 <= idx < len(state["ideas"]):
                    idea_chosen = state["ideas"][idx]
                    post_prompt = POST_PROMPT.format(idea=idea_chosen)
                    post_desc = ask_ollama(post_prompt)
                    
                    if not post_desc:
                        return jsonify({
                            "reply": "⚠️ Sorry, I couldn't generate a post description. Please try again."
                        }), 500

                    return jsonify({
                        "reply": "📝 **Here's a post description for Trashformers:**\n\n"
                                 f"{post_desc}\n\n"
                                 "♻️ Type a new waste item to start again, or say **more ideas** for alternatives."
                    })
                else:
                    return jsonify({
                        "reply": "Please choose a valid option: 1, 2, or 3"
                    })

            # Anything else → restart conversation
            reset_state()
            state["waste"] = detect_waste_type(msg)
            state["stage"] = "ASK_USAGE"
            
            return jsonify({
                "reply": f"♻️ Let's start fresh! Working with **{state['waste']}**.\n\n"
                         "Where do you want to use it?\n"
                         "home, garden, school, decoration, or gifting"
            })

        # Fallback (shouldn't happen)
        else:
            reset_state()
            return jsonify({
                "reply": "⚠️ Something went wrong. Let's start again.\n\n"
                         "What waste item do you have?"
            })
            
    except Exception as e:
        print(f"Error in eco_buddy endpoint: {e}")
        reset_state()
        return jsonify({
            "reply": "⚠️ An error occurred. Let's start fresh. What waste item do you have?"
        }), 500

@app.route("/api/reset", methods=["POST"])
def reset_conversation():
    """Reset the conversation state."""
    reset_state()
    return jsonify({
        "message": "Conversation reset successfully",
        "reply": "♻️ Ready to start! What waste item do you have?"
    })

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/health", methods=["GET"])
def health():
    """Detailed health check."""
    try:
        # Test Ollama connection
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        ollama_status = "connected" if response.status_code == 200 else "disconnected"
    except:
        ollama_status = "disconnected"
    
    return jsonify({
        "status": "healthy",
        "ollama": ollama_status,
        "stage": state["stage"]
    })

# ------------ ERROR HANDLERS ------------
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500

# ------------ MAIN ------------
if __name__ == "__main__":
    print("🌱 Starting EcoBuddy AI Backend...")
    print(f"📡 Ollama URL: {OLLAMA_URL}")
    print(f"🤖 Model: {MODEL_NAME}")
    app.run(host="0.0.0.0", port=5050, debug=True)