import time
import pandas as pd
from collections import deque
import joblib
import smbus2
import serial
from features import extract_features_from_window

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
except:
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
# Accident Detection Logic
# --------------------------------------------------------------
window = deque(maxlen=100)
last_accident = False
ACCIDENT_THRESHOLD = 0.407

print("\n⏳ System Initializing...")
time.sleep(2)
print("✅ System Ready — MPU6050 + SIM900A (CALL + SMS @115200)\n")

# --------------------------------------------------------------
# MAIN LOOP
# --------------------------------------------------------------
while True:
    try:
        ax, ay, az, gx, gy, gz = read_mpu()

        # No GPS yet
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
                    # 1️⃣ CALL
                    make_call("+919692197124")

                    # 2️⃣ SMS
                    send_sms(
                        "+919692197124",
                        "🚨 Road Guardian ALERT 🚨\n"
                        "Accident detected.\n"
                        "Map: http://maps.google.com/maps?q=20.3507,85.8063\n"
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



        
