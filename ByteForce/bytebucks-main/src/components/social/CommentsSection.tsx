import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Trash2, 
  Loader2, 
  Send,
  BadgeCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useComments, Comment } from '@/hooks/useComments';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface CommentsSectionProps {
  nftId: string;
}

export function CommentsSection({ nftId }: CommentsSectionProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { comments, loading, submitting, addComment, deleteComment, toggleLike } = useComments(nftId);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const handleSubmit = async () => {
    const success = await addComment(newComment);
    if (success) {
      setNewComment('');
    }
  };

  const handleReply = async (parentId: string) => {
    const success = await addComment(replyContent, parentId);
    if (success) {
      setReplyContent('');
      setReplyingTo(null);
      setExpandedReplies(prev => new Set([...prev, parentId]));
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={cn("flex gap-3", isReply && "ml-12 mt-3")}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.user?.avatar_url || undefined} />
        <AvatarFallback className="bg-primary/20 text-primary text-xs">
          {comment.user?.display_name?.[0] || comment.user?.username?.[0] || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {comment.user?.display_name || comment.user?.username || 'Anonymous'}
          </span>
          {comment.user?.is_verified && (
            <BadgeCheck className="h-4 w-4 text-primary" />
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-foreground/90">{comment.content}</p>
        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={() => toggleLike(comment.id)}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              comment.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", comment.isLiked && "fill-current")} />
            {comment.likes_count > 0 && comment.likes_count}
          </button>
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Reply
            </button>
          )}
          {profile?.id === comment.user_id && (
            <button
              onClick={() => deleteComment(comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
        </div>

        {/* Reply input */}
        {replyingTo === comment.id && (
          <div className="flex gap-2 mt-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[60px] text-sm"
            />
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                onClick={() => handleReply(comment.id)}
                disabled={submitting || !replyContent.trim()}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => toggleReplies(comment.id)}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              {expandedReplies.has(comment.id) ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Hide {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </>
              )}
            </button>
            {expandedReplies.has(comment.id) && (
              <div className="space-y-3 mt-2">
                {comment.replies.map(reply => (
                  <CommentItem key={reply.id} comment={reply} isReply />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Comments</h3>
        <Badge variant="secondary">{comments.length}</Badge>
      </div>

      {/* New comment input */}
      {user ? (
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {profile?.display_name?.[0] || profile?.username?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
            <Button
              onClick={handleSubmit}
              disabled={submitting || !newComment.trim()}
              className="self-end"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          <p>Sign in to leave a comment</p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
