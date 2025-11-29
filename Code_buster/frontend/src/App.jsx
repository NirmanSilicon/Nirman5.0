import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SubmitComplaint from './pages/SubmitComplaint';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import { runConnectionTest } from './utils/connectionTest';
import './App.css';

// Run connection test on app load
runConnectionTest();

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<SubmitComplaint />} />
          <Route path="/submit" element={<SubmitComplaint />} />
          <Route path="/verify" element={<VerifyOtp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/heatmap" element={<Heatmap />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
