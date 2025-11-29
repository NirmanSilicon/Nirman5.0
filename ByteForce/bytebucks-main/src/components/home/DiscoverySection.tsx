import { useState } from 'react';
import { TrendingUp, Flame, Sparkles, Bitcoin, Gem, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RealNFTCard } from '@/components/nft/RealNFTCard';
import { CollectionCard } from '@/components/collection/CollectionCard';
import { useNFTs } from '@/hooks/useNFTs';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

type DiscoveryTab = 'trending' | 'lucky-buys' | 'memecoin' | 'bitcoin' | 'rare' | 'top-packs';

const tabs = [
  { id: 'trending' as const, label: 'Trending', icon: TrendingUp },
  { id: 'lucky-buys' as const, label: 'Lucky Buys', icon: Flame },
  { id: 'memecoin' as const, label: 'Memecoin NFTs', icon: Sparkles },
  { id: 'bitcoin' as const, label: 'Bitcoin NFTs', icon: Bitcoin },
  { id: 'rare' as const, label: 'Rare & Exotic', icon: Gem },
  { id: 'top-packs' as const, label: 'Top Packs', icon: Package },
];

export function DiscoverySection() {
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('trending');
  
  const { data: nfts, isLoading: nftsLoading } = useNFTs({ isListed: true, limit: 12 });
  
  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ['top-collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('total_volume', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  const getFilteredNFTs = () => {
    if (!nfts) return [];
    
    switch (activeTab) {
      case 'trending':
        return nfts.filter(nft => nft.badges?.includes('trending') || nft.views_count && nft.views_count > 100);
      case 'lucky-buys':
        return nfts.filter(nft => nft.badges?.includes('lucky-buy') || (nft.price && nft.price < 1));
      case 'memecoin':
        return nfts.filter(nft => nft.badges?.includes('viral-meme') || nft.name.toLowerCase().includes('doge'));
      case 'bitcoin':
        return nfts.filter(nft => nft.blockchain === 'bitcoin');
      case 'rare':
        return nfts.filter(nft => nft.rarity_score && nft.rarity_score > 80);
      case 'top-packs':
        return nfts.filter(nft => nft.badges?.includes('top-pack') || nft.badges?.includes('top-seller'));
      default:
        return nfts;
    }
  };

  const filteredNFTs = getFilteredNFTs();
  const displayNFTs = filteredNFTs.length > 0 ? filteredNFTs : (nfts?.slice(0, 8) || []);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Discover <span className="text-gradient">Exceptional</span> NFTs
            </h2>
            <p className="text-muted-foreground">
              Explore curated collections and trending digital assets
            </p>
          </div>
          <Link to="/explore">
            <Button variant="ghost" className="self-start md:self-auto">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nftsLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-2xl" />
            ))
          ) : (
            displayNFTs.map((nft) => (
              <RealNFTCard key={nft.id} nft={nft} />
            ))
          )}
        </div>

        {/* Top Collections */}
        <div className="mt-16">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Top <span className="text-gradient-accent">Collections</span>
              </h2>
              <p className="text-muted-foreground">
                Verified collections with the highest trading volume
              </p>
            </div>
            <Link to="/collections">
              <Button variant="ghost" className="hidden md:flex">
                View Rankings
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collectionsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))
            ) : (
              collections?.map((collection, index) => (
                <CollectionCard 
                  key={collection.id} 
                  collection={{
                    id: collection.id,
                    name: collection.name,
                    slug: collection.slug,
                    image: collection.image_url || '/placeholder.svg',
                    banner: collection.banner_url || collection.image_url || '/placeholder.svg',
                    description: collection.description || '',
                    verified: collection.is_verified || false,
                    floorPrice: collection.floor_price || 0,
                    volume24h: collection.total_volume || 0,
                    volume7d: (collection.total_volume || 0) * 3,
                    volumeChange24h: Math.random() * 40 - 10,
                    volumeChange7d: Math.random() * 60 - 20,
                    totalSupply: collection.total_supply || 0,
                    uniqueOwners: collection.unique_owners || 0,
                    blockchain: (collection.blockchain as 'ethereum' | 'polygon' | 'solana' | 'bitcoin') || 'ethereum',
                    category: 'art' as const,
                    badges: collection.is_verified ? ['verified' as const] : [],
                    creator: {
                      id: collection.creator_id,
                      username: 'creator',
                      displayName: 'Creator',
                      avatar: '/placeholder.svg',
                      verified: true,
                      totalSales: 0,
                      followers: 0,
                    },
                  }} 
                  rank={index + 1} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
