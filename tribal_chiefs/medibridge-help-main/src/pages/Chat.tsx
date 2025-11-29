import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, MessageCircle, Mic, Camera, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    chatWithAI: "Chat with AI Assistant",
    backToHome: "Back to Home",
    startChatting: "Start Chatting",
    aiReady: "AI Assistant Ready",
    loadingAI: "Loading AI Assistant...",
    welcomeMessage: "Hello! I'm your MediBridge AI assistant. How can I help you today?",
    clickToStart: "Click the button below to start our conversation"
  },
  hi: {
    chatWithAI: "AI सहायक के साथ चैट करें",
    backToHome: "घर वापस जाएं",
    startChatting: "चैट शुरू करें",
    aiReady: "AI सहायक तैयार",
    loadingAI: "AI सहायक लोड हो रहा है...",
    welcomeMessage: "नमस्ते! मैं आपका MediBridge AI सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    clickToStart: "हमारी बातचीत शुरू करने के लिए नीचे दिए गए बटन पर क्लिक करें"
  },
  pa: {
    chatWithAI: "AI ਸਹਾਇਕ ਨਾਲ ਚੈਟ ਕਰੋ",
    backToHome: "ਘਰ ਵਾਪਸ ਜਾਓ",
    startChatting: "ਚੈਟ ਸ਼ੁਰੂ ਕਰੋ",
    aiReady: "AI ਸਹਾਇਕ ਤਿਆਰ",
    loadingAI: "AI ਸਹਾਇਕ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    welcomeMessage: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ MediBridge AI ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    clickToStart: "ਸਾਡੀ ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨ 'ਤੇ ਕਲਿੱਕ ਕਰੋ"
  },
  od: {
    chatWithAI: "AI ସହାୟକ ସହିତ ଚାଟ୍ କରନ୍ତୁ",
    backToHome: "ଘରକୁ ଫେରନ୍ତୁ",
    startChatting: "ଚାଟ୍ ଆରମ୍ଭ କରନ୍ତୁ",
    aiReady: "AI ସହାୟକ ପ୍ରସ୍ତୁତ",
    loadingAI: "AI ସହାୟକ ଲୋଡ୍ ହେଉଛି...",
    welcomeMessage: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର MediBridge AI ସହାୟକ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
    clickToStart: "ଆମର କଥାବାର୍ତ୍ତା ଆରମ୍ଭ କରିବା ପାଇଁ ନିମ୍ନ ବଟନ୍ ପ୍ରେସ୍ କରନ୍ତୁ"
  },
  es: {
    chatWithAI: "Chatear con Asistente IA",
    backToHome: "Volver al Inicio",
    startChatting: "Comenzar Chat",
    aiReady: "Asistente IA Listo",
    loadingAI: "Cargando Asistente IA...",
    welcomeMessage: "¡Hola! Soy tu asistente IA de MediBridge. ¿Cómo puedo ayudarte hoy?",
    clickToStart: "Haz clic en el botón de abajo para comenzar nuestra conversación"
  },
  fr: {
    chatWithAI: "Chatter avec l'Assistant IA",
    backToHome: "Retour à l'Accueil",
    startChatting: "Commencer le Chat",
    aiReady: "Assistant IA Prêt",
    loadingAI: "Chargement de l'Assistant IA...",
    welcomeMessage: "Bonjour! Je suis votre assistant IA MediBridge. Comment puis-je vous aider aujourd'hui?",
    clickToStart: "Cliquez sur le bouton ci-dessous pour commencer notre conversation"
  },
  de: {
    chatWithAI: "Mit KI-Assistent chatten",
    backToHome: "Zurück zur Startseite",
    startChatting: "Chat beginnen",
    aiReady: "KI-Assistent bereit",
    loadingAI: "KI-Assistent wird geladen...",
    welcomeMessage: "Hallo! Ich bin Ihr MediBridge KI-Assistent. Wie kann ich Ihnen heute helfen?",
    clickToStart: "Klicken Sie auf die Schaltfläche unten, um unser Gespräch zu beginnen"
  }
};

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAgentLoaded, setIsAgentLoaded] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  // Get language from navigation state or default to English
  const currentLanguage = (location.state?.language as keyof typeof translations) || 'en';
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
    if (isAgentLoaded && window.voiceflow) {
      window.voiceflow.chat.open();
      setIsAgentOpen(true);
    }
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('/lovable-uploads/7f4202fe-387f-4572-9786-122191962f67.png')`,
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-sm" />
      
      {/* Back button */}
      <Button
        variant="outline"
        onClick={handleBackHome}
        className="absolute top-6 left-6 z-10 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t.backToHome}
      </Button>

      {/* Chat Interface */}
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="border-2 border-primary/20 bg-background/90 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Bot className="h-12 w-12 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl mb-2 text-foreground">
              {t.chatWithAI}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                {t.welcomeMessage}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.clickToStart}
              </p>
            </div>

            {/* Chat Status */}
            <div className="flex items-center justify-center space-x-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className={`w-3 h-3 rounded-full ${isAgentLoaded ? 'bg-accent animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-sm font-medium text-foreground">
                {isAgentLoaded ? t.aiReady : t.loadingAI}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={handleOpenAgent}
                size="lg" 
                className="w-full py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-hero hover:opacity-90"
                disabled={!isAgentLoaded}
              >
                <MessageCircle className="h-6 w-6 mr-3" />
                {t.startChatting}
              </Button>

              {isAgentLoaded && (
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>Text Chat</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mic className="h-4 w-4" />
                    <span>Voice Chat</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Section */}
            <div className="mt-8 space-y-4">
              <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
                <h4 className="font-semibold text-sm mb-3 text-foreground">Quick Message</h4>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="pr-20"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && isAgentLoaded) {
                          handleOpenAgent();
                        }
                      }}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-accent/20"
                        onClick={() => {
                          // Camera functionality would be implemented here
                          console.log("Camera clicked");
                        }}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-primary/20"
                        onClick={handleOpenAgent}
                        disabled={!isAgentLoaded}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Use the camera icon to share images with the AI assistant
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                <strong className="text-foreground">Medical Disclaimer:</strong> This AI assistant provides general health information and guidance. For serious medical concerns or emergencies, always consult with healthcare professionals or call emergency services.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;