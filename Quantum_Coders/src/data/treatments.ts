export interface Treatment {
  disease: string;
  treatment: string;
  prevention: string;
  severity: "healthy" | "mild" | "severe";
}

export const treatments: Record<string, Treatment> = {
  "tomato_healthy": {
    disease: "Healthy Tomato",
    treatment: "No treatment needed. Continue regular care and monitoring.",
    prevention: "Continue watering regularly, maintain proper spacing between plants, inspect leaves weekly for early signs of disease.",
    severity: "healthy"
  },
  "tomato_leaf_spot": {
    disease: "Tomato Leaf Spot",
    treatment: "Remove and destroy infected leaves immediately. Avoid overhead watering. Apply Mancozeb fungicide (2g per liter) every 7-10 days.",
    prevention: "Use drip irrigation instead of overhead watering. Ensure good air circulation. Remove lower leaves touching soil. Apply mulch to prevent soil splash.",
    severity: "mild"
  },
  "tomato_early_blight": {
    disease: "Tomato Early Blight",
    treatment: "Remove damaged leaves and stems. Apply Chlorothalonil (2ml per liter) or Mancozeb (2g per liter) fungicide. Repeat every 7-14 days until symptoms disappear.",
    prevention: "Rotate crops annually. Stake plants for better air flow. Remove weeds regularly. Apply preventive fungicide during humid weather.",
    severity: "severe"
  },
  "potato_healthy": {
    disease: "Healthy Potato",
    treatment: "No treatment needed. Maintain current care practices.",
    prevention: "Maintain proper spacing between plants (30-40cm). Ensure regular irrigation without waterlogging. Monitor for pest activity weekly.",
    severity: "healthy"
  },
  "potato_late_blight": {
    disease: "Potato Late Blight",
    treatment: "Remove and burn all infected leaves immediately. Apply Copper Oxychloride (3g per liter) or Metalaxyl + Mancozeb (2g per liter). Repeat every 5-7 days in wet conditions.",
    prevention: "Use disease-resistant varieties. Avoid planting near tomatoes. Destroy volunteer potato plants. Ensure good drainage to prevent waterlogging.",
    severity: "severe"
  },
  "potato_early_blight": {
    disease: "Potato Early Blight",
    treatment: "Remove infected foliage. Apply Mancozeb (2g per liter) or Propiconazole (1ml per liter) fungicide every 10-14 days.",
    prevention: "Practice 3-4 year crop rotation. Hill up soil around plants. Apply balanced fertilizer. Avoid nitrogen excess which promotes disease.",
    severity: "mild"
  }
};

export function getTreatment(prediction: string): Treatment | null {
  const key = prediction.toLowerCase().replace(/\s+/g, "_");
  return treatments[key] || null;
}
