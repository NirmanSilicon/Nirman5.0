// NEW: src/pages/NFTDetail.tsx
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, ArrowLeft, ShoppingCart, Tag, Gavel, Info, BarChart2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { data: nft, isLoading, error } = useNFT(id);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const blockchain = nft ? blockchainConfig[nft.blockchain] : blockchainConfig.ethereum;
  const isItemInCart = id ? isInCart(id) : false;
  const isAuction = nft?.is_auction || false;

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      navigate('/auth', { state: { from: `/nft/${id}` } });
      return;
    }

    if (!id) return;

    if (isItemInCart) {
      toast({
        title: "Already in cart",
        description: `${nft?.name} is already in your cart.`,
      });
      return;
    }

    try {
      await addToCart(id);
      toast({
        title: "Added to cart",
        description: `${nft?.name} has been added to your cart.`,
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const handleMakeOffer = () => {
     toast({
        title: "Make Offer",
        description: "Offer functionality is not yet available.",
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/explore" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Column - Image */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-4">
                   <div className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={nft.image_url}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setIsWishlisted(!isWishlisted)} className={cn('bg-background/60 backdrop-blur-sm', isWishlisted ? 'text-red-500' : 'text-foreground')}>
                          <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-background/60 backdrop-blur-sm">
                          <Share2 className="w-5 h-5" />
                        </Button>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Title and Collection */}
              <div>
                {nft.collection &&
                    <Link to={`/collections/${nft.collection?.slug}`} className="text-primary font-medium hover:underline">{nft.collection?.name || 'Unknown Collection'}</Link>
                }
                <h1 className="text-3xl md:text-4xl font-bold">{nft.name}</h1>
              </div>
              
              {/* Creator Info */}
              {nft.creator && (
                 <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Created by</span>
                    <Link to={`/user/${nft.creator.id}`} className="font-semibold text-foreground hover:underline">@{nft.creator.username || 'unknown'}</Link>
                 </div>
              )}

              {/* Price Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{isAuction ? 'Auction' : 'Price'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold">{nft.price || 'N/A'} {blockchain.symbol}</span>
                    {nft.price_usd != null && <span className="text-muted-foreground">${nft.price_usd.toLocaleString()}</span>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {isAuction ? (
                      <Button size="lg" className="flex-1">
                        <Gavel className="w-5 h-5 mr-2" />
                        Place Bid
                      </Button>
                    ) : (
                      <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isItemInCart}>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        {isItemInCart ? 'Already in Cart' : 'Add to Cart'}
                      </Button>
                    )}
                    <Button size="lg" variant="outline" className="flex-1" onClick={handleMakeOffer}>
                      <Tag className="w-5 h-5 mr-2" />
                      Make Offer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Overview/Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{nft.description || 'No description provided.'}</p>
                </CardContent>
              </Card>

            </div>
          </div>
          
          {/* Price History Chart Section */}
          <div className="mt-12">
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5" />
                    Price History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                   {id && <PriceHistoryChart nftId={id} blockchain={nft.blockchain} />}
                </CardContent>
              </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NFTDetail;