import { useEffect, useState } from "react";
import { MessageCircle, Mic, Bot, Sparkles, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    voiceflow: {
      chat: {
        load: (config: any) => void;
        open: () => void;
        close: () => void;
        toggle: () => void;
      };
    };
  }
}

const translations = {
  en: {
    aiHealthAssistant: "AI Health Assistant",
    personalHealthAI: "Your Personal Health AI",
    description: "Get instant medical guidance, appointment assistance, and health information from our advanced AI agent available 24/7.",
    assistantTitle: "MediBridge AI Assistant",
    assistantSubtitle: "Advanced healthcare AI powered by medical expertise",
    chatSupport: "Chat Support",
    chatDescription: "Text-based medical guidance",
    voiceInteraction: "Voice Interaction",
    voiceDescription: "Speak naturally with AI",
    smartInsights: "Smart Insights",
    smartDescription: "Personalized health advice",
    aiCapabilities: "AI Capabilities",
    symptomAnalysis: "Symptom Analysis",
    appointmentBooking: "Appointment Booking",
    medicationInfo: "Medication Info",
    emergencyGuidance: "Emergency Guidance",
    healthTips: "Health Tips",
    doctorReferrals: "Doctor Referrals",
    startConversation: "Start Conversation",
    loadingAI: "Loading AI...",
    agentReady: "✓ AI Agent Ready • Voice & Text Enabled",
    needHelp: "Need immediate help?",
    toggleChat: "Toggle AI Chat",
    emergencySOS: "Emergency SOS",
    medicalDisclaimer: "Medical Disclaimer:",
    disclaimerText: "This AI assistant provides general health information and guidance. For serious medical concerns or emergencies, always consult with healthcare professionals or call emergency services.",
    selectLanguage: "Select Language"
  },
  es: {
    aiHealthAssistant: "Asistente de Salud IA",
    personalHealthAI: "Tu IA Personal de Salud",
    description: "Obtén orientación médica instantánea, asistencia para citas e información de salud de nuestro agente de IA avanzado disponible 24/7.",
    assistantTitle: "Asistente IA MediBridge",
    assistantSubtitle: "IA de salud avanzada impulsada por experiencia médica",
    chatSupport: "Soporte de Chat",
    chatDescription: "Orientación médica basada en texto",
    voiceInteraction: "Interacción por Voz",
    voiceDescription: "Habla naturalmente con IA",
    smartInsights: "Insights Inteligentes",
    smartDescription: "Consejos de salud personalizados",
    aiCapabilities: "Capacidades de IA",
    symptomAnalysis: "Análisis de Síntomas",
    appointmentBooking: "Reserva de Citas",
    medicationInfo: "Info de Medicamentos",
    emergencyGuidance: "Orientación de Emergencia",
    healthTips: "Consejos de Salud",
    doctorReferrals: "Referencias Médicas",
    startConversation: "Iniciar Conversación",
    loadingAI: "Cargando IA...",
    agentReady: "✓ Agente IA Listo • Voz y Texto Habilitados",
    needHelp: "¿Necesitas ayuda inmediata?",
    toggleChat: "Alternar Chat IA",
    emergencySOS: "SOS de Emergencia",
    medicalDisclaimer: "Descargo Médico:",
    disclaimerText: "Este asistente de IA proporciona información y orientación general de salud. Para preocupaciones médicas serias o emergencias, siempre consulta con profesionales de la salud o llama a servicios de emergencia.",
    selectLanguage: "Seleccionar Idioma"
  },
  fr: {
    aiHealthAssistant: "Assistant Santé IA",
    personalHealthAI: "Votre IA Personnelle de Santé",
    description: "Obtenez des conseils médicaux instantanés, une assistance pour les rendez-vous et des informations de santé de notre agent IA avancé disponible 24h/24 et 7j/7.",
    assistantTitle: "Assistant IA MediBridge",
    assistantSubtitle: "IA de santé avancée alimentée par l'expertise médicale",
    chatSupport: "Support Chat",
    chatDescription: "Conseils médicaux basés sur le texte",
    voiceInteraction: "Interaction Vocale",
    voiceDescription: "Parlez naturellement avec l'IA",
    smartInsights: "Insights Intelligents",
    smartDescription: "Conseils de santé personnalisés",
    aiCapabilities: "Capacités IA",
    symptomAnalysis: "Analyse des Symptômes",
    appointmentBooking: "Réservation de Rendez-vous",
    medicationInfo: "Info Médicaments",
    emergencyGuidance: "Conseils d'Urgence",
    healthTips: "Conseils Santé",
    doctorReferrals: "Références Médecin",
    startConversation: "Commencer la Conversation",
    loadingAI: "Chargement IA...",
    agentReady: "✓ Agent IA Prêt • Voix et Texte Activés",
    needHelp: "Besoin d'aide immédiate?",
    toggleChat: "Basculer Chat IA",
    emergencySOS: "SOS d'Urgence",
    medicalDisclaimer: "Avertissement Médical:",
    disclaimerText: "Cet assistant IA fournit des informations et des conseils généraux de santé. Pour des préoccupations médicales graves ou des urgences, consultez toujours des professionnels de la santé ou appelez les services d'urgence.",
    selectLanguage: "Sélectionner la Langue"
  },
  de: {
    aiHealthAssistant: "KI-Gesundheitsassistent",
    personalHealthAI: "Ihre Persönliche Gesundheits-KI",
    description: "Erhalten Sie sofortige medizinische Beratung, Terminunterstützung und Gesundheitsinformationen von unserem fortschrittlichen KI-Agenten, der rund um die Uhr verfügbar ist.",
    assistantTitle: "MediBridge KI-Assistent",
    assistantSubtitle: "Fortschrittliche Gesundheits-KI mit medizinischer Expertise",
    chatSupport: "Chat-Support",
    chatDescription: "Textbasierte medizinische Beratung",
    voiceInteraction: "Sprachinteraktion",
    voiceDescription: "Sprechen Sie natürlich mit KI",
    smartInsights: "Smart Insights",
    smartDescription: "Personalisierte Gesundheitsberatung",
    aiCapabilities: "KI-Fähigkeiten",
    symptomAnalysis: "Symptomanalyse",
    appointmentBooking: "Terminbuchung",
    medicationInfo: "Medikamenten-Info",
    emergencyGuidance: "Notfall-Beratung",
    healthTips: "Gesundheitstipps",
    doctorReferrals: "Arztempfehlungen",
    startConversation: "Gespräch beginnen",
    loadingAI: "KI wird geladen...",
    agentReady: "✓ KI-Agent bereit • Sprache und Text aktiviert",
    needHelp: "Brauchen Sie sofortige Hilfe?",
    toggleChat: "KI-Chat umschalten",
    emergencySOS: "Notfall-SOS",
    medicalDisclaimer: "Medizinischer Haftungsausschluss:",
    disclaimerText: "Dieser KI-Assistent bietet allgemeine Gesundheitsinformationen und -beratung. Bei ernsthaften medizinischen Problemen oder Notfällen wenden Sie sich immer an medizinische Fachkräfte oder rufen Sie den Notdienst an.",
    selectLanguage: "Sprache auswählen"
  },
  hi: {
    aiHealthAssistant: "AI स्वास्थ्य सहायक",
    personalHealthAI: "आपका व्यक्तिगत स्वास्थ्य AI",
    description: "हमारे उन्नत AI एजेंट से तत्काल चिकित्सा मार्गदर्शन, अपॉइंटमेंट सहायता और स्वास्थ्य जानकारी प्राप्त करें जो 24/7 उपलब्ध है।",
    assistantTitle: "MediBridge AI सहायक",
    assistantSubtitle: "चिकित्सा विशेषज्ञता द्वारा संचालित उन्नत स्वास्थ्य AI",
    chatSupport: "चैट सहायता",
    chatDescription: "पाठ-आधारित चिकित्सा मार्गदर्शन",
    voiceInteraction: "आवाज़ इंटरैक्शन",
    voiceDescription: "AI के साथ प्राकृतिक रूप से बात करें",
    smartInsights: "स्मार्ट अंतर्दृष्टि",
    smartDescription: "व्यक्तिगत स्वास्थ्य सलाह",
    aiCapabilities: "AI क्षमताएं",
    symptomAnalysis: "लक्षण विश्लेषण",
    appointmentBooking: "अपॉइंटमेंट बुकिंग",
    medicationInfo: "दवा की जानकारी",
    emergencyGuidance: "आपातकालीन मार्गदर्शन",
    healthTips: "स्वास्थ्य सुझाव",
    doctorReferrals: "डॉक्टर रेफरल",
    startConversation: "बातचीत शुरू करें",
    loadingAI: "AI लोड हो रहा है...",
    agentReady: "✓ AI एजेंट तैयार • आवाज़ और टेक्स्ट सक्षम",
    needHelp: "तत्काल सहायता चाहिए?",
    toggleChat: "AI चैट टॉगल करें",
    emergencySOS: "आपातकालीन SOS",
    medicalDisclaimer: "चिकित्सा अस्वीकरण:",
    disclaimerText: "यह AI सहायक सामान्य स्वास्थ्य जानकारी और मार्गदर्शन प्रदान करता है। गंभीर चिकित्सा चिंताओं या आपातकाल के लिए, हमेशा स्वास्थ्य पेशेवरों से सलाह लें या आपातकालीन सेवाओं को कॉल करें।",
    selectLanguage: "भाषा चुनें"
  },
  pa: {
    aiHealthAssistant: "AI ਸਿਹਤ ਸਹਾਇਕ",
    personalHealthAI: "ਤੁਹਾਡਾ ਨਿੱਜੀ ਸਿਹਤ AI",
    description: "ਸਾਡੇ ਉੱਨਤ AI ਏਜੰਟ ਤੋਂ ਤੁਰੰਤ ਮੈਡੀਕਲ ਮਾਰਗਦਰਸ਼ਨ, ਮੁਲਾਕਾਤ ਸਹਾਇਤਾ ਅਤੇ ਸਿਹਤ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ ਜੋ 24/7 ਉਪਲਬਧ ਹੈ।",
    assistantTitle: "MediBridge AI ਸਹਾਇਕ",
    assistantSubtitle: "ਮੈਡੀਕਲ ਮਹਾਰਤ ਦੁਆਰਾ ਸੰਚਾਲਿਤ ਉੱਨਤ ਸਿਹਤ AI",
    chatSupport: "ਚੈਟ ਸਹਾਇਤਾ",
    chatDescription: "ਟੈਕਸਟ-ਅਧਾਰਿਤ ਮੈਡੀਕਲ ਮਾਰਗਦਰਸ਼ਨ",
    voiceInteraction: "ਆਵਾਜ਼ ਇੰਟਰੈਕਸ਼ਨ",
    voiceDescription: "AI ਨਾਲ ਕੁਦਰਤੀ ਤੌਰ 'ਤੇ ਗੱਲ ਕਰੋ",
    smartInsights: "ਸਮਾਰਟ ਸੂਝ",
    smartDescription: "ਨਿੱਜੀ ਸਿਹਤ ਸਲਾਹ",
    aiCapabilities: "AI ਸਮਰੱਥਾਵਾਂ",
    symptomAnalysis: "ਲੱਛਣ ਵਿਸ਼ਲੇਸ਼ਣ",
    appointmentBooking: "ਮੁਲਾਕਾਤ ਬੁਕਿੰਗ",
    medicationInfo: "ਦਵਾਈ ਦੀ ਜਾਣਕਾਰੀ",
    emergencyGuidance: "ਐਮਰਜੈਂਸੀ ਮਾਰਗਦਰਸ਼ਨ",
    healthTips: "ਸਿਹਤ ਸੁਝਾਅ",
    doctorReferrals: "ਡਾਕਟਰ ਰੈਫਰਲ",
    startConversation: "ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ",
    loadingAI: "AI ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    agentReady: "✓ AI ਏਜੰਟ ਤਿਆਰ • ਆਵਾਜ਼ ਅਤੇ ਟੈਕਸਟ ਸਮਰੱਥ",
    needHelp: "ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    toggleChat: "AI ਚੈਟ ਟੌਗਲ ਕਰੋ",
    emergencySOS: "ਐਮਰਜੈਂਸੀ SOS",
    medicalDisclaimer: "ਮੈਡੀਕਲ ਅਸਵੀਕਰਣ:",
    disclaimerText: "ਇਹ AI ਸਹਾਇਕ ਆਮ ਸਿਹਤ ਜਾਣਕਾਰੀ ਅਤੇ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ। ਗੰਭੀਰ ਮੈਡੀਕਲ ਚਿੰਤਾਵਾਂ ਜਾਂ ਐਮਰਜੈਂਸੀ ਲਈ, ਹਮੇਸ਼ਾ ਸਿਹਤ ਪੇਸ਼ੇਵਰਾਂ ਨਾਲ ਸਲਾਹ ਕਰੋ ਜਾਂ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨੂੰ ਕਾਲ ਕਰੋ।",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ"
  },
  od: {
    aiHealthAssistant: "AI ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ",
    personalHealthAI: "ଆପଣଙ୍କର ବ୍ୟକ୍ତିଗତ ସ୍ୱାସ୍ଥ୍ୟ AI",
    description: "ଆମର ଉନ୍ନତ AI ଏଜେଣ୍ଟରୁ ତୁରନ୍ତ ଚିକିତ୍ସା ମାର୍ଗଦର୍ଶନ, ନିଯୁକ୍ତି ସହାୟତା ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ପ୍ରାପ୍ତ କରନ୍ତୁ ଯାହା 24/7 ଉପଲବ୍ଧ।",
    assistantTitle: "MediBridge AI ସହାୟକ",
    assistantSubtitle: "ଚିକିତ୍ସା ବିଶେଷଜ୍ଞତା ଦ୍ୱାରା ଚାଳିତ ଉନ୍ନତ ସ୍ୱାସ୍ଥ୍ୟ AI",
    chatSupport: "ଚାଟ୍ ସହାୟତା",
    chatDescription: "ପାଠ୍ୟ-ଆଧାରିତ ଚିକିତ୍ସା ମାର୍ଗଦର୍ଶନ",
    voiceInteraction: "ସ୍ୱର ଇଣ୍ଟରାକ୍ସନ",
    voiceDescription: "AI ସହିତ ପ୍ରାକୃତିକ ଭାବରେ କଥା କହନ୍ତୁ",
    smartInsights: "ସ୍ମାର୍ଟ ଅନ୍ତର୍ଦୃଷ୍ଟି",
    smartDescription: "ବ୍ୟକ୍ତିଗତ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ",
    aiCapabilities: "AI ସାମର୍ଥ୍ୟ",
    symptomAnalysis: "ଲକ୍ଷଣ ବିଶ୍ଳେଷଣ",
    appointmentBooking: "ନିଯୁକ୍ତି ବୁକିଂ",
    medicationInfo: "ଔଷଧ ସୂଚନା",
    emergencyGuidance: "ଜରୁରୀକାଳୀନ ମାର୍ଗଦର୍ଶନ",
    healthTips: "ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ",
    doctorReferrals: "ଡାକ୍ତର ରେଫରାଲ୍",
    startConversation: "କଥାବାର୍ତ୍ତା ଆରମ୍ଭ କରନ୍ତୁ",
    loadingAI: "AI ଲୋଡ୍ ହେଉଛି...",
    agentReady: "✓ AI ଏଜେଣ୍ଟ ପ୍ରସ୍ତୁତ • ସ୍ୱର ଏବଂ ପାଠ୍ୟ ସକ୍ଷମ",
    needHelp: "ତୁରନ୍ତ ସାହାଯ୍ୟ ଦରକାର?",
    toggleChat: "AI ଚାଟ୍ ଟଗଲ୍ କରନ୍ତୁ",
    emergencySOS: "ଜରୁରୀକାଳୀନ SOS",
    medicalDisclaimer: "ଚିକିତ୍ସା ଅସ୍ୱୀକରଣ:",
    disclaimerText: "ଏହି AI ସହାୟକ ସାଧାରଣ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ଏବଂ ମାର୍ଗଦର୍ଶନ ପ୍ରଦାନ କରେ। ଗମ୍ଭୀର ଚିକିତ୍ସା ଚିନ୍ତା କିମ୍ବା ଜରୁରୀକାଳୀନ ପରିସ୍ଥିତି ପାଇଁ, ସର୍ବଦା ସ୍ୱାସ୍ଥ୍ୟ ବିଶେଷଜ୍ଞଙ୍କ ସହିତ ପରାମର୍ଶ କରନ୍ତୁ କିମ୍ବା ଜରୁରୀକାଳୀନ ସେବାକୁ କଲ୍ କରନ୍ତୁ।",
    selectLanguage: "ଭାଷା ବାଛନ୍ତୁ"
  }
};

