import { useState } from "react";
import "./LabTests.css";

const testsData = [
  { name: "Complete Blood Count (CBC)", desc: "General blood health analysis", price: 400, home: true },
  { name: "Lipid Profile", desc: "Cholesterol and triglycerides test", price: 600, home: true },
  { name: "Thyroid Function Test", desc: "T3, T4, TSH levels", price: 550, home: true },
  { name: "Blood Sugar Test (Fasting)", desc: "Glucose level measurement", price: 100, home: true },
  { name: "Urine Routine Test", desc: "Comprehensive urine analysis", price: 200, home: true },
  { name: "Vitamin D Test", desc: "Vitamin D3 level check", price: 800, home: true },
  { name: "Vitamin B12 Test", desc: "B12 deficiency detection", price: 450, home: true },
  { name: "Liver Function Test (LFT)", desc: "Liver enzyme profile", price: 700, home: true },
  { name: "Kidney Function Test (KFT)", desc: "Creatinine & urea test", price: 650, home: true },
  { name: "HbA1c", desc: "Average sugar level (3 months)", price: 500, home: true }
];

export default function LabTests() {
  const [filter, setFilter] = useState("all");
  const [selectedTest, setSelectedTest] = useState(null);
  const [booking, setBooking] = useState({
    type: "",
    date: "",
    time: "",
    address: ""
  });

  const filteredTests = testsData.filter((test) => {
    if (filter === "home") return test.home;
    if (filter === "clinic") return !test.home;
    return true;
  });

  return (
    <div className="lab-container">

      {/* ================= HEADER ================= */}
      <div className="lab-header">
        <h2>Lab Tests</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Tests</option>
          <option value="home">Home Collection</option>
        </select>
      </div>

      {/* ================= TEST GRID ================= */}
      <div className="test-grid">
        {filteredTests.map((test, i) => (
          <div key={i} className="test-card">
            <div>
              <h3 className="test-name">{test.name}</h3>
              <p className="test-desc">{test.desc}</p>
              <p className="test-price">₹{test.price}</p>

              {test.home && (
                <span className="home-badge">🏠 Home Collection</span>
              )}
            </div>

            <button
              className="book-btn"
              onClick={() => setSelectedTest(test)}
            >
              Book Test
            </button>
          </div>
        ))}
      </div>

      {/* ================= BOOKING MODAL ================= */}
      {selectedTest && (
        <div className="modal-overlay">
          <div className="modal-box">

            <button
              className="close-btn"
              onClick={() => setSelectedTest(null)}
            >
              ✕
            </button>

            <h3>Book {selectedTest.name}</h3>
            <p>Choose collection type and preferred time</p>

            <div className="form-group">
              <label>Collection Type</label>
              <select
                onChange={(e) =>
                  setBooking({ ...booking, type: e.target.value })
                }
              >
                <option value="">Choose collection type</option>
                <option value="Home">Home Collection</option>
                <option value="Clinic">Clinic Visit</option>
              </select>
            </div>

            <div className="form-group">
              <label>Preferred Date</label>
              <input
                type="date"
                onChange={(e) =>
                  setBooking({ ...booking, date: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Preferred Time</label>
              <select
                onChange={(e) =>
                  setBooking({ ...booking, time: e.target.value })
                }
              >
                <option value="">Choose time slot</option>
                <option value="7-9 AM">7:00 AM - 9:00 AM</option>
                <option value="9-11 AM">9:00 AM - 11:00 AM</option>
                <option value="11-1 PM">11:00 AM - 1:00 PM</option>
              </select>
            </div>

            <div className="form-group">
              <label>Home Address</label>
              <input
                type="text"
                placeholder="Enter full address"
                onChange={(e) =>
                  setBooking({ ...booking, address: e.target.value })
                }
              />
            </div>

            <button className="modal-book-btn">
              Book Test
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

