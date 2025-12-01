import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Verified } from 'lucide-react';

export function DashboardHeader() {
  const { user } = useAuth();

  const getUserInitial = () => {
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    return user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
      <Avatar className="w-20 h-20 ring-2 ring-primary/20">
        <AvatarImage src={user?.user_metadata?.avatar_url} />
        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-serif">
          {getUserInitial()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Welcome back, {getDisplayName()}
          </h1>
          <Badge variant="outline" className="hidden sm:flex items-center gap-1">
            <Verified className="w-3 h-3 text-primary" />
            Collector
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {user?.email}
        </p>
      </div>
    </div>
  );
}
