import type { Therapy } from "@/types/therapy"

export const therapyData: Therapy[] = [
  {
    id: "vamana-1",
    name: "Vamana (Therapeutic Emesis)",
    // clinic: "Ayurveda Wellness Center", // Removed - not part of Therapy interface
    scheduledDate: "2024-01-15",
    scheduledTime: "09:00",
    dominantDosha: "kapha",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "internal-oleation",
            text: "Internal oleation (snehana) with medicated ghee or oil for 3–7 days to loosen toxins",
            completed: false,
            hasAlert: true,
            alertTime: "7 days before",
          },
          {
            id: "external-oleation",
            text: "External oleation (abhyanga) and sudation (swedana) on the day before and again the morning of Vamana",
            completed: false,
            hasAlert: true,
            alertTime: "1 day before",
          },
          {
            id: "kapha-foods",
            text: "Kapha-stimulating foods like curd, sweets, rice, or dairy the night before treatment to mobilize Kapha",
            completed: false,
            hasAlert: true,
            alertTime: "Night before",
          },
          {
            id: "fasting",
            text: "Fasting or light meals, bowel and bladder clearance before therapy",
            completed: false,
          },
          {
            id: "digestive-herbs",
            text: "Digestive herbs (Trikatu Churna, Hingwashtaka Churna etc.) to stimulate Agni for a few days prior",
            completed: false,
          },
        ],
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "light-diet",
            text: "Light, liquid diet (gruels, rice soup) gradually reintroducing normal foods (Samsarjana Krama)",
            completed: false,
          },
          {
            id: "rest-hydration",
            text: "Rest, hydration, and protection from cold, wind, strenuous activity, and exposure to triggers",
            completed: false,
          },
          {
            id: "avoid-foods",
            text: "Avoid spicy, oily, or heavy foods, excessive talking, and strong emotions for several days",
            completed: false,
          },
        ],
      },
    ],
    overallProgress: 0,
  },
  {
    id: "udvartana-1",
    name: "Udvartana (Herbal Powder Massage)",
    // clinic: "Holistic Health Spa", // Removed - not part of Therapy interface
    scheduledDate: "2024-01-18",
    scheduledTime: "14:00",
    dominantDosha: "vata",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "health-assessment",
            text: "Health assessment and documentation of constitution/disease state",
            completed: false,
          },
          {
            id: "warm-oil-massage",
            text: "Warm oil massage (Abhyanga) for 15-20 minutes to prepare the skin and body",
            completed: false,
          },
          {
            id: "light-clothing",
            text: "Client wears light clothing to expose skin",
            completed: false,
          },
          {
            id: "collect-powders",
            text: "Collect relevant herbal powders (Kolakulathadi, Kottamchukkadi, Triphala, etc.)",
            completed: false,
          },
        ],
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "warm-bath",
            text: "Warm bath after massage to wash off herbal powder and relax the body",
            completed: false,
          },
          {
            id: "rest-advice",
            text: "Advise rest, light diet, and avoid exposure to cold immediately post session",
            completed: false,
          },
          {
            id: "monitor-skin",
            text: "Monitor for skin irritation or excessive dryness",
            completed: false,
          },
        ],
      },
    ],
    overallProgress: 0,
  },
  {
    id: "nasya-1",
    name: "Nasya (Nasal Therapy)",
    // clinic: "Traditional Ayurveda Clinic", // Removed - not part of Therapy interface
    scheduledDate: "2024-01-20",
    scheduledTime: "11:00",
    dominantDosha: "pitta",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "clear-bowel-bladder",
            text: "Ensure patient has cleared bowel/bladder; previous meal fully digested",
            completed: false,
          },
          {
            id: "massage-steam",
            text: "Mild massage and steam over scalp, face, and neck for 10–15 minutes",
            completed: false,
          },
          {
            id: "room-setup",
            text: "Room setup: ventilated, clean, suitable Nasya table",
            completed: false,
          },
        ],
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "mild-massage",
            text: "Mild massage to feet, arms, and shoulders",
            completed: false,
          },
          {
            id: "spit-excess",
            text: "Spit out excess medicine, avoid swallowing",
            completed: false,
          },
          {
            id: "gargle-water",
            text: "Advise gargling with lukewarm water, and inhalation of medicated smoke if required for additional Kapha clearing",
            completed: false,
          },
          {
            id: "rest-quietly",
            text: "Rest quietly; avoid exposure to dust, cold, wind, sunlight, excessive talking, or laughing",
            completed: false,
          },
        ],
      },
    ],
    overallProgress: 0,
  },
  {
    id: "swedana-1",
    name: "Swedana (Herbal Steam Therapy)",
    // clinic: "Wellness Retreat Center", // Removed - not part of Therapy interface
    scheduledDate: "2024-01-22",
    scheduledTime: "16:00",
    dominantDosha: "vata",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "abhyanga-massage",
            text: "Abhyanga massage with warm medicated oil to body and scalp",
            completed: false,
          },
          {
            id: "ensure-clearance",
            text: "Ensure patient has passed urine/stools, and removed all clothing except underwear",
            completed: false,
          },
        ],
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "dry-body",
            text: "Dry body gently with a towel post steam; rest quietly for 30–60 minutes",
            completed: false,
          },
          {
            id: "avoid-cold",
            text: "Avoid direct exposure to air/cold immediately after; hot water bath is recommended after 1 hour",
            completed: false,
          },
          {
            id: "light-meals",
            text: "Advise light meals and hydration",
            completed: false,
          },
        ],
      },
    ],
    overallProgress: 0,
  },
]
