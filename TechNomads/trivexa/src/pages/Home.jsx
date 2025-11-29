import React, { useState, useEffect } from "react";
import "./App.css";
import { Link, Routes, Route, Outlet } from "react-router-dom";
import logo from "./logo.jpeg";
import { FaRobot } from "react-icons/fa";


// Medicine Images
import ayurImg from "./ayur.jpg";
import homeoImg from "./homeo.jpg";
import allopathyImg from "./all.jpg";

// Fact Images
import fact1 from "./fact1.jpeg";
import fact2 from "./fact2.jpeg";
import fact3 from "./fact3.jpeg";
import fact4 from "./fact4.jpeg";
import fact5 from "./fact5.jpeg";
import fact6 from "./fact6.jpeg";
import fact7 from "./fact7.jpeg";
import "./App.css";
import Home from "./Home";
import Library from "./HealthVideos";
import LabTests from "./LabTests";
import Plans from "./Plans";
import Exercise from "./exercise";
import Diet from "./Diet";
import Therapy from "./Therapy";
import Meditation from "./Meditation";

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [factIndex, setFactIndex] = useState(0);

  const facts = [
    {
      
      image: fact1,
    },
    {
      
      image: fact2,
    },
    {
      
      image: fact3,
    },
    {
      
      image: fact4,
    },
     {
      
      image: fact5,
    },
     {
      
      image: fact6,
    },
     {
      
      image: fact7,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
function Layout() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  return (
    <div className="container">

      {/* ================= TOP BAR ================= */}
      <div className="top-bar">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="logo" />
          <span className="tagline">Your One Stop Solution To Healthcare</span>
        </div>

        <div className="top-buttons">
          <button
            className="emergency-btn"
            onClick={() => setEmergencyOpen(!emergencyOpen)}
          >
           <h2>24/7 EMERGENCY </h2>
          </button>
          <button className="icon-btn">🛒</button>
          <button className="icon-btn">👤</button>
        </div>
      </div>

      {/* ================= TOOL BAR ================= */}
      <div className="tool-bar">
        
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="library" element={<Library />} />
        <Route path="lab-tests" element={<LabTests />} />
        <Route path="plans" element={<Plans />} />
        <Route path="exercise" element={<Exercise />} />
        <Route path="diet" element={<Diet />} />
        <Route path="therapy" element={<Therapy />} />
        <Route path="meditation" element={<Meditation />} />
      </Route>
    </Routes>
 
        {[
          { name: "Home", icon: "🏠", path: "/" },
          { name: "Library", icon: "📘", path: "/library" },
          { name: "Lab Tests", icon: "🧪", path: "/lab-tests" },
          { name: "Plans", icon: "📋", path: "/plans" },
          { name: "Exercise", icon: "🏃", path: "/exercise" },
          { name: "Diet", icon: "🥗", path: "/diet" },
          { name: "Therapy", icon: "💬", path: "/therapy" },
          { name: "Meditation", icon: "🧘", path: "/meditation" },
        ].map((item) => (
          <Link key={item.name} to={item.path} className="tool-btn">
            <div className="tool-icon">{item.icon}</div>
            <p>{item.name}</p>
          </Link>
        ))}
      </div>
{/* ✅ PAGE CONTENT WILL CHANGE HERE */}
      <div className="page-content">
        <Outlet />
      </div>

      {/* ================= MAIN TAGLINE ================= */}
      <h2 className="main-tagline">
        For Medicines And Doctor Consultation Choose Your Preferred Field Of Medicine
      </h2>

      {/* ================= MEDICINE TABS ================= */}
      <div className="medicine-tabs">
        <div className="medicine-tab">
          <h3>Ayurveda</h3>
          <img src={ayurImg} alt="Ayurveda" />
        </div>

        <div className="medicine-tab">
          <h3>Homeopathy</h3>
          <img src={homeoImg} alt="Homeopathy" />
        </div>

        <div className="medicine-tab">
          <h3>Allopathy</h3>
          <img src={allopathyImg} alt="Allopathy" />
        </div>
      </div>

      {/* ================= FACTS + CAMPS ================= */}
      <div className="middle-section">

        {/* FACTS BOX */}
        <div className="facts-box fade">
          <h3>Health Facts</h3>
          <img
            src={facts[factIndex].image}
            alt="fact"
            className="fact-img"
          />
          <p className="fact-text">{facts[factIndex].text}</p>
        </div>

        {/* CAMPS BOX */}
        <div className="camp-box">
          <h3>Upcoming Medical Camps</h3>
          <div className="camp-card">📅 10 Dec – Free Eye Checkup</div>
          <div className="camp-card">📅 15 Dec – Mental Health Camp</div>
          <div className="camp-card">📅 20 Dec – Women Hygiene Camp</div>
        </div>
      </div>

      {/* ================= ABOUT US ================= */}
      <div className="about-us">
        <h2>About Us</h2>
        <p>
          Trivexa is a holistic healthcare and wellness platform integrating
          Allopathic, Ayurvedic and Homeopathic medical systems under one roof.
          We provide medicine delivery, lab tests, therapy, mental wellness,
          yoga, meditation and doctor consultations at one place.
        </p>
      </div>

      {/* ================= CHATBOT ================= */}
      <button className="chatbot-btn" onClick={() => setChatOpen(!chatOpen)}>
       <FaRobot size={65} />
       

      </button>

      {chatOpen && (
  <div className="chat-window">
    
    {/* Header */}
    <div className="chat-header">
      <div>
        <h4>AI Medical Assistant</h4>
        <p>Ask me anything about your health concerns</p>
      </div>
      <span className="chat-close" onClick={() => setChatOpen(false)}>✖</span>
    </div>

    {/* Chat Body */}
    <div className="chat-body">
      <div className="bot-message">
        Hello! I'm your AI medical assistant. How can I help you today?
      </div>
    </div>

    {/* Input Area */}
    <div className="chat-input-area">
      <input
        type="text"
        placeholder="Type your health question..."
        className="chat-input"
      />
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
        Connect with our on-call doctors immediately for emergency medical assistance.
      </p>

      <div className="hotline-box">
        <p>Emergency Hotline</p>
        <h2>1-800-HEALTH-911</h2>
      </div>

      <a href="tel:18004325849" className="call-btn">
        📞 Call Now
      </a>

      <button className="video-btn">
        🎥 Video Consultation
      </button>

      <button className="close-btn" onClick={() => setEmergencyOpen(false)}>
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}}



