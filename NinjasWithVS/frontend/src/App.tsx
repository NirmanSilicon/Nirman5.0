import Hero from './components/Hero';
import Header from './components/Header';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import UserSegments from './components/UserSegments';
import TechStack from './components/TechStack';
import BusinessModel from './components/BusinessModel';
import Team from './components/Team';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-gradient-to-b from-[#0a0e1a] via-[#0f1425] to-[#0a0e1a] text-white">
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
      <UserSegments />
      <TechStack />
      <BusinessModel />
      <Team />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;
