import { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import ForgesSection from './components/ForgesSection';
import AnalyticsSection from './components/AnalyticsSection';
import TechStackSection from './components/TechStackSection';
import ConceptualVisualizers from './components/ConceptualVisualizers';
import ImpactSection from './components/ImpactSection';

export default function App() {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[data-section]');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const sections = document.querySelectorAll('section[data-section]');
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-black min-h-screen overflow-x-hidden">
      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index
                ? 'bg-yellow-500 scale-150 shadow-lg shadow-yellow-500/50'
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ForgesSection />
      <AnalyticsSection />
      <TechStackSection />
      <ConceptualVisualizers />
      <ImpactSection />
    </div>
  );
}
