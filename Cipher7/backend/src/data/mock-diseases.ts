/**
 * Large-Scale Mock Disease Data
 * Comprehensive dataset for ICMR, MoHFW, VRDL simulations
 */

export const mockDiseases = [
  // Infectious Diseases
  {
    name: "Dengue",
    scientificName: "Dengue virus (DENV)",
    category: "Infectious",
    description: "Mosquito-borne viral infection transmitted by Aedes mosquitoes",
    symptoms: ["fever", "headache", "muscle pain", "joint pain", "rash", "nausea", "vomiting", "eye pain"],
    severity: "High",
    source: "ICMR",
  },
  {
    name: "Malaria",
    scientificName: "Plasmodium falciparum / P. vivax",
    category: "Infectious",
    description: "Parasitic disease transmitted by Anopheles mosquitoes",
    symptoms: ["fever", "chills", "sweating", "nausea", "vomiting", "fatigue", "headache"],
    severity: "High",
    source: "ICMR",
  },
  {
    name: "COVID-19",
    scientificName: "SARS-CoV-2",
    category: "Infectious",
    description: "Coronavirus disease causing respiratory illness",
    symptoms: ["fever", "cough", "fatigue", "loss of taste", "loss of smell", "shortness of breath", "chest pain"],
    severity: "High",
    source: "MoHFW",
  },
  {
    name: "Chikungunya",
    scientificName: "CHIKV (Chikungunya virus)",
    category: "Infectious",
    description: "Viral disease transmitted by Aedes mosquitoes",
    symptoms: ["fever", "joint pain", "muscle pain", "headache", "rash", "fatigue"],
    severity: "Medium",
    source: "ICMR",
  },
  {
    name: "Typhoid",
    scientificName: "Salmonella Typhi",
    category: "Infectious",
    description: "Bacterial infection spread through contaminated food and water",
    symptoms: ["fever", "abdominal pain", "headache", "constipation", "diarrhea", "loss of appetite"],
    severity: "Medium",
    source: "ICMR",
  },
  {
    name: "Hepatitis A",
    scientificName: "Hepatitis A virus (HAV)",
    category: "Infectious",
    description: "Viral liver disease spread through contaminated food and water",
    symptoms: ["fever", "fatigue", "nausea", "jaundice", "dark urine", "abdominal pain"],
    severity: "Medium",
    source: "ICMR",
  },
  {
    name: "Hepatitis B",
    scientificName: "Hepatitis B virus (HBV)",
    category: "Infectious",
    description: "Viral liver disease spread through blood and body fluids",
    symptoms: ["fever", "fatigue", "nausea", "jaundice", "joint pain", "abdominal pain"],
    severity: "High",
    source: "ICMR",
  },
  {
    name: "Tuberculosis",
    scientificName: "Mycobacterium tuberculosis",
    category: "Infectious",
    description: "Bacterial infection primarily affecting the lungs",
    symptoms: ["persistent cough", "fever", "night sweats", "weight loss", "fatigue", "chest pain"],
    severity: "High",
    source: "ICMR",
  },
  {
    name: "Leptospirosis",
    scientificName: "Leptospira interrogans",
    category: "Infectious",
    description: "Bacterial disease spread through contact with infected animal urine",
    symptoms: ["fever", "headache", "muscle pain", "vomiting", "jaundice", "rash"],
    severity: "Medium",
    source: "ICMR",
  },
  {
    name: "Scrub Typhus",
    scientificName: "Orientia tsutsugamushi",
    category: "Infectious",
    description: "Bacterial infection transmitted by chiggers",
    symptoms: ["fever", "headache", "rash", "body aches", "eschar", "swollen lymph nodes"],
    severity: "Medium",
    source: "ICMR",
  },
  {
    name: "Japanese Encephalitis",
    scientificName: "Japanese Encephalitis virus (JEV)",
    category: "Infectious",
    description: "Viral brain infection transmitted by Culex mosquitoes",
    symptoms: ["fever", "headache", "vomiting", "confusion", "seizures", "paralysis"],
    severity: "High",
    source: "ICMR",
  },
  {
    name: "Rabies",
    scientificName: "Rabies virus (RABV)",
    category: "Infectious",
    description: "Viral disease transmitted through animal bites",
    symptoms: ["fever", "headache", "anxiety", "confusion", "hallucinations", "paralysis"],
    severity: "High",
    source: "ICMR",
  },
  {
    name: "Diphtheria",
    scientificName: "Corynebacterium diphtheriae",
    category: "Infectious",
    description: "Bacterial infection affecting the respiratory system",
    symptoms: ["sore throat", "fever", "swollen glands", "weakness", "difficulty breathing"],
    severity: "High",
    source: "ICMR",
  },
  {
    name: "Measles",
    scientificName: "Measles virus",
    category: "Infectious",
    description: "Highly contagious viral respiratory disease",
    symptoms: ["fever", "cough", "runny nose", "red eyes", "rash", "small white spots"],
    severity: "High",
    source: "MoHFW",
  },
  {
    name: "Chickenpox",
    scientificName: "Varicella-zoster virus (VZV)",
    category: "Infectious",
    description: "Highly contagious viral infection causing itchy rash",
    symptoms: ["fever", "headache", "rash", "itching", "loss of appetite", "tiredness"],
    severity: "Medium",
    source: "MoHFW",
  },
  {
    name: "Influenza",
    scientificName: "Influenza virus",
    category: "Infectious",
    description: "Respiratory illness caused by flu viruses",
    symptoms: ["fever", "cough", "sore throat", "runny nose", "body aches", "headache", "fatigue"],
    severity: "Medium",
    source: "MoHFW",
  },
  {
    name: "Gastroenteritis",
    scientificName: "Various (Norovirus, Rotavirus, etc.)",
    category: "Infectious",
    description: "Inflammation of the stomach and intestines",
    symptoms: ["diarrhea", "vomiting", "nausea", "abdominal pain", "fever", "dehydration"],
    severity: "Low",
    source: "ICMR",
  },
  {
    name: "Hand Foot Mouth Disease",
    scientificName: "Coxsackievirus",
    category: "Infectious",
    description: "Viral infection common in children",
    symptoms: ["fever", "sore throat", "rash", "blisters", "irritability", "loss of appetite"],
    severity: "Low",
    source: "MoHFW",
  },
  {
    name: "Mumps",
    scientificName: "Mumps virus",
    category: "Infectious",
    description: "Viral infection causing swollen salivary glands",
    symptoms: ["fever", "headache", "muscle aches", "swollen glands", "pain while chewing"],
    severity: "Medium",
    source: "MoHFW",
  },
  {
    name: "Rubella",
    scientificName: "Rubella virus",
    category: "Infectious",
    description: "Viral infection causing mild rash and fever",
    symptoms: ["mild fever", "rash", "swollen lymph nodes", "headache", "runny nose"],
    severity: "Low",
    source: "MoHFW",
  },
  {
    name: "Pneumonia",
    scientificName: "Various (Bacterial/Viral)",
    category: "Infectious",
    description: "Infection that inflames air sacs in one or both lungs",
    symptoms: ["cough", "fever", "chills", "difficulty breathing", "chest pain", "fatigue"],
    severity: "High",
    source: "ICMR",
  },
];

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Puducherry",
];

