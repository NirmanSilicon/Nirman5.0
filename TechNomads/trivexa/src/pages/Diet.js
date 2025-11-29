import React from "react";

export default function DietPlans() {
  const downloadPlan = (title) => {
    alert(`Downloading: ${title}`);
  };

  return (
    <>
      <style>{`
        .diet-container {
          padding: 40px;
          background: #78adb7ff;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        .diet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 25px;
        }

        .diet-card {
          background: #99cfdcff;;
          border-radius: 18px;
          padding: 25px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          border: 1px solid white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .diet-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .diet-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 15px;
        }

        .diet-section {
          margin-bottom: 10px;
        }

        .diet-time {
          font-weight: 600;
          margin-bottom: 3px;
        }

        .diet-food {
          font-size: 14px;
          color: #374151;
        }

        .download-btn {
          margin-top: 18px;
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #0f0f10, #1e1f23);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }

        .download-btn:hover {
          opacity: 0.9;
        }
      `}</style>

      <div className="diet-container">
        <div className="diet-grid">

          {/* ================= WEIGHT LOSS ================= */}
          <div className="diet-card">
            <div>
              <h2 className="diet-title">Weight Loss Diet Plan</h2>
              <p className="diet-subtitle">Healthy and sustainable weight management</p>

              <div className="diet-section">
                <div className="diet-time">Morning (7-8 AM)</div>
                <div className="diet-food">Green tea, oats with fruits, nuts</div>
              </div>

              <div className="diet-section">
                <div className="diet-time">Lunch (12-1 PM)</div>
                <div className="diet-food">Brown rice, dal, vegetables, salad</div>
              </div>

              <div className="diet-section">
                <div className="diet-time">Dinner (7-8 PM)</div>
                <div className="diet-food">Grilled chicken/paneer, soup, vegetables</div>
              </div>
            </div>

            <button
              className="download-btn"
              onClick={() => downloadPlan("Weight Loss Diet Plan")}
            >
              Download Full Plan
            </button>
          </div>

          {/* ================= MUSCLE GAIN ================= */}
          <div className="diet-card">
            <div>
              <h2 className="diet-title">Muscle Gain Diet Plan</h2>
              <p className="diet-subtitle">High protein diet for muscle building</p>

              <div className="diet-section">
                <div className="diet-time">Morning (7-8 AM)</div>
                <div className="diet-food">Eggs, whole wheat bread, banana, milk</div>
              </div>

              <div className="diet-section">
                <div className="diet-time">Lunch (12-1 PM)</div>
                <div className="diet-food">Chicken, rice, vegetables, curd</div>
              </div>

              <div className="diet-section">
                <div className="diet-time">Dinner (7-8 PM)</div>
                <div className="diet-food">Fish/tofu, quinoa, broccoli, nuts</div>
              </div>
            </div>

            <button
              className="download-btn"
              onClick={() => downloadPlan("Muscle Gain Diet Plan")}
            >
              Download Full Plan
            </button>
          </div>

          {/* ================= DIABETIC ================= */}
          <div className="diet-card">
            <div>
              <h2 className="diet-title">Diabetic Diet Plan</h2>
              <p className="diet-subtitle">Blood sugar management through diet</p>

              <div className="diet-section">
                <div className="diet-time">Morning (7-8 AM)</div>
                <div className="diet-food">Oatmeal, almonds, berries</div>
              </div>

              <div className="diet-section">
                <div className="diet-time">Lunch (12-1 PM)</div>
                <div className="diet-food">Roti, dal, vegetables, salad</div>
              </div>

              <div className="diet-section">
                <div className="diet-time">Dinner (7-8 PM)</div>
                <div className="diet-food">Grilled vegetables, soup, brown rice</div>
              </div>
            </div>

            <button
              className="download-btn"
              onClick={() => downloadPlan("Diabetic Diet Plan")}
            >
              Download Full Plan
            </button>
          </div>

          {/* ================= HEART HEALTH ================= */}
          <div className="diet-card">
            <div>
              <h2 className="diet-title">Heart Healthy Diet</h2>
              <p className="diet-subtitle">Cardiovascular health focused nutrition</p>

              <div className="diet-section">
                <div className="diet-time">Morning (7-8 AM)</div>
                <div className="diet-food">Oats, walnuts, apple, green tea</div>
              </div>

              <div className="diet-section">
                <div className="diet-time">Lunch (12-1 PM)</div>
                <div className="diet-food">Salmon, quinoa, steamed vegetables</div>
              </div>

              <div className="diet-section">
                <div className="diet-time">Dinner (7-8 PM)</div>
                <div className="diet-food">Grilled chicken, salad, olive oil</div>
              </div>
            </div>

            <button
              className="download-btn"
              onClick={() => downloadPlan("Heart Healthy Diet")}
            >
              Download Full Plan
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
