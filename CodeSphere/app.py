from flask import Flask, request, jsonify
from nlp_service import ask_ai
from ocr_service import process_receipt

app = Flask(__name__)

# ---------------- AI Chat Route ---------------- #
@app.post("/chat")
def chat():
    data = request.get_json()
    msg = data.get("message") if data else None

    if not msg:
        return jsonify({"error": "No message provided"}), 400

    reply = ask_ai(msg)
    return jsonify({"response": reply})


# ---------------- OCR Upload Route ---------------- #
@app.post("/ocr")
def ocr():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    path = "uploaded.jpg"
    file.save(path)

    result = process_receipt(path)
    return jsonify(result)


# ---------------- Run Server ---------------- #
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9000, debug=True)
