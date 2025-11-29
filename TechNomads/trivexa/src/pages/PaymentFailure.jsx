import React from "react";
import { Link } from "react-router-dom";

export default function PaymentFailure() {
  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <h2>❌ Payment Failed</h2>
      <p>Something went wrong. Please try again.</p>
      <Link to="/checkout">Retry Payment</Link>
    </div>
  );
}
