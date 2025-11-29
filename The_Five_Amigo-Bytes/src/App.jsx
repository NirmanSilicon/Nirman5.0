import React, { useState } from "react";
// Removed LanguageProvider import
import Landing from "./pages/Landing"; 
import Scanner from "./pages/Scanner";
import AnalysisResult from "./pages/AnalysisResult"; 

export default function App() {
  // State to control which page is visible: 'landing', 'scanner', or 'result'
  const [view, setView] = useState("landing");
  
  // State to store the diagnosis data received from the backend
  const [analysisResult, setAnalysisResult] = useState(null); 

  // --- Navigation & Data Handlers ---

  // Called by Landing page to start the scanner
  const handleGetStarted = () => {
    setView("scanner");
  };

  // Called by Scanner upon receiving data from the backend
  const handleAnalysisComplete = (data) => {
    setAnalysisResult(data); 
    setView("result"); 
  };
  
  // Called by Scanner/Results page to go back to the Landing page
  const handleBackToLanding = () => {
      setAnalysisResult(null); // Clear any old data
      setView("landing");
  };
  
  // Called by Results page to go back to the Scanner page (if we want to retake)
  const handleBackToScanner = () => {
      setAnalysisResult(null); // Clear current result
      setView("scanner");
  };


  return (
    // Removed <LanguageProvider> wrapper
    <main className="h-screen w-full">
      
      {/* Conditional Rendering based on the 'view' state */}
      
      {view === "landing" && (
        <Landing onGetStarted={handleGetStarted} />
      )}

      {view === "scanner" && (
        <Scanner 
          onAnalyze={handleAnalysisComplete} // Scanner calls this on successful backend response
          onBack={handleBackToLanding}      // Scanner goes back to Landing page
        />
      )}

      {view === "result" && analysisResult && (
        <AnalysisResult 
          result={analysisResult} 
          onBack={handleBackToScanner} // Result page goes back to Scanner (to retake/rescan)
        />
      )}

    </main>
  );
}