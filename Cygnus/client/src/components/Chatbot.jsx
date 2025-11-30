import { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your Eco Assistant. I can help you with waste classification, recycling tips, eco-points information, and sustainable practices. How can I assist you today?",
      sender: "bot"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);

  const apiKey = "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";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
    const pulseTimer = setTimeout(() => {
      setIsPulsing(false);
    }, 10000);
    
    return () => clearTimeout(pulseTimer);
  }, [messages]);

  // Drag handling functions
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.tagName === 'INPUT') return;
    
    setIsDragging(true);
    const rect = chatbotRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Ensure the chatbot stays within the viewport
    const maxX = window.innerWidth - (chatbotRef.current?.offsetWidth || 0);
    const maxY = window.innerHeight - (chatbotRef.current?.offsetHeight || 0);
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  const handleSendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || inputMessage;
    
    if (!messageToSend.trim()) return;

    const userMessage = { text: messageToSend, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    
    if (!customMessage) {
      setInputMessage("");
    }
    
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Eco Assistant"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content: `You are an expert eco-friendly waste management assistant. Provide detailed, accurate information about:
- Waste classification and recycling
- Plastic recycling processes and types
- Eco-points systems and rewards
- Home composting methods and benefits
- Non-recyclable materials and alternatives
- Sustainable practices and environmental tips
- Waste reduction strategies
- Proper disposal methods for different materials

Always provide practical, actionable advice. Be specific about:
- Which plastics can be recycled (PET, HDPE, etc.)
- How eco-points work in different systems
- Step-by-step composting instructions
- Common recycling mistakes to avoid
- Local disposal guidelines when possible

Keep responses informative but concise (2-4 paragraphs maximum).`
            },
            {
              role: "user",
              content: messageToSend
            }
          ],
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const botMessage = data.choices[0].message.content;
        setMessages(prev => [...prev, { text: botMessage, sender: "bot" }]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        text: `Sorry, I'm having trouble connecting right now. Please try again later. Error: ${error.message}`, 
        sender: "bot" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setTimeout(() => setIsOpen(false), 300);
  };

  const handleMaximize = () => {
    setIsOpen(true);
    setTimeout(() => setIsMinimized(false), 50);
  };

  const suggestedQuestions = [
    "How do I recycle plastic?",
    "What are eco-points?",
    "How to compost at home?",
    "What can't be recycled?"
  ];

  const wasteCategories = [
    "Electronic waste disposal",
    "Food waste recycling", 
    "Glass recycling",
    "Paper recycling tips",
    "Hazardous waste handling",
    "Textile recycling",
    "Battery disposal"
  ];

  const handleSuggestionClick = (question) => {
    handleSendMessage(question);
  };

  return (
    <div className="fixed z-50" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
      {/* Chatbot Container */}
      {isOpen && (
        <div 
          ref={chatbotRef}
          className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-96 h-[32rem] flex flex-col transform transition-all duration-300 ${isMinimized ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} border border-white/20 overflow-hidden ${isDragging ? 'cursor-grabbing shadow-xl' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2) inset' }}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-md relative">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-300 w-10 h-10 rounded-full flex items-center justify-center shadow-md animate-pulse">
                <i className="ri-leaf-fill text-emerald-800 text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg">Eco Assistant</h3>
                <p className="text-xs text-amber-100 flex items-center">
                  <span className="w-2 h-2 bg-green-300 rounded-full mr-1 animate-pulse"></span>
                  Online • Ready to help
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleMinimize}
                className="text-white/80 hover:text-amber-300 transition-all duration-200 p-1 rounded-full hover:bg-white/10 transform hover:scale-110"
                title="Minimize"
              >
                <i className="ri-subtract-line text-lg"></i>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-amber-300 transition-all duration-200 p-1 rounded-full hover:bg-white/10 transform hover:scale-110"
                title="Close"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
          </div>
          
          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50/70 to-gray-100/70" style={{ maxHeight: 'calc(32rem - 130px)' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                {message.sender === "bot" && (
                  <div className="bg-amber-300 w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                    <i className="ri-leaf-fill text-emerald-800 text-sm"></i>
                  </div>
                )}
                <div
                  className={`max-w-xs p-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md"
                      : "bg-white/90 text-gray-800 border border-white/20 rounded-bl-none shadow-sm backdrop-blur-sm"
                  } transition-all duration-200 hover:shadow-lg`}
                >
                  {message.text}
                </div>
                {message.sender === "user" && (
                  <div className="bg-emerald-700 w-8 h-8 rounded-full flex items-center justify-center ml-2 flex-shrink-0 shadow-sm">
                    <i className="ri-user-3-fill text-amber-300 text-sm"></i>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="bg-amber-300 w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                  <i className="ri-leaf-fill text-emerald-800 text-sm"></i>
                </div>
                <div className="bg-white/90 border border-white/20 text-gray-800 p-3 rounded-2xl rounded-bl-none max-w-xs shadow-sm backdrop-blur-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Suggested questions */}
            {messages.length <= 2 && (
              <div className="mt-4 animate-fadeIn">
                <p className="text-xs text-gray-500 mb-2 text-center">Quick questions:</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className="bg-white/80 border border-white/20 text-xs p-2 rounded-xl text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200 transform hover:scale-[1.02] shadow-sm backdrop-blur-sm"
                      disabled={isLoading}
                    >
                      {question}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mb-2 text-center">More waste topics:</p>
                <div className="grid grid-cols-2 gap-2">
                  {wasteCategories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(category)}
                      className="bg-emerald-50/80 border border-emerald-200 text-xs p-2 rounded-xl text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200 transform hover:scale-[1.02] shadow-sm backdrop-blur-sm"
                      disabled={isLoading}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-3 border-t border-white/20 bg-white/80 rounded-b-2xl flex items-center shadow-inner backdrop-blur-sm">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about waste management, recycling..."
              className="flex-1 border border-white/30 bg-white/50 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 shadow-inner backdrop-blur-sm"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2 rounded-xl hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center ml-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              {isLoading ? (
                <i className="ri-loader-4-line animate-spin"></i>
              ) : (
                <i className="ri-send-plane-fill"></i>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Minimized Chat Window */}
      {isMinimized && (
        <div 
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 border border-white/20 backdrop-blur-md"
          style={{ width: '200px' }}
          onClick={handleMaximize}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-amber-300 w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                <i className="ri-leaf-fill text-emerald-800 text-sm"></i>
              </div>
              <span className="text-sm font-medium">Eco Assistant</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
                setIsOpen(false);
              }}
              className="text-white/80 hover:text-amber-300 text-xs transition-colors duration-200"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
          <p className="text-xs text-amber-100 mt-1 truncate">Click to expand chat</p>
        </div>
      )}
      
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => {
          if (isMinimized) {
            handleMaximize();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className={`bg-gradient-to-br from-emerald-600 to-teal-600 text-white w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 border border-white/20 backdrop-blur-md
          ${isPulsing ? 'animate-pulse ring-2 ring-amber-300 ring-offset-2' : ''}`}
        style={{
          width: '56px',
          height: '56px',
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: isOpen ? 'none' : 'flex'
        }}
      >
        {isOpen || isMinimized ? (
          <i className="ri-close-line text-3xl"></i>
        ) : (
          <i className="ri-wechat-line text-3xl"></i>
        )}
      </button> 
    </div>
  );
};

export default Chatbot;