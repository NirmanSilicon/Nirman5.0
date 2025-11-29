import time
import pandas as pd
from collections import deque
import joblib
import smbus2
from features import extract_features_from_window

# ---------------------------
# Load ML assets
# ---------------------------
clf = joblib.load("rf_accident_model.joblib")
scaler = joblib.load("scaler.joblib")
feature_cols = joblib.load("feature_columns.joblib")

# ---------------------------
# MPU6050 Setup
# ---------------------------
bus = smbus2.SMBus(1)
MPU_ADDR = 0x68  # change to 0x69 if needed

# Wake MPU6050
bus.write_byte_data(MPU_ADDR, 0x6B, 0)

# ✅ 5-second startup delay
print("⏳ Initializing sensors... waiting 5 seconds")
time.sleep(5)
print("✅ Sensors ready\n")

def read_word(reg):
    high = bus.read_byte_data(MPU_ADDR, reg)
    low = bus.read_byte_data(MPU_ADDR, reg+1)
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

print("\n✅ Real-Time Accident Detection Started")
print("Move/shake MPU6050 to test anomaly response\n")

while True:
    try:
        ax, ay, az, gx, gy, gz = read_mpu()

        window.append({
            "ax": ax, "ay": ay, "az": az,
            "gx": gx, "gy": gy, "gz": gz,
            "temp": 0, "hum": 0,
            "speed": 0, "label": 0
        })

        if len(window) == 100:
            df = pd.DataFrame(window)
            feats = extract_features_from_window(df)
            row = pd.DataFrame([feats])[feature_cols]
            scaled = scaler.transform(row)
            
            prob = clf.predict_proba(scaled)[0][1]

            if prob > 0.5:
                print(f"🚨 Accident Likely — P={prob:.3f}")
            else:
                print(f"✅ Normal Motion — P={prob:.3f}")

        time.sleep(0.02)  # 50 Hz sampling

    except KeyboardInterrupt:
        print("\n🛑 Stopped by user")
        break
    except Exception as e:
        print("Error:", e)
        time.sleep(0.1)
