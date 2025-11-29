import { Gift, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RewardsProgressProps {
  completedTransactions: number;
  requiredTransactions?: number;
  rewardUnlocked?: boolean;
  rewardUsed?: boolean;
  discountPercentage?: number;
  className?: string;
  compact?: boolean;
}

export function RewardsProgress({
  completedTransactions,
  requiredTransactions = 4,
  rewardUnlocked = false,
  rewardUsed = false,
  discountPercentage = 20,
  className,
  compact = false,
}: RewardsProgressProps) {
  const progress = Math.min((completedTransactions / requiredTransactions) * 100, 100);
  const remaining = requiredTransactions - completedTransactions;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
            {rewardUnlocked ? (
              <Check className="w-5 h-5 text-accent-foreground" />
            ) : (
              <Gift className="w-5 h-5 text-accent-foreground" />
            )}
          </div>
          {!rewardUnlocked && (
            <svg className="absolute inset-0 w-10 h-10 -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${progress * 1.13} 113`}
                className="text-accent transition-all duration-500"
              />
            </svg>
          )}
        </div>
        <div>
          {rewardUnlocked && !rewardUsed ? (
            <p className="text-sm font-semibold text-accent">{discountPercentage}% OFF Ready!</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {completedTransactions}/{requiredTransactions} for {discountPercentage}% off
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('glass rounded-xl p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            rewardUnlocked 
              ? 'bg-gradient-to-br from-accent to-accent/60 animate-pulse' 
              : 'bg-accent/20'
          )}>
            {rewardUnlocked ? (
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            ) : (
              <Gift className="w-6 h-6 text-accent" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">Rewards Progress</h3>
            <p className="text-sm text-muted-foreground">
              {rewardUnlocked && !rewardUsed 
                ? `${discountPercentage}% discount unlocked!`
                : `Complete ${requiredTransactions} transactions to unlock`}
            </p>
          </div>
        </div>
        {rewardUnlocked && !rewardUsed && (
          <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium animate-pulse">
            {discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              rewardUnlocked
                ? 'bg-gradient-to-r from-accent via-accent/80 to-success'
                : 'bg-gradient-to-r from-primary to-secondary'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress Steps */}
        <div className="absolute top-0 left-0 right-0 flex justify-between -mt-1">
          {Array.from({ length: requiredTransactions }).map((_, i) => {
            const isCompleted = i < completedTransactions;
            const isCurrent = i === completedTransactions;
            return (
              <div
                key={i}
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all',
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isCurrent
                    ? 'bg-background border-primary text-primary'
                    : 'bg-muted border-border text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-6 text-center">
        {rewardUnlocked && !rewardUsed ? (
          <div className="space-y-2">
            <p className="text-lg font-semibold text-accent">
              🎉 Congratulations! Your reward is ready!
            </p>
            <p className="text-sm text-muted-foreground">
              {discountPercentage}% discount will be automatically applied at checkout
            </p>
          </div>
        ) : rewardUsed ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Reward used! Start earning your next {discountPercentage}% off
            </p>
            <p className="text-xs text-muted-foreground">
              {completedTransactions}/{requiredTransactions} transactions completed
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{remaining}</span> more transaction{remaining !== 1 ? 's' : ''} to unlock{' '}
            <span className="font-semibold text-accent">{discountPercentage}% off</span>
          </p>
        )}
      </div>
    </div>
  );
}
