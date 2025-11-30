const API_BASE = "http://localhost:8000";

export async function predictDisease(file) {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error("Prediction failed");
  }
  
  return await response.json();
}

export async function askChat(disease, question) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ disease, question }),
  });
  
  if (!response.ok) {
    throw new Error("Chat request failed");
  }
  
  return await response.json();
}

export async function fetchDiseasePacks() {
  const response = await fetch(`${API_BASE}/disease-packs`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch disease packs");
  }
  
  return await response.json();
}
