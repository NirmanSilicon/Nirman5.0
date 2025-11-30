import { Heart, Phone, Calendar, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";

const handleLogOut = () => {
  supabase.auth.signOut().then(() => {
    window.location.href = "/"; // Redirect to home page after logout
  });
}

const Navigation = () => {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);
  console.log("Current session:", session);

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-hero p-2 rounded-lg">
              <img src="/lovable-uploads/0fa7abe5-3913-4c3a-969c-4f569e1cf409.png" alt="MediBridge Logo" className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-foreground">MediBridge</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link to="/appointments" className="text-muted-foreground hover:text-primary transition-colors">
              Appointments
            </Link>
            <Link to="/checkup" className="text-muted-foreground hover:text-primary transition-colors">
              <Calendar className="h-4 w-4 inline mr-1" />
              Checkup
            </Link>
            <Link to="/pharmacies" className="text-muted-foreground hover:text-primary transition-colors">
              <MapPin className="h-4 w-4 inline mr-1" />
              Pharmacies
            </Link>
            <Link to="/hospitals" className="text-muted-foreground hover:text-primary transition-colors">
              <MapPin className="h-4 w-4 inline mr-1" />
              Hospitals
            </Link>
            <Link to="/emergency" className="text-emergency hover:text-emergency/80 transition-colors font-semibold">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Emergency
            </Link>
          </div>
            {session ? <div className="flex items-center space-x-4">
            <Button asChild>
              <Link to="/profile">Profile</Link>
            </Button>
          </div> : <div className="flex items-center space-x-4">
            <Button asChild>
              <Link to="/get-started">Get Started</Link>
            </Button>
          </div>}
          {session && <button onClick={() => handleLogOut()} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium 
          ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
          [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90
          h-10 px-4 py-2">Log-Out</button>}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;