import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/useCart";

/* =================== MEDICINE VARIATIONS DATA =================== */

const MEDICINE_VARIATIONS = [
  { strength: '650mg Tablet (Strip of 10)', form: 'Tablet', priceOffset: 15, tag: 'High Strength', img: 'https://via.placeholder.com/250x180/90ee90/000000?text=Tablet+Strip' },
  { strength: '500mg Tablet (Strip of 15)', form: 'Tablet', priceOffset: 5, tag: 'Standard Dose', img: 'https://via.placeholder.com/250x180/b0e0e6/000000?text=Pill+Pack' },
  { strength: '250mg Suspension (100ml)', form: 'Syrup', priceOffset: 30, tag: 'Child/Liquid', img: 'https://via.placeholder.com/250x180/add8e6/000000?text=Syrup+Bottle' },
  { strength: '100mg Capsule (Box of 30)', form: 'Capsule', priceOffset: 25, tag: 'Extended Release', img: 'https://via.placeholder.com/250x180/ffb6c1/000000?text=Capsule+Box' },
  { strength: '500mg Tablet (Generic Brand)', form: 'Tablet', priceOffset: -5, tag: 'Best Value', img: 'https://via.placeholder.com/250x180/f08080/000000?text=Generic+Pills' },
  { strength: '200mg Injection (Single Vial)', form: 'Injection', priceOffset: 50, tag: 'Clinic Use', img: 'https://via.placeholder.com/250x180/d3d3d3/000000?text=Injection+Vial' },
  { strength: '5% Topical Gel (50g Tube)', form: 'Gel', priceOffset: 40, tag: 'Topical Use', img: 'https://via.placeholder.com/250x180/ffffe0/000000?text=Gel+Tube' },
  { strength: '150mg Effervescent Tablet', form: 'Effervescent', priceOffset: 20, tag: 'Quick Absorb', img: 'https://via.placeholder.com/250x180/afeeee/000000?text=Effervescent' },
];

const generateMockVariations = (medicineName) => {
  const basePrice = Math.floor(Math.random() * 50) + 120; 

  return MEDICINE_VARIATIONS.map((variation, i) => {
    const finalPrice = basePrice + variation.priceOffset;

    return {
      id: i + 1,
      name: `${medicineName} ${variation.strength}`,
      baseName: medicineName,
      price: finalPrice > 100 ? finalPrice : 100,
      form: variation.form,
      tag: variation.tag,
      imageUrl: variation.img,
    };
  });
};

/* =================== MAIN MEDICINE COMPONENT =================== */

const Medicine = () => {
  const location = useLocation();
  const { addToCart } = useCart();

  const initialSearchTerm = location.state?.searchTerm || "Zerodol";
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const [currentResults, setCurrentResults] = useState(() => {
    if (location.state?.results && location.state.results.length > 0) {
      return location.state.results;
    }
    return generateMockVariations(initialSearchTerm);
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();

    if (term !== "") {
      setCurrentResults(generateMockVariations(term));
    } else {
      setCurrentResults([]);
    }
  };

  return (
    <div style={{ padding: "24px 64px" }}>
      <h2 style={{ color: "#2c3e50" }}>Product Variations</h2>

      {/* ✅ SEARCH BAR */}
      <div style={{ padding: "20px 0 40px 0", borderBottom: "1px solid #eee" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", maxWidth: "600px" }}>
          <div style={searchBarStyle}>
            <input
              type="text"
              placeholder="Search for a base medicine name (e.g., Paracetamol)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Search
            </button>
          </div>
        </form>
      </div>

      {currentResults.length > 0 && (
        <>
          <h3 style={{ marginBottom: "25px" }}>
            Available Variations for{" "}
            <span style={{ fontWeight: "bold", color: "#10967a" }}>
              {searchTerm}
            </span>
          </h3>

          <div style={resultsGridStyle}>
            {currentResults.map((item, i) => (
              <div key={i} style={{ ...cardStyle, padding: "0" }}>
                
                <div style={imageCardStyle(item.imageUrl)}>
                  <div style={tagStyle}>{item.tag}</div>
                </div>

                <div style={textBlockStyle}>
                  <h4>{item.name}</h4>
                  <p>Form: {item.form}</p>
                  <p style={{ fontWeight: "800", fontSize: "1.5em", color: "#e74c3c" }}>
                    ₹{item.price}
                  </p>

                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                      })
                    }
                    style={addButton}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {currentResults.length === 0 && (
        <p style={{ marginTop: "30px", color: "#888" }}>
          No variations found for "{searchTerm}"
        </p>
      )}
    </div>
  );
};

export default Medicine;

/* =================== STYLES =================== */

const imageCardStyle = (imageUrl) => ({
  height: "180px",
  backgroundColor: "#f8f8f8",
  borderRadius: "16px 16px 0 0",
  backgroundImage: `url(${imageUrl})`,
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
});

const textBlockStyle = { padding: "10px", textAlign: "center" };

const searchBarStyle = {
  display: "flex",
  width: "100%",
  border: "2px solid #3498db",
  borderRadius: "8px",
  overflow: "hidden",
};

const inputStyle = { flexGrow: 1, padding: "12px 15px", border: "none" };

const buttonStyle = {
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  padding: "12px 25px",
  fontWeight: "bold",
};

const resultsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "25px",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
  overflow: "hidden",
  borderTop: "5px solid #10967a",
};

const tagStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "#f39c12",
  color: "white",
  padding: "4px 10px",
  borderRadius: "8px",
  fontSize: "0.75em",
};

const addButton = {
  backgroundColor: "#10967a",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  width: "100%",
};
