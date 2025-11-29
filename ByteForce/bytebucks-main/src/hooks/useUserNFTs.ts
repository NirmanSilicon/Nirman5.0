import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserNFT {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  price: number | null;
  price_usd: number | null;
  blockchain: 'ethereum' | 'polygon' | 'solana' | 'bitcoin';
  is_listed: boolean | null;
  is_minted: boolean | null;
  views_count: number | null;
  likes_count: number | null;
  editions: number | null;
  editions_available: number | null;
  created_at: string;
  collection?: {
    id: string;
    name: string;
    image_url: string | null;
    is_verified: boolean | null;
  } | null;
}

export function useUserNFTs() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-nfts', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get profile ID first
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return [];

      const { data, error } = await supabase
        .from('nfts')
        .select(`
          id,
          name,
          description,
          image_url,
          price,
          price_usd,
          blockchain,
          is_listed,
          is_minted,
          views_count,
          likes_count,
          editions,
          editions_available,
          created_at,
          collection:collections(id, name, image_url, is_verified)
        `)
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user NFTs:', error);
        throw error;
      }

      return data as UserNFT[];
    },
    enabled: !!user,
  });
}

export function useRecentNFTs(limit: number = 8) {
  return useQuery({
    queryKey: ['recent-nfts', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nfts')
        .select(`
          id,
          name,
          description,
          image_url,
          price,
          price_usd,
          blockchain,
          is_listed,
          is_minted,
          views_count,
          likes_count,
          editions,
          editions_available,
          created_at,
          creator:profiles!nfts_creator_id_fkey(id, username, display_name, avatar_url, is_verified),
          collection:collections(id, name, image_url, is_verified)
        `)
        .eq('is_minted', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent NFTs:', error);
        throw error;
      }

      return data;
    },
  });
}
