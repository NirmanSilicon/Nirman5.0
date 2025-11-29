import { motion } from "motion/react";
import { TrendingUp, Award, Target, AlertCircle, Newspaper, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { CompoundInterestVisualizer } from "./CompoundInterestVisualizer";
import { SparklineChart } from "./SparklineChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const riskProfileData = [
    { skill: "Budgeting", score: 85 },
    { skill: "Investing", score: 65 },
    { skill: "Risk Mgmt", score: 70 },
    { skill: "Planning", score: 80 },
    { skill: "Market Knowledge", score: 60 },
    { skill: "Discipline", score: 75 },
  ];

  const recentActivity = [
    { date: "Today", action: "Completed 'Cash Flow Runner'", xp: 100 },
    { date: "Yesterday", action: "Completed 'Life Planner'", xp: 250 },
    { date: "2 days ago", action: "Unlocked 'Budget Master' badge", xp: 50 },
    { date: "3 days ago", action: "Started Market Forge", xp: 0 },
  ];

  const newsItems = [
    {
      title: "Fed Raises Interest Rates",
      summary: "The Federal Reserve announced a 0.25% rate increase...",
      impact: "moderate",
      date: "2 hours ago",
    },
    {
      title: "Inflation Drops to 3.2%",
      summary: "Consumer prices show continued cooling trend...",
      impact: "positive",
      date: "5 hours ago",
    },
    {
      title: "Tech Stocks Rally",
      summary: "Major tech companies report strong earnings...",
      impact: "positive",
      date: "1 day ago",
    },
  ];

  const recommendedSimulators = [
    {
      title: "Passive Power",
      forge: "Budgeting",
      reason: "Match your profile",
      xp: 200,
    },
    {
      title: "Portfolio Architect",
      forge: "Market",
      reason: "Next skill to master",
      xp: 300,
    },
    {
      title: "Behavioral Trap",
      forge: "Market",
      reason: "Build on your progress",
      xp: 200,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1>Your Financial Dashboard</h1>
              <p className="text-muted-foreground">Track your progress and continue learning</p>
            </div>
            <Button onClick={() => onNavigate("forges")}>
              Browse Forges
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <Badge>Level 5</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Total XP</p>
                  <p className="text-3xl text-primary">2,450</p>
                  <div className="flex items-center gap-2">
                    <SparklineChart data={[100, 250, 380, 520, 750, 1200, 1850, 2450]} height={30} />
                    <span className="text-[var(--success)]">+12%</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 bg-gradient-to-br from-[var(--success)]/10 to-[var(--success)]/5 border-[var(--success)]/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-[var(--success)]/10 rounded-lg">
                    <Target className="w-6 h-6 text-[var(--success)]" />
                  </div>
                  <Badge variant="secondary">5 of 30</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Simulators Complete</p>
                  <p className="text-3xl text-[var(--success)]">5</p>
                  <Progress value={17} className="mt-2" />
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <Badge variant="secondary">3 New</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Badges Earned</p>
                  <p className="text-3xl text-accent-foreground">12</p>
                  <p className="text-muted-foreground">18 remaining</p>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <Badge variant="outline">Medium</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Risk Profile</p>
                  <p className="text-2xl text-secondary-foreground">Balanced</p>
                  <p className="text-muted-foreground">FOMO: Low</p>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="tools" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tools">Learning Tools</TabsTrigger>
                  <TabsTrigger value="profile">Risk Profile</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="tools" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="mb-4">Compound Interest Visualizer</h3>
                    <CompoundInterestVisualizer />
                  </Card>
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                  <Card className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2">Your Financial Risk Profile</h3>
                        <p className="text-muted-foreground">
                          Based on your simulator performance and decisions
                        </p>
                      </div>

                      <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart data={riskProfileData}>
                            <PolarGrid stroke="var(--border)" />
                            <PolarAngleAxis dataKey="skill" stroke="var(--muted-foreground)" />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--muted-foreground)" />
                            <Radar
                              name="Your Skills"
                              dataKey="score"
                              stroke="var(--primary)"
                              fill="var(--primary)"
                              fillOpacity={0.3}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="mb-2 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
                            Strengths
                          </h4>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Strong budgeting skills</li>
                            <li>• Excellent planning ability</li>
                            <li>• Good financial discipline</li>
                          </ul>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="mb-2 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[var(--risk)]" />
                            Areas to Improve
                          </h4>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Market knowledge</li>
                            <li>• Investment strategies</li>
                            <li>• Risk assessment</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                        <p className="text-accent-foreground">
                          <strong>Profile Summary:</strong> You're a "Cautious Builder" - you excel at fundamentals and
                          planning but could benefit from exploring investment opportunities.
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <p>{activity.action}</p>
                            <p className="text-muted-foreground">{activity.date}</p>
                          </div>
                          {activity.xp > 0 && (
                            <Badge className="bg-accent/10 text-accent-foreground border-accent/20">
                              +{activity.xp} XP
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recommended Simulators */}
              <Card className="p-6">
                <h4 className="mb-4">Recommended for You</h4>
                <div className="space-y-3">
                  {recommendedSimulators.map((sim, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <p>{sim.title}</p>
                        <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                          +{sim.xp}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{sim.forge}</Badge>
                        <span className="text-muted-foreground">· {sim.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" onClick={() => onNavigate("simulators")}>
                  View All Simulators
                </Button>
              </Card>

              {/* Financial News */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Newspaper className="w-5 h-5" />
                  <h4>Financial News</h4>
                </div>
                <div className="space-y-4">
                  {newsItems.map((news, index) => (
                    <div key={index} className="space-y-1 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm">{news.title}</p>
                        <Badge
                          variant="outline"
                          className={
                            news.impact === "positive"
                              ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20"
                              : "bg-accent/10 text-accent-foreground border-accent/20"
                          }
                        >
                          {news.impact === "positive" ? "↑" : "→"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{news.summary}</p>
                      <p className="text-muted-foreground">{news.date}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
