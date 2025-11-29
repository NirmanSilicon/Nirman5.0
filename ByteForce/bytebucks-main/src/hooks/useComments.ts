import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

export interface Comment {
  id: string;
  nft_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    is_verified: boolean | null;
  };
  replies?: Comment[];
  isLiked?: boolean;
}

export function useComments(nftId: string | null) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!nftId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          display_name,
          avatar_url,
          is_verified
        )
      `)
      .eq('nft_id', nftId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      // Organize into parent/reply structure
      const parentComments = data?.filter(c => !c.parent_id) || [];
      const replies = data?.filter(c => c.parent_id) || [];

      // Check which comments the user has liked
      let likedIds = new Set<string>();
      if (profile?.id) {
        const { data: likes } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', profile.id);

        likedIds = new Set(likes?.map(l => l.comment_id) || []);
      }

      const commentsWithReplies: Comment[] = parentComments.map(comment => ({
        ...comment,
        user: comment.profiles,
        isLiked: likedIds.has(comment.id),
        replies: replies
          .filter(r => r.parent_id === comment.id)
          .map(r => ({ 
            ...r, 
            user: r.profiles,
            isLiked: likedIds.has(r.id),
          })),
      }));

      setComments(commentsWithReplies);
    }

    setLoading(false);
  }, [nftId, profile?.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (content: string, parentId?: string) => {
    if (!user || !profile?.id || !nftId) {
      toast.error('Please sign in to comment');
      return false;
    }

    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return false;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('comments')
      .insert({
        nft_id: nftId,
        user_id: profile.id,
        content: content.trim(),
        parent_id: parentId || null,
      });

    setSubmitting(false);

    if (error) {
      toast.error('Failed to add comment');
      return false;
    }

    toast.success('Comment added');
    fetchComments();
    return true;
  };

  const deleteComment = async (commentId: string) => {
    if (!user || !profile?.id) return;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', profile.id);

    if (error) {
      toast.error('Failed to delete comment');
    } else {
      toast.success('Comment deleted');
      fetchComments();
    }
  };

  const toggleLike = async (commentId: string) => {
    if (!user || !profile?.id) {
      toast.error('Please sign in to like comments');
      return;
    }

    // Check if already liked
    const { data: existing } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', profile.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('comment_likes')
        .delete()
        .eq('id', existing.id);
    } else {
      await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: profile.id,
        });
    }

    fetchComments();
  };

  return {
    comments,
    loading,
    submitting,
    addComment,
    deleteComment,
    toggleLike,
    refetch: fetchComments,
  };
}
