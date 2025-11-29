import { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("pricing");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function subscribe(plan, amount) {
    setSelectedPlan(plan);
    setPrice(amount);
    setPage("payment");
  }

  function payNow() {
    const options = {
      key: "rzp_test_XXXXXXXXXXXX", // 🔴 REPLACE WITH YOUR RAZORPAY TEST KEY
      amount: price * 100,
      currency: "INR",
      name: "Trivexa Health",
      description: selectedPlan + " Subscription",
      handler: function (response) {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "User",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#000000",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #99cfdcff;
        }

        .wrapper {
          display: flex;
          justify-content: center;
          gap: 30px;
          padding: 50px;
          flex-wrap: wrap;
        }

        .card {
          width: 320px;
          background: #99cfdcff;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          position: relative;
        }

        .popular {
          border: 2px solid black;
        }

        .badge {
          position: absolute;
          top: -14px;
          right: 20px;
          background: black;
          color: white;
          font-size: 12px;
          padding: 5px 12px;
          border-radius: 20px;
        }

        h1 {
          font-size: 40px;
        }

        h1 span {
          font-size: 16px;
          color: gray;
        }

        .info {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 20px;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        ul li {
          margin: 10px 0;
          padding-left: 25px;
          position: relative;
        }

        ul li::before {
          content: "✔";
          color: green;
          position: absolute;
          left: 0;
        }

        button {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #99cfdcff;
          background: white;
          font-size: 16px;
          cursor: pointer;
          margin-top: 15px;
        }

        .dark-btn {
          background: black;
          color: white;
          border: none;
        }

        .payment-box {
          background: white;
          width: 350px;
          padding: 30px;
          border-radius: 15px;
          margin: 120px auto;
          text-align: center;
          box-shadow: 0 0 20px rgba(0,0,0,0.2);
        }

        input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
        }
      `}</style>

      {page === "pricing" && (
        <div className="wrapper">
          {/* BASIC */}
          <div className="card">
            <h2>Basic Wellness</h2>
            <h1>₹999<span>/month</span></h1>

            <div className="info">
              <p><b>Medicine</b><br />Monthly</p>
              <p><b>Checkups</b><br />Quarterly</p>
            </div>

            <ul>
              <li>Monthly medicine delivery</li>
              <li>Quarterly health checkup</li>
              <li>24/7 helpline access</li>
              <li>Diet consultation</li>
            </ul>

            <button onClick={() => subscribe("Basic Wellness", 999)}>
              Subscribe Now
            </button>
          </div>

          {/* PREMIUM */}
          <div className="card popular">
            <div className="badge">Popular</div>
            <h2>Premium Health</h2>
            <h1>₹2499<span>/month</span></h1>

            <div className="info">
              <p><b>Medicine</b><br />Bi-weekly</p>
              <p><b>Checkups</b><br />Monthly</p>
            </div>

            <ul>
              <li>Bi-weekly medicine delivery</li>
              <li>Monthly health checkup</li>
              <li>Free doctor consultations</li>
              <li>Diet & fitness plan</li>
              <li>Mental health support</li>
              <li>Annual full body checkup</li>
            </ul>

            <button className="dark-btn" onClick={() => subscribe("Premium Health", 2499)}>
              Subscribe Now
            </button>
          </div>

          {/* FAMILY */}
          <div className="card">
            <h2>Family Care</h2>
            <h1>₹4999<span>/month</span></h1>

            <div className="info">
              <p><b>Medicine</b><br />Weekly</p>
              <p><b>Checkups</b><br />Bi-weekly</p>
            </div>

            <ul>
              <li>Weekly medicine delivery</li>
              <li>Bi-weekly checkups for 4 members</li>
              <li>Unlimited doctor consultations</li>
              <li>Personalized diet plans</li>
              <li>Home visit services</li>
              <li>Emergency support 24/7</li>
              <li>Free lab tests</li>
            </ul>

            <button onClick={() => subscribe("Family Care", 4999)}>
              Subscribe Now
            </button>
          </div>
        </div>
      )}

      {page === "payment" && (
        <div className="payment-box">
          <h2>Confirm Payment</h2>
          <p><b>Plan:</b> {selectedPlan}</p>
          <h3>₹{price}</h3>

          <input placeholder="Name" />
          <input placeholder="Email" />
          <input placeholder="Phone" />

          <button className="dark-btn" onClick={payNow}>
            Pay Now
          </button>

          <button onClick={() => setPage("pricing")}>
            ← Back
          </button>
        </div>
      )}
    </>
  );
}
