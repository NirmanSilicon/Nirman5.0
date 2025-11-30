import React from "react";

const doctors = [
  { id: 1, name: "Dr. Anjali Sharma", specialist: "Dermatologist", fee: 299 },
  { id: 2, name: "Dr. Rohit Mehta", specialist: "Cardiologist", fee: 499 },
  { id: 3, name: "Dr. Neha Gupta", specialist: "General Physician", fee: 199 }
];

export default function DoctorConsult() {
  return (
    <div style={{ padding: "24px 64px" }}>
      <h2>Doctor Consultation</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px", marginTop: "20px" }}>
        {doctors.map(doc => (
          <div key={doc.id} style={cardStyle}>
            <h4>{doc.name}</h4>
            <p>{doc.specialist}</p>
            <p><b>₹{doc.fee}</b></p>
            <button>Book Appointment</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
};
