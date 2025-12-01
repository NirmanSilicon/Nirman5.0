import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useFollow } from '@/hooks/useFollow';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  userId: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showCount?: boolean;
}

export function FollowButton({ 
  userId, 
  className, 
  variant = 'outline',
  size = 'default',
  showCount = false 
}: FollowButtonProps) {
  const { isFollowing, loading, followersCount, toggleFollow } = useFollow(userId);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant={isFollowing ? 'secondary' : variant}
        size={size}
        onClick={toggleFollow}
        disabled={loading}
        className={cn(
          "transition-all duration-300",
          isFollowing && "bg-primary/10 text-primary hover:bg-destructive/10 hover:text-destructive"
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isFollowing ? (
          <>
            <UserCheck className="h-4 w-4 mr-2" />
            Following
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Follow
          </>
        )}
      </Button>
      {showCount && (
        <span className="text-sm text-muted-foreground">
          {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
        </span>
      )}
    </div>
  );
}
