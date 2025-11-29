from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime, timezone
import os
# --------------------------------------
# Basic Flask Setup
# --------------------------------------
app = Flask(__name__)
CORS(app)

DB_FILE = "crime_data.sqlite"

# --------------------------------------
# Database Helpers (No Extensions Needed)
# --------------------------------------
def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_type TEXT NOT NULL,
            description TEXT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            occurred_at TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS citizen_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reporter_name TEXT,
            message TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()

init_db()

# --------------------------------------
# Utility Functions
# --------------------------------------
def validate_incident(data):
    required = ["incident_type", "latitude", "longitude", "occurred_at"]
    for r in required:
        if r not in data:
            return f"Missing field: {r}"
    return None

def validate_report(data):
    required = ["message", "latitude", "longitude"]
    for r in required:
        if r not in data:
            return f"Missing field: {r}"
    return None

# --------------------------------------
# API Endpoints
# --------------------------------------

# Health Check
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "time": datetime.now(timezone.utc).isoformat()})

# -----------------------
# INCIDENTS
# -----------------------
@app.route("/api/incidents", methods=["GET"])
def get_incidents():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM incidents ORDER BY occurred_at DESC LIMIT 200")
    rows = cur.fetchall()

    incidents = [dict(row) for row in rows]
    return jsonify(incidents)

@app.route("/api/incidents", methods=["POST"])
def post_incident():
    data = request.get_json()
    error = validate_incident(data)
    if error:
        return jsonify({"error": error}), 400

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO incidents 
        (incident_type, description, latitude, longitude, occurred_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data["incident_type"],
        data.get("description"),
        data["latitude"],
        data["longitude"],
        data["occurred_at"],
        datetime.now(timezone.utc).isoformat()
    ))

    conn.commit()
    return jsonify({"message": "Incident added"}), 201

# -----------------------
# CITIZEN REPORTS
# -----------------------
@app.route("/api/reports", methods=["GET"])
def get_reports():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM citizen_reports ORDER BY created_at DESC LIMIT 200")
    rows = cur.fetchall()

    return jsonify([dict(r) for r in rows])

@app.route("/api/reports", methods=["POST"])
def post_report():
    data = request.get_json()
    error = validate_report(data)
    if error:
        return jsonify({"error": error}), 400

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO citizen_reports
        (reporter_name, message, latitude, longitude, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data.get("reporter_name"),
        data["message"],
        data["latitude"],
        data["longitude"],
        datetime.now(timezone.utc).isoformat()
    ))

    conn.commit()
    return jsonify({"message": "Report added"}), 201

# -----------------------
# HOTSPOTS (Very Simple)
# -----------------------
@app.route("/api/hotspots", methods=["GET"])
def get_hotspots():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT latitude, longitude FROM incidents")
    rows = cur.fetchall()

    hotspots = {}
    for r in rows:
        lat = round(r["latitude"], 2)
        lon = round(r["longitude"], 2)
        key = f"{lat},{lon}"
        hotspots[key] = hotspots.get(key, 0) + 1

    result = [{"location": k, "count": v} for k, v in hotspots.items()]
    result.sort(key=lambda x: x["count"], reverse=True)

    return jsonify(result)

# -----------------------
# MODEL STATUS (Always False)
# -----------------------
@app.route("/api/model/status", methods=["GET"])
def model_status():
    return jsonify({"loaded": False, "note": "ML model disabled in lightweight version"})

# -----------------------
# RUN SERVER
# -----------------------
if __name__ == "__main__":
    app.run(debug=True)
