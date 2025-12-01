import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  ArrowRightLeft, 
  ExternalLink, 
  Filter,
  Download,
  Search
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading?: boolean;
}

const transactionLabels: Record<string, string> = {
  mint: 'Mint',
  list: 'List',
  delist: 'Delist',
  sale: 'Sale',
  transfer: 'Transfer',
  offer_accepted: 'Offer Accepted',
  instant_sell: 'Instant Sell',
  royalty_payout: 'Royalty',
};

const transactionColors: Record<string, string> = {
  mint: 'bg-purple-500/10 text-purple-500',
  list: 'bg-blue-500/10 text-blue-500',
  delist: 'bg-orange-500/10 text-orange-500',
  sale: 'bg-success/10 text-success',
  transfer: 'bg-primary/10 text-primary',
  offer_accepted: 'bg-success/10 text-success',
  instant_sell: 'bg-success/10 text-success',
  royalty_payout: 'bg-amber-500/10 text-amber-500',
};

export function TransactionHistory({ transactions, loading }: TransactionHistoryProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.transaction_type !== typeFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <Card className="p-6 glass">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-20 h-6 bg-muted rounded" />
              <div className="flex-1 h-4 bg-muted rounded" />
              <div className="w-24 h-4 bg-muted rounded" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sale">Sales</SelectItem>
              <SelectItem value="mint">Mints</SelectItem>
              <SelectItem value="transfer">Transfers</SelectItem>
              <SelectItem value="list">Listings</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <Card className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Gas</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Chain</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Tx</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <ArrowRightLeft className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>No transactions found</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <Badge className={cn("font-medium", transactionColors[tx.transaction_type])}>
                        {transactionLabels[tx.transaction_type] || tx.transaction_type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-foreground">
                          {format(new Date(tx.created_at), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {tx.price ? (
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {tx.price.toFixed(4)} ETH
                          </p>
                          {tx.price_usd && (
                            <p className="text-xs text-muted-foreground">
                              ${tx.price_usd.toLocaleString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {tx.gas_fee ? (
                        <span className="text-sm text-muted-foreground">
                          {tx.gas_fee.toFixed(5)} ETH
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {tx.blockchain || 'Ethereum'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {tx.transaction_hash ? (
                        <a
                          href={`https://etherscan.io/tx/${tx.transaction_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          {tx.transaction_hash.slice(0, 6)}...
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
