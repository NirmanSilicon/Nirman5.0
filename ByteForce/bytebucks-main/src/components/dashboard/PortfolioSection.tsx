import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Filter, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OwnedNFT } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface PortfolioSectionProps {
  ownedNFTs: OwnedNFT[];
  loading?: boolean;
}

export function PortfolioSection({ ownedNFTs, loading }: PortfolioSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('value');
  const [filterChain, setFilterChain] = useState('all');

  const filteredNFTs = ownedNFTs
    .filter((nft) => filterChain === 'all' || nft.blockchain === filterChain)
    .sort((a, b) => {
      if (sortBy === 'value') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const totalValue = filteredNFTs.reduce((sum, nft) => sum + (nft.price || 0), 0);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="glass animate-pulse">
            <div className="aspect-square bg-muted" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h3 className="font-serif font-semibold text-foreground">Your NFTs</h3>
          <p className="text-sm text-muted-foreground">
            {filteredNFTs.length} NFTs • {totalValue.toFixed(2)} ETH total
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={filterChain} onValueChange={setFilterChain}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chains</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="solana">Solana</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value">By Value</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border border-border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredNFTs.length === 0 && (
        <Card className="p-12 glass text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
            No NFTs Yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start building your collection by exploring NFTs
          </p>
          <Link to="/explore">
            <Button variant="elegant">Browse NFTs</Button>
          </Link>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredNFTs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredNFTs.map((nft) => (
            <Link key={nft.id} to={`/nft/${nft.id}`}>
              <Card className="glass overflow-hidden group hover:shadow-elegant transition-all">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img
                    src={nft.image_url}
                    alt={nft.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {nft.is_listed && (
                    <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
                      Listed
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium text-foreground truncate">{nft.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      {nft.price?.toFixed(3) || '0'} ETH
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {nft.blockchain}
                    </Badge>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && filteredNFTs.length > 0 && (
        <Card className="glass overflow-hidden">
          <div className="divide-y divide-border">
            {filteredNFTs.map((nft) => (
              <Link 
                key={nft.id} 
                to={`/nft/${nft.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={nft.image_url}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{nft.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {nft.blockchain}
                    </Badge>
                    {nft.is_listed && (
                      <Badge className="bg-success/10 text-success text-xs">
                        Listed
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">
                    {nft.price?.toFixed(3) || '0'} ETH
                  </p>
                  {nft.price_usd && (
                    <p className="text-sm text-muted-foreground">
                      ${nft.price_usd.toLocaleString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
