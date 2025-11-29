import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./allopathy.css";

import logo from "../assets/logo.jpeg";
import { FaRobot } from "react-icons/fa";


export default function Allopathy() {
  const [chatOpen, setChatOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const medicines = [
    { name: "Paracetamol", price: "₹30", img: "https://tiimg.tistatic.com/fp/1/007/784/anti-inflammatory-pain-reliever-paracetamol-tablets-625-mg-670.jpg" },
    { name: "cough syrup", price: "₹90", img: "https://cdn.coconuts.co/coconuts/wp-content/uploads/2022/11/cough-syrup-flickr-cc.jpg" },
    { name: "Vitamin C tablets", price: "₹110", img: "https://www.bronsonvitamins.com/cdn/shop/products/47a-0120-bottles-with-product-2000.jpg?v=1674203092" },
  ];

  return (
    <div className="container">

      {/* ================= TOP BAR ================= */}
      <div className="top-bar">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="logo" />
          <span className="tagline">Your One Stop Solution To Healthcare</span>
        </div>

        <div className="top-buttons">
          <button className="emergency-btn" onClick={() => setEmergencyOpen(true)}>
            <h2>24/7 EMERGENCY</h2>
          </button>

          {/* Cart */}
          <button className="icon-btn">🛒</button>

          {/* Profile */}
          <Link to="/profile">
            <button className="icon-btn">👤</button>
          </Link>
        </div>
      </div>

      {/* ================= TOOL BAR ================= */}
      <div className="tool-bar">
        <Link to="/">
          <button className="tool-btn">
            <div className="tool-icon">🏠</div>
            <p>Home</p>
          </button>
        </Link>

        {[
          { name: "Library", icon: "📘" },
          { name: "Lab Tests", icon: "🧪" },
          { name: "Plans", icon: "📋" },
          { name: "Exercise", icon: "🏃" },
          { name: "Diet", icon: "🥗" },
          { name: "Therapy", icon: "💬" },
          { name: "Meditation", icon: "🧘" },
        ].map((item) => (
          <button key={item.name} className="tool-btn">
            <div className="tool-icon">{item.icon}</div>
            <p>{item.name}</p>
          </button>
        ))}
      </div>

      {/* ================= PAGE TITLE ================= */}
      <h2 className="allopathy-title">Allopathy – Doctors & Medicines</h2>

      {/* ================= MAIN TWO BLOCKS ================= */}
      <div className="allopathy-main">

        {/* LEFT BLOCK – DOCTOR CONSULTATION */}
        <div className="doctor-section">
          <h3><b>Doctor Consultations</b></h3>

          <div className="doctor-card">
            <h4>General Physician</h4>
            <p>Consult for fever, cough, infections, aches & common issues.</p>
            <button className="consult-btn">Book Consultation</button>
          </div>

          <div className="doctor-card">
            <h4>Dermatologist</h4>
            <p>Skin allergies, acne, rashes & hair concerns.</p>
            <button className="consult-btn">Book Consultation</button>
          </div>

          <div className="doctor-card">
            <h4>Cardiologist</h4>
            <p>Heart checkups, ECG readings & long-term monitoring.</p>
            <button className="consult-btn">Book Consultation</button>
          </div>
        </div>

        {/* RIGHT BLOCK – MEDICINES STORE */}
        <div className="med-store">
          <h3>Allopathy Medicines</h3>

          <div className="medicine-grid">
            {medicines.map((m) => (
              <div className="medicine-card" key={m.name}>
                <img src={m.img} alt={m.name} className="medicine-img" />
                <h4>{m.name}</h4>
                <p className="price">{m.price}</p>
                <button className="add-cart-btn">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CHATBOT BUTTON ================= */}
      <button className="chatbot-btn" onClick={() => setChatOpen(!chatOpen)}>
        <FaRobot size={65} />
      </button>

      {/* CHAT WINDOW */}
      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div>
              <h4>AI Medical Assistant</h4>
              <p>Ask your health-related queries</p>
            </div>
            <span className="chat-close" onClick={() => setChatOpen(false)}>
              ✖
            </span>
          </div>

          <div className="chat-body">
            <div className="bot-message">
              Hello! How can I help you today?
            </div>
          </div>

          <div className="chat-input-area">
            <input className="chat-input" type="text" placeholder="Type here..." />
            <button className="chat-send-btn">Send</button>
          </div>
        </div>
      )}

      {/* ================= EMERGENCY WINDOW ================= */}
      {emergencyOpen && (
        <div className="emergency-overlay">
          <div className="emergency-window">
            <div className="emergency-header">
              <span className="emergency-icon">⛔</span>
              <h3>24/7 Emergency Doctor Service</h3>
            </div>

            <p className="emergency-text">
              Connect with on-call doctors immediately for emergency assistance.
            </p>

            <div className="hotline-box">
              <p>Emergency Hotline</p>
              <h2>1-800-HEALTH-911</h2>
            </div>

            <a href="tel:18004325849" className="call-btn">📞 Call Now</a>
            <button className="video-btn">🎥 Video Consultation</button>

            <button className="close-btn" onClick={() => setEmergencyOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
