import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

export interface Bid {
  id: string;
  nft_id: string;
  bidder_id: string;
  amount: number;
  amount_usd: number | null;
  status: 'active' | 'outbid' | 'won' | 'cancelled';
  created_at: string;
  bidder?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    is_verified: boolean | null;
  };
}

export interface AuctionNFT {
  id: string;
  name: string;
  is_auction: boolean;
  starting_bid: number | null;
  current_bid: number | null;
  reserve_price: number | null;
  bid_increment: number;
  auction_end_date: string | null;
  highest_bidder_id: string | null;
}

export function useBids(nftId: string | null) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [bids, setBids] = useState<Bid[]>([]);
  const [auctionData, setAuctionData] = useState<AuctionNFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const fetchBids = useCallback(async () => {
    if (!nftId) return;

    setLoading(true);

    const [bidsRes, nftRes] = await Promise.all([
      supabase
        .from('bids')
        .select(`
          *,
          profiles:bidder_id (
            id,
            username,
            display_name,
            avatar_url,
            is_verified
          )
        `)
        .eq('nft_id', nftId)
        .order('amount', { ascending: false }),
      supabase
        .from('nfts')
        .select('id, name, is_auction, starting_bid, current_bid, reserve_price, bid_increment, auction_end_date, highest_bidder_id')
        .eq('id', nftId)
        .single(),
    ]);

    if (!bidsRes.error) {
      setBids(
        bidsRes.data?.map(b => ({
          ...b,
          status: b.status as Bid['status'],
          bidder: b.profiles,
        })) || []
      );
    }

    if (!nftRes.error) {
      setAuctionData(nftRes.data as AuctionNFT);
    }

    setLoading(false);
  }, [nftId]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  // Subscribe to real-time bid updates
  useEffect(() => {
    if (!nftId) return;

    const channel = supabase
      .channel(`bids-${nftId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bids',
          filter: `nft_id=eq.${nftId}`,
        },
        () => {
          fetchBids();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [nftId, fetchBids]);

  const placeBid = async (amount: number) => {
    if (!user || !profile?.id || !nftId || !auctionData) {
      toast.error('Please sign in to place a bid');
      return false;
    }

    // Validate bid amount
    const minBid = auctionData.current_bid
      ? auctionData.current_bid + (auctionData.bid_increment || 0.01)
      : auctionData.starting_bid || 0;

    if (amount < minBid) {
      toast.error(`Minimum bid is ${minBid.toFixed(4)} ETH`);
      return false;
    }

    // Check if auction has ended
    if (auctionData.auction_end_date && new Date(auctionData.auction_end_date) < new Date()) {
      toast.error('This auction has ended');
      return false;
    }

    setPlacing(true);

    // Calculate USD equivalent (mock rate)
    const ethToUsd = 2500; // Mock rate
    const amountUsd = amount * ethToUsd;

    const { error } = await supabase.from('bids').insert({
      nft_id: nftId,
      bidder_id: profile.id,
      amount,
      amount_usd: amountUsd,
      status: 'active',
    });

    setPlacing(false);

    if (error) {
      console.error('Bid error:', error);
      toast.error('Failed to place bid');
      return false;
    }

    toast.success('Bid placed successfully!');
    fetchBids();
    return true;
  };

  const cancelBid = async (bidId: string) => {
    if (!user || !profile?.id) return;

    const { error } = await supabase
      .from('bids')
      .update({ status: 'cancelled' })
      .eq('id', bidId)
      .eq('bidder_id', profile.id)
      .eq('status', 'active');

    if (error) {
      toast.error('Failed to cancel bid');
    } else {
      toast.success('Bid cancelled');
      fetchBids();
    }
  };

  const getTimeRemaining = () => {
    if (!auctionData?.auction_end_date) return null;

    const endTime = new Date(auctionData.auction_end_date).getTime();
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0) return { ended: true, days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { ended: false, days, hours, minutes, seconds };
  };

  return {
    bids,
    auctionData,
    loading,
    placing,
    placeBid,
    cancelBid,
    getTimeRemaining,
    refetch: fetchBids,
    isHighestBidder: profile?.id === auctionData?.highest_bidder_id,
  };
}
