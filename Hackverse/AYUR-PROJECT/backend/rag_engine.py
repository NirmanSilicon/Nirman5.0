# backend/rag_engine.py

from pathlib import Path
from typing import List, Dict, Any, Optional

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .config import BASE_DIR

# Expected CSV path: data/ayur_kb/remedies.csv
KB_CSV_PATH = BASE_DIR / "data" / "ayur_kb" / "remedies.csv"

kb_df: Optional[pd.DataFrame] = None
vectorizer: Optional[TfidfVectorizer] = None
kb_matrix = None
rag_available: bool = False


def _load_kb():
    """
    Load Ayurvedic knowledge base from remedies.csv and build TF-IDF matrix.
    Expected CSV columns (case-insensitive, we normalize):
      dosha, problem, remedy, diet, lifestyle, notes (optional), source (optional)
    """
    global kb_df, vectorizer, kb_matrix, rag_available

    if not KB_CSV_PATH.exists():
        print(f"⚠️ RAG KB not found at {KB_CSV_PATH}. Running without RAG.")
        rag_available = False
        return

    df = pd.read_csv(KB_CSV_PATH)

    # Normalize column names
    df.columns = [c.strip().lower() for c in df.columns]

    # Basic required columns
    required_cols = ["dosha", "problem", "remedy"]
    for col in required_cols:
        if col not in df.columns:
            print(f"⚠️ RAG KB missing required column '{col}'. Columns found: {df.columns.tolist()}")
            rag_available = False
            return

    # Fill missing text columns with empty strings
    for col in ["diet", "lifestyle", "notes", "source"]:
        if col not in df.columns:
            df[col] = ""
        else:
            df[col] = df[col].fillna("")

    # Build a text field for retrieval
    def row_to_text(row):
        parts = [
            str(row.get("dosha", "")),
            str(row.get("problem", "")),
            str(row.get("remedy", "")),
            str(row.get("diet", "")),
            str(row.get("lifestyle", "")),
            str(row.get("notes", "")),
        ]
        return " ".join(parts)

    df["__doc_text"] = df.apply(row_to_text, axis=1)

    # TF-IDF vectorizer
    vectorizer_local = TfidfVectorizer(
        lowercase=True,
        stop_words="english"
    )
    kb_matrix_local = vectorizer_local.fit_transform(df["__doc_text"].tolist())

    kb_df = df
    vectorizer = vectorizer_local
    kb_matrix = kb_matrix_local
    rag_available = True

    print(f"✅ RAG KB loaded from {KB_CSV_PATH}, rows: {len(df)}")


# Load KB at import time
_load_kb()


def query_kb(
    dosha: str,
    problem: str,
    symptoms: str = "",
    tongue_features: Optional[Dict[str, Any]] = None,
    top_k: int = 3,
) -> List[Dict[str, Any]]:
    """
    Query the KB using TF-IDF similarity.
    Returns a list of top_k rows with similarity scores.
    """
    if not rag_available or kb_df is None or vectorizer is None or kb_matrix is None:
        return []

    dosha = (dosha or "").strip().lower()
    problem = (problem or "").strip().lower()
    symptoms = (symptoms or "").strip().lower()

    tf_parts = []
    if tongue_features:
        # e.g. "red tongue thick_white coating dry texture"
        tf_parts.append(f"{tongue_features.get('tongue_color', '')} tongue")
        tf_parts.append(f"{tongue_features.get('coating', '')} coating")
        tf_parts.append(f"{tongue_features.get('texture', '')} texture")

    query_text = " ".join([
        dosha,
        problem,
        symptoms,
        " ".join(tf_parts)
    ])

    if not query_text.strip():
        return []

    q_vec = vectorizer.transform([query_text])
    sims = cosine_similarity(q_vec, kb_matrix)[0]

    # Get top_k indices sorted by similarity
    top_idx = sims.argsort()[::-1][:top_k]

    results = []
    for idx in top_idx:
        row = kb_df.iloc[int(idx)]
        results.append({
            "dosha": row.get("dosha", ""),
            "problem": row.get("problem", ""),
            "remedy": row.get("remedy", ""),
            "diet": row.get("diet", ""),
            "lifestyle": row.get("lifestyle", ""),
            "notes": row.get("notes", ""),
            "source": row.get("source", ""),
            "score": float(sims[idx]),
        })

    return results


def build_advice_from_hits(hits: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Merge top RAG hits into a consolidated advice block
    (remedies, diet, lifestyle).
    """
    if not hits:
        return {
            "rag_used": False,
            "rag_hits": [],
            "rag_remedies": [],
            "rag_diet": [],
            "rag_lifestyle": [],
        }

    remedies = []
    diet = []
    lifestyle = []

    for h in hits:
        if h.get("remedy"):
            remedies.append(str(h["remedy"]))
        if h.get("diet"):
            diet.append(str(h["diet"]))
        if h.get("lifestyle"):
            lifestyle.append(str(h["lifestyle"]))

    # Deduplicate while preserving order
    def unique(seq):
        seen = set()
        out = []
        for x in seq:
            if x not in seen:
                seen.add(x)
                out.append(x)
        return out

    return {
        "rag_used": True,
        "rag_hits": hits,
        "rag_remedies": unique(remedies),
        "rag_diet": unique(diet),
        "rag_lifestyle": unique(lifestyle),
    }


def get_rag_advice(
    dosha: str,
    problem: str,
    symptoms: str,
    tongue_features: Optional[Dict[str, Any]] = None,
    top_k: int = 3
) -> Dict[str, Any]:
    """
    Public API used by app.py.
    Returns a dict containing:
      rag_used (bool), rag_hits, rag_remedies, rag_diet, rag_lifestyle
    """
    if not rag_available:
        return {
            "rag_used": False,
            "rag_hits": [],
            "rag_remedies": [],
            "rag_diet": [],
            "rag_lifestyle": [],
        }

    hits = query_kb(
        dosha=dosha,
        problem=problem,
        symptoms=symptoms,
        tongue_features=tongue_features,
        top_k=top_k,
    )
    return build_advice_from_hits(hits)
