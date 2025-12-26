# ---- FIX PYTHON IPV6 DNS BUG ----
import socket
import requests.packages.urllib3.util.connection as urllib3_cn

def allowed_gai_family():
    return socket.AF_INET   # force IPv4 only

urllib3_cn.allowed_gai_family = allowed_gai_family
# ---------------------------------

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
# 🔧 USER CONFIG
# --------------------------------------------------------------

SUPABASE_URL = "https://orcqwkhcvyvndvzfuphf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yY3F3a2hjdnl2bmR2emZ1cGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzI0NTcsImV4cCI6MjA4MDAwODQ1N30.4ULuYfOmWqwO7JoQiiMa4Kxv6-rgDGpsV_BIc7VbW8Q"
SUPABASE_TABLE = "accidents"

DEFAULT_VEHICLE_NUMBER = "OD01AB1234"
DEFAULT_NAME = "Pratyush kumar Sahu"
DEFAULT_LATITUDE = 20.21
DEFAULT_LONGITUDE = 85.48
DEFAULT_PHONE_NUMBER = "+919692197124"

ALERT_PHONE_NUMBER = "+919692197124"
ACCIDENT_THRESHOLD = 0.407


# --------------------------------------------------------------
# Load ML Model
# --------------------------------------------------------------
clf = joblib.load("rf_accident_model.joblib")
scaler = joblib.load("scaler.joblib")
feature_cols = joblib.load("feature_columns.joblib")


# --------------------------------------------------------------
# MPU6050 Init
# --------------------------------------------------------------
bus = smbus2.SMBus(1)
MPU_ADDR = 0x68
bus.write_byte_data(MPU_ADDR, 0x6B, 0)


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
# SIM900A Init
# --------------------------------------------------------------
try:
    sim = serial.Serial("/dev/ttyAMA0", 115200, timeout=1)
    sim_connected = True
    print("📡 SIM900A connected @ 115200 baud")
except:
    sim_connected = False
    print("❌ SIM900A not detected")


def sim_send(cmd, wait=1):
    if not sim_connected:
        return
    sim.write((cmd + "\r").encode())
    time.sleep(wait)
    print(sim.read(500).decode(errors="ignore"))


def send_sms(number, message):
    if not sim_connected:
        print("⚠ SMS Failed: SIM900A not detected")
        return

    sim_send("AT")
    sim_send("AT+CMGF=1")
    sim_send('AT+CSCS="GSM"')
    sim_send(f'AT+CMGS="{number}"')
    time.sleep(1)

    sim.write(message.encode())
    sim.write(bytes([26]))  # CTRL+Z
    time.sleep(3)
    print("✅ SMS Sent")


def make_call(number):
    if not sim_connected:
        print("⚠ Call Failed: SIM900A not detected")
        return

    sim_send("AT")
    sim_send(f"ATD{number};", wait=2)
    time.sleep(15)
    sim_send("ATH")
    print("📵 Call Ended")


# --------------------------------------------------------------
# Supabase Logger
# --------------------------------------------------------------
def log_accident_to_supabase():

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

    print("🗄️ Uploading accident to Supabase...")

    try:
        r = requests.post(url, headers=headers, data=json.dumps(payload), timeout=5)

        if r.status_code in (200, 201, 204):
            print("✅ Accident stored in Supabase")
        else:
            print("❌ Supabase error:", r.status_code, r.text)

    except Exception as e:
        print("❌ Failed to send to Supabase:", e)


# --------------------------------------------------------------
# Accident Detection Loop
# --------------------------------------------------------------
window = deque(maxlen=100)
last_accident = False

print("\n⏳ System Initializing...")
time.sleep(2)
print("✅ System Ready\n")


while True:
    try:
        ax, ay, az, gx, gy, gz = read_mpu()

        window.append({
            "ax": ax, "ay": ay, "az": az,
            "gx": gx, "gy": gy, "gz": gz,
            "temp": 0, "hum": 0,
            "latitude": 0, "longitude": 0,
            "speed": 0,
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
                    log_accident_to_supabase()
                    make_call(ALERT_PHONE_NUMBER)
                    send_sms(
                        ALERT_PHONE_NUMBER,
                        f"🚨 Accident Detected!\nVehicle: {DEFAULT_VEHICLE_NUMBER}\n"
                        f"Location: https://maps.google.com/maps?q={DEFAULT_LATITUDE},{DEFAULT_LONGITUDE}"
                    )
                    last_accident = True
            else:
                print(f"✅ Normal — P={prob:.3f}")
                last_accident = False

        time.sleep(0.05)

    except KeyboardInterrupt:
        print("\n🛑 Stopped by user")
        break

    except Exception as e:
        print("Error:", e)
        time.sleep(0.1)