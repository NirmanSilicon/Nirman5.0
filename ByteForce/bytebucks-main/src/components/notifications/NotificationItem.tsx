import { formatDistanceToNow } from 'date-fns';
import { 
  Gavel, 
  ShoppingCart, 
  TrendingDown, 
  Heart, 
  UserPlus, 
  ThumbsUp,
  X,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications, type Notification } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  compact?: boolean;
}

const notificationIcons: Record<string, React.ElementType> = {
  bid_received: Gavel,
  bid_outbid: Gavel,
  sale: ShoppingCart,
  price_alert: TrendingDown,
  wishlist_update: Heart,
  follow: UserPlus,
  like: ThumbsUp,
};

const notificationColors: Record<string, string> = {
  bid_received: 'text-primary',
  bid_outbid: 'text-amber-500',
  sale: 'text-success',
  price_alert: 'text-destructive',
  wishlist_update: 'text-pink-500',
  follow: 'text-blue-500',
  like: 'text-rose-500',
};

export function NotificationItem({ notification, compact = false }: NotificationItemProps) {
  const { markAsRead, deleteNotification } = useNotifications();
  const Icon = notificationIcons[notification.type] || Circle;
  const iconColor = notificationColors[notification.type] || 'text-muted-foreground';

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer group",
        !notification.is_read && "bg-primary/5"
      )}
      onClick={handleClick}
    >
      <div className={cn("p-2 rounded-full bg-muted", iconColor)}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm line-clamp-1",
            notification.is_read ? "text-muted-foreground" : "text-foreground font-medium"
          )}>
            {notification.title}
          </p>
          {!notification.is_read && (
            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
          )}
        </div>
        
        {!compact && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
        )}
        
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          deleteNotification(notification.id);
        }}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
