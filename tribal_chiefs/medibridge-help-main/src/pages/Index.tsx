import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import AIAgent from "@/components/AIAgent";
import Services from "@/components/Services";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Services />
    </div>
  );
};

export default Index;
