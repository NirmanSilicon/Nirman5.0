import React, { useState } from "react";
import "../App.css";

const AiPage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I am your Trivexa AI assistant." },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Dummy AI reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "I am processing your request..." },
      ]);
    }, 600);
  };

  return (
    <div className="ai-page">
      

      {/* ✅ AI CHATBOT WINDOW */}
      <div className="pe-ai-chat">
        <h3>🤖 Trivexa AI Assistant</h3>

        <div className="pe-ai-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`ai-msg ${msg.from}`}>
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ SEARCH BAR AT BOTTOM */}
      <div className="pe-ai-search">
        <input
          type="text"
          placeholder="Type your prompt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AiPage;
