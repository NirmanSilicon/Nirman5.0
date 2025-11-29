# features.py
import numpy as np
import pandas as pd

def magnitude(a,b,c):
    return np.sqrt(a*a + b*b + c*c)

def extract_features_from_window(window_df):
    """window_df: pandas DataFrame with columns ax,ay,az,gx,gy,gz,temp,hum,speed,label"""
    features = {}
    # accelerometer magnitudes
    acc_mag = magnitude(window_df['ax'].values, window_df['ay'].values, window_df['az'].values)
    gyro_mag = magnitude(window_df['gx'].values, window_df['gy'].values, window_df['gz'].values)

    # basic stats for each axis and magnitudes
    for col in ['ax','ay','az','gx','gy','gz','temp','hum','speed']:
        arr = window_df[col].values
        features[f'{col}_mean'] = arr.mean()
        features[f'{col}_std'] = arr.std()
        features[f'{col}_max'] = arr.max()
        features[f'{col}_min'] = arr.min()
        features[f'{col}_median'] = np.median(arr)
        features[f'{col}_rms'] = np.sqrt((arr**2).mean())

    # magnitudes
    features['acc_mag_mean'] = acc_mag.mean()
    features['acc_mag_max'] = acc_mag.max()
    features['acc_mag_std'] = acc_mag.std()
    features['gyro_mag_mean'] = gyro_mag.mean()
    features['gyro_mag_max'] = gyro_mag.max()
    features['gyro_mag_std'] = gyro_mag.std()

    # jerk: derivative of acceleration magnitude
    jerk = np.abs(np.diff(acc_mag))
    if len(jerk) == 0:
        features['jerk_max'] = 0.0
    else:
        features['jerk_max'] = jerk.max()
    # percentiles
    features['acc_95pct'] = np.percentile(acc_mag, 95)
    features['gyro_95pct'] = np.percentile(gyro_mag, 95)
    # label: majority label in window
    features['label'] = int(window_df['label'].mean() > 0.1)  # if >10% of samples are accident -> accident window
    return features

def window_and_extract(df, window_size=100, step=50):
    feat_rows = []
    n = len(df)
    for start in range(0, n - window_size + 1, step):
        w = df.iloc[start:start+window_size]
        feat = extract_features_from_window(w)
        feat_rows.append(feat)
    return pd.DataFrame(feat_rows)
