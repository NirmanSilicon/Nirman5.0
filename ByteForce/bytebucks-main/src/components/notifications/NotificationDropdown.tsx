import { Link } from 'react-router-dom';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, markAllAsRead, loading } = useNotifications();
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 glass-strong rounded-xl border border-border shadow-elegant overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-serif font-semibold text-foreground">Notifications</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={() => markAllAsRead()}
        >
          <Check className="w-3 h-3 mr-1" />
          Mark all read
        </Button>
      </div>

      <ScrollArea className="max-h-80">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentNotifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification}
                compact
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t border-border bg-muted/30">
        <Link to="/dashboard?tab=notifications" onClick={onClose}>
          <Button variant="ghost" className="w-full text-sm" size="sm">
            View all notifications
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
