import time
import json
import random
import paho.mqtt.client as mqtt
import smbus2
import joblib
import pandas as pd
from collections import deque
from features import extract_features_from_window

BROKER = "localhost"
TOPIC = "roadguardian/data"

# ML model
clf = joblib.load("rf_accident_model.joblib")
scaler = joblib.load("scaler.joblib")
feature_cols = joblib.load("feature_columns.joblib")

# MPU6050 setup
bus = smbus2.SMBus(1)
MPU_ADDR = 0x68
bus.write_byte_data(MPU_ADDR, 0x6B, 0)

def read_word(reg):
    h = bus.read_byte_data(MPU_ADDR, reg)
    l = bus.read_byte_data(MPU_ADDR, reg + 1)
    v = (h << 8) + l
    if v >= 0x8000:
        v = -((65535 - v) + 1)
    return v

def read_mpu():
    ax = read_word(0x3B) / 16384.0 * 9.81
    ay = read_word(0x3D) / 16384.0 * 9.81
    az = read_word(0x3F) / 16384.0 * 9.81
    gx = read_word(0x43) / 131.0
    gy = read_word(0x45) / 131.0
    gz = read_word(0x47) / 131.0
    return ax, ay, az, gx, gy, gz

client = mqtt.Client()
client.connect(BROKER, 1883, 60)

window = deque(maxlen=100)

call_status = None
sms_status = None

print("📡 MQTT publisher running...")

while True:
    ax, ay, az, gx, gy, gz = read_mpu()

    # Random temp + humidity
    temperature = random.uniform(28, 35)
    humidity = random.uniform(75, 95)

    # GPS disabled → simulate
    lat = 20.3507
    lng = 85.8063

    speed = 0.0

    window.append({
        "ax": ax, "ay": ay, "az": az,
        "gx": gx, "gy": gy, "gz": gz,
        "temp": temperature, "hum": humidity,
        "latitude": lat, "longitude": lng,
        "speed": speed, "label": 0
    })

    prob = 0.0
    event_type = "NORMAL"

    if len(window) == 100:
        df = pd.DataFrame(window)
        feats = extract_features_from_window(df)
        row = pd.DataFrame([feats])[feature_cols]
        scaled = scaler.transform(row)
        prob = float(clf.predict_proba(scaled)[0][1])

        # Accident threshold
        if prob >= 0.407:
            event_type = "ACCIDENT"

            # Only send call and sms state ONCE
            if call_status is None:
                call_status = "CALLING"
            else:
                call_status = "ENDED"

            if sms_status is None:
                sms_status = "SENT"
        else:
            call_status = None
            sms_status = None

    payload = {
        "speed": speed,
        "temperature": temperature,
        "humidity": humidity,
        "g": { "x": ax, "y": ay, "z": az },
        "g_magnitude": (ax**2 + ay**2 + az**2)**0.5,
        "lat": lat,
        "lng": lng,
        "event_type": event_type,
        "call_status": call_status,
        "sms_status": sms_status,
        "accident_prob": prob,
        "ts": int(time.time()*1000)
    }

    client.publish(TOPIC, json.dumps(payload))
    time.sleep(0.1)
