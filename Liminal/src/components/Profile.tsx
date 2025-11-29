import { motion } from "motion/react";
import { Award, TrendingUp, Target, Crown, Star, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { BadgeIcon } from "./BadgeIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function Profile() {
  const achievements = [
    { name: "First Steps", description: "Complete your first simulator", icon: "🎯", isUnlocked: true, rarity: "common" as const },
    { name: "Budget Master", description: "Complete all Budgeting Forge simulators", icon: "💰", isUnlocked: true, rarity: "rare" as const },
    { name: "Quick Learner", description: "Complete 3 simulators in one day", icon: "⚡", isUnlocked: true, rarity: "common" as const },
    { name: "Risk Taker", description: "Make 10 high-risk decisions", icon: "🎲", isUnlocked: false, rarity: "epic" as const },
    { name: "Investor Pro", description: "Complete all Market Forge simulators", icon: "📈", isUnlocked: false, rarity: "legendary" as const },
    { name: "Crypto Pioneer", description: "Complete all Digital Forge simulators", icon: "₿", isUnlocked: false, rarity: "legendary" as const },
    { name: "100 Streak", description: "Log in for 100 consecutive days", icon: "🔥", isUnlocked: false, rarity: "epic" as const },
    { name: "Perfect Score", description: "Complete a simulator with 100% score", icon: "💯", isUnlocked: true, rarity: "rare" as const },
    { name: "Knowledge Seeker", description: "Read 50 educational articles", icon: "📚", isUnlocked: false, rarity: "common" as const },
  ];

  const forgeProgress = [
    { name: "Budgeting Forge", completed: 5, total: 8, level: "Advanced", color: "primary" },
    { name: "Market Forge", completed: 2, total: 10, level: "Beginner", color: "success" },
    { name: "Digital Forge", completed: 0, total: 12, level: "Locked", color: "muted" },
  ];

  const stats = [
    { label: "Total XP Earned", value: "2,450", icon: <Zap className="w-5 h-5" />, color: "accent" },
    { label: "Simulators Completed", value: "5", icon: <Target className="w-5 h-5" />, color: "success" },
    { label: "Days Active", value: "23", icon: <TrendingUp className="w-5 h-5" />, color: "primary" },
    { label: "Badges Unlocked", value: "12", icon: <Award className="w-5 h-5" />, color: "accent" },
  ];

  const recentBadges = achievements.filter(a => a.isUnlocked).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Profile Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-primary to-accent p-8 text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/40">
                <Crown className="w-16 h-16" />
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-white">Financial Master</h1>
                  <p className="text-white/90">Level 5 · Cautious Builder</p>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {stats.map((stat, index) => (
                    <div key={index} className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        {stat.icon}
                        <span className="text-white/80">{stat.label}</span>
                      </div>
                      <div className="text-2xl">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="achievements" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3>Your Badges</h3>
                    <p className="text-muted-foreground">
                      {achievements.filter(a => a.isUnlocked).length} of {achievements.length} unlocked
                    </p>
                  </div>
                  <Progress 
                    value={(achievements.filter(a => a.isUnlocked).length / achievements.length) * 100} 
                    className="w-32 h-2"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <BadgeIcon {...achievement} />
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Recent Achievements</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {recentBadges.map((badge, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="text-4xl">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p>{badge.name}</p>
                          <Badge variant="outline">{badge.rarity}</Badge>
                        </div>
                        <p className="text-muted-foreground">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-6">Forge Progress</h3>
                <div className="space-y-6">
                  {forgeProgress.map((forge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p>{forge.name}</p>
                          <p className="text-muted-foreground">
                            {forge.completed} of {forge.total} simulators
                          </p>
                        </div>
                        <Badge
                          className={
                            forge.level === "Advanced"
                              ? "bg-[var(--risk)]/10 text-[var(--risk)] border-[var(--risk)]/20"
                              : forge.level === "Beginner"
                              ? "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {forge.level}
                        </Badge>
                      </div>
                      <Progress value={(forge.completed / forge.total) * 100} className="h-3" />
                    </motion.div>
                  ))}
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="mb-4">Skills Breakdown</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Budgeting</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Investing</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Risk Management</span>
                        <span>70%</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Planning</span>
                        <span>80%</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="mb-4">Next Milestones</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p>Reach Level 6</p>
                        <p className="text-muted-foreground">550 XP needed</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--success)]/10 flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-[var(--success)]" />
                      </div>
                      <div>
                        <p>Complete 3 more simulators</p>
                        <p className="text-muted-foreground">To unlock Market Forge achievements</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div>
                        <p>Unlock 5 more badges</p>
                        <p className="text-muted-foreground">To earn "Badge Collector" achievement</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Average Score</p>
                    <p className="text-4xl text-primary">87%</p>
                    <p className="text-muted-foreground">Across all simulators</p>
                  </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-[var(--success)]/10 to-[var(--success)]/5 border-[var(--success)]/20">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Best Streak</p>
                    <p className="text-4xl text-[var(--success)]">23 days</p>
                    <p className="text-muted-foreground">Keep it going!</p>
                  </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Time Invested</p>
                    <p className="text-4xl text-accent-foreground">12.5h</p>
                    <p className="text-muted-foreground">Total learning time</p>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="mb-4">Learning Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p>Most improved skill</p>
                        <p className="text-muted-foreground">
                          Your budgeting skills have improved by 45% in the last month
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-[var(--success)]/5 border border-[var(--success)]/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                      <div>
                        <p>Consistency Champion</p>
                        <p className="text-muted-foreground">
                          You've logged in 23 days in a row - keep up the great work!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p>Recommended focus</p>
                        <p className="text-muted-foreground">
                          Consider exploring investment simulators to round out your skills
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
