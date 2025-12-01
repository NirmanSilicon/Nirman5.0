import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

export function useFollow(targetUserId: string | null) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const checkFollowStatus = useCallback(async () => {
    if (!profile?.id || !targetUserId || profile.id === targetUserId) return;

    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', profile.id)
      .eq('following_id', targetUserId)
      .maybeSingle();

    if (!error && data) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [profile?.id, targetUserId]);

  const fetchFollowersCount = useCallback(async () => {
    if (!targetUserId) return;

    const { count, error } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', targetUserId);

    if (!error) {
      setFollowersCount(count || 0);
    }
  }, [targetUserId]);

  useEffect(() => {
    checkFollowStatus();
    fetchFollowersCount();
  }, [checkFollowStatus, fetchFollowersCount]);

  const toggleFollow = async () => {
    if (!user || !profile?.id || !targetUserId) {
      toast.error('Please sign in to follow creators');
      return;
    }

    if (profile.id === targetUserId) {
      toast.error("You can't follow yourself");
      return;
    }

    setLoading(true);

    if (isFollowing) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', profile.id)
        .eq('following_id', targetUserId);

      if (error) {
        toast.error('Failed to unfollow');
      } else {
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(prev - 1, 0));
        toast.success('Unfollowed successfully');
      }
    } else {
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: profile.id,
          following_id: targetUserId,
        });

      if (error) {
        toast.error('Failed to follow');
      } else {
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        toast.success('Following!');
      }
    }

    setLoading(false);
  };

  return {
    isFollowing,
    loading,
    followersCount,
    toggleFollow,
  };
}

export function useFollowers(userId: string | null) {
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchFollowData = async () => {
      setLoading(true);

      const [followersRes, followingRes] = await Promise.all([
        supabase
          .from('follows')
          .select('follower_id, profiles!follows_follower_id_fkey(id, username, display_name, avatar_url, is_verified)')
          .eq('following_id', userId),
        supabase
          .from('follows')
          .select('following_id, profiles!follows_following_id_fkey(id, username, display_name, avatar_url, is_verified)')
          .eq('follower_id', userId),
      ]);

      if (!followersRes.error) {
        setFollowers(followersRes.data?.map(f => f.profiles) || []);
      }

      if (!followingRes.error) {
        setFollowing(followingRes.data?.map(f => f.profiles) || []);
      }

      setLoading(false);
    };

    fetchFollowData();
  }, [userId]);

  return { followers, following, loading };
}
