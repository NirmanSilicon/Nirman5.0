
import React from "react";
import { useAuth } from "../context/useAuth";



export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "24px 64px" }}>
      <h2>User Dashboard</h2>
      <p>Welcome <b>{user?.name || "Guest"}</b></p>

      <ul>
        <li>My Orders</li>
        <li>My Appointments</li>
        <li>Saved Addresses</li>
      </ul>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
