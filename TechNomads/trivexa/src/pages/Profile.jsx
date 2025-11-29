import React from "react";
import "./profile.css";

export default function Profile() {
  // Mock user data (will be replaced with real data after signup integration)
  const user = {
    name: "Aisha Sharma",
    phone: "+91 98765 43210",
    email: "aisha@example.com",
    profilePic: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  };

  const orders = [
    { id: 1, item: "Ayurvedic Medicine Pack", date: "22 Nov 2025", status: "Delivered" },
    { id: 2, item: "Vitamin Supplements", date: "28 Nov 2025", status: "In Transit" },
  ];

  const addresses = [
    "Sector 10, Bhilai, Chhattisgarh",
    "Korba Residency, Korba, CG",
  ];

  return (
    <div className="profile-container">

      <div className="profile-header">
        <img src={user.profilePic} alt="Profile" className="profile-img" />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{user.phone}</p>
      </div>

      <div className="section">
        <h3><b>My Orders</b></h3>
        {orders.map((o) => (
          <div key={o.id} className="order-card">
            <strong>{o.item}</strong>
            <p>Date: {o.date}</p>
            <p>Status: {o.status}</p>
          </div>
        ))}
      </div>

      <div className="section">
        <h3><b>Saved Addresses</b></h3>
        {addresses.map((addr, i) => (
          <div key={i} className="address-card">
            {addr}
          </div>
        ))}
      </div>

    </div>
  );
}
