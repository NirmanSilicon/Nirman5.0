import React, { useEffect } from "react";

const AIAgent: React.FC = () => {
  // Load Voiceflow chatbot script
  useEffect(() => {
    const existingScript = document.getElementById("voiceflow-widget");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "voiceflow-widget";
      script.type = "text/javascript";
      script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";

      script.onload = () => {
        (window as any).voiceflow?.chat.load({
          verify: { projectID: "692aede2aa64db708a88f04e" }, 
          url: "https://general-runtime.voiceflow.com",
          versionID: "production",
        });
      };

      document.body.appendChild(script);
    }
  }, []);

  // Function to open chatbot
  const openChatbot = () => {
    try {
      (window as any).voiceflow?.chat.open();
    } catch (err) {
      console.error("Voiceflow chat not loaded yet:", err);
    }
  };

  return (
    <>
      {/* Floating Chatbot Icon */}
      <button
        onClick={openChatbot}
        className="
          fixed bottom-6 right-6 
          w-16 h-16 
          bg-blue-600 
          text-white text-3xl 
          rounded-full 
          shadow-lg 
          flex justify-center items-center 
          hover:bg-blue-800 
          transition duration-300 
          z-50
        "
      >
        💬
      </button>
    </>
  );
};

export default AIAgent;