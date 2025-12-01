import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Image, Users, Bitcoin, Sparkles, Verified } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  type: 'nft' | 'collection' | 'user';
  id: string;
  name: string;
  image: string;
  subtitle?: string;
  verified?: boolean;
  slug?: string;
}

export function UniversalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Record<string, SearchResult[]>>({});
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search database based on query
  useEffect(() => {
    if (query.length < 2) {
      setResults({});
      return;
    }

    const searchDatabase = async () => {
      setLoading(true);
      const searchLower = `%${query.toLowerCase()}%`;
      
      try {
        // Search NFTs
        const { data: nftsData } = await supabase
          .from('nfts')
          .select('id, name, image_url, price, blockchain, badges')
          .ilike('name', searchLower)
          .limit(5);

        // Search Collections
        const { data: collectionsData } = await supabase
          .from('collections')
          .select('id, name, slug, image_url, floor_price, is_verified, blockchain')
          .ilike('name', searchLower)
          .limit(5);

        // Search Users
        const { data: usersData } = await supabase
          .from('profiles')
          .select('id, display_name, username, avatar_url, is_verified')
          .or(`display_name.ilike.${searchLower},username.ilike.${searchLower}`)
          .limit(5);

        const newResults: Record<string, SearchResult[]> = {};

        if (nftsData && nftsData.length > 0) {
          newResults['NFTs'] = nftsData.map(nft => ({
            type: 'nft',
            id: nft.id,
            name: nft.name,
            image: nft.image_url || '/placeholder.svg',
            subtitle: `${nft.price || 0} ${nft.blockchain === 'bitcoin' ? 'BTC' : nft.blockchain === 'solana' ? 'SOL' : 'ETH'}`,
            verified: nft.badges?.includes('verified'),
          }));
        }

        if (collectionsData && collectionsData.length > 0) {
          newResults['Collections'] = collectionsData.map(col => ({
            type: 'collection',
            id: col.id,
            name: col.name,
            image: col.image_url || '/placeholder.svg',
            subtitle: `Floor: ${col.floor_price || 0} ${col.blockchain === 'bitcoin' ? 'BTC' : col.blockchain === 'solana' ? 'SOL' : 'ETH'}`,
            verified: col.is_verified || false,
            slug: col.slug,
          }));
        }

        if (usersData && usersData.length > 0) {
          newResults['Users'] = usersData.map(user => ({
            type: 'user',
            id: user.id,
            name: user.display_name || user.username || 'Anonymous',
            image: user.avatar_url || '/placeholder.svg',
            subtitle: user.username ? `@${user.username}` : undefined,
            verified: user.is_verified || false,
          }));
        }

        setResults(newResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchDatabase, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'NFTs': return <Image className="w-4 h-4 text-primary" />;
      case 'Collections': return <TrendingUp className="w-4 h-4 text-secondary" />;
      case 'Users': return <Users className="w-4 h-4 text-accent" />;
      case 'Bitcoin NFTs': return <Bitcoin className="w-4 h-4 text-warning" />;
      case 'Memecoin NFTs': return <Sparkles className="w-4 h-4 text-success" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const handleResultClick = (item: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    
    switch (item.type) {
      case 'nft':
        navigate(`/nft/${item.id}`);
        break;
      case 'collection':
        navigate(`/collections/${item.slug || item.id}`);
        break;
      case 'user':
        navigate(`/profile/${item.id}`);
        break;
    }
  };

  const hasResults = Object.keys(results).length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search NFTs, collections, users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="search-input pl-12 pr-4"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (query.length >= 2 || hasResults) && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden shadow-2xl animate-slide-down max-h-[70vh] overflow-y-auto z-50">
          {loading && (
            <div className="p-4 text-center text-muted-foreground">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          )}
          
          {!loading && !hasResults && query.length >= 2 && (
            <div className="p-6 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          )}

          {!loading && Object.entries(results).map(([category, items]) => (
            <div key={category} className="border-b border-border last:border-0">
              <div className="px-4 py-2 bg-muted/50 flex items-center gap-2">
                {getIcon(category)}
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </span>
              </div>
              <div className="py-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                    onClick={() => handleResultClick(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{item.name}</span>
                        {item.verified && (
                          <Verified className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      {item.subtitle && (
                        <span className="text-sm text-muted-foreground">{item.subtitle}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {hasResults && (
            <div className="p-3 bg-muted/30">
              <button 
                className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium"
                onClick={() => {
                  navigate(`/explore?search=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                  setQuery('');
                }}
              >
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
