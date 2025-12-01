import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock data - in production this would come from the database
const generateMockData = (days: number) => {
  const data = [];
  let value = 5 + Math.random() * 3;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value = Math.max(0.5, value + (Math.random() - 0.48) * 0.5);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: parseFloat(value.toFixed(3)),
      valueUsd: parseFloat((value * 2300).toFixed(0)),
    });
  }
  
  return data;
};

const timeRanges = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
  { label: 'All', days: 365 },
];

export function PortfolioChart() {
  const [selectedRange, setSelectedRange] = useState('30d');
  const days = timeRanges.find(r => r.label === selectedRange)?.days || 30;
  const data = generateMockData(days);

  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[0]?.value || 0;
  const change = ((currentValue - previousValue) / previousValue) * 100;

  return (
    <div>
      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-3xl font-serif font-bold text-foreground">
            {currentValue.toFixed(3)} ETH
          </p>
          <p className={cn(
            "text-sm font-medium",
            change >= 0 ? "text-success" : "text-destructive"
          )}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}% ({selectedRange})
          </p>
        </div>
        
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {timeRanges.map((range) => (
            <Button
              key={range.label}
              variant={selectedRange === range.label ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                "text-xs px-3",
                selectedRange === range.label && "bg-primary text-primary-foreground"
              )}
              onClick={() => setSelectedRange(range.label)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${value} ETH`}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
              formatter={(value: number) => [`${value} ETH`, 'Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
