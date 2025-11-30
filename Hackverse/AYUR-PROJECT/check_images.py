import pandas as pd
from pathlib import Path

def main():
    CSV = Path("data/tongue_dataset/labels.csv")
    IMG_DIR = Path("data/tongue_dataset")

    if not CSV.exists():
        print("labels.csv not found at", CSV)
        return

    if not IMG_DIR.exists():
        print("Image directory not found at", IMG_DIR)
        return

    df = pd.read_csv(CSV)
    missing = []

    for f in df["filename"]:
        img_path = IMG_DIR / str(f)
        if not img_path.exists():
            missing.append(f)

    print("CSV rows:", len(df))
    print("Missing images:", len(missing))
    if missing:
        print("Missing files (first 10):", missing[:10], "...")
    else:
        print("✅ All images found — ready to train 🚀")

if __name__ == "__main__":
    main()
