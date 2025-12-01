import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserNFTs, UserNFT } from '@/hooks/useUserNFTs';
import { 
  Plus, 
  Eye, 
  Heart, 
  ExternalLink,
  ImageOff 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const blockchainConfig: Record<string, { symbol: string; color: string }> = {
  ethereum: { symbol: 'ETH', color: 'text-blue-400' },
  polygon: { symbol: 'MATIC', color: 'text-purple-400' },
  solana: { symbol: 'SOL', color: 'text-green-400' },
  bitcoin: { symbol: 'BTC', color: 'text-orange-400' },
};

function NFTCard({ nft }: { nft: UserNFT }) {
  const blockchain = blockchainConfig[nft.blockchain] || blockchainConfig.ethereum;

  return (
    <Link to={`/nft/${nft.id}`}>
      <Card className="group overflow-hidden glass hover:border-primary/50 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          {nft.image_url ? (
            <img
              src={nft.image_url}
              alt={nft.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ImageOff className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Status badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {nft.is_listed && (
              <Badge className="bg-emerald-500/90 text-white text-xs">Listed</Badge>
            )}
            {!nft.is_listed && (
              <Badge variant="secondary" className="text-xs">Not Listed</Badge>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="sm" variant="secondary" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              View Details
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
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
                {nft.price_usd && (
                  <p className="text-xs text-muted-foreground">${nft.price_usd.toFixed(2)}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not for sale</p>
            )}

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {nft.views_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {nft.likes_count || 0}
              </span>
            </div>
          </div>

          {nft.editions && nft.editions > 1 && (
            <p className="text-xs text-muted-foreground">
              {nft.editions_available}/{nft.editions} available
            </p>
          )}
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

export function YourUploadedNFTs() {
  const { data: nfts, isLoading, error } = useUserNFTs();

  if (error) {
    return (
      <Card className="p-12 glass text-center">
        <p className="text-destructive">Failed to load your NFTs</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground">
            Your Uploaded NFTs
          </h3>
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${nfts?.length || 0} NFTs created`}
          </p>
        </div>
        <Link to="/mint">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Mint New NFT
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <NFTCardSkeleton key={i} />
          ))}
        </div>
      ) : !nfts || nfts.length === 0 ? (
        <Card className="p-12 glass text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ImageOff className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
            No NFTs Yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't created any NFTs yet. Start minting your digital artwork now!
          </p>
          <Link to="/mint">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Mint Your First NFT
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
}
