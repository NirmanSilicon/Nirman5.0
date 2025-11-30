// Gamified test questions for Ayurveda health assessment
export const gamifiedTestQuestions = [
  // Personal Information
  {
    id: 1,
    category: 'personal',
    type: 'date',
    title: 'When were you born?',
    subtitle: 'Help us understand your life stage and constitution',
    field: 'date_of_birth',
    icon: '🎂',
    required: true
  },
  {
    id: 2,
    category: 'personal',
    type: 'choice',
    title: 'What\'s your biological gender?',
    subtitle: 'This helps us provide personalized recommendations',
    field: 'gender',
    icon: '👤',
    options: [
      { value: 'male', label: 'Male', emoji: '👨' },
      { value: 'female', label: 'Female', emoji: '👩' },
      { value: 'other', label: 'Other', emoji: '🧑' },
      { value: 'prefer_not_to_say', label: 'Prefer not to say', emoji: '🤐' }
    ],
    required: true
  },
  
  // Physical Characteristics
  {
    id: 3,
    category: 'physical',
    type: 'number',
    title: 'What\'s your height?',
    subtitle: 'In centimeters (e.g., 175 cm)',
    field: 'height_cm',
    icon: '📏',
    min: 100,
    max: 250,
    required: true
  },
  {
    id: 4,
    category: 'physical',
    type: 'number',
    title: 'What\'s your current weight?',
    subtitle: 'In kilograms (e.g., 70 kg)',
    field: 'weight_kg',
    icon: '⚖️',
    min: 30,
    max: 200,
    required: true
  },
  
  // Lifestyle & Activity
  {
    id: 5,
    category: 'lifestyle',
    type: 'choice',
    title: 'How active are you?',
    subtitle: 'Choose the option that best describes your daily activity level',
    field: 'activity_level',
    icon: '🏃‍♂️',
    options: [
      { value: 'sedentary', label: 'Sedentary', emoji: '🛋️', description: 'Mostly sitting, little exercise' },
      { value: 'lightly_active', label: 'Lightly Active', emoji: '🚶‍♂️', description: 'Light exercise 1-3 days/week' },
      { value: 'moderately_active', label: 'Moderately Active', emoji: '🚴‍♂️', description: 'Moderate exercise 3-5 days/week' },
      { value: 'very_active', label: 'Very Active', emoji: '🏃‍♂️', description: 'Hard exercise 6-7 days/week' },
      { value: 'extremely_active', label: 'Extremely Active', emoji: '🏋️‍♂️', description: 'Very hard exercise, training 2x/day' }
    ],
    required: true
  },
  
  // Health Goals
  {
    id: 6,
    category: 'goals',
    type: 'multiple_choice',
    title: 'What are your health goals?',
    subtitle: 'Select all that apply to you',
    field: 'health_goals',
    icon: '🎯',
    options: [
      { value: 'weight_loss', label: 'Weight Loss', emoji: '📉' },
      { value: 'weight_gain', label: 'Weight Gain', emoji: '📈' },
      { value: 'muscle_building', label: 'Muscle Building', emoji: '💪' },
      { value: 'stress_relief', label: 'Stress Relief', emoji: '😌' },
      { value: 'better_sleep', label: 'Better Sleep', emoji: '😴' },
      { value: 'digestive_health', label: 'Digestive Health', emoji: '🌿' },
      { value: 'immunity_boost', label: 'Immunity Boost', emoji: '🛡️' },
      { value: 'skin_health', label: 'Skin Health', emoji: '✨' },
      { value: 'mental_clarity', label: 'Mental Clarity', emoji: '🧠' },
      { value: 'energy_increase', label: 'Energy Increase', emoji: '⚡' }
    ],
    required: true
  },
  
  // Current Health Conditions
  {
    id: 7,
    category: 'health',
    type: 'multiple_choice',
    title: 'Do you have any current health conditions?',
    subtitle: 'Select all that apply (this helps us provide safe recommendations)',
    field: 'medical_conditions',
    icon: '🏥',
    options: [
      { value: 'none', label: 'None', emoji: '✅' },
      { value: 'diabetes', label: 'Diabetes', emoji: '🩸' },
      { value: 'hypertension', label: 'High Blood Pressure', emoji: '💗' },
      { value: 'heart_disease', label: 'Heart Disease', emoji: '❤️' },
      { value: 'thyroid', label: 'Thyroid Issues', emoji: '🦋' },
      { value: 'arthritis', label: 'Arthritis', emoji: '🦴' },
      { value: 'asthma', label: 'Asthma', emoji: '🫁' },
      { value: 'anxiety', label: 'Anxiety', emoji: '😰' },
      { value: 'depression', label: 'Depression', emoji: '😔' },
      { value: 'digestive_issues', label: 'Digestive Issues', emoji: '🤢' },
      { value: 'other', label: 'Other', emoji: '📝' }
    ],
    required: false
  },
  
  // Sleep Pattern
  {
    id: 8,
    category: 'lifestyle',
    type: 'choice',
    title: 'How would you describe your sleep?',
    subtitle: 'Choose the option that best matches your sleep pattern',
    field: 'sleep_pattern',
    icon: '😴',
    options: [
      { value: 'excellent', label: 'Excellent', emoji: '😴', description: '7-9 hours, wake up refreshed' },
      { value: 'good', label: 'Good', emoji: '😊', description: 'Generally good quality, occasional issues' },
      { value: 'fair', label: 'Fair', emoji: '😐', description: 'Sometimes good, sometimes poor' },
      { value: 'poor', label: 'Poor', emoji: '😞', description: 'Often tired, trouble falling/staying asleep' },
      { value: 'very_poor', label: 'Very Poor', emoji: '😵', description: 'Chronic sleep issues, always tired' }
    ],
    required: true
  },
  
  // Stress Level
  {
    id: 9,
    category: 'mental',
    type: 'scale',
    title: 'How stressed do you feel lately?',
    subtitle: 'Rate your stress level from 1 (very calm) to 10 (very stressed)',
    field: 'stress_level',
    icon: '😤',
    min: 1,
    max: 10,
    labels: ['Very Calm', 'Moderate', 'Very Stressed'],
    required: true
  },
  
  // Dietary Preferences
  {
    id: 10,
    category: 'diet',
    type: 'multiple_choice',
    title: 'What are your dietary preferences?',
    subtitle: 'Select all that apply to your eating habits',
    field: 'dietary_preferences',
    icon: '🍽️',
    options: [
      { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
      { value: 'vegan', label: 'Vegan', emoji: '🌱' },
      { value: 'non_vegetarian', label: 'Non-Vegetarian', emoji: '🍖' },
      { value: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
      { value: 'gluten_free', label: 'Gluten-Free', emoji: '🌾' },
      { value: 'dairy_free', label: 'Dairy-Free', emoji: '🥛' },
      { value: 'keto', label: 'Keto', emoji: '🥑' },
      { value: 'paleo', label: 'Paleo', emoji: '🥩' },
      { value: 'intermittent_fasting', label: 'Intermittent Fasting', emoji: '⏰' },
      { value: 'no_restrictions', label: 'No Restrictions', emoji: '🍴' }
    ],
    required: true
  },
  
  // Allergies
  {
    id: 11,
    category: 'health',
    type: 'multiple_choice',
    title: 'Do you have any food allergies or intolerances?',
    subtitle: 'Select all that apply (important for safe recommendations)',
    field: 'allergies',
    icon: '⚠️',
    options: [
      { value: 'none', label: 'None', emoji: '✅' },
      { value: 'nuts', label: 'Nuts', emoji: '🥜' },
      { value: 'dairy', label: 'Dairy', emoji: '🥛' },
      { value: 'gluten', label: 'Gluten', emoji: '🌾' },
      { value: 'shellfish', label: 'Shellfish', emoji: '🦐' },
      { value: 'eggs', label: 'Eggs', emoji: '🥚' },
      { value: 'soy', label: 'Soy', emoji: '🫘' },
      { value: 'fish', label: 'Fish', emoji: '🐟' },
      { value: 'sesame', label: 'Sesame', emoji: '🌰' },
      { value: 'other', label: 'Other', emoji: '📝' }
    ],
    required: false
  },
  
  // Current Medications
  {
    id: 12,
    category: 'health',
    type: 'text',
    title: 'Are you currently taking any medications?',
    subtitle: 'List any medications, supplements, or herbs you\'re taking (optional but helpful)',
    field: 'medications',
    icon: '💊',
    placeholder: 'e.g., Vitamin D, Blood pressure medication, Ashwagandha...',
    required: false
  }
];

// Categories for organizing the test flow
export const testCategories = [
  {
    id: 'personal',
    title: 'Personal Info',
    description: 'Basic information about you',
    emoji: '👤',
    color: 'bg-blue-500'
  },
  {
    id: 'physical',
    title: 'Physical Details',
    description: 'Your body measurements',
    emoji: '📏',
    color: 'bg-green-500'
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    description: 'Your daily habits and activities',
    emoji: '🌟',
    color: 'bg-purple-500'
  },
  {
    id: 'goals',
    title: 'Health Goals',
    description: 'What you want to achieve',
    emoji: '🎯',
    color: 'bg-orange-500'
  },
  {
    id: 'health',
    title: 'Health Status',
    description: 'Current conditions and medications',
    emoji: '🏥',
    color: 'bg-red-500'
  },
  {
    id: 'mental',
    title: 'Mental Wellness',
    description: 'Your stress and mental state',
    emoji: '🧠',
    color: 'bg-indigo-500'
  },
  {
    id: 'diet',
    title: 'Diet & Nutrition',
    description: 'Your eating preferences',
    emoji: '🍽️',
    color: 'bg-yellow-500'
  }
];
