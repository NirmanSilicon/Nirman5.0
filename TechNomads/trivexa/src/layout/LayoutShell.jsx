import React from "react";
import { Link, Outlet } from "react-router-dom";

const LayoutShell = () => {
  return (
    <div className="pe-page">
      {/* HEADER – reusing your existing header structure but with Links */}
      <header className="pe-header">
        <div className="pe-header-left">
          <div className="pe-logo">
            <span className="pe-logo-icon">+</span>
            <span className="pe-logo-text">Trivexa</span>
          </div>

          <div className="pe-location">
            <span className="pe-location-label">Express delivery to</span>
            <button className="pe-location-btn">
              400001 Mumbai <span className="pe-location-arrow">▼</span>
            </button>
          </div>
        </div>

        <nav className="pe-nav">
          <Link to="/medicine">Medicine</Link>
          
          <Link to="/doctor">Doctor Consult</Link>
          <Link to="/lab">Lab Tests ▾</Link>
          <Link to="/plus">PLUS</Link>
          <Link to="/insights">Health Insights ▾</Link>
          <Link to="/offers">Offers</Link>
        </nav>

        <div className="pe-header-right">
          <Link to="/login" className="pe-header-link">
            Hello, Log in
          </Link>
          <Link to="/offers" className="pe-header-link">
            Offers
          </Link>
          <Link to="/cart" className="pe-cart">
            <span>🛒</span>
            <span>Cart</span>
          </Link>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main>
        <Outlet />
      </main>

      {/* SIMPLE FOOTER */}
      <footer style={{ padding: "24px 64px", background: "#0b1120", color: "#e5e7eb", marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h3>About Trivexa</h3>
            <p style={{ maxWidth: "320px", fontSize: "0.85rem" }}>
              Trivexa is your one-stop platform for medicines, doctor consults, and lab tests.
            </p>
          </div>
          <div>
            <h4>Company</h4>
            <p>About</p>
            <p>Careers</p>
            <p>Contact</p>
          </div>
          <div>
            <h4>Legal</h4>
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
            <p>Refund & Cancellation</p>
          </div>
        </div>
        <p style={{ marginTop: "16px", fontSize: "0.75rem" }}>© {new Date().getFullYear()} Trivexa Health Pvt. Ltd.</p>
      </footer>
    </div>
  );
};

export default LayoutShell;
