import { useState } from "react";
import { Slider } from "./ui/slider";
import { Card } from "./ui/card";
import { TrendingDown, DollarSign, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState(10000);
  const [inflationRate, setInflationRate] = useState(3);
  const [years, setYears] = useState(10);

  const calculateInflation = () => {
    const data = [];
    let nominalValue = currentAmount;
    let realValue = currentAmount;

    for (let year = 0; year <= years; year++) {
      if (year > 0) {
        realValue = currentAmount / Math.pow(1 + inflationRate / 100, year);
      }

      data.push({
        year,
        nominal: Math.round(nominalValue),
        real: Math.round(realValue),
        loss: Math.round(nominalValue - realValue),
      });
    }

    return data;
  };

  const data = calculateInflation();
  const finalYear = data[data.length - 1];
  const totalLoss = finalYear.loss;
  const percentageLoss = ((totalLoss / currentAmount) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <DollarSign className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground">Current Value</p>
              <p className="text-secondary-foreground text-xl">
                ${currentAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[var(--risk)]/10 to-[var(--risk)]/5 border-[var(--risk)]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--risk)]/10">
              <TrendingDown className="w-5 h-5 text-[var(--risk)]" />
            </div>
            <div>
              <p className="text-muted-foreground">Purchasing Power</p>
              <p className="text-[var(--risk)] text-xl">
                ${finalYear.real.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-muted/50 to-muted/20 border-muted">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground">Value Lost</p>
              <p className="text-foreground text-xl">
                ${totalLoss.toLocaleString()}
              </p>
              <p className="text-[var(--risk)]">-{percentageLoss}%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h4 className="mb-4">Purchasing Power Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" stroke="var(--muted-foreground)" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
            <YAxis stroke="var(--muted-foreground)" label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="nominal"
              stroke="var(--secondary)"
              strokeWidth={2}
              name="Nominal Value"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="real"
              stroke="var(--risk)"
              strokeWidth={2}
              name="Real Value (Inflation Adjusted)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label>Current Amount</label>
              <span className="text-primary">${currentAmount.toLocaleString()}</span>
            </div>
            <Slider
              value={[currentAmount]}
              onValueChange={([value]) => setCurrentAmount(value)}
              min={1000}
              max={100000}
              step={1000}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label>Inflation Rate</label>
              <span className="text-primary">{inflationRate}%</span>
            </div>
            <Slider
              value={[inflationRate]}
              onValueChange={([value]) => setInflationRate(value)}
              min={0}
              max={15}
              step={0.5}
            />
            <p className="text-muted-foreground mt-1">Average US inflation: ~3% per year</p>
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
        </div>
      </div>

      <Card className="p-6 bg-accent/5 border-accent/20">
        <h4 className="mb-3">What does this mean?</h4>
        <div className="space-y-2 text-muted-foreground">
          <p>
            💡 <strong>Inflation</strong> reduces the purchasing power of money over time. At {inflationRate}% annual inflation:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              ${currentAmount.toLocaleString()} today will only buy ${finalYear.real.toLocaleString()} worth of goods in {years} years
            </li>
            <li>You lose ${totalLoss.toLocaleString()} ({percentageLoss}%) in purchasing power</li>
            <li>
              To maintain value, your money needs to grow at least {inflationRate}% annually
            </li>
          </ul>
          <p className="pt-2">
            <strong>Pro Tip:</strong> Investing in assets that historically outpace inflation (stocks, real estate, etc.) helps preserve and grow your wealth.
          </p>
        </div>
      </Card>
    </div>
  );
}
