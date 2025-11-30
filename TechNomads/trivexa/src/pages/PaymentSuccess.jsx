import React from "react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <h2>✅ Payment Successful</h2>
      <p>Your order has been placed successfully.</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
}
