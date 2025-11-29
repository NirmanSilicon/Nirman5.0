import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/homepage.jsx";
import Profile from "./pages/Profile.jsx";
import Allopathy from "./pages/Allopathy.jsx";
import Ayurveda from "./pages/Ayurveda.jsx";
import Homeopathy from "./pages/homeopathy.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/allopathy" element={<Allopathy />} />
        <Route path="/ayurveda" element={<Ayurveda />} />
        <Route path="/homeopathy" element={<Homeopathy />} />
      </Routes>
    </Router>
  );
}

export default App;
