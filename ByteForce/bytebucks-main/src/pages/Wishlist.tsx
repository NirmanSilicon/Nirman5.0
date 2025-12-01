import { useState } from 'react';
import { Heart, Trash2, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { mockNFTs, blockchainConfig } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Wishlist = () => {
  // Mock wishlisted NFTs
  const [wishlistedNFTs, setWishlistedNFTs] = useState(
    mockNFTs.filter(nft => nft.isWishlisted || nft.id === 'nft-2' || nft.id === 'nft-6')
  );

  const removeFromWishlist = (id: string) => {
    setWishlistedNFTs(prev => prev.filter(nft => nft.id !== id));
  };

  const totalValue = wishlistedNFTs.reduce((acc, nft) => acc + nft.priceUSD, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  My <span className="text-gradient-accent">Wishlist</span>
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                {wishlistedNFTs.length} item{wishlistedNFTs.length !== 1 ? 's' : ''} saved • Total value: ${totalValue.toLocaleString()}
              </p>
            </div>
            
            {wishlistedNFTs.length > 0 && (
              <Button variant="hero" size="lg">
                <ShoppingCart className="w-5 h-5" />
                Add All to Cart
              </Button>
            )}
          </div>

          {wishlistedNFTs.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start adding NFTs you love to keep track of them
              </p>
              <Button variant="default" asChild>
                <a href="/explore">Explore NFTs</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistedNFTs.map((nft) => {
                const blockchain = blockchainConfig[nft.blockchain];
                const isPositive = nft.floorPriceChange24h >= 0;

                return (
                  <div 
                    key={nft.id}
                    className="glass rounded-xl p-4 flex flex-col md:flex-row gap-4 hover:border-primary/50 transition-all"
                  >
                    {/* Image */}
                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground">{nft.collection.name}</span>
                        {nft.collection.verified && (
                          <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[8px] text-primary-foreground">
                            ✓
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{nft.name}</h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Price: </span>
                          <span className="font-semibold">{nft.price} {blockchain.symbol}</span>
                          <span className="text-muted-foreground"> (${nft.priceUSD.toLocaleString()})</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Floor: </span>
                          <span className="font-semibold">{nft.floorPrice} {blockchain.symbol}</span>
                        </div>
                        <div className={cn(
                          'flex items-center gap-1',
                          isPositive ? 'text-success' : 'text-destructive'
                        )}>
                          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-medium">
                            {isPositive ? '+' : ''}{nft.floorPriceChange24h}% (24h)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 md:justify-center">
                      <Button variant="default" size="sm" className="flex-1 md:flex-none">
                        <ShoppingCart className="w-4 h-4" />
                        Buy Now
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFromWishlist(nft.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
