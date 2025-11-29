import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface WatchlistItem {
  id: string;
  user_id: string;
  nft_id: string | null;
  collection_id: string | null;
  target_price: number | null;
  alert_type: string;
  is_active: boolean;
  created_at: string;
  nft?: {
    id: string;
    name: string;
    image_url: string;
    price: number | null;
    blockchain: string;
  };
  collection?: {
    id: string;
    name: string;
    image_url: string | null;
    floor_price: number | null;
  };
}

export function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Fetch profile ID
  useEffect(() => {
    async function fetchProfileId() {
      if (!user) {
        setProfileId(null);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProfileId(data.id);
      }
    }

    fetchProfileId();
  }, [user]);

  const fetchWatchlist = useCallback(async () => {
    if (!profileId) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('watchlists')
      .select(`
        *,
        nft:nfts(id, name, image_url, price, blockchain),
        collection:collections(id, name, image_url, floor_price)
      `)
      .eq('user_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching watchlist:', error);
    } else {
      setWatchlist(data || []);
    }

    setLoading(false);
  }, [profileId]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const addToWatchlist = async (params: {
    nft_id?: string;
    collection_id?: string;
    target_price?: number;
    alert_type?: string;
  }) => {
    if (!profileId) {
      toast.error('Please sign in to add items to your watchlist');
      return false;
    }

    const { error } = await supabase
      .from('watchlists')
      .insert({
        user_id: profileId,
        nft_id: params.nft_id || null,
        collection_id: params.collection_id || null,
        target_price: params.target_price || null,
        alert_type: params.alert_type || 'price_drop',
      });

    if (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add to watchlist');
      return false;
    }

    toast.success('Added to watchlist');
    fetchWatchlist();
    return true;
  };

  const removeFromWatchlist = async (watchlistId: string) => {
    const { error } = await supabase
      .from('watchlists')
      .delete()
      .eq('id', watchlistId);

    if (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
      return false;
    }

    setWatchlist(prev => prev.filter(w => w.id !== watchlistId));
    toast.success('Removed from watchlist');
    return true;
  };

  const toggleWatchlistActive = async (watchlistId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('watchlists')
      .update({ is_active: isActive })
      .eq('id', watchlistId);

    if (error) {
      console.error('Error updating watchlist:', error);
      return false;
    }

    setWatchlist(prev =>
      prev.map(w => w.id === watchlistId ? { ...w, is_active: isActive } : w)
    );
    return true;
  };

  const updateTargetPrice = async (watchlistId: string, targetPrice: number) => {
    const { error } = await supabase
      .from('watchlists')
      .update({ target_price: targetPrice })
      .eq('id', watchlistId);

    if (error) {
      console.error('Error updating target price:', error);
      return false;
    }

    setWatchlist(prev =>
      prev.map(w => w.id === watchlistId ? { ...w, target_price: targetPrice } : w)
    );
    return true;
  };

  return {
    watchlist,
    loading,
    profileId,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlistActive,
    updateTargetPrice,
    refetch: fetchWatchlist,
  };
}
