"use client";
import React, { useState } from "react";
import { Therapy } from "@/app/therpy/therpy";
import { therapyImageMap } from "@/lib/therapy-images";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TherapyRecommendationsPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Prediction failed");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // Example therapies by dosha (replace with dynamic fetch if needed)
  const therapiesByDosha: Record<string, Therapy[]> = {
    Vata: [
      {
        id: "vata-basti",
        dosha: "Vata",
        name: "Basti (Medicated Enema)",
        description:
          "Medicated oils or decoctions given rectally to soothe dryness and clear vata impurities from the colon.",
        duration: "45-60 minutes",
        price: "₹800 - ₹1,200",
        image: therapyImageMap["Basti (Medicated Enema)"],
        benefits: [
          "Relieves constipation",
          "Reduces anxiety",
          "Improves sleep",
          "Strengthens colon",
        ],
        contraindications: [
          "Acute diarrhea",
          "Severe hemorrhoids",
          "Pregnancy",
        ],
      },
      // ...add more Vata therapies
    ],
    Pitta: [
      {
        id: "pitta-virechana",
        dosha: "Pitta",
        name: "Virechana (Therapeutic Purgation)",
        description:
          "Gentle purgation therapy to remove excess pitta toxins from the digestive tract.",
        duration: "60 minutes",
        price: "₹1,200 - ₹1,800",
        image: therapyImageMap["Virechana (Therapeutic Purgation)"],
        benefits: [
          "Detoxifies liver",
          "Improves digestion",
          "Reduces inflammation",
        ],
        contraindications: ["Pregnancy", "Severe dehydration"],
      },
      // ...add more Pitta therapies
    ],
    Kapha: [
      {
        id: "kapha-vamana",
        dosha: "Kapha",
        name: "Vamana (Therapeutic Emesis)",
        description:
          "Controlled emesis therapy to expel excess kapha and mucus from the body.",
        duration: "60 minutes",
        price: "₹1,000 - ₹1,500",
        image: therapyImageMap["Vamana (Therapeutic Emesis)"],
        benefits: [
          "Clears respiratory tract",
          "Reduces allergies",
          "Improves metabolism",
        ],
        contraindications: ["Children", "Pregnancy", "Bleeding disorders"],
      },
      // ...add more Kapha therapies
    ],
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
        AI-Powered Therapy Recommendations
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-6 mb-6"
      >
        <label className="block mb-2 font-semibold">
          Upload your tongue image:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-40 h-40 object-cover rounded mb-4 border"
          />
        )}
        <button
          type="submit"
          disabled={loading || !selectedImage}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Get Recommendations"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>

      {result && (
        <div className="bg-green-50 border border-green-200 rounded p-6">
          <h2 className="text-xl font-bold mb-2 text-green-700">
            Your Dominant Dosha: {result.dominant_dosha}
          </h2>
          <p className="mb-2">
            Confidence: {(result.confidence * 100).toFixed(1)}%
          </p>
          <h3 className="font-semibold mb-2">Recommended Therapies:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {therapiesByDosha[result.dominant_dosha]?.map((therapy) => (
              <div
                key={therapy.id}
                className="bg-white shadow rounded p-4 flex flex-col items-center"
              >
                <img
                  src={therapy.image}
                  alt={therapy.name}
                  className="w-32 h-32 object-cover rounded mb-2 border"
                />
                <h4 className="font-bold text-lg mb-1 text-green-800">
                  {therapy.name}
                </h4>
                <p className="text-sm mb-1">{therapy.description}</p>
                <p className="text-xs mb-1">Duration: {therapy.duration}</p>
                <p className="text-xs mb-1">Price: {therapy.price}</p>
                <ul className="text-xs mb-1 list-disc pl-4">
                  {therapy.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                {therapy.contraindications && (
                  <p className="text-xs text-red-600">
                    Contraindications: {therapy.contraindications.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
