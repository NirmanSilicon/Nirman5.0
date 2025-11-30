import React, { useState, useEffect } from "react";
import { data, useLocation, useSearchParams } from "react-router-dom";
import { useCart } from "../context/useCart";

async function searchfetch(query) {
  try {
    const response = await fetch(
      `https://n92pbj45-5000.inc1.devtunnels.ms/api/search?q=${query}`
    );

    if (!response.ok) throw new Error("API Failed");

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API ERROR:", err);
    return null;
  }
}

const generateMockVariations = (medicineName) => {
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
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("q") || "Zerodol";

  const [searchTerm, setSearchTerm] = useState(searchText);
  const [currentResults, setCurrentResults] = useState([]);

  /* =================== LOAD DATA =================== */
  useEffect(() => {
    loadData(searchText);
  }, [searchText]);

  const loadData = async (term) => {
    const apiData = await searchfetch(term);

    if (apiData && Array.isArray(apiData) && apiData.length > 0) {
      console.log(apiData)
      const normalized = apiData.map((item, i) => ({
        id: item.id || i + 1,
        name: item.med_name || `${term}`,
        price: item.final_price
 || 150,
        form: item.drug_variant
 || "Tablet",
        tag: item.drug_manufacturer
,
        imageUrl:
           "https://placehold.co/600x400?text=Trivexa",
           gotToUrl: item.med_url,
      }));

      setCurrentResults(normalized);
    } else {
      setCurrentResults(generateMockVariations(term));
    }
  };

  /* =================== SEARCH =================== */

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    loadData(searchTerm);
  };

  return (
    <div style={{ padding: "24px 64px" }}>
      <h2>Product Variations</h2>

      <form onSubmit={handleSearch} style={{ maxWidth: 600 }}>
        <div style={searchBarStyle}>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medicine..."
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={() => window.location.href = "/medicine?q="+searchTerm} >Search</button>
        </div>
      </form>

      {currentResults.length > 0 ? (
        <div style={resultsGridStyle}>
          {currentResults.map((item) => (
            <div key={item.id} style={cardStyle}>
              <div style={imageCardStyle(item.imageUrl)}>
                <div style={tagStyle}>{item.tag}</div>
              </div>

              <div style={textBlockStyle} onClick={() => window.location.href = item.gotToUrl} >
                <h4>{item.name}</h4>
                <p>Form: {item.form}</p>
                <p style={{ fontWeight: "bold", color: "red" }}>
                  {item.price}
                </p>

                <button
                  style={addButton}
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                    })
                  }
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>We are Fetching the results. Please hold on.</p>
      )}
    </div>
  );
};

export default Medicine;

/* =================== STYLES =================== */

const imageCardStyle = (url) => ({
  height: 180,
  backgroundImage: `url(${url})`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
});

const resultsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 25,
  marginTop: 30,
};

const cardStyle = {
  borderRadius: 12,
  background: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  overflow: "hidden",
};

const textBlockStyle = { padding: 12, textAlign: "center" };

const tagStyle = {
  position: "absolute",
  top: 10,
  right: 10,
  background: "orange",
  color: "#fff",
  padding: "4px 10px",
};

const searchBarStyle = {
  display: "flex",
  border: "2px solid #3498db",
  borderRadius: 6,
  overflow: "hidden",
};

const inputStyle = { flex: 1, padding: 10, border: "none" };

const buttonStyle = {
  background: "#3498db",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
};

const addButton = {
  background: "#10967a",
  color: "#fff",
  border: "none",
  padding: 10,
  width: "100%",
  borderRadius: 6,
  cursor: "pointer",
};
