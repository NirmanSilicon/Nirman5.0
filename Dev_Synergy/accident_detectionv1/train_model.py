# train_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib
from features import window_and_extract

RANDOM_SEED = 42

def main():
    df = pd.read_csv('sensor_dataset.csv')
    print("Loaded dataset rows:", len(df))
    # parameters (must match generate_data SAMPLE_RATE)
    window_size = 100  # 2 seconds @50Hz
    step = 50          # 50% overlap
    print("Extracting features...")
    feat_df = window_and_extract(df, window_size=window_size, step=step)
    print("Windows/features:", feat_df.shape)
    X = feat_df.drop(columns=['label'])
    y = feat_df['label'].values

    # train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=RANDOM_SEED, stratify=y)
    print("Train/test sizes:", X_train.shape[0], X_test.shape[0])

    # scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("Training RandomForest...")
    clf = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=RANDOM_SEED, n_jobs=-1)
    clf.fit(X_train_scaled, y_train)

    y_pred = clf.predict(X_test_scaled)
    y_proba = clf.predict_proba(X_test_scaled)[:,1]

    print("Classification report:")
    print(classification_report(y_test, y_pred, digits=4))
    print("Confusion matrix:")
    print(confusion_matrix(y_test, y_pred))
    try:
        auc = roc_auc_score(y_test, y_proba)
        print("ROC AUC:", auc)
    except Exception:
        pass

    # Save model and scaler and feature columns
    joblib.dump(clf, 'rf_accident_model.joblib')
    joblib.dump(scaler, 'scaler.joblib')
    joblib.dump(X.columns.tolist(), 'feature_columns.joblib')
    print("Saved model -> rf_accident_model.joblib, scaler.joblib, feature_columns.joblib")

if __name__ == '__main__':
    main()
