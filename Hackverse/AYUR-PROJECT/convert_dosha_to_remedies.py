import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
SRC = BASE_DIR / "data" / "ayur_kb" / "remedies.csv"   # your friend's file
DST = BASE_DIR / "data" / "ayur_kb" / "remedies.csv"

def main():
    df = pd.read_csv(SRC)

    print("Original columns:", df.columns.tolist())

    # 🔽 MODIFY mapping here according to your actual column names
    # Example: if your CSV has: Dosha, Disease, Treatment, Diet, Lifestyle, Notes
    col_map = {
        "Dosha": "dosha",
        "Disease": "problem",
        "Treatment": "remedy",
        "Diet": "diet",
        "Lifestyle": "lifestyle",
        "Notes": "notes",
        # "Source": "source",  # if exists
    }

    # Rename according to map (skip missing ones)
    rename_map = {src: dst for src, dst in col_map.items() if src in df.columns}
    df = df.rename(columns=rename_map)

    # Ensure required columns exist
    for col in ["dosha", "problem", "remedy"]:
        if col not in df.columns:
            raise ValueError(f"Required column '{col}' missing after rename. Current columns: {df.columns.tolist()}")

    # Fill optional columns if missing
    for col in ["diet", "lifestyle", "notes", "source"]:
        if col not in df.columns:
            df[col] = ""

    # Normalize dosha and problem to lowercase
    df["dosha"] = df["dosha"].astype(str).str.strip().str.lower()
    df["problem"] = df["problem"].astype(str).str.strip().str.lower()

    df.to_csv(DST, index=False)
    print(f"✅ Wrote normalized remedies KB to {DST}")

if __name__ == "__main__":
    main()
