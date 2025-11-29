import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Users, Verified } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Collection {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  banner_url: string | null;
  floor_price: number | null;
  total_volume: number | null;
  total_sales: number | null;
  unique_owners: number | null;
  is_verified: boolean | null;
  blockchain: 'ethereum' | 'polygon' | 'solana' | 'bitcoin' | null;
}

const blockchainConfig = {
  ethereum: { symbol: 'ETH', color: '#627EEA', name: 'Ethereum' },
  polygon: { symbol: 'MATIC', color: '#8247E5', name: 'Polygon' },
  solana: { symbol: 'SOL', color: '#14F195', name: 'Solana' },
  bitcoin: { symbol: 'BTC', color: '#F7931A', name: 'Bitcoin' },
};

const Collections = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      setLoading(true);
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('total_volume', { ascending: false });
      
      if (!error && data) {
        setCollections(data);
      }
      setLoading(false);
    }
    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Top <span className="text-gradient">Collections</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Explore the most popular NFT collections by volume
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex gap-2">
              {(['24h', '7d', '30d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    timeRange === range
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {range === 'all' ? 'All Time' : range}
                </button>
              ))}
            </div>
          </div>

          {/* Collections Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border mb-4">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Collection</div>
            <div className="col-span-2 text-right">Floor Price</div>
            <div className="col-span-2 text-right">Volume</div>
            <div className="col-span-2 text-right">Change</div>
            <div className="col-span-1 text-right">Owners</div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          )}

          {/* Collections List */}
          {!loading && (
            <div className="space-y-4">
              {collections.map((collection, index) => {
                const chain = blockchainConfig[collection.blockchain || 'ethereum'];
                const volumeChange = (Math.random() * 40 - 10).toFixed(1);
                const isPositive = parseFloat(volumeChange) >= 0;
                
                return (
                  <Link
                    key={collection.id}
                    to={`/collections/${collection.slug}`}
                    className="nft-card group cursor-pointer flex overflow-hidden"
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 bg-muted/50 border-r border-border">
                      <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                    </div>

                    {/* Image */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                      <img
                        src={collection.image_url || '/placeholder.svg'}
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                      <div>
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {collection.name}
                          </h3>
                          {collection.is_verified && (
                            <Verified className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {collection.is_verified && (
                            <span className="px-2 py-0.5 text-[9px] font-semibold rounded-full uppercase tracking-wider bg-primary/20 text-primary">
                              Verified
                            </span>
                          )}
                          <span
                            className="px-2 py-0.5 text-[9px] font-semibold rounded-full"
                            style={{ backgroundColor: `${chain.color}20`, color: chain.color }}
                          >
                            {chain.name}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground">Floor</p>
                          <p className="font-semibold text-foreground">
                            {(collection.floor_price || 0).toFixed(2)} {chain.symbol}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Volume 24h</p>
                          <div className="flex items-center gap-1">
                            <p className="font-semibold text-foreground">
                              {(collection.total_volume || 0).toLocaleString()} {chain.symbol}
                            </p>
                            <span className={cn(
                              'flex items-center text-[10px] font-medium',
                              isPositive ? 'text-success' : 'text-destructive'
                            )}>
                              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {isPositive ? '+' : ''}{volumeChange}%
                            </span>
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-muted-foreground">Owners</p>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <p className="font-semibold text-foreground">
                              {(collection.unique_owners || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && collections.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No collections found</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
