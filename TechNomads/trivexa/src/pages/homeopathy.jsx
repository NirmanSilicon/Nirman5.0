import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg"; // adjust if different
import homeoImg from "../assets/homeo.jpg"; // thumbnail if needed

export default function Homeopathy() {
  // simple cart state (local to page). You can lift to context later.
  const [cart, setCart] = useState([]);
  const [consultType, setConsultType] = useState("");
  const [medCategory, setMedCategory] = useState("");

  const products = [
    { id: 1, name: "Arnica Drops", category: "Pain Relief", price: 199 },
    { id: 2, name: "Nux Vomica Tablets", category: "Digestive", price: 149 },
    { id: 3, name: "Pulsatilla Syrup", category: "Cold & Cough", price: 179 },
    { id: 4, name: "Calcarea Phos Capsules", category: "Bone & Joint", price: 259 },
  ];

  const categories = ["All", "Pain Relief", "Digestive", "Cold & Cough", "Bone & Joint"];

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const filteredProducts =
    medCategory === "" || medCategory === "All"
      ? products
      : products.filter((p) => p.category === medCategory);

  return (
    <div className="homeopathy-page" style={{ minHeight: "100vh", background: "linear-gradient(120deg,#78adb7ff,#7eb9d3ff,#FDE68A)" }}>
      {/* TOPBAR: same chrome as home */}
      <div className="top-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px", background: "rgba(255,255,255,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={logo} alt="Trivexa" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#053640" }}>Your One Stop Solution To Healthcare</h2>
            <div style={{ fontSize: 12, color: "#1f3f3f", opacity: 0.8 }}>Home / Homeopathy</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* Emergency -> link to emergency page */}
          <Link to="/emergency" style={{ textDecoration: "none" }}>
            <button style={{ background: "#ff2b2b", color: "#fff", padding: "12px 18px", borderRadius: 28, fontWeight: 700, border: "none" }}>
              24/7 EMERGENCY
            </button>
          </Link>

          {/* Cart: small circle showing count */}
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <div style={{ width: 48, height: 48, borderRadius: 999, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
              🛒
              <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 700 }}>{cart.length}</span>
            </div>
          </Link>

          {/* Profile */}
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <div style={{ width: 48, height: 48, borderRadius: 999, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
              👤
            </div>
          </Link>
        </div>
      </div>

      {/* taskbar (the row with icons) - reuse existing styling if available */}
      <div className="taskbar" style={{ marginTop: 18, padding: "18px 28px", background: "#3a9aa6", display: "flex", gap: 18, overflowX: "auto" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="tool-btn" style={{ minWidth: 140, padding: 18, borderRadius: 12, background: "#bfe3e7", boxShadow: "inset 0 8px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 28 }}>🏠</div>
            <p style={{ margin: 0, marginTop: 8, textAlign: "center" }}>Home</p>
          </div>
        </Link>

        {/* other tool buttons (non-links for now) */}
        {[
          { name: "Library", icon: "📘" },
          { name: "Lab Tests", icon: "🧪" },
          { name: "Plans", icon: "📋" },
          { name: "Exercise", icon: "🏃" },
          { name: "Diet", icon: "🥗" },
          { name: "Therapy", icon: "💬" },
          { name: "Meditation", icon: "🧘" },
        ].map((t) => (
          <div key={t.name} className="tool-btn" style={{ minWidth: 140, padding: 18, borderRadius: 12, background: "#bfe3e7", textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>{t.icon}</div>
            <p style={{ margin: 0, marginTop: 8 }}>{t.name}</p>
          </div>
        ))}
      </div>

      {/* Page intro */}
      <div style={{ padding: "26px 28px" }}>
        <h1 style={{ textAlign: "center", margin: "8px 0 24px 0", color: "#073033" }}>Homeopathy — Consultations & Medicine Store</h1>

        {/* two columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Left: Doctor Consultations */}
          <div style={{ background: "rgba(255,255,255,0.9)", padding: 20, borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <h3 style={{ marginTop: 0 }}>Doctor Consultations</h3>
            <p style={{ marginTop: 6, color: "#333" }}>Choose the kind of homeopathy doctor you want to consult with and book a slot.</p>

            <label style={{ display: "block", marginTop: 12, fontWeight: 700 }}>Consultation Type</label>
            <select value={consultType} onChange={(e) => setConsultType(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, marginTop: 8 }}>
              <option value="">Select Consultation Type</option>
              <option>General Homeopathy</option>
              <option>Chronic Diseases Specialist</option>
              <option>Child Specialist (Homeopathy)</option>
              <option>Skin & Allergies</option>
            </select>

            <label style={{ display: "block", marginTop: 12, fontWeight: 700 }}>Preferred Mode</label>
            <select style={{ width: "100%", padding: 12, borderRadius: 8, marginTop: 8 }}>
              <option>Video Consultation</option>
              <option>Audio Call</option>
              <option>Chat</option>
            </select>

            <button style={{ marginTop: 16, background: "#0ea5a4", color: "#fff", padding: "12px 18px", borderRadius: 10, border: "none", fontWeight: 700 }}>
              Book Consultation
            </button>

            <div style={{ marginTop: 18 }}>
              <h4 style={{ marginBottom: 8 }}>Available Doctors</h4>
              <ul style={{ paddingLeft: 16 }}>
                <li>Dr. S. Kumar — 9 yrs experience</li>
                <li>Dr. A. Mehta — Women & Child specialist</li>
                <li>Dr. R. Singh — Chronic & Lifestyle</li>
              </ul>
            </div>
          </div>

          {/* Right: Medicine Store */}
          <div style={{ background: "rgba(255,255,255,0.95)", padding: 20, borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <h3 style={{ marginTop: 0 }}>Homeopathy Medicine Store</h3>
            <p style={{ marginTop: 6, color: "#333" }}>Pick a category to filter products. Add to cart — the cart icon on top shows count.</p>

            <label style={{ display: "block", marginTop: 12, fontWeight: 700 }}>Category</label>
            <select value={medCategory} onChange={(e) => setMedCategory(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, marginTop: 8 }}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
              {filteredProducts.map((p) => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "#f7faf9", borderRadius: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img src={homeoImg} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: "#666" }}>{p.category}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <div style={{ fontWeight: 800 }}>₹{p.price}</div>
                    <button onClick={() => addToCart(p)} style={{ background: "#0ea5a4", color: "#fff", padding: "8px 12px", borderRadius: 8, border: "none" }}>
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* simple cart preview */}
        <div style={{ marginTop: 22 }}>
          <h4>Cart preview</h4>
          {cart.length === 0 ? (
            <div style={{ color: "#666" }}>Cart is empty.</div>
          ) : (
            <ul>
              {cart.map((c, i) => (
                <li key={i}>
                  {c.name} — ₹{c.price}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
