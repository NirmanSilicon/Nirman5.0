import React from "react";
import { useNavigate, Link } from "react-router-dom";
import trivexaLogo from "../assets/logo.jpeg";

const Ayurveda = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#78adb7ff] via-[#7eb9d3ff] to-yellow-400 px-6 py-4 overflow-x-hidden">

      {/* ---------- TOP BAR ---------- */}
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src={trivexaLogo} alt="logo" className="w-16" />
          <h1 className="text-xl font-semibold text-gray-900">
            Your One Stop Solution To Healthcare
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Emergency */}
          <button
            onClick={() => navigate("/emergency")}
            className="bg-red-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-red-600 transition-all"
          >
            24/7 EMERGENCY
          </button>

          {/* Cart */}
          <button className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100">
            <i className="fa-solid fa-cart-shopping text-xl text-gray-700"></i>
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100"
          >
            👤
          </button>
        </div>
      </div>

      {/* ---------- TOOL BAR ---------- */}
      <div className="w-full flex justify-center gap-6 flex-wrap mb-10">
        <button onClick={() => navigate("/")} className="tool-btn">
          <div className="text-2xl">🏠</div>
          <p>Home</p>
        </button>

        {[
          { name: "Library", icon: "📘" },
          { name: "Lab Tests", icon: "🧪" },
          { name: "Plans", icon: "📋" },
          { name: "Exercise", icon: "🏃" },
          { name: "Diet", icon: "🥗" },
          { name: "Therapy", icon: "💬" },
          { name: "Meditation", icon: "🧘" },
        ].map((item) => (
          <button key={item.name} className="tool-btn">
            <div className="text-2xl">{item.icon}</div>
            <p>{item.name}</p>
          </button>
        ))}
      </div>

      {/* ---------- PAGE TITLE ---------- */}
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
        Ayurveda — Doctor Consultation & Medicines
      </h2>

      {/* ---------- TWO BIG BLOCKS ---------- */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT BLOCK — CONSULTATIONS */}
        <div className="bg-white/70 rounded-2xl shadow-lg p-6 border border-gray-300">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Doctor Consultations
          </h3>

          <select className="w-full p-3 rounded-lg border border-gray-400 mb-4">
            <option>Select Consultation Type</option>
            <option>General Ayurveda Consultation</option>
            <option>Diet & Lifestyle Expert</option>
            <option>Panchakarma Specialist</option>
            <option>Skin & Hair Ayurveda Doctor</option>
          </select>

          <button className="w-full bg-teal-600 text-white py-3 rounded-lg shadow-md hover:bg-teal-700 transition-all">
            Book Consultation
          </button>
        </div>

        {/* RIGHT BLOCK — MEDICINE STORE */}
        <div className="bg-white/70 rounded-2xl shadow-lg p-6 border border-gray-300">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Ayurveda Medicine Store
          </h3>

          <select className="w-full p-3 rounded-lg border border-gray-400 mb-4">
            <option>Select Medicine Category</option>
            <option>Digestive Health</option>
            <option>Immunity Boosters</option>
            <option>Hair & Skin</option>
            <option>Joint Pain Relief</option>
          </select>

          {/* Medicine Cards */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
              <p>Ashwagandha Tablets</p>
              <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
                Add to Cart
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
              <p>Triphala Powder</p>
              <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
                Add to Cart
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
              <p>Brahmi Capsules</p>
              <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Ayurveda;
