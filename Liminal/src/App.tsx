import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "./components/ui/sonner";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { Onboarding } from "./components/Onboarding";
import { ForgeSelection } from "./components/ForgeSelection";
import { SimulatorHub } from "./components/SimulatorHub";
import { SimulatorExperience } from "./components/SimulatorExperience";
import { Dashboard } from "./components/Dashboard";
import { Profile } from "./components/Profile";
import { Settings } from "./components/Settings";

export default function App() {
  const [view, setView] = useState<string>("landing");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [currentXP, setCurrentXP] = useState(2450);
  const [level, setLevel] = useState(5);
  const [selectedForge, setSelectedForge] = useState<string>("");
  const [selectedSimulator, setSelectedSimulator] = useState<string>("");

  const maxXP = 3000;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleStartLearning = () => {
    if (!hasOnboarded) {
      setView("onboarding");
    } else {
      setView("forges");
    }
  };

  const handleOnboardingComplete = (data: { goal: string; experience: string; risk: string }) => {
    console.log("Onboarding data:", data);
    setHasOnboarded(true);
    setView("dashboard");
  };

  const handleSelectForge = (forgeId: string) => {
    setSelectedForge(forgeId);
    setView("simulators");
  };

  const handleSelectSimulator = (simulatorId: string) => {
    setSelectedSimulator(simulatorId);
    setView("simulator-experience");
  };

  const handleSimulatorComplete = (earnedXP: number) => {
    const newXP = currentXP + earnedXP;
    setCurrentXP(newXP);

    if (newXP >= maxXP) {
      setLevel(level + 1);
      setCurrentXP(newXP - maxXP);
    }

    setView("dashboard");
  };

  const handleNavigate = (newView: string) => {
    if (newView === "simulators" && selectedForge) {
      setView("simulators");
    } else if (newView === "forges") {
      setView("forges");
    } else {
      setView(newView);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderView = () => {
    switch (view) {
      case "landing":
        return <LandingPage onStartLearning={handleStartLearning} />;

      case "onboarding":
        return <Onboarding onComplete={handleOnboardingComplete} />;

      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;

      case "forges":
        return <ForgeSelection onSelectForge={handleSelectForge} />;

      case "simulators":
        return (
          <SimulatorHub
            forgeId={selectedForge}
            onBack={() => setView("forges")}
            onSelectSimulator={handleSelectSimulator}
          />
        );

      case "simulator-experience":
        return (
          <SimulatorExperience
            simulatorId={selectedSimulator}
            onBack={() => setView("simulators")}
            onComplete={handleSimulatorComplete}
          />
        );

      case "profile":
        return <Profile />;

      case "settings":
        return <Settings />;

      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence mode="wait">
        {view !== "landing" && view !== "onboarding" && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <Navbar
              currentXP={currentXP}
              maxXP={maxXP}
              level={level}
              onNavigate={handleNavigate}
              currentView={view}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>

      <Toaster position="top-right" />
    </div>
  );
}
