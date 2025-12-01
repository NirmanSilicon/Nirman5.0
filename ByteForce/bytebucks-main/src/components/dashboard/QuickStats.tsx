import { TrendingUp, TrendingDown, Wallet, Image, Layers, ArrowRightLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DashboardStats } from '@/hooks/useDashboardData';

interface QuickStatsProps {
  stats: DashboardStats;
  loading?: boolean;
}

export function QuickStats({ stats, loading }: QuickStatsProps) {
  const statCards = [
    {
      label: 'Portfolio Value',
      value: `${stats.totalPortfolioValue.toFixed(2)} ETH`,
      subValue: `$${stats.totalPortfolioValueUsd.toLocaleString()}`,
      change: stats.portfolioChange24h,
      icon: Wallet,
    },
    {
      label: 'NFTs Owned',
      value: stats.nftsOwned.toString(),
      subValue: `Across ${stats.collectionsCount} collections`,
      icon: Image,
    },
    {
      label: 'Collections',
      value: stats.collectionsCount.toString(),
      subValue: 'Unique collections',
      icon: Layers,
    },
    {
      label: 'Total Volume',
      value: `${stats.totalVolume.toFixed(2)} ETH`,
      subValue: `${stats.totalTransactions} transactions`,
      icon: ArrowRightLeft,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 glass animate-pulse">
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-32 bg-muted rounded mb-2" />
            <div className="h-3 w-20 bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6 glass hover:shadow-elegant transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <stat.icon className="w-5 h-5 text-primary" />
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-serif font-bold text-foreground">
              {stat.value}
            </p>
            
            <div className="flex items-center gap-2">
              {stat.change !== undefined && (
                <span className={cn(
                  "flex items-center text-sm font-medium",
                  stat.change >= 0 ? "text-success" : "text-destructive"
                )}>
                  {stat.change >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(stat.change).toFixed(1)}%
                </span>
              )}
              <span className="text-xs text-muted-foreground">{stat.subValue}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
