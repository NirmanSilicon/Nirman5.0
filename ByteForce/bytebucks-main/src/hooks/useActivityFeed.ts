import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';

export interface ActivityItem {
  id: string;
  type: 'follow' | 'comment' | 'bid' | 'sale' | 'list' | 'like';
  actor: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    is_verified: boolean | null;
  };
  target?: {
    id: string;
    name?: string;
    image_url?: string;
  };
  metadata?: Record<string, any>;
  created_at: string;
}

export function useActivityFeed(userId?: string | null) {
  const { profile } = useProfile();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    const targetUserId = userId || profile?.id;
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Fetch different activity types
      const [followsRes, commentsRes, bidsRes, transactionsRes] = await Promise.all([
        // Recent follows (people who followed this user or people this user follows)
        supabase
          .from('follows')
          .select(`
            id,
            created_at,
            follower:profiles!follows_follower_id_fkey (id, username, display_name, avatar_url, is_verified),
            following:profiles!follows_following_id_fkey (id, username, display_name, avatar_url, is_verified)
          `)
          .or(`follower_id.eq.${targetUserId},following_id.eq.${targetUserId}`)
          .order('created_at', { ascending: false })
          .limit(20),

        // Recent comments by this user
        supabase
          .from('comments')
          .select(`
            id,
            created_at,
            content,
            profiles:user_id (id, username, display_name, avatar_url, is_verified),
            nfts:nft_id (id, name, image_url)
          `)
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false })
          .limit(10),

        // Recent bids by this user
        supabase
          .from('bids')
          .select(`
            id,
            created_at,
            amount,
            status,
            profiles:bidder_id (id, username, display_name, avatar_url, is_verified),
            nfts:nft_id (id, name, image_url)
          `)
          .eq('bidder_id', targetUserId)
          .order('created_at', { ascending: false })
          .limit(10),

        // Recent transactions involving this user
        supabase
          .from('transactions')
          .select(`
            id,
            created_at,
            transaction_type,
            price,
            from_user:profiles!transactions_from_user_id_fkey (id, username, display_name, avatar_url, is_verified),
            to_user:profiles!transactions_to_user_id_fkey (id, username, display_name, avatar_url, is_verified),
            nfts:nft_id (id, name, image_url)
          `)
          .or(`from_user_id.eq.${targetUserId},to_user_id.eq.${targetUserId}`)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      const activityItems: ActivityItem[] = [];

      // Process follows
      followsRes.data?.forEach(follow => {
        const isFollower = follow.following?.id === targetUserId;
        activityItems.push({
          id: `follow-${follow.id}`,
          type: 'follow',
          actor: isFollower ? follow.follower : follow.following,
          target: isFollower ? undefined : { id: follow.following?.id, name: follow.following?.display_name || follow.following?.username },
          created_at: follow.created_at,
        });
      });

      // Process comments
      commentsRes.data?.forEach(comment => {
        activityItems.push({
          id: `comment-${comment.id}`,
          type: 'comment',
          actor: comment.profiles,
          target: comment.nfts ? { id: comment.nfts.id, name: comment.nfts.name, image_url: comment.nfts.image_url } : undefined,
          metadata: { content: comment.content },
          created_at: comment.created_at,
        });
      });

      // Process bids
      bidsRes.data?.forEach(bid => {
        activityItems.push({
          id: `bid-${bid.id}`,
          type: 'bid',
          actor: bid.profiles,
          target: bid.nfts ? { id: bid.nfts.id, name: bid.nfts.name, image_url: bid.nfts.image_url } : undefined,
          metadata: { amount: bid.amount, status: bid.status },
          created_at: bid.created_at,
        });
      });

      // Process transactions
      transactionsRes.data?.forEach(tx => {
        const isSeller = tx.from_user?.id === targetUserId;
        activityItems.push({
          id: `tx-${tx.id}`,
          type: tx.transaction_type === 'sale' ? 'sale' : 'list',
          actor: isSeller ? tx.from_user : tx.to_user,
          target: tx.nfts ? { id: tx.nfts.id, name: tx.nfts.name, image_url: tx.nfts.image_url } : undefined,
          metadata: { price: tx.price, transaction_type: tx.transaction_type },
          created_at: tx.created_at,
        });
      });

      // Sort all activities by date
      activityItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setActivities(activityItems.slice(0, 30));
    } catch (error) {
      console.error('Error fetching activities:', error);
    }

    setLoading(false);
  }, [userId, profile?.id]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    refetch: fetchActivities,
  };
}
