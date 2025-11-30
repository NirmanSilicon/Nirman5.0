import { getLanguage, saveLanguage } from "./storage";

export type Language = "en" | "hi" | "es";

export const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "es", name: "Spanish", nativeName: "Español" },
];

type TranslationKeys = {
  common: {
    appName: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    delete: string;
    clear: string;
    save: string;
    back: string;
    next: string;
    done: string;
    retry: string;
  };
  tabs: {
    home: string;
    diagnose: string;
    chat: string;
    profile: string;
  };
  home: {
    greeting: string;
    whatToDo: string;
    diagnoseTitle: string;
    diagnoseSubtitle: string;
    lastScan: string;
    quickActions: string;
    scanHistory: string;
    commonDiseases: string;
    photoTips: string;
    askAI: string;
    confidence: string;
  };
  diagnose: {
    title: string;
    uploadPrompt: string;
    takePhoto: string;
    chooseGallery: string;
    analyzing: string;
    result: string;
    confidence: string;
    severity: string;
    treatments: string;
    prevention: string;
    scanAnother: string;
    askAI: string;
    healthyLeaf: string;
    healthyMessage: string;
    cameraPermission: string;
    openSettings: string;
  };
  chat: {
    title: string;
    placeholder: string;
    send: string;
    welcome: string;
    clearHistory: string;
    emptyChat: string;
    emptyHint: string;
  };
  profile: {
    title: string;
    editName: string;
    farmerName: string;
    language: string;
    selectLanguage: string;
    totalScans: string;
    memberSince: string;
    about: string;
    version: string;
    clearData: string;
    clearDataConfirm: string;
  };
  history: {
    title: string;
    empty: string;
    emptyHint: string;
    deleteConfirm: string;
    clearAll: string;
    clearAllConfirm: string;
    today: string;
    yesterday: string;
    daysAgo: string;
  };
  diseases: {
    healthy: { name: string; description: string };
    earlyBlight: { name: string; description: string };
    lateBlight: { name: string; description: string };
    rust: { name: string; description: string };
  };
  severity: {
    low: string;
    medium: string;
    high: string;
  };
  weather: {
    temperature: string;
    humidity: string;
    tips: string;
    noData: string;
  };
};

