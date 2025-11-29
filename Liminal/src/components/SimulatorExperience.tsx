import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, X, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { RiskMeter } from "./RiskMeter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner@2.0.3";

interface SimulatorExperienceProps {
  simulatorId: string;
  onBack: () => void;
  onComplete: (earnedXP: number) => void;
}

export function SimulatorExperience({ simulatorId, onBack, onComplete }: SimulatorExperienceProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [cashBalance, setCashBalance] = useState(10000);
  const [riskLevel, setRiskLevel] = useState(30);
  const [decisions, setDecisions] = useState<string[]>([]);
  const [chartData, setChartData] = useState([
    { month: 0, balance: 10000 },
  ]);

  const scenarios = [
    {
      title: "Welcome to Passive Power",
      description: "You have $10,000 in savings and want to build passive income streams. Make smart choices to grow your wealth over 12 months.",
      question: "Where should you start?",
      choices: [
        {
          text: "Invest in dividend stocks",
          impact: { cash: -5000, risk: 40, feedback: "Smart move! Dividend stocks can provide steady income." },
        },
        {
          text: "Put everything in a high-yield savings account",
          impact: { cash: 0, risk: 10, feedback: "Safe choice, but limited growth potential." },
        },
        {
          text: "Buy rental property",
          impact: { cash: -10000, risk: 60, feedback: "High risk! You're now leveraged with debt." },
        },
      ],
    },
    {
      title: "3 Months Later",
      description: "The market is volatile. Your investments are down 8%.",
      question: "What's your next move?",
      choices: [
        {
          text: "Panic sell everything",
          impact: { cash: -800, risk: 20, feedback: "Emotional decision! You locked in losses." },
        },
        {
          text: "Hold steady and stay invested",
          impact: { cash: 0, risk: 40, feedback: "Good discipline! Markets recover over time." },
        },
        {
          text: "Buy more while prices are low",
          impact: { cash: -2000, risk: 55, feedback: "Dollar-cost averaging in action!" },
        },
      ],
    },
    {
      title: "6 Months In",
      description: "A friend pitches you on a 'guaranteed' crypto investment promising 50% returns.",
      question: "How do you respond?",
      choices: [
        {
          text: "Invest 50% of remaining cash",
          impact: { cash: -2500, risk: 85, feedback: "High risk! 'Guaranteed' returns don't exist." },
        },
        {
          text: "Politely decline and do research first",
          impact: { cash: 0, risk: 30, feedback: "Wise! Always research before investing." },
        },
        {
          text: "Invest a small amount ($500)",
          impact: { cash: -500, risk: 45, feedback: "Reasonable! Testing with money you can afford to lose." },
        },
      ],
    },
    {
      title: "Final Stretch",
      description: "You've learned a lot! Time to review your strategy.",
      question: "What's your plan going forward?",
      choices: [
        {
          text: "Continue balanced approach",
          impact: { cash: 1500, risk: 35, feedback: "Perfect! Consistency wins in investing." },
        },
        {
          text: "Take all gains and quit",
          impact: { cash: 500, risk: 10, feedback: "You're missing out on compound growth!" },
        },
        {
          text: "Double down on risky bets",
          impact: { cash: -1000, risk: 75, feedback: "Overconfidence can be costly!" },
        },
      ],
    },
  ];

  const currentScenario = scenarios[currentScene];
  const progress = ((currentScene + 1) / scenarios.length) * 100;

  const handleChoice = (choice: typeof scenarios[0]["choices"][0]) => {
    const newBalance = cashBalance + choice.impact.cash;
    const newRiskLevel = choice.impact.risk;

    setCashBalance(newBalance);
    setRiskLevel(newRiskLevel);
    setDecisions([...decisions, choice.text]);

    setChartData([...chartData, { month: chartData.length, balance: newBalance }]);

    if (choice.impact.cash > 0) {
      toast.success(choice.impact.feedback, { duration: 3000 });
    } else if (choice.impact.cash < -1000) {
      toast.error(choice.impact.feedback, { duration: 3000 });
    } else {
      toast.info(choice.impact.feedback, { duration: 3000 });
    }

    setTimeout(() => {
      if (currentScene < scenarios.length - 1) {
        setCurrentScene(currentScene + 1);
      } else {
        const earnedXP = Math.max(50, Math.round((newBalance / 10000) * 200));
        toast.success(`Simulator Complete! You earned ${earnedXP} XP!`, { duration: 5000 });
        setTimeout(() => onComplete(earnedXP), 2000);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Simulator
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Scenario */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <h3>{currentScenario.title}</h3>
                  <span className="text-muted-foreground">
                    Scene {currentScene + 1} of {scenarios.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <p className="text-muted-foreground">{currentScenario.description}</p>
                    <h4>{currentScenario.question}</h4>
                  </div>

                  <div className="space-y-3">
                    {currentScenario.choices.map((choice, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoice(choice)}
                        className="w-full p-4 border rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center mt-0.5">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className="flex-1">
                            <p>{choice.text}</p>
                            <div className="flex gap-3 mt-2 text-muted-foreground">
                              {choice.impact.cash !== 0 && (
                                <span className={choice.impact.cash > 0 ? "text-[var(--success)]" : "text-[var(--risk)]"}>
                                  {choice.impact.cash > 0 ? "+" : ""}${choice.impact.cash.toLocaleString()}
                                </span>
                              )}
                              <span>Risk: {choice.impact.risk}%</span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </Card>

            {/* Chart */}
            <Card className="p-6">
              <h4 className="mb-4">Balance Over Time</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="balance" stroke="var(--primary)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Metrics Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 space-y-6">
              <h4>Live Metrics</h4>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>Cash Balance</span>
                  </div>
                  <div className="text-primary text-2xl">${cashBalance.toLocaleString()}</div>
                  <div className="text-muted-foreground mt-1">
                    {cashBalance > 10000 ? (
                      <span className="text-[var(--success)]">+{((cashBalance - 10000) / 10000 * 100).toFixed(1)}%</span>
                    ) : (
                      <span className="text-[var(--risk)]">{((cashBalance - 10000) / 10000 * 100).toFixed(1)}%</span>
                    )}
                  </div>
                </div>

                <RiskMeter riskLevel={riskLevel} />

                <div>
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Decisions Made</span>
                  </div>
                  <div className="text-2xl">{decisions.length}</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h4>Your Strategy</h4>
              <div className="space-y-2">
                {decisions.map((decision, index) => (
                  <div key={index} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-[var(--success)] mt-0.5 flex-shrink-0" />
                    <span>{decision}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-accent/10 border-accent/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-accent-foreground">Pro Tip</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Diversification and patience are key to building passive income streams.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
