import React from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/useCart";

const Medicines = () => {
  const location = useLocation();
  const { addToCart } = useCart();

  const medicines =
    location.state?.results || [
      { id: 1, name: "Paracetamol", price: 40 },
      { id: 2, name: "Crocin", price: 60 },
      { id: 3, name: "Vitamin C", price: 120 }
    ];

  return (
    <div style={{ padding: "24px 64px" }}>
      <h2>Medicines</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px" }}>
        {medicines.map((item, i) => (
          <div key={i} style={cardStyle}>
            <h4>{item.name}</h4>
            <p>₹{item.price || 99}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const cardStyle = {
  background: "#fff",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
};

export default Medicines;