export const majorCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad",
];

export function generateMockOutbreaks(diseaseName: string, count: number = 5) {
  const outbreaks = [];
  const states = [...indianStates].sort(() => Math.random() - 0.5);
  const cities = [...majorCities].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(count, states.length); i++) {
    const state = states[i];
    const city = cities[i % cities.length];
    const district = `${city} District`;
    
    const caseCount = Math.floor(Math.random() * 2000) + 50;
    const activeCases = Math.floor(caseCount * (0.2 + Math.random() * 0.3));
    const recovered = Math.floor(caseCount * (0.5 + Math.random() * 0.3));
    const deaths = Math.floor(caseCount * (0.01 + Math.random() * 0.02));
    
    const trends = ["rising", "stable", "falling"];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    const trendPercentage = trend === "rising" 
      ? (5 + Math.random() * 15).toFixed(2)
      : trend === "falling"
      ? (-5 - Math.random() * 10).toFixed(2)
      : (0.5 - Math.random()).toFixed(2);
    
    const riskLevels = ["low", "medium", "high"];
    const riskLevel = caseCount > 1000 ? "high" : caseCount > 500 ? "medium" : "low";
    
    // Random date in the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const reportedDate = new Date();
    reportedDate.setDate(reportedDate.getDate() - daysAgo);
    
    outbreaks.push({
      diseaseName,
      state,
      district,
      city,
      caseCount,
      activeCases,
      recovered,
      deaths,
      riskLevel,
      trend,
      trendPercentage: parseFloat(trendPercentage),
      reportedDate: reportedDate.toISOString(),
      source: Math.random() > 0.5 ? "MoHFW" : "ICMR",
      metadata: {
        dataQuality: "verified",
        lastUpdated: new Date().toISOString(),
      },
    });
  }
  
  return outbreaks;
}

export function generateHistoricalOutbreakData(diseaseName: string, weeks: number = 12) {
  const data = [];
  const today = new Date();
  
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (i * 7) - 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekNumber = getWeekNumber(weekStart);
    const year = weekStart.getFullYear();
    const week = `${year}-W${weekNumber.toString().padStart(2, "0")}`;
    
    data.push({
      week,
      weekStartDate: weekStart.toISOString(),
      weekEndDate: weekEnd.toISOString(),
      caseCount: Math.floor(Math.random() * 500) + 10,
    });
  }
  
  return data;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

