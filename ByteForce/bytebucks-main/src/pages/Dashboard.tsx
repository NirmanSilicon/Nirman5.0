import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { OverviewSection } from '@/components/dashboard/OverviewSection';
import { PortfolioSection } from '@/components/dashboard/PortfolioSection';
import { AnalyticsSection } from '@/components/dashboard/AnalyticsSection';
import { WatchlistSection } from '@/components/dashboard/WatchlistSection';
import { TransactionHistory } from '@/components/dashboard/TransactionHistory';
import { YourUploadedNFTs } from '@/components/dashboard/YourUploadedNFTs';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  LayoutDashboard, 
  Image, 
  BarChart3, 
  Eye, 
  ArrowRightLeft,
  Bell,
  Check,
  Upload
} from 'lucide-react';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const { stats, ownedNFTs, transactions, loading } = useDashboardData();
  const { notifications, markAllAsRead, loading: notificationsLoading } = useNotifications();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <DashboardHeader />

          {/* Quick Stats */}
          <QuickStats stats={stats} loading={loading} />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/50 p-1 h-auto flex-wrap justify-start gap-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-background gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-background gap-2">
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-background gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="watchlist" className="data-[state=active]:bg-background gap-2">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Watchlist</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-background gap-2">
                <ArrowRightLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Transactions</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-background gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="your-nfts" className="data-[state=active]:bg-background gap-2">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Your NFTs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <OverviewSection transactions={transactions} loading={loading} />
            </TabsContent>

            <TabsContent value="portfolio">
              <PortfolioSection ownedNFTs={ownedNFTs} loading={loading} />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsSection stats={stats} ownedNFTs={ownedNFTs} />
            </TabsContent>

            <TabsContent value="watchlist">
              <WatchlistSection />
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionHistory transactions={transactions} loading={loading} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-semibold text-foreground">All Notifications</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsRead()}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              </div>

              {notificationsLoading ? (
                <Card className="p-8 glass text-center text-muted-foreground">
                  Loading notifications...
                </Card>
              ) : notifications.length === 0 ? (
                <Card className="p-12 glass text-center">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    No Notifications
                  </h3>
                  <p className="text-muted-foreground">
                    You're all caught up! New notifications will appear here.
                  </p>
                </Card>
              ) : (
                <Card className="glass overflow-hidden">
                  <div className="divide-y divide-border">
                    {notifications.map((notification) => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification}
                      />
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="your-nfts">
              <YourUploadedNFTs />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
