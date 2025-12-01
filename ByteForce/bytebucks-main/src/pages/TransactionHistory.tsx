import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { getExplorerUrl } from '@/config/wallet';
import {
  Search,
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Package,
  Tag,
  Gavel,
  Filter,
  Fuel,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  transaction_type: string;
  price: number | null;
  price_usd: number | null;
  gas_fee: number | null;
  blockchain: string | null;
  transaction_hash: string | null;
  block_number: number | null;
  created_at: string;
  nft?: {
    name: string;
    image_url: string;
  };
  from_user?: {
    username: string;
    display_name: string;
  };
  to_user?: {
    username: string;
    display_name: string;
  };
}

const transactionTypes: Record<string, { label: string; icon: any; color: string }> = {
  mint: { label: 'Mint', icon: Package, color: 'text-success' },
  sale: { label: 'Sale', icon: Tag, color: 'text-primary' },
  purchase: { label: 'Purchase', icon: ArrowDownLeft, color: 'text-warning' },
  transfer: { label: 'Transfer', icon: Repeat, color: 'text-muted-foreground' },
  list: { label: 'List', icon: ArrowUpRight, color: 'text-primary' },
  delist: { label: 'Delist', icon: ArrowDownLeft, color: 'text-muted-foreground' },
  offer: { label: 'Offer', icon: Gavel, color: 'text-warning' },
  offer_accepted: { label: 'Offer Accepted', icon: Gavel, color: 'text-success' },
};

const blockchainSymbols: Record<string, string> = {
  ethereum: 'ETH',
  polygon: 'MATIC',
  solana: 'SOL',
  bitcoin: 'BTC',
};

export default function TransactionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterChain, setFilterChain] = useState<string>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;

      // Get profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) return;

      let query = supabase
        .from('transactions')
        .select(`
          *,
          nfts:nft_id (name, image_url)
        `)
        .or(`from_user_id.eq.${profile.id},to_user_id.eq.${profile.id}`)
        .order('created_at', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('transaction_type', filterType as any);
      }

      if (filterChain !== 'all') {
        query = query.eq('blockchain', filterChain as any);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data?.map((tx: any) => ({
          ...tx,
          nft: tx.nfts,
        })) || []);
      }
      setIsLoading(false);
    };

    fetchTransactions();
  }, [user?.id, filterType, filterChain]);

  const filteredTransactions = transactions.filter(tx => {
    if (!searchQuery) return true;
    return tx.nft?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tx.transaction_hash?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate totals
  const totalGasFees = transactions.reduce((sum, tx) => sum + (Number(tx.gas_fee) || 0), 0);
  const totalVolume = transactions
    .filter(tx => ['sale', 'purchase'].includes(tx.transaction_type))
    .reduce((sum, tx) => sum + (Number(tx.price_usd) || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-1/3 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Transaction History</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Repeat className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <Tag className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Volume</p>
                    <p className="text-2xl font-bold">${totalVolume.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Fuel className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Gas Fees</p>
                    <p className="text-2xl font-bold">{totalGasFees.toFixed(4)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by NFT name or transaction hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(transactionTypes).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterChain} onValueChange={setFilterChain}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Chains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-16">
                  <Repeat className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((tx) => {
                    const typeConfig = transactionTypes[tx.transaction_type] || transactionTypes.transfer;
                    const TypeIcon = typeConfig.icon;
                    const explorerUrl = tx.blockchain && tx.transaction_hash 
                      ? getExplorerUrl(tx.blockchain, tx.transaction_hash)
                      : null;

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        {/* NFT Image */}
                        {tx.nft?.image_url && (
                          <img
                            src={tx.nft.image_url}
                            alt={tx.nft?.name || 'NFT'}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}

                        {/* Transaction Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <TypeIcon className={cn('w-4 h-4', typeConfig.color)} />
                            <Badge variant="secondary" className={typeConfig.color}>
                              {typeConfig.label}
                            </Badge>
                            {tx.blockchain && (
                              <Badge variant="outline">
                                {blockchainSymbols[tx.blockchain] || tx.blockchain}
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium truncate">{tx.nft?.name || 'Unknown NFT'}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(tx.created_at), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>

                        {/* Price & Gas */}
                        <div className="text-right">
                          {tx.price && (
                            <p className="font-semibold">
                              {Number(tx.price).toFixed(4)}{' '}
                              <span className="text-muted-foreground">
                                {blockchainSymbols[tx.blockchain || 'ethereum']}
                              </span>
                            </p>
                          )}
                          {tx.price_usd && (
                            <p className="text-sm text-muted-foreground">
                              ≈ ${Number(tx.price_usd).toLocaleString()}
                            </p>
                          )}
                          {tx.gas_fee && (
                            <p className="text-xs text-warning flex items-center gap-1 justify-end">
                              <Fuel className="w-3 h-3" />
                              {Number(tx.gas_fee).toFixed(6)} gas
                            </p>
                          )}
                        </div>

                        {/* Explorer Link */}
                        {explorerUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(explorerUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
