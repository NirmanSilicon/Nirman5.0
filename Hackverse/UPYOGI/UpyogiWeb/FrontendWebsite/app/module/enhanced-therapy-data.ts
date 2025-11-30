import type { TherapyModule } from "@/types/therapy";

export const enhancedTherapyModules: Record<string, TherapyModule> = {
  "vata-basti": {
    id: "vata-basti-module",
    name: "Basti (Medicated Enema)",
    clinic: "Ayurveda Wellness Center",
    scheduledDate: "2024-01-15",
    scheduledTime: "09:00",
    dominantDosha: "vata",
    therapyId: "vata-basti",
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
            details: "Take 1-2 teaspoons of medicated ghee (like Triphala ghee) with warm water on empty stomach",
            tips: ["Start with small amounts", "Increase gradually", "Monitor for any digestive discomfort"]
          },
          {
            id: "external-oleation",
            text: "External oleation (abhyanga) and sudation (swedana) on the day before and morning of Basti",
            completed: false,
            hasAlert: true,
            alertTime: "1 day before",
            details: "Full body oil massage followed by steam therapy to prepare the body",
            tips: ["Use warm sesame oil", "Massage for 20-30 minutes", "Follow with warm shower"]
          },
          {
            id: "light-diet",
            text: "Light, easily digestible diet 2-3 days before treatment",
            completed: false,
            hasAlert: true,
            alertTime: "3 days before",
            details: "Avoid heavy, oily, and processed foods. Focus on soups, rice, and cooked vegetables",
            tips: ["Eat smaller portions", "Chew food thoroughly", "Avoid raw foods"]
          },
          {
            id: "fasting",
            text: "Fasting or light meals, bowel and bladder clearance before therapy",
            completed: false,
            hasAlert: true,
            alertTime: "Morning of treatment",
            details: "Empty bowels and bladder completely before the procedure",
            tips: ["Drink warm water", "Use natural laxatives if needed", "Arrive with empty stomach"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "rest-period",
            text: "Rest for 30-60 minutes after the procedure",
            completed: false,
            hasAlert: true,
            alertTime: "Immediately after",
            details: "Lie down comfortably and avoid any physical exertion",
            tips: ["Use a comfortable position", "Keep warm", "Avoid sudden movements"]
          },
          {
            id: "light-diet",
            text: "Light, liquid diet (gruels, rice soup) gradually reintroducing normal foods",
            completed: false,
            hasAlert: true,
            alertTime: "2-3 hours after",
            details: "Start with warm water, then rice gruel, gradually adding solid foods",
            tips: ["Start with liquids", "Progress to soft foods", "Avoid spicy foods"]
          },
          {
            id: "avoid-activities",
            text: "Avoid strenuous activities, cold exposure, and stress for 24-48 hours",
            completed: false,
            hasAlert: true,
            alertTime: "24-48 hours after",
            details: "No heavy lifting, exercise, or exposure to cold weather",
            tips: ["Stay indoors", "Keep warm", "Practice gentle breathing"]
          },
          {
            id: "monitor-effects",
            text: "Monitor for any side effects and report to therapist",
            completed: false,
            details: "Watch for excessive fatigue, digestive issues, or unusual symptoms",
            tips: ["Keep a symptom diary", "Stay hydrated", "Contact therapist if concerned"]
          }
        ]
      }
    ],
    overallProgress: 0
  },

  "vata-abhyanga": {
    id: "vata-abhyanga-module",
    name: "Abhyanga (Warm Oil Massage)",
    clinic: "Holistic Health Spa",
    scheduledDate: "2024-01-18",
    scheduledTime: "14:00",
    dominantDosha: "vata",
    therapyId: "vata-abhyanga",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "health-assessment",
            text: "Health assessment and documentation of constitution/disease state",
            completed: false,
            details: "Complete health questionnaire and discuss any current health issues",
            tips: ["Be honest about symptoms", "Mention any allergies", "Discuss medications"]
          },
          {
            id: "prepare-skin",
            text: "Clean skin and remove any lotions or oils before treatment",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes before",
            details: "Take a warm shower and avoid applying any products to skin",
            tips: ["Use mild soap", "Pat skin dry", "Wear loose clothing"]
          },
          {
            id: "empty-bladder",
            text: "Empty bladder and bowels before the session",
            completed: false,
            hasAlert: true,
            alertTime: "15 minutes before",
            details: "Ensure complete evacuation for maximum comfort during massage",
            tips: ["Drink water earlier", "Use restroom", "Relax and breathe"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "rest-quietly",
            text: "Rest quietly for 15-30 minutes after the massage",
            completed: false,
            hasAlert: true,
            alertTime: "Immediately after",
            details: "Allow the oils to absorb and the body to integrate the treatment",
            tips: ["Lie down comfortably", "Cover with light sheet", "Avoid sudden movements"]
          },
          {
            id: "warm-bath",
            text: "Take a warm bath or shower after the rest period",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes after",
            details: "Use warm water to remove excess oil while keeping some for skin nourishment",
            tips: ["Use warm water", "Gentle soap", "Pat dry gently"]
          },
          {
            id: "light-meals",
            text: "Eat light, warm meals and stay hydrated",
            completed: false,
            hasAlert: true,
            alertTime: "1-2 hours after",
            details: "Focus on warm, easily digestible foods and plenty of fluids",
            tips: ["Warm soups", "Herbal teas", "Avoid cold drinks"]
          },
          {
            id: "avoid-cold",
            text: "Avoid cold exposure and strenuous activities for 24 hours",
            completed: false,
            hasAlert: true,
            alertTime: "24 hours after",
            details: "Keep warm and avoid activities that might stress the body",
            tips: ["Wear warm clothes", "Stay indoors", "Gentle activities only"]
          }
        ]
      }
    ],
    overallProgress: 0
  },

  "vata-swedana": {
    id: "vata-swedana-module",
    name: "Swedana (Herbal Steam Therapy)",
    clinic: "Wellness Retreat Center",
    scheduledDate: "2024-01-20",
    scheduledTime: "16:00",
    dominantDosha: "vata",
    therapyId: "vata-swedana",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "abhyanga-massage",
            text: "Abhyanga massage with warm medicated oil to body and scalp",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes before",
            details: "Full body oil massage to prepare skin and open pores for steam therapy",
            tips: ["Use warm oil", "Massage gently", "Focus on joints"]
          },
          {
            id: "ensure-clearance",
            text: "Ensure patient has passed urine/stools, and removed all clothing except underwear",
            completed: false,
            hasAlert: true,
            alertTime: "15 minutes before",
            details: "Complete evacuation and minimal clothing for effective steam penetration",
            tips: ["Use restroom", "Wear cotton underwear", "Remove jewelry"]
          },
          {
            id: "check-vital-signs",
            text: "Check blood pressure and vital signs before steam therapy",
            completed: false,
            details: "Ensure patient is stable and suitable for steam therapy",
            tips: ["Relax and breathe", "Report any discomfort", "Stay calm"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "dry-body",
            text: "Dry body gently with a towel post steam; rest quietly for 30–60 minutes",
            completed: false,
            hasAlert: true,
            alertTime: "Immediately after",
            details: "Gentle drying and rest to allow body to cool down naturally",
            tips: ["Use soft towel", "Pat dry gently", "Lie down comfortably"]
          },
          {
            id: "avoid-cold",
            text: "Avoid direct exposure to air/cold immediately after; hot water bath recommended after 1 hour",
            completed: false,
            hasAlert: true,
            alertTime: "1 hour after",
            details: "Keep warm and take a warm bath to complete the cleansing process",
            tips: ["Stay indoors", "Wear warm clothes", "Use warm water"]
          },
          {
            id: "light-meals",
            text: "Advise light meals and hydration",
            completed: false,
            hasAlert: true,
            alertTime: "2-3 hours after",
            details: "Focus on warm, liquid foods and plenty of fluids to rehydrate",
            tips: ["Warm soups", "Herbal teas", "Avoid cold foods"]
          },
          {
            id: "monitor-hydration",
            text: "Monitor hydration levels and rest adequately",
            completed: false,
            details: "Watch for signs of dehydration and ensure adequate rest",
            tips: ["Drink water regularly", "Rest when tired", "Report any issues"]
          }
        ]
      }
    ],
    overallProgress: 0
  },

  "vata-nasya": {
    id: "vata-nasya-module",
    name: "Nasya (Nasal Therapy)",
    clinic: "Traditional Ayurveda Clinic",
    scheduledDate: "2024-01-22",
    scheduledTime: "11:00",
    dominantDosha: "vata",
    therapyId: "vata-nasya",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "clear-bowel-bladder",
            text: "Ensure patient has cleared bowel/bladder; previous meal fully digested",
            completed: false,
            hasAlert: true,
            alertTime: "2 hours before",
            details: "Complete evacuation and ensure stomach is empty for effective nasal therapy",
            tips: ["Eat light meal earlier", "Use restroom", "Avoid heavy foods"]
          },
          {
            id: "massage-steam",
            text: "Mild massage and steam over scalp, face, and neck for 10–15 minutes",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes before",
            details: "Gentle massage and steam to prepare nasal passages and sinuses",
            tips: ["Use warm oil", "Steam gently", "Relax facial muscles"]
          },
          {
            id: "room-setup",
            text: "Room setup: ventilated, clean, suitable Nasya table",
            completed: false,
            details: "Ensure proper environment for safe and effective nasal therapy",
            tips: ["Good ventilation", "Clean surfaces", "Comfortable position"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "mild-massage",
            text: "Mild massage to feet, arms, and shoulders",
            completed: false,
            hasAlert: true,
            alertTime: "Immediately after",
            details: "Gentle massage to help distribute the nasal medication throughout the body",
            tips: ["Use light pressure", "Focus on extremities", "Relax and breathe"]
          },
          {
            id: "spit-excess",
            text: "Spit out excess medicine, avoid swallowing",
            completed: false,
            hasAlert: true,
            alertTime: "5 minutes after",
            details: "Remove any excess medication from mouth to prevent side effects",
            tips: ["Spit gently", "Rinse mouth", "Don't swallow"]
          },
          {
            id: "gargle-water",
            text: "Advise gargling with lukewarm water, and inhalation of medicated smoke if required",
            completed: false,
            hasAlert: true,
            alertTime: "10 minutes after",
            details: "Clean mouth and throat, and use medicated smoke for additional benefits",
            tips: ["Use warm water", "Gargle gently", "Follow therapist's guidance"]
          },
          {
            id: "rest-quietly",
            text: "Rest quietly; avoid exposure to dust, cold, wind, sunlight, excessive talking, or laughing",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes after",
            details: "Minimize external stimuli to allow the nasal therapy to work effectively",
            tips: ["Stay indoors", "Avoid loud noises", "Rest comfortably"]
          }
        ]
      }
    ],
    overallProgress: 0
  },

  "pitta-virechana": {
    id: "pitta-virechana-module",
    name: "Virechana (Therapeutic Purgation)",
    clinic: "Ayurveda Wellness Center",
    scheduledDate: "2024-01-25",
    scheduledTime: "08:00",
    dominantDosha: "pitta",
    therapyId: "pitta-virechana",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "internal-oleation",
            text: "Internal oleation (snehana) with medicated ghee for 3-7 days",
            completed: false,
            hasAlert: true,
            alertTime: "7 days before",
            details: "Take medicated ghee to prepare the digestive system for purgation",
            tips: ["Start with small amounts", "Increase gradually", "Monitor digestion"]
          },
          {
            id: "external-oleation",
            text: "External oleation (abhyanga) and sudation (swedana) for 3-5 days",
            completed: false,
            hasAlert: true,
            alertTime: "5 days before",
            details: "Daily oil massage and steam to mobilize toxins",
            tips: ["Use warm oil", "Massage daily", "Follow with steam"]
          },
          {
            id: "pitta-foods",
            text: "Pitta-stimulating foods like sour, salty, and hot foods to mobilize Pitta",
            completed: false,
            hasAlert: true,
            alertTime: "3 days before",
            details: "Include foods that naturally stimulate Pitta dosha",
            tips: ["Add spices", "Include sour foods", "Moderate amounts"]
          },
          {
            id: "fasting",
            text: "Fasting or very light meals, complete bowel clearance before therapy",
            completed: false,
            hasAlert: true,
            alertTime: "Morning of treatment",
            details: "Empty stomach and bowels completely before purgation",
            tips: ["Drink warm water", "Use natural laxatives", "Arrive fasting"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "rest-hydration",
            text: "Rest, hydration, and protection from heat, sun, and strenuous activity",
            completed: false,
            hasAlert: true,
            alertTime: "24 hours after",
            details: "Complete rest and avoid heat exposure to allow body to recover",
            tips: ["Stay indoors", "Keep cool", "Rest adequately"]
          },
          {
            id: "light-diet",
            text: "Light, liquid diet (gruels, rice soup) gradually reintroducing normal foods",
            completed: false,
            hasAlert: true,
            alertTime: "2-3 hours after",
            details: "Start with warm liquids and gradually progress to solid foods",
            tips: ["Start with water", "Progress to gruels", "Avoid heavy foods"]
          },
          {
            id: "avoid-foods",
            text: "Avoid spicy, hot, sour, or heavy foods for several days",
            completed: false,
            hasAlert: true,
            alertTime: "3-5 days after",
            details: "Stick to cooling, easily digestible foods to support recovery",
            tips: ["Avoid spices", "Eat cooling foods", "Small portions"]
          },
          {
            id: "monitor-effects",
            text: "Monitor for dehydration, weakness, or excessive purgation",
            completed: false,
            details: "Watch for signs of over-purification and adjust accordingly",
            tips: ["Stay hydrated", "Monitor energy levels", "Report concerns"]
          }
        ]
      }
    ],
    overallProgress: 0
  },

  "pitta-raktamokshana": {
    id: "pitta-raktamokshana-module",
    name: "Rakta Mokshana (Bloodletting)",
    clinic: "Traditional Ayurveda Clinic",
    scheduledDate: "2024-01-28",
    scheduledTime: "10:00",
    dominantDosha: "pitta",
    therapyId: "pitta-raktamokshana",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "health-assessment",
            text: "Complete health assessment including blood tests and vital signs",
            completed: false,
            hasAlert: true,
            alertTime: "1 week before",
            details: "Comprehensive health check to ensure suitability for bloodletting",
            tips: ["Complete all tests", "Discuss medications", "Report any concerns"]
          },
          {
            id: "avoid-blood-thinners",
            text: "Avoid blood-thinning medications and supplements for 1 week",
            completed: false,
            hasAlert: true,
            alertTime: "1 week before",
            details: "Stop medications that might affect blood clotting",
            tips: ["Consult doctor", "Stop supplements", "Monitor closely"]
          },
          {
            id: "light-diet",
            text: "Light, easily digestible diet 2-3 days before",
            completed: false,
            hasAlert: true,
            alertTime: "3 days before",
            details: "Prepare body with light foods to ensure good circulation",
            tips: ["Avoid heavy foods", "Stay hydrated", "Eat regularly"]
          },
          {
            id: "fasting",
            text: "Light fasting or very light meal before the procedure",
            completed: false,
            hasAlert: true,
            alertTime: "Morning of treatment",
            details: "Minimal food intake to ensure stable blood pressure",
            tips: ["Eat light breakfast", "Stay hydrated", "Arrive rested"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "pressure-bandage",
            text: "Apply pressure bandage and monitor bleeding for 30 minutes",
            completed: false,
            hasAlert: true,
            alertTime: "Immediately after",
            details: "Ensure proper hemostasis and monitor for any complications",
            tips: ["Keep bandage clean", "Monitor closely", "Report any bleeding"]
          },
          {
            id: "rest-hydration",
            text: "Rest for 2-4 hours and maintain good hydration",
            completed: false,
            hasAlert: true,
            alertTime: "2-4 hours after",
            details: "Allow body to recover and maintain fluid balance",
            tips: ["Lie down comfortably", "Drink fluids", "Avoid movement"]
          },
          {
            id: "iron-rich-foods",
            text: "Consume iron-rich foods and supplements as advised",
            completed: false,
            hasAlert: true,
            alertTime: "24 hours after",
            details: "Support blood regeneration with appropriate nutrition",
            tips: ["Include leafy greens", "Take supplements", "Eat regularly"]
          },
          {
            id: "avoid-strenuous-activity",
            text: "Avoid strenuous activities and heavy lifting for 48-72 hours",
            completed: false,
            hasAlert: true,
            alertTime: "48-72 hours after",
            details: "Allow body to fully recover before resuming normal activities",
            tips: ["Rest adequately", "Avoid heavy work", "Gradual return to activity"]
          }
        ]
      }
    ],
    overallProgress: 0
  },

  "pitta-shirodhara": {
    id: "pitta-shirodhara-module",
    name: "Shirodhara (Oil Pouring on Forehead)",
    clinic: "Ayurveda Wellness Center",
    scheduledDate: "2024-01-26",
    scheduledTime: "15:00",
    dominantDosha: "pitta",
    therapyId: "pitta-shirodhara",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "health-assessment",
            text: "Health assessment and documentation of constitution/disease state",
            completed: false,
            details: "Complete health questionnaire and discuss any current health issues",
            tips: ["Be honest about symptoms", "Mention any allergies", "Discuss medications"]
          },
          {
            id: "prepare-hair",
            text: "Clean hair and scalp, remove any oils or products",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes before",
            details: "Wash hair with mild shampoo and ensure scalp is clean",
            tips: ["Use mild shampoo", "Rinse thoroughly", "Pat dry gently"]
          },
          {
            id: "empty-bladder",
            text: "Empty bladder and bowels before the session",
            completed: false,
            hasAlert: true,
            alertTime: "15 minutes before",
            details: "Ensure complete evacuation for maximum comfort during treatment",
            tips: ["Drink water earlier", "Use restroom", "Relax and breathe"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "rest-quietly",
            text: "Rest quietly for 30-60 minutes after the treatment",
            completed: false,
            hasAlert: true,
            alertTime: "Immediately after",
            details: "Allow the oils to absorb and the body to integrate the treatment",
            tips: ["Lie down comfortably", "Keep warm", "Avoid sudden movements"]
          },
          {
            id: "avoid-hair-wash",
            text: "Avoid washing hair for 2-4 hours after treatment",
            completed: false,
            hasAlert: true,
            alertTime: "2-4 hours after",
            details: "Allow the medicated oils to fully absorb into the scalp",
            tips: ["Keep hair dry", "Avoid styling", "Use gentle hair tie if needed"]
          },
          {
            id: "light-meals",
            text: "Eat light, cooling meals and stay hydrated",
            completed: false,
            hasAlert: true,
            alertTime: "1-2 hours after",
            details: "Focus on cooling, easily digestible foods and plenty of fluids",
            tips: ["Cooling foods", "Herbal teas", "Avoid hot spices"]
          },
          {
            id: "avoid-stress",
            text: "Avoid stress, loud noises, and excessive mental activity for 24 hours",
            completed: false,
            hasAlert: true,
            alertTime: "24 hours after",
            details: "Maintain a calm environment to allow the treatment to work effectively",
            tips: ["Practice meditation", "Avoid arguments", "Listen to calming music"]
          }
        ]
      }
    ],
    overallProgress: 0
  },

  "pitta-abhyanga": {
    id: "pitta-abhyanga-module",
    name: "Abhyanga (Cooling Oil Massage)",
    clinic: "Holistic Health Spa",
    scheduledDate: "2024-01-27",
    scheduledTime: "16:00",
    dominantDosha: "pitta",
    therapyId: "pitta-abhyanga",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "health-assessment",
            text: "Health assessment and documentation of constitution/disease state",
            completed: false,
            details: "Complete health questionnaire and discuss any current health issues",
            tips: ["Be honest about symptoms", "Mention any allergies", "Discuss medications"]
          },
          {
            id: "prepare-skin",
            text: "Clean skin and remove any lotions or oils before treatment",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes before",
            details: "Take a warm shower and avoid applying any products to skin",
            tips: ["Use mild soap", "Pat skin dry", "Wear loose clothing"]
          },
          {
            id: "empty-bladder",
            text: "Empty bladder and bowels before the session",
            completed: false,
            hasAlert: true,
            alertTime: "15 minutes before",
            details: "Ensure complete evacuation for maximum comfort during massage",
            tips: ["Drink water earlier", "Use restroom", "Relax and breathe"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "rest-quietly",
            text: "Rest quietly for 15-30 minutes after the massage",
            completed: false,
            hasAlert: true,
            alertTime: "Immediately after",
            details: "Allow the cooling oils to absorb and the body to integrate the treatment",
            tips: ["Lie down comfortably", "Cover with light sheet", "Avoid sudden movements"]
          },
          {
            id: "cool-bath",
            text: "Take a cool bath or shower after the rest period",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes after",
            details: "Use cool water to remove excess oil while keeping some for skin nourishment",
            tips: ["Use cool water", "Gentle soap", "Pat dry gently"]
          },
          {
            id: "cooling-meals",
            text: "Eat cooling, light meals and stay hydrated",
            completed: false,
            hasAlert: true,
            alertTime: "1-2 hours after",
            details: "Focus on cooling, easily digestible foods and plenty of fluids",
            tips: ["Cooling foods", "Herbal teas", "Avoid hot spices"]
          },
          {
            id: "avoid-heat",
            text: "Avoid heat exposure and spicy foods for 24 hours",
            completed: false,
            hasAlert: true,
            alertTime: "24 hours after",
            details: "Keep cool and avoid activities that might increase body heat",
            tips: ["Stay in cool places", "Wear light clothes", "Avoid hot foods"]
          }
        ]
      }
    ],
    overallProgress: 0
  },

  "kapha-nasya": {
    id: "kapha-nasya-module",
    name: "Nasya (Nasal Medication)",
    clinic: "Traditional Ayurveda Clinic",
    scheduledDate: "2024-01-29",
    scheduledTime: "12:00",
    dominantDosha: "kapha",
    therapyId: "kapha-nasya",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "clear-bowel-bladder",
            text: "Ensure patient has cleared bowel/bladder; previous meal fully digested",
            completed: false,
            hasAlert: true,
            alertTime: "2 hours before",
            details: "Complete evacuation and ensure stomach is empty for effective nasal therapy",
            tips: ["Eat light meal earlier", "Use restroom", "Avoid heavy foods"]
          },
          {
            id: "massage-steam",
            text: "Mild massage and steam over scalp, face, and neck for 10–15 minutes",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes before",
            details: "Gentle massage and steam to prepare nasal passages and sinuses",
            tips: ["Use warm oil", "Steam gently", "Relax facial muscles"]
          },
          {
            id: "room-setup",
            text: "Room setup: ventilated, clean, suitable Nasya table",
            completed: false,
            details: "Ensure proper environment for safe and effective nasal therapy",
            tips: ["Good ventilation", "Clean surfaces", "Comfortable position"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "mild-massage",
            text: "Mild massage to feet, arms, and shoulders",
            completed: false,
            hasAlert: true,
            alertTime: "Immediately after",
            details: "Gentle massage to help distribute the nasal medication throughout the body",
            tips: ["Use light pressure", "Focus on extremities", "Relax and breathe"]
          },
          {
            id: "spit-excess",
            text: "Spit out excess medicine, avoid swallowing",
            completed: false,
            hasAlert: true,
            alertTime: "5 minutes after",
            details: "Remove any excess medication from mouth to prevent side effects",
            tips: ["Spit gently", "Rinse mouth", "Don't swallow"]
          },
          {
            id: "gargle-water",
            text: "Advise gargling with lukewarm water, and inhalation of medicated smoke if required",
            completed: false,
            hasAlert: true,
            alertTime: "10 minutes after",
            details: "Clean mouth and throat, and use medicated smoke for additional benefits",
            tips: ["Use warm water", "Gargle gently", "Follow therapist's guidance"]
          },
          {
            id: "rest-quietly",
            text: "Rest quietly; avoid exposure to dust, cold, wind, sunlight, excessive talking, or laughing",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes after",
            details: "Minimize external stimuli to allow the nasal therapy to work effectively",
            tips: ["Stay indoors", "Avoid loud noises", "Rest comfortably"]
          }
        ]
      }
    ],
    overallProgress: 0
  },

  "kapha-swedana": {
    id: "kapha-swedana-module",
    name: "Swedana (Sweating Therapy)",
    clinic: "Wellness Retreat Center",
    scheduledDate: "2024-01-31",
    scheduledTime: "17:00",
    dominantDosha: "kapha",
    therapyId: "kapha-swedana",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "abhyanga-massage",
            text: "Abhyanga massage with warm medicated oil to body and scalp",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes before",
            details: "Full body oil massage to prepare skin and open pores for steam therapy",
            tips: ["Use warm oil", "Massage gently", "Focus on joints"]
          },
          {
            id: "ensure-clearance",
            text: "Ensure patient has passed urine/stools, and removed all clothing except underwear",
            completed: false,
            hasAlert: true,
            alertTime: "15 minutes before",
            details: "Complete evacuation and minimal clothing for effective steam penetration",
            tips: ["Use restroom", "Wear cotton underwear", "Remove jewelry"]
          },
          {
            id: "check-vital-signs",
            text: "Check blood pressure and vital signs before steam therapy",
            completed: false,
            details: "Ensure patient is stable and suitable for steam therapy",
            tips: ["Relax and breathe", "Report any discomfort", "Stay calm"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "dry-body",
            text: "Dry body gently with a towel post steam; rest quietly for 30–60 minutes",
            completed: false,
            hasAlert: true,
            alertTime: "Immediately after",
            details: "Gentle drying and rest to allow body to cool down naturally",
            tips: ["Use soft towel", "Pat dry gently", "Lie down comfortably"]
          },
          {
            id: "avoid-cold",
            text: "Avoid direct exposure to air/cold immediately after; hot water bath recommended after 1 hour",
            completed: false,
            hasAlert: true,
            alertTime: "1 hour after",
            details: "Keep warm and take a warm bath to complete the cleansing process",
            tips: ["Stay indoors", "Wear warm clothes", "Use warm water"]
          },
          {
            id: "light-meals",
            text: "Advise light meals and hydration",
            completed: false,
            hasAlert: true,
            alertTime: "2-3 hours after",
            details: "Focus on warm, liquid foods and plenty of fluids to rehydrate",
            tips: ["Warm soups", "Herbal teas", "Avoid cold foods"]
          },
          {
            id: "monitor-hydration",
            text: "Monitor hydration levels and rest adequately",
            completed: false,
            details: "Watch for signs of dehydration and ensure adequate rest",
            tips: ["Drink water regularly", "Rest when tired", "Report any issues"]
          }
        ]
      }
    ],
    overallProgress: 0
  },

  "kapha-vamana": {
    id: "kapha-vamana-module",
    name: "Vamana (Therapeutic Emesis)",
    clinic: "Ayurveda Wellness Center",
    scheduledDate: "2024-01-30",
    scheduledTime: "09:00",
    dominantDosha: "kapha",
    therapyId: "kapha-vamana",
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
            details: "Take medicated ghee to prepare the digestive system for emesis",
            tips: ["Start with small amounts", "Increase gradually", "Monitor digestion"]
          },
          {
            id: "external-oleation",
            text: "External oleation (abhyanga) and sudation (swedana) on the day before and morning of Vamana",
            completed: false,
            hasAlert: true,
            alertTime: "1 day before",
            details: "Full body oil massage and steam to mobilize Kapha toxins",
            tips: ["Use warm oil", "Massage thoroughly", "Follow with steam"]
          },
          {
            id: "kapha-foods",
            text: "Kapha-stimulating foods like curd, sweets, rice, or dairy the night before treatment",
            completed: false,
            hasAlert: true,
            alertTime: "Night before",
            details: "Include foods that naturally stimulate Kapha dosha for effective emesis",
            tips: ["Include dairy", "Add sweets", "Eat moderately"]
          },
          {
            id: "fasting",
            text: "Fasting or light meals, bowel and bladder clearance before therapy",
            completed: false,
            hasAlert: true,
            alertTime: "Morning of treatment",
            details: "Empty stomach and bowels completely before emesis therapy",
            tips: ["Drink warm water", "Use natural laxatives", "Arrive fasting"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "rest-quietly",
            text: "Rest quietly for 1-2 hours after emesis",
            completed: false,
            hasAlert: true,
            alertTime: "Immediately after",
            details: "Allow body to recover from the emesis process",
            tips: ["Lie down comfortably", "Keep warm", "Avoid movement"]
          },
          {
            id: "light-diet",
            text: "Light, liquid diet (gruels, rice soup) gradually reintroducing normal foods",
            completed: false,
            hasAlert: true,
            alertTime: "2-3 hours after",
            details: "Start with warm liquids and gradually progress to solid foods",
            tips: ["Start with water", "Progress to gruels", "Avoid heavy foods"]
          },
          {
            id: "avoid-cold",
            text: "Avoid cold exposure, wind, and strenuous activity for 24-48 hours",
            completed: false,
            hasAlert: true,
            alertTime: "24-48 hours after",
            details: "Keep warm and avoid activities that might stress the body",
            tips: ["Stay indoors", "Wear warm clothes", "Rest adequately"]
          },
          {
            id: "monitor-hydration",
            text: "Monitor hydration levels and electrolyte balance",
            completed: false,
            details: "Ensure adequate fluid intake and electrolyte replacement",
            tips: ["Drink fluids regularly", "Include electrolytes", "Monitor urine output"]
          }
        ]
      }
    ],
    overallProgress: 0
  },

  "kapha-udvartana": {
    id: "kapha-udvartana-module",
    name: "Udvartana (Herbal Powder Massage)",
    clinic: "Holistic Health Spa",
    scheduledDate: "2024-02-02",
    scheduledTime: "14:00",
    dominantDosha: "kapha",
    therapyId: "kapha-udvartana",
    sections: [
      {
        id: "pre-procedure",
        title: "Pre-Procedure (Purva Karma)",
        instructions: [
          {
            id: "health-assessment",
            text: "Health assessment and documentation of constitution/disease state",
            completed: false,
            details: "Complete health questionnaire and discuss skin conditions",
            tips: ["Be honest about skin issues", "Mention allergies", "Discuss medications"]
          },
          {
            id: "warm-oil-massage",
            text: "Warm oil massage (Abhyanga) for 15-20 minutes to prepare the skin and body",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes before",
            details: "Preliminary oil massage to prepare skin for herbal powder treatment",
            tips: ["Use warm oil", "Massage gently", "Focus on problem areas"]
          },
          {
            id: "light-clothing",
            text: "Client wears light clothing to expose skin",
            completed: false,
            hasAlert: true,
            alertTime: "15 minutes before",
            details: "Minimal clothing to allow effective application of herbal powders",
            tips: ["Wear loose clothes", "Remove jewelry", "Prepare mentally"]
          }
        ]
      },
      {
        id: "post-procedure",
        title: "Post-Procedure (Paschat Karma)",
        instructions: [
          {
            id: "warm-bath",
            text: "Warm bath after massage to wash off herbal powder and relax the body",
            completed: false,
            hasAlert: true,
            alertTime: "30 minutes after",
            details: "Thorough cleansing to remove all herbal powder residue",
            tips: ["Use warm water", "Gentle soap", "Rinse thoroughly"]
          },
          {
            id: "rest-advice",
            text: "Advise rest, light diet, and avoid exposure to cold immediately post session",
            completed: false,
            hasAlert: true,
            alertTime: "1 hour after",
            details: "Allow body to integrate the treatment and maintain warmth",
            tips: ["Stay warm", "Rest comfortably", "Eat light meals"]
          },
          {
            id: "monitor-skin",
            text: "Monitor for skin irritation or excessive dryness",
            completed: false,
            details: "Watch for any adverse skin reactions and treat accordingly",
            tips: ["Check skin regularly", "Use moisturizer if needed", "Report any issues"]
          },
          {
            id: "follow-up-care",
            text: "Follow-up care instructions for optimal results",
            completed: false,
            details: "Specific instructions for maintaining the benefits of the treatment",
            tips: ["Follow dietary advice", "Maintain skin care", "Schedule follow-up"]
          }
        ]
      }
    ],
    overallProgress: 0
  }
};

// Function to get module by therapy ID
export function getTherapyModule(therapyId: string): TherapyModule | null {
  return enhancedTherapyModules[therapyId] || null;
}

// Function to create a new module instance for a booking
export function createTherapyModuleForBooking(
  therapyId: string, 
  clinicName: string, 
  scheduledDate: string, 
  scheduledTime: string,
  bookingId?: string
): TherapyModule | null {
  const baseModule = getTherapyModule(therapyId);
  if (!baseModule) return null;

  return {
    ...baseModule,
    id: `${therapyId}-${Date.now()}`,
    clinic: clinicName,
    scheduledDate,
    scheduledTime,
    bookingId,
    overallProgress: 0,
    sections: baseModule.sections.map(section => ({
      ...section,
      instructions: section.instructions.map(instruction => ({
        ...instruction,
        completed: false
      }))
    }))
  };
}
