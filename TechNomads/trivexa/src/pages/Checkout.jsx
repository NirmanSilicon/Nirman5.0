import React from "react";
import { useCart } from "../context/useCart";


import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { total, clearCart } = useCart();
  const navigate = useNavigate();

  function placeOrder() {
    clearCart();
    navigate("/payment-success");
  }

  return (
    <div style={{ padding: "80px" }}>
      <h2>Checkout</h2>
      <p>Total Amount: ₹{total}</p>

      <input placeholder="Delivery Address" style={inputStyle} />
      <input placeholder="Phone Number" style={inputStyle} />

      <button onClick={placeOrder}>Pay & Place Order</button>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  margin: "10px 0"
};
