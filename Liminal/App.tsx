import {useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Menu, X, Flame, Home, AlertTriangle, Lightbulb, Gamepad2, BarChart3, Code2, Target, Trophy, Volume2, VolumeX} from "lucide-react";
import {Button} from "./components/ui/button";
import {HeroPage} from "./components/HeroPage";
import {ProblemPage} from "./components/ProblemPage";
import {SolutionPage} from "./components/SolutionPage";
import {ForgesPageEnhanced} from "./components/ForgesPageEnhanced";
import {AnalyticsPageEnhanced} from "./components/AnalyticsPageEnhanced";
import {TechStackPage} from "./components/TechStackPage";
import {ImpactPage} from "./components/ImpactPage";
import {UserProfile, XPBar} from "./components/UserProfile";
import {AchievementsModal} from "./components/AchievementsModal";
import {GameButton} from "./components/GameButton";

export default function App() {
    const [currentPage, setCurrentPage] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [achievementsOpen, setAchievementsOpen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const pages = [
        {name: "Home", icon: Home, component: HeroPage},
        {name: "Problem", icon: AlertTriangle, component: ProblemPage},
        {name: "Solution", icon: Lightbulb, component: SolutionPage},
        {name: "Forges", icon: Gamepad2, component: ForgesPageEnhanced},
        {name: "Analytics", icon: BarChart3, component: AnalyticsPageEnhanced},
        {name: "Tech Stack", icon: Code2, component: TechStackPage},
        {name: "Impact", icon: Target, component: ImpactPage}
    ];

    const pageRefs = pages.map(() => useRef<HTMLDivElement>(null));

    const scrollToPage = (index: number) => {
        setCurrentPage(index);
        pageRefs[index].current?.scrollIntoView({behavior: "smooth"});
        setMobileMenuOpen(false);
    };

    const handleStartClick = () => {
        scrollToPage(3); // Go to Forges page
    };

    const handleScrollToNext = () => {
        if (currentPage < pages.length - 1) {
            scrollToPage(currentPage + 1);
        }
    };

    const CurrentPageComponent = pages[currentPage].component;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navigation */}
            <motion.nav
                initial={{y: -100}}
                animate={{y: 0}}
                transition={{duration: 0.6}}
                className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-[#FFD700]/20"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <button
                            onClick={() => scrollToPage(0)}
                            className="flex items-center gap-2 group"
                        >
                            <div className="relative">
                                <Flame className="w-8 h-8 text-[#FFD700] group-hover:scale-110 transition-transform animate-pulse-neon"/>
                                <div className="absolute inset-0 bg-[#FFD700] blur-lg opacity-50 animate-pulse-neon"></div>
                            </div>
                            <span className="text-xl text-gradient-gold" style={{fontWeight: 900, letterSpacing: '-0.02em'}}>
                FIN-FORGE
              </span>
                        </button>

                        {/* Desktop menu */}
                        <div className="hidden lg:flex items-center gap-1">
                            {pages.map((page, index) => {
                                const IconComponent = page.icon;
                                return (
                                    <motion.button
                                        key={index}
                                        onClick={() => scrollToPage(index)}
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                            currentPage === index
                                                ? "bg-[#FFD700]/20 text-[#FFD700]"
                                                : "text-gray-400 hover:text-[#FFD700] hover:bg-zinc-800"
                                        }`}
                                    >
                                        <IconComponent className="w-4 h-4"/>
                                        <span style={{fontWeight: currentPage === index ? 700 : 500}}>
                      {page.name}
                    </span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Right side controls */}
                        <div className="hidden lg:flex items-center gap-3">
                            {/* Sound toggle */}
                            <motion.button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                                title={soundEnabled ? "Mute sounds" : "Enable sounds"}
                            >
                                {soundEnabled ? (
                                    <Volume2 className="w-5 h-5 text-[#FFD700]"/>
                                ) : (
                                    <VolumeX className="w-5 h-5 text-gray-500"/>
                                )}
                            </motion.button>

                            {/* Achievements button */}
                            <motion.button
                                onClick={() => setAchievementsOpen(true)}
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors group relative"
                                title="View achievements"
                            >
                                <Trophy className="w-5 h-5 text-[#FFD700]"/>
                                <motion.div
                                    initial={{scale: 0}}
                                    animate={{scale: 1}}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                                >
                                    <span className="text-[10px] text-white" style={{fontWeight: 700}}>2</span>
                                </motion.div>
                            </motion.button>

                            {/* User profile */}
                            <UserProfile
                                username="Learner"
                                level={5}
                                xp={750}
                                maxXp={1000}
                                riskProfile="Moderate"
                            />

                            {/* CTA button */}
                            <GameButton
                                onClick={handleStartClick}
                                variant="primary"
                                size="md"
                            >
                                Get Started
                            </GameButton>
                        </div>

                        {/* Mobile menu button */}
                        <motion.button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            className="lg:hidden text-[#FFD700] p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors z-50"
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            <motion.div
                                animate={{rotate: mobileMenuOpen ? 90 : 0}}
                                transition={{duration: 0.2}}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                            </motion.div>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: "auto"}}
                            exit={{opacity: 0, height: 0}}
                            className="lg:hidden bg-black/95 border-t border-[#FFD700]/20"
                        >
                            <div className="px-6 py-4 space-y-2">
                                {/* Mobile user profile */}
                                <div className="mb-4 pb-4 border-b border-zinc-800">
                                    <UserProfile
                                        username="Learner"
                                        level={5}
                                        xp={750}
                                        maxXp={1000}
                                        riskProfile="Moderate"
                                    />
                                </div>

                                {/* Mobile controls */}
                                <div className="flex gap-2 mb-4">
                                    <motion.button
                                        onClick={() => setSoundEnabled(!soundEnabled)}
                                        whileTap={{scale: 0.95}}
                                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                                    >
                                        {soundEnabled ? (
                                            <Volume2 className="w-5 h-5 text-[#FFD700]"/>
                                        ) : (
                                            <VolumeX className="w-5 h-5 text-gray-500"/>
                                        )}
                                        <span className="text-sm">{soundEnabled ? "Sound On" : "Sound Off"}</span>
                                    </motion.button>
                                    <motion.button
                                        onClick={() => {
                                            setAchievementsOpen(true);
                                            setMobileMenuOpen(false);
                                        }}
                                        whileTap={{scale: 0.95}}
                                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                                    >
                                        <Trophy className="w-5 h-5 text-[#FFD700]"/>
                                        <span className="text-sm">Achievements</span>
                                    </motion.button>
                                </div>

                                {/* Mobile nav items */}
                                {pages.map((page, index) => {
                                    const IconComponent = page.icon;
                                    return (
                                        <motion.button
                                            key={index}
                                            onClick={() => scrollToPage(index)}
                                            whileTap={{scale: 0.95}}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                                currentPage === index
                                                    ? "bg-[#FFD700]/20 text-[#FFD700]"
                                                    : "text-gray-400 hover:text-[#FFD700] hover:bg-zinc-800"
                                            }`}
                                        >
                                            <IconComponent className="w-5 h-5"/>
                                            <span style={{fontWeight: currentPage === index ? 700 : 500}}>
                        {page.name}
                      </span>
                                        </motion.button>
                                    );
                                })}
                                <GameButton
                                    onClick={handleStartClick}
                                    variant="primary"
                                    size="md"
                                    fullWidth
                                    className="mt-4"
                                >
                                    Get Started
                                </GameButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* XP Progress Bar */}
            <XPBar xp={750} maxXp={1000} level={5}/>

            {/* Page indicator dots */}
            <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3">
                {pages.map((page, index) => (
                    <motion.button
                        key={index}
                        onClick={() => scrollToPage(index)}
                        whileHover={{scale: 1.2}}
                        whileTap={{scale: 0.9}}
                        className="group relative"
                        aria-label={`Go to ${page.name}`}
                    >
                        <div
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                currentPage === index
                                    ? "bg-[#FFD700] glow-gold scale-125"
                                    : "bg-zinc-700 hover:bg-zinc-500"
                            }`}
                        />
                        <div
                            className="absolute right-6 top-1/2 -translate-y-1/2 bg-zinc-800 px-3 py-1 rounded text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#FFD700]/30">
                            {page.name}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Pages */}
            <div className="pt-20">
                <div ref={pageRefs[0]}>
                    <HeroPage onStartClick={handleStartClick} onScrollToNext={handleScrollToNext}/>
                </div>
                <div ref={pageRefs[1]}>
                    <ProblemPage/>
                </div>
                <div ref={pageRefs[2]}>
                    <SolutionPage/>
                </div>
                <div ref={pageRefs[3]}>
                    <ForgesPageEnhanced/>
                </div>
                <div ref={pageRefs[4]}>
                    <AnalyticsPageEnhanced/>
                </div>
                <div ref={pageRefs[5]}>
                    <TechStackPage/>
                </div>
                <div ref={pageRefs[6]}>
                    <ImpactPage/>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative bg-black border-t border-[#FFD700]/20 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Flame className="w-8 h-8 text-[#FFD700]"/>
                                <span className="text-xl text-gradient-gold" style={{fontWeight: 900}}>
                  FIN-FORGE
                </span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Bridging the financial competence gap through gamified learning and behavioral analytics.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-[#FFD700] mb-4" style={{fontWeight: 800}}>Quick Links</h4>
                            <div className="space-y-2">
                                {pages.slice(0, 4).map((page, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => scrollToPage(index)}
                                        whileHover={{x: 5}}
                                        className="block text-gray-400 hover:text-[#FFD700] transition-colors"
                                    >
                                        {page.name}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="text-[#FFD700] mb-4" style={{fontWeight: 800}}>Connect</h4>
                            <p className="text-gray-400 mb-4">Ready to forge your financial future?</p>
                            <GameButton
                                onClick={handleStartClick}
                                variant="primary"
                                size="md"
                                icon={Flame}
                            >
                                Start Learning
                            </GameButton>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-zinc-800 pt-8 text-center text-gray-500">
                        <p>© 2025 Fin-Forge. Empowering financial literacy through innovation.</p>
                    </div>
                </div>
            </footer>

            {/* Achievements Modal */}
            <AchievementsModal
                isOpen={achievementsOpen}
                onClose={() => setAchievementsOpen(false)}
            />
        </div>
    );
}
