import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RealNFTCard } from '@/components/nft/RealNFTCard';
import { FollowButton } from '@/components/social/FollowButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { 
  Verified, 
  Users, 
  Layers, 
  Activity, 
  ExternalLink,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_verified: boolean | null;
  followers_count: number | null;
  following_count: number | null;
  total_volume: number | null;
}

interface NFT {
  id: string;
  name: string;
  image_url: string;
  price: number | null;
  price_usd: number | null;
  blockchain: 'ethereum' | 'polygon' | 'solana' | 'bitcoin';
  is_listed: boolean | null;
  views_count: number | null;
  likes_count: number | null;
  collection?: {
    id: string;
    name: string;
    image_url: string | null;
    is_verified: boolean | null;
  };
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  floor_price: number | null;
  total_volume: number | null;
  is_verified: boolean | null;
  blockchain: string | null;
}

interface Transaction {
  id: string;
  transaction_type: string;
  price: number | null;
  price_usd: number | null;
  blockchain: string | null;
  created_at: string;
  nft?: {
    id: string;
    name: string;
    image_url: string;
  };
}

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [createdCollections, setCreatedCollections] = useState<Collection[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('owned');

  useEffect(() => {
    async function fetchUserData() {
      if (!id) return;
      setLoading(true);

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);

        // Fetch owned NFTs
        const { data: nftsData } = await supabase
          .from('nfts')
          .select(`
            id, name, image_url, price, price_usd, blockchain, is_listed, views_count, likes_count,
            collection:collections(id, name, image_url, is_verified)
          `)
          .or(`owner_id.eq.${id},creator_id.eq.${id}`)
          .limit(20);

        if (nftsData) setOwnedNFTs(nftsData as NFT[]);

        // Fetch created collections
        const { data: collectionsData } = await supabase
          .from('collections')
          .select('id, name, slug, image_url, floor_price, total_volume, is_verified, blockchain')
          .eq('creator_id', id)
          .limit(10);

        if (collectionsData) setCreatedCollections(collectionsData);

        // Fetch transactions
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select(`
            id, transaction_type, price, price_usd, blockchain, created_at,
            nft:nfts(id, name, image_url)
          `)
          .or(`from_user_id.eq.${id},to_user_id.eq.${id}`)
          .order('created_at', { ascending: false })
          .limit(20);

        if (transactionsData) setTransactions(transactionsData as Transaction[]);
      }

      setLoading(false);
    }

    fetchUserData();
  }, [id]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ArrowUpRight className="w-4 h-4 text-success" />;
      case 'mint':
        return <Layers className="w-4 h-4 text-primary" />;
      case 'transfer':
        return <ArrowDownRight className="w-4 h-4 text-warning" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-6 mb-12">
              <Skeleton className="w-32 h-32 rounded-full" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
            <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <Avatar className="w-32 h-32 ring-4 ring-primary/20 mb-4">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-4xl font-serif">
                {profile.display_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-serif font-bold">
                {profile.display_name || profile.username || 'Anonymous'}
              </h1>
              {profile.is_verified && (
                <Verified className="w-6 h-6 text-primary" />
              )}
            </div>
            
            {profile.username && (
              <p className="text-muted-foreground mb-4">@{profile.username}</p>
            )}
            
            {profile.bio && (
              <p className="text-muted-foreground max-w-lg mb-6">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-8 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{ownedNFTs.length}</p>
                <p className="text-sm text-muted-foreground">NFTs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.followers_count || 0}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.following_count || 0}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{(profile.total_volume || 0).toFixed(2)} ETH</p>
                <p className="text-sm text-muted-foreground">Volume</p>
              </div>
            </div>

            <FollowButton userId={profile.id} />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-muted/50 p-1 mx-auto flex w-fit">
              <TabsTrigger value="owned" className="data-[state=active]:bg-background gap-2">
                <Layers className="w-4 h-4" />
                Owned ({ownedNFTs.length})
              </TabsTrigger>
              <TabsTrigger value="collections" className="data-[state=active]:bg-background gap-2">
                <Users className="w-4 h-4" />
                Collections ({createdCollections.length})
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-background gap-2">
                <Activity className="w-4 h-4" />
                Activity ({transactions.length})
              </TabsTrigger>
            </TabsList>

            {/* Owned NFTs */}
            <TabsContent value="owned">
              {ownedNFTs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {ownedNFTs.map((nft) => (
                    <RealNFTCard 
                      key={nft.id} 
                      nft={{
                        ...nft,
                        creator_id: profile.id,
                        collection_id: nft.collection?.id || null,
                        is_minted: true,
                        floor_price: null,
                        rarity_score: null,
                        editions: null,
                        editions_available: null,
                        sale_type: 'fixed',
                        badges: null,
                        traits: null,
                        is_auction: false,
                        current_bid: null,
                        auction_end_date: null,
                        created_at: '',
                        description: null,
                        collection: nft.collection ? {
                          ...nft.collection,
                          floor_price: null,
                        } : undefined,
                        creator: {
                          id: profile.id,
                          username: profile.username,
                          display_name: profile.display_name,
                          avatar_url: profile.avatar_url,
                          is_verified: profile.is_verified,
                        },
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground">No NFTs owned yet</p>
                </div>
              )}
            </TabsContent>

            {/* Created Collections */}
            <TabsContent value="collections">
              {createdCollections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdCollections.map((collection) => (
                    <Link
                      key={collection.id}
                      to={`/collections/${collection.slug}`}
                      className="glass rounded-xl overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={collection.image_url || '/placeholder.svg'}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold truncate">{collection.name}</h3>
                          {collection.is_verified && (
                            <Verified className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-muted-foreground">Floor</p>
                            <p className="font-medium">{(collection.floor_price || 0).toFixed(2)} ETH</p>
                          </div>
                          <div className="text-right">
                            <p className="text-muted-foreground">Volume</p>
                            <p className="font-medium">{(collection.total_volume || 0).toLocaleString()} ETH</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground">No collections created yet</p>
                </div>
              )}
            </TabsContent>

            {/* Transaction Activity */}
            <TabsContent value="activity">
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="glass rounded-xl p-4 flex items-center gap-4"
                    >
                      {/* NFT Image */}
                      {tx.nft && (
                        <Link to={`/nft/${tx.nft.id}`}>
                          <img
                            src={tx.nft.image_url}
                            alt={tx.nft.name}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                          />
                        </Link>
                      )}
                      
                      {/* Transaction Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getTransactionIcon(tx.transaction_type)}
                          <span className="font-medium capitalize">{tx.transaction_type.replace('_', ' ')}</span>
                        </div>
                        {tx.nft && (
                          <Link to={`/nft/${tx.nft.id}`} className="text-sm text-muted-foreground hover:text-primary truncate block">
                            {tx.nft.name}
                          </Link>
                        )}
                      </div>
                      
                      {/* Price & Time */}
                      <div className="text-right">
                        {tx.price && (
                          <p className="font-semibold">
                            {tx.price} {tx.blockchain === 'bitcoin' ? 'BTC' : tx.blockchain === 'solana' ? 'SOL' : 'ETH'}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(tx.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground">No activity yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
