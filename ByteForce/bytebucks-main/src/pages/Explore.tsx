import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { FilterSection, FilterState } from '@/components/home/FilterSection';
import { Footer } from '@/components/layout/Footer';
import { useNFTs, NFTData } from '@/hooks/useNFTs';
import { RealNFTCard } from '@/components/nft/RealNFTCard';
import { Skeleton } from '@/components/ui/skeleton';

const Explore = () => {
  const [filters, setFilters] = useState<FilterState>({
    blockchain: 'all',
    sort: 'volume-24h',
    timeRange: '24h',
    ownerDistribution: 'all',
  });

  const { data: nfts, isLoading, error } = useNFTs({
    blockchain: filters.blockchain as 'ethereum' | 'polygon' | 'solana' | 'bitcoin' | 'all',
    isListed: true,
  });

  const filteredNFTs = useMemo(() => {
    if (!nfts) return [];
    
    let filtered = [...nfts];

    // Filter by price range
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(nft => (nft.price || 0) >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(nft => (nft.price || 0) <= filters.priceMax!);
    }

    // Sort
    switch (filters.sort) {
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'volume-24h':
      case 'volume-7d':
        filtered.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
        break;
      case 'sales':
        filtered.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return filtered;
  }, [nfts, filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="text-gradient">NFTs</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover unique digital assets from creators around the world
            </p>
          </div>

          {/* Filters */}
          <FilterSection onFilterChange={handleFilterChange} />

          {/* Results count */}
          <div className="mb-4 text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `Showing ${filteredNFTs.length} NFTs`}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-xl text-destructive">Error loading NFTs</p>
              <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
            </div>
          )}

          {/* NFT Grid */}
          {!isLoading && !error && filteredNFTs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNFTs.map((nft) => (
                <RealNFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredNFTs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No NFTs match your filters</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filter criteria</p>
            </div>
          )}

          {/* Load More */}
          {filteredNFTs.length > 0 && (
            <div className="text-center mt-12">
              <button className="px-8 py-3 rounded-xl glass text-foreground hover:bg-card/80 transition-all font-medium">
                Load More
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
