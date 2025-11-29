import { motion } from "motion/react";
import { ArrowLeft, Filter, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SimulatorCard } from "./SimulatorCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

interface SimulatorHubProps {
  forgeId: string;
  onBack: () => void;
  onSelectSimulator: (simulatorId: string) => void;
}

export function SimulatorHub({ forgeId, onBack, onSelectSimulator }: SimulatorHubProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getForgeTitle = () => {
    switch (forgeId) {
      case "budgeting":
        return "Budgeting Forge";
      case "market":
        return "Market Forge";
      case "digital":
        return "Digital Forge";
      default:
        return "Simulator Hub";
    }
  };

  const simulators = {
    budgeting: [
      {
        id: "cash-flow",
        title: "Cash Flow Runner",
        description: "Navigate monthly income and expenses to build positive cash flow",
        difficulty: "Beginner" as const,
        estimatedTime: "15 min",
        rewardXP: 100,
        isCompleted: true,
        progress: 100,
      },
      {
        id: "debt-trap",
        title: "Debt Trap Escape",
        description: "Learn strategies to pay off debt and avoid common pitfalls",
        difficulty: "Beginner" as const,
        estimatedTime: "20 min",
        rewardXP: 150,
        isCompleted: false,
        progress: 60,
      },
      {
        id: "life-planner",
        title: "Life Planner",
        description: "Create a comprehensive financial plan for major life goals",
        difficulty: "Intermediate" as const,
        estimatedTime: "30 min",
        rewardXP: 250,
        isCompleted: true,
        progress: 100,
      },
      {
        id: "passive-power",
        title: "Passive Power",
        description: "Build multiple streams of passive income over time",
        difficulty: "Intermediate" as const,
        estimatedTime: "25 min",
        rewardXP: 200,
        isCompleted: false,
        progress: 0,
      },
      {
        id: "emergency-fund",
        title: "Emergency Fund Builder",
        description: "Learn to build and maintain a robust emergency fund",
        difficulty: "Beginner" as const,
        estimatedTime: "15 min",
        rewardXP: 120,
        isCompleted: false,
        progress: 0,
      },
      {
        id: "tax-optimizer",
        title: "Tax Optimizer",
        description: "Understand tax strategies to minimize your liability",
        difficulty: "Advanced" as const,
        estimatedTime: "40 min",
        rewardXP: 350,
        isCompleted: false,
        progress: 0,
      },
    ],
    market: [
      {
        id: "behavioral-trap",
        title: "The Behavioral Trap",
        description: "Recognize and overcome common investing biases and emotions",
        difficulty: "Intermediate" as const,
        estimatedTime: "25 min",
        rewardXP: 200,
        isCompleted: false,
        progress: 0,
      },
      {
        id: "portfolio-architect",
        title: "Portfolio Architect",
        description: "Design and balance a diversified investment portfolio",
        difficulty: "Intermediate" as const,
        estimatedTime: "35 min",
        rewardXP: 300,
        isCompleted: false,
        progress: 0,
      },
      {
        id: "market-timing",
        title: "Market Timing Challenge",
        description: "Learn why timing the market is difficult and risky",
        difficulty: "Beginner" as const,
        estimatedTime: "20 min",
        rewardXP: 150,
        isCompleted: true,
        progress: 100,
      },
      {
        id: "dividend-dynasty",
        title: "Dividend Dynasty",
        description: "Build a portfolio focused on dividend income",
        difficulty: "Intermediate" as const,
        estimatedTime: "30 min",
        rewardXP: 250,
        isCompleted: false,
        progress: 0,
      },
    ],
    digital: [
      {
        id: "defi-detective",
        title: "DeFi Detective",
        description: "Explore decentralized finance protocols and their risks",
        difficulty: "Advanced" as const,
        estimatedTime: "45 min",
        rewardXP: 400,
        isCompleted: false,
        progress: 0,
      },
      {
        id: "tokenomics-tussle",
        title: "Tokenomics Tussle",
        description: "Analyze crypto token economics and value propositions",
        difficulty: "Advanced" as const,
        estimatedTime: "40 min",
        rewardXP: 380,
        isCompleted: false,
        progress: 0,
      },
      {
        id: "wallet-security",
        title: "Wallet Security Master",
        description: "Learn best practices for securing digital assets",
        difficulty: "Beginner" as const,
        estimatedTime: "15 min",
        rewardXP: 100,
        isCompleted: false,
        progress: 0,
      },
      {
        id: "nft-valuation",
        title: "NFT Valuation Game",
        description: "Understand NFT markets and valuation principles",
        difficulty: "Intermediate" as const,
        estimatedTime: "25 min",
        rewardXP: 220,
        isCompleted: false,
        progress: 0,
      },
    ],
  };

  const currentSimulators = simulators[forgeId as keyof typeof simulators] || [];
  const filteredSimulators = currentSimulators.filter((sim) =>
    sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sim.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const beginnerSims = filteredSimulators.filter((s) => s.difficulty === "Beginner");
  const intermediateSims = filteredSimulators.filter((s) => s.difficulty === "Intermediate");
  const advancedSims = filteredSimulators.filter((s) => s.difficulty === "Advanced");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forges
            </Button>
          </div>

          <div className="space-y-4">
            <h1>{getForgeTitle()}</h1>
            <p className="text-muted-foreground">
              Choose a simulator to practice real-world financial scenarios and earn XP
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search simulators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Simulators</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSimulators.map((simulator) => (
                  <SimulatorCard
                    key={simulator.id}
                    {...simulator}
                    onClick={() => onSelectSimulator(simulator.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="beginner" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beginnerSims.map((simulator) => (
                  <SimulatorCard
                    key={simulator.id}
                    {...simulator}
                    onClick={() => onSelectSimulator(simulator.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="intermediate" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {intermediateSims.map((simulator) => (
                  <SimulatorCard
                    key={simulator.id}
                    {...simulator}
                    onClick={() => onSelectSimulator(simulator.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advancedSims.map((simulator) => (
                  <SimulatorCard
                    key={simulator.id}
                    {...simulator}
                    onClick={() => onSelectSimulator(simulator.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSimulators
                  .filter((s) => s.isCompleted)
                  .map((simulator) => (
                    <SimulatorCard
                      key={simulator.id}
                      {...simulator}
                      onClick={() => onSelectSimulator(simulator.id)}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
