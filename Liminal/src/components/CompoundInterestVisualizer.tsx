import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Slider } from "./ui/slider";
import { Card } from "./ui/card";
import { motion } from "motion/react";
import { TrendingUp, DollarSign, Calendar, Percent } from "lucide-react";

export function CompoundInterestVisualizer() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [monthlyContribution, setMonthlyContribution] = useState(500);

  const calculateCompoundInterest = () => {
    const data = [];
    let totalContributions = principal;
    let totalValue = principal;

    for (let year = 0; year <= years; year++) {
      if (year > 0) {
        totalContributions += monthlyContribution * 12;
        totalValue = totalValue * (1 + rate / 100) + monthlyContribution * 12 * (1 + rate / 200);
      }

      data.push({
        year,
        contributions: Math.round(totalContributions),
        total: Math.round(totalValue),
        interest: Math.round(totalValue - totalContributions),
      });
    }

    return data;
  };

  const data = calculateCompoundInterest();
  const finalValue = data[data.length - 1];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">Total Value</p>
              <p className="text-primary">${finalValue.total.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[var(--success)]/10 to-[var(--success)]/5 border-[var(--success)]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--success)]/10">
              <TrendingUp className="w-5 h-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-muted-foreground">Interest Earned</p>
              <p className="text-[var(--success)]">${finalValue.interest.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <DollarSign className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground">Contributions</p>
              <p className="text-accent-foreground">${finalValue.contributions.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Percent className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground">Return</p>
              <p className="text-secondary-foreground">
                {((finalValue.interest / finalValue.contributions) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="contributions"
              stroke="var(--gold)"
              fill="url(#colorContributions)"
              name="Contributions"
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--primary)"
              fill="url(#colorTotal)"
              name="Total Value"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
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

          <div>
            <div className="flex justify-between mb-2">
              <label>Annual Return Rate</label>
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
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label>Time Period (Years)</label>
              <span className="text-primary">{years} years</span>
            </div>
            <Slider
              value={[years]}
              onValueChange={([value]) => setYears(value)}
              min={1}
              max={40}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label>Monthly Contribution</label>
              <span className="text-primary">${monthlyContribution.toLocaleString()}</span>
            </div>
            <Slider
              value={[monthlyContribution]}
              onValueChange={([value]) => setMonthlyContribution(value)}
              min={0}
              max={2000}
              step={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
