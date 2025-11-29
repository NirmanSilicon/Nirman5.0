import React from "react";
import { useCart } from "../context/useCart";


import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { items, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div style={{ padding: "24px 64px" }}>
        <h2>Your cart is empty</h2>
        <p>Add some medicines to continue.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 64px" }}>
      <h2>Your Cart</h2>
      {items.map((item) => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", padding: "8px 0" }}>
          <div>
            <strong>{item.name}</strong>
            <div>Qty: {item.qty}</div>
          </div>
          <div>
            ₹{item.price * item.qty}{" "}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        </div>
      ))}
      <h3 style={{ marginTop: "16px" }}>Total: ₹{total}</h3>
      <button onClick={() => navigate("/checkout")} style={{ marginTop: "10px" }}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartPage;
