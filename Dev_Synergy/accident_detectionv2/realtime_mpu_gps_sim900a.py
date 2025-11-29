import time
import pandas as pd
from collections import deque
import joblib
import smbus2
import serial
from features import extract_features_from_window

# -------------------------------------------------------------------
# Load ML Model
# -------------------------------------------------------------------
clf = joblib.load("rf_accident_model.joblib")
scaler = joblib.load("scaler.joblib")
feature_cols = joblib.load("feature_columns.joblib")

# -------------------------------------------------------------------
# MPU6050 (I2C)
# -------------------------------------------------------------------
bus = smbus2.SMBus(1)
MPU_ADDR = 0x68
bus.write_byte_data(MPU_ADDR, 0x6B, 0)

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


# -------------------------------------------------------------------
# SIM900A - Using working sequence from YOUR TEST CODE
# -------------------------------------------------------------------
try:
    sim = serial.Serial("/dev/ttyAMA0", 115200, timeout=1)
    sim_connected = True
    print("📡 SIM900A ready on /dev/ttyAMA0 (115200 baud)")
except:
    sim_connected = False
    print("❌ SIM900A not detected")


def sim_send(cmd, wait=1):
    """Helper function to send an AT command and print response"""
    sim.write((cmd + "\r").encode())
    time.sleep(wait)
    resp = sim.read(999).decode(errors="ignore")
    print(resp)


def send_sms(number, message):
    if not sim_connected:
        print("⚠ SMS Failed: SIM900A not connected")
        return

    print("📨 Sending SMS...")

    sim_send("AT")
    sim_send("AT+CMGF=1")         # Text mode
    sim_send('AT+CSCS="GSM"')     # Charset GSM
    sim_send(f'AT+CMGS="{number}"')

    time.sleep(1)
    sim.write(message.encode())
    sim.write(bytes([26]))  # CTRL+Z end of SMS

    time.sleep(3)
    print("✅ SMS Sent Successfully")


def make_call(number):
    if not sim_connected:
        print("⚠ SIM900A unavailable for calling")
        return

    print(f"📞 Dialing {number}...")
    sim_send("AT")
    sim_send(f"ATD{number};", wait=2)

    print("📞 Call Ringing 15 sec...")
    time.sleep(15)
    sim_send("ATH")  # hang up
    print("📵 Call Ended")


# -------------------------------------------------------------------
# Accident logic
# -------------------------------------------------------------------
window = deque(maxlen=100)
last_accident = False
ACCIDENT_THRESHOLD = 0.407

print("\n⏳ Initializing System...")
time.sleep(2)
print("✅ System Ready | MPU6050 + SIM900A (CALL + SMS)")


# -------------------------------------------------------------------
# Main Loop
# -------------------------------------------------------------------
while True:
    try:
        ax, ay, az, gx, gy, gz = read_mpu()

        # GPS disabled
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

                    # 2️⃣ SMS (WORKING WITH YOUR SETTINGS)
                    send_sms(
                        "+919692197124",
                        " Emergency Alert – Possible Accident Detected A potential vehicle accident has been detected at the following location:  View on Map: http://maps.google.com/maps?q=20.3507,85.8063 Immediate assistance may be required. Please take action as soon as possible.")

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
