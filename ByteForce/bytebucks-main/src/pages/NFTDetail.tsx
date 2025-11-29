import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, ArrowLeft, Eye, Clock, Tag, ShoppingCart, Zap, TrendingUp, TrendingDown, History, Users, MessageCircle, Gavel } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CommentsSection } from '@/components/social/CommentsSection';
import { AuctionBidding } from '@/components/auction/AuctionBidding';
import { FollowButton } from '@/components/social/FollowButton';
import { PriceHistoryChart } from '@/components/nft/PriceHistoryChart';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useNFT } from '@/hooks/useNFTs';
import { toast } from '@/hooks/use-toast';

const blockchainConfig: Record<string, { symbol: string; color: string; name: string }> = {
  ethereum: { symbol: 'ETH', color: '#627EEA', name: 'Ethereum' },
  polygon: { symbol: 'MATIC', color: '#8247E5', name: 'Polygon' },
  solana: { symbol: 'SOL', color: '#14F195', name: 'Solana' },
  bitcoin: { symbol: 'BTC', color: '#F7931A', name: 'Bitcoin' },
};

const NFTDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { data: nft, isLoading, error } = useNFT(id);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'offers' | 'history' | 'traits' | 'comments'>('overview');
  
  const blockchain = nft ? blockchainConfig[nft.blockchain] : blockchainConfig.ethereum;
  const isItemInCart = id ? isInCart(id) : false;
  const isAuction = nft?.is_auction || false;

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
      });
      navigate('/auth', { state: { from: `/nft/${id}` } });
      return;
    }

    if (!id) return;

    if (isItemInCart) {
      toast({
        title: "Already in cart",
        description: `${nft?.name} is already in your cart`,
      });
      return;
    }

    await addToCart(id);
    toast({
      title: "Added to cart",
      description: `${nft?.name} has been added to your cart`,
    });
  };

  const handleMakeOffer = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make offers",
      });
      navigate('/auth', { state: { from: `/nft/${id}` } });
      return;
    }
    toast({
      title: "Make Offer",
      description: "Offer functionality coming soon",
    });
  };

  const handleInstantSell = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use instant sell",
      });
      navigate('/auth', { state: { from: `/nft/${id}` } });
      return;
    }
    toast({
      title: "Instant Sell",
      description: "KYC verification required for instant sell",
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'offers', label: 'Offers (0)' },
    { id: 'history', label: 'History' },
    { id: 'traits', label: 'Traits' },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
  ];

  // Mock price history chart data
  const chartData = [
    { month: 'Jan', price: 2.1, volume: 450 },
    { month: 'Feb', price: 2.3, volume: 520 },
    { month: 'Mar', price: 2.8, volume: 680 },
    { month: 'Apr', price: 2.5, volume: 420 },
    { month: 'May', price: 3.0, volume: 780 },
    { month: 'Jun', price: 3.2, volume: 850 },
  ];

  const maxPrice = Math.max(...chartData.map(d => d.price));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold mb-4">NFT Not Found</h1>
            <p className="text-muted-foreground mb-8">The NFT you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate mock price change
  const priceChange = Math.random() > 0.5 ? Math.random() * 20 : -Math.random() * 10;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link to="/explore" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden glass">
                <img
                  src={nft.image_url}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {nft.badges?.map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider bg-primary/20 text-primary"
                    >
                      {badge}
                    </span>
                  ))}
                  {isAuction && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider bg-yellow-500/20 text-yellow-500">
                      <Gavel className="w-3 h-3 inline mr-1" />
                      Auction
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all glass',
                      isWishlisted ? 'text-accent' : 'text-muted-foreground hover:text-accent'
                    )}
                  >
                    <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center glass text-muted-foreground hover:text-foreground">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="stats-card text-center">
                  <Eye className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold">{(nft.views_count || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div className="stats-card text-center">
                  <Heart className="w-5 h-5 text-accent mx-auto mb-1" />
                  <p className="text-lg font-bold">{(nft.likes_count || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
                <div className="stats-card text-center">
                  <Users className="w-5 h-5 text-secondary mx-auto mb-1" />
                  <p className="text-lg font-bold">{(nft.collection?.unique_owners || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Owners</p>
                </div>
              </div>

              {/* Auction Bidding Section (if auction) */}
              {isAuction && id && (
                <AuctionBidding nftId={id} />
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Collection Info */}
              <div className="flex items-center gap-3">
                {nft.collection?.image_url && (
                  <img
                    src={nft.collection.image_url}
                    alt={nft.collection.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{nft.collection?.name || 'Unknown Collection'}</span>
                    {nft.collection?.is_verified && (
                      <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[8px] text-primary-foreground">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className="ml-auto px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${blockchain.color}20`, color: blockchain.color }}
                >
                  {blockchain.name}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold">{nft.name}</h1>

              {/* Creator with Follow Button */}
              <div className="flex items-center gap-3">
                {nft.creator?.avatar_url && (
                  <img
                    src={nft.creator.avatar_url}
                    alt={nft.creator.display_name || 'Creator'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Created by</p>
                  <p className="text-sm font-medium">@{nft.creator?.username || 'unknown'}</p>
                </div>
                {nft.creator?.id && <FollowButton userId={nft.creator.id} size="sm" />}
              </div>

              {/* Price Card */}
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{isAuction ? 'Current Bid' : 'Current Price'}</span>
                  <div className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    priceChange >= 0 ? 'text-success' : 'text-destructive'
                  )}>
                    {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold">{nft.price || 0} {blockchain.symbol}</span>
                  <span className="text-muted-foreground pb-1">${(nft.price_usd || 0).toLocaleString()}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {isAuction ? (
                    <Button variant="hero" size="lg" className="flex-1">
                      <Gavel className="w-5 h-5" />
                      Place Bid
                    </Button>
                  ) : (
                    <Button variant="hero" size="lg" className="flex-1" onClick={handleAddToCart}>
                      <ShoppingCart className="w-5 h-5" />
                      {isItemInCart ? 'In Cart' : 'Add to Cart'}
                    </Button>
                  )}
                  <Button variant="glass" size="lg" className="flex-1" onClick={handleMakeOffer}>
                    <Tag className="w-5 h-5" />
                    Make Offer
                  </Button>
                </div>

                {/* Instant Sell */}
                {!isAuction && (
                  <Button variant="accent" className="w-full" onClick={handleInstantSell}>
                    <Zap className="w-4 h-4" />
                    Instant Sell at Floor ({nft.floor_price || 0} {blockchain.symbol})
                  </Button>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-border">
                <div className="flex gap-1 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={cn(
                        'px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap flex items-center gap-1',
                        activeTab === tab.id
                          ? 'border-primary text-foreground'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {tab.icon && <tab.icon className="w-4 h-4" />}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <p className="text-muted-foreground">{nft.description || 'No description available.'}</p>
                    
                    {/* Price History Chart */}
                    {id && <PriceHistoryChart nftId={id} blockchain={nft.blockchain} />}
                  </div>
                )}

                {activeTab === 'offers' && (
                  <div className="space-y-3">
                    <p className="text-center text-muted-foreground py-8">No offers yet</p>
                  </div>
                )}

                {activeTab === 'traits' && (
                  <div className="grid grid-cols-2 gap-3">
                    {nft.traits ? (
                      Object.entries(nft.traits as Record<string, string>).map(([key, value]) => (
                        <div key={key} className="p-3 rounded-lg bg-muted/30 border border-border">
                          <p className="text-xs text-primary uppercase tracking-wider">{key}</p>
                          <p className="font-medium">{String(value)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-2 text-center text-muted-foreground py-8">No traits available</p>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-3">
                    {[
                      { event: 'Listed', price: nft.price, from: nft.creator?.username || 'unknown', date: '2 days ago' },
                      { event: 'Minted', price: null, from: nft.creator?.username || 'unknown', date: '1 week ago' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{item.event}</p>
                            <p className="text-xs text-muted-foreground">by @{item.from}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {item.price && (
                            <p className="font-medium">{item.price} {blockchain.symbol}</p>
                          )}
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'comments' && id && (
                  <CommentsSection nftId={id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NFTDetail;
