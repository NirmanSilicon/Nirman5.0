import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";



const HomePage = () => {
  const heroRef = useRef(null);
  const categoryStripRef = useRef(null);
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    if (categoryStripRef.current) {
      gsap.fromTo(
        categoryStripRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    }
  }, []);

  /* 🔍 SEARCH LOGIC */
  const handleSearch = () => {
    if (!searchText.trim()) return;
    // Navigate to medicine page after search
    navigate("/medicine?q="+searchText, { });
  };

  /* 📄 PRESCRIPTION UPLOAD LOGIC */
  const handlePrescriptionUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPrescriptionFile(file);
    setUploadSuccess(true);

    // Simulate backend upload
    setTimeout(() => {
      alert("Prescription uploaded successfully!");
    }, 800);
  };

  return (
    <div className="pe-page">
      {/* HERO */}
      <section className="pe-hero" ref={heroRef}>
        <h1 className="pe-hero-title">What are you looking for?</h1>

        {/* UPLOAD PRESCRIPTION */}
        <div className="pe-hero-top-row">
          <div className="pe-hero-prescription">
            <span className="pe-presc-icon">📄</span>
            <span>
              {prescriptionFile
                ? prescriptionFile.name
                : "Order with prescription."}
            </span>

            <label className="pe-link-button">
              UPLOAD NOW &gt;
              <input
                type="file"
                hidden
                accept="image/*,.pdf"
                onChange={handlePrescriptionUpload}
              />
            </label>
          </div>
        </div>

        {uploadSuccess && (
          <p style={{ color: "green", fontSize: "0.85rem" }}>
            ✅ Prescription uploaded successfully
          </p>
        )}

        {/* SEARCH BAR */}
        <div className="pe-search-row">
          <div className="pe-search-input-wrapper">
            <span className="pe-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for medicines / health products"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button className="pe-search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
        {/* AI MODE BUTTON */}
<div className="pe-ai-wrapper">
  <button className="ai-btn" onClick={() => navigate("/ai")}>
  <h2>✨ AI Mode</h2>
</button>
</div>

      </section>
       <section className="pe-banners">
        <div className="pe-banner pe-banner-left">
          <div className="pe-banner-badge">FLASH SALE</div>
          <h2>Buy 1 Get 1 FREE</h2>
          <p>On full body health checkups</p>
          <p className="pe-banner-footnote">
            Extra 20% credits on PharmaPlus membership
          </p>
        </div>

        <div className="pe-banner pe-banner-middle">
          <h2>Skin Brightening Range</h2>
          <p>Flat 30% OFF on top derma brands</p>
        </div>

        <div className="pe-banner pe-banner-right">
  <h2>Minor issue?</h2>
  <p>Chat with a doctor in minutes on WhatsApp</p>

  <a
    href="https://wa.me/918917574294?text=Hello%2C%20I%20need%20a%20doctor%20consultation"
    className="pe-wa-btn"
    target="_blank"
    rel="noopener noreferrer"
  >
    ORDER ON WHATSAPP
  </a>
</div>

      </section>
      {/* AI MODE BUTTON */}


    </div>
  );
};
    
export default HomePage;
