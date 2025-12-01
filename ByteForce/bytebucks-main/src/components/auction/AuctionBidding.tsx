import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Gavel, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  Loader2,
  BadgeCheck,
  Crown,
  History
} from 'lucide-react';
import { useBids, Bid } from '@/hooks/useBids';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface AuctionBiddingProps {
  nftId: string;
  className?: string;
}

export function AuctionBidding({ nftId, className }: AuctionBiddingProps) {
  const { user } = useAuth();
  const { bids, auctionData, loading, placing, placeBid, cancelBid, getTimeRemaining, isHighestBidder } = useBids(nftId);
  const [bidAmount, setBidAmount] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [getTimeRemaining]);

  const handlePlaceBid = async () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    const success = await placeBid(amount);
    if (success) {
      setBidAmount('');
    }
  };

  const minBid = auctionData?.current_bid
    ? auctionData.current_bid + (auctionData.bid_increment || 0.01)
    : auctionData?.starting_bid || 0;

  const isAuctionEnded = timeRemaining?.ended;
  const reserveMet = auctionData?.reserve_price 
    ? (auctionData.current_bid || 0) >= auctionData.reserve_price 
    : true;

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!auctionData?.is_auction) {
    return null;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50">
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-primary" />
          Live Auction
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Countdown Timer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-1">
            <Clock className="h-4 w-4" />
            {isAuctionEnded ? 'Auction Ended' : 'Time Remaining'}
          </p>
          {!isAuctionEnded && timeRemaining && (
            <div className="flex justify-center gap-3">
              {timeRemaining.days > 0 && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{timeRemaining.days}</div>
                  <div className="text-xs text-muted-foreground">Days</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{timeRemaining.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{timeRemaining.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Mins</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{timeRemaining.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Secs</div>
              </div>
            </div>
          )}
          {isAuctionEnded && (
            <Badge variant="destructive" className="mt-2">Auction Closed</Badge>
          )}
        </div>

        {/* Current Bid */}
        <div className="bg-card/50 rounded-xl p-4 border border-border/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Current Bid</span>
            {!reserveMet && (
              <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                Reserve Not Met
              </Badge>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {auctionData.current_bid?.toFixed(4) || auctionData.starting_bid?.toFixed(4) || '0.00'}
            </span>
            <span className="text-lg text-muted-foreground">ETH</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            ≈ ${((auctionData.current_bid || auctionData.starting_bid || 0) * 2500).toLocaleString()} USD
          </p>
          
          {isHighestBidder && (
            <div className="mt-3 flex items-center gap-2 text-primary">
              <Crown className="h-4 w-4" />
              <span className="text-sm font-medium">You are the highest bidder!</span>
            </div>
          )}
        </div>

        {/* Place Bid */}
        {!isAuctionEnded && user && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder={`Min: ${minBid.toFixed(4)} ETH`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  step="0.001"
                  min={minBid}
                  className="text-lg"
                />
              </div>
              <Button
                onClick={handlePlaceBid}
                disabled={placing || !bidAmount || parseFloat(bidAmount) < minBid}
                className="px-6"
              >
                {placing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Gavel className="h-4 w-4 mr-2" />
                    Place Bid
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Minimum bid increment: {auctionData.bid_increment || 0.01} ETH
            </p>
          </div>
        )}

        {!user && !isAuctionEnded && (
          <div className="text-center py-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Sign in to place a bid</p>
          </div>
        )}

        {/* Bid History */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium">Bid History</h4>
            <Badge variant="secondary" className="ml-auto">{bids.length}</Badge>
          </div>

          <ScrollArea className="h-[200px]">
            {bids.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No bids yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {bids.map((bid, index) => (
                  <BidItem 
                    key={bid.id} 
                    bid={bid} 
                    isWinning={index === 0 && !isAuctionEnded}
                    onCancel={cancelBid}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

interface BidItemProps {
  bid: Bid;
  isWinning: boolean;
  onCancel: (bidId: string) => void;
}

function BidItem({ bid, isWinning, onCancel }: BidItemProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg transition-colors",
      isWinning ? "bg-primary/10 border border-primary/30" : "bg-muted/30",
      bid.status === 'outbid' && "opacity-60",
      bid.status === 'cancelled' && "opacity-40 line-through"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={bid.bidder?.avatar_url || undefined} />
        <AvatarFallback className="bg-primary/20 text-primary text-xs">
          {bid.bidder?.display_name?.[0] || bid.bidder?.username?.[0] || '?'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">
            {bid.bidder?.display_name || bid.bidder?.username || 'Anonymous'}
          </span>
          {bid.bidder?.is_verified && (
            <BadgeCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          )}
          {isWinning && (
            <Crown className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}
        </p>
      </div>

      <div className="text-right">
        <div className="font-bold">{bid.amount.toFixed(4)} ETH</div>
        {bid.amount_usd && (
          <div className="text-xs text-muted-foreground">
            ${bid.amount_usd.toLocaleString()}
          </div>
        )}
      </div>

      {bid.status === 'active' && bid.bidder_id && (
        <Badge variant={isWinning ? 'default' : 'secondary'} className="text-xs">
          {isWinning ? 'Winning' : 'Active'}
        </Badge>
      )}
      {bid.status === 'outbid' && (
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Outbid
        </Badge>
      )}
    </div>
  );
}
