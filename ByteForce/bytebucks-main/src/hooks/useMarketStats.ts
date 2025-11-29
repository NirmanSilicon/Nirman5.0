import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MarketStats {
  totalVolume: number;
  volume24h: number;
  volumeChange24h: number;
  totalSales: number;
  sales24h: number;
  salesChange24h: number;
  totalCollections: number;
  totalNFTs: number;
  totalUsers: number;
  avgPrice: number;
  floorPriceAvg: number;
}

export function useMarketStats() {
  const [stats, setStats] = useState<MarketStats>({
    totalVolume: 0,
    volume24h: 0,
    volumeChange24h: 0,
    totalSales: 0,
    sales24h: 0,
    salesChange24h: 0,
    totalCollections: 0,
    totalNFTs: 0,
    totalUsers: 0,
    avgPrice: 0,
    floorPriceAvg: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get transactions for volume calculations
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

        // Total volume and sales from transactions
        const { data: allTransactions } = await supabase
          .from('transactions')
          .select('price_usd, created_at, transaction_type')
          .in('transaction_type', ['sale', 'mint']);

        // Calculate totals
        const totalVolume = allTransactions?.reduce((sum, tx) => sum + (Number(tx.price_usd) || 0), 0) || 0;
        const totalSales = allTransactions?.length || 0;

        // Last 24h transactions
        const transactions24h = allTransactions?.filter(
          tx => new Date(tx.created_at) > oneDayAgo
        ) || [];
        const volume24h = transactions24h.reduce((sum, tx) => sum + (Number(tx.price_usd) || 0), 0);
        const sales24h = transactions24h.length;

        // Previous 24h for change calculation
        const transactionsPrev24h = allTransactions?.filter(
          tx => new Date(tx.created_at) > twoDaysAgo && new Date(tx.created_at) <= oneDayAgo
        ) || [];
        const volumePrev24h = transactionsPrev24h.reduce((sum, tx) => sum + (Number(tx.price_usd) || 0), 0);
        const salesPrev24h = transactionsPrev24h.length;

        // Calculate changes
        const volumeChange24h = volumePrev24h > 0 
          ? ((volume24h - volumePrev24h) / volumePrev24h * 100)
          : (volume24h > 0 ? 100 : 0);
        const salesChange24h = salesPrev24h > 0 
          ? ((sales24h - salesPrev24h) / salesPrev24h * 100)
          : (sales24h > 0 ? 100 : 0);

        // Get collection count
        const { count: collectionCount } = await supabase
          .from('collections')
          .select('*', { count: 'exact', head: true });

        // Get NFT count
        const { count: nftCount } = await supabase
          .from('nfts')
          .select('*', { count: 'exact', head: true });

        // Get user count
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get average prices from collections
        const { data: collections } = await supabase
          .from('collections')
          .select('floor_price');

        const floorPriceAvg = collections?.length 
          ? collections.reduce((sum, c) => sum + (Number(c.floor_price) || 0), 0) / collections.length
          : 0;

        const avgPrice = totalSales > 0 ? totalVolume / totalSales : 0;

        setStats({
          totalVolume,
          volume24h,
          volumeChange24h,
          totalSales,
          sales24h,
          salesChange24h,
          totalCollections: collectionCount || 0,
          totalNFTs: nftCount || 0,
          totalUsers: userCount || 0,
          avgPrice,
          floorPriceAvg,
        });
      } catch (error) {
        console.error('Error fetching market stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
}
