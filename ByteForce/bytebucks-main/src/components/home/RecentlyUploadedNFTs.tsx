import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRecentNFTs } from '@/hooks/useUserNFTs';
import { 
  ArrowRight, 
  Eye,
  Verified,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const blockchainConfig: Record<string, { symbol: string; color: string }> = {
  ethereum: { symbol: 'ETH', color: 'text-blue-400' },
  polygon: { symbol: 'MATIC', color: 'text-purple-400' },
  solana: { symbol: 'SOL', color: 'text-green-400' },
  bitcoin: { symbol: 'BTC', color: 'text-orange-400' },
};

function RecentNFTCard({ nft }: { nft: any }) {
  const blockchain = blockchainConfig[nft.blockchain] || blockchainConfig.ethereum;

  return (
    <Link to={`/nft/${nft.id}`}>
      <Card className="group overflow-hidden glass hover:border-primary/50 transition-all duration-300 h-full">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={nft.image_url}
            alt={nft.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* New badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary/90 text-primary-foreground text-xs gap-1">
              <Clock className="w-3 h-3" />
              New
            </Badge>
          </div>

          {/* Views count */}
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/60 text-white text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {nft.views_count || 0}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Creator info */}
          {nft.creator && (
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={nft.creator.avatar_url || undefined} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {(nft.creator.display_name || nft.creator.username || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate flex items-center gap-1">
                {nft.creator.display_name || nft.creator.username || 'Anonymous'}
                {nft.creator.is_verified && (
                  <Verified className="w-3 h-3 text-primary" />
                )}
              </span>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-foreground truncate">{nft.name}</h3>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(nft.created_at), { addSuffix: true })}
            </p>
          </div>

          <div className="flex items-center justify-between">
            {nft.price ? (
              <div>
                <p className="text-sm font-bold text-foreground">
                  {nft.price} <span className={blockchain.color}>{blockchain.symbol}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not listed</p>
            )}

            {nft.collection && (
              <Badge variant="outline" className="text-xs truncate max-w-[100px]">
                {nft.collection.name}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

function NFTCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2 mt-1" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  );
}

export function RecentlyUploadedNFTs() {
  const { data: nfts, isLoading } = useRecentNFTs(8);

  // Don't render section if no NFTs
  if (!isLoading && (!nfts || nfts.length === 0)) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Recently Uploaded NFTs
            </h2>
            <p className="text-muted-foreground mt-1">
              Fresh digital art just minted by our creators
            </p>
          </div>
          <Link to="/explore">
            <Button variant="outline" className="gap-2 hidden sm:flex">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <NFTCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {nfts?.map((nft) => (
              <RecentNFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}

        {/* Mobile view all button */}
        <div className="mt-6 text-center sm:hidden">
          <Link to="/explore">
            <Button variant="outline" className="gap-2">
              View All NFTs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
