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
          <p><a href="#" title="We are a trusted healthcare platform offering fast and reliable access to essential medicines.
Our website provides safe home delivery of prescriptions and health products at affordable prices.
We also connect users with certified doctors for online consultations and medical guidance.
Our mission is to make quality healthcare accessible, convenient, and patient-friendly for everyone.
Your health and well-being are our top priority.">
    About
</a></p> 

            <p><a href="#" title="Join our growing team dedicated to transforming digital healthcare and improving patient well-being.
We offer exciting career opportunities in pharmacy operations, medical support, technology, and customer care.
Our workplace encourages innovation, learning, and compassionate service.
By working with us, you'll help deliver essential medicines, support doctor consultations, and make healthcare accessible to millions.
Build a meaningful career where your skills directly impact people’s health and lives.">
   Career
</a></p>
            <p><a href="#" title="We’re here to support you with all your healthcare needs—whether it’s ordering medicines or scheduling a doctor consultation.
Our customer support team is available to assist with inquiries, orders, prescriptions, and technical help.
You can reach out to us through phone, email, or our online helpdesk for quick and reliable assistance.
We value your feedback and are committed to providing a smooth, trustworthy healthcare experience.
Contact us anytime for a healthier and hassle-free journey with our services">
   Contact
</a></p>
          </div>
          <div>
            <h4>Legal</h4>
            <p><a href="#" title="By using our healthcare platform, you agree to access our services responsibly and provide accurate personal and medical information.
All medicines, consultations, and health-related services offered on our website follow regulatory guidelines, but they do not replace emergency medical care.
Users must upload valid prescriptions for restricted medicines and follow the doctor’s advice provided during consultations.
We are not liable for delays caused by third-party delivery partners or inaccurate information shared by users.
Continued use of our website means you accept all policies regarding privacy, payments, returns, and service usage.">
   Terms and conditions
</a></p>
            <p><a href="#" title="We are committed to protecting your personal and medical information with strict confidentiality and secure data practices.
Any details you share—including prescriptions, health history, or contact information—are used only to provide medicines, consultations, and related healthcare services.
We do not sell or share your data with third parties except those essential for service delivery, such as doctors or delivery partners.
All transactions and records are encrypted to ensure maximum security and privacy.
By using our website, you consent to the safe collection, storage, and use of your information as outlined in our privacy policy.">
   Privacy policy
</a></p>
            <p><a href="#" title="Orders can be cancelled within a limited time window before they are processed or dispatched.
Refunds are issued only for eligible items such as damaged, incorrect, or undelivered medicines, following proper verification.
Certain products—like temperature-sensitive medicines and opened medical packages—are not eligible for return or refund.
Refunds will be credited to your original payment method within the standard processing period.
By placing an order, you agree to follow our refund, replacement, and cancellation policies.">
   Refund & cancellation
</a></p>
          </div>
        </div>
        <p style={{ marginTop: "16px", fontSize: "0.75rem" }}>© {new Date().getFullYear()} Trivexa Health Pvt. Ltd.</p>
      </footer>
    </div>
  );
};

export default LayoutShell;
