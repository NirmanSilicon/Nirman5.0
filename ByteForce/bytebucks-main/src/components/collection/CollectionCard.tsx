import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { type Collection, blockchainConfig, badgeConfig } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface CollectionCardProps {
  collection: Collection;
  rank?: number;
}

export function CollectionCard({ collection, rank }: CollectionCardProps) {
  const navigate = useNavigate();
  const blockchain = blockchainConfig[collection.blockchain];
  const volumeChange = collection.volumeChange24h;
  const isPositive = volumeChange >= 0;

  const handleClick = () => {
    navigate(`/collection/${collection.slug}`);
  };

  return (
    <div className="nft-card group cursor-pointer flex overflow-hidden" onClick={handleClick}>
      {/* Rank */}
      {rank && (
        <div className="flex items-center justify-center w-12 bg-muted/50 border-r border-border">
          <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>
        </div>
      )}

      {/* Image */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
        <img
          src={collection.image}
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {collection.name}
            </h3>
            {collection.verified && (
              <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[8px] text-primary-foreground flex-shrink-0">
                ✓
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {collection.badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className={cn(
                  'px-2 py-0.5 text-[9px] font-semibold rounded-full uppercase tracking-wider',
                  badgeConfig[badge].className
                )}
              >
                {badgeConfig[badge].label}
              </span>
            ))}
            <span
              className="px-2 py-0.5 text-[9px] font-semibold rounded-full"
              style={{ backgroundColor: `${blockchain.color}20`, color: blockchain.color }}
            >
              {blockchain.name}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs">
          <div>
            <p className="text-muted-foreground">Floor</p>
            <p className="font-semibold text-foreground">
              {collection.floorPrice} {blockchain.symbol}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume 24h</p>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-foreground">
                {collection.volume24h} {blockchain.symbol}
              </p>
              <span className={cn(
                'flex items-center text-[10px] font-medium',
                isPositive ? 'text-success' : 'text-destructive'
              )}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{volumeChange}%
              </span>
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-muted-foreground">Owners</p>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <p className="font-semibold text-foreground">
                {collection.uniqueOwners.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
