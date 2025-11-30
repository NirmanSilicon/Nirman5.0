from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

app = Flask(__name__)

# Read API key from .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Load model
model = genai.GenerativeModel("gemini-2.5-flash")
# Store conversation history (per session or per user-id later)
chat_session = model.start_chat(history=[])


@app.route("/chat", methods=["POST"])
def chatbot():
    try:
        data = request.get_json(silent=True)
        user_message = data.get("message", "")
        temp= {"user": user_message,"ai":None}
        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # Send message to chat session
        response = chat_session.send_message(user_message)
        temp.update({"ai" : response.text})
        print(temp)
        return jsonify({
            "user": user_message,
            "bot": response.text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/reset", methods=["GET"])
def reset():
    """Reset chat history for a fresh conversation."""
    global chat_session
    chat_session = model.start_chat(history=[])
    return jsonify({"message": "Chat history reset successfully!"})


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Gemini Chatbot API is running with continuous chat!"})


if __name__ == "__main__":
    app.run(debug=True)
