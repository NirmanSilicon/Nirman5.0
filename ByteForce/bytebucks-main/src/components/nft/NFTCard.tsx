import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Eye, ShoppingCart, Zap, Sparkles, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type NFT, blockchainConfig, badgeConfig } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

interface NFTCardProps {
  nft: NFT;
  onWishlistToggle?: (id: string) => void;
}

export function NFTCard({ nft, onWishlistToggle }: NFTCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(nft.isWishlisted || false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  
  const blockchain = blockchainConfig[nft.blockchain];
  const isItemInCart = isInCart(nft.id);

  // Countdown timer for unreleased NFTs
  useEffect(() => {
    if (!nft.launchDate || nft.isLaunched) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const launch = new Date(nft.launchDate!).getTime();
      const diff = launch - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${mins}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      } else {
        setTimeLeft(`${mins}m ${secs}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nft.launchDate, nft.isLaunched]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onWishlistToggle?.(nft.id);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? `${nft.name} removed` : `${nft.name} added to your wishlist`,
    });
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
      });
      navigate('/auth', { state: { from: `/nft/${nft.id}` } });
      return;
    }

    if (isItemInCart) {
      toast({
        title: "Already in cart",
        description: `${nft.name} is already in your cart`,
      });
      return;
    }

    await addToCart(nft.id);
    toast({
      title: "Added to cart",
      description: `${nft.name} has been added to your cart`,
    });
  };

  const handleInstantBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make purchases",
      });
      navigate('/auth', { state: { from: `/nft/${nft.id}` } });
      return;
    }

    toast({
      title: "Instant Buy",
      description: "KYC verification required for instant purchases",
    });
  };

  const handleCardClick = () => {
    navigate(`/nft/${nft.id}`);
  };

  const priceChangeColor = nft.floorPriceChange24h >= 0 ? 'text-success' : 'text-destructive';
  const priceChangeSign = nft.floorPriceChange24h >= 0 ? '+' : '';

  return (
    <div className="nft-card group cursor-pointer" onClick={handleCardClick}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Top Actions */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {nft.badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className={cn(
                  'px-2 py-1 text-[10px] font-medium rounded-md flex items-center gap-1',
                  badgeConfig[badge].className
                )}
              >
                <Sparkles className="w-3 h-3" />
                {badgeConfig[badge].label}
              </span>
            ))}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm',
              isWishlisted
                ? 'bg-primary/20 text-primary'
                : 'bg-background/60 text-muted-foreground hover:text-primary'
            )}
          >
            <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
          </button>
        </div>

        {/* Countdown Timer */}
        {timeLeft && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center justify-center gap-2 border border-border">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{timeLeft}</span>
              <span className="text-xs text-muted-foreground">until launch</span>
            </div>
          </div>
        )}

        {/* Quick Actions on Hover */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          {nft.isLaunched && !timeLeft && (
            <>
              <Button size="sm" className="flex-1 rounded-lg" variant="elegant" onClick={handleBuyNow}>
                <ShoppingCart className="w-4 h-4" />
                {isItemInCart ? 'In Cart' : 'Add to Cart'}
              </Button>
              <Button size="sm" variant="elegant-outline" className="rounded-lg" onClick={handleInstantBuy}>
                <Zap className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Collection & Blockchain */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={nft.collection.image}
              alt={nft.collection.name}
              className="w-5 h-5 rounded-md"
            />
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {nft.collection.name}
            </span>
            {nft.collection.verified && (
              <Verified className="w-3.5 h-3.5 text-primary" />
            )}
          </div>
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium"
            style={{ backgroundColor: `${blockchain.color}15`, color: blockchain.color }}
          >
            {blockchain.symbol}
          </div>
        </div>

        {/* Name */}
        <h3 className="font-serif font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {nft.name}
        </h3>

        {/* Price & Stats */}
        <div className="flex items-end justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {nft.isLaunched ? 'Current Price' : 'Starting Price'}
            </p>
            <p className="text-lg font-semibold text-foreground">
              {nft.price} <span className="text-sm text-muted-foreground">{blockchain.symbol}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              ≈ ${nft.priceUSD.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{nft.views.toLocaleString()}</span>
            </div>
            <p className={cn('text-sm font-medium', priceChangeColor)}>
              {priceChangeSign}{nft.floorPriceChange24h}%
            </p>
          </div>
        </div>

        {/* Editions if applicable */}
        {nft.editions && nft.editions > 1 && (
          <div className="pt-3 border-t border-border">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Editions</span>
              <span className="font-medium">
                {nft.editionsAvailable || nft.editions} / {nft.editions}
              </span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${((nft.editionsAvailable || nft.editions) / nft.editions) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Rarity if applicable */}
        {nft.rarity && (
          <div className="pt-3 border-t border-border">
            <div className="flex justify-between text-xs items-center">
              <span className="text-muted-foreground">Rarity</span>
              <span className="font-medium text-primary px-2 py-0.5 rounded-md bg-primary/10">
                {nft.rarity}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
