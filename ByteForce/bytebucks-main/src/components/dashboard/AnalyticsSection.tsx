import { useState } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DashboardStats, OwnedNFT } from '@/hooks/useDashboardData';

interface AnalyticsSectionProps {
  stats: DashboardStats;
  ownedNFTs: OwnedNFT[];
}

// Mock data for charts
const profitLossData = [
  { name: 'Jan', profit: 0.5, loss: -0.2 },
  { name: 'Feb', profit: 0.8, loss: -0.1 },
  { name: 'Mar', profit: 0.3, loss: -0.4 },
  { name: 'Apr', profit: 1.2, loss: -0.1 },
  { name: 'May', profit: 0.9, loss: -0.3 },
  { name: 'Jun', profit: 1.5, loss: -0.2 },
];

const holdingsData = [
  { name: 'Ethereum', value: 65, color: 'hsl(var(--primary))' },
  { name: 'Polygon', value: 20, color: 'hsl(var(--secondary))' },
  { name: 'Solana', value: 10, color: 'hsl(var(--accent))' },
  { name: 'Bitcoin', value: 5, color: 'hsl(var(--muted-foreground))' },
];

const volumeData = [
  { month: 'Jul', buys: 2.5, sells: 1.2 },
  { month: 'Aug', buys: 1.8, sells: 2.1 },
  { month: 'Sep', buys: 3.2, sells: 0.8 },
  { month: 'Oct', buys: 2.1, sells: 1.5 },
  { month: 'Nov', buys: 4.5, sells: 2.3 },
];

export function AnalyticsSection({ stats, ownedNFTs }: AnalyticsSectionProps) {
  const [timeRange, setTimeRange] = useState('30d');

  const totalProfit = profitLossData.reduce((sum, d) => sum + d.profit, 0);
  const totalLoss = profitLossData.reduce((sum, d) => sum + d.loss, 0);
  const netProfitLoss = totalProfit + totalLoss;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 glass">
          <p className="text-sm text-muted-foreground mb-2">Total Profit</p>
          <p className="text-2xl font-serif font-bold text-success">
            +{totalProfit.toFixed(2)} ETH
          </p>
        </Card>
        <Card className="p-6 glass">
          <p className="text-sm text-muted-foreground mb-2">Total Loss</p>
          <p className="text-2xl font-serif font-bold text-destructive">
            {totalLoss.toFixed(2)} ETH
          </p>
        </Card>
        <Card className="p-6 glass">
          <p className="text-sm text-muted-foreground mb-2">Net P&L</p>
          <p className={cn(
            "text-2xl font-serif font-bold",
            netProfitLoss >= 0 ? "text-success" : "text-destructive"
          )}>
            {netProfitLoss >= 0 ? '+' : ''}{netProfitLoss.toFixed(2)} ETH
          </p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit/Loss Chart */}
        <Card className="p-6 glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif font-semibold text-foreground">Profit & Loss</h3>
            <div className="flex gap-1">
              {['7d', '30d', '90d'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${value} ETH`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="profit" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="loss" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Holdings Distribution */}
        <Card className="p-6 glass">
          <h3 className="font-serif font-semibold text-foreground mb-6">Holdings by Chain</h3>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={holdingsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {holdingsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Transaction Volume */}
        <Card className="p-6 glass lg:col-span-2">
          <h3 className="font-serif font-semibold text-foreground mb-6">Transaction Volume</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="buyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sellGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${value} ETH`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="buys"
                  name="Buys"
                  stroke="hsl(var(--success))"
                  fill="url(#buyGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sells"
                  name="Sells"
                  stroke="hsl(var(--destructive))"
                  fill="url(#sellGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
