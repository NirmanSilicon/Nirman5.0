import { Gift, ShoppingCart, Percent, Trophy } from 'lucide-react';
import { RewardsProgress } from '@/components/rewards/RewardsProgress';
import { Button } from '@/components/ui/button';

export function RewardsSection() {
  // Mock user reward data - would come from backend in real app
  const userRewardData = {
    completedTransactions: 2,
    requiredTransactions: 4,
    rewardUnlocked: false,
    rewardUsed: false,
    discountPercentage: 20,
  };

  const benefits = [
    {
      icon: ShoppingCart,
      title: 'Make Purchases',
      description: 'Complete transactions to earn progress',
    },
    {
      icon: Trophy,
      title: 'Unlock Rewards',
      description: 'Every 4 purchases unlocks 20% off',
    },
    {
      icon: Percent,
      title: 'Save More',
      description: 'Discount auto-applies at checkout',
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 mb-6">
            <Gift className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-accent">Rewards Program</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Earn <span className="text-gradient-accent">Rewards</span> While You Collect
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get 20% off your next purchase after completing 4 transactions. Track your progress and save!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          {/* Progress Card */}
          <RewardsProgress
            completedTransactions={userRewardData.completedTransactions}
            requiredTransactions={userRewardData.requiredTransactions}
            rewardUnlocked={userRewardData.rewardUnlocked}
            rewardUsed={userRewardData.rewardUsed}
            discountPercentage={userRewardData.discountPercentage}
          />

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    <span className="text-accent mr-2">{index + 1}.</span>
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
            
            <Button variant="accent" className="w-full mt-4">
              <ShoppingCart className="w-4 h-4" />
              Start Collecting
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
