import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  UserPlus, 
  MessageCircle, 
  Gavel, 
  ShoppingCart, 
  Tag,
  Heart,
  Loader2,
  Activity,
  BadgeCheck,
  ExternalLink
} from 'lucide-react';
import { useActivityFeed, ActivityItem } from '@/hooks/useActivityFeed';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  userId?: string;
  className?: string;
  maxItems?: number;
  showHeader?: boolean;
}

const activityIcons: Record<ActivityItem['type'], typeof UserPlus> = {
  follow: UserPlus,
  comment: MessageCircle,
  bid: Gavel,
  sale: ShoppingCart,
  list: Tag,
  like: Heart,
};

const activityColors: Record<ActivityItem['type'], string> = {
  follow: 'text-blue-500 bg-blue-500/10',
  comment: 'text-purple-500 bg-purple-500/10',
  bid: 'text-yellow-500 bg-yellow-500/10',
  sale: 'text-green-500 bg-green-500/10',
  list: 'text-orange-500 bg-orange-500/10',
  like: 'text-red-500 bg-red-500/10',
};

export function ActivityFeed({ userId, className, maxItems = 20, showHeader = true }: ActivityFeedProps) {
  const { activities, loading } = useActivityFeed(userId);

  const displayedActivities = activities.slice(0, maxItems);

  const getActivityMessage = (activity: ActivityItem): string => {
    switch (activity.type) {
      case 'follow':
        return activity.target 
          ? `started following ${activity.target.name}` 
          : 'started following you';
      case 'comment':
        return `commented on ${activity.target?.name || 'an NFT'}`;
      case 'bid':
        return `placed a bid of ${activity.metadata?.amount?.toFixed(4) || '?'} ETH on ${activity.target?.name || 'an NFT'}`;
      case 'sale':
        return `sold ${activity.target?.name || 'an NFT'} for ${activity.metadata?.price?.toFixed(4) || '?'} ETH`;
      case 'list':
        return `listed ${activity.target?.name || 'an NFT'}`;
      case 'like':
        return `liked ${activity.target?.name || 'an NFT'}`;
      default:
        return 'performed an action';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Activity Feed
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className={cn(!showHeader && "pt-6")}>
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No activity yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {displayedActivities.map(activity => (
                <ActivityItemComponent key={activity.id} activity={activity} message={getActivityMessage(activity)} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

interface ActivityItemComponentProps {
  activity: ActivityItem;
  message: string;
}

function ActivityItemComponent({ activity, message }: ActivityItemComponentProps) {
  const Icon = activityIcons[activity.type];
  const colorClass = activityColors[activity.type];

  return (
    <div className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      {/* Activity Icon */}
      <div className={cn("p-2 rounded-full h-fit", colorClass)}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={activity.actor?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {activity.actor?.display_name?.[0] || activity.actor?.username?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium">
                {activity.actor?.display_name || activity.actor?.username || 'Someone'}
              </span>
              {activity.actor?.is_verified && (
                <BadgeCheck className="h-3.5 w-3.5 text-primary inline ml-1" />
              )}
              {' '}
              <span className="text-muted-foreground">{message}</span>
            </p>
            
            {activity.metadata?.content && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                "{activity.metadata.content}"
              </p>
            )}
            
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      {/* Target NFT thumbnail */}
      {activity.target?.image_url && (
        <Link 
          to={`/nft/${activity.target.id}`}
          className="relative group flex-shrink-0"
        >
          <img
            src={activity.target.image_url}
            alt={activity.target.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <ExternalLink className="h-4 w-4 text-white" />
          </div>
        </Link>
      )}
    </div>
  );
}
