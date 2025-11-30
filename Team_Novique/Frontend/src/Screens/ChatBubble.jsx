// import React, { useState, useRef } from "react";
// export default function ChatBubble() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleSend = () => {
//     if (!input.trim()) return;

//     const userMessage = input;
//     setMessages((prev) => [...prev, { text: userMessage, type: "user" }]);
//     setInput("");
//     setLoading(true);

//     setTimeout(() => {
//       const fakeResponses = [
//         "Interesting question!",
//         "Let me think about that...",
//         "I’m here to help you!",
//         "That’s a great topic to study!",
//       ];
//       const aiReply =
//         fakeResponses[Math.floor(Math.random() * fakeResponses.length)];
//       setMessages((prev) => [...prev, { text: aiReply, type: "ai" }]);
//       setLoading(false);
//       scrollToBottom();
//     }, 1000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSend();
//   };

//   return (
//     <div id="chat-bubble">
//       {/* Floating Button */}
//       {!open && (
//         <button
//           className="floating-btn"
//           onClick={() => setOpen(true)}
//         >
//           💬
//         </button>
//       )}

//       {/* Expanded Chat Window */}
//       {open && (
//         <div className="chat-window">
//           <div className="chat-header" onClick={() => setOpen(false)}>
//             AI Assistant <span className="close-btn">✕</span>
//           </div>
//           <div className="chat-body">
//             <div id="messages">
//               {messages.map((msg, idx) => (
//                 <div
//                   key={idx}
//                   className={`message ${msg.type === "user" ? "user-msg" : "ai-msg"}`}
//                 >
//                   {msg.text}
//                 </div>
//               ))}
//               {loading && <div className="message ai-msg animate-pulse">Typing...</div>}
//               <div ref={messagesEndRef} />
//             </div>
//             <input
//               type="text"
//               placeholder="Ask me anything..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyPress}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useRef } from "react";

export default function ChatBubble() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: userMessage, type: "user" }]);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("http://localhost:3000/api/chatBot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      const aiReply = data.message || "Sorry, I couldn't understand.";

      setMessages((prev) => [...prev, { text: aiReply, type: "ai" }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Server error. Try again!", type: "ai" },
      ]);
    }

    setLoading(false);
    scrollToBottom();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div id="chat-bubble">
      {/* Floating Button */}
      {!open && (
        <button className="floating-btn" onClick={() => setOpen(true)}>
          💬
        </button>
      )}

      {/* Expanded Chat Window */}
      {open && (
        <div className="chat-window">
          <div className="chat-header" onClick={() => setOpen(false)}>
            AI Assistant <span className="close-btn">✕</span>
          </div>
          <div className="chat-body">
            <div id="messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${
                    msg.type === "user" ? "user-msg" : "ai-msg"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="message ai-msg animate-pulse">Typing...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>
      )}
    </div>
  );
}
