import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, Zap, Sparkles, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { NFTData } from '@/hooks/useNFTs';

const blockchainConfig: Record<string, { symbol: string; color: string; name: string }> = {
  ethereum: { symbol: 'ETH', color: '#627EEA', name: 'Ethereum' },
  polygon: { symbol: 'MATIC', color: '#8247E5', name: 'Polygon' },
  solana: { symbol: 'SOL', color: '#14F195', name: 'Solana' },
  bitcoin: { symbol: 'BTC', color: '#F7931A', name: 'Bitcoin' },
};

interface RealNFTCardProps {
  nft: NFTData;
  onWishlistToggle?: (id: string) => void;
}

export function RealNFTCard({ nft, onWishlistToggle }: RealNFTCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  
  const blockchain = blockchainConfig[nft.blockchain] || blockchainConfig.ethereum;
  const isItemInCart = isInCart(nft.id);

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

  // Calculate a mock price change (in real app would come from price history)
  const priceChange = Math.random() > 0.5 ? Math.random() * 20 : -Math.random() * 10;
  const priceChangeColor = priceChange >= 0 ? 'text-success' : 'text-destructive';
  const priceChangeSign = priceChange >= 0 ? '+' : '';

  return (
    <div className="nft-card group cursor-pointer" onClick={handleCardClick}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <img
          src={nft.image_url}
          alt={nft.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Top Actions */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {nft.badges?.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="px-2 py-1 text-[10px] font-medium rounded-md flex items-center gap-1 bg-primary/20 text-primary"
              >
                <Sparkles className="w-3 h-3" />
                {badge}
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

        {/* Quick Actions on Hover */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Button size="sm" className="flex-1 rounded-lg" variant="elegant" onClick={handleBuyNow}>
            <ShoppingCart className="w-4 h-4" />
            {isItemInCart ? 'In Cart' : 'Add to Cart'}
          </Button>
          <Button size="sm" variant="elegant-outline" className="rounded-lg" onClick={handleInstantBuy}>
            <Zap className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Collection & Blockchain */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {nft.collection?.image_url && (
              <img
                src={nft.collection.image_url}
                alt={nft.collection.name}
                className="w-5 h-5 rounded-md"
              />
            )}
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {nft.collection?.name || 'Unknown Collection'}
            </span>
            {nft.collection?.is_verified && (
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
            <p className="text-xs text-muted-foreground mb-1">Current Price</p>
            <p className="text-lg font-semibold text-foreground">
              {nft.price || 0} <span className="text-sm text-muted-foreground">{blockchain.symbol}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              ≈ ${(nft.price_usd || 0).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{(nft.views_count || 0).toLocaleString()}</span>
            </div>
            <p className={cn('text-sm font-medium', priceChangeColor)}>
              {priceChangeSign}{priceChange.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Editions if applicable */}
        {nft.editions && nft.editions > 1 && (
          <div className="pt-3 border-t border-border">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Editions</span>
              <span className="font-medium">
                {nft.editions_available || nft.editions} / {nft.editions}
              </span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${((nft.editions_available || nft.editions) / nft.editions) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Rarity if applicable */}
        {nft.rarity_score && (
          <div className="pt-3 border-t border-border">
            <div className="flex justify-between text-xs items-center">
              <span className="text-muted-foreground">Rarity Score</span>
              <span className="font-medium text-primary px-2 py-0.5 rounded-md bg-primary/10">
                {nft.rarity_score}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
