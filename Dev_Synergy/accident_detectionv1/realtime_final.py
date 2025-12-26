import time
from collections import deque

import pandas as pd
import joblib
import smbus2
import serial
import requests
import json

from features import extract_features_from_window

# --------------------------------------------------------------
# 🔧 USER CONFIG (EDIT THESE)
# --------------------------------------------------------------

# 1) Supabase settings – fill from your Supabase dashboard
SUPABASE_URL = "https://orcqwkhcvyvndvzfuphf.supabase.co"   # TODO: change this
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yY3F3a2hjdnl2bmR2emZ1cGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzI0NTcsImV4cCI6MjA4MDAwODQ1N30.4ULuYfOmWqwO7JoQiiMa4Kxv6-rgDGpsV_BIc7VbW8Q"                  # TODO: change this
SUPABASE_TABLE = "accidents"                           # TODO: table name

# 2) Default accident record values – sent to Supabase every accident
DEFAULT_VEHICLE_NUMBER = "OD01AB1234"   
DEFAULT_NAME = "Pratyush kumar Sahu"           
DEFAULT_LATITUDE = 20.21            
DEFAULT_LONGITUDE = 85.48            
DEFAULT_PHONE_NUMBER = "+919692197124" 

# 3) Phone number to call / SMS
ALERT_PHONE_NUMBER = "+919692197124"   

# 4) Accident probability threshold
ACCIDENT_THRESHOLD = 0.407


# --------------------------------------------------------------
# Load ML Model
# --------------------------------------------------------------
clf = joblib.load("rf_accident_model.joblib")
scaler = joblib.load("scaler.joblib")
feature_cols = joblib.load("feature_columns.joblib")

# --------------------------------------------------------------
# MPU6050 Initialization (I2C)
# --------------------------------------------------------------
bus = smbus2.SMBus(1)
MPU_ADDR = 0x68
bus.write_byte_data(MPU_ADDR, 0x6B, 0)  # Wake sensor


def read_word(reg):
    high = bus.read_byte_data(MPU_ADDR, reg)
    low = bus.read_byte_data(MPU_ADDR, reg + 1)
    val = (high << 8) + low
    return val - 65536 if val >= 0x8000 else val


def read_mpu():
    ax = read_word(0x3B) / 16384.0 * 9.81
    ay = read_word(0x3D) / 16384.0 * 9.81
    az = read_word(0x3F) / 16384.0 * 9.81
    gx = read_word(0x43) / 131.0
    gy = read_word(0x45) / 131.0
    gz = read_word(0x47) / 131.0
    return ax, ay, az, gx, gy, gz


# --------------------------------------------------------------
# SIM900A Initialization (UART) – 115200 BAUD
# --------------------------------------------------------------
try:
    sim = serial.Serial("/dev/ttyAMA0", 115200, timeout=1)
    sim_connected = True
    print("📡 SIM900A connected @ 115200 baud")
except Exception:
    sim_connected = False
    print("❌ SIM900A not detected")


def sim_send(cmd, wait=1):
    """Send AT command and print SIM900A response"""
    if not sim_connected:
        return
    sim.write((cmd + "\r").encode())
    time.sleep(wait)
    resp = sim.read(500).decode(errors="ignore")
    print(resp)


def send_sms(number, message):
    if not sim_connected:
        print("⚠ SMS Failed: SIM900A not connected")
        return

    print("📨 Sending SMS...")

    sim_send("AT")
    sim_send("AT+CMGF=1")        # Text mode
    sim_send('AT+CSCS="GSM"')    # Charset
    sim_send(f'AT+CMGS="{number}"')

    time.sleep(1)
    sim.write(message.encode())

    sim.write(bytes([26]))  # CTRL+Z
    time.sleep(3)

    print("✅ SMS Sent Successfully")


def make_call(number):
    if not sim_connected:
        print("⚠ Call Failed: SIM900A not connected")
        return

    print(f"📞 Calling {number}...")

    sim_send("AT")
    sim_send(f"ATD{number};", wait=2)

    print("⏳ Ringing for 15 seconds...")
    time.sleep(15)

    sim_send("ATH")  # Hang up
    print("📵 Call Ended")


# --------------------------------------------------------------
# Supabase Helper Function
# --------------------------------------------------------------
def log_accident_to_supabase():
    """
    Insert one row into Supabase when accident is detected.
    Uses default values defined at the top of this file.
    """

    # ---- IMPORTANT ----
    # Keys in this dict must match your Supabase column names.
    # If your columns are named with spaces ("Vehicle number"),
    # keep them exactly like that in the JSON.
    payload = {
        "Vehicle number": DEFAULT_VEHICLE_NUMBER,
        "Name": DEFAULT_NAME,
        "Latitude": DEFAULT_LATITUDE,
        "Longitude": DEFAULT_LONGITUDE,
        "phone number": DEFAULT_PHONE_NUMBER,
    }

    url = f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}"

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }

    print("🗄️ Sending accident data to Supabase...")

    try:
        response = requests.post(
            url,
            headers=headers,
            data=json.dumps(payload),
            timeout=5
        )

        if response.status_code in (200, 201, 204):
            print("✅ Accident record stored in Supabase.")
        else:
            print("⚠ Supabase error:", response.status_code, response.text)

    except Exception as e:
        print("⚠ Failed to send data to Supabase:", e)


# --------------------------------------------------------------
# Accident Detection Logic
# --------------------------------------------------------------
window = deque(maxlen=100)
last_accident = False

print("\n⏳ System Initializing...")
time.sleep(2)
print("✅ System Ready — MPU6050 + SIM900A (CALL + SMS @115200)\n")

# --------------------------------------------------------------
# MAIN LOOP
# --------------------------------------------------------------
while True:
    try:
        ax, ay, az, gx, gy, gz = read_mpu()

        # Still using dummy GPS/speed here; can be replaced with real GPS later
        lat, lon, speed = 0.0, 0.0, 0.0

        window.append({
            "ax": ax, "ay": ay, "az": az,
            "gx": gx, "gy": gy, "gz": gz,
            "temp": 0, "hum": 0,
            "latitude": lat,
            "longitude": lon,
            "speed": speed,
            "label": 0
        })

        if len(window) == 100:
            df = pd.DataFrame(window)
            feats = extract_features_from_window(df)

            row = pd.DataFrame([feats])[feature_cols]
            scaled = scaler.transform(row)
            prob = clf.predict_proba(scaled)[0][1]

            if prob >= ACCIDENT_THRESHOLD:
                print(f"🚨 Accident Detected — P={prob:.3f}")

                if not last_accident:
                    # 1️⃣ Log to Supabase
                    log_accident_to_supabase()

                    # 2️⃣ CALL
                    make_call(ALERT_PHONE_NUMBER)

                    # 3️⃣ SMS (using fixed map link for now)
                    send_sms(
                        ALERT_PHONE_NUMBER,
                        "🚨 Road Guardian ALERT 🚨\n"
                        "Accident detected.\n"
                        f"Vehicle: {DEFAULT_VEHICLE_NUMBER}\n"
                        f"Map: http://maps.google.com/maps?q={DEFAULT_LATITUDE},{DEFAULT_LONGITUDE}\n"
                        "Help may be required immediately!"
                    )

                    last_accident = True

            else:
                print(f"✅ Normal — P={prob:.3f}")
                last_accident = False

        time.sleep(0.05)

    except KeyboardInterrupt:
        print("\n🛑 System stopped by user")
        break

    except Exception as e:
        print("Error:", e)
        time.sleep(0.1)
