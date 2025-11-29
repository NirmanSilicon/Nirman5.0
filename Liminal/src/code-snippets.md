# Fin-Forge Code Snippets

Ready-to-use React and CSS code snippets for integrating Fin-Forge components into your application.

## Table of Contents
1. [Navbar Component](#navbar-component)
2. [Forge Card](#forge-card)
3. [Simulator Layout](#simulator-layout)
4. [Compound Interest Visualizer](#compound-interest-visualizer)
5. [XP Bar](#xp-bar)
6. [Risk Meter](#risk-meter)
7. [CSS Variables](#css-variables)

---

## Navbar Component

```tsx
import { XPBar } from "./components/XPBar";
import { Menu, Sun, Moon, User } from "lucide-react";
import { Button } from "./components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white">🔥</span>
            </div>
            <span className="text-foreground">Fin-Forge</span>
          </div>

          {/* XP Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <XPBar currentXP={2450} maxXP={3000} level={5} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Sun className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Usage:**
```tsx
<Navbar />
```

---

## Forge Card

```tsx
import { motion } from "motion/react";
import { Wallet } from "lucide-react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";

export function ForgeCard() {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-xl bg-card border border-border shadow-lg hover:shadow-xl transition-shadow">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary to-primary/50" />
        
        <div className="relative p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Wallet className="w-8 h-8" />
            </div>
            <Badge variant="secondary">Beginner</Badge>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3>Budgeting Forge</h3>
            <p className="text-muted-foreground">
              Master personal finance, budgeting, and wealth building fundamentals
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">3 / 8 Completed</span>
              <span>35%</span>
            </div>
            <Progress value={35} className="h-2" />
          </div>

          <Button className="w-full">Start Learning</Button>
        </div>
      </div>
    </motion.div>
  );
}
```

**Props Interface:**
```typescript
interface ForgeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  badgeLevel: string;
  simulatorsCompleted: number;
  totalSimulators: number;
  onClick: () => void;
}
```

---

## Simulator Layout

```tsx
import { useState } from "react";
import { Card } from "./components/ui/card";
import { Progress } from "./components/ui/progress";
import { RiskMeter } from "./components/RiskMeter";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

export function SimulatorLayout() {
  const [cashBalance, setCashBalance] = useState(10000);
  const [riskLevel, setRiskLevel] = useState(30);
  const [chartData, setChartData] = useState([
    { month: 0, balance: 10000 },
    { month: 1, balance: 10500 },
    { month: 2, balance: 11200 },
  ]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Content - Scenario */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <h3>Current Scenario</h3>
          <p className="text-muted-foreground">
            You have $10,000 in savings. What's your next move?
          </p>
          
          {/* Choices would go here */}
        </Card>

        {/* Chart */}
        <Card className="p-6">
          <h4 className="mb-4">Balance Over Time</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="var(--primary)" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Sidebar - Metrics */}
      <div className="space-y-6">
        <Card className="p-6">
          <h4>Live Metrics</h4>
          
          <div className="space-y-4 mt-4">
            {/* Cash Balance */}
            <div className="p-4 bg-primary/10 rounded-lg">
              <span className="text-muted-foreground">Cash Balance</span>
              <div className="text-primary text-2xl">
                ${cashBalance.toLocaleString()}
              </div>
            </div>

            {/* Risk Meter */}
            <RiskMeter riskLevel={riskLevel} />
          </div>
        </Card>
      </div>
    </div>
  );
}
```

---

## Compound Interest Visualizer

```tsx
import { useState } from "react";
import { Slider } from "./components/ui/slider";
import { Card } from "./components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function CompoundInterestVisualizer() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);

  // Calculate compound interest
  const data = Array.from({ length: years + 1 }, (_, year) => ({
    year,
    value: Math.round(principal * Math.pow(1 + rate / 100, year)),
  }));

  const finalValue = data[data.length - 1].value;

  return (
    <div className="space-y-6">
      {/* Chart */}
      <Card className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label>Initial Amount</label>
            <span className="text-primary">${principal.toLocaleString()}</span>
          </div>
          <Slider
            value={[principal]}
            onValueChange={([value]) => setPrincipal(value)}
            min={1000}
            max={100000}
            step={1000}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label>Annual Rate</label>
            <span className="text-primary">{rate}%</span>
          </div>
          <Slider
            value={[rate]}
            onValueChange={([value]) => setRate(value)}
            min={0}
            max={20}
            step={0.5}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label>Time (Years)</label>
            <span className="text-primary">{years}</span>
          </div>
          <Slider
            value={[years]}
            onValueChange={([value]) => setYears(value)}
            min={1}
            max={40}
            step={1}
          />
        </div>
      </div>

      {/* Result */}
      <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5">
        <p className="text-muted-foreground">Total Value After {years} Years</p>
        <div className="text-4xl text-primary">${finalValue.toLocaleString()}</div>
      </Card>
    </div>
  );
}
```

**Expected Props:**
- None (fully self-contained)
- State managed internally with React hooks

---

## XP Bar

```tsx
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  showLevel?: boolean;
}

export function XPBar({ currentXP, maxXP, level, showLevel = true }: XPBarProps) {
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className="flex items-center gap-3">
      {showLevel && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg">
          <Sparkles className="w-4 h-4 text-accent-foreground" />
          <span className="text-accent-foreground">Lvl {level}</span>
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-muted-foreground">
            {currentXP} / {maxXP} XP
          </span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
```

**Usage:**
```tsx
<XPBar currentXP={2450} maxXP={3000} level={5} />
```

---

## Risk Meter

```tsx
import { motion } from "motion/react";
import { AlertTriangle, TrendingUp, Shield } from "lucide-react";

interface RiskMeterProps {
  riskLevel: number; // 0-100
  label?: string;
}

export function RiskMeter({ riskLevel, label = "Risk Level" }: RiskMeterProps) {
  const getRiskColor = () => {
    if (riskLevel < 30) return "text-[var(--success)]";
    if (riskLevel < 70) return "text-[var(--gold)]";
    return "text-[var(--risk)]";
  };

  const getRiskIcon = () => {
    if (riskLevel < 30) return <Shield className="w-5 h-5" />;
    if (riskLevel < 70) return <TrendingUp className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}</span>
        <div className={`flex items-center gap-1.5 ${getRiskColor()}`}>
          {getRiskIcon()}
          <span>{riskLevel}%</span>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            riskLevel < 30
              ? "bg-[var(--success)]"
              : riskLevel < 70
              ? "bg-[var(--gold)]"
              : "bg-[var(--risk)]"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${riskLevel}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
```

**Usage:**
```tsx
<RiskMeter riskLevel={65} label="Portfolio Risk" />
```

---

## CSS Variables

Add these to your global CSS file for theming support:

```css
:root {
  /* Brand Colors */
  --navy: #0B2545;
  --teal: #17A2B8;
  --gold: #FFC857;
  --neutral-bg: #F7FAFC;
  --success: #10b981;
  --risk: #f97316;
  
  /* Semantic Tokens */
  --background: #F7FAFC;
  --foreground: #0B2545;
  --card: #ffffff;
  --card-foreground: #0B2545;
  --primary: #17A2B8;
  --primary-foreground: #ffffff;
  --secondary: #0B2545;
  --secondary-foreground: #ffffff;
  --muted: #e2e8f0;
  --muted-foreground: #64748b;
  --accent: #FFC857;
  --accent-foreground: #0B2545;
  --border: #e2e8f0;
  --radius: 0.75rem;
}

/* Dark Mode */
.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --card: #1e293b;
  --card-foreground: #f1f5f9;
  --primary: #20c4dc;
  --primary-foreground: #0f172a;
  --secondary: #334155;
  --secondary-foreground: #f1f5f9;
  --muted: #334155;
  --muted-foreground: #94a3b8;
  --accent: #FFD166;
  --accent-foreground: #0f172a;
  --border: #334155;
}
```

**Usage in Components:**
```tsx
// Use Tailwind classes
<div className="bg-primary text-primary-foreground" />

// Or CSS variables directly
<div style={{ color: 'var(--primary)' }} />
```

---

## Animation Utilities

```tsx
import { motion } from "motion/react";

// Card Hover Animation
export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// Fade In Animation
export function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

// Page Transition
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Integration Notes

### Chart.js / D3 Alternative
If you prefer Chart.js or D3 over Recharts:

**Expected Data Format:**
```typescript
// For line/area charts
type ChartData = Array<{
  x: number | string;  // Month, year, or label
  y: number;           // Value
}>;

// For compound interest
type CompoundInterestData = Array<{
  year: number;
  contributions: number;
  total: number;
  interest: number;
}>;
```

### Responsive Considerations
All components use Tailwind breakpoints:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

---

## Support

For more examples, see the full component library in `/components/` and the design system showcase at `/components/DesignSystem.tsx`.
