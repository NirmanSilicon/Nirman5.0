import React from "react";

const tests = [
  { id: 1, name: "Complete Blood Count", price: 399 },
  { id: 2, name: "Thyroid Test", price: 499 },
  { id: 3, name: "Diabetes Check", price: 299 }
];

export default function LabTests() {
  return (
    <div style={{ padding: "24px 64px" }}>
      <h2>Lab Tests</h2>

      {tests.map(test => (
        <div key={test.id} style={rowStyle}>
          <span>{test.name}</span>
          <span>₹{test.price}</span>
          <button>Book Test</button>
        </div>
      ))}
    </div>
  );
}

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  background: "#fff",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "10px"
};
