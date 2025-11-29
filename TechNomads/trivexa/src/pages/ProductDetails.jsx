import React from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/useCart";


export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = {
    id,
    name: "Sample Medicine",
    price: 199,
    description: "This is a detailed description of the medicine."
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h3>₹{product.price}</h3>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}
