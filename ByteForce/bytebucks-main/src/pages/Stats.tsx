import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marketStats, blockchainConfig } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Collection {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  floor_price: number | null;
  total_volume: number | null;
  total_sales: number | null;
  is_verified: boolean | null;
  blockchain: 'ethereum' | 'polygon' | 'solana' | 'bitcoin' | null;
}

const Stats = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    async function fetchCollections() {
      const { data } = await supabase
        .from('collections')
        .select('id, name, slug, image_url, floor_price, total_volume, total_sales, is_verified, blockchain')
        .order('total_volume', { ascending: false })
        .limit(10);
      
      if (data) setCollections(data);
    }
    fetchCollections();
  }, []);

  // Generate realistic chart data
  const volumeData = [
    { name: 'Jan', volume: 1200, sales: 450, users: 12000 },
    { name: 'Feb', volume: 1900, sales: 620, users: 15000 },
    { name: 'Mar', volume: 1500, sales: 480, users: 13500 },
    { name: 'Apr', volume: 2200, sales: 780, users: 18000 },
    { name: 'May', volume: 2800, sales: 920, users: 22000 },
    { name: 'Jun', volume: 2400, sales: 850, users: 20000 },
    { name: 'Jul', volume: 3100, sales: 1100, users: 25000 },
    { name: 'Aug', volume: 2900, sales: 980, users: 24000 },
    { name: 'Sep', volume: 3500, sales: 1250, users: 28000 },
    { name: 'Oct', volume: 3200, sales: 1150, users: 26000 },
    { name: 'Nov', volume: 3800, sales: 1400, users: 32000 },
    { name: 'Dec', volume: 4200, sales: 1600, users: 38000 },
  ];

  const btcVolumeData = [
    { name: 'Mon', volume: 12, sales: 45 },
    { name: 'Tue', volume: 19, sales: 62 },
    { name: 'Wed', volume: 15, sales: 48 },
    { name: 'Thu', volume: 22, sales: 78 },
    { name: 'Fri', volume: 28, sales: 92 },
    { name: 'Sat', volume: 35, sales: 115 },
    { name: 'Sun', volume: 32, sales: 105 },
  ];

  const chainDistribution = [
    { name: 'Ethereum', value: 45, color: '#627EEA' },
    { name: 'Solana', value: 25, color: '#14F195' },
    { name: 'Polygon', value: 18, color: '#8247E5' },
    { name: 'Bitcoin', value: 12, color: '#F7931A' },
  ];

  const overallStats = [
    {
      label: 'Total Volume (All Time)',
      value: `$${(marketStats.totalVolume / 1000000).toFixed(1)}M`,
      change: 156.7,
      icon: DollarSign,
    },
    {
      label: 'Volume (24h)',
      value: `$${(marketStats.totalVolume24h / 1000).toFixed(0)}K`,
      change: 24.5,
      icon: Activity,
    },
    {
      label: 'Total NFTs',
      value: `${(marketStats.totalNFTs / 1000000).toFixed(2)}M`,
      change: 12.3,
      icon: Layers,
    },
    {
      label: 'Total Collections',
      value: marketStats.totalCollections.toLocaleString(),
      change: 8.9,
      icon: Layers,
    },
    {
      label: 'Active Traders',
      value: `${(marketStats.totalUsers / 1000).toFixed(0)}K`,
      change: 18.7,
      icon: Users,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 border border-border">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Market <span className="text-gradient">Statistics</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Real-time analytics and insights across all blockchains
              </p>
            </div>
            <div className="flex gap-2">
              {(['24h', '7d', '30d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    timeRange === range
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  )}
                >
                  {range === 'all' ? 'All Time' : range}
                </button>
              ))}
            </div>
          </div>

          {/* Overall Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {overallStats.map((stat) => {
              const isPositive = stat.change >= 0;
              return (
                <div key={stat.label} className="stats-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      isPositive ? 'text-success' : 'text-destructive'
                    )}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{stat.change}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Main Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {/* Volume Chart */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Trading Volume</h2>
                <span className="text-sm text-success font-medium">+24.5% vs last period</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeData}>
                    <defs>
                      <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v/1000}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#volumeGradient)"
                      name="Volume ($K)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Total Sales</h2>
                <span className="text-sm text-success font-medium">+18.2% vs last period</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sales" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chain Distribution & Active Users */}
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {/* Pie Chart */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-6">Volume by Chain</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chainDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chainDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {chainDistribution.map((chain) => (
                  <div key={chain.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }} />
                    <span className="text-xs text-muted-foreground">{chain.name}</span>
                    <span className="text-xs font-medium ml-auto">{chain.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Users Line Chart */}
            <div className="glass rounded-2xl p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Active Users</h2>
                <span className="text-sm text-success font-medium">+32.1% growth</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v/1000}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--accent))', strokeWidth: 0, r: 4 }}
                      name="Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bitcoin NFT Stats */}
          <div className="glass rounded-2xl p-6 mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <span className="text-warning font-bold">₿</span>
                </div>
                <h2 className="text-lg font-bold">Bitcoin NFT Market Stats</h2>
              </div>
              <Link to="/explore?chain=bitcoin">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={btcVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="volume" fill="#F7931A" radius={[4, 4, 0, 0]} name="Volume (BTC)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'BTC Volume (24h)', value: '89 BTC', change: 28.3 },
                  { label: 'Active Traders', value: '12,450', change: 15.2 },
                  { label: 'Collections', value: '234', change: 8.7 },
                  { label: 'Avg Sale Price', value: '0.025 BTC', change: -3.2 },
                ].map((stat) => (
                  <div key={stat.label} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className={cn(
                      'text-xs font-medium',
                      stat.change >= 0 ? 'text-success' : 'text-destructive'
                    )}>
                      {stat.change >= 0 ? '+' : ''}{stat.change}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Collections Table */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Top Collections by Volume ({timeRange})</h2>
              <Link to="/collections">
                <Button variant="ghost" size="sm">
                  View All Rankings
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">Collection</th>
                    <th className="pb-3 pr-4 text-right">Floor Price</th>
                    <th className="pb-3 pr-4 text-right">Volume ({timeRange})</th>
                    <th className="pb-3 pr-4 text-right">Change</th>
                    <th className="pb-3 text-right">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((col, i) => {
                    const chain = blockchainConfig[col.blockchain || 'ethereum'];
                    const volumeChange = (Math.random() * 40 - 10).toFixed(1);
                    const isPositive = parseFloat(volumeChange) >= 0;
                    return (
                      <tr key={col.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                        <td className="py-4 pr-4 font-medium text-muted-foreground">{i + 1}</td>
                        <td className="py-4 pr-4">
                          <Link to={`/collections/${col.slug}`} className="flex items-center gap-3">
                            <img 
                              src={col.image_url || '/placeholder.svg'} 
                              alt={col.name} 
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium hover:text-primary transition-colors">{col.name}</span>
                                {col.is_verified && (
                                  <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[8px] text-primary-foreground">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">{chain.name}</span>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 pr-4 text-right font-medium">
                          {(col.floor_price || 0).toFixed(2)} {chain.symbol}
                        </td>
                        <td className="py-4 pr-4 text-right font-medium">
                          {(col.total_volume || 0).toLocaleString()} {chain.symbol}
                        </td>
                        <td className={cn(
                          'py-4 pr-4 text-right font-medium',
                          isPositive ? 'text-success' : 'text-destructive'
                        )}>
                          {isPositive ? '+' : ''}{volumeChange}%
                        </td>
                        <td className="py-4 text-right text-muted-foreground">
                          {col.total_sales || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Stats;
