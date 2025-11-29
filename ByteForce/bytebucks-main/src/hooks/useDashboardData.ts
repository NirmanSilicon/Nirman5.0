import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface DashboardStats {
  totalPortfolioValue: number;
  totalPortfolioValueUsd: number;
  portfolioChange24h: number;
  nftsOwned: number;
  collectionsCount: number;
  totalTransactions: number;
  totalVolume: number;
}

export interface OwnedNFT {
  id: string;
  name: string;
  image_url: string;
  price: number | null;
  price_usd: number | null;
  blockchain: string;
  collection_id: string | null;
  is_listed: boolean;
}

export interface Transaction {
  id: string;
  transaction_type: string;
  price: number | null;
  price_usd: number | null;
  blockchain: string | null;
  created_at: string;
  transaction_hash: string | null;
  gas_fee: number | null;
  nft_id: string | null;
  from_user_id: string | null;
  to_user_id: string | null;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPortfolioValue: 0,
    totalPortfolioValueUsd: 0,
    portfolioChange24h: 0,
    nftsOwned: 0,
    collectionsCount: 0,
    totalTransactions: 0,
    totalVolume: 0,
  });
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
        .select('id, total_volume')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProfileId(data.id);
      }
    }

    fetchProfileId();
  }, [user]);

  const fetchDashboardData = useCallback(async () => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Fetch owned NFTs
      const { data: nfts } = await supabase
        .from('nfts')
        .select('*')
        .eq('owner_id', profileId);

      // Fetch transactions
      const { data: txns } = await supabase
        .from('transactions')
        .select('*')
        .or(`from_user_id.eq.${profileId},to_user_id.eq.${profileId}`)
        .order('created_at', { ascending: false })
        .limit(100);

      // Fetch profile for volume
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_volume')
        .eq('id', profileId)
        .single();

      // Calculate stats
      const ownedNftsList = nfts || [];
      const transactionsList = txns || [];

      const totalValue = ownedNftsList.reduce((sum, nft) => sum + (nft.price || 0), 0);
      const totalValueUsd = ownedNftsList.reduce((sum, nft) => sum + (nft.price_usd || 0), 0);
      const uniqueCollections = new Set(ownedNftsList.map(n => n.collection_id).filter(Boolean)).size;

      setOwnedNFTs(ownedNftsList);
      setTransactions(transactionsList);
      setStats({
        totalPortfolioValue: totalValue,
        totalPortfolioValueUsd: totalValueUsd,
        portfolioChange24h: Math.random() * 20 - 10, // Mock for now
        nftsOwned: ownedNftsList.length,
        collectionsCount: uniqueCollections,
        totalTransactions: transactionsList.length,
        totalVolume: profile?.total_volume || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }

    setLoading(false);
  }, [profileId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    ownedNFTs,
    transactions,
    loading,
    profileId,
    refetch: fetchDashboardData,
  };
}