const translations: Record<Language, TranslationKeys> = {
  en: {
    common: {
      appName: "LeafSense AI",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      delete: "Delete",
      clear: "Clear",
      save: "Save",
      back: "Back",
      next: "Next",
      done: "Done",
      retry: "Retry",
    },
    tabs: {
      home: "Home",
      diagnose: "Diagnose",
      chat: "Chat",
      profile: "Profile",
    },
    home: {
      greeting: "Hello",
      whatToDo: "What do you want to do today?",
      diagnoseTitle: "Diagnose Leaf Disease",
      diagnoseSubtitle: "Upload a leaf photo and let LeafSense AI analyze it",
      lastScan: "Last Scan",
      quickActions: "Quick Actions",
      scanHistory: "Scan History",
      commonDiseases: "Common Diseases",
      photoTips: "How to Take Good Photos",
      askAI: "Ask LeafSense AI",
      confidence: "confidence",
    },
    diagnose: {
      title: "Diagnose",
      uploadPrompt: "Upload or capture a leaf image to diagnose diseases",
      takePhoto: "Take Photo",
      chooseGallery: "Choose from Gallery",
      analyzing: "Analyzing your leaf...",
      result: "Diagnosis Result",
      confidence: "Confidence",
      severity: "Severity",
      treatments: "Recommended Treatments",
      prevention: "Prevention Tips",
      scanAnother: "Scan Another Leaf",
      askAI: "Ask AI About This",
      healthyLeaf: "Healthy Leaf",
      healthyMessage: "Your plant looks healthy! Keep up the good work with your crop care.",
      cameraPermission: "Camera permission is required to take photos",
      openSettings: "Open Settings",
    },
    chat: {
      title: "LeafSense AI",
      placeholder: "Ask about crop diseases...",
      send: "Send",
      welcome: "Hello! I'm LeafSense AI, your crop disease assistant. Ask me anything about leaf diseases, treatments, or prevention tips.",
      clearHistory: "Clear chat history",
      emptyChat: "Start a Conversation",
      emptyHint: "Ask me about leaf diseases, symptoms, treatments, or prevention tips",
    },
    profile: {
      title: "Profile",
      editName: "Edit Name",
      farmerName: "Farmer Name",
      language: "Language",
      selectLanguage: "Select Language",
      totalScans: "Total Scans",
      memberSince: "Using LeafSense since",
      about: "About",
      version: "Version",
      clearData: "Clear All Data",
      clearDataConfirm: "This will delete all your scan history, chat messages, and settings. Continue?",
    },
    history: {
      title: "Scan History",
      empty: "No Scan History",
      emptyHint: "Your diagnosed leaves will appear here. Start by scanning a leaf in the Diagnose tab.",
      deleteConfirm: "Delete this scan from history?",
      clearAll: "Clear All",
      clearAllConfirm: "Clear all scan history? This cannot be undone.",
      today: "Today",
      yesterday: "Yesterday",
      daysAgo: "days ago",
    },
    diseases: {
      healthy: {
        name: "Healthy",
        description: "Your plant leaves are in good condition with no visible signs of disease.",
      },
      earlyBlight: {
        name: "Early Blight",
        description: "A fungal disease causing dark spots with concentric rings on leaves.",
      },
      lateBlight: {
        name: "Late Blight",
        description: "A serious fungal infection that can destroy entire crops rapidly.",
      },
      rust: {
        name: "Rust",
        description: "A fungal infection characterized by orange or brown pustules on leaves.",
      },
    },
    severity: {
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    weather: {
      temperature: "Temperature",
      humidity: "Humidity",
      tips: "Weather-based Tips",
      noData: "Weather data unavailable",
    },
  },
  hi: {
    common: {
      appName: "लीफसेंस AI",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
      cancel: "रद्द करें",
      confirm: "पुष्टि करें",
      delete: "हटाएं",
      clear: "साफ करें",
      save: "सेव करें",
      back: "वापस",
      next: "अगला",
      done: "हो गया",
      retry: "पुनः प्रयास करें",
    },
    tabs: {
      home: "होम",
      diagnose: "जांच",
      chat: "चैट",
      profile: "प्रोफाइल",
    },
    home: {
      greeting: "नमस्ते",
      whatToDo: "आज आप क्या करना चाहते हैं?",
      diagnoseTitle: "पत्ती रोग की जांच",
      diagnoseSubtitle: "पत्ती की तस्वीर अपलोड करें और लीफसेंस AI से जांच कराएं",
      lastScan: "अंतिम स्कैन",
      quickActions: "त्वरित क्रियाएं",
      scanHistory: "स्कैन इतिहास",
      commonDiseases: "आम रोग",
      photoTips: "अच्छी तस्वीरें कैसे लें",
      askAI: "AI से पूछें",
      confidence: "विश्वास",
    },
    diagnose: {
      title: "जांच",
      uploadPrompt: "रोग की जांच के लिए पत्ती की तस्वीर अपलोड करें",
      takePhoto: "फोटो लें",
      chooseGallery: "गैलरी से चुनें",
      analyzing: "आपकी पत्ती का विश्लेषण हो रहा है...",
      result: "जांच परिणाम",
      confidence: "विश्वास स्तर",
      severity: "गंभीरता",
      treatments: "सुझाए गए उपचार",
      prevention: "रोकथाम के तरीके",
      scanAnother: "दूसरी पत्ती स्कैन करें",
      askAI: "इसके बारे में AI से पूछें",
      healthyLeaf: "स्वस्थ पत्ती",
      healthyMessage: "आपकी फसल स्वस्थ है! अच्छी देखभाल जारी रखें।",
      cameraPermission: "फोटो लेने के लिए कैमरा अनुमति आवश्यक है",
      openSettings: "सेटिंग्स खोलें",
    },
    chat: {
      title: "लीफसेंस AI",
      placeholder: "फसल रोगों के बारे में पूछें...",
      send: "भेजें",
      welcome: "नमस्ते! मैं लीफसेंस AI हूं, आपका फसल रोग सहायक। पत्ती के रोगों, उपचार या रोकथाम के बारे में कुछ भी पूछें।",
      clearHistory: "चैट इतिहास साफ करें",
      emptyChat: "बातचीत शुरू करें",
      emptyHint: "पत्ती रोगों, लक्षणों, उपचार या रोकथाम के बारे में पूछें",
    },
    profile: {
      title: "प्रोफाइल",
      editName: "नाम बदलें",
      farmerName: "किसान का नाम",
      language: "भाषा",
      selectLanguage: "भाषा चुनें",
      totalScans: "कुल स्कैन",
      memberSince: "लीफसेंस उपयोग की शुरुआत",
      about: "ऐप के बारे में",
      version: "संस्करण",
      clearData: "सभी डेटा हटाएं",
      clearDataConfirm: "यह आपका सारा स्कैन इतिहास, चैट और सेटिंग्स हटा देगा। जारी रखें?",
    },
    history: {
      title: "स्कैन इतिहास",
      empty: "कोई स्कैन इतिहास नहीं",
      emptyHint: "आपकी जांची गई पत्तियां यहां दिखेंगी। जांच टैब में पत्ती स्कैन करके शुरू करें।",
      deleteConfirm: "इस स्कैन को इतिहास से हटाएं?",
      clearAll: "सभी हटाएं",
      clearAllConfirm: "सारा स्कैन इतिहास हटाएं? यह वापस नहीं होगा।",
      today: "आज",
      yesterday: "कल",
      daysAgo: "दिन पहले",
    },
    diseases: {
      healthy: {
        name: "स्वस्थ",
        description: "आपकी पत्तियां अच्छी स्थिति में हैं, कोई रोग नहीं दिखता।",
      },
      earlyBlight: {
        name: "अर्ली ब्लाइट",
        description: "एक फफूंद रोग जो पत्तियों पर गोलाकार छल्लों के साथ काले धब्बे बनाता है।",
      },
      lateBlight: {
        name: "लेट ब्लाइट",
        description: "एक गंभीर फफूंद संक्रमण जो पूरी फसल को जल्दी नष्ट कर सकता है।",
      },
      rust: {
        name: "रस्ट (जंग रोग)",
        description: "एक फफूंद संक्रमण जिसमें पत्तियों पर नारंगी या भूरे दाने दिखते हैं।",
      },
    },
    severity: {
      low: "कम",
      medium: "मध्यम",
      high: "गंभीर",
    },
    weather: {
      temperature: "तापमान",
      humidity: "नमी",
      tips: "मौसम आधारित सुझाव",
      noData: "मौसम डेटा उपलब्ध नहीं",
    },
  },
  es: {
    common: {
      appName: "LeafSense AI",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      cancel: "Cancelar",
      confirm: "Confirmar",
      delete: "Eliminar",
      clear: "Limpiar",
      save: "Guardar",
      back: "Atrás",
      next: "Siguiente",
      done: "Hecho",
      retry: "Reintentar",
    },
    tabs: {
      home: "Inicio",
      diagnose: "Diagnóstico",
      chat: "Chat",
      profile: "Perfil",
    },
    home: {
      greeting: "Hola",
      whatToDo: "¿Qué quieres hacer hoy?",
      diagnoseTitle: "Diagnosticar Enfermedad",
      diagnoseSubtitle: "Sube una foto de la hoja y deja que LeafSense AI la analice",
      lastScan: "Último Escaneo",
      quickActions: "Acciones Rápidas",
      scanHistory: "Historial de Escaneos",
      commonDiseases: "Enfermedades Comunes",
      photoTips: "Cómo Tomar Buenas Fotos",
      askAI: "Preguntar a la IA",
      confidence: "confianza",
    },
    diagnose: {
      title: "Diagnóstico",
      uploadPrompt: "Sube o captura una imagen de la hoja para diagnosticar enfermedades",
      takePhoto: "Tomar Foto",
      chooseGallery: "Elegir de Galería",
      analyzing: "Analizando tu hoja...",
      result: "Resultado del Diagnóstico",
      confidence: "Confianza",
      severity: "Gravedad",
      treatments: "Tratamientos Recomendados",
      prevention: "Consejos de Prevención",
      scanAnother: "Escanear Otra Hoja",
      askAI: "Preguntar a la IA",
      healthyLeaf: "Hoja Saludable",
      healthyMessage: "¡Tu planta se ve saludable! Sigue con el buen cuidado de tus cultivos.",
      cameraPermission: "Se requiere permiso de cámara para tomar fotos",
      openSettings: "Abrir Configuración",
    },
    chat: {
      title: "LeafSense AI",
      placeholder: "Pregunta sobre enfermedades de cultivos...",
      send: "Enviar",
      welcome: "¡Hola! Soy LeafSense AI, tu asistente de enfermedades de cultivos. Pregúntame sobre enfermedades de hojas, tratamientos o consejos de prevención.",
      clearHistory: "Borrar historial de chat",
      emptyChat: "Iniciar Conversación",
      emptyHint: "Pregúntame sobre enfermedades de hojas, síntomas, tratamientos o prevención",
    },
    profile: {
      title: "Perfil",
      editName: "Editar Nombre",
      farmerName: "Nombre del Agricultor",
      language: "Idioma",
      selectLanguage: "Seleccionar Idioma",
      totalScans: "Total de Escaneos",
      memberSince: "Usando LeafSense desde",
      about: "Acerca de",
      version: "Versión",
      clearData: "Borrar Todos los Datos",
      clearDataConfirm: "Esto eliminará todo tu historial de escaneos, mensajes y configuraciones. ¿Continuar?",
    },
    history: {
      title: "Historial de Escaneos",
      empty: "Sin Historial de Escaneos",
      emptyHint: "Tus hojas diagnosticadas aparecerán aquí. Comienza escaneando una hoja en la pestaña Diagnóstico.",
      deleteConfirm: "¿Eliminar este escaneo del historial?",
      clearAll: "Borrar Todo",
      clearAllConfirm: "¿Borrar todo el historial de escaneos? Esto no se puede deshacer.",
      today: "Hoy",
      yesterday: "Ayer",
      daysAgo: "días atrás",
    },
    diseases: {
      healthy: {
        name: "Saludable",
        description: "Las hojas de tu planta están en buena condición sin signos visibles de enfermedad.",
      },
      earlyBlight: {
        name: "Tizón Temprano",
        description: "Una enfermedad fúngica que causa manchas oscuras con anillos concéntricos en las hojas.",
      },
      lateBlight: {
        name: "Tizón Tardío",
        description: "Una infección fúngica grave que puede destruir cultivos enteros rápidamente.",
      },
      rust: {
        name: "Roya",
        description: "Una infección fúngica caracterizada por pústulas naranjas o marrones en las hojas.",
      },
    },
    severity: {
      low: "Baja",
      medium: "Media",
      high: "Alta",
    },
    weather: {
      temperature: "Temperatura",
      humidity: "Humedad",
      tips: "Consejos según el clima",
      noData: "Datos meteorológicos no disponibles",
    },
  },
};

let currentLanguage: Language = "en";

export function t(path: string): string {
  const keys = path.split(".");
  let result: unknown = translations[currentLanguage];

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof result === "string" ? result : path;
}

export function getCurrentLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  saveLanguage(lang);
}

export async function initializeLanguage(): Promise<Language> {
  const savedLang = await getLanguage();
  if (savedLang && (savedLang === "en" || savedLang === "hi" || savedLang === "es")) {
    currentLanguage = savedLang;
  }
  return currentLanguage;
}

export function getTranslations(): TranslationKeys {
  return translations[currentLanguage];
}
