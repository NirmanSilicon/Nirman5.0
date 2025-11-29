import { Therapy } from "@/app/therpy/therpy";

// Mapping therapy names to their corresponding image files
export const therapyImageMap: Record<string, string> = {
  // Vata therapies
  "Basti (Medicated Enema)": "/basti1.jpg",
  "Abhyanga (Warm Oil Massage)": "/Abhyanga1.jpg", 
  "Swedana (Herbal Steam Therapy)": "/swedna1.jpg",
  "Nasya (Nasal Therapy)": "/Nasya1.jpg",

  // Pitta therapies  
  "Virechana (Therapeutic Purgation)": "/akhi1.jpg",
  "Raktamokshana (Bloodletting)": "/akhi2.jpg",
  "Shirodhara (Oil Pouring on Forehead)": "/akhi3.jpg",
  "Abhyanga (Cooling Oil Massage)": "/Abhyanga2.jpg",

  // Kapha therapies
  "Vamana (Therapeutic Emesis)": "/sneha1.jpg",
  "Udvartana (Herbal Powder Massage)": "/sneha2.jpg", 
  "Nasya (Nasal Medication)": "/Nasya2.jpg",
  "Swedana (Sweating Therapy)": "/swedna2.jpg",
};

// Alternative images for each therapy (for variety)
export const therapyImageAlternatives: Record<string, string[]> = {
  "Basti (Medicated Enema)": ["/basti1.jpg", "/basti2.jpg", "/basti3.jpg", "/basti4.jpg"],
  "Abhyanga (Warm Oil Massage)": ["/Abhyanga1.jpg", "/Abhyanga2.jpg", "/Abhyanga3.jpg", "/Abhyanga4.jpg"],
  "Swedana (Herbal Steam Therapy)": ["/swedna1.jpg", "/swedna2.jpg", "/swedna3.jpg", "/Swedna4.jpg"],
  "Nasya (Nasal Therapy)": ["/Nasya1.jpg", "/Nasya2.jpg", "/Nasya3.jpg", "/Nasya4.jpg"],
  "Virechana (Therapeutic Purgation)": ["/akhi1.jpg", "/akhi2.jpg", "/akhi3.jpg"],
  "Raktamokshana (Bloodletting)": ["/akhi1.jpg", "/akhi2.jpg", "/akhi3.jpg"],
  "Shirodhara (Oil Pouring on Forehead)": ["/akhi1.jpg", "/akhi2.jpg", "/akhi3.jpg"],
  "Abhyanga (Cooling Oil Massage)": ["/Abhyanga1.jpg", "/Abhyanga2.jpg", "/Abhyanga3.jpg", "/Abhyanga4.jpg"],
  "Vamana (Therapeutic Emesis)": ["/sneha1.jpg", "/sneha2.jpg", "/sneha3.jpg"],
  "Udvartana (Herbal Powder Massage)": ["/sneha1.jpg", "/sneha2.jpg", "/sneha3.jpg"],
  "Nasya (Nasal Medication)": ["/Nasya1.jpg", "/Nasya2.jpg", "/Nasya3.jpg", "/Nasya4.jpg"],
  "Swedana (Sweating Therapy)": ["/swedna1.jpg", "/swedna2.jpg", "/swedna3.jpg", "/Swedna4.jpg"],
};

// Get the primary image for a therapy
export function getTherapyImage(therapy: Therapy): string {
  return therapyImageMap[therapy.name] || "/placeholder.jpg";
}

// Get all available images for a therapy
export function getTherapyImages(therapy: Therapy): string[] {
  return therapyImageAlternatives[therapy.name] || ["/placeholder.jpg"];
}

// Get a random image from available alternatives
export function getRandomTherapyImage(therapy: Therapy): string {
  const images = getTherapyImages(therapy);
  return images[Math.floor(Math.random() * images.length)];
}