const AIAgent = () => {
  const [isAgentLoaded, setIsAgentLoaded] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<keyof typeof translations>('en');
  const navigate = useNavigate();

  const t = translations[currentLanguage];

  useEffect(() => {
    // Check if Voiceflow is loaded
    const checkVoiceflow = () => {
      if (window.voiceflow && window.voiceflow.chat) {
        setIsAgentLoaded(true);
      } else {
        setTimeout(checkVoiceflow, 500);
      }
    };
    
    checkVoiceflow();
  }, []);

  const handleOpenAgent = () => {
    navigate('/chat', { state: { language: currentLanguage } });
  };

  const handleToggleAgent = () => {
    if (isAgentLoaded && window.voiceflow) {
      window.voiceflow.chat.toggle();
      setIsAgentOpen(!isAgentOpen);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Bot className="h-4 w-4 mr-2" />
              {t.aiHealthAssistant}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.personalHealthAI}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.description}
            </p>
            
            {/* Language Selector */}
            <div className="mt-6 flex justify-center">
              <Select value={currentLanguage} onValueChange={(value: keyof typeof translations) => setCurrentLanguage(value)}>
                <SelectTrigger className="w-48 bg-background/50 backdrop-blur-sm">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t.selectLanguage} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="hi">🇮🇳 हिन्दी</SelectItem>
                  <SelectItem value="pa">🇮🇳 ਪੰਜਾਬੀ</SelectItem>
                  <SelectItem value="od">🇮🇳 ଓଡ଼ିଆ</SelectItem>
                  <SelectItem value="es">🇪🇸 Español</SelectItem>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* AI Agent Card */}
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-card shadow-medical">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            
            <CardHeader className="relative text-center pb-6">
              <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Bot className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl mb-2">{t.assistantTitle}</CardTitle>
              <CardDescription className="text-lg">
                {t.assistantSubtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">{t.chatSupport}</h4>
                  <p className="text-sm text-muted-foreground">{t.chatDescription}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm">
                  <Mic className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">{t.voiceInteraction}</h4>
                  <p className="text-sm text-muted-foreground">{t.voiceDescription}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">{t.smartInsights}</h4>
                  <p className="text-sm text-muted-foreground">{t.smartDescription}</p>
                </div>
              </div>

              {/* Capabilities */}
              <div className="mb-8">
                <h4 className="font-semibold text-center mb-4">{t.aiCapabilities}</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{t.symptomAnalysis}</Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">{t.appointmentBooking}</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{t.medicationInfo}</Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">{t.emergencyGuidance}</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{t.healthTips}</Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">{t.doctorReferrals}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="text-center space-y-4">
                <Button 
                  onClick={handleOpenAgent}
                  size="lg" 
                  className="px-8 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={!isAgentLoaded}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {isAgentLoaded ? t.startConversation : t.loadingAI}
                </Button>
                
                {isAgentLoaded && (
                  <div className="text-sm text-muted-foreground">
                    <p>{t.agentReady}</p>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  <strong className="text-foreground">{t.medicalDisclaimer}</strong> {t.disclaimerText}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">{t.needHelp}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" onClick={handleToggleAgent} disabled={!isAgentLoaded}>
                <Bot className="h-4 w-4 mr-2" />
                {t.toggleChat}
              </Button>
              <Button variant="outline" asChild>
                <a href="/emergency">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t.emergencySOS}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAgent;