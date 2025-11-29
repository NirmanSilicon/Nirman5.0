import time
import pandas as pd
from collections import deque
import joblib
import smbus2
import adafruit_dht
import board
from features import extract_features_from_window

# ---------------------------
# Load ML assets
# ---------------------------
clf = joblib.load("rf_accident_model.joblib")
scaler = joblib.load("scaler.joblib")
feature_cols = joblib.load("feature_columns.joblib")

# ---------------------------
# DHT11 Setup
# ---------------------------
# Use GPIO4 (Pin 7). If your DATA pin is on GPIO17, change to board.D17
dht = adafruit_dht.DHT11(board.D17)

# ---------------------------
# MPU6050 Setup
# ---------------------------
bus = smbus2.SMBus(1)
MPU_ADDR = 0x68  # change to 0x69 if AD0 is pulled HIGH

# Wake MPU6050
bus.write_byte_data(MPU_ADDR, 0x6B, 0)

# Optional startup delay
print("⏳ Initializing sensors... waiting 5 seconds")
time.sleep(5)
print("✅ Sensors ready\n")

def read_word(reg):
    high = bus.read_byte_data(MPU_ADDR, reg)
    low = bus.read_byte_data(MPU_ADDR, reg + 1)
    val = (high << 8) + low
    if val >= 0x8000:
        val = -((65535 - val) + 1)
    return val

def read_mpu():
    ax = read_word(0x3B) / 16384.0 * 9.81
    ay = read_word(0x3D) / 16384.0 * 9.81
    az = read_word(0x3F) / 16384.0 * 9.81
    gx = read_word(0x43) / 131.0
    gy = read_word(0x45) / 131.0
    gz = read_word(0x47) / 131.0
    return ax, ay, az, gx, gy, gz

# ---------------------------
# Rolling 2-second window (50 Hz → 100 samples)
# ---------------------------
window = deque(maxlen=100)

print("\n✅ Real-Time Accident Detection (MPU + DHT) Started")
print("Move/shake MPU6050 to test anomaly response\n")

while True:
    try:
        # Read MPU6050
        ax, ay, az, gx, gy, gz = read_mpu()

        # Read DHT11 (can fail sometimes; handle safely)
        try:
            temp = dht.temperature
            hum = dht.humidity
        except Exception:
            temp, hum = 0, 0  # fallback if read fails

        # If you want to see raw values:
        # print(f"MPU: ax={ax:.2f}, ay={ay:.2f}, az={az:.2f} | DHT: T={temp}, H={hum}")

        # No GPS in this version → speed = 0
        speed = 0.0

        # Add to window
        window.append({
            "ax": ax, "ay": ay, "az": az,
            "gx": gx, "gy": gy, "gz": gz,
            "temp": temp, "hum": hum,
            "speed": speed,
            "label": 0
        })

        # Once we have a full window, extract features & predict
        if len(window) == 100:
            df = pd.DataFrame(window)
            feats = extract_features_from_window(df)
            row = pd.DataFrame([feats])[feature_cols]
            scaled = scaler.transform(row)

            prob = clf.predict_proba(scaled)[0][1]

            if prob > 0.5:
                print(f"🚨 Accident Likely — P={prob:.3f} | T={temp}°C H={hum}%")
            else:
                print(f"✅ Normal Motion — P={prob:.3f} | T={temp}°C H={hum}%")

        # Sampling rate ~50 Hz
        time.sleep(0.02)

    except KeyboardInterrupt:
        print("\n🛑 Stopped by user")
        break
    except Exception as e:
        print("Error:", e)
        time.sleep(0.1)
