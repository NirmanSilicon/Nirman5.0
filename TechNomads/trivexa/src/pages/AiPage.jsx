import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // only for toolbar links
import medicineDB from "../data/medicineDB";
import "../App.css";

const AiPage = () => {
  const navigate = useNavigate(); // for toolbar links only

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! Enter your symptom and I will suggest medicines." },
  ]);
  const [products, setProducts] = useState([]);

  // ✅ SEND MESSAGE + UPDATE SUGGESTED PRODUCTS (NO PAGE NAVIGATION)
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    // ✅ SEARCH FROM MEDICINE DB (LOCAL FILTER)
    const query = input.toLowerCase();

    const matchedProducts = medicineDB.filter(
      (med) =>
        med.name.toLowerCase().includes(query) ||
        med.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    setProducts(matchedProducts); // ✅ ONLY UPDATE RIGHT SIDE TAB
    setInput("");

    // ✅ AI REPLY BASED ON RESULTS
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            matchedProducts.length > 0
              ? "Here are the medicines related to your query."
              : "I couldn't find matching medicines. Try different symptoms.",
        },
      ]);
    }, 500);
  };

  return (
    <div className="ai-page">
      {/* ✅ TOOLBAR (LINKS TO PAGES, AI STAYS HERE) */}
      <header className="pe-header">
        <div className="pe-logo">Trivexa</div>

        <nav className="pe-nav">
          <span onClick={() => navigate("/medicine")}>Medicine</span>
          <span onClick={() => navigate("/healthcare")}>Healthcare</span>
          <span onClick={() => navigate("/doctor")}>Doctor</span>
          <span onClick={() => navigate("/lab")}>Lab Tests</span>
          <span onClick={() => navigate("/about")}>About</span>
        </nav>
      </header>

      {/* ✅ SPLIT CHAT + PRODUCT WINDOW */}
      <div className="ai-split-container">
        {/* ✅ LEFT: CHAT */}
        <div className="ai-chat-left">
          <h3>🤖 Trivexa AI Chat</h3>

          <div className="pe-ai-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>

        {/* ✅ RIGHT: SUGGESTED PRODUCTS (UPDATED LIVE) */}
        <div className="ai-products-right">
          <h3>🛒 Suggested Products</h3>

          {products.length === 0 ? (
            <p className="ai-no-product">No products to show yet.</p>
          ) : (
            products.map((p) => (
              <div key={p.id} className="ai-product-card">
                <h4>{p.name}</h4>
                <p>₹{p.price}</p>
                <button>Add to Cart</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ PROMPT / SEARCH INPUT (BOTTOM) */}
      <div className="pe-ai-search">
        <input
          type="text"
          placeholder="Type your symptom or medicine..."
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
