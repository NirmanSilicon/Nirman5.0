from backend.rag_engine import get_rag_advice

def main():
    dosha = "pitta"
    problem = "acidity"
    symptoms = "burning chest after spicy food"
    tongue_features = {
        "tongue_color": "red",
        "coating": "thin_white",
        "texture": "smooth",
    }

    info = get_rag_advice(
        dosha=dosha,
        problem=problem,
        symptoms=symptoms,
        tongue_features=tongue_features,
        top_k=3
    )

    print("RAG used:", info["rag_used"])
    print("\nTop hits:")
    for hit in info["rag_hits"]:
        print("-", hit["dosha"], "|", hit["problem"], "|", hit["remedy"])

    print("\nMerged remedies:")
    for r in info["rag_remedies"]:
        print("  •", r)

    print("\nDiet suggestions:")
    for d in info["rag_diet"]:
        print("  •", d)

    print("\nLifestyle suggestions:")
    for l in info["rag_lifestyle"]:
        print("  •", l)

if __name__ == "__main__":
    main()
