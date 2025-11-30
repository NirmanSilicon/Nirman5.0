import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Profile from "./pages/Profile";

import Index from "./pages/Index";
import CheckupScheduler from "./pages/CheckupScheduler";
import ServicesPage from "./pages/Services";
import Appointments from "./pages/Appointments";
import Pharmacies from "./pages/Pharmacies";
import Hospitals from "./pages/Hospitals";
import Emergency from "./pages/Emergency";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AIAgent from "./components/AIAgent";

import supabase from "./utils/supabase";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session + listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected routes (Supabase required) */}
            <Route
              path="/appointments"
              element={session ? <Appointments /> : <Navigate to="/auth" />}
            />
            <Route
              path="/checkup"
              element={session ? <CheckupScheduler /> : <Navigate to="/auth" />}
            />
            <Route
              path="/pharmacies"
              element={<Pharmacies />}
            />
            <Route
              path="/hospitals"
              element={<Hospitals />}
            />
            <Route
              path="/emergency"
              element={<Emergency />}
            />
            <Route
              path="/chat"
              element={session ? <AIAgent /> : <Navigate to="/auth" />}
            />
            <Route
              path="/get-started"
              element={<Auth/>}
            />
            <Route
              path="/profile"
              element={<Profile/>}
            />
            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
