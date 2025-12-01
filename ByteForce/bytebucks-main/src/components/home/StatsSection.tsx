import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Bitcoin, Activity, BarChart3, Users, Loader2 } from 'lucide-react';
import { useMarketStats } from '@/hooks/useMarketStats';
import { cn } from '@/lib/utils';

export function StatsSection() {
  const { stats, isLoading } = useMarketStats();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const btcStats = [
    {
      label: 'Total Volume (USD)',
      value: `$${(stats.totalVolume / 1000).toFixed(1)}K`,
      valueUSD: `${stats.totalSales} sales`,
      change: stats.volumeChange24h,
      icon: Bitcoin,
    },
    {
      label: 'Volume (24h)',
      value: `$${(stats.volume24h / 1000).toFixed(1)}K`,
      change: stats.volumeChange24h,
      icon: Activity,
    },
    {
      label: 'Total Collections',
      value: stats.totalCollections.toString(),
      change: 8.7,
      icon: BarChart3,
    },
    {
      label: 'Total Users',
      value: stats.totalUsers.toString(),
      change: stats.salesChange24h,
      icon: Users,
    },
  ];

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-warning/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-warning/30 mb-6">
            <Bitcoin className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium text-warning">Live Market Data</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Market <span className="text-warning">Stats</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time analytics from the ByteBucks marketplace
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {btcStats.map((stat) => {
            const isPositive = stat.change >= 0;
            return (
              <div key={stat.label} className="stats-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-warning" />
                  </div>
                  <span className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    isPositive ? 'text-success' : 'text-destructive'
                  )}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {isPositive ? '+' : ''}{stat.change.toFixed(1)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                {stat.valueUSD && (
                  <p className="text-sm text-muted-foreground">{stat.valueUSD}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Volume & Sales Overview</h3>
            <div className="flex gap-2">
              {['24h', '7d', '30d', 'All'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    period === selectedPeriod
                      ? 'bg-warning text-warning-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-64 flex items-end gap-2 px-4">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 68].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col gap-1">
                <div
                  className="w-full bg-gradient-to-t from-warning/80 to-warning/40 rounded-t-sm transition-all hover:from-warning hover:to-warning/60"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-muted-foreground text-center">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                </span>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-sm text-muted-foreground">Sales Volume</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">24h Sales: </span>
              <span className="font-semibold">{stats.sales24h}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Avg Price: </span>
              <span className="font-semibold">${stats.avgPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
