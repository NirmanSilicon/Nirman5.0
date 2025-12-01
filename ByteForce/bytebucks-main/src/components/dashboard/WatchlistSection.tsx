import { useState } from 'react';
import { Eye, EyeOff, Trash2, TrendingDown, TrendingUp, Bell, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useWatchlist } from '@/hooks/useWatchlist';
import { cn } from '@/lib/utils';

export function WatchlistSection() {
  const { watchlist, loading, removeFromWatchlist, toggleWatchlistActive } = useWatchlist();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 glass animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <Card className="p-12 glass text-center">
        <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
          No Price Alerts
        </h3>
        <p className="text-muted-foreground mb-6">
          Add NFTs or collections to your watchlist to get notified about price changes
        </p>
        <Button variant="elegant">
          <Plus className="w-4 h-4 mr-2" />
          Browse NFTs
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif font-semibold text-foreground">Price Alerts</h3>
          <p className="text-sm text-muted-foreground">
            {watchlist.filter(w => w.is_active).length} active alerts
          </p>
        </div>
        <Button variant="elegant-outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Alert
        </Button>
      </div>

      {/* Watchlist Items */}
      <div className="space-y-3">
        {watchlist.map((item) => {
          const displayItem = item.nft || item.collection;
          const currentPrice = item.nft?.price || item.collection?.floor_price || 0;
          const targetPrice = item.target_price || 0;
          const priceDiff = targetPrice ? ((currentPrice - targetPrice) / targetPrice) * 100 : 0;
          const isAboveTarget = currentPrice > targetPrice;

          return (
            <Card key={item.id} className={cn(
              "p-4 glass transition-all",
              !item.is_active && "opacity-60"
            )}>
              <div className="flex items-center gap-4">
                {/* Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {displayItem?.image_url ? (
                    <img 
                      src={displayItem.image_url} 
                      alt={displayItem.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Eye className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">
                      {displayItem?.name || 'Unknown'}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {item.alert_type === 'price_drop' ? 'Price Drop' : 'Price Rise'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Current: <span className="text-foreground">{currentPrice.toFixed(3)} ETH</span>
                    </span>
                    <span className="text-muted-foreground">
                      Target: <span className="text-foreground">{targetPrice.toFixed(3)} ETH</span>
                    </span>
                  </div>
                </div>

                {/* Price Status */}
                <div className="text-right hidden sm:block">
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    isAboveTarget ? "text-destructive" : "text-success"
                  )}>
                    {isAboveTarget ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(priceDiff).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isAboveTarget ? 'Above target' : 'Below target'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={(checked) => toggleWatchlistActive(item.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromWatchlist(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
