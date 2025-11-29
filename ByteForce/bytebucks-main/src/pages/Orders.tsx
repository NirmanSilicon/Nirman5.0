import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import {
  Package,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  total_amount_usd: number | null;
  payment_method: string | null;
  created_at: string;
  items?: {
    id: string;
    nft_id: string;
    quantity: number;
    price_at_purchase: number;
    nfts?: {
      name: string;
      image_url: string;
    };
  }[];
}

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  pending: { label: 'Pending', icon: Clock, className: 'bg-warning/10 text-warning' },
  processing: { label: 'Processing', icon: RefreshCcw, className: 'bg-primary/10 text-primary' },
  completed: { label: 'Completed', icon: CheckCircle2, className: 'bg-success/10 text-success' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'bg-destructive/10 text-destructive' },
  refunded: { label: 'Refunded', icon: RefreshCcw, className: 'bg-muted text-muted-foreground' },
};

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      // Get profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            nft_id,
            quantity,
            price_at_purchase,
            nfts (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data?.map(order => ({
          ...order,
          items: order.order_items,
        })) || []);
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start exploring and collect your first NFT!
                </p>
                <Button onClick={() => navigate('/explore')}>
                  Explore NFTs
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <Card key={order.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Order Images */}
                        <div className="flex -space-x-4">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <img
                              key={item.id}
                              src={item.nfts?.image_url || '/placeholder.svg'}
                              alt={item.nfts?.name || 'NFT'}
                              className="w-16 h-16 rounded-lg border-2 border-background object-cover"
                              style={{ zIndex: 3 - idx }}
                            />
                          ))}
                          {(order.items?.length || 0) > 3 && (
                            <div className="w-16 h-16 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-sm font-medium">
                              +{(order.items?.length || 0) - 3}
                            </div>
                          )}
                        </div>

                        {/* Order Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                            <Badge className={cn('gap-1', status.className)}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {format(new Date(order.created_at), 'MMM d, yyyy • h:mm a')}
                          </p>
                          <p className="text-sm">
                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                            {' • '}
                            <span className="font-medium">{Number(order.total_amount).toFixed(4)}</span>
                            {order.total_amount_usd && (
                              <span className="text-muted-foreground"> (~${Number(order.total_amount_usd).toLocaleString()})</span>
                            )}
                          </p>
                        </div>

                        {/* Action */}
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
