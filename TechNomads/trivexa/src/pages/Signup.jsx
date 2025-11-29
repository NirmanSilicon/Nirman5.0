import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div style={{ padding: "80px 20px", display: "flex", justifyContent: "center" }}>
      <form
        style={{ background: "#fff", padding: "24px", borderRadius: "12px", width: "320px", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}
      >
        <h2>Create account</h2>
        <input type="text" placeholder="Name" style={{ width: "100%", padding: "8px", marginTop: "12px" }} />
        <input type="email" placeholder="Email" style={{ width: "100%", padding: "8px", marginTop: "8px" }} />
        <input type="password" placeholder="Password" style={{ width: "100%", padding: "8px", marginTop: "8px" }} />
        <button type="submit" style={{ marginTop: "12px", width: "100%" }}>
          Sign up
        </button>
        <p style={{ marginTop: "8px", fontSize: "0.85rem" }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
