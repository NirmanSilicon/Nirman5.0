import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NFTCard } from '@/components/nft/NFTCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  Search,
  Grid3X3,
  LayoutList,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  BarChart3,
  Verified,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { mockNFTs, mockCollections, blockchainConfig, type NFT, type Collection } from '@/data/mockData';

const sortOptions = [
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'recent', label: 'Recently Listed' },
  { value: 'rarity', label: 'Rarity: Rare to Common' },
];

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-low');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true);

      // First try to fetch from Supabase
      const { data: dbCollection } = await supabase
        .from('collections')
        .select(`
          *,
          profiles:creator_id (
            id,
            username,
            display_name,
            avatar_url,
            is_verified
          )
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (dbCollection) {
        // Fetch NFTs for this collection
        const { data: dbNfts } = await supabase
          .from('nfts')
          .select(`
            *,
            collections:collection_id (*),
            creator:creator_id (*)
          `)
          .eq('collection_id', dbCollection.id);

        // Map to expected format
        setCollection({
          id: dbCollection.id,
          name: dbCollection.name,
          slug: dbCollection.slug,
          image: dbCollection.image_url || '',
          banner: dbCollection.banner_url,
          description: dbCollection.description || '',
          creator: {
            id: dbCollection.profiles?.id || '',
            username: dbCollection.profiles?.username || '',
            displayName: dbCollection.profiles?.display_name || '',
            avatar: dbCollection.profiles?.avatar_url || '',
            verified: dbCollection.profiles?.is_verified || false,
            totalSales: 0,
            followers: 0,
          },
          blockchain: dbCollection.blockchain as any,
          floorPrice: Number(dbCollection.floor_price) || 0,
          volume24h: Number(dbCollection.total_volume) || 0,
          volume7d: 0,
          volumeChange24h: 0,
          volumeChange7d: 0,
          totalSupply: dbCollection.total_supply || 0,
          uniqueOwners: dbCollection.unique_owners || 0,
          category: 'collectibles',
          badges: dbCollection.is_verified ? ['verified'] : [],
          verified: dbCollection.is_verified || false,
        });

        if (dbNfts) {
          setNfts(dbNfts.map((nft: any) => ({
            id: nft.id,
            name: nft.name,
            image: nft.image_url,
            description: nft.description || '',
            price: Number(nft.price) || 0,
            priceUSD: Number(nft.price_usd) || 0,
            priceINR: 0,
            blockchain: nft.blockchain,
            collection: collection!,
            creator: nft.creator,
            category: 'collectibles',
            badges: nft.badges || [],
            rarity: nft.rarity_score ? `${nft.rarity_score}` : undefined,
            editions: nft.editions,
            editionsAvailable: nft.editions_available,
            isLaunched: true,
            likes: nft.likes_count || 0,
            views: nft.views_count || 0,
            priceHistory: [],
            floorPrice: Number(nft.floor_price) || 0,
            floorPriceChange24h: 0,
            volume24h: 0,
            volumeChange24h: 0,
            offers: [],
            isWishlisted: false,
          })));
        }
      } else {
        // Fall back to mock data
        const mockCollection = mockCollections.find(c => c.slug === slug);
        if (mockCollection) {
          setCollection(mockCollection);
          setNfts(mockNFTs.filter(nft => nft.collection.id === mockCollection.id));
        }
      }

      setIsLoading(false);
    };

    if (slug) {
      fetchCollection();
    }
  }, [slug]);

  // Filter and sort NFTs
  const filteredNfts = nfts
    .filter(nft => {
      const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRarity = selectedRarity === 'all' || nft.rarity === selectedRarity;
      return matchesSearch && matchesRarity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'recent':
          return b.views - a.views;
        case 'rarity':
          return (b.rarity?.length || 0) - (a.rarity?.length || 0);
        default:
          return 0;
      }
    });

  const uniqueRarities = [...new Set(nfts.map(n => n.rarity).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24">
          {/* Banner Skeleton */}
          <Skeleton className="h-64 w-full" />
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-6 w-2/3 mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Collection Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The collection you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/collections')}>
              Browse Collections
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const blockchain = blockchainConfig[collection.blockchain];
  const volumeChangeColor = collection.volumeChange24h >= 0 ? 'text-success' : 'text-destructive';
  const ownerRatio = collection.totalSupply > 0 
    ? ((collection.uniqueOwners / collection.totalSupply) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Banner */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
          {collection.banner && (
            <img
              src={collection.banner}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          {/* Collection Header */}
          <div className="relative -mt-16 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Collection Image */}
              <div className="relative">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-32 h-32 rounded-2xl border-4 border-background object-cover shadow-xl"
                />
                {collection.verified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Verified className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Collection Info */}
              <div className="flex-1 pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{collection.name}</h1>
                  <Badge
                    variant="secondary"
                    style={{ backgroundColor: `${blockchain.color}20`, color: blockchain.color }}
                  >
                    {blockchain.name}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {collection.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={collection.creator.avatar}
                      alt={collection.creator.displayName}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">
                      by <span className="font-medium">{collection.creator.displayName}</span>
                    </span>
                    {collection.creator.verified && (
                      <Verified className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Explorer
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Floor Price
              </div>
              <p className="text-xl font-bold">
                {collection.floorPrice} <span className="text-sm text-muted-foreground">{blockchain.symbol}</span>
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <BarChart3 className="w-4 h-4" />
                Volume (24h)
              </div>
              <p className="text-xl font-bold">
                {collection.volume24h.toLocaleString()} <span className="text-sm text-muted-foreground">{blockchain.symbol}</span>
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                {collection.volumeChange24h >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                Change (24h)
              </div>
              <p className={cn('text-xl font-bold', volumeChangeColor)}>
                {collection.volumeChange24h >= 0 ? '+' : ''}{collection.volumeChange24h}%
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Package className="w-4 h-4" />
                Items
              </div>
              <p className="text-xl font-bold">{collection.totalSupply.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Users className="w-4 h-4" />
                Owners
              </div>
              <p className="text-xl font-bold">{collection.uniqueOwners.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Users className="w-4 h-4" />
                Unique Ratio
              </div>
              <p className="text-xl font-bold">{ownerRatio}%</p>
            </div>
          </div>

          {/* Filters & Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search in collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Rarities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                {uniqueRarities.map(rarity => (
                  <SelectItem key={rarity} value={rarity!}>{rarity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* NFTs Grid */}
          <div className={cn(
            'grid gap-6 mb-12',
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          )}>
            {filteredNfts.length > 0 ? (
              filteredNfts.map(nft => (
                <NFTCard key={nft.id} nft={nft} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground">No NFTs found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
