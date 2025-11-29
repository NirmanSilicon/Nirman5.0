# generate_data.py
import numpy as np
import pandas as pd
from tqdm import tqdm
import math
import random

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
random.seed(RANDOM_SEED)

# Configuration
TOTAL_DRIVING_SECONDS = 6 * 60 * 60    # 6 hours of simulated seconds (adjustable)
SAMPLE_RATE_HZ = 50                    # MPU sample rate 50 Hz -> 50 samples/sec
TOTAL_SAMPLES = TOTAL_DRIVING_SECONDS * SAMPLE_RATE_HZ
# To keep file reasonable for local runs, we'll downscale default if too big
MAX_SAMPLES = 300000                   # ~1.6 hours @50Hz -> safe default
if TOTAL_SAMPLES > MAX_SAMPLES:
    TOTAL_SAMPLES = MAX_SAMPLES

ACCIDENT_EVENTS = 250                  # number of accident events injected

def gen_normal_sample(t):
    """Generate normal (non-accident) sample for sensors."""
    # Acceleration: small vibration around gravity in body frame (m/s^2)
    ax = np.random.normal(0.0, 0.5)        # lateral/noise
    ay = np.random.normal(0.0, 0.5)
    az = np.random.normal(9.81, 0.6)       # gravity + noise
    # Gyros: slow rotations (deg/s)
    gx = np.random.normal(0.0, 2.0)
    gy = np.random.normal(0.0, 2.0)
    gz = np.random.normal(0.0, 3.0)
    # DHT11: ambient temp & humidity (India-ish day)
    temp = np.random.normal(30.0, 3.0)
    hum = np.clip(np.random.normal(50.0, 10.0), 10, 95)
    # GPS speed (m/s). Typical city speeds 0-25 m/s (0-90 km/h)
    speed = np.abs(np.random.normal(12.0, 5.0))
    return ax, ay, az, gx, gy, gz, temp, hum, speed

def gen_accident_segment(length_samples):
    """Generate an accident segment (sequence) to inject."""
    # Simulate approach: a short pre-impact jolt (braking), then high-magnitude impact spikes,
    # followed by chaotic motion and finally rest.
    seg = []
    # Pre-impact braking: negative acceleration on forward axis => emulate using ay or ax.
    for i in range(int(0.1 * length_samples)):
        ax = np.random.normal(-4.0, 1.0)  # large negative acceleration
        ay = np.random.normal(0.0, 1.0)
        az = np.random.normal(9.81, 1.0)
        gx = np.random.normal(0.0, 10.0)
        gy = np.random.normal(0.0, 10.0)
        gz = np.random.normal(0.0, 10.0)
        temp = np.random.normal(30.0, 3.0)
        hum = np.clip(np.random.normal(50.0, 10.0), 10, 95)
        speed = max(0.0, np.random.normal(12.0, 4.0) - 6.0)
        seg.append((ax,ay,az,gx,gy,gz,temp,hum,speed,0))
    # Impact: a few samples with very large acceleration spikes and rotation
    impact_samples = max(1, int(0.02 * length_samples))
    for i in range(impact_samples):
        ax = np.random.normal(30.0, 10.0) * random.choice([1,-1])
        ay = np.random.normal(25.0, 8.0) * random.choice([1,-1])
        az = np.random.normal(60.0, 20.0)  # big vertical spike
        gx = np.random.normal(200.0, 80.0)
        gy = np.random.normal(200.0, 80.0)
        gz = np.random.normal(150.0, 60.0)
        temp = np.random.normal(30.0, 3.0)
        hum = np.clip(np.random.normal(50.0, 10.0), 10, 95)
        speed = max(0.0, np.random.normal(12.0, 4.0) - 12.0)
        seg.append((ax,ay,az,gx,gy,gz,temp,hum,speed,1))
    # Post-impact chaotic movement & then rest
    for i in range(int(0.2 * length_samples)):
        ax = np.random.normal(0.0, 5.0)
        ay = np.random.normal(0.0, 5.0)
        az = np.random.normal(9.81, 6.0)
        gx = np.random.normal(0.0, 40.0)
        gy = np.random.normal(0.0, 40.0)
        gz = np.random.normal(0.0, 40.0)
        temp = np.random.normal(30.0, 3.0)
        hum = np.clip(np.random.normal(50.0, 10.0), 10, 95)
        speed = max(0.0, np.random.normal(6.0, 4.0))
        seg.append((ax,ay,az,gx,gy,gz,temp,hum,speed,1))
    return seg

def generate_dataset(n_samples):
    data = []
    accident_positions = set()
    # Spread accident events randomly across timeline
    # Each accident will occupy a short block of samples
    for _ in range(ACCIDENT_EVENTS):
        pos = np.random.randint(0, n_samples-200)  # leave margin
        accident_positions.add(pos)
    accident_positions = sorted(list(accident_positions))
    accident_set = set()
    # Map each position to an accident segment size
    accident_map = {}
    for pos in accident_positions:
        seg_len = np.random.randint(20, 120)  # 0.4s to 2.4s @50Hz
        accident_map[pos] = seg_len

    i = 0
    while i < n_samples:
        if i in accident_map:
            seg_len = accident_map[i]
            seg = gen_accident_segment(seg_len)
            for row in seg:
                data.append(row)
            i += len(seg)
            continue
        # otherwise normal sample
        row = gen_normal_sample(i)
        # normal label 0
        data.append(tuple(list(row) + [0]))
        i += 1

    df = pd.DataFrame(data, columns=[
        'ax','ay','az','gx','gy','gz','temp','hum','speed','label'
    ])
    return df

if __name__ == '__main__':
    print("Generating dataset (~{} samples)...".format(TOTAL_SAMPLES))
    df = generate_dataset(TOTAL_SAMPLES)
    print("Samples generated:", len(df))
    print("Accident samples sum:", df['label'].sum())
    out = "sensor_dataset.csv"
    df.to_csv(out, index=False)
    print("Saved to", out)
