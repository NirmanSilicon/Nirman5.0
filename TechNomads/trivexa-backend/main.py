from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import json

app = Flask(__name__)
CORS(app)

# ---------- BASE DIRECTORY + DATABASE PATH ----------
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database/','medicines.db')
# os._exit()
print(basedir)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


# ----------------------------------------------------------
#               MEDICINE TABLE MODEL
# ----------------------------------------------------------
class Medicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    disease_name = db.Column(db.String(200))
    disease_url = db.Column(db.String(300))

    med_name = db.Column(db.String(200))
    med_url = db.Column(db.String(300))

    final_price = db.Column(db.String(50))
    price = db.Column(db.String(100))

    prescription_required = db.Column(db.String(50))

    drug_variant = db.Column(db.String(100))
    drug_manufacturer = db.Column(db.String(200))
    drug_manufacturer_origin = db.Column(db.String(100))

    drug_content = db.Column(db.Text)
    generic_name = db.Column(db.String(200))

    img_urls = db.Column(db.Text)  # JSON stored as TEXT


# ----------------------------------------------------------
#                    ROUTES
# ----------------------------------------------------------
@app.route("/")
def home():
    return "Medicine API backend is running!"


# ----------------------------------------------------------
#                 ADD MEDICINE (POST)
# ----------------------------------------------------------
@app.route("/medicines", methods=["POST"])
def add_medicine():
    data = request.get_json()

    new_med = Medicine(
        disease_name=data.get("disease_name"),
        disease_url=data.get("disease_url"),
        med_name=data.get("med_name"),
        med_url=data.get("med_url"),
        final_price=data.get("final_price"),
        price=data.get("price"),
        prescription_required=data.get("prescription_required"),
        drug_variant=data.get("drug_variant"),
        drug_manufacturer=data.get("drug_manufacturer"),
        drug_manufacturer_origin=data.get("drug_manufacturer_origin"),
        drug_content=data.get("drug_content"),
        generic_name=data.get("generic_name"),
        img_urls=json.dumps(data.get("img_urls", []))
    )

    db.session.add(new_med)
    db.session.commit()

    return jsonify({"message": "Medicine added", "id": new_med.id}), 201


# ----------------------------------------------------------
#                GET ALL MEDICINES
# ----------------------------------------------------------
@app.route("/medicines", methods=["GET"])
def get_all_medicines():
    meds = Medicine.query.all()
    output = []

    for m in meds:
        output.append({
            "id": m.id,
            "disease_name": m.disease_name,
            "disease_url": m.disease_url,
            "med_name": m.med_name,
            "med_url": m.med_url,
            "final_price": m.final_price,
            "price": m.price,
            "prescription_required": m.prescription_required,
            "drug_variant": m.drug_variant,
            "drug_manufacturer": m.drug_manufacturer,
            "drug_manufacturer_origin": m.drug_manufacturer_origin,
            "drug_content": m.drug_content,
            "generic_name": m.generic_name,
            "img_urls": json.loads(m.img_urls)
        })

    return jsonify(output), 200


# ----------------------------------------------------------
#              GET ONE MEDICINE BY ID
# ----------------------------------------------------------
@app.route("/medicines/<int:id>", methods=["GET"])
def get_medicine(id):
    print("hitted")
    med = Medicine.query.get(id)

    if not med:
        return jsonify({"error": "Medicine not found"}), 404

    return jsonify({
        "id": med.id,
        "disease_name": med.disease_name,
        "disease_url": med.disease_url,
        "med_name": med.med_name,
        "med_url": med.med_url,
        "final_price": med.final_price,
        "price": med.price,
        "prescription_required": med.prescription_required,
        "drug_variant": med.drug_variant,
        "drug_manufacturer": med.drug_manufacturer,
        "drug_manufacturer_origin": med.drug_manufacturer_origin,
        "drug_content": med.drug_content,
        "generic_name": med.generic_name,
        "img_urls": json.loads(med.img_urls)
    }), 200



# ----------------------------------------------------------
#                   SEARCH ENDPOINT
# ----------------------------------------------------------
@app.route("/api/search", methods=["GET"])
def search_medicines():
    query = request.args.get("q", "").lower()

    if not query:
        return jsonify({"error": "Query parameter ?q= required"}), 400

    results = Medicine.query.filter(
        (Medicine.disease_name.ilike(f"%{query}%")) |
        (Medicine.med_name.ilike(f"%{query}%")) |
        (Medicine.generic_name.ilike(f"%{query}%")) |
        (Medicine.drug_manufacturer.ilike(f"%{query}%")) |
        (Medicine.drug_content.ilike(f"%{query}%"))
    ).all()

    if not results:
        return jsonify({"message": "No results found"}), 404

    output = []
    for m in results:
        output.append({
            "id": m.id,
            "disease_name": m.disease_name,
            "med_name": m.med_name,
            "generic_name": m.generic_name,
            "final_price": m.final_price,
            "img_urls": json.loads(m.img_urls)
        })

    return jsonify({"count": len(output), "results": output}), 200


# ----------------------------------------------------------
#                 RUN SERVER
# ----------------------------------------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
