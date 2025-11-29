import React from "react";

export default function PlusMembership() {
  return (
    <div style={wrapStyle}>
      <h2>PLUS Membership</h2>
      <ul>
        <li>Extra 5% discount on all medicines</li>
        <li>Free delivery</li>
        <li>Priority doctor consultation</li>
      </ul>
      <h3>₹999 / year</h3>
      <button>Activate Membership</button>
    </div>
  );
}

const wrapStyle = {
  padding: "80px",
  textAlign: "center"
};
