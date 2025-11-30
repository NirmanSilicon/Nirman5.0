export interface DiseaseInfo {
  name: string;
  displayName: string;
  description: string;
  causes: string[];
  symptoms: string[];
  treatments: string[];
  prevention: string[];
  severity: "low" | "medium" | "high";
}

export const DISEASES: Record<string, DiseaseInfo> = {
  healthy: {
    name: "healthy",
    displayName: "Healthy Leaf",
    description: "This leaf appears to be healthy with no visible signs of disease.",
    causes: [],
    symptoms: ["Normal green coloration", "No spots or lesions", "Proper leaf structure"],
    treatments: ["Continue current care practices", "Maintain proper watering schedule"],
    prevention: ["Regular monitoring", "Proper fertilization", "Good air circulation"],
    severity: "low",
  },
  early_blight: {
    name: "early_blight",
    displayName: "Early Blight",
    description: "Early blight is a fungal disease caused by Alternaria solani that affects tomatoes, potatoes, and other plants.",
    causes: [
      "Fungal infection (Alternaria solani)",
      "High humidity and warm temperatures",
      "Poor air circulation between plants",
      "Infected plant debris in soil",
    ],
    symptoms: [
      "Dark brown spots with concentric rings",
      "Yellow halos around spots",
      "Lower leaves affected first",
      "Premature leaf drop",
    ],
    treatments: [
      "Remove and destroy infected leaves",
      "Apply copper-based fungicide",
      "Use organic neem oil spray",
      "Improve plant spacing for airflow",
    ],
    prevention: [
      "Rotate crops annually",
      "Water at soil level, not on leaves",
      "Remove plant debris after harvest",
      "Use disease-resistant varieties",
    ],
    severity: "medium",
  },
  late_blight: {
    name: "late_blight",
    displayName: "Late Blight",
    description: "Late blight is a serious disease caused by Phytophthora infestans that can destroy entire crops rapidly.",
    causes: [
      "Oomycete pathogen (Phytophthora infestans)",
      "Cool, wet weather conditions",
      "Prolonged leaf wetness",
      "Infected seed potatoes or tomato transplants",
    ],
    symptoms: [
      "Water-soaked gray-green spots",
      "White fuzzy growth on leaf undersides",
      "Rapid browning and wilting",
      "Foul odor from decaying tissue",
    ],
    treatments: [
      "Remove infected plants immediately",
      "Apply systemic fungicide promptly",
      "Increase ventilation in greenhouses",
      "Harvest remaining healthy produce quickly",
    ],
    prevention: [
      "Use certified disease-free seeds",
      "Avoid overhead irrigation",
      "Plant resistant varieties",
      "Monitor weather conditions closely",
    ],
    severity: "high",
  },
  rust: {
    name: "rust",
    displayName: "Rust Disease",
    description: "Rust is a fungal disease that produces distinctive orange-brown pustules on leaves.",
    causes: [
      "Fungal infection (various Puccinia species)",
      "Humid conditions with moderate temperatures",
      "Wind-borne spore transmission",
      "Overcrowding of plants",
    ],
    symptoms: [
      "Orange or rust-colored pustules",
      "Powdery spores on leaf surfaces",
      "Yellowing around infected areas",
      "Stunted growth in severe cases",
    ],
    treatments: [
      "Apply sulfur-based fungicide",
      "Remove heavily infected leaves",
      "Use organic fungicide alternatives",
      "Improve air circulation",
    ],
    prevention: [
      "Space plants adequately",
      "Avoid wetting foliage when watering",
      "Remove infected plant material",
      "Choose resistant crop varieties",
    ],
    severity: "medium",
  },
};

export const CLASS_NAMES = ["healthy", "early_blight", "late_blight", "rust"];

export function getDiseaseInfo(diseaseName: string): DiseaseInfo {
  const normalizedName = diseaseName.toLowerCase().replace(/\s+/g, "_");
  return DISEASES[normalizedName] || DISEASES.healthy;
}

export function getRandomConfidence(): number {
  return Math.floor(Math.random() * 15) + 85;
}

export function simulatePrediction(): { disease: string; confidence: number } {
  const randomIndex = Math.floor(Math.random() * CLASS_NAMES.length);
  const disease = CLASS_NAMES[randomIndex];
  const confidence = getRandomConfidence();
  return { disease, confidence };
}
