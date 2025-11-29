import React, { useState, useEffect } from "react";
import "./App.css";
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
import Exercise from "./exercise";
import Diet from "./Diet";
import Plans from "./Plans";
import Meditation from "./Meditation";
import HealthVideos from "./HealthVideos"; // ✅ LIBRARY PAGE
import LabTests from "./LabTests";

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [factIndex, setFactIndex] = useState(0);

  // ✅ controls which page is shown below the toolbar
  const [activePage, setActivePage] = useState("home"); // "home" | "library" | later others

  const facts = [
    { image: fact1 },
    { image: fact2 },
    { image: fact3 },
    { image: fact4 },
    { image: fact5 },
    { image: fact6 },
    { image: fact7 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [facts.length]);

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
            onClick={() => setEmergencyOpen(true)}
          >
            <h2>24/7 EMERGENCY</h2>
          </button>
          <button className="icon-btn">🛒</button>
          <button className="icon-btn">👤</button>
        </div>
      </div>

      {/* ================= TOOL BAR ================= */}
      <div className="tool-bar">
        {[
          { name: "Home", icon: "🏠", key: "home" },
          { name: "Library", icon: "📘", key: "library" },
          { name: "Lab Tests", icon: "🧪", key: "lab-tests" },
          { name: "Plans", icon: "📋", key: "plans" },
          { name: "Exercise", icon: "🏃", key: "exercise" },
          { name: "Diet", icon: "🥗", key: "diet" },
          { name: "Therapy", icon: "💬", key: "therapy" },
          { name: "Meditation", icon: "🧘", key: "meditation" }
        ].map((item) => (
          <button
            key={item.name}
            className="tool-btn"
            onClick={() => setActivePage(item.key)} // ✅ change page here
          >
            <div className="tool-icon">{item.icon}</div>
            <p>{item.name}</p>
          </button>
        ))}
      </div>

      {/* ================= CONTENT AREA (CHANGES BASED ON activePage) ================= */}

      {/* ✅ HOME PAGE CONTENT – will disappear when Library is clicked */}
      {activePage === "home" && (
        <>
          {/* MAIN TAGLINE */}
          <h2 className="main-tagline">
            For Medicines And Doctor Consultation Choose Your Preferred Field Of Medicine
          </h2>

          {/* MEDICINE TABS */}
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

          {/* FACTS + CAMPS */}
          <div className="middle-section">
            <div className="facts-box fade">
              <h3>Health Facts</h3>
              <img
                src={facts[factIndex].image}
                alt="fact"
                className="fact-img"
              />
            </div>

            <div className="camp-box">
              <h3>Upcoming Medical Camps</h3>
              <div className="camp-card">📅 10 Dec – Free Eye Checkup</div>
              <div className="camp-card">📅 15 Dec – Mental Health Camp</div>
              <div className="camp-card">📅 20 Dec – Women Hygiene Camp</div>
            </div>
          </div>

          {/* ABOUT US */}
          <div className="about-us">
            <h2>About Us</h2>
            <p>
              Trivexa is a holistic healthcare and wellness platform integrating
              Allopathic, Ayurvedic and Homeopathic medical systems under one roof.
              We provide medicine delivery, lab tests, therapy, mental wellness,
              yoga, meditation and doctor consultations at one place.
            </p>
          </div>

          {/* CHATBOT BUTTON */}
          <button
            className="chatbot-btn"
            onClick={() => setChatOpen(!chatOpen)}
          >
            <FaRobot size={60} />
          </button>

          {/* CHATBOT WINDOW */}
          {chatOpen && (
            <div className="chat-window">
              <div className="chat-header">
                <div>
                  <h4>AI Medical Assistant</h4>
                  <p>Ask me anything about your health concerns</p>
                </div>
                <span
                  className="chat-close"
                  onClick={() => setChatOpen(false)}
                >
                  ✖
                </span>
              </div>

              <div className="chat-body">
                <div className="bot-message">
                  Hello! I'm your AI medical assistant. How can I help you today?
                </div>
              </div>

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
        </>
      )}

      {/* ✅ LIBRARY PAGE – appears BELOW TOOLBAR when Library is clicked */}
      {activePage === "library" && (
        <HealthVideos />
      )}
      {/* ✅ LIBRARY PAGE – appears BELOW TOOLBAR when Library is clicked */}
      {activePage === "lab-tests" && (
        <LabTests />
      )}
     {/* ✅ LIBRARY PAGE – appears BELOW TOOLBAR when Library is clicked */}
      {activePage === "plans" && (
        <Plans />
      )}
     {/* ✅ LIBRARY PAGE – appears BELOW TOOLBAR when Library is clicked */}
      {activePage === "exercise" && (
        <Exercise />
      )}
  {/* ✅ LIBRARY PAGE – appears BELOW TOOLBAR when Library is clicked */}
      {activePage === "diet" && (
        <Diet />
      )}
  {/* ✅ LIBRARY PAGE – appears BELOW TOOLBAR when Library is clicked */}
      {activePage === "meditation" && (
        <Meditation />
      )}


      {/* You can add similar conditions later for other pages:
          {activePage === "exercise" && <ExercisePage />} etc.
      */}

      {/* ================= EMERGENCY WINDOW (COMMON FOR ALL PAGES) ================= */}
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


            <button
              className="close-btn"
              onClick={() => setEmergencyOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}




