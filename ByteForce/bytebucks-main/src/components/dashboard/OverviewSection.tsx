import { RewardsProgress } from '@/components/rewards/RewardsProgress';
import { ActivityFeed } from './ActivityFeed';
import { PortfolioChart } from './PortfolioChart';
import { Card } from '@/components/ui/card';
import { Transaction } from '@/hooks/useDashboardData';

interface OverviewSectionProps {
  transactions: Transaction[];
  loading?: boolean;
}

export function OverviewSection({ transactions, loading }: OverviewSectionProps) {
  // Mock rewards data
  const rewardData = {
    completedTransactions: 2,
    requiredTransactions: 4,
    discountPercentage: 20,
    rewardUnlocked: false,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Portfolio Chart */}
      <div className="lg:col-span-2">
        <Card className="p-6 glass h-full">
          <h3 className="font-serif font-semibold text-foreground mb-4">Portfolio Value</h3>
          <PortfolioChart />
        </Card>
      </div>

      {/* Rewards Progress */}
      <div>
        <Card className="p-6 glass h-full">
          <h3 className="font-serif font-semibold text-foreground mb-4">Rewards Progress</h3>
          <RewardsProgress
            completedTransactions={rewardData.completedTransactions}
            requiredTransactions={rewardData.requiredTransactions}
            discountPercentage={rewardData.discountPercentage}
            rewardUnlocked={rewardData.rewardUnlocked}
          />
        </Card>
      </div>

      {/* Activity Feed */}
      <div className="lg:col-span-3">
        <Card className="p-6 glass">
          <h3 className="font-serif font-semibold text-foreground mb-4">Recent Activity</h3>
          <ActivityFeed transactions={transactions} loading={loading} />
        </Card>
      </div>
    </div>
  );
}
