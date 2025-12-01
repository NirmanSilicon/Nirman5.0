import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NFTData {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  price: number | null;
  price_usd: number | null;
  blockchain: 'ethereum' | 'polygon' | 'solana' | 'bitcoin';
  creator_id: string;
  collection_id: string | null;
  is_listed: boolean | null;
  is_minted: boolean | null;
  views_count: number | null;
  likes_count: number | null;
  floor_price: number | null;
  rarity_score: number | null;
  editions: number | null;
  editions_available: number | null;
  sale_type: 'fixed' | 'auction' | 'offers' | null;
  badges: string[] | null;
  traits: any | null;
  is_auction: boolean | null;
  current_bid: number | null;
  auction_end_date: string | null;
  created_at: string;
  collection?: {
    id: string;
    name: string;
    image_url: string | null;
    is_verified: boolean | null;
    floor_price: number | null;
  };
  creator?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    is_verified: boolean | null;
  };
}

export function useNFTs(options?: {
  blockchain?: 'ethereum' | 'polygon' | 'solana' | 'bitcoin' | 'all';
  collectionId?: string;
  limit?: number;
  isListed?: boolean;
}) {
  return useQuery({
    queryKey: ['nfts', options],
    queryFn: async () => {
      let query = supabase
        .from('nfts')
        .select(`
          *,
          collection:collections(id, name, image_url, is_verified, floor_price),
          creator:profiles!nfts_creator_id_fkey(id, username, display_name, avatar_url, is_verified)
        `)
        .order('created_at', { ascending: false });

      if (options?.blockchain && options.blockchain !== 'all') {
        query = query.eq('blockchain', options.blockchain as 'ethereum' | 'polygon' | 'solana' | 'bitcoin');
      }

      if (options?.collectionId) {
        query = query.eq('collection_id', options.collectionId);
      }

      if (options?.isListed !== undefined) {
        query = query.eq('is_listed', options.isListed);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
      }

      return data as NFTData[];
    },
  });
}

export function useNFT(id: string | undefined) {
  return useQuery({
    queryKey: ['nft', id],
    queryFn: async () => {
      if (!id) throw new Error('NFT ID is required');

      const { data, error } = await supabase
        .from('nfts')
        .select(`
          *,
          collection:collections(id, name, image_url, is_verified, floor_price, unique_owners),
          creator:profiles!nfts_creator_id_fkey(id, username, display_name, avatar_url, is_verified)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching NFT:', error);
        throw error;
      }

      return data as NFTData & {
        collection: {
          id: string;
          name: string;
          image_url: string | null;
          is_verified: boolean | null;
          floor_price: number | null;
          unique_owners: number | null;
        };
      };
    },
    enabled: !!id,
  });
}
