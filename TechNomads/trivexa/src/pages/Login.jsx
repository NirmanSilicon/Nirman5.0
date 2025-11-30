import React, { useState } from "react";
import { useAuth } from "../context/useAuth";


import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name: "User", email });
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "80px 20px", display: "flex", justifyContent: "center" }}>
      <form
        onSubmit={handleSubmit}
        style={{ background: "#fff", padding: "24px", borderRadius: "12px", width: "320px", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}
      >
        <h2>Log in</h2>
        <input
          type="email"
          placeholder="Email"
          style={{ width: "100%", padding: "8px", marginTop: "12px" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={{ width: "100%", padding: "8px", marginTop: "8px" }}
          required
        />
        <button type="submit" style={{ marginTop: "12px", width: "100%" }}>
          Log in
        </button>
        <p style={{ marginTop: "8px", fontSize: "0.85rem" }}>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
