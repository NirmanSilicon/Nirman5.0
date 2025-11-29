import { formatDistanceToNow } from 'date-fns';
import { 
  ShoppingCart, 
  Tag, 
  ArrowRightLeft, 
  Gavel, 
  Image,
  ExternalLink
} from 'lucide-react';
import { Transaction } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  transactions: Transaction[];
  loading?: boolean;
}

const transactionIcons: Record<string, React.ElementType> = {
  mint: Image,
  list: Tag,
  delist: Tag,
  sale: ShoppingCart,
  transfer: ArrowRightLeft,
  offer_accepted: Gavel,
  instant_sell: ShoppingCart,
  royalty_payout: ShoppingCart,
};

const transactionColors: Record<string, string> = {
  mint: 'text-purple-500',
  list: 'text-blue-500',
  delist: 'text-orange-500',
  sale: 'text-success',
  transfer: 'text-primary',
  offer_accepted: 'text-success',
  instant_sell: 'text-success',
  royalty_payout: 'text-amber-500',
};

const transactionLabels: Record<string, string> = {
  mint: 'Minted',
  list: 'Listed',
  delist: 'Delisted',
  sale: 'Sold',
  transfer: 'Transferred',
  offer_accepted: 'Offer Accepted',
  instant_sell: 'Instant Sold',
  royalty_payout: 'Royalty Received',
};

export function ActivityFeed({ transactions, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ArrowRightLeft className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p>No recent activity</p>
        <p className="text-sm">Your transactions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {transactions.slice(0, 10).map((tx) => {
        const Icon = transactionIcons[tx.transaction_type] || ArrowRightLeft;
        const iconColor = transactionColors[tx.transaction_type] || 'text-muted-foreground';
        const label = transactionLabels[tx.transaction_type] || tx.transaction_type;

        return (
          <div 
            key={tx.id} 
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className={cn("p-2 rounded-full bg-muted", iconColor)}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {label}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
              </p>
            </div>

            {tx.price && (
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {tx.price.toFixed(4)} ETH
                </p>
                {tx.price_usd && (
                  <p className="text-xs text-muted-foreground">
                    ${tx.price_usd.toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {tx.transaction_hash && (
              <a
                href={`https://etherscan.io/tx/${tx.transaction_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
