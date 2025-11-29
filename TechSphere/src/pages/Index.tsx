import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Demo } from "@/components/landing/Demo";
import { Installation } from "@/components/landing/Installation";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Features />
      <HowItWorks />
      <Demo />
      <Installation />
      <Footer />
    </main>
  );
};

export default Index;
