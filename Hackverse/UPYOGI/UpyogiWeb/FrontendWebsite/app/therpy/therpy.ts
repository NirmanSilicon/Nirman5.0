export type Dosha = "Vata" | "Pitta" | "Kapha";

export interface Therapy {
  id: string;
  dosha: Dosha;
  name: string;
  description: string;
  duration: string;
  price: string;
  image?: string; // optional, you can add image paths later
  benefits: string[];
  contraindications?: string[];
}

const therapies: Therapy[] = [
  // Vata therapies
  {
    id: "vata-basti",
    dosha: "Vata",
    name: "Basti (Medicated Enema)",
    description: "Medicated oils or decoctions given rectally to soothe dryness and clear vata impurities from the colon.",
    duration: "45-60 minutes",
    price: "₹800 - ₹1,200",
    image: "/basti1.jpg",
    benefits: ["Relieves constipation", "Reduces anxiety", "Improves sleep", "Strengthens colon"],
    contraindications: ["Acute diarrhea", "Severe hemorrhoids", "Pregnancy"]
  },
  {
    id: "vata-abhyanga",
    dosha: "Vata",
    name: "Abhyanga (Warm Oil Massage)",
    description: "Therapeutic oil massage nourishes joints and tissues, grounding and calming excessive vata energy.",
    duration: "60-90 minutes",
    price: "₹1,000 - ₹1,500",
    image: "/Abhyanga1.jpg",
    benefits: ["Reduces joint pain", "Improves circulation", "Calms nervous system", "Moisturizes skin"],
    contraindications: ["Fever", "Skin infections", "Open wounds"]
  },
  {
    id: "vata-swedana",
    dosha: "Vata",
    name: "Swedana (Herbal Steam Therapy)",
    description: "Steam therapy with medicated herbs relaxes stiff muscles and removes vata toxins from tissues.",
    duration: "30-45 minutes",
    price: "₹600 - ₹900",
    image: "/swedna1.jpg",
    benefits: ["Relieves muscle stiffness", "Opens pores", "Removes toxins", "Improves flexibility"],
    contraindications: ["High blood pressure", "Heart conditions", "Pregnancy"]
  },
  {
    id: "vata-nasya",
    dosha: "Vata",
    name: "Nasya (Nasal Therapy)",
    description: "Medicated oils or powders administered through the nose pacify vata in the head and sinuses, relieving headaches and insomnia.",
    duration: "15-30 minutes",
    price: "₹500 - ₹800",
    image: "/Nasya1.jpg",
    benefits: ["Relieves headaches", "Improves sleep", "Clears sinuses", "Enhances memory"],
    contraindications: ["Nasal bleeding", "Acute sinusitis", "Pregnancy"]
  },

  // Pitta therapies
  {
    id: "pitta-virechana",
    dosha: "Pitta",
    name: "Virechana (Therapeutic Purgation)",
    description: "Purgative herbs expel excess pitta through the intestines, helping with acidity, skin problems, and inflammation.",
    duration: "2-3 hours",
    price: "₹1,200 - ₹1,800",
    image: "/akhi1.jpg",
    benefits: ["Reduces acidity", "Clears skin", "Reduces inflammation", "Improves digestion"],
    contraindications: ["Severe diarrhea", "Pregnancy", "Weak constitution"]
  },
  {
    id: "pitta-raktamokshana",
    dosha: "Pitta",
    name: "Raktamokshana (Bloodletting)",
    description: "Controlled removal of blood via leech therapy or other methods clears pitta-associated impurities like skin eruptions.",
    duration: "60-90 minutes",
    price: "₹1,500 - ₹2,000",
    image: "/akhi2.jpg",
    benefits: ["Clears skin conditions", "Reduces inflammation", "Purifies blood", "Relieves heat"],
    contraindications: ["Anemia", "Low blood pressure", "Bleeding disorders"]
  },
  {
    id: "pitta-shirodhara",
    dosha: "Pitta",
    name: "Shirodhara (Oil Pouring on Forehead)",
    description: "Cool oil poured gently on the forehead calms agitation and mental irritation caused by high pitta.",
    duration: "45-60 minutes",
    price: "₹1,000 - ₹1,500",
    image: "/akhi3.jpg",
    benefits: ["Reduces stress", "Improves sleep", "Calms mind", "Relieves headaches"],
    contraindications: ["Severe migraine", "Open wounds on head", "High fever"]
  },
  {
    id: "pitta-abhyanga",
    dosha: "Pitta",
    name: "Abhyanga (Cooling Oil Massage)",
    description: "Gentle massage with cooling oils like coconut or sandalwood helps calm inflamed pitta and supports the skin.",
    duration: "60-90 minutes",
    price: "₹1,000 - ₹1,500",
    image: "/Abhyanga2.jpg",
    benefits: ["Cools body heat", "Reduces inflammation", "Moisturizes skin", "Calms emotions"],
    contraindications: ["Skin allergies", "Open wounds", "Fever"]
  },

  // Kapha therapies
  {
    id: "kapha-vamana",
    dosha: "Kapha",
    name: "Vamana (Therapeutic Emesis)",
    description: "Controlled vomiting expels excess kapha and mucus from the stomach and chest, improving respiratory and metabolic health.",
    duration: "2-3 hours",
    price: "₹1,200 - ₹1,800",
    image: "/sneha1.jpg",
    benefits: ["Clears respiratory system", "Reduces mucus", "Improves metabolism", "Boosts energy"],
    contraindications: ["Pregnancy", "Heart conditions", "Severe asthma"]
  },
  {
    id: "kapha-udvartana",
    dosha: "Kapha",
    name: "Udvartana (Herbal Powder Massage)",
    description: "Vigorous rubbing of medicinal powders helps remove excess fat, stimulates circulation, and reduces sluggish kapha.",
    duration: "45-60 minutes",
    price: "₹800 - ₹1,200",
    image: "/sneha2.jpg",
    benefits: ["Reduces cellulite", "Improves circulation", "Stimulates metabolism", "Tones skin"],
    contraindications: ["Skin sensitivity", "Open wounds", "Pregnancy"]
  },
  {
    id: "kapha-nasya",
    dosha: "Kapha",
    name: "Nasya (Nasal Medication)",
    description: "Nasya with herbs or oils cleanses kapha accumulations from the head, improving breathing and clearing sinuses.",
    duration: "15-30 minutes",
    price: "₹500 - ₹800",
    image: "/Nasya2.jpg",
    benefits: ["Clears nasal passages", "Improves breathing", "Reduces congestion", "Enhances smell"],
    contraindications: ["Nasal bleeding", "Severe sinusitis", "Pregnancy"]
  },
  {
    id: "kapha-swedana",
    dosha: "Kapha",
    name: "Swedana (Sweating Therapy)",
    description: "Herbal steam induces sweating, removes toxins, reduces heaviness, and improves circulation in kapha-predominant individuals.",
    duration: "30-45 minutes",
    price: "₹600 - ₹900",
    image: "/swedna2.jpg",
    benefits: ["Removes toxins", "Reduces water retention", "Improves circulation", "Boosts energy"],
    contraindications: ["High blood pressure", "Heart conditions", "Pregnancy"]
  }
];

// Utility functions
export function getTherapiesByDosha(dosha: Dosha): Therapy[] {
  return therapies.filter(therapy => therapy.dosha === dosha);
}

export function getTherapyById(id: string): Therapy | undefined {
  return therapies.find(therapy => therapy.id === id);
}

export function getRecommendedTherapies(dosha: Dosha, limit: number = 4): Therapy[] {
  return getTherapiesByDosha(dosha).slice(0, limit);
}

export function getAllTherapies(): Therapy[] {
  return therapies;
}

export default therapies;
